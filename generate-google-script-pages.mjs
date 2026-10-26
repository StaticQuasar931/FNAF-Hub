import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const games = JSON.parse(readFileSync(join(root, "games.json"), "utf8"));

// Ordered by broad audience recognition, then by related versions and fan games.
// Winston's is held out because its source states a no-derivatives license.
const order = [
  "fnaf-1", "fnaf-2", "fnaf-4", "fnaf-3", "sister-location",
  "ultimate-custom-night", "pizzeria-simulator", "five-nights-at-candys-1",
  "fnaf-world", "fnaf-4-halloween", "five-nights-at-candys-2",
  "fnaf-3-remastered", "fnaf-shooter", "five-nights-at-baldis-redone",
  "five-nights-at-yoshis", "frickbears-3"
];

const heldOut = new Set(["five-nights-at-winstons"]);
const outputRoot = join(root, "GoogleScriptPages");
const jsZipCdn = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
const icon = "https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png";

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function toJsDelivr(url) {
  return url.replace(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/,
    "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4");
}

function assetBaseFor(game, sourceUrl) {
  const genizy = game.assetBase.match(/^https:\/\/cdn\.jsdelivr\.net\/gh\/genizy\/fnaf@([^/]+)\/(.+)\/$/i);
  if (genizy) return `https://cdn.jsdelivr.net/gh/StaticQuasar931/FNAF-Hub@main/cdn/genizy-fnaf/${genizy[2]}/`;
  return game.assetBase.endsWith("/") ? game.assetBase : `${game.assetBase}/`;
}

function upstreamAssetBaseFor(game, resolvedAssetBase) {
  const genizy = game.assetBase.match(/^https:\/\/cdn\.jsdelivr\.net\/gh\/genizy\/fnaf@([^/]+)\/(.+)\/$/i);
  if (genizy) return `https://raw.githubusercontent.com/genizy/fnaf/${genizy[1] === "latest" ? "main" : genizy[1]}/${genizy[2]}/`;
  return resolvedAssetBase;
}

function metadata(game) {
  const title = `${game.title} Unblocked | StaticQuasar931 Games`;
  const description = `Play ${game.title} unblocked, school friendly, and working at school on StaticQuasar931 Games. Runs on Chromebook, PC, and mobile browsers at school, work, and home, where your network allows.`;
  return `<title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#000000">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${icon}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${icon}">
  <link rel="icon" href="${icon}" type="image/png">`;
}

const analytics = `<!-- Google Analytics (Google Sites compatible VSNL 1.21) -->
<script>
  (function loadGAForGoogleSites(w, d, id){
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function(){ w.dataLayer.push(arguments); };

    w.gtag('js', new Date());

    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);

    var first = d.getElementsByTagName('script')[0];
    (first && first.parentNode ? first.parentNode : d.head || d.documentElement).insertBefore(s, first || null);

    w.gtag('config', id, {
      cookie_domain: (w.location && w.location.hostname) ? w.location.hostname : 'auto',
      cookie_flags: 'SameSite=None;Secure',
      send_page_view: true
    });
  })(window, document, 'G-5JZHSM4RCW');
</script>`;

