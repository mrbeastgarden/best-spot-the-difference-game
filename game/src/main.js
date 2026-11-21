// Twin Scenes — boot and the one loop.
// ?seed=N is accepted (the scenes are drawn, not random). ?shot=start|play|end
// stages a scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { CANVAS_H, CANVAS_W, LEFT_X, PANEL_H, PANEL_W, PANEL_Y, RIGHT_X, SCREENS } from './config.js';
import { createAudio } from './audio.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { clickAt, createState, startGame, startLevel, tick, useHint } from './state.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const state = createState();
const renderer = createRenderer(canvas);
const audio = createAudio();

function inRect(x, y, r) {
  return r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function announce(text) {
  if (status) status.textContent = text;
}

function handleClick(x, y) {
  audio.unlock();
  const regions = state._regions ?? {};
  if (state.screen === SCREENS.TITLE) {
    if (inRect(x, y, regions.start)) {
      audio.click();
      startGame(state);
      announce('Level 1: Sunny Garden. Find 5 differences.');
    }
    return;
  }
  if (state.screen === SCREENS.LEVEL_DONE) {
    if (inRect(x, y, regions.next)) {
      audio.click();
      startLevel(state, state.levelIndex + 1);
      announce(`Level ${state.levelIndex + 1} started.`);
    }
    return;
  }
  if (state.screen === SCREENS.VICTORY) {
    if (inRect(x, y, regions.again)) {
      audio.click();
      startGame(state);
    }
    return;
  }
  if (state.screen === SCREENS.TIME_UP) {
    if (inRect(x, y, regions.retry)) {
      audio.click();
      startLevel(state, state.levelIndex);
    }
    return;
  }
  if (state.screen !== SCREENS.PLAY) return;

  // Bottom-bar buttons first.
  if (inRect(x, y, regions.hint)) {
    const pick = useHint(state);
    if (pick !== null) {
      audio.hint();
      announce('Hint: look for the pulsing circle.');
    }
    return;
  }
  if (inRect(x, y, regions.restart)) {
    audio.click();
    startLevel(state, state.levelIndex);
    announce('Level restarted.');
    return;
  }

  // Then the two picture panels.
  let panel = null;
  let local = null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W && y >= PANEL_Y && y <= PANEL_Y + PANEL_H) {
    panel = 'left';
    local = { x: x - LEFT_X, y: y - PANEL_Y };
  } else if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W && y >= PANEL_Y && y <= PANEL_Y + PANEL_H) {
    panel = 'right';
    local = { x: x - RIGHT_X, y: y - PANEL_Y };
  }
  if (!panel) return;
  const result = clickAt(state, local.x, local.y);
  if (result === 'found') {
    audio.found();
    announce(state.toast ? state.toast.text : 'Found one!');
  } else if (result === 'wrong') {
    audio.wrong();
    if (state.wrong) state.wrong.panel = panel;
    announce('Not a difference. Minus 3 seconds.');
  }
}

function handleAction(action) {
  audio.unlock();
  if (action === ACTION_MUTE) {
    state.muted = !state.muted;
    audio.setMuted(state.muted);
    return;
  }
  if (state.screen === SCREENS.TITLE && action === ACTION_CONFIRM) {
    startGame(state);
    announce('Level 1: Sunny Garden. Find 5 differences.');
    return;
  }
  if (state.screen === SCREENS.LEVEL_DONE && action === ACTION_CONFIRM) {
    startLevel(state, state.levelIndex + 1);
    return;
  }
  if ((state.screen === SCREENS.VICTORY || state.screen === SCREENS.TIME_UP) && action === ACTION_CONFIRM) {
    startGame(state);
    return;
  }
  if (state.screen !== SCREENS.PLAY) return;
  if (action === ACTION_HINT) {
    const pick = useHint(state);
    if (pick !== null) audio.hint();
  } else if (action === ACTION_RESTART) {
    startLevel(state, state.levelIndex);
  }
}

function handleLevel(index) {
  if (state.screen === SCREENS.TITLE && index >= 0 && index < 3) {
    audio.unlock();
    startLevel(state, index);
    announce(`Level ${index + 1} started.`);
  }
}

createInput(canvas, {
  click: handleClick,
  action: handleAction,
  level: handleLevel,
});

if (shot) {
  stageShot(shot, state);
  let painted = 0;
  function paint() {
    renderer.draw(state);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
} else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(250, now - last);
    last = now;
    const event = tick(state, dt);
    if (event === 'timeUp') {
      announce('Time is up.');
    } else if (event === 'levelCleared') {
      if (state.screen === SCREENS.VICTORY) audio.victory();
      else audio.levelDone();
    }
    renderer.draw(state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
