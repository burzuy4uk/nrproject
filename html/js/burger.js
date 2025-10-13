// burger.js — керує нижнім рядом (subbar) і мобільними дропдаунами
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".burger");
  const subnav = document.getElementById("subnav");
  const overlay = document.querySelector(".menu-overlay");

  function toggleMenu(open) {
    const willOpen = open ?? !subnav.classList.contains("open");
    btn?.setAttribute("aria-expanded", String(willOpen));
    subnav?.classList.toggle("open", willOpen);
    overlay?.classList.toggle("show", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  }

  btn?.addEventListener("click", () => toggleMenu());

  overlay?.addEventListener("click", () => toggleMenu(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleMenu(false); });

  // мобільні підменю: по кліку розкривати .dropdown
  if (window.matchMedia("(max-width: 900px)").matches) {
    document.querySelectorAll(".sub-links .has-drop > .link").forEach(link => {
      link.addEventListener("click", (e) => {
        // якщо це просто "#", блокуємо перехід
        if (link.getAttribute("href") === "#" || link.getAttribute("href") === "") e.preventDefault();
        link.parentElement.classList.toggle("open");
      });
    });
  }
});
