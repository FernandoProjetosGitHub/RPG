import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  GiCampfire,
  GiCastle,
  GiCompass,
  GiCrossedSwords,
  GiDiceTwentyFacesTwenty,
  GiFootsteps,
  GiOpenBook,
  GiScrollQuill,
  GiSecretBook,
  GiSkullCrossedBones,
  GiSpellBook,
  GiTabletopPlayers,
  GiTreasureMap,
} from "react-icons/gi";
import { MapSvg } from "../../components/AdventureMapsDialog";
import PublicPageShell from "../../components/public/PublicPageShell";
import type { PublicView } from "../../components/public/PublicPageShell";
import { adventureMaps, type AdventureMap } from "../../data/adventureMaps";
import {
  clearTableAccessCredentials,
  createTableAccessCredentials,
  loadTableAccessCredentials,
  saveTableAccessCredentials,
  type TableAccessCredentials,
} from "../../services/tableAccess";
import { getAdventureVisual } from "./data/adventureVisuals";

import {
  adventureSections,
  adventures,
  calculateDangerBudget,
  encounterStyles,
  getAdventureById,
  getScale,
  playerCounts,
  smoothOverflowSx,
} from "./data/adventureContent";
import type {
  AdventureActGuide,
  AdventureGuide,
  AdventureNpc,
  AdventurePlotBeat,
  AdventureSection,
  AdventureThreat,
  PlayerCount,
  SceneBeat,
} from "./data/adventureContent";

export default function Aventuras({
  onNavigate,
}: {
  onNavigate: (view: PublicView) => void;
}) {
  const [selectedAdventureId, setSelectedAdventureId] = useState(adventures[0].id);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerCount>(7);
  const [activeSection, setActiveSection] = useState<AdventureSection>("resumo");
  const [tableAccess, setTableAccess] = useState<TableAccessCredentials | null>(
    () => loadTableAccessCredentials(),
  );
  const selectedAdventure = getAdventureById(selectedAdventureId);
  const selectedBudget = calculateDangerBudget(
    selectedAdventure.baseDangerBudget,
    selectedPlayers,
  );
  const selectedVisual = getAdventureVisual(selectedAdventure.id);

  function handleCreateTableAccess() {
    const nextCredentials = createTableAccessCredentials({
      adventureId: selectedAdventure.id,
      adventureTitle: selectedAdventure.title,
    });

    saveTableAccessCredentials(nextCredentials);
    setTableAccess(nextCredentials);
  }

  function handleClearTableAccess() {
    clearTableAccessCredentials();
    setTableAccess(null);
  }

  return (
    <PublicPageShell active="aventuras" onNavigate={onNavigate}>
      <Box
        sx={{
          position: "relative",
          isolation: "isolate",
          "&::before": {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage:
              `linear-gradient(180deg, rgba(7,7,6,.66), rgba(7,7,6,.92) 72%), url(${selectedVisual.background})`,
            backgroundPosition: `center, ${selectedVisual.position}`,
            backgroundSize: "cover, cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.78,
          },
        }}
      >
      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <HeroSection
          adventure={selectedAdventure}
          visual={selectedVisual}
          selectedPlayers={selectedPlayers}
          selectedBudget={selectedBudget}
          onSectionChange={setActiveSection}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0, 1fr)" },
            gap: 1.6,
            alignItems: "start",
          }}
        >
          <Stack
            spacing={1.2}
            sx={{
              position: { xs: "static", lg: "sticky" },
              top: { lg: 92 },
            }}
          >
            <AdventurePicker
              selectedAdventureId={selectedAdventure.id}
              onSelect={(adventureId) => {
                setSelectedAdventureId(adventureId);
                setActiveSection("resumo");
              }}
            />
            <ScaleSelector
              selectedPlayers={selectedPlayers}
              onSelect={setSelectedPlayers}
              baseBudget={selectedAdventure.baseDangerBudget}
            />
            <TableAccessPanel
              credentials={tableAccess}
              adventure={selectedAdventure}
              onCreate={handleCreateTableAccess}
              onClear={handleClearTableAccess}
            />
            <SessionPulse
              adventure={selectedAdventure}
              selectedPlayers={selectedPlayers}
              selectedBudget={selectedBudget}
            />
          </Stack>

          <AdventureDetail
            adventure={selectedAdventure}
            selectedPlayers={selectedPlayers}
            selectedBudget={selectedBudget}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </Box>
      </Stack>
      </Box>
    </PublicPageShell>
  );
}

