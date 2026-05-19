import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import ClassMark from "../../../components/public/ClassMark";
import { basicMoves } from "../../../data/dwMoves";
import { dwRollOutcomes } from "../../../data/dwRollOutcomes";
import type { SpellRisk } from "../../../data/spells";
import {
  attributeLabels,
  type AttributeKey,
  type EquipmentSlot,
  type PlayerProfileSummary,
} from "../../../types/character";
import type {
  CombatAction,
  CombatRoll,
  MoveRoll,
  SheetConsumable,
  SheetItem,
  SpellCastRoll,
} from "../types";

export function ResourceBar({
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
      <Stack
        sx={{ flexDirection: "row", justifyContent: "space-between", mb: 0.6 }}
      >
        <Typography sx={{ fontWeight: 900 }}>{label}</Typography>

        <Typography sx={{ color: "#b9a98b" }}>
          {current} / {max}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percent}
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

export function SheetStatusGrid({
  items,
}: {
  items: Array<{
    Icon: IconType;
    label: string;
    value: string;
    tone?: string;
  }>;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(5, minmax(0, 1fr))",
        },
        gap: 0.8,
      }}
    >
      {items.map(({ Icon, label, value, tone = "#f7edd9" }) => (
        <Paper
          key={label}
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.14)",
            bgcolor: "rgba(255,255,255,.035)",
            p: 0.9,
          }}
        >
          <Stack spacing={0.45}>
            <Icon size={20} color={tone} />
            <Typography sx={{ color: "#b9a98b", fontSize: ".7rem", fontWeight: 900 }}>
              {label}
            </Typography>
            <Typography sx={{ color: tone, fontWeight: 900, lineHeight: 1 }}>
              {value}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

export function parseDice(dice: string) {
  const match = dice.match(/^(\d+)d(\d+)$/);

  return {
    diceCount: match ? Number(match[1]) : 1,
    dieSize: match ? Number(match[2]) : Number(dice.replace("d", "")),
  };
}

export function InfoPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        borderRadius: 3,
        bgcolor: "rgba(0,0,0,.2)",
        color: "#f7edd9",
        p: 1.6,
      }}
    >
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>

      {children}
    </Paper>
  );
}

