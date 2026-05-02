const navItems = ['Ficha', 'Bolsa', 'Dados', 'Magias']

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {navItems.map((item) => (
        <button className={item === 'Ficha' ? 'is-active' : ''} type="button" key={item}>
          <span aria-hidden="true">{item.slice(0, 1)}</span>
          {item}
        </button>
      ))}
    </nav>
  )
}
