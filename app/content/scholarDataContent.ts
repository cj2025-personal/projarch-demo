import { companyName, companyTagline, contactEmail, ideator } from "./platformContent";

export type ScholarDataPair = {
  label: string;
  detail: string;
};

export type ScholarDataStageIcon =
  | "source"
  | "profile"
  | "section"
  | "passage"
  | "evidence"
  | "answer";

export type ScholarDataStage = {
  step: string;
  title: string;
  detail: string;
  icon: ScholarDataStageIcon;
};

export type ScholarGroupIcon = "contemporary" | "legacy" | "legendary";

export type ScholarGroup = {
  name: string;
  dashboardLabel: string;
  detail: string;
  criteriaLabel: string;
  criteria: string;
  icon: ScholarGroupIcon;
};

export type ScholarDataTier = {
  tier: string;
  title: string;
  detail: string;
};

export type ScholarDataContent = {
  frontEyebrow: string;
  backEyebrow: string;
  companyName: string;
  companyTagline: string;
  conceptOneLiner: string;
  companyMission: string;
  heroCardTitle: string;
  dataPillars: ScholarDataPair[];
  scopeHeading: string;
  scopeNote: string;
  pipelineHeading: string;
  pipelineIntro: string;
  pipelineStages: ScholarDataStage[];
  assuranceHeading: string;
  assuranceNote: string;
  audienceSummary: ScholarDataPair[];
  groupsHeading: string;
  groupsIntro: string;
  scholarGroups: ScholarGroup[];
  hierarchyHeading: string;
  hierarchyIntro: string;
  hierarchyTiers: ScholarDataTier[];
  classificationHeading: string;
  classificationNote: string;
  safeguardsHeading: string;
  safeguards: string[];
  ideatorLabel: string;
  ideator: string;
  contactLine: string;
  contactEmail: string;
  footerNote: string;
};

export type ScholarDataTextField = {
  [Key in keyof ScholarDataContent]: ScholarDataContent[Key] extends string ? Key : never;
}[keyof ScholarDataContent];

