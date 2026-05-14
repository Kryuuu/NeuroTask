/**
 * NeuroTask — Main Application Module
 * Initializes all modules, handles navigation, carousel, FAQ, and global interactions.
 * 
 * @module app
 */

/* --- Toast Notification System --- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* --- Main App Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  /* Init all modules */
  NeuralBackground.init();
  NTAnimations.init();
  NTPlanner.init();
  NTTimer.init();
  NTDashboard.init();

  /* Navigation */
  initNavigation();

  /* Testimonials Carousel */
  initCarousel();

  /* FAQ Accordion */
  initFAQ();

  /* CTA Form */
  initCTAForm();

  /* Keyboard shortcuts */
  initKeyboardShortcuts();

  /* Request notification permission */
  requestNotificationPermission();

  /* Redraw charts on window resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      NTDashboard.refresh();
    }, 250);
  });
});

/* --- Navigation --- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  /* Scroll effect */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Update active nav link */
    updateActiveNavLink();
  }, { passive: true });

  /* Mobile toggle */
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      /* Lock body scroll on iOS when menu is open */
      document.body.classList.toggle('menu-open', !isOpen);
    });
  }

  /* Close mobile menu on link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/** Highlight active section in navigation */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

/* --- Testimonials Carousel --- */
function initCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoPlayInterval;

  /* Create dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function next() {
    goTo((currentIndex + 1) % cards.length);
  }

  function prev() {
    goTo((currentIndex - 1 + cards.length) % cards.length);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

  /* Auto-play */
  function startAutoPlay() {
    autoPlayInterval = setInterval(next, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  startAutoPlay();

  /* Touch/swipe support */
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { next(); } else { prev(); }
      resetAutoPlay();
    }
  }, { passive: true });
}

/* --- FAQ Accordion --- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      /* Close all others */
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      /* Toggle current */
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* --- CTA Form --- */
function initCTAForm() {
  const submitBtn = document.getElementById('ctaSubmit');
  const emailInput = document.getElementById('ctaEmail');

  if (submitBtn && emailInput) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        showToast('Masukkan email terlebih dahulu', 'info');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showToast('Format email tidak valid', 'info');
        return;
      }

      /* Simulate success */
      emailInput.value = '';
      showToast('Terima kasih! Kamu akan segera menerima akses. 🎉', 'success');
    });
  }
}

/* --- Keyboard Shortcuts --- */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    /* Ctrl/Cmd + K = Focus on planner */
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('taskName').focus();
      document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
      showToast('⌨️ Shortcut: Quick Add Task', 'info');
    }
  });
}

/* --- Notification Permission --- */
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    /* Request after user interaction */
    document.addEventListener('click', function handler() {
      Notification.requestPermission();
      document.removeEventListener('click', handler);
    }, { once: true });
  }
}
