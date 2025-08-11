document.addEventListener('DOMContentLoaded', async () => {
    // 1. Dapatkan ID produk dari URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    const container = document.getElementById('product-detail-container');

    if (!productId) {
        container.innerHTML = '<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Produk tidak ditemukan.</h1><p>Pastikan link Anda benar.</p></div>';
        return;
    }

    // 2. Ambil data produk dari file JSON yang spesifik
    try {
        const response = await fetch(`../content/produk/${productId}.json`);
        
        if (!response.ok) {
            throw new Error(`File produk tidak ditemukan: ${response.statusText}`);
        }

        const product = await response.json();

        if (product) {
            // Mengubah title dan meta description halaman
            document.title = `${product.judul} - RSQUARE`;
            document.querySelector('meta[name="description"]').setAttribute('content', product.deskripsi_singkat);

            // --- PERBAIKAN ADA DI BARIS BERIKUT ---

            // 1. Buat link dinamis ke halaman pembayaran DENGAN TANDA / DI DEPAN
            const linkBeliLangsung = `/${'bayar.html'}?nama_produk=${encodeURIComponent(product.judul)}&harga=${product.harga}`;

            // 2. Buat HTML untuk tombol baru tersebut
            const tombolBeliLangsungHTML = `
                <a href="${linkBeliLangsung}" class="btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-white text-base">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    Beli Langsung (Transfer & Konfirmasi)
                </a>
            `;
            // --- AKHIR PERBAIKAN ---

            // Membuat HTML untuk tombol-tombol dari pihak ketiga (Karyakarsa, dll)
            const externalButtonsHTML = product.detail.link_pembelian.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-secondary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                    Akses di ${link.platform}
                </a>
            `).join('');
            
            // Proses deskripsi lengkap dari Markdown menjadi HTML
            const deskripsiLengkapHTML = marked.parse(product.detail.deskripsi_lengkap);

            // Membangun seluruh HTML untuk konten utama
            const productHTML = `
                <div class="container mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-full group perspective-container">
                                <div id="image-container" class="card rounded-xl p-4 w-full md:max-w-3xl h-auto relative transition-transform duration-500 ease-in-out group-hover:rotate-y-3 group-hover:-rotate-x-2 group-hover:scale-105">
                                    <a href="produk/${product.detail.gambar_utama}" class="cursor-zoom-in">
                                        <img id="product-image" src="produk/${product.detail.gambar_utama}" alt="Tampilan Utama ${product.judul}" class="rounded-lg w-full shadow-lg">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold mb-4 gradient-text pb-2">${product.judul}</h1>
                            <p class="text-3xl font-bold text-gray-900 mb-6">${product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`}</p>
                            
                            <div class="prose max-w-none text-gray-600 mb-8 leading-relaxed">${deskripsiLengkapHTML}</div>
                            
                            <div>
                                <p class="text-sm font-semibold text-gray-600 mb-3">Pilih metode pembelian:</p>
                                <div class="space-y-4">
                                    ${tombolBeliLangsungHTML}
                                    ${externalButtonsHTML}
                                    <hr class="border-gray-700">
                                    <a href="/template-preview.html?product=${product.id}" class="btn-secondary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        Lihat Preview Detail
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Masukkan HTML yang sudah jadi ke dalam container
            container.innerHTML = productHTML;

            // Aktifkan kembali fitur lightbox
            const imageContainer = document.getElementById('image-container');
            if (imageContainer) {
                imageContainer.addEventListener('click', function(e) {
                    if (e.target.closest('a')) {
                        e.preventDefault();
                        const imageUrl = e.target.closest('a').href;
                        if (typeof basicLightbox !== 'undefined') {
                            basicLightbox.create(`<img src="${imageUrl}" alt="">`).show();
                        }
                    }
                });
            }

        } else {
            container.innerHTML = `<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Error 404</h1><p>Produk dengan ID "${productId}" tidak dapat ditemukan.</p></div>`;
        }
    } catch (error) {
        console.error('Gagal memuat data produk:', error);
        container.innerHTML = `<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Error 404</h1><p>Produk dengan ID "${productId}" tidak dapat ditemukan atau terjadi kesalahan.</p><p>Pastikan nama file JSON di folder 'content/produk/' sudah benar dan sesuai dengan ID produk di URL.</p></div>`;
    }
});
