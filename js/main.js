/* ===========================
   NGO Quatro — Main JS
   =========================== */

(function() {
  'use strict';

  // ===========================
  // Loading Screen
  // ===========================
  window.addEventListener('load', function() {
    setTimeout(function() {
      var loader = document.getElementById('loader');
      if (loader) {
        loader.classList.add('done');
        setTimeout(function() {
          document.querySelector('.hero').classList.add('animated');
          initRevealAnimations();
        }, 400);
      }
    }, 2000);
  });

  // ===========================
  // Custom Cursor
  // ===========================
  if (window.matchMedia('(pointer: fine)').matches) {
    var dot = document.createElement('div');
    dot.className = 'c-dot';
    var ring = document.createElement('div');
    ring.className = 'c-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = 'translate(' + (rx - 20) + 'px,' + (ry - 20) + 'px)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // ホバー検出
    document.addEventListener('mouseover', function(e) {
      if (e.target.closest('a, button, [role="button"], .magnetic')) {
        ring.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest('a, button, [role="button"], .magnetic')) {
        ring.classList.remove('hovering');
      }
    });
  }

  // ===========================
  // Navigation Scroll Effect
  // ===========================
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ===========================
  // Mobile Nav Toggle
  // ===========================
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===========================
  // Scroll Reveal (Intersection Observer)
  // ===========================
  function initRevealAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(function(el) {
      observer.observe(el);
    });
  }

  // 初期表示分（ローダーなしのページ）
  if (!document.getElementById('loader')) {
    document.addEventListener('DOMContentLoaded', function() {
      initRevealAnimations();
      var hero = document.querySelector('.hero');
      if (hero) hero.classList.add('animated');
    });
  }

  // ===========================
  // Counter Animation
  // ===========================
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        var target = parseInt(entry.target.dataset.target);
        var start = performance.now();
        var duration = 2000;

        function update(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(2, -10 * progress);
          var current = Math.round(target * eased);
          entry.target.textContent = current.toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }
    });
  }, { threshold: 0.5 });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.counter').forEach(function(el) {
      counterObserver.observe(el);
    });
  });

  // ===========================
  // Smooth Scroll for Anchors
  // ===========================
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.offsetTop - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  });

  // ===========================
  // Parallax (Hero)
  // ===========================
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', function() {
      var y = window.scrollY;
      var h = heroSection.offsetHeight;
      if (y < h) {
        var bgText = document.querySelector('.hero-bg-text');
        if (bgText) bgText.style.transform = 'translateX(' + (y * 0.08) + 'px)';
      }
    }, { passive: true });
  }

  // ===========================
  // Magnetic Buttons
  // ===========================
  document.querySelectorAll('.magnetic').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
    });
  });

  // ===========================
  // Email Obfuscation
  // ===========================
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-email]').forEach(function(el) {
      var parts = el.dataset.email.split('|');
      var email = parts[0] + '@' + parts[1];
      el.href = 'mailto:' + email;
      el.textContent = email;
    });
  });

  // ===========================
  // Contact Form → Google Form redirect
  // ===========================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Google Form URLに遷移
      var googleFormUrl = contactForm.dataset.formUrl;
      if (googleFormUrl) {
        window.open(googleFormUrl, '_blank');
      }
    });
  }

})();
