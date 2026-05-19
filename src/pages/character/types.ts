import type { Dispatch, SetStateAction } from "react";
import type { DwRollOutcomeKey } from "../../data/dwRollOutcomes";
import type { consumableItems, items } from "../../data/items";
import type { DwSpell } from "../../data/spells";
import type {
  AttributeKey,
  Character,
  PlayerProfileSummary,
} from "../../types/character";

export type AppTab = "personagem" | "descricao" | "skills" | "inventario" | "combate";

export type CharacterAppPageProps = {
  mode: "player" | "master";
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onBackToMaster?: () => void;
  playerProfiles?: PlayerProfileSummary[];
  selectedPlayerIndex?: number;
  onSelectPlayer?: (index: number) => void;
  onApplyConsumableToPlayer?: (consumableId: string, targetIndex: number) => void;
};

export type CombatAction = {
  id: string;
  name: string;
  type: "attack" | "skill" | "spell";
  dice: string;
  attribute: AttributeKey;
  detail: string;
  usesPerRest: number | null;
};

export type SheetConsumable = (typeof consumableItems)[number];
export type SheetItem = (typeof items)[number];

export type CombatRoll = {
  actionName: string;
  dice: string;
  attribute: AttributeKey;
  attributeValue: number;
  rolls: number[];
  diceTotal: number;
  total: number;
  isCritical: boolean;
  isCriticalFailure: boolean;
};

export type SpellCastRoll = {
  spell: DwSpell;
  rolls: number[];
  modifier: number;
  penalty: number;
  total: number;
  outcome: DwRollOutcomeKey;
};

export type MoveRoll = {
  moveName: string;
  attribute: AttributeKey;
  attributeValue: number;
  modifier: number;
  rolls: number[];
  total: number;
  outcome: DwRollOutcomeKey;
};