function TableAccessPanel({
  credentials,
  adventure,
  onCreate,
  onClear,
}: {
  credentials: TableAccessCredentials | null;
  adventure: AdventureGuide;
  onCreate: () => void;
  onClear: () => void;
}) {
  const createdAt = credentials
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(credentials.createdAt))
    : null;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: credentials ? `${adventure.accent}66` : "rgba(217,200,159,.16)",
        bgcolor: "rgba(8,8,7,.78)",
        p: 1.2,
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <GiSecretBook size={22} color={adventure.accent} />
          <Box>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Acesso da mesa
            </Typography>
            <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
              login e senha para sincronizacao
            </Typography>
          </Box>
        </Stack>

        {credentials ? (
          <Stack spacing={0.9}>
            <Chip
              label={`Mesa: ${credentials.adventureTitle}`}
              sx={{ bgcolor: `${adventure.accent}1f` }}
            />
            <TextField
              label="Login"
              size="small"
              value={credentials.login}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Senha"
              size="small"
              value={credentials.password}
              InputProps={{ readOnly: true }}
            />
            <Typography sx={{ color: "#b9a98b", fontSize: ".78rem", lineHeight: 1.45 }}>
              Criado em {createdAt}. Por enquanto fica salvo localmente; o schema
              de banco ja foi preparado para transformar este acesso em sala online.
            </Typography>
            <Button variant="outlined" onClick={onClear}>
              Remover acesso local
            </Button>
          </Stack>
        ) : (
          <Stack spacing={0.9}>
            <Typography sx={{ color: "#d7c59d", fontSize: ".86rem", lineHeight: 1.55 }}>
              Gere uma credencial da mesa para esta aventura. Ela sera usada na
              proxima etapa para criar ou entrar na sala sincronizada na nuvem.
            </Typography>
            <Button variant="contained" onClick={onCreate}>
              Criar login e senha
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function HeroSection({
  adventure,
  visual,
  selectedPlayers,
  selectedBudget,
  onSectionChange,
}: {
  adventure: AdventureGuide;
  visual: ReturnType<typeof getAdventureVisual>;
  selectedPlayers: PlayerCount;
  selectedBudget: number;
  onSectionChange: (section: AdventureSection) => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderColor: `${adventure.accent}44`,
        background:
          `linear-gradient(145deg, rgba(7,7,6,.78), rgba(7,7,6,.5)), url(${visual.background}), ` +
          `radial-gradient(circle at 82% 12%, ${adventure.accent}30, transparent 20rem), ` +
          "radial-gradient(circle at 12% 16%, rgba(95,182,196,.16), transparent 18rem), " +
          "linear-gradient(145deg, rgba(17,17,15,.96), rgba(7,7,6,.92))",
        backgroundSize: "cover, cover, auto, auto, auto",
        backgroundPosition: `center, ${visual.position}, center, center, center`,
        p: { xs: 1.4, md: 2 },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: { xs: "auto -32px -46px auto", md: "auto 18px -44px auto" },
          color: `${adventure.accent}18`,
          pointerEvents: "none",
        }}
      >
        <GiTreasureMap size={220} />
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) minmax(280px, .85fr)" },
          gap: { xs: 1.5, md: 2 },
          alignItems: "end",
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" useFlexGap gap={0.8} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
            <Chip icon={<GiOpenBook size={16} />} label={adventure.source} />
            <Chip icon={<GiTabletopPlayers size={16} />} label={`${selectedPlayers} jogador${selectedPlayers > 1 ? "es" : ""}`} />
            <Chip icon={<GiCrossedSwords size={16} />} label={`Pressao ${selectedBudget}/${adventure.baseDangerBudget}`} />
            <Chip icon={<GiSkullCrossedBones size={16} />} label="Conteudo do mestre" />
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.1rem", md: "3.55rem" },
              lineHeight: 0.98,
              fontWeight: 900,
              maxWidth: 980,
              color: "#fff8e9",
            }}
          >
            <AdventureTitleLines lines={visual.titleLines} />
          </Typography>

          <Typography sx={{ color: "#d7c59d", lineHeight: 1.72, maxWidth: 900 }}>
            {adventure.premise}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8}>
            <Button
              variant="outlined"
              startIcon={<GiCampfire />}
              onClick={() => onSectionChange("cenas")}
            >
              Conduzir cenas
            </Button>
            <Button
              variant="outlined"
              startIcon={<GiTreasureMap />}
              onClick={() => onSectionChange("mapas")}
            >
              Abrir mapas
            </Button>
            <Button
              variant="outlined"
              startIcon={<GiSkullCrossedBones />}
              onClick={() => onSectionChange("elenco")}
            >
              Ver elenco
            </Button>
          </Stack>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            borderColor: `${adventure.accent}55`,
            bgcolor: "rgba(0,0,0,.34)",
            p: 1.2,
          }}
        >
          <Stack spacing={1.1}>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Mesa pronta para abrir
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 0.8,
              }}
            >
              <HeroMetric Icon={GiCampfire} label="Cenas" value={adventure.scenes.length} />
              <HeroMetric Icon={GiTabletopPlayers} label="PNJs" value={adventure.npcs.length} />
              <HeroMetric Icon={GiSkullCrossedBones} label="Ameacas" value={adventure.threats.length} />
              <HeroMetric Icon={GiTreasureMap} label="Mapa" value="atlas" />
            </Box>

            <Alert
              severity="warning"
              sx={{
                bgcolor: "rgba(197,155,75,.1)",
                color: "#f7edd9",
                border: "1px solid rgba(197,155,75,.2)",
                "& .MuiAlert-icon": { color: "#f2c76c" },
              }}
            >
              Segredos, monstros, rotas e consequencias ficam concentrados nesta tela.
            </Alert>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
}

function AdventureTitleLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <Box
          key={line}
          component="span"
          sx={{
            display: "block",
            textWrap: "balance",
          }}
        >
          {line}
        </Box>
      ))}
    </>
  );
}

