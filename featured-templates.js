/**
 * File: featured-templates.js
 * Deskripsi: Skrip ini memuat dua bagian pada halaman utama:
 * 1. Slider produk gratis, dengan mengambil data dari setiap file produk.
 * 2. Grid produk unggulan, berdasarkan ID yang ditentukan.
 */

/**
 * Memuat produk gratis dengan cara:
 * 1. Mengambil daftar semua file produk dari _index.json.
 * 2. Memuat detail setiap produk satu per satu.
 * 3. Memfilter produk yang gratis (harga === 0).
 * 4. Menampilkan hasilnya dalam format slider.
 */
async function loadFreeProducts() {
    // 1. Ambil elemen-elemen HTML yang diperlukan
    const section = document.getElementById('free-templates-section');
    const slider = document.getElementById('free-templates-slider');
    const prevBtn = document.getElementById('free-slider-prev');
    const nextBtn = document.getElementById('free-slider-next');

    if (!section || !slider || !prevBtn || !nextBtn) {
        console.warn('Elemen untuk slider produk gratis tidak ditemukan.');
        return;
    }

    try {
        // 2. Ambil daftar semua nama file produk
        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) {
            throw new Error('Gagal memuat content/_index.json');
        }
        const allProductFiles = await indexResponse.json();

        if (allProductFiles.length === 0) {
            section.style.display = 'none';
            return;
        }

        // 3. Muat detail untuk setiap file produk secara paralel
        const productPromises = allProductFiles.map(productFile => {
            return fetch(`content/produk/${productFile}`)
                .then(res => res.ok ? res.json() : null)
                .then(productData => {
                    // Pastikan data ada dan tambahkan 'id' dari nama file
                    if (productData) {
                        productData.id = productFile.replace(/\.json$/, '');
                        return productData;
                    }
                    return null;
                });
        });
        
        // Tunggu semua proses fetch selesai
        let allProducts = await Promise.all(productPromises);
        // Bersihkan data yang null (jika ada file yang gagal dimuat)
        allProducts = allProducts.filter(p => p !== null);

        // 4. Filter untuk mendapatkan produk yang harganya 0
        const freeProducts = allProducts.filter(p => p.harga === 0);

        // 5. Jika tidak ada produk gratis, sembunyikan section dan hentikan fungsi
        if (freeProducts.length === 0) {
            section.style.display = 'none';
            return;
        }

        // 6. Jika ada, tampilkan section dan buat kartu HTML-nya
        section.style.display = 'block';

        const cardsHTML = freeProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            return `
                <div class="free-template-card">
                    <a href="${detailLink}">
                        <img src="${imagePath}" alt="${product.judul}" class="free-card-image">
                    </a>
                    <div class="free-card-content">
                        <h3>${product.judul}</h3>
                        <p>${product.deskripsi_singkat}</p>
                        <div class="free-card-footer">
                            <span class="price-tag-free">Gratis</span>
                            <a href="${detailLink}" class="btn-primary-small">Lihat Detail</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        slider.innerHTML = cardsHTML;

        // 7. Atur logika slider (bagian ini tidak berubah)
        const itemsToShow = 3;
        if (freeProducts.length > itemsToShow) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';

            let currentIndex = 0;
            const totalItems = freeProducts.length;
            
            function updateSlider() {
                const card = slider.querySelector('.free-template-card');
                if (!card) return;
                const gap = parseFloat(window.getComputedStyle(slider).gap);
                const cardWidth = card.offsetWidth + gap;

                slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= totalItems - itemsToShow;
            }

            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalItems - itemsToShow) {
                    currentIndex++;
                    updateSlider();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
            
            window.addEventListener('resize', updateSlider);
            updateSlider();
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat memuat produk gratis:', error);
        section.style.display = 'none';
    }
}

/**
 * Memuat produk unggulan berdasarkan daftar ID dari homepage.json
 * dan menampilkannya dalam format grid.
 */
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

// Jalankan kedua fungsi setelah halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadFreeProducts();
    loadFeaturedProducts();
});
