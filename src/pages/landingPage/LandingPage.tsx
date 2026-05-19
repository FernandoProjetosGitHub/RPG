import { Stack } from "@mui/material";
import {
  LandingClassGrid,
  LandingFeatureGrid,
  LandingHero,
} from "./components/LandingSections";
import PublicPageShell, {
  type PublicView,
} from "../../components/public/PublicPageShell";

type LandingPageProps = {
  onNavigate: (view: PublicView) => void;
};

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <PublicPageShell active="landing" onNavigate={onNavigate}>
      <Stack spacing={3}>
        <LandingHero onNavigate={onNavigate} />
        <LandingClassGrid />
        <LandingFeatureGrid />
      </Stack>
    </PublicPageShell>
  );
}
