let catalog = [];

const grid = document.querySelector("#game-grid");
const searchInput = document.querySelector("#game-search");
const sortSelect = document.querySelector("#game-sort");
const countLabel = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";
let descending = false;

const coverImages = {
  "fnaf-1":"fnaf-1.jpg", "fnaf-2":"fnaf-2.jpg", "fnaf-3":"fnaf-3.jpg",
  "fnaf-3-remastered":"fnaf-3.jpg", "fnaf-4":"fnaf-4.jpg", "fnaf-4-halloween":"fnaf-4.jpg",
  "fnaf-world":"fnaf-world.jpg", "sister-location":"sister-location.jpg",
  "pizzeria-simulator":"pizzeria.jpg", "ultimate-custom-night":"ucn.jpg",
  "five-nights-at-candys-1":"candys.jpg", "five-nights-at-candys-2":"candys.jpg",
  "five-nights-at-winstons":"winston.jpg", "five-nights-at-yoshis":"yoshis.jpg",
  "five-nights-at-baldis-redone":"baldis.jpg", "frickbears-3":"frickbears.jpg", "fnaf-shooter":"shooter.jpg"
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

function cardMarkup(game, index) {
  const cover = `images/${coverImages[game.slug] || "fnaf-1.jpg"}`;
  const href = `items/${game.slug}/index.html`;
  return `<article class="game-card" style="animation-delay:${Math.min(index,12)*28}ms">
    <a class="card-cover" href="${href}" aria-label="Play ${game.title}">
      <img src="${cover}" alt="${escapeHtml(game.title)} gameplay screenshot" loading="lazy" width="640" height="360">
      <span class="card-tag">${escapeHtml(game.kind)}</span>
    </a>
    <div class="card-content"><p class="card-kicker">${game.group === "official" ? "THE MAIN SERIES" : game.group === "spin-off" ? "SIDE STORY" : "FAN-MADE PORT"}</p>
      <h3 class="card-title">${escapeHtml(game.title)}</h3>
      <div class="card-bottom"><span class="card-type">${escapeHtml(game.short)}</span><a class="play-link" href="${href}">Play game <span aria-hidden="true">→</span></a></div>
    </div>
  </article>`;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = catalog.filter(game => {
    const matchesSearch = `${game.title} ${game.short} ${game.kind} ${game.group}`.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "all" || game.group === activeFilter;
    return matchesSearch && matchesFilter;
  });
  const mode = sortSelect.value;
  visible.sort((a,b) => mode === "title" ? a.title.localeCompare(b.title) : mode === "fan" ? (a.group === "fan" ? -1 : b.group === "fan" ? 1 : a.order-b.order) : a.order-b.order);
  if (descending) visible.reverse();
  grid.innerHTML = visible.map(cardMarkup).join("");
  countLabel.textContent = String(visible.length);
  emptyState.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
}

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
document.querySelector("#sort-direction").addEventListener("click", event => {
  descending = !descending;
  event.currentTarget.textContent = descending ? "↓" : "↑";
  event.currentTarget.setAttribute("aria-label", descending ? "Restore ascending order" : "Reverse sort order");
  render();
});
document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".filter-chip.is-active")?.classList.remove("is-active");
  button.classList.add("is-active");
  activeFilter = button.dataset.filter;
  render();
}));
document.querySelector("#clear-search").addEventListener("click", () => { searchInput.value = ""; activeFilter = "all"; document.querySelector(".filter-chip.is-active")?.classList.remove("is-active"); document.querySelector('[data-filter="all"]').classList.add("is-active"); render(); searchInput.focus(); });
const menuToggle = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector("#menu-panel");
function setMenu(open) { menuPanel.hidden = !open; menuToggle.setAttribute("aria-expanded", String(open)); }
menuToggle.addEventListener("click", () => setMenu(menuPanel.hidden));
document.querySelector("#menu-close").addEventListener("click", () => { setMenu(false); menuToggle.focus(); });
document.addEventListener("click", event => { if (!menuPanel.hidden && !menuPanel.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false); });
document.addEventListener("keydown", event => { if (event.key === "Escape") setMenu(false); });
document.addEventListener("keydown", event => { if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); searchInput.focus(); } });
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) canonical.href = location.origin + location.pathname;
console.log("StaticQuasar931 FNAF Hub - https://sites.google.com/view/staticquasar931/gm3z");
fetch(new URL("games.json", location.href))
  .then(response => { if (!response.ok) throw new Error(`Game catalog request failed (${response.status}).`); return response.json(); })
  .then(games => { catalog = games; render(); document.querySelector("#header-count").textContent = String(games.length); document.querySelector("[data-filter='all'] span").textContent = String(games.length); })
  .catch(error => { grid.innerHTML = `<p class="catalog-error">The game list could not load. Refresh the page to try again. <small>${error.message}</small></p>`; });
