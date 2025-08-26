document.addEventListener('DOMContentLoaded', () => {

    // ===== KODE UNTUK MENU MOBILE (dengan Animasi Halus) =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            if (mobileMenu.style.maxHeight) {
                mobileMenu.style.maxHeight = null;
            } else {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
            }
        });
    }

    // ===== KODE UNTUK ANIMASI ON-SCROLL =====
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
    
    // ===== FUNGSI UNTUK TOMBOL SCROLL TO TOP =====
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
    
    // ===== FUNGSI UNTUK FAQ ACCORDION =====
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

    // ===== FUNGSI UNTUK EFEK SOROTAN KURSOR =====
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

    // =================================================================
    // === FUNGSI TUMPUKAN KARTU (VERSI INTERAKTIF & RESPONSIF) ===
    // =================================================================
    const setupCardStack = (containerId) => {
        const stackContainer = document.getElementById(containerId);
        if (!stackContainer) return;

        let cards = [];
        let isAnimating = false;
        
        const setContainerHeight = () => {
            const frontCard = cards.find(card => card.dataset.index === '0');
            if (frontCard) {
                const isMobile = window.innerWidth < 768;

                if (isMobile) {
                    const yOffsetStep = 50; 
                    const visibleBehindCount = 2; 
                    const totalHeight = frontCard.scrollHeight + (yOffsetStep * visibleBehindCount);
                    stackContainer.style.height = `${totalHeight}px`;
                } else {
                    stackContainer.style.height = `${frontCard.scrollHeight}px`;
                }
            }
        };

        const updateCardPositions = () => {
            const isMobile = window.innerWidth < 768;
            
            cards.forEach((card) => {
                const index = parseInt(card.dataset.index);
                let newTransform = '';
                let newZIndex = cards.length - index;

                if (isMobile) {
                    const yOffsetStep = 50;
                    const scaleStep = 0.05;
                    const maxVisibleCards = 3;

                    if (index < maxVisibleCards) {
                        const yOffset = (maxVisibleCards - 1 - index) * yOffsetStep;
                        const scale = 1 - (index * scaleStep);
                        newTransform = `translateX(0px) translateY(${yOffset}px) scale(${scale}) rotate(0deg)`;
                    } else {
                        const yOffset = (maxVisibleCards - 1) * yOffsetStep;
                        const scale = 1 - ((maxVisibleCards - 1) * scaleStep);
                        newTransform = `translateX(0px) translateY(${yOffset}px) scale(${scale}) rotate(0deg)`;
                    }
                } else {
                    if (index === 0) {
                        newTransform = 'translateX(0) translateY(0) rotate(0deg) scale(1)';
                    } else {
                        const xOffset = index * 50;
                        const yOffset = index * -15;
                        const scale = 1 - (index * 0.05);
                        const angle = index * 5;
                        newTransform = `translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale}) rotate(${angle}deg)`;
                    }
                }

                if (card.classList.contains('exiting')) {
                    newTransform = 'translateX(150%) rotate(20deg) scale(0.8)';
                }

                card.style.transform = newTransform;
                card.style.zIndex = newZIndex;
                card.style.opacity = index < 3 ? '1' : '0';
            });
            setContainerHeight();
        };

        // --- FUNGSI BARU: Untuk memindahkan kartu yang dipilih ke depan ---
        const bringCardToFront = (clickedCard) => {
            if (isAnimating || clickedCard.dataset.index === '0') return;
            isAnimating = true;

            const clickedIndex = parseInt(clickedCard.dataset.index);

            // Pindahkan kartu yang diklik ke awal array
            const [movedCard] = cards.splice(clickedIndex, 1);
            cards.unshift(movedCard);

            // Atur ulang semua index data
            cards.forEach((card, newIndex) => {
                card.dataset.index = newIndex;
            });

            updateCardPositions();
            
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Durasi harus cocok dengan transisi CSS
        };
        
        const initializeStack = () => {
            stackContainer.classList.add('card-stack');
            stackContainer.classList.remove('template-grid');
            
            cards = Array.from(stackContainer.children);
            cards.forEach((card, index) => {
                card.dataset.index = index;
                card.classList.remove('featured-card');
                card.classList.add('card-stack-item');
                
                // --- PERUBAHAN DI SINI: Event click ditambahkan ke setiap kartu ---
                card.addEventListener('click', () => {
                    bringCardToFront(card);
                });

                const templateButton = card.querySelector('a'); 
                if (templateButton) {
                    templateButton.addEventListener('click', (event) => {
                        // Mencegah event "naik" ke kartu saat tombol di dalam kartu diklik
                        event.stopPropagation();
                    });
                }
            });

            updateCardPositions();
        };

        // Hapus event listener lama dari kontainer
        // stackContainer.removeEventListener('click', cycleCards);

        window.addEventListener('resize', updateCardPositions);

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    initializeStack();
                    observer.disconnect();
                    break;
                }
            }
        });

        observer.observe(stackContainer, { childList: true });
    };

    // --- PANGGIL FUNGSI UNTUK SETIAP BAGIAN ---
    setupCardStack('featured-grid-container'); // Untuk produk unggulan
    setupCardStack('free-grid-container');      // Untuk produk gratis
});
