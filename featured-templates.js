/**
 * File: featured-templates.js
 * Deskripsi: Skrip ini memuat dua bagian pada halaman utama:
 * 1. Slider untuk produk-produk gratis.
 * 2. Grid untuk produk-produk unggulan.
 * Keduanya mengambil data secara dinamis dari file JSON.
 */

/**
 * Memuat, memfilter, dan menampilkan produk gratis dalam format slider.
 * Slider hanya akan muncul jika ada setidaknya satu produk dengan harga 0.
 * Navigasi slider akan aktif jika jumlah produk gratis lebih dari 3.
 */
async function loadFreeProducts() {
    // 1. Ambil elemen-elemen HTML yang diperlukan
    const section = document.getElementById('free-templates-section');
    const slider = document.getElementById('free-templates-slider');
    const prevBtn = document.getElementById('free-slider-prev');
    const nextBtn = document.getElementById('free-slider-next');

    // Hentikan fungsi jika salah satu elemen tidak ditemukan
    if (!section || !slider || !prevBtn || !nextBtn) {
        console.warn('Elemen untuk slider produk gratis tidak ditemukan.');
        return;
    }

    try {
        // 2. Ambil data semua produk dari file JSON
        const response = await fetch('/_data/produk.json');
        if (!response.ok) {
            throw new Error(`Gagal memuat produk.json: ${response.statusText}`);
        }
        const allProducts = await response.json();

        // 3. Filter untuk mendapatkan produk yang harganya 0
        const freeProducts = allProducts.filter(p => p.harga === 0);

        // 4. Jika tidak ada produk gratis, sembunyikan section dan hentikan fungsi
        if (freeProducts.length === 0) {
            section.style.display = 'none';
            return;
        }

        // 5. Jika ada, tampilkan section dan buat kartu HTML-nya
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

        // 6. Atur logika slider
        const itemsToShow = 3; // Jumlah kartu yang terlihat dalam satu waktu
        if (freeProducts.length > itemsToShow) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';

            let currentIndex = 0;
            const totalItems = freeProducts.length;
            
            // Fungsi untuk update posisi slider dan status tombol
            function updateSlider() {
                const card = slider.querySelector('.free-template-card');
                if (!card) return; // Pastikan kartu sudah ada di DOM
                const gap = parseFloat(window.getComputedStyle(slider).gap);
                const cardWidth = card.offsetWidth + gap;

                slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= totalItems - itemsToShow;
            }

            // Event listener untuk tombol
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
            
            // Atur ulang posisi saat ukuran window berubah
            window.addEventListener('resize', updateSlider);

            // Panggil sekali untuk mengatur state awal
            updateSlider();
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat memuat produk gratis:', error);
        section.style.display = 'none'; // Sembunyikan jika terjadi error
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
        // Ambil ID produk unggulan dari file setting homepage
        const featuredResponse = await fetch('/_data/homepage.json');
        const settings = await featuredResponse.json();
        const featuredIds = settings.produk_unggulan || [];

        if (featuredIds.length === 0) {
            container.innerHTML = '<p>Belum ada produk unggulan yang diatur.</p>';
            return;
        }

        // Ambil data detail untuk setiap ID produk unggulan
        const productPromises = featuredIds.map(id =>
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null);

        // Buat kartu HTML
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

        // Tambahkan efek hover
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
