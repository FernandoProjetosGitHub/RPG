export type DwDice = 'd4' | 'd6' | 'd8' | 'd10'

export type DwSkill = {
  id: string
  name: string
  description: string
}

export type DwClass = {
  id: string
  name: string
  description: string
  baseHp: number
  damageDice: DwDice
  loadBase: number
  mainAttribute?: 'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma'
  usesSpells?: boolean
  characteristics: string[]
  startingSkills: DwSkill[]
}

export const dwClasses: DwClass[] = [
  {
    id: 'barbaro',
    name: 'Bárbaro',
    baseHp: 8,
    damageDice: 'd10',
    loadBase: 8,
    mainAttribute: 'forca',
    usesSpells: false,
    description: 'Um forasteiro brutal, movido por apetites, força e presença selvagem.',
    characteristics: ['Muito resistente', 'Dano alto', 'Movido por apetites e glória'],
    startingSkills: [],
  },
  {
    id: 'bardo',
    name: 'Bardo',
    baseHp: 6,
    damageDice: 'd6',
    loadBase: 9,
    mainAttribute: 'carisma',
    usesSpells: false,
    description: 'Um artista, diplomata e manipulador de histórias, magia e influência social.',
    characteristics: ['Suporte versátil', 'Arte Arcana', 'Conhecimento de Bardo'],
    startingSkills: [],
  },
  {
    id: 'clerigo',
    name: 'Clérigo',
    baseHp: 8,
    damageDice: 'd6',
    loadBase: 10,
    mainAttribute: 'sabedoria',
    usesSpells: true,
    description: 'Um servo divino que conjura feitiços concedidos por sua divindade.',
    characteristics: ['Feitiços divinos', 'Cura', 'Expulsar mortos-vivos'],
    startingSkills: [],
  },
  {
    id: 'druida',
    name: 'Druida',
    baseHp: 6,
    damageDice: 'd6',
    loadBase: 6,
    mainAttribute: 'sabedoria',
    usesSpells: false,
    description: 'Um guardião espiritual da natureza, capaz de assumir formas animais.',
    characteristics: ['Metamorfose', 'Ligação com a terra', 'Espíritos da natureza'],
    startingSkills: [],
  },
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    baseHp: 10,
    damageDice: 'd10',
    loadBase: 12,
    mainAttribute: 'forca',
    usesSpells: false,
    description: 'Um combatente resistente, feito para segurar a linha de frente.',
    characteristics: ['Alta resistência', 'Dano alto', 'Arma assinatura'],
    startingSkills: [],
  },
  {
    id: 'ladrao',
    name: 'Ladrão',
    baseHp: 6,
    damageDice: 'd8',
    loadBase: 9,
    mainAttribute: 'destreza',
    usesSpells: false,
    description: 'Um especialista em furtividade, venenos, armadilhas e ataques precisos.',
    characteristics: ['Furtividade', 'Ataque surpresa', 'Armadilhas e venenos'],
    startingSkills: [],
  },
  {
    id: 'mago',
    name: 'Mago',
    baseHp: 4,
    damageDice: 'd4',
    loadBase: 7,
    mainAttribute: 'inteligencia',
    usesSpells: true,
    description: 'Um estudioso arcano que prepara e conjura feitiços através de grimório.',
    characteristics: ['Grimório', 'Preparar feitiços', 'Ritual'],
    startingSkills: [],
  },
  {
    id: 'paladino',
    name: 'Paladino',
    baseHp: 10,
    damageDice: 'd10',
    loadBase: 12,
    mainAttribute: 'carisma',
    usesSpells: false,
    description: 'Um guerreiro sagrado movido por juramentos, proteção e julgamento.',
    characteristics: ['Imposição de mãos', 'Quest', 'Autoridade divina'],
    startingSkills: [],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    baseHp: 8,
    damageDice: 'd8',
    loadBase: 11,
    mainAttribute: 'destreza',
    usesSpells: false,
    description: 'Um caçador, rastreador e sobrevivente com ligação forte com a natureza.',
    characteristics: ['Rastrear', 'Companheiro animal', 'Caçador experiente'],
    startingSkills: [],
  },
]
