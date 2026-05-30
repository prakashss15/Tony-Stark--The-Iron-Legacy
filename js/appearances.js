/* ============================================================
   TONY STARK PORTFOLIO — APPEARANCES PAGE JS
   Screenshot cards scroll reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScreenshotReveal();
  initLightbox();
});

function initScreenshotReveal() {
  const cards = document.querySelectorAll('.screenshot-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger based on position within its parent gallery
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.screenshot-card'));
        const visibleIdx = siblings.filter(s => !s.classList.contains('revealed')).indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, Math.max(0, visibleIdx) * 80);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  cards.forEach(card => observer.observe(card));
}

function initLightbox() {
  const cards = document.querySelectorAll('.screenshot-card');
  const lightbox = document.getElementById('lightbox');
  
  if (!lightbox) return;
  
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const info = card.querySelector('.screenshot-info');
      
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      
      if (info) {
        lightboxCaption.innerHTML = info.innerHTML;
      } else {
        lightboxCaption.innerHTML = '';
      }
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
