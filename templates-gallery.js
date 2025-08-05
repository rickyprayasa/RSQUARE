document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '<p class="text-center col-span-full">Memuat koleksi template...</p>';

    try {
        const indexResponse = await fetch('content/produk/_index.json');
        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json: ${indexResponse.statusText}`);
        
        const productFiles = await indexResponse.json();
        if (productFiles.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template.</p>';
            return;
        }

        const productPromises = productFiles.map(file => fetch(`content/produk/${file}`).then(res => res.ok ? res.json() : null));
        let products = await Promise.all(productPromises);
        products = products.filter(p => p !== null);

        const allCardsHTML = products.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            const detailLink = `content/template-detail.html?product=${product.id}`;
            
            // --- MENGGUNAKAN IDE ANDA YANG LEBIH SEDERHANA ---
            // Langsung menggabungkan path, dengan asumsi `gambar_thumbnail` tidak punya '/' di depan.
            const correctImagePath = `content/produk/${product.gambar_thumbnail}`;
            // --- SELESAI ---

            return `
                <div class="card rounded-xl overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div class="relative z-10 flex flex-col flex-grow">
                        <a href="${detailLink}" class="block">
                            <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                                <img src="${correctImagePath}" alt="Cover ${product.judul}" class="w-full h-full object-contain p-2">
                            </div>
                        </a>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${product.judul}</h3>
                            <p class="text-gray-600 mb-4 flex-grow">${product.deskripsi_singkat}</p>
                            <p class="text-2xl font-bold text-gray-900 mb-6">${priceDisplay}</p>
                            <a href="${detailLink}" class="btn-secondary mt-auto text-center px-6 py-2 rounded-lg font-semibold">Lihat Detail</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        galleryContainer.innerHTML = allCardsHTML;
        
        // ... (kode untuk menambahkan kartu "Segera Hadir" tetap sama)
        const comingSoonCard = `...`; // (Saya singkat)
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});
