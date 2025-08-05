document.addEventListener('DOMContentLoaded', async () => {
    // Temukan dua wadah marquee di HTML
    const marqueeLeft = document.getElementById('marquee-left-container');
    const marqueeRight = document.getElementById('marquee-right-container');

    // Jika wadah tidak ditemukan, hentikan skrip
    if (!marqueeLeft || !marqueeRight) {
        console.error('Wadah marquee tidak ditemukan.');
        return;
    }

    try {
        // 1. Ambil daftar semua produk dari file _index.json
        const indexResponse = await fetch('content/produk/_index.json');
        if (!indexResponse.ok) throw new Error(`Gagal memuat _index.json`);
        
        const productFiles = await indexResponse.json();

        // 2. Ambil data detail dari setiap file produk
        const productPromises = productFiles.map(file => 
            fetch(`content/produk/${file}`).then(res => res.ok ? res.json() : null)
        );
        let products = await Promise.all(productPromises);
        products = products.filter(p => p !== null);

        // 3. Ekstrak hanya data gambar yang kita perlukan
        // Kita akan ambil 'gambar_utama' dari setiap produk untuk ditampilkan di marquee
        const images = products.map(product => {
            // Pastikan path tidak diawali '/'
            let imagePath = `content/produk/${product.gambar_utama}`|| '';
            if (imagePath.startsWith('/')) {
                imagePath = imagePath.substring(1);
            }
            return {
                src: imagePath,
                alt: product.judul
            };
        }).filter(img => img.src); // Saring jika ada produk yang tidak punya gambar utama

        // 4. Buat string HTML untuk semua gambar
        let marqueeItemsHTML = '';
        images.forEach(image => {
            marqueeItemsHTML += `
                <div class="marquee-item">
                    <img src="${image.src}" alt="${image.alt}">
                </div>
            `;
        });

        // 5. Gandakan gambar agar efek loop terlihat mulus
        const finalHTML = marqueeItemsHTML + marqueeItemsHTML;

        // 6. Masukkan HTML yang sudah jadi ke dalam kedua wadah marquee
        marqueeLeft.innerHTML = finalHTML;
        marqueeRight.innerHTML = finalHTML;

    } catch (error) {
        console.error('Gagal memuat galeri marquee:', error);
        // Biarkan marquee kosong jika terjadi error
    }
});
