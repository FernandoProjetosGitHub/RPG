import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { IconType } from "react-icons";
import {
  GiBackpack,
  GiBroadsword,
  GiCampfire,
  GiDiceTwentyFacesTwenty,
  GiHeartPlus,
  GiOpenBook,
  GiScrollQuill,
  GiSpellBook,
  GiTabletopPlayers,
  GiTreasureMap,
} from "react-icons/gi";
import { adventureMaps } from "../../data/adventureMaps";
import { dwClasses } from "../../data/dwClasses";
import { getClassTheme } from "../../data/classThemes";
import { getClassIcon } from "../rpg/classIcons";
import type { PublicView } from "./PublicPageShell";
import zineHero from "../../assets/zine-hero.png";

const systemHighlights = [
  {
    Icon: GiScrollQuill,
    title: "Conversa primeiro",
    body: "A mesa descreve a ficcao, o movimento dispara quando a situacao pede, e a rolagem responde ao que esta acontecendo.",
  },
  {
    Icon: GiDiceTwentyFacesTwenty,
    title: "Resultados 10+, 7-9 e 6-",
    body: "Sucesso total, sucesso com custo e falha que avanca a historia. O mestre usa movimentos para manter pressao e consequencias.",
  },
  {
    Icon: GiSpellBook,
    title: "Fichas guiadas",
    body: "Classe, raca, escolhas obrigatorias, vinculos, magias, recursos e consumiveis entram em fluxo pensado para jogadores novatos.",
  },
  {
    Icon: GiTabletopPlayers,
    title: "Mesa com 7 jogadores",
    body: "O mestre alterna perfis, aplica dano, cura, XP, itens, consumiveis e consulta regras sem expor informacoes secretas aos jogadores.",
  },
];

export function LandingAdBanner({
  onNavigate,
}: {
  onNavigate: (view: PublicView) => void;
}) {
  // Banner promocional da landing. Ele fica fora do hero para poder virar um
  // espaco real de propaganda depois: basta trocar titulo, texto e chamada sem
  // alterar a estrutura principal da pagina.
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "rgba(242,199,108,.28)",
        bgcolor:
          "linear-gradient(135deg, rgba(242,199,108,.18), rgba(95,182,196,.1)), rgba(7,7,6,.88)",
        color: "#f7edd9",
        p: { xs: 1.4, sm: 1.8 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.4}
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={0.7}>
          <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap" }}>
            <IconChip Icon={GiCampfire} label="Espaco de propaganda" />
            <IconChip Icon={GiOpenBook} label="Mesa, zine ou apoiador" />
          </Stack>

          <Box>
            <Typography sx={{ color: "#f2c76c", fontWeight: 900 }}>
              Destaque sua campanha, suplemento ou comunidade aqui
            </Typography>
            <Typography sx={{ color: "#d7c59d", lineHeight: 1.55, maxWidth: 760 }}>
              Banner reservado para divulgar material da mesa sem competir com
              o conteudo principal. Ideal para chamada de sessao, aviso do mestre,
              apoiador do projeto ou novidade de aventura.
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={() => onNavigate("apps")}
          sx={{
            flex: "0 0 auto",
            bgcolor: "#f2c76c",
            color: "#100b08",
            fontWeight: 900,
            "&:hover": { bgcolor: "#d8a94b", color: "#100b08" },
          }}
        >
          Abrir app da mesa
        </Button>
      </Stack>
    </Paper>
  );
}

