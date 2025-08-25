// Fungsi untuk memuat produk gratis
async function loadFreeProducts() {
    const section = document.getElementById('free-templates-section');
    const slider = document.getElementById('free-templates-slider');
    const prevBtn = document.getElementById('free-slider-prev');
    const nextBtn = document.getElementById('free-slider-next');

    if (!section || !slider || !prevBtn || !nextBtn) return;

    try {
        const response = await fetch('/_data/produk.json'); // Mengambil semua data produk
        if (!response.ok) throw new Error('Network response was not ok');
        const allProducts = await response.json();

        const freeProducts = allProducts.filter(p => p.harga === 0);

        if (freeProducts.length === 0) {
            section.style.display = 'none'; // Sembunyikan section jika tidak ada produk gratis
            return;
        }

        // Tampilkan section jika ada produk gratis
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

        // Logika Slider
        const itemsToShow = 3;
        if (freeProducts.length > itemsToShow) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';

            let currentIndex = 0;
            const totalItems = freeProducts.length;
            const card = slider.querySelector('.free-template-card');
            const gap = parseFloat(window.getComputedStyle(slider).gap);
            const cardWidth = card.offsetWidth + gap;

            function updateSlider() {
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
            
            // Panggil sekali untuk set state awal tombol
            updateSlider(); 
            // Tambahkan event listener untuk resize window jika perlu
            window.addEventListener('resize', () => {
                 const newCardWidth = card.offsetWidth + gap;
                 slider.style.transform = `translateX(-${currentIndex * newCardWidth}px)`;
            });
        }

    } catch (error) {
        console.error('Gagal memuat produk gratis:', error);
        section.style.display = 'none';
    }
}

// Fungsi untuk memuat produk unggulan (kode Anda yang sudah ada, sedikit dimodifikasi)
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-grid-container');
    if (!container) return;

    try {
        const featuredResponse = await fetch('/_data/homepage.json');
        const settings = await featuredResponse.json();
        const featuredIds = settings.produk_unggulan || [];

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

        // Efek hover
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

// Panggil kedua fungsi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    loadFreeProducts();
    loadFeaturedProducts();
});
