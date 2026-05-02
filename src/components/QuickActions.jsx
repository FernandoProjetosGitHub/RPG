export default function QuickActions({
  conditionInput,
  conditions,
  onAddCondition,
  onConditionInputChange,
  onHealthChange,
  onManaChange,
  onSecretNotesChange,
  secretNotes,
}) {
  return (
    <section className="panel master-controls" aria-label="Controles do mestre">
      <div className="section-heading">
        <span>Mestre</span>
        <strong>Controles</strong>
      </div>

      <div className="quick-actions" aria-label="Alterar vida e mana">
        <button
          className="action-button action-button--danger"
          type="button"
          onClick={() => onHealthChange(-5)}
        >
          -5 Vida
        </button>
        <button
          className="action-button action-button--heal"
          type="button"
          onClick={() => onHealthChange(5)}
        >
          +5 Vida
        </button>
        <button
          className="action-button action-button--mana-down"
          type="button"
          onClick={() => onManaChange(-5)}
        >
          -5 Mana
        </button>
        <button
          className="action-button action-button--mana-up"
          type="button"
          onClick={() => onManaChange(5)}
        >
          +5 Mana
        </button>
      </div>

      <form className="condition-form" onSubmit={onAddCondition}>
        <label>
          Condicao/status
          <input
            type="text"
            value={conditionInput}
            placeholder="Ex: Envenenado"
            onChange={(event) => onConditionInputChange(event.target.value)}
          />
        </label>
        <button className="action-button action-button--save" type="submit">
          Adicionar status
        </button>
      </form>

      {conditions.length > 0 && (
        <div className="status-list" aria-label="Status ativos">
          {conditions.map((condition) => (
            <span key={condition}>{condition}</span>
          ))}
        </div>
      )}

      <label className="secret-notes">
        Notas secretas
        <textarea
          value={secretNotes}
          placeholder="Anote segredos, armadilhas ou informacoes do mestre."
          onChange={(event) => onSecretNotesChange(event.target.value)}
        />
      </label>
    </section>
  )
}
