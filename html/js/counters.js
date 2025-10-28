(function(){
    const els=[...document.querySelectorAll('[data-count]')];
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const el=e.target; const target=+el.getAttribute('data-count'); const dur=900;
          const t0=performance.now();
          function step(t){
            const k=Math.min(1,(t-t0)/dur);
            el.textContent = Math.round(target * (0.2 + 0.8*k)).toLocaleString('uk-UA');
            if(k<1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      });
    },{threshold:.25});
    els.forEach(el=>io.observe(el));
  })();
  