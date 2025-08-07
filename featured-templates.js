document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('featured-grid-container');
    if (!container) return;

    try {
        // 1. Ambil daftar ID produk unggulan
        const featuredResponse = await fetch('content/featured-products.json');
        const featuredIds = await featuredResponse.json();

        // 2. Ambil data detail untuk SETIAP produk unggulan
        const productPromises = featuredIds.map(id => 
            fetch(`content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let featuredProducts = await Promise.all(productPromises);
        featuredProducts = featuredProducts.filter(p => p !== null);

        // 3. Buat HTML untuk setiap kartu produk unggulan
        const cardsHTML = featuredProducts.map(product => {
            
            // --- PERBAIKAN KUNCI: Logika path disamakan dengan templates-gallery.js ---
            // Dengan asumsi product.gambar_thumbnail berisi "photos/produk/ID/namafile.png"
            // Kita tambahkan awalan "content/produk/" yang krusial.
            const imagePath = `content/produk/${product.gambar_thumbnail}`;
            // --- AKHIR PERBAIKAN ---

            // Membuat link detail yang dinamis
            const detailLink = `content/template-detail.html?product=${product.id}`;

            return `
                <div class="card-template" style="width: 100%; max-width: 340px;">
                    <img src="${imagePath}" alt="${product.judul}">
                    <div class="content">
                        <span class="label">★ Template Unggulan</span>
                        <h3 >🎯 ${product.judul}</h3>
                        <p >${product.deskripsi_singkat}</p>
                        <a href="${detailLink}" class="btn">Lihat Template</a>
                    </div>
                </div>
            `;
        }).join('');

        // 4. Masukkan semua kartu yang sudah jadi ke dalam wadah
        container.innerHTML = cardsHTML;

    } catch (error) {
        console.error('Gagal memuat produk unggulan:', error);
        container.innerHTML = '<p>Gagal memuat produk unggulan.</p>';
    }
});
