/* ========================================
   Blue Seed Solutions - Animations & Smooth Scroll
   Powered by Anime.js + Lenis
   ======================================== */

(function() {
  'use strict';

  // ========================================
  // Feature Detection & Accessibility
  // ========================================

  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  };

  // Check for reduced motion preference (accessibility)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // Smooth Scroll with Lenis
  // ========================================

  class SmoothScroll {
    constructor() {
      if (typeof Lenis === 'undefined') {
        console.warn('Lenis not loaded - using native scroll');
        return;
      }

      // Skip smooth scroll if user prefers reduced motion
      if (prefersReducedMotion) {
        console.log('Reduced motion preferred - smooth scroll disabled');
        return;
      }

      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false
      });

      // Store globally for other modules
      window.lenis = this.lenis;

      this.raf(performance.now());
    }

    raf(time) {
      this.lenis.raf(time);
      requestAnimationFrame((t) => this.raf(t));
    }
  }

  // ========================================
  // Custom Cursor (Optimized)
  // ========================================

  class CustomCursor {
    constructor() {
      // Skip on touch devices or reduced motion
      if (isTouchDevice() || prefersReducedMotion) return;

      this.dot = null;
      this.ring = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.dotX = 0;
      this.dotY = 0;
      this.ringX = 0;
      this.ringY = 0;
      this.isHovering = false;
      this.isClicking = false;

      this.init();
    }

    init() {
      // Create cursor elements
      this.dot = document.createElement('div');
      this.dot.className = 'cursor-dot';
      document.body.appendChild(this.dot);

      this.ring = document.createElement('div');
      this.ring.className = 'cursor-ring';
      document.body.appendChild(this.ring);

      // Add custom cursor class to body
      document.body.classList.add('custom-cursor-active');

      // Bind events
      this.bindEvents();

      // Start animation loop (RAF for both dot and ring)
      this.animate();
    }

    bindEvents() {
      // Mouse move - just store coordinates
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });

      // Mouse down/up
      document.addEventListener('mousedown', () => {
        this.isClicking = true;
        this.dot.classList.add('cursor-click');
        this.ring.classList.add('cursor-click');
      });

      document.addEventListener('mouseup', () => {
        this.isClicking = false;
        this.dot.classList.remove('cursor-click');
        this.ring.classList.remove('cursor-click');
      });

      // Event delegation for hover states (performance optimized)
      document.body.addEventListener('mouseover', (e) => {
        const interactive = e.target.closest('a, button, input, textarea, select, [role="button"], .card');
        if (interactive) {
          this.isHovering = true;
          this.dot.classList.add('cursor-hover');
          this.ring.classList.add('cursor-hover');
        }
      });

      document.body.addEventListener('mouseout', (e) => {
        const interactive = e.target.closest('a, button, input, textarea, select, [role="button"], .card');
        if (interactive) {
          this.isHovering = false;
          this.dot.classList.remove('cursor-hover');
          this.ring.classList.remove('cursor-hover');
        }
      });

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', () => {
        this.dot.style.opacity = '0';
        this.ring.style.opacity = '0';
      });

      document.addEventListener('mouseenter', () => {
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '0.5';
      });
    }

    animate() {
      // Smooth follow for dot (faster)
      const dotEase = 0.35;
      this.dotX += (this.mouseX - this.dotX) * dotEase;
      this.dotY += (this.mouseY - this.dotY) * dotEase;

      // Smooth follow for ring (slower)
      const ringEase = 0.15;
      this.ringX += (this.mouseX - this.ringX) * ringEase;
      this.ringY += (this.mouseY - this.ringY) * ringEase;

      this.dot.style.left = this.dotX + 'px';
      this.dot.style.top = this.dotY + 'px';
      this.ring.style.left = this.ringX + 'px';
      this.ring.style.top = this.ringY + 'px';

      requestAnimationFrame(() => this.animate());
    }
  }

  // ========================================
  // Scroll Reveal Animations
  // ========================================

  class ScrollReveal {
    constructor() {
      // Skip if reduced motion
      if (prefersReducedMotion) return;

      this.revealElements = [];
      this.init();
    }

    init() {
      // Find all reveal elements
      this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

      if (this.revealElements.length === 0) {
        // Auto-add reveal classes to common elements
        this.autoAddRevealClasses();
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
      }

      // Create intersection observer
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, observerOptions);

      // Observe all elements
      this.revealElements.forEach(el => {
        this.observer.observe(el);
      });
    }

    autoAddRevealClasses() {
      // Add reveal to section headers
      document.querySelectorAll('section .text-center.mx-auto').forEach(el => {
        el.classList.add('reveal');
      });

      // Add reveal to cards
      document.querySelectorAll('.card').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (index % 4) * 0.1 + 's';
      });

      // Add reveal to testimonials
      document.querySelectorAll('.testimonial-card, section .d-flex.flex-column').forEach(el => {
        el.classList.add('reveal');
      });

      // Add reveal to contact info
      document.querySelectorAll('.d-flex.align-items-center.p-3').forEach((el, index) => {
        el.classList.add('reveal-left');
        el.style.transitionDelay = index * 0.1 + 's';
      });
    }
  }

  // ========================================
  // Hero Text Animation
  // ========================================

  class HeroAnimation {
    constructor() {
      // Skip if reduced motion or no Anime.js
      if (prefersReducedMotion) return;
      if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded - hero animation disabled');
        return;
      }

      this.init();
    }

    init() {
      const heroTitle = document.querySelector('.bssHeader');
      if (!heroTitle) return;

      // Wrap each word in a span, preserving existing HTML tags
      const html = heroTitle.innerHTML;
      // Split by HTML tags and spaces, keeping delimiters
      const parts = html.split(/(<[^>]+>|&nbsp;|\s+)/);
      heroTitle.innerHTML = parts.map(part => {
        // Skip empty parts, whitespace, HTML tags, and &nbsp;
        if (!part || part.trim() === '' || part.startsWith('<') || part === '&nbsp;') {
          return part;
        }
        return `<span class="hero-word" style="display: inline-block; opacity: 0;">${part}</span>`;
      }).join('');

      // Animate words
      setTimeout(() => {
        anime({
          targets: '.hero-word',
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(80),
          easing: 'easeOutQuad',
          duration: 600
        });
      }, 300);
    }
  }

  // ========================================
  // Button Ripple Effect
  // ========================================

  class ButtonRipple {
    constructor() {
      // Skip if reduced motion
      if (prefersReducedMotion) return;
      this.init();
    }

    init() {
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const ripple = document.createElement('span');
          ripple.className = 'btn-ripple';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';

          btn.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });
    }
  }

  // ========================================
  // Magnetic Buttons (Anime.js)
  // ========================================

  class MagneticButtons {
    constructor() {
      // Skip on touch devices or reduced motion
      if (isTouchDevice() || prefersReducedMotion) return;
      if (typeof anime === 'undefined') return;

      this.init();
    }

    init() {
      const buttons = document.querySelectorAll('.btn-primary');

      buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          anime({
            targets: btn,
            translateX: x * 0.2,
            translateY: y * 0.2,
            duration: 300,
            easing: 'easeOutQuad'
          });
        });

        btn.addEventListener('mouseleave', () => {
          anime({
            targets: btn,
            translateX: 0,
            translateY: 0,
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
          });
        });
      });
    }
  }

  // ========================================
  // Form Loading State
  // ========================================

  class FormHandler {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
          const submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;

            // Remove loading state after 3 seconds (in case form handler doesn't redirect)
            setTimeout(() => {
              submitBtn.classList.remove('btn-loading');
              submitBtn.disabled = false;
            }, 3000);
          }
        });
      });
    }
  }

  // ========================================
  // Active Nav Link Detection
  // ========================================

  class ActiveNavLink {
    constructor() {
      this.init();
    }

    init() {
      const navbar = document.getElementById('mainNav');
      if (!navbar) return;

      // Set active nav link based on current page
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = navbar.querySelectorAll('.nav-link');

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkPage = href.split('/').pop();
          if (linkPage === currentPage ||
              (currentPage === '' && linkPage === 'index.html') ||
              (currentPage === 'index.html' && (linkPage === 'index.html' || href === '/' || href === '../index.html'))) {
            link.classList.add('active');
          }
        }
      });
    }
  }

  // ========================================
  // Lazy Load Images Enhancement
  // ========================================

  class LazyLoadImages {
    constructor() {
      this.init();
    }

    init() {
      const images = document.querySelectorAll('img[loading="lazy"]');

      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    }
  }

  // ========================================
  // Counter Animation
  // ========================================

  class CounterAnimation {
    constructor() {
      // Skip if reduced motion or no Anime.js
      if (prefersReducedMotion) return;
      if (typeof anime === 'undefined') return;

      this.init();
    }

    init() {
      const counters = document.querySelectorAll('[data-counter]');
      if (counters.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.dataset.counter, 10);

            anime({
              targets: target,
              innerHTML: [0, endValue],
              round: 1,
              easing: 'easeOutQuad',
              duration: 2000
            });

            observer.unobserve(target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    }
  }

  // ========================================
  // Initialize All
  // ========================================

  function init() {
    // Initialize smooth scroll first (Lenis)
    new SmoothScroll();

    // Initialize all other modules
    new CustomCursor();
    new ScrollReveal();
    new HeroAnimation();
    new ButtonRipple();
    new MagneticButtons();
    new FormHandler();
    new ActiveNavLink();
    new LazyLoadImages();
    new CounterAnimation();

    // Log initialization status
    const features = [];
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) features.push('Lenis');
    if (typeof anime !== 'undefined') features.push('Anime.js');
    if (!isTouchDevice() && !prefersReducedMotion) features.push('Custom Cursor');

    console.log('BSS Animations initialized:', features.join(', ') || 'basic features');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
