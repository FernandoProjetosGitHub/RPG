import { Stack } from "@mui/material";
import MapAtlas from "./components/MapAtlas";
import PublicIntro from "../../components/public/PublicIntro";
import PublicPageShell, {
  type PublicView,
} from "../../components/public/PublicPageShell";

type MapsPageProps = {
  onNavigate: (view: PublicView) => void;
};

export default function MapsPage({ onNavigate }: MapsPageProps) {
  return (
    <PublicPageShell active="maps" onNavigate={onNavigate}>
      <Stack spacing={2.4}>
        <PublicIntro
          eyebrow="Atlas de aventuras"
          title="Mapas jogaveis para campanha e aventuras guiadas"
          body="O atlas organiza o mapa mundi e os mapas pertinentes das aventuras: Nekesti, Nemfalla, Forte de Altai e Formigueiro Infectado. A pagina publica mostra estrutura de jogo; notas sensiveis seguem no painel do mestre."
        />
        <MapAtlas />
      </Stack>
    </PublicPageShell>
  );
}
