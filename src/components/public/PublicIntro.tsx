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
    <Box>
      <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
        {eyebrow}
      </Typography>
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "2rem", md: "3.2rem" },
          fontWeight: 900,
          lineHeight: 1.05,
          mt: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: "#d7c59d", mt: 1, lineHeight: 1.65 }}>
        {body}
      </Typography>
    </Box>
  );
}
