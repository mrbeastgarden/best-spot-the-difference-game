# Twin Scenes — Spot the Difference — make.fun entry

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrbeastgarden/best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrbeastgarden/best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

This repository is the entry for the make.fun bounty
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
(`best-spot-the-difference-game-20261121-0451`).

## The game

**Twin Scenes** is a complete spot-the-difference game that plays offline in a
desktop browser from its own files. Two near-identical pictures stand side by
side; a few details changed between them. Click a difference in either picture
to circle it in green. Wrong clicks cost 3 seconds. Hints point one out.

Three original scenes, all drawn in code — no borrowed art:

- **Sunny Garden** — 5 differences, 90 seconds
- **Harbour at Dusk** — 7 differences, 2 minutes
- **Night Market** — 10 differences, 2½ minutes

Each level has a countdown, a found counter, a score, hints (3 per level) and
a best score kept in the browser. Sounds are synthesized with WebAudio — no
audio files. Keyboard: Enter to start, H for a hint, R to restart, M to mute,
1/2/3 to jump to a level from the title screen.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: `game/index.html` and its ES modules only.
To see the staged screenshot scenes in a browser, add `?shot=start`,
`?shot=play` or `?shot=end` to the URL (with `&seed=1` for a fixed scene).

## How it is built

- `game/index.html` — the page: one canvas, one status line.
- `game/src/main.js` — boot and the one loop; `?shot=start|play|end` stages a
  scene for screenshots instead of running the loop.
- `game/src/scenes.js` — the three scenes and their differences. Each scene
  draws the same layout twice (variants A and B); the `diffs` list is the only
  place the two disagree.
- `game/src/state.js` — the rules: clicks, hints, timer, score, screens.
- `game/src/render.js` — everything the player sees: panels, markers, HUD.
- `game/src/input.js` — mouse and keyboard.
- `game/src/audio.js` — synthesized sounds.
- `game/src/shots.js` — the staged screenshot scenes.
- `game/src/config.js` — the numbers every file agrees on.
- `game/src/random.js` — a seeded random generator.

`main.ts` (Node 22, standard library only) hands the game in: it copies
`game/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-game.ts` library. It refuses
to run when `game/index.html` is missing, so a half-built repo can never be
handed in by mistake:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# out/game/ out/screenshots/ out/dossier.json
```

## Screenshots

Real renders of the game's own code, in `screenshots/` — the cover
(`1-play.jpg`) shows Harbour at Dusk mid-game: two differences already
circled, five still to find, and the found counter at 2 / 7.
