document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

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

        // Panggil fungsi SEO hanya jika fungsi 'updateSeoTags' benar-benar ada
        if (typeof updateSeoTags === 'function') {
            updateSeoTags({
                // INI JAWABAN PERTANYAAN ANDA: Jika product.seo.meta_title kosong, ia akan memakai product.judul
                title: product.seo?.meta_title || product.judul,
                // Jika product.seo.meta_description kosong, ia akan memakai product.deskripsi_singkat
                description: product.seo?.meta_description || product.deskripsi_singkat,
                ogImage: product.seo?.og_image || product.detail?.gambar_utama,
                ogType: 'article'
            });
        } else {
            document.title = `${product.judul} - RSQUARE`;
            console.warn("Fungsi updateSeoTags() tidak ditemukan. Pastikan seo.js sudah dimuat dengan benar.");
        }

        const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
        const correctImagePath = `/content/produk/${product.gambar_thumbnail}`;
        const fullDescription = product.detail?.deskripsi_lengkap || product.deskripsi_singkat;

        const productHTML = `
            <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${correctImagePath}" alt="Cover ${product.judul}" class="w-full h-auto rounded-md">
                </div>
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${product.judul}</h1>
                    <p class="text-3xl font-bold text-orange-600 mb-6">${priceDisplay}</p>
                    <div class="prose max-w-none text-gray-700 mb-8">
                        ${fullDescription || ''}
                    </div>
                    
                    <button id="midtrans-pay-button" class="btn-primary btn-shiny w-full py-3 rounded-lg font-semibold text-lg">
                        Beli Otomatis (QRIS, VA, E-Wallet)
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = productHTML;
        
        const payButton = document.getElementById('midtrans-pay-button');
        if (payButton) {
            payButton.addEventListener('click', async () => {
                // ... (Kode logika pembayaran Anda)
            });
        }

    } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        container.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    }
});
