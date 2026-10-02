import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import JourneyTimeline from "./components/JourneyTimeline";
import ProjectShowcase from "./components/ProjectShowcase";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import CurrentlyBuilding from "./components/CurrentlyBuilding";
import Achievements from "./components/Achievements";
import ResumeSection from "./components/ResumeSection";
import GithubSection from "./components/GithubSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import AvatarFallback from "./components/AvatarFallback";
import { useActiveSection } from "./hooks/useActiveSection";
import type { AvatarState } from "./components/AvatarScene";

// The 3D scene is code-split: it only downloads + mounts when needed,
// and the page stays fully usable while it loads (or if it can't).
const AvatarScene = lazy(() => import("./components/AvatarScene"));

const SECTION_IDS = [
  "home",
  "about",
  "journey",
  "projects",
  "experience",
  "skills",
  "building",
  "achievements",
  "resume",
  "github",
  "contact",
];

/** Map the visible section to the avatar's animation state. */
function avatarStateForSection(section: string): AvatarState {
  switch (section) {
    case "about":
    case "resume":
    case "experience":
      return "about";
    case "journey":
      return "journey";
    case "projects":
    case "github":
    case "achievements":
      return "projects";
    case "skills":
    case "building":
      return "skills";
    case "contact":
      return "contact";
    default:
      return "idle";
  }
}

function App() {
  const activeSection = useActiveSection(SECTION_IDS);
  const avatarState = avatarStateForSection(activeSection);

  return (
    <div className="min-h-screen bg-void text-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <CustomCursor />
      <ScrollProgress />

      {/* Fixed 3D environment behind everything (z-0). Sections sit above at z-10. */}
      <Suspense
        fallback={
          <div
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <AvatarFallback />
          </div>
        }
      >
        <AvatarScene state={avatarState} />
      </Suspense>

      <Navbar activeSection={activeSection} />

      <main id="main" className="relative">
        <Hero />
        <AboutSection />
        <JourneyTimeline />
        <ProjectShowcase />
        <ExperienceSection />
        <SkillsSection />
        <CurrentlyBuilding />
        <Achievements />
        <ResumeSection />
        <GithubSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
