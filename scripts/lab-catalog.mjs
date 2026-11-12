// Hand-written copy for "the lab" cards, keyed by repository name.
// scripts/update-lab.mjs picks the most recently committed public repos; a repo listed here
// gets this copy and artwork, any other repo gets a card built from its GitHub description.
// Add an entry here whenever a new repo deserves better words than its description.

const cyan = "#22D3EE", violet = "#A78BFA", pink = "#F472B6", amber = "#FBBF24", lime = "#A3E635";
export const COLORS = [cyan, violet, pink, amber, lime];

// How many cards the lab shows.
export const LAB_SIZE = 4;

// Never shown in the lab: this profile repo, the two launch-bay projects, and throwaways.
export const EXCLUDE = ["pratikchittroda-cpu", "Portfolio-Card", "Project-diploma", "Expenzo", "demo.."];

export const CURATED = {
  ReleaseArc: {
    file: "releasearc", title: "ReleaseArc", kicker: "delivery intelligence",
    lines: ["Sprints, GitHub, review and CI/CD", "in one view of release health."],
    tags: ["TypeScript", "Supabase", "GitHub API"], status: "LIVE", color: cyan, motif: "arc",
    question: "Can sprint plans, pull requests and CI tell you, in one view, whether a release is [actually on track](https://project-pulse-navy.vercel.app)?",
  },
  "Manga-Forge-": {
    file: "mangaforge", title: "MangaForge AI", kicker: "manga & manhwa generator",
    lines: ["Stories, characters and panels,", "generated from a single idea."],
    tags: ["React", "TypeScript", "Gemini"], status: "EXPERIMENT", color: lime, motif: "manga",
    question: "How far can one idea go — story, characters and panels — before a human has to pick up the pen?",
  },
  ForgeCode: {
    file: "forgecode", title: "ForgeCode", kicker: "local-first agentic IDE",
    lines: ["Plan → Execute → Verify loops in Rust,", "local LLMs, AST-guarded patching."],
    tags: ["Rust", "Tauri", "React", "LanceDB"], status: "EXPERIMENT", color: violet, motif: "forge",
    question: "Can a local LLM on a 16 GB laptop run a real *Plan → Execute → Verify* loop — with tree-sitter guarding every patch?",
  },
  Valentine: {
    file: "valentine", title: "Valentine", kicker: "a proposal with a twist",
    lines: ["A 'No' button that runs away,", "a photo gallery and AI love notes."],
    tags: ["React", "Framer Motion", "Gemini"], status: "EXPERIMENT", color: pink, motif: "heart",
    question: "What if the \"No\" button simply refused to be clicked?",
  },
  "Chronicles-Of-Infinity": {
    file: "chronicles", title: "Chronicles of ∞", kicker: "infinite adventure engine",
    lines: ["A choose-your-own-adventure", "that never runs out of chapters."],
    tags: ["TypeScript", "Gemini"], status: "EXPERIMENT", color: pink, motif: "infinity",
    question: "What happens when a choose-your-own-adventure book simply… never ends?",
  },
  ChicAI: {
    file: "chicai", title: "ChicAI", kicker: "your virtual stylist",
    lines: ["AI-assisted outfit ideas and", "recommendations that make sense."],
    tags: ["TypeScript", "Gemini"], status: "EXPERIMENT", color: pink, motif: "chic",
    question: "Can a stylist be helpful instead of just trendy?",
  },
  "Culinary-Ai": {
    file: "culinary-ai", title: "Culinary AI", kicker: "smart-fridge sous-chef",
    lines: ["Look inside the fridge, decide", "what's for dinner — together."],
    tags: ["TypeScript", "Gemini"], status: "EXPERIMENT", color: lime, motif: "fridge",
    question: "What's for dinner, given what's *actually* in the fridge?",
  },
};

const hashOf = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const sentence = (s) => { const t = s.trim().replace(/\s+/g, " ").replace(/ ,/g, ","); return t.charAt(0).toUpperCase() + t.slice(1) + (/[.!?…]$/.test(t) ? "" : "."); };

// Break a description into at most two card lines of about 36 characters.
function wrap(text, width = 36, max = 2) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > width) { lines.push(line); line = word; } else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  if (lines.length > max) { lines.length = max; lines[max - 1] = lines[max - 1].replace(/[\s,.;:]*\S*$/, "") + "…"; }
  return lines;
}

/** Card data for a repo that has no hand-written entry. */
export function fromRepo(r) {
  const desc = (r.description || "").trim();
  const hasDesc = desc.replace(/[^\p{L}\p{N}]/gu, "").length > 3;
  const text = hasDesc ? sentence(desc) : `A ${r.language || "new"} project, fresh off the keyboard.`;
  return {
    file: "lab-" + r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title: r.name.replace(/[-_.]+/g, " ").trim(),
    kicker: (r.language ? r.language.toLowerCase() + " " : "") + (r.homepage ? "project, live" : "experiment"),
    lines: wrap(text),
    tags: [r.language, ...(r.topics || []).slice(0, 2)].filter(Boolean).slice(0, 3),
    status: r.homepage ? "LIVE" : "EXPERIMENT",
    color: COLORS[hashOf(r.name) % COLORS.length],
    motif: "commits",
    question: text,
  };
}
