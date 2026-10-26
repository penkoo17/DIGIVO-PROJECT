// DIGIVO frontend prototype. Replace this placeholder with the official business WhatsApp number before launch.
const WHATSAPP_NUMBER = "6289519497188"; // Example only. Use country code without +, spaces, or leading 0.

// Ikon garis (gaya Lucide, ISC license) — dipilih sesuai konteks tiap layanan, dengan garis tegas (stroke 2.1).
const svg = inner => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICONS = {
  // Katalog
  windows: svg('<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/><path stroke-width="1.7" d="M8.5 6.5h3v3h-3zM12.5 6.5h3v3h-3zM8.5 10.5h3v3h-3zM12.5 10.5h3v3h-3z"/>'),
  document: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>'),
  graduation: svg('<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'),
  presentation: svg('<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/><path d="M8 12V9M12 12V7M16 12v-2"/>'),
  video: svg('<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9M12.4 3.4l3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'),
  website: svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 9h20"/><path d="M6 6.5h.01M9 6.5h.01"/><path d="m10 13-2 2 2 2M14 13l2 2-2 2"/>'),
  phone: svg('<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/><path d="M10 5.5h4"/><circle cx="12" cy="11" r="2.2"/>'),
  social: svg('<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>'),
  calculator: svg('<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>'),
  megaphone: svg('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
  sim: svg('<path d="M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="8" y="10" width="8" height="8" rx="1"/><path d="M12 10v8M8 14h8"/>'),
  crown: svg('<path d="m2 6 4 11h12l4-11-6 5-4-7-4 7-6-5z"/><path d="M6 21h12"/>'),
  // UI umum
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  chat: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'),
  check: svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
  zap: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
  grid: svg('<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>'),
  heart: svg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
  monitor: svg('<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  pen: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>')
};

const services = [
  {id:1,title:"Instalasi & Windows optimizer",category:"teknologi",label:"PC & teknologi",icon:"windows",price:"Tanya harga",desc:"Install ulang bebas request, optimize for better performance.",includes:["Pemeriksaan kebutuhan dan spesifikasi PC","Ruang lingkup serta harga dikonfirmasi sebelum pengerjaan","Gunakan sistem operasi dan lisensi yang sah"]},
  {id:2,title:"Ketik & dokumen",category:"sekolah",label:"Dokumen",icon:"document",price:"Harga sesuai dokumen",desc:"Bantuan mengetik dan merapikan CV, surat lamaran, serta dokumen umum.",includes:["Format dokumen sesuai kebutuhan","Revisi berdasarkan kesepakatan","Dokumen akhir dikonfirmasi sebelum penyerahan"]},
  {id:3,title:"Bimbingan & bantuan belajar",category:"sekolah",label:"Pendidikan",icon:"graduation",price:"Tanya harga",desc:"joki tugas semua mapel, ajarin mapel sampe paham.",includes:["Materi disesuaikan dengan kebutuhan","Fokus membantu memahami konsep","Tugas dinilai tetap mengikuti aturan sekolah"]},
  {id:4,title:"Makalah, PPT & karya kreatif",category:"sekolah",label:"Tugas kreatif",icon:"presentation",price:"Harga sesuai kebutuhan",desc:"Bantuan menata presentasi, makalah, olah data, scrapbook, mading, dan kliping.",includes:["Tentukan tema, format, dan tenggat","Ruang lingkup dikonfirmasi sebelum mulai","Materi dan sumber perlu diperiksa bersama"]},
  {id:5,title:"Edit video",category:"kreatif",label:"Kreatif",icon:"video",price:"Tanya harga",desc:"Editing video tugas sekolah, konten, atau promosi sesuai request.",includes:["Kirim contoh gaya dan bahan yang tersedia","Durasi dan jumlah revisi disepakati","Gunakan aset yang memiliki izin penggunaan"]},
  {id:6,title:"Pembuatan website",category:"kreatif",label:"Web & coding",icon:"website",price:"Tanya harga",desc:"Landing page, undangan digital, portofolio, web komunitas, dan website sesuai kebutuhan.",includes:["Diskusi tujuan dan fitur","Domain dan hosting dijelaskan terpisah bila berbayar","Ruang lingkup serta jadwal disepakati"]},
  {id:7,title:"Jasa Oprek Hp",category:"teknologi",label:"HP & Android",icon:"phone",price:"Tanya harga",desc:"oprek semua merk hp, bebas request.",includes:["Kepemilikan perangkat harus dapat dipastikan","Risiko kehilangan data dan garansi dibahas dahulu","Tidak melayani bypass keamanan perangkat milik orang lain"]},
  {id:8,title:"Admin media sosial",category:"bisnis",label:"Media sosial",icon:"social",price:"Paket sesuai kebutuhan",desc:"Bantuan menyusun jadwal posting, membalas pesan, dan mengelola konten akun.",includes:["Peran dan jam kerja disepakati","Akses akun diberikan dengan aman","Tidak meminta atau menyimpan kata sandi lewat chat publik"]},
  {id:9,title:"Pembukuan sederhana",category:"bisnis",label:"UMKM",icon:"calculator",price:"Tanya harga",desc:"Pembuatan format pembukuan sederhana menggunakan spreadsheet.",includes:["Sesuaikan kolom dengan kebutuhan usaha","Contoh data dapat digunakan saat konsultasi","Data keuangan pelanggan dijaga kerahasiaannya"]},
  {id:10,title:"Promosi media sosial",category:"bisnis",label:"Pertumbuhan akun",icon:"megaphone",price:"Tanya harga",desc:"suntik folowers semua sosmed.",includes:["Metode dan sumber layanan dijelaskan sebelum transaksi","Tidak menjamin angka atau hasil tertentu","Hindari bot atau interaksi palsu yang melanggar ketentuan platform"]},
  {id:11,title:"jual nomor kosong",category:"bisnis",label:"Produk digital",icon:"sim",price:"Cek ketersediaan",desc:"sedia nokos, whatsap,telegram,gojek,dana dll.",includes:["Ketersediaan diperiksa sebelum pembayaran","Sumber dan ketentuan produk harus jelas","Tidak melayani penggunaan nomor untuk penipuan atau mengakali verifikasi"]},
  {id:12,title:"Aplikasi & langganan premium",category:"bisnis",label:"Langganan digital",icon:"crown",price:"Cek paket dan harga",desc:"semua app premium. spotify, netflix,youtube,dll.",includes:["Paket, masa aktif, dan metode aktivasi dijelaskan","Ketersediaan dan harga dikonfirmasi dahulu","Tidak menjual akses yang diperoleh secara tidak sah"]}
];

const grid = document.getElementById("serviceGrid");
const searchInput = document.getElementById("searchInput");
const filterRow = document.getElementById("filterRow");
const count = document.getElementById("serviceCount");
const emptyState = document.getElementById("emptyState");
const dialog = document.getElementById("serviceDialog");
let activeFilter = "all";

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setWhatsAppLinks() {
  const general = "Halo DIGIVO, saya ingin bertanya tentang layanan yang tersedia.";
  ["emptyWhatsapp", "customRequest", "aboutWhatsapp", "footerWhatsapp", "flowWhatsapp"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = whatsappUrl(general);
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
}

function filteredServices() {
  const q = searchInput.value.trim().toLowerCase();
  return services.filter(s => {
    const matchesFilter = activeFilter === "all" || s.category === activeFilter;
    const haystack = `${s.title} ${s.label} ${s.desc}`.toLowerCase();
    return matchesFilter && haystack.includes(q);
  });
}

function renderServices() {
  const list = filteredServices();
  count.textContent = list.length;
  grid.innerHTML = list.map((s, idx) => `
    <article class="service-card" style="--delay:${Math.min(idx * 0.02, 0.16)}s">
      <div class="service-card-top"><div class="service-icon" aria-hidden="true">${ICONS[s.icon] || ""}</div><span class="service-arrow" aria-hidden="true">↗</span></div>
      <h3>${s.title}</h3><p>${s.desc}</p>
      <div class="service-card-bottom"><span class="price-label">${s.price}</span><span class="service-category">${s.label}</span></div>
      <button class="service-open" data-id="${s.id}">Lihat detail <span aria-hidden="true">→</span></button>
    </article>`).join("");
  emptyState.classList.toggle("hidden", list.length !== 0);
  grid.classList.toggle("hidden", list.length === 0);
}

function openService(id) {
  const s = services.find(item => item.id === Number(id));
  if (!s) return;
  document.getElementById("dialogIcon").innerHTML = ICONS[s.icon] || "";
  document.getElementById("dialogCategory").textContent = s.label.toUpperCase();
  document.getElementById("dialogTitle").textContent = s.title;
  document.getElementById("dialogDescription").textContent = s.desc;
  document.getElementById("dialogPrice").textContent = s.price;
  document.getElementById("dialogIncludes").innerHTML = s.includes.map(item => `<li>${item}</li>`).join("");
  const msg = `Halo DIGIVO, saya ingin bertanya tentang layanan:\n\nLayanan: ${s.title}\nKebutuhan saya: [tuliskan kebutuhan]\n\nBoleh minta informasi harga, ketersediaan, dan prosesnya?`;
  const link = document.getElementById("dialogWhatsapp");
  link.href = whatsappUrl(msg);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  if (typeof dialog.showModal === "function") dialog.showModal();
  else alert(`${s.title}\n${s.desc}\n${s.price}`);
}

function applyCategoryFilter(category) {
  activeFilter = category;
  filterRow.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === category);
  });
  renderServices();
}

