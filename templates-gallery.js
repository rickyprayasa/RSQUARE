document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '<p class="text-center col-span-full">Memuat koleksi template...</p>';

    try {
        // --- LANGKAH 1 & 2: Ambil _index.json dan siapkan data urutan ---
        const indexResponse = await fetch('content/_index.json');

        // --- PERUBAHAN LOGIKA ---
        // Langsung fetch dan parse, jika gagal di tahap mana pun, hasilnya adalah {}
        const orderData = await fetch('_data/template_order.json')
            .then(response => {
                if (!response.ok) { // Gagal jika file tidak ditemukan (404)
                    return {};
                }
                return response.json(); // Coba baca sebagai JSON
            })
            .catch(error => {
                // Gagal jika file kosong, tidak valid, atau ada error jaringan
                console.warn('Gagal memuat/parse template_order.json. Menggunakan urutan default.', error);
                return {};
            });
        // --- SELESAI PERUBAHAN ---

        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json: ${indexResponse.statusText}`);
        
        const allProductFiles = await indexResponse.json();
        if (allProductFiles.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template.</p>';
            return;
        }

        // --- LANGKAH 3: Tentukan urutan final ---
        // Logika ini sekarang tidak perlu blok 'else' yang rumit
        let sortedProductFiles;
        if (orderData && orderData.urutan_produk && orderData.urutan_produk.length > 0) {
            const allFilesSet = new Set(allProductFiles);
            const orderedFiles = [];

            orderData.urutan_produk.forEach(item => {
                const fileNameToFind = item.produk + '.json';
                if (allFilesSet.has(fileNameToFind)) {
                    orderedFiles.push(fileNameToFind);
                    allFilesSet.delete(fileNameToFind);
                }
            });

            const unsortedFiles = Array.from(allFilesSet);
            sortedProductFiles = [...orderedFiles, ...unsortedFiles];
        } else {
            // Fallback ini akan otomatis berjalan jika orderData adalah {}
            sortedProductFiles = allProductFiles;
        }
        
        // --- Sisa kode tidak berubah ---
        const productPromises = sortedProductFiles.map(productFile => {
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
        
        let productsInOrder = await Promise.all(productPromises);
        productsInOrder = productsInOrder.filter(p => p !== null);

        const allCardsHTML = productsInOrder.map(product => {
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

        galleryContainer.innerHTML = allCardsHTML;
        
        const comingSoonCard = `...`; // Kode kartu "coming soon" Anda
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});
