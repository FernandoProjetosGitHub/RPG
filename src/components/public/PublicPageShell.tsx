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
  const activeItem = navItems.find((item) => item.value === active) ?? navItems[0];
  const ActiveIcon = activeItem.Icon;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#070706",
        color: "#f7edd9",
        background:
          "linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px), radial-gradient(circle at 12% 0%, rgba(170,38,61,.22), transparent 24rem), radial-gradient(circle at 90% 6%, rgba(95,182,196,.14), transparent 23rem), linear-gradient(180deg, #14110d 0%, #070706 52%)",
        backgroundSize: "34px 34px, 34px 34px, auto, auto, auto",
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
          bgcolor: "rgba(7,7,6,.86)",
          boxShadow: "0 14px 42px rgba(0,0,0,.34)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.2}
            sx={{
              py: { xs: 1, md: 1.15 },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="text"
              onClick={() => onNavigate("landing")}
              sx={{
                justifyContent: "flex-start",
                color: "#f7edd9",
                px: 0,
                "&:hover": { bgcolor: "transparent" },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: "#10100d",
                    bgcolor: "#c59b4b",
                    boxShadow: "0 0 28px rgba(197,155,75,.26)",
                    flex: "0 0 auto",
                  }}
                >
                  <ActiveIcon size={23} />
                </Box>
                <Box sx={{ minWidth: 0, textAlign: "left" }}>
                  <Typography sx={{ color: "#f7edd9", fontWeight: 900, lineHeight: 1.1 }}>
                    Dungeon World
                  </Typography>
                  <Typography
                    sx={{
                      color: "#b9a98b",
                      fontSize: ".78rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activeItem.label} da mesa digital
                  </Typography>
                </Box>
              </Stack>
            </Button>

            <Stack
              component="nav"
              aria-label="Navegacao publica"
              direction="row"
              useFlexGap
              gap={0.8}
              sx={{
                overflowX: "auto",
                pb: { xs: 0.2, md: 0 },
                mx: { xs: -0.3, md: 0 },
                px: { xs: 0.3, md: 0 },
                scrollSnapType: "x proximity",
              }}
            >
              {/* Em telas estreitas, a navegacao vira uma faixa rolavel simples. */}
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  size="small"
                  aria-current={active === item.value ? "page" : undefined}
                  variant={active === item.value ? "contained" : "outlined"}
                  startIcon={<item.Icon size={16} />}
                  onClick={() => onNavigate(item.value)}
                  sx={{
                    flex: "0 0 auto",
                    minWidth: { xs: 118, sm: "auto" },
                    scrollSnapAlign: "start",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
