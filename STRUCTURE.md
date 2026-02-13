# Structure Modulaire du Projet

## 📁 Organisation des Fichiers

```
frontend/
├── index.html              # Fichier principal (simplifié)
├── components/             # Composants HTML modulaires
│   ├── header.html        # Navigation
│   ├── hero.html          # Section Hero avec carousel
│   ├── stats.html         # Section Statistiques
│   ├── about.html         # Section À Propos
│   ├── services.html      # Section Services
│   ├── blog.html          # Section Blog/Articles
│   ├── expertise.html     # Section Expertise
│   ├── contact.html       # Section Contact
│   └── footer.html        # Footer
├── js/                     # Scripts JavaScript
│   ├── loader.js          # Chargeur de composants
│   └── main.js            # Logique principale
├── css/                    # Styles CSS
│   ├── tailwind.css       # Source Tailwind
│   └── main.css           # CSS compilé
└── public/                # Assets statiques
    ├── 1.png, 2.png, 3.png, 4.png
    └── ...
```

## 🔄 Système de Chargement

Le fichier `index.html` charge automatiquement tous les composants via `js/loader.js` qui utilise `fetch()` pour charger les fichiers HTML et les insère dans le DOM.

## 📝 Modification des Composants

Pour modifier une section :
1. Éditez le fichier correspondant dans `components/`
2. Les changements seront automatiquement chargés

## 🚀 Avantages de cette Structure

- ✅ **Maintenabilité** : Code organisé et facile à modifier
- ✅ **Réutilisabilité** : Composants réutilisables
- ✅ **Performance** : Chargement parallèle des composants
- ✅ **Collaboration** : Plusieurs développeurs peuvent travailler sur différentes sections
- ✅ **Clarté** : Structure claire et logique

## 🔧 Scripts Disponibles

- `npm run dev` - Watch CSS (recompilation automatique)
- `npm run build:css` - Compiler CSS pour production
