(function(){
    document.querySelectorAll('.org-toggle').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const li=btn.closest('li');
        const child=li.querySelector(':scope > ul');
        if(child){ child.hidden = !child.hidden; btn.textContent = child.hidden ? '▸' : '▾'; }
      });
    });
  })();
  