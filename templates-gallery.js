document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '<p class="text-center col-span-full">Memuat koleksi template...</p>';

    try {
        // --- LANGKAH 1 & 2: Ambil _index.json dan template_order.json secara bersamaan ---
        const [indexResponse, orderResponse] = await Promise.all([
            fetch('content/_index.json'),
            fetch('_data/template_order.json').catch(err => {
                console.warn('File urutan tidak dapat diakses, lanjut dengan urutan default.', err);
                return null; // Jika gagal, kembalikan null agar Promise.all tidak berhenti
            })
        ]);


        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json: ${indexResponse.statusText}`);
        
        const allProductIds = await indexResponse.json();
        if (allProductIds.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template.</p>';
            return;
        }

        // --- LANGKAH 3: Tentukan urutan final ID produk berdasarkan aturan ---
        let sortedProductIds = [];
        let orderData = null;

        if (orderResponse && orderResponse.ok) {
            orderData = await orderResponse.json();
        }

        if (orderData && orderData.urutan_produk && orderData.urutan_produk.length > 0) {
            const allIdsSet = new Set(allProductIds); // Gunakan Set untuk pencarian cepat O(1)
            const orderedIds = [];

            // Ambil produk yang terurut sesuai template_order.json
            orderData.urutan_produk.forEach(item => {
                if (allIdsSet.has(item.produk)) {
                    orderedIds.push(item.produk);
                    allIdsSet.delete(item.produk); // Hapus dari Set agar tidak duplikat
                }
            });

            // Sisa produk di dalam Set adalah yang tidak terurut
            const unsortedIds = Array.from(allIdsSet);
            
            // Gabungkan: yang terurut di depan, sisanya di belakang
            sortedProductIds = [...orderedIds, ...unsortedIds];
        } else {
            // Fallback jika file urutan gagal dimuat atau kosong
            sortedProductIds = allProductIds;
        }

        // --- LANGKAH 4: Map dan fetch detail produk berdasarkan urutan yang sudah final ---
        const productPromises = sortedProductIds.map(productId => {
            return fetch(`content/produk/${productId}`)
                .then(res => res.ok ? res.json() : null)
                .then(productData => {
                    if (productData) {
                        productData.id = productId; // Pastikan ID konsisten
                        return productData;
                    }
                    return null;
                });
        });
        console.log(orderedIds);
        console.log(unsortedIds);
        console.log(sortedProductIds);
        
        // Hasil dari Promise.all ini adalah array produk yang SUDAH TERURUT
        let productsInOrder = await Promise.all(productPromises);
        productsInOrder = productsInOrder.filter(p => p !== null);

        // --- LANGKAH 5: Render semua produk ke HTML ---
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

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});
