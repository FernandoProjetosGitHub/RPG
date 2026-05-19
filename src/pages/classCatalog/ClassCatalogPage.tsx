import { Box, Stack } from "@mui/material";
import ClassReferenceCard from "./components/ClassReferenceCard";
import ClassIndex from "./partials/ClassIndex";
import PublicIntro from "../../components/public/PublicIntro";
import PublicPageShell, {
  type PublicView,
} from "../../components/public/PublicPageShell";
import { dwClasses } from "../../data/dwClasses";

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
