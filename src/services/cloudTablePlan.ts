import type { Character } from "../types/character";
import type { TableAccessCredentials } from "./tableAccess";

export type CloudTableState = {
  characters: Character[];
  selectedPlayerIndex: number;
  updatedAt: string;
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
