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
  type: 'arma' | 'armadura' | 'acessorio'
  modifiers: ItemModifier
}

export const items: Item[] = [
  {
    id: 'amuleto-vital',
    name: 'Amuleto Vital',
    type: 'acessorio',
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
    modifiers: {
      attributes: {
        inteligencia: 2,
      },
    },
  },
]