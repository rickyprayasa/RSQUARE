/**
 * File: featured-templates.js
 * Deskripsi: Memuat produk Unggulan dan produk Gratis secara terpisah
 * ke dalam kontainer HTML masing-masing.
 */

// Fungsi untuk memuat dan menampilkan PRODUK GRATIS
async function loadFreeProducts() {
    const container = document.getElementById('free-grid-container');
    // Ambil juga elemen section untuk menampilkannya jika ada produk
    //const section = document.querySelector('#free-grid-container').closest('.template-section');

    if (!container) return;

    try {
        // 1. Ambil daftar semua file produk dari _index.json
        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) throw new Error('Gagal memuat _index.json');
        const allProductFiles = await indexResponse.json();

        // 2. Ambil detail untuk setiap produk
        const productPromises = allProductFiles.map(file =>
            fetch(`/content/produk/${file}`).then(res => {
                if (!res.ok) return null;
                // Tambahkan ID dari nama file ke data produk
                return res.json().then(data => {
                    data.id = file.replace(/\.json$/, '');
                    return data;
                });
            })
        );
        let allProducts = await Promise.all(productPromises);
        allProducts = allProducts.filter(p => p !== null);

        // 3. Filter hanya produk yang gratis (harga === 0)
        const freeProducts = allProducts.filter(p => p.harga === 0);

        // Jika tidak ada produk gratis, jangan tampilkan apa-apa
        if (freeProducts.length === 0) {
            return;
        }

        // Jika ada produk gratis, tampilkan section-nya
        //section.style.display = 'block';

        // 4. Buat HTML untuk setiap kartu gratis
        const cardsHTML = freeProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/${product.id}`; // Sesuaikan path jika perlu
            return `
                <div class="featured-card border-2 border-orange-500">
                    <img src="${imagePath}" alt="${product.judul}" class="featured-card-image">
                    <div class="featured-card-content">
                        <span class="label">GRATIS</span>
                        <h3>🎯 ${product.judul}</h3>
                        <div class="featured-card-description-wrapper">
                            <a href="${detailLink}" class="btn-primary-small">Lihat Template</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = cardsHTML;

        // Tambahkan efek hover yang sama
        const freeCards = container.querySelectorAll('.featured-card');
        freeCards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
        });

    } catch (error) {
        console.error('Gagal memuat produk gratis:', error);
    }
}

// Fungsi untuk memuat dan menampilkan PRODUK UNGGULAN (kode asli Kamu)
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-grid-container');
    if (!container) return;

    try {
        const featuredResponse = await fetch('_data/homepage.json');
        const settings = await featuredResponse.json();
        const featuredIds = settings.produk_unggulan || [];

        const productPromises = featuredIds.map(id =>
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null);

        const cardsHTML = featuredProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/${product.id}`; // Sesuaikan path jika perlu
            return `
                <div class="featured-card border-2 border-orange-500">
                    <img src="${imagePath}" alt="${product.judul}" class="featured-card-image">
                    <div class="featured-card-content">
                        <span class="label">★ Template Unggulan</span>
                        <h3>🎯 ${product.judul}</h3>
                        <div class="featured-card-description-wrapper">
                            <a href="${detailLink}" class="btn-primary-small">Lihat Template</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = cardsHTML;

        const featuredCards = document.querySelectorAll('.featured-card');
        featuredCards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
        });

    } catch (error) {
        console.error('Gagal memuat produk unggulan:', error);
        container.innerHTML = '<p>Gagal memuat produk unggulan.</p>';
    }
}


// Jalankan kedua fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadFreeProducts();
    loadFeaturedProducts();
});
