import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  TextField,
} from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { dwClasses } from "../data/dwClasses";
import { classStartingItemIds, items } from "../data/items";
import { spells } from "../data/spells";
import AttributeDistributionDrawer from "../components/AttributeDistributionDrawer";
import {
  attributeKeys,
  attributeLabels,
  type Character,
  type EquipmentSlot,
  getXpToNextLevel,
} from "../types/character";
import { formatModifier } from "../utils/attributes";
import { getAttributeModifier } from "../utils/attributes";

type AppTab = "personagem" | "descricao" | "skills" | "inventario" | "combate";

type CharacterAppPageProps = {
  mode: "player" | "master";
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onBackToMaster?: () => void;
};

type CombatAction = {
  id: string;
  name: string;
  type: "attack" | "skill" | "spell";
  dice: string;
  detail: string;
  usesPerRest: number | null;
};

type CombatRoll = {
  actionName: string;
  dice: string;
  rolls: number[];
  total: number;
};

const tabLabels: Record<AppTab, string> = {
  personagem: "Personagem",
  descricao: "Descrição",
  skills: "Habilidades",
  combate: "Combate",
  inventario: "Inventário",
};

const tabOrder: AppTab[] = [
  "personagem",
  "descricao",
  "skills",
  "inventario",
  "combate",
];

