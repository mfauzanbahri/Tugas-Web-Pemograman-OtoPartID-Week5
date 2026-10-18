/* OtoPartID - script.js
   JavaScript murni (data, function, percabangan, perulangan) + jQuery (efek & event). */
"use strict";

/* ===== 1. DATA DUMMY (array of object) ===== */
const KATEGORI = ["Sistem Pengereman", "Oli & Pelumas", "Kelistrikan & Busi", "Filter & Udara"];
const KUNCI_DATA = "otopartid_data";
const KUNCI_FLASH = "otopartid_flash";

const DATA_AWAL = [
  {
    kode: "06455-KVB-T01",
    nama: "Kampas Rem Depan Honda Vario",
    kategori: "Sistem Pengereman",
    deskripsi: "Kampas rem cakram depan orisinal. Cocok untuk Vario 110/125/150, Beat FI, Scoopy.",
    harga: { Shopee: 45000, Tokopedia: 48000 }
  },
  {
    kode: "15601-BZ010",
    nama: "Filter Oli Toyota Avanza",
    kategori: "Filter & Udara",
    deskripsi: "Filter oli untuk Toyota Avanza dan Daihatsu Xenia mesin 1.3/1.5.",
    harga: { Shopee: 28500, Tokopedia: 31000 }
  },
  {
    kode: "08798-9027",
    nama: "Oli Mesin Yamaha Yamalube 0.8L",
    kategori: "Oli & Pelumas",
    deskripsi: "Oli mesin motor matic Yamaha, kemasan 0.8 liter.",
    harga: { Shopee: 49000, Tokopedia: 52000 }
  },
  {
    kode: "CR8E",
    nama: "Busi NGK CR8E Motor 4-Tak",
    kategori: "Kelistrikan & Busi",
    deskripsi: "Busi standar untuk motor 4-tak 150cc dan sejenisnya.",
    harga: { Shopee: 32000, Tokopedia: 35000 }
  },
  {
    kode: "17220-RBJ-000",
    nama: "Filter Udara Honda Jazz GE8",
    kategori: "Filter & Udara",
    deskripsi: "Filter udara kabin mesin untuk Honda Jazz GE8.",
    harga: { Shopee: 85000, Tokopedia: 89000 }
  },
  {
    kode: "04465-0K090",
    nama: "Kampas Rem Depan Toyota Innova",
    kategori: "Sistem Pengereman",
    deskripsi: "Kampas rem depan untuk Toyota Kijang Innova diesel dan bensin.",
    harga: { Shopee: 210000, Tokopedia: 225000 }
  }
];

/* Data disimpan di localStorage supaya perubahan (tambah/hapus) terbawa antar halaman */
function ambilData() {
  const teks = localStorage.getItem(KUNCI_DATA);
  if (teks) {
    try { return JSON.parse(teks); } catch (e) { /* data rusak, pakai data awal */ }
  }
  return JSON.parse(JSON.stringify(DATA_AWAL));
}

function simpanData(data) {
  localStorage.setItem(KUNCI_DATA, JSON.stringify(data));
}

