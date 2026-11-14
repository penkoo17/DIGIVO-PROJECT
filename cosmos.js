// DIGIVO — Cosmic 3D Interactive Background Engine v7 (Sprite-Cached & GPU-Friendly)
// Fitur lengkap: 3D Depth Starfield · 4-Point Cosmic Sparkles · 3D Tilted Orbital Rings & Satellites
//                Spring Repulsion Physics · Constellation Web · Click/Tap Shockwave & Burst · Comets
//                Kompatibel di PC (mouse), HP & Tablet (touch + gyroscope).
(() => {
  const canvas = document.getElementById("cosmosCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PALETTE = [
    "23, 104, 232",  // #1768e8 (Primary Blue)
    "13, 79, 189",   // #0d4fbd (Deep Blue)
    "46, 131, 255",  // #2e83ff (Bright Blue)
    "15, 29, 51"     // #0f1d33 (Navy / Black)
  ];
  const TAU = Math.PI * 2;

  let w = 0, h = 0, dpr = 1;
  let isMobile = false;
  let linkDist = 140;
  let mouseDist = 195;
  let repelDist = 130;

  let stars = [];
  let meteors = [];
  let rings = [];
  let ripples = [];
  let bursts = [];
  let nextMeteorAt = 0;

  const mouse = {
    x: -9999, y: -9999,
    sx: -9999, sy: -9999,
    tx: 0, ty: 0,
    ox: 0, oy: 0,
    active: false,
    energy: 0
  };
  let targetScrollY = window.scrollY || 0;
  let smoothScrollY = targetScrollY;
  let lastTime = performance.now();
  let rafId = 0;

  // Pre-rendered glow sprites (menghindari createRadialGradient di setiap frame)
  function makeGlowSprite(rgb, size, peakAlpha = 0.85) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const half = size / 2;
    const grd = g.createRadialGradient(half, half, 0, half, half, half);
    grd.addColorStop(0, `rgba(${rgb}, ${peakAlpha})`);
    grd.addColorStop(0.35, `rgba(${rgb}, ${peakAlpha * 0.3})`);
    grd.addColorStop(1, `rgba(${rgb}, 0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }

  const GLOW_SPRITES = PALETTE.map(c => makeGlowSprite(c, 48, 0.85));
  const CURSOR_GLOW = makeGlowSprite("23, 104, 232", 256, 0.085);

  function makeStar() {
    const depth = 0.15 + Math.random() * 0.85;
    const isSparkle = depth > 0.74 && Math.random() < 0.4;
    const ci = (Math.random() * PALETTE.length) | 0;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      depth,
      isSparkle,
      r: 0.85 + depth * (isSparkle ? 1.8 : 1.5),
      baseVx: (Math.random() - 0.5) * (10 + depth * 14),
      baseVy: -(12 + depth * 26),
      waveAmp: 4 + depth * 7,
      waveFreq: 0.4 + Math.random() * 0.55,
      phase: Math.random() * TAU,
      a: 0.36 + depth * 0.5,
      tw: Math.random() * TAU,
      ts: 1.2 + Math.random() * 1.8,
      rot: Math.random() * TAU,
      rotSpeed: (Math.random() - 0.5) * 1.0,
      ox: 0, oy: 0,
      vx: 0, vy: 0,
      hot: 0,
      ci,
      c: PALETTE[ci]
    };
  }

  function makeRings() {
    const minDim = Math.min(w, h);
    rings = [
      {
        xr: 0.82, yr: 0.24,
        radius: Math.max(160, minDim * 0.31),
        tilt: 0.62, tiltRot: -0.32,
        angle: 0, speed: 0.12,
        dash: [6, 10],
        satellites: 2,
        alpha: 0.16,
        depth: 0.85
      },
      {
        xr: 0.14, yr: 0.72,
        radius: Math.max(135, minDim * 0.25),
        tilt: 0.58, tiltRot: 0.38,
        angle: 1.4, speed: -0.095,
        dash: [3, 9],
        satellites: 3,
        alpha: 0.14,
        depth: 0.7
      },
      {
        xr: 0.5, yr: 0.48,
        radius: Math.max(230, minDim * 0.44),
        tilt: 0.74, tiltRot: -0.18,
        angle: 0.7, speed: 0.055,
        dash: [10, 16],
        satellites: 2,
        alpha: 0.09,
        depth: 0.45
      }
    ];
  }

  function resize() {
    isMobile = window.innerWidth <= 768;
    // Cap DPR di 1.5 untuk efisiensi GPU maksimal tanpa mengorbankan ketajaman
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.max(window.innerWidth || 1280, 320);
    h = Math.max(window.innerHeight || 720, 320);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    linkDist = isMobile ? 110 : 140;
    mouseDist = isMobile ? 155 : 195;
    repelDist = isMobile ? 100 : 130;

    const density = isMobile ? 13500 : 11500;
    const count = Math.round(Math.min(125, Math.max(52, (w * h) / density)));
    stars = Array.from({ length: count }, makeStar);
    makeRings();
  }

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.65;
    const speed = 420 + Math.random() * 240;
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
      duration: 0.85 + Math.random() * 0.45
    });
  }

  function spawnCosmicBurst(x, y) {
    ripples.push({ x, y, r: 6, alpha: 0.36, speed: 165 });
    ripples.push({ x, y, r: 2, alpha: 0.22, speed: 95 });
    const count = isMobile ? 8 : 11;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + (Math.random() - 0.5) * 0.35;
      const spd = 65 + Math.random() * 140;
      bursts.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        r: 1.2 + Math.random() * 1.4,
        rot: Math.random() * Math.PI,
        age: 0,
        duration: 0.55 + Math.random() * 0.35,
        sparkle: i % 2 === 0,
        c: PALETTE[i % PALETTE.length]
      });
    }
    const boostR = repelDist * 1.35;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dx = s.x - x, dy = s.y - y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < boostR) {
        const force = (1 - dist / boostR) * 145 * s.depth;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
        s.hot = Math.min(1, s.hot + 0.75);
      }
    }
  }

  function drawFourPointStar(x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    const outer = size * 2.25;
    const inner = size * 0.48;
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
    const satSprite = GLOW_SPRITES[0];
    for (let i = 0; i < rings.length; i++) {
      const rg = rings[i];
      rg.angle += rg.speed * dt;
      const cx = rg.xr * w + mouse.ox * 22 * rg.depth;
      const cy = rg.yr * h + mouse.oy * 22 * rg.depth - (smoothScrollY * 0.05 * rg.depth) % h;

      const dynamicTilt = Math.max(0.36, Math.min(0.92, rg.tilt + mouse.oy * 0.08));
      const dynamicRot = rg.tiltRot + mouse.ox * 0.08;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(dynamicRot);
      ctx.scale(1, dynamicTilt);

      ctx.save();
      ctx.rotate(rg.angle);
      ctx.setLineDash(rg.dash);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(23, 104, 232, ${rg.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius, 0, TAU);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(15, 29, 51, ${rg.alpha * 0.48})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius * 0.72, 0, TAU);
      ctx.stroke();
      ctx.restore();

      for (let s = 0; s < rg.satellites; s++) {
        const satAngle = rg.angle + (s * TAU) / rg.satellites;
        const sx = Math.cos(satAngle) * rg.radius;
        const sy = Math.sin(satAngle) * rg.radius;
        const depthScale = 0.78 + 0.28 * Math.sin(satAngle);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(1, 1 / dynamicTilt);

        const gSize = 22 * depthScale;
        ctx.globalAlpha = 0.55 * depthScale;
        ctx.drawImage(satSprite, -gSize / 2, -gSize / 2, gSize, gSize);
        ctx.globalAlpha = 1;

        ctx.fillStyle = `rgba(23, 104, 232, ${0.78 * depthScale})`;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 * depthScale, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }

  function draw(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    const tSec = now * 0.001;

    ctx.clearRect(0, 0, w, h);

    const lerpFactor = 1 - Math.pow(0.0015, dt);
    mouse.ox += (mouse.tx - mouse.ox) * lerpFactor;
    mouse.oy += (mouse.ty - mouse.oy) * lerpFactor;
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.00008, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.00008, dt));
    mouse.energy += ((mouse.active ? 1 : 0) - mouse.energy) * Math.min(1, dt * 6);
    smoothScrollY += (targetScrollY - smoothScrollY) * (1 - Math.pow(0.0005, dt));

    // Soft glow mengikuti kursor via pre-rendered sprite
    if (mouse.energy > 0.01) {
      const gSize = isMobile ? 320 : 460;
      ctx.globalAlpha = mouse.energy;
      ctx.drawImage(CURSOR_GLOW, mouse.sx - gSize / 2, mouse.sy - gSize / 2, gSize, gSize);
      ctx.globalAlpha = 1;
    }

    drawRings(dt);

    const len = stars.length;
    const posX = new Float32Array(len);
    const posY = new Float32Array(len);
    const repelR2 = repelDist * repelDist;

    for (let i = 0; i < len; i++) {
      const s = stars[i];
      s.x += s.baseVx * dt;
      s.y += s.baseVy * dt;
      s.tw += s.ts * dt;
      s.rot += s.rotSpeed * dt;

      if (s.y < -24) { s.y = h + 24; s.x = Math.random() * w; }
      if (s.y > h + 24) { s.y = -24; s.x = Math.random() * w; }
      if (s.x < -24) s.x = w + 24;
      if (s.x > w + 24) s.x = -24;

      const waveX = Math.sin(tSec * s.waveFreq + s.phase) * s.waveAmp;
      const baseX = s.x + waveX + mouse.ox * s.depth * 26;
      let baseY = s.y + mouse.oy * s.depth * 26 - (smoothScrollY * s.depth * 0.09) % (h + 48);
      if (baseY < -24) baseY += h + 48;

      let fx = 0, fy = 0;
      const curX = baseX + s.ox;
      const curY = baseY + s.oy;
      if (mouse.active) {
        const dx = curX - mouse.sx;
        const dy = curY - mouse.sy;
        if (Math.abs(dx) < repelDist && Math.abs(dy) < repelDist) {
          const d2 = dx * dx + dy * dy;
          if (d2 < repelR2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const norm = 1 - d / repelDist;
            const push = norm * norm * 820 * s.depth;
            fx += (dx / d) * push;
            fy += (dy / d) * push;
            s.hot += (norm - s.hot) * Math.min(1, dt * 10);
          } else {
            s.hot *= Math.pow(0.08, dt);
          }
        } else {
          s.hot *= Math.pow(0.08, dt);
        }
      } else {
        s.hot *= Math.pow(0.08, dt);
      }

      s.vx += (fx - s.ox * 18 - s.vx * 6.5) * dt;
      s.vy += (fy - s.oy * 18 - s.vy * 6.5) * dt;
      s.ox += s.vx * dt;
      s.oy += s.vy * dt;

      posX[i] = baseX + s.ox;
      posY[i] = baseY + s.oy;
    }

    // Garis rasi bintang 3D dengan bounding-box reject cepat
    ctx.lineWidth = 0.85;
    const linkD2 = linkDist * linkDist;
    const mouseD2 = mouseDist * mouseDist;

    for (let i = 0; i < len; i++) {
      if (stars[i].depth < 0.34) continue;
      const x1 = posX[i], y1 = posY[i];

      if (mouse.energy > 0.02) {
        const mdx = x1 - mouse.sx, mdy = y1 - mouse.sy;
        if (Math.abs(mdx) < mouseDist && Math.abs(mdy) < mouseDist) {
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < mouseD2) {
            const mAlpha = (1 - Math.sqrt(md2) / mouseDist) * 0.28 * mouse.energy;
            ctx.strokeStyle = `rgba(23, 104, 232, ${mAlpha})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(mouse.sx, mouse.sy);
            ctx.stroke();
          }
        }
      }

      for (let j = i + 1; j < len; j++) {
        if (stars[j].depth < 0.34) continue;
        const dx = x1 - posX[j];
        if (dx > linkDist || dx < -linkDist) continue;
        const dy = y1 - posY[j];
        if (dy > linkDist || dy < -linkDist) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkD2) {
          const boost = 1 + (stars[i].hot + stars[j].hot) * 0.9;
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.19 * boost;
          ctx.strokeStyle = `rgba(23, 104, 232, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(posX[j], posY[j]);
          ctx.stroke();
        }
      }
    }

    // Bintang 3D & kilau 4-point star (glow via sprite)
    for (let i = 0; i < len; i++) {
      const s = stars[i];
      const x = posX[i], y = posY[i];
      const pulse = 0.62 + 0.38 * Math.sin(s.tw);
      const alpha = Math.min(1, s.a * pulse + s.hot * 0.35);
      const r = s.r * (1 + s.hot * 0.45);

      if (s.depth > 0.66 || s.hot > 0.15) {
        const gSize = r * 9.5;
        ctx.globalAlpha = alpha * 0.55;
        ctx.drawImage(GLOW_SPRITES[s.ci], x - gSize / 2, y - gSize / 2, gSize, gSize);
        ctx.globalAlpha = 1;
      }

      if (s.isSparkle || s.hot > 0.35) {
        drawFourPointStar(x, y, r * 0.95, s.rot, s.c, Math.min(1, alpha * 1.12));
      } else {
        ctx.fillStyle = `rgba(${s.c}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
    }

    // Partikel semburan bintang saat klik / tap
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.age += dt;
      const p = b.age / b.duration;
      if (p >= 1) { bursts.splice(i, 1); continue; }
      const drag = Math.pow(0.06, dt);
      b.vx *= drag;
      b.vy *= drag;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rot += 2.4 * dt;
      const alpha = (1 - p) * 0.85;
      if (b.sparkle) {
        drawFourPointStar(b.x, b.y, b.r * (1 - p * 0.3), b.rot, b.c, alpha);
      } else {
        ctx.fillStyle = `rgba(${b.c}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (1 - p * 0.4), 0, TAU);
        ctx.fill();
      }
    }

    // Gelombang riak (shockwave) saat klik / tap
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed * dt;
      rp.alpha *= Math.pow(0.11, dt);
      ctx.strokeStyle = `rgba(23, 104, 232, ${rp.alpha})`;
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, TAU);
      ctx.stroke();
      if (rp.alpha < 0.012) ripples.splice(i, 1);
    }

    // Bintang jatuh / komet
    if (now > nextMeteorAt && meteors.length < 2) {
      spawnMeteor();
      nextMeteorAt = now + 2800 + Math.random() * 3400;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.age += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const p = Math.min(1, m.age / m.duration);
      const fade = Math.sin(p * Math.PI);

      const speed = Math.hypot(m.vx, m.vy) || 1;
      const tailX = m.x - (m.vx / speed) * m.len;
      const tailY = m.y - (m.vy / speed) * m.len;

      const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      g.addColorStop(0, `rgba(23, 104, 232, ${0.86 * fade})`);
      g.addColorStop(0.42, `rgba(46, 131, 255, ${0.38 * fade})`);
      g.addColorStop(1, "rgba(23, 104, 232, 0)");

      ctx.strokeStyle = g;
      ctx.lineWidth = 1.9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      drawFourPointStar(m.x, m.y, 1.9, tSec * 3, "23, 104, 232", 0.9 * fade);

      if (p >= 1 || m.x < -150 || m.x > w + 150 || m.y > h + 150) {
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
    if (reduceMotion) { draw(lastTime + 16); return; }
    rafId = requestAnimationFrame(loop);
  }

  function updatePointer(clientX, clientY) {
    if (!mouse.active) {
      mouse.sx = clientX;
      mouse.sy = clientY;
    }
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.tx = (clientX / w - 0.5) * 2;
    mouse.ty = (clientY / h - 0.5) * 2;
    mouse.active = true;
  }

  let resizeTimer;
  let prevWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isMobile && Math.abs(window.innerWidth - prevWidth) < 4) return;
      prevWidth = window.innerWidth;
      resize();
      start();
    }, 120);
  });

  window.addEventListener("mousemove", e => updatePointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.tx = 0;
    mouse.ty = 0;
  }, { passive: true });
  window.addEventListener("click", e => {
    if (!reduceMotion) spawnCosmicBurst(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("touchstart", e => {
    if (e.touches && e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchmove", e => {
    if (e.touches && e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchend", () => { mouse.active = false; }, { passive: true });

  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null || e.beta == null || mouse.active) return;
    mouse.tx = Math.max(-1, Math.min(1, e.gamma / 28));
    mouse.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 28));
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
  nextMeteorAt = performance.now() + 1800;
  start();
})();
