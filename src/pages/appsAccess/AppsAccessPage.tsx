import { Stack } from "@mui/material";
import AppsAccessPanels from "./components/AppsAccessPanels";
import PublicIntro from "../../components/public/PublicIntro";
import PublicPageShell, {
  type PublicView,
} from "../../components/public/PublicPageShell";
import type { PlayerProfileSummary } from "../../types/character";

type AppsAccessPageProps = {
  playerProfiles: PlayerProfileSummary[];
  selectedPlayerIndex: number;
  onNavigate: (view: PublicView) => void;
  onOpenPlayer: (index: number) => void;
  onOpenMaster: () => void;
};

export default function AppsAccessPage({
  playerProfiles,
  selectedPlayerIndex,
  onNavigate,
  onOpenPlayer,
  onOpenMaster,
}: AppsAccessPageProps) {
  return (
    <PublicPageShell active="apps" onNavigate={onNavigate}>
      <Stack spacing={2.4}>
        <PublicIntro
          eyebrow="Aplicativos da mesa"
          title="Acesso de jogador e painel do mestre"
          body="Jogadores veem a propria ficha, recursos e mapas liberados. O mestre controla os sete perfis, travas, dano, XP, consumiveis, bestiario, guia e detalhes sensiveis dos mapas."
        />
        <AppsAccessPanels
          playerProfiles={playerProfiles}
          selectedPlayerIndex={selectedPlayerIndex}
          onOpenPlayer={onOpenPlayer}
          onOpenMaster={onOpenMaster}
        />
      </Stack>
    </PublicPageShell>
  );
}
