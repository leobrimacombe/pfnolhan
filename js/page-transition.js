(function () {
    'use strict';

    const KEY = '__pageTransition';
    const SELECTOR = '.card-link, a.btn[href]';

    // === Reveal (page entrante) ===
    if (sessionStorage.getItem(KEY)) {
        sessionStorage.removeItem(KEY);
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay reveal';
        document.documentElement.appendChild(overlay);

        const fadeOut = () => {
            requestAnimationFrame(() => {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 550);
            });
        };

        if (document.readyState === 'complete') {
            fadeOut();
        } else {
            window.addEventListener('load', fadeOut);
        }
    }

    // === Morph sortant (clic) ===
    let busy = false;

    function handleClick(e) {
        if (busy) { e.preventDefault(); return; }

        const link = e.currentTarget;
        const href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        let url;
        try {
            url = new URL(href, location.href);
        } catch (_) { return; }
        if (url.origin !== location.origin) return;

        e.preventDefault();
        busy = true;

        const rect = link.getBoundingClientRect();
        const radius = getComputedStyle(link).borderRadius || '50px';

        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay morphing';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.borderRadius = radius;
        document.body.appendChild(overlay);

        // Reflow pour partir de la bonne valeur
        void overlay.offsetWidth;

        // Phase 1 : largeur
        overlay.style.left = '0px';
        overlay.style.width = '100vw';

        // Phase 2 : hauteur
        setTimeout(() => {
            overlay.style.top = '0px';
            overlay.style.height = '100vh';
            overlay.style.borderRadius = '0px';
        }, 280);

        sessionStorage.setItem(KEY, '1');

        setTimeout(() => {
            location.href = href;
        }, 680);
    }

    function bind() {
        document.querySelectorAll(SELECTOR).forEach(link => {
            if (link.dataset.transitionBound) return;
            link.dataset.transitionBound = '1';
            link.addEventListener('click', handleClick);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
