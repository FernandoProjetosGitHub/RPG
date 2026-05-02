const mockCharacter = {
  name: 'Kael',
  title: 'Lamina do Eclipse',
  race: 'Humano marcado',
  alignment: 'Neutro sombrio',
  level: 7,
  className: 'Guardiao Sombrio',
  portrait: 'K',
  xp: {
    current: 1280,
    total: 2000,
  },
  stats: {
    health: { label: 'Vida', current: 84, max: 112, tone: 'health' },
    mana: { label: 'Mana', current: 46, max: 70, tone: 'mana' },
    energy: { label: 'Energia', current: 31, max: 45, tone: 'energy' },
  },
  attributes: [
    { label: 'FOR', value: 16 },
    { label: 'DES', value: 13 },
    { label: 'CON', value: 15 },
    { label: 'INT', value: 10 },
    { label: 'SAB', value: 12 },
    { label: 'CAR', value: 9 },
  ],
  inventory: [
    { name: 'Espada de obsidiana', detail: '+2 dano sombrio' },
    { name: 'Capa rasgada', detail: 'Furtividade +1' },
    { name: 'Pocao rubra', detail: 'Cura 2D6' },
    { name: 'Selo antigo', detail: 'Chave ritual' },
  ],
  abilities: [
    { name: 'Golpe do Eclipse', cost: '8 mana', detail: 'Ataque pesado contra um alvo.' },
    { name: 'Passo Umbral', cost: '5 energia', detail: 'Move sem provocar ataques.' },
    { name: 'Juramento da Cinza', cost: '1 cena', detail: 'Reduz dano recebido pela metade.' },
  ],
}

export default mockCharacter