const visualStyles = `<style>
  :root{--brand:#5ee1ff;--glow:0 0 12px rgba(94,225,255,.65),0 0 32px rgba(155,255,183,.35);--shadow:0 10px 30px rgba(0,0,0,.4)}
  html,body{width:100%;height:100%;margin:0!important;padding:0;overflow:hidden;background:#000;color:#eaf4ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
  canvas{display:block;max-width:100vw!important;max-height:100vh!important}
  #staticMenu{position:fixed;left:12px;top:12px;z-index:2147483000;display:flex;gap:10px;align-items:center;user-select:none;padding:10px 14px;border-radius:12px;background:linear-gradient(135deg,rgba(20,20,28,.9),rgba(20,20,28,.6));border:1px solid rgba(94,225,255,.35);color:#e8f3ff;box-shadow:var(--glow),var(--shadow);font-size:14px;animation:menuEnter .6s ease .15s both}
  #staticMenu a{color:#5ee1ff;font-weight:800;text-decoration:none}
  #closeStaticMenu{color:#f55;cursor:pointer;padding:2px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06)}
  @keyframes menuEnter{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  #staticSlideMenu{position:fixed;bottom:24px;right:24px;z-index:2147483000;width:100px;height:100px;pointer-events:none;opacity:0;transform:translateX(140px) scale(.96)}
  #staticSlideMenu a{display:block;width:100%;height:100%}
  #staticSlideMenu img{width:100%;height:100%;object-fit:contain;border:0;border-radius:0;background:transparent;box-shadow:none;transition:opacity .25s ease}
  .slide-in{animation:slideIn 2s ease forwards}.slide-out{animation:slideOut 2s ease forwards}
  @keyframes slideIn{from{opacity:0;transform:translateX(140px) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}
  @keyframes slideOut{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:0;transform:translateX(140px) scale(.96)}}
  .seo-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap}
  #sq-loader{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147482000;padding:9px 13px;border:1px solid #454852;border-radius:4px;background:#17191feb;color:#fff;font-size:12px;box-shadow:0 6px 20px #0008;pointer-events:none}
  #sq-game-error{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483500;max-width:min(520px,calc(100vw - 24px));padding:12px 15px;border:1px solid #a84543;border-radius:4px;background:#21181a;color:#fff;font-size:13px}
  #unity-container{width:100vw!important;height:100vh!important;max-width:100vw!important;max-height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;background:#10100f!important}
  #unity-canvas{display:block;max-width:100vw!important;max-height:100vh!important}
  #loading-cover,#unity-logo,#unity-loading-bar,#unity-fullscreen-button{display:none!important}
  @media(max-width:600px){#staticMenu{font-size:13px;padding:8px 12px}#staticSlideMenu{width:88px;height:88px}}
  @media(prefers-reduced-motion:reduce){.slide-in,.slide-out{animation-duration:.01ms!important}}
</style>`;

const visualMarkup = `<nav id="staticMenu" aria-label="StaticQuasar931 menu">
  <a href="https://sites.google.com/view/staticquasar931/gm3z" target="_blank" rel="noopener">More Unblocked Games by Static</a>
  <span id="closeStaticMenu" title="Hide temporarily">✕</span>
</nav>
<div id="staticSlideMenu" aria-live="polite">
  <a id="staticSlideLink" href="https://sites.google.com/view/staticquasar931/google-form" target="_blank" rel="noopener" aria-label="Open StaticQuasar931 feedback form">
    <img id="staticSlideImg" src="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/GoogleForm.png" alt="StaticQuasar931 Google Form for feedback and requests">
  </a>
</div>`;

