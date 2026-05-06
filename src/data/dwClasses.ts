export type DwDice = "d4" | "d6" | "d8" | "d10";

export type DwSkill = {
  id: string;
  name: string;
  description: string;
};

export type DwRaceOption = {
  id: string;
  name: string;
  description: string;
};

export type DwClass = {
  id: string;
  name: string;
  description: string;
  baseHp: number;
  damageDice: DwDice;
  loadBase: number;
  mainAttribute?:
    | "forca"
    | "destreza"
    | "constituicao"
    | "inteligencia"
    | "sabedoria"
    | "carisma";
  usesSpells?: boolean;
  characteristics: string[];
  races: DwRaceOption[];
  startingSkills: DwSkill[];
};

export const dwClasses: DwClass[] = [
  {
    id: "barbaro",
    name: "Bárbaro",
    baseHp: 8,
    damageDice: "d10",
    loadBase: 8,
    mainAttribute: "forca",
    usesSpells: false,
    description:
      "Um forasteiro brutal, movido por apetites, força e presença selvagem.",
    characteristics: ["Muito resistente", "Dano alto", "Movido por apetites e glória"],
    races: [
      {
        id: "forasteiro",
        name: "Forasteiro",
        description:
          "Você pode ser elfo, anão, halfling ou humano, mas seu povo não é dessas redondezas. No início de cada sessão, o MJ pergunta algo sobre sua terra natal; se responder, marque XP.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "bardo",
    name: "Bardo",
    baseHp: 6,
    damageDice: "d6",
    loadBase: 9,
    mainAttribute: "carisma",
    usesSpells: false,
    description:
      "Um artista, diplomata e manipulador de histórias, magia e influência social.",
    characteristics: ["Suporte versátil", "Arte Arcana", "Conhecimento de Bardo"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Quando entrar em um local importante, você pode pedir ao MJ que conte um fato sobre a história daquele lugar.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando entrar pela primeira vez em um local civilizado, alguém que respeita a hospitalidade aos menestréis irá recebê-lo como convidado.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "clerigo",
    name: "Clérigo",
    baseHp: 8,
    damageDice: "d6",
    loadBase: 10,
    mainAttribute: "sabedoria",
    usesSpells: true,
    description:
      "Um servo divino que conjura feitiços concedidos por sua divindade.",
    characteristics: ["Feitiços divinos", "Cura", "Expulsar mortos-vivos"],
    races: [
      {
        id: "anao",
        name: "Anão",
        description:
          "Quando comungar, receba como uma oração uma versão especial de Palavras dos Silenciosos que só funciona com pedras.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Escolha um feitiço de mago: você pode recebê-lo e conjurá-lo como se fosse um feitiço de clérigo.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "druida",
    name: "Druida",
    baseHp: 6,
    damageDice: "d6",
    loadBase: 6,
    mainAttribute: "sabedoria",
    usesSpells: false,
    description:
      "Um guardião espiritual da natureza, capaz de assumir formas animais.",
    characteristics: ["Metamorfose", "Ligação com a terra", "Espíritos da natureza"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "A Grande Floresta é sempre considerada sua terra, além de quaisquer outras ligações.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Você sempre será capaz de assumir a forma de qualquer animal domesticado, além de suas opções normais.",
      },
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando montar acampamento, você e seus aliados curam +1d6.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "guerreiro",
    name: "Guerreiro",
    baseHp: 10,
    damageDice: "d10",
    loadBase: 12,
    mainAttribute: "forca",
    usesSpells: false,
    description:
      "Um combatente resistente, feito para segurar a linha de frente.",
    characteristics: ["Alta resistência", "Dano alto", "Arma assinatura"],
    races: [
      {
        id: "anao",
        name: "Anão",
        description:
          "Quando compartilhar uma bebida com alguém, você pode parlamentar usando CON no lugar de CAR.",
      },
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Escolha uma arma. Você sempre a trata como se tivesse o rótulo precisa.",
      },
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando desafiar o perigo usando seu tamanho pequeno como vantagem, receba +1.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Uma vez por batalha, você pode rolar novamente uma única rolagem de dano sua ou contra você.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "ladrao",
    name: "Ladrão",
    baseHp: 6,
    damageDice: "d8",
    loadBase: 9,
    mainAttribute: "destreza",
    usesSpells: false,
    description:
      "Um especialista em furtividade, venenos, armadilhas e ataques precisos.",
    characteristics: ["Furtividade", "Ataque surpresa", "Armadilhas e venenos"],
    races: [
      {
        id: "halfling",
        name: "Halfling",
        description:
          "Quando atacar com uma arma de longo alcance, cause dano +2.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando falar difícil ou discernir realidades com relação a atividades criminosas, receba +1.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "mago",
    name: "Mago",
    baseHp: 4,
    damageDice: "d4",
    loadBase: 7,
    mainAttribute: "inteligencia",
    usesSpells: true,
    description:
      "Um estudioso arcano que prepara e conjura feitiços através de grimório.",
    characteristics: ["Grimório", "Preparar feitiços", "Ritual"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Detectar Magia é considerado um truque para você.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Escolha um feitiço de clérigo. Você pode conjurá-lo como se fosse um feitiço de mago.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "paladino",
    name: "Paladino",
    baseHp: 10,
    damageDice: "d10",
    loadBase: 12,
    mainAttribute: "carisma",
    usesSpells: false,
    description:
      "Um guerreiro sagrado movido por juramentos, proteção e julgamento.",
    characteristics: ["Imposição de mãos", "Quest", "Autoridade divina"],
    races: [
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando rezar por orientação, mesmo que por um momento, e perguntar 'O que é maligno aqui?', o MJ lhe dirá honestamente.",
      },
    ],
    startingSkills: [],
  },
  {
    id: "ranger",
    name: "Ranger",
    baseHp: 8,
    damageDice: "d8",
    loadBase: 11,
    mainAttribute: "destreza",
    usesSpells: false,
    description:
      "Um caçador, rastreador e sobrevivente com ligação forte com a natureza.",
    characteristics: ["Rastrear", "Companheiro animal", "Caçador experiente"],
    races: [
      {
        id: "elfo",
        name: "Elfo",
        description:
          "Quando empreender uma jornada perigosa através de ermos, trate um resultado 6- como 7-9.",
      },
      {
        id: "humano",
        name: "Humano",
        description:
          "Quando montar acampamento em uma masmorra ou cidade, não precisa consumir ração.",
      },
    ],
    startingSkills: [],
  },
];