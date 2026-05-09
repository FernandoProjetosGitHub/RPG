import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { PlayerProfileSummary } from "../types/character";
import PublicPageShell, { type PublicView } from "./PublicPageShell";

type AppsAccessPageProps = {
  playerProfiles: PlayerProfileSummary[];
  selectedPlayerIndex: number;
  onNavigate: (view: PublicView) => void;
  onOpenPlayer: (index: number) => void;
  onOpenMaster: () => void;
};

export default function AppsAccessPage({
  playerProfiles,
  selectedPlayerIndex,
  onNavigate,
  onOpenPlayer,
  onOpenMaster,
}: AppsAccessPageProps) {
  return (
    <PublicPageShell active="apps" onNavigate={onNavigate}>
      <Stack spacing={2.4}>
        <Box>
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            Aplicativos da mesa
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3.2rem" },
              fontWeight: 900,
              lineHeight: 1.05,
              mt: 0.5,
            }}
          >
            Acesso de jogador e painel do mestre
          </Typography>
          <Typography sx={{ color: "#d7c59d", mt: 1, lineHeight: 1.65 }}>
            Jogadores veem a propria ficha, recursos e mapas liberados. O
            mestre controla os sete perfis, travas, dano, XP, consumiveis,
            bestiario, guia e detalhes sensiveis dos mapas.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: ".85fr 1.15fr" },
            gap: 1.5,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(197,155,75,.2)",
              bgcolor: "rgba(17,17,15,.9)",
              p: 1.6,
            }}
          >
            <Stack spacing={1.3}>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                Mestre
              </Typography>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
                Abra o painel para escolher o jogador ativo, aplicar dano, cura,
                XP, restaurar consumiveis, consultar monstros e acessar mapas
                com notas de condução.
              </Typography>
              <Button size="large" variant="contained" onClick={onOpenMaster}>
                Abrir painel do mestre
              </Button>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(95,182,196,.16)",
              bgcolor: "rgba(17,17,15,.9)",
              p: 1.6,
            }}
          >
            <Stack spacing={1.2}>
              <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                Jogadores
              </Typography>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
                Selecione um dos sete perfis da mesa. Cada perfil guarda classe,
                raça, atributos, magias, vínculos, itens e recursos próprios.
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
                    onClick={() => onOpenPlayer(profile.index)}
                    sx={{
                      justifyContent: "space-between",
                      textAlign: "left",
                      gap: 1,
                    }}
                  >
                    <span>{profile.label}</span>
                    <span>{profile.name || profile.className}</span>
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </PublicPageShell>
  );
}
