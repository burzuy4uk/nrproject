// Contacts page micro-interactions

// Reveal on scroll
(() => {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// Light tilt on hover for cards
(() => {
  const cards = document.querySelectorAll('.contact-card');
  cards.forEach(card => {
    let rAF;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        card.style.transform = `translateY(-4px) rotateX(${(-dy*3).toFixed(2)}deg) rotateY(${(dx*4).toFixed(2)}deg)`;
      });
    };
    const reset = () => { card.style.transform = ''; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur', reset, true);
  });
})();

// Copy-to-clipboard for any link with data-copy
(() => {
  document.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-copy]');
    if (!t) return;
    e.preventDefault();
    const text = t.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      t.classList.add('copied');
      setTimeout(() => t.classList.remove('copied'), 1200);
    } catch {}
  });
})();

// Simple accordion
(() => {
  document.querySelectorAll('.acc-item .acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!expanded));
    });
  });
})();
