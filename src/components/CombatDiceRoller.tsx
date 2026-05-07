import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

type CombatDiceRollerProps = {
  isRolling: boolean;
  actionName: string;
  dice: string;
  rolls: number[];
  total: number | null;
};

export default function CombatDiceRoller({
  isRolling,
  actionName,
  dice,
  rolls,
  total,
}: CombatDiceRollerProps) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        bgcolor: "rgba(0,0,0,.28)",
        border: "1px solid rgba(217,200,159,.16)",
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
          {actionName || "Selecione uma ação"}
        </Typography>

        <Box
          sx={{
            width: 120,
            height: 120,
            display: "grid",
            placeItems: "center",
            perspective: 800,
          }}
        >
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div
                key="rolling"
                initial={{ scale: 0.8, rotate: 0, y: -20 }}
                animate={{
                  scale: [0.8, 1.15, 0.95, 1.1, 1],
                  rotate: [0, 120, 260, 420, 720],
                  y: [-20, 10, -8, 6, 0],
                }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 18,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "radial-gradient(circle at 35% 25%, #f7edd9, #c59b4b 45%, #7a1f2d 100%)",
                  boxShadow:
                    "0 0 28px rgba(197,155,75,.65), inset 0 0 18px rgba(0,0,0,.45)",
                  color: "#160f0b",
                  fontWeight: 900,
                  fontSize: 26,
                }}
              >
                {dice}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ scale: 0.65, opacity: 0, rotate: -18 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 18,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(145deg, rgba(197,155,75,.95), rgba(247,237,217,.9))",
                  boxShadow: "0 0 22px rgba(197,155,75,.55)",
                  color: "#160f0b",
                  fontWeight: 900,
                  fontSize: 32,
                }}
              >
                {total ?? "?"}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
          {rolls.map((roll, index) => (
            <Chip key={`${roll}-${index}`} label={`Dado ${index + 1}: ${roll}`} />
          ))}
        </Stack>

        {isRolling && (
          <Typography sx={{ color: "#b9a98b", fontSize: ".9rem" }}>
            O dado está rolando...
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}