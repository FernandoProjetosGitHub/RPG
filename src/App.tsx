import { useState, type Dispatch, type SetStateAction } from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

import CharacterAppPage from "./pages/CharacterAppPage";
import MasterAppPage from "./pages/MasterAppPage";
import { dwClasses, unselectedClass } from "./data/dwClasses";
import { consumableItems, items } from "./data/items";
import { initialCharacter, type Character, type PlayerProfileSummary } from "./types/character";

type CurrentView = "home" | "playerCharacter" | "masterPanel" | "masterCharacter";

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
  const [currentView, setCurrentView] = useState<CurrentView>("home");
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
        onBackToCodex={() => setCurrentView("home")}
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
        onBackToCodex={() => setCurrentView("home")}
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

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#070706",
        background:
          "radial-gradient(circle at 50% 0%, rgba(170,38,61,.24), transparent 22rem), radial-gradient(circle at 20% 100%, rgba(197,155,75,.16), transparent 18rem), linear-gradient(180deg, #12100d 0%, #070706 100%)",
        color: "#f7edd9",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.18)",
            borderRadius: 4,
            bgcolor: "rgba(17,17,15,.92)",
            color: "#f7edd9",
            p: { xs: 2.5, sm: 4 },
            boxShadow: "0 22px 70px rgba(0,0,0,.58)",
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                Dungeon World
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
                App de ficha
              </Typography>

              <Typography sx={{ color: "#b9a98b", mt: 1, lineHeight: 1.6 }}>
                Escolha como deseja abrir a mesa.
              </Typography>
            </Box>

            <Stack spacing={1.4}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {
                  setSelectedPlayerIndex(0);
                  setCurrentView("playerCharacter");
                }}
                sx={{ py: 1.4 }}
              >
                Jogador
              </Button>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={() => setCurrentView("masterPanel")}
                sx={{ py: 1.4 }}
              >
                Mestre
              </Button>

              <Paper
                variant="outlined"
                sx={{
                  borderColor: "rgba(217,200,159,.14)",
                  bgcolor: "rgba(255,255,255,.04)",
                  p: 1.2,
                }}
              >
                <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
                  Perfis da mesa
                </Typography>
                <Stack spacing={0.8}>
                  {playerProfiles.map((profile) => (
                    <Button
                      key={profile.index}
                      fullWidth
                      variant={
                        selectedPlayerIndex === profile.index
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        setSelectedPlayerIndex(profile.index);
                        setCurrentView("playerCharacter");
                      }}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <span>{profile.label}</span>
                      <span>{profile.name || profile.className}</span>
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
