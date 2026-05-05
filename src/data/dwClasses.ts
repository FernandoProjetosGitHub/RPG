export type DwSkill = {
  id: string
  name: string
  description: string
}

export type DwClass = {
  id: string
  name: string
  description: string
  characteristics: string[]
  startingSkills: DwSkill[]
}

export const dwClasses: DwClass[] = [
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    description:
      'Um combatente resistente, feito para segurar a linha de frente e resolver problemas com aço, coragem e presença.',
    characteristics: [
      'Alta resistência em combate',
      'Bom uso de armas e armaduras',
      'Funciona bem protegendo aliados',
    ],
    startingSkills: [
      {
        id: 'arma-assinatura',
        name: 'Arma Assinatura',
        description:
          'Você possui uma arma especial, conhecida por sua história, forma ou reputação.',
      },
      {
        id: 'dobrar-barras',
        name: 'Dobrar Barras, Erguer Portões',
        description:
          'Quando usa força bruta para destruir ou mover algo, o resultado altera a cena de forma marcante.',
      },
      {
        id: 'aparar-golpe',
        name: 'Aparar o Golpe',
        description:
          'Quando protege alguém ou segura uma investida, você reduz o impacto do perigo.',
      },
    ],
  },
  {
    id: 'mago',
    name: 'Mago',
    description:
      'Um estudioso arcano que prepara magias, interpreta padrões impossíveis e resolve problemas mexendo com forças perigosas.',
    characteristics: [
      'Usa grimório e preparo',
      'Tem acesso a magias versáteis',
      'É poderoso, mas vulnerável sob pressão',
    ],
    startingSkills: [
      {
        id: 'grimorio',
        name: 'Grimório',
        description:
          'Você possui um livro de magias e registra nele fórmulas, rituais e descobertas.',
      },
      {
        id: 'preparar-magias',
        name: 'Preparar Magias',
        description:
          'Após descanso e estudo, você escolhe quais magias estarão prontas para uso.',
      },
      {
        id: 'ritual',
        name: 'Ritual',
        description:
          'Quando tem tempo, lugar adequado e recursos, pode realizar efeitos mágicos maiores.',
      },
    ],
  },
]
