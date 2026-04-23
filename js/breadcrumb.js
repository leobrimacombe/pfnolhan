/**
 * COMPOSANT BREADCRUMB DYNAMIQUE
 * Générateur de fil d'Ariane en HTML/CSS/JS
 * 
 * Utilisation:
 * const breadcrumb = new BreadcrumbGenerator(selector, data, options);
 */

class BreadcrumbGenerator {
    /**
     * Constructeur du générateur de breadcrumb
     * @param {string} selector - Sélecteur CSS du conteneur
     * @param {Array} items - Tableau d'objets avec label, url, et isActive
     * @param {Object} options - Options de configuration
     */
    constructor(selector, items = [], options = {}) {
        this.container = document.querySelector(selector);
        
        if (!this.container) {
            console.error(`Conteneur breadcrumb non trouvé: ${selector}`);
            return;
        }

        // Configuration par défaut
        this.options = {
            variant: 'default', // default, bg, with-icons, compact, wide
            separator: '›', // '›', '/', '|', '→'
            withIcons: false,
            collapsible: false,
            maxItems: null, // null = afficher tous
            mobileMaxItems: 3,
            ariaLabel: 'Fil d\'Ariane',
            ...options
        };

        this.items = items;
        this.init();
    }

    /**
     * Initialiser le breadcrumb
     */
    init() {
        if (this.items.length === 0) {
            console.warn('Aucun élément fourni au breadcrumb');
            return;
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Rendre le breadcrumb
     */
    render() {
        const breadcrumbHTML = this.generateHTML();
        this.container.innerHTML = breadcrumbHTML;
    }

    /**
     * Générer le HTML du breadcrumb
     * @returns {string} HTML du breadcrumb
     */
    generateHTML() {
        const items = this.getVisibleItems();
        
        let html = `<nav class="breadcrumb breadcrumb--${this.options.variant}" aria-label="${this.options.ariaLabel}">`;
        html += '<ol class="breadcrumb__list">';

        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const isActive = item.isActive || isLast;
            
            html += this.generateItem(item, isActive, isLast, index, items.length);
        });

        html += '</ol></nav>';
        return html;
    }

    /**
     * Générer un élément de breadcrumb
     * @param {Object} item - Élément à générer
     * @param {boolean} isActive - Si c'est l'élément actif
     * @param {boolean} isLast - Si c'est le dernier élément
     * @param {number} index - Index de l'élément
     * @param {number} total - Nombre total d'éléments
     * @returns {string} HTML de l'élément
     */
    generateItem(item, isActive, isLast, index, total) {
        const activeClass = isActive ? ' breadcrumb__item--active' : '';
        const ariaAttr = isActive ? ' aria-current="page"' : '';
        
        let html = `<li class="breadcrumb__item${activeClass}"${ariaAttr}>`;

        if (isActive) {
            // Élément actif (pas de lien)
            html += this.generateContent(item);
        } else {
            // Lien cliquable
            html += `<a href="${item.url}" class="breadcrumb__link"${item.title ? ` title="${item.title}"` : ''}>`;
            html += this.generateContent(item);
            html += '</a>';
        }

        html += '</li>';
        return html;
    }

    /**
     * Générer le contenu d'un élément (avec icône optionnelle)
     * @param {Object} item - Élément
     * @returns {string} HTML du contenu
     */
    generateContent(item) {
        let content = '';

        // Ajouter l'icône si disponible
        if (item.icon) {
            content += this.generateIcon(item.icon);
        }

        content += item.label;
        return content;
    }

