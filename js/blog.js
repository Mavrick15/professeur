// Script pour charger et afficher les articles du blog
// ============================================
async function loadBlogArticles() {
  const container = document.getElementById("articles-container");
  if (!container) {
    return;
  }

  try {
    // Essayer différents chemins pour le fichier JSON
    let jsonPath = "data/articles.json";
    let response = await fetch(jsonPath);

    // Si le chemin relatif ne fonctionne pas, essayer depuis la racine
    if (!response.ok) {
      jsonPath = "/data/articles.json";
      response = await fetch(jsonPath);
    }

    // Si toujours pas trouvé, essayer avec le chemin actuel
    if (!response.ok) {
      jsonPath = "./data/articles.json";
      response = await fetch(jsonPath);
    }

    if (!response.ok) {
      throw new Error(
        `Fichier articles.json non trouvé. Status: ${response.status} ${response.statusText}`
      );
    }

    const articles = await response.json();

    // Vérifier que c'est un tableau
    if (!Array.isArray(articles)) {
      console.error(
        "Le fichier articles.json ne contient pas un tableau valide"
      );
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-red-400">
          <p>Erreur: Format de données invalide dans articles.json</p>
        </div>
      `;
      return;
    }

    // Filtrer seulement les articles publiés (published !== false signifie aussi undefined est accepté)
    const publishedArticles = articles.filter((a) => a.published !== false);

    if (publishedArticles.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-stone-400">
          <p>Aucun article disponible pour le moment.</p>
          <p class="text-xs text-stone-500 mt-2">Assurez-vous que les articles ont "published": true dans articles.json</p>
        </div>
      `;
      return;
    }

    // Trier par date (plus récent en premier) et limiter à 6
    const sortedArticles = publishedArticles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    // Générer le HTML pour les articles
    let articlesHTML = "";

    try {
      // Générer le HTML pour chaque article
      for (let i = 0; i < sortedArticles.length; i++) {
        const article = sortedArticles[i];
        try {
          const html = generateArticleHTML(article, i);
          articlesHTML += html;
        } catch (err) {
          console.error("Erreur lors de la génération de l'article:", err);
        }
      }

      if (!articlesHTML || articlesHTML.trim().length === 0) {
        container.innerHTML =
          '<div class="col-span-full text-center py-12 text-red-400"><p>Erreur: Impossible de générer le HTML des articles</p></div>';
        return;
      }

      // Injecter le HTML dans le conteneur
      container.innerHTML = articlesHTML;

      // Attendre un peu pour que le DOM se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (container.children.length === 0) {
        container.innerHTML =
          '<div class="col-span-full text-center py-12 text-red-400"><p>Erreur: Les articles n\'ont pas pu être affichés</p></div>';
        return;
      }

      // Vérifier que les articles sont visibles
      const articles = container.querySelectorAll("article");

      if (articles.length > 0) {
        // CRUCIAL: Ajouter la classe 'is-visible' aux articles pour les rendre visibles
        // Car la classe 'animate-on-scroll' a opacity: 0 par défaut
        articles.forEach((article) => {
          // Vérifier si l'article est déjà dans la vue
          const rect = article.getBoundingClientRect();
          const isInView =
            rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

          if (isInView) {
            // Si l'article est déjà visible, ajouter immédiatement is-visible
            article.classList.add("is-visible");
          } else {
            // Sinon, observer l'article pour l'animer quand il entre dans la vue
            const articleObserver = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    articleObserver.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.1 }
            );

            articleObserver.observe(article);
          }
        });
      }

      // Réinitialiser les animations de scroll pour les nouveaux articles
      if (typeof initScrollAnimations === "function") {
        initScrollAnimations();
      }

      // Réinitialiser les icônes Lucide après l'injection du HTML
      if (typeof lucide !== "undefined") {
        setTimeout(() => {
          lucide.createIcons();
        }, 200);
      }
    } catch (error) {
      console.error("Erreur lors de la génération/injection du HTML:", error);
      container.innerHTML =
        '<div class="col-span-full text-center py-12 text-red-400"><p class="mb-2">❌ Erreur lors du chargement des articles</p><p class="text-xs text-stone-500">' +
        (error.message || "Erreur inconnue") +
        "</p></div>";
    }
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error);
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-stone-400">
        <p class="text-red-400 mb-2">❌ Erreur lors du chargement des articles</p>
        <p class="text-xs text-stone-500">${
          error.message || "Erreur inconnue"
        }</p>
      </div>
    `;
  }
}

function generateArticleHTML(article, index) {
  try {
    const icons = {
      "heart-pulse":
        '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>',
      dna: '<path d="M2 12c6-6 10-6 14 0"></path><path d="M2 12c6 6 10 6 14 0"></path><path d="M8 12h8"></path><path d="M2 12c6-6 10-6 14 0"></path><path d="M2 12c6 6 10 6 14 0"></path>',
      "clipboard-list":
        '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>',
      microscope:
        '<path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>',
      stethoscope:
        '<path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle>',
      hormone:
        '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path><circle cx="12" cy="12" r="2"></circle>',
      "book-open":
        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
      "baby-bottle":
        '<path d="M9 2v2"></path><path d="M9 4v2"></path><path d="M9 6h6v2a4 4 0 0 1-4 4v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a4 4 0 0 1-4-4V6h6"></path>',
    };

    const iconSvg = icons[article.icon] || icons["heart-pulse"];
    const iconName = article.icon || "heart-pulse";
    const date = new Date(article.date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const title = escapeHtml(article.title || "");
    const excerpt = escapeHtml(article.excerpt || "");
    const category = escapeHtml(article.category || "Article");

    // Générer le HTML en une seule chaîne sans retours à la ligne problématiques
    const html =
      '<article class="group relative p-8 rounded-2xl border-2 border-white/10 bg-white/[0.02] hover:bg-gradient-to-br hover:from-teal-500/10 hover:to-transparent hover:border-teal-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(13,148,136,0.15)] animate-on-scroll overflow-hidden cursor-pointer" style="transition-delay: ' +
      index * 100 +
      'ms" data-article-id="' +
      article.id +
      '">' +
      '<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>' +
      '<div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>' +
      '<div class="relative z-10">' +
      '<div class="flex items-center justify-between mb-6">' +
      '<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all duration-500">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-' +
      iconName +
      ' text-teal-400">' +
      iconSvg +
      "</svg>" +
      "</div>" +
      '<span class="inline-block py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 font-geist font-medium group-hover:bg-teal-500/20 transition-colors">' +
      category +
      "</span>" +
      "</div>" +
      '<h3 class="text-xl lg:text-2xl font-semibold mb-4 font-geist text-white group-hover:text-teal-300 transition-colors leading-tight">' +
      title +
      "</h3>" +
      '<p class="text-sm text-stone-400 leading-relaxed font-geist line-clamp-3 mb-6">' +
      excerpt +
      "</p>" +
      '<div class="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-teal-500/20 transition-colors">' +
      '<div class="flex items-center gap-2 text-xs text-stone-500 font-geist group-hover:text-stone-400 transition-colors">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar">' +
      '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>' +
      "</svg>" +
      "<span>" +
      date +
      "</span>" +
      "</div>" +
      '<div class="flex items-center gap-1 text-teal-400 text-xs font-medium font-geist group-hover:gap-2 transition-all">' +
      "<span>Lire</span>" +
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right transition-transform group-hover:translate-x-1">' +
      '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>' +
      "</svg>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</article>";

    return html;
  } catch (error) {
    console.error("Erreur dans generateArticleHTML:", error);
    console.error("Article qui cause l'erreur:", article);
    // Retourner un HTML minimal en cas d'erreur
    return (
      '<article class="p-8 bg-white/10 rounded-2xl border border-white/10"><h3 class="text-white text-xl mb-4">' +
      escapeHtml(article.title || "Article") +
      '</h3><p class="text-stone-400">' +
      escapeHtml(article.excerpt || "") +
      "</p></article>"
    );
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Exposer la fonction globalement pour qu'elle soit accessible depuis main.js
window.loadBlogArticles = loadBlogArticles;

// Éviter les doubles appels avec un flag
let isLoadingArticles = false;

// Wrapper pour éviter les doubles chargements
function safeLoadBlogArticles() {
  if (isLoadingArticles) {
    return;
  }
  isLoadingArticles = true;
  loadBlogArticles().finally(() => {
    isLoadingArticles = false;
  });
}

// Initialiser le chargement des articles si le conteneur existe déjà
// (mais laisser main.js gérer le chargement principal pour éviter les doubles appels)
if (
  document.readyState === "complete" &&
  document.getElementById("articles-container")
) {
  // Si le DOM est déjà complètement chargé, attendre un peu pour laisser main.js s'initialiser
  setTimeout(() => {
    if (!isLoadingArticles) {
      safeLoadBlogArticles();
    }
  }, 300);
}