export function DescriptionStat({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#b9a98b", fontSize: ".72rem" }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export function DescriptionSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.8 }}>
        {title}
      </Typography>
      <Stack component="ul" spacing={0.8} sx={{ pl: 2.3, m: 0 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            sx={{
              color: "#d7c59d",
              fontSize: ".92rem",
              lineHeight: 1.65,
              pl: 0.4,
            }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function BeginnerConceptCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(95,182,196,.16)",
        bgcolor: "rgba(255,255,255,.04)",
        p: 1.35,
      }}
    >
      <Typography sx={{ color: "#5fb6c4", fontWeight: 900, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Paper>
  );
}

export function CombatStat({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        color: "#f7edd9",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#b9a98b", fontSize: ".72rem" }}>
        {label}
      </Typography>

      <Typography sx={{ fontWeight: 900, fontSize: "1.05rem" }}>
        {value}
      </Typography>
    </Paper>
  );
}

export function ExpandableSheetCard({
  title,
  subtitle,
  chips,
  accent = "#c59b4b",
  selected = false,
  children,
}: {
  title: string;
  subtitle?: string;
  chips: ReactNode[];
  accent?: string;
  selected?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Este card e o padrao de leitura da ficha: resumo fechado para economizar
  // espaco no celular, detalhes abertos por clique para consulta em mesa.
  // O conteudo interno bloqueia o clique para botoes e selects nao fecharem o card.
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
        borderColor: selected ? `${accent}99` : "rgba(217,200,159,.14)",
        bgcolor: selected ? `${accent}18` : "rgba(255,255,255,.04)",
        color: "#f7edd9",
        cursor: "pointer",
        p: 1.35,
        transition: "border-color .18s ease, background .18s ease",
        "&:focus-visible": {
          outline: "2px solid rgba(255,243,220,.72)",
          outlineOffset: 2,
          borderColor: "#f2c76c",
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {chips.map((chip, index) => (
            <Box key={index}>{chip}</Box>
          ))}
        </Stack>

        <Box>
          <Typography sx={{ color: selected ? "#fff3dc" : accent, fontWeight: 900 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "#b9a98b", fontSize: ".78rem", lineHeight: 1.45 }}>
              {subtitle}
            </Typography>
          )}
          <Typography sx={{ color: "#8f8268", fontSize: ".72rem", mt: 0.35 }}>
            {isOpen ? "Clique no topo para recolher" : "Clique no card para expandir"}
          </Typography>
        </Box>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box onClick={(event) => event.stopPropagation()} sx={{ pt: 0.2 }}>
            {children}
          </Box>
        </Collapse>
      </Stack>
    </Paper>
  );
}

export function ConsumableCard({
  item,
  currentUses,
  mode,
  playerProfiles,
  selectedPlayerIndex,
  targetIndex = selectedPlayerIndex,
  onTargetChange,
  onUse,
}: {
  item: SheetConsumable;
  currentUses: number;
  mode: "view" | "use";
  playerProfiles: PlayerProfileSummary[];
  selectedPlayerIndex: number;
  targetIndex?: number;
  onTargetChange?: (targetIndex: number) => void;
  onUse?: () => void;
}) {
  const hasUses = currentUses > 0;
  const targetProfile =
    playerProfiles.find((profile) => profile.index === targetIndex) ??
    playerProfiles.find((profile) => profile.index === selectedPlayerIndex);

  return (
    <ExpandableSheetCard
      title={item.name}
      subtitle={item.source}
      accent="#5fb6c4"
      selected={hasUses}
      chips={[
        <Chip
          key="uses"
          label={`${currentUses}/${item.maxUses}`}
          sx={{
            bgcolor: hasUses ? "rgba(95,182,196,.24)" : "rgba(170,38,61,.2)",
            color: hasUses ? "#e9fbff" : "#ffd7dc",
            fontWeight: 900,
          }}
        />,
        <Chip key="weight" label={`peso ${item.weight}`} />,
        ...item.tags.map((tag) => <Chip key={tag} label={tag} />),
      ]}
    >
      <Stack spacing={1}>
        <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.6 }}>
          {item.description}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".85rem", lineHeight: 1.55 }}>
          {item.useText}
        </Typography>

        {item.restText && (
          <Typography sx={{ color: "#ffcf8a", fontSize: ".82rem", lineHeight: 1.5 }}>
            {item.restText}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={`Efeito: ${item.effect.label}`} />
          <Chip label={item.canTargetAlly ? "pode ajudar aliado" : "uso situacional"} />
        </Stack>

        {mode === "view" && (
          <Typography sx={{ color: "#8f8268", fontSize: ".8rem", lineHeight: 1.45 }}>
            Visualizacao do inventario. O gasto de uso fica na aba Combate para
            evitar consumo acidental durante organizacao da mochila.
          </Typography>
        )}

        {mode === "use" && (
          <Stack spacing={1}>
            {item.canTargetAlly && playerProfiles.length > 0 && (
              <FormControl fullWidth size="small" disabled={!hasUses}>
                <InputLabel sx={{ color: "#b9a98b" }}>Usar em</InputLabel>
                <Select
                  label="Usar em"
                  value={targetIndex}
                  onChange={(event) => onTargetChange?.(Number(event.target.value))}
                  sx={{
                    color: "#f7edd9",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(217,200,159,.22)",
                    },
                    ".MuiSvgIcon-root": { color: "#f7edd9" },
                  }}
                >
                  {playerProfiles.map((profile) => (
                    <MenuItem key={profile.index} value={profile.index}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <ClassMark classId={profile.classId} size={30} />
                        <Box>
                          <Typography sx={{ fontWeight: 900 }}>
                            {profile.label} - {profile.name || "Sem nome"}
                          </Typography>
                          <Typography sx={{ color: "#b9a98b", fontSize: ".78rem" }}>
                            {profile.className}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button
              variant="contained"
              disabled={!hasUses}
              onClick={onUse}
              sx={{
                bgcolor: "#f2c76c",
                color: "#100b08",
                fontWeight: 900,
                "&:hover": { bgcolor: "#d8a94b", color: "#100b08" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,.08)",
                  color: "rgba(247,237,217,.38)",
                },
              }}
            >
              Usar
              {item.canTargetAlly && targetProfile ? ` em ${targetProfile.label}` : ""}
              : {item.effect.label}
            </Button>
          </Stack>
        )}
      </Stack>
    </ExpandableSheetCard>
  );
}

export function InventoryItemCard({
  item,
  isEquipped,
  onToggle,
}: {
  item: SheetItem;
  isEquipped: boolean;
  onToggle: () => void;
}) {
  const modifierSummary = [
    item.modifiers.armor ? `Armadura +${item.modifiers.armor}` : null,
    item.modifiers.hp ? `PV +${item.modifiers.hp}` : null,
    ...Object.entries(item.modifiers.attributes ?? {}).map(
      ([attribute, value]) => `${attributeLabels[attribute as AttributeKey]} ${value >= 0 ? "+" : ""}${value}`,
    ),
  ].filter((entry): entry is string => Boolean(entry));

  return (
    <ExpandableSheetCard
      title={item.name}
      subtitle={isEquipped ? "Equipado agora" : "Guardado na mochila"}
      accent="#c59b4b"
      selected={isEquipped}
      chips={[
        <Chip key="type" label={item.type} />,
        <Chip key="weight" label={`peso ${item.weight}`} />,
        ...item.tags.map((tag) => <Chip key={tag} label={tag} />),
      ]}
    >
      <Stack spacing={1}>
        <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.6 }}>
          {item.description}
        </Typography>

        {modifierSummary.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {modifierSummary.map((modifier) => (
              <Chip key={modifier} label={modifier} />
            ))}
          </Stack>
        )}

        <Button
          variant={isEquipped ? "contained" : "outlined"}
          onClick={onToggle}
          sx={{
            bgcolor: isEquipped ? "#f2c76c" : "transparent",
            color: isEquipped ? "#100b08" : "#f2c76c",
            borderColor: "rgba(242,199,108,.55)",
            fontWeight: 900,
            "&:hover": {
              bgcolor: isEquipped ? "#d8a94b" : "rgba(242,199,108,.12)",
              color: isEquipped ? "#100b08" : "#fff3dc",
            },
          }}
        >
          {isEquipped ? "Desequipar" : "Equipar"}
        </Button>
      </Stack>
    </ExpandableSheetCard>
  );
}

