export default function StatBar({ stat }) {
  const percent = Math.round((stat.current / stat.max) * 100)

  return (
    <div className="stat-bar">
      <div className="stat-bar__meta">
        <span>{stat.label}</span>
        <strong>
          {stat.current}/{stat.max}
        </strong>
      </div>
      <div className="stat-bar__track" aria-label={`${stat.label}: ${percent}%`}>
        <span
          className={`stat-bar__fill stat-bar__fill--${stat.tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
