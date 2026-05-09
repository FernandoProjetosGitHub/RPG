import { useState, type Dispatch, type SetStateAction } from "react";

import AppsAccessPage from "./pages/AppsAccessPage";
import ClassCatalogPage from "./pages/ClassCatalogPage";
import CharacterAppPage from "./pages/CharacterAppPage";
import LandingPage from "./pages/LandingPage";
import MapsPage from "./pages/MapsPage";
import MasterAppPage from "./pages/MasterAppPage";
import { dwClasses, unselectedClass } from "./data/dwClasses";
import { consumableItems, items } from "./data/items";
import { initialCharacter, type Character, type PlayerProfileSummary } from "./types/character";
import type { PublicView } from "./pages/PublicPageShell";

type CurrentView =
  | PublicView
  | "playerCharacter"
  | "masterPanel"
  | "masterCharacter";

const playerCount = 7;

function createInitialTable() {
  return Array.from({ length: playerCount }, () =>
    JSON.parse(JSON.stringify(initialCharacter)) as Character,
  );
}

function getMaxHpForCharacter(character: Character) {
  const selectedClass =
    dwClasses.find((dwClass) => dwClass.id === character.classId) ??
    unselectedClass;
  const equippedBonusHp = Object.values(character.equipment)
    .filter((itemId): itemId is string => Boolean(itemId))
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item))
    .reduce((acc, item) => acc + (item.modifiers.hp ?? 0), 0);

  return selectedClass.baseHp + character.attributes.constituicao + equippedBonusHp;
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(createInitialTable);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [currentView, setCurrentView] = useState<CurrentView>("landing");
  const character = characters[selectedPlayerIndex] ?? characters[0];
  const setCharacter: Dispatch<SetStateAction<Character>> = (
    update,
  ) => {
    setCharacters((currentCharacters) =>
      currentCharacters.map((currentCharacter, index) => {
        if (index !== selectedPlayerIndex) return currentCharacter;
        return typeof update === "function"
          ? update(currentCharacter)
          : update;
      }),
    );
  };
  const playerProfiles: PlayerProfileSummary[] = characters.map(
    (currentCharacter, index) => {
      const currentClass =
        dwClasses.find((dwClass) => dwClass.id === currentCharacter.classId) ??
        unselectedClass;

      return {
        index,
        label: `Jogador ${index + 1}`,
        name: currentCharacter.name,
        className: currentClass.name,
      };
    },
  );

  function applyConsumableToPlayer(consumableId: string, targetIndex: number) {
    const consumable = consumableItems.find((item) => item.id === consumableId);
    if (!consumable) return;

    setCharacters((currentCharacters) => {
      const source = currentCharacters[selectedPlayerIndex];
      if (!source || (source.consumables[consumableId] ?? 0) <= 0) {
        return currentCharacters;
      }

      return currentCharacters.map((currentCharacter, index) => {
        let nextCharacter = currentCharacter;

        if (index === selectedPlayerIndex) {
          nextCharacter = {
            ...nextCharacter,
            consumables: {
              ...nextCharacter.consumables,
              [consumableId]: Math.max(
                0,
                (nextCharacter.consumables[consumableId] ?? 0) - 1,
              ),
            },
          };
        }

        if (index !== targetIndex) return nextCharacter;

        const maxHp = getMaxHpForCharacter(nextCharacter);
        let nextHp = nextCharacter.hp.current;
        if (consumable.effect.type === "heal") {
          nextHp = Math.min(maxHp, nextHp + consumable.effect.amount);
        }
        if (consumable.effect.type === "healHalf") {
          nextHp = Math.min(maxHp, nextHp + Math.ceil(maxHp / 2));
        }

        return {
          ...nextCharacter,
          hp: {
            ...nextCharacter.hp,
            current: nextHp,
          },
        };
      });
    });
  }

  if (currentView === "playerCharacter") {
    return (
      <CharacterAppPage
        mode="player"
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onApplyConsumableToPlayer={applyConsumableToPlayer}
        onBackToCodex={() => setCurrentView("apps")}
      />
    );
  }

  if (currentView === "masterPanel") {
    return (
      <MasterAppPage
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onBackToCodex={() => setCurrentView("apps")}
        onOpenCharacter={() => setCurrentView("masterCharacter")}
      />
    );
  }

  if (currentView === "masterCharacter") {
    return (
      <CharacterAppPage
        mode="master"
        character={character}
        setCharacter={setCharacter}
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onSelectPlayer={setSelectedPlayerIndex}
        onApplyConsumableToPlayer={applyConsumableToPlayer}
        onBackToMaster={() => setCurrentView("masterPanel")}
      />
    );
  }

  if (currentView === "classes") {
    return <ClassCatalogPage onNavigate={setCurrentView} />;
  }

  if (currentView === "maps") {
    return <MapsPage onNavigate={setCurrentView} />;
  }

  if (currentView === "apps") {
    return (
      <AppsAccessPage
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onNavigate={setCurrentView}
        onOpenMaster={() => setCurrentView("masterPanel")}
        onOpenPlayer={(index) => {
          setSelectedPlayerIndex(index);
          setCurrentView("playerCharacter");
        }}
      />
    );
  }

  return <LandingPage onNavigate={setCurrentView} />;
}
