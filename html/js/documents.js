// === Плавна поява секцій ===
const io = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} });
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  
  // === Таби (сумісно з існуючим tabs.js; якщо він уже керує – цей блок можна прибрати) ===
  document.querySelectorAll('.tabs .tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.id.replace('tab','panel');
      // переключення кнопок
      document.querySelectorAll('.tabs .tab').forEach(b=>{
        b.classList.toggle('is-active', b===btn);
        b.setAttribute('aria-selected', b===btn ? 'true':'false');
      });
      // переключення панелей
      document.querySelectorAll('.tabpanels .tabpanel').forEach(p=>{
        p.hidden = (p.id !== id);
      });
    });
  });
  
  // === PDF Viewer (підстановка src із правильним кодуванням + кнопки) ===
  const pdfWrap = document.getElementById('pdfViewer');
  if (pdfWrap) {
    const rawUrl = pdfWrap.getAttribute('data-pdf'); // містить пробіли/укр.
    const encoded = encodeURI(rawUrl) + '#toolbar=1&navpanes=0&scrollbar=1&zoom=page-width';
    const frame = document.getElementById('pdfFrame');
    frame.src = encoded;
  
    // Кнопки тулбара
    const openBtn = document.querySelector('[data-pdf-open]');
    const dlLink  = document.querySelector('[data-pdf-download]');
    const fsBtn   = document.querySelector('[data-pdf-fullscreen]');
  
    if (openBtn) openBtn.addEventListener('click', ()=> window.open(encoded, '_blank', 'noopener'));
    if (dlLink)  dlLink.setAttribute('href', rawUrl);
  
    if (fsBtn) {
      fsBtn.addEventListener('click', ()=>{
        pdfWrap.classList.toggle('is-fullscreen');
        fsBtn.textContent = pdfWrap.classList.contains('is-fullscreen') ? 'Вийти з повного екрана' : 'На весь екран';
      });
    }
  }
  
  // === Лайтбокс для зображення ===
  const lb = document.getElementById('lightbox');
  const lbImg = lb?.querySelector('.lightbox__img');
  
  document.querySelectorAll('[data-lightbox]').forEach(img=>{
    img.addEventListener('click', ()=>{
      if (!lb || !lbImg) return;
      lbImg.src = img.getAttribute('data-lightbox');
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden','false');
    });
  });
  
  document.querySelectorAll('[data-lightbox-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      lb?.classList.remove('is-open');
      lb?.setAttribute('aria-hidden','true');
      if (lbImg) lbImg.src = '';
    });
  });
  
  lb?.addEventListener('click', (e)=>{
    if (e.target === lb) {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden','true');
      if (lbImg) lbImg.src = '';
    }
  });
  document.addEventListener('keydown',(e)=>{
    if (e.key === 'Escape' && lb?.classList.contains('is-open')) {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden','true');
      if (lbImg) lbImg.src = '';
    }
  });
  