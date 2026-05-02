export default function QuickActions({ onDamage, onHeal }) {
  return (
    <div className="quick-actions" aria-label="Acoes rapidas de vida">
      <button className="action-button action-button--danger" type="button" onClick={onDamage}>
        -5 Vida
      </button>
      <button className="action-button action-button--heal" type="button" onClick={onHeal}>
        +5 Vida
      </button>
    </div>
  )
}
