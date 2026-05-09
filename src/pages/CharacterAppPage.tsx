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
  SvgIcon,
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
import { beginnerSheetConcepts, getClassGuide } from "../data/classGuides";
import { classSelectSounds } from "../data/classSounds";
import {
  getCreationBenefits,
  getCreationRulesFor,
  getGrantedSpellIds,
  getOptionsForCreationRule,
} from "../data/classCreation";
import { dwClasses, unselectedClass } from "../data/dwClasses";
import { basicMoves } from "../data/dwMoves";
import {
  classStartingConsumables,
  classStartingItemIds,
  consumableItems,
  items,
} from "../data/items";
import {
  defaultSpellRisks,
  spells,
  type DwSpell,
  type SpellRisk,
} from "../data/spells";
import AdventureMapsDialog from "../components/AdventureMapsDialog";
import CombatDiceRoller from "../components/CombatDiceRoller";
import AttributeDistributionDrawer from "../components/AttributeDistributionDrawer";
import {
  attributeKeys,
  attributeLabels,
  type AttributeKey,
  type Character,
  type EquipmentSlot,
  type PlayerProfileSummary,
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
  playerProfiles?: PlayerProfileSummary[];
  selectedPlayerIndex?: number;
  onSelectPlayer?: (index: number) => void;
  onApplyConsumableToPlayer?: (consumableId: string, targetIndex: number) => void;
};

type CombatAction = {
  id: string;
  name: string;
  type: "attack" | "skill" | "spell";
  dice: string;
  attribute: AttributeKey;
  detail: string;
  usesPerRest: number | null;
};

type CombatRoll = {
  actionName: string;
  dice: string;
  attribute: AttributeKey;
  attributeValue: number;
  rolls: number[];
  diceTotal: number;
  total: number;
  isCritical: boolean;
  isCriticalFailure: boolean;
};

