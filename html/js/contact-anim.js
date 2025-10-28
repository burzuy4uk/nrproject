(function(){
  const cs=document.querySelectorAll('.contact-card');
  cs.forEach(c=>{
    c.addEventListener('pointerenter',()=>c.classList.add('hovered'));
    c.addEventListener('pointerleave',()=>c.classList.remove('hovered'));
  });
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('reveal'); io.unobserve(e.target); }
    })
  },{threshold:.15});
  cs.forEach(c=>io.observe(c));
})();
