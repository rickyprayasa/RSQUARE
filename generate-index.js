// File: generate-index.js

const fs = require('fs');
const path = require('path');

// Tentukan path ke folder sumber produk dan file output
const produkDir = path.join(__dirname, 'content/produk');
const outputFilePath = path.join(__dirname, 'content/_index.json');

let produkList = [];

try {
    // Baca semua file di dalam direktori 'content/produk'
    const files = fs.readdirSync(produkDir);

    files.forEach(file => {
        // Pastikan kita hanya memproses file dengan ekstensi .json
        if (path.extname(file) === '.json') {
            const filePath = path.join(produkDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const produkData = JSON.parse(fileContent);

            // Ambil hanya data yang diperlukan untuk ditampilkan di galeri
            // Ini membuat file _index.json lebih kecil dan efisien
            produkList.push({
                id: produkData.id,
                judul: produkData.judul,
                harga: produkData.harga,
                deskripsi_singkat: produkData.deskripsi_singkat,
                gambar_thumbnail: produkData.gambar_thumbnail
            });
        }
    });

    // Tulis data yang sudah digabung ke dalam file _index.json
    // JSON.stringify(produkList, null, 2) digunakan agar format file JSON rapi dan mudah dibaca
    fs.writeFileSync(outputFilePath, JSON.stringify(produkList, null, 2));
    
    // Cetak pesan sukses di log build
    console.log(`✅ Berhasil membuat _index.json dengan ${produkList.length} produk.`);

} catch (error) {
    // Cetak pesan error jika terjadi kegagalan
    console.error('❌ Gagal membuat _index.json:', error);
    process.exit(1); // Hentikan proses build jika skrip gagal
}