function HeroMetric({
  Icon,
  label,
  value,
}: {
  Icon: IconType;
  label: string;
  value: ReactNode;
}) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(217,200,159,.13)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 0.9,
      }}
    >
      <Stack spacing={0.35}>
        <Icon size={19} color="#c59b4b" />
        <Typography sx={{ color: "#b9a98b", fontSize: ".7rem", fontWeight: 900 }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

function AdventurePicker({
  selectedAdventureId,
  onSelect,
}: {
  selectedAdventureId: string;
  onSelect: (adventureId: string) => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(8,8,7,.72)",
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <GiScrollQuill size={22} color="#c59b4b" />
        <Box>
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            Biblioteca
          </Typography>
          <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
            PDFs jogaveis da mesa
          </Typography>
        </Box>
      </Stack>
      <Stack spacing={0.8}>
        {adventures.map((adventure, index) => {
          const selected = selectedAdventureId === adventure.id;
          const visual = getAdventureVisual(adventure.id);

          return (
            <Button
              key={adventure.id}
              variant="outlined"
              onClick={() => onSelect(adventure.id)}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                gap: 0.9,
                minHeight: 70,
                borderColor: selected ? `${adventure.accent}aa` : `${adventure.accent}3f`,
                bgcolor: selected ? `${adventure.accent}20` : "rgba(0,0,0,.16)",
                color: "#f7edd9",
                boxShadow: selected ? `inset 3px 0 0 ${adventure.accent}` : "none",
                "&:hover": {
                  bgcolor: `${adventure.accent}1f`,
                  color: "#fff3dc",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid rgba(255,243,220,.72)",
                  outlineOffset: 2,
                  color: "#fff3dc",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: selected ? adventure.accent : `${adventure.accent}22`,
                  color: selected ? "#100b08" : adventure.accent,
                  flex: "0 0 auto",
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </Box>
              <Box component="span" sx={{ minWidth: 0 }}>
                <Stack component="span" spacing={0} sx={{ lineHeight: 1.05 }}>
                  {visual.titleLines.map((line) => (
                    <Typography
                      key={line}
                      component="span"
                      sx={{ display: "block", fontWeight: 900, lineHeight: 1.05 }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Stack>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    color: "#b9a98b",
                    fontSize: ".72rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {adventure.tone}
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Stack>
    </Paper>
  );
}

function ScaleSelector({
  selectedPlayers,
  onSelect,
  baseBudget,
}: {
  selectedPlayers: PlayerCount;
  onSelect: (players: PlayerCount) => void;
  baseBudget: number;
}) {
  // O seletor mostra a mesma conta em todos os degraus de jogadores. Assim o
  // mestre consegue comparar rapidamente o peso da aventura cheia contra uma
  // mesa menor antes de abrir cenas especificas.
  const activeScale = getScale(selectedPlayers);
  const activeBudget = calculateDangerBudget(baseBudget, selectedPlayers);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(95,182,196,.16)",
        bgcolor: "rgba(95,182,196,.045)",
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <GiDiceTwentyFacesTwenty size={22} color="#5fb6c4" />
        <Box>
          <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
            Escala da mesa
          </Typography>
          <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
            Reducao de pressao sem cortar escolhas
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
        {playerCounts.map((players) => {
          const active = selectedPlayers === players;

          return (
            <Button
              key={players}
              size="small"
              variant="outlined"
              onClick={() => onSelect(players)}
              sx={{
                minWidth: 42,
                bgcolor: active ? "rgba(95,182,196,.22)" : "rgba(0,0,0,.12)",
                color: active ? "#dff7ff" : "#f2c76c",
                borderColor: active ? "#5fb6c4" : "rgba(242,199,108,.35)",
                fontWeight: 900,
                "&:hover": {
                  bgcolor: active ? "rgba(95,182,196,.28)" : "rgba(242,199,108,.12)",
                  color: active ? "#ffffff" : "#fff3dc",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid rgba(255,243,220,.72)",
                  outlineOffset: 2,
                },
              }}
            >
              {players}
            </Button>
          );
        })}
      </Stack>

      <Divider sx={{ borderColor: "rgba(217,200,159,.12)", my: 1.2 }} />

      <Stack spacing={0.7}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
          <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
            {activeBudget}/{baseBudget} pressao
          </Typography>
          <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
            {activeScale.label}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(activeBudget / baseBudget) * 100}
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,.07)",
            ".MuiLinearProgress-bar": { bgcolor: "#f2c76c" },
          }}
        />
        <Typography sx={{ color: "#d7c59d", fontSize: ".84rem", lineHeight: 1.45 }}>
          {activeScale.reserve}
        </Typography>
      </Stack>
    </Paper>
  );
}

function SessionPulse({
  adventure,
  selectedPlayers,
  selectedBudget,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
  selectedBudget: number;
}) {
  const scale = getScale(selectedPlayers);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}33`,
        bgcolor:
          `linear-gradient(145deg, ${adventure.accent}12, rgba(255,255,255,.028)), rgba(7,7,6,.7)`,
        p: 1.2,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <GiCompass size={22} color={adventure.accent} />
          <Box>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Pulso da sessao
            </Typography>
            <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
              {scale.simultaneous}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 0.75,
          }}
        >
          <SideMetric label="Jogadores" value={selectedPlayers} />
          <SideMetric label="Pressao" value={`${selectedBudget}/${adventure.baseDangerBudget}`} />
          <SideMetric label="Cenas" value={adventure.scenes.length} />
          <SideMetric label="Frentes" value={adventure.fronts.length} />
        </Box>

        <Typography sx={{ color: "#d7c59d", fontSize: ".84rem", lineHeight: 1.45 }}>
          {scale.reserve}
        </Typography>
      </Stack>
    </Paper>
  );
}

function SideMetric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(217,200,159,.12)",
        bgcolor: "rgba(0,0,0,.2)",
        p: 0.75,
      }}
    >
      <Typography sx={{ color: "#8f826c", fontSize: ".67rem", fontWeight: 900 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
        {value}
      </Typography>
    </Box>
  );
}

function AdventureDetail({
  adventure,
  selectedPlayers,
  selectedBudget,
  activeSection,
  onSectionChange,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
  selectedBudget: number;
  activeSection: AdventureSection;
  onSectionChange: (section: AdventureSection) => void;
}) {
  const map = useMemo(
    () => adventureMaps.find((currentMap) => currentMap.id === adventure.mapId),
    [adventure.mapId],
  );
  // Esta composicao e a "ficha da aventura": primeiro orienta escala e mapas,
  // depois entrega blocos expansivos de PNJs, monstros, cenas e recompensas.
  // A ordem favorece uso em sessao, onde o mestre consulta rapido sem ler tudo.
  return (
    <Stack spacing={1.6}>
      <AdventureOverviewCard
        adventure={adventure}
        selectedPlayers={selectedPlayers}
        selectedBudget={selectedBudget}
        map={map}
      />

      <AdventureSectionNav active={activeSection} onChange={onSectionChange} />

      {activeSection === "resumo" && (
        <SummarySection adventure={adventure} selectedPlayers={selectedPlayers} />
      )}

      {activeSection === "mapas" && (
        <MapsSection adventure={adventure} map={map} />
      )}

      {activeSection === "cenas" && (
        <ScenesSection
          adventure={adventure}
          selectedPlayers={selectedPlayers}
        />
      )}

      {activeSection === "elenco" && <CastSection adventure={adventure} />}

      {activeSection === "regras" && (
        <RulesSection
          adventure={adventure}
          selectedPlayers={selectedPlayers}
        />
      )}
    </Stack>
  );
}

function AdventureSectionNav({
  active,
  onChange,
}: {
  active: AdventureSection;
  onChange: (section: AdventureSection) => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "sticky",
        top: { xs: 76, md: 86 },
        zIndex: 4,
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(7,7,6,.82)",
        boxShadow: "0 16px 34px rgba(0,0,0,.28)",
        backdropFilter: "blur(14px)",
        p: 0.75,
      }}
    >
      <Stack
        direction="row"
        useFlexGap
        gap={0.65}
        sx={{
          flexWrap: { xs: "nowrap", sm: "wrap" },
          alignItems: "stretch",
          overflowX: { xs: "auto", sm: "visible" },
          pb: { xs: 0.25, sm: 0 },
        }}
      >
        {adventureSections.map((section) => {
          const selected = active === section.value;
          const Icon = section.Icon;

          return (
            <Button
              key={section.value}
              variant="outlined"
              onClick={() => onChange(section.value)}
              sx={{
                flex: { xs: "0 0 138px", sm: "1 1 0" },
                minWidth: { xs: 138, sm: 0 },
                py: 0.95,
                borderColor: selected
                  ? "rgba(242,199,108,.72)"
                  : "rgba(217,200,159,.28)",
                bgcolor: selected ? "rgba(242,199,108,.16)" : "rgba(0,0,0,.14)",
                color: selected ? "#fff3dc" : "#d7c59d",
                boxShadow: selected
                  ? "inset 0 -3px 0 #f2c76c"
                  : "none",
                "&:hover": {
                  bgcolor: "rgba(242,199,108,.12)",
                  borderColor: "#f2c76c",
                  color: "#fff3dc",
                },
                "&.Mui-focusVisible": {
                  bgcolor: "rgba(242,199,108,.2)",
                  color: "#fff3dc",
                  outline: "2px solid rgba(255,243,220,.72)",
                  outlineOffset: 2,
                },
                ".MuiTypography-root": {
                  color: "inherit",
                },
              }}
            >
              <Stack spacing={0.25} sx={{ alignItems: "center" }}>
                <Icon size={20} />
                <Typography sx={{ fontWeight: 900, fontSize: ".82rem" }}>
                  {section.label}
                </Typography>
                <Typography sx={{ fontSize: ".68rem", opacity: 0.78 }}>
                  {section.helper}
                </Typography>
              </Stack>
            </Button>
          );
        })}
      </Stack>
    </Paper>
  );
}

function AdventureOverviewCard({
  adventure,
  selectedPlayers,
  selectedBudget,
  map,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
  selectedBudget: number;
  map?: AdventureMap;
}) {
  const scale = getScale(selectedPlayers);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}44`,
        bgcolor: "rgba(17,17,15,.72)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" },
          gap: 0,
        }}
      >
        <Box sx={{ p: { xs: 1.2, md: 1.5 } }}>
          <Stack spacing={1.1}>
            <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
              <Chip icon={<GiSecretBook size={15} />} label={adventure.source} />
              <Chip icon={<GiFootsteps size={15} />} label={adventure.tone} sx={{ bgcolor: `${adventure.accent}18` }} />
            </Stack>

            <Box>
              <Typography sx={{ color: adventure.accent, fontSize: ".82rem", fontWeight: 900 }}>
                Ficha de conducao
              </Typography>
              <Typography sx={{ color: "#f7edd9", fontSize: { xs: "1.2rem", md: "1.35rem" }, fontWeight: 900 }}>
                {adventure.format}
              </Typography>
            </Box>

            <Typography sx={{ color: "#d7c59d", lineHeight: 1.62 }}>
              {scale.reserve}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            borderTop: { xs: "1px solid rgba(217,200,159,.12)", md: 0 },
            borderLeft: { xs: 0, md: "1px solid rgba(217,200,159,.12)" },
            p: { xs: 1.2, md: 1.5 },
            bgcolor: "rgba(0,0,0,.18)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 0.75,
            }}
          >
            <OverviewMetric Icon={GiDiceTwentyFacesTwenty} label="Pressao" value={`${selectedBudget}/${adventure.baseDangerBudget}`} accent={adventure.accent} />
            <OverviewMetric Icon={GiTabletopPlayers} label="Mesa" value={`${selectedPlayers} PJ`} accent="#5fb6c4" />
            <OverviewMetric Icon={GiCampfire} label="Cenas" value={adventure.scenes.length} accent="#f2c76c" />
            <OverviewMetric Icon={GiCompass} label="Mapa" value={map ? map.title : "pendente"} accent="#7f6fd9" />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function OverviewMetric({
  Icon,
  label,
  value,
  accent,
}: {
  Icon: IconType;
  label: string;
  value: ReactNode;
  accent: string;
}) {
  return (
    <Box
      sx={{
        border: `1px solid ${accent}33`,
        bgcolor: `${accent}0f`,
        minWidth: 0,
        p: 0.85,
      }}
    >
      <Stack spacing={0.35}>
        <Icon size={18} color={accent} />
        <Typography sx={{ color: "#8f826c", fontSize: ".66rem", fontWeight: 900 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            color: "#f7edd9",
            fontSize: ".86rem",
            fontWeight: 900,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

function SectionHeader({
  Icon,
  eyebrow,
  title,
  body,
  accent,
}: {
  Icon: IconType;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${accent}33`,
        bgcolor: `${accent}0f`,
        p: { xs: 1.1, md: 1.3 },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
            flex: "0 0 auto",
          }}
        >
          <Icon size={24} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: accent, fontSize: ".72rem", fontWeight: 900 }}>
            {eyebrow}
          </Typography>
          <Typography sx={{ color: "#f7edd9", fontSize: "1.12rem", fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#b9a98b", lineHeight: 1.55, mt: 0.3 }}>
            {body}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function SummarySection({
  adventure,
  selectedPlayers,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
}) {
  return (
    <Stack spacing={1.3}>
      <SectionHeader
        Icon={GiOpenBook}
        eyebrow="Resumo operacional"
        title="Comece pela cena, depois avance por viradas e frentes"
        body="Este bloco concentra o que o mestre precisa antes de abrir mapas, cenas detalhadas ou ameacas."
        accent={adventure.accent}
      />
      <QuickStart adventure={adventure} />
      <DirectorBrief adventure={adventure} />
      <StoryFlow adventure={adventure} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 1.2,
        }}
      >
        <InfoGrid
          title="Objetivos da sessao"
          items={adventure.objectives}
          accent={adventure.accent}
        />
        <InfoGrid
          title="O que esta em jogo"
          items={adventure.stakes}
          accent="#f2c76c"
        />
      </Box>

      <InfoGrid
        title={`Frentes ativas para ${selectedPlayers} jogador${
          selectedPlayers > 1 ? "es" : ""
        }`}
        items={adventure.fronts}
        accent="#aa263d"
      />
    </Stack>
  );
}

function DirectorBrief({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}35`,
        bgcolor:
          `linear-gradient(145deg, ${adventure.accent}12, rgba(0,0,0,.18)), rgba(255,255,255,.03)`,
        p: 1.25,
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <GiSecretBook size={22} color={adventure.accent} />
          <Box>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Direcao do guia completo
            </Typography>
            <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
              Camada narrativa adicionada do novo PDF
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: ".95fr 1.05fr" },
            gap: 1,
          }}
        >
          <Paper variant="outlined" sx={cardSx(adventure.accent)}>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Verdade secreta
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.58 }}>
              {adventure.secretTruth}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={cardSx("#5fb6c4")}>
            <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
              Como mestrar sem se perder
            </Typography>
            <Stack component="ul" spacing={0.55} sx={{ m: 0, mt: 0.8, pl: 2.1 }}>
              {adventure.conductorNotes.map((note) => (
                <Typography
                  key={note}
                  component="li"
                  sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.5 }}
                >
                  {note}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
}

function StoryFlow({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}33`,
        bgcolor: "rgba(255,255,255,.03)",
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <GiFootsteps size={21} color={adventure.accent} />
        <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
          Enredo em quatro viradas
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.9,
        }}
      >
        {adventure.plot.map((beat, index) => (
          <StoryBeatCard
            key={beat.title}
            beat={beat}
            index={index}
            accent={adventure.accent}
          />
        ))}
      </Box>
    </Paper>
  );
}

function StoryBeatCard({
  beat,
  index,
  accent,
}: {
  beat: AdventurePlotBeat;
  index: number;
  accent: string;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  // Cada virada narrativa fica expansivel para manter a tela compacta no
  // celular, mas sem perder as instrucoes detalhadas que ajudam o mestre a
  // conduzir cena, consequencia e escolha aberta.
  return (
    <Paper
      component="article"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      variant="outlined"
      onClick={() => setIsOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen((current) => !current);
        }
      }}
      sx={{
        borderColor: isOpen ? `${accent}88` : "rgba(217,200,159,.13)",
        background: isOpen
          ? `linear-gradient(145deg, ${accent}18, rgba(0,0,0,.18))`
          : "rgba(0,0,0,.18)",
        color: "#f7edd9",
        cursor: "pointer",
        minHeight: 150,
        p: 1.05,
        transition: "border-color .18s ease, background .18s ease",
        boxShadow: isOpen ? `inset 3px 0 0 ${accent}` : "none",
        "&:focus-visible": {
          outline: "2px solid rgba(255,243,220,.72)",
          outlineOffset: 2,
          borderColor: "#f2c76c",
        },
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
          <Chip
            size="small"
            label={`${index + 1}`}
            sx={{
              bgcolor: isOpen ? accent : "rgba(255,255,255,.08)",
              color: isOpen ? "#100b08" : "#f7edd9",
              fontWeight: 900,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
              {beat.title}
            </Typography>
            <Typography sx={{ color: "#b9a98b", fontSize: ".74rem" }}>
              {isOpen ? "Clique para recolher" : "Clique para ver dinamica"}
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.45 }}>
          {beat.purpose}
        </Typography>

        <Collapse in={isOpen} timeout={180} unmountOnExit>
          <Stack spacing={1} sx={{ pt: 0.4 }}>
            <Typography sx={{ color: "#b9a98b", fontSize: ".82rem", lineHeight: 1.45 }}>
              <strong>Escalada:</strong> {beat.escalation}
            </Typography>

            <Typography sx={{ color: "#f2c76c", fontSize: ".82rem", lineHeight: 1.45 }}>
              <strong>Pergunta da virada:</strong> {beat.question}
            </Typography>

            <BulletList title="Dinamica em mesa" items={beat.tableDynamics} />
            <BulletList title="Notas para o MJ" items={beat.gmNotes} tone="#5fb6c4" />
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}

function BulletList({
  title,
  items,
  tone = "#f2c76c",
}: {
  title: string;
  items: string[];
  tone?: string;
}) {
  return (
    <Box>
      <Typography sx={{ color: tone, fontSize: ".78rem", fontWeight: 900, mb: 0.4 }}>
        {title}
      </Typography>
      <Stack component="ul" spacing={0.45} sx={{ pl: 2.2, m: 0 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            sx={{ color: "#d7c59d", fontSize: ".8rem", lineHeight: 1.45 }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function MapsSection({
  adventure,
  map,
}: {
  adventure: AdventureGuide;
  map?: AdventureMap;
}) {
  return (
    <Stack spacing={1.2}>
      <SectionHeader
        Icon={GiTreasureMap}
        eyebrow="Mapas e fluxo"
        title="Veja a rota narrativa ao lado do atlas fiel aos pontos do PDF"
        body="O fluxo mostra escolhas de mesa; o atlas mostra o espaco, rotas, regioes e pontos sensiveis da aventura."
        accent="#5fb6c4"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 1.3,
          alignItems: "stretch",
        }}
      >
        <MapCard title="Fluxo de encontros" Icon={GiFootsteps}>
          <EncounterMap adventure={adventure} />
        </MapCard>

        <MapCard title="Mapa do atlas" Icon={GiCompass}>
          {map ? (
            <Stack spacing={1}>
              <Box sx={{ overflowX: "auto", ...smoothOverflowSx }}>
                <MapSvg mapId={map.id} revealSecrets showPointLabels />
              </Box>
              <Typography sx={{ color: "#b9a98b", fontSize: ".86rem", lineHeight: 1.45 }}>
                {map.summary}
              </Typography>
            </Stack>
          ) : (
            <Typography sx={{ color: "#b9a98b" }}>
              Mapa ainda nao cadastrado no atlas.
            </Typography>
          )}
        </MapCard>
      </Box>
    </Stack>
  );
}

function ScenesSection({
  adventure,
  selectedPlayers,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
}) {
  return (
    <Stack spacing={1.1}>
      <SectionHeader
        Icon={GiCampfire}
        eyebrow="Cenas em ordem de uso"
        title="Leia, pressione e ajuste a escala sem perder a ficcao"
        body="Cada cena separa leitura, pressao para mesa cheia, ressalva para grupos menores e decisoes que movem a aventura."
        accent={adventure.accent}
      />
      <ActGuideSection adventure={adventure} />
      <SceneSeedsPanel adventure={adventure} />
      {adventure.scenes.map((scene, index) => (
        <SceneCard
          key={scene.title}
          scene={scene}
          index={index}
          selectedPlayers={selectedPlayers}
          accent={adventure.accent}
        />
      ))}
    </Stack>
  );
}

function CastSection({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Stack spacing={1.3}>
      <SectionHeader
        Icon={GiSkullCrossedBones}
        eyebrow="Elenco e ameacas"
        title="Rostos, monstros e instintos prontos para consulta"
        body="PNJs ficam separados de perigos para o mestre alternar conversa, revelacao e confronto sem procurar no texto inteiro."
        accent="#aa263d"
      />

      <PanelTitle Icon={GiTabletopPlayers} title="PNJs em cena" accent="#5f7f4f" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 1,
        }}
      >
        {adventure.npcs.map((npc) => (
          <NpcCard key={npc.name} npc={npc} />
        ))}
      </Box>

      <PanelTitle Icon={GiCrossedSwords} title="Ameacas e monstros" accent="#8f2637" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 1,
        }}
      >
        {adventure.threats.map((threat) => (
          <ThreatCard key={threat.name} threat={threat} />
        ))}
      </Box>
    </Stack>
  );
}

function PanelTitle({
  Icon,
  title,
  accent,
}: {
  Icon: IconType;
  title: string;
  accent: string;
}) {
  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          bgcolor: `${accent}22`,
          color: accent,
          border: `1px solid ${accent}44`,
        }}
      >
        <Icon size={18} />
      </Box>
      <Typography sx={{ color: accent, fontWeight: 900 }}>
        {title}
      </Typography>
    </Stack>
  );
}

function ActGuideSection({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}35`,
        bgcolor: "rgba(255,255,255,.03)",
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <GiFootsteps size={22} color={adventure.accent} />
        <Box>
          <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
            Roteiro de atos do PDF
          </Typography>
          <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
            Use como trilha de tensao, nao como ferrovia
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 0.9,
        }}
      >
        {adventure.actGuides.map((act, index) => (
          <ActGuideCard
            key={act.title}
            act={act}
            index={index}
            accent={adventure.accent}
          />
        ))}
      </Box>
    </Paper>
  );
}