export function createDefaultScholarDataContent(): ScholarDataContent {
  return {
    frontEyebrow: "Scholar Data Explained",
    backEyebrow: "What a student sees in the dashboard",
    companyName,
    companyTagline,
    conceptOneLiner:
      "Every answer a student reads on Project Arch can be traced back to a real passage from a real scholar's own work.",
    companyMission:
      "A plain-language guide for teachers, librarians, and school leaders. Announced concept only.",
    heroCardTitle: "What we hold",
    dataPillars: [
      { label: "Real scholars", detail: "Living researchers and historic figures alike" },
      { label: "Real sources", detail: "Their own profiles, papers, and archives" },
      { label: "Real citations", detail: "Every claim points back to a passage" },
    ],
    scopeHeading: "Why this matters in a classroom",
    scopeNote:
      "Most AI tools answer from a blur of internet text, so a teacher cannot check where an answer came from. Project Arch is built the other way around: the source comes first, and the answer is assembled from it.",
    pipelineHeading: "From a scholar's page to a student's answer",
    pipelineIntro:
      "Scholar material travels through six steps before a student ever sees it. Nothing is invented along the way.",
    pipelineStages: [
      {
        step: "01",
        title: "We start with the source",
        detail:
          "University pages, published papers, archived documents, and interviews are gathered from the places a librarian would send you.",
        icon: "source",
      },
      {
        step: "02",
        title: "We build the scholar's profile",
        detail:
          "Everything gathered for one scholar is brought together in a single profile: who they are, where they work, and what they have written.",
        icon: "profile",
      },
      {
        step: "03",
        title: "We sort it into sections",
        detail:
          "The profile is organized into familiar parts such as biography, education, research, and legacy, so material is easy to place.",
        icon: "section",
      },
      {
        step: "04",
        title: "We break it into passages",
        detail:
          "Sections are split into short, readable passages, each one still traceable to the document it came from.",
        icon: "passage",
      },
      {
        step: "05",
        title: "We tie claims to evidence",
        detail:
          "Before anything is published, every statement is matched to the passages that support it. Unsupported statements are held back.",
        icon: "evidence",
      },
      {
        step: "06",
        title: "The student gets a cited answer",
        detail:
          "The answer is written at the student's reading level, and the passages behind it stay visible so the work can be checked.",
        icon: "answer",
      },
    ],
    assuranceHeading: "The short version",
    assuranceNote:
      "If a passage cannot be found to support a sentence, the sentence does not reach the student.",
    audienceSummary: [
      {
        label: "Teachers",
        detail: "Can see the source behind any answer before assigning it",
      },
      {
        label: "Students",
        detail: "Read material matched to their grade, not watered down",
      },
      {
        label: "Librarians",
        detail: "Get a traceable path from claim back to original document",
      },
    ],
    groupsHeading: "Three groups of scholars",
    groupsIntro:
      "In the dashboard, the Community menu opens the scholar collection three ways. Every scholar belongs to one of these groups.",
    scholarGroups: [
      {
        name: "Contemporary",
        dashboardLabel: "Shown as: Scholars",
        detail:
          "Verified professors and researchers from R1 research universities, reviewed by the editorial board and kept current.",
        criteriaLabel: "How we define this",
        criteria:
          "Placeholder: working definition to be confirmed. Broadly, scholars who are active in research and teaching today.",
        icon: "contemporary",
      },
      {
        name: "Legacy",
        dashboardLabel: "Shown as: Legacy Archive",
        detail:
          "Scholars from our extended academic archive, with institutions, publications, and research preserved alongside the live directory.",
        criteriaLabel: "How we define this",
        criteria:
          "Placeholder: the criteria that make a scholar legacy are being set by the academic lead and will be filled in here.",
        icon: "legacy",
      },
      {
        name: "Legendary",
        dashboardLabel: "Shown as: Legends",
        detail:
          "Foundational figures whose work continues to shape the scholars and disciplines across the platform.",
        criteriaLabel: "How we define this",
        criteria:
          "Placeholder: the criteria that make a scholar legendary are being set by the academic lead and will be filled in here.",
        icon: "legendary",
      },
    ],
    hierarchyHeading: "The Scholar Data Hierarchy",
    hierarchyIntro:
      "Six levels, from the whole collection down to the single passage behind an answer. This is the path a student walks in the dashboard.",
    hierarchyTiers: [
      {
        tier: "Level 1",
        title: "The directory",
        detail:
          "The whole scholar collection, opened from the Community menu on the student dashboard.",
      },
      {
        tier: "Level 2",
        title: "Scholar group",
        detail:
          "The collection divides three ways: Contemporary, Legacy, and Legendary.",
      },
      {
        tier: "Level 3",
        title: "University and field",
        detail:
          "Within a group, scholars are placed by institution and discipline, so a student can browse by campus or by subject.",
      },
      {
        tier: "Level 4",
        title: "The scholar",
        detail:
          "One person, one profile: their biography, their work, their sources, and their portrait.",
      },
      {
        tier: "Level 5",
        title: "Sections of their work",
        detail:
          "Each profile is organized into biography, education, research, and legacy so material is findable.",
      },
      {
        tier: "Level 6",
        title: "The passage behind the answer",
        detail:
          "The short excerpt a student is actually shown, and the citation that ties the answer back to it.",
      },
    ],
    classificationHeading: "Placeholder: how legacy and legendary are decided",
    classificationNote:
      "This panel is a placeholder. The criteria that separate a legacy scholar from a legendary one are being finalised by our academic lead, and the agreed wording will replace this text before the flyer is circulated.",
    safeguardsHeading: "What we check before a scholar goes live",
    safeguards: [
      "Every profile is reviewed by our academic panel before it is published.",
      "Every published statement points back to the scholar's own material.",
      "Historic figures are written about as informed perspective, never as words put in their mouth.",
      "Reading level and depth adapt to the student without changing the underlying source.",
    ],
    ideatorLabel: "Ideated by",
    ideator,
    contactLine:
      "For pilot programs, classroom trials, and partnership conversations, connect through the private Project Arch outreach process.",
    contactEmail,
    footerNote:
      "Project Arch - announced concept only. Big Ten is a registered trademark of the Big Ten Conference.",
  };
}
