/**
 * Voces por la Dignidad — Lenin Pérez Guzmán
 * main.js — v1.0
 * JavaScript vanilla, sin dependencias externas.
 * Sin tracking ni scripts de analítica.
 */

(function () {
  'use strict';

  /* ============================================================
     1. AÑO EN FOOTER
  ============================================================ */
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================================================
     2. MENÚ RESPONSIVE (hamburguesa)
  ============================================================ */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    function openMenu() {
      navLinks.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      navLinks.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    }

    toggle.addEventListener('click', toggleMenu);

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('nav-open') &&
        !navLinks.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Cerrar al redimensionar a pantalla grande
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    // Trampa de foco dentro del menú abierto
    navLinks.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !navLinks.classList.contains('nav-open')) return;
      const focusable = navLinks.querySelectorAll('a');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        toggle.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        toggle.focus();
      }
    });
  }

  /* ============================================================
     3. FILTROS DEL BLOG
  ============================================================ */
  function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const entries = document.querySelectorAll('.blog-entry');
    const noResults = document.getElementById('no-results');

    if (!filterBtns.length || !entries.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;

        // Estado activo en botones
        filterBtns.forEach(function (b) {
          b.classList.remove('filter-btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('filter-btn--active');
        btn.setAttribute('aria-pressed', 'true');

        // Filtrar entradas
        let visible = 0;
        entries.forEach(function (entry) {
          const cat = entry.dataset.category || '';
          if (filter === 'all' || cat === filter) {
            entry.classList.remove('hidden');
            entry.removeAttribute('aria-hidden');
            visible++;
          } else {
            entry.classList.add('hidden');
            entry.setAttribute('aria-hidden', 'true');
          }
        });

        // Mensaje sin resultados
        if (noResults) {
          if (visible === 0) {
            noResults.removeAttribute('hidden');
          } else {
            noResults.setAttribute('hidden', '');
          }
        }
      });
    });
  }

  /* ============================================================
     4. MEJORAS DE ACCESIBILIDAD
  ============================================================ */
  function initAccessibility() {
    // Focus visible para teclado: agrega clase al body cuando se usa Tab
    let usingKeyboard = false;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        usingKeyboard = true;
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function () {
      usingKeyboard = false;
      document.body.classList.remove('keyboard-nav');
    });

    // Enlace de salto activo
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function (e) {
        const target = document.getElementById('main-content');
        if (target) {
          e.preventDefault();
          target.setAttribute('tabindex', '-1');
          target.focus();
          // Eliminar tabindex después de enfocar
          target.addEventListener('blur', function () {
            target.removeAttribute('tabindex');
          }, { once: true });
        }
      });
    }

    // Mejorar contraste de focus en campos de formulario (si existen)
    const inputs = document.querySelectorAll('input, textarea, select, button');
    inputs.forEach(function (el) {
      el.addEventListener('focus', function () {
        el.setAttribute('data-focused', '');
      });
      el.addEventListener('blur', function () {
        el.removeAttribute('data-focused');
      });
    });
  }

  /* ============================================================
     5. SMOOTH SCROLL PARA ANCLAS INTERNAS
  ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68',
          10
        );
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        // Focus en el destino para lectores de pantalla
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', function () {
          target.removeAttribute('tabindex');
        }, { once: true });
      });
    });
  }

  /* ============================================================
     6. MARCAR ENLACE ACTIVO EN NAVEGACIÓN
  ============================================================ */
  function markActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    setYear();
    initNav();
    initBlogFilters();
    initAccessibility();
    initSmoothScroll();
    markActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
