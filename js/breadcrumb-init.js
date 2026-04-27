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
 * Calculer le chemin relatif vers la racine du PORTFOLIO (pas du domaine)
 */
function getBasePath() {
    const path = window.location.pathname;
    
    // Trouver l'index du dossier "portfolioo"
    const portfolioIndex = path.indexOf('/portfolioo/');
    
    if (portfolioIndex === -1) {
        // Si on n'est pas dans portfolioo, retourner vide
        return '';
    }
    
    // Extraire la partie après /portfolioo/
    const pathAfterPortfolio = path.substring(portfolioIndex + '/portfolioo/'.length);
    
    // Compter le nombre de niveaux après portfolioo
    const levels = pathAfterPortfolio.split('/').filter(p => p && !p.endsWith('.html')).length;
    
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

    // Extraire uniquement les parties pertinentes du chemin (après portfolioo/)
    const pathParts = path.split('/').filter(p => p && p !== 'index.html' && p !== 'portfolioo');
    const basePath = getBasePath();

    const items = [];

    console.log('=== DEBUG BREADCRUMB ===');
    console.log('Path:', path);
    console.log('FileName:', fileName);
    console.log('PathParts:', pathParts);
    console.log('BasePath:', basePath);
    console.log('=======================');

    // Toujours ajouter l'accueil en premier
    items.push({
        label: 'Accueil',
        url: basePath + 'index.html',
        icon: 'home'
    });

    // Pages racine (dans le dossier portfolioo/)
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0].endsWith('.html'))) {
        if (fileName === 'index.html') {
            console.log('Items finaux:', items);
            return items;
        }

        if (fileName === 'projets.html') {
            items.push({
                label: 'Projets',
                url: 'projets.html',
                isActive: true
            });
            console.log('Items finaux:', items);
            return items;
        }

        if (fileName === 'exploration.html') {
            items.push({
                label: 'Explorations',
                url: 'exploration.html',
                isActive: true
            });
            console.log('Items finaux:', items);
            return items;
        }

        if (fileName === 'contact.html') {
            items.push({
                label: 'Contacts',
                url: 'contact.html',
                isActive: true
            });
            console.log('Items finaux:', items);
            return items;
        }
    }

    // Pages de projets (projets/XXX.html)
    if (pathParts.includes('projets') && fileName !== 'projets.html') {
        items.push({
            label: 'Projets',
            url: basePath + 'projets.html'
        });

        const projectName = getProjectName(fileName);
        items.push({
            label: projectName,
            isActive: true
        });
        console.log('Items finaux (projet):', items);
        return items;
    }

    // Pages en anglais
    if (pathParts[0] === 'en') {
        items[0].label = 'Home';

        // Pages de projets en anglais (en/projets/XXX.html)
        if (pathParts.length >= 2 && pathParts[1] === 'projets' && fileName !== 'projets.html') {
            items.push({
                label: 'Projects',
                url: basePath + 'projets.html'
            });
            const projectName = getProjectName(fileName);
            items.push({
                label: projectName,
                isActive: true
            });
            console.log('Items finaux (EN projet):', items);
            return items;
        }

        // Autres pages en anglais (en/XXX.html)
        const enPageName = getEnglishPageName(fileName);
        if (enPageName) {
            items.push({
                label: enPageName,
                isActive: true
            });
        }
        console.log('Items finaux (EN):', items);
        return items;
    }

    console.log('Items finaux (défaut):', items);
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