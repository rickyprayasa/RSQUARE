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
// ===== KODE UNTUK ANIMASI ON-SCROLL (VERSI FINAL YANG BERSIH) =====
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(element => {
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

    // ===== KODE BARU UNTUK Tumpukan Kartu (Stacked Card) =====
    const stackContainer = document.getElementById('featured-card-stack');

    if (stackContainer) {
        let cards = [];
        let isAnimating = false;

        // Fungsi untuk mengatur ulang posisi semua kartu berdasarkan data-index mereka
        const updateCardPositions = () => {
            cards.forEach((card) => {
                const index = parseInt(card.dataset.index);
                let newTransform = '';
                let newOpacity = 1;
                let newZIndex = cards.length - index;

                // Atur posisi dan skala kartu berdasarkan urutannya
                if (index === 0) { // Kartu paling depan
                    newTransform = 'translateY(0) scale(1)';
                } else if (index < 3) { // Kartu di belakang yang masih terlihat
                    newTransform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
                } else { // Kartu yang tersembunyi jauh di belakang
                    newTransform = `translateY(${2 * 20}px) scale(${1 - 2 * 0.05})`;
                    newOpacity = 0;
                }
                
                // Tambahkan animasi "keluar" jika kartu memiliki kelas 'exiting'
                if (card.classList.contains('exiting')) {
                    newTransform = 'translateX(150%) rotate(15deg) scale(0.8)';
                    newOpacity = 0;
                }

                card.style.transform = newTransform;
                card.style.opacity = newOpacity;
                card.style.zIndex = newZIndex;
            });
        };

        // Fungsi untuk menginisialisasi tumpukan saat kartu sudah dimuat
        const initializeStack = () => {
            // Ambil semua elemen anak dari container sebagai kartu
            cards = Array.from(stackContainer.children);
            cards.forEach((card, index) => {
                card.dataset.index = index;
                // Mengubah class agar sesuai dengan gaya CSS baru
                card.classList.remove('featured-card');
                card.classList.add('card-stack-item');
                // Salin isi konten dari wrapper deskripsi agar selalu terlihat
                const descriptionWrapper = card.querySelector('.featured-card-description-wrapper');
                if (descriptionWrapper) {
                    card.querySelector('.featured-card-content').innerHTML += descriptionWrapper.innerHTML;
                    descriptionWrapper.remove();
                }
            });
            updateCardPositions(); // Terapkan posisi awal
        };

        // Fungsi yang dijalankan saat tumpukan kartu diklik
        const cycleCards = () => {
            if (isAnimating || cards.length === 0) return; // Jangan lakukan apa-apa jika animasi sedang berjalan
            isAnimating = true;

            const topCard = cards.find(card => card.dataset.index === '0');
            topCard.classList.add('exiting'); // Beri kelas untuk animasi keluar

            // Perbarui data-index untuk semua kartu
            cards.forEach(card => {
                let currentIndex = parseInt(card.dataset.index);
                card.dataset.index = (currentIndex - 1 + cards.length) % cards.length;
            });

            updateCardPositions(); // Panggil update untuk memulai transisi

            // Setelah animasi selesai (500ms, sesuai durasi di CSS)
            setTimeout(() => {
                topCard.classList.remove('exiting');
                // Atur ulang posisi kartu yang keluar ke paling belakang
                updateCardPositions();
                isAnimating = false;
            }, 500);
        };

        stackContainer.addEventListener('click', cycleCards);
        
        // Karena kartu Anda dimuat oleh script lain (featured-templates.js),
        // kita perlu "mengamati" kapan kartu-kartu itu muncul di dalam container.
        const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    initializeStack(); // Jika kartu sudah ada, inisialisasi tumpukan
                    observer.disconnect(); // Berhenti mengamati setelah selesai
                    break;
                }
            }
        });

        // Mulai mengamati perubahan pada 'featured-card-stack'
        observer.observe(stackContainer, { childList: true });
    }

}); 