const visualScript = `
console.log("StaticQuasar931 Game - https://sites.google.com/view/staticquasar931/gm3z");
window.onbeforeunload = () => "Are you sure you want to leave? Your session may be interrupted.";
(function(){
  var menu=document.getElementById("staticMenu"),close=document.getElementById("closeStaticMenu"),key="sq931_staticMenu_hidden_until";
  function show(){if(menu)menu.style.display="flex";}
  function hideForThreeMinutes(){if(!menu)return;menu.style.display="none";var until=Date.now()+180000;try{localStorage.setItem(key,String(until));}catch(e){}setTimeout(show,180000);}
  var until=0;try{until=parseInt(localStorage.getItem(key)||"0",10)||0;}catch(e){}
  if(until>Date.now()){if(menu)menu.style.display="none";setTimeout(show,until-Date.now());}else show();
  if(close)close.onclick=hideForThreeMinutes;
})();
(function(){
  var wrap=document.getElementById("staticSlideMenu"),link=document.getElementById("staticSlideLink"),img=document.getElementById("staticSlideImg");
  var FORM={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/GoogleForm.png",alt:"StaticQuasar931 Google Form for feedback and requests",link:"https://sites.google.com/view/staticquasar931/google-form"};
  var DISCORD={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Join_Our_DC_StaticQuassar931_lcplrf.png",alt:"Join the StaticQuasar931 Discord",link:"https://discord.gg/DP2hM7RRhR"};
  var INSTA={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Follow-us--IG",alt:"StaticQuasar931 Instagram",link:"https://www.instagram.com/freeschoolgamepage/"};
  var rotation=[FORM,DISCORD,INSTA],index=0;
  function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
  function apply(item){link.href=item.link;img.alt=item.alt;img.style.opacity="0";setTimeout(function(){img.src=item.src;},80);img.onload=function(){img.style.opacity="1";};}
  (async function cycle(){for(;;){apply(rotation[index]);wrap.style.pointerEvents="auto";wrap.classList.remove("slide-out");wrap.classList.add("slide-in");await delay(7000);wrap.classList.remove("slide-in");wrap.classList.add("slide-out");await delay(2000);wrap.style.pointerEvents="none";await delay(20000);index=(index+1)%rotation.length;}})();
})();
(function(){
  var ids=["staticMenu","staticSlideMenu"],sequence=[];
  window.addEventListener("keydown",function(event){
    if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement&&document.activeElement.tagName||""))return;
    sequence.push(String(event.key||"").toLowerCase());if(sequence.length>3)sequence.shift();
    if(sequence.join("")==="yui")ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;var hidden=el.style.display==="none"||getComputedStyle(el).display==="none";el.style.display=hidden?(id==="staticMenu"?"flex":"block"):"none";});
  });
})();`;

function cleanAnalytics(html) {
  return html
    .replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:googletagmanager|google-analytics|analytics\.js|adsbygoogle|googlesyndication)[^"']*["'][^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?\b(?:gtag\s*\(|GoogleAnalyticsObject|ga\s*\(\s*["']create)[\s\S]*?<\/script\s*>/gi, "");
}

