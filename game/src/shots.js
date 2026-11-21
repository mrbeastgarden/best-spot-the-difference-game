// Twin Scenes: staged scenes for screenshots.
// One file, one job: put the game in the exact state each screenshot shows.
// ?shot=start -> title screen. ?shot=play -> Harbour mid-game, 2 of 7 found,
// several still unfound, counter visible. ?shot=end -> victory screen.
import { SCREENS } from './config.js';
import { startGame, startLevel } from './state.js';

export function stageShot(name, state) {
  if (name === 'start') {
    state.screen = SCREENS.TITLE;
    return;
  }
  if (name === 'play') {
    startLevel(state, 1);
    // Two differences already circled, five still to find.
    state.found = new Set([0, 3]);
    state.foundOrder = [0, 3];
    state.totalFound = 2;
    state.score = 200;
    state.levelScore = 200;
    state.timeLeft = 84;
    state.hintsLeft = 2;
    state.hint = null;
    state.wrong = null;
    state.toast = { text: 'Found: the missing gull! +100', until: state.now + 100000 };
    return;
  }
  if (name === 'end') {
    startGame(state);
    state.screen = SCREENS.VICTORY;
    state.score = 2850;
    state.totalFound = 22;
    if (state.score > state.best) state.best = state.score;
  }
}
