/**
 * File: featured-templates.js
 * Deskripsi: VERSI FINAL dengan Carousel 3D Glassmorphism
 * untuk slider produk gratis.
 */

async function loadFreeProducts() {
    // 1. Dapatkan elemen-elemen utama dari HTML
    const section = document.getElementById('free-templates-section');
    const container = document.getElementById('free-templates-container');

    if (!section || !container) {
        console.warn('Elemen untuk section produk gratis tidak ditemukan.');
        return;
    }

    try {
        // 2. Ambil semua data produk seperti sebelumnya
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

        // 3. Buat HTML untuk kartu-kartu carousel
        const cardsHTML = freeProducts.map((product, index) => {
            // Kita gunakan inline style untuk memberikan indeks ke setiap kartu
            return `
                <div class="carousel-card" style="--card-index: ${index};">
                    <h2>${product.judul}</h2>
                    <p>${product.deskripsi_singkat}</p>
                </div>
            `;
        }).join('');

        // 4. Bangun struktur lengkap carousel dan masukkan ke dalam kontainer
        container.innerHTML = `
            <div class="carousel-container">
                <div class="carousel">
                    ${cardsHTML}
                </div>
                <div class="carousel-nav">
                    <button id="prevBtn">&larr;</button>
                    <button id="nextBtn">&rarr;</button>
                </div>
            </div>
        `;

        // 5. Setelah HTML ada di DOM, kita bisa jalankan logika carousel 3D
        const carousel = container.querySelector('.carousel');
        const cards = container.querySelectorAll('.carousel-card');
        const prevBtn = container.querySelector('#prevBtn');
        const nextBtn = container.querySelector('#nextBtn');

        let currentIndex = 0;
        const totalCards = cards.length;
        const theta = 360 / totalCards; // Sudut rotasi antar kartu
        let radius;

        function setupCarousel() {
            // Hitung radius berdasarkan lebar kontainer agar responsif
            radius = Math.round((carousel.offsetWidth / 2) / Math.tan(Math.PI / totalCards));
            
            cards.forEach((card, index) => {
                const angle = theta * index;
                // Atur posisi awal setiap kartu dalam lingkaran 3D
                card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            });
        }

        function rotateCarousel() {
            const angle = theta * currentIndex * -1;
            // Putar seluruh elemen .carousel di sumbu Y
            carousel.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            rotateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            rotateCarousel();
        });

        // Setup carousel saat pertama kali dimuat dan saat ukuran window berubah
        setupCarousel();
        window.addEventListener('resize', setupCarousel);
        
    } catch (error) {
        console.error('Terjadi kesalahan saat memuat produk gratis:', error);
        section.style.display = 'none';
    }
}

// Fungsi loadFeaturedProducts tidak perlu diubah
async function loadFeaturedProducts() {
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
