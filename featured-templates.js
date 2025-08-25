/**
 * File: featured-templates.js
 * Deskripsi: Versi ini menyamakan TAMPILAN KARTU produk gratis 
 * dengan produk unggulan, termasuk efek hover.
 */

async function loadFreeProducts() {
    const section = document.getElementById('free-templates-section');
    const slider = document.getElementById('free-templates-slider');
    const prevBtn = document.getElementById('free-slider-prev');
    const nextBtn = document.getElementById('free-slider-next');

    if (!section || !slider || !prevBtn || !nextBtn) {
        console.warn('Elemen untuk slider produk gratis tidak ditemukan.');
        return;
    }

    try {
        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) throw new Error('Gagal memuat content/_index.json');
        const allProductFiles = await indexResponse.json();

        if (allProductFiles.length === 0) {
            section.style.display = 'none';
            return;
        }

        const productPromises = allProductFiles.map(productFile => {
            return fetch(`content/produk/${productFile}`)
                .then(res => res.ok ? res.json() : null)
                .then(productData => {
                    if (productData) {
                        productData.id = productFile.replace(/\.json$/, '');
                        return productData;
                    }
                    return null;
                });
        });
        
        let allProducts = await Promise.all(productPromises);
        allProducts = allProducts.filter(p => p !== null);
        const freeProducts = allProducts.filter(p => p.harga === 0);

        if (freeProducts.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        // --- PERUBAHAN 1: Menggunakan struktur & class dari .featured-card ---
        const cardsHTML = freeProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            return `
                <div class="featured-card">
                    <img src="${imagePath}" alt="${product.judul}" class="featured-card-image">
                    <div class="featured-card-content">
                        <span class="label">GRATIS</span>
                        <h3>🎯 ${product.judul}</h3>
                        <div class="featured-card-description-wrapper">
                            <p class="featured-card-description">${product.deskripsi_singkat}</p>
                            <a href="${detailLink}" class="btn-primary-small">Lihat Template</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        slider.innerHTML = cardsHTML;

        // --- PERUBAHAN 2: Menambahkan logika hover effect ---
        const freeCards = slider.querySelectorAll('.featured-card');
        freeCards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
        });


        // --- LOGIKA SLIDER RESPONSIVE (TETAP SAMA) ---
        let currentIndex = 0;
        const totalItems = freeProducts.length;

        const getItemsToShow = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        };

        const updateSlider = () => {
            const itemsToShow = getItemsToShow();
            const card = slider.querySelector('.featured-card');
            if (!card) return;

            if (totalItems > itemsToShow) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
            
            if (currentIndex > totalItems - itemsToShow) {
                currentIndex = totalItems - itemsToShow;
            }
            
            const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
            const cardWidth = card.offsetWidth + gap;

            slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalItems - itemsToShow;
        };

        nextBtn.addEventListener('click', () => {
            const itemsToShow = getItemsToShow();
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
