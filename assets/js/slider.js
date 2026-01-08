document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    let index = 0;
    const itemsVisible = 4;
    const gap = 32;

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    function getStepWidth() {
        // Calcule la largeur d'une carte + le gap
        return cards[0].offsetWidth + gap;
    }

    function updateCarousel(smooth = true) {
        const step = getStepWidth();
        track.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${index * step}px)`;
    }

    function next() {
        index++;
        updateCarousel();
        if (index >= cards.length) {
            setTimeout(() => {
                index = 0;
                updateCarousel(false);
            }, 500);
        }
    }
    // Autoplay
    let autoplay = setInterval(next, 3000);

    const container = document.querySelector('.tarifs-carousel');
    container.addEventListener('mouseenter', () => clearInterval(autoplay));
    container.addEventListener('mouseleave', () => autoplay = setInterval(next, 3000));

    window.addEventListener('resize', () => updateCarousel(false));
});