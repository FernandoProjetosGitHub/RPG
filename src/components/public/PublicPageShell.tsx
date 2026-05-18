import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  GiOpenBook,
  GiScrollQuill,
  GiSpellBook,
  GiTabletopPlayers,
  GiTreasureMap,
} from "react-icons/gi";

export type PublicView = "landing" | "classes" | "maps" | "aventuras" | "apps";

type PublicPageShellProps = {
  active: PublicView;
  children: ReactNode;
  onNavigate: (view: PublicView) => void;
};

const navItems: Array<{ value: PublicView; label: string; Icon: IconType }> = [
  { value: "landing", label: "Inicio", Icon: GiOpenBook },
  { value: "classes", label: "Classes", Icon: GiSpellBook },
  { value: "maps", label: "Mapas", Icon: GiTreasureMap },
  { value: "aventuras", label: "Aventuras", Icon: GiScrollQuill },
  { value: "apps", label: "Aplicativos", Icon: GiTabletopPlayers },
];

export default function PublicPageShell({
  active,
  children,
  onNavigate,
}: PublicPageShellProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#070706",
        color: "#f7edd9",
        background:
          "radial-gradient(circle at 12% 0%, rgba(170,38,61,.22), transparent 24rem), radial-gradient(circle at 90% 6%, rgba(95,182,196,.14), transparent 23rem), linear-gradient(180deg, #14110d 0%, #070706 52%)",
      }}
    >
      <Box
        component="header"
        sx={{
          // O cabecalho fica fixo para manter acesso rapido entre as paginas
          // publicas sem interferir nas telas de app, que tem navegacao propria.
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid rgba(217,200,159,.14)",
          bgcolor: "rgba(7,7,6,.88)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            sx={{
              py: 1.2,
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ color: "#c59b4b", fontWeight: 900 }}>
                Dungeon World
              </Typography>
              <Typography sx={{ color: "#b9a98b", fontSize: ".82rem" }}>
                Fichas, mestre, classes e mapas de mesa
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.8}
              sx={{ overflowX: "auto", pb: { xs: 0.2, sm: 0 } }}
            >
              {/* Em telas estreitas, a navegacao vira uma faixa rolavel simples. */}
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  size="small"
                  variant={active === item.value ? "contained" : "outlined"}
                  startIcon={<item.Icon size={16} />}
                  onClick={() => onNavigate(item.value)}
                  sx={{ flex: "0 0 auto" }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
