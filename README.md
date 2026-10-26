# StaticQuasar931 FNAF Night Shift

A searchable browser hub for 17 Five Nights at Freddy's games and fan games. Game pages load from their configured upstream sources in `games.json`; the images used in the collection are stored locally in `images/`.

## Run locally

Open a terminal in this folder and run `node serve.mjs`, then visit `http://localhost:8765`. Use a local web server because browsers block remote game requests from `file://` pages. The games require an internet connection.

## Browse and play

- Search by game title, short name, or category. Press `/` to focus the search.
- Filter by main series, fan games, or other titles. Choose a sort order and use the arrow to reverse it.
- Select **Play game** to open the game. Select **Hub** to return. Press **Shift+B** to hide or restore the game controls.
- The top-right **Menu** contains the collection and StaticQuasar931 links.

FNAF 1's known obfuscated redirect block is removed before its loader runs. FNaF Shooter's source splash screen and original loading stylesheet are replaced with a plain progress screen. A source or asset host can still be unavailable; these browser games are loaded from external projects.

This is an unofficial collection. Game names and game imagery belong to their respective creators. Image sources are documented in `images/SOURCES.md`.

The hub and game pages use only the provided Google Analytics property `G-ETC235N10B`. They contain no hidden SEO text.

## Google Apps Script assets

The generated Apps Script exports in `GoogleScriptPages/` are ignored by Git. Runtime assets blocked under the upstream `genizy` CDN account are mirrored in `cdn/genizy-fnaf/` and referenced through `https://cdn.jsdelivr.net/gh/StaticQuasar931/FNAF-Hub@main/cdn/genizy-fnaf/`. Push the mirror to the `main` branch before using those generated Apps Script pages. `source-manifest.json` records the upstream commit and every mirrored runtime file.
