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

// ===== KODE BARU & PERBAIKAN UNTUK Tumpukan Kartu (Stacked Card) =====
const stackContainer = document.getElementById('featured-grid-container'); // 1. Cari ID yang benar

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
        // 2. Tambahkan class yang diperlukan ke container secara dinamis
        stackContainer.classList.add('card-stack');
        stackContainer.classList.remove('template-grid'); // Hapus class grid lama jika ada

        cards = Array.from(stackContainer.children);
        cards.forEach((card, index) => {
            card.dataset.index = index;
            card.classList.remove('featured-card'); // Hapus class lama dari kartu
            card.classList.add('card-stack-item'); // Tambah class baru untuk kartu
            
            // Logika untuk memindahkan konten dari wrapper agar selalu terlihat
            const descriptionWrapper = card.querySelector('.featured-card-description-wrapper');
            if (descriptionWrapper) {
                const contentDiv = card.querySelector('.featured-card-content');
                // Pindahkan semua elemen dari dalam wrapper ke contentDiv
                while (descriptionWrapper.firstChild) {
                    contentDiv.appendChild(descriptionWrapper.firstChild);
                }
                descriptionWrapper.remove(); // Hapus wrapper yang sudah kosong
            }
        });
        updateCardPositions(); // Terapkan posisi awal
    };

    // 3. Fungsi cycleCards yang sudah diperbaiki
    const cycleCards = () => {
        if (isAnimating || cards.length === 0) return;
        isAnimating = true;

        const topCard = cards.find(card => card.dataset.index === '0');
        if (topCard) {
            topCard.classList.add('exiting');
        }

        cards.forEach(card => {
            let currentIndex = parseInt(card.dataset.index);
            card.dataset.index = (currentIndex - 1 + cards.length) % cards.length;
        });

        updateCardPositions();

        setTimeout(() => {
            if (topCard) {
                topCard.classList.remove('exiting');
            }
            // Tidak perlu memindahkan elemen DOM, cukup update posisinya
            updateCardPositions();
            isAnimating = false;
        }, 500); // Harus sama dengan durasi transisi di CSS
    };

    stackContainer.addEventListener('click', cycleCards);
    
    // MutationObserver tetap digunakan untuk mendeteksi kapan kartu selesai dimuat
    const observer = new MutationObserver((mutationsList) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                initializeStack();
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(stackContainer, { childList: true });
}
});
