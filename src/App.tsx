import { useState } from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

import CharacterAppPage from "./pages/CharacterAppPage";
import MasterAppPage from "./pages/MasterAppPage";
import { initialCharacter } from "./types/character";

type CurrentView = "home" | "playerCharacter" | "masterPanel" | "masterCharacter";

export default function App() {
  const [character, setCharacter] = useState(initialCharacter);
  const [currentView, setCurrentView] = useState<CurrentView>("home");

  if (currentView === "playerCharacter") {
    return (
      <CharacterAppPage
        mode="player"
        character={character}
        setCharacter={setCharacter}
        onBackToCodex={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "masterPanel") {
    return (
      <MasterAppPage
        character={character}
        setCharacter={setCharacter}
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
                onClick={() => setCurrentView("playerCharacter")}
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
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
