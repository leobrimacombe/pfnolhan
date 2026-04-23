// Menu Hamburger Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navPrime = document.querySelector('.nav-prime');

    if (hamburgerMenu && navPrime) {
        hamburgerMenu.addEventListener('click', function() {
            navPrime.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = navPrime.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navPrime.classList.remove('active');
            });
        });
    }

    // Fermer le menu mobile quand on redimensionne l'écran
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navPrime) {
            navPrime.classList.remove('active');
        }
    });
});
