// dropdowns
(function(){
  const toggles=[...document.querySelectorAll('.nr-dropdown__toggle')];
  function closeAll(except){
    document.querySelectorAll('.nr-dropdown[data-open="true"]').forEach(d=>{
      if(except && d.contains(except)) return;
      d.removeAttribute('data-open');
      d.querySelector('.nr-dropdown__toggle')?.setAttribute('aria-expanded','false');
    });
  }
  toggles.forEach(btn=>{
    const dd=btn.closest('.nr-dropdown');
    btn.addEventListener('click',e=>{
      e.preventDefault();
      const open=dd.getAttribute('data-open')==='true';
      closeAll(btn);
      if(!open){ dd.setAttribute('data-open','true'); btn.setAttribute('aria-expanded','true'); }
      else { dd.removeAttribute('data-open'); btn.setAttribute('aria-expanded','false'); }
    });
  });
  document.addEventListener('click',e=>{
    const inDrop=e.target.closest?.('.nr-dropdown'); const isToggle=e.target.closest?.('.nr-dropdown__toggle');
    if(!inDrop && !isToggle) closeAll();
  });
})();
// burger + overlay
(function(){
  const b=document.querySelector('.nr-burger');
  const s=document.getElementById('nr-subnav')||document.querySelector('.nr-subnav');
  const o=document.querySelector('.menu-overlay')||(()=>{const el=document.createElement('div');el.className='menu-overlay';document.body.appendChild(el);return el;})();
  if(!b||!s) return;
  const close=()=>{b.setAttribute('aria-expanded','false');s.classList.remove('open');o.classList.remove('show');document.body.classList.remove('menu-open')};
  const open=()=>{b.setAttribute('aria-expanded','true');s.classList.add('open');o.classList.add('show');document.body.classList.add('menu-open')};
  b.addEventListener('click',()=>{const e=b.getAttribute('aria-expanded')==='true'; e?close():open();});
  o.addEventListener('click',close);
  window.addEventListener('resize',()=>{if(window.innerWidth>900) close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') close();});
})();
// active nav by URL + header scroll state
(function(){
  const p=location.pathname.replace(/\/$/,'')||'/';
  document.querySelectorAll('.nr-menu a.nr-link, .nr-dropdown__menu a').forEach(a=>{
    try{
      const u=new URL(a.getAttribute('href')||'',location.origin);
      if(u.pathname.replace(/\/$/,'')===p) a.classList.add('active');
    }catch(e){}
  });
  const header=document.querySelector('.nr-header');
  function onScroll(){ if(!header) return; header.classList.toggle('is-scrolled', window.scrollY>8); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
})();
// ---------- Бургер відкриває/закриває нижнє меню ----------
(function initBurger(){
  const burger = document.querySelector('.nr-burger');
  const subnav = document.getElementById('nr-subnav');
  if(!burger || !subnav) return;

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    subnav.setAttribute('aria-expanded', String(!open));
  });
})();

// ---------- Дропдауни (Про нас, Фонд) ----------
(function initDropdowns(){
  const toggles = document.querySelectorAll('.nr-dropdown__toggle');
  const menus = document.querySelectorAll('.nr-dropdown__menu');

  function closeAll(){
    menus.forEach(m => m.removeAttribute('data-open'));
    toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  }

  toggles.forEach(btn => {
    const menuId = btn.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    if(!menu) return;

    btn.addEventListener('click', (e) => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      closeAll();
      if(!isOpen){
        btn.setAttribute('aria-expanded', 'true');
        menu.setAttribute('data-open', 'true');
      }
      e.stopPropagation();
    });
  });

  // Клік поза меню закриває все
  document.addEventListener('click', closeAll);
  // ESC закриває
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeAll();
  });
})();
