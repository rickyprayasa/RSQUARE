document.addEventListener('DOMContentLoaded', async () => {
    // 1. Tentukan kontainer tempat galeri akan ditampilkan
    const container = document.getElementById('featured-grid-container');
    if (!container) {
        console.error("Kontainer dengan ID 'featured-grid-container' tidak ditemukan.");
        return;
    }

    try {
        // 2. Ambil daftar ID produk unggulan dari file pengaturan baru Anda
        const settingsResponse = await fetch('/content/featured-products.json');
        if (!settingsResponse.ok) throw new Error("Gagal memuat file featured-products.json.");
        
        const settings = await settingsResponse.json();
        // Ambil array ID dari dalam objek, berikan array kosong jika tidak ada
        const featuredIds = settings.produk_unggulan || [];

        if (featuredIds.length === 0) {
            container.innerHTML = '<p>Belum ada produk unggulan yang dipilih.</p>';
            return;
        }

        // 3. Ambil detail hanya untuk produk yang ID-nya ada di daftar
        const productPromises = featuredIds.map(id => 
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null); // Hapus produk yang gagal dimuat

        // 4. Buat HTML untuk setiap kartu produk
        const cardsHTML = featuredProducts.map(product => {
            // Gunakan path absolut (diawali '/') agar konsisten
            const imagePath = `/${product.gambar_thumbnail}`;
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
        
        // 5. Masukkan semua kartu ke dalam kontainer
        container.innerHTML = cardsHTML;

        // 6. Tambahkan event listener untuk efek hover setelah kartu dibuat
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
