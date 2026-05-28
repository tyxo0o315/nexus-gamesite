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

  // ── MC character decorations ─────────────────────────────
  const steveEl   = document.querySelector('.mc-deco--steve');
  const chickenEl = document.querySelector('.mc-deco--chicken');

  if (steveEl) {
    gsap.set(steveEl, { scaleX: -1 });
    ScrollTrigger.create({
      trigger: '#mods', start: 'top 75%', once: true,
      onEnter() {
        gsap.fromTo(steveEl,
          { x: 60 },
          { opacity: 0.9, x: 0, duration: 0.9, ease: 'power3.out',
            onComplete() {
              gsap.to(steveEl, { y: -16, repeat: -1, yoyo: true, duration: 2, ease: 'power1.inOut' });
            }
          }
        );
      }
    });
  }

  if (chickenEl) {
    ScrollTrigger.create({
      trigger: '#mods', start: 'top 75%', once: true,
      onEnter() {
        gsap.fromTo(chickenEl,
          { x: 50 },
          { opacity: 0.9, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.2,
            onComplete() {
              gsap.to(chickenEl, { y: -12, repeat: -1, yoyo: true, duration: 2.5, ease: 'power1.inOut' });
            }
          }
        );
      }
    });
  }

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
      onComplete: initIdeaCardHover,
    }
  );

  // ── Navigation shape transitions ─────────────────────────
  initShapeTransition();
});

function initShapeTransition() {
  const canvas = document.getElementById('shape-canvas');
  if (!canvas) return;

  const colors = ['#4B5EE8', '#0CBFA2', '#3A4DD0'];
  const navLinks = [...document.querySelectorAll('.nav-links a')];

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none';
  const urchin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  urchin.setAttribute('opacity', '0');
  svg.appendChild(urchin);
  canvas.appendChild(svg);

  let isAnimating = false;

  navLinks.forEach((link, idx) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (isAnimating) return;
      isAnimating = true;

      const target = link.getAttribute('href');
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // innerR must reach ALL viewport corners to guarantee full coverage
      const maxDist = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy));
      const innerR = maxDist * 1.15;
      const outerR = innerR * 2.0;  // outer tips extend ~2× beyond viewport edge

      urchin.setAttribute('d', buildUrchinPath(cx, cy, outerR, innerR, 18));
      urchin.setAttribute('fill', colors[idx % colors.length]);

      // transformOrigin "50% 50%" = bounding-box center of this path = (cx, cy)
      gsap.set(urchin, {
        scale: 0, rotation: -10,
        transformOrigin: '50% 50%',
        attr: { opacity: 0.95 },
      });

      canvas.style.pointerEvents = 'all';
      const tl = gsap.timeline({ onComplete() { isAnimating = false; } });

      tl.to(urchin, { scale: 1, rotation: 7, duration: 1.1, ease: 'power2.in' })
        .call(() => document.querySelector(target)?.scrollIntoView({ behavior: 'instant' }))
        .to(urchin, {
          scale: 0, rotation: -4,
          duration: 0.5, ease: 'power3.in', delay: 0.25,
          onComplete() {
            canvas.style.pointerEvents = 'none';
            gsap.set(urchin, { attr: { opacity: 0 } });
          },
        });
    });
  });
}

// Builds urchin path centered at (cx, cy) with organically varied spike heights
function buildUrchinPath(cx, cy, outerR, innerR, numSpikes) {
  const pts = [];
  for (let i = 0; i < numSpikes * 2; i++) {
    const angle = (Math.PI * i) / numSpikes - Math.PI / 2;
    const r = i % 2 === 0
      ? outerR * (1 + 0.2 * Math.sin(i * 2.3))  // sine variation: organic, non-repeating
      : innerR;
    pts.push(`${i === 0 ? 'M' : 'L'}${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join('') + 'Z';
}

function initIdeaCardHover() {
  document.querySelectorAll('.idea-card').forEach(card => {
    const baseRot = parseFloat(card.style.getPropertyValue('--card-rot')) || 0;

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;

      gsap.to(card, {
        rotationY: x * 16,
        rotationX: -y * 12,
        rotation: 0,
        scale: 1.04,
        z: 30,
        duration: 0.25,
        ease: 'power2.out',
        transformPerspective: 900,
        overwrite: 'auto',
      });

      card.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        rotation: baseRot,
        scale: 1, z: 0,
        duration: 0.7, ease: 'elastic.out(1, 0.45)',
        transformPerspective: 900,
        overwrite: 'auto',
      });
    });
  });
}

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
