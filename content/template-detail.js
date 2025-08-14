document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Ambil ID produk dari URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    if (!productId) {
        container.innerHTML = '<p class="text-center text-red-500">Error: ID Produk tidak ditemukan di URL.</p>';
        return;
    }

    try {
        const response = await fetch(`/content/produk/${productId}.json`);
        if (!response.ok) throw new Error("Produk tidak ditemukan.");
        const product = await response.json();

        // --- BAGIAN SEO ---
        // Siapkan data untuk dikirim ke seo.js
        const seoDataForPage = {
            title: product.seo?.meta_title || product.judul,
            description: product.seo?.meta_description || product.deskripsi_singkat,
            ogImage: product.seo?.og_image || product.detail?.gambar_utama,
            ogType: 'article'
        };

        // Panggil fungsi SEO hanya jika fungsi 'updateSeoTags' benar-benar ada
        if (typeof updateSeoTags === 'function') {
            updateSeoTags(seoDataForPage);
        } else {
            document.title = seoDataForPage.title; // Fallback darurat
            console.warn("Fungsi updateSeoTags() tidak ditemukan. Pastikan seo.js sudah dimuat sebelum skrip ini.");
        }
        // --- AKHIR BAGIAN SEO ---

        // Siapkan variabel untuk ditampilkan di HTML
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

        // 4. Tombol Lihat Preview
        const previewButtonHTML = `
            <a href="template-preview.html?product=${product.id}" class="btn-secondary-animated-border flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                Lihat Preview Detail
            </a>`;

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
                        ${previewButtonHTML}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = productHTML;
        
        // --- LOGIKA BARU UNTUK TOMBOL MIDTRANS (HANYA ALERT) ---
        const payButton = document.getElementById('midtrans-pay-button');
        if (payButton) {
            payButton.addEventListener('click', () => {
                alert('Fitur pembayaran otomatis sedang dalam pengembangan. Silakan gunakan metode pembelian manual untuk saat ini.');
            });
        }

    } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        container.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    }
});
