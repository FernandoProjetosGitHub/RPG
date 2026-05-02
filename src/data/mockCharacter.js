const mockCharacter = {
  name: 'Alyn',
  title: 'Espada juramentada do Norte',
  race: 'Primeiros Homens',
  alignment: 'Honra cautelosa',
  house: 'Stark',
  loyalty: 'Casa Stark',
  reputation: 'Confiavel entre patrulheiros',
  level: 7,
  className: 'Cavaleiro juramentado',
  portrait: 'A',
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
    { label: 'Força', value: 16 },
    { label: 'Destreza', value: 13 },
    { label: 'Resistência', value: 15 },
    { label: 'Astúcia', value: 12 },
    { label: 'Influência', value: 10 },
    { label: 'Lealdade', value: 14 },
  ],
  inventory: [
    { name: 'Espada longa do Norte', detail: 'Aco bem cuidado' },
    { name: 'Manto de la cinza', detail: 'Protege contra frio e olhares' },
    { name: 'Carta selada', detail: 'Ordem de patrulha' },
    { name: 'Punhal de osso', detail: 'Lamina reserva' },
  ],
  abilities: [
    {
      name: 'Juramento aos Deuses Antigos',
      cost: '1 cena',
      detail: 'Recebe vantagem em rastrear mentiras, juramentos quebrados e sinais na natureza.',
    },
    {
      name: 'Sentenca do Pai',
      cost: '1 julgamento',
      detail: 'Impoe autoridade em uma audiencia, duelo legal ou conselho de lordes.',
    },
    {
      name: 'Preco do Deus Afogado',
      cost: '1 risco',
      detail: 'Resiste a afogamento, exaustao maritima ou panico durante tempestades.',
    },
  ],
}

export default mockCharacter
