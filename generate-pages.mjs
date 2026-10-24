import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const games = JSON.parse(readFileSync(join(root, "games.json"), "utf8"));
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

for (const game of games) {
  const gameDir = join(root, "items", game.slug);
  mkdirSync(gameDir, {recursive:true});
  const description = `${game.title} unblocked in the StaticQuasar931 game hub. Play on Chromebook or another modern browser at school, work, or home, where your network allows.`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(game.title)} Unblocked | StaticQuasar931 Games</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#090a10">
  <link rel="canonical" href="">
  <meta property="og:title" content="${escapeHtml(game.title)} Unblocked | StaticQuasar931 Games">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(game.title)} Unblocked | StaticQuasar931 Games">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
  <link rel="icon" href="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
  <!-- Google tag (gtag.js) - StaticQuasar931 property G-ETC235N10B -->
  <template id="analytics-template">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ETC235N10B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ETC235N10B');
    </script>
  </template>
  <script defer src="../../game-loader.js"></script>
</head>
<body data-title="${escapeHtml(game.title)}" data-description="${escapeHtml(description)}" data-source="${escapeHtml(game.source)}" data-asset-base="${escapeHtml(game.assetBase)}"${game.mainScript ? ` data-main-script="${escapeHtml(game.mainScript)}"` : ""}>
  <main style="min-height:100vh;display:grid;place-items:center;background:#090a10;color:#f5f3f5;font:14px Arial,sans-serif">Loading ${escapeHtml(game.title)}…</main>
</body>
</html>
`;
  writeFileSync(join(gameDir, "index.html"), html, "utf8");

  const safeTitle = escapeHtml(game.title).replace(/&amp;/g, "&amp;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title><desc id="desc">Original dark arcade illustration for ${safeTitle}</desc>
  <defs><linearGradient id="bg" x2=".92" y2="1"><stop stop-color="#20202d"/><stop offset="1" stop-color="#0b0c12"/></linearGradient><radialGradient id="glow"><stop stop-color="${game.color}" stop-opacity=".48"/><stop offset="1" stop-color="${game.color}" stop-opacity="0"/></radialGradient><linearGradient id="mask" x2=".8" y2="1"><stop stop-color="#9a8275"/><stop offset=".5" stop-color="#574b4c"/><stop offset="1" stop-color="#27232b"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="28"/></filter></defs>
  <rect width="640" height="360" fill="url(#bg)"/><ellipse cx="315" cy="150" rx="225" ry="170" fill="url(#glow)" filter="url(#blur)"/>
  <path d="M0 296h640v64H0z" fill="#08090e"/><path d="M40 298h560M78 320h484" stroke="#fff" stroke-opacity=".06"/>
  <circle cx="320" cy="168" r="116" fill="none" stroke="#fff" stroke-opacity=".08"/><circle cx="320" cy="168" r="90" fill="none" stroke="${game.color}" stroke-opacity=".2"/>
  <path d="M244 79 258 36l43 35M396 79l-14-43-43 35" fill="url(#mask)" stroke="#c5a999" stroke-opacity=".3" stroke-width="4"/>
  <path d="M242 116q8-53 78-53t78 53v82q-6 67-78 77-72-10-78-77z" fill="url(#mask)" stroke="#d1b8a5" stroke-opacity=".28" stroke-width="4"/>
  <ellipse cx="285" cy="148" rx="18" ry="23" fill="#100f14"/><ellipse cx="355" cy="148" rx="18" ry="23" fill="#100f14"/><circle cx="285" cy="150" r="7" fill="${game.color}"/><circle cx="355" cy="150" r="7" fill="${game.color}"/>
  <path d="M299 187q21-17 42 0l-6 18h-30z" fill="#17141a"/><path d="M285 212q35 19 70 0" fill="none" stroke="#17141a" stroke-width="7" stroke-linecap="round"/>
  <text x="28" y="34" fill="#dedbe2" font-family="monospace" font-size="12" letter-spacing="3">CAM 0${String(Math.round(game.order)%10)} / NIGHT WATCH</text>
  <text x="30" y="330" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="20">${safeTitle.length>28?safeTitle.slice(0,27)+"…":safeTitle}</text>
  <text x="610" y="331" fill="${game.color}" text-anchor="end" font-family="monospace" font-size="12">SQ931</text>
  <path d="M0 80h640M0 81h640M0 250h640" stroke="#fff" stroke-opacity=".025"/>
</svg>`;
  const cover = join(root,"covers",`${game.slug}.svg`);
  mkdirSync(dirname(cover), {recursive:true});
  writeFileSync(cover, svg, "utf8");
}
console.log(`Generated ${games.length} game pages and cover illustrations.`);
