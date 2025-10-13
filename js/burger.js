// бургер-меню: відкриття/закриття, esc, клік по оверлею
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".burger");
    const nav = document.querySelector(".main-links");
    const overlay = document.querySelector(".menu-overlay");
  
    if (!btn || !nav) return;
  
    function toggle(open) {
      const willOpen = open ?? !nav.classList.contains("open");
      btn.setAttribute("aria-expanded", String(willOpen));
      nav.classList.toggle("open", willOpen);
      if (overlay) overlay.classList.toggle("show", willOpen);
      document.body.style.overflow = willOpen ? "hidden" : "";
    }
  
    btn.addEventListener("click", () => toggle());
  
    // закривати при кліку по лінку/оверлею/ESC
    nav.addEventListener("click", e => {
      if (e.target.tagName === "A") toggle(false);
    });
    overlay?.addEventListener("click", () => toggle(false));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") toggle(false);
    });
  });
  