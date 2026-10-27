// DIGIVO — 3D Scene Layer
// · Hero: globe titik 3D + orbit dengan satelit yang benar-benar mengitari kartu (canvas depan & belakang)
// · Kartu hero berlapis kedalaman (preserve-3d) yang miring mengikuti kursor / gyroscope / ayunan otomatis
// · Planet mini di band "Tentang"
// · Tilt 3D pada kartu layanan & kartu cara pesan, tombol magnetik
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- Gyroscope (HP/tablet, bila tersedia tanpa izin) ----------
  const gyro = { x: 0, y: 0, on: false };
  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null || e.beta == null) return;
    gyro.on = true;
    gyro.x = clamp(e.gamma / 25, -1, 1);
    gyro.y = clamp((e.beta - 45) / 25, -1, 1);
  }, { passive: true });

  // ---------- Util canvas ----------
  function fitCanvas(cv) {
    const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.75);
    const cw = Math.max(1, cv.clientWidth), ch = Math.max(1, cv.clientHeight);
    cv.width = Math.round(cw * dpr);
    cv.height = Math.round(ch * dpr);
    const c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: c, w: cw, h: ch };
  }

  function makeGlow(color, size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, `rgba(${color}, 0.85)`);
    grd.addColorStop(0.25, `rgba(${color}, 0.3)`);
    grd.addColorStop(1, `rgba(${color}, 0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }

  function fibonacciSphere(n) {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    return pts;
  }

  // ---------- Globe titik 3D dengan orbit ----------
  function createGlobe(o) {
    const pts = fibonacciSphere(o.count);
    const glow = makeGlow(o.glow, 64);
    let back = null, front = null;

    function resize() {
      back = fitCanvas(o.back);
      if (o.front) front = fitCanvas(o.front);
    }

    function draw(t, yawOff, pitchOff) {
      if (!back) return;
      const W = back.w, H = back.h;
      const cx = W * o.cx, cy = H * o.cy;
      const R = o.radius(W, H);
      const F = R * 3.6;
      const bc = back.ctx;
      const fc = front ? front.ctx : bc;
      bc.clearRect(0, 0, W, H);
      if (front) fc.clearRect(0, 0, front.w, front.h);

      // Globe
      const yaw = t * o.spin + yawOff;
      const pitch = o.pitch + pitchOff;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * cyw + p[2] * syw;
        const z = -p[0] * syw + p[2] * cyw;
        const y2 = p[1] * cp - z * sp;
        const z2 = p[1] * sp + z * cp;
        const d = (z2 + 1) / 2;
        const s = F / (F - z2 * R);
        bc.fillStyle = `rgba(${o.dot}, ${(o.dotMin + d * d * o.dotMax).toFixed(3)})`;
        bc.beginPath();
        bc.arc(cx + x * R * s, cy + y2 * R * s, (0.5 + d * 1.15) * s * o.dotScale, 0, TAU);
        bc.fill();
      }

      // Orbit + satelit
      const cyo = Math.cos(yawOff), syo = Math.sin(yawOff);
      const cpo = Math.cos(pitchOff), spo = Math.sin(pitchOff);
      for (let r = 0; r < o.rings.length; r++) {
        const rg = o.rings[r];
        const rr = R * rg.r;
        const st = Math.sin(rg.tilt), ct = Math.cos(rg.tilt);
        const cr = Math.cos(rg.roll), sr = Math.sin(rg.roll);
        const point = theta => {
          const x0 = Math.cos(theta) * rr, z0 = Math.sin(theta) * rr;
          const y1 = -z0 * st, z1 = z0 * ct;
          const x2 = x0 * cr - y1 * sr, y2 = x0 * sr + y1 * cr;
          const x3 = x2 * cyo + z1 * syo, z3 = -x2 * syo + z1 * cyo;
          const y4 = y2 * cpo - z3 * spo, z4 = y2 * spo + z3 * cpo;
          const s = F / (F - z4);
          return { x: cx + x3 * s, y: cy + y4 * s, z: z4, s };
        };
        const N = 110;
        let prev = point(0);
        for (let i = 1; i <= N; i++) {
          const cur = point((i / N) * TAU);
          const zm = (prev.z + cur.z) / 2;
          const d = (zm / rr + 1) / 2;
          const isFront = zm >= 0;
          if (!isFront && i % 2) { prev = cur; continue; }
          const c = isFront ? fc : bc;
          c.strokeStyle = `rgba(${o.ring}, ${(rg.alpha * (0.28 + d * 0.72)).toFixed(3)})`;
          c.lineWidth = rg.width || 1;
          c.beginPath();
          c.moveTo(prev.x, prev.y);
          c.lineTo(cur.x, cur.y);
          c.stroke();
          prev = cur;
        }
        for (let k = 0; k < rg.sats; k++) {
          const p = point(t * rg.speed + rg.phase + (k * TAU) / rg.sats);
          const d = (p.z / rr + 1) / 2;
          const c = p.z >= 0 ? fc : bc;
          const rad = (rg.size || 3) * (0.7 + d * 0.5) * p.s;
          const g = rad * 8;
          c.globalAlpha = 0.35 + d * 0.55;
          c.drawImage(glow, p.x - g / 2, p.y - g / 2, g, g);
          c.globalAlpha = 1;
          c.fillStyle = `rgba(${o.sat}, ${0.55 + d * 0.45})`;
          c.beginPath();
          c.arc(p.x, p.y, rad, 0, TAU);
          c.fill();
          c.fillStyle = `rgba(255, 255, 255, ${0.6 + d * 0.4})`;
          c.beginPath();
          c.arc(p.x, p.y, rad * 0.38, 0, TAU);
          c.fill();
        }
      }
    }

    return { resize, draw };
  }

  // Jalankan loop hanya saat elemen terlihat & tab aktif
  function visibleLoop(el, frame) {
    let visible = false, raf = 0, last = performance.now();
    const tick = now => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      frame(now / 1000, dt);
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        run();
      }, { rootMargin: "80px" }).observe(el);
    } else {
      visible = true;
      run();
    }
    document.addEventListener("visibilitychange", run);
  }

  function observeSize(el, cb) {
    if ("ResizeObserver" in window) new ResizeObserver(() => cb()).observe(el);
    else window.addEventListener("resize", cb);
  }

  // ---------- HERO ----------
  const heroArt = document.getElementById("heroArt");
  const heroSection = document.querySelector(".hero");
  const globeBack = document.getElementById("globeBack");
  const globeFront = document.getElementById("globeFront");
  if (heroArt && heroSection && globeBack && globeFront) {
    const small = window.innerWidth < 700;
    const globe = createGlobe({
      back: globeBack,
      front: globeFront,
      count: small ? 220 : 340,
      cx: 0.5, cy: 0.5,
      radius: (W, H) => Math.min(W, H) / 1.28 * 0.47,
      spin: 0.16,
      pitch: 0.38,
      dot: "23, 104, 232",
      dotMin: 0.05,
      dotMax: 0.5,
      dotScale: 1,
      ring: "23, 104, 232",
      sat: "23, 104, 232",
      glow: "46, 131, 255",
      rings: [
        { r: 1.5, tilt: -0.3, roll: -0.22, alpha: 0.42, speed: 0.34, phase: 0, sats: 2, size: 3.4 },
        { r: 1.2, tilt: -0.62, roll: 0.5, alpha: 0.26, speed: -0.48, phase: 1.2, sats: 1, size: 2.6 }
      ]
    });
    globe.resize();
    observeSize(heroArt, () => globe.resize());

    const st = { tx: 0, ty: 0, x: 0, y: 0, lastMove: -10 };
    if (finePointer) {
      heroSection.addEventListener("pointermove", e => {
        if (e.pointerType !== "mouse") return;
        const r = heroArt.getBoundingClientRect();
        st.tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.75), -1, 1);
        st.ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.75), -1, 1);
        st.lastMove = performance.now() / 1000;
      }, { passive: true });
      heroSection.addEventListener("pointerleave", () => {
        st.tx = 0;
        st.ty = 0;
      }, { passive: true });
    }

    const apply = t => {
      heroArt.style.setProperty("--ry", `${(st.x * 13).toFixed(2)}deg`);
      heroArt.style.setProperty("--rx", `${(-st.y * 9).toFixed(2)}deg`);
      heroArt.style.setProperty("--gx", `${(50 + st.x * 45).toFixed(1)}%`);
      heroArt.style.setProperty("--gy", `${(30 + st.y * 40).toFixed(1)}%`);
      globe.draw(t, st.x * 0.42, -st.y * 0.26);
    };

    if (reduceMotion) {
      apply(0);
    } else {
      visibleLoop(heroArt, (t, dt) => {
        const idle = t - st.lastMove > 2.5;
        if (gyro.on && !finePointer) {
          st.tx = gyro.x;
          st.ty = gyro.y;
        } else if (!finePointer || idle) {
          // Ayunan otomatis yang sangat pelan saat tidak ada interaksi
          st.tx = Math.sin(t * 0.45) * 0.38;
          st.ty = Math.cos(t * 0.37) * 0.26;
        }
        const k = 1 - Math.pow(idle ? 0.25 : 0.004, dt);
        st.x += (st.tx - st.x) * k;
        st.y += (st.ty - st.y) * k;
        apply(t);
      });
    }
  }

  // ---------- Planet mini di band "Tentang" ----------
  const aboutBand = document.getElementById("tentang");
  const aboutPlanet = document.getElementById("aboutPlanet");
  if (aboutBand && aboutPlanet) {
    const planet = createGlobe({
      back: aboutPlanet,
      front: null,
      count: 260,
      cx: 0.5, cy: 0.5,
      radius: (W, H) => Math.min(W, H) * 0.3,
      spin: 0.12,
      pitch: 0.42,
      dot: "196, 218, 255",
      dotMin: 0.04,
      dotMax: 0.55,
      dotScale: 1,
      ring: "148, 188, 255",
      sat: "255, 255, 255",
      glow: "120, 170, 255",
      rings: [{ r: 1.48, tilt: -0.28, roll: -0.3, alpha: 0.45, speed: 0.4, phase: 0.4, sats: 1, size: 3 }]
    });
    planet.resize();
    observeSize(aboutPlanet, () => planet.resize());
    const ps = { tx: 0, ty: 0, x: 0, y: 0 };
    if (finePointer) {
      aboutBand.addEventListener("pointermove", e => {
        const r = aboutBand.getBoundingClientRect();
        ps.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
        ps.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
      }, { passive: true });
      aboutBand.addEventListener("pointerleave", () => { ps.tx = 0; ps.ty = 0; }, { passive: true });
    }
    if (reduceMotion) {
      planet.draw(0, 0, 0);
    } else {
      visibleLoop(aboutBand, (t, dt) => {
        if (gyro.on && !finePointer) { ps.tx = gyro.x; ps.ty = gyro.y; }
        const k = 1 - Math.pow(0.01, dt);
        ps.x += (ps.tx - ps.x) * k;
        ps.y += (ps.ty - ps.y) * k;
        planet.draw(t, ps.x * 0.6, -ps.y * 0.35);
      });
    }
  }

  // ---------- Tilt 3D kartu (desktop) ----------
  if (finePointer && !reduceMotion) {
    const SELECTOR = ".service-card, .flow-card";
    const state = new WeakMap();
    const moving = new Set();
    let raf = 0;
    let current = null;

    const step = () => {
      moving.forEach(card => {
        const s = state.get(card);
        s.x += (s.tx - s.x) * 0.16;
        s.y += (s.ty - s.y) * 0.16;
        const max = card.classList.contains("flow-card") ? 4.5 : 8;
        card.style.transform = `perspective(1000px) rotateX(${(-s.y * max).toFixed(2)}deg) rotateY(${(s.x * max).toFixed(2)}deg)`;
        card.style.setProperty("--sx", (-s.x * 10).toFixed(1));
        card.style.setProperty("--sy", (-s.y * 8).toFixed(1));
        if (Math.abs(s.tx - s.x) < 0.002 && Math.abs(s.ty - s.y) < 0.002 && s.tx === 0 && s.ty === 0) {
          card.style.transform = "";
          moving.delete(card);
        }
      });
      raf = moving.size ? requestAnimationFrame(step) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

    const releaseCard = card => {
      const s = state.get(card);
      if (!s) return;
      s.tx = 0;
      s.ty = 0;
      moving.add(card);
      kick();
    };

    document.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const card = e.target.closest(SELECTOR);
      if (card !== current) {
        if (current) releaseCard(current);
        current = card;
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
      let s = state.get(card);
      if (!s) { s = { x: 0, y: 0, tx: 0, ty: 0 }; state.set(card, s); }
      s.tx = clamp(px * 2 - 1, -1, 1);
      s.ty = clamp(py * 2 - 1, -1, 1);
      moving.add(card);
      kick();
    }, { passive: true });

    document.addEventListener("pointerleave", () => { if (current) releaseCard(current); current = null; });

    // ---------- Tombol magnetik ----------
    document.querySelectorAll(".button-primary, .button-dark, .button-light, .wa-fab").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        if (e.pointerType !== "mouse") return;
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = `${(dx * 0.16).toFixed(1)}px ${(dy * 0.26).toFixed(1)}px`;
      }, { passive: true });
      btn.addEventListener("pointerleave", () => { btn.style.translate = ""; }, { passive: true });
    });
  }
})();
