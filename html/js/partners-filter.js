(function(){
    const chips=[...document.querySelectorAll('[data-filter]')];
    const cards=[...document.querySelectorAll('[data-cat]')];
    chips.forEach(c=> c.addEventListener('click',()=>{
      const v=c.getAttribute('data-filter');
      chips.forEach(x=>x.classList.toggle('active', x===c));
      cards.forEach(card=>{
        const cat=card.getAttribute('data-cat');
        card.style.display = (v==='all' || v===cat) ? '' : 'none';
      });
    }));
  })();
  