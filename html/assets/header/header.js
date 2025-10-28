// ===== Народна Рада — Хедер (multi-dropdown) =====
(() => {
  // Handle all dropdowns
  const dropdowns = Array.from(document.querySelectorAll('.nr-dropdown'));
  function closeAll(except=null){
    dropdowns.forEach(dd => {
      if (dd !== except){
        dd.setAttribute('data-open', 'false');
        const t = dd.querySelector('.nr-dropdown__toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  }
  dropdowns.forEach(dd => {
    const toggle = dd.querySelector('.nr-dropdown__toggle');
    const menu = dd.querySelector('.nr-dropdown__menu');
    function open(){ dd.setAttribute('data-open','true'); toggle?.setAttribute('aria-expanded','true'); }
    function close(){ dd.setAttribute('data-open','false'); toggle?.setAttribute('aria-expanded','false'); }
    toggle?.addEventListener('click', (e) => {
      const isOpen = dd.getAttribute('data-open') === 'true';
      if (isOpen){ close(); } else { closeAll(dd); open(); }
      e.stopPropagation();
    });
    toggle?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown'){ open(); menu?.querySelector('a')?.focus(); }
      if (e.key === 'Escape'){ close(); toggle?.focus(); }
    });
  });
  document.addEventListener('click', () => closeAll());

  // Burger / subnav
  const burger = document.querySelector('.nr-burger');
  const subnav = document.getElementById('nr-subnav');
  burger?.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    subnav.setAttribute('aria-expanded', String(!expanded));
  });
})();

// Hover open for wide screens (non-touch heuristic)
(() => {
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) return;
  const subs = document.querySelectorAll('#nr-subnav .nr-dropdown');
  subs.forEach(dd => {
    dd.addEventListener('mouseenter', () => dd.setAttribute('data-open','true'));
    dd.addEventListener('mouseleave', () => dd.setAttribute('data-open','false'));
  });
})();
