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
 * ============================================================
 */

export type SkillLevel = "comfortable" | "building" | "exploring";
export type BuildStatus = "BUILDING" | "EXPERIMENTING" | "LEARNING";
export type ProjectStatus = "complete" | "building";

export interface PersonalInfo {
  /** Full name shown in hero, nav and footer */
  name: string;
  /** e.g. "Computer Engineering Student & AI Developer" */
  headline: string;
  /** One-line supporting statement */
  tagline: string;
  /** Short location label, e.g. "Pune, India" — TODO if unknown */
  location: string; // TODO: replace with your location, or leave "" to hide
}

export interface Education {
  degree: string;
  /** TODO: replace with your college / university name */
  college: string; // TODO: replace
  /** TODO: e.g. "Third Year" — leave "" to hide */
  yearOfStudy: string; // TODO: replace
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
  /** Optional image under /public (e.g. "/images/jarvis.png"). Leave "" for generated visual. */
  image: string;
  /** Real GitHub URL only. Leave "" to hide the button. */
  github: string;
  /** Real live-demo URL only. Leave "" and the button shows "Demo unavailable". */
  demo: string;
  status: ProjectStatus;
  /** Accent used for the card visual: "cyan" | "violet" | "amber" */
  accent: "cyan" | "violet" | "amber";
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
  /** e.g. "Academic", "Hackathon", "Certification" */
  category: string;
  period: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  /** TODO: replace with your LinkedIn URL, or "" to hide */
  linkedin: string; // TODO: replace
  /** TODO: replace with your email, or "" to hide (contact form disables cleanly) */
  email: string; // TODO: replace
}

