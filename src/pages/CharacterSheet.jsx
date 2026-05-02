import { useState } from 'react'
import Abilities from '../components/Abilities.jsx'
import AttributesGrid from '../components/AttributesGrid.jsx'
import BottomNav from '../components/BottomNav.jsx'
import CharacterHeader from '../components/CharacterHeader.jsx'
import DiceRoller from '../components/DiceRoller.jsx'
import Inventory from '../components/Inventory.jsx'
import QuickActions from '../components/QuickActions.jsx'
import StatBar from '../components/StatBar.jsx'
import { nobleHouses } from '../data/gotOptions.js'

const STORAGE_KEY = 'rpg-legends-character-sheet'

function getRollMessage(value, characterName) {
  if (value === 20) return `Critico! ${characterName} rasga a noite com precisao lendaria.`
  if (value === 1) return 'Falha critica. A sombra cobra seu preco.'
  if (value >= 12) return `Sucesso. O destino se inclina a favor de ${characterName}.`
  return 'Falha. A ameaca resiste por enquanto.'
}

function toNumber(value) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function mergeStoredCharacter(defaultCharacter, storedCharacter) {
  const storedAttributes = storedCharacter.attributes ?? []

  return {
    ...defaultCharacter,
    ...storedCharacter,
    house: storedCharacter.house ?? defaultCharacter.house,
    reputation: storedCharacter.reputation ?? defaultCharacter.reputation,
    loyalty: storedCharacter.loyalty ?? defaultCharacter.loyalty,
    stats: {
      health: {
        ...defaultCharacter.stats.health,
        ...storedCharacter.stats?.health,
      },
      mana: {
        ...defaultCharacter.stats.mana,
        ...storedCharacter.stats?.mana,
      },
      energy: {
        ...defaultCharacter.stats.energy,
        ...storedCharacter.stats?.energy,
      },
    },
    attributes: defaultCharacter.attributes.map((attribute, index) => ({
      ...attribute,
      value: toNumber(storedAttributes[index]?.value ?? attribute.value),
    })),
    abilities: defaultCharacter.abilities,
  }
}

function getStoredCharacter(defaultCharacter) {
  try {
    const storedCharacter = localStorage.getItem(STORAGE_KEY)
    return storedCharacter
      ? normalizeCharacter(mergeStoredCharacter(defaultCharacter, JSON.parse(storedCharacter)))
      : defaultCharacter
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return defaultCharacter
  }
}

function persistCharacter(character) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
}

function normalizeCharacter(character) {
  const healthMax = Math.max(1, character.stats.health.max)
  const manaMax = Math.max(1, character.stats.mana.max)
  const energyMax = Math.max(1, character.stats.energy.max)

  return {
    ...character,
    portrait: character.name.trim().slice(0, 1).toUpperCase() || 'K',
    level: Math.max(1, character.level),
    stats: {
      ...character.stats,
      health: {
        ...character.stats.health,
        current: Math.min(character.stats.health.current, healthMax),
        max: healthMax,
      },
      mana: {
        ...character.stats.mana,
        current: Math.min(character.stats.mana.current, manaMax),
        max: manaMax,
      },
      energy: {
        ...character.stats.energy,
        current: Math.min(character.stats.energy.current, energyMax),
        max: energyMax,
      },
    },
    attributes: character.attributes.map((attribute) => ({
      ...attribute,
      value: Math.max(0, attribute.value),
    })),
  }
}

