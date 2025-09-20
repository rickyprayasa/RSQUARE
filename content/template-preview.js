document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('preview-container');
   // 1. Dapatkan ID produk dari URL path
    // Ambil path dari URL, contoh: "/goal-planner" atau "/preview/goal-planner"
    const path = window.location.pathname; 
    // Ambil bagian terakhir dari path sebagai ID produk
    const productId = path.substring(path.lastIndexOf('/') + 1);

    if (!productId) {
        container.innerHTML = `<div class="container mx-auto text-center py-40"><h1 class="text-3xl font-bold">Halaman Tidak Ditemukan</h1></div>`;
        return;
    }

    try {
        const response = await fetch(`../content/produk/${productId}.json`);
        if (!response.ok) {
            throw new Error('Produk tidak ditemukan');
        }
        const product = await response.json();

        if (product && product.detail && product.detail.galeri) {
            // --- BAGIAN SEO (DENGAN CANONICAL KUSTOM) ---
            if (typeof updateSeoTags === 'function') {
                const canonicalUrl = `https://rsquareidea.my.id/${productId}`;
                updateSeoTags({
                    title: `Preview: ${product.seo?.meta_title || product.judul}`,
                    description: product.seo?.meta_description || product.deskripsi_singkat,
                    ogImage: product.seo?.og_image || `https://rsquareidea.my.id/preview/${product.detail?.gambar_utama}`,
                    ogType: 'article',
                    canonicalUrl: canonicalUrl
                });
            }

            // --- PEMBUATAN HTML ---
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

            // B. Daftar Fitur (Galeri)
            const featuresHTML = product.detail.galeri.map(item => {
                const deskripsiFiturHTML = marked.parse(item.deskripsi);
                return `
                <div class="flex flex-col items-center gap-6">
                    <div class="card rounded-xl p-4 w-full md:max-w-3xl">
                        <a href="/content/produk/${item.gambar}" class="zoomable-image cursor-zoom-in">
                            <img src="/content/produk/${item.gambar}" alt="${item.judul}" class="rounded-lg w-full shadow-lg">
                        </a>
                    </div>
                    <div class="text-center md:text-left max-w-2xl">
                        <h2 class="text-3xl font-bold text-gray-800 mb-4">${item.judul}</h2>
                        <div class="prose max-w-none text-gray-600 leading-relaxed space-y-3">${deskripsiFiturHTML}</div>
                    </div>
                </div>`;
            }).join('');

            // C. Bagian Video Tutorial
            const videoHTML = product.detail.link_youtube ? `
                <section class="py-16 px-6">
                    <div class="container mx-auto max-w-4xl">
                        <div class="text-center mb-10">
                            <h2 class="text-3xl font-bold text-gray-800">Tonton Video Tutorialnya!</h2>
                            <p class="text-gray-600 mt-2">Lihat bagaimana template ini bekerja dalam aksi nyata.</p>
                        </div>
                        <div class="card rounded-2xl p-2 md:p-4 relative group perspective-container">
                            <div class="transition-transform duration-500 ease-in-out group-hover:rotate-y-2 group-hover:-rotate-x-2 group-hover:scale-105">
                                <div class="relative overflow-hidden rounded-lg" style="padding-top: 56.25%;">
                                    <iframe class="absolute top-0 left-0 w-full h-full" src="${product.detail.link_youtube}" title="Tutorial ${product.judul}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>` : '';

            // D. Bagian Tombol Pembelian (Call to Action)
            // <-- LOGIKA TOMBOL DIPERBAIKI DI SINI
            const externalButtonsHTML = product.detail.link_pembelian.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Akses di ${link.platform}
                </a>
            `).join('');

            let mainActionButtonHTML = '';
            if (product.harga === 0) {
                if (product.detail?.file_panduan_pdf) {
                    mainActionButtonHTML = `<a href="/instructions/${product.id}" class="btn-primary btn-shiny flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-lg">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Lihat Petunjuk & Download
                    </a>`;
                }
            } else {
                const linkPayment = `${product.detail.payment_gateway}`;
                mainActionButtonHTML = `<a href="${linkPayment}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-shiny inline-block flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                    Beli Langsung
                </a>`;
            }
            
            const allActionButtonsHTML = `${mainActionButtonHTML} ${externalButtonsHTML}`;

            const ctaHTML = `
                <section class="container mx-auto mt-12 text-center">
                    <h2 class="text-3xl font-bold text-gray-800">Siap Meningkatkan Produktivitas?</h2>
                    <p class="text-lg text-gray-600 mt-2 mb-8">Dapatkan template ini sekarang melalui metode di bawah.</p>
                    <div class="max-w-md mx-auto space-y-4">
                        ${allActionButtonsHTML}
                    </div>
                    <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                        <a href="/${product.id}" class="text-gray-500 hover:text-orange-600 font-semibold transition">← Kembali ke Ringkasan</a>
                        <a href="../templates.html" class="text-gray-500 hover:text-orange-600 font-semibold transition">Lihat Semua Template →</a>
                    </div>
                </section>`;

            // Gabungkan semua bagian HTML menjadi satu
            const finalHTML = `
                ${headerHTML}
                <main class="px-6 pb-20 space-y-24">
                    <section class="container mx-auto flex flex-col items-center gap-8 space-y-24 py-12">
                        ${featuresHTML}
                    </section>
                    ${videoHTML}
                    ${ctaHTML}
                </main>`;
            
            container.innerHTML = finalHTML;

            // Aktifkan kembali fungsionalitas JavaScript (Lightbox)
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
            throw new Error('Data produk atau galeri tidak lengkap');
        }
    } catch (error) {
        console.error('Gagal memuat data produk:', error);
        container.innerHTML = `<div class="container mx-auto text-center py-40"><h1 class="text-3xl font-bold">Oops! Terjadi Kesalahan</h1><p class="text-gray-600 mt-2">Tidak dapat memuat data preview untuk produk ini.</p></div>`;
    }
});
