// Cek di awal halaman: apakah pengguna sudah login?
if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
    // Jika belum, langsung tendang kembali ke halaman login
    window.location.href = 'login.html';
}

// Fungsi ini akan berjalan setelah seluruh halaman HTML dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Logika untuk Tombol Logout (Desktop & Mobile)
    const logoutButton = document.getElementById('logoutButton');
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');

    const handleLogout = (event) => {
        event.preventDefault();
        sessionStorage.removeItem('isAdminLoggedIn');
        alert('Anda telah berhasil logout.');
        window.location.href = 'index.html';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }

    // Panggil fungsi utama untuk memuat produk
    loadProducts();
});


// --- FUNGSI UTAMA UNTUK MEMUAT DAN MENAMPILKAN PRODUK ---
async function loadProducts() {
    try {
        const response = await fetch('produk.json');
        const products = await response.json();
        
        const productListDiv = document.getElementById('productList');
        
        if (products.length === 0) {
            productListDiv.innerHTML = '<p class="text-gray-500 col-span-full text-center">Belum ada produk untuk ditampilkan.</p>';
            return;
        }

        productListDiv.innerHTML = ''; 

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card p-6 rounded-2xl shadow-lg flex flex-col'; 
            
            productCard.innerHTML = `
                <img src="${product.gambar_preview}" alt="Preview ${product.judul}" class="w-full h-40 object-cover rounded-lg mb-4">
                <div class="flex-grow">
                    <h3 class="text-xl font-bold text-gray-800">${product.judul}</h3>
                    <p class="text-lg font-semibold text-orange-600 mb-2">
                        ${product.harga === 0 ? 'Gratis' : `Rp ${product.harga.toLocaleString('id-ID')}`}
                    </p>
                    <p class="text-sm text-gray-600">${product.deskripsi_singkat}</p>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <a href="templates/template-detail.html?product=${product.id}" target="_blank" rel="noopener noreferrer" class="btn-secondary block w-full text-center py-2 rounded-lg font-semibold text-sm">
                        Lihat Selengkapnya
                    </a>
                </div>
            `;
            
            productListDiv.appendChild(productCard);
        });

    } catch (error) {
        console.error('Gagal memuat produk:', error);
        document.getElementById('productList').innerHTML = '<p class="text-red-500 col-span-full text-center">Gagal memuat data produk. Periksa file produk.json dan konsol error (F12).</p>';
    }
}
