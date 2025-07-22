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

// ===== KODE UNTUK FITUR ZOOM GAMBAR (LIGHTBOX) DI BANYAK GAMBAR =====

// Cari semua link yang punya kelas 'zoomable-image'
const zoomableImages = document.querySelectorAll('.zoomable-image');

// Jika ada, tambahkan event listener untuk setiap link tersebut
if (zoomableImages.length > 0) {
    zoomableImages.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah link membuka gambar di tab baru
            const imageUrl = this.href;
            basicLightbox.create(`
                <img src="${imageUrl}" alt="">
            `).show();
        });
    });
}

// ===== KODE UNTUK FAQ ACCORDION =====
document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.getElementById('faq-accordion');
    if (accordion) {
        const questions = accordion.querySelectorAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');

                // Tutup semua jawaban lain
                questions.forEach(q => {
                    if (q !== question) {
                        q.nextElementSibling.style.maxHeight = null;
                        q.querySelector('.faq-icon').classList.remove('rotate-180');
                    }
                });
                
                // Buka atau tutup jawaban yang diklik
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.add('rotate-180');
                }
            });
        });
    }
});

// ===== KODE BARU UNTUK SEMUA EFEK INTERAKTIF KURSOR =====
document.addEventListener('DOMContentLoaded', () => {
    
    // Target semua elemen yang ingin punya efek sorotan/cahaya
    // Dalam kasus ini: tombol primer, sekunder, DAN semua kartu
    const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .card');

    interactiveElements.forEach(element => {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Kode untuk animasi kursor custom Anda bisa tetap ada di bawah ini jika masih dipakai
    // ... kode .cursor-follower Anda ...
});

        // ===== KODE UNTUK TOMBOL SCROLL TO TOP =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
