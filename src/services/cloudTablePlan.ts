import type { Character } from "../types/character";
import type { TableAccessCredentials } from "./tableAccess";
import { supabase } from "./supabaseClient";

export type CloudTableState = {
  characters: Character[];
  selectedPlayerIndex: number;
  updatedAt: string;
};

export type CloudTableRecord = {
  credentials: TableAccessCredentials;
  state: CloudTableState;
};

type CloudTableRow = {
  table_id: string;
  login: string;
  adventure_id: string;
  adventure_title: string;
  state: CloudTableState;
  updated_at: string;
};

export type CloudTableRepository = {
  createTable: (
    credentials: TableAccessCredentials,
    state: CloudTableState,
  ) => Promise<void>;
  loadTable: (login: string, password: string) => Promise<CloudTableState>;
  saveTable: (
    credentials: TableAccessCredentials,
    state: CloudTableState,
  ) => Promise<void>;
};

export const cloudTableEnvironment = {
  provider: "supabase",
  requiredEnv: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  schemaPath: "database/rpg_tables.sql",
} as const;

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase nao configurado. Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

function normalizeCloudRow(row: CloudTableRow, password: string): CloudTableRecord {
  return {
    credentials: {
      tableId: row.table_id,
      login: row.login,
      password,
      adventureId: row.adventure_id,
      adventureTitle: row.adventure_title,
      createdAt: row.updated_at,
      lastSyncedAt: row.updated_at,
      syncMode: "supabase",
    },
    state: {
      characters: row.state.characters,
      selectedPlayerIndex: row.state.selectedPlayerIndex,
      updatedAt: row.updated_at,
    },
  };
}

function firstRow(data: CloudTableRow[] | CloudTableRow | null) {
  return Array.isArray(data) ? data[0] : data;
}

export async function createCloudTable(
  credentials: TableAccessCredentials,
  state: CloudTableState,
): Promise<CloudTableRecord> {
  const client = requireSupabase();
  const { data, error } = await client.rpc("rpg_create_table", {
    p_adventure_id: credentials.adventureId,
    p_adventure_title: credentials.adventureTitle,
    p_login: credentials.login,
    p_password: credentials.password,
    p_state: state,
  });

  if (error) throw error;
  const row = firstRow(data as CloudTableRow[] | CloudTableRow | null);
  if (!row) throw new Error("Supabase nao retornou a mesa criada.");

  return normalizeCloudRow(row, credentials.password);
}

export async function loadCloudTable(
  login: string,
  password: string,
): Promise<CloudTableRecord> {
  const client = requireSupabase();
  const { data, error } = await client.rpc("rpg_load_table", {
    p_login: login,
    p_password: password,
  });

  if (error) throw error;
  const row = firstRow(data as CloudTableRow[] | CloudTableRow | null);
  if (!row) throw new Error("Login ou senha da mesa invalidos.");

  return normalizeCloudRow(row, password);
}

export async function saveCloudTable(
  credentials: TableAccessCredentials,
  state: CloudTableState,
): Promise<CloudTableRecord> {
  const client = requireSupabase();
  const { data, error } = await client.rpc("rpg_save_table", {
    p_login: credentials.login,
    p_password: credentials.password,
    p_state: state,
  });

  if (error) throw error;
  const row = firstRow(data as CloudTableRow[] | CloudTableRow | null);
  if (!row) throw new Error("Nao foi possivel salvar a mesa no Supabase.");

  return normalizeCloudRow(row, credentials.password);
}
