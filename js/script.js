/* ================================
   JAVASCRIPT LANJUTAN — SILA
   DOM, Event Handling, CRUD, localStorage
   ================================ */

// ════════════════════════════════
// DATA LAYER (localStorage)
// localStorage adalah penyimpanan data di browser
// Data tidak hilang meskipun: halaman di-refresh, browser ditutup
// yang bertahan meskipun halaman ditutup/refresh.
// Data disimpan sebagai string JSON.
// Alur: Array → JSON → localStorage
// ════════════════════════════════

// 1. Membaca data dari localStorage dan menkonversi dari JSON ke Array
function getData() {
   const raw = localStorage.getItem('sila_data');
   // jika datanya-ada. Parse JSON --> JSON Array; Jika data tidak ada kembalikan array kosong
   return raw ? JSON.parse(raw) : [];
}

// 2. Menyimpan data ke localStorage (Array dikonversi ke string JSON)
function saveData(data) {
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// ════════════════════════════════
// HELPERS (Fungsi Pembantu)
// ════════════════════════════════

// Mengubah format tanggal '2024-01-05' -> '5 Jan 2024'
function formatTanggal(dateStr) {
   const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
   const d = new Date(dateStr); // Contoh format: '04 Juni 2026'
   return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// ════════════════════════════════
// FORM HANDLING
// Menangani form pengajuan: Mode Tambah (create) 
// dan mode edit (update) berdasarkan parameter URL
// Tugas Form: Mengumpulkan semua input user, validasi, create data baru, update data 
// baru,  simpan ke localStorage.
// ════════════════════════════════


function initForm() {
   const form = document.getElementById('formPengajuan');
   if (!form) return; // Jika halaman tidak punya form, keluar

   // -- Deteksi Mode Edit --
   // URLSearchParams membaca parameter dari URL, contoh:
   // Jika parameter URL edit ditemukan, maka data lama akan ditampilkam, kembali ke
   // dalam form.

   const urlParams = new URLSearchParams(window.location.search);
   const editId = urlParams.get('edit');
   let editMode = false;

   if (editId) {
      // Cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemToEdit = data.find(function (item) { return item.id == editId; });
      // Edit data
      if (itemToEdit) {
         editMode = true; // Mode edit aktif
         // Isi field form dengan data yang ada (pre-fill)
         document.getElementById('nama').value = itemToEdit.nama || '';
         document.getElementById('nim').value = itemToEdit.nim || '';
         const prodiEl = document.getElementById('prodi');
         if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi;
         const layananEl = document.getElementById('layanan');
         if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan;
         document.getElementById('tanggal').value = itemToEdit.tanggal || '';
         document.getElementById('keterangan').value = itemToEdit.keterangan || '';

         // Ubah teks tombol submit menjadi "Simpan Perubahan"
         const btnSubmit = form.querySelector('button[type="submit"]');
         if (btnSubmit) btnSubmit.innerHTML = '✏️ Simpan Perubahan'
      }
   }


   // -- Event Listener: Submit Form --
   // addEventListener menambahkan fungsi yang dipanggil saat event terjadi.
   // 'submit' = saat tombol submit di klik / Enter ditekan.
   // Saat Tombol SIMPAN ditekan: 1. Ambil data dari form, 2. Validasi data, 3.
   // Simpan data, 4. Redirect ke halaman riwayat
   // element.addEventListenet('event', function())
   form.addEventListener('submit', function (e) {
      e.preventDefault(); // mencegah from reload halaman (default browser)

      // Ambil nilai semua field (trim() = hapus spasi di awal/akhir)
      // .value = untuk mengambil nilai dari input/select/textarea
      const nama = document.getElementById('nama').value.trim();
      const nim = document.getElementById('nim').value.trim();
      const prodi = document.getElementById('prodi').value;
      const layanan = document.getElementById('layanan').value;
      const tanggal = document.getElementById('tanggal').value;
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError');

      // Reset pesan error sebelum di validasi
      errorEl.textContent = '';

      // --- Validasi Input ---
      // Semua field wajib diisi. Jika tidak valid: -> tampilkan pesan error -> hentikan proses
      if (!nama || !nim || !prodi || !layanan || !tanggal) {
         errorEl.textContent = '❌ Semua field wajib harus diisi!'
         return; // Hentikan eksekusi jika tidak valid
      }

      // NIM harus tepat 8 digit angka
      if (nim.length !== 8 || isNaN(nim)) {
         errorEl.textContent = '❌ NIM harus terdiri dari 8 digit angka!';
         return;
      }

      // -- CRUD: Create atau Update --
      const data = getData();

      if (editMode) {  // Jika mode edit
         // UPDATE: cari item berdasarkan ID, lalu update propertinya
         for (let i = 0; i < data.length; i++) {
            // Jika ide sama dengan edit Id maka mode edit (timpa data)
            if (data[i].id == editId) {
               data[i].nama = nama;
               data[i].nim = nim;
               data[i].prodi = prodi;
               data[i].layanan = layanan;
               data[i].tanggal = tanggal;
               data[i].keterangan = keterangan;
               break;
            }
         }
      }

      else {
         // CREATE: buat objek baru, ID menggunakan timestamp (unik)
         const item = {
            id: Date.now(), //Timestap dalam milidetik sbg ID unik 
            nama: nama,
            nim: nim,
            prodi: prodi,
            layanan: layanan,
            tanggal: tanggal,
            keterangan: keterangan
         };
         data.push(item); //tambahkan ke ujung array
      }

      saveData(data); // Simpan ke localStorage

      // Reset form dan redict ke halaman riwayat
      form.reset();
      errorEl.textContent = '';
      alert(editMode ? '✅ Perubahan berhasil disimpan!' : '✅ Pengajuan berhasil disimpan!');
      window.location.href = 'riwayat.html';  // Pindah halaman
   });
}

// ════════════════════════════════
// TABEL RIWAYAT
// Menampilkan semua data pengajuan dalam tabel HTML,
// serta menangani tombol Edit dan Hapus per baris.
// ════════════════════════════════

function initRiwayat() {
   // Ambil elemen-elemen DOM yang dibutuhkan
   const tbody = document.getElementById('tableBody');
   const emptyState = document.getElementById('emptyState');
   const dataCount = document.getElementById('dataCount');
   const btnHapusSemua = document.getElementById('btnHapusSemua');

   if (!tbody) return; // Jika bukan halaman riwayat, keluar

   renderTable(); // Tampilkan tabel saat halaman pertama dimuat

   // -- Event Listener: Tombol Hapus Semua --
   if (btnHapusSemua) {
      btnHapusSemua.addEventListener('click', function () {
         // confirm() menampilkan dialog konfirmasi, mengembalikan true/false
         if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
            saveData([]); // Simpan array kosong -> hapus semua
            renderTable();
         }
      });
   }

   // --Fungsi Render Table --
   // Membuat baris-baris tabel secara dinamis dari data localStorage.
   // Data Array ↓ Baris HTML ↓ Tabel
   function renderTable() {
      const data = getData();

      // Update teks counter jumlah data
      if (dataCount) {
         dataCount.textContent = data.length + ' pengajuan';
      }

      // Jika data kosong: Tampilkan empty state, sembunyikan tombol
      if (data.length === 0) {
         tbody.innerHTML = '';
         if (emptyState) emptyState.style.display = 'block';
         if (btnHapusSemua) btnHapusSemua.style.display = 'none';
         return;
      }

      // Sembunyikan empty state, tampilkan tombol hapus semua
      if (emptyState) emptyState.style.display = 'none';
      if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block';

      // Buat baris tabel (tr) untuk setiap item data
      tbody.innerHTML = ''; // bersihkan isi tbody terlebih dulu
      // Menampilkan seluruh data ke dalam tabel.
      for (let i = 0; i < data.length; i++) {
         const item = data[i];
         const tr = document.createElement('tr'); // buat elemen <tr> baru

         // innerHTML: isi baris dengan data dari objek item
         tr.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + item.nama + '</td>' +
            '<td>' + item.nim + '</td>' +
            '<td>' + item.layanan + '</td>' +
            '<td>' + formatTanggal(item.tanggal) + '</td>' +
            '<td>' +
            // Tombol edit: data-id digunakan untuk mengetahui item mana yang diedit
            '<button class="btn-edit" data-id = "' + item.id + '">✏️ Edit</button>' +
            '<button class="btn-hapus" data-id = "' + item.id + '">🗑️ Hapus</button>' +
            '</td>';

         tbody.appendChild(tr); // tambahkan baris ke tabel
      }

      // -- Event Listener: Tombol Edit --
      // querySelectorAll mengembalikan semua elemen dengan kelas .btn-edit
      const btnEdit = document.querySelectorAll('.btn-edit');
      // Mengirim ID data ke halaman form.
      btnEdit.forEach(function (btn) {
         btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            window.location.href = 'layanan.html?edit=' + id;
         });
      });

      // -- Event Listener: Tombol Hapus --
      // querySelectorAll mengembalikan semua elemen dengan kelas .btn-hapus
      const btnHapus = document.querySelectorAll('.btn-hapus');
      // Mengirim ID data ke halaman form.
      btnHapus.forEach(function (btn) {
         btn.addEventListener('click', function () {
            const id = Number(this.getAttribute('data-id'));
            if (confirm('Hapus pengajuan ini?')) {
               let data = getData();
               // filter(): buat array baru tanpa item yang dihapus
               data = data.filter(function (item) {
                  return item.id !== id; // pertahankan semua kecuali yang di hapus
               });
               saveData(data);
               renderTable(); // render ulang tabel setelah penghapusan
            }
         });
      });
   }
}
// ════════════════════════════════
//  INIT (Inisialisasi)
//  DOMContentLoaded: event yang terjadi ketika
//  seluruh HTML selesai dimuat oleh browser.
//  pastikan JavaScript dijalankan SETELAH HTML tersedia.
// ════════════════════════════════
// Menjalankan: 1. InitForm()  2. InitRiwayat() Setelah HTML selesai dimuat.
document.addEventListener('DOMContentLoaded', function () {
   initForm();    // Inisialisasi form di halaman layanan.html
   initRiwayat(); // Inisialisasi tabel di halaman riwayat.html
});