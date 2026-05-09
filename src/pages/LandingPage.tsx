import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { adventureMaps } from "../data/adventureMaps";
import { dwClasses } from "../data/dwClasses";
import { getClassTheme } from "../data/classThemes";
import PublicPageShell, { type PublicView } from "./PublicPageShell";
import zineHero from "../assets/zine-hero.png";

type LandingPageProps = {
  onNavigate: (view: PublicView) => void;
};

const systemHighlights = [
  {
    title: "Conversa primeiro",
    body: "A mesa descreve a ficcao, o movimento dispara quando a situacao pede, e a rolagem responde ao que esta acontecendo.",
  },
  {
    title: "Resultados 10+, 7-9 e 6-",
    body: "Sucesso total, sucesso com custo e falha que avanca a historia. O mestre usa movimentos para manter pressao e consequencias.",
  },
  {
    title: "Fichas guiadas",
    body: "Classe, raca, escolhas obrigatorias, vinculos, magias, recursos e consumiveis entram em fluxo pensado para jogadores novatos.",
  },
  {
    title: "Mesa com 7 jogadores",
    body: "O mestre alterna perfis, aplica dano, cura, XP, itens, consumiveis e consulta regras sem expor informacoes secretas aos jogadores.",
  },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <PublicPageShell active="landing" onNavigate={onNavigate}>
      <Stack spacing={3}>
        <Box
          sx={{
            minHeight: { xs: "70vh", md: "72vh" },
            display: "flex",
            alignItems: "flex-end",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            px: { xs: 1.5, sm: 2.5, md: 4 },
            py: { xs: 2, md: 4 },
            backgroundImage: `linear-gradient(180deg, rgba(7,7,6,.12) 0%, rgba(7,7,6,.62) 48%, rgba(7,7,6,.94) 100%), url(${zineHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(217,200,159,.16)",
          }}
        >
          <Stack spacing={2.2} sx={{ maxWidth: 820, position: "relative" }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label="Dungeon World" />
              <Chip label="PWA / GitHub Pages" />
              <Chip label={`${dwClasses.length} classes`} />
              <Chip label={`${adventureMaps.length} mapas`} />
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.4rem", md: "4.6rem" },
                lineHeight: 0.98,
                fontWeight: 900,
                maxWidth: 820,
              }}
            >
              Mesa digital para aventuras de Dungeon World
            </Typography>

            <Typography
              sx={{
                color: "#d7c59d",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.08rem" },
                maxWidth: 760,
              }}
            >
              Um app de ficha, mestre e referencia feito para conduzir a mesa
              com as regras dos PDFs: criacao assistida, vinculos entre
              jogadores, magias, consumiveis, combate, bestiario e mapas das
              aventuras.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                size="large"
                variant="contained"
                onClick={() => onNavigate("apps")}
              >
                Abrir aplicativos
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => onNavigate("classes")}
              >
                Ver classes
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => onNavigate("maps")}
              >
                Ver mapas
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
            },
            gap: 1,
          }}
        >
          {dwClasses.slice(0, 10).map((dwClass) => {
            const theme = getClassTheme(dwClass.id);

            return (
              <Paper
                key={dwClass.id}
                variant="outlined"
                sx={{
                  borderColor: `${theme.color}55`,
                  bgcolor: "rgba(255,255,255,.04)",
                  p: 1.2,
                }}
              >
                <Stack spacing={0.8}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: `${theme.color}22`,
                      border: `1px solid ${theme.color}`,
                      color: theme.accent,
                      fontWeight: 900,
                    }}
                  >
                    {theme.symbol}
                  </Box>
                  <Typography sx={{ fontWeight: 900 }}>{dwClass.name}</Typography>
                  <Typography sx={{ color: "#b9a98b", fontSize: ".84rem" }}>
                    PV {dwClass.baseHp}+CON · dano {dwClass.damageDice}
                  </Typography>
                  <Typography sx={{ color: "#d7c59d", fontSize: ".82rem" }}>
                    {theme.role}
                  </Typography>
                </Stack>
              </Paper>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 1.2,
          }}
        >
          {systemHighlights.map((highlight) => (
            <Paper
              key={highlight.title}
              variant="outlined"
              sx={{
                borderColor: "rgba(217,200,159,.15)",
                bgcolor: "rgba(255,255,255,.04)",
                p: 1.5,
              }}
            >
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                {highlight.title}
              </Typography>
              <Typography sx={{ color: "#d7c59d", mt: 0.7, lineHeight: 1.6 }}>
                {highlight.body}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Stack>
    </PublicPageShell>
  );
}
