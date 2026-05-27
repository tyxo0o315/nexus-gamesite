// animations.js — All GSAP animations (runs after DOM is populated)

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Page transition overlay ──────────────────────────────
  gsap.fromTo('#page-transition',
    { y: '0%' },
    { y: '-100%', duration: 0.9, ease: 'power4.inOut', delay: 0.05 }
  );

  // ── Custom cursor ────────────────────────────────────────
  initCursor();

  // ── Hero word-by-word reveal ─────────────────────────────
  const words = document.querySelectorAll('.hero-headline .word-inner');
  if (words.length) {
    gsap.fromTo(words,
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out', stagger: 0.06, delay: 0.6 }
    );
  }

  gsap.fromTo('.hero-eyebrow',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power3.out' }
  );
  gsap.fromTo('.hero-tagline',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, delay: 1.0, ease: 'power3.out' }
  );
  gsap.fromTo('.hero-scroll-hint',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, delay: 1.4, ease: 'power2.out' }
  );

  // Scroll hint bounce
  gsap.to('.hero-scroll-hint svg', {
    y: 6, repeat: -1, yoyo: true, duration: 0.9, ease: 'power1.inOut', delay: 1.8,
  });

  // ── Hero texture parallax ────────────────────────────────
  gsap.to('.hero-texture', {
    y: '30%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
  });

  // ── Section label + title reveals ────────────────────────
  document.querySelectorAll('.section-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });

  document.querySelectorAll('.section-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' } }
    );
    const line = el.querySelector('.section-title-line');
    if (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.6, delay: 0.25, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' } }
      );
    }
  });

  // ── Game cards ───────────────────────────────────────────
  gsap.fromTo('.game-card',
    { opacity: 0, y: 70 },
    {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '#games-track', start: 'top 82%' },
    }
  );

  // ── Mod rows ─────────────────────────────────────────────
  animateModRows();
  window.__animateModRows = animateModRows;

  // ── Ideas board cards ────────────────────────────────────
  // Set each card's static rotation before the scroll animation so GSAP owns the transform
  document.querySelectorAll('.idea-card').forEach(card => {
    const rot = parseFloat(card.style.getPropertyValue('--card-rot')) || 0;
    gsap.set(card, { rotation: rot });
  });

  gsap.fromTo('.idea-card',
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.65, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '#ideas-grid', start: 'top 78%' },
    }
  );
});

function animateModRows() {
  const rows = document.querySelectorAll('.mod-row');
  if (!rows.length) return;
  gsap.fromTo(rows,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.03, duration: 0.45, ease: 'power2.out', clearProps: 'transform' }
  );
}

function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power3' });

  window.addEventListener('mousemove', e => {
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    ringX(e.clientX);
    ringY(e.clientY);
  });

  const interactives = 'a, button, .chip, .filter-chip, .mod-link, .btn-download, label, input';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      ring.classList.add('is-hovering');
      gsap.to(ring, { scale: 2, duration: 0.2, ease: 'power2.out' });
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      ring.classList.remove('is-hovering');
      gsap.to(ring, { scale: 1, duration: 0.2, ease: 'power2.out' });
    }
  });
}
