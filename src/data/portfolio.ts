/**
 * ============================================================
 *  PORTFOLIO DATA — the single source of truth for this site.
 *  Every section of the UI renders from this file.
 *
 *  HOW TO UPDATE:
 *  - Replace any value marked  TODO  with your real information.
 *  - Leave a string EMPTY ("") to hide that item cleanly in the UI
 *    (the site shows a subtle "not configured" hint, never a lie).
 *  - Add/remove entries from arrays to change what renders.
 *  - Never invent data here — if you don't know it, leave it blank.
 *
 *  GitHub repos below were verified against the live GitHub API on
 *  2026-10-02. To refresh:
 *    python3 -c "
 *    import sys; sys.path.insert(0,'/home/hatch/workspace/skills/github/bin')
 *    from gh_api import req
 *    repos = req('GET','/users/ashu-cypher/repos?per_page=100&sort=updated')
 *    [print(r['name'], '|', r['language'], '|', r['stargazers_count'], '|', r['updated_at'][:10], '|', r['description']) for r in repos]
 *    "
 * ============================================================
 */

export type SkillLevel = "comfortable" | "building" | "exploring";
export type BuildStatus = "BUILDING" | "EXPERIMENTING" | "LEARNING";
export type ProjectStatus = "complete" | "building";
export type RepoCategory = "AI-ML" | "AI-AGENTS" | "WEB" | "AUTOMATION" | "PYTHON" | "OTHER";

export interface PersonalInfo {
  /** Full name shown in hero, nav and footer */
  name: string;
  /** e.g. "B.E. Computer Engineering · AI & Intelligent Systems" */
  headline: string;
  /** One-line supporting statement */
  tagline: string;
  /** Short location label, e.g. "Pune, Maharashtra, India" */
  location: string;
}

export interface Education {
  degree: string;
  college: string;
  /** e.g. "Third Year" — leave "" to hide */
  yearOfStudy: string;
  /** e.g. "2028" — leave "" to hide */
  graduation: string;
  specialization: string;
}

export interface JourneyEntry {
  /** Display label, e.g. "Sep 2026" or "2026–27" */
  period: string;
  title: string;
  description: string;
  /** Small tags shown under the entry */
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  /** One-line hook shown on the card */
  tagline: string;
  /** Longer overview shown in the detail modal */
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  features: string[];
  technologies: string[];
  challenges: string[];
  learned: string[];
  /** Optional image under /public (e.g. "/images/mew.png"). Leave "" for generated visual. */
  image: string;
  /** Real GitHub URL only. Leave "" to hide the button. */
  github: string;
  /** Real live-demo URL only. Leave "" and the button shows "Demo unavailable". */
  demo: string;
  status: ProjectStatus;
  /** Accent used for the card visual: "cyan" | "violet" | "amber" */
  accent: "cyan" | "violet" | "amber";
}

/**
 * A real public repository, verified against the GitHub API.
 * Add entries by hand to feature repos the API didn't return.
 */
export interface GithubRepo {
  /** Repository slug, e.g. "spidey" */
  name: string;
  /** Full https://github.com/… URL — always real, never fabricated */
  url: string;
  /** The repo's own description from GitHub (may be "") */
  description: string;
  /** Primary language from GitHub, "" when GitHub reports none */
  language: string;
  stars: number;
  /** ISO date of last push, e.g. "2026-10-02" */
  updatedAt: string;
  /** Filter buckets this repo appears under */
  categories: RepoCategory[];
  /** True = shown in the "Featured Builds" case-study area */
  featured: boolean;
}

