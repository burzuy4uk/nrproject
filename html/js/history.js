// Плавна поява секцій
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  
  // Лічильники
  function animateCount(el, to, dur = 1200) {
    const start = 0;
    const ts = performance.now();
    const fmt = new Intl.NumberFormat('uk-UA');
    function frame(t) {
      const p = Math.min(1, (t - ts) / dur);
      const val = Math.round(start + (to - start) * (1 - Math.pow(1 - p, 3)));
      el.textContent = fmt.format(val);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  
  const nums = document.querySelectorAll('.stat .num');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const n = parseInt(e.target.getAttribute('data-count'), 10);
        animateCount(e.target, n);
        io2.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  
  nums.forEach(n => io2.observe(n));
  