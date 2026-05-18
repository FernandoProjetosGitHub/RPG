import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  GiCastle,
  GiCaveEntrance,
  GiCompass,
  GiFootsteps,
  GiMountainCave,
  GiSecretBook,
  GiSkullCrossedBones,
  GiTreasureMap,
  GiVillage,
} from "react-icons/gi";
import { MapSvg, pointStyles } from "../AdventureMapsDialog";
import {
  adventureMaps,
  type AdventureMap,
  type AdventureMapPoint,
} from "../../data/adventureMaps";

const mapTypeIcons: Record<AdventureMap["type"], IconType> = {
  mundi: GiCompass,
  regiao: GiMountainCave,
  masmorra: GiCaveEntrance,
  cidade: GiVillage,
};

const pointTypeIcons: Record<AdventureMapPoint["type"], IconType> = {
  safe: GiVillage,
  danger: GiSkullCrossedBones,
  mystery: GiSecretBook,
  route: GiFootsteps,
  site: GiCastle,
};

export default function MapAtlas() {
  const [selectedMapId, setSelectedMapId] = useState(adventureMaps[0].id);
  // A pagina publica usa a mesma fonte de mapas do modal da ficha. Isso evita
  // dois atlas divergentes entre area publica, jogador e mestre.
  const selectedMap =
    adventureMaps.find((map) => map.id === selectedMapId) ?? adventureMaps[0];
  const SelectedTypeIcon = mapTypeIcons[selectedMap.type];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "310px minmax(0, 1fr)" },
        gap: 1.4,
        alignItems: "start",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          position: { xs: "static", lg: "sticky" },
          top: { lg: 92 },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.16)",
            bgcolor: "rgba(255,255,255,.04)",
            p: 1,
          }}
        >
          <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.9 }}>
            Atlas da campanha
          </Typography>
          <Stack spacing={0.75}>
            {adventureMaps.map((map) => (
              <MapSelectorButton
                key={map.id}
                map={map}
                selected={map.id === selectedMap.id}
                onSelect={() => setSelectedMapId(map.id)}
              />
            ))}
          </Stack>
        </Paper>

        <MapLegend />
      </Stack>

      <Stack spacing={1.2} sx={{ minWidth: 0 }}>
        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.18)",
            bgcolor: "rgba(0,0,0,.26)",
            overflow: "hidden",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(217,200,159,.12)",
              p: 1.2,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "#100b08",
                  bgcolor: "#c59b4b",
                  flex: "0 0 auto",
                }}
              >
                <SelectedTypeIcon size={24} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
                  {selectedMap.title}
                </Typography>
                <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
                  {selectedMap.subtitle}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap" }}>
              <Chip size="small" label={selectedMap.type} />
              <Chip size="small" label={`${selectedMap.points.length} pontos`} />
              <Chip size="small" label={`${selectedMap.routes.length} rotas`} />
            </Stack>
          </Stack>

          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              bgcolor:
                "radial-gradient(circle at 50% 30%, rgba(197,155,75,.08), transparent 18rem), #090907",
            }}
          >
            <MapSvg
              mapId={selectedMap.id}
              revealSecrets={false}
              showPointLabels
            />
          </Box>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: ".85fr 1.15fr" },
            gap: 1.2,
            alignItems: "start",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(95,182,196,.16)",
              bgcolor: "rgba(95,182,196,.055)",
              p: 1.35,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                <GiTreasureMap size={22} color="#5fb6c4" />
                <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                  Leitura de mesa
                </Typography>
              </Stack>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.65 }}>
                {selectedMap.summary}
              </Typography>
              <Typography sx={{ color: "#8f826c", fontSize: ".78rem", lineHeight: 1.45 }}>
                Base: {selectedMap.source}
              </Typography>
            </Stack>
          </Paper>

          <MapPointGrid map={selectedMap} />
        </Box>
      </Stack>
    </Box>
  );
}

function MapSelectorButton({
  map,
  selected,
  onSelect,
}: {
  map: AdventureMap;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = mapTypeIcons[map.type];

  return (
    <Button
      variant={selected ? "contained" : "outlined"}
      onClick={onSelect}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        gap: 1,
        minHeight: 62,
        px: 1,
      }}
    >
      <Icon size={22} />
      <Box component="span" sx={{ minWidth: 0 }}>
        <Typography component="span" sx={{ display: "block", fontWeight: 900 }}>
          {map.title}
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: ".72rem",
            opacity: 0.82,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {map.type} / {map.points.length} marcos
        </Typography>
      </Box>
    </Button>
  );
}

function MapLegend() {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
        Legenda
      </Typography>
      <Stack spacing={0.65}>
        {Object.entries(pointStyles).map(([type, style]) => {
          const Icon = pointTypeIcons[type as AdventureMapPoint["type"]];

          return (
            <Stack
              key={type}
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: `${style.fill}44`,
                  border: `1px solid ${style.stroke}66`,
                  color: style.stroke,
                  flex: "0 0 auto",
                }}
              >
                <Icon size={16} />
              </Box>
              <Typography sx={{ color: "#d7c59d", fontSize: ".86rem", fontWeight: 800 }}>
                {style.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}

function MapPointGrid({ map }: { map: AdventureMap }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 0.85,
      }}
    >
      {map.points.map((point, index) => {
        const style = pointStyles[point.type];
        const Icon = pointTypeIcons[point.type];

        // Cada ponto recebe cor pela categoria narrativa: apoio, perigo,
        // misterio, rota ou local. A cor ajuda o mestre a ler a cena rapido.
        return (
          <Paper
            key={point.id}
            variant="outlined"
            sx={{
              borderColor: `${style.stroke}44`,
              bgcolor: "rgba(255,255,255,.035)",
              p: 1,
            }}
          >
            <Stack spacing={0.55}>
              <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: `${style.fill}44`,
                    border: `1px solid ${style.stroke}66`,
                    color: style.stroke,
                    flex: "0 0 auto",
                  }}
                >
                  <Icon size={18} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
                    {index + 1}. {point.label}
                  </Typography>
                  <Typography sx={{ color: style.stroke, fontSize: ".72rem", fontWeight: 900 }}>
                    {pointStyles[point.type].label}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.5 }}>
                {point.detail}
              </Typography>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}
