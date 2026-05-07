import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Chip,
  Typography,
  TextField,
} from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import { dwClasses } from "../data/dwClasses";
import { items } from "../data/items";
import { getXpToNextLevel, type Character } from "../types/character";

type MasterAppPageProps = {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onOpenCharacter?: () => void;
};

export default function MasterAppPage({
  character,
  setCharacter,
  onBackToCodex,
  onOpenCharacter,
}: MasterAppPageProps) {
  const [selectedItem, setSelectedItem] = useState("");
  const [damageValue, setDamageValue] = useState(0);
  const [healValue, setHealValue] = useState(0);
  const [xpValue, setXpValue] = useState(0);
  const [targetLevel, setTargetLevel] = useState(1);

  const selectedClass =
    dwClasses.find((dwClass) => dwClass.id === character.classId) ??
    dwClasses[0];

  const maxHp =
    selectedClass.baseHp +
    character.attributes.constituicao +
    Object.values(character.equipment)
      .filter((itemId): itemId is string => Boolean(itemId))
      .map((itemId) => items.find((item) => item.id === itemId))
      .filter((item): item is (typeof items)[number] => Boolean(item))
      .reduce((acc, item) => acc + (item.modifiers.hp ?? 0), 0);

  const xpToNextLevel = getXpToNextLevel(character.level);
  const canLevelUp = character.xp >= xpToNextLevel;

  function handleGiveItem() {
    if (!selectedItem) return;

    setCharacter((current) => ({
      ...current,
      availableItems: current.availableItems.includes(selectedItem)
        ? current.availableItems
        : [...current.availableItems, selectedItem],
    }));
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

  function handleAddXp() {
    if (xpValue <= 0) return;

    setCharacter((current) => ({
      ...current,
      xp: current.xp + xpValue,
    }));

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
    }));
  }

  function handleLevelDown() {
    setCharacter((current) => ({
      ...current,
      level: Math.max(1, current.level - 1),
      skillPoints: Math.max(0, current.skillPoints - 1),
    }));
  }
  function handleSetLevel() {
    if (targetLevel < 1) return;

    setCharacter((current) => ({
      ...current,
      level: targetLevel,
    }));
  }

  function handleAddSkillPoint() {
    setCharacter((current) => ({
      ...current,
      skillPoints: current.skillPoints + 1,
      skillsLocked: false,
    }));
  }

  function handleRemoveSkillPoint() {
    setCharacter((current) => ({
      ...current,
      skillPoints: Math.max(0, current.skillPoints - 1),
      selectedSkillIds: current.selectedSkillIds.slice(
        0,
        Math.max(0, current.skillPoints - 1),
      ),
    }));
  }

  function handleUnlockSkills() {
    setCharacter((current) => ({
      ...current,
      skillsLocked: false,
    }));
  }

  function handleResetSkills() {
    setCharacter((current) => ({
      ...current,
      selectedSkillIds: [],
      skillsLocked: false,
    }));
  }

  function handleUnlockSpells() {
    setCharacter((current) => ({
      ...current,
      spellsLocked: false,
    }));
  }

  function handleResetSpells() {
    setCharacter((current) => ({
      ...current,
      preparedSpellIds: [],
      spellsLocked: false,
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
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#070706",
        color: "#f7edd9",
        px: 2,
        py: 2,
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 520, mx: "auto" }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography sx={{ fontWeight: 900 }}>Painel do Mestre</Typography>

          {onBackToCodex && (
            <Button variant="outlined" onClick={onBackToCodex}>
              Voltar
            </Button>
          )}
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }}>
                Controle de Itens
              </Typography>

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

              {onOpenCharacter && (
                <Button variant="contained" onClick={onOpenCharacter}>
                  Abrir ficha do jogador
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleGiveItem}
                disabled={!selectedItem}
              >
                Dar item ao jogador
              </Button>

              <Stack spacing={1}>
                <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
                  Inventario atual
                </Typography>

                {character.availableItems.length === 0 ? (
                  <Typography sx={{ color: "#b9a98b", fontSize: ".85rem" }}>
                    Nenhum item entregue.
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {character.availableItems.map((itemId) => {
                      const item = items.find((currentItem) => currentItem.id === itemId);
                      if (!item) return null;

                      return (
                        <Chip
                          key={item.id}
                          label={item.name}
                          onDelete={() => handleRemoveItem(item.id)}
                        />
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }}>
                Progressão do Personagem
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip label={`Nível ${character.level}`} />
                <Chip label={`${character.xp}/${xpToNextLevel} XP`} />
                <Chip label={`${character.skillPoints} pontos de skill`} />
              </Stack>

              <Typography
                sx={{
                  color: canLevelUp ? "#c59b4b" : "#b9a98b",
                  fontSize: ".9rem",
                }}
              >
                {canLevelUp
                  ? "XP suficiente para subir de nivel. Ao subir, o personagem ganha 1 ponto de movimento."
                  : "Dungeon World usa o nivel atual + 7 como referencia de XP para o proximo nivel."}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleRemoveXp}
                  disabled={xpValue <= 0}
                >
                  Remover XP
                </Button>

                <Stack spacing={1} sx={{ flex: 1 }}>
                  <TextField
                    type="number"
                    label="XP"
                    value={xpValue}
                    onChange={(event) => setXpValue(Number(event.target.value))}
                    size="small"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddXp}
                    disabled={xpValue <= 0}
                  >
                    Adicionar XP
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button fullWidth variant="outlined" onClick={handleLevelDown}>
                  - Nível
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLevelUp}
                  disabled={!canLevelUp}
                >
                  + Nível
                </Button>
                <Stack spacing={1}>
                  <TextField
                    type="number"
                    label="Definir nível"
                    value={targetLevel}
                    onChange={(event) =>
                      setTargetLevel(Number(event.target.value))
                    }
                    size="small"
                  />

                  <Button
                    variant="outlined"
                    onClick={handleSetLevel}
                    disabled={targetLevel < 1}
                  >
                    Definir nível
                  </Button>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 900 }}>
                  Controle de skills e magias
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button fullWidth variant="outlined" onClick={handleRemoveSkillPoint}>
                    - ponto
                  </Button>

                  <Button fullWidth variant="contained" onClick={handleAddSkillPoint}>
                    + ponto
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button fullWidth variant="outlined" onClick={handleUnlockSkills}>
                    Destravar skills
                  </Button>

                  <Button fullWidth variant="outlined" onClick={handleResetSkills}>
                    Resetar skills
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button fullWidth variant="outlined" onClick={handleUnlockSpells}>
                    Destravar magias
                  </Button>

                  <Button fullWidth variant="outlined" onClick={handleResetSpells}>
                    Limpar magias
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }}>
                Controle de Combate
              </Typography>

              <Stack spacing={1}>
                <TextField
                  type="number"
                  label="Dano"
                  value={damageValue}
                  onChange={(event) =>
                    setDamageValue(Number(event.target.value))
                  }
                  size="small"
                />

                <Button
                  color="error"
                  variant="contained"
                  onClick={handleDamage}
                >
                  Aplicar dano
                </Button>
              </Stack>

              <Stack spacing={1}>
                <TextField
                  type="number"
                  label="Cura"
                  value={healValue}
                  onChange={(event) => setHealValue(Number(event.target.value))}
                  size="small"
                />

                <Button variant="contained" onClick={handleHeal}>
                  Curar jogador
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
