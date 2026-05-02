export default function CharacterHeader({ character }) {
  return (
    <header className="character-header">
      <div className="portrait" aria-hidden="true">
        {character.portrait}
      </div>
      <div className="character-copy">
        <span className="eyebrow">Ficha ativa</span>
        <h1>{character.name}</h1>
        <p>{character.title}</p>
        <div className="character-tags">
          <span>Nivel {character.level}</span>
          <span>Casa {character.house}</span>
          <span>{character.className}</span>
          <span>{character.race}</span>
          <span>{character.reputation}</span>
          <span>Lealdade: {character.loyalty}</span>
          <span>
            XP {character.xp.current}/{character.xp.total}
          </span>
        </div>
      </div>
    </header>
  )
}
