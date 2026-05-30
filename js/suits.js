/* ============================================================
   TONY STARK PORTFOLIO — SUITS PAGE JS
   Scroll reveal + Modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSuitCardReveal();
  initSuitModal();
});

function initSuitCardReveal() {
  const allCards = document.querySelectorAll('.suit-card');

  // Per-era observer
  document.querySelectorAll('.suits-era').forEach(era => {
    const cards = era.querySelectorAll('.suit-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const eraCards = Array.from(cards);
          const idx = eraCards.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    cards.forEach(card => observer.observe(card));
  });
}

function initSuitModal() {
  const modal = document.getElementById('suitModal');
  const closeBtn = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalMark = document.getElementById('modalMark');
  const modalName = document.getElementById('modalName');
  const modalDesc = document.getElementById('modalDesc');
  const modalMovie = document.getElementById('modalMovie');
  const modalSpecs = document.getElementById('modalSpecs');

  if (!modal) return;

  // Open modal on card click (only for cards with data attributes)
  document.querySelectorAll('.suit-card[data-name]').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-name');
      const mark = card.getAttribute('data-mark');
      const desc = card.getAttribute('data-desc');
      const movie = card.getAttribute('data-movie');
      const specsStr = card.getAttribute('data-specs');
      const imgSrc = card.querySelector('.suit-card-image img').src;

      modalImage.src = imgSrc;
      modalImage.alt = name;
      modalMark.textContent = mark;
      modalName.textContent = name;
      modalDesc.textContent = desc;
      modalMovie.textContent = 'Appeared in: ' + movie;

      // Parse specs
      modalSpecs.innerHTML = '';
      if (specsStr) {
        try {
          const specs = JSON.parse(specsStr);
          Object.entries(specs).forEach(([key, value]) => {
            const specEl = document.createElement('div');
            specEl.className = 'suit-modal-spec';
            specEl.innerHTML = `
              <span class="spec-label">${key}</span>
              <span class="spec-value">${value}</span>
            `;
            modalSpecs.appendChild(specEl);
          });
        } catch (e) {
          console.error('Error parsing specs:', e);
        }
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
