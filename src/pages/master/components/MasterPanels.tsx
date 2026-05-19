import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import type { gmReferenceSections, monsterReferences } from "../../../data/gmReference";

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card
      sx={{
        border: "1px solid rgba(217,200,159,.16)",
        borderRadius: 3,
        bgcolor: "rgba(17,17,15,.92)",
        color: "#f7edd9",
      }}
    >
      <CardContent>
        <Stack spacing={1.4}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
              {title}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setExpanded((current) => !current)}
              sx={{ flex: "0 0 auto" }}
            >
              {expanded ? "Recolher" : "Expandir"}
            </Button>
          </Stack>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 0.2 }}>{children}</Box>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function MasterTabBack({ onBack }: { onBack: () => void }) {
  return (
    <Button
      variant="outlined"
      onClick={onBack}
      sx={{ alignSelf: "flex-start" }}
    >
      Voltar ao painel do mestre
    </Button>
  );
}

export function GmReferenceCard({
  section,
}: {
  section: (typeof gmReferenceSections)[number];
}) {
  return (
    <SectionCard title={section.title}>
      <Stack spacing={1}>
        <Chip
          label={section.source}
          sx={{
            alignSelf: "flex-start",
            bgcolor: "rgba(197,155,75,.14)",
            color: "#f7edd9",
          }}
        />
        <Stack component="ul" spacing={0.8} sx={{ m: 0, pl: 2.2 }}>
          {section.bullets.map((bullet) => (
            <Typography
              key={bullet}
              component="li"
              sx={{ color: "#d7c59d", fontSize: ".92rem", lineHeight: 1.6 }}
            >
              {bullet}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </SectionCard>
  );
}

export function MonsterReferenceCard({
  monster,
  expanded,
  onToggle,
}: {
  monster: (typeof monsterReferences)[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Paper
      component="button"
      variant="outlined"
      onClick={onToggle}
      sx={{
        appearance: "none",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        borderColor: expanded
          ? "rgba(197,155,75,.42)"
          : "rgba(217,200,159,.16)",
        bgcolor: "rgba(17,17,15,.92)",
        color: "#f7edd9",
        p: 1.4,
        transition: "border-color .18s ease, transform .18s ease",
        "&:hover": {
          borderColor: "rgba(242,199,108,.55)",
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: "2px solid #f2c76c",
          outlineOffset: 2,
        },
      }}
    >
      <Stack spacing={1.1}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
              {monster.name}
            </Typography>
            <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
              {monster.source}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            component="span"
            sx={{ pointerEvents: "none" }}
          >
            {expanded ? "Recolher" : "Expandir"}
          </Button>
        </Stack>

        <Stack direction="row" useFlexGap gap={0.8} sx={{ flexWrap: "wrap" }}>
          <Chip size="small" label={`PV ${monster.hp}`} />
          <Chip size="small" label={`Armadura ${monster.armor}`} />
          <Chip size="small" label={`Dano: ${monster.damage}`} />
        </Stack>

        {expanded && (
          <Stack spacing={1}>
            <Stack direction="row" useFlexGap gap={0.7} sx={{ flexWrap: "wrap" }}>
              {monster.tags.map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  sx={{
                    bgcolor: "rgba(95,182,196,.14)",
                    color: "#f7edd9",
                  }}
                />
              ))}
            </Stack>

            <Typography sx={{ color: "#d7c59d", lineHeight: 1.55 }}>
              <strong>Instinto:</strong> {monster.instinct}
            </Typography>

            {monster.damageDetail && (
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.55 }}>
                <strong>Dano e adicionais:</strong> {monster.damageDetail}
              </Typography>
            )}

            {monster.effects && monster.effects.length > 0 && (
              <Box>
                <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.5 }}>
                  Condicoes e efeitos
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.2 }}>
                  {monster.effects.map((effect) => (
                    <Typography
                      key={effect}
                      component="li"
                      sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.5 }}
                    >
                      {effect}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {monster.rollMoves && monster.rollMoves.length > 0 && (
              <Box>
                <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.5 }}>
                  Rolagens especiais
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.2 }}>
                  {monster.rollMoves.map((rollMove) => (
                    <Typography
                      key={rollMove}
                      component="li"
                      sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.5 }}
                    >
                      {rollMove}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.5 }}>
                Movimentos
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.2 }}>
                {monster.moves.map((move) => (
                  <Typography
                    key={move}
                    component="li"
                    sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.5 }}
                  >
                    {move}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {monster.notes && (
              <Typography sx={{ color: "#b9a98b", fontSize: ".86rem", lineHeight: 1.5 }}>
                {monster.notes}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export function ResourceMeter({
  label,
  current,
  max,
  percent,
  color,
}: {
  label: string;
  current: number;
  max: number;
  percent: number;
  color: string;
}) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.6 }}>
        <Typography sx={{ fontWeight: 900 }}>{label}</Typography>
        <Typography sx={{ color: "#b9a98b" }}>
          {current} / {max}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(100, percent))}
        sx={{
          height: 12,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,.08)",
          ".MuiLinearProgress-bar": { bgcolor: color },
        }}
      />
    </Box>
  );
}

export function LockGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

export function LockButton({
  label,
  locked,
  onLock,
  onUnlock,
}: {
  label: string;
  locked: boolean;
  onLock: () => void;
  onUnlock: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.1, bgcolor: "rgba(255,255,255,.04)" }}>
      <Stack spacing={1}>
        <Chip
          label={`${label}: ${locked ? "travado" : "aberto"}`}
          sx={{
            bgcolor: locked ? "rgba(170,38,61,.18)" : "rgba(36,112,109,.18)",
            color: "#f7edd9",
          }}
        />
        <Stack direction="row" spacing={1}>
          <Button fullWidth size="small" variant="outlined" onClick={onUnlock}>
            Abrir
          </Button>
          <Button fullWidth size="small" variant="contained" onClick={onLock}>
            Trancar
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export function MoveCardGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

export function MoveCard({
  title,
  chips,
  body,
  footer,
}: {
  title: string;
  chips: string[];
  body: string;
  footer?: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: 150,
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        color: "#f7edd9",
        p: 1.4,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={0.7} sx={{ flexWrap: "wrap" }}>
          {chips.map((chip) => (
            <Chip key={chip} label={chip} size="small" />
          ))}
        </Stack>
        <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.55 }}>
          {body}
        </Typography>
        {footer && (
          <Typography sx={{ color: "#b9a98b", fontSize: ".78rem" }}>
            {footer}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
