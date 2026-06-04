// M12 - JS Dasar
// Variabel, fungsi, Validasi Sederhana

// Variabel const untk layanan (array menyimpan daftar kode layanan)

const LAYANAN = ['SKA', 'CAK', 'TNM', 'PDA'];

// Fungsi: format tanggal 
// dd-MM-yyyy (04-06-2026) --> 04 Juni 2026
// Kita gunakan objek bawaan dari js

function formatTanggal(dateStr) {
    // formating
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(dateStr); // deklarasi  new date obj

    // Format (Tanggal - Bulan - Tahun)
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// Fungsi Validasi
function validasiForm() {
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const prodi = document.getElementById('prodi').value;
    const layanan = document.getElementById('layanan').value;
    const tanggal = document.getElementById('tanggal').value;

    // Validasi --> Cek field kosong
    if (nama === '' || nim === '' || prodi === '' || layanan === '' || tanggal === '') {
        alert('❌ Semua field wajib diisi!');
        // Mencegah Submit halaman
        return false; / Mencegah submit halaman! /
    }

    // Cek NIM harus 8 digit angka 
    if (nim.length !== 8 || isNaN(nim)) {
        alert('❌ NIM harus terdiri dari 8 digit angka murni!');
        return false;
    }

    // Berhasil (jika tak ada return false dari dua pencegat di atas) 
    alert('✅ Pengajuan berhasil!\n\n' +
        'Nama: ' + nama + '\n' +
        'NIM: ' + nim + '\n' +
        'Prodi: ' + prodi + '\n' +
        'Layanan: ' + layanan + '\n' +
        'Tanggal: ' + formatTanggal(tanggal));

    return true; / Yes, form sah dikirim /


    // Berhasil 
    console.log("Data Pengajuan:", {
        nama: nama,
        nim: nim,
        prodi: prodi,
        layanan: layanan,
        tanggal: formatTanggal(tanggal)
    });

    // Mengembalikan false agar form tidak disubmit dan halaman tidak 
    ter - refresh
    return false; // Ubah true → false 

}


