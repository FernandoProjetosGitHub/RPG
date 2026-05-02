export default function AttributesGrid({ attributes }) {
  return (
    <section className="panel" aria-label="Atributos">
      <div className="section-heading">
        <span>Atributos</span>
        <strong>Base</strong>
      </div>
      <div className="attributes-grid">
        {attributes.map((attribute) => (
          <article className="attribute-card" key={attribute.label}>
            <span>{attribute.label}</span>
            <strong>{attribute.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