function cleanPage(game, original, sourceUrl, assetBase) {
  let html = original.replace(/^\uFEFF/, "");
  html = cleanAnalytics(html);
  html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:googlesyndication|doubleclick|adsbygoogle)[^"']*["'][^>]*>[\s\S]*?<\/script\s*>/gi, "");
  html = html.replace(/<script\b[^>]*>[\s\S]*?\b(?:adsbygoogle|adBreak|adConfig)\b[\s\S]*?<\/script\s*>/gi, "");
  html = html.replace(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi, "");
  html = html.replace(/<meta\b[^>]*\bcharset\s*=\s*["']?[^\s"'>]+[^>]*>/gi, "");
  html = html.replace(/<meta\b[^>]*\bhttp-equiv\s*=\s*["']Content-Type["'][^>]*>/gi, "");
  html = html.replace(/<link\b[^>]*\brel\s*=\s*["'](?:shortcut\s+icon|icon)["'][^>]*>/gi, "");
  html = html.replace(/<base\b[^>]*>/gi, "");
  html = html.replace(/<meta\b[^>]*(?:name|property)\s*=\s*["'](?:description|theme-color|viewport|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, "");
  html = html.replace(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/gi, "");
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, "");
  html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js["'][^>]*>\s*<\/script\s*>/gi, `<script src="${jsZipCdn}"><\/script>`);
  html = html.replace(/https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/([^\s"'<>)]*)/g,
    "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4");

  // Older port pages use root-relative engine assets. Resolve these against the game directory.
  const base = assetBase;
  html = html.replace(/\b(src|href)\s*=\s*(["'])\/(?!\/)([^"']*)\2/gi, (_match, attr, quote, path) => `${attr}=${quote}${base}${path}${quote}`);
  html = html.replace(/url\(\s*(["']?)\/(?!\/)/gi, (_match, quote) => `url(${quote}${base}`);

  if (game.slug === "frickbears-3") {
    html = html.replace(/<div\b[^>]*\bid\s*=\s*["']wallpaper-container["'][^>]*>[\s\S]*?<\/div\s*>/gi, "");
    html = html.replace(/<iframe\b[^>]*\bid\s*=\s*["']wallpaper-config-iframe["'][^>]*>[\s\S]*?<\/iframe\s*>/gi, "");
    html = html.replace(/<img\b[^>]*\b(?:id\s*=\s*["']QR(?:2)?Code["']|src\s*=\s*["']runner(?:Local)?\.svg["'])[^>]*>/gi, "");
  }

  if (game.slug === "five-nights-at-yoshis") {
    html = html.replace(/src\s*=\s*(["'])src\/Runtime\.js\1/i, 'src="src/Runtim.js"');
  }

  if (game.slug === "fnaf-shooter") {
    html = html.replace(/<link\b[^>]*TemplateData\/style\.css[^>]*>/gi, "");
    html = html.replace(/<div\b[^>]*id\s*=\s*["']unity-logo["'][^>]*>[\s\S]*?<\/div\s*>/gi, "");
    html = html.replace(/canvas\.style\.background\s*=\s*[^;]+;/, "canvas.style.background = '#10100f';");
    html = html.replace(/companyName\s*:\s*["'][^"']*["']\s*,/i, 'companyName: "StaticQuasar931",');
    html = html.replace(/productName\s*:\s*["'][^"']*["']\s*,/i, 'productName: "FNaF Shooter",');
    html = html.replace(/loadingCover\.style\.display\s*=\s*["'][^"']*["']\s*;/g, "loadingCover.style.display = 'none';");
    html = html.replace(/const spinner = document\.querySelector\("\.spinner"\);/,
      'const spinner = document.querySelector(".spinner");\n  const sqLoader = document.querySelector("#sq-loader");\n  const sqStatus = sqLoader && sqLoader.querySelector("span");\n  window.__sqGameError = function(message){ console.error(message); if(sqLoader){sqLoader.textContent="Game could not start: "+String(message); sqLoader.style.pointerEvents="auto";} };');
    html = html.replace(/const responses = await Promise\.all\(urls\.map\(url => fetch\(url\)\.then\(res => res\.arrayBuffer\(\)\)\)\);/,
      'const responses = await Promise.all(urls.map((url,index) => { if(sqStatus)sqStatus.textContent="Downloading game data · "+(index+1)+" of "+urls.length; return fetch(url).then(res=>{if(!res.ok)throw new Error("HTTP "+res.status);return res.arrayBuffer();}); }));');
    html = html.replace(/alert\(/g, "window.__sqGameError(");
    html = html.replace(/\/\/ Aşağıda Blob ile ayarlanacak|\/\/ Başlat/g, "");
    html = html.replace(/createUnityInstance\(canvas, config, \(progress\) => \{/,
      'createUnityInstance(canvas, config, (progress) => { if(sqStatus)sqStatus.textContent="Starting game · "+Math.round(progress*100)+"%";');
    html = html.replace(/\.then\(\(unityInstance\) => \{\s*loadingCover\.style\.display\s*=\s*["'][^"']*["'];/,
      '.then((unityInstance) => { if(sqLoader)sqLoader.remove(); loadingCover.style.display = "none";');
    html = html.replace(/\.catch\(\(message\) => \{\s*window\.__sqGameError\(message\);\s*\}\);/,
      '.catch((message) => { window.__sqGameError(message); });');
    html = html.replace(/<\/body\s*>/i, '<div id="sq-loader"><span>Preparing FNaF Shooter…</span></div>\n</body>');
    html = html.replace(/<div id="sq-loader"><span>Preparing FNaF Shooter…<\/span><\/div>\s*<\/body>/i, "</body>");
    html = html.replace(/<script>\s*const hideFullScreenButton/, '<div id="sq-loader"><span>Preparing FNaF Shooter…</span></div>\n<script>\n  const hideFullScreenButton');
    html = html.replace(/<\/head\s*>/i, '<style>html,body{width:100%;height:100%;overflow:hidden!important;background:#10100f!important}</style></head>');
  }

  // Source HTML comments include host-injection and deployment notes, not game behavior.
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  const headMeta = `<base href="${esc(base)}" target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${metadata(game)}
  ${analytics}`;
  html = html.replace(/<head\b([^>]*)>/i, `<head$1>\n${headMeta}\n${visualStyles}`);
  if (["fnaf-4", "fnaf-4-halloween"].includes(game.slug)) {
    html = html.replace(/<\/head\s*>/i, '<style id="sq-game-layout">.MMFDiv{position:fixed!important;inset:0!important;left:0!important;top:0!important;width:100vw!important;height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;transform:none!important}.MMFDiv #MMFCanvas{position:relative!important;left:auto!important;top:auto!important;transform:none!important;margin:0!important}</style></head>');
  }
  const menu = `${visualMarkup}\n`;
  if (/<body\b[^>]*>/i.test(html)) html = html.replace(/<body\b([^>]*)>/i, `<body$1>\n${menu}`);
  else html = html.replace(/<\/head\s*>/i, `</head><body>\n${menu}`);
  html = html.replace(/<\/body\s*>/i, `<script>${visualScript}<\/script>\n</body>`);
  const seoBlock = `<section class="seo-hidden" aria-hidden="true"><h1>${esc(game.title)} unblocked</h1><p>${esc(game.title)} unblocked, ${esc(game.title)} school, ${esc(game.title)} working at school, school-friendly browser game, play at school, Chromebook games, PC games, mobile browser games, static, staticquasar, staticquasar931, static 931, 931, staticq, staticq931. Play at school, work, or home where your network allows. <a href="https://sites.google.com/view/staticquasar931/gm3z">StaticQuasar931 Games</a> <a href="https://sites.google.com/view/staticquasar931/google-form">Feedback</a> <a href="https://www.instagram.com/freeschoolgamepage/">Instagram</a></p></section>`;
  html = html.replace(/<\/body\s*>/i, `${seoBlock}\n</body>`);
  if (!/<\/html\s*>/i.test(html)) html += "\n</body></html>";
  return html;
}

async function getText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function main() {
  mkdirSync(outputRoot, { recursive: true });
  const bySlug = new Map(games.map(game => [game.slug, game]));
  for (const slug of order) {
    const game = bySlug.get(slug);
    if (!game) throw new Error(`Missing catalog entry: ${slug}`);
    let sourceUrl = toJsDelivr(game.source);
    const assetBase = assetBaseFor(game, sourceUrl);
    let html = await getText(sourceUrl);
    const fnafSharedMain = new Set(["fnaf-1","fnaf-2","fnaf-3","fnaf-4","fnaf-4-halloween","sister-location","pizzeria-simulator","ultimate-custom-night"]);
    if (fnafSharedMain.has(game.slug)) {
      const reviewedScriptUrl = game.mainScript ? toJsDelivr(game.mainScript) : `${upstreamAssetBaseFor(game, assetBase)}main.js`;
      let script = await getText(reviewedScriptUrl);
      const suspiciousStart = script.indexOf("(function(_0x4ae416,_0x41a5b7){");
      if (suspiciousStart >= 0) {
        const gameplayStart = script.indexOf("function getParts(file, start, end) {", suspiciousStart);
        if (gameplayStart <= suspiciousStart) {
          throw new Error(`The known redirect boundary changed for ${game.slug} (start ${suspiciousStart}, gameplay ${gameplayStart}); refusing to embed it.`);
        }
        const loaderStart = script.indexOf("async function wedone()", suspiciousStart);
        const mergerStart = script.indexOf("function mergeFiles", suspiciousStart);
        const requiredStart = loaderStart > suspiciousStart && loaderStart < gameplayStart
          ? loaderStart
          : mergerStart;
        const requiredLoader = requiredStart > suspiciousStart && requiredStart < gameplayStart
          ? script.slice(requiredStart, gameplayStart)
          : "";
        script = script.slice(0, suspiciousStart) + requiredLoader + script.slice(gameplayStart);
        const partFetchFix = `(function(){var prior=window.fetch;window.fetch=function(input,init){if(typeof input==="string"&&/^resources\\.zip\\.part\\d+$/.test(input)){input=new URL(input,${JSON.stringify(assetBase)}).href;}return prior.call(this,input,init);};})();\n`;
        script = partFetchFix + script;
        if (/<\/script/i.test(script)) throw new Error(`The ${game.slug} script cannot be safely embedded inline.`);
        const inert = `<script type="application/x-staticquasar-game" id="sq-reviewed-game-script">${Buffer.from(script, "utf8").toString("base64")}<\/script>`;
        const loader = `<script>(function(){var node=document.getElementById("sq-reviewed-game-script");if(!node)return;var raw=atob(node.textContent.trim());var bytes=Uint8Array.from(raw,function(c){return c.charCodeAt(0);});var code=new TextDecoder().decode(bytes);var script=document.createElement("script");script.textContent=code;document.body.appendChild(script);})();<\/script>`;
        const tag = /<script\b[^>]*\bsrc\s*=\s*["']main\.js["'][^>]*>\s*<\/script\s*>/i;
        if (!tag.test(html)) throw new Error(`Could not find the expected game script tag for ${game.title}.`);
        html = html.replace(tag, `${inert}${loader}`);
      }
    }

    const finalHtml = cleanPage(game, html, sourceUrl, assetBase);
    const prefix = String(order.indexOf(slug) + 1).padStart(2, "0");
    const dir = join(outputRoot, `${prefix}-${slug}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), finalHtml, "utf8");
    const gs = `function doGet() {\n  return HtmlService.createHtmlOutputFromFile("index")\n    .setTitle(${JSON.stringify(`${game.title} | StaticQuasar931 Games`)});\n}\n`;
    writeFileSync(join(dir, "Code.gs"), gs, "utf8");
  }

  const list = order.map((slug, index) => `${String(index + 1).padStart(2, "0")}. ${bySlug.get(slug).title}`).join("\n");
  const readme = `# Google Apps Script game pages\n\nEach numbered folder is a separate Apps Script project export with an index.html file and a minimal Code.gs web-app entry point. The folder order is a practical popularity/recognition estimate, not measured traffic.\n\n## Included games\n\n${list}\n\n## Held out pending license decision\n\nFive Nights at Winston's is not generated yet. Its source HTML states CC BY-NC-ND 4.0, which prohibits distributing adapted versions without permission and requires attribution. The source page would need a separate handling decision.\n\n## Notes\n\n- Game files and runtime assets load from their configured CDN URLs, using jsDelivr or raw GitHub where required. The pages do not embed the game in an extra iframe.\n- Google Apps Script HTML Service itself runs HTML output in its required sandbox iframe.\n- The supplied Google Analytics snippet uses G-5JZHSM4RCW.\n- The pages follow the supplied StaticQuasar931 SEO metadata and hidden SEO format.\n- The Static Menu follows the supplied standard appearance and has no game hub link.\n- A canonical URL is omitted because each Apps Script deployment URL does not exist until you publish that project.\n- The pages retain required game scripts and loading behavior. They remove source analytics, ad scripts, source page metadata, and source HTML comments.\n- The pages are not pushed.\n\nTo publish a folder, create a separate Apps Script project, add its Code.gs and HTML file named index, paste the matching files, then deploy it as a web app.\n`;
  writeFileSync(join(outputRoot, "README.md"), readme, "utf8");
  console.log(`Generated ${order.length} separate Apps Script game pages in ${outputRoot}.`);
  console.log(`Held out ${heldOut.size} page pending a license decision.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
