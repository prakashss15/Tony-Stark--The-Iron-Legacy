/* ============================================================
   TONY STARK PORTFOLIO — HOMEPAGE JAVASCRIPT
   Hero Animations, Typewriter, Parallax, Overview Cards
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for page loader to finish
  setTimeout(() => {
    initHeroAnimations();
    initTypewriter();
    initMouseParallax();
    initOverviewCards();
    initScrollIndicator();
    initCounterAnimation();
    initSuitPreviewCards();
    initMuteButton();
  }, 500);
});

/* ============================================================
   HERO ENTRANCE ANIMATIONS (GSAP-powered)
   ============================================================ */
function initHeroAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    // Fallback: simple CSS-based animations
    fallbackAnimations();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Badge slides in
  tl.to('.hero-badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.3
  })
  // Title lines slide up
  .to('.hero-title .title-text', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power4.out'
  }, '-=0.4')
  // Subtitle fades in (typewriter starts after)
  .to('.hero-subtitle', {
    opacity: 1,
    duration: 0.5
  }, '-=0.3')
  // Description
  .to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.2')
  // Buttons
  .to('.hero-buttons', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.4')
  // Stats
  .to('.hero-stats', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.4')
  // Scroll indicator
  .to('.scroll-indicator', {
    opacity: 0.6,
    duration: 0.8
  }, '-=0.2')
  // Hero image
  .to('.hero-image-wrapper', {
    opacity: 1,
    duration: 1.5,
    ease: 'power2.out',
    onStart: () => {
      document.querySelector('.hero-image-wrapper')?.classList.add('visible');
    }
  }, '-=1');
}

function fallbackAnimations() {
  const elements = [
    '.hero-badge',
    '.hero-title .title-text',
    '.hero-subtitle',
    '.hero-description',
    '.hero-buttons',
    '.hero-stats',
    '.scroll-indicator'
  ];

  elements.forEach((sel, i) => {
    const els = document.querySelectorAll(sel);
    els.forEach(el => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }, 400 + i * 200);
    });
  });

  // Hero image
  setTimeout(() => {
    const img = document.querySelector('.hero-image-wrapper');
    if (img) img.classList.add('visible');
  }, 800);
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const subtitle = document.getElementById('heroSubtitle');
  if (!subtitle) return;

  const text = 'Genius. Billionaire. Playboy. Philanthropist.';
  const cursor = subtitle.querySelector('.cursor');
  let charIndex = 0;

  // Clear existing text
  const textNode = subtitle.firstChild;

  function type() {
    if (charIndex < text.length) {
      // Insert character before cursor
      if (cursor) {
        cursor.insertAdjacentText('beforebegin', text.charAt(charIndex));
      }
      charIndex++;
      setTimeout(type, 50 + Math.random() * 40);
    }
  }

  // Start typewriter after hero animations
  setTimeout(type, 1800);
}

/* ============================================================
   MOUSE PARALLAX EFFECT
   ============================================================ */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const layers = [
    { el: document.querySelector('.hero-image-wrapper'), speed: 0.02 },
    { el: document.querySelector('.arc-reactor-deco'), speed: 0.03 },
    { el: document.querySelector('.hero-bg-grid'), speed: 0.01 },
  ];

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    layers.forEach(layer => {
      if (layer.el) {
        const moveX = x * layer.speed * 100;
        const moveY = y * layer.speed * 100;
        layer.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });
  });

  hero.addEventListener('mouseleave', () => {
    layers.forEach(layer => {
      if (layer.el) {
        layer.el.style.transition = 'transform 0.5s ease-out';
        layer.el.style.transform = 'translate(0, 0)';
        setTimeout(() => {
          if (layer.el) layer.el.style.transition = '';
        }, 500);
      }
    });
  });
}

/* ============================================================
   OVERVIEW CARDS — SCROLL REVEAL
   ============================================================ */
function initOverviewCards() {
  const cards = document.querySelectorAll('.legacy-pillar');
  if (cards.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Find the index of this card among all cards
        const allCards = Array.from(cards);
        const cardIndex = allCards.indexOf(entry.target);
        const delay = cardIndex * 150;

        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

/* ============================================================
   SCROLL INDICATOR FADE
   ============================================================ */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > 100) {
      indicator.style.opacity = Math.max(0, 0.6 - scrolled / 300);
    }
  });
}

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
function initCounterAnimation() {
  const stats = document.querySelectorAll('.stat-value[data-count]');
  if (stats.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          el.textContent = prefix + current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

/* ============================================================
   SUIT PREVIEW CARDS — SCROLL REVEAL
   ============================================================ */
function initSuitPreviewCards() {
  const cards = document.querySelectorAll('.suit-preview-card');
  if (cards.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allCards = Array.from(cards);
        const cardIndex = allCards.indexOf(entry.target);
        const delay = cardIndex * 120;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

/* ============================================================
   BACKGROUND VIDEO MUTE / AUDIO TOGGLE
   ============================================================ */
function initMuteButton() {
  const bgVideo = document.getElementById('bgVideo');
  const muteBtn = document.getElementById('muteBtn');

  if (!bgVideo || !muteBtn) return;

  // Make sure they start synchronized (video is muted initially due to HTML autoplay policy)
  bgVideo.muted = true;
  muteBtn.classList.remove('unmuted');

  muteBtn.addEventListener('click', () => {
    bgVideo.muted = !bgVideo.muted;
    if (bgVideo.muted) {
      muteBtn.classList.remove('unmuted');
    } else {
      muteBtn.classList.add('unmuted');
      // If video was somehow paused or stopped, make sure it plays when unmuted
      if (bgVideo.paused) {
        bgVideo.play().catch(err => console.log('Autoplay play check after interaction:', err));
      }
    }
  });
}
