document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('product-gallery-container');
    if (!galleryContainer) return;

    // Menampilkan pesan loading awal
    galleryContainer.innerHTML = '<p class="text-center col-span-full text-gray-500">Memuat koleksi template...</p>';

    try {
        // 1. Memuat file index dari path absolut yang benar
        const response = await fetch('/content/_index.json');
        if (!response.ok) {
            throw new Error(`Gagal memuat file index produk: ${response.statusText}`);
        }
        
        // 2. Data produk sudah lengkap di sini, tidak perlu fetch berulang kali
        const products = await response.json();

        // Cek jika tidak ada produk
        if (!products || products.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center col-span-full">Belum ada template yang tersedia.</p>';
            galleryContainer.insertAdjacentHTML('beforeend', createComingSoonCard()); // Tambahkan kartu "Coming Soon"
            return;
        }

        // 3. Langsung proses data produk untuk membuat kartu HTML
        const allCardsHTML = products.map(product => {
            const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
            
            // Menggunakan path absolut untuk link detail agar lebih aman dan andal
            const detailLink = `/template-detail.html?product=${product.id}`;
            
            // Path gambar langsung dari data JSON, dengan path absolut
            const imagePath = `/${product.gambar_thumbnail}`;

            return `
                <div class="card rounded-xl overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <a href="${detailLink}" class="block flex flex-col flex-grow">
                        <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                            <img src="${imagePath}" alt="Cover ${product.judul}" class="w-full h-full object-contain p-2">
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${product.judul}</h3>
                            <p class="text-gray-600 mb-4 flex-grow">${product.deskripsi_singkat}</p>
                            <p class="text-2xl font-bold text-gray-900 mb-6">${priceDisplay}</p>
                            <div class="mt-auto">
                                <span class="btn-secondary text-center block w-full px-6 py-2 rounded-lg font-semibold">Lihat Detail</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        // Tampilkan semua kartu produk
        galleryContainer.innerHTML = allCardsHTML;
        
        // Tambahkan kartu "Segera Hadir" di akhir daftar
        galleryContainer.insertAdjacentHTML('beforeend', createComingSoonCard());

    } catch (error) {
        console.error('Gagal memuat galeri produk:', error);
        galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Maaf, terjadi kesalahan. Error: ${error.message}</p>`;
    }
});

// Fungsi untuk membuat HTML kartu "Coming Soon"
function createComingSoonCard() {
    return `
        <div class="card rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6 min-h-[450px]">
            <div class="flex-grow flex flex-col items-center justify-center">
                <svg class="w-16 h-16 text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455l-1.177-.398 1.177-.398a3.375 3.375 0 002.455-2.455l.398-1.177.398 1.177a3.375 3.375 0 002.455 2.455l1.177.398-1.177.398a3.375 3.375 0 00-2.455 2.455z" /></svg>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Template Baru Segera Hadir!</h3>
                <p class="text-gray-600 mb-6 flex-grow">Kami terus berinovasi untuk Anda.</p>
            </div>
            <a href="/kontak.html" class="btn-primary btn-shiny mt-auto text-center w-full px-6 py-2 rounded-lg font-semibold text-white">Request Template?</a>
        </div>`;
}
