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
          <span>{character.className}</span>
        </div>
      </div>
    </header>
  )
}
