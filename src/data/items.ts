import type { EquipmentSlot } from "../types/character";

export type ItemModifier = {
  attributes?: Partial<{
    forca: number
    destreza: number
    constituicao: number
    inteligencia: number
    sabedoria: number
    carisma: number
  }>
  hp?: number
  armor?: number
}

export type Item = {
  id: string
  name: string
  type: 'arma' | 'armadura' | 'capacete' | 'acessorio'
  slot: EquipmentSlot | "acessorio"
  weight: number
  tags: string[]
  description: string
  modifiers: ItemModifier
}

export type ConsumableEffect =
  | {
      type: "heal";
      amount: number;
      label: string;
    }
  | {
      type: "healHalf";
      label: string;
    }
  | {
      type: "fiction";
      label: string;
    };

export type ConsumableItem = {
  id: string;
  name: string;
  maxUses: number;
  weight: number;
  tags: string[];
  source: string;
  description: string;
  useText: string;
  restText?: string;
  effect: ConsumableEffect;
  canTargetAlly?: boolean;
  classIds?: string[];
};

export const items: Item[] = [
  {
    id: 'florete-duelo',
    name: 'Florete de duelo',
    type: 'arma',
    slot: 'arma',
    weight: 2,
    tags: ['corpo a corpo', 'preciso'],
    description: 'Arma elegante do bardo, feita para golpes precisos e duelos.',
    modifiers: {},
  },
  {
    id: 'arco-desgastado',
    name: 'Arco desgastado',
    type: 'arma',
    slot: 'arma',
    weight: 2,
    tags: ['proximo'],
    description: 'Arco simples para ataques a distancia quando a ficcao oferece linha de tiro.',
    modifiers: {},
  },
  {
    id: 'espada-curta',
    name: 'Espada curta',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo'],
    description: 'Arma leve e direta, comum entre aventureiros que precisam agir rapido.',
    modifiers: {
      attributes: {
        forca: 1,
      },
    },
  },
  {
    id: 'adaga',
    name: 'Adaga',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['mao'],
    description: 'Lamina curta, facil de esconder e util em combate muito proximo.',
    modifiers: {},
  },
  {
    id: 'machado',
    name: 'Machado',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo'],
    description: 'Arma brutal e simples, comum entre barbaros e aventureiros diretos.',
    modifiers: {},
  },
  {
    id: 'espada-duas-maos',
    name: 'Espada de duas maos',
    type: 'arma',
    slot: 'arma',
    weight: 2,
    tags: ['corpo a corpo', '+1 dano', 'duas maos'],
    description: 'Arma pesada que troca defesa e flexibilidade por impacto.',
    modifiers: {},
  },
  {
    id: 'martelo-batalha',
    name: 'Martelo de batalha',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo'],
    description: 'Arma clerical robusta, boa para punir armaduras e ossos.',
    modifiers: {},
  },
  {
    id: 'maca',
    name: 'Maca',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo'],
    description: 'Arma simples e cerimonial, comum entre servos de divindades.',
    modifiers: {},
  },
  {
    id: 'cajado',
    name: 'Cajado',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo', 'duas maos'],
    description: 'Apoio de viagem, foco ritual e arma simples para clerigos, druidas e magos.',
    modifiers: {
      attributes: {
        sabedoria: 1,
      },
    },
  },
  {
    id: 'chave-mecanica-longa',
    name: 'Chave mecanica longa',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo', 'duas maos', 'magitecnica'],
    description: 'Ferramenta pesada do engenheiro arcano, util para ajustes finos e pancadas nada sutis.',
    modifiers: {
      attributes: {
        inteligencia: 1,
      },
    },
  },
  {
    id: 'lanca',
    name: 'Lanca',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo', 'arremesso', 'proxima'],
    description: 'Arma versatil de alcance simples, util para caca e defesa.',
    modifiers: {},
  },
  {
    id: 'arma-assinatura',
    name: 'Arma assinatura',
    type: 'arma',
    slot: 'arma',
    weight: 2,
    tags: ['especial', 'corpo a corpo'],
    description: 'Arma unica do guerreiro, definida pela historia e propriedades escolhidas.',
    modifiers: {},
  },
  {
    id: 'florete',
    name: 'Florete',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo', 'preciso'],
    description: 'Arma leve e refinada, perfeita para ladinos e duelistas.',
    modifiers: {},
  },
  {
    id: 'alabarda',
    name: 'Alabarda',
    type: 'arma',
    slot: 'arma',
    weight: 2,
    tags: ['alcance', '+1 dano', 'duas maos'],
    description: 'Arma longa de paladino, poderosa quando ha espaco para manter distancia.',
    modifiers: {},
  },
  {
    id: 'espada-longa',
    name: 'Espada longa',
    type: 'arma',
    slot: 'arma',
    weight: 1,
    tags: ['corpo a corpo', '+1 dano'],
    description: 'Arma nobre e confiavel, adequada a juramentos e batalhas frontais.',
    modifiers: {},
  },
  {
    id: 'armadura-couro',
    name: 'Armadura de couro',
    type: 'armadura',
    slot: 'armadura',
    weight: 1,
    tags: ['armadura 1'],
    description: 'Protecao leve que nao pesa tanto em exploracao ou furtividade.',
    modifiers: {
      armor: 1,
    },
  },
  {
    id: 'armadura-improvisada',
    name: 'Armadura improvisada',
    type: 'armadura',
    slot: 'armadura',
    weight: 1,
    tags: ['armadura 1', 'magitecnica'],
    description: 'Placas, rebites e isolamento arcano montados para sobreviver ao proximo teste de campo.',
    modifiers: {
      armor: 1,
    },
  },
  {
    id: 'armadura-peles',
    name: 'Armadura de peles',
    type: 'armadura',
    slot: 'armadura',
    weight: 1,
    tags: ['armadura 1'],
    description: 'Defesa rustica de couro, pele e osso, comum entre druidas e ermos.',
    modifiers: {
      armor: 1,
    },
  },
  {
    id: 'cota-malha',
    name: 'Cota de malha',
    type: 'armadura',
    slot: 'armadura',
    weight: 1,
    tags: ['armadura 1'],
    description: 'Defesa confiavel para quem espera apanhar na linha de frente.',
    modifiers: {
      armor: 1,
    },
  },
  {
    id: 'armadura-escamas',
    name: 'Armadura de escamas',
    type: 'armadura',
    slot: 'armadura',
    weight: 3,
    tags: ['armadura 2'],
    description: 'Protecao pesada o suficiente para mudar a postura em combate.',
    modifiers: {
      armor: 2,
    },
  },
  {
    id: 'escudo',
    name: 'Escudo',
    type: 'acessorio',
    slot: 'acessorio',
    weight: 2,
    tags: ['armadura +1'],
    description: 'Protecao extra quando a ficcao permite manter guarda e posicao.',
    modifiers: {
      armor: 1,
    },
  },
  {
    id: 'amuleto-vital',
    name: 'Amuleto Vital',
    type: 'acessorio',
    slot: 'acessorio',
    weight: 0,
    tags: ['magico', 'vitalidade'],
    description: 'Talismã raro que reforca o corpo contra desgaste e ferimentos.',
    modifiers: {
      attributes: {
        constituicao: 2,
      },
    },
  },
  {
    id: 'anel-arcano',
    name: 'Anel Arcano',
    type: 'acessorio',
    slot: 'acessorio',
    weight: 0,
    tags: ['magico', 'foco'],
    description: 'Anel inscrito com sinais discretos, usado como foco de estudo arcano.',
    modifiers: {
      attributes: {
        inteligencia: 2,
      },
    },
  },
]

