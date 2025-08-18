const fs = require('fs');
const path = require('path');

const productsDirectory = path.join(__dirname, '..', 'content', 'produk');
const indexPath = path.join(__dirname, '..', 'content', '_index.json');

console.log('Memulai proses generate _index.json berdasarkan tanggal...');

try {
    const filenames = fs.readdirSync(productsDirectory)
        .filter(file => file.endsWith('.json') && file !== '_index.json');

    const filesWithStats = filenames.map(file => {
        const filePath = path.join(productsDirectory, file);
        const stats = fs.statSync(filePath);
        return {
            name: file,
            createdAt: stats.birthtime // 'birthtime' adalah waktu file dibuat
        };
    });

    // Urutkan file berdasarkan tanggal pembuatan, dari yang paling baru ke paling lama
    filesWithStats.sort((a, b) => b.createdAt - a.createdAt);

    // Ambil hanya nama filenya saja setelah diurutkan
    const sortedFilenames = filesWithStats.map(file => file.name);

    fs.writeFileSync(indexPath, JSON.stringify(sortedFilenames, null, 2));

    console.log(`Berhasil! _index.json diperbarui dengan ${sortedFilenames.length} produk, terbaru di awal.`);

} catch (error) {
    console.error('Error saat membuat file _index.json:', error);
    process.exit(1);
}
