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

function getViewBoxSize(viewBox: string) {
  const values = viewBox.split(/\s+/).map(Number);
  return {
    width: values[2] || 900,
    height: values[3] || 620,
  };
}

function getPathCenter(d: string) {
  const values = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const points: Array<{ x: number; y: number }> = [];

  for (let index = 0; index < values.length - 1; index += 2) {
    points.push({ x: values[index], y: values[index + 1] });
  }

  if (points.length === 0) return { x: 0, y: 0 };

  return {
    x: points.reduce((acc, point) => acc + point.x, 0) / points.length,
    y: points.reduce((acc, point) => acc + point.y, 0) / points.length,
  };
}

function truncateMapLabel(label: string, maxLength = 24) {
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}.` : label;
}

export function MapSvg({
  mapId,
  revealSecrets,
  showPointLabels = revealSecrets,
  compact = false,
}: {
  mapId: string;
  revealSecrets: boolean;
  showPointLabels?: boolean;
  compact?: boolean;
}) {
  const map = adventureMaps.find((currentMap) => currentMap.id === mapId) ?? adventureMaps[0];
  const { width, height } = getViewBoxSize(map.viewBox);
  const frameInset = Math.max(18, Math.round(Math.min(width, height) * 0.035));
  const compassX = width - frameInset - 54;
  const compassY = frameInset + 54;
  const minWidth = compact ? 560 : showPointLabels ? 720 : 620;

  return (
    <svg
      viewBox={map.viewBox}
      role="img"
      aria-label={map.title}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        minWidth,
        display: "block",
      }}
    >
      <defs>
        <linearGradient id={`map-bg-${map.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#18130d" />
          <stop offset="42%" stopColor="#100f0c" />
          <stop offset="100%" stopColor="#070706" />
        </linearGradient>
        <radialGradient id={`map-glow-${map.id}`} cx="48%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#c59b4b" stopOpacity="0.18" />
          <stop offset="54%" stopColor="#5fb6c4" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#050504" stopOpacity="0.68" />
        </radialGradient>
        <filter id={`map-shadow-${map.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity="0.54" />
        </filter>
        <filter id={`map-ink-${map.id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#000" floodOpacity="0.7" />
        </filter>
        <pattern id={`grid-${map.id}`} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(217,200,159,.075)" strokeWidth="1" />
          <path d="M 18 0 L 18 36 M 0 18 L 36 18" fill="none" stroke="rgba(217,200,159,.035)" strokeWidth="1" />
        </pattern>
        <pattern id={`paper-${map.id}`} width="96" height="96" patternUnits="userSpaceOnUse">
          <path d="M12 18 C28 10 42 18 58 12 S84 12 92 22" fill="none" stroke="rgba(247,237,217,.035)" strokeWidth="2" />
          <path d="M6 70 C24 58 40 75 58 64 S80 60 94 70" fill="none" stroke="rgba(197,155,75,.035)" strokeWidth="2" />
        </pattern>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill={`url(#map-bg-${map.id})`} />
      <rect x="0" y="0" width={width} height={height} fill={`url(#map-glow-${map.id})`} />
      <rect x="0" y="0" width={width} height={height} fill={`url(#grid-${map.id})`} />
      <rect x="0" y="0" width={width} height={height} fill={`url(#paper-${map.id})`} opacity="0.88" />

      <rect
        x={frameInset}
        y={frameInset}
        width={width - frameInset * 2}
        height={height - frameInset * 2}
        rx="18"
        fill="none"
        stroke="rgba(217,200,159,.24)"
        strokeWidth="2"
      />
      <rect
        x={frameInset + 8}
        y={frameInset + 8}
        width={width - (frameInset + 8) * 2}
        height={height - (frameInset + 8) * 2}
        rx="12"
        fill="none"
        stroke="rgba(197,155,75,.12)"
        strokeWidth="1.5"
      />

      {map.regions.map((region) => (
        <path
          key={`${region.id}-wash`}
          d={region.d}
          fill="none"
          stroke={region.stroke ?? "#5b5141"}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.1"
        />
      ))}

      {map.regions.map((region) => (
        <path
          key={region.id}
          d={region.d}
          fill={region.fill}
          stroke={region.stroke ?? "#5b5141"}
          strokeWidth="3.5"
          strokeLinejoin="round"
          filter={`url(#map-shadow-${map.id})`}
        />
      ))}

      {map.regions.map((region) => {
        if (!region.label || compact) return null;
        const center = getPathCenter(region.d);

        return (
          <text
            key={`${region.id}-label`}
            x={center.x}
            y={center.y}
            fill="rgba(247,237,217,.72)"
            fontSize="18"
            fontWeight="900"
            textAnchor="middle"
            paintOrder="stroke"
            stroke="#070706"
            strokeWidth="5"
          >
            {truncateMapLabel(region.label, 28)}
          </text>
        );
      })}

      {map.routes.map((route) => {
        const routeId = `route-${map.id}-${route.id}`;

        return (
          <g key={route.id}>
            <path
              id={routeId}
              d={route.d}
              fill="none"
              stroke={route.danger ? "#aa263d" : "#c59b4b"}
              strokeWidth={route.danger ? 5.5 : 4.5}
              strokeDasharray={route.danger ? "10 9" : "0"}
              strokeLinecap="round"
              opacity="0.9"
              filter={`url(#map-ink-${map.id})`}
            />
            {route.label && !compact && (
              <text
                fill={route.danger ? "#ffb2b8" : "#f7edd9"}
                fontSize="15"
                fontWeight="900"
                paintOrder="stroke"
                stroke="#070706"
                strokeWidth="4"
              >
                <textPath href={`#${routeId}`} startOffset="50%" textAnchor="middle">
                  {route.label}
                </textPath>
              </text>
            )}
          </g>
        );
      })}

      {map.points.map((point, index) => {
        const style = pointStyles[point.type];
        const label = revealSecrets
          ? `${index + 1}. ${truncateMapLabel(point.label)}`
          : truncateMapLabel(point.label, 22);

        return (
          <g key={point.id} filter={`url(#map-ink-${map.id})`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="23"
              fill={style.fill}
              opacity="0.2"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="15"
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth="3"
            />
            <circle cx={point.x} cy={point.y} r="5" fill="#f7edd9" opacity="0.94" />
            {(revealSecrets || showPointLabels) && (
              <text
                x={point.x}
                y={point.y + 34}
                fill="#f7edd9"
                fontSize={showPointLabels ? 16 : 18}
                fontWeight="900"
                textAnchor="middle"
                paintOrder="stroke"
                stroke="#070706"
                strokeWidth="4.5"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}

      {!compact && (
        <g opacity="0.9">
          <circle
            cx={compassX}
            cy={compassY}
            r="34"
            fill="rgba(7,7,6,.55)"
            stroke="rgba(217,200,159,.28)"
            strokeWidth="2"
          />
          <path
            d={`M${compassX} ${compassY - 25} L${compassX + 8} ${compassY + 8} L${compassX} ${compassY + 3} L${compassX - 8} ${compassY + 8} Z`}
            fill="#c59b4b"
            stroke="#f7edd9"
            strokeWidth="1.2"
          />
          <text
            x={compassX}
            y={compassY + 28}
            fill="#f7edd9"
            fontSize="14"
            fontWeight="900"
            textAnchor="middle"
          >
            N
          </text>
        </g>
      )}

      <text
        x={frameInset + 20}
        y={height - frameInset - 18}
        fill="rgba(217,200,159,.66)"
        fontSize="14"
        fontWeight="900"
      >
        {map.type.toUpperCase()} / {map.source}
      </text>
    </svg>
  );
}
