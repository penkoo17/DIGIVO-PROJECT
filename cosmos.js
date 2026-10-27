// DIGIVO — Cosmic 3D Interactive Background Engine v6 (Delta-Time 60/120fps)
// Palet bersih: Putih, Biru (#1768e8, #0d4fbd, #2e83ff), Hitam/Navy (#0f1d33, #152239).
// Fitur: 3D Depth Starfield · 4-Point Cosmic Sparkles · 3D Tilted Orbital Rings & Satellites
//        Spring Repulsion Physics · Constellation Web · Click/Tap Shockwave & Star Burst · Comets
//        Kompatibel di PC (mouse), HP & Tablet (touch + gyroscope).
(() => {
  const canvas = document.getElementById("cosmosCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // Palet biru & navy sesuai identitas awal DIGIVO (tanpa ungu)
  const PALETTE = [
    "23, 104, 232",  // #1768e8 (Primary Blue)
    "13, 79, 189",   // #0d4fbd (Deep Blue)
    "46, 131, 255",  // #2e83ff (Bright Blue)
    "15, 29, 51"     // #0f1d33 (Navy / Black)
  ];

  let w = 0, h = 0, dpr = 1;
  let isMobile = false;
  let linkDist = 145;
  let mouseDist = 200;
  let repelDist = 135;

  let stars = [];
  let meteors = [];
  let rings = [];
  let ripples = [];
  let bursts = [];
  let nextMeteorAt = 0;

  // State interaktif untuk mouse, sentuhan (HP/tablet), dan gyroscope
  let mouse = {
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

  function makeStar() {
    const depth = 0.15 + Math.random() * 0.85; // 0.15 (jauh) -> 1.0 (dekat 3D)
    const isSparkle = depth > 0.72 && Math.random() < 0.42;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      depth,
      isSparkle,
      r: 0.85 + depth * (isSparkle ? 1.85 : 1.55),
      baseVx: (Math.random() - 0.5) * (10 + depth * 15),
      baseVy: -(13 + depth * 28),
      waveAmp: 4 + depth * 8,
      waveFreq: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      a: 0.36 + depth * 0.52,
      tw: Math.random() * Math.PI * 2,
      ts: 1.3 + Math.random() * 1.9,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 1.1,
      // Offset fisika pegas saat disentuh kursor / jari
      ox: 0, oy: 0,
      vx: 0, vy: 0,
      hot: 0,
      c: PALETTE[(Math.random() * PALETTE.length) | 0]
    };
  }

  function makeRings() {
    const minDim = Math.min(w, h);
    rings = [
      {
        xr: 0.82, yr: 0.24,
        radius: Math.max(165, minDim * 0.31),
        tilt: 0.62,       // Rasio elips 3D
        tiltRot: -0.32,   // Kemiringan sumbu 3D
        angle: 0, speed: 0.13,
        dash: [6, 10],
        satellites: 2,
        alpha: 0.17,
        depth: 0.85
      },
      {
        xr: 0.14, yr: 0.72,
        radius: Math.max(140, minDim * 0.25),
        tilt: 0.58,
        tiltRot: 0.38,
        angle: 1.4, speed: -0.1,
        dash: [3, 9],
        satellites: 3,
        alpha: 0.15,
        depth: 0.7
      },
      {
        xr: 0.5, yr: 0.48,
        radius: Math.max(240, minDim * 0.45),
        tilt: 0.74,
        tiltRot: -0.18,
        angle: 0.7, speed: 0.06,
        dash: [10, 16],
        satellites: 2,
        alpha: 0.095,
        depth: 0.45
      }
    ];
  }

  function resize() {
    isMobile = window.innerWidth <= 768;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);
    w = Math.max(window.innerWidth || 1280, 320);
    h = Math.max(window.innerHeight || 720, 320);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    linkDist = isMobile ? 115 : 145;
    mouseDist = isMobile ? 160 : 205;
    repelDist = isMobile ? 105 : 138;

    const density = isMobile ? 10500 : 8200;
    const count = Math.round(Math.min(190, Math.max(68, (w * h) / density)));
    stars = Array.from({ length: count }, makeStar);
    makeRings();
  }

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.65;
    const speed = 430 + Math.random() * 250;
    const angle = fromLeft
      ? (Math.PI * 0.13 + Math.random() * 0.12)
      : (Math.PI * 0.87 - Math.random() * 0.12);
    meteors.push({
      x: fromLeft ? Math.random() * w * 0.55 : w * 0.45 + Math.random() * w * 0.55,
      y: Math.random() * h * 0.42,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 90 + Math.random() * 60,
      age: 0,
      duration: 0.85 + Math.random() * 0.45
    });
  }

  function spawnCosmicBurst(x, y) {
    ripples.push({ x, y, r: 6, alpha: 0.38, speed: 165 });
    ripples.push({ x, y, r: 2, alpha: 0.24, speed: 95 });
    const count = isMobile ? 9 : 13;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const spd = 65 + Math.random() * 145;
      bursts.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        r: 1.2 + Math.random() * 1.5,
        rot: Math.random() * Math.PI,
        age: 0,
        duration: 0.55 + Math.random() * 0.35,
        sparkle: i % 2 === 0,
        c: PALETTE[i % PALETTE.length]
      });
    }
    // Dorong bintang di sekitar titik klik/tap secara lembut
    const boostR = repelDist * 1.35;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dx = s.x - x, dy = s.y - y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < boostR) {
        const force = (1 - dist / boostR) * 155 * s.depth;
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
    for (let i = 0; i < rings.length; i++) {
      const rg = rings[i];
      rg.angle += rg.speed * dt;
      const cx = rg.xr * w + mouse.ox * 24 * rg.depth;
      const cy = rg.yr * h + mouse.oy * 24 * rg.depth - (smoothScrollY * 0.055 * rg.depth) % h;

      // Kemiringan 3D dinamis mengikuti kursor / gyroscope
      const dynamicTilt = Math.max(0.35, Math.min(0.92, rg.tilt + mouse.oy * 0.08));
      const dynamicRot = rg.tiltRot + mouse.ox * 0.08;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(dynamicRot);
      ctx.scale(1, dynamicTilt);

      // Orbit luar (putus-putus)
      ctx.save();
      ctx.rotate(rg.angle);
      ctx.setLineDash(rg.dash);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(23, 104, 232, ${rg.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit dalam (solid tipis)
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(15, 29, 51, ${rg.alpha * 0.48})`;
      ctx.beginPath();
      ctx.arc(0, 0, rg.radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Satelit mengorbit dalam perspektif 3D
      for (let s = 0; s < rg.satellites; s++) {
        const satAngle = rg.angle + (s * Math.PI * 2) / rg.satellites;
        const sx = Math.cos(satAngle) * rg.radius;
        const sy = Math.sin(satAngle) * rg.radius;
        const depthScale = 0.78 + 0.28 * Math.sin(satAngle); // Efek dekat-jauh 3D

        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(1, 1 / dynamicTilt); // Jaga satelit tetap bulat sempurna

        const glowR = 11 * depthScale;
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        glow.addColorStop(0, `rgba(23, 104, 232, ${0.42 * depthScale})`);
        glow.addColorStop(1, "rgba(23, 104, 232, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(23, 104, 232, ${0.78 * depthScale})`;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 * depthScale, 0, Math.PI * 2);
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

    // Smooth interpolation (lerp) berbasis waktu
    const lerpFactor = 1 - Math.pow(0.0015, dt);
    mouse.ox += (mouse.tx - mouse.ox) * lerpFactor;
    mouse.oy += (mouse.ty - mouse.oy) * lerpFactor;
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.00008, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.00008, dt));
    mouse.energy += ((mouse.active ? 1 : 0) - mouse.energy) * Math.min(1, dt * 6);
    smoothScrollY += (targetScrollY - smoothScrollY) * (1 - Math.pow(0.0005, dt));

    // Soft glow mengikuti kursor / sentuhan
    if (mouse.energy > 0.01) {
      const glowRadius = isMobile ? 165 : 235;
      const cg = ctx.createRadialGradient(mouse.sx, mouse.sy, 0, mouse.sx, mouse.sy, glowRadius);
      cg.addColorStop(0, `rgba(23, 104, 232, ${0.075 * mouse.energy})`);
      cg.addColorStop(0.55, `rgba(46, 131, 255, ${0.025 * mouse.energy})`);
      cg.addColorStop(1, "rgba(23, 104, 232, 0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mouse.sx, mouse.sy, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRings(dt);

    const pos = new Array(stars.length);
    const repelR2 = repelDist * repelDist;

    for (let i = 0; i < stars.length; i++) {
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
      const baseX = s.x + waveX + mouse.ox * s.depth * 28;
      let baseY = s.y + mouse.oy * s.depth * 28 - (smoothScrollY * s.depth * 0.095) % (h + 48);
      if (baseY < -24) baseY += h + 48;

      // Interaksi 3D pegas saat didekati mouse / jari
      let fx = 0, fy = 0;
      const curX = baseX + s.ox;
      const curY = baseY + s.oy;
      if (mouse.active) {
        const dx = curX - mouse.sx;
        const dy = curY - mouse.sy;
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

      // Pegas kembali ke posisi orbit semula secara mulus
      s.vx += (fx - s.ox * 18 - s.vx * 6.5) * dt;
      s.vy += (fy - s.oy * 18 - s.vy * 6.5) * dt;
      s.ox += s.vx * dt;
      s.oy += s.vy * dt;

      pos[i] = [baseX + s.ox, baseY + s.oy];
    }

    // Garis rasi bintang 3D
    ctx.lineWidth = 0.85;
    const linkD2 = linkDist * linkDist;
    const mouseD2 = mouseDist * mouseDist;

    for (let i = 0; i < stars.length; i++) {
      if (stars[i].depth < 0.32) continue;
      const x1 = pos[i][0], y1 = pos[i][1];

      if (mouse.energy > 0.02) {
        const mdx = x1 - mouse.sx, mdy = y1 - mouse.sy;
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

      for (let j = i + 1; j < stars.length; j++) {
        if (stars[j].depth < 0.32) continue;
        const dx = x1 - pos[j][0], dy = y1 - pos[j][1];
        const d2 = dx * dx + dy * dy;
        if (d2 < linkD2) {
          const boost = 1 + (stars[i].hot + stars[j].hot) * 0.9;
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.19 * boost;
          ctx.strokeStyle = `rgba(23, 104, 232, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(pos[j][0], pos[j][1]);
          ctx.stroke();
        }
      }
    }

    // Bintang 3D & kilau 4-point star
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const [x, y] = pos[i];
      const pulse = 0.62 + 0.38 * Math.sin(s.tw);
      const alpha = Math.min(1, s.a * pulse + s.hot * 0.35);
      const r = s.r * (1 + s.hot * 0.45);

      if (s.depth > 0.66 || s.hot > 0.15) {
        const haloR = r * 4.8;
        const g = ctx.createRadialGradient(x, y, 0, x, y, haloR);
        g.addColorStop(0, `rgba(${s.c}, ${alpha * 0.38})`);
        g.addColorStop(1, `rgba(${s.c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.isSparkle || s.hot > 0.35) {
        drawFourPointStar(x, y, r * 0.95, s.rot, s.c, Math.min(1, alpha * 1.12));
      } else {
        ctx.fillStyle = `rgba(${s.c}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Partikel semburan bintang saat klik / tap
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.age += dt;
      const p = b.age / b.duration;
      if (p >= 1) {
        bursts.splice(i, 1);
        continue;
      }
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
        ctx.arc(b.x, b.y, b.r * (1 - p * 0.4), 0, Math.PI * 2);
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
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
      if (rp.alpha < 0.012) ripples.splice(i, 1);
    }

    // Bintang jatuh / komet mulus dengan kepala kilau
    if (now > nextMeteorAt && meteors.length < 2) {
      spawnMeteor();
      nextMeteorAt = now + 2600 + Math.random() * 3200;
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
      // Di HP, abaikan perubahan kecil tinggi layar akibat bar URL agar animasi tidak ter-reset
      if (isMobile && Math.abs(window.innerWidth - prevWidth) < 4) return;
      prevWidth = window.innerWidth;
      resize();
      start();
    }, 120);
  });

  // Interaksi PC (Mouse)
  window.addEventListener("mousemove", e => {
    updatePointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.tx = 0;
    mouse.ty = 0;
  }, { passive: true });

  window.addEventListener("click", e => {
    spawnCosmicBurst(e.clientX, e.clientY);
  }, { passive: true });

  // Interaksi HP & Tablet (Touch + Gyroscope)
  window.addEventListener("touchstart", e => {
    if (e.touches && e.touches[0]) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (e.touches && e.touches[0]) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.active = false;
  }, { passive: true });

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
