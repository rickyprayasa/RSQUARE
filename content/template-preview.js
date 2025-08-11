document.addEventListener('DOMContentLoaded', async () => {
    // Dapatkan elemen kontainer utama tempat semua konten akan dimasukkan
    const container = document.getElementById('preview-container');
    
    // 1. Ambil ID Produk dari URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    // Jika tidak ada ID produk di URL, tampilkan pesan error dan hentikan.
    if (!productId) {
        container.innerHTML = `
            <div class="container mx-auto text-center py-40">
                <h1 class="text-3xl font-bold">Halaman Tidak Ditemukan</h1>
                <p class="text-gray-600 mt-2">Pastikan Anda menyertakan ID produk di URL (contoh: ?product=nama-template).</p>
            </div>`;
        return;
    }

    // 2. Ambil data dari file JSON yang spesifik
    try {
        const response = await fetch(`../../content/produk/${productId}.json`);
        
        if (!response.ok) {
            throw new Error(`File produk tidak ditemukan: ${response.statusText}`);
        }

        const product = await response.json();

        // 4. Jika produk dan data galerinya ditemukan, bangun halaman
        if (product && product.detail && product.detail.galeri) {
            
            // Mengubah judul halaman dan meta deskripsi secara dinamis
            document.title = `Preview Detail: ${product.judul} - RSQUARE`;
            document.querySelector('meta[name="description"]').setAttribute('content', product.deskripsi_singkat);

            // --- Mulai Membangun String HTML ---

            const deskripsiLengkapHTML = marked.parse(product.detail.deskripsi_lengkap);

            // A. Header Halaman
            const headerHTML = `
                <header class="py-20 px-6 text-center">
                    <div class="container mx-auto">
                        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 gradient-text pb-2">Preview Detail: ${product.judul}</h1>
                        <div class="prose max-w-2xl mx-auto text-lg text-gray-600">${deskripsiLengkapHTML}</div>
                        <div class="inline-block bg-orange-100 text-orange-800 font-bold text-2xl px-8 py-3 rounded-full mt-6 shadow-sm">
                            ${product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`}
                        </div>
                    </div>
                </header>`;

            // B. Daftar Fitur (Looping dari data 'galeri')
            const featuresHTML = product.detail.galeri.map(item => {
                const deskripsiFiturHTML = marked.parse(item.deskripsi);
                return `
                <div class="flex flex-col items-center gap-6">
                    <div class="card rounded-xl p-4 w-full md:max-w-3xl">
                        <a href="/produk/${item.gambar}" class="zoomable-image cursor-zoom-in">
                            <img src="/produk/${item.gambar}" alt="${item.judul}" class="rounded-lg w-full shadow-lg">
                        </a>
                    </div>
                    <div class="text-center md:text-left max-w-2xl">
                        <h2 class="text-3xl font-bold text-gray-800 mb-4">${item.judul}</h2>
                        <div class="prose max-w-none text-gray-600 leading-relaxed space-y-3">${deskripsiFiturHTML}</div>
                    </div>
                </div>
                `;
            }).join('');

            // C. Bagian Video Tutorial
            const videoHTML = `
                <section class="py-16 px-6">
                    <div class="container mx-auto max-w-4xl">
                        <div class="text-center mb-10">
                            <h2 class="text-3xl font-bold text-gray-800">Tonton Video Tutorialnya!</h2>
                            <p class="text-gray-600 mt-2">Lihat bagaimana template ini bekerja dalam aksi nyata.</p>
                        </div>
                        <div class="card rounded-2xl p-2 md:p-4 relative group perspective-container">
                            <div class="transition-transform duration-500 ease-in-out group-hover:rotate-y-2 group-hover:-rotate-x-2 group-hover:scale-105">
                                <div class="relative overflow-hidden rounded-lg" style="padding-top: 56.25%;">
                                    <iframe class="absolute top-0 left-0 w-full h-full"
                                            src="${product.detail.link_youtube}"
                                            title="Tutorial ${product.judul}"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>`;

            // D. Bagian Tombol Pembelian (Call to Action)
            const ctaButtonsHTML = product.detail.link_pembelian.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-white text-base" onclick="fbq('track', 'InitiateCheckout');">
                    Akses di ${link.platform}
                </a>
            `).join('');
            
            const ctaHTML = `
                <section class="container mx-auto mt-12 text-center">
                    <h2 class="text-3xl font-bold text-gray-800">Siap Meningkatkan Produktivitas?</h2>
                    <p class="text-lg text-gray-600 mt-2 mb-8">Pilih platform favorit Anda untuk mendapatkan template ini sekarang.</p>
                    <div class="max-w-md mx-auto space-y-4">
                        ${ctaButtonsHTML}
                    </div>
                    <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                        <a href="/template-detail.html?product=${product.id}" class="text-gray-500 hover:text-orange-600 font-semibold transition">← Kembali ke Ringkasan</a>
                        <a href="/templates.html" class="text-gray-500 hover:text-orange-600 font-semibold transition">Lihat Semua Template →</a>
                    </div>
                </section>`;

            // Gabungkan semua bagian HTML menjadi satu
            const finalHTML = `
                ${headerHTML}
                <main class="px-6 pb-20 space-y-24">
                    <section class="container mx-auto flex flex-col items-center gap-8 space-y-24 py-12">
                        ${featuresHTML}
                    </section>
                    ${product.detail.link_youtube ? videoHTML : ''}
                    ${ctaHTML}
                </main>
            `;
            
            // 5. Masukkan HTML yang sudah jadi ke dalam kontainer
            container.innerHTML = finalHTML;

            // 6. Aktifkan kembali fungsionalitas JavaScript (Lightbox untuk zoom gambar)
            const zoomableImages = document.querySelectorAll('.zoomable-image');
            if (typeof basicLightbox !== 'undefined') {
                zoomableImages.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const imageUrl = this.href;
                        basicLightbox.create(`<img src="${imageUrl}">`).show();
                    });
                });
            }

        } else {
            // Jika produk tidak ditemukan atau tidak punya data galeri
            container.innerHTML = `
                <div class="container mx-auto text-center py-40">
                    <h1 class="text-3xl font-bold">Error 404 - Konten Tidak Ditemukan</h1>
                    <p class="text-gray-600 mt-2">Preview detail untuk produk dengan ID "${productId}" tidak dapat ditemukan.</p>
                </div>`;
        }
    } catch (error) {
        // Jika terjadi error saat memuat file JSON
        console.error('Gagal memuat data produk:', error);
        container.innerHTML = `
            <div class="container mx-auto text-center py-40">
                <h1 class="text-3xl font-bold">Oops! Terjadi Kesalahan</h1>
                <p class="text-gray-600 mt-2">Tidak dapat memuat data produk untuk ID "${productId}". Pastikan file JSON ada dan path sudah benar.</p>
            </div>`;
    }
});
