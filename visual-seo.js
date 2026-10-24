(() => {
  const menu = document.querySelector("#staticMenu");
  const close = document.querySelector("#closeStaticMenu");
  const social = document.querySelector("#staticSlideMenu");
  const slideLink = document.querySelector("#staticSlideLink");
  const slideImg = document.querySelector("#staticSlideImg");
  const key = "sq931_staticMenu_hidden_until";
  const showMenu = () => { if (menu) menu.style.display = "flex"; };
  const hideForThreeMinutes = () => {
    if (!menu) return;
    menu.style.display = "none";
    const until = Date.now() + 180000;
    try { localStorage.setItem(key, String(until)); } catch {}
    setTimeout(showMenu, 180000);
  };
  let until = 0;
  try { until = Number.parseInt(localStorage.getItem(key) || "0", 10) || 0; } catch {}
  if (until > Date.now()) { menu.style.display = "none"; setTimeout(showMenu, until - Date.now()); }
  else showMenu();
  close?.addEventListener("click", hideForThreeMinutes);

  const rotation = [
    {src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/GoogleForm.png",alt:"StaticQuasar931 Google Form for feedback and requests",href:"https://sites.google.com/view/staticquasar931/google-form"},
    {src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Join_Our_DC_StaticQuassar931_lcplrf.png",alt:"Join the StaticQuasar931 Discord",href:"https://discord.gg/DP2hM7RRhR"},
    {src:"https://cdn.jsdelivr.net/gh/StaticQuasar931/Images@main/Follow-us--IG",alt:"StaticQuasar931 Instagram",href:"https://www.instagram.com/freeschoolgamepage/"}
  ];
  rotation.forEach(item => { const preload = new Image(); preload.src = item.src; });
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function cycle() {
    let index = 0;
    for (;;) {
      const item = rotation[index];
      slideLink.href = item.href;
      slideImg.alt = item.alt;
      slideImg.style.opacity = "0";
      await new Promise(resolve => { slideImg.onload = resolve; slideImg.onerror = resolve; slideImg.src = item.src; });
      slideImg.style.opacity = "1";
      social.classList.remove("slide-out"); social.classList.add("slide-in");
      await delay(7000);
      social.classList.remove("slide-in"); social.classList.add("slide-out");
      await delay(4000);
      await delay(20000);
      index = (index + 1) % rotation.length;
    }
  }
  cycle();

  const visualIds = ["staticMenu", "staticSlideMenu"];
  let sequence = [];
  document.addEventListener("keydown", event => {
    sequence.push(event.key.toLowerCase());
    if (sequence.length > 3) sequence.shift();
    if (sequence.join("") !== "yui") return;
    visualIds.forEach(id => {
      const element = document.getElementById(id);
      if (!element) return;
      const hidden = getComputedStyle(element).display === "none";
      element.style.display = hidden ? (id === "staticMenu" ? "flex" : "block") : "none";
    });
  });
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = location.origin + location.pathname;
})();
