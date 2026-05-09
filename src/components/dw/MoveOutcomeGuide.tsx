import { Box, Chip, Stack, Typography } from "@mui/material";
import { dwRollOutcomes, getDwMoveRollIntro } from "../../data/dwRollOutcomes";
import type { AttributeKey } from "../../types/character";

type MoveOutcomeGuideProps = {
  moveName: string;
  attribute?: AttributeKey;
  compact?: boolean;
  showNoRoll?: boolean;
};

const outcomeOrder = ["success", "partial", "miss"] as const;

export default function MoveOutcomeGuide({
  moveName,
  attribute,
  compact = false,
  showNoRoll = false,
}: MoveOutcomeGuideProps) {
  if (!attribute && !showNoRoll) return null;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: attribute
          ? "rgba(95,182,196,.18)"
          : "rgba(217,200,159,.12)",
        bgcolor: attribute ? "rgba(95,182,196,.07)" : "rgba(255,255,255,.03)",
        borderRadius: 1,
        p: compact ? 0.9 : 1.1,
      }}
    >
      <Stack spacing={compact ? 0.7 : 0.9}>
        <Typography
          sx={{
            color: attribute ? "#dff7ff" : "#b9a98b",
            fontSize: compact ? ".78rem" : ".84rem",
            lineHeight: 1.45,
          }}
        >
          {getDwMoveRollIntro(moveName, attribute)}
        </Typography>

        {attribute && (
          <Stack spacing={0.7}>
            {outcomeOrder.map((outcomeKey) => {
              const outcome = dwRollOutcomes[outcomeKey];

              return (
                <Stack
                  key={outcome.key}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={0.7}
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <Chip
                    size="small"
                    label={`${outcome.band} ${outcome.title}`}
                    sx={{
                      minWidth: compact ? 110 : 132,
                      bgcolor: `${outcome.color}22`,
                      color: outcome.color,
                      fontWeight: 900,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#d7c59d",
                      fontSize: compact ? ".76rem" : ".82rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {outcome.playerText}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