function ActGuideCard({
  act,
  index,
  accent,
}: {
  act: AdventureActGuide;
  index: number;
  accent: string;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: isOpen ? `${accent}77` : "rgba(217,200,159,.13)",
        bgcolor: isOpen ? `${accent}10` : "rgba(0,0,0,.18)",
        p: 1,
      }}
    >
      <Stack spacing={0.8}>
        <Button
          variant="text"
          onClick={() => setIsOpen((current) => !current)}
          sx={{
            justifyContent: "flex-start",
            color: "#f7edd9",
            p: 0,
            "&:hover": { bgcolor: "transparent", color: "#fff3dc" },
          }}
        >
          <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", minWidth: 0 }}>
            <Box
              component="span"
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: isOpen ? accent : `${accent}24`,
                color: isOpen ? "#100b08" : accent,
                fontWeight: 900,
                flex: "0 0 auto",
              }}
            >
              {index + 1}
            </Box>
            <Box component="span" sx={{ textAlign: "left", minWidth: 0 }}>
              <Typography component="span" sx={{ display: "block", fontWeight: 900 }}>
                {act.title}
              </Typography>
              <Typography component="span" sx={{ display: "block", color: "#b9a98b", fontSize: ".78rem" }}>
                {isOpen ? "Recolher condução" : "Abrir condução"}
              </Typography>
            </Box>
          </Stack>
        </Button>

        <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.5 }}>
          {act.focus}
        </Typography>

        <Collapse in={isOpen} timeout={180} unmountOnExit>
          <Stack spacing={0.9}>
            <StepList title="Passos na mesa" items={act.tableSteps} accent={accent} />
            <Paper variant="outlined" sx={cardSx("#5fb6c4")}>
              <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                Revelacao principal
              </Typography>
              <Typography sx={{ color: "#d7c59d", mt: 0.45, lineHeight: 1.48 }}>
                {act.reveal}
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={cardSx("#f2c76c")}>
              <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
                Dica para mestre iniciante
              </Typography>
              <Typography sx={{ color: "#d7c59d", mt: 0.45, lineHeight: 1.48 }}>
                {act.noviceTip}
              </Typography>
            </Paper>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}

