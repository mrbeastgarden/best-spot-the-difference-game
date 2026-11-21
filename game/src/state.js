// Twin Scenes: the game state and its rules.
// One file, one job: what a click, a hint and a tick do to the game.
import {
  BEST_KEY,
  FIND_CELEBRATION_MS,
  HINTS_PER_LEVEL,
  HINT_PULSE_MS,
  POINTS_PER_FIND,
  SCREENS,
  WRONG_CLICK_PENALTY_S,
  WRONG_FLASH_MS,
} from './config.js';
import { createRandom, int } from './random.js';
import { SCENES } from './scenes.js';

export function createState() {
  return {
    screen: SCREENS.TITLE,
    levelIndex: 0,
    found: new Set(),
    foundOrder: [],
    timeLeft: SCENES[0].time,
    score: 0,
    levelScore: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hint: null, // { diffIndex, until }
    wrong: null, // { x, y, panel, until }
    toast: null, // { text, until }
    celebrationUntil: 0,
    levelStats: null, // { found, total, timeBonus, points }
    totalFound: 0,
    totalDiffs: SCENES.reduce((n, s) => n + s.diffs.length, 0),
    muted: false,
    best: readBest(),
    now: 0,
  };
}

export function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

export function sceneOf(state) {
  return SCENES[state.levelIndex];
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.screen = SCREENS.PLAY;
  state.found = new Set();
  state.foundOrder = [];
  state.timeLeft = SCENES[index].time;
  state.levelScore = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hint = null;
  state.wrong = null;
  state.toast = null;
  state.celebrationUntil = 0;
  state.levelStats = null;
}

export function startGame(state) {
  state.score = 0;
  state.totalFound = 0;
  startLevel(state, 0);
}

// Returns 'found' | 'wrong' | 'none' | 'already'.
// When zones overlap, the nearest difference still unfound wins: a click on
// a spot already circled falls through to a neighbour still unfound.
export function clickAt(state, x, y) {
  if (state.screen !== SCREENS.PLAY) return 'none';
  const scene = sceneOf(state);
  let nearest = null;
  let nearestDist = Infinity;
  let hitFound = false;
  for (let i = 0; i < scene.diffs.length; i += 1) {
    const d = scene.diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    const dist = dx * dx + dy * dy;
    if (dist <= d.r * d.r) {
      if (state.found.has(i)) {
        hitFound = true;
      } else if (dist < nearestDist) {
        nearest = i;
        nearestDist = dist;
      }
    }
  }
  if (nearest !== null) {
    const i = nearest;
    const d = scene.diffs[i];
    state.found.add(i);
    state.foundOrder.push(i);
    state.totalFound += 1;
    const points = POINTS_PER_FIND;
    state.score += points;
    state.levelScore += points;
    state.toast = { text: `Found: ${d.label}! +${points}`, until: state.now + 1600 };
    if (state.found.size === scene.diffs.length) {
      const timeBonus = Math.round(state.timeLeft) * 5;
      state.score += timeBonus;
      state.levelScore += timeBonus;
      state.levelStats = {
        found: scene.diffs.length,
        total: scene.diffs.length,
        timeBonus,
        points: state.levelScore,
      };
      state.celebrationUntil = state.now + FIND_CELEBRATION_MS;
    }
    return 'found';
  }
  if (hitFound) return 'already';
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_PENALTY_S);
  state.wrong = { x, y, until: state.now + WRONG_FLASH_MS };
  state.toast = { text: `Not a difference — minus ${WRONG_CLICK_PENALTY_S}s`, until: state.now + 1400 };
  return 'wrong';
}

// Returns the diff index the hint points at, or null.
export function useHint(state) {
  if (state.screen !== SCREENS.PLAY) return null;
  if (state.hintsLeft <= 0) return null;
  const scene = sceneOf(state);
  const remaining = scene.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return null;
  const pick = remaining[int(createRandom(state.now | 0), 0, remaining.length)];
  state.hintsLeft -= 1;
  state.hint = { diffIndex: pick, until: state.now + HINT_PULSE_MS };
  return pick;
}

export function tick(state, dtMs) {
  state.now += dtMs;
  if (state.screen === SCREENS.PLAY) {
    state.timeLeft -= dtMs / 1000;
    if (state.hint && state.now > state.hint.until) state.hint = null;
    if (state.wrong && state.now > state.wrong.until) state.wrong = null;
    if (state.toast && state.now > state.toast.until) state.toast = null;
    if (state.timeLeft <= 0 && !state.celebrationUntil) {
      state.timeLeft = 0;
      state.screen = SCREENS.TIME_UP;
      return 'timeUp';
    }
    if (state.celebrationUntil && state.now >= state.celebrationUntil) {
      state.celebrationUntil = 0;
      if (state.levelIndex + 1 < SCENES.length) {
        state.screen = SCREENS.LEVEL_DONE;
      } else {
        state.screen = SCREENS.VICTORY;
        if (state.score > state.best) {
          state.best = state.score;
          saveBest(state.score);
        }
      }
      return 'levelCleared';
    }
  }
  return null;
}
