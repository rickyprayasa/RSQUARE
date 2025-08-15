document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('featured-grid-container');
    if (!container) return;

    try {

        // Ambil data produk
        const featuredResponse = await fetch('_data/homepage.json');
        const settings = await featuredResponse.json();
        const featuredIds = settings.produk_unggulan || ['personal-budgeting', 'content-calendar'];

        const productPromises = featuredIds.map(id => 
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null);

        // 3. Buat HTML untuk ditampilkan (tidak ada perubahan di bagian ini)
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
});
