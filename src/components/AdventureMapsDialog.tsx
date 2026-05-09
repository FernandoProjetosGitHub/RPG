import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { adventureMaps, type AdventureMapPoint } from "../data/adventureMaps";

type AdventureMapsDialogProps = {
  open: boolean;
  onClose: () => void;
  audience?: "player" | "master";
};

export const pointStyles: Record<
  AdventureMapPoint["type"],
  { fill: string; stroke: string; label: string }
> = {
  safe: { fill: "#24706d", stroke: "#9ee8dd", label: "apoio" },
  danger: { fill: "#8f2637", stroke: "#ffb2b8", label: "perigo" },
  mystery: { fill: "#7f6fd9", stroke: "#d8d1ff", label: "misterio" },
  route: { fill: "#c59b4b", stroke: "#f7edd9", label: "rota" },
  site: { fill: "#5f7f4f", stroke: "#d8efbd", label: "local" },
};

export default function AdventureMapsDialog({
  open,
  onClose,
  audience = "player",
}: AdventureMapsDialogProps) {
  const [selectedMapId, setSelectedMapId] = useState(adventureMaps[0].id);
  const selectedMap = useMemo(
    () =>
      adventureMaps.find((map) => map.id === selectedMapId) ?? adventureMaps[0],
    [selectedMapId],
  );
  const isMaster = audience === "master";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          bgcolor: "#11110f",
          color: "#f7edd9",
          border: "1px solid rgba(217,200,159,.18)",
          maxHeight: "92dvh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
          Mapas da mesa
        </Typography>
        <Typography sx={{ color: "#b9a98b", fontSize: ".88rem" }}>
          Mapa mundi e mapas pertinentes das aventuras guiadas
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px minmax(0, 1fr)" },
          gap: 2,
          pt: 1,
        }}
      >
        <Stack spacing={1}>
          {adventureMaps.map((map) => {
            const selected = map.id === selectedMap.id;

            return (
              <Button
                key={map.id}
                fullWidth
                variant={selected ? "contained" : "outlined"}
                onClick={() => setSelectedMapId(map.id)}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  py: 1.1,
                }}
              >
                {map.title}
              </Button>
            );
          })}

          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(217,200,159,.14)",
              bgcolor: "rgba(255,255,255,.04)",
              p: 1.2,
              mt: 1,
            }}
          >
            <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.7 }}>
              Legenda
            </Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.8}>
              {Object.entries(pointStyles).map(([type, style]) => (
                <Chip
                  key={type}
                  size="small"
                  label={style.label}
                  sx={{
                    bgcolor: `${style.fill}55`,
                    border: `1px solid ${style.stroke}55`,
                    color: "#f7edd9",
                    maxWidth: "100%",
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Stack>

        <Stack spacing={1.4} sx={{ minWidth: 0 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {selectedMap.title}
            </Typography>
            <Typography sx={{ color: "#b9a98b", lineHeight: 1.55 }}>
              {selectedMap.subtitle}
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(217,200,159,.16)",
              bgcolor: "rgba(0,0,0,.18)",
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
              <MapSvg mapId={selectedMap.id} revealSecrets={isMaster} />
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
            <Typography sx={{ color: "#d7c59d", lineHeight: 1.65 }}>
              {isMaster
                ? selectedMap.summary
                : "Mapa visual para orientacao da mesa. Detalhes de ameacas, segredos, rotas ocultas e notas de conducao ficam reservados ao mestre e aparecem conforme forem descobertos em jogo."}
            </Typography>
            <Typography sx={{ color: "#8f826c", mt: 1, fontSize: ".78rem" }}>
              Base: {selectedMap.source}
            </Typography>
          </Paper>

          {isMaster ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" },
              gap: 1.2,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                borderColor: "rgba(217,200,159,.14)",
                bgcolor: "rgba(255,255,255,.04)",
                p: 1.4,
              }}
            >
              <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
                Pontos do mapa
              </Typography>
              <Stack spacing={1}>
                {selectedMap.points.map((point, index) => {
                  const style = pointStyles[point.type];

                  return (
                    <Box key={point.id}>
                      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: style.fill,
                            border: `1px solid ${style.stroke}`,
                            flex: "0 0 auto",
                          }}
                        />
                        <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
                          {index + 1}. {point.label}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          color: "#b9a98b",
                          fontSize: ".86rem",
                          lineHeight: 1.5,
                          mt: 0.2,
                        }}
                      >
                        {point.detail}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                borderColor: "rgba(197,155,75,.16)",
                bgcolor: "rgba(197,155,75,.08)",
                p: 1.4,
              }}
            >
              <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
                Uso rapido do mestre
              </Typography>
              <Stack component="ul" spacing={0.8} sx={{ m: 0, pl: 2.2 }}>
                {selectedMap.gmNotes.map((note) => (
                  <Typography
                    key={note}
                    component="li"
                    sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.55 }}
                  >
                    {note}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          </Box>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                borderColor: "rgba(217,200,159,.14)",
                bgcolor: "rgba(255,255,255,.04)",
                p: 1.4,
              }}
            >
              <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.6 }}>
                Visao do jogador
              </Typography>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.6 }}>
                Use este mapa para se localizar, combinar viagens e lembrar
                lugares ja apresentados. Pontos secretos, monstros, frentes e
                consequencias ficam no painel do mestre.
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function MapSvg({
  mapId,
  revealSecrets,
}: {
  mapId: string;
  revealSecrets: boolean;
}) {
  const map = adventureMaps.find((currentMap) => currentMap.id === mapId) ?? adventureMaps[0];

  return (
    <svg
      viewBox={map.viewBox}
      role="img"
      aria-label={map.title}
      style={{
        width: "100%",
        minWidth: 680,
        display: "block",
      }}
    >
      <defs>
        <filter id={`map-shadow-${map.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <pattern id={`grid-${map.id}`} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(217,200,159,.08)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="100%" height="100%" fill={`url(#grid-${map.id})`} />

      {map.regions.map((region) => (
        <path
          key={region.id}
          d={region.d}
          fill={region.fill}
          stroke={region.stroke ?? "#5b5141"}
          strokeWidth="3"
          filter={`url(#map-shadow-${map.id})`}
        />
      ))}

      {map.routes.map((route) => (
        <path
          key={route.id}
          d={route.d}
          fill="none"
          stroke={route.danger ? "#aa263d" : "#c59b4b"}
          strokeWidth={route.danger ? 5 : 4}
          strokeDasharray={route.danger ? "10 9" : "0"}
          strokeLinecap="round"
          opacity="0.86"
        />
      ))}

      {map.points.map((point, index) => {
        const style = pointStyles[point.type];

        return (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r="14"
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth="3"
            />
            <circle cx={point.x} cy={point.y} r="5" fill="#f7edd9" opacity="0.92" />
            <text
              x={point.x}
              y={point.y + 31}
              fill="#f7edd9"
              fontSize="18"
              fontWeight="900"
              textAnchor="middle"
              paintOrder="stroke"
              stroke="#070706"
              strokeWidth="4"
            >
              {revealSecrets ? index + 1 : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
