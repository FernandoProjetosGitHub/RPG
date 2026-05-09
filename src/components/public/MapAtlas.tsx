import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MapSvg, pointStyles } from "../AdventureMapsDialog";
import { adventureMaps } from "../../data/adventureMaps";

export default function MapAtlas() {
  const [selectedMapId, setSelectedMapId] = useState(adventureMaps[0].id);
  // A pagina publica usa a mesma fonte de mapas do modal da ficha. Isso evita
  // dois atlas divergentes entre area publica, jogador e mestre.
  const selectedMap =
    adventureMaps.find((map) => map.id === selectedMapId) ?? adventureMaps[0];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
        gap: 1.5,
      }}
    >
      <Stack spacing={1}>
        {adventureMaps.map((map) => (
          <Button
            key={map.id}
            variant={map.id === selectedMap.id ? "contained" : "outlined"}
            onClick={() => setSelectedMapId(map.id)}
            sx={{ justifyContent: "flex-start", textAlign: "left" }}
          >
            {map.title}
          </Button>
        ))}

        <MapLegend />
      </Stack>

      <Stack spacing={1.2} sx={{ minWidth: 0 }}>
        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.16)",
            bgcolor: "rgba(0,0,0,.2)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              bgcolor:
                "radial-gradient(circle at 50% 30%, rgba(197,155,75,.08), transparent 18rem), #090907",
            }}
          >
            <MapSvg mapId={selectedMap.id} revealSecrets={false} />
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(95,182,196,.14)",
            bgcolor: "rgba(255,255,255,.04)",
            p: 1.4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {selectedMap.title}
          </Typography>
          <Typography sx={{ color: "#b9a98b", mt: 0.4 }}>
            {selectedMap.subtitle}
          </Typography>
          <Typography sx={{ color: "#d7c59d", lineHeight: 1.65, mt: 1 }}>
            {selectedMap.summary}
          </Typography>
          <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", mt: 1 }}>
            <Chip label={selectedMap.type} />
            <Chip label={selectedMap.source} />
          </Stack>
        </Paper>

        <MapPointGrid mapId={selectedMap.id} />
      </Stack>
    </Box>
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
      <Stack direction="row" useFlexGap gap={0.8} sx={{ flexWrap: "wrap" }}>
        {Object.entries(pointStyles).map(([type, style]) => (
          <Chip
            key={type}
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
    </Paper>
  );
}

function MapPointGrid({ mapId }: { mapId: string }) {
  const selectedMap =
    adventureMaps.find((map) => map.id === mapId) ?? adventureMaps[0];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 1,
      }}
    >
      {selectedMap.points.map((point) => {
        const style = pointStyles[point.type];

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
            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: style.fill,
                  border: `1px solid ${style.stroke}`,
                  flex: "0 0 auto",
                }}
              />
              <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
                {point.label}
              </Typography>
            </Stack>
            <Typography sx={{ color: "#d7c59d", mt: 0.6, fontSize: ".9rem" }}>
              {point.detail}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
