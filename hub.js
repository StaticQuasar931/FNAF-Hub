let catalog = [];

const grid = document.querySelector("#game-grid");
const searchInput = document.querySelector("#game-search");
const sortSelect = document.querySelector("#game-sort");
const countLabel = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";
let descending = false;

function cardMarkup(game, index) {
  const cover = `covers/${game.slug}.svg`;
  const href = `items/${game.slug}/index.html`;
  return `<article class="game-card" style="animation-delay:${Math.min(index,12)*28}ms">
    <a class="card-cover" href="${href}" aria-label="Play ${game.title}">
      <img src="${cover}" alt="Original illustrated cover for ${game.title}" loading="lazy" width="640" height="360">
      <span class="card-tag">${game.kind}</span><span class="card-number">${String(Math.round(game.order)).padStart(2,"0")}</span>
    </a>
    <div class="card-content"><p class="card-kicker">${game.group === "official" ? "THE MAIN SERIES" : game.group === "spin-off" ? "SIDE STORY" : "FAN-MADE PORT"}</p>
      <h3 class="card-title">${game.title}</h3>
      <div class="card-bottom"><span class="card-type">${game.short}</span><a class="play-link" href="${href}">Play <span aria-hidden="true">↗</span></a></div>
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
document.addEventListener("keydown", event => { if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); searchInput.focus(); } });
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) canonical.href = location.origin + location.pathname;
console.log("StaticQuasar931 FNAF Hub - https://sites.google.com/view/staticquasar931/gm3z");
fetch(new URL("games.json", location.href))
  .then(response => { if (!response.ok) throw new Error(`Game catalog request failed (${response.status}).`); return response.json(); })
  .then(games => { catalog = games; render(); })
  .catch(error => { grid.innerHTML = `<p class="catalog-error">The game list could not load. Refresh the page to try again. <small>${error.message}</small></p>`; });
