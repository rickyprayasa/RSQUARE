document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('download-button-container');
    if (!container) return;

    // Ambil ID produk dari URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    if (!productId) {
        container.innerHTML = '<p class="text-red-500">Error: ID produk tidak ditemukan.</p>';
        return;
    }

    try {
        // Ambil data produk untuk menemukan path PDF
        const response = await fetch(`/content/produk/${productId}.json`);
        if (!response.ok) throw new Error("Data produk tidak ditemukan.");
        const product = await response.json();

        // Cek apakah produknya memiliki file PDF
        if (product.detail?.file_panduan_pdf) {
            const pdfPath = `/${product.detail.file_panduan_pdf}`;
            // Buat tombol download
            container.innerHTML = `
                <a href="${pdfPath}" download class="btn-primary btn-shiny inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-lg">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Panduan "${product.judul}"
                </a>
            `;
        } else {
            container.innerHTML = '<p class="text-gray-500">File panduan untuk produk ini belum tersedia.</p>';
        }

    } catch (error) {
        console.error("Gagal memuat data panduan:", error);
        container.innerHTML = '<p class="text-red-500">Terjadi kesalahan saat memuat data panduan.</p>';
    }
});
