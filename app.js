// DIGIVO frontend prototype. Replace this placeholder with the official business WhatsApp number before launch.
const WHATSAPP_NUMBER = "6289519497188";
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
  gauge: svg('<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>'),
  keyboard: svg('<path d="M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>'),
  image: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
  book: svg('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
  spellcheck: svg('<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/>'),
  trending: svg('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>'),
  palette: svg('<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'),
  fileconvert: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 15h8"/><path d="m13 12 3 3-3 3"/>'),
  gamepad: svg('<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>'),
  laptop: svg('<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>'),
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
  {id:1,title:"Install ulang Windows",category:"teknologi",label:"PC & teknologi",icon:"windows",price:"Rp50.000",desc:"Install ulang Windows plus aplikasi dasar, langsung siap dipakai.",
    prices:[["Install ulang Windows + aplikasi dasar","Rp50.000"]],
    includes:["Pemeriksaan kebutuhan dan spesifikasi PC","Daftar aplikasi dasar dikonfirmasi sebelum pengerjaan","Backup data penting dibahas dahulu","Gunakan sistem operasi dan lisensi yang sah"]},
  {id:2,title:"Windows optimizer",category:"teknologi",label:"PC & teknologi",icon:"gauge",price:"Rp35.000",desc:"Bikin Windows lebih ringan dan responsif untuk kerja maupun main game.",
    prices:[["GIVO OPTIMIZER","Rp35.000"]],
    includes:["Cek kondisi PC sebelum optimasi","Perubahan yang dilakukan dijelaskan","Hasil performa tergantung spesifikasi perangkat"]},
  {id:3,title:"Jasa ketik dokumen",category:"sekolah",label:"Dokumen",icon:"keyboard",price:"Mulai Rp10.000",desc:"Ketik dan rapikan CV, resume, artikel, dan dokumen umum lainnya.",
    prices:[["CV","Rp25.000"],["Resume","Rp10.000"],["Artikel","Rp35.000"],["Dokumen lainnya","Tanya dulu"]],
    includes:["Format dokumen sesuai kebutuhan","Revisi berdasarkan kesepakatan","Dokumen akhir dikonfirmasi sebelum penyerahan"]},
  {id:4,title:"Joki tugas sekolah",category:"sekolah",label:"Tugas sekolah",icon:"graduation",price:"Mulai Rp1.500",desc:"Bantu kerjakan PPT, makalah, scrapbook, dan tugas SMA/SMK semua mapel.",
    prices:[["PPT","Rp1.500/slide","Materi dari DIGIVO +Rp5.000"],["Makalah","Rp35.000"],["Scrapbook","Rp35.000"],["Tugas SMA/SMK (semua mapel)","Rp5.000/soal"],["Tugas lainnya","Tanya dulu"]],
    priceNote:"Contoh PPT 4 slide dengan materi dari DIGIVO: (4 × Rp1.500) + Rp5.000 = Rp11.000.",
    includes:["Tentukan mapel, format, dan tenggat","Ruang lingkup dikonfirmasi sebelum mulai","Hasil dipakai sebagai bahan belajar dan tetap mengikuti aturan sekolah"]},
  {id:5,title:"Jasa edit",category:"kreatif",label:"Kreatif",icon:"image",price:"Mulai Rp3.000",desc:"Edit poster, foto, dan video untuk tugas, konten, atau promosi.",
    prices:[["Poster","Mulai Rp5.000"],["Foto","Mulai Rp3.000"],["Video","Mulai Rp10.000"],["Edit lainnya","Tanya dulu"]],
    includes:["Kirim contoh gaya dan bahan yang tersedia","Durasi dan jumlah revisi disepakati","Gunakan aset yang memiliki izin penggunaan"]},
  {id:6,title:"Buat website",category:"kreatif",label:"Web & coding",icon:"website",price:"Mulai Rp50.000",desc:"Landing page, undangan digital, portofolio, web sekolah, dan website sesuai request.",
    prices:[["Landing page UMKM (1 halaman)","Rp50.000–100.000"],["Web undangan digital","Rp50.000–125.000"],["Web portofolio","Rp50.000–125.000"],["Web sekolah / komunitas","Rp150.000–350.000"],["Web sesuai request","Mulai Rp100.000"]],
    includes:["Diskusi tujuan dan fitur","Domain dan hosting dijelaskan terpisah bila berbayar","Ruang lingkup serta jadwal disepakati"]},
  {id:7,title:"Modifikasi & service HP",category:"teknologi",label:"HP & Android",icon:"phone",price:"Mulai Rp25.000",desc:"Unlock bootloader, root, custom recovery, custom ROM, sampai HP lupa sandi.",
    prices:[["Unlock bootloader","Rp25.000"],["Root","Rp30.000"],["Pasang custom recovery","Rp45.000"],["Pasang ROM port / custom","Rp85.000"],["Relock bootloader","Rp25.000"],["Lupa sandi, pola, atau PIN","Rp50.000"],["Paketan oprek lengkap","Rp200.000","Oprek untuk game, baterai hemat, dan upgrade versi Android jika HP tidak support Android terbaru"]],
    includes:["Kepemilikan perangkat harus dapat dipastikan","Risiko kehilangan data dan garansi dibahas dahulu","Tidak melayani bypass keamanan perangkat milik orang lain"]},
  {id:8,title:"Admin media sosial",category:"bisnis",label:"Media sosial",icon:"social",price:"Mulai Rp2.000",desc:"Upload postingan, caption, desain konten, sampai kelola akun bulanan.",
    prices:[["Upload postingan dari materi pelanggan","Rp2.000/postingan"],["Caption sederhana","Rp2.000–5.000/postingan"],["Desain postingan sederhana","Rp5.000–10.000/desain"],["Paket 12 postingan / bulan","Rp60.000–100.000"],["Paket 20 postingan / bulan","Rp100.000–175.00０"],["Admin akun sederhana","Rp150.₀₀₀–3₀₀.₀₀₀/bulan"]],
    includes:["Peran dan jam kerja disepakati","Akses akun diberikan dengan aman","Tidak meminta atau menyimpan kata sandi lewat chat publik"]},
  {id:9,title:"Jasa pembukuan UMKM",category:"bisnis",label:"UMKM",icon:"calculator",price:"Mulai Rp10.000",desc:"Catat keuangan usaha, rekap transaksi, template Excel, sampai laporan laba-rugi.",
    prices:[["Catat pemasukan & pengeluaran sederhana","Rp10.000–20.000"],["Rekap transaksi 1 minggu","Rp15.000–30.000"],["Rekap transaksi 1 bulan","Rp40.000–100.000"],["Template pembukuan Excel","Rp15.000–35.000"],["Laporan laba-rugi sederhana","Rp20.000–40.000"],["Paket pembukuan UMKM bulanan","Rp75.000–150.000"]],
    includes:["Sesuaikan kolom dengan kebutuhan usaha","Contoh data dapat digunakan saat konsultasi","Data keuangan pelanggan dijaga kerahasiaannya"]},
  {id:10,title:"Jasa ringkas",category:"sekolah",label:"Ringkasan",icon:"book",price:"Mulai Rp3.000",desc:"Ringkas buku, file, HVS, doublepolio, sampai video atau VN jadi catatan rapi.",
    prices:[["Buku biasa","Mulai Rp3.000/hal"],["Buku cetak / file","Mulai Rp6.000/hal"],["HVS (A4/F4)","Mulai Rp8.000/hal"],["Doublepolio","Mulai Rp8.000/hal"],["Video / VN","Mulai Rp3.000/menit"]],
    includes:["Kirim bahan dan tenggat pengerjaan","Tingkat kelengkapan ringkasan disepakati","Harga akhir menyesuaikan kerumitan bahan"]},
  {id:11,title:"Jasa revisi tugas",category:"sekolah",label:"Revisi",icon:"spellcheck",price:"Mulai Rp3.000",desc:"Perbaiki typo, kalimat, format Word, dan struktur tulisan tugasmu.",
    prices:[["Koreksi typo dan ejaan","Rp3.000–5.000"],["Perbaikan kalimat agar lebih jelas","Rp5.000–10.000"],["Rapikan format Microsoft Word","Rp5.000–15.000"],["Rapikan makalah sederhana","Rp10.000–20.000"],["Perbaikan struktur dan alur tulisan","Rp10.000–25.000"],["Revisi dokumen panjang","Mulai Rp25.000"]],
    includes:["Kirim file asli beserta catatan revisi","Isi dan maksud tulisan tetap milikmu","Hasil revisi dikonfirmasi sebelum penyerahan"]},
  {id:12,title:"Suntik sosmed",category:"bisnis",label:"Pertumbuhan akun",icon:"trending",price:"Harga fleksibel",priceFull:"Harga bisa naik turun · tanya harga terbaru",desc:"Tambah followers, likes, share, dan comment untuk berbagai platform.",
    tags:["Instagram","YouTube","WhatsApp","X","TikTok","Facebook","Dan lain-lain"],
    includes:["Metode dan sumber layanan dijelaskan sebelum transaksi","Tidak menjamin angka atau hasil tertentu","Hindari bot atau interaksi palsu yang melanggar ketentuan platform"]},
  {id:13,title:"Jual nokos",category:"bisnis",label:"Produk digital",icon:"sim",price:"Harga fleksibel",priceFull:"Harga bisa naik turun · cek ketersediaan",desc:"Nomor kosong untuk WhatsApp, Telegram, dan semua aplikasi.",
    tags:["WhatsApp","Telegram","Semua aplikasi"],
    includes:["Ketersediaan diperiksa sebelum pembayaran","Sumber dan ketentuan produk harus jelas","Tidak melayani penggunaan nomor untuk penipuan atau mengakali verifikasi"]},
  {id:14,title:"Aplikasi & akun premium",category:"bisnis",label:"Langganan digital",icon:"crown",price:"Harga fleksibel",priceFull:"Harga bisa naik turun · cek paket dan harga",desc:"Akun dan aplikasi premium favoritmu, dari streaming sampai desain.",
    tags:["Netflix","Spotify","YouTube","Amazon","Canva","Dan lain-lain"],
    includes:["Paket, masa aktif, dan metode aktivasi dijelaskan","Ketersediaan dan harga dikonfirmasi dahulu","Tidak menjual akses yang diperoleh secara tidak sah"]},
  /* Layanan baru */
  {id:15,title:"Desain logo & branding",category:"kreatif",label:"Desain",icon:"palette",price:"Tanya harga",desc:"Logo, banner, dan identitas visual sederhana untuk usaha atau komunitas.",
    includes:["Diskusi nama usaha, warna, dan gaya yang diinginkan","Jumlah revisi disepakati di awal","File akhir dikirim sesuai format yang dibutuhkan"]},
  {id:16,title:"Convert & olah file",category:"sekolah",label:"Dokumen",icon:"fileconvert",price:"Tanya harga",desc:"Ubah format PDF, Word, Excel, atau gambar, juga kompres dan gabung file.",
    tags:["PDF","Word","Excel","Gambar"],
    includes:["Kirim file dan format tujuan yang diinginkan","Tata letak dicek agar tetap rapi setelah diubah","Privasi file dijaga dan tidak disebarkan"]},
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
    const haystack = `${s.title} ${s.label} ${s.desc} ${(s.tags || []).join(" ")} ${(s.prices || []).map(p => p[0]).join(" ")}`.toLowerCase();
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

function renderDialogDetails(s) {
  const priceBox = document.getElementById("dialogPrice");
  let extra = document.getElementById("dialogPriceList");
  if (!extra) {
    extra = document.createElement("div");
    extra.id = "dialogPriceList";
    priceBox.after(extra);
  }
  const rows = (s.prices || []).map(([name, value, sub]) => `
    <li><div><span class="pl-name">${name}</span>${sub ? `<small>${sub}</small>` : ""}</div><b>${value}</b></li>`).join("");
  const tags = (s.tags || []).map(t => `<span>${t}</span>`).join("");
  extra.innerHTML =
    (rows ? `<h3>Daftar harga</h3><ul class="price-list">${rows}</ul>` : "") +
    (s.priceNote ? `<p class="price-note">${s.priceNote}</p>` : "") +
    (tags ? `<h3>Tersedia untuk</h3><div class="tag-list">${tags}</div>` : "");
}

function openService(id) {
  const s = services.find(item => item.id === Number(id));
  if (!s) return;
  document.getElementById("dialogIcon").innerHTML = ICONS[s.icon] || "";
  document.getElementById("dialogCategory").textContent = s.label.toUpperCase();
  document.getElementById("dialogTitle").textContent = s.title;
  document.getElementById("dialogDescription").textContent = s.desc;
  document.getElementById("dialogPrice").textContent = s.priceFull || s.price;
  renderDialogDetails(s);
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

/* ===== Smooth 60fps Lerp Parallax & 3D Tilt di Ilustrasi Hero (PC, HP, Tablet) ===== */
const heroArt = document.querySelector(".hero-art");
const heroSection = document.querySelector(".hero");
if (heroArt && heroSection) {
  let targetX = 0, targetY = 0, curX = 0, curY = 0, rafHero = 0;

  function updateHeroTilt() {
    curX += (targetX - curX) * 0.1;
    curY += (targetY - curY) * 0.1;
    heroArt.style.setProperty("--px", `${(curX * 15).toFixed(2)}px`);
    heroArt.style.setProperty("--py", `${(curY * 15).toFixed(2)}px`);
    heroArt.style.setProperty("--ry", `${(curX * 12).toFixed(2)}deg`);
    heroArt.style.setProperty("--rx", `${(-curY * 10).toFixed(2)}deg`);
    heroArt.style.setProperty("--gx", `${(50 + curX * 38).toFixed(1)}%`);
    heroArt.style.setProperty("--gy", `${(32 + curY * 38).toFixed(1)}%`);
    if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
      rafHero = requestAnimationFrame(updateHeroTilt);
    } else {
      rafHero = 0;
    }
  }

  function setHeroTarget(clientX, clientY) {
    const r = heroArt.getBoundingClientRect();
    if (!r.width || !r.height) return;
    targetX = Math.max(-1, Math.min(1, (clientX - (r.left + r.width / 2)) / (r.width * 0.58)));
    targetY = Math.max(-1, Math.min(1, (clientY - (r.top + r.height / 2)) / (r.height * 0.58)));
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }

  heroSection.addEventListener("mousemove", e => setHeroTarget(e.clientX, e.clientY), { passive: true });
  heroSection.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }, { passive: true });

  // Interaksi sentuh & gyroscope di HP / Tablet
  heroSection.addEventListener("touchmove", e => {
    if (e.touches && e.touches[0]) setHeroTarget(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  heroSection.addEventListener("touchend", () => {
    targetX = 0;
    targetY = 0;
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }, { passive: true });

  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null || e.beta == null) return;
    targetX = Math.max(-1, Math.min(1, e.gamma / 26));
    targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 26));
    if (!rafHero) rafHero = requestAnimationFrame(updateHeroTilt);
  }, { passive: true });
}

