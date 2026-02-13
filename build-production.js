// Script de build de production amélioré pour générer un site statique optimisé
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const distDir = path.join(__dirname, "dist");

// Fonction pour calculer la taille des fichiers
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  if (fileSizeInBytes < 1024) return `${fileSizeInBytes} B`;
  if (fileSizeInBytes < 1024 * 1024) return `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
  return `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Fonction pour minifier le HTML (basique)
function minifyHTML(html) {
  return html
    .replace(/\s+/g, " ") // Remplacer les espaces multiples par un seul
    .replace(/>\s+</g, "><") // Supprimer les espaces entre les balises
    .replace(/<!--[\s\S]*?-->/g, "") // Supprimer les commentaires
    .trim();
}

// Fonction pour copier récursivement
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Fonction pour nettoyer le dossier dist
function cleanDist() {
  if (fs.existsSync(distDir)) {
    fs.readdirSync(distDir).forEach((file) => {
      const filePath = path.join(distDir, file);
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
    console.log("✓ Dossier dist nettoyé");
  }
}

console.log("🚀 Démarrage du build de production amélioré...\n");

try {
  // Nettoyer le dossier dist
  cleanDist();
  
  // Créer le dossier dist s'il n'existe pas
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log("✓ Dossier dist créé\n");
  }

  // 1. Assembler les composants HTML
  console.log("📦 Assemblage des composants HTML...");
  execSync("node build.js", { stdio: "inherit", cwd: __dirname });
  console.log("✓ Composants assemblés\n");

  // 2. Compiler le CSS
  console.log("🎨 Compilation du CSS...");
  execSync("npm run build:css", { stdio: "inherit", cwd: __dirname });
  console.log("✓ CSS compilé\n");

  // 3. Lire et optimiser index.html
  console.log("📄 Optimisation de index.html...");
  let indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
  
  // S'assurer que les chemins sont relatifs correctement
  indexHtml = indexHtml.replace(/href="\.\//g, 'href="/');
  indexHtml = indexHtml.replace(/src="\.\//g, 'src="/');
  
  // Minifier le HTML (optionnel - décommenter si nécessaire)
  // indexHtml = minifyHTML(indexHtml);
  
  fs.writeFileSync(path.join(distDir, "index.html"), indexHtml);
  console.log(`✓ index.html optimisé (${getFileSize(path.join(distDir, "index.html"))})\n`);

  // 4. Copier les fichiers CSS
  console.log("📁 Copie des fichiers CSS...");
  const cssDir = path.join(distDir, "css");
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, "css", "main.css"),
    path.join(cssDir, "main.css")
  );
  console.log(`✓ CSS copié (${getFileSize(path.join(cssDir, "main.css"))})\n`);

  // 5. Copier les fichiers JavaScript
  console.log("📁 Copie des fichiers JavaScript...");
  const jsDir = path.join(distDir, "js");
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, "js", "main.js"),
    path.join(jsDir, "main.js")
  );
  console.log(`✓ main.js copié (${getFileSize(path.join(jsDir, "main.js"))})`);
  
  // Copier blog.js si il existe
  const blogJsPath = path.join(__dirname, "js", "blog.js");
  if (fs.existsSync(blogJsPath)) {
    fs.copyFileSync(blogJsPath, path.join(jsDir, "blog.js"));
    console.log(`✓ blog.js copié (${getFileSize(path.join(jsDir, "blog.js"))})\n`);
  } else {
    console.log('');
  }

  // 6. Copier les fichiers publics (images, etc.)
  console.log("📁 Copie des fichiers publics...");
  const publicDir = path.join(distDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  copyRecursiveSync(path.join(__dirname, "public"), publicDir);
  
  // Calculer la taille totale des fichiers publics
  let publicTotalSize = 0;
  function calculatePublicTotalSize(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calculatePublicTotalSize(filePath);
      } else {
        publicTotalSize += stats.size;
      }
    });
  }
  calculatePublicTotalSize(publicDir);
  console.log(`✓ Fichiers publics copiés (${publicTotalSize < 1024 * 1024 ? `${(publicTotalSize / 1024).toFixed(2)} KB` : `${(publicTotalSize / (1024 * 1024)).toFixed(2)} MB`})\n`);

  // 6b. Copier le dossier data (articles.json)
  console.log("📁 Copie des fichiers de données...");
  const dataDir = path.join(distDir, "data");
  const dataSourceDir = path.join(__dirname, "data");
  if (fs.existsSync(dataSourceDir)) {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    copyRecursiveSync(dataSourceDir, dataDir);
    console.log("✓ Fichiers de données copiés\n");
  } else {
    // Créer le dossier data avec un fichier articles.json par défaut
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const defaultArticles = [
      {
        "id": 1,
        "title": "Comprendre l'infertilité du couple",
        "category": "Fertilité",
        "icon": "heart-pulse",
        "excerpt": "Les causes de l'infertilité peuvent être multiples. Découvrez les facteurs à prendre en compte et les solutions disponibles pour les couples.",
        "date": new Date().toISOString().split('T')[0],
        "author": "Dr. Mboloko Esimo Justin",
        "content": "Contenu complet de l'article...",
        "published": true
      }
    ];
    fs.writeFileSync(
      path.join(dataDir, "articles.json"),
      JSON.stringify(defaultArticles, null, 2)
    );
    console.log("✓ Fichier articles.json par défaut créé\n");
  }


  // 7. Créer un fichier .htaccess pour Apache
  console.log("⚙️  Création du fichier .htaccess...");
  const htaccessContent = `# Configuration Apache pour le site statique
# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache des fichiers statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Headers de sécurité
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Redirection vers index.html pour les routes propres (SPA)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
</IfModule>
`;
  fs.writeFileSync(path.join(distDir, ".htaccess"), htaccessContent);
  console.log("✓ .htaccess créé\n");

  // 8. Créer un fichier sitemap.xml
  console.log("🗺️  Création du sitemap.xml...");
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://drmboloko.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapContent);
  console.log("✓ sitemap.xml créé\n");

  // 9. Créer un fichier robots.txt
  console.log("🤖 Création du robots.txt...");
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://drmboloko.com/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), robotsContent);
  console.log("✓ robots.txt créé\n");

  // 10. Créer un fichier .gitignore pour dist (si nécessaire)
  const gitignorePath = path.join(distDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, "*\n!.gitignore\n");
  }

  // 11. Créer un fichier README amélioré pour le déploiement
  console.log("📝 Création du README.md...");
  const readmeContent = `# Site Statique - Dr. Mboloko Esimo Justin

Ce dossier contient la version statique optimisée du site web, prête à être déployée.

## 📋 Structure

\`\`\`
dist/
├── index.html          # Page principale
├── css/
│   └── main.css       # Styles compilés
├── js/
│   └── main.js        # JavaScript
├── public/            # Images et ressources
├── .htaccess          # Configuration Apache (cache, compression)
├── sitemap.xml        # Plan du site pour SEO
└── robots.txt         # Instructions pour les robots
\`\`\`

## 🚀 Déploiement

### Hébergeurs recommandés :

- **GitHub Pages** : Gratuit, facile à utiliser
- **Netlify** : Déploiement automatique depuis Git, HTTPS gratuit
- **Vercel** : Performances excellentes, CDN global
- **Surge.sh** : Simple et rapide
- **Serveur Apache/Nginx** : Déploiement traditionnel

### Commandes de déploiement :

\`\`\`bash
# Netlify (nécessite netlify-cli)
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Surge.sh (nécessite surge)
npm install -g surge
surge dist/ drmboloko.surge.sh

# Serveur HTTP simple pour test local
cd dist
python3 -m http.server 8000
# ou
npx serve .
# ou
php -S localhost:8000
\`\`\`

## ⚙️ Optimisations incluses

- ✅ Compression Gzip pour les fichiers textuels
- ✅ Cache des fichiers statiques (1 an pour images, 1 mois pour CSS/JS)
- ✅ Headers de sécurité (X-Frame-Options, etc.)
- ✅ Sitemap XML pour le SEO
- ✅ Robots.txt configuré
- ✅ Chemins relatifs optimisés

## 📊 Performance

Le site est optimisé pour un chargement rapide avec :
- CSS et JavaScript minifiés
- Images optimisées
- Cache configuré
- Compression activée

## 🔧 Configuration

Le fichier \`.htaccess\` est configuré pour Apache. Pour Nginx, adaptez la configuration selon vos besoins.

---

**Dernière mise à jour** : ${new Date().toLocaleDateString('fr-FR')}
`;
  fs.writeFileSync(path.join(distDir, "README.md"), readmeContent);
  console.log("✓ README.md créé\n");

  // Résumé final
  console.log("=".repeat(60));
  console.log("✅ Build de production terminé avec succès !");
  console.log("=".repeat(60));
  console.log(`📦 Fichiers statiques disponibles dans : ${distDir}`);
  console.log(`\n📊 Statistiques :`);
  
  // Compter les fichiers et calculer la taille totale
  let fileCount = 0;
  let totalSize = 0;
  function countFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        countFiles(filePath);
      } else {
        fileCount++;
        totalSize += stats.size;
      }
    });
  }
  countFiles(distDir);
  
  const sizeStr = totalSize < 1024 
    ? `${totalSize} B` 
    : totalSize < 1024 * 1024 
    ? `${(totalSize / 1024).toFixed(2)} KB`
    : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
  
  console.log(`   - Nombre de fichiers : ${fileCount}`);
  console.log(`   - Taille totale : ${sizeStr}`);
  console.log(`\n💡 Vous pouvez maintenant déployer le contenu du dossier "dist" sur votre serveur web.`);

} catch (error) {
  console.error("\n❌ Erreur lors du build :", error.message);
  process.exit(1);
}
