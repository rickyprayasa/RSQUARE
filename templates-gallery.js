document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '<p class="text-center col-span-full">Memuat koleksi template...</p>';

    try {
        // 1. Ambil urutan produk dari file pengaturan yang baru
        const indexResponse = await fetch('content/_index.json'); 
        if (!orderResponse.ok) throw new Error("Gagal memuat file urutan template.");
        
        const orderData = await orderResponse.json();
        const productIdsInOrder = orderData.urutan_produk?.map(item => item.produk) || [];

        if (productIdsInOrder.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada produk yang diatur urutannya.</p>';
            return;
        }

        // 2. Ambil detail produk berdasarkan urutan yang sudah ditentukan
        const productPromises = productIdsInOrder.map(id => 
            fetch(`/content/produk/${id}.json`).then(res => res.ok ? res.json() : null)
        );
        let productsInOrder = await Promise.all(productPromises);
        productsInOrder = productsInOrder.filter(p => p !== null);

        // 3. Buat HTML dan tampilkan (tanpa sortir tambahan)
        const allCardsHTML = productsInOrder.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            const detailLink = `content/template-detail.html?product=${product.id}`;
            const correctImagePath = `/content/produk/${product.gambar_thumbnail}`;

            // Salin dan tempel kode kartu produk Anda yang sudah ada di sini
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

        // Tambahkan kartu "Coming Soon" seperti yang Anda miliki sebelumnya
        const comingSoonCard = `...`; // (salin kode kartu "Segera Hadir" Anda di sini)
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});
