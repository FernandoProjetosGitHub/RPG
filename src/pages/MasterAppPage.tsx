import {
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import AdventureMapsDialog from "../components/AdventureMapsDialog";
import { dwClasses, unselectedClass } from "../data/dwClasses";
import { basicMoves } from "../data/dwMoves";
import { gmReferenceSections, monsterReferences } from "../data/gmReference";
import { classStartingItemIds, items } from "../data/items";
import { spells } from "../data/spells";
import {
  attributeLabels,
  getXpToNextLevel,
  type Character,
  type PlayerProfileSummary,
} from "../types/character";

type MasterAppPageProps = {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onOpenCharacter?: () => void;
  playerProfiles?: PlayerProfileSummary[];
  selectedPlayerIndex?: number;
  onSelectPlayer?: (index: number) => void;
};

type MasterTab =
  | "criacao"
  | "habilidades"
  | "combate"
  | "guia"
  | "monstros"
  | "itens";

const masterTabs: Array<{ value: MasterTab; label: string }> = [
  { value: "criacao", label: "Criação" },
  { value: "habilidades", label: "Habilidades" },
  { value: "combate", label: "Combate" },
  { value: "guia", label: "Guia MJ" },
  { value: "monstros", label: "Monstros" },
  { value: "itens", label: "Itens" },
];

export default function MasterAppPage({
  character,
  setCharacter,
  onBackToCodex,
  onOpenCharacter,
  playerProfiles = [],
  selectedPlayerIndex = 0,
  onSelectPlayer,
}: MasterAppPageProps) {
  const [activeTab, setActiveTab] = useState<MasterTab>("criacao");
  const [selectedItem, setSelectedItem] = useState("");
  const [damageValue, setDamageValue] = useState(0);
  const [healValue, setHealValue] = useState(0);
  const [xpValue, setXpValue] = useState(0);
  const [targetLevel, setTargetLevel] = useState(character.level);
  const [classDraft, setClassDraft] = useState(character.classId);
  const [raceDraft, setRaceDraft] = useState(character.raceId);
  const [isMapsDialogOpen, setIsMapsDialogOpen] = useState(false);
  const [expandedMonsterId, setExpandedMonsterId] = useState<string | null>(null);

  const selectedClass =
    dwClasses.find((dwClass) => dwClass.id === character.classId) ??
    unselectedClass;
  const draftClass =
    dwClasses.find((dwClass) => dwClass.id === classDraft) ?? unselectedClass;
  const selectedRace = selectedClass.races.find(
    (race) => race.id === character.raceId,
  );

  useEffect(() => {
    setClassDraft(character.classId);
    setRaceDraft(character.raceId);
    setTargetLevel(character.level);
  }, [character.classId, character.raceId, character.level, selectedPlayerIndex]);
  const classSpells = spells.filter(
    (spell) => spell.tradition === selectedClass.id,
  );
  const preparedSpellCost = classSpells
    .filter((spell) => character.preparedSpellIds.includes(spell.id))
    .reduce((acc, spell) => acc + spell.level, 0);

  const maxHp = useMemo(() => {
    return (
      selectedClass.baseHp +
      character.attributes.constituicao +
      Object.values(character.equipment)
        .filter((itemId): itemId is string => Boolean(itemId))
        .map((itemId) => items.find((item) => item.id === itemId))
        .filter((item): item is (typeof items)[number] => Boolean(item))
        .reduce((acc, item) => acc + (item.modifiers.hp ?? 0), 0)
    );
  }, [character.attributes.constituicao, character.equipment, selectedClass]);

  const xpToNextLevel = getXpToNextLevel(character.level);
  const canLevelUp = character.xp >= xpToNextLevel;
  const hpPercent = maxHp > 0 ? Math.round((character.hp.current / maxHp) * 100) : 0;
  const xpPercent =
    xpToNextLevel > 0
      ? Math.min(100, Math.round((character.xp / xpToNextLevel) * 100))
      : 0;
  const remainingSkillPoints = Math.max(
    0,
    character.skillPoints - character.selectedSkillIds.length,
  );

  function applyClassAndRace() {
    const nextClass = dwClasses.find((dwClass) => dwClass.id === classDraft);
    if (!nextClass) return;

    const nextRaceId = raceDraft || nextClass.races[0]?.id || "";
    const startingItemIds = classStartingItemIds[nextClass.id] ?? [];
    const nextMaxHp = nextClass.baseHp + character.attributes.constituicao;

    setCharacter((current) => ({
      ...current,
      classId: nextClass.id,
      raceId: nextRaceId,
      availableItems: Array.from(
        new Set([...current.availableItems, ...startingItemIds]),
      ),
      preparedSpellIds: [],
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: false,
      hp: {
        ...current.hp,
        current: current.hp.current > 0 ? Math.min(current.hp.current, nextMaxHp) : nextMaxHp,
      },
    }));
  }

  function setLock(field: "classLocked" | "raceLocked" | "attributesLocked" | "skillsLocked" | "spellsLocked", value: boolean) {
    setCharacter((current) => ({ ...current, [field]: value }));
  }

  function handleGiveItem() {
    if (!selectedItem) return;

    setCharacter((current) => ({
      ...current,
      availableItems: current.availableItems.includes(selectedItem)
        ? current.availableItems
        : [...current.availableItems, selectedItem],
    }));
  }

  function handleRemoveItem(itemId: string) {
    setCharacter((current) => {
      const updatedEquipment = { ...current.equipment };

      Object.entries(updatedEquipment).forEach(([slot, equippedItemId]) => {
        if (equippedItemId === itemId) {
          updatedEquipment[slot as keyof typeof updatedEquipment] = null;
        }
      });

      return {
        ...current,
        availableItems: current.availableItems.filter(
          (currentItemId) => currentItemId !== itemId,
        ),
        equipment: updatedEquipment,
      };
    });
  }

  function handleDamage() {
    if (damageValue <= 0) return;

    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: Math.max(0, current.hp.current - damageValue),
      },
    }));
    setDamageValue(0);
  }

  function handleHeal() {
    if (healValue <= 0) return;

    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: Math.min(maxHp, current.hp.current + healValue),
      },
    }));
    setHealValue(0);
  }

  function handleFullHeal() {
    setCharacter((current) => ({
      ...current,
      hp: { ...current.hp, current: maxHp },
    }));
  }

  function handleAddXp() {
    if (xpValue <= 0) return;
    setCharacter((current) => ({ ...current, xp: current.xp + xpValue }));
    setXpValue(0);
  }

  function handleRemoveXp() {
    if (xpValue <= 0) return;
    setCharacter((current) => ({
      ...current,
      xp: Math.max(0, current.xp - xpValue),
    }));
    setXpValue(0);
  }

  function handleLevelUp() {
    if (!canLevelUp) return;

    setCharacter((current) => ({
      ...current,
      level: current.level + 1,
      xp: Math.max(0, current.xp - getXpToNextLevel(current.level)),
      skillPoints: current.skillPoints + 1,
      skillsLocked: false,
      spellsLocked: false,
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
    }));
  }

  function handleSetLevel() {
    if (targetLevel < 1) return;
    setCharacter((current) => ({ ...current, level: targetLevel }));
  }

  function adjustSkillPoints(amount: number) {
    setCharacter((current) => {
      const nextPoints = Math.max(0, current.skillPoints + amount);

      return {
        ...current,
        skillPoints: nextPoints,
        selectedSkillIds: current.selectedSkillIds.slice(0, nextPoints),
        skillsLocked: amount > 0 ? false : current.skillsLocked,
      };
    });
  }

  function resetSkills() {
    setCharacter((current) => ({
      ...current,
      selectedSkillIds: [],
      skillsLocked: false,
    }));
  }

  function resetSpells() {
    setCharacter((current) => ({
      ...current,
      preparedSpellIds: [],
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: false,
    }));
  }

  function refreshSpells() {
    setCharacter((current) => ({
      ...current,
      exhaustedSpellIds: [],
      spellCastPenalty: 0,
      spellsLocked: false,
    }));
  }

  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "#070706",
        color: "#f7edd9",
        px: { xs: 1.25, sm: 2 },
        py: { xs: 1.25, sm: 2 },
      }}
    >
      <Stack
        spacing={1.5}
        sx={{
          width: "100%",
          maxWidth: { xs: 540, md: 860 },
          height: "100%",
          mx: "auto",
          overflowY: "auto",
          pr: { xs: 0, sm: 0.5 },
          scrollbarWidth: "thin",
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Painel do Mestre</Typography>
            <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
              Selecione um jogador e abra a ficha apenas quando precisar editar detalhes.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setIsMapsDialogOpen(true)}>
              Mapas
            </Button>
            {onBackToCodex && (
              <Button variant="outlined" onClick={onBackToCodex}>
                Voltar
              </Button>
            )}
          </Stack>
        </Stack>

        <AdventureMapsDialog
          open={isMapsDialogOpen}
          onClose={() => setIsMapsDialogOpen(false)}
          audience="master"
        />

        {playerProfiles.length > 0 && onSelectPlayer && (
          <SectionCard title="Jogadores da mesa">
            <Stack spacing={1.2}>
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.55 }}>
                A mesa comeca com ate 7 jogadores. Escolha qual perfil o painel
                do mestre esta controlando antes de aplicar classe, dano, XP,
                itens, magias ou abrir a ficha completa.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 1,
                }}
              >
                {playerProfiles.map((profile) => (
                  <Button
                    key={profile.index}
                    variant={
                      profile.index === selectedPlayerIndex
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => onSelectPlayer(profile.index)}
                    sx={{
                      minHeight: 68,
                      justifyContent: "space-between",
                      textAlign: "left",
                      gap: 1,
                    }}
                  >
                    <Box component="span">
                      <Typography component="span" sx={{ display: "block", fontWeight: 900 }}>
                        {profile.label}
                      </Typography>
                      <Typography component="span" sx={{ display: "block", fontSize: ".76rem", opacity: 0.82 }}>
                        {profile.name || "Sem nome"} · {profile.className}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
              {onOpenCharacter && (
                <Button variant="contained" onClick={onOpenCharacter}>
                  Abrir ficha do jogador selecionado
                </Button>
              )}
            </Stack>
          </SectionCard>
        )}

        <Paper
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.18)",
            bgcolor: "rgba(8,8,7,.88)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(_, value: MasterTab) => setActiveTab(value)}
            sx={{
              minHeight: 52,
              ".MuiTab-root": { color: "#b9a98b", fontWeight: 900, minHeight: 52 },
              ".Mui-selected": { color: "#f2c76c" },
              ".MuiTabs-indicator": { bgcolor: "#c59b4b" },
            }}
          >
            {masterTabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        {activeTab === "criacao" && (
          <Stack spacing={1.5}>
            <SectionCard title="Criação de personagem">
              <Stack spacing={1.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Classe</InputLabel>
                  <Select
                    label="Classe"
                    value={classDraft}
                    onChange={(event) => {
                      const nextClassId = event.target.value;
                      const nextClass = dwClasses.find(
                        (dwClass) => dwClass.id === nextClassId,
                      );
                      setClassDraft(nextClassId);
                      setRaceDraft(nextClass?.races[0]?.id ?? "");
                    }}
                  >
                    <MenuItem value="">Classe nao selecionada</MenuItem>
                    {dwClasses.map((dwClass) => (
                      <MenuItem key={dwClass.id} value={dwClass.id}>
                        {dwClass.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Ancestralidade/Raça</InputLabel>
                  <Select
                    label="Ancestralidade/Raça"
                    value={raceDraft || draftClass.races[0]?.id || ""}
                    onChange={(event) => setRaceDraft(event.target.value)}
                    disabled={!classDraft}
                  >
                    {draftClass.races.map((race) => (
                      <MenuItem key={race.id} value={race.id}>
                        {race.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={applyClassAndRace}
                  disabled={!classDraft}
                >
                  Aplicar classe, ancestralidade e itens iniciais
                </Button>

                <LockGrid>
                  <LockButton
                    label="Classe"
                    locked={character.classLocked}
                    onLock={() => setLock("classLocked", true)}
                    onUnlock={() => setLock("classLocked", false)}
                  />
                  <LockButton
                    label="Raça"
                    locked={character.raceLocked}
                    onLock={() => setLock("raceLocked", true)}
                    onUnlock={() => setLock("raceLocked", false)}
                  />
                  <LockButton
                    label="Atributos"
                    locked={character.attributesLocked}
                    onLock={() => setLock("attributesLocked", true)}
                    onUnlock={() => setLock("attributesLocked", false)}
                  />
                </LockGrid>
              </Stack>
            </SectionCard>

            <SectionCard title="Progressão">
              <Stack spacing={1.4}>
                <ResourceMeter
                  label="XP"
                  current={character.xp}
                  max={xpToNextLevel}
                  percent={xpPercent}
                  color={canLevelUp ? "#f2c76c" : "#5fb6c4"}
                />

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={`Nível ${character.level}`} />
                  <Chip label={`${character.skillPoints} pontos de movimento`} />
                  <Chip
                    label={canLevelUp ? "Pode subir de nível" : "XP insuficiente"}
                    sx={{ color: canLevelUp ? "#1a1814" : "#f7edd9", bgcolor: canLevelUp ? "#f2c76c" : "rgba(255,255,255,.08)" }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    type="number"
                    label="XP"
                    value={xpValue}
                    onChange={(event) => setXpValue(Number(event.target.value))}
                    size="small"
                    fullWidth
                  />
                  <Button fullWidth variant="contained" onClick={handleAddXp} disabled={xpValue <= 0}>
                    Adicionar XP
                  </Button>
                  <Button fullWidth variant="outlined" onClick={handleRemoveXp} disabled={xpValue <= 0}>
                    Remover XP
                  </Button>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button fullWidth variant="contained" onClick={handleLevelUp} disabled={!canLevelUp}>
                    Subir nível
                  </Button>
                  <TextField
                    type="number"
                    label="Definir nível"
                    value={targetLevel}
                    onChange={(event) => setTargetLevel(Number(event.target.value))}
                    size="small"
                    fullWidth
                  />
                  <Button fullWidth variant="outlined" onClick={handleSetLevel} disabled={targetLevel < 1}>
                    Definir
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>
          </Stack>
        )}

        {activeTab === "habilidades" && (
          <Stack spacing={1.5}>
            <SectionCard title="Controle de habilidades e magias">
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={`${remainingSkillPoints} pontos livres`} />
                  <Chip label={`${character.selectedSkillIds.length}/${character.skillPoints} movimentos escolhidos`} />
                  <Chip label={`${preparedSpellCost}/${character.level + 1} níveis preparados`} />
                  <Chip label={`${character.exhaustedSpellIds.length} magias/efeitos gastos`} />
                  {character.spellCastPenalty < 0 && (
                    <Chip label={`Penalidade ${character.spellCastPenalty}`} />
                  )}
                </Stack>

                <LockGrid>
                  <LockButton
                    label="Skills"
                    locked={character.skillsLocked}
                    onLock={() => setLock("skillsLocked", true)}
                    onUnlock={() => setLock("skillsLocked", false)}
                  />
                  <LockButton
                    label="Magias"
                    locked={character.spellsLocked}
                    onLock={() => setLock("spellsLocked", true)}
                    onUnlock={() => setLock("spellsLocked", false)}
                  />
                </LockGrid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button fullWidth variant="outlined" onClick={() => adjustSkillPoints(-1)}>
                    - ponto
                  </Button>
                  <Button fullWidth variant="contained" onClick={() => adjustSkillPoints(1)}>
                    + ponto
                  </Button>
                  <Button fullWidth variant="outlined" onClick={resetSkills}>
                    Resetar movimentos
                  </Button>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button fullWidth variant="contained" onClick={refreshSpells}>
                    Repreparar / limpar falhas
                  </Button>
                  <Button fullWidth variant="outlined" onClick={resetSpells}>
                    Limpar magias
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>

            <SectionCard title="Cartas de movimentos básicos">
              <MoveCardGrid>
                {basicMoves.map((move) => (
                  <MoveCard
                    key={move.id}
                    title={move.name}
                    chips={[
                      move.attribute ? `+${attributeLabels[move.attribute]}` : "variável",
                    ]}
                    body={move.trigger}
                    footer={move.partial}
                  />
                ))}
              </MoveCardGrid>
            </SectionCard>

            <SectionCard title={`Movimentos de ${selectedClass.name}`}>
              <MoveCardGrid>
                {[
                  ...selectedClass.startingSkills,
                  ...selectedClass.advancedSkillsLevel2To5,
                  ...selectedClass.advancedSkillsLevel6To10,
                ].map((skill) => (
                  <MoveCard
                    key={skill.id}
                    title={skill.name}
                    chips={[
                      skill.rollAttribute
                        ? `+${attributeLabels[skill.rollAttribute]}`
                        : "sem rolagem",
                      skill.levelRequirement ? `nível ${skill.levelRequirement}` : "inicial",
                      character.selectedSkillIds.includes(skill.id)
                        ? "aprendido"
                        : "",
                    ].filter(Boolean)}
                    body={skill.description}
                    footer={
                      skill.requiresSkillId
                        ? `Requer: ${skill.requiresSkillId}`
                        : undefined
                    }
                  />
                ))}
              </MoveCardGrid>
            </SectionCard>

            {selectedClass.usesSpells && (
              <SectionCard title="Magias e efeitos da classe">
                <MoveCardGrid>
                  {classSpells.map((spell) => (
                    <MoveCard
                      key={spell.id}
                      title={spell.name}
                      chips={[
                        spell.levelLabel,
                        character.preparedSpellIds.includes(spell.id)
                          ? "preparada"
                          : "",
                        character.exhaustedSpellIds.includes(spell.id)
                          ? "gasta"
                          : "",
                        spell.damageDice ? `dano ${spell.damageDice}` : "",
                      ].filter(Boolean)}
                      body={spell.summary}
                      footer={spell.tags?.join(" · ")}
                    />
                  ))}
                </MoveCardGrid>
              </SectionCard>
            )}
          </Stack>
        )}

        {activeTab === "combate" && (
          <Stack spacing={1.5}>
            <SectionCard title="Combate e recursos">
              <Stack spacing={1.4}>
                <ResourceMeter
                  label="HP"
                  current={character.hp.current}
                  max={maxHp}
                  percent={hpPercent}
                  color="#aa263d"
                />

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={`Dano ${selectedClass.damageDice}`} />
                  <Chip label={`Classe ${selectedClass.name}`} />
                  <Chip
                    label={
                      hpPercent <= 15
                        ? "Crítico"
                        : hpPercent <= 35
                          ? "Ferido"
                          : "Estável"
                    }
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    type="number"
                    label="Dano"
                    value={damageValue}
                    onChange={(event) => setDamageValue(Number(event.target.value))}
                    size="small"
                    fullWidth
                  />
                  <Button fullWidth color="error" variant="contained" onClick={handleDamage}>
                    Aplicar dano
                  </Button>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    type="number"
                    label="Cura"
                    value={healValue}
                    onChange={(event) => setHealValue(Number(event.target.value))}
                    size="small"
                    fullWidth
                  />
                  <Button fullWidth variant="contained" onClick={handleHeal}>
                    Curar
                  </Button>
                  <Button fullWidth variant="outlined" onClick={handleFullHeal}>
                    Cura total
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>
          </Stack>
        )}

        {activeTab === "guia" && (
          <Stack spacing={1.5}>
            <SectionCard title="Guia do mestrante">
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.65 }}>
                Referencia rapida para conduzir Dungeon World sem expor
                segredos aos jogadores. Use esta aba para decidir consequencias,
                dano, frentes e movimentos quando a mesa olhar para voce.
              </Typography>
            </SectionCard>

            {gmReferenceSections.map((section) => (
              <GmReferenceCard key={section.id} section={section} />
            ))}
          </Stack>
        )}

        {activeTab === "monstros" && (
          <Stack spacing={1.5}>
            <SectionCard title="Bestiario do mestre">
              <Typography sx={{ color: "#d7c59d", lineHeight: 1.65 }}>
                Monstros, PNJs perigosos e criaturas pertinentes aos PDFs. Os
                cards ficam recolhidos para caber no celular; abra apenas o que
                estiver em cena.
              </Typography>
            </SectionCard>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1,
              }}
            >
              {monsterReferences.map((monster) => (
                <MonsterReferenceCard
                  key={monster.id}
                  monster={monster}
                  expanded={expandedMonsterId === monster.id}
                  onToggle={() =>
                    setExpandedMonsterId((current) =>
                      current === monster.id ? null : monster.id,
                    )
                  }
                />
              ))}
            </Box>
          </Stack>
        )}

        {activeTab === "itens" && (
          <Stack spacing={1.5}>
            <SectionCard title="Distribuição de itens">
              <Stack spacing={1.3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Item</InputLabel>
                  <Select
                    value={selectedItem}
                    label="Item"
                    onChange={(event) => setSelectedItem(event.target.value)}
                  >
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" onClick={handleGiveItem} disabled={!selectedItem}>
                  Dar item ao jogador
                </Button>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {character.availableItems.length === 0 ? (
                    <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                      Nenhum item entregue.
                    </Typography>
                  ) : (
                    character.availableItems.map((itemId) => {
                      const item = items.find((currentItem) => currentItem.id === itemId);
                      if (!item) return null;

                      return (
                        <Chip
                          key={item.id}
                          label={item.name}
                          onDelete={() => handleRemoveItem(item.id)}
                        />
                      );
                    })
                  )}
                </Stack>
              </Stack>
            </SectionCard>

            <SectionCard title="Equipados">
              <MoveCardGrid>
                {Object.entries(character.equipment).map(([slot, itemId]) => {
                  const item = itemId
                    ? items.find((currentItem) => currentItem.id === itemId)
                    : null;

                  return (
                    <MoveCard
                      key={slot}
                      title={slot}
                      chips={[item ? "equipado" : "vazio"]}
                      body={item?.description ?? "Nenhum item neste espaço."}
                      footer={item?.name}
                    />
                  );
                })}
              </MoveCardGrid>
            </SectionCard>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
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
          <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
            {title}
          </Typography>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function GmReferenceCard({
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

function MonsterReferenceCard({
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
      variant="outlined"
      sx={{
        borderColor: expanded
          ? "rgba(197,155,75,.42)"
          : "rgba(217,200,159,.16)",
        bgcolor: "rgba(17,17,15,.92)",
        color: "#f7edd9",
        p: 1.4,
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
          <Button size="small" variant="outlined" onClick={onToggle}>
            {expanded ? "Recolher" : "Expandir"}
          </Button>
        </Stack>

        <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.8}>
          <Chip size="small" label={`PV ${monster.hp}`} />
          <Chip size="small" label={`Armadura ${monster.armor}`} />
          <Chip size="small" label={monster.damage} />
        </Stack>

        {expanded && (
          <Stack spacing={1}>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.7}>
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

function ResourceMeter({
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

function LockGrid({ children }: { children: ReactNode }) {
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

function LockButton({
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

function MoveCardGrid({ children }: { children: ReactNode }) {
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

function MoveCard({
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
