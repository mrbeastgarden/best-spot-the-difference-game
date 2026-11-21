// Twin Scenes: the three original scenes.
// One file, one job: every picture and every difference, drawn in code.
// Each scene draws the SAME layout twice (variant 'A' and 'B'); the entries in
// `diffs` are the only places the two variants disagree, at the same (x, y)
// in both panels. Coordinates live in panel space: 600 wide, 560 tall.

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 8 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal, center = '#ffdf3e') {
  for (let i = 0; i < 6; i += 1) {
    const a = (i * Math.PI) / 3;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 5, center);
}

function stripes(ctx, x, y, w, h, c1, c2, n) {
  for (let i = 0; i < n; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? c1 : c2;
    ctx.fillRect(x + (w / n) * i, y, w / n + 1, h);
  }
}

// ---------------------------------------------------------------------------
// Level 1 — Sunny Garden (5 differences, 90 seconds)
// ---------------------------------------------------------------------------
function drawGarden(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#8fd4ff');
  sky.addColorStop(1, '#e8f8ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 360);

  // Sun — difference 1: rays and a smile in A, a plain disc in B.
  if (v === 'A') {
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(a) * 50, 80 + Math.sin(a) * 50);
      ctx.lineTo(90 + Math.cos(a) * 64, 80 + Math.sin(a) * 64);
      ctx.stroke();
    }
  }
  circle(ctx, 90, 80, 42, '#ffd93b');
  if (v === 'A') {
    circle(ctx, 78, 74, 4, '#7a4a00');
    circle(ctx, 102, 74, 4, '#7a4a00');
    ctx.strokeStyle = '#7a4a00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(90, 84, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  cloud(ctx, 210, 70, 1);
  if (v === 'A') cloud(ctx, 430, 55, 1.1); // difference 2: this cloud is gone in B
  cloud(ctx, 520, 130, 0.8);

  // Hills.
  ellipse(ctx, 150, 580, 330, 200, '#7ec850');
  ellipse(ctx, 490, 600, 320, 190, '#68b844');

  // Path from the door.
  poly(ctx, [[240, 470], [282, 470], [305, 560], [215, 560]], '#f2d8a7');

  // House.
  rr(ctx, 170, 300, 160, 170, 6, '#fff3d6');
  poly(ctx, [[150, 304], [350, 304], [250, 208]], '#e2725b');
  circle(ctx, 250, 232, 14, '#ffe9a8');
  rr(ctx, 232, 382, 52, 88, 4, '#8b5a2b');
  circle(ctx, 272, 428, 4, '#ffd93b');
  // Left window — difference 4: yellow curtains in A, blue shutters in B.
  rr(ctx, 188, 328, 42, 42, 4, v === 'A' ? '#ffd93b' : '#5b8dd9');
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(188, 328, 42, 42);
  ctx.beginPath();
  ctx.moveTo(209, 328);
  ctx.lineTo(209, 370);
  ctx.moveTo(188, 349);
  ctx.lineTo(230, 349);
  ctx.stroke();
  // Right window, same in both.
  rr(ctx, 288, 328, 42, 42, 4, '#bfe8ff');
  ctx.strokeRect(288, 328, 42, 42);
  ctx.beginPath();
  ctx.moveTo(309, 328);
  ctx.lineTo(309, 370);
  ctx.moveTo(288, 349);
  ctx.lineTo(330, 349);
  ctx.stroke();

  // Tree with apples — difference 3: the top apple is missing in B.
  rr(ctx, 458, 330, 18, 140, 6, '#7a4a21');
  circle(ctx, 428, 302, 46, '#4da64d');
  circle(ctx, 492, 292, 50, '#57b957');
  circle(ctx, 466, 250, 48, '#4da64d');
  circle(ctx, 440, 300, 8, '#e23b3b');
  circle(ctx, 490, 320, 8, '#e23b3b');
  if (v === 'A') circle(ctx, 478, 268, 8, '#e23b3b');

  // White picket fence.
  ctx.fillStyle = '#ffffff';
  for (let x = 16; x < 590; x += 30) {
    ctx.fillRect(x, 478, 12, 34);
    poly(ctx, [[x, 478], [x + 12, 478], [x + 6, 466]], '#ffffff');
  }
  ctx.fillRect(10, 492, 580, 5);

  // Flowers — difference 5: this one is red in A, yellow in B.
  flower(ctx, 60, 528, '#ff5d8f');
  flower(ctx, 120, 538, v === 'A' ? '#e23b3b' : '#ffd93b');
  flower(ctx, 180, 522, '#ff8fd1');
  flower(ctx, 330, 532, '#b388ff');
  flower(ctx, 400, 526, '#ff5d8f');
  flower(ctx, 540, 538, '#ffffff');
  flower(ctx, 560, 520, '#ffd93b');

  // A butterfly over the flowers, same in both.
  ctx.fillStyle = '#ff8fd1';
  ellipse(ctx, 356, 520, 7, 4, '#ff8fd1');
  ellipse(ctx, 368, 520, 7, 4, '#ff8fd1');
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(360, 514, 3, 12);

  // A bird, same in both.
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(340, 132, 10, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(360, 132, 10, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 2 — Harbour at Dusk (7 differences, 120 seconds)
// ---------------------------------------------------------------------------
function drawHarbour(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#ff9a5c');
  sky.addColorStop(0.55, '#c65d8f');
  sky.addColorStop(1, '#5b4a8a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);

  // Setting sun, half below the horizon.
  circle(ctx, 480, 292, 46, '#ff7b2f');
  ctx.fillStyle = '#5b4a8a';
  ctx.fillRect(0, 300, 600, 8);

  // Early stars.
  ctx.fillStyle = '#fff8d6';
  [[80, 40], [180, 70], [300, 36], [540, 48], [560, 110], [120, 130]].forEach(([x, y]) => {
    circle(ctx, x, y, 2.5, '#fff8d6');
  });

  // Sea.
  const sea = ctx.createLinearGradient(0, 300, 0, 560);
  sea.addColorStop(0, '#3a5a8c');
  sea.addColorStop(1, '#22386a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 600, 260);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const y = 340 + i * 42;
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 20) {
      const yy = y + Math.sin(x / 55 + i * 2) * 5;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Gull — difference 4: this one only flies in A.
  function gull(x, y) {
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x - 9, y, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(x + 9, y, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  gull(150, 90);
  gull(300, 70);
  if (v === 'A') gull(350, 95);

  // Lighthouse — differences 1 (lamp) and 2 (flag).
  rr(ctx, 506, 170, 52, 130, 4, '#f5f0e6');
  ctx.fillStyle = '#e2725b';
  ctx.fillRect(506, 200, 52, 18);
  ctx.fillRect(506, 248, 52, 18);
  rr(ctx, 498, 148, 68, 24, 4, '#3a3a3a');
  if (v === 'A') {
    circle(ctx, 532, 140, 16, '#ffe45c');
    ctx.strokeStyle = 'rgba(255, 228, 92, 0.8)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(532 + Math.cos(a) * 22, 140 + Math.sin(a) * 22);
      ctx.lineTo(532 + Math.cos(a) * 32, 140 + Math.sin(a) * 32);
      ctx.stroke();
    }
  } else {
    circle(ctx, 532, 140, 16, '#4a4a55');
  }
  // Flag on the lighthouse roof.
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(532, 148);
  ctx.lineTo(532, 108);
  ctx.stroke();
  poly(ctx, [[532, 108], [566, 116], [532, 126]], v === 'A' ? '#e23b3b' : '#3b7ddb');

  // Sailboat — difference 3: plain white sail in A, red stripes in B.
  poly(ctx, [[250, 292], [250, 378], [306, 378]], '#ffffff');
  if (v === 'B') {
    ctx.strokeStyle = '#e23b3b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(258, 330);
    ctx.lineTo(282, 330);
    ctx.moveTo(258, 356);
    ctx.lineTo(292, 356);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(250, 288);
  ctx.lineTo(250, 380);
  ctx.stroke();
  poly(ctx, [[210, 380], [310, 380], [292, 404], [228, 404]], '#8b5a2b');
  // A soft reflection shimmer under the sailboat.
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(228, 414);
  ctx.lineTo(292, 414);
  ctx.moveTo(240, 424);
  ctx.lineTo(280, 424);
  ctx.stroke();
  // Rowboat.
  poly(ctx, [[90, 452], [160, 452], [146, 470], [104, 470]], '#a06a35');

  // Fish — difference 7: jumping out of the sea only in A.
  if (v === 'A') {
    ellipse(ctx, 400, 428, 16, 7, '#9fd8ff');
    poly(ctx, [[414, 428], [428, 420], [428, 436]], '#9fd8ff');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(400, 448, 14, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }

  // Pier with crates and a lantern — differences 5 and 6.
  ctx.fillStyle = '#6b4a2b';
  ctx.fillRect(0, 400, 210, 14);
  ctx.fillStyle = '#5a3d22';
  [30, 80, 130, 180].forEach((x) => ctx.fillRect(x, 414, 10, 60));
  // Crates: three in A, two in B.
  ctx.fillStyle = '#c98f4e';
  ctx.fillRect(60, 372, 28, 28);
  ctx.fillRect(92, 372, 28, 28);
  if (v === 'A') ctx.fillRect(76, 344, 28, 28);
  ctx.strokeStyle = '#8a5f2e';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 372, 28, 28);
  ctx.strokeRect(92, 372, 28, 28);
  if (v === 'A') ctx.strokeRect(76, 344, 28, 28);
  // Lantern on the pier post: lit in A, dark in B.
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(176, 336, 6, 64);
  if (v === 'A') {
    circle(ctx, 179, 330, 18, 'rgba(255, 200, 80, 0.35)');
    circle(ctx, 179, 330, 10, '#ffd93b');
  } else {
    circle(ctx, 179, 330, 10, '#5a5a66');
  }
}

// ---------------------------------------------------------------------------
// Level 3 — Night Market (10 differences, 150 seconds)
// ---------------------------------------------------------------------------
function drawMarket(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 430);
  sky.addColorStop(0, '#141a3a');
  sky.addColorStop(1, '#2a2f5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 430);

  // Stars — difference 8: this one only shines in A.
  ctx.fillStyle = '#fff8d6';
  [[60, 90], [200, 40], [330, 80], [430, 40], [90, 150], [300, 55], [470, 120]].forEach(([x, y]) => {
    star(ctx, x, y, 4, '#fff8d6');
  });
  if (v === 'A') star(ctx, 120, 60, 5, '#fff8d6');

  // Moon — difference 1: crescent in A, full in B.
  circle(ctx, 520, 70, 30, '#ffe9a8');
  if (v === 'A') circle(ctx, 534, 62, 26, '#1c2247');

  // Street.
  ctx.fillStyle = '#2a2140';
  ctx.fillRect(0, 430, 600, 130);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let x = 20; x < 600; x += 46) {
    for (let y = 450; y < 550; y += 34) circle(ctx, x + ((y / 34) % 2) * 18, y, 4, 'rgba(255,255,255,0.08)');
  }

  function stall(x, awningA, awningB) {
    // Counter and posts.
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(x, 330, 160, 100);
    ctx.fillStyle = '#5d3d22';
    ctx.fillRect(x, 330, 160, 12);
    ctx.fillStyle = '#4a3018';
    ctx.fillRect(x + 8, 190, 10, 140);
    ctx.fillRect(x + 142, 190, 10, 140);
    // Striped awning.
    stripes(ctx, x - 6, 150, 172, 42, awningA, awningB, 8);
    ctx.fillStyle = awningA;
    ctx.fillRect(x - 6, 188, 172, 6);
  }

  // Stall 1 (left): fruit basket — difference 6: oranges in A, green apples in B.
  stall(40, '#e23b3b', '#ffffff');
  ctx.fillStyle = '#8a5f2e';
  ctx.fillRect(118, 396, 52, 22);
  for (let i = 0; i < 3; i += 1) {
    circle(ctx, 128 + i * 16, 392, 9, v === 'A' ? '#ff8c1a' : '#7ec850');
  }

  // Stall 2 (middle): jars, vendor, banner — differences 4, 5, 9, 10.
  stall(240, '#2a9d8f', '#ffffff');
  // Vendor — difference 9: straw hat in A, dark cap in B.
  circle(ctx, 268, 268, 22, '#f2c29b');
  if (v === 'A') {
    ellipse(ctx, 268, 252, 30, 9, '#e8c96a');
    circle(ctx, 268, 246, 14, '#e8c96a');
  } else {
    circle(ctx, 268, 250, 15, '#3a3a55');
    rr(ctx, 252, 250, 34, 7, 3, '#3a3a55');
  }
  rr(ctx, 246, 290, 44, 42, 8, '#4a6fa5');
  // Jars on the counter: three in A, two in B.
  rr(ctx, 312, 296, 20, 34, 6, '#ffb703');
  rr(ctx, 338, 296, 20, 34, 6, '#2ec4b6');
  if (v === 'A') rr(ctx, 364, 296, 20, 34, 6, '#e07a5f');
  // Banner with a star — difference 5: the star is only there in A.
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(280, 118, 80, 26);
  if (v === 'A') star(ctx, 320, 131, 9, '#e23b3b');

  // Stall 3 (right): awning colour — difference 7: purple in A, pink in B.
  stall(440, v === 'A' ? '#7b5ea7' : '#e58bb1', '#ffffff');
  // Sign on stall 3 — difference 10: round in A, square in B.
  if (v === 'A') circle(ctx, 500, 250, 18, '#ffd93b');
  else rr(ctx, 482, 232, 36, 36, 4, '#ffd93b');
  ctx.fillStyle = '#7a4a00';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★', 500, 256);

  // Hanging lanterns — difference 2: the left one is red in A, green in B.
  function lantern(x, y, colour) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x, y - 12);
    ctx.stroke();
    circle(ctx, x, y, 14, colour);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x - 8, y - 8, 4, 12);
  }
  lantern(200, 182, v === 'A' ? '#e23b3b' : '#3fae5a');
  lantern(408, 176, '#ffd93b');
  lantern(560, 190, '#e07a5f');

  // Cat on a crate — difference 3: only in A.
  ctx.fillStyle = '#8a5f2e';
  ctx.fillRect(396, 452, 56, 40);
  if (v === 'A') {
    ctx.fillStyle = '#3a3a3a';
    ellipse(ctx, 424, 442, 22, 12, '#3a3a3a');
    circle(ctx, 442, 428, 11, '#3a3a3a');
    poly(ctx, [[436, 420], [440, 408], [446, 419]], '#3a3a3a');
    poly(ctx, [[446, 420], [450, 408], [452, 420]], '#3a3a3a');
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(404, 444);
    ctx.quadraticCurveTo(392, 430, 400, 418);
    ctx.stroke();
  }
}

export const SCENES = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    time: 90,
    draw: drawGarden,
    diffs: [
      { x: 90, y: 80, r: 58, label: 'the smiling sun' },
      { x: 430, y: 55, r: 48, label: 'the missing cloud' },
      { x: 478, y: 268, r: 18, label: 'the missing apple' },
      { x: 209, y: 349, r: 30, label: 'the window curtains' },
      { x: 120, y: 538, r: 16, label: 'the red flower' },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    time: 120,
    draw: drawHarbour,
    diffs: [
      { x: 532, y: 140, r: 22, label: 'the lighthouse lamp' },
      { x: 549, y: 117, r: 18, label: 'the lighthouse flag' },
      { x: 268, y: 335, r: 45, label: 'the striped sail' },
      { x: 350, y: 95, r: 20, label: 'the missing gull' },
      { x: 88, y: 360, r: 28, label: 'the top crate' },
      { x: 179, y: 330, r: 22, label: 'the pier lantern' },
      { x: 404, y: 432, r: 26, label: 'the jumping fish' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    time: 150,
    draw: drawMarket,
    diffs: [
      { x: 520, y: 70, r: 30, label: 'the moon' },
      { x: 200, y: 182, r: 20, label: 'the green lantern' },
      { x: 424, y: 436, r: 26, label: 'the black cat' },
      { x: 364, y: 313, r: 22, label: 'the third jar' },
      { x: 320, y: 131, r: 18, label: 'the banner star' },
      { x: 144, y: 394, r: 24, label: 'the fruit basket' },
      { x: 520, y: 172, r: 30, label: 'the pink awning' },
      { x: 120, y: 60, r: 16, label: 'the missing star' },
      { x: 268, y: 250, r: 26, label: 'the vendor’s hat' },
      { x: 500, y: 250, r: 22, label: 'the square sign' },
    ],
  },
];
