# Site Web - Pr. Mboloko Esimo Justin

Site web moderne et responsive pour le Pr. Mboloko Esimo Justin, expert en gynécologie-obstétrique, fertilité et PMA à Kinshasa, RDC.

## 🚀 Features

- **HTML5 Modulaire** - Structure organisée en composants réutilisables
- **Tailwind CSS** - Framework CSS utility-first pour développement rapide
- **Design Responsive** - Approche mobile-first pour tous les écrans
- **SEO Optimisé** - Meta tags, Open Graph, Schema.org
- **Accessibilité** - ARIA labels, navigation clavier, contraste de couleurs
- **Animations Fluides** - Transitions et effets visuels modernes
- **Carousel d'Images** - Défilement automatique des images dans le Hero

## 📋 Prérequis

- Node.js (v12.x ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. Installer les dépendances:
```bash
cd frontend
npm install
```

## 🚀 Lancer le Projet

### Méthode 1 : Script automatique (Recommandé)

```bash
cd frontend
./start.sh
```

### Méthode 2 : Commandes manuelles

**Terminal 1 - Watch CSS (recompilation automatique) :**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Serveur HTTP :**
```bash
cd frontend
npx serve -s . -l 3000
```

### Accès au site

Une fois lancé, ouvrez votre navigateur à l'adresse :
- **http://localhost:3000**

## 📁 Structure Modulaire

```
frontend/
├── index.html              # Fichier principal (simplifié, 124 lignes)
├── components/             # Composants HTML modulaires
│   ├── header.html        # Navigation (137 lignes)
│   ├── hero.html          # Section Hero avec carousel (240 lignes)
│   ├── stats.html         # Section Statistiques (60 lignes)
│   ├── about.html         # Section À Propos (240 lignes)
│   ├── services.html      # Section Services (360 lignes)
│   ├── blog.html          # Section Blog/Articles (210 lignes)
│   ├── expertise.html     # Section Expertise (280 lignes)
│   ├── contact.html       # Section Contact (320 lignes)
│   └── footer.html        # Footer (310 lignes)
├── js/                     # Scripts JavaScript
│   ├── loader.js          # Chargeur de composants (74 lignes)
│   └── main.js            # Logique principale (450 lignes)
├── css/                    # Styles CSS
│   ├── tailwind.css       # Source Tailwind avec custom styles
│   └── main.css           # CSS compilé (généré automatiquement)
└── public/                # Assets statiques
    ├── 1.png, 2.png, 3.png, 4.png  # Images du carousel
    └── ...
```

## 🔄 Système de Chargement Modulaire

Le fichier `index.html` charge automatiquement tous les composants via `js/loader.js` qui utilise `fetch()` pour charger les fichiers HTML et les insère dans le DOM.

### Avantages de cette structure :

- ✅ **Maintenabilité** : Code organisé et facile à modifier
- ✅ **Réutilisabilité** : Composants réutilisables
- ✅ **Performance** : Chargement parallèle des composants
- ✅ **Collaboration** : Plusieurs développeurs peuvent travailler sur différentes sections
- ✅ **Clarté** : Structure claire et logique
- ✅ **Debugging** : Plus facile de trouver et corriger les problèmes

## 📝 Modification des Composants

Pour modifier une section :
1. Éditez le fichier correspondant dans `components/`
2. Les changements seront automatiquement chargés au rafraîchissement

### Exemples :

- Modifier la navigation → `components/header.html`
- Modifier le Hero → `components/hero.html`
- Modifier les services → `components/services.html`
- Modifier le footer → `components/footer.html`

## 📝 Scripts Disponibles

- `npm run dev` - Lance le watch CSS (recompilation automatique)
- `npm run build:css` - Compile le CSS une seule fois pour la production
- `npm run build` - Assemble tous les composants en index.html et compile le CSS
- `npm run watch:css` - Alias pour `dev`

## 🔨 Système de Build

Le projet utilise un système de build qui assemble automatiquement tous les composants modulaires en un seul fichier `index.html`.

**Pour reconstruire le site après modification des composants :**
```bash
npm run build
```

Cela va :
1. Assembler tous les composants de `components/` dans `index.html`
2. Compiler le CSS avec Tailwind

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `css/tailwind.css` pour changer la palette de couleurs.

### Modifier les animations

Les animations sont définies dans `css/tailwind.css` et peuvent être personnalisées.

## 🛑 Arrêter les Serveurs

Pour arrêter les serveurs en cours d'exécution :

1. Si vous utilisez le script `start.sh`, appuyez sur `Ctrl+C`
2. Sinon, trouvez les processus et arrêtez-les :
```bash
# Trouver les processus
ps aux | grep -E "(serve|tailwind)"

# Arrêter les processus (remplacez PID par les numéros trouvés)
kill PID1 PID2
```

## 📦 Build pour la Production

```bash
npm run build
```

Génère le site optimisé dans `dist/` avec sitemap.xml et robots.txt.

### Configuration SEO

Le fichier `site.config.js` permet de définir l’URL du site pour l’indexation :

```javascript
module.exports = {
  SITE_URL: process.env.SITE_URL || "https://drmboloko.cmedith.com",
};
```

Pour un autre domaine (ex. Cloudflare Pages) :

```bash
SITE_URL=https://votresite.pages.dev npm run build
```

**Fichiers SEO générés :**
- `sitemap.xml` – plan du site pour les moteurs de recherche
- `robots.txt` – instructions d’indexation
- Données structurées Schema.org (Physician, MedicalBusiness, WebSite)

## 🔧 Architecture Technique

- **Chargement Dynamique** : Les composants sont chargés via `fetch()` API
- **Initialisation** : Les scripts sont initialisés après le chargement des composants
- **Performance** : Chargement parallèle de tous les composants
- **Fallback** : Système de retry si les scripts ne sont pas encore chargés

## 📚 Documentation

Voir `STRUCTURE.md` pour plus de détails sur l'architecture modulaire.
