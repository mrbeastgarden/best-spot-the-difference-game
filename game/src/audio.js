// Twin Scenes: sound, synthesized with WebAudio — no audio files.
// One file, one job: every beep, ding and fanfare the game makes.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      try {
        const AC = window.AudioContext ?? window.webkitAudioContext;
        ctx = new AC();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, at, dur, type, gain) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + at);
    g.gain.setValueAtTime(0.0001, ac.currentTime + at);
    g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  }

  return {
    unlock() {
      ensure();
    },
    setMuted(value) {
      muted = value;
    },
    isMuted() {
      return muted;
    },
    click() {
      tone(520, 0, 0.07, 'sine', 0.12);
    },
    found() {
      tone(880, 0, 0.12, 'sine', 0.2);
      tone(1318, 0.09, 0.2, 'sine', 0.2);
    },
    wrong() {
      tone(160, 0, 0.18, 'sawtooth', 0.1);
    },
    hint() {
      tone(660, 0, 0.1, 'triangle', 0.14);
      tone(990, 0.08, 0.14, 'triangle', 0.12);
    },
    levelDone() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.18));
    },
    victory() {
      [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.18));
    },
  };
}
