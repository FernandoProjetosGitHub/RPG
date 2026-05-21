import type { Character } from "../types/character";

const storageKey = "rpg-legends:table-state:v1";
const snapshotVersion = 1;

export type RpgTableSnapshot = {
  version: typeof snapshotVersion;
  characters: Character[];
  selectedPlayerIndex: number;
  savedAt: string;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadRpgTableSnapshot(): RpgTableSnapshot | null {
  if (!canUseLocalStorage()) return null;

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) return null;

    const parsedValue = JSON.parse(storedValue) as Partial<RpgTableSnapshot>;
    if (
      parsedValue.version !== snapshotVersion ||
      !Array.isArray(parsedValue.characters) ||
      typeof parsedValue.selectedPlayerIndex !== "number"
    ) {
      return null;
    }

    return parsedValue as RpgTableSnapshot;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveRpgTableSnapshot({
  characters,
  selectedPlayerIndex,
}: {
  characters: Character[];
  selectedPlayerIndex: number;
}) {
  if (!canUseLocalStorage()) return;

  const snapshot: RpgTableSnapshot = {
    version: snapshotVersion,
    characters,
    selectedPlayerIndex,
    savedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    // Sem quota local, a mesa continua funcionando em memoria.
  }
}

export function clearRpgTableSnapshot() {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(storageKey);
}
