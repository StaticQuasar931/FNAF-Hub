# StaticQuasar931 FNAF Hub

A searchable Five Nights at Freddy's game hub with 18 individual game pages. Each game page loads its source HTML from the upstream project and keeps the original game assets remote, so the repository stays small.

## Run it

Open this folder with a local web server. Browsers block the cross-origin game source fetch when these pages are opened as `file://` documents. Run `node serve.mjs` from this folder, then open `http://localhost:8765`.

The game pages need an internet connection. They fetch game HTML from GitHub or jsDelivr and load game assets from the source page's configured CDN. If an upstream file or asset is removed, that entry may stop working until its source URL is updated in `games.json`.

## Controls

- Search by game name, short name, or category. Press `/` to focus search.
- Choose series order, title, or fan games first. Use the arrow button to reverse the order.
- Open a card to start its game. The game is fitted to the browser window while preserving its canvas aspect ratio.
- Use **Back to hub** to return. Press **Shift+B** to show or hide the game controls.
- Press **Y**, **U**, then **I** to show or hide the StaticQuasar visual menu and rotating social widget.

The rotating widget uses the Google Form, Discord, and Instagram assets and links supplied for StaticQuasar931. The menu reappears three minutes after it is closed. The pages use the `G-ETC235N10B` Google Analytics property and contain no hidden SEO text.

This is an unofficial fan-game collection. Original game names, in-game marks, and creator credits remain with their respective owners. No original game binaries are copied into this repository.
