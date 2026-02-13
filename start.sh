#!/bin/bash

# Script de démarrage pour le projet Dr Mboloko
# Ce script lance le watch CSS et le serveur HTTP

echo "🚀 Démarrage du projet Dr Mboloko..."
echo ""

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Compiler le CSS une première fois
echo "🎨 Compilation initiale du CSS..."
npm run build:css

# Lancer le watch CSS en arrière-plan
echo "👀 Démarrage du watch CSS..."
npm run dev &
CSS_PID=$!

# Attendre un peu pour que le CSS soit compilé
sleep 2

# Lancer le serveur HTTP
echo "🌐 Démarrage du serveur HTTP sur http://localhost:3000..."
npx --yes serve -s . -l 3000 &
SERVER_PID=$!

echo ""
echo "✅ Projet lancé avec succès!"
echo ""
echo "📋 Informations:"
echo "   - Serveur HTTP: http://localhost:3000"
echo "   - Watch CSS: actif (recompilation automatique)"
echo ""
echo "💡 Pour arrêter les serveurs, appuyez sur Ctrl+C ou exécutez:"
echo "   kill $CSS_PID $SERVER_PID"
echo ""

# Attendre que les processus se terminent
wait