filterRow.addEventListener("click", e => {
  const button = e.target.closest("[data-filter]");
  if (!button) return;
  applyCategoryFilter(button.dataset.filter);
});

// Tombol shortcut kategori di bagian Cara Pesan (Langkah 01)
document.querySelectorAll("[data-quick-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    applyCategoryFilter(btn.dataset.quickFilter);
    const target = document.getElementById("layanan");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

searchInput.addEventListener("input", renderServices);
grid.addEventListener("click", e => {
  const button = e.target.closest("[data-id]");
  if (button) openService(button.dataset.id);
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  const nav = document.querySelector(".desktop-nav");
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
document.querySelectorAll(".desktop-nav a").forEach(a => a.addEventListener("click", () => {
  document.querySelector(".desktop-nav").classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== Ikon statis (data-icon) ===== */
document.querySelectorAll("[data-icon]").forEach(el => {
  if (ICONS[el.dataset.icon]) el.innerHTML = ICONS[el.dataset.icon];
});

/* ===== Scroll reveal halus ===== */
function revealGroup(elements, step = 0.07) {
  Array.from(elements).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--d", `${Math.min(i * step, 0.45)}s`);
    revealObserver.observe(el);
  });
}

const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("in");
    revealObserver.unobserve(el);
    el.addEventListener("transitionend", function done(ev) {
      if (ev.target !== el) return;
      el.classList.remove("reveal", "in");
      el.style.removeProperty("--d");
      el.removeEventListener("transitionend", done);
    });
  });
}, { threshold: 0.04, rootMargin: "0px 0px 120px 0px" }) : { observe: el => el.classList.add("in"), unobserve() {} };

