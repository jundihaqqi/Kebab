/* ============================================================
   cabang.js — Logika Alur Pemesanan Kebab Kota Raja
   Flow: Pilih Cabang → Pilih Menu → Konfirmasi → WA
============================================================ */


/* ============================================================
   1. DATA CABANG — Samarinda
============================================================ */
const dataCabang = {
  bungtomo: {
    nama   : 'Cabang Samarinda — Bung Tomo',
    alamat : 'Jl. Bung Tomo (Tb. Perkakas Shop), Samarinda',
    wa     : '6281111111111',
    jam    : '10.00 – 22.00'
  },
  pattimura: {
    nama   : 'Cabang Samarinda — Pattimura',
    alamat : 'Jl. Pattimura (Seberang Kantor Samsat), Samarinda',
    wa     : '6282222222222',
    jam    : '10.00 – 22.00'
  },
  soekarnohatta: {
    nama   : 'Cabang Samarinda — Loa Janan Ilir',
    alamat : 'Jl. Soekarno Hatta KM 1, Loa Janan Ilir, Samarinda',
    wa     : '6283333333333',
    jam    : '10.00 – 22.00'
  },
  sejati: {
    nama   : 'Cabang Samarinda — Sejati',
    alamat : 'Jl. Sejati (Depan Kedai Mantan), Samarinda',
    wa     : '6284444444444',
    jam    : '10.00 – 22.00'
  },
  makroman: {
    nama   : 'Cabang Samarinda — Makroman',
    alamat : 'Jl. Makroman (Seberang Alfamidi), Samarinda',
    wa     : '6285555555555',
    jam    : '10.00 – 22.00'
  }
};


/* ============================================================
   2. DATA MENU
============================================================ */
const dataMenu = [
  { nama: 'Kebab Original Sultan', harga: 25000, emoji: '🥙' },
  { nama: 'Kebab Ayam Bakar',      harga: 22000, emoji: '🌯' },
  { nama: 'Kebab Double Beef',     harga: 35000, emoji: '🌮' },
  { nama: 'Paket Kebab + Kentang', harga: 35000, emoji: '🍟' },
  { nama: 'Kebab Veggie Special',  harga: 20000, emoji: '🥗' },
  { nama: 'Kebab Sultan Spicy',    harga: 27000, emoji: '🌶️' },
];


/* ============================================================
   3. STATE APLIKASI
============================================================ */
let cabangDipilih = null;
let pesanan       = [];


/* ============================================================
   4. FUNGSI: PILIH CABANG
============================================================ */
function pilihCabang(kodeCabang) {
  cabangDipilih = kodeCabang;
  const cabang  = dataCabang[kodeCabang];

  document.getElementById('nama-cabang-terpilih').textContent = cabang.nama;
  updateStep(2);
  tampilkanHalaman('halaman-menu');
}


/* ============================================================
   5. FUNGSI: GANTI CABANG
============================================================ */
function gantiCabang() {
  cabangDipilih = null;
  pesanan       = [];

  document.querySelectorAll('.qty-angka').forEach(function(el) {
    el.textContent = '0';
    el.classList.remove('ada-item');
  });

  document.querySelectorAll('.qty-btn.tambah').forEach(function(el) {
    el.classList.remove('aktif');
  });

  document.querySelectorAll('.menu-card-pesan').forEach(function(el) {
    el.classList.remove('dipilih');
  });

  document.getElementById('ringkasan-box').classList.add('d-none');

  const btnLanjut = document.getElementById('btn-lanjut-wa');
  btnLanjut.disabled = true;
  document.getElementById('total-item-badge').textContent = '0 item';

  updateStep(1);
  tampilkanHalaman('halaman-cabang');
}


/* ============================================================
   6. FUNGSI: UBAH QTY MENU
============================================================ */
function ubahQty(tombol, perubahan) {
  const card         = tombol.closest('.menu-card-pesan');
  const qtyAngka     = card.querySelector('.qty-angka');
  const tombolTambah = card.querySelector('.qty-btn.tambah');

  let qtySaatIni = parseInt(qtyAngka.textContent);
  let qtyBaru    = Math.max(0, qtySaatIni + perubahan);

  qtyAngka.textContent = qtyBaru;

  if (qtyBaru > 0) {
    qtyAngka.classList.add('ada-item');
    tombolTambah.classList.add('aktif');
    card.classList.add('dipilih');
  } else {
    qtyAngka.classList.remove('ada-item');
    tombolTambah.classList.remove('aktif');
    card.classList.remove('dipilih');
  }

  kumpulkanPesanan();
}


/* ============================================================
   7. FUNGSI: KUMPULKAN PESANAN
============================================================ */
function kumpulkanPesanan() {
  pesanan = [];

  const semuaCard = document.querySelectorAll('.menu-card-pesan');

  semuaCard.forEach(function(card, index) {
    const qty = parseInt(card.querySelector('.qty-angka').textContent);

    if (qty > 0) {
      pesanan.push({
        index : index,
        nama  : dataMenu[index].nama,
        harga : dataMenu[index].harga,
        emoji : dataMenu[index].emoji,
        qty   : qty
      });
    }
  });

  updateRingkasan();
  updateTombolLanjut();
}


