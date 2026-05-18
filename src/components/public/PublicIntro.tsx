import { Box, Typography } from "@mui/material";

type PublicIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export default function PublicIntro({ eyebrow, title, body }: PublicIntroProps) {
  // Bloco padrao de abertura das paginas publicas. Centralizar isso evita que
  // cada pagina invente hierarquia de titulo, cor e espaçamento diferente.
  return (
    <Box
      sx={{
        maxWidth: 930,
        borderLeft: "3px solid rgba(197,155,75,.78)",
        pl: { xs: 1.4, md: 2 },
        py: 0.4,
      }}
    >
      <Typography sx={{ color: "#c59b4b", fontSize: ".78rem", fontWeight: 900 }}>
        {eyebrow}
      </Typography>
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.9rem", md: "3.15rem" },
          fontWeight: 900,
          lineHeight: 1.05,
          mt: 0.5,
          textWrap: "balance",
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: "#d7c59d", mt: 1, lineHeight: 1.72, maxWidth: 860 }}>
        {body}
      </Typography>
    </Box>
  );
}
