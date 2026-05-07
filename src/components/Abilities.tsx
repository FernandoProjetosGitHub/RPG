export default function Abilities({ abilities }) {
  return (
    <section className="panel" aria-label="Habilidades">
      <div className="section-heading">
        <span>Habilidades</span>
        <strong>Ativas</strong>
      </div>
      <div className="item-list">
        {abilities.map((ability) => (
          <article className="list-item list-item--ability" key={ability.name}>
            <div>
              <span>{ability.name}</span>
              <small>{ability.detail}</small>
            </div>
            <em>{ability.cost}</em>
          </article>
        ))}
      </div>
    </section>
  )
}