export default function CharacterAppPage({
  mode,
  character,
  setCharacter,
  onBackToCodex,
  onBackToMaster,
}: CharacterAppPageProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("personagem");
  const [pendingClassId, setPendingClassId] = useState("");
  const [pendingRaceId, setPendingRaceId] = useState("");
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [classSelectPulse, setClassSelectPulse] = useState(false);
  const [isAttributeDrawerOpen, setIsAttributeDrawerOpen] = useState(false);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [isCombatPickerOpen, setIsCombatPickerOpen] = useState(false);
  const [combatUseCounts, setCombatUseCounts] = useState<Record<string, number>>(
    {},
  );
  const [combatRoll, setCombatRoll] = useState<CombatRoll | null>(null);
  const combatSceneRef = useRef<HTMLDivElement | null>(null);

  const selectedClass = useMemo(() => {
    return (
      dwClasses.find((dwClass) => dwClass.id === character.classId) ??
      dwClasses[0]
    );
  }, [character.classId]);

  const selectedRace = selectedClass.races.find(
    (race) => race.id === character.raceId,
  );
  const displayRace = selectedRace ?? selectedClass.races[0];
  const pendingClass =
    dwClasses.find((dwClass) => dwClass.id === pendingClassId) ?? selectedClass;
  const pendingRace =
    pendingClass.races.find((race) => race.id === pendingRaceId) ??
    pendingClass.races[0];

  const equippedWeapon = character.equipment.arma
    ? items.find((item) => item.id === character.equipment.arma)
    : null;

  const currentTabLabels: Record<AppTab, string> = {
    ...tabLabels,
    skills: selectedClass.usesSpells ? "Magias" : "Habilidades",
  };

  const equippedItemsData = Object.values(character.equipment)
    .filter((itemId): itemId is string => Boolean(itemId))
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item));

  const finalAttributes = {
    forca:
      character.attributes.forca +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.forca ?? 0),
        0,
      ),

    destreza:
      character.attributes.destreza +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.destreza ?? 0),
        0,
      ),

    constituicao:
      character.attributes.constituicao +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.constituicao ?? 0),
        0,
      ),

    inteligencia:
      character.attributes.inteligencia +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.inteligencia ?? 0),
        0,
      ),

    sabedoria:
      character.attributes.sabedoria +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.sabedoria ?? 0),
        0,
      ),

    carisma:
      character.attributes.carisma +
      equippedItemsData.reduce(
        (acc, item) => acc + (item.modifiers.attributes?.carisma ?? 0),
        0,
      ),
  };

  const bonusHp = equippedItemsData.reduce(
    (acc, item) => acc + (item.modifiers.hp ?? 0),
    0,
  );

  const maxHp = selectedClass.baseHp + finalAttributes.constituicao + bonusHp;
  const maxLoad = selectedClass.loadBase + getAttributeModifier(finalAttributes.forca);
  const currentLoad = character.availableItems
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item))
    .reduce((acc, item) => acc + item.weight, 0);

  const armor = equippedItemsData.reduce(
    (acc, item) => acc + (item.modifiers.armor ?? 0),
    character.modifiers.armor,
  );

  const xpToNextLevel = getXpToNextLevel(character.level);
  const canLevelUp = character.xp >= xpToNextLevel;

  const classSpells = spells.filter(
    (spell) => spell.tradition === selectedClass.id,
  );
  const availableSpells = classSpells.filter(
    (spell) => spell.level <= character.level,
  );
  const preparedSpellCost = availableSpells
    .filter((spell) => character.preparedSpellIds.includes(spell.id))
    .reduce((acc, spell) => acc + spell.level, 0);
  const spellPreparationLimit = character.level + 1;

  const learnedAdvancedSkills = [
    ...selectedClass.advancedSkillsLevel2To5,
    ...selectedClass.advancedSkillsLevel6To10,
  ].filter((skill) => character.selectedSkillIds.includes(skill.id));

  const usableCombatActions: CombatAction[] = [
    {
      id: "common-attack",
      name: "Ataque comum",
      type: "attack",
      dice: `1${selectedClass.damageDice}`,
      detail: `Dano base da classe: ${selectedClass.damageDice}.`,
      usesPerRest: null,
    },
    ...(selectedClass.usesSpells
      ? availableSpells
          .filter((spell) => character.preparedSpellIds.includes(spell.id))
          .map<CombatAction>((spell) => ({
            id: `spell-${spell.id}`,
            name: spell.name,
            type: "spell",
            dice: spell.level === 0 ? "1d4" : spell.level >= 7 ? "1d12" : "1d10",
            detail: `${spell.levelLabel}. ${spell.summary}`,
            usesPerRest: spell.level === 0 ? null : 1,
          }))
      : [
          ...selectedClass.startingSkills.map<CombatAction>((skill) => ({
            id: `skill-${skill.id}`,
            name: skill.name,
            type: "skill",
            dice: `1${selectedClass.damageDice}`,
            detail: skill.description,
            usesPerRest: null,
          })),
          ...learnedAdvancedSkills
            .filter(
              (skill) =>
                !skill.levelRequirement || character.level >= skill.levelRequirement,
            )
            .map<CombatAction>((skill) => ({
              id: `skill-${skill.id}`,
              name: skill.name,
              type: "skill",
              dice: `1${selectedClass.damageDice}`,
              detail: skill.description,
              usesPerRest: 1,
            })),
        ]),
  ].filter((action) => {
    if (action.usesPerRest === null) return true;
    return (combatUseCounts[action.id] ?? 0) < action.usesPerRest;
  });

  useEffect(() => {
    setCharacter((current) => {
      if (current.hp.current > 0) return current;

      return {
        ...current,
        hp: {
          ...current.hp,
          current: maxHp,
        },
      };
    });
  }, [maxHp, setCharacter]);

  const hpPercent =
    maxHp > 0 ? Math.round((character.hp.current / maxHp) * 100) : 0;

  const isBloodied = hpPercent <= 35;
  const isCritical = hpPercent <= 15;

  function confirmAttributes(attributes: Character["attributes"]) {
    setCharacter((current) => ({
      ...current,
      attributes,
      attributesLocked: true,
      hp: {
        ...current.hp,
        current: selectedClass.baseHp + attributes.constituicao,
      },
    }));

    setIsAttributeDrawerOpen(false);
  }

  function playClassSelectSound() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      audioContext.currentTime + 0.18,
    );

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.25,
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.25);
  }

  function requestClassChange(classId: string) {
    if (character.classLocked) return;

    const nextClass = dwClasses.find((dwClass) => dwClass.id === classId);
    setPendingClassId(classId);
    setPendingRaceId(nextClass?.races[0]?.id ?? "");
    setIsClassDialogOpen(true);
  }

  function confirmClassChange() {
    const newClass =
      dwClasses.find((dwClass) => dwClass.id === pendingClassId) ??
      dwClasses[0];

    const newMaxHp = newClass.baseHp + character.attributes.constituicao;
    const nextRaceId = pendingRaceId || newClass.races[0]?.id || "";
    const startingItemIds = classStartingItemIds[newClass.id] ?? [];

    setCharacter((current) => ({
      ...current,
      classId: pendingClassId,
      classLocked: true,
      raceId: nextRaceId,
      raceLocked: Boolean(nextRaceId),
      availableItems: Array.from(
        new Set([...current.availableItems, ...startingItemIds]),
      ),
      hp: {
        ...current.hp,
        current: newMaxHp,
      },
    }));

    setIsClassDialogOpen(false);
    setClassSelectPulse(true);
    playClassSelectSound();

    setTimeout(() => {
      setActiveTab("descricao");
      setClassSelectPulse(false);
    }, 700);
  }
  function canLearnSkill(skill: {
    levelRequirement?: number;
    requiresSkillId?: string;
  }) {
    if (character.skillsLocked) return false;

    const meetsLevel =
      !skill.levelRequirement || character.level >= skill.levelRequirement;

    const meetsRequirement =
      !skill.requiresSkillId ||
      character.selectedSkillIds.includes(skill.requiresSkillId);

    return meetsLevel && meetsRequirement;
  }

  function getSkillRequirementText(skill: {
    levelRequirement?: number;
    requiresSkillId?: string;
  }) {
    const requirements: string[] = [];

    if (skill.levelRequirement && character.level < skill.levelRequirement) {
      requirements.push(`Requer nivel ${skill.levelRequirement}.`);
    }

    if (
      skill.requiresSkillId &&
      !character.selectedSkillIds.includes(skill.requiresSkillId)
    ) {
      requirements.push("Requer aprender outro movimento antes.");
    }

    if (requirements.length === 0) {
      return "Movimento disponivel para escolha.";
    }

    return requirements.join(" ");
  }

  function getEquipmentSlot(itemId: string): EquipmentSlot | null {
    const item = items.find((currentItem) => currentItem.id === itemId);
    if (!item) return null;

    if (item.slot !== "acessorio") return item.slot;

    if (character.equipment.acessorio1 === itemId) return "acessorio1";
    if (character.equipment.acessorio2 === itemId) return "acessorio2";
    if (!character.equipment.acessorio1) return "acessorio1";
    if (!character.equipment.acessorio2) return "acessorio2";

    return "acessorio1";
  }

  function equipItem(itemId: string) {
    const slot = getEquipmentSlot(itemId);
    if (!slot) return;

    setCharacter((current) => ({
      ...current,
      equipment: {
        ...current.equipment,
        [slot]: itemId,
      },
    }));
  }

  function unequipItem(itemId: string) {
    setCharacter((current) => {
      const updatedEquipment = { ...current.equipment };

      Object.entries(updatedEquipment).forEach(([slot, equippedItemId]) => {
        if (equippedItemId === itemId) {
          updatedEquipment[slot as keyof typeof updatedEquipment] = null;
        }
      });

      return {
        ...current,
        equipment: updatedEquipment,
      };
    });
  }

  function toggleSpell(spellId: string) {
    if (character.spellsLocked) return;

    const spell = availableSpells.find((currentSpell) => currentSpell.id === spellId);
    if (!spell) return;

    const isPrepared = character.preparedSpellIds.includes(spellId);
    const nextCost = isPrepared
      ? preparedSpellCost - spell.level
      : preparedSpellCost + spell.level;

    if (nextCost > spellPreparationLimit) return;

    setCharacter((current) => ({
      ...current,
      preparedSpellIds: isPrepared
        ? current.preparedSpellIds.filter((currentSpellId) => currentSpellId !== spellId)
        : [...current.preparedSpellIds, spellId],
    }));
  }

  function rollCombatAction(action: CombatAction) {
    const match = action.dice.match(/^(\d+)d(\d+)$/);
    const diceCount = match ? Number(match[1]) : 1;
    const dieSize = match ? Number(match[2]) : Number(action.dice.replace("d", ""));
    const rolls = Array.from({ length: diceCount }, () =>
      Math.floor(Math.random() * dieSize) + 1,
    );

    setCombatRoll({
      actionName: action.name,
      dice: action.dice,
      rolls,
      total: rolls.reduce((acc, value) => acc + value, 0),
    });

    if (action.usesPerRest !== null) {
      setCombatUseCounts((current) => ({
        ...current,
        [action.id]: (current[action.id] ?? 0) + 1,
      }));
    }

    window.setTimeout(() => {
      combatSceneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#070706",
        background:
          "radial-gradient(circle at 10% 0%, rgba(170,38,61,.26), transparent 22rem), radial-gradient(circle at 90% 12%, rgba(36,112,109,.22), transparent 20rem), linear-gradient(180deg, #12100d 0%, #070706 100%)",
        color: "#f7edd9",
        px: 1.5,
        py: 2,
        pb: 11,
      }}
    >
      <Stack spacing={1.5} sx={{ maxWidth: 520, mx: "auto" }}>
        <Stack direction="row" spacing={1}>
          {mode === "player" && onBackToCodex && (
            <Button variant="outlined" onClick={onBackToCodex}>
              Codex
            </Button>
          )}

          {mode === "master" && onBackToMaster && (
            <Button variant="outlined" onClick={onBackToMaster}>
              Voltar ao Mestre
            </Button>
          )}
        </Stack>

        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(217,200,159,.18)",
            borderRadius: 4,
            bgcolor: "rgba(17,17,15,.92)",
            color: "#f7edd9",
            boxShadow: isCritical
              ? "inset 14px 0 34px rgba(190,0,0,.7), inset -14px 0 34px rgba(190,0,0,.7), 0 22px 60px rgba(0,0,0,.62)"
              : isBloodied
                ? "inset 10px 0 28px rgba(150,0,0,.52), inset -10px 0 28px rgba(150,0,0,.52), 0 18px 46px rgba(0,0,0,.56)"
                : "0 18px 46px rgba(0,0,0,.5)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Stack
                sx={{
                  alignItems: "flex-start",
                  flexDirection: "row",
                  gap: 2,
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "#c59b4b",
                      fontSize: ".75rem",
                      fontWeight: 900,
                    }}
                  >
                    Ficha ativa
                  </Typography>

                  <Stack
                    sx={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 1.4,
                      mt: 1,
                    }}
                  >
                    <Fade in timeout={500}>
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          display: "grid",
                          flex: "0 0 auto",
                          placeItems: "center",
                          border: "1px solid rgba(217,200,159,.28)",
                          bgcolor: "rgba(197,155,75,.08)",
                          boxShadow: classSelectPulse
                            ? "0 0 28px rgba(197,155,75,.75)"
                            : "0 0 12px rgba(0,0,0,.45)",
                          transition: "all .45s ease",
                          transform: classSelectPulse ? "scale(1.08)" : "scale(1)",
                        }}
                      >
                        <ClassSigil classId={selectedClass.id} />
                      </Box>
                    </Fade>

                    <Box sx={{ minWidth: 0 }}>
                      {character.nameLocked || activeTab !== "personagem" ? (
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 900, lineHeight: 0.9, minHeight: 42 }}
                        >
                          {character.nameLocked ? character.name : ""}
                        </Typography>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mb: 1, alignItems: "center" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="Nome"
                            value={character.name}
                            onChange={(event) =>
                              setCharacter((current) => ({
                                ...current,
                                name: event.target.value,
                              }))
                            }
                            sx={{
                              input: { color: "#f7edd9", fontWeight: 900 },
                              label: { color: "#b9a98b" },
                              ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(217,200,159,.22)",
                              },
                            }}
                          />

                          <Button
                            size="small"
                            variant="contained"
                            disabled={!character.name.trim()}
                            onClick={() =>
                              setCharacter((current) => ({
                                ...current,
                                name: current.name.trim(),
                                nameLocked: true,
                              }))
                            }
                            sx={{ minWidth: 88, py: 0.75 }}
                          >
                            OK
                          </Button>
                        </Stack>
                      )}

                      <Typography sx={{ color: "#d7c59d", fontWeight: 900 }}>
                        {selectedClass.name}
                      </Typography>

                      {displayRace && (
                        <Typography sx={{ color: "#c59b4b", mt: 0.25, fontSize: ".9rem" }}>
                          {displayRace.name}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              {activeTab === "personagem" && (
              <>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "#b9a98b" }}>Classe</InputLabel>
                <Select
                  label="Classe"
                  value={character.classId}
                  disabled={character.classLocked}
                  onChange={(event) =>
                    requestClassChange(event.target.value as string)
                  }
                  sx={{
                    color: "#f7edd9",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(217,200,159,.22)",
                    },
                    ".MuiSvgIcon-root": { color: "#f7edd9" },
                  }}
                >
                  {dwClasses.map((dwClass) => (
                    <MenuItem value={dwClass.id} key={dwClass.id}>
                      {dwClass.name}
                    </MenuItem>
                  ))}
                </Select>

                {character.classLocked && (
                  <Typography sx={{ color: "#c59b4b", fontSize: 12 }}>
                    Classe definida.
                  </Typography>
                )}
              </FormControl>

              </>
              )}

              {activeTab === "personagem" && (
                <Stack spacing={2}>
                  <ResourceBar
                    label="HP"
                    current={character.hp.current}
                    max={maxHp}
                    percent={hpPercent}
                    color="#aa263d"
                  />
                  <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`Nível ${character.level}`}
                  sx={{
                    bgcolor: "rgba(197,155,75,.16)",
                    color: "#f7edd9",
                  }}
                />

                <Chip
                  label={`${character.xp}/${xpToNextLevel} XP`}
                  sx={{
                    bgcolor: canLevelUp
                      ? "rgba(197,155,75,.24)"
                      : "rgba(95,182,196,.16)",
                    color: "#dff7ff",
                  }}
                />

                <Chip
                  label={`${character.skillPoints} pontos`}
                  sx={{
                    bgcolor: "rgba(127,111,217,.16)",
                    color: "#ece8ff",
                  }}
                />

              </Stack>
                  <InfoPanel title="Atributos">
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1,
                      }}
                    >
                      {attributeKeys.map((key) => {
                        const baseValue = character.attributes[key];
                        const finalValue = finalAttributes[key];

                        return (
                          <Paper
                            variant="outlined"
                            key={key}
                            sx={{
                              borderColor: "rgba(217,200,159,.14)",
                              bgcolor: "rgba(255,255,255,.04)",
                              color: "#f7edd9",
                              p: 1.2,
                            }}
                          >
                            <Typography
                              sx={{ color: "#b9a98b", fontSize: ".72rem" }}
                            >
                              {attributeLabels[key]}
                            </Typography>

                            <Typography
                              sx={{ fontWeight: 900, fontSize: "1.35rem" }}
                            >
                              {finalValue} ({formatModifier(finalValue)})
                            </Typography>

                            {finalValue !== baseValue && (
                              <Typography
                                sx={{ color: "#c59b4b", fontSize: ".72rem" }}
                              >
                                Base {baseValue}
                              </Typography>
                            )}
                          </Paper>
                        );
                      })}
                    </Box>

                    <Button
                      sx={{
                        mt: 2,
                        py: 1.1,
                      }}
                      variant="outlined"
                      fullWidth
                      disabled={character.attributesLocked}
                      onClick={() => setIsAttributeDrawerOpen(true)}
                    >
                      {character.attributesLocked
                        ? "Atributos definidos"
                        : "Distribuir atributos"}
                    </Button>
                  </InfoPanel>

                  <InfoPanel title="Itens">
                    <Stack
                      sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1 }}
                    >
                      {equippedItemsData.map((item) => (
                        <Chip
                          key={item.id}
                          label={item.name}
                          sx={{
                            bgcolor: "rgba(197,155,75,.14)",
                            color: "#f7edd9",
                          }}
                        />
                      ))}
                    </Stack>
                  </InfoPanel>
                </Stack>
              )}
              
              {activeTab === "descricao" && (
                <InfoPanel title={selectedClass.name}>
                  <Typography sx={{ color: "#d7c59d", mb: 2 }}>
                    {selectedClass.description}
                  </Typography>

                  {selectedRace && (
                    <Paper
                      sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(217,200,159,.12)",
                      }}
                    >
                      <Typography
                        sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.5 }}
                      >
                        Raça: {selectedRace.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#d7c59d",
                          fontSize: ".9rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedRace.description}
                      </Typography>
                    </Paper>
                  )}

                  <Stack spacing={1}>
                    {selectedClass.characteristics.map((item) => (
                      <Chip
                        label={item}
                        key={item}
                        sx={{
                          justifyContent: "flex-start",
                          color: "#f7edd9",
                          bgcolor: "rgba(36,112,109,.18)",
                        }}
                      />
                    ))}
                  </Stack>
                </InfoPanel>
              )}

              {activeTab === "skills" && !selectedClass.usesSpells && (
                <Stack spacing={2}>
                  <InfoPanel title="Habilidades Iniciais">
                    <Stack spacing={1.2}>
                      {selectedClass.startingSkills.map((skill) => (
                        <Paper
                          key={skill.id}
                          variant="outlined"
                          sx={{
                            borderColor: "rgba(217,200,159,.14)",
                            bgcolor: "rgba(255,255,255,.04)",
                            color: "#f7edd9",
                            p: 1.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: "#c59b4b",
                            }}
                          >
                            {skill.name}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#d7c59d",
                              fontSize: ".9rem",
                              mt: 0.5,
                              lineHeight: 1.6,
                            }}
                          >
                            {skill.description}
                          </Typography>

                          <Button
                            variant="text"
                            sx={{ mt: 1, color: "#f2c76c" }}
                            onClick={() =>
                              setDescriptionDialog({
                                title: skill.name,
                                body: skill.description,
                              })
                            }
                          >
                            Ler descricao completa
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  </InfoPanel>

                  <Stack spacing={2}>
                    <InfoPanel title="Movimentos Avançados • Nível 2-5">
                      {selectedClass.advancedSkillsLevel2To5.length === 0 ? (
                        <Typography sx={{ color: "#b9a98b" }}>
                          Nenhum movimento cadastrado ainda.
                        </Typography>
                      ) : (
                        <Stack spacing={1.2}>
                          {selectedClass.advancedSkillsLevel2To5.map(
                            (skill) => {
                              const alreadySelected =
                                character.selectedSkillIds.includes(skill.id);

                              const remainingPoints =
                                character.skillPoints -
                                character.selectedSkillIds.length;
                              const requirementBlocked =
                                Boolean(skill.levelRequirement && character.level < skill.levelRequirement) ||
                                Boolean(
                                  skill.requiresSkillId &&
                                    !character.selectedSkillIds.includes(skill.requiresSkillId),
                                );

                              return (
                                <Paper
                                  key={skill.id}
                                  variant="outlined"
                                  sx={{
                                    borderColor: alreadySelected
                                      ? "rgba(197,155,75,.65)"
                                      : "rgba(217,200,159,.14)",

                                    bgcolor: alreadySelected
                                      ? "rgba(197,155,75,.12)"
                                      : "rgba(255,255,255,.04)",

                                    color: "#f7edd9",
                                    p: 1.5,
                                    opacity: requirementBlocked ? 0.48 : 1,
                                    filter: requirementBlocked ? "grayscale(.55)" : "none",
                                  }}
                                >
                                  <Stack spacing={1}>
                                    <Typography
                                      sx={{
                                        fontWeight: 900,
                                        color: alreadySelected
                                          ? "#c59b4b"
                                          : "#5fb6c4",
                                      }}
                                    >
                                      {skill.name}
                                    </Typography>

                                    <Typography
                                      sx={{
                                        color: "#d7c59d",
                                        fontSize: ".9rem",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {skill.description}
                                    </Typography>

                                    <Button
                                      variant="text"
                                      sx={{ alignSelf: "flex-start", color: "#f2c76c" }}
                                      onClick={() =>
                                        setDescriptionDialog({
                                          title: skill.name,
                                          body: skill.description,
                                        })
                                      }
                                    >
                                      Ler descricao completa
                                    </Button>

                                    {skill.levelRequirement && (
                                      <Chip
                                        label={`Requer nível ${skill.levelRequirement}`}
                                        sx={{
                                          alignSelf: "flex-start",
                                          bgcolor: "rgba(95,182,196,.16)",
                                          color: "#dff7ff",
                                        }}
                                      />
                                    )}

                                    {skill.requiresSkillId && (
                                      <Chip
                                        label={`Requer outro movimento`}
                                        sx={{
                                          alignSelf: "flex-start",
                                          bgcolor: "rgba(170,38,61,.18)",
                                          color: "#ffd6dc",
                                        }}
                                      />
                                    )}

                                    {requirementBlocked && (
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ alignSelf: "flex-start" }}
                                        onClick={() =>
                                          setDescriptionDialog({
                                            title: `Requisitos: ${skill.name}`,
                                            body: getSkillRequirementText(skill),
                                          })
                                        }
                                      >
                                        Requisitos
                                      </Button>
                                    )}

                                    <Button
                                      variant={
                                        alreadySelected
                                          ? "contained"
                                          : "outlined"
                                      }
                                      disabled={
                                        alreadySelected ||
                                        remainingPoints <= 0 ||
                                        !canLearnSkill(skill)
                                      }
                                      onClick={() => {
                                        setCharacter((current) => ({
                                          ...current,
                                          selectedSkillIds: [
                                            ...current.selectedSkillIds,
                                            skill.id,
                                          ],
                                        }));
                                      }}
                                    >
                                      {alreadySelected
                                        ? "Aprendida"
                                        : character.skillsLocked
                                          ? "Travada pelo mestre"
                                        : skill.levelRequirement &&
                                            character.level <
                                              skill.levelRequirement
                                          ? `Requer nível ${skill.levelRequirement}`
                                          : skill.requiresSkillId &&
                                              !character.selectedSkillIds.includes(
                                                skill.requiresSkillId,
                                              )
                                            ? "Pré-requisito não aprendido"
                                            : "Aprender"}
                                    </Button>
                                  </Stack>
                                </Paper>
                              );
                            },
                          )}
                        </Stack>
                      )}
                    </InfoPanel>

                    <InfoPanel title="Movimentos Avançados • Nível 6-10">
                      {selectedClass.advancedSkillsLevel6To10.length === 0 ? (
                        <Typography sx={{ color: "#b9a98b" }}>
                          Nenhum movimento cadastrado ainda.
                        </Typography>
                      ) : (
                        <Stack spacing={1.2}>
                          {selectedClass.advancedSkillsLevel6To10.map(
                            (skill) => {
                              const alreadySelected =
                                character.selectedSkillIds.includes(skill.id);
                              const remainingPoints =
                                character.skillPoints -
                                character.selectedSkillIds.length;
                              const requirementBlocked =
                                Boolean(skill.levelRequirement && character.level < skill.levelRequirement) ||
                                Boolean(
                                  skill.requiresSkillId &&
                                    !character.selectedSkillIds.includes(skill.requiresSkillId),
                                );
                              return (
                                <Paper
                                  key={skill.id}
                                  variant="outlined"
                                  sx={{
                                    borderColor: alreadySelected
                                      ? "rgba(197,155,75,.65)"
                                      : "rgba(217,200,159,.14)",

                                    bgcolor: alreadySelected
                                      ? "rgba(197,155,75,.12)"
                                      : "rgba(255,255,255,.04)",

                                    color: "#f7edd9",
                                    p: 1.5,
                                    opacity: requirementBlocked ? 0.42 : 0.7,
                                    filter: requirementBlocked ? "grayscale(.55)" : "none",
                                  }}
                                >
                                  <Stack spacing={1}>
                                    <Typography
                                      sx={{
                                        fontWeight: 900,
                                        color: alreadySelected
                                          ? "#c59b4b"
                                          : "#7f6fd9",
                                      }}
                                    >
                                      {skill.name}
                                    </Typography>

                                    <Typography
                                      sx={{
                                        color: "#d7c59d",
                                        fontSize: ".9rem",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {skill.description}
                                    </Typography>

                                    <Button
                                      variant="text"
                                      sx={{ alignSelf: "flex-start", color: "#f2c76c" }}
                                      onClick={() =>
                                        setDescriptionDialog({
                                          title: skill.name,
                                          body: skill.description,
                                        })
                                      }
                                    >
                                      Ler descricao completa
                                    </Button>

                                    {skill.levelRequirement && (
                                      <Chip
                                        label={`Requer nível ${skill.levelRequirement}`}
                                        sx={{
                                          alignSelf: "flex-start",
                                          bgcolor: "rgba(95,182,196,.16)",
                                          color: "#dff7ff",
                                        }}
                                      />
                                    )}

                                    {skill.requiresSkillId && (
                                      <Chip
                                        label={`Requer outro movimento`}
                                        sx={{
                                          alignSelf: "flex-start",
                                          bgcolor: "rgba(170,38,61,.18)",
                                          color: "#ffd6dc",
                                        }}
                                      />
                                    )}

                                    {requirementBlocked && (
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ alignSelf: "flex-start" }}
                                        onClick={() =>
                                          setDescriptionDialog({
                                            title: `Requisitos: ${skill.name}`,
                                            body: getSkillRequirementText(skill),
                                          })
                                        }
                                      >
                                        Requisitos
                                      </Button>
                                    )}

                                    <Button
                                      variant={
                                        alreadySelected
                                          ? "contained"
                                          : "outlined"
                                      }
                                      disabled={
                                        alreadySelected ||
                                        remainingPoints <= 0 ||
                                        !canLearnSkill(skill)
                                      }
                                      onClick={() => {
                                        setCharacter((current) => ({
                                          ...current,
                                          selectedSkillIds: [
                                            ...current.selectedSkillIds,
                                            skill.id,
                                          ],
                                        }));
                                      }}
                                    >
                                      {alreadySelected
                                        ? "Aprendida"
                                        : character.skillsLocked
                                          ? "Travada pelo mestre"
                                        : skill.levelRequirement &&
                                            character.level <
                                              skill.levelRequirement
                                          ? `Requer nível ${skill.levelRequirement}`
                                          : skill.requiresSkillId &&
                                              !character.selectedSkillIds.includes(
                                                skill.requiresSkillId,
                                              )
                                            ? "Pré-requisito não aprendido"
                                            : "Aprender"}
                                    </Button>
                                  </Stack>
                                </Paper>
                              );
                            },
                          )}
                        </Stack>
                      )}
                    </InfoPanel>
                  </Stack>
                </Stack>
              )}

              {activeTab === "skills" && selectedClass.usesSpells && (
                <Stack spacing={2}>
                  <InfoPanel title="Magias preparadas">
                    {!selectedClass.usesSpells ? (
                      <Typography sx={{ color: "#b9a98b" }}>
                        Esta classe nao usa preparo de magias pelo modelo base de Dungeon World.
                      </Typography>
                    ) : (
                      <Stack spacing={1.2}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                          <Chip
                            label={`${preparedSpellCost}/${spellPreparationLimit} niveis preparados`}
                            sx={{ bgcolor: "rgba(95,182,196,.16)", color: "#dff7ff" }}
                          />
                          <Chip
                            label={character.spellsLocked ? "Preparo travado" : "Preparo aberto"}
                            sx={{
                              bgcolor: character.spellsLocked
                                ? "rgba(170,38,61,.18)"
                                : "rgba(36,112,109,.18)",
                              color: "#f7edd9",
                            }}
                          />
                        </Stack>

                        <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                          Oracoes e truques custam 0. Magias de nivel 1 ou maior ocupam
                          espaco de preparo conforme seu nivel.
                        </Typography>

                        <Button
                          variant="contained"
                          disabled={character.spellsLocked || character.preparedSpellIds.length === 0}
                          onClick={() =>
                            setCharacter((current) => ({
                              ...current,
                              spellsLocked: true,
                            }))
                          }
                        >
                          Confirmar preparo
                        </Button>
                      </Stack>
                    )}
                  </InfoPanel>

                  {selectedClass.usesSpells && (
                    <InfoPanel title="Lista de magias">
                      {availableSpells.length === 0 ? (
                        <Typography sx={{ color: "#b9a98b" }}>
                          Nenhuma magia disponivel para o nivel atual.
                        </Typography>
                      ) : (
                        <Stack spacing={1.2}>
                          {availableSpells.map((spell) => {
                            const isPrepared = character.preparedSpellIds.includes(spell.id);
                            const wouldExceed =
                              !isPrepared &&
                              preparedSpellCost + spell.level > spellPreparationLimit;

                            return (
                              <Paper
                                key={spell.id}
                                variant="outlined"
                                sx={{
                                  borderColor: isPrepared
                                    ? "rgba(95,182,196,.65)"
                                    : "rgba(217,200,159,.14)",
                                  bgcolor: isPrepared
                                    ? "rgba(95,182,196,.12)"
                                    : "rgba(255,255,255,.04)",
                                  color: "#f7edd9",
                                  p: 1.5,
                                }}
                              >
                                <Stack spacing={1}>
                                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                                    <Chip label={spell.levelLabel} />
                                    {isPrepared && <Chip label="Preparada" />}
                                  </Stack>

                                  <Typography sx={{ color: "#5fb6c4", fontWeight: 900 }}>
                                    {spell.name}
                                  </Typography>

                                  <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.6 }}>
                                    {spell.summary}
                                  </Typography>

                                  <Button
                                    variant="text"
                                    sx={{ alignSelf: "flex-start", color: "#f2c76c" }}
                                    onClick={() =>
                                      setDescriptionDialog({
                                        title: spell.name,
                                        body: spell.summary,
                                      })
                                    }
                                  >
                                    Ler descricao completa
                                  </Button>

                                  <Button
                                    variant={isPrepared ? "contained" : "outlined"}
                                    disabled={character.spellsLocked || wouldExceed}
                                    onClick={() => toggleSpell(spell.id)}
                                  >
                                    {isPrepared
                                      ? "Remover preparo"
                                      : character.spellsLocked
                                        ? "Travada pelo mestre"
                                        : wouldExceed
                                          ? "Sem espaco de preparo"
                                          : "Preparar"}
                                  </Button>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      )}
                    </InfoPanel>
                  )}
                </Stack>
              )}

              {activeTab === "combate" && (
                <Stack spacing={2}>
                  <InfoPanel title="Estado de combate">
                    <Stack spacing={2}>
                      <ResourceBar
                        label="HP"
                        current={character.hp.current}
                        max={maxHp}
                        percent={hpPercent}
                        color="#aa263d"
                      />

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 1,
                        }}
                      >
                        <CombatStat label="Ataque" value={selectedClass.damageDice} />
                        <CombatStat label="Armadura" value={String(armor)} />
                        <CombatStat label="Arma" value={equippedWeapon?.name ?? "Desarmado"} />
                        <CombatStat
                          label="Condicao"
                          value={
                            isCritical
                              ? "Critico"
                              : isBloodied
                                ? "Ferido"
                                : "Estavel"
                          }
                        />
                      </Box>
                    </Stack>
                  </InfoPanel>

                  <Box ref={combatSceneRef}>
                  <InfoPanel title="Cena de confronto">
                    <Box
                      sx={{
                        minHeight: 190,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        border: "1px solid rgba(217,200,159,.14)",
                        background:
                          "radial-gradient(circle at 50% 20%, rgba(170,38,61,.22), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.28))",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: 92,
                          height: 92,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          border: "1px solid rgba(217,200,159,.26)",
                          bgcolor: "rgba(7,7,6,.72)",
                          boxShadow: isBloodied
                            ? "0 0 34px rgba(170,38,61,.65)"
                            : "0 0 28px rgba(197,155,75,.28)",
                        }}
                      >
                        {combatRoll ? (
                          <CombatDie roll={combatRoll} />
                        ) : (
                          <ClassSigil classId={selectedClass.id} />
                        )}
                      </Box>
                    </Box>

                    {combatRoll && (
                      <Typography
                        sx={{
                          color: "#f2c76c",
                          mt: 1.2,
                          fontSize: ".95rem",
                          fontWeight: 900,
                          textAlign: "center",
                        }}
                      >
                        {combatRoll.actionName}: {combatRoll.total}
                      </Typography>
                    )}
                  </InfoPanel>
                  </Box>

                  <InfoPanel title="Acoes">
                    <Stack spacing={1.2}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={() =>
                          rollCombatAction(
                            usableCombatActions.find(
                              (action) => action.id === "common-attack",
                            ) ?? usableCombatActions[0],
                          )
                        }
                      >
                        Ataque comum
                      </Button>

                      <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        sx={{
                          borderColor: "#f2c76c",
                          color: "#f2c76c",
                          py: 1.2,
                        }}
                        onClick={() => setIsCombatPickerOpen((current) => !current)}
                      >
                        Selecionar {selectedClass.usesSpells ? "magia" : "habilidade"}
                      </Button>

                      {isCombatPickerOpen && (
                        <Stack spacing={1}>
                          {usableCombatActions.filter((action) => action.id !== "common-attack").length === 0 ? (
                            <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                              Nenhuma {selectedClass.usesSpells ? "magia" : "habilidade"} disponivel agora.
                            </Typography>
                          ) : (
                            usableCombatActions
                              .filter((action) => action.id !== "common-attack")
                              .map((action) => (
                                <CombatActionCard
                                  key={action.id}
                                  action={action}
                                  used={combatUseCounts[action.id] ?? 0}
                                  onRoll={() => rollCombatAction(action)}
                                />
                              ))
                          )}
                        </Stack>
                      )}

                      <Button
                        variant="text"
                        sx={{ color: "#b9a98b" }}
                        onClick={() => {
                          setCombatUseCounts({});
                          setCombatRoll(null);
                        }}
                      >
                        Descansar e recuperar usos
                      </Button>
                    </Stack>
                  </InfoPanel>
                </Stack>
              )}

              {activeTab === "inventario" && (
                <Stack spacing={2}>
                  <InfoPanel title="Carga">
                    <Stack spacing={1.2}>
                      <ResourceBar
                        label="Peso"
                        current={currentLoad}
                        max={maxLoad}
                        percent={
                          maxLoad > 0
                            ? Math.min(100, Math.round((currentLoad / maxLoad) * 100))
                            : 0
                        }
                        color={currentLoad > maxLoad ? "#aa263d" : "#c59b4b"}
                      />

                      <Typography sx={{ color: currentLoad > maxLoad ? "#ffb0b8" : "#b9a98b", fontSize: ".9rem" }}>
                        Peso total: {currentLoad} / {maxLoad}. Carga da classe: {selectedClass.loadBase} + modificador de FOR.
                      </Typography>
                    </Stack>
                  </InfoPanel>

                  <InfoPanel title="Slots equipados">
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1,
                      }}
                    >
                      {(["arma", "armadura", "capacete", "acessorio1", "acessorio2"] as const).map((slot) => {
                        const itemId = character.equipment[slot];
                        const item = itemId ? items.find((currentItem) => currentItem.id === itemId) : null;

                        return (
                          <EquipmentSlotCard
                            key={slot}
                            slot={slot}
                            classId={selectedClass.id}
                            itemName={item?.name}
                          />
                        );
                      })}
                    </Box>
                  </InfoPanel>

                  <InfoPanel title="Inventario virtual">
                    {character.availableItems.length === 0 ? (
                      <Typography sx={{ color: "#b9a98b" }}>
                        Nenhum item recebido ainda. O mestre distribui itens pelo painel dele.
                      </Typography>
                    ) : (
                      <Stack spacing={1.2}>
                        {character.availableItems.map((itemId) => {
                          const item = items.find((currentItem) => currentItem.id === itemId);
                          if (!item) return null;

                          const isEquipped = Object.values(character.equipment).includes(item.id);

                          return (
                            <Paper
                              key={item.id}
                              variant="outlined"
                              sx={{
                                borderColor: isEquipped
                                  ? "rgba(197,155,75,.65)"
                                  : "rgba(217,200,159,.14)",
                                bgcolor: isEquipped
                                  ? "rgba(197,155,75,.12)"
                                  : "rgba(255,255,255,.04)",
                                color: "#f7edd9",
                                p: 1.5,
                              }}
                            >
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                                  <Chip label={item.type} />
                                  <Chip label={`peso ${item.weight}`} />
                                  {item.tags.map((tag) => (
                                    <Chip key={tag} label={tag} />
                                  ))}
                                </Stack>

                                <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                                  {item.name}
                                </Typography>

                                <Typography sx={{ color: "#d7c59d", fontSize: ".9rem", lineHeight: 1.6 }}>
                                  {item.description}
                                </Typography>

                                <Button
                                  variant={isEquipped ? "contained" : "outlined"}
                                  onClick={() =>
                                    isEquipped ? unequipItem(item.id) : equipItem(item.id)
                                  }
                                >
                                  {isEquipped ? "Desequipar" : "Equipar"}
                                </Button>
                              </Stack>
                            </Paper>
                          );
                        })}
                      </Stack>
                    )}
                  </InfoPanel>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          right: 12,
          bottom: 12,
          left: 12,
          maxWidth: 520,
          mx: "auto",
          overflow: "hidden",
          border: "1px solid rgba(217,200,159,.18)",
          borderRadius: 4,
          bgcolor: "rgba(8,8,7,.92)",
        }}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(_, value: AppTab) => setActiveTab(value)}
          sx={{
            bgcolor: "transparent",
            ".MuiBottomNavigationAction-root": { color: "#b9a98b" },
            ".Mui-selected": { color: "#f2c76c" },
          }}
        >
          {tabOrder.map((tab) => (
            <BottomNavigationAction
              label={currentTabLabels[tab]}
              value={tab}
              key={tab}
            />
          ))}
        </BottomNavigation>
      </Paper>

      <Dialog
        open={isClassDialogOpen}
        onClose={() => setIsClassDialogOpen(false)}
      >
        <DialogTitle>Confirmar classe e raça</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography sx={{ color: "#d7c59d" }}>
              Depois de confirmar, classe e raça ficam travadas para o jogador.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                borderColor: "rgba(217,200,159,.16)",
                bgcolor: "rgba(255,255,255,.04)",
                color: "#f7edd9",
                p: 1.5,
              }}
            >
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                {pendingClass.name}
              </Typography>

              <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.6 }}>
                {pendingClass.description}
              </Typography>
            </Paper>

            {pendingClass.races.length > 0 && (
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "#b9a98b" }}>Raça</InputLabel>

                <Select
                  label="Raça"
                  value={pendingRaceId || pendingClass.races[0]?.id || ""}
                  onChange={(event) => setPendingRaceId(event.target.value as string)}
                  sx={{
                    color: "#f7edd9",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(217,200,159,.22)",
                    },
                    ".MuiSvgIcon-root": { color: "#f7edd9" },
                  }}
                >
                  {pendingClass.races.map((race) => (
                    <MenuItem value={race.id} key={race.id}>
                      {race.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {pendingRace && (
              <Paper
                variant="outlined"
                sx={{
                  borderColor: "rgba(217,200,159,.16)",
                  bgcolor: "rgba(197,155,75,.08)",
                  color: "#f7edd9",
                  p: 1.5,
                }}
              >
                <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
                  {pendingRace.name}
                </Typography>

                <Typography sx={{ color: "#d7c59d", mt: 0.6, lineHeight: 1.6 }}>
                  {pendingRace.description}
                </Typography>
              </Paper>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsClassDialogOpen(false)}>Cancelar</Button>

          <Button variant="contained" onClick={confirmClassChange}>
            Confirmar escolha
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(descriptionDialog)}
        onClose={() => setDescriptionDialog(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{descriptionDialog?.title}</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "#d7c59d", lineHeight: 1.7 }}>
            {descriptionDialog?.body}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={() => setDescriptionDialog(null)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <AttributeDistributionDrawer
        open={isAttributeDrawerOpen}
        onClose={() => setIsAttributeDrawerOpen(false)}
        onConfirm={confirmAttributes}
      />
    </Box>
  );
}

function ResourceBar({
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

function InfoPanel({
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

function CombatStat({ label, value }: { label: string; value: string }) {
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

function EquipmentSlotCard({
  slot,
  classId,
  itemName,
}: {
  slot: string;
  classId: string;
  itemName?: string;
}) {
  const labels: Record<string, string> = {
    arma: "Arma",
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
    paladino: "⚔",
    ranger: "弓",
  };

  const slotIcon =
    slot === "arma"
      ? weaponSilhouettes[classId] ?? "⚔"
      : slot === "armadura"
        ? "▣"
        : slot === "capacete"
          ? "◠"
          : "◇";

  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: 112,
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
        <Typography sx={{ color: itemName ? "#f2c76c" : "#5b5141", fontSize: 34, lineHeight: 1 }}>
          {slotIcon}
        </Typography>

        <Typography sx={{ color: "#b9a98b", fontSize: ".72rem" }}>
          {labels[slot] ?? slot}
        </Typography>

        <Typography sx={{ fontWeight: 900, fontSize: ".86rem" }}>
          {itemName ?? "Vazio"}
        </Typography>
      </Stack>
    </Paper>
  );
}

function CombatActionCard({
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
          <Chip label={usesLabel} />
        </Stack>

        <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
          {action.name}
        </Typography>

        <Typography sx={{ color: "#d7c59d", fontSize: ".88rem", lineHeight: 1.55 }}>
          {action.detail}
        </Typography>

        <Button variant="contained" onClick={onRoll}>
          Usar e rolar
        </Button>
      </Stack>
    </Paper>
  );
}

function CombatDie({ roll }: { roll: CombatRoll }) {
  return (
    <Box
      sx={{
        width: 112,
        height: 112,
        display: "grid",
        placeItems: "center",
        position: "relative",
        borderRadius: 4,
        border: "2px solid rgba(242,199,108,.62)",
        background:
          "linear-gradient(145deg, rgba(242,199,108,.24), rgba(170,38,61,.28)), #16110d",
        boxShadow:
          "0 0 30px rgba(242,199,108,.32), inset 0 0 24px rgba(0,0,0,.45)",
        transform: "rotate(45deg)",
      }}
    >
      <Box sx={{ transform: "rotate(-45deg)", textAlign: "center" }}>
        <Typography sx={{ color: "#b9a98b", fontSize: ".75rem", fontWeight: 900 }}>
          {roll.dice}
        </Typography>

        <Typography sx={{ color: "#fff3dc", fontSize: 38, fontWeight: 900, lineHeight: 1 }}>
          {roll.total}
        </Typography>

        <Typography sx={{ color: "#f2c76c", fontSize: ".68rem" }}>
          {roll.rolls.join(" + ")}
        </Typography>
      </Box>
    </Box>
  );
}

function ClassSigil({ classId }: { classId: string }) {
  const sigils: Record<string, { symbol: string; color: string }> = {
    barbaro: { symbol: "☠", color: "#aa263d" },
    bardo: { symbol: "♪", color: "#c59b4b" },
    clerigo: { symbol: "✚", color: "#d8c88f" },
    druida: { symbol: "♣", color: "#5f8f5f" },
    guerreiro: { symbol: "⚔", color: "#c0b08a" },
    ladrao: { symbol: "♦", color: "#7f6fd9" },
    mago: { symbol: "✦", color: "#5fb6c4" },
    paladino: { symbol: "♜", color: "#e0c26d" },
    ranger: { symbol: "➶", color: "#7fa46b" },
  };

  const sigil = sigils[classId] ?? { symbol: "◆", color: "#c59b4b" };

  return (
    <Typography
      sx={{
        color: sigil.color,
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1,
        textShadow: `0 0 14px ${sigil.color}`,
      }}
    >
      {sigil.symbol}
    </Typography>
  );
}
