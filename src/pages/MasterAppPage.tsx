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
  Typography,
} from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import { items } from "../data/items";
import type { Character } from "../types/character";

type MasterAppPageProps = {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  onBackToCodex?: () => void;
  onOpenCharacter?: () => void;
};

export default function MasterAppPage({
  setCharacter,
  onBackToCodex,
  onOpenCharacter,
}: MasterAppPageProps) {
  const [selectedItem, setSelectedItem] = useState("");

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
    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: Math.max(0, current.hp.current - 5),
      },
    }));
  }

  function handleHeal() {
    setCharacter((current) => ({
      ...current,
      hp: {
        ...current.hp,
        current: current.hp.current + 5,
      },
    }));
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
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 900 }}>
                Controle de Combate
              </Typography>

              <Button color="error" variant="contained" onClick={handleDamage}>
                Causar dano
              </Button>

              <Button variant="contained" onClick={handleHeal}>
                Curar jogador
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}