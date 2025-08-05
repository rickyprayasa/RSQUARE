// Mengimpor modul bawaan Node.js untuk berinteraksi dengan file sistem
const fs = require('fs');
const path = require('path');

// Menentukan lokasi folder produk
const produkDir = path.join(__dirname, '..', 'content', 'produk');
// Menentukan lokasi di mana file _index.json akan disimpan
const indexPath = path.join(produkDir, '_index.json');

console.log(`Membaca file dari direktori: ${produkDir}`);

try {
    // Membaca semua item di dalam direktori produk
    const allFiles = fs.readdirSync(produkDir);

    // Menyaring hanya file yang berakhiran .json dan BUKAN _index.json itu sendiri
    const productFiles = allFiles.filter(file => 
        file.endsWith('.json') && file !== '_index.json'
    );

    console.log(`Ditemukan ${productFiles.length} file produk:`, productFiles);

    // Menulis array nama file ke dalam _index.json
    // JSON.stringify(..., null, 2) digunakan agar format file JSON rapi dan mudah dibaca
    fs.writeFileSync(indexPath, JSON.stringify(productFiles, null, 2));

    console.log(`File _index.json berhasil dibuat/diperbarui di ${indexPath}`);

} catch (error) {
    console.error('Terjadi kesalahan saat membuat file _index.json:', error);
    // Keluar dengan status error agar proses build Netlify gagal jika skrip ini error
    process.exit(1); 
}