/* ===== 2. FUNCTION PEMROSES DATA ===== */
function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function escapeHtml(teks) {
  return String(teks).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* Harga termurah dari semua marketplace untuk satu sparepart */
function hargaTermurah(item) {
  let min = Infinity;
  for (const marketplace in item.harga) {
    if (item.harga[marketplace] < min) {
      min = item.harga[marketplace];
    }
  }
  return min;
}

/* Hitung statistik katalog: total, jumlah per kategori, marketplace, harga termurah */
function hitungStatistik(data) {
  const perKategori = {};
  const marketplace = new Set();
  let termurah = null;

  for (const item of data) {
    perKategori[item.kategori] = (perKategori[item.kategori] || 0) + 1;
    for (const m in item.harga) {
      marketplace.add(m);
    }
    const h = hargaTermurah(item);
    if (termurah === null || h < termurah) {
      termurah = h;
    }
  }
  return {
    total: data.length,
    perKategori: perKategori,
    jumlahMarketplace: marketplace.size,
    termurah: termurah
  };
}

/* Filter berdasarkan kata kunci (nama / kode OEM) dan kategori */
function filterData(data, kataKunci, kategori) {
  const kunci = (kataKunci || "").trim().toLowerCase();
  return data.filter(function (item) {
    const cocokKunci = kunci === "" ||
      item.nama.toLowerCase().includes(kunci) ||
      item.kode.toLowerCase().includes(kunci);
    const cocokKategori = !kategori || item.kategori === kategori;
    return cocokKunci && cocokKategori;
  });
}

/* Urutkan salinan data (data asli tidak diubah) */
function urutkanData(data, mode) {
  const salinan = data.slice();
  if (mode === "harga-asc") {
    salinan.sort(function (a, b) { return hargaTermurah(a) - hargaTermurah(b); });
  } else if (mode === "harga-desc") {
    salinan.sort(function (a, b) { return hargaTermurah(b) - hargaTermurah(a); });
  } else {
    salinan.sort(function (a, b) { return a.nama.localeCompare(b.nama); });
  }
  return salinan;
}

/* ===== 3. RENDER DINAMIS (percabangan + perulangan) ===== */
function buatBaris(item, bisaHapus) {
  const kodeAman = escapeHtml(item.kode);
  const link = "detail.html?kode=" + encodeURIComponent(item.kode);
  let aksi = '<a href="' + link + '" class="text-blue-700 font-medium hover:underline">Lihat Detail</a>';
  if (bisaHapus) {
    aksi += ' <button type="button" class="btn-hapus ml-3 text-red-600 font-medium hover:underline" data-kode="' + kodeAman + '">Hapus</button>';
  }
  return '<tr class="odd:bg-white even:bg-gray-50 hover:bg-amber-50">' +
    '<td class="px-4 py-3 whitespace-nowrap">' + kodeAman + '</td>' +
    '<td class="px-4 py-3">' + escapeHtml(item.nama) + '</td>' +
    '<td class="px-4 py-3"><span class="inline-block rounded-full bg-slate-200 px-2.5 py-0.5 text-xs">' + escapeHtml(item.kategori) + '</span></td>' +
    '<td class="px-4 py-3 whitespace-nowrap">' + formatRupiah(hargaTermurah(item)) + '</td>' +
    '<td class="px-4 py-3 whitespace-nowrap">' + aksi + '</td></tr>';
}

function renderIndex() {
  const data = ambilData();
  const stat = hitungStatistik(data);

  $("#statTotal").text(stat.total);
  $("#statKategori").text(Object.keys(stat.perKategori).length);
  $("#statMarketplace").text(stat.jumlahMarketplace);
  $("#statTermurah").text(stat.termurah === null ? "-" : formatRupiah(stat.termurah));

  const $tabel = $("#tabelTerbaru").empty();
  const terbaru = data.slice(-3).reverse();
  if (terbaru.length === 0) {
    $tabel.append('<tr><td colspan="5" class="px-4 py-6 text-center text-slate-500">Belum ada sparepart. Tambahkan lewat menu Tambah Data.</td></tr>');
  } else {
    for (const item of terbaru) {
      $tabel.append(buatBaris(item, false));
    }
  }

  const $kategori = $("#daftarKategori").empty();
  for (const k of KATEGORI) {
    $kategori.append('<li class="flex justify-between px-4 py-3">' + escapeHtml(k) +
      ' <span class="font-semibold">' + (stat.perKategori[k] || 0) + '</span></li>');
  }
}

function renderDaftar() {
  const semua = ambilData();
  let hasil = filterData(semua, $("#cari").val(), $("#filterKategori").val());
  hasil = urutkanData(hasil, $("#urutkan").val());

  const $tabel = $("#tabelSparepart").empty();
  if (hasil.length === 0) {
    $tabel.append('<tr><td colspan="5" class="px-4 py-6 text-center text-slate-500">Tidak ada sparepart yang cocok. Coba kata kunci lain atau ubah filter.</td></tr>');
  } else {
    for (const item of hasil) {
      $tabel.append(buatBaris(item, true));
    }
  }
  $("#jumlahData").text("Menampilkan " + hasil.length + " dari " + semua.length + " sparepart");
}

function renderDetail() {
  const kode = new URLSearchParams(window.location.search).get("kode");
  const data = ambilData();
  let item = null;
  if (kode) {
    item = data.find(function (d) { return d.kode === kode; }) || null;
  } else if (data.length > 0) {
    item = data[0];
  }

  if (item === null) {
    $("#detailKonten").hide();
    $("#tidakDitemukan").show();
    return;
  }

  document.title = item.nama + " - OtoPartID";
  $("#judul").text(item.nama);
  $("#breadcrumbNama").text(item.nama);
  $("#spesifikasi").html(
    '<dt class="font-semibold">Kode OEM</dt><dd class="col-span-2">' + escapeHtml(item.kode) + '</dd>' +
    '<dt class="font-semibold">Kategori</dt><dd class="col-span-2">' + escapeHtml(item.kategori) + '</dd>' +
    '<dt class="font-semibold">Harga termurah</dt><dd class="col-span-2">' + formatRupiah(hargaTermurah(item)) + '</dd>'
  );
  $("#deskripsiText").text(item.deskripsi || "Belum ada deskripsi.");

  // Urutkan marketplace dari harga terendah, lalu tampilkan baris per baris
  const daftar = Object.keys(item.harga).map(function (m) {
    return { nama: m, harga: item.harga[m] };
  }).sort(function (a, b) { return a.harga - b.harga; });

  const $tabel = $("#tabelHarga").empty();
  for (let i = 0; i < daftar.length; i++) {
    const baris = daftar[i];
    const status = (i === 0)
      ? '<span class="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-semibold">Termurah</span>'
      : "-";
    const adaLink = (baris.nama === "Shopee" || baris.nama === "Tokopedia");
    const linkBeli = adaLink
      ? '<a href="#" class="inline-block rounded-md ' + (i === 0 ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "border border-gray-400 text-slate-700 hover:bg-gray-100") + ' font-medium px-3 py-1">Beli di ' + baris.nama + '</a>'
      : "-";
    $tabel.append('<tr><td class="px-4 py-3">' + escapeHtml(baris.nama) + '</td><td class="px-4 py-3">' +
      formatRupiah(baris.harga) + '</td><td class="px-4 py-3">' + status + '</td><td class="px-4 py-3">' + linkBeli + '</td></tr>');
  }

  if (daftar.length > 1) {
    const hemat = daftar[daftar.length - 1].harga - daftar[0].harga;
    $("#infoHemat").text("Beli di " + daftar[0].nama + " untuk hemat " + formatRupiah(hemat) + " dibanding harga tertinggi.");
  } else {
    $("#infoHemat").text("Baru satu sumber harga yang tercatat.");
  }
}

/* ===== 4. jQuery: NOTIFIKASI, VALIDASI FORM, EFEK ===== */
function tampilToast(pesan, tipe) {
  const warna = (tipe === "error") ? "bg-red-600" : "bg-green-600";
  $("#toast").stop(true, true).removeClass("bg-red-600 bg-green-600").addClass(warna)
    .text(pesan).fadeIn(200).delay(2500).fadeOut(400);
}

function tampilFlash() {
  const pesan = sessionStorage.getItem(KUNCI_FLASH);
  if (pesan) {
    sessionStorage.removeItem(KUNCI_FLASH);
    tampilToast(pesan, "sukses");
  }
}

/* Validasi form: cek field kosong, harga, dan kode OEM ganda. Kembalikan object nilai bila valid. */
function validasiForm($form) {
  $form.find(".pesan-error").remove();
  $form.find(".border-red-500").removeClass("border-red-500").addClass("border-gray-300");

  const nilai = {
    kode: String($form.find('[name="kodeOem"]').val()).trim(),
    nama: String($form.find('[name="namaPart"]').val()).trim(),
    kategori: $form.find('[name="kategori"]').val(),
    harga: Number($form.find('[name="hargaTermurah"]').val()),
    deskripsi: String($form.find('[name="deskripsi"]').val() || "").trim()
  };
  let valid = true;

  function tandai(namaField, pesan) {
    const $field = $form.find('[name="' + namaField + '"]');
    $field.removeClass("border-gray-300").addClass("border-red-500");
    $("<p>").addClass("pesan-error text-sm text-red-600 mt-1").text(pesan).hide().insertAfter($field).fadeIn(150);
    valid = false;
  }

  if (nilai.kode === "") {
    tandai("kodeOem", "Kode OEM wajib diisi.");
  } else if (ambilData().some(function (d) { return d.kode.toLowerCase() === nilai.kode.toLowerCase(); })) {
    tandai("kodeOem", "Kode OEM " + nilai.kode + " sudah ada di katalog.");
  }
  if (nilai.nama === "") {
    tandai("namaPart", "Nama sparepart wajib diisi.");
  }
  if ($form.find('[name="hargaTermurah"]').val() === "") {
    tandai("hargaTermurah", "Estimasi harga wajib diisi.");
  } else if (isNaN(nilai.harga) || nilai.harga <= 0) {
    tandai("hargaTermurah", "Harga harus lebih dari 0.");
  }

  return valid ? nilai : null;
}

function tambahData(nilai) {
  const data = ambilData();
  data.push({
    kode: nilai.kode,
    nama: nilai.nama,
    kategori: nilai.kategori,
    deskripsi: nilai.deskripsi,
    harga: { "Estimasi pengguna": nilai.harga }
  });
  simpanData(data);
}

$(function () {
  tampilFlash();
  const halaman = $("body").attr("data-page");

  if (halaman === "index") {
    renderIndex();
    $("#btnReset").on("click", function () {
      if (confirm("Kembalikan data ke contoh awal? Data yang kamu tambah akan hilang.")) {
        localStorage.removeItem(KUNCI_DATA);
        renderIndex();
        tampilToast("Data dikembalikan ke contoh awal.", "sukses");
      }
    });
  }

  if (halaman === "daftar") {
    renderDaftar();
    $("#cari").on("input", renderDaftar);
    $("#filterKategori, #urutkan").on("change", renderDaftar);

    // Tampilkan / sembunyikan form tambah cepat
    $("#btnToggleForm").on("click", function () {
      const terbuka = $(this).attr("aria-expanded") === "true";
      $("#formCepat").slideToggle(250);
      $(this).attr("aria-expanded", terbuka ? "false" : "true")
        .text(terbuka ? "Tambah sparepart" : "Tutup form");
    });

    // Hapus data dengan konfirmasi dan efek fadeOut
    $("#tabelSparepart").on("click", ".btn-hapus", function () {
      const kode = $(this).attr("data-kode");
      const $baris = $(this).closest("tr");
      if (!confirm("Hapus sparepart " + kode + " dari daftar?")) {
        return;
      }
      $baris.fadeOut(300, function () {
        simpanData(ambilData().filter(function (d) { return d.kode !== kode; }));
        renderDaftar();
        tampilToast("Sparepart " + kode + " dihapus.", "sukses");
      });
    });
  }

  if (halaman === "detail") {
    renderDetail();
    $("#btnDeskripsi").on("click", function () {
      const terbuka = $(this).attr("aria-expanded") === "true";
      $("#deskripsiBox").slideToggle(250);
      $(this).attr("aria-expanded", terbuka ? "false" : "true")
        .text(terbuka ? "Tampilkan deskripsi" : "Sembunyikan deskripsi");
    });
  }

  // Form tambah data (form.html dan form cepat di daftar.html)
  $(".form-sparepart").on("submit", function (e) {
    e.preventDefault();
    const $form = $(this);
    const nilai = validasiForm($form);
    if (nilai === null) {
      tampilToast("Periksa kembali isian yang ditandai merah.", "error");
      return;
    }
    tambahData(nilai);

    if ($form.attr("data-mode") === "halaman") {
      sessionStorage.setItem(KUNCI_FLASH, "Sparepart " + nilai.nama + " berhasil ditambahkan.");
      window.location.href = "daftar.html";
    } else {
      $form[0].reset();
      $("#formCepat").slideUp(250);
      $("#btnToggleForm").attr("aria-expanded", "false").text("Tambah sparepart");
      renderDaftar();
      tampilToast("Sparepart " + nilai.nama + " berhasil ditambahkan.", "sukses");
    }
  });

  $(".form-sparepart").on("reset", function () {
    $(this).find(".pesan-error").remove();
    $(this).find(".border-red-500").removeClass("border-red-500").addClass("border-gray-300");
  });

  // Pesan error hilang saat field diperbaiki
  $(".form-sparepart").on("input change", "input, select, textarea", function () {
    $(this).removeClass("border-red-500").addClass("border-gray-300").next(".pesan-error").remove();
  });
});
