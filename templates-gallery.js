document.addEventListener('DOMContentLoaded', async () => {
    // Temukan elemen 'div' di HTML yang akan kita isi dengan galeri
    const galleryContainer = document.getElementById('product-gallery-container');
    
    if (!galleryContainer) {
        console.error('PENTING: Elemen dengan ID #product-gallery-container tidak ditemukan di HTML.');
        return;
    }

    try {
        // 1. Ambil file "daftar isi" (_index.json) yang dibuat otomatis oleh Netlify
        const indexResponse = await fetch('content/produk/_index.json');
        if (!indexResponse.ok) {
            throw new Error(`Gagal memuat daftar produk (_index.json). Status: ${indexResponse.status}`);
        }
        const productFiles = await indexResponse.json();

        // Jika tidak ada produk di daftar, tampilkan pesan dan hentikan
        if (productFiles.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template yang tersedia saat ini.</p>';
            return;
        }

        // 2. Ambil detail dari setiap file produk secara bersamaan (lebih efisien)
        const productPromises = productFiles.map(file =>
            fetch(`content/produk/${file}`).then(res => res.ok ? res.json() : null)
        );
        let products = await Promise.all(productPromises);
        
        // Saring produk yang mungkin gagal dimuat (yang bernilai null)
        products = products.filter(p => p !== null);

        // 3. Ubah setiap data produk menjadi format HTML (kartu produk)
        const allCardsHTML = products.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            const detailLink = `content/template-detail.html?product=${product.id}`;
            
            return `
                <div class="card rounded-xl overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div class="relative z-10 flex flex-col flex-grow">
                        <a href="${detailLink}" class="block">
                            <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                                <img src="${product.gambar_thumbnail}" alt="Cover ${product.judul}" class="w-full h-full object-contain p-2">
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

        // 4. Masukkan semua kartu yang sudah jadi ke dalam 'div' di HTML
        galleryContainer.innerHTML = allCardsHTML;
        
        // 5. Tambahkan kartu "Segera Hadir" di bagian akhir galeri
        const comingSoonCard = `
            <div class="card rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
                <div class="flex-grow flex flex-col items-center justify-center">
                    <svg class="w-16 h-16 text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455l-1.177-.398 1.177-.398a3.375 3.375 0 002.455-2.455l.398-1.177.398 1.177a3.375 3.375 0 002.455 2.455l1.177.398-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></svg>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Template Baru Segera Hadir!</h3>
                    <p class="text-gray-600 mb-6 flex-grow">Kami terus berinovasi untuk Anda.</p>
                </div>
                <a href="kontak.html" class="btn-primary btn-shiny mt-auto text-center px-6 py-2 rounded-lg font-semibold text-white">Request Template?</a>
            </div>`;
        galleryContainer.insertAdjacentHTML('beforeend', comingSoonCard);

    } catch (error) {
        // Jika terjadi error, tampilkan pesan yang informatif di halaman
        console.error('Gagal total memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan saat memuat koleksi template. Silakan coba cek kembali konfigurasi atau hubungi dukungan. Error: ${error.message}</p>`;
    }
});
