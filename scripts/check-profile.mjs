import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readmePath = resolve(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf8");

const requiredSections = [
  "Hey, I’m Pratik",
  "Selected work",
  "Tools I reach for",
  "The build loop",
  "Let’s build something useful",
  "github-contribution-grid-snake.svg",
  "pratikchittroda-cpu",
];

const missingSections = requiredSections.filter((section) => !readme.includes(section));
if (missingSections.length > 0) {
  throw new Error(`README is missing required content: ${missingSections.join(", ")}`);
}

const links = [...readme.matchAll(/https:\/\/[^\s)"']+/g)].map(([link]) => link);
const uniqueLinks = new Set(links);
if (uniqueLinks.size < 12) {
  throw new Error(`Expected at least 12 profile links, found ${uniqueLinks.size}`);
}

const imageCount = (readme.match(/<img\s/g) ?? []).length;
if (imageCount < 12) {
  throw new Error(`Expected at least 12 visual elements, found ${imageCount}`);
}

console.log(`Profile README check passed: ${readme.length} characters, ${imageCount} visual elements, ${uniqueLinks.size} links.`);