function SceneSeedsPanel({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(95,182,196,.22)",
        bgcolor: "rgba(95,182,196,.055)",
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <GiCampfire size={22} color="#5fb6c4" />
        <Box>
          <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
            Cenas prontas para puxar ritmo
          </Typography>
          <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
            Insira quando a mesa hesitar, descansar ou precisar de um rosto novo
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {adventure.sceneSeeds.map((seed, index) => (
          <Box
            key={seed}
            sx={{
              display: "grid",
              gridTemplateColumns: "30px minmax(0, 1fr)",
              gap: 0.8,
              border: "1px solid rgba(95,182,196,.16)",
              bgcolor: "rgba(0,0,0,.18)",
              p: 0.85,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(95,182,196,.18)",
                color: "#5fb6c4",
                fontWeight: 900,
              }}
            >
              {index + 1}
            </Box>
            <Typography sx={{ color: "#d7c59d", lineHeight: 1.5 }}>
              {seed}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function StepList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <Box>
      <Typography sx={{ color: accent, fontSize: ".78rem", fontWeight: 900, mb: 0.45 }}>
        {title}
      </Typography>
      <Stack spacing={0.5}>
        {items.map((item, index) => (
          <Stack key={item} direction="row" spacing={0.75} sx={{ alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: `${accent}22`,
                color: accent,
                fontSize: ".7rem",
                fontWeight: 900,
                flex: "0 0 auto",
              }}
            >
              {index + 1}
            </Box>
            <Typography sx={{ color: "#d7c59d", fontSize: ".84rem", lineHeight: 1.45 }}>
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function NpcCard({ npc }: { npc: AdventureNpc }) {
  return (
    <Paper variant="outlined" sx={cardSx("#5f7f4f")}>
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(95,127,79,.2)",
              color: "#d8efbd",
              flex: "0 0 auto",
            }}
          >
            <GiTabletopPlayers size={19} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#d8efbd", fontWeight: 900 }}>
              {npc.name}
            </Typography>
            <Typography sx={{ color: "#b9a98b", fontSize: ".78rem" }}>
              {npc.role}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
          <Chip size="small" label="PNJ" sx={{ bgcolor: "rgba(95,127,79,.24)" }} />
          <Chip size="small" label={npc.role} />
        </Stack>
        {npc.motivation && (
          <Typography sx={{ color: "#f7edd9", fontSize: ".9rem", lineHeight: 1.45 }}>
            <strong>Quer:</strong> {npc.motivation}
          </Typography>
        )}
        {npc.secret && (
          <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.45 }}>
            <strong>Segredo:</strong> {npc.secret}
          </Typography>
        )}
        {npc.tableCue && (
          <Typography sx={{ color: "#f2c76c", fontSize: ".84rem", lineHeight: 1.45 }}>
            <strong>Na mesa:</strong> {npc.tableCue}
          </Typography>
        )}
        <Typography sx={{ color: "#b9a98b", fontSize: ".84rem", lineHeight: 1.45 }}>
          {npc.useAtTable}
        </Typography>
      </Stack>
    </Paper>
  );
}

function ThreatCard({ threat }: { threat: AdventureThreat }) {
  return (
    <Paper variant="outlined" sx={cardSx("#8f2637")}>
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(143,38,55,.22)",
              color: "#ffb2b8",
              flex: "0 0 auto",
            }}
          >
            <GiSkullCrossedBones size={19} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#ffb2b8", fontWeight: 900 }}>
              {threat.name}
            </Typography>
            <Typography sx={{ color: "#b9a98b", fontSize: ".78rem" }}>
              {threat.role}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" useFlexGap gap={0.6} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
          <Chip size="small" label={threat.role} />
          <Chip size="small" label={threat.stats} />
        </Stack>
        <Typography sx={{ color: "#f7edd9", fontSize: ".9rem" }}>
          <strong>Instinto:</strong> {threat.instinct}
        </Typography>
        <Stack component="ul" spacing={0.4} sx={{ m: 0, pl: 2.1 }}>
          {threat.moves.map((move) => (
            <Typography
              key={move}
              component="li"
              sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.45 }}
            >
              {move}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function RulesSection({
  adventure,
  selectedPlayers,
}: {
  adventure: AdventureGuide;
  selectedPlayers: PlayerCount;
}) {
  return (
    <Stack spacing={1.2}>
      <SectionHeader
        Icon={GiScrollQuill}
        eyebrow="Regras de mesa"
        title="Escala, movimentos personalizados e consequencias"
        body="Use esta aba quando precisar ajustar dificuldade, improvisar resultado ou fechar ramificacoes provaveis."
        accent="#7f6fd9"
      />

      <ScaleTable
        baseBudget={adventure.baseDangerBudget}
        selectedPlayers={selectedPlayers}
      />

      <ClockAndFinales adventure={adventure} />

      <InfoGrid
        title="Movimentos personalizados"
        items={adventure.customMoves}
        accent="#7f6fd9"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 1.2,
        }}
      >
        <InfoGrid title="Ramos provaveis" items={adventure.branches} accent="#c59b4b" />
        <InfoGrid
          title="Recompensas e consequencias"
          items={adventure.rewards}
          accent="#5fb6c4"
        />
      </Box>

      <InfoGrid
        title="Principios de conducao"
        items={adventure.gmPrinciples}
        accent="#f2c76c"
      />
    </Stack>
  );
}

function ScaleTable({
  baseBudget,
  selectedPlayers,
}: {
  baseBudget: number;
  selectedPlayers: PlayerCount;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(242,199,108,.2)",
        bgcolor: "rgba(197,155,75,.07)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#f2c76c", fontWeight: 900, mb: 1 }}>
        Tabela de escala 7 &gt; 1
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {playerCounts.map((players) => {
          const scale = getScale(players);
          const budget = calculateDangerBudget(baseBudget, players);
          const active = players === selectedPlayers;

          return (
            <Paper
              key={players}
              variant="outlined"
              sx={{
                borderColor: active
                  ? "rgba(242,199,108,.55)"
                  : "rgba(217,200,159,.12)",
                bgcolor: active ? "rgba(242,199,108,.12)" : "rgba(255,255,255,.035)",
                p: 0.9,
              }}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
                    {players} jogador{players > 1 ? "es" : ""}
                  </Typography>
                  <Chip size="small" label={`${budget}/${baseBudget}`} />
                </Stack>
                <Typography sx={{ color: "#d7c59d", fontSize: ".84rem" }}>
                  {scale.simultaneous}
                </Typography>
                <Typography sx={{ color: "#b9a98b", fontSize: ".8rem", lineHeight: 1.4 }}>
                  {scale.reserve}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}

function ClockAndFinales({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: ".9fr 1.1fr" },
        gap: 1.2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          borderColor: "rgba(170,38,61,.24)",
          bgcolor: "rgba(170,38,61,.06)",
          p: 1.2,
        }}
      >
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
          <GiSkullCrossedBones size={22} color="#ffb2b8" />
          <Box>
            <Typography sx={{ color: "#ffb2b8", fontWeight: 900 }}>
              Relogio de agravamento
            </Typography>
            <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
              Avance quando a mesa demora, falha ou escolhe seguranca
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={0.75}>
          {adventure.escalationClock.map((stage, index) => (
            <Stack key={stage} direction="row" spacing={0.8} sx={{ alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: index === adventure.escalationClock.length - 1
                    ? "rgba(170,38,61,.28)"
                    : "rgba(255,255,255,.06)",
                  color: index === adventure.escalationClock.length - 1 ? "#ffb2b8" : "#f2c76c",
                  border: "1px solid rgba(217,200,159,.14)",
                  fontWeight: 900,
                  flex: "0 0 auto",
                }}
              >
                {index + 1}
              </Box>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.5 }}>
                {stage}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderColor: `${adventure.accent}33`,
          bgcolor: `${adventure.accent}0d`,
          p: 1.2,
        }}
      >
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
          <GiCompass size={22} color={adventure.accent} />
          <Box>
            <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
              Finais possiveis
            </Typography>
            <Typography sx={{ color: "#8f826c", fontSize: ".76rem" }}>
              Desfechos coerentes com escolhas, falhas e custos
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 0.8,
          }}
        >
          {adventure.endings.map((ending) => (
            <Paper key={ending.title} variant="outlined" sx={cardSx(adventure.accent)}>
              <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
                {ending.title}
              </Typography>
              <Typography sx={{ color: "#f7edd9", fontSize: ".88rem", lineHeight: 1.5, mt: 0.5 }}>
                {ending.outcome}
              </Typography>
              <Typography sx={{ color: "#b9a98b", fontSize: ".82rem", lineHeight: 1.45, mt: 0.55 }}>
                {ending.consequence}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

function MapCard({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: IconType;
  children: ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(0,0,0,.2)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 1.2, borderBottom: "1px solid rgba(217,200,159,.12)" }}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <Icon size={20} color="#c59b4b" />
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            {title}
          </Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          p: 1,
          bgcolor:
            "radial-gradient(circle at 50% 20%, rgba(197,155,75,.1), transparent 16rem), #090907",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

function EncounterMap({ adventure }: { adventure: AdventureGuide }) {
  const nodesById = new Map(adventure.nodes.map((node) => [node.id, node]));

  // O mapa de encontros nao tenta reproduzir planta exata do PDF. Ele mostra
  // fluxo de mesa: onde comeca, para onde as escolhas levam e onde estao PNJs,
  // inimigos e misterios. Para alterar, mexa nos nodes/links da aventura.
  return (
    <Stack spacing={1}>
      <Box sx={{ width: "100%", overflowX: "auto", ...smoothOverflowSx }}>
        <svg
          viewBox="0 0 100 60"
          role="img"
          aria-label={`Mapa de encontros de ${adventure.title}`}
          style={{
            width: "100%",
            minWidth: 640,
            display: "block",
            borderRadius: 8,
          }}
        >
          <defs>
            <linearGradient id={`encounter-bg-${adventure.id}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#10100d" />
              <stop offset="55%" stopColor="#17120e" />
              <stop offset="100%" stopColor="#090907" />
            </linearGradient>
            <filter id={`encounter-shadow-${adventure.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>

          <rect width="100" height="60" fill={`url(#encounter-bg-${adventure.id})`} />
          <path
            d="M4 51 C20 39 18 19 38 16 C55 13 62 34 78 28 C87 24 91 13 97 9"
            fill="none"
            stroke="rgba(197,155,75,.16)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {adventure.links.map(([fromId, toId]) => {
            const from = nodesById.get(fromId);
            const to = nodesById.get(toId);
            if (!from || !to) return null;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(247,237,217,.38)"
                strokeWidth="0.9"
                strokeDasharray="2 2"
              />
            );
          })}

          {adventure.nodes.map((node, index) => {
            const style = encounterStyles[node.kind];

            return (
              <g key={node.id} filter={`url(#encounter-shadow-${adventure.id})`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4.6"
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="0.9"
                />
                <text
                  x={node.x}
                  y={node.y + 1.25}
                  fill="#f7edd9"
                  fontSize="3.2"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {index + 1}
                </text>
                <text
                  x={node.x}
                  y={node.y + 8}
                  fill="#f7edd9"
                  fontSize="3"
                  fontWeight="900"
                  textAnchor="middle"
                  paintOrder="stroke"
                  stroke="#070706"
                  strokeWidth="1.2"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
        {Object.entries(encounterStyles).map(([kind, style]) => (
          <Chip
            key={kind}
            size="small"
            label={style.label}
            sx={{
              bgcolor: `${style.fill}55`,
              border: `1px solid ${style.stroke}55`,
              color: "#f7edd9",
            }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {adventure.nodes.map((node, index) => {
          const style = encounterStyles[node.kind];

          return (
            <Paper
              key={node.id}
              variant="outlined"
              sx={{
                borderColor: `${style.stroke}44`,
                bgcolor: "rgba(255,255,255,.035)",
                p: 0.9,
              }}
            >
              <Typography sx={{ color: style.stroke, fontWeight: 900 }}>
                {index + 1}. {node.label}
              </Typography>
              <Typography sx={{ color: "#d7c59d", fontSize: ".84rem", lineHeight: 1.45 }}>
                {node.note}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
}

function QuickStart({ adventure }: { adventure: AdventureGuide }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${adventure.accent}55`,
        bgcolor:
          `linear-gradient(135deg, ${adventure.accent}18, rgba(0,0,0,.18)), rgba(255,255,255,.035)`,
        p: { xs: 1.2, md: 1.4 },
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: `${adventure.accent}24`,
            color: adventure.accent,
            border: `1px solid ${adventure.accent}55`,
            flex: "0 0 auto",
          }}
        >
          <GiCampfire size={26} />
        </Box>
        <Box>
          <Typography sx={{ color: adventure.accent, fontWeight: 900 }}>
            Comeco da mesa
          </Typography>
          <Typography sx={{ color: "#f7edd9", mt: 0.5, lineHeight: 1.65 }}>
            {adventure.start}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function SceneCard({
  scene,
  index,
  selectedPlayers,
  accent,
}: {
  scene: SceneBeat;
  index: number;
  selectedPlayers: PlayerCount;
  accent: string;
}) {
  const scaledPressure = calculateDangerBudget(scene.pressure, selectedPlayers);

  // Cada cena tem dois textos de escala: o encontro completo para 7 jogadores
  // e a ressalva de reducao. O chip "pressao" aplica a conta escolhida no topo.
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${accent}33`,
        bgcolor: "rgba(17,17,15,.74)",
        boxShadow: `inset 4px 0 0 ${accent}66`,
        p: { xs: 1.2, md: 1.5 },
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
          <Chip icon={<GiCampfire size={15} />} label={`Cena ${index + 1}`} sx={{ bgcolor: `${accent}22` }} />
          <Chip icon={<GiCastle size={15} />} label={scene.location} />
          <Chip icon={<GiCrossedSwords size={15} />} label={`pressao ${scaledPressure}/${scene.pressure}`} />
        </Stack>

        <Box>
          <Typography sx={{ color: accent, fontWeight: 900, fontSize: "1.12rem" }}>
            {scene.title}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(scaledPressure / scene.pressure) * 100}
            sx={{
              height: 5,
              mt: 0.8,
              bgcolor: "rgba(255,255,255,.07)",
              ".MuiLinearProgress-bar": { bgcolor: accent },
            }}
          />
        </Box>

        <Typography
          sx={{
            color: "#f7edd9",
            lineHeight: 1.68,
            borderLeft: "1px solid rgba(217,200,159,.18)",
            pl: 1.2,
          }}
        >
          {scene.readAloud}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 1,
          }}
        >
          <Paper variant="outlined" sx={cardSx("#5fb6c4")}>
            <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
              Para 7 jogadores
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.55 }}>
              {scene.forSeven}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={cardSx("#f2c76c")}>
            <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
              Ressalva para mesa menor
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.55 }}>
              {scene.lowerPlayerReserve}
            </Typography>
          </Paper>
        </Box>

        <Typography sx={{ color: "#b9a98b", lineHeight: 1.55 }}>
          <strong>Mestre:</strong> {scene.gmGuidance}
        </Typography>

        <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap", alignItems: "stretch" }}>
          {scene.decisions.map((decision) => (
            <Chip
              key={decision}
              label={decision}
              sx={{
                maxWidth: "100%",
                height: "auto",
                py: 0.7,
                bgcolor: "rgba(255,255,255,.055)",
                color: "#f7edd9",
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function InfoGrid({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${accent}33`,
        bgcolor: "rgba(255,255,255,.032)",
        p: 1.3,
      }}
    >
      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 1 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: 1.2,
            display: "grid",
            placeItems: "center",
            bgcolor: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
          }}
        >
          <GiSpellBook size={16} />
        </Box>
        <Typography sx={{ color: accent, fontWeight: 900 }}>
          {title}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.8,
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item}
            sx={{
              display: "grid",
              gridTemplateColumns: "28px minmax(0, 1fr)",
              gap: 0.8,
              border: "1px solid rgba(217,200,159,.1)",
              bgcolor: "rgba(0,0,0,.18)",
              p: 0.85,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: `${accent}24`,
                color: accent,
                fontSize: ".75rem",
                fontWeight: 900,
              }}
            >
              {index + 1}
            </Box>
            <Typography sx={{ color: "#d7c59d", lineHeight: 1.55 }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function cardSx(accent: string) {
  return {
    borderColor: `${accent}33`,
    bgcolor: "rgba(255,255,255,.035)",
    color: "#f7edd9",
    p: 1.2,
  };
}