revealGroup(document.querySelectorAll(".hero-copy > *"), 0.08);
revealGroup(document.querySelectorAll(".hero-art"));
revealGroup(document.querySelectorAll(".trust-strip > div"), 0.08);
document.querySelectorAll(".section-heading, .catalog-tools, .catalog-bottom, .about-band, .footer-top, .footer-bottom").forEach(el => revealGroup([el]));
revealGroup(document.querySelectorAll(".flow-card"), 0.09);
revealGroup(document.querySelectorAll(".perk-pill"), 0.07);
revealGroup(document.querySelectorAll(".faq-list details"), 0.06);

/* ===== Header & progress bar ===== */
const header = document.querySelector(".site-header");
const progress = document.getElementById("scrollProgress");
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== Smooth 60fps Lerp Parallax & 3D Tilt di Ilustrasi Hero ===== */
const heroArt = document.querySelector(".hero-art");
const heroSection = document.querySelector(".hero");
if (heroArt && heroSection && window.matchMedia("(hover: hover)").matches) {
  let targetX = 0, targetY = 0, curX = 0, curY = 0, rafHero = 0;

  function updateHeroTilt() {
    curX += (targetX - curX) * 0.09;
    curY += (targetY - curY) * 0.09;
    heroArt.style.setProperty("--px", `${(curX * 12).toFixed(2)}px`);
    heroArt.style.setProperty("--py", `${(curY * 12).toFixed(2)}px`);
    heroArt.style.setProperty("--ry", `${(curX * 8).toFixed(2)}deg`);
    heroArt.style.setProperty("--rx", `${(-curY * 8).toFixed(2)}deg`);
    if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
      rafHero = requestAnimationFrame(updateHeroTilt);
    } else {
      rafHero = 0;
    }
  }

  heroSection.addEventListener("mousemove", e => {
    const r = heroArt.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.6)));
    targetY = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.6)));
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }, { passive: true });

  heroSection.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }, { passive: true });
}

/* ===== Spotlight lembut di kartu katalog & kartu Cara Pesan ===== */
document.addEventListener("mousemove", e => {
  const card = e.target.closest(".service-card, .flow-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}, { passive: true });

/* ===== Animasi siklus progres otomatis pada Langkah 03 (Cara Pesan) ===== */
const flowTracker = document.getElementById("flowTracker");
if (flowTracker) {
  const nodes = flowTracker.querySelectorAll(".track-node");
  const lines = flowTracker.querySelectorAll(".track-line");
  let activeStage = 1;
  setInterval(() => {
    activeStage = (activeStage + 1) % 3;
    nodes.forEach((n, idx) => {
      const dot = n.querySelector(".dot");
      n.classList.toggle("done", idx < activeStage);
      n.classList.toggle("active", idx === activeStage);
      if (idx < activeStage) dot.textContent = "✓";
      else if (idx === activeStage) dot.textContent = "●";
      else dot.textContent = String(idx + 1);
    });
    lines.forEach((l, idx) => {
      l.classList.toggle("active-line", idx < activeStage);
    });
  }, 2400);
}

/* ===== Shortcut "/" untuk fokus ke pencarian ===== */
document.addEventListener("keydown", e => {
  if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
  }
});

setWhatsAppLinks();
renderServices();
