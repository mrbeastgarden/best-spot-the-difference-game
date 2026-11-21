// Twin Scenes — Spot the Difference: shared constants.
// One file, one job: every number the game, the renderer and the shots agree on.
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// The two picture panels, side by side.
export const PANEL_W = 600;
export const PANEL_H = 560;
export const PANEL_Y = 88;
export const LEFT_X = 20;
export const RIGHT_X = 660;
export const PANEL_GAP = 40;

// Top HUD bar and bottom bar.
export const HUD_H = 72;
export const BAR_Y = 664;
export const BAR_H = 136;

// Scoring and timing.
export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_PENALTY_S = 3;
export const WRONG_FLASH_MS = 700;
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2000;
export const FIND_CELEBRATION_MS = 900;

export const BEST_KEY = 'twin-scenes-best-score';

export const LEVELS = [
  { id: 'garden', name: 'Sunny Garden', sub: 'Level 1 · 5 differences', time: 90 },
  { id: 'harbour', name: 'Harbour at Dusk', sub: 'Level 2 · 7 differences', time: 120 },
  { id: 'market', name: 'Night Market', sub: 'Level 3 · 10 differences', time: 150 },
];

export const SCREENS = {
  TITLE: 'title',
  PLAY: 'play',
  LEVEL_DONE: 'levelDone',
  VICTORY: 'victory',
  TIME_UP: 'timeUp',
};
