/**
 * File: featured-templates.js
 * Deskripsi: VERSI BARU dengan Swipeable Snap Carousel, Gambar,
 * dan Tombol Navigasi untuk Produk Gratis.
 */

async function loadFreeProducts() {
    const section = document.getElementById('free-templates-section');
    const container = document.getElementById('free-templates-container');

    if (!section || !container) {
        console.warn('Elemen untuk section produk gratis tidak ditemukan.');
        return;
    }

    try {
        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) throw new Error('Gagal memuat content/_index.json');
        const allProductFiles = await indexResponse.json();

        const productPromises = allProductFiles.map(productFile =>
            fetch(`content/produk/${productFile}`)
                .then(res => res.ok ? res.json() : null)
                .then(productData => {
                    if (productData) {
                        productData.id = productFile.replace(/\.json$/, '');
                        return productData;
                    }
                    return null;
                })
        );
        
        let allProducts = await Promise.all(productPromises);
        allProducts = allProducts.filter(p => p !== null);
        const freeProducts = allProducts.filter(p => p.harga === 0);

        if (freeProducts.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        // --- PERUBAHAN UTAMA: Buat HTML untuk efek Snap Carousel ---
        const cardsHTML = freeProducts.map((product) => {
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            
            return `
                <a href="${detailLink}" class="snap-card">
                    <div class="snap-card-image">
                        <img src="${imagePath}" alt="${product.judul}">
                    </div>
                    <div class="snap-card-content">
                        <h3>${product.judul}</h3>
                        <p>${product.deskripsi_singkat}</p>
                    </div>
                </a>
            `;
        }).join('');

        // Masukkan carousel dan tombol navigasi ke dalam kontainer
        container.innerHTML = `
            <div class="carousel-wrapper">
                <div class="snap-carousel">
                    ${cardsHTML}
                </div>
                <button class="carousel-btn prev" aria-label="Previous Slide">&larr;</button>
                <button class="carousel-btn next" aria-label="Next Slide">&rarr;</button>
            </div>
        `;

        // --- LOGIKA BARU UNTUK NAVIGASI GESER/KLIK ---
        const carousel = container.querySelector('.snap-carousel');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');
        
        // Sembunyikan tombol jika semua kartu sudah terlihat
        if (carousel.scrollWidth <= carousel.clientWidth) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        const scrollAmount = carousel.querySelector('.snap-card').offsetWidth;

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat memuat produk gratis:', error);
        section.style.display = 'none';
    }
}

// Fungsi loadFeaturedProducts tidak perlu diubah
async function loadFeaturedProducts() {
    // ... (Fungsi ini tetap sama, tidak perlu diubah)
    const container = document.getElementById('featured-grid-container');
    if (!container) {
        console.warn('Elemen untuk grid produk unggulan tidak ditemukan.');
        return;
    }
    try {
        const featuredResponse = await fetch('/_data/homepage.json');
        const settings = await featuredResponse.json();
        const featuredIds = settings.produk_unggulan || [];
        if (featuredIds.length === 0) {
            container.innerHTML = '<p>Belum ada produk unggulan yang diatur.</p>';
            return;
        }
        const productPromises = featuredIds.map(id =>
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null);
        const cardsHTML = featuredProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            return `
                <div class="featured-card">
                    <img src="${imagePath}" alt="${product.judul}" class="featured-card-image">
                    <div class="featured-card-content">
                        <span class="label">★ Template Unggulan</span>
                        <h3>🎯 ${product.judul}</h3>
                        <div class="featured-card-description-wrapper">
                            <p class="featured-card-description">${product.deskripsi_singkat}</p>
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
        console.error('Terjadi kesalahan saat memuat produk unggulan:', error);
        container.innerHTML = '<p class="text-red-500">Gagal memuat produk unggulan.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFreeProducts();
    loadFeaturedProducts();
});
