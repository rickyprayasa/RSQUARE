document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    const totalCards = cards.length;
    // Sudut rotasi antar kartu. Sesuaikan untuk mengubah jarak.
    const theta = 360 / totalCards;

    // Fungsi untuk mengatur posisi 3D setiap kartu
    function setupCarousel() {
        const radius = Math.round((carousel.offsetWidth / 2) / Math.tan(Math.PI / totalCards));
        
        cards.forEach((card, index) => {
            const angle = theta * index;
            // Atur posisi awal setiap kartu dalam lingkaran 3D
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }

    // Fungsi untuk memutar carousel
    function rotateCarousel() {
        const angle = theta * currentIndex * -1;
        // Putar seluruh elemen .carousel
        carousel.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
    }

    // Event Listener untuk tombol
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        rotateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        rotateCarousel();
    });

    // Panggil fungsi setup saat halaman dimuat
    setupCarousel();
    // Inisialisasi radius agar bisa diakses fungsi rotate
    let radius = Math.round((carousel.offsetWidth / 2) / Math.tan(Math.PI / totalCards));
});
