document.addEventListener('DOMContentLoaded', function() {
    // Menu Hamburger Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navPrime = document.querySelector('.nav-prime');

    if (hamburgerMenu && navPrime) {
        hamburgerMenu.addEventListener('click', function() {
            navPrime.classList.toggle('active');
        });

        const navLinks = navPrime.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navPrime.classList.remove('active');
            });
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navPrime) {
            navPrime.classList.remove('active');
        }
    });

});
