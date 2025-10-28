
// Позначає активний пункт меню та відкриває потрібний дропдаун
(function(){
  const path = location.pathname.replace(/\/$/,'') || '/';
  const markActive = (selector) => {
    document.querySelectorAll(selector).forEach(a=>{
      try{
        const href = a.getAttribute('href') || a.getAttribute('data-href') || '';
        if (!href) return;
        const url = new URL(href, location.origin);
        if (url.pathname.replace(/\/$/,'') === path){
          a.classList.add('active');
          const dd = a.closest('.nr-dropdown');
          if (dd) dd.setAttribute('data-open','true');
        }
      }catch(e){}
    });
  };
  markActive('.nr-menu a.nr-link, .nr-dropdown__menu a');
})();
