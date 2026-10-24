import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
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
  <title>${escapeHtml(game.title)} | FNAF Night Shift</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#090a10">
  <link rel="canonical" href="">
  <meta property="og:title" content="${escapeHtml(game.title)} | FNAF Night Shift">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="../../images/pizzeria-stage.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(game.title)} | FNAF Night Shift">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="../../images/pizzeria-stage.jpg">
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
  <style>.game-boot{min-height:100vh;display:grid;place-items:center;background:#10100f url('../../images/pizzeria.jpg') center/cover;color:#f4f1e8;font:600 14px Inter,Arial,sans-serif}.game-boot span{padding:13px 17px;border:1px solid #504b40;border-radius:3px;background:#10100fe8;letter-spacing:.05em}</style>
</head>
<body data-title="${escapeHtml(game.title)}" data-description="${escapeHtml(description)}" data-source="${escapeHtml(game.source)}" data-asset-base="${escapeHtml(game.assetBase)}"${game.mainScript ? ` data-main-script="${escapeHtml(game.mainScript)}"` : ""}>
  <main class="game-boot"><span>Loading ${escapeHtml(game.title)}…</span></main>
</body>
</html>
`;
  writeFileSync(join(gameDir, "index.html"), html, "utf8");

}
console.log(`Generated ${games.length} game pages.`);
