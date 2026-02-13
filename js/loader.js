// ============================================
// Component Loader
// ============================================

/**
 * Charge un composant HTML et l'insère dans le DOM
 * @param {string} componentPath - Chemin vers le fichier composant
 * @param {string} targetSelector - Sélecteur CSS de l'élément cible
 * @returns {Promise<void>}
 */
async function loadComponent(componentPath, targetSelector) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
    }
    const html = await response.text();
    const target = document.querySelector(targetSelector);
    if (target) {
      target.innerHTML = html;
    } else {
      console.warn(`Target element not found: ${targetSelector}`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

/**
 * Charge tous les composants de la page
 */
async function loadAllComponents() {
  const components = [
    { path: 'components/header.html', target: '#header-container' },
    { path: 'components/hero.html', target: '#hero-container' },
    { path: 'components/stats.html', target: '#stats-container' },
    { path: 'components/about.html', target: '#about-container' },
    { path: 'components/services.html', target: '#services-container' },
    { path: 'components/blog.html', target: '#blog-container' },
    { path: 'components/expertise.html', target: '#expertise-container' },
    { path: 'components/contact.html', target: '#contact-container' },
    { path: 'components/footer.html', target: '#footer-container' },
  ];

  // Charger tous les composants en parallèle
  await Promise.all(
    components.map((comp) => loadComponent(comp.path, comp.target))
  );

  // Réinitialiser les scripts après le chargement des composants
  setTimeout(() => {
    // Réinitialiser toutes les fonctions depuis main.js
    if (typeof window.initAllScripts === 'function') {
      window.initAllScripts();
    } else {
      // Fallback si main.js n'est pas encore chargé
      setTimeout(() => {
        if (typeof window.initAllScripts === 'function') {
          window.initAllScripts();
        }
      }, 500);
    }
  }, 300);
}

// Charger les composants au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
  loadAllComponents();
}
