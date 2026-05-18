import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { GiSpellBook, GiTabletopPlayers } from "react-icons/gi";
import type { PlayerProfileSummary } from "../../types/character";
import ClassMark from "./ClassMark";

type AppsAccessPanelsProps = {
  playerProfiles: PlayerProfileSummary[];
  selectedPlayerIndex: number;
  onOpenPlayer: (index: number) => void;
  onOpenMaster: () => void;
};

export default function AppsAccessPanels({
  playerProfiles,
  selectedPlayerIndex,
  onOpenPlayer,
  onOpenMaster,
}: AppsAccessPanelsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: ".85fr 1.15fr" },
        gap: 1.5,
      }}
    >
      <MasterAccessCard onOpenMaster={onOpenMaster} />
      <PlayerAccessCard
        playerProfiles={playerProfiles}
        selectedPlayerIndex={selectedPlayerIndex}
        onOpenPlayer={onOpenPlayer}
      />
    </Box>
  );
}

function MasterAccessCard({ onOpenMaster }: { onOpenMaster: () => void }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(197,155,75,.2)",
        bgcolor: "rgba(17,17,15,.9)",
        p: 1.6,
      }}
    >
      <Stack spacing={1.3}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <GiSpellBook size={28} color="#c59b4b" />
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            Mestre
          </Typography>
        </Stack>
        <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
          Abra o painel para escolher o jogador ativo, aplicar dano, cura, XP,
          restaurar consumiveis, consultar monstros e acessar mapas com notas
          de conducao.
        </Typography>
        <Button size="large" variant="contained" onClick={onOpenMaster}>
          Abrir painel do mestre
        </Button>
      </Stack>
    </Paper>
  );
}

function PlayerAccessCard({
  playerProfiles,
  selectedPlayerIndex,
  onOpenPlayer,
}: {
  playerProfiles: PlayerProfileSummary[];
  selectedPlayerIndex: number;
  onOpenPlayer: (index: number) => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(95,182,196,.16)",
        bgcolor: "rgba(17,17,15,.9)",
        p: 1.6,
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <GiTabletopPlayers size={28} color="#5fb6c4" />
          <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
            Jogadores
          </Typography>
        </Stack>
        <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
          Selecione um dos sete perfis da mesa. Cada perfil guarda classe,
          raca, atributos, magias, vinculos, itens e recursos proprios.
        </Typography>

        <Stack spacing={0.8}>
          {/* Os botoes usam os perfis resumidos para nao carregar a ficha inteira
              na pagina publica. A ficha completa so abre depois da escolha. */}
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
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                <ClassMark classId={profile.classId} size={34} />
                <Box component="span" sx={{ minWidth: 0 }}>
                  <Typography component="span" sx={{ display: "block", fontWeight: 900 }}>
                    {profile.label}
                  </Typography>
                  <Typography component="span" sx={{ display: "block", fontSize: ".76rem", opacity: 0.82 }}>
                    {profile.className}
                  </Typography>
                </Box>
              </Stack>
              <Typography component="span" sx={{ fontSize: ".82rem" }}>
                {profile.name || "Sem nome"}
              </Typography>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
