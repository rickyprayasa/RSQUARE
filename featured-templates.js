/**
 * File: featured-templates.js
 * Deskripsi: VERSI FINAL dengan Efek Kartu Tumpuk (Stacked Cards)
 * yang mendukung interaksi KLIK untuk perangkat mobile/sentuh.
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

        const cardsHTML = freeProducts.map((product, index) => {
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            return `
                <a href="${detailLink}" class="stack-card" style="--i: ${index};">
                    <div class="stack-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="stack-card-title">${product.judul}</div>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="card-stack-container">
                ${cardsHTML}
            </div>
        `;
        
        // --- LOGIKA BARU UNTUK INTERAKSI KLIK ---
        const stackContainer = container.querySelector('.card-stack-container');
        const cards = container.querySelectorAll('.stack-card');

        cards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Periksa apakah tumpukan sudah "mekar" atau belum
                const isFanned = stackContainer.classList.contains('is-fanned');

                // Jika tumpukan BELUM mekar, maka klik ini bertugas untuk memekarkannya
                if (!isFanned) {
                    event.preventDefault(); // Mencegah link terbuka
                    stackContainer.classList.add('is-fanned'); // Tambah class untuk memicu animasi
                }
                // Jika SUDAH mekar, biarkan link bekerja seperti biasa
            });
        });

        // Menambahkan listener untuk menutup tumpukan saat klik di luar area
        document.addEventListener('click', (event) => {
            // Jika yang diklik bukan bagian dari kontainer tumpukan kartu
            if (!stackContainer.contains(event.target)) {
                stackContainer.classList.remove('is-fanned'); // Tutup kembali tumpukan
            }
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
