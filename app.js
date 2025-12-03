document.addEventListener('DOMContentLoaded', () => {

    // ===== KODE UNTUK MENU MOBILE (dengan Animasi Halus) =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            if (mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px') {
                mobileMenu.style.maxHeight = '0px';
            } else {
                // Batasi max-height ke 300px untuk mencegah overlap
                const scrollHeight = Math.min(mobileMenu.scrollHeight, 300);
                mobileMenu.style.maxHeight = scrollHeight + "px";
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
                card.style.zIndex = cards.length - index;
                card.style.opacity = index < 3 ? '1' : '0';
                card.classList.remove('exiting');

                if (isMobile) {
                    const yOffsetStep = 50;
                    const scaleStep = 0.05;
                    const maxVisibleCards = 3;
                    let yOffset = 0, scale = 1;

                    if (index < maxVisibleCards) {
                        yOffset = (maxVisibleCards - 1 - index) * yOffsetStep;
                        scale = 1 - (index * scaleStep);
                    } else {
                        yOffset = (maxVisibleCards - 1) * yOffsetStep;
                        scale = 1 - ((maxVisibleCards - 1) * scaleStep);
                    }
                    card.style.setProperty('--x-offset', '0px');
                    card.style.setProperty('--y-offset', `${yOffset}px`);
                    card.style.setProperty('--scale', scale);
                    card.style.setProperty('--angle', '0deg');
                } else {
                    let xOffset = 0, yOffset = 0, scale = 1, angle = 0;
                    if (index > 0) {
                        xOffset = index * 50;
                        yOffset = index * -15;
                        scale = 1 - (index * 0.05);
                        angle = index * 5;
                    }
                    card.style.setProperty('--x-offset', `${xOffset}px`);
                    card.style.setProperty('--y-offset', `${yOffset}px`);
                    card.style.setProperty('--scale', scale);
                    card.style.setProperty('--angle', `${angle}deg`);
                }
            });
            setContainerHeight();
        };

        const cycleCardToBack = () => {
            const frontCard = cards.shift();
            frontCard.classList.add('exiting');

            setTimeout(() => {
                cards.push(frontCard);
                cards.forEach((card, newIndex) => card.dataset.index = newIndex);
                updateCardPositions();
            }, 50);
        };

        const bringCardToFront = (clickedCard) => {
            const clickedIndex = parseInt(clickedCard.dataset.index);
            const [movedCard] = cards.splice(clickedIndex, 1);
            cards.unshift(movedCard);
            cards.forEach((card, newIndex) => card.dataset.index = newIndex);
            updateCardPositions();
        };
        
        const initializeStack = () => {
            stackContainer.classList.add('card-stack');
            stackContainer.classList.remove('template-grid');
            
            cards = Array.from(stackContainer.children);
            cards.forEach((card, index) => {
                card.dataset.index = index;
                card.classList.add('card-stack-item');
                
                card.addEventListener('click', () => {
                    if (isAnimating) return;
                    isAnimating = true;

                    if (card.dataset.index === '0') {
                        cycleCardToBack();
                    } else {
                        bringCardToFront(card);
                    }

                    setTimeout(() => { isAnimating = false; }, 500);
                });

                const templateButton = card.querySelector('a'); 
                if (templateButton) {
                    templateButton.addEventListener('click', (event) => event.stopPropagation());
                }
            });
            updateCardPositions();
        };

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
    setupCardStack('featured-grid-container');
    setupCardStack('free-grid-container');
});
