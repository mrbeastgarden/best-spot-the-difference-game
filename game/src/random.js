// Twin Scenes: a tiny seeded random generator (mulberry32).
// One file, one job: deterministic numbers from a seed, nothing else.
export function createRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(random, array) {
  return array[Math.floor(random() * array.length)];
}

// A random integer in [min, max): the hint picker uses this, not Math.random,
// so a seeded run stays reproducible.
export function int(random, min, max) {
  return min + Math.floor(random() * (max - min));
}
