import { Box } from "@mui/material";
import { getClassTheme } from "../../data/classThemes";

type ClassMarkProps = {
  classId: string;
  size?: number;
};

export default function ClassMark({ classId, size = 46 }: ClassMarkProps) {
  const theme = getClassTheme(classId);

  // O simbolo evita depender de icones externos e funciona como brasao curto da
  // classe em qualquer tela: landing, catalogo e futuros cards compactos.
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: `${theme.color}22`,
        border: `1px solid ${theme.color}`,
        color: theme.accent,
        fontWeight: 900,
        flex: "0 0 auto",
      }}
    >
      {theme.symbol}
    </Box>
  );
}
