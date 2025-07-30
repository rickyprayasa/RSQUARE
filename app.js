document.addEventListener('DOMContentLoaded', () => {

// ===== KODE UNTUK MENU MOBILE (dengan Animasi Halus) =====
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        // Cek jika menu sedang terbuka (punya max-height)
        if (mobileMenu.style.maxHeight) {
            mobileMenu.style.maxHeight = null; // Jika ya, tutup menu
        } else {
            // Jika tidak, buka menu setinggi kontennya
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
        }
    });
}

   // ===== 2. KODE UNTUK ANIMASI ON-SCROLL (Fade In & Staggered) =====
    const animatedElements = document.querySelectorAll('.animated-section, .timeline-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Cek jika elemen adalah bagian dari timeline untuk delay berurutan
                    if (entry.target.classList.contains('timeline-item')) {
                        entry.target.style.transitionDelay = `${index * 150}ms`;
                    }
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
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
                
                questions.forEach(q => {
                    if (q !== question) {
                        q.nextElementSibling.style.maxHeight = null;
                        q.querySelector('.faq-icon').classList.remove('rotate-180');
                    }
                });
                
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

    // ===== 5. FUNGSI UNTUK EFEK SOROTAN KURSOR (ILLUMINATED GLASS) =====
    const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .card-container');
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
    if (zoomableImages.length > 0 && typeof basicLightbox !== 'undefined') {
        zoomableImages.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imageUrl = this.href;
                basicLightbox.create(`<img src="${imageUrl}" alt="">`).show();
            });
        });
    }

});

    // Fungsi untuk animasi fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi berjalan
            }
        });
    }, {
        threshold: 0.1 // Memicu animasi saat 10% elemen terlihat
    });

    // Pilih semua elemen yang ingin dianimasikan
    const elementsToAnimate = document.querySelectorAll('.fade-in-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
