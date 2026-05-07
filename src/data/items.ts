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
    description: 'Arma leve e refinada, perfeita para ladroes e duelistas.',
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
