// ============================================
// Main JavaScript File
// ============================================

// Initialize Lucide Icons
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// ============================================
// Hero Carousel
// ============================================
function initHeroCarousel() {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".carousel-indicator");
  const totalSlides = slides.length;
  const slideInterval = 10000; // 10 secondes par image

  if (totalSlides === 0) return;

  function showSlide(index) {
    // Masquer toutes les slides
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove("opacity-0");
        slide.classList.add("opacity-100");
      } else {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0");
      }
    });

    // Mettre à jour les indicateurs
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.remove("bg-white/20", "bg-white/40");
        indicator.classList.add("bg-teal-500/80");
        indicator.classList.add("w-2", "h-2");
      } else {
        indicator.classList.remove("bg-teal-500/80");
        indicator.classList.add("bg-white/20");
        indicator.classList.add("w-2", "h-2");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  // Navigation manuelle avec les indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
      // Réinitialiser le timer
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, slideInterval);
    });
  });

  // Démarrer le carousel automatique
  let carouselInterval = setInterval(nextSlide, slideInterval);

  // Pause au survol
  const heroSection = document.querySelector("section:has(#hero-carousel)");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", () => {
      clearInterval(carouselInterval);
    });
    heroSection.addEventListener("mouseleave", () => {
      carouselInterval = setInterval(nextSlide, slideInterval);
    });
  }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      const isExpanded = mobileMenu.classList.contains("hidden");
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    });
  }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    });
  });
}

// ============================================
// Intersection Observer for Scroll Animations
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animate-on-scroll elements
  requestAnimationFrame(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Check if already visible
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  });
}

// ============================================
// Animated Counter for Statistics
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

function initStatisticsCounter() {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statContainers = entry.target.querySelectorAll("[data-count]");
          statContainers.forEach((container) => {
            const counterEl = container.querySelector(".counter-value");
            if (counterEl) {
              const target = parseInt(container.dataset.count || "0");
              const currentValue = parseInt(counterEl.textContent || "0");
              if (target > 0 && currentValue === 0) {
                animateCounter(counterEl, target);
              }
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector("section:has([data-count])");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// ============================================
// Form Validation and Submission
// ============================================
function initFormValidation() {
  const appointmentForm = document.getElementById("appointment-form");
  if (!appointmentForm) return;

  const formInputs = appointmentForm.querySelectorAll(
    "input, select, textarea"
  );
  const submitButton = appointmentForm.querySelector('button[type="submit"]');

  // Validation functions
  function validateName(name) {
    return name.trim().length >= 2;
  }

  function validatePhone(phone) {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFieldError(input, message) {
    input.setAttribute("aria-invalid", "true");
    input.classList.add("border-red-500/50", "focus:border-red-500/50");
    input.classList.remove("border-white/10");

    let errorMsg = input.parentElement.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("p");
      errorMsg.className = "error-message text-xs text-red-400 mt-1 font-geist";
      input.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  function clearFieldError(input) {
    input.setAttribute("aria-invalid", "false");
    input.classList.remove("border-red-500/50", "focus:border-red-500/50");
    input.classList.add("border-white/10");

    const errorMsg = input.parentElement.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  function showSuccessMessage() {
    const successDiv = document.createElement("div");
    successDiv.className =
      "fixed top-20 right-6 bg-teal-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-on-scroll";
    successDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="font-geist">Demande envoyée avec succès !</span>
      </div>
    `;
    document.body.appendChild(successDiv);
    successDiv.classList.add("is-visible");

    setTimeout(() => {
      successDiv.style.opacity = "0";
      successDiv.style.transform = "translateY(-20px)";
      setTimeout(() => successDiv.remove(), 300);
    }, 4000);
  }

  // Real-time validation
  formInputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        showFieldError(input, "Ce champ est requis");
      } else {
        clearFieldError(input);
      }

      if (input.type === "email" && input.value) {
        if (!validateEmail(input.value)) {
          showFieldError(input, "Veuillez entrer une adresse email valide");
        } else {
          clearFieldError(input);
        }
      }

      if (input.type === "tel" && input.value) {
        if (!validatePhone(input.value)) {
          showFieldError(
            input,
            "Veuillez entrer un numéro de téléphone valide"
          );
        } else {
          clearFieldError(input);
        }
      }

      if (input.id === "name" && input.value) {
        if (!validateName(input.value)) {
          showFieldError(input, "Le nom doit contenir au moins 2 caractères");
        } else {
          clearFieldError(input);
        }
      }
    });

    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        clearFieldError(input);
      }
    });
  });

  // Form Submission
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);

    // Validate all fields
    if (!validateName(data.name)) {
      showFieldError(
        document.getElementById("name"),
        "Le nom doit contenir au moins 2 caractères"
      );
      isValid = false;
    }

    if (!validatePhone(data.phone)) {
      showFieldError(
        document.getElementById("phone"),
        "Veuillez entrer un numéro de téléphone valide"
      );
      isValid = false;
    }

    if (!validateEmail(data.email)) {
      showFieldError(
        document.getElementById("email"),
        "Veuillez entrer une adresse email valide"
      );
      isValid = false;
    }

    if (!data.reason) {
      showFieldError(
        document.getElementById("reason"),
        "Veuillez sélectionner un motif de consultation"
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Show loading state
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Envoi en cours...
      </span>
    `;

    // Simulate API call (replace with actual API endpoint)
    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", data);

      // Show success message
      showSuccessMessage();
      appointmentForm.reset();

      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;

      // In production, integrate with AdonisJS backend:
      // const response = await fetch('/api/appointments', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data)
      // });
      // if (response.ok) {
      //     showSuccessMessage();
      //     appointmentForm.reset();
      // } else {
      //     throw new Error('Erreur serveur');
      // }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}

// ============================================
// Navbar Background on Scroll
// ============================================
function initNavbarScroll() {
  const navbar =
    document.getElementById("navbar") || document.querySelector("nav");
  const backToTopBtn = document.getElementById("back-to-top");

  if (!navbar) return;

  // Fonction pour gérer le scroll
  const handleScroll = () => {
    const currentScroll =
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop;

    // Navbar background - devient complètement opaque au scroll
    if (currentScroll > 50) {
      navbar.classList.add("navbar-scrolled");
      navbar.style.backgroundColor = "rgba(0, 0, 0, 1)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
    } else {
      navbar.classList.remove("navbar-scrolled");
      navbar.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    }

    // Back to top button
    if (backToTopBtn) {
      if (currentScroll > 300) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
        backToTopBtn.classList.add("opacity-100");
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none");
        backToTopBtn.classList.remove("opacity-100");
      }
    }
  };

  // Écouter le scroll avec throttling pour meilleure performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Vérifier l'état initial au chargement
  handleScroll();

  // Back to top functionality
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ============================================
// Initialize All Functions
// ============================================
function initAllScripts() {
  initHeroCarousel();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initStatisticsCounter();
  initFormValidation();
  initNavbarScroll();
  
  // Charger les articles du blog (si la fonction existe)
  if (typeof loadBlogArticles === 'function') {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      loadBlogArticles();
    }, 200);
  }

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    setTimeout(() => lucide.createIcons(), 100);
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAllScripts);
} else {
  // DOM already loaded
  initAllScripts();
}

// Export for loader.js
window.initAllScripts = initAllScripts;
