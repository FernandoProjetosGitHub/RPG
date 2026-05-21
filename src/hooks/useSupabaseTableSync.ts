import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Character } from "../types/character";
import {
  createCloudTable,
  loadCloudTable,
  saveCloudTable,
  type CloudTableState,
} from "../services/cloudTablePlan";
import { isSupabaseConfigured, supabase } from "../services/supabaseClient";
import {
  clearTableAccessCredentials,
  createTableAccessCredentials,
  loadTableAccessCredentials,
  saveTableAccessCredentials,
  type TableAccessCredentials,
} from "../services/tableAccess";

export type TableSyncStatus =
  | "local"
  | "config-missing"
  | "connecting"
  | "online"
  | "saving"
  | "error";

type AdventureInfo = {
  id: string;
  title: string;
};

type UseSupabaseTableSyncArgs = {
  characters: Character[];
  selectedPlayerIndex: number;
  replaceTableState: (state: CloudTableState) => void;
};

function randomClientId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function serializeComparableState(state: Pick<CloudTableState, "characters" | "selectedPlayerIndex">) {
  return JSON.stringify({
    characters: state.characters,
    selectedPlayerIndex: state.selectedPlayerIndex,
  });
}

export function useSupabaseTableSync({
  characters,
  selectedPlayerIndex,
  replaceTableState,
}: UseSupabaseTableSyncArgs) {
  const [credentials, setCredentials] = useState<TableAccessCredentials | null>(
    () => {
      const storedCredentials = loadTableAccessCredentials();
      return storedCredentials?.syncMode === "supabase" ? storedCredentials : null;
    },
  );
  const [status, setStatus] = useState<TableSyncStatus>(() => {
    const storedCredentials = loadTableAccessCredentials();
    if (!storedCredentials || storedCredentials.syncMode !== "supabase") return "local";
    return isSupabaseConfigured ? "connecting" : "config-missing";
  });
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    () => {
      const storedCredentials = loadTableAccessCredentials();
      return storedCredentials?.syncMode === "supabase"
        ? (storedCredentials.lastSyncedAt ?? null)
        : null;
    },
  );

  const clientIdRef = useRef(randomClientId());
  const loadedTableRef = useRef<string | null>(null);
  const lastSavedStateRef = useRef("");
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>["channel"]> | null>(null);

  const buildState = useCallback(
    (): CloudTableState => ({
      characters,
      selectedPlayerIndex,
      updatedAt: new Date().toISOString(),
    }),
    [characters, selectedPlayerIndex],
  );

  const activeCredentials = useMemo(
    () => credentials?.syncMode === "supabase" ? credentials : null,
    [credentials],
  );

  const applyRemoteState = useCallback((state: CloudTableState) => {
    lastSavedStateRef.current = serializeComparableState(state);
    replaceTableState(state);
    setLastSyncedAt(state.updatedAt);
  }, [replaceTableState]);

  const storeCredentials = useCallback((nextCredentials: TableAccessCredentials) => {
    saveTableAccessCredentials(nextCredentials);
    setCredentials(nextCredentials);
    setLastSyncedAt(nextCredentials.lastSyncedAt ?? null);
  }, []);

  const createOnlineTable = useCallback(async (adventure: AdventureInfo) => {
    if (!isSupabaseConfigured) {
      setStatus("config-missing");
      setError("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local.");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const localCredentials = createTableAccessCredentials({
        adventureId: adventure.id,
        adventureTitle: adventure.title,
      });
      const record = await createCloudTable(localCredentials, buildState());

      lastSavedStateRef.current = serializeComparableState(record.state);
      storeCredentials(record.credentials);
      setStatus("online");
    } catch (currentError) {
      setStatus("error");
      setError(currentError instanceof Error ? currentError.message : "Falha ao criar mesa online.");
    }
  }, [buildState, storeCredentials]);

  const joinOnlineTable = useCallback(async (login: string, password: string) => {
    if (!isSupabaseConfigured) {
      setStatus("config-missing");
      setError("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local.");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const record = await loadCloudTable(login.trim(), password.trim());

      applyRemoteState(record.state);
      storeCredentials(record.credentials);
      setStatus("online");
    } catch (currentError) {
      setStatus("error");
      setError(currentError instanceof Error ? currentError.message : "Falha ao entrar na mesa online.");
    }
  }, [applyRemoteState, storeCredentials]);

  const disconnectOnlineTable = useCallback(() => {
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    clearTableAccessCredentials();
    setCredentials(null);
    setLastSyncedAt(null);
    setError(null);
    setStatus("local");
    loadedTableRef.current = null;
    lastSavedStateRef.current = serializeComparableState({
      characters,
      selectedPlayerIndex,
    });
  }, [characters, selectedPlayerIndex]);

  useEffect(() => {
    if (!activeCredentials) return;
    if (!isSupabaseConfigured) {
      setStatus("config-missing");
      return;
    }
    if (loadedTableRef.current === activeCredentials.tableId) return;

    loadedTableRef.current = activeCredentials.tableId;
    setStatus("connecting");

    loadCloudTable(activeCredentials.login, activeCredentials.password)
      .then((record) => {
        applyRemoteState(record.state);
        storeCredentials(record.credentials);
        setStatus("online");
        setError(null);
      })
      .catch((currentError) => {
        setStatus("error");
        setError(currentError instanceof Error ? currentError.message : "Falha ao carregar mesa online.");
      });
  }, [activeCredentials, applyRemoteState, storeCredentials]);

  useEffect(() => {
    if (!activeCredentials || !supabase || !isSupabaseConfigured) return;

    const channel = supabase.channel(`rpg-table:${activeCredentials.tableId}`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on("broadcast", { event: "table-state" }, ({ payload }) => {
        const remotePayload = payload as {
          clientId?: string;
          state?: CloudTableState;
        };

        if (remotePayload.clientId === clientIdRef.current || !remotePayload.state) return;
        applyRemoteState(remotePayload.state);
        setStatus("online");
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [activeCredentials, applyRemoteState]);

  useEffect(() => {
    if (!activeCredentials || !isSupabaseConfigured) return;

    const comparableState = serializeComparableState({
      characters,
      selectedPlayerIndex,
    });

    if (comparableState === lastSavedStateRef.current) return;

    const timeout = window.setTimeout(() => {
      const nextState = buildState();
      setStatus("saving");

      saveCloudTable(activeCredentials, nextState)
        .then((record) => {
          lastSavedStateRef.current = serializeComparableState(record.state);
          storeCredentials(record.credentials);
          setStatus("online");
          setError(null);
          channelRef.current?.send({
            type: "broadcast",
            event: "table-state",
            payload: {
              clientId: clientIdRef.current,
              state: record.state,
            },
          });
        })
        .catch((currentError) => {
          setStatus("error");
          setError(currentError instanceof Error ? currentError.message : "Falha ao salvar mesa online.");
        });
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [activeCredentials, buildState, characters, selectedPlayerIndex, storeCredentials]);

  return {
    credentials,
    status,
    error,
    lastSyncedAt,
    isConfigured: isSupabaseConfigured,
    createOnlineTable,
    joinOnlineTable,
    disconnectOnlineTable,
  };
}
