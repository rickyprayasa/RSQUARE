// Menunggu seluruh halaman dimuat sebelum menjalankan script apa pun
document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. FUNGSI UNTUK MENU MOBILE =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // ===== 2. FUNGSI UNTUK ANIMASI ON-SCROLL (FADE IN UP) =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan delay animasi berdasarkan urutan elemen jika kelasnya .animated-timeline-item
                if (entry.target.classList.contains('animated-timeline-item')) {
                    const items = Array.from(document.querySelectorAll('.animated-timeline-item'));
                    const index = items.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Hentikan observasi setelah animasi berjalan
            }
        });
    }, { threshold: 0.1 });

    // Terapkan ke semua elemen dengan kelas .animated-section atau .animated-timeline-item
    const animatedElements = document.querySelectorAll('.animated-section, .animated-timeline-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ===== 3. FUNGSI UNTUK TOMBOL SCROLL TO TOP (STABIL) =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
    
    // ===== 4. FUNGSI UNTUK FAQ ACCORDION =====
    const accordion = document.getElementById('faq-accordion');
    if (accordion) {
        const questions = accordion.querySelectorAll('.faq-question');
        questions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                const isOpen = answer.style.maxHeight;

                // Tutup semua jawaban lain
                questions.forEach(q => {
                    if (q !== question) {
                        q.nextElementSibling.style.maxHeight = null;
                        q.querySelector('.faq-icon').classList.remove('rotate-180');
                    }
                });
                
                // Buka atau tutup jawaban yang diklik
                if (isOpen) {
                    answer.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.add('rotate-180');
                }
            });
        });
    }

    // ===== 5. FUNGSI UNTUK EFEK SOROTAN KURSOR (ILLUMINATED GLASS & TOMBOL) =====
    // Targetkan semua elemen yang ingin punya efek ini
    const interactiveElements = document.querySelectorAll('.btn-primary:not(.btn-shiny), .btn-secondary, .card-container');
    interactiveElements.forEach(element => {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ===== 6. FUNGSI UNTUK FITUR ZOOM GAMBAR (LIGHTBOX) =====
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    if (zoomableImages.length > 0) {
        zoomableImages.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imageUrl = this.href;
                basicLightbox.create(`<img src="${imageUrl}" alt="">`).show();
            });
        });
    }

});
