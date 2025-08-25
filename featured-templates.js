/**
 * File: featured-templates.js
 * Deskripsi: VERSI BARU dengan Efek Kartu Tumpuk (Uiverse Style)
 * yang dinamis, menampilkan gambar, dan mendukung klik di mobile.
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

        // --- PERUBAHAN UTAMA: Buat HTML untuk efek tumpukan kartu Uiverse ---
        const totalCards = freeProducts.length;
        const rotationAngle = 10; // Derajat rotasi per kartu

        const cardsHTML = freeProducts.map((product, index) => {
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            
            // Hitung rotasi agar tumpukan tetap di tengah
            const rotation = (index - (totalCards - 1) / 2) * rotationAngle;

            return `
                <a href="${detailLink}" class="stacked-card" data-text="${product.judul}" style="--r: ${rotation};">
                    <img src="${imagePath}" alt="${product.judul}">
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="stacked-card-container">
                ${cardsHTML}
            </div>
        `;
        
        // --- LOGIKA BARU UNTUK INTERAKSI KLIK DI MOBILE ---
        const stackContainer = container.querySelector('.stacked-card-container');

        stackContainer.addEventListener('click', (event) => {
            // Cek apakah perangkat memiliki kemampuan hover (kemungkinan bukan perangkat sentuh)
            const canHover = window.matchMedia('(hover: hover)').matches;
            if (canHover) return; // Jika bisa hover, biarkan CSS yang bekerja

            // Untuk perangkat sentuh, toggle class 'is-active' saat diklik
            // Cek jika yang diklik adalah kartu, bukan kontainer
            if (event.target.closest('.stacked-card')) {
                 stackContainer.classList.toggle('is-active');
            }
        });
        
         // Menutup tumpukan saat klik di luar area (hanya untuk mobile)
        document.addEventListener('click', (event) => {
            const canHover = window.matchMedia('(hover: hover)').matches;
            if (canHover) return;

            if (!stackContainer.contains(event.target)) {
                stackContainer.classList.remove('is-active');
            }
        });


    } catch (error) {
        console.error('Terjadi kesalahan saat memuat produk gratis:', error);
        section.style.display = 'none';
    }
}

// Fungsi loadFeaturedProducts tidak perlu diubah
async function loadFeaturedProducts() {
    // ... (Fungsi ini tetap sama)
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