export function LandingHero({
  onNavigate,
}: {
  onNavigate: (view: PublicView) => void;
}) {
  return (
    <Box
      sx={{
        // A hero usa uma imagem real do projeto como primeiro sinal visual.
        // O gradiente so garante leitura do texto sem transformar a pagina em
        // um card promocional separado da arte.
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
          <IconChip Icon={GiOpenBook} label="Dungeon World" />
          <IconChip Icon={GiTabletopPlayers} label="PWA / GitHub Pages" />
          <IconChip Icon={GiSpellBook} label={`${dwClasses.length} classes`} />
          <IconChip Icon={GiTreasureMap} label={`${adventureMaps.length} mapas`} />
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
          Um app de ficha, mestre e referencia feito para conduzir a mesa com
          as regras dos PDFs: criacao assistida, vinculos entre jogadores,
          magias, consumiveis, combate, bestiario e mapas das aventuras.
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
          <Button
            size="large"
            variant="outlined"
            onClick={() => onNavigate("aventuras")}
          >
            Ver aventuras
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export function LandingClassGrid() {
  return (
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
      {dwClasses.map((dwClass) => {
        const theme = getClassTheme(dwClass.id);
        const Icon = getClassIcon(dwClass.id);

        // Cada card reaproveita os dados reais da classe. Assim, quando uma
        // classe mudar na ficha, a landing tambem acompanha o mesmo conteudo.
        return (
          <Paper
            key={dwClass.id}
            variant="outlined"
            sx={{
              borderColor: `${theme.color}55`,
              bgcolor:
                `linear-gradient(145deg, ${theme.color}1f, rgba(255,255,255,.035) 54%), rgba(7,7,6,.86)`,
              minHeight: 245,
              p: 1.25,
            }}
          >
            <Stack spacing={1.1} sx={{ height: "100%" }}>
              <Box
                sx={{
                  minHeight: 88,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: theme.accent,
                  background:
                    `radial-gradient(circle at 50% 32%, ${theme.accent}66, transparent 34%), ` +
                    `linear-gradient(145deg, ${theme.color}38, rgba(0,0,0,.46) 72%)`,
                  border: `1px solid ${theme.color}66`,
                  boxShadow:
                    `inset 0 0 0 1px rgba(255,255,255,.05), 0 12px 28px ${theme.color}22`,
                }}
              >
                <Icon size={58} />
              </Box>

              <Stack spacing={0.25}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: theme.accent,
                      boxShadow: `0 0 14px ${theme.accent}`,
                      flex: "0 0 auto",
                    }}
                  />
                  <Typography sx={{ fontWeight: 900 }}>{dwClass.name}</Typography>
                </Stack>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: theme.accent, fontSize: ".74rem", fontWeight: 900 }}>
                    {dwClass.usesSpells
                      ? (dwClass.spellcastingLabel ?? "Conjura magias")
                      : "Aventureiro marcante"}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 0.6,
                }}
              >
                <ClassMetric Icon={GiHeartPlus} label="PV" value={`${dwClass.baseHp}+CON`} />
                <ClassMetric Icon={GiBroadsword} label="Dano" value={dwClass.damageDice} />
                <ClassMetric Icon={GiBackpack} label="Carga" value={`${dwClass.loadBase}+FOR`} />
              </Box>
              <Typography sx={{ color: "#d7c59d", fontSize: ".82rem" }}>
                {theme.role}
              </Typography>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}

export function LandingFeatureGrid() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
        gap: 1.2,
      }}
    >
      {systemHighlights.map(({ Icon, ...highlight }) => (
        <Paper
          key={highlight.title}
          variant="outlined"
          sx={{
            borderColor: "rgba(217,200,159,.15)",
            bgcolor: "rgba(255,255,255,.04)",
            p: 1.5,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Icon size={24} color="#c59b4b" />
            <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
              {highlight.title}
            </Typography>
          </Stack>
          <Typography sx={{ color: "#d7c59d", mt: 0.7, lineHeight: 1.6 }}>
            {highlight.body}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

function IconChip({ Icon, label }: { Icon: IconType; label: string }) {
  return <Chip icon={<Icon size={16} />} label={label} />;
}

function ClassMetric({
  Icon,
  label,
  value,
}: {
  Icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(217,200,159,.12)",
        bgcolor: "rgba(0,0,0,.24)",
        minWidth: 0,
        p: 0.65,
      }}
    >
      <Stack spacing={0.35} sx={{ alignItems: "flex-start" }}>
        <Icon size={17} />
        <Typography sx={{ color: "#b9a98b", fontSize: ".65rem", fontWeight: 900 }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#f7edd9", fontSize: ".78rem", fontWeight: 900 }}>
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}
