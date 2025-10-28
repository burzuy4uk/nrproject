(function(){
    document.querySelectorAll('.tabs').forEach(tabs=>{
      const buttons=[...tabs.querySelectorAll('[role="tab"]')];
      const panels=[...tabs.querySelectorAll('[role="tabpanel"]')];
      function activate(id){
        buttons.forEach(b=>b.setAttribute('aria-selected', String(b.id===id)));
        panels.forEach(p=>p.hidden = (p.getAttribute('aria-labelledby')!==id));
      }
      buttons.forEach(b=> b.addEventListener('click',()=> activate(b.id)));
      if(buttons[0]) activate(buttons[0].id);
    });
  })();
  