export function SkillPointsBadge({
  total,
  spent,
  remaining,
  locked,
}: {
  total: number;
  spent: number;
  remaining: number;
  locked: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor:
          remaining > 0 ? "rgba(242,199,108,.48)" : "rgba(217,200,159,.16)",
        bgcolor:
          remaining > 0
            ? "linear-gradient(135deg, rgba(197,155,75,.18), rgba(127,111,217,.12))"
            : "rgba(255,255,255,.04)",
        color: "#f7edd9",
        p: 1.4,
      }}
    >
      <Stack
        direction="row"
        spacing={1.2}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Box>
          <Typography sx={{ color: "#c59b4b", fontSize: ".74rem", fontWeight: 900 }}>
            Pontos de movimento
          </Typography>
          <Typography sx={{ color: "#b9a98b", fontSize: ".84rem" }}>
            {spent} usados de {total}
          </Typography>
        </Box>

        <Chip
          label={`${remaining} livres`}
          sx={{
            bgcolor: remaining > 0 ? "rgba(242,199,108,.2)" : "rgba(255,255,255,.08)",
            color: remaining > 0 ? "#fff3dc" : "#b9a98b",
            fontWeight: 900,
          }}
        />

        {locked && (
          <Chip
            label="Travado"
            sx={{
              bgcolor: "rgba(170,38,61,.18)",
              color: "#ffd7dc",
              fontWeight: 900,
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}

export function BasicMovesPanel() {
  return (
    <InfoPanel title="Movimentos basicos">
      <Stack spacing={1.2}>
        {basicMoves.map((move) => (
          <Paper
            key={move.id}
            variant="outlined"
            sx={{
              borderColor: "rgba(217,200,159,.14)",
              bgcolor: "rgba(255,255,255,.04)",
              color: "#f7edd9",
              p: 1.3,
            }}
          >
            <Stack spacing={0.8}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Chip label={move.name} />
                {move.attribute && (
                  <Chip label={`+${attributeLabels[move.attribute]}`} />
                )}
              </Stack>

              <Typography sx={{ color: "#d7c59d", fontSize: ".88rem" }}>
                {move.trigger}
              </Typography>

              <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
                {move.hit}
              </Typography>

              <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
                {move.partial}
              </Typography>

              <Typography sx={{ color: "#ffb0b8", fontSize: ".82rem" }}>
                {move.miss}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </InfoPanel>
  );
}

export function MoveRollResultPanel({ roll }: { roll: MoveRoll }) {
  const outcome = dwRollOutcomes[roll.outcome];

  return (
    <InfoPanel title="Resultado do movimento">
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={roll.moveName} />
          <Chip label={`2d6: ${roll.rolls.join(" + ")}`} />
          <Chip label={`Atributo ${roll.attributeValue}`} />
          <Chip label={`Mod ${roll.modifier >= 0 ? "+" : ""}${roll.modifier}`} />
          <Chip label={`Total ${roll.total}`} />
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            borderColor: `${outcome.color}66`,
            bgcolor: `${outcome.color}14`,
            p: 1.2,
          }}
        >
          <Stack spacing={0.7}>
            <Typography sx={{ color: outcome.color, fontWeight: 900 }}>
              {outcome.band} - {outcome.title}
            </Typography>
            <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.55 }}>
              {outcome.playerText}
            </Typography>
            {roll.outcome === "miss" && (
              <Typography sx={{ color: "#ffb0b8", fontSize: ".86rem", lineHeight: 1.5 }}>
                Anote XP e chame o MJ para transformar a falha em consequencia
                concreta da cena, como dano, perda de recurso ou novo perigo.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Stack>
    </InfoPanel>
  );
}

export function SpellCastResultPanel({
  roll,
  risk,
  onApplyPenalty,
  onExhaustSpell,
}: {
  roll: SpellCastRoll;
  risk: SpellRisk;
  onApplyPenalty: () => void;
  onExhaustSpell: () => void;
}) {
  const outcome = dwRollOutcomes[roll.outcome];
  const outcomeLabel = `${outcome.band} ${outcome.title}`;

  return (
    <InfoPanel title="Rolagem de magia">
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={roll.spell.name} />
          <Chip label={`2d6: ${roll.rolls.join(" + ")}`} />
          <Chip label={`Mod ${roll.modifier >= 0 ? "+" : ""}${roll.modifier}`} />
          {roll.penalty !== 0 && <Chip label={`Penalidade ${roll.penalty}`} />}
          <Chip label={`Total ${roll.total}`} />
        </Stack>

        <Typography
          sx={{
            color: outcome.color,
            fontWeight: 900,
          }}
        >
          {outcomeLabel}
        </Typography>

        <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.55 }}>
          {outcome.playerText}
        </Typography>

        {roll.outcome === "partial" && (
          <Stack spacing={1}>
            <Typography sx={{ color: "#d7c59d", fontSize: ".9rem" }}>
              Escolha uma consequencia da conjuracao:
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.2, bgcolor: "rgba(255,255,255,.04)" }}>
              <Typography sx={{ color: "#b9a98b", fontSize: ".88rem" }}>
                {risk.attention}
              </Typography>
            </Paper>
            <Button variant="outlined" onClick={onApplyPenalty}>
              Aplicar penalidade -1
            </Button>
            <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
              {risk.penalty}
            </Typography>
            <Button variant="outlined" onClick={onExhaustSpell}>
              Marcar como gasto/esquecido
            </Button>
            <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
              {risk.losePrepared}
            </Typography>
          </Stack>
        )}

        {roll.outcome === "miss" && (
          <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
            Marque XP. A magia ainda pode acontecer, falhar ou sair distorcida,
            mas o MJ faz um movimento tao forte quanto a ficcao pedir.
          </Typography>
        )}
      </Stack>
    </InfoPanel>
  );
}

