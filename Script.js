/* ============================================================
   script.js — Kebab Sultan
   File ini berisi semua JavaScript / logika interaktif website

   KONSEP DASAR JAVASCRIPT:
   - document.querySelector()  → mencari 1 elemen di halaman
   - document.querySelectorAll() → mencari semua elemen yang cocok
   - addEventListener()        → mendengarkan event (klik, submit, dll)
   - preventDefault()          → mencegah aksi default browser
   ============================================================ */


/* ============================================================
   1. SMOOTH SCROLL
      Saat link navigasi diklik (href="#tentang", dll),
      halaman akan scroll dengan animasi halus ke section tujuan,
      bukan langsung lompat.
   ============================================================ */

// Pilih semua elemen <a> yang href-nya dimulai dengan "#"
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {

  // Tambahkan event listener 'click' pada setiap link tersebut
  anchor.addEventListener('click', function(e) {

    // Ambil nilai href, misal "#tentang"
    const targetId = this.getAttribute('href');

    // Cari elemen dengan id tersebut di halaman
    const target = document.querySelector(targetId);

    // Jika elemen ditemukan, lakukan smooth scroll
    if (target) {
      e.preventDefault();                        // cegah lompat langsung
      target.scrollIntoView({ behavior: 'smooth' }); // scroll halus
    }
  });

});


/* ============================================================
   2. FORM KIRIM PESAN → WHATSAPP
      Saat form dikirim, data dari input dikumpulkan dan
      diarahkan ke WhatsApp dengan pesan yang sudah terisi.
   ============================================================ */

// Ambil elemen form dari halaman
const formKontak = document.querySelector('form');

// Pantau event 'submit' pada form
formKontak.addEventListener('submit', function(e) {

  // Cegah form dikirim ke server (perilaku default browser)
  e.preventDefault();

  // Ambil nilai dari masing-masing input
  const nama  = document.getElementById('nama').value.trim();
  const hp    = document.getElementById('hp').value.trim();
  const email = document.getElementById('email').value.trim();
  const pesan = document.getElementById('pesan').value.trim();

  // Validasi sederhana: pastikan field penting tidak kosong
  if (!nama || !pesan) {
    alert('Mohon isi minimal Nama dan Pesan terlebih dahulu ya! 😊');
    return; // hentikan eksekusi jika belum diisi
  }

  // Susun teks pesan untuk WhatsApp
  // %0A = baris baru (line break) di URL
  const pesanWA =
    `Halo Kebab Sultan! 🥙%0A` +
    `------------------------%0A` +
    `Nama  : ${nama}%0A` +
    `No HP : ${hp || '-'}%0A` +
    `Email : ${email || '-'}%0A` +
    `------------------------%0A` +
    `Pesan : ${pesan}`;

  // Nomor WhatsApp outlet (format internasional, tanpa +)
  const nomorWA = '62812345678';

  // Buka WhatsApp di tab baru dengan pesan yang sudah disiapkan
  window.open(`https://wa.me/${nomorWA}?text=${pesanWA}`, '_blank');

  // Reset form setelah dikirim
  formKontak.reset();
  alert('Pesanmu berhasil dikirim ke WhatsApp! 🎉');

});


/* ============================================================
   3. NAVBAR AKTIF SAAT SCROLL (Scroll Spy Sederhana)
      Saat pengguna scroll melewati sebuah section,
      link navbar yang sesuai akan diberi highlight.
   ============================================================ */

// Daftar section yang ingin dipantau
const sections    = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-link-custom');

// Fungsi untuk mengecek section mana yang sedang terlihat
function updateNavAktif() {
  let scrollY = window.scrollY; // posisi scroll saat ini (pixel dari atas)

  sections.forEach(function(section) {
    const sectionTop    = section.offsetTop - 100; // ambang batas atas
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    // Cek apakah posisi scroll berada dalam range section ini
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {

      // Hapus class aktif dari semua link
      navLinks.forEach(function(link) {
        link.style.color = 'rgba(255,255,255,0.85)';
      });

      // Beri warna emas pada link yang sesuai
      const linkAktif = document.querySelector(`.nav-link-custom[href="#${sectionId}"]`);
      if (linkAktif) {
        linkAktif.style.color = '#D4A017'; // warna emas
      }
    }
  });
}

// Panggil fungsi setiap kali pengguna scroll
window.addEventListener('scroll', updateNavAktif);


/* ============================================================
   4. ANIMASI FADE-IN SAAT SCROLL (Intersection Observer)
      Elemen akan muncul dengan animasi saat pertama kali
      terlihat di layar pengguna.

      IntersectionObserver = API browser untuk mendeteksi
      apakah elemen sedang terlihat di viewport (layar).
   ============================================================ */

// Tambahkan CSS animasi lewat JavaScript
const styleAnimasi = document.createElement('style');
styleAnimasi.textContent = `
  .fade-in-up {
    opacity   : 0;
    transform : translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in-up.terlihat {
    opacity   : 1;
    transform : translateY(0);
  }
`;
document.head.appendChild(styleAnimasi);

// Pilih semua card menu dan item keunggulan
const elemenAnimasi = document.querySelectorAll('.menu-card, .keunggulan-item, .kontak-card');

// Tambahkan class fade-in-up ke semua elemen tersebut
elemenAnimasi.forEach(function(el) {
  el.classList.add('fade-in-up');
});

// Buat observer (pengamat) yang memantau elemen
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    // Jika elemen terlihat di layar
    if (entry.isIntersecting) {
      entry.target.classList.add('terlihat'); // tambah class 'terlihat'
      observer.unobserve(entry.target);       // stop memantau (animasi cukup sekali)
    }
  });
}, {
  threshold: 0.1 // elemen dianggap terlihat jika 10% bagiannya sudah masuk layar
});

// Mulai amati setiap elemen
elemenAnimasi.forEach(function(el) {
  observer.observe(el);
});