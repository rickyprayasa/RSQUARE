document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Ambil ID produk dari URL, contoh: ?product=goal-planner
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    if (!productId) {
        container.innerHTML = '<p class="text-center text-red-500">Error: ID Produk tidak ditemukan di URL.</p>';
        return;
    }

    try {
        // 1. Ambil detail produk dari file JSON yang sesuai
        const response = await fetch(`/content/produk/${productId}.json`);
        if (!response.ok) throw new Error("Produk tidak ditemukan.");
        const product = await response.json();

        document.title = `${product.judul} - RSQUARE`;
        
        const priceDisplay = product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`;
        const correctImagePath = `/content/produk/${product.gambar_thumbnail}`;

        // 2. Buat HTML untuk detail produk dan tombol bayar
        const productHTML = `
            <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${correctImagePath}" alt="Cover ${product.judul}" class="w-full h-auto rounded-md">
                </div>
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${product.judul}</h1>
                    <p class="text-3xl font-bold text-orange-600 mb-6">${priceDisplay}</p>
                    <div class="prose max-w-none text-gray-700 mb-8">
                        ${product.deskripsi_lengkap}
                    </div>
                    
                    <button id="midtrans-pay-button" class="btn-primary btn-shiny w-full py-3 rounded-lg font-semibold text-lg">
                        Beli Otomatis (QRIS, VA, E-Wallet)
                    </button>
                </div>
            </div>
        `;

        // 3. Masukkan HTML ke dalam halaman
        container.innerHTML = productHTML;

        // 4. SETELAH HTML DITAMPILKAN, BARU KITA CARI TOMBOLNYA
        const payButton = document.getElementById('midtrans-pay-button');
        if (payButton) {
            // 5. Tambahkan fungsi klik pada tombol
            payButton.addEventListener('click', async () => {
                try {
                    const productDetails = {
                        id: product.id,
                        name: product.judul,
                        price: product.harga
                    };

                    const response = await fetch('/.netlify/functions/create-transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productDetails),
                    });

                    const responseData = await response.json();
                    if (!response.ok) throw new Error(responseData.error || 'Gagal mendapatkan token.');
                    
                    window.snap.pay(responseData.token, {
                        onSuccess: (result) => alert("Pembayaran berhasil!"),
                        onPending: (result) => alert("Pembayaran tertunda."),
                        onError: (result) => alert("Pembayaran gagal!")
                    });
                } catch (error) {
                    console.error("Error saat proses pembayaran:", error);
                    alert(`Terjadi kesalahan: ${error.message}`);
                }
            });
        }

    } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        container.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    }
});


// ... di dalam blok try, setelah Anda mendapatkan objek 'product'
try {
    const response = await fetch(`/content/produk/${productId}.json`);
    if (!response.ok) throw new Error("Produk tidak ditemukan.");
    const product = await response.json();

    // --- PANGGIL FUNGSI SEO DI SINI ---
    updateSeoTags({
        title: product.seo?.meta_title || product.judul,
        description: product.seo?.meta_description || product.deskripsi_singkat,
        ogImage: product.seo?.og_image || product.detail?.gambar_utama,
        ogType: 'article' // Tipe 'article' lebih cocok untuk halaman detail produk
    });
    // --- SELESAI MEMANGGIL FUNGSI SEO ---

    // Lanjutkan kode Anda untuk membuat HTML halaman...
    const priceDisplay = ...
    // ... dst
} catch (error) {
    // ...
}
