import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  GiBackpack,
  GiBroadsword,
  GiHeartPlus,
  GiMagicSwirl,
  GiSkills,
} from "react-icons/gi";
import { getClassTheme } from "../../data/classThemes";
import {
  getCreationRulesFor,
  getOptionsForCreationRule,
} from "../../data/classCreation";
import { type DwClass } from "../../data/dwClasses";
import {
  classStartingConsumables,
  classStartingItemIds,
  consumableItems,
  items,
} from "../../data/items";
import { spells } from "../../data/spells";
import type { AttributeKey } from "../../types/character";
import MoveOutcomeGuide from "../dw/MoveOutcomeGuide";
import ClassMark from "./ClassMark";

export default function ClassReferenceCard({ dwClass }: { dwClass: DwClass }) {
  const theme = getClassTheme(dwClass.id);

  // Estes arrays transformam ids internos em objetos ricos para a pagina.
  // A pagina de classe nao deve repetir regras de negocio; ela apenas monta
  // uma leitura humana dos dados que ja alimentam a ficha.
  const classSpells = spells.filter((spell) => spell.tradition === dwClass.id);
  const classItems = (classStartingItemIds[dwClass.id] ?? [])
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item));
  const classConsumables = Object.entries(
    classStartingConsumables[dwClass.id] ?? {},
  )
    .map(([itemId, amount]) => {
      const item = consumableItems.find(
        (currentItem) => currentItem.id === itemId,
      );
      return item ? { item, amount } : null;
    })
    .filter(
      (entry): entry is { item: (typeof consumableItems)[number]; amount: number } =>
        Boolean(entry),
    );
  const creationRules = collectCreationRules(dwClass);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: `${theme.color}66`,
        bgcolor: "rgba(17,17,15,.9)",
        color: "#f7edd9",
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Stack spacing={1.6}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.3}
          sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <ClassMark classId={dwClass.id} size={64} />

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {dwClass.name}
            </Typography>
            <Typography sx={{ color: "#d7c59d", mt: 0.5, lineHeight: 1.6 }}>
              {dwClass.description}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap" }}>
          <IconChip Icon={GiHeartPlus} label={`PV ${dwClass.baseHp}+CON`} />
          <IconChip Icon={GiBroadsword} label={`Dano ${dwClass.damageDice}`} />
          <IconChip Icon={GiBackpack} label={`Carga ${dwClass.loadBase}+FOR`} />
          <IconChip
            Icon={GiSkills}
            label={theme.role}
            sx={{ bgcolor: `${theme.color}22` }}
          />
          {dwClass.usesSpells && (
            <IconChip
              Icon={GiMagicSwirl}
              label={dwClass.spellcastingLabel ?? "Conjura magias"}
              sx={{ bgcolor: "rgba(95,182,196,.16)", color: "#dff7ff" }}
            />
          )}
        </Stack>

        <ReferenceSection title="Caracteristicas">
          {dwClass.characteristics.map((item) => (
            <Chip key={item} label={item} />
          ))}
        </ReferenceSection>

        <ReferenceSection title="Racas e beneficios">
          {dwClass.races.map((race) => (
            <Paper
              key={race.id}
              variant="outlined"
              sx={{
                borderColor: "rgba(217,200,159,.12)",
                bgcolor: "rgba(255,255,255,.035)",
                p: 1,
              }}
            >
              <Typography sx={{ color: theme.accent, fontWeight: 900 }}>
                {race.name}
              </Typography>
              <Typography
                sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.55 }}
              >
                {race.description}
              </Typography>
            </Paper>
          ))}
        </ReferenceSection>

        <ReferenceSection title="Escolhas de criacao">
          {creationRules.map((rule) => (
            <Paper
              key={rule.id}
              variant="outlined"
              sx={{
                borderColor: "rgba(95,182,196,.14)",
                bgcolor: "rgba(255,255,255,.035)",
                p: 1,
              }}
            >
              <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                {rule.label}
              </Typography>
              <Typography sx={{ color: "#d7c59d", fontSize: ".9rem" }}>
                {rule.helper}
              </Typography>
              <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", mt: 0.8 }}>
                {getOptionsForCreationRule(rule)
                  .slice(0, 6)
                  .map((option) => (
                    <Chip key={option.value} label={option.label} size="small" />
                  ))}
              </Stack>
            </Paper>
          ))}
        </ReferenceSection>

        <ReferenceSection title="Movimentos iniciais">
          {dwClass.startingSkills.map((skill) => (
            <ReferenceMove
              key={skill.id}
              title={skill.name}
              body={skill.description}
              rollAttribute={skill.rollAttribute}
            />
          ))}
        </ReferenceSection>

        <ReferenceSection title="Movimentos avancados">
          {[...dwClass.advancedSkillsLevel2To5, ...dwClass.advancedSkillsLevel6To10].map(
            (skill) => (
              <ReferenceMove
                key={skill.id}
                title={skill.name}
                body={skill.description}
                chip={skill.levelRequirement ? `Nivel ${skill.levelRequirement}+` : undefined}
                rollAttribute={skill.rollAttribute}
              />
            ),
          )}
        </ReferenceSection>

        {classSpells.length > 0 && (
          <ReferenceSection title="Magias e efeitos">
            {classSpells.map((spell) => (
              <ReferenceMove
                key={spell.id}
                title={spell.name}
                body={spell.fullText ?? spell.summary}
                chip={spell.levelLabel}
              />
            ))}
          </ReferenceSection>
        )}

        <ReferenceSection title="Equipamento e consumiveis">
          {classItems.map((item) => (
            <Chip key={item.id} label={`${item.name} · peso ${item.weight}`} />
          ))}
          {classConsumables.map(({ item, amount }) => (
            <Chip
              key={item.id}
              label={`${item.name} ${amount}/${item.maxUses}`}
              sx={{ bgcolor: "rgba(95,182,196,.16)", color: "#dff7ff" }}
            />
          ))}
        </ReferenceSection>
      </Stack>
    </Paper>
  );
}