type SpellCastRoll = {
  spell: DwSpell;
  rolls: number[];
  modifier: number;
  penalty: number;
  total: number;
  outcome: "success" | "partial" | "miss";
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

const tabIcons: Record<AppTab, ReactNode> = {
  personagem: <PersonIcon />,
  descricao: <ScrollIcon />,
  skills: <SparkIcon />,
  inventario: <BackpackIcon />,
  combate: <SwordsIcon />,
};

function buildDefaultCreationChoices(
  classId: string,
  raceId: string,
  playerProfiles: PlayerProfileSummary[] = [],
  selectedPlayerIndex?: number,
) {
  const rules = getCreationRulesFor(classId, raceId, "identity");

  return rules.reduce<Record<string, string>>((acc, rule) => {
    const options = getOptionsForCreationRule(
      rule,
      playerProfiles,
      selectedPlayerIndex,
    );
    if (rule.kind === "select" && options.length > 0) {
      acc[rule.id] = options[0].value;
    }
    return acc;
  }, {});
}

function formatCreationChoiceValue(
  rule: ReturnType<typeof getCreationRulesFor>[number],
  value: string,
  playerProfiles: PlayerProfileSummary[] = [],
  selectedPlayerIndex?: number,
) {
  return (
    getOptionsForCreationRule(
      rule,
      playerProfiles,
      selectedPlayerIndex,
    ).find((option) => option.value === value)
      ?.label ?? value
  );
}

function getTopIdentitySummary(
  choices: Record<string, string>,
  rules: ReturnType<typeof getCreationRulesFor>,
  playerProfiles: PlayerProfileSummary[],
  selectedPlayerIndex: number,
) {
  const highlightedRuleIds = new Set([
    "cleric-deity",
    "cleric-domain",
    "wizard-spellbook-style",
    "ranger-animal",
    "paladin-quest",
    "barbarian-appetite",
    "fighter-signature-weapon",
    "rogue-poison",
    "engineer-codex",
  ]);

  return rules
    .filter((rule) => highlightedRuleIds.has(rule.id))
    .map((rule) => {
      const value = choices[rule.id];
      if (!value) return null;
      return {
        label: rule.label,
        value: formatCreationChoiceValue(
          rule,
          value,
          playerProfiles,
          selectedPlayerIndex,
        ),
      };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

export default function CharacterAppPage({
  mode,
  character,
  setCharacter,
  onBackToCodex,
  onBackToMaster,
  playerProfiles = [],
  selectedPlayerIndex = 0,
  onSelectPlayer,
  onApplyConsumableToPlayer,
}: CharacterAppPageProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("personagem");
  const [pendingClassId, setPendingClassId] = useState("");
  const [pendingRaceId, setPendingRaceId] = useState("");
  const [pendingCreationChoices, setPendingCreationChoices] = useState<
    Record<string, string>
  >({});
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isMapsDialogOpen, setIsMapsDialogOpen] = useState(false);
  const [classSelectPulse, setClassSelectPulse] = useState(false);
  const [isAttributeDrawerOpen, setIsAttributeDrawerOpen] = useState(false);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [isCombatPickerOpen, setIsCombatPickerOpen] = useState(false);
  const [isRollingCombat, setIsRollingCombat] = useState(false);
  const [rollingActionName, setRollingActionName] = useState("");
  const [rollingDice, setRollingDice] = useState("");
  const [combatUseCounts, setCombatUseCounts] = useState<
    Record<string, number>
  >({});
  const [combatRoll, setCombatRoll] = useState<CombatRoll | null>(null);
  const [spellCastRoll, setSpellCastRoll] = useState<SpellCastRoll | null>(
    null,
  );
  const [consumableTargets, setConsumableTargets] = useState<
    Record<string, number>
  >({});
  const combatSceneRef = useRef<HTMLDivElement | null>(null);
  const classAudioContextRef = useRef<AudioContext | null>(null);
  const classAudioBuffersRef = useRef<Record<string, AudioBuffer>>({});

  const selectedClass = useMemo(() => {
    return (
      dwClasses.find((dwClass) => dwClass.id === character.classId) ??
      unselectedClass
    );
  }, [character.classId]);
  const classGuide = getClassGuide(selectedClass.id);

  const selectedRace = selectedClass.races.find(
    (race) => race.id === character.raceId,
  );
  const displayRace = selectedRace ?? selectedClass.races[0];
  const pendingClass =
    dwClasses.find((dwClass) => dwClass.id === pendingClassId) ??
    selectedClass;
  const pendingRace =
    pendingClass.races.find((race) => race.id === pendingRaceId) ??
    pendingClass.races[0];
  const pendingCreationRules = getCreationRulesFor(
    pendingClass.id,
    pendingRace?.id ?? "",
    "identity",
  );
  const activeIdentityRules = getCreationRulesFor(
    selectedClass.id,
    character.raceId,
    "identity",
  );
  const activeBondRules = getCreationRulesFor(
    selectedClass.id,
    character.raceId,
    "bond",
  );
  const bondChoicesComplete =
    activeBondRules.length > 0 &&
    activeBondRules.every((rule) => {
      if (!rule.required) return true;
      return Boolean(character.creationChoices[rule.id]?.trim());
    });
  const activeCreationBenefits = getCreationBenefits(character.creationChoices);
  const pendingCreationComplete = pendingCreationRules.every((rule) => {
    if (!rule.required) return true;
    if (
      rule.id === "ranger-animal-custom" &&
      pendingCreationChoices["ranger-animal"] !== "Outro"
    ) {
      return true;
    }
    return Boolean(pendingCreationChoices[rule.id]?.trim());
  });

  const equippedWeapon = character.equipment.arma
    ? items.find((item) => item.id === character.equipment.arma)
    : null;

  const currentTabLabels: Record<AppTab, string> = {
    ...tabLabels,
    skills: selectedClass.usesSpells
      ? selectedClass.id === "engenheiro-arcano"
        ? "Efeitos"
        : "Magias"
      : "Habilidades",
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
  const maxLoad =
    selectedClass.loadBase + getAttributeModifier(finalAttributes.forca);
  const currentLoad = character.availableItems
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is (typeof items)[number] => Boolean(item))
    .reduce((acc, item) => acc + item.weight, 0) +
    consumableItems.reduce(
      (acc, item) =>
        acc +
        (character.consumables[item.id] && character.consumables[item.id] > 0
          ? item.weight
          : 0),
      0,
    );

  const armor = equippedItemsData.reduce(
    (acc, item) => acc + (item.modifiers.armor ?? 0),
    character.modifiers.armor,
  );

  const xpToNextLevel = getXpToNextLevel(character.level);
  const canLevelUp = character.xp >= xpToNextLevel;
  const xpPercent =
    xpToNextLevel > 0
      ? Math.min(100, Math.round((character.xp / xpToNextLevel) * 100))
      : 0;

  const grantedSpellIds = getGrantedSpellIds(character.creationChoices);
  const classSpells = spells.filter(
    (spell) =>
      spell.tradition === selectedClass.id ||
      grantedSpellIds.includes(spell.id),
  );
  const availableSpells = classSpells.filter(
    (spell) => spell.level <= character.level,
  );
  const preparedSpellIds = new Set([
    ...character.preparedSpellIds,
    ...availableSpells
      .filter((spell) => spell.level === 0)
      .map((spell) => spell.id),
  ]);
  const exhaustedSpellIds = new Set(character.exhaustedSpellIds ?? []);
  const preparedSpellCost = availableSpells
    .filter((spell) => character.preparedSpellIds.includes(spell.id))
    .reduce((acc, spell) => acc + spell.level, 0);
  const spellPreparationLimit = character.level + 1;
  const spellCastingAttribute: AttributeKey =
    selectedClass.spellCastingAttribute ??
    (selectedClass.id === "clerigo" ? "sabedoria" : "inteligencia");
  const spellCastingModifier = getAttributeModifier(
    finalAttributes[spellCastingAttribute],
  );
  const spellCastPenalty = character.spellCastPenalty ?? 0;
  const activePreparedSpells = availableSpells.filter(
    (spell) => preparedSpellIds.has(spell.id) && !exhaustedSpellIds.has(spell.id),
  );
  const spentSkillPoints = character.selectedSkillIds.length;
  const remainingSkillPoints = Math.max(
    0,
    character.skillPoints - spentSkillPoints,
  );

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
      attribute: selectedClass.mainAttribute ?? "forca",
      detail: `Dano base da classe: ${selectedClass.damageDice}.`,
      usesPerRest: null,
    },
    ...(selectedClass.usesSpells
      ? activePreparedSpells
          .filter((spell) => spell.damageDice)
          .map<CombatAction>((spell) => ({
            id: `spell-${spell.id}`,
            name: spell.name,
            type: "spell",
            dice: spell.damageDice ?? "1d4",
            attribute: spellCastingAttribute,
            detail: `${spell.levelLabel}. ${spell.summary}`,
            usesPerRest: null,
          }))
      : [
          ...selectedClass.startingSkills.map<CombatAction>((skill) => ({
            id: `skill-${skill.id}`,
            name: skill.name,
            type: "skill",
            dice: `1${selectedClass.damageDice}`,
            attribute: skill.rollAttribute ?? selectedClass.mainAttribute ?? "forca",
            detail: skill.description,
            usesPerRest: null,
          })),
          ...learnedAdvancedSkills
            .filter(
              (skill) =>
                !skill.levelRequirement ||
                character.level >= skill.levelRequirement,
            )
            .map<CombatAction>((skill) => ({
              id: `skill-${skill.id}`,
              name: skill.name,
              type: "skill",
              dice: `1${selectedClass.damageDice}`,
              attribute:
                skill.rollAttribute ?? selectedClass.mainAttribute ?? "forca",
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

  async function playClassSelectSound(classId: string) {
    const classSound = classSelectSounds[classId];
    if (!classSound) return;

    try {
      const audioContext =
        classAudioContextRef.current ?? new AudioContext();
      classAudioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      let audioBuffer = classAudioBuffersRef.current[classId];

      if (!audioBuffer) {
        const response = await fetch(classSound.src);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        classAudioBuffersRef.current[classId] = audioBuffer;
      }

      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      const compressor = audioContext.createDynamicsCompressor();

      gain.gain.setValueAtTime(classSound.gain, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(classSound.gain * 0.82, 0.001),
        audioContext.currentTime + Math.min(audioBuffer.duration, 2.4),
      );

      compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
      compressor.knee.setValueAtTime(18, audioContext.currentTime);
      compressor.ratio.setValueAtTime(5, audioContext.currentTime);
      compressor.attack.setValueAtTime(0.01, audioContext.currentTime);
      compressor.release.setValueAtTime(0.22, audioContext.currentTime);

      source.buffer = audioBuffer;
      source.connect(gain);
      gain.connect(compressor);
      compressor.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.warn("Nao foi possivel tocar o audio da classe.", error);
    }
  }

  function requestClassChange(classId: string) {
    if (character.classLocked) return;

    const nextClass = dwClasses.find((dwClass) => dwClass.id === classId);
    const nextRaceId = nextClass?.races[0]?.id ?? "";
    setPendingClassId(classId);
    setPendingRaceId(nextRaceId);
    setPendingCreationChoices(
      buildDefaultCreationChoices(
        classId,
        nextRaceId,
        playerProfiles,
        selectedPlayerIndex,
      ),
    );
    setIsClassDialogOpen(true);
  }

  function confirmClassChange() {
    const newClass = dwClasses.find((dwClass) => dwClass.id === pendingClassId);
    if (!newClass) return;
    if (!pendingCreationComplete) return;

    const newMaxHp = newClass.baseHp + character.attributes.constituicao;
    const nextRaceId = pendingRaceId || newClass.races[0]?.id || "";
    const startingItemIds = classStartingItemIds[newClass.id] ?? [];
    const startingConsumables = classStartingConsumables[newClass.id] ?? {};

    setCharacter((current) => ({
      ...current,
      classId: pendingClassId,
      classLocked: true,
      raceId: nextRaceId,
      raceLocked: Boolean(nextRaceId),
      creationChoices: {
        ...current.creationChoices,
        ...pendingCreationChoices,
      },
      creationChoicesLocked: true,
      bondsLocked: false,
      preparedSpellIds: [],
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: false,
      availableItems: Array.from(
        new Set([...current.availableItems, ...startingItemIds]),
      ),
      consumables: {
        ...current.consumables,
        ...Object.fromEntries(
          Object.entries(startingConsumables).map(([id, amount]) => [
            id,
            Math.max(current.consumables[id] ?? 0, amount),
          ]),
        ),
      },
      hp: {
        ...current.hp,
        current: newMaxHp,
      },
    }));

    setIsClassDialogOpen(false);
    setPendingCreationChoices({});
    setClassSelectPulse(true);
    void playClassSelectSound(newClass.id);

    setTimeout(() => {
      setActiveTab("descricao");
      setClassSelectPulse(false);
    }, 700);
  }

  function updateBondChoice(ruleId: string, value: string) {
    if (character.bondsLocked) return;

    setCharacter((current) => ({
      ...current,
      creationChoices: {
        ...current.creationChoices,
        [ruleId]: value,
      },
    }));
  }

  function confirmBondChoices() {
    if (!bondChoicesComplete) return;
    setCharacter((current) => ({ ...current, bondsLocked: true }));
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

    if (item.slot === "arma") {
      if (character.equipment.arma === itemId) return "arma";
      if (character.equipment.armaSecundaria === itemId) {
        return "armaSecundaria";
      }
      if (!character.equipment.arma) return "arma";
      if (!character.equipment.armaSecundaria) return "armaSecundaria";

      return "arma";
    }

    if (item.slot !== "acessorio") {
      return item.slot;
    }

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

  function useConsumable(consumableId: string, targetIndex = selectedPlayerIndex) {
    const consumable = consumableItems.find((item) => item.id === consumableId);
    const currentUses = character.consumables[consumableId] ?? 0;
    if (!consumable || currentUses <= 0) return;

    if (onApplyConsumableToPlayer) {
      onApplyConsumableToPlayer(consumableId, targetIndex);
      return;
    }

    setCharacter((current) => {
      const nextUses = Math.max(0, (current.consumables[consumableId] ?? 0) - 1);
      const nextConsumables = {
        ...current.consumables,
        [consumableId]: nextUses,
      };

      let nextHp = current.hp.current;
      if (consumable.effect.type === "heal") {
        nextHp = Math.min(maxHp, current.hp.current + consumable.effect.amount);
      }
      if (consumable.effect.type === "healHalf") {
        nextHp = Math.min(
          maxHp,
          current.hp.current + Math.ceil(maxHp / 2),
        );
      }

      return {
        ...current,
        consumables: nextConsumables,
        hp: {
          ...current.hp,
          current: nextHp,
        },
      };
    });
  }

  function toggleSpell(spellId: string) {
    if (character.spellsLocked) return;

    const spell = availableSpells.find(
      (currentSpell) => currentSpell.id === spellId,
    );
    if (!spell) return;
    if (spell.level === 0) return;

    const isPrepared = character.preparedSpellIds.includes(spellId);
    const nextCost = isPrepared
      ? preparedSpellCost - spell.level
      : preparedSpellCost + spell.level;

    if (nextCost > spellPreparationLimit) return;

    setCharacter((current) => ({
      ...current,
      preparedSpellIds: isPrepared
        ? current.preparedSpellIds.filter(
            (currentSpellId) => currentSpellId !== spellId,
          )
        : [...current.preparedSpellIds, spellId],
    }));
  }

  function confirmSpellPreparation() {
    setCharacter((current) => ({
      ...current,
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: true,
    }));
    setSpellCastRoll(null);
  }

  function resetSpellPreparation() {
    setCharacter((current) => ({
      ...current,
      preparedSpellIds: [],
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: false,
    }));
    setSpellCastRoll(null);
  }

  function castSpell(spell: DwSpell) {
    if (!preparedSpellIds.has(spell.id) || exhaustedSpellIds.has(spell.id)) {
      return;
    }

    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const total =
      rolls[0] + rolls[1] + spellCastingModifier + spellCastPenalty;
    const outcome =
      total >= 10 ? "success" : total >= 7 ? "partial" : "miss";

    setSpellCastRoll({
      spell,
      rolls,
      modifier: spellCastingModifier,
      penalty: spellCastPenalty,
      total,
      outcome,
    });
  }

  function applySpellPenalty() {
    setCharacter((current) => ({
      ...current,
      spellCastPenalty: Math.max(-3, (current.spellCastPenalty ?? 0) - 1),
    }));
  }

  function exhaustSpell(spellId: string) {
    setCharacter((current) => ({
      ...current,
      exhaustedSpellIds: (current.exhaustedSpellIds ?? []).includes(spellId)
        ? current.exhaustedSpellIds
        : [...(current.exhaustedSpellIds ?? []), spellId],
    }));
  }

  function rollCombatAction(action: CombatAction) {
    setIsCombatPickerOpen(false);
    setRollingActionName(action.name);
    setRollingDice(action.dice);
    setCombatRoll(null);
    setIsRollingCombat(true);

    window.setTimeout(() => {
      const { diceCount, dieSize } = parseDice(action.dice);

      const rolls = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * dieSize) + 1,
      );
      const diceTotal = rolls.reduce((acc, value) => acc + value, 0);
      const attributeValue = finalAttributes[action.attribute];

      setCombatRoll({
        actionName: action.name,
        dice: action.dice,
        attribute: action.attribute,
        attributeValue,
        rolls,
        diceTotal,
        total: diceTotal + attributeValue,
        isCritical: rolls.every((value) => value === dieSize),
        isCriticalFailure: rolls.every((value) => value === 1),
      });

      if (action.usesPerRest !== null) {
        setCombatUseCounts((current) => ({
          ...current,
          [action.id]: (current[action.id] ?? 0) + 1,
        }));
      }

      setIsRollingCombat(false);
    }, 2000);

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
        height: "100dvh",
        minHeight: 0,
        overflow: "hidden",
        bgcolor: "#070706",
        background:
          "radial-gradient(circle at 10% 0%, rgba(170,38,61,.26), transparent 22rem), radial-gradient(circle at 90% 12%, rgba(36,112,109,.22), transparent 20rem), linear-gradient(180deg, #12100d 0%, #070706 100%)",
        color: "#f7edd9",
        px: { xs: 1.25, sm: 2 },
        py: { xs: 1.25, sm: 2 },
      }}
    >
      <Stack
        spacing={1.5}
        sx={{
          width: "100%",
          maxWidth: { xs: 520, md: 760 },
          height: "100%",
          mx: "auto",
          overflowY: "auto",
          overscrollBehavior: "contain",
          pb: "calc(96px + env(safe-area-inset-bottom))",
          pr: { xs: 0, sm: 0.5 },
          scrollbarWidth: "thin",
        }}
      >
        {playerProfiles.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              borderColor: "rgba(217,200,159,.14)",
              bgcolor: "rgba(255,255,255,.04)",
              p: { xs: 0.9, sm: 1 },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.2, sm: 1 }}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: "#c59b4b",
                  fontWeight: 900,
                  fontSize: ".78rem",
                  flex: "0 0 auto",
                }}
              >
                Perfil ativo
              </Typography>
              <Typography
                sx={{
                  color: "#d7c59d",
                  fontSize: ".88rem",
                  minWidth: 0,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {playerProfiles[selectedPlayerIndex]?.label ?? "Jogador"} -{" "}
                {character.name || "Sem nome"} - {selectedClass.name}
              </Typography>
            </Stack>
          </Paper>
        )}

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
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

          <Button variant="contained" onClick={() => setIsMapsDialogOpen(true)}>
            Mapas
          </Button>
        </Stack>

        <Card
          sx={{
            position: "relative",
            overflow: "visible",
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
                          transform: classSelectPulse
                            ? "scale(1.08)"
                            : "scale(1)",
                        }}
                      >
                        <ClassSigil classId={selectedClass.id} />
                      </Box>
                    </Fade>

                    <Box sx={{ minWidth: 0 }}>
                      {character.nameLocked || activeTab !== "personagem" ? (
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            lineHeight: 0.9,
                            minHeight: 42,
                          }}
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
                        <Typography
                          sx={{ color: "#c59b4b", mt: 0.25, fontSize: ".9rem" }}
                        >
                          {displayRace.name}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              {activeTab === "personagem" && (
                <>
                  {character.classLocked ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        borderColor: "rgba(197,155,75,.24)",
                        bgcolor: "rgba(197,155,75,.08)",
                        color: "#f7edd9",
                        p: 1.25,
                      }}
                    >
                      <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                        Classe definida
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: "wrap", mt: 1 }}
                      >
                        <Chip label={selectedClass.name} />
                        {displayRace && <Chip label={displayRace.name} />}
                        {getTopIdentitySummary(
                          character.creationChoices,
                          activeIdentityRules,
                          playerProfiles,
                          selectedPlayerIndex,
                        ).map((summary) => (
                          <Chip
                            key={`${summary.label}-${summary.value}`}
                            label={`${summary.label}: ${summary.value}`}
                            sx={{
                              bgcolor: "rgba(95,182,196,.14)",
                              color: "#dff7ff",
                              height: "auto",
                              py: 0.4,
                              ".MuiChip-label": {
                                whiteSpace: "normal",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  ) : (
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "#b9a98b" }}>Classe</InputLabel>
                      <Select
                        label="Classe"
                        value={character.classId}
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
                        <MenuItem value="">Classe nao selecionada</MenuItem>
                        {dwClasses.map((dwClass) => (
                          <MenuItem value={dwClass.id} key={dwClass.id}>
                            {dwClass.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
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

                  <ResourceBar
                    label="XP"
                    current={character.xp}
                    max={xpToNextLevel}
                    percent={xpPercent}
                    color={canLevelUp ? "#f2c76c" : "#5fb6c4"}
                  />

                  {canLevelUp && (
                    <Typography
                      sx={{
                        color: "#f2c76c",
                        fontSize: ".88rem",
                        fontWeight: 900,
                      }}
                    >
                      XP suficiente para subir de nivel pelo painel do mestre.
                    </Typography>
                  )}

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      display: "none",
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

                  {activeIdentityRules.length > 0 && (
                    <InfoPanel title="Escolhas de criacao">
                      <Stack spacing={1}>
                        {activeIdentityRules.map((rule) => {
                          if (
                            rule.id === "ranger-animal-custom" &&
                            character.creationChoices["ranger-animal"] !==
                              "Outro"
                          ) {
                            return null;
                          }

                          const value = character.creationChoices[rule.id];

                          return (
                            <Paper
                              key={rule.id}
                              variant="outlined"
                              sx={{
                                borderColor: value
                                  ? "rgba(197,155,75,.22)"
                                  : "rgba(170,38,61,.28)",
                                bgcolor: "rgba(255,255,255,.04)",
                                color: "#f7edd9",
                                p: 1.2,
                              }}
                            >
                              <Typography
                                sx={{ color: "#c59b4b", fontWeight: 900 }}
                              >
                                {rule.label}
                              </Typography>
                              <Typography
                                sx={{ color: "#d7c59d", fontSize: ".9rem" }}
                              >
                                {value
                                  ? formatCreationChoiceValue(
                                      rule,
                                      value,
                                      playerProfiles,
                                      selectedPlayerIndex,
                                    )
                                  : "Pendente"}
                              </Typography>
                              {value && (
                                <Typography
                                  sx={{ color: "#9f9277", fontSize: ".78rem" }}
                                >
                                  {
                                    getOptionsForCreationRule(
                                      rule,
                                      playerProfiles,
                                      selectedPlayerIndex,
                                    ).find((option) => option.value === value)
                                      ?.description
                                  }
                                </Typography>
                              )}
                              <Typography
                                sx={{ color: "#9f9277", fontSize: ".78rem" }}
                              >
                                {rule.helper}
                              </Typography>
                            </Paper>
                          );
                        })}

                        {activeCreationBenefits.map((benefit) => (
                          <Chip
                            key={`${benefit.label}-${benefit.value}`}
                            label={`${benefit.label}: ${benefit.value}`}
                            sx={{
                              alignSelf: "flex-start",
                              bgcolor: "rgba(95,182,196,.16)",
                              color: "#dff7ff",
                            }}
                          />
                        ))}
                      </Stack>
                    </InfoPanel>
                  )}
                  {activeBondRules.length > 0 && (
                    <InfoPanel title="Vinculos">
                      <Stack spacing={1}>
                        {activeBondRules.map((rule) => {
                          const value = character.creationChoices[rule.id];
                          const options = getOptionsForCreationRule(
                            rule,
                            playerProfiles,
                            selectedPlayerIndex,
                          );
                          const selectedOption = options.find(
                            (option) => option.value === value,
                          );

                          return (
                            <Paper
                              key={rule.id}
                              variant="outlined"
                              sx={{
                                borderColor: value
                                  ? "rgba(95,182,196,.55)"
                                  : "rgba(170,38,61,.28)",
                                bgcolor: value
                                  ? "rgba(95,182,196,.12)"
                                  : "rgba(255,255,255,.04)",
                                color: "#f7edd9",
                                p: 1.2,
                              }}
                            >
                              <Typography
                                sx={{ color: "#5fb6c4", fontWeight: 900 }}
                              >
                                {rule.label}
                              </Typography>
                              <Typography
                                sx={{ color: "#d7c59d", fontSize: ".9rem" }}
                              >
                                {selectedOption?.label ?? value ?? "Pendente"}
                              </Typography>
                              <Typography
                                sx={{ color: "#9f9277", fontSize: ".78rem" }}
                              >
                                {selectedOption?.description ?? rule.helper}
                              </Typography>
                              {!character.bondsLocked && (
                                <FormControl
                                  fullWidth
                                  size="small"
                                  sx={{ mt: 1 }}
                                >
                                  <InputLabel>{rule.label}</InputLabel>
                                  <Select
                                    label={rule.label}
                                    value={value ?? ""}
                                    onChange={(event) =>
                                      updateBondChoice(
                                        rule.id,
                                        event.target.value as string,
                                      )
                                    }
                                  >
                                    {options.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        <Box>
                                          <Typography sx={{ fontWeight: 900 }}>
                                            {option.label}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: "#b9a98b",
                                              fontSize: ".78rem",
                                              whiteSpace: "normal",
                                            }}
                                          >
                                            {option.description}
                                          </Typography>
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Paper>
                          );
                        })}
                        <Button
                          variant="contained"
                          disabled={
                            character.bondsLocked || !bondChoicesComplete
                          }
                          onClick={confirmBondChoices}
                        >
                          {character.bondsLocked
                            ? "Vinculos travados"
                            : "Confirmar vinculos"}
                        </Button>
                      </Stack>
                    </InfoPanel>
                  )}
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
                      <Stack spacing={1} sx={{ mb: 1.5 }}>
  <Chip
    label={`Arma principal: ${
      equippedWeapon?.name ?? "Nenhuma"
    }`}
    sx={{
      bgcolor: "rgba(197,155,75,.14)",
      color: "#f7edd9",
    }}
  />

  <Chip
    label={`Arma secundária: ${
      character.equipment.armaSecundaria
        ? items.find(
            (item) =>
              item.id ===
              character.equipment.armaSecundaria,
          )?.name
        : "Nenhuma"
    }`}
    sx={{
      bgcolor: "rgba(95,182,196,.14)",
      color: "#dff7ff",
    }}
  />
</Stack>
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
                <Stack spacing={2}>
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

                  <InfoPanel title={`Guia detalhado: ${selectedClass.name}`}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 1.2,
                        mb: 2,
                      }}
                    >
                      <DescriptionStat
                        label="Pontos de vida iniciais"
                        value={`${selectedClass.baseHp} + Constituicao`}
                      />
                      <DescriptionStat
                        label="Dano base"
                        value={`1${selectedClass.damageDice}`}
                      />
                      <DescriptionStat
                        label="Carga"
                        value={`${selectedClass.loadBase} + FOR`}
                      />
                    </Box>

                    <DescriptionSection
                      title="Fantasia da classe"
                      items={classGuide.fantasy}
                    />
                    <DescriptionSection
                      title="Papel na mesa"
                      items={classGuide.tableRole}
                    />
                    <DescriptionSection
                      title="Primeira sessao"
                      items={classGuide.firstSession}
                    />
                    <DescriptionSection
                      title="Como ler movimentos"
                      items={classGuide.moveReading}
                    />

                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 1.4,
                        p: 1.4,
                        borderColor: "rgba(95,182,196,.2)",
                        bgcolor: "rgba(36,112,109,.12)",
                      }}
                    >
                      <Typography
                        sx={{ color: "#5fb6c4", fontWeight: 900, mb: 0.6 }}
                      >
                        Exemplo em cena
                      </Typography>
                      <Typography
                        sx={{
                          color: "#d7c59d",
                          fontSize: ".92rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {classGuide.example}
                      </Typography>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 1.2,
                        p: 1.4,
                        borderColor: "rgba(197,155,75,.22)",
                        bgcolor: "rgba(197,155,75,.1)",
                      }}
                    >
                      <Typography
                        sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.6 }}
                      >
                        Dica para o mestre
                      </Typography>
                      <Typography
                        sx={{
                          color: "#d7c59d",
                          fontSize: ".92rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {classGuide.gmCue}
                      </Typography>
                    </Paper>
                  </InfoPanel>

                  <InfoPanel title="Como usar esta ficha">
                    <Typography sx={{ color: "#d7c59d", mb: 1.5, lineHeight: 1.7 }}>
                      Esta area funciona como uma leitura guiada da ficha para quem
                      ainda esta aprendendo RPG. Ela explica quando olhar para
                      numeros, quando olhar para movimentos e quando apenas
                      descrever a acao do personagem.
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 1.2,
                      }}
                    >
                      {beginnerSheetConcepts.map((concept) => (
                        <BeginnerConceptCard
                          key={concept.title}
                          title={concept.title}
                          description={concept.description}
                        />
                      ))}
                    </Box>
                  </InfoPanel>

                  <InfoPanel title="Movimentos iniciais explicados">
                    <Typography sx={{ color: "#d7c59d", mb: 1.4, lineHeight: 1.7 }}>
                      Estes sao os movimentos que definem a classe no nivel 1.
                      Leia cada um procurando tres coisas: quando ele dispara,
                      qual atributo entra na rolagem e que tipo de consequencia
                      combina com a cena.
                    </Typography>

                    <Stack spacing={1.2}>
                      {selectedClass.startingSkills.map((skill) => (
                        <Paper
                          key={skill.id}
                          variant="outlined"
                          sx={{
                            borderColor: "rgba(217,200,159,.14)",
                            bgcolor: "rgba(255,255,255,.04)",
                            p: 1.4,
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{
                              justifyContent: "space-between",
                              alignItems: { xs: "flex-start", sm: "center" },
                              mb: 0.6,
                            }}
                          >
                            <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                              {skill.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={
                                skill.rollAttribute
                                  ? `Rola ${attributeLabels[skill.rollAttribute]}`
                                  : "Sem rolagem direta"
                              }
                              sx={{
                                color: "#f7edd9",
                                bgcolor: skill.rollAttribute
                                  ? "rgba(95,182,196,.16)"
                                  : "rgba(197,155,75,.13)",
                              }}
                            />
                          </Stack>

                          <Typography
                            sx={{
                              color: "#d7c59d",
                              fontSize: ".92rem",
                              lineHeight: 1.65,
                            }}
                          >
                            {skill.description}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </InfoPanel>
                </Stack>
              )}

              {activeTab === "skills" && !selectedClass.usesSpells && (
                <Stack spacing={2}>
                  <SkillPointsBadge
                    total={character.skillPoints}
                    spent={spentSkillPoints}
                    remaining={remainingSkillPoints}
                    locked={character.skillsLocked}
                  />

                  <BasicMovesPanel />

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
                                Boolean(
                                  skill.levelRequirement &&
                                  character.level < skill.levelRequirement,
                                ) ||
                                Boolean(
                                  skill.requiresSkillId &&
                                  !character.selectedSkillIds.includes(
                                    skill.requiresSkillId,
                                  ),
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
                                    filter: requirementBlocked
                                      ? "grayscale(.55)"
                                      : "none",
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
                                      sx={{
                                        alignSelf: "flex-start",
                                        color: "#f2c76c",
                                      }}
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
                                            body: getSkillRequirementText(
                                              skill,
                                            ),
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
                                Boolean(
                                  skill.levelRequirement &&
                                  character.level < skill.levelRequirement,
                                ) ||
                                Boolean(
                                  skill.requiresSkillId &&
                                  !character.selectedSkillIds.includes(
                                    skill.requiresSkillId,
                                  ),
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
                                    filter: requirementBlocked
                                      ? "grayscale(.55)"
                                      : "none",
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
                                      sx={{
                                        alignSelf: "flex-start",
                                        color: "#f2c76c",
                                      }}
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
                                            body: getSkillRequirementText(
                                              skill,
                                            ),
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
                  <SkillPointsBadge
                    total={character.skillPoints}
                    spent={spentSkillPoints}
                    remaining={remainingSkillPoints}
                    locked={character.skillsLocked}
                  />

                  <BasicMovesPanel />

                  <InfoPanel title="Preparo arcano">
                    <Stack spacing={1.2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: "wrap" }}
                      >
                        <Chip
                          label={`${preparedSpellCost}/${spellPreparationLimit} niveis preparados`}
                          sx={{
                            bgcolor: "rgba(95,182,196,.16)",
                            color: "#dff7ff",
                          }}
                        />
                        <Chip
                          label={`${selectedClass.spellcastingLabel ?? "Conjurar"} +${attributeLabels[spellCastingAttribute]}`}
                          sx={{
                            bgcolor: "rgba(197,155,75,.16)",
                            color: "#f7edd9",
                          }}
                        />
                        <Chip
                          label={
                            spellCastPenalty < 0
                              ? `Penalidade ${spellCastPenalty}`
                              : "Sem penalidade"
                          }
                          sx={{
                            bgcolor:
                              spellCastPenalty < 0
                                ? "rgba(170,38,61,.18)"
                                : "rgba(36,112,109,.18)",
                            color: "#f7edd9",
                          }}
                        />
                        <Chip
                          label={
                            character.spellsLocked
                              ? "Preparo travado"
                              : "Preparo aberto"
                          }
                          sx={{
                            bgcolor: character.spellsLocked
                              ? "rgba(170,38,61,.18)"
                              : "rgba(36,112,109,.18)",
                            color: "#f7edd9",
                          }}
                        />
                      </Stack>

                      <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                        Rotinas, oracoes e truques custam 0 e ficam sempre prontos.
                        Magias e efeitos de nivel 1 ou maior ocupam preparo ate
                        o limite nivel + 1. Em 7-9, escolha uma consequencia de
                        Dungeon World.
                      </Typography>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={character.spellsLocked}
                          onClick={confirmSpellPreparation}
                        >
                          Confirmar preparo
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={resetSpellPreparation}
                        >
                          Repreparar
                        </Button>
                      </Stack>
                    </Stack>
                  </InfoPanel>

                  {spellCastRoll && (
                    <SpellCastResultPanel
                      roll={spellCastRoll}
                      risk={
                        spellCastRoll.spell.risk ??
                        defaultSpellRisks[spellCastRoll.spell.tradition]
                      }
                      onApplyPenalty={applySpellPenalty}
                      onExhaustSpell={() => exhaustSpell(spellCastRoll.spell.id)}
                    />
                  )}

                  {selectedClass.usesSpells && (
                    <InfoPanel title="Lista de magias">
                      {availableSpells.length === 0 ? (
                        <Typography sx={{ color: "#b9a98b" }}>
                          Nenhuma magia disponivel para o nivel atual.
                        </Typography>
                      ) : (
                        <Stack spacing={1.2}>
                          {availableSpells.map((spell) => {
                            const isPrepared =
                              preparedSpellIds.has(spell.id);
                            const isExhausted = exhaustedSpellIds.has(spell.id);
                            const wouldExceed =
                              !isPrepared &&
                              preparedSpellCost + spell.level >
                                spellPreparationLimit;

                            return (
                              <Paper
                                key={spell.id}
                                variant="outlined"
                                sx={{
                                  borderColor: isPrepared
                                    ? "rgba(95,182,196,.65)"
                                    : "rgba(217,200,159,.14)",
                                  bgcolor: isPrepared
                                    ? isExhausted
                                      ? "rgba(170,38,61,.12)"
                                      : "rgba(95,182,196,.12)"
                                    : "rgba(255,255,255,.04)",
                                  color: "#f7edd9",
                                  p: 1.5,
                                }}
                              >
                                <Stack spacing={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ flexWrap: "wrap" }}
                                  >
                                    <Chip label={spell.levelLabel} />
                                    {isPrepared && <Chip label="Preparada" />}
                                    {isExhausted && <Chip label="Gasta" />}
                                    {spell.isOngoing && <Chip label="Continuo" />}
                                    {spell.damageDice && (
                                      <Chip label={`Dano ${spell.damageDice}`} />
                                    )}
                                    {spell.tags?.map((tag) => (
                                      <Chip key={tag} label={tag} />
                                    ))}
                                  </Stack>

                                  <Typography
                                    sx={{ color: "#5fb6c4", fontWeight: 900 }}
                                  >
                                    {spell.name}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      color: "#d7c59d",
                                      fontSize: ".9rem",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {spell.summary}
                                  </Typography>

                                  <Button
                                    variant="text"
                                    sx={{
                                      alignSelf: "flex-start",
                                      color: "#f2c76c",
                                    }}
                                    onClick={() =>
                                      setDescriptionDialog({
                                        title: spell.name,
                                        body: spell.fullText ?? spell.summary,
                                      })
                                    }
                                  >
                                    Ler descricao completa
                                  </Button>

                                  {isPrepared && (
                                    <Button
                                      variant="contained"
                                      disabled={isExhausted}
                                      onClick={() => castSpell(spell)}
                                    >
                                      {selectedClass.spellcastingLabel ??
                                        "Conjurar"}
                                    </Button>
                                  )}

                                  <Button
                                    variant={
                                      isPrepared ? "contained" : "outlined"
                                    }
                                    disabled={
                                      spell.level === 0 ||
                                      character.spellsLocked ||
                                      wouldExceed
                                    }
                                    onClick={() => toggleSpell(spell.id)}
                                  >
                                    {spell.level === 0
                                      ? "Sempre pronta"
                                      : isPrepared
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
                        <CombatStat
                          label="Ataque"
                          value={selectedClass.damageDice}
                        />
                        <CombatStat label="Armadura" value={String(armor)} />
                        <CombatStat
                          label="Arma"
                          value={equippedWeapon?.name ?? "Desarmado"}
                        />
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
  <CombatDiceRoller
    isRolling={isRollingCombat}
    actionName={rollingActionName || combatRoll?.actionName || ""}
    dice={rollingDice || combatRoll?.dice || ""}
    rolls={combatRoll?.rolls ?? []}
    total={combatRoll?.diceTotal ?? null}
  />
</Box>
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
                            <CombatSceneResult roll={combatRoll} />
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
                          {combatRoll.isCritical
                            ? "Acerto critico"
                            : combatRoll.isCriticalFailure
                              ? "Falha critica"
                              : combatRoll.actionName}
                          : {combatRoll.diceTotal} +{" "}
                          {attributeLabels[combatRoll.attribute]}{" "}
                          {combatRoll.attributeValue} = {combatRoll.total}
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
                        onClick={() =>
                          setIsCombatPickerOpen((current) => !current)
                        }
                      >
                        Selecionar{" "}
                        {selectedClass.usesSpells ? "magia" : "habilidade"}
                      </Button>

                      {isCombatPickerOpen && (
                        <Stack spacing={1}>
                          {usableCombatActions.filter(
                            (action) => action.id !== "common-attack",
                          ).length === 0 ? (
                            <Typography
                              sx={{ color: "#b9a98b", fontSize: ".9rem" }}
                            >
                              Nenhuma{" "}
                              {selectedClass.usesSpells
                                ? "magia"
                                : "habilidade"}{" "}
                              disponivel agora.
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
                            ? Math.min(
                                100,
                                Math.round((currentLoad / maxLoad) * 100),
                              )
                            : 0
                        }
                        color={currentLoad > maxLoad ? "#aa263d" : "#c59b4b"}
                      />

                      <Typography
                        sx={{
                          color: currentLoad > maxLoad ? "#ffb0b8" : "#b9a98b",
                          fontSize: ".9rem",
                        }}
                      >
                        Peso total: {currentLoad} / {maxLoad}. Carga da classe:{" "}
                        {selectedClass.loadBase} + modificador de FOR.
                      </Typography>
                    </Stack>
                  </InfoPanel>

                  <InfoPanel title="Slots equipados">
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, minmax(0, 1fr))",
                          sm: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 1,
                      }}
                    >
                      {(
                        [
                          "arma",
                          "armaSecundaria",
                          "armadura",
                          "capacete",
                          "acessorio1",
                          "acessorio2",
                        ] as const
                      ).map((slot) => {
                        const itemId = character.equipment[slot];
                        const item = itemId
                          ? items.find(
                              (currentItem) => currentItem.id === itemId,
                            )
                          : null;

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

                  <InfoPanel title="Consumiveis">
                    <Stack spacing={1.2}>
                      <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                        Recursos com usos limitados. Ao usar, o app consome uma
                        unidade e aplica cura quando houver efeito mecanico.
                        Efeitos ficcionais entram como apoio para a conversa
                        com o mestre.
                      </Typography>

                      {consumableItems
                        .filter((item) => {
                          const amount = character.consumables[item.id] ?? 0;
                          return (
                            amount > 0 ||
                            !item.classIds ||
                            item.classIds.includes(selectedClass.id)
                          );
                        })
                        .map((item) => {
                          const currentUses = character.consumables[item.id] ?? 0;
                          const hasUses = currentUses > 0;
                          const targetIndex =
                            consumableTargets[item.id] ?? selectedPlayerIndex;

                          return (
                            <Paper
                              key={item.id}
                              variant="outlined"
                              sx={{
                                borderColor: hasUses
                                  ? "rgba(95,182,196,.32)"
                                  : "rgba(217,200,159,.12)",
                                bgcolor: hasUses
                                  ? "rgba(95,182,196,.09)"
                                  : "rgba(255,255,255,.035)",
                                color: "#f7edd9",
                                p: 1.35,
                              }}
                            >
                              <Stack spacing={1}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ flexWrap: "wrap" }}
                                >
                                  <Chip
                                    label={`${currentUses}/${item.maxUses}`}
                                    sx={{
                                      bgcolor: hasUses
                                        ? "rgba(95,182,196,.18)"
                                        : "rgba(170,38,61,.16)",
                                      color: "#f7edd9",
                                    }}
                                  />
                                  <Chip label={`peso ${item.weight}`} />
                                  {item.tags.map((tag) => (
                                    <Chip key={tag} label={tag} />
                                  ))}
                                </Stack>

                                <Typography
                                  sx={{ color: "#5fb6c4", fontWeight: 900 }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#d7c59d",
                                    fontSize: ".9rem",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {item.description}
                                </Typography>
                                <Typography
                                  sx={{ color: "#b9a98b", fontSize: ".85rem" }}
                                >
                                  {item.useText}
                                </Typography>
                                {item.restText && (
                                  <Typography
                                    sx={{ color: "#ffcf8a", fontSize: ".82rem" }}
                                  >
                                    {item.restText}
                                  </Typography>
                                )}
                                {item.canTargetAlly && (
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Usar em</InputLabel>
                                    <Select
                                      label="Usar em"
                                      value={targetIndex}
                                      onChange={(event) =>
                                        setConsumableTargets((current) => ({
                                          ...current,
                                          [item.id]: Number(event.target.value),
                                        }))
                                      }
                                    >
                                      {playerProfiles.map((profile) => (
                                        <MenuItem
                                          key={profile.index}
                                          value={profile.index}
                                        >
                                          {profile.label} -{" "}
                                          {profile.name || "Sem nome"} -{" "}
                                          {profile.className}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                                <Button
                                  variant="contained"
                                  disabled={!hasUses}
                                  onClick={() =>
                                    useConsumable(
                                      item.id,
                                      item.canTargetAlly
                                        ? targetIndex
                                        : selectedPlayerIndex,
                                    )
                                  }
                                >
                                  Usar
                                  {item.canTargetAlly
                                    ? ` em ${
                                        playerProfiles[targetIndex]?.label ??
                                        "jogador"
                                      }`
                                    : ""}
                                  : {item.effect.label}
                                </Button>
                              </Stack>
                            </Paper>
                          );
                        })}
                    </Stack>
                  </InfoPanel>

                  <InfoPanel title="Inventario virtual">
                    {character.availableItems.length === 0 ? (
                      <Typography sx={{ color: "#b9a98b" }}>
                        Nenhum item recebido ainda. O mestre distribui itens
                        pelo painel dele.
                      </Typography>
                    ) : (
                      <Stack spacing={1.2}>
                        {character.availableItems.map((itemId) => {
                          const item = items.find(
                            (currentItem) => currentItem.id === itemId,
                          );
                          if (!item) return null;

                          const isEquipped = Object.values(
                            character.equipment,
                          ).includes(item.id);

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
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ flexWrap: "wrap" }}
                                >
                                  <Chip label={item.type} />
                                  <Chip label={`peso ${item.weight}`} />
                                  {item.tags.map((tag) => (
                                    <Chip key={tag} label={tag} />
                                  ))}
                                </Stack>

                                <Typography
                                  sx={{ color: "#c59b4b", fontWeight: 900 }}
                                >
                                  {item.name}
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "#d7c59d",
                                    fontSize: ".9rem",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {item.description}
                                </Typography>

                                <Button
                                  variant={
                                    isEquipped ? "contained" : "outlined"
                                  }
                                  onClick={() =>
                                    isEquipped
                                      ? unequipItem(item.id)
                                      : equipItem(item.id)
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
          bottom: "calc(12px + env(safe-area-inset-bottom))",
          left: 12,
          zIndex: 20,
          maxWidth: { xs: 520, md: 760 },
          mx: "auto",
          overflow: "hidden",
          border: "1px solid rgba(217,200,159,.18)",
          borderRadius: 3,
          bgcolor: "rgba(8,8,7,.92)",
          backdropFilter: "blur(16px)",
        }}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(_, value: AppTab) => setActiveTab(value)}
          sx={{
            height: { xs: 62, sm: 68 },
            bgcolor: "transparent",
            ".MuiBottomNavigationAction-root": {
              minWidth: 0,
              color: "#b9a98b",
              px: { xs: 0.5, sm: 1 },
            },
            ".MuiBottomNavigationAction-root .MuiSvgIcon-root": {
              fontSize: { xs: 24, sm: 27 },
            },
            ".MuiBottomNavigationAction-label": {
              display: "none",
            },
            ".Mui-selected": { color: "#f2c76c" },
          }}
        >
          {tabOrder.map((tab) => (
            <BottomNavigationAction
              label={currentTabLabels[tab]}
              aria-label={currentTabLabels[tab]}
              icon={tabIcons[tab]}
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
                  onChange={(event) => {
                    const nextRaceId = event.target.value as string;
                    setPendingRaceId(nextRaceId);
                    setPendingCreationChoices(
                      buildDefaultCreationChoices(
                        pendingClass.id,
                        nextRaceId,
                        playerProfiles,
                        selectedPlayerIndex,
                      ),
                    );
                  }}
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

            {pendingCreationRules.length > 0 && (
              <Paper
                variant="outlined"
                sx={{
                  borderColor: "rgba(217,200,159,.16)",
                  bgcolor: "rgba(255,255,255,.035)",
                  color: "#f7edd9",
                  p: 1.5,
                }}
              >
                <Stack spacing={1.4}>
                  <Box>
                    <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
                      Condicoes e beneficios da criacao
                    </Typography>
                    <Typography sx={{ color: "#b9a98b", fontSize: ".88rem" }}>
                      Campos obrigatorios precisam ser confirmados junto da
                      classe. Depois disso, o mestre pode destravar ajustes.
                    </Typography>
                  </Box>

                  {pendingCreationRules.map((rule) => {
                    if (
                      rule.id === "ranger-animal-custom" &&
                      pendingCreationChoices["ranger-animal"] !== "Outro"
                    ) {
                      return null;
                    }

                    const options = getOptionsForCreationRule(
                      rule,
                      playerProfiles,
                      selectedPlayerIndex,
                    );

                    return rule.kind === "select" ? (
                      <FormControl fullWidth size="small" key={rule.id}>
                        <InputLabel sx={{ color: "#b9a98b" }}>
                          {rule.label}
                        </InputLabel>
                        <Select
                          label={rule.label}
                          value={pendingCreationChoices[rule.id] ?? ""}
                          onChange={(event) =>
                            setPendingCreationChoices((current) => ({
                              ...current,
                              [rule.id]: event.target.value as string,
                            }))
                          }
                          sx={{
                            color: "#f7edd9",
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(217,200,159,.22)",
                            },
                            ".MuiSvgIcon-root": { color: "#f7edd9" },
                          }}
                        >
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box>
                                <Typography sx={{ fontWeight: 900 }}>
                                  {option.label}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#b9a98b",
                                    fontSize: ".78rem",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {option.description}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography sx={{ color: "#b9a98b", fontSize: 12 }}>
                          {rule.helper}
                          {rule.required ? " Obrigatorio." : ""}
                        </Typography>
                      </FormControl>
                    ) : (
                      <TextField
                        key={rule.id}
                        size="small"
                        fullWidth
                        multiline
                        minRows={2}
                        label={rule.label}
                        value={pendingCreationChoices[rule.id] ?? ""}
                        onChange={(event) =>
                          setPendingCreationChoices((current) => ({
                            ...current,
                            [rule.id]: event.target.value,
                          }))
                        }
                        helperText={`${rule.helper}${rule.required ? " Obrigatorio." : ""}`}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsClassDialogOpen(false)}>Cancelar</Button>

          <Button
            variant="contained"
            onClick={confirmClassChange}
            disabled={!pendingCreationComplete}
          >
            Confirmar escolha
          </Button>
        </DialogActions>
      </Dialog>

      <AdventureMapsDialog
        open={isMapsDialogOpen}
        onClose={() => setIsMapsDialogOpen(false)}
        audience={mode === "master" ? "master" : "player"}
      />

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
          <Button
            variant="contained"
            onClick={() => setDescriptionDialog(null)}
          >
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

function parseDice(dice: string) {
  const match = dice.match(/^(\d+)d(\d+)$/);

  return {
    diceCount: match ? Number(match[1]) : 1,
    dieSize: match ? Number(match[2]) : Number(dice.replace("d", "")),
  };
}

function PersonIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <path
        d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7 8.3c.8-4 3.3-6.1 7-6.1s6.2 2.1 7 6.1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </SvgIcon>
  );
}

function ScrollIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <path
        d="M7 5.5C7 3.6 8.2 3 9.5 3H18v14.5c0 1.9-1.2 3.5-3.2 3.5H7.5C5.6 21 4 19.7 4 17.7c0-1.8 1.3-3.2 3-3.2V5.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M7 14.5h8m-5-7h5m-5 4h5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function SparkIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <path
        d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </SvgIcon>
  );
}

function BackpackIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <path
        d="M8 8V6.8C8 4.7 9.6 3 12 3s4 1.7 4 3.8V8m-9.5 3H9m6 0h2.5M7 8h10c1.7 0 3 1.3 3 3v8.5c0 .8-.7 1.5-1.5 1.5h-13c-.8 0-1.5-.7-1.5-1.5V11c0-1.7 1.3-3 3-3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 16h8v5H8v-5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  );
}

function SwordsIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <path
        d="m4 20 5.8-5.8m.8-3.6L18 3h3v3l-7.6 7.4m-4-4L4 4m0 0v4m0-4h4m7.2 10.2L20 19m0 0v-4m0 4h-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
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

function DescriptionStat({ label, value }: { label: string; value: string }) {
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

function DescriptionSection({
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

function BeginnerConceptCard({
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

function SkillPointsBadge({
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

function BasicMovesPanel() {
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
            </Stack>
          </Paper>
        ))}
      </Stack>
    </InfoPanel>
  );
}

function SpellCastResultPanel({
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
  const outcomeLabel =
    roll.outcome === "success"
      ? "10+ sucesso total"
      : roll.outcome === "partial"
        ? "7-9 sucesso com custo"
        : "6- o MJ faz um movimento";

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
            color: roll.outcome === "miss" ? "#ffb0b8" : "#f2c76c",
            fontWeight: 900,
          }}
        >
          {outcomeLabel}
        </Typography>

        {roll.outcome === "partial" && (
          <Stack spacing={1}>
            <Typography sx={{ color: "#d7c59d", fontSize: ".9rem" }}>
              Escolha uma consequencia:
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
            A magia ainda pode acontecer, mas o MJ faz um movimento tao forte
            quanto a ficcao pedir.
          </Typography>
        )}
      </Stack>
    </InfoPanel>
  );
}

function EquipmentSlotCard({
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

        <Button variant="contained" onClick={onRoll}>
          Usar e rolar
        </Button>
      </Stack>
    </Paper>
  );
}

function CombatSceneResult({ roll }: { roll: CombatRoll }) {
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
      </Stack>
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
    "engenheiro-arcano": { symbol: "⚙", color: "#64c7a8" },
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
