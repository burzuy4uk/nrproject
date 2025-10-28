(function(){
    document.querySelectorAll('.acc > button').forEach(btn=>{
      const wrap=btn.closest('.acc');
      btn.addEventListener('click',()=> wrap.classList.toggle('open'));
    });
  })();
  