import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const readmePath = resolve(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf8");

const requiredSections = [
  "assets/hero.svg",
  "headers/whoami.svg",
  "headers/launch-bay.svg",
  "headers/the-lab.svg",
  "headers/toolbelt.svg",
  "headers/telemetry.svg",
  "headers/open-a-channel.svg",
  "github-contribution-grid-snake.svg",
  "pratikchittroda-cpu",
  "<!-- LAB-CARDS:START -->",
  "<!-- LAB-CARDS:END -->",
  "<!-- LAB-NOTES:START -->",
  "<!-- LAB-NOTES:END -->",
];

const missingSections = requiredSections.filter((section) => !readme.includes(section));
if (missingSections.length > 0) {
  throw new Error(`README is missing required content: ${missingSections.join(", ")}`);
}

const localAssets = [...readme.matchAll(/src="\.\/([^"]+)"/g)].map(([, p]) => p);
const missingAssets = localAssets.filter((p) => !existsSync(resolve(process.cwd(), p)));
if (missingAssets.length > 0) {
  throw new Error(`README references missing local assets: ${missingAssets.join(", ")}`);
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
