document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center p-8">
        <svg id="svg-loader" class="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <rect class="loader-bar" x="4" y="14" width="8" height="24" rx="4"></rect>
            <rect class="loader-bar" x="22" y="14" width="8" height="24" rx="4"></rect>
            <rect class="loader-bar" x="40" y="14" width="8" height="24" rx="4"></rect>
        </svg>
        <p class="mt-4 text-gray-500">Memuat Template...</p>
    </div>
`;


    try {
        const indexResponse = await fetch('content/_index.json');
        const orderData = await fetch('_data/template_order.json')
            .then(response => response.ok ? response.json() : {})
            .catch(() => ({}));

        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json: ${indexResponse.statusText}`);
        
        const allProductFiles = await indexResponse.json();
        if (allProductFiles.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template.</p>';
            return;
        }

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
            sortedProductFiles = [...orderedFiles, ...Array.from(allFilesSet)];
        } else {
            sortedProductFiles = allProductFiles;
        }
        
        const productPromises = sortedProductFiles.map(file => 
            fetch(`content/produk/${file}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => data ? { ...data, id: file.replace('.json', '') } : null)
        );
        
        let productsInOrder = (await Promise.all(productPromises)).filter(p => p);

        const allCardsHTML = productsInOrder.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            const detailLink = `/${product.id}`;
            const correctImagePath = `content/produk/${product.gambar_thumbnail}`;
            
            // PERUBAHAN DI SINI: Hapus 'slide-in-blurred-top', ganti dengan 'card-item'
            return `
                <div class="card card-item rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-6">
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
            <div class="card card-item rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
                <div class="flex-grow flex flex-col items-center justify-center">
                    <svg class="w-16 h-16 text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455l-1.177-.398 1.177-.398a3.375 3.375 0 002.455-2.455l.398-1.177.398 1.177a3.375 3.375 0 002.455 2.455l1.177.398-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></svg>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Template Baru Segera Hadir!</h3>
                    <p class="text-gray-600 mb-6 flex-grow">Kami terus berinovasi untuk Kamu.</p>
                </div>
                <a href="jasa-kustom.html" class="btn-primary btn-shiny mt-auto text-center px-6 py-2 rounded-lg font-semibold text-white">Request Template?</a>
            </div>`;
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);

        // --- KODE BARU UNTUK ANIMASI BERURUTAN ---
        const cardsToAnimate = galleryContainer.querySelectorAll('.card-item');

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                cardsToAnimate.forEach((card, index) => {
                    // Beri jeda waktu untuk setiap kartu
                    setTimeout(() => {
                        card.style.opacity = '1'; // Munculkan dulu
                        card.classList.add('slide-in-blurred-top'); // Lalu jalankan animasi
                    }, index * 150); // Jeda 150ms antar kartu
                });
                observer.unobserve(galleryContainer); // Hentikan pengamatan setelah animasi berjalan
            }
        }, { threshold: 0.1 });

        observer.observe(galleryContainer);
        // --- SELESAI KODE BARU ---

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});