export interface ExperienceEntry {
  /** Display label, e.g. "2026" */
  period: string;
  /** What the involvement is called — never invent an official title */
  role: string;
  /** Organization / community */
  organization: string;
  /** e.g. "Ambassadorship", "Community" */
  kind: string;
  /** One neutral line. Only what was actually provided — no invented
   *  responsibilities, durations, certificates or achievements. */
  description: string;
  tags: string[];
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface BuildingItem {
  title: string;
  emoji: string;
  description: string;
  technologies: string[];
  status: BuildStatus;
}

export interface Achievement {
  title: string;
  /** e.g. "Academic", "Hackathon", "Recognition" */
  category: string;
  period: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  education: Education;
  /** Short "who am I" paragraphs */
  about: string[];
  /** Animated stats — ONLY values derivable from this file. Leave [] to hide. */
  stats: { label: string; value: string }[];
  journey: JourneyEntry[];
  /** Curated case studies with full write-ups (shown with detail modals) */
  projects: Project[];
  /** Real repositories from GitHub (rendered in the filterable repo grid) */
  githubRepos: GithubRepo[];
  /** Involvement & activities — presented as such, never as invented jobs */
  experience: ExperienceEntry[];
  skills: SkillCategory[];
  currentlyBuilding: BuildingItem[];
  /** Leave [] and the whole Achievements section is hidden. */
  achievements: Achievement[];
  /** Path under /public, e.g. "/resume.pdf". Leave "" for a clean fallback. */
  resumePath: string; // TODO: drop your resume PDF into /public and set the path
  githubUsername: string;
  socials: SocialLinks;
  /** Interest pills shown in About */
  interests: string[];
}

export const portfolio: PortfolioData = {
  personal: {
    name: "Ashutosh Dhagat",
    headline: "B.E. Computer Engineering · Artificial Intelligence & Intelligent Systems",
    tagline: "Building intelligent systems that feel alive.",
    location: "Pune, Maharashtra, India",
  },

  education: {
    degree: "B.E. Computer Engineering",
    college: "Alard College of Engineering",
    yearOfStudy: "",
    graduation: "2028",
    specialization: "Artificial Intelligence & Intelligent Systems",
  },

  about: [
    "I'm a B.E. Computer Engineering student at Alard College of Engineering, specializing in Artificial Intelligence & Intelligent Systems. I learn by building: AI assistants with real memory, bilingual learning apps, retrieval pipelines — systems you can actually run, click, and talk to.",
    "My focus is practical intelligent software: AI agents, retrieval-augmented generation, automation systems, and interactive digital experiences. I care about honest engineering — verified behavior, graceful fallbacks, and interfaces that respect the person using them.",
  ],

  // Only honest, data-derived stats.
  // "4" repos · "21" distinct skills across the categories below ·
  // "4" currently-building items — all counted from this file.
  stats: [
    { label: "Projects Shipped", value: "4" },
    { label: "Technologies", value: "21" },
    { label: "Currently Building", value: "4" },
    { label: "Focus", value: "AI Systems" },
  ],

  journey: [
    {
      period: "Sep 2026",
      title: "First shipped product: AI Learning Adventure",
      description:
        "Designed and built a bilingual (English + Hindi) Android learning app for nursery-age kids — mini-games, voice narration, and a Capacitor build pipeline. Learned how real users (a 3-year-old!) interact with software.",
      tags: ["React", "TypeScript", "Capacitor", "Web Audio", "TTS"],
    },
    {
      period: "Sep – Oct 2026",
      title: "MEW — personal AI agent",
      description:
        "Built MEW, a personal AI assistant, end to end: an orchestrator pipeline (understand → remember → plan → tools → execute → verify → respond → remember), layered memory, RAG over documents, resume intelligence, a modular tool system, and a voice-reactive Stark HUD frontend.",
      tags: ["Python", "FastAPI", "React", "PostgreSQL", "pgvector", "RAG", "AI Agents"],
    },
    {
      period: "2026–27",
      title: "Seminar: RAG for Personalized Education",
      description:
        "Academic seminar on “Retrieval-Augmented Generation for Personalized and Intelligent Education” — researching how retrieval-grounded LLMs can adapt learning content to individual students. Guide: Prof. Deepali Mane.",
      tags: ["RAG", "LLMs", "Education", "Research"],
    },
    {
      period: "Now",
      title: "Deepening the craft",
      description:
        "Currently pushing further into AI agents, backend systems, and databases — hardening what I've built, verifying voice interfaces on real devices, and turning experiments into polished systems.",
      tags: ["AI Agents", "Backend", "Databases", "System Design"],
    },
  ],

  projects: [
    {
      id: "mew",
      name: "MEW",
      tagline: "A personal AI assistant with memory, tools and voice.",
      description:
        "MEW is a personal AI agent built around an orchestrator pipeline: every request flows through understand → remember → plan → use tools → execute → verify → respond → remember. It has layered short/long-term memory, RAG over uploaded documents, resume/CV analysis with job matching, a modular tool system with confirmation gates for destructive actions, and a voice interface with wake-word detection.",
      problem:
        "Chatbots forget everything and can't act. I wanted an assistant that remembers context across sessions, can use real tools, and asks before doing anything destructive.",
      solution:
        "A FastAPI backend implementing the orchestrator pipeline with pluggable memory layers and a tool registry, paired with a React frontend styled as a Stark HUD — canvas arc reactor, voice-reactive visuals, and a tabbed command interface.",
      architecture:
        "Python 3.12 + FastAPI backend (persona engine, system controller, memory layers, RAG pipeline, protocol/audit system, SSE event stream) · PostgreSQL + pgvector for embeddings · React + Vite + TypeScript + Tailwind frontend (HUD, voice engine, 7 tabs) · docker-compose for the database.",
      features: [
        "Orchestrator pipeline: understand → remember → plan → tools → execute → verify → respond → remember",
        "Layered memory: short-term, long-term and knowledge memory",
        "RAG over uploaded documents with pgvector",
        "Resume intelligence: CV analysis, job-match mode, versioning",
        "Modular tool system with confirmation gates for external/destructive actions",
        "Voice interface: wake word, barge-in, speech-to-text and text-to-speech",
        "Stark HUD frontend: voice-reactive arc reactor, synthesized SFX",
        "Protocols system with audit trail + proactive reminders over SSE",
      ],
      technologies: ["Python", "FastAPI", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "pgvector", "Docker"],
      challenges: [
        "Designing a memory system that stays useful across sessions without growing unbounded",
        "Making tool execution safe: confirmation gates without killing the flow",
        "Voice pipeline reliability across browsers (mic permissions, TTS voice quality)",
      ],
      learned: [
        "How to structure an agent as a verifiable pipeline instead of a single prompt",
        "RAG fundamentals: chunking, embeddings, and vector search with pgvector",
        "Honest engineering: surfacing limits (e.g. metrics run on the server, not the user's PC) instead of faking them",
      ],
      image: "",
      github: "https://github.com/ashu-cypher/spidey",
      demo: "",
      status: "building",
      accent: "cyan",
    },
    {
      id: "ai-learning-adventure",
      name: "AI Learning Adventure",
      tagline: "Bilingual Android learning app for nursery-age kids.",
      description:
        "A highly creative, colorful Android learning app for a nursery-age child: a games hub with 10+ mini-games (painting, superhero games, music instruments, bubble/balloon pop, star catch), plus Play-Store-inspired learning games (animal sounds quiz, feed-the-monster, memory match, shape sorter, fruit catch, vehicle parade). Everything is narrated by Milo, a bilingual English+Hindi voice teacher, with real CC0 art and music.",
      problem:
        "Most kids' learning apps are either pale and boring or ad-filled. I wanted a joyful, ad-free, bilingual app a 3-year-old would actually love — with voice guidance in both English and Hindi.",
      solution:
        "A React + Capacitor app with a game store, bilingual TTS voice engine with native fallbacks, hand-composed monster art, CC0 music jingles, and 60fps GPU-friendly animations. Language lives in one global setting; games stay focused and fun with zero fail states.",
      architecture:
        "React + TypeScript + Vite frontend · Capacitor for the Android build · Web Audio + Capacitor TTS with graceful fallbacks · local game-store database (plays/favorites) · parent area with Google sign-in.",
      features: [
        "10+ mini-games: painting, superheroes, piano/drums/xylophone, bubble & balloon pop, star catch",
        "6 learning games with score, streaks and combos",
        "\"Milo's Mega Mix\": endless mashup of lesson-game mechanics",
        "Bilingual (EN + HI) voice narration with native TTS fallback",
        "Real CC0 art (Kenney packs, Twemoji) and music jingles",
        "Global language setting, parent area with voice-engine health check",
      ],
      technologies: ["React", "TypeScript", "Capacitor", "Web Audio", "TTS", "Android"],
      challenges: [
        "Voice silence on the installed APK: three rounds of voice-engine hardening (native TTS timeouts, voice re-priming, gesture unlocks)",
        "Keeping 60fps motion on low-end devices: RAF physics, GPU CSS transforms",
        "Designing for a toddler: no fail states, big touch targets, instant feedback",
      ],
      learned: [
        "Capacitor plugin quirks and real-device debugging",
        "How to build a resilient audio/voice layer with layered fallbacks",
        "Designing UX for an audience that can't read yet",
      ],
      image: "",
      github: "https://github.com/ashu-cypher/ai-learning-adventure",
      demo: "",
      status: "building",
      accent: "violet",
    },
    {
      id: "pocket-derma",
      name: "Pocket Derma",
      tagline: "AI-powered skincare recommendation app.",
      description:
        "Pocket Derma is an AI-powered skincare recommendation application: tell it about your skin and it recommends a routine tailored to you. The whole app was built with Lovable, with the AI's recommendation behavior shaped through prompt engineering.",
      problem:
        "Skincare advice online is generic and one-size-fits-all. I wanted an app that gives recommendations actually tailored to the individual.",
      solution:
        "An AI-driven web app built end-to-end with Lovable: the user describes their skin and concerns, and a prompt-engineered AI agent returns personalized skincare recommendations.",
      architecture:
        "Lovable-built web application · AI agent for personalized recommendations · prompt-engineered skincare guidance logic · clean web UI.",
      features: [
        "Personalized AI skincare recommendations",
        "Prompt-engineered recommendation behavior",
        "Built end-to-end with Lovable's AI app builder",
      ],
      technologies: ["Lovable", "AI Agents", "Generative AI", "Prompt Engineering", "UI/UX"],
      challenges: ["Shaping reliable, useful recommendations through prompt engineering"],
      learned: [
        "Prompt engineering for a domain-specific AI application",
        "Shipping a complete product with AI-assisted development tools",
      ],
      image: "",
      github: "",
      demo: "https://lovable.dev/projects/22baad28-3854-4809-bed9-9ac909facf1b",
      status: "complete",
      accent: "amber",
    },
  ],

  /**
   * Verified against https://api.github.com/users/ashu-cypher/repos on 2026-10-02.
   * Descriptions, languages, star counts and update dates are real.
   */
  githubRepos: [
    {
      name: "spidey",
      url: "https://github.com/ashu-cypher/spidey",
      description:
        "SPIDEY (MEW) — a personal AI agent: orchestrator with persistent memory, RAG knowledge base, resume intelligence, 10 tools, and live workflow visualization. FastAPI + React + PostgreSQL/pgvector.",
      language: "Python",
      stars: 0,
      updatedAt: "2026-10-02",
      categories: ["AI-ML", "AI-AGENTS", "PYTHON"],
      featured: true,
    },
    {
      name: "ai-learning-adventure",
      url: "https://github.com/ashu-cypher/ai-learning-adventure",
      description:
        "AI Learning Adventure — Multi-Agent AI Educational Game & Android APK for Preschoolers.",
      language: "TypeScript",
      stars: 0,
      updatedAt: "2026-09-27",
      categories: ["AI-ML", "AI-AGENTS", "WEB"],
      featured: true,
    },
    {
      name: "developer-portfolio",
      url: "https://github.com/ashu-cypher/developer-portfolio",
      description:
        "Interactive 3D developer portfolio — React + Vite + TypeScript + Tailwind + React Three Fiber.",
      language: "TypeScript",
      stars: 0,
      updatedAt: "2026-10-02",
      categories: ["WEB"],
      featured: false,
    },
    {
      name: "Drivera",
      url: "https://github.com/ashu-cypher/Drivera",
      description: "A mini project.",
      language: "",
      stars: 0,
      updatedAt: "2026-05-12",
      categories: ["OTHER"],
      featured: false,
    },
  ],

  experience: [
    {
      period: "2026",
      role: "Student Ambassador",
      organization: "GeeksforGeeks",
      kind: "Ambassadorship",
      description: "Student ambassador with the GeeksforGeeks community.",
      tags: ["Community", "Student Leadership"],
    },
    {
      period: "2026",
      role: "AI / Developer Community Involvement",
      organization: "Google Gemini",
      kind: "Community",
      description: "Engaged with the Google Gemini AI and developer community.",
      tags: ["AI", "Community"],
    },
  ],

  skills: [
    {
      category: "AI / Machine Learning",
      items: [
        { name: "Python", level: "comfortable" },
        { name: "Artificial Intelligence", level: "building" },
        { name: "Machine Learning", level: "building" },
        { name: "Generative AI", level: "building" },
        { name: "RAG", level: "building" },
        { name: "AI Agents", level: "building" },
      ],
    },
    {
      category: "Development",
      items: [
        { name: "React", level: "comfortable" },
        { name: "JavaScript", level: "comfortable" },
        { name: "Node.js", level: "exploring" },
        { name: "HTML", level: "comfortable" },
        { name: "CSS", level: "comfortable" },
        { name: "REST APIs", level: "building" },
      ],
    },
    {
      category: "Backend / Data",
      items: [
        { name: "Python", level: "comfortable" },
        { name: "SQL", level: "building" },
        { name: "MySQL", level: "building" },
        { name: "Oracle", level: "exploring" },
        { name: "Databases", level: "building" },
      ],
    },
    {
      category: "Tools",
      items: [
        { name: "Git", level: "comfortable" },
        { name: "GitHub", level: "comfortable" },
        { name: "VS Code", level: "comfortable" },
        { name: "n8n", level: "exploring" },
        { name: "Ollama", level: "exploring" },
      ],
    },
  ],

  currentlyBuilding: [
    {
      title: "MEW voice interface",
      emoji: "🤖",
      description:
        "Hardening the wake-word + speech pipeline and verifying it on a real browser with a microphone — the one part never run end-to-end yet.",
      technologies: ["Web Speech API", "React", "FastAPI"],
      status: "BUILDING",
    },
    {
      title: "RAG for personalized education",
      emoji: "📚",
      description:
        "Seminar research (2026–27) on retrieval-augmented generation for adaptive learning, guided by Prof. Deepali Mane — turning the write-up into working prototypes.",
      technologies: ["RAG", "LLMs", "pgvector", "Python"],
      status: "LEARNING",
    },
    {
      title: "AI Learning Adventure — voice on device",
      emoji: "🎓",
      description:
        "Verifying the bilingual voice engine on the installed Android APK and polishing the games hub based on real play sessions.",
      technologies: ["Capacitor", "TTS", "Android", "TypeScript"],
      status: "EXPERIMENTING",
    },
    {
      title: "Full-stack systems practice",
      emoji: "🌐",
      description:
        "Small backend + database projects to deepen fluency in APIs, auth, and data modeling beyond what my AI projects demanded.",
      technologies: ["FastAPI", "PostgreSQL", "Docker"],
      status: "BUILDING",
    },
  ],

  achievements: [
    {
      title: "Seminar on RAG for Personalized Education",
      category: "Academic",
      period: "2026–27",
      description:
        "Authored a full seminar report on “Retrieval-Augmented Generation for Personalized and Intelligent Education” under the guidance of Prof. Deepali Mane.",
    },
  ],

  resumePath: "/ashutosh-dhagat-resume.pdf",

  githubUsername: "ashu-cypher",

  socials: {
    github: "https://github.com/ashu-cypher",
    linkedin: "https://www.linkedin.com/in/ashutosh-dhagat-b324a526a/",
    // Email now complete: dhagatashutosh@gmail.com (provided by the user 2026-10-02).
    email: "dhagatashutosh@gmail.com",
  },

  interests: [
    "Artificial Intelligence",
    "AI Agents",
    "RAG",
    "Computer Vision",
    "Automation",
    "Full-Stack Development",
    "Intelligent Systems",
  ],
};

/** True when a data value is a real configured value (not empty / placeholder). */
export function isConfigured(value: string): boolean {
  return value.trim().length > 0;
}

/** Comfort labels shown in the skills section — honest, no percentages. */
export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  comfortable: "comfortable with",
  building: "building with",
  exploring: "exploring",
};

export const BUILD_STATUS_LABEL: Record<BuildStatus, string> = {
  BUILDING: "Building",
  EXPERIMENTING: "Experimenting",
  LEARNING: "Learning",
};

export const REPO_CATEGORY_LABEL: Record<RepoCategory, string> = {
  "AI-ML": "AI / ML",
  "AI-AGENTS": "AI Agents",
  WEB: "Web",
  AUTOMATION: "Automation",
  PYTHON: "Python",
  OTHER: "Other",
};

/** "2026-10-02" → "Oct 2026" */
export function formatRepoDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