export function EquipmentSlotCard({
  slot,
  classId,
  itemName,
}: {
  slot: EquipmentSlot;
  classId: string;
  itemName?: string;
}) {
  const labels: Record<EquipmentSlot, string> = {
    arma: "Arma",
    armaSecundaria: "Arma secundaria",
    armadura: "Armadura",
    capacete: "Cabeca",
    acessorio1: "Acessorio",
    acessorio2: "Acessorio",
  };

  const weaponSilhouettes: Record<string, string> = {
    barbaro: "🪓",
    bardo: "🗡",
    clerigo: "🔨",
    druida: "♜",
    guerreiro: "⚔",
    ladrao: "🗡",
    mago: "杖",
    "engenheiro-arcano": "⚙",
    paladino: "⚔",
    ranger: "弓",
  };

  const slotIcon =
    slot === "arma" || slot === "armaSecundaria"
      ? (weaponSilhouettes[classId] ?? "⚔")
      : slot === "armadura"
        ? "▣"
        : slot === "capacete"
          ? "◠"
          : "◇";

  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: { xs: 112, sm: 124 },
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        borderColor: itemName
          ? "rgba(197,155,75,.56)"
          : "rgba(217,200,159,.14)",
        bgcolor: itemName ? "rgba(197,155,75,.10)" : "rgba(255,255,255,.035)",
        color: "#f7edd9",
        p: 1.2,
      }}
    >
      <Stack spacing={0.6} sx={{ alignItems: "center" }}>
        <Typography
          sx={{
            color: itemName ? "#f2c76c" : "#5b5141",
            fontSize: 34,
            lineHeight: 1,
          }}
        >
          {slotIcon}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".72rem" }}>
          {labels[slot] ?? slot}
        </Typography>

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: ".86rem",
            overflowWrap: "anywhere",
          }}
        >
          {itemName ?? "Vazio"}
        </Typography>
      </Stack>
    </Paper>
  );
}

