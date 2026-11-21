// Twin Scenes: everything the player sees.
// One file, one job: paint the panels, the markers, the HUD and the screens.
import {
  BAR_H,
  BAR_Y,
  CANVAS_H,
  CANVAS_W,
  HUD_H,
  LEFT_X,
  PANEL_H,
  PANEL_W,
  PANEL_Y,
  RIGHT_X,
  SCREENS,
  WRONG_FLASH_MS,
} from './config.js';
import { SCENES } from './scenes.js';
import { sceneOf } from './state.js';

const INK = '#23232e';
const PAPER = '#f7f3ea';
const GREEN = '#2fae5f';
const RED = '#e23b3b';
const AMBER = '#ffb703';

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function button(ctx, rect, label, enabled = true) {
  ctx.save();
  ctx.fillStyle = enabled ? '#2fae5f' : '#9a9aa5';
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.restore();
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawPanel(state, panelX, variant) {
    const scene = sceneOf(state);
    ctx.save();
    roundRectPath(ctx, panelX, PANEL_Y, PANEL_W, PANEL_H, 12);
    ctx.clip();
    ctx.translate(panelX, PANEL_Y);
    scene.draw(ctx, variant);
    // Markers for the differences already found.
    for (const i of state.foundOrder) {
      const d = scene.diffs[i];
      const recent = state.foundOrder[state.foundOrder.length - 1] === i && state.celebrationUntil;
      const pulse = recent ? 1 + Math.sin(state.now / 90) * 0.12 : 1;
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = GREEN;
      ctx.beginPath();
      ctx.arc(d.x + d.r * 0.7, d.y - d.r * 0.7, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x + d.r * 0.7 - 6, d.y - d.r * 0.7);
      ctx.lineTo(d.x + d.r * 0.7 - 1, d.y - d.r * 0.7 + 5);
      ctx.lineTo(d.x + d.r * 0.7 + 7, d.y - d.r * 0.7 - 6);
      ctx.stroke();
    }
    // Hint pulse on one difference still unfound.
    if (state.hint) {
      const d = scene.diffs[state.hint.diffIndex];
      const r = d.r + 8 + Math.sin(state.now / 120) * 5;
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Wrong-click flash.
    if (state.wrong && state.wrong.panel === (panelX === LEFT_X ? 'left' : 'right')) {
      const age = state.now - (state.wrong.until - WRONG_FLASH_MS);
      ctx.globalAlpha = Math.max(0, 1 - age / WRONG_FLASH_MS);
      ctx.strokeStyle = RED;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const s = 14;
      ctx.beginPath();
      ctx.moveTo(state.wrong.x - s, state.wrong.y - s);
      ctx.lineTo(state.wrong.x + s, state.wrong.y + s);
      ctx.moveTo(state.wrong.x + s, state.wrong.y - s);
      ctx.lineTo(state.wrong.x - s, state.wrong.y + s);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // Panel frame and label.
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 3;
    roundRectPath(ctx, panelX, PANEL_Y, PANEL_W, PANEL_H, 12);
    ctx.stroke();
    ctx.fillStyle = 'rgba(35,35,46,0.85)';
    rr(ctx, panelX + 10, PANEL_Y + 10, 108, 30, 8, 'rgba(35,35,46,0.85)');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(panelX === LEFT_X ? 'Picture A' : 'Picture B', panelX + 22, PANEL_Y + 26);
  }

  function rr(ctx2, x, y, w, h, r, fill) {
    ctx2.fillStyle = fill;
    ctx2.beginPath();
    ctx2.roundRect(x, y, w, h, r);
    ctx2.fill();
  }

  function drawHud(state) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, CANVAS_W, HUD_H);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('TWIN SCENES', 20, 26);
    ctx.fillStyle = '#b9b9c6';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('spot the difference', 20, 54);

    const scene = sceneOf(state);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${state.levelIndex + 1} — ${scene.name}`, CANVAS_W / 2, 24);
    // Timer bar.
    const barW = 280;
    const barX = CANVAS_W / 2 - barW / 2;
    const frac = Math.max(0, state.timeLeft / scene.time);
    ctx.fillStyle = '#3a3a48';
    roundRectPath(ctx, barX, 44, barW, 16, 8);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? GREEN : frac > 0.25 ? AMBER : RED;
    if (frac > 0) {
      roundRectPath(ctx, barX, 44, barW * frac, 16, 8);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(fmtTime(state.timeLeft), CANVAS_W / 2 + barW / 2 + 34, 52);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(`Score ${state.score}`, CANVAS_W - 20, 26);
    ctx.fillStyle = '#b9b9c6';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText(`Best ${state.best}`, CANVAS_W - 20, 54);
    ctx.textAlign = 'left';
  }

  function drawBottomBar(state, regions) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, BAR_Y, CANVAS_W, BAR_H);
    ctx.fillStyle = '#d8d2c2';
    ctx.fillRect(0, BAR_Y, CANVAS_W, 2);
    const scene = sceneOf(state);
    ctx.fillStyle = INK;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Found ${state.found.size} / ${scene.diffs.length}`, 24, BAR_Y + 34);
    ctx.fillStyle = '#6a6a78';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(
      state.screen === SCREENS.PLAY
        ? 'Click a difference in either picture. H = hint, R = restart, M = sound.'
        : ' ',
      24,
      BAR_Y + 68,
    );
    if (state.toast) {
      ctx.fillStyle = state.toast.text.startsWith('Found') ? GREEN : RED;
      ctx.font = 'bold 19px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(state.toast.text, CANVAS_W / 2, BAR_Y + 104);
      ctx.textAlign = 'left';
    }
    button(ctx, regions.hint, `Hint (${state.hintsLeft})`, state.hintsLeft > 0 && state.screen === SCREENS.PLAY);
    button(ctx, regions.restart, 'Restart', state.screen === SCREENS.PLAY);
  }

  function overlayCard(state, title, lines, btn, btnLabel) {
    ctx.fillStyle = 'rgba(20, 20, 32, 0.72)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const w = 560;
    const h = 150 + lines.length * 36 + 96;
    const x = (CANVAS_W - w) / 2;
    const y = (CANVAS_H - h) / 2;
    ctx.fillStyle = PAPER;
    roundRectPath(ctx, x, y, w, h, 18);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, CANVAS_W / 2, y + 52);
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillStyle = '#4a4a58';
    lines.forEach((line, i) => {
      ctx.fillText(line, CANVAS_W / 2, y + 104 + i * 36);
    });
    const rect = { x: CANVAS_W / 2 - 110, y: y + h - 78, w: 220, h: 56 };
    button(ctx, rect, btnLabel);
    ctx.textAlign = 'left';
    return { id: btn, ...rect };
  }

  function draw(state) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#e9e4d6';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (state.screen === SCREENS.TITLE) {
      drawTitle(state);
      return;
    }

    drawHud(state);
    drawPanel(state, LEFT_X, 'A');
    drawPanel(state, RIGHT_X, 'B');
    const regions = hitRegions(state);
    drawBottomBar(state, regions);

    if (state.celebrationUntil && state.screen === SCREENS.PLAY) {
      ctx.fillStyle = GREEN;
      ctx.font = 'bold 44px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('All found!', CANVAS_W / 2, PANEL_Y + PANEL_H / 2);
      ctx.textAlign = 'left';
    }

    if (state.screen === SCREENS.LEVEL_DONE) {
      const s = state.levelStats;
      const next = overlayCard(
        state,
        'Level complete!',
        [
          `You found all ${s.found} differences.`,
          `Time bonus +${s.timeBonus} · Level points ${s.points}`,
          `Total score ${state.score}`,
        ],
        'next',
        state.levelIndex + 1 < SCENES.length ? 'Next level' : 'See results',
      );
      state._regions = { ...regions, next };
    } else if (state.screen === SCREENS.VICTORY) {
      const isBest = state.score > 0 && state.score >= state.best;
      const next = overlayCard(
        state,
        'You found them all!',
        [
          `All ${state.totalDiffs} differences across 3 scenes.`,
          `Final score ${state.score}${isBest ? ' — new best!' : ` · Best ${state.best}`}`,
          'Thanks for playing Twin Scenes.',
        ],
        'again',
        'Play again',
      );
      state._regions = { ...regions, again: next };
    } else if (state.screen === SCREENS.TIME_UP) {
      const scene = sceneOf(state);
      const next = overlayCard(
        state,
        'Time’s up!',
        [
          `You found ${state.found.size} of ${scene.diffs.length} differences in ${scene.name}.`,
          'A wrong click costs 3 seconds — take your time.',
          `Score so far ${state.score}`,
        ],
        'retry',
        'Try again',
      );
      state._regions = { ...regions, retry: next };
    } else {
      state._regions = regions;
    }
  }

  function drawTitle(state) {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#23232e');
    grad.addColorStop(1, '#4a4a6e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TWIN SCENES', CANVAS_W / 2, 150);
    ctx.fillStyle = '#ffd93b';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('spot the difference', CANVAS_W / 2, 205);
    ctx.fillStyle = '#d8d8e2';
    ctx.font = '21px system-ui, sans-serif';
    ctx.fillText('Two pictures side by side. Only a few details changed.', CANVAS_W / 2, 270);
    ctx.fillText('Click a difference in either picture to circle it.', CANVAS_W / 2, 302);
    ctx.fillText('Wrong clicks cost 3 seconds. Hints (H) point one out.', CANVAS_W / 2, 334);

    // Level cards.
    SCENES.forEach((scene, i) => {
      const x = 220 + i * 300;
      const y = 390;
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      roundRectPath(ctx, x, y, 260, 120, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2;
      roundRectPath(ctx, x, y, 260, 120, 14);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene.name, x + 130, y + 34);
      ctx.fillStyle = '#d8d8e2';
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(`${scene.diffs.length} differences · ${fmtTime(scene.time)}`, x + 130, y + 70);
      ctx.fillText(`Press ${i + 1} to start here`, x + 130, y + 98);
    });

    const rect = { x: CANVAS_W / 2 - 110, y: 560, w: 220, h: 60 };
    button(ctx, rect, 'Start playing');
    ctx.fillStyle = '#b9b9c6';
    ctx.font = '17px system-ui, sans-serif';
    ctx.fillText(`Best score ${state.best} · Enter to start · M to mute`, CANVAS_W / 2, 660);
    ctx.textAlign = 'left';
    state._regions = { start: rect };
  }

  function hitRegions(state) {
    return {
      hint: { x: 1000, y: BAR_Y + 26, w: 110, h: 46 },
      restart: { x: 1120, y: BAR_Y + 26, w: 120, h: 46 },
    };
  }

  return { draw, hitRegions };
}