/* ============================================================
   8. FUNGSI: UPDATE RINGKASAN
============================================================ */
function updateRingkasan() {
  const ringkasanBox = document.getElementById('ringkasan-box');
  const ringkasanIsi = document.getElementById('ringkasan-isi');
  const totalHarga   = document.getElementById('ringkasan-total-harga');

  if (pesanan.length === 0) {
    ringkasanBox.classList.add('d-none');
    return;
  }

  ringkasanBox.classList.remove('d-none');

  let htmlIsi = '';
  let total   = 0;

  pesanan.forEach(function(item) {
    const subtotal = item.harga * item.qty;
    total += subtotal;

    htmlIsi += `
      <div class="ringkasan-item">
        <span>${item.emoji} ${item.nama} × ${item.qty}</span>
        <span>Rp ${formatRupiah(subtotal)}</span>
      </div>
    `;
  });

  ringkasanIsi.innerHTML = htmlIsi;
  totalHarga.textContent = 'Rp ' + formatRupiah(total);
}


/* ============================================================
   9. FUNGSI: UPDATE TOMBOL LANJUT
============================================================ */
function updateTombolLanjut() {
  const btnLanjut = document.getElementById('btn-lanjut-wa');
  const badge     = document.getElementById('total-item-badge');
  const hint      = document.getElementById('hint-pilih-menu');

  const totalItem = pesanan.reduce(function(jumlah, item) {
    return jumlah + item.qty;
  }, 0);

  badge.textContent = totalItem + ' item';

  if (totalItem > 0) {
    btnLanjut.disabled = false;
    hint.style.display = 'none';
  } else {
    btnLanjut.disabled = true;
    hint.style.display = 'block';
  }
}


/* ============================================================
   10. FUNGSI: LANJUT KE WA (Tampilkan halaman konfirmasi)
============================================================ */
function lanjutKeWA() {
  if (pesanan.length === 0) return;

  const cabang = dataCabang[cabangDipilih];

  document.getElementById('konfirmasi-cabang').innerHTML =
    `<strong>${cabang.nama}</strong><br>
     <small style="color:var(--warna-abu);">${cabang.alamat}</small>`;

  let htmlMenu = '';
  let total    = 0;

  pesanan.forEach(function(item) {
    const subtotal = item.harga * item.qty;
    total += subtotal;

    htmlMenu += `
      <div class="konfirmasi-menu-item">
        <span>${item.emoji} ${item.nama}
          <span style="color:var(--warna-abu);font-size:0.85rem"> × ${item.qty}</span>
        </span>
        <span style="font-weight:700;">Rp ${formatRupiah(subtotal)}</span>
      </div>
    `;
  });

  document.getElementById('konfirmasi-menu-list').innerHTML = htmlMenu;
  document.getElementById('konfirmasi-total').textContent = 'Rp ' + formatRupiah(total);

  updateStep(3);
  tampilkanHalaman('halaman-konfirmasi');
}


/* ============================================================
   11. FUNGSI: KEMBALI KE MENU
============================================================ */
function kembaliKeMenu() {
  updateStep(2);
  tampilkanHalaman('halaman-menu');
}


/* ============================================================
   12. FUNGSI: KIRIM KE WA
============================================================ */
function kirimKeWA() {
  const cabang  = dataCabang[cabangDipilih];
  const catatan = document.getElementById('catatan-pesan').value.trim();

  const total = pesanan.reduce(function(jml, item) {
    return jml + (item.harga * item.qty);
  }, 0);

  let pesan = `Halo Kebab Kota Raja! 🥙%0A`;
  pesan    += `Saya ingin memesan:%0A`;
  pesan    += `━━━━━━━━━━━━━━━━%0A`;

  pesanan.forEach(function(item) {
    const subtotal = item.harga * item.qty;
    pesan += `${item.emoji} ${item.nama} × ${item.qty} = Rp ${formatRupiah(subtotal)}%0A`;
  });

  pesan += `━━━━━━━━━━━━━━━━%0A`;
  pesan += `💰 *Total: Rp ${formatRupiah(total)}*%0A`;

  if (catatan) {
    pesan += `📝 Catatan: ${catatan}%0A`;
  }

  pesan += `%0ATerima kasih! 🙏`;

  const urlWA = `https://wa.me/${cabang.wa}?text=${pesan}`;
  window.open(urlWA, '_blank');
}


/* ============================================================
   13. FUNGSI BANTU: FORMAT RUPIAH
============================================================ */
function formatRupiah(angka) {
  return angka.toLocaleString('id-ID');
}


/* ============================================================
   14. FUNGSI BANTU: TAMPILKAN HALAMAN
============================================================ */
function tampilkanHalaman(idHalaman) {
  const semuaHalaman = ['halaman-cabang', 'halaman-menu', 'halaman-konfirmasi'];

  semuaHalaman.forEach(function(id) {
    const el = document.getElementById(id);

    if (id === idHalaman) {
      el.classList.remove('d-none');
      el.classList.add('fade-masuk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.classList.add('d-none');
      el.classList.remove('fade-masuk');
    }
  });
}


/* ============================================================
   15. FUNGSI BANTU: UPDATE STEP / BREADCRUMB
============================================================ */
function updateStep(stepAktif) {
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById('step-' + i);
    stepEl.classList.remove('active', 'selesai');

    if (i < stepAktif) {
      stepEl.classList.add('selesai');
    } else if (i === stepAktif) {
      stepEl.classList.add('active');
    }
  }

  for (let j = 1; j <= 2; j++) {
    const connEl = document.getElementById('conn-' + j);
    if (connEl) {
      if (j < stepAktif) {
        connEl.classList.add('aktif');
      } else {
        connEl.classList.remove('aktif');
      }
    }
  }
}