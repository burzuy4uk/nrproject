// ===== Народна Рада — Хедер =====
(() => {
  // Dropdown toggle
  const dropdown = document.querySelector('.nr-dropdown');
  const toggle = document.querySelector('.nr-dropdown__toggle');
  const menu = document.getElementById('menu-fond');

  function closeDropdown() {
    dropdown?.setAttribute('data-open', 'false');
    toggle?.setAttribute('aria-expanded', 'false');
  }
  function openDropdown() {
    dropdown?.setAttribute('data-open', 'true');
    toggle?.setAttribute('aria-expanded', 'true');
  }

  toggle?.addEventListener('click', (e) => {
    const open = dropdown.getAttribute('data-open') === 'true';
    (open ? closeDropdown : openDropdown)();
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  // Keyboard support
  toggle?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { openDropdown(); menu?.querySelector('a')?.focus(); }
  });

  // Burger / subnav
  const burger = document.querySelector('.nr-burger');
  const subnav = document.getElementById('nr-subnav');
  burger?.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    subnav.setAttribute('aria-expanded', String(!expanded));
  });
})();
