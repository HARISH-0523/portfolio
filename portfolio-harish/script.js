/* ─── script.js ────────────────────────────────
   Portfolio interactivity for Harish T
─────────────────────────────────────────────── */

'use strict';

// ── 1. Sticky nav — add .scrolled class ──────────────────
const navHeader = document.getElementById('nav-header');

function handleNavScroll() {
  if (window.scrollY > 10) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load


// ── 2. Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top    = section.offsetTop - 90;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


// ── 3. Mobile hamburger toggle ────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinksList = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click (mobile)
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navHeader.contains(e.target) && navLinksList.classList.contains('open')) {
    navLinksList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


// ── 4. Scroll-reveal via IntersectionObserver ─────────────
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: show all immediately
  revealEls.forEach(el => el.classList.add('visible'));
}


// ── 5. Smooth scroll polyfill for older browsers ──────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ── 6. Keyboard nav — Escape closes mobile menu ───────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksList.classList.contains('open')) {
    navLinksList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});


// ── 7. Staggered reveal delay for sibling .reveal ─────────
//   (adds CSS custom property so each sibling animates in turn)
document.querySelectorAll('.skills-grid, .contact-links, .timeline').forEach(parent => {
  const children = parent.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});


// ── 8. Hero "type-in" effect for title ───────────────────
(function typeHeroTitle() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;
  const text = titleEl.textContent.trim();
  titleEl.textContent = '';

  // Only run if animations are allowed
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { titleEl.textContent = text; return; }

  let i = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:2px;height:1.1em;background:currentColor;vertical-align:middle;margin-left:2px;animation:blink 0.9s step-end infinite;';
  titleEl.appendChild(cursor);

  // Inject blink keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);

  function type() {
    if (i < text.length) {
      titleEl.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 60 + Math.random() * 25);
    } else {
      // Remove cursor after typing
      setTimeout(() => cursor.remove(), 1200);
    }
  }

  // Delay so hero badge/name animate first
  setTimeout(type, 900);
})();
