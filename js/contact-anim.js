// JS-анімація для контактних карток
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".contact-card");
  
    cards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");
  
        // невелика "пружинка"
        card.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.09)" },
            { transform: "scale(1.07)" }
          ],
          {
            duration: 300,
            easing: "ease-out"
          }
        );
      });
  
      card.addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
  
        // плавне повернення назад
        card.animate(
          [
            { transform: "scale(1.07)" },
            { transform: "scale(1)" }
          ],
          {
            duration: 250,
            easing: "ease-in"
          }
        );
      });
    });
  });
  