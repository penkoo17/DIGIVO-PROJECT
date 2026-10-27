// DIGIVO — Cosmic Background Engine v5
// Lapisan: 3D star-dust (terbang pelan ke arah kamera) · rasi bintang interaktif · orbit 3D + planet mini · komet.
// Interaksi: kursor/jari mendorong bintang (spring), garis ke kursor, klik/tap = gelombang kejut + percikan,
// scroll = sedikit "warp", gyroscope (HP) = parallax. Palet: biru, navy, putih saja.
(() => {
  const canvas = document.getElementById("cosmosCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  const BLUE = "23, 104, 232";   // #1768e8
  const DEEP = "13, 79, 189";    // #0d4fbd
  const BRIGHT = "46, 131, 255"; // #2e83ff
  const NAVY = "21, 34, 57";     // #152239
  const NODE_COLORS = [BLUE, DEEP, BRIGHT, NAVY];
  const TAU = Math.PI * 2;

  let w = 0, h = 0, dpr = 1, S = 0;
  let dust = [], nodes = [], orbits = [], meteors = [], shocks = [], sparks = [];
  let linkDist = 140, mouseDist = 190, pushRadius = 150;
  let nextMeteorAt = 0, rafId = 0, lastTime = performance.now();

  const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false, energy: 0, type: "mouse" };
  const cam = { tx: 0, ty: 0, x: 0, y: 0 };
  let gyroActive = false;
  let targetScroll = window.scrollY || 0, smoothScroll = targetScroll, lastScroll = targetScroll, warp = 0;

  // ---------- Sprite glow (pre-render, jauh lebih ringan dari gradient per frame) ----------
  function makeGlow(color, size, inner = 0.9) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, `rgba(${color}, ${inner})`);
    grd.addColorStop(0.22, `rgba(${color}, ${inner * 0.36})`);
    grd.addColorStop(1, `rgba(${color}, 0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }
  const glowBlue = makeGlow(BLUE, 64);
  const glowBright = makeGlow(BRIGHT, 64);
  const cursorGlow = makeGlow(BLUE, 256, 0.1);

  // ---------- Factory ----------
  function makeDust(fresh) {
    return {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: fresh ? 1 : 0.08 + Math.random() * 0.92,
      c: Math.random() < 0.78 ? BLUE : NAVY
    };
  }

  function makeNode() {
    const depth = 0.2 + Math.random() * 0.8;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      depth,
      vx: (Math.random() - 0.5) * (8 + depth * 10),
      vy: -(8 + depth * 18),
      ox: 0, oy: 0, ovx: 0, ovy: 0,
      r: 0.9 + depth * 1.6,
      a: 0.36 + depth * 0.5,
      tw: Math.random() * TAU,
      ts: 1 + Math.random() * 1.6,
      phase: Math.random() * TAU,
      wf: 0.3 + Math.random() * 0.5,
      wa: 3 + depth * 7,
      c: NODE_COLORS[(Math.random() * NODE_COLORS.length) | 0],
      hot: 0,
      px: 0, py: 0
    };
  }

  function makeOrbits() {
    const m = Math.min(w, h);
    orbits = [
      { xr: 0.86, yr: 0.2, R: Math.max(120, m * 0.27), tilt: -0.34, roll: -0.32, phase: 0, speed: 0.22, sats: 2, alpha: 0.24, planet: true },
      { xr: 0.1, yr: 0.78, R: Math.max(100, m * 0.22), tilt: -0.4, roll: 0.42, phase: 1.7, speed: -0.17, sats: 1, alpha: 0.2, planet: true }
    ];
    if (w > 900) {
      orbits.push({ xr: 0.5, yr: 0.55, R: m * 0.55, tilt: -0.22, roll: 0.1, phase: 0.6, speed: 0.07, sats: 2, alpha: 0.1, planet: false });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    w = Math.max(window.innerWidth || 1280, 320);
    h = Math.max(window.innerHeight || 720, 320);
    S = Math.max(w, h) * 0.5;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = w * h;
    const scale = coarse ? 0.65 : 1;
    const dustCount = Math.round(Math.min(260, Math.max(90, area / 5600)) * scale);
    const nodeCount = Math.round(Math.min(105, Math.max(38, area / 14000)) * (coarse ? 0.8 : 1));
    dust = Array.from({ length: dustCount }, () => makeDust(false));
    nodes = Array.from({ length: nodeCount }, makeNode);
    linkDist = w < 700 ? 112 : 140;
    mouseDist = w < 700 ? 150 : 190;
    pushRadius = w < 700 ? 120 : 150;
    makeOrbits();
  }

  function spawnMeteor() {
    const fromLeft = Math.random() < 0.65;
    const speed = 420 + Math.random() * 240;
    const angle = fromLeft ? Math.PI * 0.13 + Math.random() * 0.12 : Math.PI * 0.87 - Math.random() * 0.12;
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

  function emitShock(x, y) {
    shocks.push({ x, y, r: 4, max: Math.max(w, h) * 0.32, alpha: 0.34 });
    const n = coarse ? 8 : 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + Math.random() * 0.4;
      const sp = 70 + Math.random() * 170;
      sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 0.7 + Math.random() * 0.5, r: 0.8 + Math.random() * 1.2 });
    }
  }

  // ---------- Layer: 3D star dust ----------
  function drawDust(dt) {
    const speed = (0.016 + warp) * dt;
    const cx = w / 2, cy = h / 2;
    const camX = cam.x * 0.03, camY = cam.y * 0.03;
    const streak = warp > 0.04;
    for (let i = 0; i < dust.length; i++) {
      const d = dust[i];
      d.z -= speed;
      let sx = cx + ((d.x - camX) / d.z) * S;
      let sy = cy + ((d.y - camY) / d.z) * S;
      if (d.z < 0.05 || sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) {
        Object.assign(d, makeDust(true));
        continue;
      }
      const near = 1 - d.z;
      const alpha = 0.06 + Math.pow(near, 1.6) * 0.62;
      const r = 0.35 + near * 1.7;
      if (streak) {
        const z2 = Math.min(1, d.z + warp * 0.09);
        const tx = cx + ((d.x - camX) / z2) * S;
        const ty = cy + ((d.y - camY) / z2) * S;
        ctx.strokeStyle = `rgba(${d.c}, ${alpha * 0.8})`;
        ctx.lineWidth = r;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${d.c}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, TAU);
        ctx.fill();
      }
    }
  }

  // ---------- Layer: orbit 3D + planet mini ----------
  function ringPoint(o, theta, yaw, pitch) {
    const x0 = Math.cos(theta) * o.R;
    const z0 = Math.sin(theta) * o.R;
    const st = Math.sin(o.tilt), ct = Math.cos(o.tilt);
    const y1 = -z0 * st, z1 = z0 * ct;
    const cr = Math.cos(o.roll), sr = Math.sin(o.roll);
    const x2 = x0 * cr - y1 * sr, y2 = x0 * sr + y1 * cr;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw);
    const x3 = x2 * cyw + z1 * syw, z3 = -x2 * syw + z1 * cyw;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const y4 = y2 * cp - z3 * sp, z4 = y2 * sp + z3 * cp;
    const F = o.R * 4;
    const s = F / (F - z4);
    return { x: x3 * s, y: y4 * s, z: z4, s };
  }

  function drawOrbit(o, dt) {
    o.phase += o.speed * dt;
    const span = h + o.R * 2.4;
    const cx = o.xr * w + cam.x * 20;
    const cy = ((((o.yr * h - smoothScroll * 0.05 + cam.y * 20) % span) + span) % span) - o.R * 1.2;
    const yaw = cam.x * 0.28, pitch = cam.y * 0.18;
    const N = 72;
    const pts = new Array(N + 1);
    for (let i = 0; i <= N; i++) pts[i] = ringPoint(o, (i / N) * TAU, yaw, pitch);

    ctx.lineWidth = 1;
    const segment = front => {
      for (let i = 1; i <= N; i++) {
        const a = pts[i - 1], b = pts[i];
        const zm = (a.z + b.z) / 2;
        if ((zm >= 0) !== front) continue;
        const depth = (zm / o.R + 1) / 2;
        if (!front && i % 2) continue; // sisi belakang putus-putus = isyarat kedalaman
        ctx.strokeStyle = `rgba(${BLUE}, ${o.alpha * (0.35 + depth * 0.65)})`;
        ctx.beginPath();
        ctx.moveTo(cx + a.x, cy + a.y);
        ctx.lineTo(cx + b.x, cy + b.y);
        ctx.stroke();
      }
    };

    const sats = [];
    for (let k = 0; k < o.sats; k++) sats.push(ringPoint(o, o.phase + (k * TAU) / o.sats, yaw, pitch));
    const drawSat = p => {
      const depth = (p.z / o.R + 1) / 2;
      const r = (1.6 + depth * 2) * p.s;
      const g = r * 7;
      ctx.globalAlpha = 0.35 + depth * 0.5;
      ctx.drawImage(glowBlue, cx + p.x - g / 2, cy + p.y - g / 2, g, g);
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${BLUE}, ${0.5 + depth * 0.4})`;
      ctx.beginPath();
      ctx.arc(cx + p.x, cy + p.y, r, 0, TAU);
      ctx.fill();
    };

    segment(false);
    sats.filter(p => p.z < 0).forEach(drawSat);

    if (o.planet) {
      const pr = o.R * 0.17;
      const grd = ctx.createRadialGradient(cx - pr * 0.45, cy - pr * 0.5, pr * 0.1, cx, cy, pr);
      grd.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      grd.addColorStop(0.55, "rgba(214, 230, 255, 0.85)");
      grd.addColorStop(1, `rgba(${BLUE}, 0.38)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `rgba(${BLUE}, 0.22)`;
      ctx.stroke();
    }

    segment(true);
    sats.filter(p => p.z >= 0).forEach(drawSat);
  }

  // ---------- Layer: rasi bintang interaktif ----------
  function updateNodes(dt, tSec) {
    const pr2 = pushRadius * pushRadius;
    const live = pointer.active;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      n.tw += n.ts * dt;
      if (n.y < -30) { n.y = h + 30; n.x = Math.random() * w; }
      if (n.y > h + 30) n.y = -30;
      if (n.x < -30) n.x = w + 30;
      if (n.x > w + 30) n.x = -30;

      const baseX = n.x + Math.sin(tSec * n.wf + n.phase) * n.wa + cam.x * n.depth * 26;
      let baseY = n.y + cam.y * n.depth * 26 - ((smoothScroll * n.depth * 0.08) % (h + 60));
      if (baseY < -30) baseY += h + 60;

      // Gaya dorong kursor + gelombang kejut
      let fx = 0, fy = 0;
      const curX = baseX + n.ox, curY = baseY + n.oy;
      if (live) {
        const dx = curX - pointer.sx, dy = curY - pointer.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = Math.pow(1 - d / pushRadius, 2) * 1500 * n.depth;
          fx += (dx / d) * f;
          fy += (dy / d) * f;
        }
        n.hot += ((d2 < 12100 ? 1 - Math.sqrt(d2) / 110 : 0) - n.hot) * Math.min(1, dt * 8);
      } else {
        n.hot += (0 - n.hot) * Math.min(1, dt * 6);
      }
      for (let s = 0; s < shocks.length; s++) {
        const sh = shocks[s];
        const dx = curX - sh.x, dy = curY - sh.y;
        const d = Math.hypot(dx, dy) || 1;
        if (Math.abs(d - sh.r) < 28) {
          const f = 9000 * n.depth * sh.alpha;
          fx += (dx / d) * f;
          fy += (dy / d) * f;
        }
      }
      // Spring kembali ke posisi asal (sedikit memantul, lembut)
      n.ovx += (fx - n.ox * 16 - n.ovx * 6) * dt;
      n.ovy += (fy - n.oy * 16 - n.ovy * 6) * dt;
      n.ox += n.ovx * dt;
      n.oy += n.ovy * dt;
      const om = Math.hypot(n.ox, n.oy);
      if (om > 90) { n.ox *= 90 / om; n.oy *= 90 / om; }

      n.px = baseX + n.ox;
      n.py = baseY + n.oy;
    }
  }

  function drawNodes() {
    const ld2 = linkDist * linkDist;
    const md2 = mouseDist * mouseDist;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.depth < 0.34) continue;
      if (pointer.active) {
        const dx = a.px - pointer.sx, dy = a.py - pointer.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < md2) {
          ctx.strokeStyle = `rgba(${BLUE}, ${(1 - Math.sqrt(d2) / mouseDist) * 0.3 * pointer.energy})`;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(pointer.sx, pointer.sy);
          ctx.stroke();
        }
      }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (b.depth < 0.34) continue;
        const dx = a.px - b.px, dy = a.py - b.py;
        const d2 = dx * dx + dy * dy;
        if (d2 < ld2) {
          const boost = 1 + (a.hot + b.hot) * 1.4;
          ctx.strokeStyle = `rgba(${BLUE}, ${(1 - Math.sqrt(d2) / linkDist) * 0.17 * boost})`;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const pulse = 0.62 + 0.38 * Math.sin(n.tw);
      const alpha = Math.min(1, n.a * pulse + n.hot * 0.4);
      const r = n.r * (1 + n.hot * 0.7);
      if (n.depth > 0.68 || n.hot > 0.05) {
        const g = r * 9;
        ctx.globalAlpha = alpha * 0.55;
        ctx.drawImage(n.c === BRIGHT ? glowBright : glowBlue, n.px - g / 2, n.py - g / 2, g, g);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = `rgba(${n.c}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(n.px, n.py, r, 0, TAU);
      ctx.fill();
      if (n.hot > 0.12) {
        ctx.strokeStyle = `rgba(${BLUE}, ${n.hot * 0.45})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r + 4 + n.hot * 3, 0, TAU);
        ctx.stroke();
        ctx.lineWidth = 0.8;
      }
    }
  }

  // ---------- Layer: efek klik, komet ----------
  function drawEffects(dt, now) {
    for (let i = shocks.length - 1; i >= 0; i--) {
      const s = shocks[i];
      s.r += 420 * dt;
      s.alpha *= Math.pow(0.08, dt);
      ctx.strokeStyle = `rgba(${BLUE}, ${s.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${BLUE}, ${s.alpha * 0.45})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.62, 0, TAU);
      ctx.stroke();
      if (s.alpha < 0.012 || s.r > s.max) shocks.splice(i, 1);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.life += dt;
      const drag = Math.pow(0.05, dt);
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const k = 1 - p.life / p.max;
      if (k <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${BLUE}, ${k * 0.75})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.6 + k * 0.6), 0, TAU);
      ctx.fill();
    }

    if (now > nextMeteorAt && meteors.length < 2) {
      spawnMeteor();
      nextMeteorAt = now + 3200 + Math.random() * 3800;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.age += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const p = Math.min(1, m.age / m.duration);
      const fade = Math.sin(p * Math.PI);
      const sp = Math.hypot(m.vx, m.vy) || 1;
      const tailX = m.x - (m.vx / sp) * m.len;
      const tailY = m.y - (m.vy / sp) * m.len;
      const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      g.addColorStop(0, `rgba(${BLUE}, ${0.8 * fade})`);
      g.addColorStop(0.4, `rgba(${BRIGHT}, ${0.34 * fade})`);
      g.addColorStop(1, `rgba(${BLUE}, 0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      ctx.globalAlpha = fade * 0.8;
      ctx.drawImage(glowBlue, m.x - 9, m.y - 9, 18, 18);
      ctx.globalAlpha = 1;
      if (p >= 1 || m.x < -140 || m.x > w + 140 || m.y > h + 140) meteors.splice(i, 1);
    }
  }

  // ---------- Main frame ----------
  function draw(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    const tSec = now * 0.001;

    const ease = 1 - Math.pow(0.0015, dt);
    cam.x += (cam.tx - cam.x) * ease;
    cam.y += (cam.ty - cam.y) * ease;
    const follow = 1 - Math.pow(0.00005, dt);
    pointer.sx += (pointer.x - pointer.sx) * follow;
    pointer.sy += (pointer.y - pointer.sy) * follow;
    pointer.energy += ((pointer.active ? 1 : 0) - pointer.energy) * Math.min(1, dt * 5);
    smoothScroll += (targetScroll - smoothScroll) * (1 - Math.pow(0.0005, dt));

    // Warp halus mengikuti kecepatan scroll
    const vel = Math.abs(targetScroll - lastScroll) / dt;
    lastScroll = targetScroll;
    const warpTarget = Math.min(0.32, vel * 0.00011);
    warp += (warpTarget - warp) * Math.min(1, dt * (warpTarget > warp ? 6 : 2.2));

    ctx.clearRect(0, 0, w, h);

    if (pointer.energy > 0.01 && pointer.type === "mouse") {
      const g = 460;
      ctx.globalAlpha = pointer.energy;
      ctx.drawImage(cursorGlow, pointer.sx - g / 2, pointer.sy - g / 2, g, g);
      ctx.globalAlpha = 1;
    }

    drawDust(dt);
    for (let i = 0; i < orbits.length; i++) drawOrbit(orbits[i], dt);
    updateNodes(dt, tSec);
    drawNodes();
    drawEffects(dt, now);
  }

  function loop(now) {
    draw(now || performance.now());
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(rafId);
    lastTime = performance.now();
    if (reduceMotion) {
      // Mode hemat gerak: render satu frame statis
      draw(lastTime + 16);
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  // ---------- Input ----------
  let resizeTimer;
  let lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Abaikan resize kecil di HP (address bar muncul/hilang) agar bintang tidak reset
      if (coarse && Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - h) < 140) return;
      lastW = window.innerWidth;
      resize();
      start();
    }, 140);
  });

  window.addEventListener("pointermove", e => {
    if (!pointer.active) { pointer.sx = e.clientX; pointer.sy = e.clientY; }
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.type = e.pointerType || "mouse";
    pointer.active = true;
    if (!gyroActive || pointer.type === "mouse") {
      cam.tx = (e.clientX / w - 0.5) * 2;
      cam.ty = (e.clientY / h - 0.5) * 2;
    }
  }, { passive: true });

  window.addEventListener("pointerdown", e => {
    pointer.x = pointer.sx = e.clientX;
    pointer.y = pointer.sy = e.clientY;
    pointer.type = e.pointerType || "mouse";
    pointer.active = true;
    if (!reduceMotion) emitShock(e.clientX, e.clientY);
  }, { passive: true });

  const release = e => {
    if (e.pointerType && e.pointerType !== "mouse") pointer.active = false;
  };
  window.addEventListener("pointerup", release, { passive: true });
  window.addEventListener("pointercancel", () => { pointer.active = false; }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    pointer.active = false;
    cam.tx = 0;
    cam.ty = 0;
  });
  window.addEventListener("blur", () => { pointer.active = false; });

  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null || e.beta == null) return;
    gyroActive = true;
    cam.tx = Math.max(-1, Math.min(1, e.gamma / 28));
    cam.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 28));
  }, { passive: true });

  window.addEventListener("scroll", () => {
    targetScroll = window.scrollY || 0;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });

  resize();
  spawnMeteor();
  nextMeteorAt = performance.now() + 2200;
  start();
})();
