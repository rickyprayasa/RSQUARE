document.addEventListener('DOMContentLoaded', async () => {
    const marqueeLeft = document.getElementById('marquee-left-container');
    const marqueeRight = document.getElementById('marquee-right-container');

    if (!marqueeLeft || !marqueeRight) {
        console.error('Wadah marquee tidak ditemukan.');
        return;
    }

    try {
        const indexResponse = await fetch('content/_index.json');
        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json`);
        
        const productFiles = await indexResponse.json();

        const productPromises = productFiles.map(file => 
            fetch(`content/produk/${file}`).then(res => res.ok ? res.json() : null)
        );
        let products = await Promise.all(productPromises);
        products = products.filter(p => p !== null);

        const images = products.map(product => {
            // --- PERBAIKAN PATH DISAMAKAN DENGAN templates-gallery.js ---
            
            // 1. Ambil path asli dari JSON (kita pakai gambar_utama untuk homepage)
            // Pastikan field ini tidak kosong di JSON Kamu
            const originalPath = product.detail.gambar_utama || '';

            // 2. Bangun ulang path yang benar dengan menambahkan awalan.
            // Dengan asumsi `originalPath` berisi "photos/produk/ID/namafile.png"
            const finalImagePath = `content/produk/${originalPath}`;
            
            return {
                src: finalImagePath, // Gunakan path final
                alt: product.judul
            };
            // --- AKHIR PERBAIKAN ---
        }).filter(img => img.src && !img.src.endsWith('content/produk/')); // Saring jika path kosong

        let marqueeItemsHTML = '';
        images.forEach(image => {
            marqueeItemsHTML += `
                <div class="marquee-item">
                    <img src="${image.src}" alt="${image.alt}">
                </div>
            `;
        });

        const finalHTML = marqueeItemsHTML + marqueeItemsHTML;

        marqueeLeft.innerHTML = finalHTML;
        marqueeRight.innerHTML = finalHTML;

    } catch (error) {
        console.error('Gagal memuat galeri marquee:', error);
    }
});
