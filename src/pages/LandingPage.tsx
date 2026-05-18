import { Stack } from "@mui/material";
import {
  LandingAdBanner,
  LandingClassGrid,
  LandingFeatureGrid,
  LandingHero,
} from "../components/public/LandingSections";
import PublicPageShell, {
  type PublicView,
} from "../components/public/PublicPageShell";

type LandingPageProps = {
  onNavigate: (view: PublicView) => void;
};

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <PublicPageShell active="landing" onNavigate={onNavigate}>
      <Stack spacing={3}>
        <LandingAdBanner onNavigate={onNavigate} />
        <LandingHero onNavigate={onNavigate} />
        <LandingClassGrid />
        <LandingFeatureGrid />
      </Stack>
    </PublicPageShell>
  );
}
