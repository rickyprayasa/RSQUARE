/**
 * File: featured-templates.js
 * Deskripsi: Versi ini diperbarui untuk menambahkan class 'active-slide'
 * untuk mendukung efek tumpukan kartu (card stack) di CSS.
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

        const cardsHTML = freeProducts.map(product => {
            const imagePath = `/content/produk/${product.gambar_thumbnail}`;
            const detailLink = `/content/template-detail.html?product=${product.id}`;
            return `
                <div class="featured-card">
                    <img src="${imagePath}" alt="${product.judul}" class="featured-card-image">
                    <div class="featured-card-content">
                        <span class="label label-free">GRATIS</span>
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

        const freeCards = slider.querySelectorAll('.featured-card');
        freeCards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
        });

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

            // --- TAMBAHAN BARU: Memberi class 'active-slide' pada kartu di tengah ---
            const allCards = slider.querySelectorAll('.featured-card');
            allCards.forEach((card, index) => {
                card.classList.remove('active-slide');
                // Untuk mobile, yang aktif hanya currentIndex
                // Untuk tablet/desktop, kita bisa tandai semua yang terlihat
                if (index >= currentIndex && index < currentIndex + itemsToShow) {
                     // Khusus untuk efek tumpukan kartu, kita hanya tandai yang di tengah
                    if (itemsToShow === 1 && index === currentIndex) {
                        card.classList.add('active-slide');
                    } else if (itemsToShow > 1) { // Jika bukan mobile, anggap semua terlihat aktif
                        card.classList.add('active-slide');
                    }
                }
            });
            // Khusus untuk mobile, pastikan hanya satu yang aktif
             if (itemsToShow === 1) {
                if(allCards[currentIndex]) allCards[currentIndex].classList.add('active-slide');
             }
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
