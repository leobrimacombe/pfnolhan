/**
 * Gestion du menu responsive (hamburger) et de l'indicateur de page active.
 */
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navPrime = document.querySelector('.nav-prime');

    // Gestion de l'ouverture/fermeture du menu mobile
    if (hamburgerMenu && navPrime) {
        hamburgerMenu.addEventListener('click', function() {
            navPrime.classList.toggle('active');
        });

        // Fermeture automatique du menu lors du clic sur un lien
        const navLinks = navPrime.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navPrime.classList.remove('active');
            });
        });
    }

    // Réinitialisation du menu mobile si la fenêtre est agrandie au-delà du breakpoint (768px)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navPrime) {
            navPrime.classList.remove('active');
        }
    });

    /**
     * Mise en surbrillance automatique du lien de navigation correspondant à la page actuelle.
     * Gère également les sous-répertoires (ex: un projet reste lié à la section "Projets").
     */
    if (navPrime) {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const currentFile = pathParts[pathParts.length - 1] || 'index.html';
        const currentSubdir = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;

        navPrime.querySelectorAll('a').forEach(function(link) {
            const linkFile = link.getAttribute('href').split('/').pop();
            const linkSection = linkFile.replace('.html', '');

            // Si le lien correspond au fichier actuel ou à la section parente
            if (linkFile === currentFile || (currentSubdir && currentSubdir === linkSection)) {
                link.classList.add('active');
            }
        });
    }
});
