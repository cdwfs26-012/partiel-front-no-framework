/* ==========================================================================
   1. VARIABLES GLOBALES & SÉLECTEURS
   ========================================================================== */
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.getElementById('main-nav');
const header = document.querySelector('header');
const installContainer = document.getElementById('install-container');
const installButton = document.getElementById('install-button');
let deferredPrompt;

/* ==========================================================================
   2. GESTION DU MENU NAVIGATION (BURGER)
   ========================================================================== */
const toggleMenu = (forceClose = false) => {
    const isExpanded = forceClose ? true : burgerMenu.getAttribute('aria-expanded') === 'true';

    // Si on force la fermeture ou si c'était déjà ouvert
    if (isExpanded || forceClose) {
        burgerMenu.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        burgerMenu.setAttribute('aria-expanded', 'true');
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

// Événements du menu
burgerMenu.addEventListener('click', () => toggleMenu());

// Fermeture au clic sur lien ou en dehors du menu
document.addEventListener('click', (e) => {
    const isLink = e.target.closest('nav a');
    const isOutside = !nav.contains(e.target) && !burgerMenu.contains(e.target);

    if ((isLink || isOutside) && nav.classList.contains('active')) {
        toggleMenu(true);
    }
});

/* ==========================================================================
   3. EFFETS AU SCROLL (HEADER & ANCRES)
   ========================================================================== */

// Header sticky avec ombre dynamique
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scroll optimisé pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ==========================================================================
   4. ANIMATIONS D'APPARITION (INTERSECTION OBSERVER)
   ========================================================================== */
const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            // Pré-style pour l'animation
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            // Déclenchement de l'animation
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);

            revealOnScroll.unobserve(el);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

// Application aux cartes
document.querySelectorAll('.service-card, .tarif-card, .prestation-item').forEach(card => {
    revealOnScroll.observe(card);
});

/* ==========================================================================
   5. INSTALLATION PWA
   ========================================================================== */
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (installContainer) {
        installContainer.style.display = 'block';

        installButton.addEventListener('click', () => {
            installContainer.style.display = 'none';
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === 'accepted' ? 'PWA installée' : 'Installation refusée');
                deferredPrompt = null;
            });
        });
    }
});

window.addEventListener('appinstalled', () => {
    if (installContainer) installContainer.style.display = 'none';
    console.log('Application installée avec succès !');
});