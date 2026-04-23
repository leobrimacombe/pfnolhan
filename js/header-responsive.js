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

    // Indicateur de page active dans la nav
    if (navPrime) {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const currentFile = pathParts[pathParts.length - 1] || 'index.html';
        // Sous-répertoire courant (ex: "projets" pour projets/anglemort.html)
        const currentSubdir = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;

        navPrime.querySelectorAll('a').forEach(function(link) {
            const linkFile = link.getAttribute('href').split('/').pop();
            const linkSection = linkFile.replace('.html', '');

            if (linkFile === currentFile || (currentSubdir && currentSubdir === linkSection)) {
                link.classList.add('active');
            }
        });
    }
});
