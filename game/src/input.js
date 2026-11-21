// Twin Scenes: mouse and keyboard input.
// One file, one job: turn browser events into game coordinates and keys.
import { CANVAS_H, CANVAS_W } from './config.js';

export const ACTION_CONFIRM = 'confirm';
export const ACTION_HINT = 'hint';
export const ACTION_RESTART = 'restart';
export const ACTION_MUTE = 'mute';

export function createInput(canvas, handlers) {
  function toCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const p = toCanvas(event);
    handlers.click(p.x, p.y);
  });

  window.addEventListener('keydown', (event) => {
    // Ignore held keys: one press is one hint, one restart.
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      handlers.action(ACTION_CONFIRM);
    } else if (key === 'h') {
      handlers.action(ACTION_HINT);
    } else if (key === 'r') {
      handlers.action(ACTION_RESTART);
    } else if (key === 'm') {
      handlers.action(ACTION_MUTE);
    } else if (key === '1' || key === '2' || key === '3') {
      handlers.level(Number.parseInt(key, 10) - 1);
    }
  });
}
