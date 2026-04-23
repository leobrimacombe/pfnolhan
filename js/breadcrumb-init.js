/**
 * Initialisation du Breadcrumb pour le portfolio Nolhan Desseigne
 * Génère automatiquement le fil d'Ariane selon la structure du site
 */

document.addEventListener('DOMContentLoaded', function () {
    // Créer le conteneur du breadcrumb s'il n'existe pas
    let breadcrumbContainer = document.getElementById('breadcrumb-container');

    if (!breadcrumbContainer) {
        // Créer après le header
        const header = document.querySelector('header');
        if (header) {
            breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.id = 'breadcrumb-container';
            breadcrumbContainer.style.marginTop = '0';
            header.insertAdjacentElement('afterend', breadcrumbContainer);
        }
    }

    if (!breadcrumbContainer) return;

    // Récupérer les données du breadcrumb depuis l'URL
    const breadcrumbData = generateBreadcrumbFromURL();

    // Initialiser le breadcrumb
    if (window.BreadcrumbGenerator && breadcrumbData.length > 0) {
        new BreadcrumbGenerator('#breadcrumb-container', breadcrumbData, {
            variant: 'bg',
            mobileMaxItems: 3
        });
    }
});

/**
 * Calculer le chemin relatif vers la racine du PORTFOLIO
 */
function getBasePath() {
    const path = window.location.pathname;
    let levels = 0;
    if (path.includes('/projets/')) levels++;
    if (path.includes('/en/')) levels++;
    
    if (levels === 0) return '';
    return '../'.repeat(levels);
}

/**
 * Générer les données du breadcrumb selon la structure du site
 */
function generateBreadcrumbFromURL() {
    const path = window.location.pathname;
    let fileName = path.split('/').pop();

    // Gérer le cas où fileName est vide (racine du site)
    if (!fileName || fileName === '') {
        fileName = 'index.html';
    }

    const basePath = getBasePath();
    const isProjetsFolder = path.includes('/projets/');
    const isEnFolder = path.includes('/en/');

    const items = [];

    // Toujours ajouter l'accueil en premier
    items.push({
        label: isEnFolder ? 'Home' : 'Accueil',
        url: basePath + 'index.html',
        icon: 'home'
    });

    // Si on est à la racine de l'accueil
    if (fileName === 'index.html' && !isProjetsFolder) {
        return items;
    }

    // Pages de projets (projets/XXX.html)
    if (isProjetsFolder) {
        items.push({
            label: isEnFolder ? 'Projects' : 'Projets',
            url: basePath + 'projets.html'
        });

        const projectName = getProjectName(fileName);
        items.push({
            label: projectName,
            isActive: true
        });
        return items;
    }

    // Pages en anglais (racine)
    if (isEnFolder) {
        const enPageName = getEnglishPageName(fileName);
        if (enPageName && fileName !== 'index.html') {
            items.push({
                label: enPageName,
                isActive: true
            });
        }
        return items;
    }

    // Pages racine françaises
    if (fileName === 'projets.html') {
        items.push({
            label: 'Projets',
            url: 'projets.html',
            isActive: true
        });
        return items;
    }

    if (fileName === 'exploration.html') {
        items.push({
            label: 'Explorations',
            url: 'exploration.html',
            isActive: true
        });
        return items;
    }

    if (fileName === 'contact.html') {
        items.push({
            label: 'Contacts',
            url: 'contact.html',
            isActive: true
        });
        return items;
    }

    return items;
}

/**
 * Obtenir le nom d'un projet formaté
 */
function getProjectName(fileName) {
    const projectMap = {
        'star3D.html': 'Animation 3D Star Wars',
        'europe_cuej.html': 'Europe CUEJ',
        'flextory.html': 'Flextory',
        'jaws_generique.html': 'Générique JAWS',
        'multicam.html': 'Multicam',
        'nautile_club.html': 'Nautile Club',
        'nikkonmo.html': 'Nikkonmo',
        'packshot.html': 'Packshot',
        'stage_voyages.html': 'Stage Voyages',
        'stage_wolfdog.html': 'Stage Wolfdog',
        'teaser_acc.html': 'Teaser ACC'
    };

    const name = projectMap[fileName];
    if (name) return name;

    // Fallback: convertir le nom du fichier
    return fileName
        .replace('.html', '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Obtenir le nom d'une page anglaise
 */
function getEnglishPageName(fileName) {
    const pageMap = {
        'index.html': 'Home',
        'contact.html': 'Contact',
        'exploration.html': 'Explorations',
        'projets.html': 'Projects'
    };
    return pageMap[fileName] || null;
}