/* ===== Interactive 3D Tilt & Spotlight pada Kartu Katalog, Cara Pesan & About Band ===== */
const TILT_SELECTOR = ".service-card, .flow-card, .about-band";
let activeTiltCard = null;

function applyCardTilt(card, clientX, clientY) {
  const r = card.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const mx = clientX - r.left;
  const my = clientY - r.top;
  const nx = Math.max(-1, Math.min(1, (mx / r.width) * 2 - 1));
  const ny = Math.max(-1, Math.min(1, (my / r.height) * 2 - 1));
  const maxDeg = card.classList.contains("about-band") ? 3.5 : card.classList.contains("flow-card") ? 5 : 6.5;
  card.style.setProperty("--mx", `${mx.toFixed(1)}px`);
  card.style.setProperty("--my", `${my.toFixed(1)}px`);
  card.style.setProperty("--rx", `${(-ny * maxDeg).toFixed(2)}deg`);
  card.style.setProperty("--ry", `${(nx * maxDeg).toFixed(2)}deg`);
}

function resetCardTilt(card) {
  if (!card) return;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

document.addEventListener("mousemove", e => {
  const card = e.target.closest(TILT_SELECTOR);
  if (activeTiltCard && activeTiltCard !== card) {
    resetCardTilt(activeTiltCard);
  }
  activeTiltCard = card;
  if (card) applyCardTilt(card, e.clientX, e.clientY);
}, { passive: true });

document.addEventListener("mouseleave", () => {
  if (activeTiltCard) resetCardTilt(activeTiltCard);
  activeTiltCard = null;
}, { passive: true });

document.addEventListener("touchmove", e => {
  if (!e.touches || !e.touches[0]) return;
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  const card = el && el.closest ? el.closest(".service-card, .flow-card") : null;
  if (activeTiltCard && activeTiltCard !== card) resetCardTilt(activeTiltCard);
  activeTiltCard = card;
  if (card) applyCardTilt(card, t.clientX, t.clientY);
}, { passive: true });

document.addEventListener("touchend", () => {
  if (activeTiltCard) resetCardTilt(activeTiltCard);
  activeTiltCard = null;
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
