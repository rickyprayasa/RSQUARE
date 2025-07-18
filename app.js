// Fungsi untuk menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


// Fungsi untuk Animasi On-Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.1 // Tampilkan saat 10% elemen terlihat
});

// Ambil semua elemen dengan class 'animated-section' dan amati
const animatedSections = document.querySelectorAll('.animated-section');
animatedSections.forEach(section => {
    observer.observe(section);
});

// ===== KODE UNTUK EFEK TOMBOL INTERAKTIF =====

// Pilih semua elemen yang memiliki kelas .btn-primary atau .btn-secondary
const interactiveButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

// Jalankan fungsi untuk setiap tombol yang ditemukan
interactiveButtons.forEach(button => {
    // Tambahkan event listener untuk 'mousemove' (saat kursor bergerak di atas tombol)
    button.addEventListener('mousemove', e => {
        // Ambil posisi dan ukuran tombol
        const rect = e.target.getBoundingClientRect();
        
        // Hitung posisi kursor di dalam tombol (x dan y)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set properti CSS (--mouse-x dan --mouse-y) dengan posisi kursor
        e.target.style.setProperty('--mouse-x', `${x}px`);
        e.target.style.setProperty('--mouse-y', `${y}px`);
    });
});
