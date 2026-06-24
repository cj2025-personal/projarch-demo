import { ApproachSection } from "./components/ApproachSection";
import { FlyerSection } from "./components/FlyerSection";
import { HeroSection } from "./components/HeroSection";
import { ImpactSection } from "./components/ImpactSection";
import { LaunchSection } from "./components/LaunchSection";
import { PlatformSection } from "./components/PlatformSection";
import { ProblemSection } from "./components/ProblemSection";
import { SiteFooter } from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="site-shell">
      <HeroSection />
      <LaunchSection />
      <ProblemSection />
      <PlatformSection />
      <ApproachSection />
      <ImpactSection />
      <FlyerSection />
      <SiteFooter />
    </main>
  );
}
