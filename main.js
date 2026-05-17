/**
 * PUFF & PAW – main.js
 * =====================================================
 * Módulos implementados:
 * 1. Toggle menú mobile (hamburguesa)
 * 2. Cambio de idioma ES/EN (data-es / data-en)
 * 3. Modal de compra
 * 4. Animaciones de scroll (Intersection Observer)
 * 5. Navbar scroll effect
 * 6. Smooth scroll
 * =====================================================
 */

"use strict";

/* =============================================
   ESTADO GLOBAL DE LA APP
   ============================================= */
const AppState = {
  currentLang: "es", // Idioma activo: 'es' | 'en'
  menuOpen: false, // Estado del menú mobile
};

/* =============================================
   1. MENÚ MOBILE – HAMBURGUESA
   ============================================= */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const nav = document.getElementById("main-nav");

  if (!hamburger || !nav) return; // Guardia de seguridad

  hamburger.addEventListener("click", () => {
    AppState.menuOpen = !AppState.menuOpen;

    // Toggle clases visuales
    hamburger.classList.toggle("is-active", AppState.menuOpen);
    nav.classList.toggle("is-open", AppState.menuOpen);

    // Accesibilidad: aria-expanded
    hamburger.setAttribute("aria-expanded", String(AppState.menuOpen));

    // Evitar scroll del body cuando menú abierto
    document.body.style.overflow = AppState.menuOpen ? "hidden" : "";
  });

  // Cerrar menú al hacer click en un link
  const navLinks = nav.querySelectorAll(".navbar__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Cerrar menú con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.menuOpen) {
      closeMobileMenu();
    }
  });
}

/** Cierra el menú mobile y restaura el estado */
function closeMobileMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const nav = document.getElementById("main-nav");

  AppState.menuOpen = false;
  hamburger?.classList.remove("is-active");
  nav?.classList.remove("is-open");
  hamburger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

/* =============================================
   2. CAMBIO DE IDIOMA – ES / EN
   Todos los elementos con data-es y data-en
   se actualizan al hacer click en el botón
   ============================================= */
function initLanguageToggle() {
  const langBtn = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");

  if (!langBtn) return;

  langBtn.addEventListener("click", () => {
    // Alternar idioma
    AppState.currentLang = AppState.currentLang === "es" ? "en" : "es";

    // Actualizar etiqueta del botón
    langLabel.textContent =
      AppState.currentLang === "es" ? "ES | EN" : "EN | ES";

    // Actualizar TODOS los textos con data-es / data-en
    updateAllTexts();
  });
}

/** Actualiza todos los elementos que tienen data-es y data-en */
function updateAllTexts() {
  const lang = AppState.currentLang;

  // Seleccionar todos los elementos con atributo data-es
  const elements = document.querySelectorAll("[data-es]");

  elements.forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;

    // Si el elemento es un input/button con placeholder
    if (el.tagName === "INPUT") {
      el.placeholder = text;
    } else {
      // Para elementos HTML, usar innerHTML para soportar <br> y entidades
      el.innerHTML = text;
    }
  });

  // Actualizar el lang del <html>
  document.documentElement.lang = lang;
}

/* =============================================
   3. MODAL DE COMPRA
   ============================================= */

/** Abre el modal con datos del producto clickeado */
function openModal(button) {
  const modal = document.getElementById("purchase-modal");
  const nameEl = document.getElementById("modal-product-name");
  const priceEl = document.getElementById("modal-product-price");
  const successEl = document.getElementById("modal-success");
  const footerEl = document.getElementById("modal-footer");

  if (!modal) return;

  // Obtener datos del botón
  const productName = button.getAttribute("data-product") || "Producto";
  const productPrice = button.getAttribute("data-price") || "$199 MXN";

  // Rellenar modal
  nameEl.textContent = productName;
  priceEl.textContent = productPrice;

  // Asegurar que el estado de éxito esté oculto
  successEl.hidden = true;
  footerEl.style.display = "flex";

  // Mostrar modal
  modal.classList.add("is-open");
  modal.removeAttribute("aria-hidden");

  // Focus trampa – enfocar botón cerrar
  document.getElementById("modal-close-btn")?.focus();

  // Bloquear scroll de fondo
  document.body.style.overflow = "hidden";
}

/** Cierra el modal y restaura el scroll */
function closeModal() {
  const modal = document.getElementById("purchase-modal");
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/** Inicializa todos los eventos del modal */
function initModal() {
  const modal = document.getElementById("purchase-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const overlay = document.getElementById("modal-overlay");
  const successEl = document.getElementById("modal-success");
  const footerEl = document.getElementById("modal-footer");

  if (!modal) return;

  // Cerrar con botón X
  closeBtn?.addEventListener("click", closeModal);

  // Cerrar con botón cancelar
  cancelBtn?.addEventListener("click", closeModal);

  // Cerrar con click en overlay
  overlay?.addEventListener("click", closeModal);

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Confirmar compra → mostrar éxito
  confirmBtn?.addEventListener("click", () => {
    // Ocultar footer de botones
    footerEl.style.display = "none";

    // Mostrar mensaje de éxito
    successEl.hidden = false;

    // Actualizar texto de éxito si el idioma es EN
    if (AppState.currentLang === "en") {
      const successP = successEl.querySelector("p");
      if (successP && successP.dataset.en) {
        successP.textContent = successP.dataset.en;
      }
    }

    // Cerrar automáticamente después de 2.8 segundos
    setTimeout(() => {
      closeModal();
    }, 2800);
  });
}

/* =============================================
   4. ANIMACIONES DE SCROLL
   Intersection Observer – Fade-in al entrar
   en el viewport
   ============================================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");

  if (!elements.length) return;

  // Opciones del observer
  const observerOptions = {
    threshold: 0.1, // 10% visible para activar
    rootMargin: "0px 0px -32px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Dejar de observar después de animar (performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos
  elements.forEach((el) => observer.observe(el));
}

/* =============================================
   5. NAVBAR – Efecto al hacer scroll
   Cambia sombra cuando el usuario baja
   ============================================= */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      // Agregar sombra cuando se baja del top
      if (currentScrollY > 30) {
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.08)";
      } else {
        navbar.style.boxShadow = "none";
      }
    },
    { passive: true },
  ); // passive para mejor performance en scroll
}

/* =============================================
   6. SMOOTH SCROLL – Para navegación interna
   ============================================= */
function initSmoothScroll() {
  const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 64;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      // Cerrar menú mobile si está abierto
      if (AppState.menuOpen) closeMobileMenu();
    });
  });
}

/* =============================================
   INICIALIZACIÓN PRINCIPAL
   Se ejecuta cuando el DOM está listo
   ============================================= */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu(); // Menú hamburguesa
  initLanguageToggle(); // Cambio ES/EN
  initModal(); // Modal de compra
  initScrollAnimations(); // Fade-in con Intersection Observer
  initNavbarScroll(); // Sombra en navbar al hacer scroll
  initSmoothScroll(); // Scroll suave con offset del navbar

  // Forzar animación inicial del hero (visible sin scroll)
  setTimeout(() => {
    document.querySelectorAll(".hero .fade-in").forEach((el) => {
      el.classList.add("is-visible");
    });
  }, 80);
});

/**
 * =====================================================
 * FUNCIONES EXPORTADAS AL SCOPE GLOBAL
 * Necesario para el onclick inline en HTML
 * =====================================================
 */
window.openModal = openModal;
