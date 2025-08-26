/**
 * File: featured-templates.js
 * Deskripsi: Memuat produk Unggulan dan produk Gratis secara terpisah
 * ke dalam kontainer HTML masing-masing.
 */

// Fungsi untuk memuat dan menampilkan PRODUK GRATIS
async function loadFreeProducts() {
    const container = document.getElementById('free-grid-container');
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
                <div class="featured-card">
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

// Fungsi untuk memuat dan menampilkan PRODUK UNGGULAN (kode asli Anda)
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
                <div class="featured-card">
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
