import {
  companyMission,
  companyName,
  companyTagline,
  contactEmail,
  ideator,
  platformFeatures,
} from "./platformContent";

export type FlyerPair = {
  label: string;
  detail: string;
};

export type FlyerFeatureRow = {
  title: string;
  detail: string;
  icon: "chat" | "directory" | "podcast" | "editorial";
};

export type FlyerContent = {
  frontEyebrow: string;
  backEyebrow: string;
  heroCardTitle: string;
  companyName: string;
  companyTagline: string;
  conceptOneLiner: string;
  companyMission: string;
  scopeHeading: string;
  scopeNote: string;
  frontFeatureRows: FlyerFeatureRow[];
  summaryHeading: string;
  valuePillars: FlyerPair[];
  featurePersonalization: string;
  featureGoal: string;
  valueSummary: FlyerPair[];
  featuresHeading: string;
  featuresIntro: string;
  platformFeatures: string[];
  collaborationHeading: string;
  collaborationBody: string;
  backNoteHeading: string;
  ideatorLabel: string;
  ideator: string;
  contactLine: string;
  contactEmail: string;
  qrTitle: string;
  qrSubtitle: string;
  footerNote: string;
};

export type FlyerTextField = {
  [Key in keyof FlyerContent]: FlyerContent[Key] extends string ? Key : never;
}[keyof FlyerContent];

export function createDefaultFlyerContent(): FlyerContent {
  return {
    frontEyebrow: "Concept Flyer",
    backEyebrow: "What is inside",
    heroCardTitle: "Platform snapshot",
    companyName,
    companyTagline,
    conceptOneLiner:
      "Project Arch is an announced concept that turns scholar research into AI-guided reading support for students.",
    companyMission:
      "Built for K12-14 learners, educators, and academic partners. Announced concept only.",
    scopeHeading: "Initial scope",
    scopeNote:
      "The first scholar directory centers on Big Ten universities in the United States with grade-aware experiences for K12-14 students.",
    frontFeatureRows: [
      {
        title: "Veri AI",
        detail:
          "A scholar-specific chatbot delivering grade-personalized answers grounded in each scholar's research and academic voice.",
        icon: "chat",
      },
      {
        title: "Scholar Directory",
        detail:
          "A searchable Big Ten scholar directory built for discovery, context, and research access.",
        icon: "directory",
      },
      {
        title: "AI Scholar Podcasts",
        detail:
          "AI-generated scholar conversations that surface shared themes, debate, and cross-disciplinary insight.",
        icon: "podcast",
      },
      {
        title: "Editorial and Curated Stories",
        detail:
          "AI editorials and scholar-curated stories that turn research into readable narratives for learners.",
        icon: "editorial",
      },
    ],
    summaryHeading: "Why it matters",
    valuePillars: [
      { label: "Scholar-led", detail: "Grounded in real academic voices and research" },
      { label: "Grade-aware", detail: "Answers personalized by student reading level" },
      { label: "Story-driven", detail: "Research transformed into engaging learning media" },
    ],
    featurePersonalization:
      "Explanations, tone, and depth adjust for different grades and learning communities.",
    featureGoal: "Build a new American model for reading comprehension.",
    valueSummary: [
      {
        label: "Students",
        detail: "Get clearer answers from difficult academic material",
      },
      {
        label: "Educators",
        detail: "Bring scholar-backed reading support into instruction",
      },
      {
        label: "Partners",
        detail: "Explore pilots, sponsorships, and investment opportunities",
      },
    ],
    featuresHeading: "Platform Features",
    featuresIntro:
      "The back page outlines the core product layers that shape the Project Arch learning experience.",
    platformFeatures: [...platformFeatures],
    collaborationHeading: "Next step",
    collaborationBody:
      "Private concept materials, pilot discussions, and partnership conversations are available for selected collaborators, sponsors, and investors.",
    backNoteHeading: "Flyer note",
    ideatorLabel: "Ideated by",
    ideator,
    contactLine:
      "For collaboration, sponsorship, and investment interest, connect through the private Project Arch outreach process.",
    contactEmail,
    qrTitle: "",
    qrSubtitle: "",
    footerNote:
      "Project Arch - announced concept only. Big Ten is a registered trademark of the Big Ten Conference.",
  };
}
