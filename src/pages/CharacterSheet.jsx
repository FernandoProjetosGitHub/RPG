import { useState } from 'react'
import Abilities from '../components/Abilities.jsx'
import AttributesGrid from '../components/AttributesGrid.jsx'
import BottomNav from '../components/BottomNav.jsx'
import CharacterHeader from '../components/CharacterHeader.jsx'
import DiceRoller from '../components/DiceRoller.jsx'
import Inventory from '../components/Inventory.jsx'
import QuickActions from '../components/QuickActions.jsx'
import StatBar from '../components/StatBar.jsx'

function getRollMessage(value, characterName) {
  if (value === 20) return `Critico! ${characterName} rasga a noite com precisao lendaria.`
  if (value === 1) return 'Falha critica. A sombra cobra seu preco.'
  if (value >= 12) return `Sucesso. O destino se inclina a favor de ${characterName}.`
  return 'Falha. A ameaca resiste por enquanto.'
}

export default function CharacterSheet({ character }) {
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
    setRoll({ value, message: getRollMessage(value, character.name) })
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
