/**
 * PUFF & PAW v2 – main.js
 * ====================================
 * 1. Menú mobile
 * 2. Cambio de idioma ES/EN
 * 3. Modal de compra
 * 4. Animaciones scroll (Intersection Observer)
 * 5. Navbar scroll effect
 * ====================================
 */

"use strict";

const AppState = {
  currentLang: "es",
  menuOpen: false,
};

/* ====================================
   1. MENÚ MOBILE
   ==================================== */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    AppState.menuOpen = !AppState.menuOpen;
    hamburger.classList.toggle("is-active", AppState.menuOpen);
    mobileMenu.classList.toggle("is-open", AppState.menuOpen);
    hamburger.setAttribute("aria-expanded", String(AppState.menuOpen));
    document.body.style.overflow = AppState.menuOpen ? "hidden" : "";
  });

  // Cerrar al hacer click en un link
  mobileMenu.querySelectorAll(".navbar__mobile-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.menuOpen) closeMobileMenu();
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  AppState.menuOpen = false;
  hamburger?.classList.remove("is-active");
  mobileMenu?.classList.remove("is-open");
  hamburger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

/* ====================================
   2. CAMBIO DE IDIOMA
   ==================================== */
function initLanguageToggle() {
  const langBtn = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");
  if (!langBtn) return;

  langBtn.addEventListener("click", () => {
    AppState.currentLang = AppState.currentLang === "es" ? "en" : "es";
    langLabel.textContent = AppState.currentLang.toUpperCase();
    updateAllTexts();
  });
}

function updateAllTexts() {
  const lang = AppState.currentLang;
  document.querySelectorAll("[data-es]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    if (el.tagName === "INPUT") {
      el.placeholder = text;
    } else {
      el.innerHTML = text;
    }
  });
  document.documentElement.lang = lang;
}

/* ====================================
   3. MODAL DE COMPRA
   ==================================== */
function openModal(button) {
  const modal = document.getElementById("purchase-modal");
  const nameEl = document.getElementById("modal-product-name");
  const priceEl = document.getElementById("modal-product-price");
  const successEl = document.getElementById("modal-success");
  const footerEl = document.getElementById("modal-footer");

  if (!modal) return;

  nameEl.textContent = button.getAttribute("data-product") || "";
  priceEl.textContent = button.getAttribute("data-price") || "";

  successEl.hidden = true;
  footerEl.style.display = "flex";

  modal.classList.add("is-open");
  modal.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";

  document.getElementById("modal-close-btn")?.focus();
}

function closeModal() {
  const modal = document.getElementById("purchase-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  const modal = document.getElementById("purchase-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const overlay = document.getElementById("modal-overlay");
  const successEl = document.getElementById("modal-success");
  const footerEl = document.getElementById("modal-footer");

  if (!modal) return;

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  confirmBtn?.addEventListener("click", () => {
    footerEl.style.display = "none";
    successEl.hidden = false;
    if (AppState.currentLang === "en") {
      const p = successEl.querySelector("p");
      if (p?.dataset.en) p.textContent = p.dataset.en;
    }
    setTimeout(closeModal, 2800);
  });
}

/* ====================================
   4. ANIMACIONES SCROLL
   ==================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
}

/* ====================================
   5. NAVBAR SCROLL
   ==================================== */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      navbar.style.boxShadow =
        window.scrollY > 30 ? "0 2px 20px rgba(0,0,0,0.08)" : "none";
    },
    { passive: true },
  );
}

/* ====================================
   6. SMOOTH SCROLL
   ==================================== */
function initSmoothScroll() {
  const offset = document.querySelector(".navbar")?.offsetHeight || 64;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset - 12,
        behavior: "smooth",
      });
      if (AppState.menuOpen) closeMobileMenu();
    });
  });
}

/* ====================================
   INIT
   ==================================== */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initLanguageToggle();
  initModal();
  initScrollAnimations();
  initNavbarScroll();
  initSmoothScroll();

  // Hero visible de inmediato
  setTimeout(() => {
    document
      .querySelectorAll(".hero .fade-in")
      .forEach((el) => el.classList.add("is-visible"));
  }, 80);
});

window.openModal = openModal;
