import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ClassReferenceCard from "../components/public/ClassReferenceCard";
import ClassMark from "../components/public/ClassMark";
import PublicIntro from "../components/public/PublicIntro";
import PublicPageShell, {
  type PublicView,
} from "../components/public/PublicPageShell";
import { getClassTheme } from "../data/classThemes";
import { dwClasses } from "../data/dwClasses";

type ClassCatalogPageProps = {
  onNavigate: (view: PublicView) => void;
};

export default function ClassCatalogPage({ onNavigate }: ClassCatalogPageProps) {
  return (
    <PublicPageShell active="classes" onNavigate={onNavigate}>
      <Stack spacing={2.4}>
        <PublicIntro
          eyebrow="Manual de classes"
          title="Classes, escolhas e recursos do personagem"
          body="Referencia adaptada para o app: cada classe mostra funcao, PV, dano, carga, racas, movimentos, escolhas de criacao, magias quando houver, equipamentos e consumiveis iniciais."
        />

        <ClassIndex />

        <Stack spacing={1.5}>
          {dwClasses.map((dwClass) => (
            <Box key={dwClass.id} id={`classe-${dwClass.id}`} sx={{ scrollMarginTop: 112 }}>
              <ClassReferenceCard dwClass={dwClass} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </PublicPageShell>
  );
}

function ClassIndex() {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(217,200,159,.16)",
        bgcolor: "rgba(255,255,255,.035)",
        p: 1.2,
      }}
    >
      <Typography sx={{ color: "#c59b4b", fontWeight: 900, mb: 1 }}>
        Ir para classe
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(5, minmax(0, 1fr))",
          },
          gap: 0.75,
        }}
      >
        {dwClasses.map((dwClass) => {
          const theme = getClassTheme(dwClass.id);

          return (
            <Button
              key={dwClass.id}
              variant="outlined"
              onClick={() =>
                document
                  .getElementById(`classe-${dwClass.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                gap: 0.8,
                minHeight: 58,
                borderColor: `${theme.color}55`,
                bgcolor: `${theme.color}12`,
              }}
            >
              <ClassMark classId={dwClass.id} size={34} />
              <Box component="span" sx={{ minWidth: 0 }}>
                <Typography component="span" sx={{ display: "block", fontWeight: 900 }}>
                  {dwClass.name}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    color: theme.accent,
                    fontSize: ".72rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {theme.role}
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Box>
    </Paper>
  );
}
