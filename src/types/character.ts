export type AttributeKey =
  | "forca"
  | "destreza"
  | "constituicao"
  | "inteligencia"
  | "sabedoria"
  | "carisma";

export type CharacterAttributes = Record<AttributeKey, number>;

export type Character = {
  name: string;
  classLocked: boolean;
  attributesLocked: boolean;
  classId: string;
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
  equippedItems: string[];
  skillPoints: number;
  selectedSkillIds: string[];
  skillsLocked: boolean;
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

export const initialCharacter: Character = {
  name: "Alyn",
  classLocked: false,
  attributesLocked: false,
  classId: "guerreiro",
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
  equippedItems: [],
  skillPoints: 2,
  selectedSkillIds: [],
  skillsLocked: false,
};