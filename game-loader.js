(() => {
  const page = document.body;
  const title = page.dataset.title || "Five Nights at Freddy's";
  const description = page.dataset.description || `${title} browser game in the StaticQuasar931 collection.`;
  const sourceUrl = page.dataset.source;
  const assetBase = page.dataset.assetBase;
  const mainScript = page.dataset.mainScript;
  const backPath = location.origin + location.pathname.split("/items/")[0] + "/";
  const analytics = document.querySelector("#analytics-template")?.innerHTML || "";
  const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const meta = `<title>${escape(title)} | StaticQuasar931</title><meta name="description" content="${escape(description)}"><meta name="robots" content="index,follow"><meta name="theme-color" content="#10100f"><link rel="canonical" href="${escape(location.origin + location.pathname)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:image" content="${escape(location.origin + location.pathname.split("/items/")[0] + "/images/pizzeria-stage.jpg")}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(location.origin + location.pathname.split("/items/")[0] + "/images/pizzeria-stage.jpg")}">`;
  const style = `<style>
    *{box-sizing:border-box}html,body{width:100%;height:100%;margin:0!important;overflow:hidden!important;background:#10100f!important;color:#f4f1e8;font-family:Inter,Arial,sans-serif}
    #unity-container{width:100vw!important;height:100vh!important;max-width:100vw!important;max-height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;background:#10100f!important}
    #unity-canvas,#MMFCanvas{display:block;max-width:100vw!important;max-height:100vh!important}
    #loading-cover,#unity-logo,#unity-loading-bar{display:none!important}
    #sq-controls{position:fixed;z-index:2147483000;left:12px;top:12px;display:flex;align-items:center;gap:7px;padding:6px;background:#141411ed;border:1px solid #49483f;border-radius:4px;box-shadow:0 5px 20px #0008;font:12px Inter,Arial,sans-serif}
    #sq-controls a,#sq-controls button{padding:8px 11px;border:0;border-radius:2px;background:transparent;color:#f4f1e8;text-decoration:none;font:600 12px Inter,Arial,sans-serif;cursor:pointer}
    #sq-controls a{background:#b93d38}#sq-controls a:hover{background:#d34e47}#sq-controls button:hover{background:#292923}
    #sq-menu-panel{position:absolute;left:0;top:calc(100% + 6px);min-width:180px;padding:5px;background:#191916;border:1px solid #49483f;border-radius:3px;box-shadow:0 10px 24px #0009}
    #sq-menu-panel a,#sq-menu-panel button{display:block;width:100%;text-align:left;background:transparent}
    #sq-loader{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147482000;display:grid;place-items:center;color:#f4f1e8;font:600 11px Inter,Arial,sans-serif;letter-spacing:.03em;pointer-events:none}
    #sq-loader span{display:block;padding:9px 13px;border:1px solid #49483f;border-radius:3px;background:#14151aeb;box-shadow:0 5px 18px #0007}
    #sq-game-title{position:fixed;z-index:2147481999;top:12.5%;left:50%;transform:translateX(-50%);width:min(600px,54vw);height:11vh;display:grid;place-items:center;background:#19051f;color:#f4f1e8;font:700 clamp(24px,4vw,44px) 'Barlow Condensed',Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase;pointer-events:none}
    #sq-error{position:fixed;inset:0;z-index:2147483500;display:grid;place-items:center;background:#10100ff2;padding:20px}
    #sq-error section{max-width:480px;padding:24px;border:1px solid #504b40;border-radius:4px;background:#191916}
    #sq-error h1{font:600 32px 'Barlow Condensed',Impact,sans-serif;margin:0 0 10px}#sq-error p{color:#c1beb4;font-size:13px;line-height:1.6}
    #sq-error button{padding:9px 12px;border:0;border-radius:2px;background:#b93d38;color:#fff;cursor:pointer}
    @media(max-width:600px){#sq-controls{left:7px;top:7px;gap:3px;padding:4px}#sq-controls a,#sq-controls button{padding:8px 9px;font-size:11px}#sq-game-title{width:72vw;height:9vh;top:13%;font-size:26px}}
  </style>`;
  const isShooter = sourceUrl?.includes("googleuserclassroomcontent/wassat");
  const controls = `<nav id="sq-controls" aria-label="Game controls"><a href="${backPath}">← Hub</a><button id="sq-menu-toggle" type="button" aria-expanded="false">Menu</button><div id="sq-menu-panel" hidden><a href="https://sites.google.com/view/staticquasar931/gm3z" target="_blank" rel="noopener">More by StaticQuasar931 ↗</a><button id="sq-hide-controls" type="button">Hide controls</button></div></nav>${isShooter ? '<div id="sq-game-title" aria-label="FNaF Shooter">FNaF Shooter</div>' : ""}`;

  function showFailure(error) {
    document.body.innerHTML = `<main id="sq-error"><section><h1>${escape(title)} could not start</h1><p>${escape(error.message || "The game could not be loaded.")}</p><button onclick="location.reload()">Try again</button> <a style="margin-left:12px" href="${backPath}">Back to collection</a></section></main>`;
  }

  async function launch() {
    if (!sourceUrl) throw new Error("This game page has no source address.");
    const response = await fetch(sourceUrl, {mode:"cors", cache:"no-cache"});
    if (!response.ok) throw new Error(`The game page returned HTTP ${response.status}.`);
    let html = await response.text();
    if (!/<html[\s>]/i.test(html)) throw new Error("The source did not return a game page.");
    if (assetBase) {
      const base = `<base href="${escape(assetBase)}">`;
      html = /<base\b[^>]*>/i.test(html) ? html.replace(/<base\b[^>]*>/i, base) : html.replace(/<head([^>]*)>/i, `<head$1>${base}`);
    }

    if (mainScript) {
      const scriptResponse = await fetch(mainScript, {mode:"cors", cache:"no-cache"});
      if (!scriptResponse.ok) throw new Error(`Reviewed game script returned HTTP ${scriptResponse.status}.`);
      let script = await scriptResponse.text();
      const start = script.indexOf("(function(_0x4ae416,_0x41a5b7){");
      const end = script.indexOf("function getParts(file, start, end) {");
      if (start < 0 || end <= start) throw new Error("The reviewed FNAF 1 script changed. It was not run.");
      script = script.slice(0, start) + script.slice(end);
      const safeUrl = URL.createObjectURL(new Blob([script], {type:"text/javascript"}));
      const mainTag = /<script\b[^>]*\bsrc\s*=\s*(["'])main\.js\1[^>]*>\s*<\/script>/i;
      if (!mainTag.test(html)) { URL.revokeObjectURL(safeUrl); throw new Error("Could not find the expected FNAF 1 script tag."); }
      html = html.replace(mainTag, `<script src="${safeUrl}"><\/script>`);
    }

    html = html.replace(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi, "");
    html = html.replace(/<link\b[^>]*\brel\s*=\s*["'](?:shortcut\s+icon|icon)["'][^>]*>/gi, "");
    html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:googletagmanager|google-analytics|analytics\.js|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gi, "");
    html = html.replace(/<script\b[^>]*>[\s\S]*?\b(?:gtag\s*\(|GoogleAnalyticsObject|ga\s*\(\s*["']create)[\s\S]*?<\/script>/gi, "");

    if (isShooter) {
      html = html.replace(/<link\b[^>]*TemplateData\/style\.css[^>]*>/gi, "");
      html = html.replace(/canvas\.style\.background\s*=\s*[^;]+;/, "canvas.style.background = '#10100f';");
      html = html.replace(/<body([^>]*)>/i, `<body$1><div id="sq-loader"><span>Downloading game data · 0 of 2 files</span></div>`);
      html = html.replace(/res\s*=>\s*res\.arrayBuffer\(\)/g, "res=>res.arrayBuffer().then(buffer=>{window.__sqParts=(window.__sqParts||0)+1;var indicator=document.querySelector('#sq-loader span');if(indicator)indicator.textContent='Downloading game data · '+window.__sqParts+' of 2 files';return buffer;})");
      html = html.replace(/createUnityInstance\s*\(\s*canvas\s*,\s*config\s*,\s*\(\s*progress\s*\)\s*=>\s*\{/g, "createUnityInstance(canvas,config,(progress)=>{const loader=document.getElementById('sq-loader');if(loader)loader.firstElementChild.textContent='Loading '+Math.round(progress*100)+'%';");
      html = html.replace(/createUnityInstance\s*\(\s*canvas\s*,\s*config\s*\)\.then\s*\(\s*unityInstance\s*=>\s*\{/g, "createUnityInstance(canvas,config,(progress)=>{const loader=document.getElementById('sq-loader');if(loader)loader.firstElementChild.textContent='Loading '+Math.round(progress*100)+'%';}).then(unityInstance=>{");
      html = html.replace(/\.then\s*\(\s*(?:\(\s*unityInstance\s*\)|unityInstance)\s*=>\s*\{/g, "$&const loader=document.getElementById('sq-loader');if(loader)loader.remove();");
      html = html.replace(/loadDataParts\(\);\s*<\/script>/, "loadDataParts(); setTimeout(()=>{const loader=document.getElementById('sq-loader');if(loader)loader.firstElementChild.textContent='Still loading · the game files are large';},60000);<\/script>");
      html = html.replace(/alert\(/g, "window.__sqGameError(");
      html = html.replace(/<script\b(?![^>]*src=)[^>]*>/i, "$&window.__sqGameError=function(message){var box=document.createElement('div');box.id='sq-error';box.innerHTML='<section><h1>Game could not start</h1><p></p><button onclick=\"location.reload()\">Try again</button></section>';box.querySelector('p').textContent=String(message);document.body.appendChild(box);};");
    }

    html = html.replace(/<head([^>]*)>/i, `<head$1>${meta}${analytics}${style}`);
    html = html.replace(/<body([^>]*)>/i, `<body$1>${controls}`);
    html = html.replace(/<\/body>/i, `<script>(function(){var nav=document.getElementById('sq-controls'),btn=document.getElementById('sq-menu-toggle'),panel=document.getElementById('sq-menu-panel'),hidden=false;btn.onclick=function(){panel.hidden=!panel.hidden;btn.setAttribute('aria-expanded',String(!panel.hidden));};document.getElementById('sq-hide-controls').onclick=function(){hidden=true;nav.style.display='none';};window.addEventListener('keydown',function(e){if(e.shiftKey&&e.key.toLowerCase()==='b'){e.preventDefault();hidden=!hidden;nav.style.display=hidden?'none':'flex';}});var title=document.getElementById('sq-game-title'),canvas=document.getElementById('unity-canvas');if(title&&canvas){canvas.addEventListener('pointerdown',function(e){if(e.clientY>window.innerHeight*.66)title.remove();});window.addEventListener('keydown',function(e){if(e.key==='Enter'||e.code==='Space')title.remove();});}})();</script></body>`);
    document.open(); document.write(html); document.close();
  }

  launch().catch(showFailure);
})();
