document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Ambil ID produk dari URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    if (!productId) {
        container.innerHTML = '<p class="text-center text-red-500">Error: ID Produk tidak ditemukan.</p>';
        return;
    }

    try {
        const response = await fetch(`/content/produk/${productId}.json`);
        if (!response.ok) throw new Error("Produk tidak ditemukan.");
        const product = await response.json();

        // --- BAGIAN SEO ---
        // Panggil fungsi SEO hanya jika fungsi 'updateSeoTags' benar-benar ada
        if (typeof updateSeoTags === 'function') {
            updateSeoTags({
                title: product.seo?.meta_title || product.judul,
                description: product.seo?.meta_description || product.deskripsi_singkat,
                ogImage: product.seo?.og_image || product.detail?.gambar_utama,
                ogType: 'article'
            });
        } else {
            // Fallback jika seo.js gagal dimuat
            document.title = `${product.judul} - RSQUARE`;
            console.warn("Fungsi updateSeoTags() tidak ditemukan. Pastikan seo.js sudah dimuat.");
        }
        // --- AKHIR BAGIAN SEO ---

        const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
        const correctImagePath = `/content/produk/${product.gambar_thumbnail}`;
        const fullDescription = product.detail?.deskripsi_lengkap || product.deskripsi_singkat;
        
        // --- MEMBUAT HTML UNTUK SEMUA TOMBOL ---
        // 1. Tombol Beli Otomatis (Midtrans) - FUNGSI KLIK DINONAKTIFKAN
        const midtransButtonHTML = `
            <button id="midtrans-pay-button" class="btn-primary btn-shiny w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                Beli Otomatis (QRIS, VA, E-Wallet)
            </button>`;
            
        // 2. Tombol Beli Manual
        const linkBeliManual = `/bayar.html?nama_produk=${encodeURIComponent(product.judul)}&harga=${product.harga}`;
        const tombolBeliManualHTML = `
            <a href="${linkBeliManual}" class="btn-secondary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                Beli Manual (Transfer & Konfirmasi)
            </a>`;

        // 3. Tombol Platform Eksternal
        const externalButtonsHTML = product.detail.link_pembelian.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-secondary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                Akses di ${link.platform}
            </a>
        `).join('');

        // Masukkan semua HTML ke dalam halaman
        const productHTML = `
            <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${correctImagePath}" alt="Cover ${product.judul}" class="w-full h-auto rounded-md">
                </div>
                <div>
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${product.judul}</h1>
                    <p class="text-3xl font-bold text-orange-600 mb-6">${priceDisplay}</p>
                    <div class="prose max-w-none text-gray-700 mb-8">
                        ${fullDescription || ''}
                    </div>
                    <div class="space-y-4">
                      
                        ${tombolBeliManualHTML}
                        ${externalButtonsHTML}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = productHTML;
        
        // --- LOGIKA BARU UNTUK TOMBOL MIDTRANS ---
        // Cari tombol Midtrans setelah ditampilkan
        const payButton = document.getElementById('midtrans-pay-button');
        if (payButton) {
            // Tambahkan fungsi klik yang hanya menampilkan alert
            payButton.addEventListener('click', () => {
                alert('Fitur pembayaran otomatis sedang dalam pengembangan. Silakan gunakan metode pembelian manual untuk saat ini.');
            });
        }

    } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        container.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    }
});
