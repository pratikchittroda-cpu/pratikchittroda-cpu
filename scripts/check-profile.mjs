import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readmePath = resolve(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf8");

const requiredSections = [
  "Hey, I’m Pratik",
  "Motion playground",
  "Selected work",
  "Tools I reach for",
  "The build loop",
  "Let’s build something useful",
  "github-contribution-grid-snake.svg",
  "motion/showcase.svg",
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

const motion = readFileSync(resolve(process.cwd(), "motion/showcase.svg"), "utf8");
const animationCount = (motion.match(/<animate(?:Transform)?\b/g) ?? []).length;
if (animationCount < 10) {
  throw new Error(`Expected at least 10 motion animations, found ${animationCount}`);
}

console.log(`Profile README check passed: ${readme.length} characters, ${imageCount} visual elements, ${uniqueLinks.size} links, ${animationCount} motion animations.`);
