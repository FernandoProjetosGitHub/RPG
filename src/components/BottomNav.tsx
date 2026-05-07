const navItems = [
  { label: 'Ficha', symbol: '◎' },
  { label: 'Bolsa', symbol: '▣' },
  { label: 'Dados', symbol: '◇' },
  { label: 'Magias', symbol: '✦' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {navItems.map((item) => (
        <button
          aria-label={item.label}
          className={item.label === 'Ficha' ? 'is-active' : ''}
          title={item.label}
          type="button"
          key={item.label}
        >
          <span aria-hidden="true">{item.symbol}</span>
        </button>
      ))}
    </nav>
  )
}