export const classStartingItemIds: Record<string, string[]> = {
  barbaro: ['machado', 'adaga'],
  bardo: ['florete-duelo', 'armadura-couro'],
  clerigo: ['martelo-batalha', 'cota-malha'],
  druida: ['cajado', 'armadura-peles'],
  'engenheiro-arcano': ['chave-mecanica-longa', 'armadura-improvisada', 'anel-arcano'],
  guerreiro: ['arma-assinatura', 'cota-malha'],
  ladrao: ['adaga', 'espada-curta', 'armadura-couro'],
  mago: ['cajado'],
  paladino: ['espada-longa', 'armadura-escamas'],
  ranger: ['arco-desgastado', 'espada-curta', 'armadura-couro'],
}

export const consumableItems: ConsumableItem[] = [
  {
    id: "racao-masmorra",
    name: "Racao de masmorra",
    maxUses: 5,
    weight: 1,
    tags: ["consumivel", "5 usos", "descanso"],
    source: "Equipamento comum das fichas de classe",
    description:
      "Comida compacta para exploracao. Em Dungeon World, acampar em lugar perigoso pede consumir racoes para conseguir descansar de verdade.",
    useText:
      "Consumir 1 uso durante descanso. O app cura metade dos PV maximos, limitado ao maximo atual.",
    restText:
      "Se o grupo nao tiver comida ou seguranca, o descanso nao deve apagar consequencias: o MJ pode separar o grupo, gastar recursos, mostrar perigo ou negar a cura.",
    effect: { type: "healHalf", label: "Descanso: cura metade dos PV maximos" },
    canTargetAlly: true,
  },
  {
    id: "bandagens",
    name: "Bandagens",
    maxUses: 3,
    weight: 0,
    tags: ["consumivel", "3 usos", "cura"],
    source: "Equipamento inicial de algumas classes",
    description:
      "Faixas, panos limpos e compressas simples. Sao uteis para estabilizar ferimentos apos a cena violenta, sem parecer milagre.",
    useText:
      "Consumir 1 uso para recuperar 4 PV quando houver tempo e seguranca para cuidar do ferimento.",
    effect: { type: "heal", amount: 4, label: "Recupera 4 PV" },
    canTargetAlly: true,
  },
  {
    id: "pocao-cura",
    name: "Pocao de cura",
    maxUses: 1,
    weight: 0,
    tags: ["consumivel", "cura", "magico"],
    source: "Opcao de equipamento do manual de classes",
    description:
      "Frasco pequeno de energia restauradora. E direto, valioso e costuma chamar atencao de aventureiros experientes.",
    useText: "Consumir a pocao para recuperar 10 PV imediatamente.",
    effect: { type: "heal", amount: 10, label: "Recupera 10 PV" },
    canTargetAlly: true,
  },
  {
    id: "antitoxina",
    name: "Antitoxina",
    maxUses: 3,
    weight: 0,
    tags: ["consumivel", "3 usos", "veneno"],
    source: "Equipamento de druida e exploradores",
    description:
      "Mistura amarga contra venenos comuns. Nao apaga automaticamente venenos poderosos, mas justifica resistir, reduzir ou ganhar tempo.",
    useText:
      "Consumir 1 uso para neutralizar veneno comum ou dar base ficcional para remover/amenizar uma condicao toxica.",
    effect: { type: "fiction", label: "Remove ou ameniza veneno comum" },
    canTargetAlly: true,
  },
  {
    id: "cataplasmas-ervas",
    name: "Cataplasmas e ervas",
    maxUses: 2,
    weight: 1,
    tags: ["consumivel", "2 usos", "cura", "natural"],
    source: "Equipamento de druida",
    description:
      "Ervas, resinas e compressas de campo. Funcionam melhor quando a cura vem de paciencia, natureza e conhecimento pratico.",
    useText:
      "Consumir 1 uso para recuperar 7 PV fora do imediatismo do combate.",
    effect: { type: "heal", amount: 7, label: "Recupera 7 PV" },
    canTargetAlly: true,
    classIds: ["druida"],
  },
  {
    id: "agua-benta",
    name: "Agua benta",
    maxUses: 1,
    weight: 0,
    tags: ["consumivel", "sagrado", "clerigo"],
    source: "Oracao Santificar do clerigo, adaptada para uso no app",
    description:
      "Agua, comida ou pequeno objeto santificado pela fe. Contra mortos-vivos, profanacao e corrupcao espiritual, seu valor e principalmente ficcional.",
    useText:
      "Consumir 1 uso para purificar algo pequeno, ferir/afastar morto-vivo na ficcao ou justificar uma vantagem sagrada.",
    effect: { type: "fiction", label: "Purifica e cria vantagem sagrada" },
    canTargetAlly: true,
    classIds: ["clerigo", "paladino"],
  },
  {
    id: "energia-dispositivo",
    name: "Carga de dispositivo",
    maxUses: 3,
    weight: 0,
    tags: ["consumivel", "magitecnico", "engenheiro"],
    source: "Preparar dispositivos do Engenheiro Arcano",
    description:
      "Baterias, cristais e pequenas bobinas instaveis que seguram uma ativacao emergencial.",
    useText:
      "Consumir 1 carga para justificar reativar, estabilizar ou alimentar um efeito magitecnico simples.",
    effect: { type: "fiction", label: "Alimenta um efeito magitecnico" },
    classIds: ["engenheiro-arcano"],
  },
];

export const classStartingConsumables: Record<string, Record<string, number>> = {
  barbaro: { "racao-masmorra": 5 },
  bardo: { "racao-masmorra": 5 },
  clerigo: { "racao-masmorra": 5, "agua-benta": 1 },
  druida: { "racao-masmorra": 5, "cataplasmas-ervas": 2, antitoxina: 3 },
  "engenheiro-arcano": { "racao-masmorra": 5, "energia-dispositivo": 3 },
  guerreiro: { "racao-masmorra": 5 },
  ladrao: { "racao-masmorra": 5 },
  mago: { "racao-masmorra": 5 },
  paladino: { "racao-masmorra": 5, "agua-benta": 1 },
  ranger: { "racao-masmorra": 5 },
};