export interface PortfolioData {
  personal: PersonalInfo;
  education: Education;
  /** Short "who am I" paragraphs */
  about: string[];
  /** Animated stats — ONLY values derivable from this file. Leave [] to hide. */
  stats: { label: string; value: string }[];
  journey: JourneyEntry[];
  projects: Project[];
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
    headline: "Computer Engineering Student & AI Developer",
    tagline:
      "Building intelligent systems, useful applications and experimental AI experiences.",
    location: "", // TODO: replace with your location, or leave "" to hide
  },

  education: {
    degree: "B.E. Computer Engineering",
    college: "", // TODO: replace with your college / university name
    yearOfStudy: "", // TODO: e.g. "Third Year" — leave "" to hide
    specialization: "Artificial Intelligence & Intelligent Systems",
  },

  about: [
    "I'm a Computer Engineering student who learns by building. Instead of just studying concepts, I turn them into working systems — AI assistants, learning apps, and full-stack experiments.",
    "Right now I'm deep into AI agents, retrieval-augmented generation, and practical software systems: the kind of work where an idea becomes something you can actually run, click, and talk to.",
  ],

  // Only honest, data-derived stats. projects.length etc. stay true automatically.
  stats: [
    { label: "Projects Built", value: "3" },
    { label: "Technologies", value: "14" },
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
      period: "Sep 2026",
      title: "AethoFlix — original discovery experience",
      description:
        "Built an original Netflix-style movie/show discovery site from a hand-verified dataset of 52 real titles: hero carousel, genre rows, search, detail modals, a personal list, and a 3D theatre mode.",
      tags: ["React", "TypeScript", "TMDB data", "3D UI"],
    },
    {
      period: "Sep – Oct 2026",
      title: "J.A.R.V.I.S. — personal AI agent",
      description:
        "Built a JARVIS-style personal AI assistant end to end: an orchestrator pipeline (understand → remember → plan → tools → execute → verify → respond → remember), layered memory, RAG over documents, resume intelligence, a modular tool system, and a voice-reactive Stark HUD frontend.",
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
      id: "jarvis",
      name: "J.A.R.V.I.S.",
      tagline: "A JARVIS-style personal AI assistant with memory, tools and voice.",
      description:
        "J.A.R.V.I.S. is a personal AI agent built around an orchestrator pipeline: every request flows through understand → remember → plan → use tools → execute → verify → respond → remember. It has layered short/long-term memory, RAG over uploaded documents, resume/CV analysis with job matching, a modular tool system with confirmation gates for destructive actions, and a voice interface with wake-word detection.",
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
      id: "aethoflix",
      name: "AethoFlix",
      tagline: "Original Netflix-style movie & show discovery experience.",
      description:
        "An original discovery site for movies and shows built from a hand-verified dataset of 52 real titles (40 movies + 12 shows) with real posters, ratings, overviews and trailers. Features a hero carousel, Top-10 row, genre filtering, search, detail modals, a persistent My List, and a 3D Theatre mode.",
      problem:
        "I wanted to practice building a rich, media-heavy discovery UI — but with fully original branding and a dataset I verified myself, instead of copying an existing service.",
      solution:
        "A React single-page experience rendering entirely from a curated local dataset: no fake content, no copied branding. Rows, search and detail views are all data-driven, and My List persists in localStorage.",
      architecture:
        "React + TypeScript + Vite · curated JSON dataset (posters/backdrops/ratings/overviews/trailer IDs verified against public TMDB pages) · localStorage for My List · CSS 3D transforms for Theatre mode.",
      features: [
        "Hero carousel with featured titles",
        "Content rows including Top 10",
        "Search + genre filters",
        "Detail modal with trailer, cast and overview",
        "My List persisted in localStorage",
        "3D Theatre viewing mode",
      ],
      technologies: ["React", "TypeScript", "Vite", "CSS 3D", "TMDB data"],
      challenges: [
        "Verifying 52 titles by hand so every poster, rating and overview is real",
        "Designing an original brand that feels premium without copying Netflix",
        "Keeping a media-heavy page fast: lazy-loaded imagery, lightweight transforms",
      ],
      learned: [
        "Data curation discipline: real datasets beat placeholder content",
        "Building immersive UI (theatre mode) with pure CSS 3D",
        "When to stop: shipping the experience instead of gold-plating it",
      ],
      image: "",
      github: "",
      demo: "",
      status: "complete",
      accent: "amber",
    },
  ],

  skills: [
    {
      category: "Programming",
      items: [
        { name: "Python", level: "comfortable" },
        { name: "TypeScript", level: "comfortable" },
        { name: "JavaScript", level: "comfortable" },
        { name: "HTML", level: "comfortable" },
        { name: "CSS", level: "comfortable" },
      ],
    },
    {
      category: "AI / ML",
      items: [
        { name: "AI Agents", level: "building" },
        { name: "RAG", level: "building" },
        { name: "LLMs", level: "building" },
        { name: "Embeddings", level: "building" },
        { name: "Vector Databases", level: "exploring" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "FastAPI", level: "comfortable" },
        { name: "Node.js", level: "exploring" },
        { name: "PostgreSQL", level: "building" },
        { name: "pgvector", level: "building" },
      ],
    },
    {
      category: "Frontend",
      items: [
        { name: "React", level: "comfortable" },
        { name: "Vite", level: "comfortable" },
        { name: "Tailwind CSS", level: "comfortable" },
        { name: "Capacitor", level: "building" },
      ],
    },
  ],

  currentlyBuilding: [
    {
      title: "J.A.R.V.I.S. voice interface",
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

  resumePath: "", // TODO: drop your resume PDF into /public (e.g. "/resume.pdf") and set the path

  githubUsername: "ashu-cypher",

  socials: {
    github: "https://github.com/ashu-cypher",
    linkedin: "", // TODO: replace with your LinkedIn URL, or "" to hide
    email: "", // TODO: replace with your email — the contact form uses this for its mailto fallback
  },

  interests: [
    "Artificial Intelligence",
    "AI Agents",
    "RAG",
    "Full-Stack Development",
    "Python",
    "Automation",
    "Intelligent Applications",
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
