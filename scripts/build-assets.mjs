// Generates every animated SVG used by the profile README.
// Run: node scripts/build-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(process.cwd(), "assets");
const out = (p, svg) => {
  const f = resolve(root, p);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, svg.trim() + "\n");
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const C = {
  bg: "#060913", panel: "#0B1120", line: "#1E293B", text: "#E2E8F0", dim: "#94A3B8", mute: "#475569",
  cyan: "#22D3EE", violet: "#A78BFA", pink: "#F472B6", amber: "#FBBF24", lime: "#A3E635",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// deterministic random so rebuilds are stable
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const stars = (n, w, h, maxY = h) =>
  Array.from({ length: n }, () => {
    const x = (rnd() * w).toFixed(1), y = (rnd() * maxY).toFixed(1);
    const r = (rnd() * 1.3 + 0.3).toFixed(2), d = (rnd() * 4 + 2).toFixed(1), b = (rnd() * 4).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".15;1;.15" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></circle>`;
  }).join("");

/* ───────────────────────── HERO ───────────────────────── */
function hero() {
  const W = 1200, H = 460, hz = 330; // horizon
  const vlines = Array.from({ length: 25 }, (_, i) => {
    const x = -600 + i * 100;
    return `<line x1="${W / 2}" y1="${hz}" x2="${W / 2 + (x) * 2.2}" y2="${H}" />`;
  }).join("");
  const hlines = Array.from({ length: 7 }, (_, i) =>
    `<line x1="0" x2="${W}" y1="${hz}" y2="${hz}"><animate attributeName="y1" values="${hz};${H + 10}" keySplines=".6 0 1 1" calcMode="spline" keyTimes="0;1" dur="4.2s" begin="-${(i * 0.6).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="y2" values="${hz};${H + 10}" keySplines=".6 0 1 1" calcMode="spline" keyTimes="0;1" dur="4.2s" begin="-${(i * 0.6).toFixed(1)}s" repeatCount="indefinite"/></line>`
  ).join("");

  const term = [
    ["$ whoami", C.cyan],
    ["pratik — builds apps that feel alive", C.text],
    ["$ cat stack.txt", C.cyan],
    ["typescript · react · react-native · rust · ai", C.text],
    ["$ ./ship --idea next", C.cyan],
    ["▓▓▓▓▓▓▓▓▓▓▓▓░░░  compiling ideas…", C.lime],
  ];
  const T = 14; // loop seconds
  const termLines = term.map(([t, col], i) => {
    const y = 128 + i * 28, w = t.length * 9.8 + 24;
    const s = (0.6 + i * 1.3) / T, e = (0.6 + i * 1.3 + (i % 2 ? 0.5 : 0.9)) / T;
    return `<clipPath id="tl${i}"><rect x="0" y="${y - 18}" height="26" width="0"><animate attributeName="width" values="0;0;${w};${w};0" keyTimes="0;${s.toFixed(3)};${e.toFixed(3)};.93;1" dur="${T}s" repeatCount="indefinite"/></rect></clipPath>
    <text x="22" y="${y}" fill="${col}" font-family="${MONO}" font-size="15" clip-path="url(#tl${i})" xml:space="preserve">${esc(t)}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">Pratik — app developer, product builder, AI tinkerer</title>
<desc id="d">An animated synthwave night sky with Pratik's name and a terminal typing whoami, stack and ship commands.</desc>
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070F"/><stop offset=".62" stop-color="#140B2E"/><stop offset=".72" stop-color="#2A0E3F"/><stop offset="1" stop-color="#05070F"/></linearGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-.5 0;.5 0;-.5 0" dur="8s" repeatCount="indefinite"/></linearGradient>
  <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.amber}"/><stop offset=".55" stop-color="${C.pink}"/><stop offset="1" stop-color="#7C3AED"/></linearGradient>
  <mask id="sunCut"><rect width="${W}" height="${H}" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${262 + i * 12}" width="${W}" height="${2 + i * 1.3}" fill="#000"/>`).join("")}</mask>
  <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
  <mask id="gm"><rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#gridFade)"/></mask>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(90, W, H, hz - 20)}
  <!-- shooting star -->
  <line x1="0" y1="0" x2="90" y2="30" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0">
    <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.86;.9;1" dur="9s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="150 30;150 30;520 150" keyTimes="0;.86;1" dur="9s" repeatCount="indefinite"/>
  </line>
  <!-- synth sun -->
  <circle cx="${W / 2 + 40}" cy="${hz - 10}" r="105" fill="url(#sun)" mask="url(#sunCut)" opacity=".9" filter="url(#glow)">
    <animate attributeName="r" values="102;110;102" dur="6s" repeatCount="indefinite"/>
  </circle>
  <rect y="${hz}" width="${W}" height="${H - hz}" fill="#070512"/>
  <g mask="url(#gm)" stroke="${C.pink}" stroke-width="1.4" opacity=".75">${vlines}${hlines}</g>
  <line x1="0" x2="${W}" y1="${hz}" y2="${hz}" stroke="${C.pink}" stroke-width="2" filter="url(#glow)"/>

  <!-- name block -->
  <g font-family="${SANS}">
    <text x="64" y="118" fill="${C.dim}" font-family="${MONO}" font-size="18" letter-spacing="4">// HELLO, WORLD. I'M</text>
    <text x="58" y="222" fill="url(#name)" font-size="120" font-weight="900" letter-spacing="6" filter="url(#glow)">PRATIK</text>
    <text x="64" y="268" fill="${C.text}" font-size="18" font-weight="600" letter-spacing="1">app developer <tspan fill="${C.pink}">✦</tspan> product builder <tspan fill="${C.cyan}">✦</tspan> ai tinkerer</text>
  </g>

  <!-- terminal -->
  <g transform="translate(700 52)">
    <rect width="440" height="246" rx="14" fill="#0A0F1E" fill-opacity=".86" stroke="${C.violet}" stroke-opacity=".45"/>
    <rect width="440" height="34" rx="14" fill="#111832"/><rect y="20" width="440" height="14" fill="#111832"/>
    <circle cx="20" cy="17" r="6" fill="#FF5F57"/><circle cx="40" cy="17" r="6" fill="#FEBC2E"/><circle cx="60" cy="17" r="6" fill="#28C840"/>
    <text x="220" y="22" text-anchor="middle" fill="${C.dim}" font-family="${MONO}" font-size="12">pratik@limitless: ~</text>
    <g transform="translate(0 -60)">${termLines}</g>
    <rect x="22" y="218" width="10" height="16" fill="${C.cyan}"><animate attributeName="opacity" values="1;0;1" dur="1s" calcMode="discrete" repeatCount="indefinite"/></rect>
  </g>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="27" fill="none" stroke="${C.violet}" stroke-opacity=".35" stroke-width="2"/>
</svg>`;
}

/* ───────────────────────── SECTION HEADERS ───────────────────────── */
function header(num, title, sub, col) {
  const W = 1200, H = 84;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(num + " " + title)}">
<title>${esc(title)}</title>
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
<text x="4" y="52" fill="${col}" font-family="${MONO}" font-size="16" font-weight="700">${esc(num)}</text>
<text x="52" y="54" fill="${C.text}" font-family="${SANS}" font-size="32" font-weight="800" letter-spacing="1">${esc(title)}</text>
<text x="${52 + title.length * 20 + 26}" y="53" fill="${C.dim}" font-family="${MONO}" font-size="15">${esc(sub)}</text>
<rect x="4" y="72" width="${W - 8}" height="2" fill="url(#g)" opacity=".7"/>
<rect x="4" y="71" width="80" height="4" rx="2" fill="${col}">
  <animate attributeName="x" values="4;${W - 90};4" dur="7s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>
  <animate attributeName="opacity" values="1;.25;1" dur="7s" repeatCount="indefinite"/>
</rect>
</svg>`;
}

/* ───────────────────────── STATUS PANEL ───────────────────────── */
function status() {
  const W = 1200, H = 250;
  const rows = [
    ["FOCUS", "local-first tools & practical AI features", C.cyan],
    ["OBSESSION", "motion, accessibility & the last 10% of polish", C.pink],
    ["STACK", "TypeScript · React · React Native · Rust", C.violet],
    ["MODE", "learning by shipping, iterating, sharing", C.lime],
  ];
  const eq = (x, y, col, k) => Array.from({ length: 14 }, (_, i) => {
    const d = (0.7 + ((i * 7 + k * 3) % 9) / 10).toFixed(2);
    return `<rect x="${x + i * 9}" y="${y - 18}" width="5" height="18" rx="1.5" fill="${col}" opacity=".85"><animate attributeName="height" values="4;18;8;14;4" dur="${d}s" repeatCount="indefinite"/><animate attributeName="y" values="${y - 4};${y - 18};${y - 8};${y - 14};${y - 4}" dur="${d}s" repeatCount="indefinite"/></rect>`;
  }).join("");
  const body = rows.map(([k, v, col], i) => {
    const y = 96 + i * 38;
    return `<text x="40" y="${y}" fill="${col}" font-family="${MONO}" font-size="14" font-weight="700" letter-spacing="2">${k}</text>
    <text x="190" y="${y}" fill="${C.text}" font-family="${SANS}" font-size="19">${esc(v)}</text>
    ${eq(1020, y + 3, col, i)}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t">
<title id="t">Current status: focus on local-first tools and practical AI, obsessed with motion and polish, stack TypeScript React React Native Rust, learning by shipping.</title>
<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>
<linearGradient id="scan" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset="1" stop-color="${C.cyan}" stop-opacity=".12"/></linearGradient>
<clipPath id="c"><rect width="${W}" height="${H}" rx="20"/></clipPath></defs>
<g clip-path="url(#c)">
<rect width="${W}" height="${H}" fill="${C.panel}"/>
${Array.from({ length: 13 }, (_, i) => `<line x1="0" x2="${W}" y1="${i * 20}" y2="${i * 20}" stroke="#fff" stroke-opacity=".025"/>`).join("")}
<rect x="0" y="-60" width="${W}" height="60" fill="url(#scan)"><animate attributeName="y" values="-60;${H}" dur="4s" repeatCount="indefinite"/></rect>
<text x="40" y="46" fill="${C.dim}" font-family="${MONO}" font-size="14" letter-spacing="2">SYSTEM MONITOR — pratik.exe</text>
<circle cx="${W - 120}" cy="41" r="5" fill="${C.lime}"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="${W - 106}" y="46" fill="${C.lime}" font-family="${MONO}" font-size="14" font-weight="700">ONLINE</text>
<line x1="40" x2="${W - 40}" y1="62" y2="62" stroke="${C.line}"/>
${body}
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="url(#b)" stroke-opacity=".55" stroke-width="2"/>
</svg>`;
}

/* ───────────────────────── PROJECT CARDS ───────────────────────── */
const art = {
  arc: (c) => `
    <g transform="translate(470 150)">
      <path d="M-90 0 A90 90 0 0 1 90 0" fill="none" stroke="${c}" stroke-opacity=".22" stroke-width="10" stroke-linecap="round"/>
      <path d="M-90 0 A90 90 0 0 1 90 0" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="283"><animate attributeName="stroke-dashoffset" values="283;0;0;283" keyTimes="0;.55;.88;1" dur="4.8s" repeatCount="indefinite"/></path>
      ${[0, 1, 2, 3].map((i) => { const a = Math.PI - (i * Math.PI) / 3; const x = (Math.cos(a) * 90).toFixed(1), y = (-Math.sin(a) * 90).toFixed(1); return `<circle cx="${x}" cy="${y}" r="8" fill="#0A0F1E" stroke="${C.text}" stroke-width="2"><animate attributeName="fill" values="#0A0F1E;${c};${c};#0A0F1E" keyTimes="0;${(0.08 + i * 0.16).toFixed(2)};.88;1" dur="4.8s" repeatCount="indefinite"/></circle>`; }).join("")}
      <text y="-22" text-anchor="middle" fill="${C.text}" font-family="${SANS}" font-size="22" font-weight="800">on track</text>
      <text y="-2" text-anchor="middle" fill="${C.dim}" font-family="${MONO}" font-size="11">release health</text>
      <text y="30" text-anchor="middle" fill="${C.dim}" font-family="${MONO}" font-size="11">plan · review · ci · ship</text>
    </g>`,
  manga: (c) => `
    <g transform="translate(385 40)">
      <rect width="170" height="170" rx="10" fill="#0A0F1E" stroke="${C.text}" stroke-width="3"/>
      <path d="M0 78 L170 62 M92 70 L80 170" stroke="${C.text}" stroke-width="3" fill="none"/>
      ${[0, 1, 2, 3, 4].map((i) => `<line x1="150" y1="34" x2="14" y2="${12 + i * 12}" stroke="${c}" stroke-width="2" stroke-linecap="round"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin="${i * 0.18}s" repeatCount="indefinite"/></line>`).join("")}
      <circle cx="150" cy="34" r="9" fill="${c}"/>
      <circle cx="42" cy="124" r="22" fill="none" stroke="${C.text}" stroke-width="3"/>
      <circle cx="34" cy="120" r="3" fill="${C.text}"/><circle cx="50" cy="120" r="3" fill="${C.text}"/>
      <path d="M33 132 q9 8 18 0" fill="none" stroke="${C.text}" stroke-width="3" stroke-linecap="round"/>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="1.6s" repeatCount="indefinite"/>
        <path d="M100 96 h54 q8 0 8 8 v24 q0 8 -8 8 h-30 l-12 14 v-14 h-12 q-8 0 -8 -8 v-24 q0 -8 8 -8 Z" fill="${C.text}"/>
        <text x="127" y="124" text-anchor="middle" fill="#0A0F1E" font-family="${SANS}" font-size="20" font-weight="900">!?</text></g>
    </g>`,
  heart: (c) => `
    <g transform="translate(470 104)">
      <g><animateTransform attributeName="transform" type="scale" values="1.7;1.95;1.7;1.82;1.7" keyTimes="0;.15;.3;.45;1" dur="1.6s" repeatCount="indefinite"/>
        <path d="M0 20 C-42 -8 -24 -44 0 -22 C24 -44 42 -8 0 20 Z" fill="${c}"/></g>
      <rect x="-92" y="62" width="64" height="28" rx="14" fill="${c}"/><text x="-60" y="81" text-anchor="middle" fill="#0A0F1E" font-family="${SANS}" font-size="14" font-weight="800">Yes</text>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;34 -18;-6 -30;40 8;0 0" dur="3.6s" repeatCount="indefinite"/>
        <rect x="10" y="62" width="56" height="28" rx="14" fill="#0A0F1E" stroke="${C.text}" stroke-width="2"/><text x="38" y="81" text-anchor="middle" fill="${C.text}" font-family="${SANS}" font-size="14" font-weight="800">No</text></g>
    </g>`,
  forge: (c) => `
    <g transform="translate(470 120)" font-family="${MONO}" font-size="11" text-anchor="middle">
      <path id="tri" d="M0 -62 L58 40 L-58 40 Z" fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 6"/>
      <circle r="6" fill="${c}"><animateMotion dur="3.6s" repeatCount="indefinite" path="M0 -62 L58 40 L-58 40 Z"/></circle>
      ${[["PLAN", 0, -62], ["EXEC", 58, 40], ["VERIFY", -58, 40]].map(([t, x, y], i) => `<g><circle cx="${x}" cy="${y}" r="22" fill="#0A0F1E" stroke="${c}" stroke-width="2"><animate attributeName="stroke-width" values="2;4;2" dur="3.6s" begin="${i * 1.2}s" repeatCount="indefinite"/></circle><text x="${x}" y="${y + 4}" fill="${C.text}" font-size="${t.length > 5 ? 9 : 10}">${t}</text></g>`).join("")}
    </g>`,
  chic: (c) => `
    <g transform="translate(470 112)">
      <path d="M0 -60 q14 0 14 14 q0 10 -14 16 v8 L66 18 q8 6 0 10 H-66 q-8 -4 0 -10 L0 -22" fill="none" stroke="${C.text}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <animateTransform attributeName="transform" type="rotate" values="-4 0 -60;4 0 -60;-4 0 -60" dur="4s" repeatCount="indefinite"/></path>
      ${[0, 1, 2].map((i) => `<rect x="${-58 + i * 42}" y="44" width="32" height="32" rx="8"><animate attributeName="fill" values="${(() => { const b = [c, C.amber, C.cyan]; const r = b.slice(i).concat(b.slice(0, i)); return r.concat(r[0]).join(";"); })()}" dur="4.5s" repeatCount="indefinite"/></rect>`).join("")}
    </g>`,
  infinity: (c) => `
    <g transform="translate(470 120)">
      <path d="M0 0 C 30 -46 92 -46 92 0 C 92 46 30 46 0 0 C -30 -46 -92 -46 -92 0 C -92 46 -30 46 0 0 Z" fill="none" stroke="${c}" stroke-opacity=".3" stroke-width="10" stroke-linecap="round"/>
      <path d="M0 0 C 30 -46 92 -46 92 0 C 92 46 30 46 0 0 C -30 -46 -92 -46 -92 0 C -92 46 -30 46 0 0 Z" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-dasharray="60 420"><animate attributeName="stroke-dashoffset" values="0;-480" dur="3.4s" repeatCount="indefinite"/></path>
      ${[[-92, 0], [92, 0], [0, 0]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.text}"><animate attributeName="r" values="4;8;4" dur="2s" begin="${i * 0.6}s" repeatCount="indefinite"/></circle>`).join("")}
      <text y="74" text-anchor="middle" fill="${C.dim}" font-family="${MONO}" font-size="11">chapter ∞ of ∞</text>
    </g>`,
  fridge: (c) => `
    <g transform="translate(372 40)">
      <rect width="100" height="160" rx="12" fill="#0A0F1E" stroke="${C.text}" stroke-width="3"/>
      <line x1="0" x2="100" y1="56" y2="56" stroke="${C.text}" stroke-width="3"/>
      <rect x="82" y="20" width="5" height="22" rx="2" fill="${C.text}"/><rect x="82" y="72" width="5" height="30" rx="2" fill="${C.text}"/>
      <circle cx="28" cy="88" r="10" fill="${C.pink}"/><rect x="46" y="78" width="22" height="22" rx="4" fill="${C.amber}"/><rect x="18" y="114" width="54" height="14" rx="7" fill="${C.lime}"/>
      <rect x="4" y="60" width="92" height="3" fill="${c}" opacity=".9"><animate attributeName="y" values="60;150;60" dur="2.8s" repeatCount="indefinite"/></rect>
      <g transform="translate(116 30)" font-family="${MONO}" font-size="11">
        <rect width="92" height="56" rx="10" fill="#0A0F1E" stroke="${c}"/>
        <text x="10" y="22" fill="${c}">detected:</text><text x="10" y="40" fill="${C.text}">3 items ✓<animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite"/></text>
      </g>
    </g>`,
  expenzo: (c) => `
    <g transform="translate(395 50)">
      <line x1="0" x2="160" y1="150" y2="150" stroke="${C.line}" stroke-width="2"/>
      ${[50, 90, 64, 120, 100].map((h, i) => `<rect x="${8 + i * 30}" width="20" rx="5" fill="${i === 3 ? c : C.violet}" opacity="${i === 3 ? 1 : 0.6}"><animate attributeName="height" values="0;${h};${h};0" keyTimes="0;.3;.85;1" dur="4s" begin="${i * 0.12}s" repeatCount="indefinite"/><animate attributeName="y" values="150;${150 - h};${150 - h};150" keyTimes="0;.3;.85;1" dur="4s" begin="${i * 0.12}s" repeatCount="indefinite"/></rect>`).join("")}
      <g><circle cx="150" cy="10" r="22" fill="${C.amber}" stroke="#B45309" stroke-width="3"/><text x="150" y="18" text-anchor="middle" fill="#78350F" font-family="${SANS}" font-size="22" font-weight="900">₹</text>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0" dur="1.4s" repeatCount="indefinite"/></g>
    </g>`,
  card: (c) => `
    <g transform="translate(470 118)">
      <g><animateTransform attributeName="transform" type="scale" values="1 1;0.02 1;1 1;1 1" keyTimes="0;.15;.3;1" dur="4s" repeatCount="indefinite"/>
        <rect x="-80" y="-52" width="160" height="104" rx="14" fill="#111832" stroke="${c}" stroke-width="2"/>
        <circle cx="-46" cy="-14" r="18" fill="${c}" opacity=".85"/>
        <rect x="-18" y="-26" width="76" height="9" rx="4" fill="${C.text}"/><rect x="-18" y="-8" width="52" height="7" rx="3" fill="${C.dim}"/>
        <rect x="-64" y="22" width="36" height="12" rx="6" fill="${C.violet}"/><rect x="-22" y="22" width="36" height="12" rx="6" fill="${C.pink}"/><rect x="20" y="22" width="36" height="12" rx="6" fill="${C.cyan}"/>
      </g>
    </g>`,
};

function card({ file, title, kicker, lines, tags, status, color, motif }) {
  const W = 600, H = 250;
  const live = status === "LIVE";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)} — ${esc(kicker)}</title>
<desc id="d">${esc(lines.join(" "))} Built with ${esc(tags.join(", "))}.</desc>
<defs>
  <radialGradient id="glow" cx=".8" cy=".4" r=".6"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".1"/></linearGradient>
  <clipPath id="c"><rect width="${W}" height="${H}" rx="20"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="${C.panel}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${Array.from({ length: 8 }, (_, i) => `<circle cx="${360 + (i % 4) * 60}" cy="${30 + Math.floor(i / 4) * 190}" r="1.4" fill="${C.mute}"/>`).join("")}
  ${art[motif](color)}
  <g font-family="${SANS}">
    <rect x="28" y="26" rx="11" width="${live ? 74 : 112}" height="22" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".6"/>
    <circle cx="42" cy="37" r="4" fill="${color}">${live ? `<animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/>` : ""}</circle>
    <text x="52" y="41.5" fill="${color}" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="1.5">${status}</text>
    <text x="28" y="94" fill="${C.text}" font-size="30" font-weight="800">${esc(title)}</text>
    <text x="28" y="120" fill="${color}" font-family="${MONO}" font-size="13">${esc(kicker)}</text>
    ${lines.map((l, i) => `<text x="28" y="${152 + i * 22}" fill="${C.dim}" font-size="15">${esc(l)}</text>`).join("")}
    ${(() => { let x = 28; return tags.map((t) => { const w = t.length * 7.4 + 18; const s = `<rect x="${x}" y="206" width="${w}" height="22" rx="6" fill="#111832" stroke="${C.line}"/><text x="${x + w / 2}" y="221" text-anchor="middle" fill="${C.text}" font-family="${MONO}" font-size="11">${esc(t)}</text>`; x += w + 8; return s; }).join(""); })()}
  </g>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="url(#edge)" stroke-opacity=".7" stroke-width="2"/>
</svg>`;
}

const cards = [
  { file: "expenzo", title: "Expenzo", kicker: "personal & company finance", lines: ["INR budgets, reports and a consent-first", "Financial AI chat on Firebase."], tags: ["React Native", "Firebase", "AI"], status: "LIVE", color: C.amber, motif: "expenzo" },
  { file: "portfolio-card", title: "Portfolio Card", kicker: "a digital business card", lines: ["A flip-worthy visual portfolio", "that lives at a single link."], tags: ["HTML", "CSS", "JS", "Vercel"], status: "LIVE", color: C.cyan, motif: "card" },
  // the lab: the most recently committed repos, newest first
  { file: "releasearc", title: "ReleaseArc", kicker: "delivery intelligence", lines: ["Sprints, GitHub, review and CI/CD", "in one view of release health."], tags: ["TypeScript", "Supabase", "GitHub API"], status: "LIVE", color: C.cyan, motif: "arc" },
  { file: "mangaforge", title: "MangaForge AI", kicker: "manga & manhwa generator", lines: ["Stories, characters and panels,", "generated from a single idea."], tags: ["React", "TypeScript", "Gemini"], status: "EXPERIMENT", color: C.lime, motif: "manga" },
  { file: "forgecode", title: "ForgeCode", kicker: "local-first agentic IDE", lines: ["Plan → Execute → Verify loops in Rust,", "local LLMs, AST-guarded patching."], tags: ["Rust", "Tauri", "React", "LanceDB"], status: "EXPERIMENT", color: C.violet, motif: "forge" },
  { file: "valentine", title: "Valentine", kicker: "a proposal with a twist", lines: ["A 'No' button that runs away,", "a photo gallery and AI love notes."], tags: ["React", "Framer Motion", "Gemini"], status: "EXPERIMENT", color: C.pink, motif: "heart" },
];

/* ───────────────────────── BUTTONS ───────────────────────── */
function button({ label, sub, color, glyph }) {
  const W = 260, H = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<defs>
  <linearGradient id="e" x1="0" x2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
  <linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="c"><rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16"/></clipPath>
</defs>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="${C.panel}"/>
<g clip-path="url(#c)"><rect x="-80" y="0" width="60" height="${H}" fill="url(#s)" transform="skewX(-20)"><animate attributeName="x" values="-80;-80;${W + 60}" keyTimes="0;.55;1" dur="4s" repeatCount="indefinite"/></rect></g>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="none" stroke="url(#e)" stroke-width="2"/>
<rect x="14" y="14" width="36" height="36" rx="10" fill="${color}" fill-opacity=".16"/>
<text x="32" y="39" text-anchor="middle" fill="${color}" font-family="${SANS}" font-size="19" font-weight="800">${glyph}</text>
<text x="64" y="30" fill="${C.text}" font-family="${SANS}" font-size="16" font-weight="700">${esc(label)}</text>
<text x="64" y="48" fill="${C.dim}" font-family="${MONO}" font-size="11">${esc(sub)}</text>
<text x="${W - 26}" y="38" fill="${color}" font-family="${SANS}" font-size="18" font-weight="700">→<animate attributeName="x" values="${W - 28};${W - 22};${W - 28}" dur="1.6s" repeatCount="indefinite"/></text>
</svg>`;
}
const buttons = [
  { file: "portfolio", label: "Portfolio", sub: "portfolio-card.vercel", color: C.cyan, glyph: "◎" },
  { file: "linkedin", label: "LinkedIn", sub: "in/pratik-chittroda", color: "#38BDF8", glyph: "in" },
  { file: "instagram", label: "Instagram", sub: "@pratik.limitless", color: C.pink, glyph: "◉" },
  { file: "expenzo", label: "Open Expenzo", sub: "project1-7a465.web.app", color: C.amber, glyph: "₹" },
  { file: "source", label: "Read the source", sub: "github / Project-diploma", color: C.violet, glyph: "&lt;/&gt;" },
];

/* ───────────────────────── FOOTER ───────────────────────── */
function footer() {
  const W = 1200, H = 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Thanks for scrolling — now go build something.">
<title>Thanks for scrolling — now go build something.</title>
<defs>
  <linearGradient id="w1" x1="0" x2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>
  <clipPath id="c"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="#05070F"/>
  ${stars(40, W, H, 120)}
  ${[0, 1, 2].map((i) => `<path fill="url(#w1)" opacity="${0.18 + i * 0.14}" d="M0 ${150 + i * 12} Q 150 ${120 + i * 12} 300 ${150 + i * 12} T 600 ${150 + i * 12} T 900 ${150 + i * 12} T 1200 ${150 + i * 12} T 1500 ${150 + i * 12} V 220 H 0 Z"><animateTransform attributeName="transform" type="translate" values="0 0;-600 0" dur="${8 + i * 3}s" repeatCount="indefinite"/></path>`).join("")}
  <text x="${W / 2}" y="76" text-anchor="middle" fill="${C.text}" font-family="${SANS}" font-size="28" font-weight="800">thanks for scrolling — now go build something.</text>
  <text x="${W / 2}" y="106" text-anchor="middle" fill="${C.dim}" font-family="${MONO}" font-size="14">[ process exited with code 0 · see you in the next commit ]</text>
</g>
</svg>`;
}

/* ───────────────────────── WRITE ───────────────────────── */
out("hero.svg", hero());
out("status.svg", status());
out("footer.svg", footer());
[
  ["01", "whoami", "// the human behind the commits", C.cyan],
  ["02", "launch bay", "// shipped & live", C.amber],
  ["03", "the lab", "// experiments in progress", C.violet],
  ["04", "toolbelt", "// what i reach for", C.pink],
  ["05", "telemetry", "// proof of life", C.lime],
  ["06", "open a channel", "// say hi", C.cyan],
].forEach(([n, t, s, c]) => out(`headers/${t.replace(/\s+/g, "-")}.svg`, header(n, t, s, c)));
cards.forEach((c) => out(`cards/${c.file}.svg`, card(c)));
buttons.forEach((b) => out(`buttons/${b.file}.svg`, button(b)));
console.log("assets built");
