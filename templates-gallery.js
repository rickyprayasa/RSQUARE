document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    const sortDropdown = document.getElementById('sort-options'); // Asumsi ID dropdown adalah 'sort-options'
    if (!galleryContainer) return;

    // Variabel untuk menyimpan data semua produk agar tidak perlu fetch berulang kali
    let allProducts = [];

    // --- FUNGSI UNTUK MENAMPILKAN PRODUK ---
    const renderProducts = (productsToRender) => {
        if (productsToRender.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Tidak ada produk yang cocok.</p>';
            return;
        }

        const allCardsHTML = productsToRender.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            const detailLink = `content/template-detail.html?product=${product.id}`;
            const correctImagePath = `content/produk/${product.gambar_thumbnail}`;
            
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

        // Tampilkan semua kartu produk yang sudah di-render
        galleryContainer.innerHTML = allCardsHTML;

        // Kartu "Segera Hadir" (tidak berubah)
        const comingSoonCard = `
            <div class="card rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
                <div class="flex-grow flex flex-col items-center justify-center">
                    <svg class="w-16 h-16 text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455l-1.177-.398 1.177-.398a3.375 3.375 0 002.455-2.455l.398-1.177.398 1.177a3.375 3.375 0 002.455 2.455l1.177.398-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></svg>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Template Baru Segera Hadir!</h3>
                    <p class="text-gray-600 mb-6 flex-grow">Kami terus berinovasi untuk Anda.</p>
                </div>
                <a href="jasa-kustom.html" class="btn-primary btn-shiny mt-auto text-center px-6 py-2 rounded-lg font-semibold text-white">Request Template?</a>
            </div>`;
        
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);
    };

    // --- LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
    try {
        galleryContainer.innerHTML = '<p class="text-center col-span-full">Memuat koleksi template...</p>';

        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json: ${indexResponse.statusText}`);
        
        const productFiles = await indexResponse.json();
        if (productFiles.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template.</p>';
            return;
        }

        const productPromises = productFiles.map(file => fetch(`content/produk/${file}`).then(res => res.ok ? res.json() : null));
        allProducts = await Promise.all(productPromises);
        allProducts = allProducts.filter(p => p !== null);

        // Tampilan Awal: Sortir GRATIS di paling depan (Urutan "Unggulan")
        allProducts.sort((a, b) => a.harga - b.harga);
        renderProducts(allProducts);

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }

    // --- EVENT LISTENER UNTUK DROPDOWN SORTIR ---
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (event) => {
            const sortBy = event.target.value;
            let sortedProducts = [...allProducts]; // Buat salinan agar data asli tidak berubah

            switch (sortBy) {
                case 'price-asc':
                    sortedProducts.sort((a, b) => a.harga - b.harga);
                    break;
                case 'price-desc':
                    sortedProducts.sort((a, b) => b.harga - a.harga);
                    break;
                case 'name-asc':
                    sortedProducts.sort((a, b) => a.judul.localeCompare(b.judul));
                    break;
                case 'name-desc':
                    sortedProducts.sort((a, b) => b.judul.localeCompare(a.judul));
                    break;
                default:
                    // Urutan "Unggulan" (Gratis di depan)
                    sortedProducts.sort((a, b) => a.harga - b.harga);
                    break;
            }
            renderProducts(sortedProducts);
        });
    }
});
