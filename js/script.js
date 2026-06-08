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

// Menyimpan data ke localStorage (Array --> JSON)
function saveData() {
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// 3. Format Tanggal (dd-mm-yyy --> 04 Juni 2026)
function formatTanggal(dataStr) {
   const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
   ]

   const d = new Date(dataStr); // Contoh format: '04 Juni 2026'
   return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// Form Handling
// Menangani form pengajuan: Mode Tambah (create) dan mode edit (update) berdasarkan parameter URL
// Tugas Form: Mengumpulkan semua input --> validasi --> create data baru --> update data --> simpan ke localStorage

function initForm() {
   const form = document.getElementById('formPengajuan');
   if (!form) return; // Jika halaman tidak punya form, keluar

   // Deteksi mode edit atau tidak?
   // Jika parameter URL edit ditemukan, maka data lama ditampilkam, jika tidak maka adalah mode tambah (create)

   const editId = urlParams.get('edit');
   let editMode = false;
   
   if (editId) {
      // Cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemtoEdit = data.find(function(item){
         return item.id == editId;
      });

      // Edit data
      if (itemtoEdit) {
         editMode = true; // Mode edit aktif
         // Isi field form dengan data yang ada (pre-fill)

         document.getElementById('nama').value = itemtoEdit.nama || '';
         document.getElementById('nim').value = itemtoEdit.nim || '';
         const prodiEl = document.getElementById('prodi');
         if (prodiEl && itemtoEdit.prodi) prodiEl.value = itemtoEdit.prodi || ''
         const layananEl = document.getElementById('layanan');
         if (layananEl && itemtoEdit.layanan) layananEl.value = item.layanan || ''
         document.getElementById('tanggal').value = itemtoEdit.tanggal || ''
         document.getElementById('keterangan').value = itemtoEdit.keterangan || ''

         // Ubah tek tombol --> "Simpan Perubahan"
         const btnSubmit = form.querySelector('button[type="submit"]');
         if (btnSubmit) btnSubmit.innerHTML = '✏️ Simpan Perubahan'
      }
   }

   // Submit (create)
   // Menggunakan event listener untuk submit form (event-nya 'submit')
   // Sebelum submit, form akan melakukan validasi
   // Saat Tombol Ajukan di klik: 1. Ambil data dari form, 2. Validasi data, 3. Simpan data, 4. Redirect ke halaman riwayat
   
   // element.addEventListenet('event', function())
   form.addEventListener('submit', function(e) {
      e.preventDefault(); // Cegah from reload halaman
      // 1. Ambil nilai semua field dengan menggunakan value
      const nama = document.getElementById('nama').value.trim();
      const nim = document.getElementById('nim').value.trim();
      const prodi = document.getElementById('prodi').value;
      const layanan = document.getElementById('layanan').value;
      const tanggal = document.getElementById('tanggal').value;
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError').value.trim();
      
      errorEl.textContent = ''; // Reset pesan error sebelum validasi

      // Validasi Form (semua data wajib diisi)
      if (!nama || !nim || !prodi || !layanan || !tanggal) {
         errorEl.textContent = '❌ Semua field harus diisi!'
         return; // Hentikan eksekusi jika tidak valid
      }

      // NIM harus 8 karakter
      if (nim.length !== 8 || isNaN(nim)) {
         errorEl.textContent = '❌ NIM harus terdiri dari 8 digit angka!';
         return;
      }

      // --CRUD-- (Create dan Update)
      const data = getData();
      if (editMode) {  // Jika mode edit
         for (let i=0; i<data.length; i++) {
            // Jika ide sama dengan edit Id maka mode edit (timpa data)
            if (data[i].id == editId) {
               data[i].nama = nama;
               data[i].nim = nim;
               data[i].prodi = prodi;
               data[i].layanan = layanan;
               data[i].tanggal = tanggal;
               data[i].keterangan = keterangan
               break;
            }
         }
      }
      
      else {  // Create: buat data objek baru
         const item = {
            id: Date.now(), //Timestap dalam milidetik sbg ID (142605)
            nama: nama,
            nim: nim,
            prodi: prodi,
            layanan: layanan,
            tanggal: tanggal,
            keterangan: keterangan,
         };

         data.push(item) //tambah data ke array
      }

      saveData(data); // Simpan ke localStorage
      form.reset();
      errorEl.textContent = '';
      alert(editId ? '💯 Perubahan berhasil disimpan!': '✅ Pengajuan berhasil disimpan!')
      window.location.href = 'riwayat.html'  // Pindah halaman
   }) 
}

//  INIT (inisialisasi)
document.addEventListener('DOMContentLoaded', function () {
   initForm();
})