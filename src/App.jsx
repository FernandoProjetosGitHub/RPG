import character from './data/mockCharacter.js'
import CharacterSheet from './pages/CharacterSheet.jsx'

export default function App() {
  const currentRoute = 'character-sheet'
  const selectedCharacter = character

  const routes = {
    'character-sheet': <CharacterSheet character={selectedCharacter} />,
  }

  return routes[currentRoute]
}
