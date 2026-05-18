import { Box } from "@mui/material";
import { getClassIcon } from "../rpg/classIcons";
import { getClassTheme } from "../../data/classThemes";

type ClassMarkProps = {
  classId: string;
  size?: number;
};

export default function ClassMark({ classId, size = 46 }: ClassMarkProps) {
  const theme = getClassTheme(classId);
  const Icon = getClassIcon(classId);

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        flex: "0 0 auto",
        color: theme.accent,
        background:
          `radial-gradient(circle at 50% 18%, ${theme.accent}55, transparent 28%), ` +
          `linear-gradient(145deg, ${theme.color}2e, rgba(7,7,6,.94) 64%)`,
        border: `1px solid ${theme.color}88`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,.06), 0 0 22px ${theme.color}33`,
        filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))",
      }}
    >
      <Icon size={Math.round(size * 0.68)} />
    </Box>
  );
}
