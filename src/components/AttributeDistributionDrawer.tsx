import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  attributeKeys,
  attributeLabels,
  attributePool,
  type AttributeKey,
  type CharacterAttributes,
} from "../types/character";
import { formatModifier } from "../utils/attributes";

type AttributeDistributionDrawerProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (attributes: CharacterAttributes) => void;
};

export default function AttributeDistributionDrawer({
  open,
  onClose,
  onConfirm,
}: AttributeDistributionDrawerProps) {
  const [draftAttributes, setDraftAttributes] = useState<
    Partial<CharacterAttributes>
  >({});

  const selectedValues = useMemo(
    () => Object.values(draftAttributes).filter(Boolean),
    [draftAttributes],
  );

  const isComplete = attributeKeys.every((key) => draftAttributes[key]);

  function getAvailableValues(currentKey: AttributeKey) {
    const currentValue = draftAttributes[currentKey];

    return attributePool.filter(
      (value) => value === currentValue || !selectedValues.includes(value),
    );
  }

  function handleChange(attribute: AttributeKey, value: number) {
    setDraftAttributes((current) => ({
      ...current,
      [attribute]: value,
    }));
  }

  function handleConfirm() {
    if (!isComplete) return;

    onConfirm(draftAttributes as CharacterAttributes);
    setDraftAttributes({});
  }

  function handleCancel() {
    setDraftAttributes({});
    onClose();
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box
        sx={{
          width: { xs: 320, sm: 420 },
          minHeight: "100%",
          bgcolor: "#070706",
          color: "#f7edd9",
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Distribuir atributos
            </Typography>

            <Typography sx={{ color: "#b9a98b", mt: 0.5 }}>
              Escolha cada valor uma única vez. Depois de confirmar, os
              atributos serão travados.
            </Typography>
          </Box>

          {attributeKeys.map((attribute) => (
            <FormControl fullWidth size="small" key={attribute}>
              <InputLabel>{attributeLabels[attribute]}</InputLabel>

              <Select
                label={attributeLabels[attribute]}
                value={draftAttributes[attribute] ?? ""}
                onChange={(event) =>
                  handleChange(attribute, Number(event.target.value))
                }
              >
                {getAvailableValues(attribute).map((value) => (
                  <MenuItem value={value} key={value}>
                    {value} ({formatModifier(value)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <Stack spacing={1}>
            <Button
              variant="contained"
              disabled={!isComplete}
              onClick={handleConfirm}
            >
              Confirmar atributos
            </Button>

            <Button variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
