export default function DiceRoller({ roll, onRoll }) {
  return (
    <section className="panel dice-panel" aria-label="Rolador de dados">
      <div>
        <div className="section-heading">
          <span>Rolagem</span>
          <strong>D20</strong>
        </div>
        <p className="roll-message">
          {roll ? roll.message : 'Toque no dado para desafiar o destino.'}
        </p>
      </div>
      <button className="dice-button" type="button" onClick={onRoll} aria-label="Rolar D20">
        <span>{roll ? roll.value : 'D20'}</span>
      </button>
    </section>
  )
}
