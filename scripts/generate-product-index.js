const fs = require('fs');
const path = require('path');

// Tentukan path ke folder produk dan file indeks
const productsDirectory = path.join(__dirname, '..', 'content', 'produk');
const indexPath = path.join(__dirname, '..', 'content', '_index.json');

console.log('Memulai proses generate _index.json...');

try {
    // Baca semua nama file dari dalam folder /content/produk/
    const filenames = fs.readdirSync(productsDirectory);

    // Lakukan filter:
    // 1. Hanya ambil file yang berakhiran .json
    // 2. Buang file _index.json itu sendiri agar tidak masuk ke dalam daftarnya
    const productFiles = filenames
        .filter(file => file.endsWith('.json') && file !== '_index.json');

    // Urutkan nama file secara alfabet untuk konsistensi
    productFiles.sort();

    // Tulis kembali file _index.json dengan daftar file yang baru
    // JSON.stringify(productFiles, null, 2) akan membuat format JSON rapi
    fs.writeFileSync(indexPath, JSON.stringify(productFiles, null, 2));

    console.log(`Berhasil! _index.json diperbarui dengan ${productFiles.length} produk.`);

} catch (error) {
    console.error('Error saat membuat file _index.json:', error);
    process.exit(1); // Hentikan proses build jika terjadi error
}
