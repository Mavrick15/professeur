// Script de build pour assembler les composants en un seul fichier HTML
const fs = require('fs');
const path = require('path');

// Lire le template principal (utiliser index.template.html si disponible, sinon index.html)
const templatePath = fs.existsSync(path.join(__dirname, 'index.template.html'))
  ? path.join(__dirname, 'index.template.html')
  : path.join(__dirname, 'index.html');
let html = fs.readFileSync(templatePath, 'utf-8');

// Liste des composants à inclure
const components = [
  { name: 'header', marker: '<!-- Header Container -->' },
  { name: 'hero', marker: '<!-- Hero Container -->' },
  { name: 'stats', marker: '<!-- Statistics Container -->' },
  { name: 'about', marker: '<!-- About Container -->' },
  { name: 'services', marker: '<!-- Services Container -->' },
  { name: 'blog', marker: '<!-- Blog Container -->' },
  { name: 'expertise', marker: '<!-- Expertise Container -->' },
  { name: 'contact', marker: '<!-- Contact Container -->' },
  { name: 'footer', marker: '<!-- Footer Container -->' },
];

// Remplacer chaque marqueur par le contenu du composant
components.forEach(({ name, marker }) => {
  const componentPath = path.join(__dirname, 'components', `${name}.html`);
  if (fs.existsSync(componentPath)) {
    let componentContent = fs.readFileSync(componentPath, 'utf-8');
    // Supprimer les scripts dhws-dataInjector des composants (ils seront ajoutés à la fin)
    componentContent = componentContent.replace(
      /<script id="dhws-dataInjector"[^>]*><\/script>\s*/g,
      ''
    );
    // Remplacer le conteneur vide par le contenu du composant
    // Chercher le pattern avec ou sans commentaire
    const patterns = [
      new RegExp(`<!-- ${name.charAt(0).toUpperCase() + name.slice(1)} Container -->\\s*<div id="${name}-container"></div>`, 'g'),
      new RegExp(`<div id="${name}-container"></div>`, 'g'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(html)) {
        html = html.replace(pattern, componentContent);
        break;
      }
    }
    console.log(`✓ ${name}.html intégré`);
  } else {
    console.warn(`⚠ ${name}.html non trouvé`);
  }
});

// Supprimer les scripts de chargement dynamique et garder seulement main.js
html = html.replace(
  /<script src="js\/loader\.js"><\/script>\s*/g,
  ''
);

// Supprimer tous les scripts dhws-dataInjector sauf le dernier
const dhwsScriptRegex = /<script id="dhws-dataInjector"[^>]*><\/script>/g;
const matches = html.match(dhwsScriptRegex);
if (matches && matches.length > 0) {
  // Garder seulement le dernier
  const lastScript = matches[matches.length - 1];
  html = html.replace(dhwsScriptRegex, '');
  // Réinsérer le dernier script avant la fermeture du body
  html = html.replace('</body>', `    ${lastScript}\n  </body>`);
}

// Supprimer les commentaires de conteneurs restants
html = html.replace(/<!-- \w+ Container -->\s*/g, '');

// Écrire le fichier final
const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');
console.log('\n✅ Build terminé ! index.html assemblé avec succès.');
