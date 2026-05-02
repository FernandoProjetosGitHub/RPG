import { useState } from 'react'
import Abilities from './components/Abilities.jsx'
import AttributesGrid from './components/AttributesGrid.jsx'
import BottomNav from './components/BottomNav.jsx'
import CharacterHeader from './components/CharacterHeader.jsx'
import DiceRoller from './components/DiceRoller.jsx'
import Inventory from './components/Inventory.jsx'
import QuickActions from './components/QuickActions.jsx'
import StatBar from './components/StatBar.jsx'

const character = {
  name: 'Kael',
  title: 'Lamina do Eclipse',
  level: 7,
  className: 'Guardiao Sombrio',
  portrait: 'K',
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

function getRollMessage(value) {
  if (value === 20) return 'Critico! Kael rasga a noite com precisao lendaria.'
  if (value === 1) return 'Falha critica. A sombra cobra seu preco.'
  if (value >= 12) return 'Sucesso. O destino se inclina a favor de Kael.'
  return 'Falha. A ameaca resiste por enquanto.'
}

export default function App() {
  const [health, setHealth] = useState(character.stats.health.current)
  const [roll, setRoll] = useState(null)

  const currentStats = {
    ...character.stats,
    health: { ...character.stats.health, current: health },
  }

  function adjustHealth(amount) {
    setHealth((current) =>
      Math.min(character.stats.health.max, Math.max(0, current + amount)),
    )
  }

  function rollD20() {
    const value = Math.floor(Math.random() * 20) + 1
    setRoll({ value, message: getRollMessage(value) })
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <CharacterHeader character={character} />

        <section className="panel stats-panel" aria-label="Recursos do personagem">
          <StatBar stat={currentStats.health} />
          <StatBar stat={currentStats.mana} />
          <StatBar stat={currentStats.energy} />
          <QuickActions onHeal={() => adjustHealth(5)} onDamage={() => adjustHealth(-5)} />
        </section>

        <AttributesGrid attributes={character.attributes} />
        <DiceRoller roll={roll} onRoll={rollD20} />
        <Inventory items={character.inventory} />
        <Abilities abilities={character.abilities} />
      </div>
      <BottomNav />
    </main>
  )
}
