(() => {
  const page = document.body;
  const title = page.dataset.title || "Five Nights at Freddy's game";
  const description = page.dataset.description || `${title} browser game. Play the original game in the StaticQuasar931 FNAF collection.`;
  const sourceUrl = page.dataset.source;
  const assetBase = page.dataset.assetBase;
  const mainScript = page.dataset.mainScript;
  const analyticsTemplate = document.querySelector("#analytics-template");
  const analyticsMarkup = analyticsTemplate ? analyticsTemplate.innerHTML : "";

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const sourceMeta = `
    <title>${escapeHtml(title)} Unblocked | StaticQuasar931 Games</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index,follow">
    <meta name="theme-color" content="#090a10">
    <link rel="canonical" href="${escapeHtml(location.origin + location.pathname)}">
    <meta property="og:title" content="${escapeHtml(title)} Unblocked | StaticQuasar931 Games">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)} Unblocked | StaticQuasar931 Games">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/icon.png">
  `;

  const visualCss = `
    html,body{width:100%;height:100%;margin:0!important;overflow:hidden!important}
    body{background:#000!important}
    #unity-container{width:100vw!important;height:100vh!important;max-width:100vw!important;max-height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important}
    #unity-canvas,#MMFCanvas{display:block;max-width:100vw!important;max-height:100vh!important}
    #sq-game-tools{position:fixed;z-index:2147483000;left:14px;top:14px;display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(10,11,17,.9);color:#f5f3f5;font:11px Arial,sans-serif;box-shadow:0 4px 24px #0008;backdrop-filter:blur(12px)}
    #sq-game-tools a,#sq-game-tools button{color:inherit;font:inherit;text-decoration:none}
    #sq-game-tools a{padding:5px 8px;border-radius:5px;background:#ed4651;font-weight:700}
    #sq-game-tools button{border:0;background:transparent;cursor:pointer;padding:5px 7px}
    #sq-game-tools .sq-hint{color:#b0b1bb;font:10px monospace}
    #staticSlideMenu{position:fixed;z-index:2147483000;right:14px;bottom:14px;width:88px;height:88px;transform:translateX(120%);transition:transform 2s ease;pointer-events:none}
    #staticSlideMenu.slide-in{transform:translateX(0);pointer-events:auto}
    #staticSlideMenu a,#staticSlideMenu img{display:block;width:100%;height:100%;object-fit:contain}
    #staticSlideMenu img{filter:drop-shadow(0 5px 12px #0009)}
    @media(max-width:600px){#sq-game-tools{left:8px;top:8px;gap:5px;padding:6px}#staticSlideMenu{width:74px;height:74px;right:8px;bottom:8px}}
  `;

  const backPath = location.origin + location.pathname.split("/items/")[0] + "/";
  const socialUi = `
    <nav id="sq-game-tools" aria-label="Game controls">
      <a href="${backPath}" title="Return to the FNAF Hub">← Back to hub</a>
      <span class="sq-hint">Shift+B controls</span>
      <button type="button" id="sq-hide-tools" aria-label="Hide game controls">Hide</button>
    </nav>
    <div id="staticSlideMenu" class="slide-out" aria-live="polite">
      <a id="staticSlideLink" href="https://sites.google.com/view/staticquasar931/google-form" target="_blank" rel="noopener" aria-label="Open Google Form">
        <img id="staticSlideImg" src="https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/GoogleForm.png" alt="StaticQuasar931 Google Form for feedback and requests">
      </a>
    </div>
    <script>
      (function(){
        var tools=document.getElementById("sq-game-tools");
        var hide=document.getElementById("sq-hide-tools");
        var social=document.getElementById("staticSlideMenu");
        var link=document.getElementById("staticSlideLink");
        var img=document.getElementById("staticSlideImg");
        var hidden=false;
        function fitCanvases(){document.querySelectorAll("canvas").forEach(function(canvas){var ratio=(canvas.width&&canvas.height)?canvas.width/canvas.height:16/9;var width=Math.min(window.innerWidth,window.innerHeight*ratio);var height=width/ratio;canvas.style.width=width+"px";canvas.style.height=height+"px";});}
        window.addEventListener("resize",fitCanvases);
        fitCanvases();setTimeout(fitCanvases,250);setTimeout(fitCanvases,1000);
        function setVisible(value){hidden=!value;tools.style.display=value?"flex":"none";if(social)social.style.display=value?"block":"none";}
        hide.addEventListener("click",function(){setVisible(false);});
        var keys=[];
        window.addEventListener("keydown",function(event){
          if(event.altKey||event.ctrlKey||event.metaKey)return;
          var key=event.key.toLowerCase();
          if(key==="b"&&event.shiftKey){event.preventDefault();event.stopImmediatePropagation();setVisible(hidden);return;}
          keys.push(key);if(keys.length>3)keys.shift();
          if(keys.join("")==="yui"){event.preventDefault();event.stopImmediatePropagation();setVisible(hidden);}
        },true);
        var FORM={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/GoogleForm.png",alt:"StaticQuasar931 Google Form for feedback and requests",href:"https://sites.google.com/view/staticquasar931/google-form"};
        var DISCORD={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Join_Our_DC_StaticQuassar931_lcplrf.png",alt:"Join the StaticQuasar931 Discord",href:"https://discord.gg/DP2hM7RRhR"};
        var INSTA={src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Follow-us--IG",alt:"StaticQuasar931 Instagram",href:"https://www.instagram.com/freeschoolgamepage/"};
        var rotation=[FORM,DISCORD,INSTA],index=0;
        rotation.forEach(function(item){var preload=new Image();preload.src=item.src;});
        function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
        async function cycle(){while(true){var item=rotation[index];link.href=item.href;img.alt=item.alt;img.style.opacity="0";await new Promise(function(resolve){img.onload=resolve;img.onerror=resolve;img.src=item.src;});img.style.opacity="1";social.classList.remove("slide-out");social.classList.add("slide-in");await delay(7000);social.classList.remove("slide-in");social.classList.add("slide-out");await delay(4000);await delay(20000);index=(index+1)%rotation.length;}}
        cycle();
      })();
    </script>
  `;

  function showFailure(error) {
    document.body.innerHTML = `<main style="min-height:100vh;display:grid;place-items:center;background:#090a10;color:#f5f3f5;font:16px Arial,sans-serif;padding:24px"><section style="max-width:600px;border:1px solid #343541;border-radius:12px;background:#141620;padding:28px"><p style="color:#f44751;font-size:12px;letter-spacing:.16em">GAME COULD NOT START</p><h1 style="font-size:28px">${escapeHtml(title)}</h1><p style="color:#b6b8c2;line-height:1.6">The source HTML could not be fetched. Check your connection and try again. The game uses hosted assets, so it needs an internet connection.</p><p style="color:#8e91a0;font-size:12px">${escapeHtml(error.message || "Unknown loading error")}</p><p><button onclick="location.reload()" style="padding:10px 15px;background:#ed4651;color:white;border:0;border-radius:6px;cursor:pointer">Try again</button> <a href="${backPath}" style="color:white;margin-left:12px">Back to hub</a></p></section></main>`;
  }

  async function launch() {
    if (!sourceUrl) throw new Error("This game page has no source URL.");
    const response = await fetch(sourceUrl, {mode:"cors", cache:"force-cache"});
    if (!response.ok) throw new Error(`Source request returned ${response.status}.`);
    let html = await response.text();
    if (!/<html[\s>]/i.test(html)) throw new Error("The source did not return a game HTML page.");

    if (assetBase) {
      const baseTag = `<base href="${escapeHtml(assetBase)}">`;
      html = /<base\b[^>]*>/i.test(html) ? html.replace(/<base\b[^>]*>/i, baseTag) : html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
    }

    if (mainScript) {
      const scriptResponse = await fetch(mainScript, {mode:"cors", cache:"force-cache"});
      if (!scriptResponse.ok) throw new Error(`Game script request returned ${scriptResponse.status}.`);
      let script = await scriptResponse.text();
      const start = script.indexOf("(function(_0x4ae416,_0x41a5b7){");
      const end = script.indexOf("function getParts(file, start, end) {");
      if (start < 0 || end <= start) throw new Error("The suspicious script block did not match the reviewed version, so it was not run.");
      script = script.slice(0, start) + script.slice(end);
      const safeScriptUrl = URL.createObjectURL(new Blob([script], {type:"text/javascript"}));
      const escapedSafeUrl = safeScriptUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const mainPattern = /<script\b[^>]*\bsrc\s*=\s*(["'])main\.js\1[^>]*>\s*<\/script>/i;
      if (!mainPattern.test(html)) { URL.revokeObjectURL(safeScriptUrl); throw new Error("Could not locate the expected main.js tag; the original script was not run."); }
      html = html.replace(mainPattern, `<script src="${safeScriptUrl}"><\/script>`);
    }

    html = html.replace(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi, "");
    html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:googletagmanager|google-analytics|google-analytics|analytics\.js|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gi, "");
    html = html.replace(/<script\b[^>]*>[\s\S]*?\b(?:gtag\s*\(|GoogleAnalyticsObject|ga\s*\(\s*["']create)[\s\S]*?<\/script>/gi, "");
    html = html.replace(/\balert\s*\(/g, "console.error(");

    if (!/<base\b/i.test(html) && assetBase) html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${escapeHtml(assetBase)}">`);
    html = html.replace(/<head([^>]*)>/i, `<head$1>${sourceMeta}${analyticsMarkup}<style>${visualCss}</style>`);
    html = html.replace(/<\/body>/i, `${socialUi}</body>`);
    document.open();
    document.write(html);
    document.close();
  }

  launch().catch(showFailure);
})();
