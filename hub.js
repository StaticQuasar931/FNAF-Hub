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
  "fnaf-3-remastered":"fnaf-3.jpg", "fnaf-4":"fnaf-4.jpg", "fnaf-4-halloween":"fnaf-4-halloween.gif",
  "fnaf-world":"fnaf-world.jpg", "sister-location":"sister-location.jpg",
  "pizzeria-simulator":"pizzeria.jpg", "ultimate-custom-night":"ucn.jpg",
  "five-nights-at-candys-1":"candys.jpg", "five-nights-at-candys-2":"candys-2.jpg",
  "five-nights-at-winstons":"winston.jpg", "five-nights-at-yoshis":"yoshis.jpg",
  "five-nights-at-baldis-redone":"baldis.jpg", "frickbears-3":"frickbears.jpg", "fnaf-shooter":"shooter.jpg"
};
const groupInfo = {
  official: {title:"Main series", note:"The original nights"},
  "spin-off": {title:"Spin-offs", note:"Side stories and different ways to play"},
  fan: {title:"Fan games", note:"Community-made nights and versions"}
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

function cardMarkup(game) {
  const cover = `images/${coverImages[game.slug] || "fnaf-1.jpg"}`;
  const href = `items/${game.slug}/index.html`;
  return `<a class="game-card" href="${href}" aria-label="Play ${escapeHtml(game.title)}">
    <div class="card-image"><img src="${cover}" alt="${escapeHtml(game.title)} game image" loading="lazy" width="640" height="360"><span class="card-kind">${escapeHtml(game.kind)}</span><span class="card-play">Play <span aria-hidden="true">↗</span></span></div>
    <div class="card-copy"><p>${escapeHtml(game.short)}</p><h3>${escapeHtml(game.title)}<span aria-hidden="true">↗</span></h3></div>
  </a>`;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const matching = catalog.filter(game => {
    const haystack = `${game.title} ${game.short} ${game.kind} ${game.group}`.toLowerCase();
    return haystack.includes(query) && (activeFilter === "all" || game.group === activeFilter);
  });
  const order = sortSelect.value === "fan" ? ["fan", "official", "spin-off"] : ["official", "spin-off", "fan"];
  const sections = order.map(group => {
    let games = matching.filter(game => game.group === group);
    if (sortSelect.value === "title") games.sort((a, b) => a.title.localeCompare(b.title));
    else games.sort((a, b) => a.order - b.order);
    if (descending) games.reverse();
    if (!games.length) return "";
    const info = groupInfo[group];
    return `<section class="game-section" aria-label="${info.title}"><div class="section-divider"><div><h2>${info.title}</h2><p>${info.note}</p></div><span>${games.length.toString().padStart(2,"0")}</span></div><div class="section-cards">${games.map(cardMarkup).join("")}</div></section>`;
  }).join("");
  grid.innerHTML = sections;
  countLabel.textContent = String(matching.length);
  emptyState.hidden = matching.length > 0;
  grid.hidden = matching.length === 0;
}

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
document.querySelector("#sort-direction").addEventListener("click", event => {
  descending = !descending;
  event.currentTarget.textContent = descending ? "↓" : "↑";
  event.currentTarget.setAttribute("aria-label", descending ? "Sort in descending order" : "Sort in ascending order");
  render();
});
document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".filter-chip.is-active")?.classList.remove("is-active");
  button.classList.add("is-active");
  activeFilter = button.dataset.filter;
  render();
}));
document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  activeFilter = "all";
  document.querySelector(".filter-chip.is-active")?.classList.remove("is-active");
  document.querySelector('[data-filter="all"]').classList.add("is-active");
  render();
  searchInput.focus();
});
document.addEventListener("keydown", event => {
  if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) canonical.href = location.origin + location.pathname;

fetch(new URL("games.json", location.href))
  .then(response => { if (!response.ok) throw new Error(`Game catalog request failed (${response.status}).`); return response.json(); })
  .then(games => { catalog = games; render(); document.querySelector("#header-count").textContent = String(games.length); document.querySelector("[data-filter='all'] span").textContent = String(games.length); })
  .catch(error => { grid.innerHTML = `<p class="catalog-error">The collection could not load. Refresh to try again. <small>${escapeHtml(error.message)}</small></p>`; });
