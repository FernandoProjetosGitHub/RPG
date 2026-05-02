export default function Inventory({ items }) {
  return (
    <section className="panel" aria-label="Inventario">
      <div className="section-heading">
        <span>Inventario</span>
        <strong>{items.length} itens</strong>
      </div>
      <div className="item-list">
        {items.map((item) => (
          <article className="list-item" key={item.name}>
            <span>{item.name}</span>
            <small>{item.detail}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
