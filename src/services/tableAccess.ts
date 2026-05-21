const storageKey = "rpg-legends:table-access:v1";

export type TableAccessCredentials = {
  tableId: string;
  login: string;
  password: string;
  adventureId: string;
  adventureTitle: string;
  createdAt: string;
  lastSyncedAt?: string;
  syncMode: "local-ready" | "supabase";
};

const syllables = [
  "runa",
  "ferro",
  "brasa",
  "noite",
  "corvo",
  "cripta",
  "altar",
  "lume",
  "vigia",
  "selo",
];

function randomToken(length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => (byte % 36).toString(36)).join("");
}

function randomPassword() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);

  return bytes
    .map((byte) => syllables[byte % syllables.length])
    .join("-");
}

export function createTableAccessCredentials({
  adventureId,
  adventureTitle,
}: {
  adventureId: string;
  adventureTitle: string;
}): TableAccessCredentials {
  const tableId = randomToken(10);

  return {
    tableId,
    login: `mesa-${randomToken(5)}`,
    password: randomPassword(),
    adventureId,
    adventureTitle,
    createdAt: new Date().toISOString(),
    syncMode: "local-ready",
  };
}

export function loadTableAccessCredentials(): TableAccessCredentials | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    return storedValue ? (JSON.parse(storedValue) as TableAccessCredentials) : null;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveTableAccessCredentials(credentials: TableAccessCredentials) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(credentials));
}

export function mergeTableAccessCredentials(
  currentCredentials: TableAccessCredentials,
  updates: Partial<TableAccessCredentials>,
): TableAccessCredentials {
  const nextCredentials = {
    ...currentCredentials,
    ...updates,
  };

  saveTableAccessCredentials(nextCredentials);
  return nextCredentials;
}

export function clearTableAccessCredentials() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
}