    /**
     * Générer une icône SVG
     * @param {string|Object} icon - Icône à générer
     * @returns {string} HTML de l'icône
     */
    generateIcon(icon) {
        const icons = {
            home: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
            folder: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
            file: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/></svg>',
            gallery: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
            settings: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.34c.15-.12.19-.35.1-.54l-1.63-2.83c-.12-.22-.37-.29-.59-.22l-2.03.81c-.42-.32-.86-.58-1.35-.78l-.31-2.15c-.05-.24-.24-.41-.48-.41h-3.26c-.24 0-.43.17-.49.41l-.31 2.15c-.48.2-.93.46-1.35.78l-2.03-.81c-.22-.09-.47-.02-.59.22L2.74 8.87c-.09.19-.05.42.1.54l1.72 1.34c-.05.3-.07.61-.07.94 0 .33.02.64.07.94l-1.72 1.34c-.15.12-.19.35-.1.54l1.63 2.83c.12.22.37.29.59.22l2.03-.81c.42.32.86.58 1.35.78l.31 2.15c.05.24.24.41.48.41h3.26c.24 0 .43-.17.49-.41l.31-2.15c.48-.2.93-.46 1.35-.78l2.03.81c.22.09.47.02.59-.22l1.63-2.83c.09-.19.05-.42-.1-.54l-1.72-1.34zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
            user: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
            search: '<svg class="breadcrumb__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'
        };

        // Si c'est un string, chercher l'icône par nom
        if (typeof icon === 'string') {
            return icons[icon] ? icons[icon] : '';
        }

        // Si c'est du HTML personnalisé
        return icon;
    }

    /**
     * Obtenir les éléments visibles selon les paramètres
     * @returns {Array} Éléments visibles
     */
    getVisibleItems() {
        let items = [...this.items];
        const maxItems = this.options.maxItems;
        const isMobile = window.innerWidth < 768;
        const mobileMax = this.options.mobileMaxItems;

        // Limiter le nombre d'éléments sur mobile
        if (isMobile && items.length > mobileMax) {
            if (mobileMax >= 2) {
                const first = items[0];
                const last = items[items.length - 1];
                items = [first, last];
            }
        }

        // Appliquer la limite générale
        if (maxItems && items.length > maxItems) {
            items = items.slice(0, maxItems);
        }

        return items;
    }

    /**
     * Attacher les écouteurs d'événements
     */
    attachEventListeners() {
        this.container.addEventListener('click', (e) => this.handleClick(e));

        // Rendre responsif
        window.addEventListener('resize', () => {
            this.render();
        });
    }

    /**
     * Gérer les clics sur les liens
     * @param {Event} e - Événement du clic
     */
    handleClick(e) {
        const link = e.target.closest('.breadcrumb__link');
        
        if (link && link.href !== '#') {
            // Vous pouvez ajouter une logique personnalisée ici
            // Par exemple: empêcher le comportement par défaut et charger via AJAX
            // e.preventDefault();
            // this.loadPage(link.href);
        }
    }

    /**
     * Mettre à jour les données du breadcrumb
     * @param {Array} newItems - Nouveaux éléments
     */
    update(newItems) {
        this.items = newItems;
        this.render();
    }

    /**
     * Ajouter un élément
     * @param {Object} item - Élément à ajouter
     */
    addItem(item) {
        this.items.push(item);
        this.render();
    }

    /**
     * Supprimer un élément par index
     * @param {number} index - Index de l'élément
     */
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.render();
        }
    }

    /**
     * Générer un breadcrumb à partir du chemin d'URL actuel
     * @param {string} baseUrl - URL de base
     * @returns {Array} Tableau d'éléments
     */
    static fromCurrentPath(baseUrl = '/') {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        
        const items = [{
            label: 'Accueil',
            url: baseUrl,
            icon: 'home'
        }];

        let currentPath = baseUrl;
        segments.forEach((segment, index) => {
            currentPath = `${currentPath}${segment}/`;
            const isLast = index === segments.length - 1;
            
            items.push({
                label: this.formatSegment(segment),
                url: isLast ? '#' : currentPath,
                isActive: isLast
            });
        });

        return items;
    }

    /**
     * Formater un segment d'URL
     * @param {string} segment - Segment à formater
     * @returns {string} Segment formaté
     */
    static formatSegment(segment) {
        return segment
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

/**
 * Utilitaire: Créer rapidement un breadcrumb simple
 */
function createSimpleBreadcrumb(selector, items) {
    return new BreadcrumbGenerator(selector, items);
}

/**
 * Utilitaire: Créer un breadcrumb à partir du chemin URL
 */
function createBreadcrumbFromURL(selector, baseUrl = '/') {
    const items = BreadcrumbGenerator.fromCurrentPath(baseUrl);
    return new BreadcrumbGenerator(selector, items);
}

// Export pour utilisation en module (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreadcrumbGenerator;
}

// Export vers l'objet global window pour utilisation en navigateur
if (typeof window !== 'undefined') {
    window.BreadcrumbGenerator = BreadcrumbGenerator;
}
