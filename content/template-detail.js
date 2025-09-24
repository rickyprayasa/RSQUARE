document.addEventListener('DOMContentLoaded', async () => {
    // 1. Dapatkan ID produk dari URL path
    // Ambil path dari URL, contoh: "/goal-planner" atau "/preview/goal-planner"
    const path = window.location.pathname; 
    // Ambil bagian terakhir dari path sebagai ID produk
    const productId = path.substring(path.lastIndexOf('/') + 1);

    const container = document.getElementById('product-detail-container');

    if (!productId) {
        container.innerHTML = '<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Produk tidak ditemukan.</h1><p>Pastikan link Kamu benar.</p></div>';
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
            // --- BAGIAN SEO (DENGAN PENAMBAHAN CANONICAL URL) ---
            if (typeof updateSeoTags === 'function') {
                const canonicalUrl = `https://rsquareidea.my.id/${productId}`; // Definisikan URL kanonis
                updateSeoTags({
                    title: product.seo?.meta_title || product.judul,
                    description: product.seo?.meta_description || product.deskripsi_singkat,
                    ogImage: product.seo?.og_image || `https://rsquareidea.my.id/preview/${product.detail?.gambar_utama}`,
                    ogType: 'article',
                    canonicalUrl: canonicalUrl // Tambahkan canonical URL ke meta tag
                });
            }

            // ▼▼▼ --- LOGIKA JSON-LD DINAMIS DITAMBAHKAN DI SINI --- ▼▼▼
            const ldJson = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.judul,
                "description": product.seo?.meta_description || product.deskripsi_singkat,
                "sku": product.id,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://rsquareidea.my.id/${productId}` // URL kanonis
                },
                "image": `https://rsquareidea.my.id${product.detail.gambar_utama}`,
                "offers": {
                    "@type": "Offer",
                    "url": `https://rsquareidea.my.id/${productId}`, // URL halaman produk
                    "priceCurrency": "IDR",
                    "price": product.harga.toString(),
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "RSQUARE"
                    }
                },
                "brand": {
                    "@type": "Brand",
                    "name": "RSQUARE"
                }
            };
            
            // Tambahkan video jika ada
            if (product.detail.link_youtube) {
                ldJson.video = {
                    "@type": "VideoObject",
                    "name": `Tutorial ${product.judul}`,
                    "description": product.deskripsi_singkat,
                    "uploadDate": product.detail.video_upload_date,
                    "thumbnailUrl": `https://rsquareidea.my.id${product.gambar_thumbnail}`,
                    "embedUrl": product.detail.link_youtube
                };
            }

            const scriptLdJson = document.createElement('script');
            scriptLdJson.type = 'application/ld+json';
            scriptLdJson.textContent = JSON.stringify(ldJson, null, 2);
            document.head.appendChild(scriptLdJson);
            // ▲▲▲ --- AKHIR LOGIKA JSON-LD --- ▲▲▲
            
            // --- PEMBUATAN TOMBOL-TOMBOL (BAGIAN YANG DIPERBAIKI) ---

            // A. Buat tombol untuk platform eksternal terlebih dahulu
            const externalButtonsHTML = product.detail.link_pembelian.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Akses di ${link.platform}
                </a>
            `).join('');
            
            // B. Tentukan tombol aksi utama berdasarkan harga
            let mainActionButtonHTML = '';
            if (product.harga === 0) {
                // Tombol untuk produk GRATIS
                if (product.detail?.file_panduan_pdf) {
                    mainActionButtonHTML = `
                        <a href="/instructions/${product.id}" class="btn-primary btn-shiny flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-lg">
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Gratis
                        </a>`;
                } else {
                    mainActionButtonHTML = '<p class="text-center text-gray-500">File untuk produk gratis ini akan segera tersedia.</p>';
                }
            } else {
                // Tombol untuk produk BERBAYAR
                const linkPayment = `${product.detail.payment_gateway}`;
                mainActionButtonHTML = `
                    <a href="${linkPayment}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-shiny inline-block flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                        Beli Langsung
                    </a>`;
            }

            // C. Gabungkan semua tombol menjadi satu
            const allActionButtonsHTML = `
                ${mainActionButtonHTML}
                ${externalButtonsHTML}
            `;
           
            // --- PEMBUATAN HTML UTAMA ---
            const deskripsiLengkapHTML = marked.parse(product.detail.deskripsi_lengkap);
            const productHTML = `
                <div class="container mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-full group perspective-container">
                                <div id="image-container" class="card rounded-xl p-4 w-full md:max-w-3xl h-auto relative transition-transform duration-500 ease-in-out group-hover:rotate-y-3 group-hover:-rotate-x-2 group-hover:scale-105">
                                    <a href="/content/produk/${product.detail.gambar_utama}" class="cursor-zoom-in">
                                        <img id="product-image" src="/content/produk/${product.detail.gambar_utama}" alt="Tampilan Utama ${product.judul}" class="rounded-lg w-full shadow-lg">
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
                                    ${allActionButtonsHTML}
                                    <hr class="border-gray-300">
                                    <a href="/preview/${product.id}" class="btn-secondary-animated-border flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        Lihat Preview Detail
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

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
        container.innerHTML = `<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Error 404</h1><p>Produk tidak ditemukan atau terjadi kesalahan.</p></div>`;
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Dapatkan ID produk dari URL path
    // Ambil path dari URL, contoh: "/goal-planner" atau "/preview/goal-planner"
    const path = window.location.pathname; 
    // Ambil bagian terakhir dari path sebagai ID produk
    const productId = path.substring(path.lastIndexOf('/') + 1);

    const container = document.getElementById('product-detail-container');

    if (!productId) {
        container.innerHTML = '<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Produk tidak ditemukan.</h1><p>Pastikan link Kamu benar.</p></div>';
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
            // --- BAGIAN SEO (DENGAN PENAMBAHAN CANONICAL URL) ---
            if (typeof updateSeoTags === 'function') {
                const canonicalUrl = `https://rsquareidea.my.id/${productId}`; // Definisikan URL kanonis
                updateSeoTags({
                    title: product.seo?.meta_title || product.judul,
                    description: product.seo?.meta_description || product.deskripsi_singkat,
                    ogImage: product.seo?.og_image || `https://rsquareidea.my.id/preview/${product.detail?.gambar_utama}`,
                    ogType: 'article',
                    canonicalUrl: canonicalUrl // Tambahkan canonical URL ke meta tag
                });
            }

            // ▼▼▼ --- LOGIKA JSON-LD DINAMIS DITAMBAHKAN DI SINI --- ▼▼▼
            const ldJson = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.judul,
                "description": product.seo?.meta_description || product.deskripsi_singkat,
                "sku": product.id,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://rsquareidea.my.id/${productId}` // URL kanonis
                },
                "image": `https://rsquareidea.my.id${product.detail.gambar_utama}`,
                "offers": {
                    "@type": "Offer",
                    "url": `https://rsquareidea.my.id/${productId}`, // URL halaman produk
                    "priceCurrency": "IDR",
                    "price": product.harga.toString(),
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "RSQUARE"
                    }
                },
                "brand": {
                    "@type": "Brand",
                    "name": "RSQUARE"
                }
            };
            
            // Tambahkan video jika ada
            if (product.detail.link_youtube) {
                ldJson.video = {
                    "@type": "VideoObject",
                    "name": `Tutorial ${product.judul}`,
                    "description": product.deskripsi_singkat,
                    "thumbnailUrl": `https://rsquareidea.my.id${product.gambar_thumbnail}`,
                    "embedUrl": product.detail.link_youtube
                };
            }

            const scriptLdJson = document.createElement('script');
            scriptLdJson.type = 'application/ld+json';
            scriptLdJson.textContent = JSON.stringify(ldJson, null, 2);
            document.head.appendChild(scriptLdJson);
            // ▲▲▲ --- AKHIR LOGIKA JSON-LD --- ▲▲▲
            
            // --- PEMBUATAN TOMBOL-TOMBOL (BAGIAN YANG DIPERBAIKI) ---

            // A. Buat tombol untuk platform eksternal terlebih dahulu
            const externalButtonsHTML = product.detail.link_pembelian.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Akses di ${link.platform}
                </a>
            `).join('');
            
            // B. Tentukan tombol aksi utama berdasarkan harga
            let mainActionButtonHTML = '';
            if (product.harga === 0) {
                // Tombol untuk produk GRATIS
                if (product.detail?.file_panduan_pdf) {
                    mainActionButtonHTML = `
                        <a href="/instructions/${product.id}" class="btn-primary btn-shiny flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-lg">
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Gratis
                        </a>`;
                } else {
                    mainActionButtonHTML = '<p class="text-center text-gray-500">File untuk produk gratis ini akan segera tersedia.</p>';
                }
            } else {
                // Tombol untuk produk BERBAYAR
                const linkPayment = `${product.detail.payment_gateway}`;
                mainActionButtonHTML = `
                    <a href="${linkPayment}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-shiny inline-block flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold" onclick="fbq('track', 'InitiateCheckout');">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                        Beli Langsung
                    </a>`;
            }

            // C. Gabungkan semua tombol menjadi satu
            const allActionButtonsHTML = `
                ${mainActionButtonHTML}
                ${externalButtonsHTML}
            `;
           
            // --- PEMBUATAN HTML UTAMA ---
            const deskripsiLengkapHTML = marked.parse(product.detail.deskripsi_lengkap);
            const productHTML = `
                <div class="container mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-full group perspective-container">
                                <div id="image-container" class="card rounded-xl p-4 w-full md:max-w-3xl h-auto relative transition-transform duration-500 ease-in-out group-hover:rotate-y-3 group-hover:-rotate-x-2 group-hover:scale-105">
                                    <a href="/content/produk/${product.detail.gambar_utama}" class="cursor-zoom-in">
                                        <img id="product-image" src="/content/produk/${product.detail.gambar_utama}" alt="Tampilan Utama ${product.judul}" class="rounded-lg w-full shadow-lg">
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
                                    ${allActionButtonsHTML}
                                    <hr class="border-gray-300">
                                    <a href="/preview/${product.id}" class="btn-secondary-animated-border flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold">
                                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        Lihat Preview Detail
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

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
        container.innerHTML = `<div class="container mx-auto text-center"><h1 class="text-3xl font-bold">Error 404</h1><p>Produk tidak ditemukan atau terjadi kesalahan.</p></div>`;
    }
});
