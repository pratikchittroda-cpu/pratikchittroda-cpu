// Refreshes "the lab" so it always shows the most recently committed public repos.
// Run: node scripts/update-lab.mjs && node scripts/build-assets.mjs
//
// 1. asks GitHub for this account's public repos, newest push first
// 2. writes the top few to scripts/lab.json (read by build-assets.mjs to draw the cards)
// 3. rewrites the lab cards and lab notes in README.md, between the LAB markers
// 4. deletes card images that are no longer used
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { CURATED, EXCLUDE, LAB_SIZE, fromRepo } from "./lab-catalog.mjs";

const USER = process.env.GITHUB_REPOSITORY_OWNER || "pratikchittroda-cpu";
const cwd = process.cwd();

const headers = { Accept: "application/vnd.github+json", "User-Agent": "profile-readme-lab" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`, { headers });
if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
const repos = await res.json();

const picked = repos
  .filter((r) => !r.private && !r.fork && !r.archived && !EXCLUDE.includes(r.name))
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
  .slice(0, LAB_SIZE);
if (picked.length === 0) throw new Error("No public repos to show in the lab");

const lab = picked.map((r) => ({ ...(CURATED[r.name] || fromRepo(r)), repo: r.name, url: r.html_url }));
writeFileSync(resolve(cwd, "scripts/lab.json"), JSON.stringify(lab, null, 2) + "\n");

// ── README
const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cell = (s) => String(s).replace(/\|/g, "\\|");
const between = (text, name, body) => {
  const a = `<!-- ${name}:START -->`, b = `<!-- ${name}:END -->`;
  const i = text.indexOf(a), j = text.indexOf(b);
  if (i < 0 || j < i) throw new Error(`README is missing the ${name} markers`);
  return text.slice(0, i + a.length) + "\n" + body + "\n" + text.slice(j);
};

const cardsHtml = `<p align="center">\n${lab.map((c) => `  <a href="${c.url}"><img src="./assets/cards/${c.file}.svg" alt="${attr(`${c.title} — ${c.kicker}`)}" width="49%" /></a>`).join("\n")}\n</p>`;
const notes = [
  "| Experiment | The question it asks |",
  "| :--- | :--- |",
  ...lab.map((c) => `| [**${cell(c.title)}**](${c.url}) | ${cell(c.question)} |`),
  `| [**Expenzo**](https://github.com/${USER}/Project-diploma) | Can a finance AI ask for consent first and keep keys out of the app bundle? |`,
  `| [**Portfolio Card**](https://github.com/${USER}/Portfolio-Card) | How much of "me" fits on one card at [one link](https://portfolio-card-ten-nu.vercel.app)? |`,
].join("\n");

const readmePath = resolve(cwd, "README.md");
let readme = readFileSync(readmePath, "utf8");
readme = between(readme, "LAB-CARDS", cardsHtml);
readme = between(readme, "LAB-NOTES", "\n" + notes + "\n");
writeFileSync(readmePath, readme);

// ── drop card images nothing points at any more
const cardsDir = resolve(cwd, "assets/cards");
const keep = new Set(["expenzo.svg", "portfolio-card.svg", ...lab.map((c) => `${c.file}.svg`)]);
for (const f of readdirSync(cardsDir)) if (f.endsWith(".svg") && !keep.has(f)) rmSync(resolve(cardsDir, f));

console.log("lab:", lab.map((c) => c.repo).join(", "));