export function CombatActionCard({
  action,
  used,
  onRoll,
}: {
  action: CombatAction;
  used: number;
  onRoll: () => void;
}) {
  const usesLabel =
    action.usesPerRest === null
      ? "Usos: livre"
      : `Usos: ${Math.max(0, action.usesPerRest - used)}/${action.usesPerRest}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.14)",
        bgcolor: "rgba(255,255,255,.04)",
        color: "#f7edd9",
        p: 1.4,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={action.dice} />
          <Chip label={`+${attributeLabels[action.attribute]}`} />
          <Chip label={usesLabel} />
        </Stack>

        <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
          {action.name}
        </Typography>

        <Typography
          sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.55 }}
        >
          {action.detail}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".78rem", lineHeight: 1.45 }}>
          Esta rolagem representa o dano executado. Se a ficcao tambem disparar
          um movimento, resolva antes com 2d6 e leia 10+, 7-9 ou 6-.
        </Typography>

        <Button variant="contained" onClick={onRoll}>
          Usar e rolar
        </Button>
      </Stack>
    </Paper>
  );
}

export function CombatSceneResult({ roll }: { roll: CombatRoll }) {
  const tone = roll.isCritical
    ? {
        title: "Acerto critico",
        color: "#f2c76c",
        glow: "rgba(242,199,108,.42)",
      }
    : roll.isCriticalFailure
      ? {
          title: "Falha critica",
          color: "#ff8f9d",
          glow: "rgba(170,38,61,.45)",
        }
      : {
          title: "Ataque executado",
          color: "#5fb6c4",
          glow: "rgba(95,182,196,.32)",
        };
  const narrative = roll.isCritical
    ? "Extremo alto no dado: descreva impacto limpo, pressao no inimigo ou vantagem imediata."
    : roll.isCriticalFailure
      ? "Extremo baixo no dado: o dano saiu mal e o MJ pode ligar isso a uma complicacao da cena."
      : "Dano resolvido. Se a acao disparou um movimento, use tambem a regra 10+, 7-9 ou 6-.";

  return (
    <Box
      sx={{
        width: "min(100%, 260px)",
        minHeight: 156,
        display: "grid",
        placeItems: "center",
        position: "relative",
        borderRadius: 3,
        border: `2px solid ${tone.color}`,
        background:
          "linear-gradient(145deg, rgba(242,199,108,.14), rgba(170,38,61,.16)), #16110d",
        boxShadow: `0 0 34px ${tone.glow}, inset 0 0 24px rgba(0,0,0,.45)`,
        p: 2,
      }}
    >
      <Stack spacing={0.8} sx={{ textAlign: "center", alignItems: "center" }}>
        <Typography
          sx={{ color: tone.color, fontSize: ".8rem", fontWeight: 900 }}
        >
          {tone.title}
        </Typography>

        <Typography
          sx={{
            color: "#fff3dc",
            fontSize: 42,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {roll.total}
        </Typography>

        <Typography sx={{ color: "#f2c76c", fontSize: ".78rem", fontWeight: 900 }}>
          {roll.actionName}
        </Typography>

        <Typography sx={{ color: "#d7c59d", fontSize: ".82rem" }}>
          {roll.diceTotal} no dado + {attributeLabels[roll.attribute]}{" "}
          {roll.attributeValue}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".75rem" }}>
          Rolagens naturais: {roll.rolls.join(" + ")}
        </Typography>

        <Typography sx={{ color: "#d7c59d", fontSize: ".75rem", lineHeight: 1.35 }}>
          {narrative}
        </Typography>
      </Stack>
    </Box>
  );
}
