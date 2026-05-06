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
} from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState, useEffect } from "react";
import { dwClasses } from "../data/dwClasses";
import { items } from "../data/items";
import AttributeDistributionDrawer from "../components/AttributeDistributionDrawer";
import {
  attributeKeys,
  attributeLabels,
  type Character,
} from "../types/character";
import { formatModifier } from "../utils/attributes";

type AppTab = "personagem" | "descricao" | "skills" | "inventario";

type CharacterAppPageProps = {
  mode: "player" | "master";
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onBackToMaster?: () => void;
};

const tabLabels: Record<AppTab, string> = {
  personagem: "Personagem",
  descricao: "Descrição",
  skills: "Skills",
  inventario: "Inventário",
};

export default function CharacterAppPage({
  mode,
  character,
  setCharacter,
  onBackToCodex,
  onBackToMaster,
}: CharacterAppPageProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("personagem");
  const [pendingClassId, setPendingClassId] = useState("");
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [classSelectPulse, setClassSelectPulse] = useState(false);
  const [isAttributeDrawerOpen, setIsAttributeDrawerOpen] = useState(false);

  const selectedClass = useMemo(() => {
    return (
      dwClasses.find((dwClass) => dwClass.id === character.classId) ??
      dwClasses[0]
    );
  }, [character.classId]);

  const selectedRace = selectedClass.races.find(
    (race) => race.id === character.raceId,
  );

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

  const hpPercent = maxHp > 0
    ? Math.round((character.hp.current / maxHp) * 100)
    : 0;

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

    setPendingClassId(classId);
    setIsClassDialogOpen(true);
  }

  function confirmClassChange() {
    const newClass =
      dwClasses.find((dwClass) => dwClass.id === pendingClassId) ??
      dwClasses[0];

    const newMaxHp = newClass.baseHp + character.attributes.constituicao;

    setCharacter((current) => ({
      ...current,
      classId: pendingClassId,
      classLocked: true,
      raceId: "",
      raceLocked: false,
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

  function removeItem(itemId: string) {
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
                <Box>
                  <Typography
                    sx={{
                      color: "#c59b4b",
                      fontSize: ".75rem",
                      fontWeight: 900,
                    }}
                  >
                    Ficha ativa
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 900, lineHeight: 0.9 }}
                  >
                    {character.name}
                  </Typography>

                  <Typography sx={{ color: "#d7c59d", mt: 0.5 }}>
                    {selectedClass.name}
                  </Typography>

                  {selectedRace && (
                    <Typography sx={{ color: "#c59b4b", mt: 0.25 }}>
                      {selectedRace.name}
                    </Typography>
                  )}

                  <Fade in timeout={500}>
                    <Box
                      sx={{
                        mt: 1,
                        width: 58,
                        height: 58,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid rgba(217,200,159,.28)",
                        bgcolor: "rgba(197,155,75,.08)",
                        boxShadow: classSelectPulse
                          ? "0 0 28px rgba(197,155,75,.75)"
                          : "0 0 12px rgba(0,0,0,.45)",
                        transition: "all .45s ease",
                        transform: classSelectPulse
                          ? "scale(1.12)"
                          : "scale(1)",
                      }}
                    >
                      <ClassSigil classId={selectedClass.id} />
                    </Box>
                  </Fade>
                </Box>

                <Chip
                  label={`${character.hp.current}/${maxHp} HP`}
                  sx={{
                    bgcolor: isBloodied
                      ? "rgba(170,38,61,.26)"
                      : "rgba(197,155,75,.16)",
                    border: "1px solid rgba(217,200,159,.2)",
                    color: "#fff3dc",
                    fontWeight: 900,
                  }}
                />
              </Stack>

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
                    Classe definida. Não é possível alterar.
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "#b9a98b" }}>Raça</InputLabel>

                <Select
                  label="Raça"
                  value={character.raceId}
                  disabled={!character.classLocked || character.raceLocked}
                  onChange={(event) => {
                    const raceId = event.target.value as string;

                    setCharacter((current) => ({
                      ...current,
                      raceId,
                      raceLocked: true,
                    }));
                  }}
                  sx={{
                    color: "#f7edd9",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(217,200,159,.22)",
                    },
                    ".MuiSvgIcon-root": { color: "#f7edd9" },
                  }}
                >
                  {selectedClass.races.map((race) => (
                    <MenuItem value={race.id} key={race.id}>
                      {race.name}
                    </MenuItem>
                  ))}
                </Select>

                {!character.classLocked && (
                  <Typography sx={{ color: "#b9a98b", fontSize: 12 }}>
                    Escolha e confirme uma classe primeiro.
                  </Typography>
                )}

                {character.raceLocked && (
                  <Typography sx={{ color: "#c59b4b", fontSize: 12 }}>
                    Raça definida.
                  </Typography>
                )}
              </FormControl>

              {selectedRace && (
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(217,200,159,.12)",
                  }}
                >
                  <Typography
                    sx={{ color: "#c59b4b", fontWeight: 900, mb: 0.5 }}
                  >
                    {selectedRace.name}
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

              {activeTab === "personagem" && (
                <Stack spacing={2}>
                  <ResourceBar
                    label="HP"
                    current={character.hp.current}
                    max={maxHp}
                    percent={hpPercent}
                    color="#aa263d"
                  />

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
                          onClick={() => removeItem(item.id)}
                          sx={{
                            bgcolor: "rgba(197,155,75,.14)",
                            color: "#f7edd9",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "rgba(170,38,61,.35)",
                            },
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

              {activeTab === "skills" && (
                <InfoPanel title="Skills">
                  <Typography sx={{ color: "#d7c59d", mb: 1.5 }}>
                    Pontos disponíveis:{" "}
                    {character.skillPoints - character.selectedSkillIds.length}
                  </Typography>

                  <Stack spacing={1.2}>
                    {selectedClass.startingSkills.map((skill) => (
                      <Paper
                        variant="outlined"
                        key={skill.id}
                        sx={{
                          borderColor: "rgba(217,200,159,.14)",
                          bgcolor: "rgba(255,255,255,.04)",
                          color: "#f7edd9",
                          p: 1.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: 900 }}>
                          {skill.name}
                        </Typography>

                        <Typography
                          sx={{ color: "#b9a98b", fontSize: ".9rem" }}
                        >
                          {skill.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </InfoPanel>
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
          {(Object.keys(tabLabels) as AppTab[]).map((tab) => (
            <BottomNavigationAction
              label={tabLabels[tab]}
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
        <DialogTitle>Confirmar classe</DialogTitle>

        <DialogContent>
          <Typography>
            Depois de escolher a classe, ela ficará travada para o jogador.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsClassDialogOpen(false)}>Cancelar</Button>

          <Button variant="contained" onClick={confirmClassChange}>
            Confirmar escolha
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
        fontSize: 34,
        fontWeight: 900,
        lineHeight: 1,
        textShadow: `0 0 14px ${sigil.color}`,
      }}
    >
      {sigil.symbol}
    </Typography>
  );
}