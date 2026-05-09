export type AttributeKey =
  | "forca"
  | "destreza"
  | "constituicao"
  | "inteligencia"
  | "sabedoria"
  | "carisma";

export type CharacterAttributes = Record<AttributeKey, number>;

export type EquipmentSlot =
  | "arma"
  | "armaSecundaria"
  | "armadura"
  | "capacete"
  | "acessorio1"
  | "acessorio2";

export type Character = {
  name: string;
  nameLocked: boolean;
  level: number;
  xp: number;
  classId: string;
  classLocked: boolean;

  raceId: string;
  raceLocked: boolean;

  creationChoices: Record<string, string>;
  creationChoicesLocked: boolean;
  bondsLocked: boolean;

  attributesLocked: boolean;

  hp: {
    current: number;
  };

  attributes: CharacterAttributes;

  modifiers: {
    attributes: CharacterAttributes;
    hp: number;
    armor: number;
  };

  availableItems: string[];

  equipment: {
    arma: string | null;
    armaSecundaria: string | null;
    armadura: string | null;
    capacete: string | null;
    acessorio1: string | null;
    acessorio2: string | null;
  };

  skillPoints: number;
  selectedSkillIds: string[];
  skillsLocked: boolean;

  preparedSpellIds: string[];
  exhaustedSpellIds: string[];
  spellCastPenalty: number;
  spellsLocked: boolean;
};

export type PlayerProfileSummary = {
  index: number;
  label: string;
  name: string;
  className: string;
};

export const attributeLabels: Record<AttributeKey, string> = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

export const attributeKeys: AttributeKey[] = [
  "forca",
  "destreza",
  "constituicao",
  "inteligencia",
  "sabedoria",
  "carisma",
];

export const attributePool = [16, 15, 13, 12, 9, 8];

export function getXpToNextLevel(level: number) {
  return level + 7;
}

export const initialCharacter: Character = {
  name: "",
  nameLocked: false,
  level: 1,
  xp: 0,
  classId: "",
  classLocked: false,

  raceId: "",
  raceLocked: false,

  creationChoices: {},
  creationChoicesLocked: false,
  bondsLocked: false,

  attributesLocked: false,

  hp: {
    current: 0,
  },

  attributes: {
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    sabedoria: 0,
    carisma: 0,
  },

  modifiers: {
    attributes: {
      forca: 0,
      destreza: 0,
      constituicao: 0,
      inteligencia: 0,
      sabedoria: 0,
      carisma: 0,
    },

    hp: 0,
    armor: 0,
  },

  availableItems: [],

  equipment: {
    arma: null,
    armaSecundaria: null,
    armadura: null,
    capacete: null,
    acessorio1: null,
    acessorio2: null,
  },

  skillPoints: 2,

  selectedSkillIds: [],

  skillsLocked: false,

  preparedSpellIds: [],
  exhaustedSpellIds: [],
  spellCastPenalty: 0,

  spellsLocked: false,
};
