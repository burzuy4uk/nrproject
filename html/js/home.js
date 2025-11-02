
(function(){
  /* ---------- 1) Scroll reveal ---------- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-up').forEach(el=>io.observe(el));

  /* ---------- 2) Counters in hero ---------- */
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const span = e.target;
      const target = parseInt(span.dataset.count||'0',10);
      let v = 0; const dur = 900; const t0 = performance.now();
      function tick(t){
        const p = Math.min(1, (t - t0)/dur);
        v = Math.floor(target * (0.1 + 0.9 * p)); // ease-ish
        span.textContent = v.toLocaleString('uk-UA');
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(span);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.hero-stats [data-count]').forEach(s=>counterIO.observe(s));

  /* ---------- 3) Lightweight "snippet fetcher"
      Підтягує картки з інших сторінок і вставляє перші 3 елементи
      data-fetch="/news.html" data-select=".news-card"
  ---------- */
  async function injectSnippets(host){
    const url = host.getAttribute('data-fetch');
    const selector = host.getAttribute('data-select') || '.card, article';
    if(!url) return;

    try{
      const res = await fetch(url, { cache: 'no-store' });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nodes = Array.from(doc.querySelectorAll(selector)).slice(0,3);

      if(nodes.length){
        host.innerHTML = '';
        nodes.forEach(n=>{
          // якщо на сторінці інша сітка — спробуємо витягти картку компактно
          const card = document.createElement('article');
          card.className = n.className || 'card';
          // картинку
          const img = n.querySelector('img');
          if(img){
            const ph = document.createElement('div');
            ph.style.height = '160px';
            ph.style.overflow = 'hidden';
            const im = new Image(); im.src = img.getAttribute('src'); im.alt = img.alt||'';
            im.style.width='100%'; im.style.height='100%'; im.style.objectFit='cover';
            ph.appendChild(im);
            card.appendChild(ph);
          } else {
            const ph = document.createElement('div');
            ph.style.height='160px'; ph.style.background='linear-gradient(135deg,#eef2ff,#e6ecff)';
            card.appendChild(ph);
          }
          // заголовок/текст/лінк
          const body = document.createElement('div'); body.className='body';
          const h = n.querySelector('h3, h2, .title'); if(h){ const hh=document.createElement('h3'); hh.textContent=h.textContent.trim(); body.appendChild(hh); }
          const p = n.querySelector('p'); if(p){ const pp=document.createElement('p'); pp.textContent=p.textContent.trim(); body.appendChild(pp); }
          const a = n.querySelector('a[href]'); if(a){ const link=document.createElement('a'); link.href=a.getAttribute('href'); link.className='text-link'; link.textContent='Детальніше ▸'; body.appendChild(link); }
          card.appendChild(body);
          host.appendChild(card);
        });
      }
    }catch(e){ console.warn('Snippet fetch failed for', url, e); }
  }
  document.querySelectorAll('[data-fetch]').forEach(injectSnippets);

  /* ---------- 4) Subtle parallax for hero-bg ---------- */
  const bg = document.querySelector('.hero-bg');
  if(bg){
    window.addEventListener('scroll', ()=>{
      const y = Math.min(30, window.scrollY * 0.06);
      bg.style.transform = `translate3d(0, ${-y}px, 0)`;
    }, { passive:true });
  }
})();