export default function CharacterSheet({ character }) {
  const [sheetCharacter, setSheetCharacter] = useState(() => getStoredCharacter(character))
  const [draftCharacter, setDraftCharacter] = useState(sheetCharacter)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState('player')
  const [health, setHealth] = useState(sheetCharacter.stats.health.current)
  const [mana, setMana] = useState(sheetCharacter.stats.mana.current)
  const [conditionInput, setConditionInput] = useState('')
  const [conditions, setConditions] = useState([])
  const [secretNotes, setSecretNotes] = useState('')
  const [roll, setRoll] = useState(null)

  const currentStats = {
    ...sheetCharacter.stats,
    health: { ...sheetCharacter.stats.health, current: health },
    mana: { ...sheetCharacter.stats.mana, current: mana },
  }

  const isMasterMode = viewMode === 'master'

  function adjustHealth(amount) {
    setHealth((current) =>
      Math.min(sheetCharacter.stats.health.max, Math.max(0, current + amount)),
    )
  }

  function adjustMana(amount) {
    setMana((current) =>
      Math.min(sheetCharacter.stats.mana.max, Math.max(0, current + amount)),
    )
  }

  function rollD20() {
    const value = Math.floor(Math.random() * 20) + 1
    setRoll({ value, message: getRollMessage(value, sheetCharacter.name) })
  }

  function startEditing() {
    setDraftCharacter(sheetCharacter)
    setIsEditing(true)
  }

  function updateDraftField(field, value) {
    setDraftCharacter((current) => ({ ...current, [field]: value }))
  }

  function updateDraftNumber(field, value) {
    updateDraftField(field, toNumber(value))
  }

  function updateDraftAttribute(label, value) {
    setDraftCharacter((current) => ({
      ...current,
      attributes: current.attributes.map((attribute) =>
        attribute.label === label ? { ...attribute, value: toNumber(value) } : attribute,
      ),
    }))
  }

  function updateDraftStatMax(statKey, value) {
    setDraftCharacter((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [statKey]: {
          ...current.stats[statKey],
          max: toNumber(value),
        },
      },
    }))
  }

  function saveCharacter() {
    const normalizedCharacter = normalizeCharacter(draftCharacter)

    persistCharacter(normalizedCharacter)
    setSheetCharacter(normalizedCharacter)
    setHealth((current) => Math.min(current, normalizedCharacter.stats.health.max))
    setMana((current) => Math.min(current, normalizedCharacter.stats.mana.max))
    setIsEditing(false)
  }

  function addCondition(event) {
    event.preventDefault()
    const normalizedCondition = conditionInput.trim()

    if (!normalizedCondition) return

    setConditions((current) =>
      current.includes(normalizedCondition) ? current : [...current, normalizedCondition],
    )
    setConditionInput('')
  }

  function restoreDefaultCharacter() {
    localStorage.removeItem(STORAGE_KEY)
    setSheetCharacter(character)
    setDraftCharacter(character)
    setHealth(character.stats.health.current)
    setMana(character.stats.mana.current)
    setConditionInput('')
    setConditions([])
    setSecretNotes('')
    setRoll(null)
    setIsEditing(false)
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <section className="panel mode-switcher" aria-label="Modo de visualizacao">
          <button
            className={viewMode === 'player' ? 'is-active' : ''}
            type="button"
            onClick={() => setViewMode('player')}
          >
            Modo Jogador
          </button>
          <button
            className={viewMode === 'master' ? 'is-active' : ''}
            type="button"
            onClick={() => setViewMode('master')}
          >
            Modo Mestre
          </button>
        </section>

        <CharacterHeader character={sheetCharacter} />

        <section className="panel sheet-actions" aria-label="Edicao da ficha">
          <div className="section-heading">
            <span>Ficha</span>
            <strong>{isEditing ? 'Editando' : 'Pronta'}</strong>
          </div>
          {isEditing ? (
            <form className="edit-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Nome
                <input
                  type="text"
                  value={draftCharacter.name}
                  onChange={(event) => updateDraftField('name', event.target.value)}
                />
              </label>
              <label>
                Titulo
                <input
                  type="text"
                  value={draftCharacter.title}
                  onChange={(event) => updateDraftField('title', event.target.value)}
                />
              </label>
              <label>
                Raca
                <input
                  type="text"
                  value={draftCharacter.race}
                  onChange={(event) => updateDraftField('race', event.target.value)}
                />
              </label>
              <label>
                Casa
                <select
                  value={draftCharacter.house}
                  onChange={(event) => updateDraftField('house', event.target.value)}
                >
                  {nobleHouses.map((house) => (
                    <option value={house} key={house}>
                      {house}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Classe
                <input
                  type="text"
                  value={draftCharacter.className}
                  onChange={(event) => updateDraftField('className', event.target.value)}
                />
              </label>
              <label>
                Reputação
                <input
                  type="text"
                  value={draftCharacter.reputation}
                  onChange={(event) => updateDraftField('reputation', event.target.value)}
                />
              </label>
              <label>
                Lealdade
                <input
                  type="text"
                  value={draftCharacter.loyalty}
                  onChange={(event) => updateDraftField('loyalty', event.target.value)}
                />
              </label>
              <label>
                Nivel
                <input
                  min="1"
                  type="number"
                  value={draftCharacter.level}
                  onChange={(event) => updateDraftNumber('level', event.target.value)}
                />
              </label>
              <label>
                Vida maxima
                <input
                  min="1"
                  type="number"
                  value={draftCharacter.stats.health.max}
                  onChange={(event) => updateDraftStatMax('health', event.target.value)}
                />
              </label>
              <label>
                Mana maxima
                <input
                  min="1"
                  type="number"
                  value={draftCharacter.stats.mana.max}
                  onChange={(event) => updateDraftStatMax('mana', event.target.value)}
                />
              </label>
              <label>
                Energia maxima
                <input
                  min="1"
                  type="number"
                  value={draftCharacter.stats.energy.max}
                  onChange={(event) => updateDraftStatMax('energy', event.target.value)}
                />
              </label>
              <div className="edit-attributes">
                {draftCharacter.attributes.map((attribute) => (
                  <label key={attribute.label}>
                    {attribute.label}
                    <input
                      min="0"
                      type="number"
                      value={attribute.value}
                      onChange={(event) =>
                        updateDraftAttribute(attribute.label, event.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="sheet-action-grid">
                <button
                  className="action-button action-button--save"
                  type="button"
                  onClick={saveCharacter}
                >
                  Salvar
                </button>
                <button
                  className="action-button action-button--restore"
                  type="button"
                  onClick={restoreDefaultCharacter}
                >
                  Restaurar ficha padrão
                </button>
              </div>
            </form>
          ) : (
            <div className="sheet-action-grid">
              <button
                className="action-button action-button--edit"
                type="button"
                onClick={startEditing}
              >
                Editar ficha
              </button>
              <button
                className="action-button action-button--restore"
                type="button"
                onClick={restoreDefaultCharacter}
              >
                Restaurar ficha padrão
              </button>
            </div>
          )}
        </section>

        <section className="panel stats-panel" aria-label="Recursos do personagem">
          <StatBar stat={currentStats.health} />
          <StatBar stat={currentStats.mana} />
          <StatBar stat={currentStats.energy} />
        </section>

        {isMasterMode && (
          <QuickActions
            conditionInput={conditionInput}
            conditions={conditions}
            secretNotes={secretNotes}
            onAddCondition={addCondition}
            onConditionInputChange={setConditionInput}
            onHealthChange={adjustHealth}
            onManaChange={adjustMana}
            onSecretNotesChange={setSecretNotes}
          />
        )}

        <AttributesGrid attributes={sheetCharacter.attributes} />
        <DiceRoller roll={roll} onRoll={rollD20} />
        <Inventory items={sheetCharacter.inventory} />
        <Abilities abilities={sheetCharacter.abilities} />
      </div>
      <BottomNav />
    </main>
  )
}
