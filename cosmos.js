// DIGIVO — Cosmic Background Engine v4 (Delta-Time 60/120fps Smooth Flow)
(() => {
  const canvas = document.getElementById("cosmosCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // Palet biru & navy sesuai identitas awal DIGIVO
  const PALETTE = [
    "23, 104, 232",  // #1768e8
    "13, 79, 189",   // #0d4fbd
    "46, 131, 255",  // #2e83ff
    "21, 34, 57"     // #152239
  ];

  const LINK_DIST = 140;
  const MOUSE_DIST = 190;

  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let meteors = [];
  let rings = [];
  let ripples = [];
  let nextMeteorAt = 0;

  // Lerp state untuk gerakan kursor & scroll yang super mulus
  let mouse = {
    x: -9999, y: -9999,
    sx: -9999, sy: -9999,
    tx: 0, ty: 0,
    ox: 0, oy: 0,
    active: false
  };
  let targetScrollY = window.scrollY || 0;
  let smoothScrollY = targetScrollY;
  let lastTime = performance.now();
  let rafId = 0;

  function makeStar() {
    const depth = 0.15 + Math.random() * 0.85;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      depth,
      isSparkle: false,
      r: 0.85 + depth * 1.55,
      baseVx: (Math.random() - 0.5) * (10 + depth * 14), // px per detik
      baseVy: -(14 + depth * 28),                        // px per detik
      waveAmp: 4 + depth * 8,
      waveFreq: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      a: 0.34 + depth * 0.5,
      tw: Math.random() * Math.PI * 2,
      ts: 1.2 + Math.random() * 1.8, // rad per detik
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.9,
      c: PALETTE[(Math.random() * PALETTE.length) | 0]
    };
  }

  function makeRings() {
    const minDim = Math.min(w, h);
    rings = [
      {
        xr: 0.82, yr: 0.24,
        radius: Math.max(170, minDim * 0.31),
        angle: 0, speed: 0.11, // rad per detik
        dash: [6, 10],
        satellites: 2,
        alpha: 0.15
      },
      {
        xr: 0.14, yr: 0.7,
        radius: Math.max(145, minDim * 0.25),
        angle: 1.4, speed: -0.09,
        dash: [3, 9],
        satellites: 3,
        alpha: 0.13
      },
      {
        xr: 0.5, yr: 0.48,
        radius: Math.max(250, minDim * 0.46),
        angle: 0.7, speed: 0.055,
        dash: [10, 16],
        satellites: 2,
        alpha: 0.085
      }
    ];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(window.innerWidth || 1280, 320);
    h = Math.max(window.innerHeight || 720, 320);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(175, Math.max(70, (w * h) / 9000)));
    stars = Array.from({ length: count }, makeStar);
    makeRings();
  }

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.65;
    const speed = 420 + Math.random() * 240; // px per detik
    const angle = fromLeft
      ? (Math.PI * 0.13 + Math.random() * 0.12)
      : (Math.PI * 0.87 - Math.random() * 0.12);
    meteors.push({
      x: fromLeft ? Math.random() * w * 0.55 : w * 0.45 + Math.random() * w * 0.55,
      y: Math.random() * h * 0.42,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 85 + Math.random() * 55,
      age: 0,
      duration: 0.85 + Math.random() * 0.45 // detik
    });
  }

  function drawFourPointStar(x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    const outer = size * 2.2;
    const inner = size * 0.5;
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / 4;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawRings(dt) {
    for (let i = 0; i < rings.length; i++) {
      const rg = rings[i];
      rg.angle += rg.speed * dt;
      const cx = rg.xr * w + mouse.ox * 16;
      const cy = rg.yr * h + mouse.oy * 16 - (smoothScrollY * 0.05) % h;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rg.angle);

      ctx.setLineDash(rg.dash);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(23, 104, 232, ${rg.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(23, 104, 232, ${rg.alpha * 0.42})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();

      for (let s = 0; s < rg.satellites; s++) {
        const satAngle = (s * Math.PI * 2) / rg.satellites;
        const sx = Math.cos(satAngle) * rg.radius;
        const sy = Math.sin(satAngle) * rg.radius;

        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
        glow.addColorStop(0, "rgba(23, 104, 232, 0.35)");
        glow.addColorStop(1, "rgba(23, 104, 232, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(23, 104, 232, 0.72)";
        ctx.beginPath();
        ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function draw(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    const tSec = now * 0.001;

    ctx.clearRect(0, 0, w, h);

    // Smooth interpolation (lerp) berbasis waktu
    const lerpFactor = 1 - Math.pow(0.0015, dt);
    mouse.ox += (mouse.tx - mouse.ox) * lerpFactor;
    mouse.oy += (mouse.ty - mouse.oy) * lerpFactor;
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.0001, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.0001, dt));
    smoothScrollY += (targetScrollY - smoothScrollY) * (1 - Math.pow(0.0005, dt));

    // Soft glow mengikuti kursor
    if (mouse.active) {
      const cg = ctx.createRadialGradient(mouse.sx, mouse.sy, 0, mouse.sx, mouse.sy, 220);
      cg.addColorStop(0, "rgba(23, 104, 232, 0.065)");
      cg.addColorStop(1, "rgba(23, 104, 232, 0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mouse.sx, mouse.sy, 220, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRings(dt);

    const pos = new Array(stars.length);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.baseVx * dt;
      s.y += s.baseVy * dt;
      s.tw += s.ts * dt;
      s.rot += s.rotSpeed * dt;

      if (s.y < -20) { s.y = h + 20; s.x = Math.random() * w; }
      if (s.y > h + 20) { s.y = -20; s.x = Math.random() * w; }
      if (s.x < -20) s.x = w + 20;
      if (s.x > w + 20) s.x = -20;

      // Gerakan mengalun sinusoidal yang sangat halus
      const waveX = Math.sin(tSec * s.waveFreq + s.phase) * s.waveAmp;
      const px = s.x + waveX + mouse.ox * s.depth * 22;
      let py = s.y + mouse.oy * s.depth * 22 - (smoothScrollY * s.depth * 0.09) % (h + 40);
      if (py < -20) py += h + 40;
      pos[i] = [px, py];
    }

    // Garis rasi bintang
    ctx.lineWidth = 0.8;
    for (let i = 0; i < stars.length; i++) {
      if (stars[i].depth < 0.34) continue;
      const x1 = pos[i][0], y1 = pos[i][1];

      if (mouse.active) {
        const mdx = x1 - mouse.sx, mdy = y1 - mouse.sy;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_DIST * MOUSE_DIST) {
          const mAlpha = (1 - Math.sqrt(md2) / MOUSE_DIST) * 0.25;
          ctx.strokeStyle = `rgba(23, 104, 232, ${mAlpha})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mouse.sx, mouse.sy);
          ctx.stroke();
        }
      }

      for (let j = i + 1; j < stars.length; j++) {
        if (stars[j].depth < 0.34) continue;
        const dx = x1 - pos[j][0], dy = y1 - pos[j][1];
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.19;
          ctx.strokeStyle = `rgba(23, 104, 232, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(pos[j][0], pos[j][1]);
          ctx.stroke();
        }
      }
    }

    // Bintang & kilau
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const [x, y] = pos[i];
      const pulse = 0.62 + 0.38 * Math.sin(s.tw);
      const alpha = s.a * pulse;

      if (s.depth > 0.68) {
        const haloR = s.r * 4.8;
        const g = ctx.createRadialGradient(x, y, 0, x, y, haloR);
        g.addColorStop(0, `rgba(${s.c}, ${alpha * 0.38})`);
        g.addColorStop(1, `rgba(${s.c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.isSparkle) {
        drawFourPointStar(x, y, s.r, s.rot, s.c, Math.min(1, alpha * 1.1));
      } else {
        ctx.fillStyle = `rgba(${s.c}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Gelombang riak saat klik
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += 140 * dt;
      rp.alpha *= Math.pow(0.12, dt);
      ctx.strokeStyle = `rgba(23, 104, 232, ${rp.alpha})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
      if (rp.alpha < 0.015) ripples.splice(i, 1);
    }

    // Bintang jatuh / komet mulus
    if (now > nextMeteorAt && meteors.length < 2) {
      spawnMeteor();
      nextMeteorAt = now + 2800 + Math.random() * 3500;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.age += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const p = Math.min(1, m.age / m.duration);
      const fade = Math.sin(p * Math.PI); // kurva masuk & keluar yang halus

      const speed = Math.hypot(m.vx, m.vy) || 1;
      const tailX = m.x - (m.vx / speed) * m.len;
      const tailY = m.y - (m.vy / speed) * m.len;

      const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      g.addColorStop(0, `rgba(23, 104, 232, ${0.82 * fade})`);
      g.addColorStop(0.4, `rgba(46, 131, 255, ${0.38 * fade})`);
      g.addColorStop(1, "rgba(23, 104, 232, 0)");

      ctx.strokeStyle = g;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.fillStyle = `rgba(23, 104, 232, ${0.88 * fade})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      if (p >= 1 || m.x < -140 || m.x > w + 140 || m.y > h + 140) {
        meteors.splice(i, 1);
      }
    }
  }

  function loop(now) {
    draw(now || performance.now());
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(rafId);
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); start(); }, 120);
  });

  window.addEventListener("mousemove", e => {
    if (!mouse.active) {
      mouse.sx = e.clientX;
      mouse.sy = e.clientY;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.tx = (e.clientX / w - 0.5) * 2;
    mouse.ty = (e.clientY / h - 0.5) * 2;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.tx = 0;
    mouse.ty = 0;
  }, { passive: true });

  window.addEventListener("click", e => {
    ripples.push({ x: e.clientX, y: e.clientY, r: 6, alpha: 0.34 });
  }, { passive: true });

  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY || 0;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });

  resize();
  spawnMeteor();
  nextMeteorAt = performance.now() + 2000;
  start();
})();