function collectCreationRules(dwClass: DwClass) {
  const allRules = [
    ...getCreationRulesFor(dwClass.id, "", "identity"),
    ...dwClass.races.flatMap((race) =>
      getCreationRulesFor(dwClass.id, race.id, "identity"),
    ),
    ...getCreationRulesFor(dwClass.id, "", "bond"),
  ];
  const seen = new Set<string>();

  // Algumas escolhas aparecem para todas as classes e tambem por raca. O set
  // remove duplicatas mantendo a primeira ocorrencia, que e a versao geral.
  return allRules.filter((rule) => {
    if (seen.has(rule.id)) return false;
    seen.add(rule.id);
    return true;
  });
}

function IconChip({
  Icon,
  label,
  sx,
}: {
  Icon: IconType;
  label: string;
  sx?: SxProps<Theme>;
}) {
  return <Chip icon={<Icon size={16} />} label={label} sx={sx} />;
}

function ReferenceSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.8 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 0.9,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function ReferenceMove({
  title,
  body,
  chip,
  rollAttribute,
}: {
  title: string;
  body: string;
  chip?: string;
  rollAttribute?: AttributeKey;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.12)",
        bgcolor: "rgba(255,255,255,.035)",
        p: 1,
      }}
    >
      <Stack direction="row" spacing={0.7} sx={{ alignItems: "center", mb: 0.5 }}>
        <Typography sx={{ color: "#f7edd9", fontWeight: 900 }}>
          {title}
        </Typography>
        {chip && <Chip size="small" label={chip} />}
      </Stack>
      <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.55 }}>
        {body}
      </Typography>
      <MoveOutcomeGuide
        moveName={title}
        attribute={rollAttribute}
        compact
      />
    </Paper>
  );
}
