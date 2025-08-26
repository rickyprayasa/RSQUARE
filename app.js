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

    // ===== KODE FINAL UNTUK Tumpukan Kartu (Stacked Card) =====
    const stackContainer = document.getElementById('featured-grid-container');

    if (stackContainer) {
        let cards = [];
        let isAnimating = false;

        const updateCardPositions = () => {
            cards.forEach((card) => {
                const index = parseInt(card.dataset.index);
                let newTransform = '';
                let newZIndex = cards.length - index;

                if (index === 0) {
                    newTransform = 'translateX(0) translateY(0) rotate(0deg) scale(1)';
                } else {
                    const xOffset = index * 50;
                    const yOffset = index * -15;
                    const scale = 1 - (index * 0.05);
                    const angle = index * 5;
                    newTransform = `translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale}) rotate(${angle}deg)`;
                }
                
                if (card.classList.contains('exiting')) {
                    newTransform = 'translateX(-150%) rotate(-20deg) scale(0.8)';
                }

                card.style.transform = newTransform;
                card.style.zIndex = newZIndex;
                card.style.opacity = (index < 3) ? '1' : '0';
            });
        };

        const initializeStack = () => {
            stackContainer.classList.add('card-stack');
            stackContainer.classList.remove('template-grid');

            cards = Array.from(stackContainer.children);
            cards.forEach((card, index) => {
                card.dataset.index = index;
                card.classList.remove('featured-card');
                card.classList.add('card-stack-item');
                
                const descriptionWrapper = card.querySelector('.featured-card-description-wrapper');
                if (descriptionWrapper) {
                    const contentDiv = card.querySelector('.featured-card-content');
                    while (descriptionWrapper.firstChild) {
                        contentDiv.appendChild(descriptionWrapper.firstChild);
                    }
                    descriptionWrapper.remove();
                }
            });
            updateCardPositions();
        };

        const cycleCards = () => {
            if (isAnimating || cards.length < 2) return;
            isAnimating = true;

            const topCard = cards.find(card => card.dataset.index === '0');
            if (topCard) {
                topCard.classList.add('exiting');
            }

            setTimeout(() => {
                cards.forEach(card => {
                    let currentIndex = parseInt(card.dataset.index);
                    card.dataset.index = (currentIndex - 1 + cards.length) % cards.length;
                });

                if (topCard) {
                    topCard.classList.remove('exiting');
                }
                updateCardPositions();
                
                setTimeout(() => {
                    isAnimating = false;
                }, 500);

            }, 50);
        };

        stackContainer.addEventListener('click', cycleCards);
        
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
    }
});
