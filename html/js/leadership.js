/* Leadership page interactions
 * - Role filter chips
 * - Modal with detailed bios (from data attributes)
 * - Org tree expand/collapse
 * - Keyboard helpers
 */
(function() {
    const $ = (q, root = document) => root.querySelector(q);
    const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

    // ===== Role filter =====
    const chips = $$(".chips .chip");
    const cards = $$(".people .card-person");

    function applyFilter(role) {
        cards.forEach(card => {
            const ok = role === "all" || card.dataset.role === role;
            card.style.display = ok ? "" : "none";
            if (ok) {
                card.animate(
                    [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 160, easing: "ease-out" }
                );
            }
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => { c.classList.remove("is-active");
                c.setAttribute("aria-pressed", "false"); });
            chip.classList.add("is-active");
            chip.setAttribute("aria-pressed", "true");
            applyFilter(chip.dataset.role);
        });
    });

    // ===== Modal for bios =====
    const modalTmpl = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mdl-title">
        <div class="modal__dialog">
          <div class="modal__hd">
            <div id="mdl-title" class="modal__title"></div>
            <button class="modal__close" aria-label="Закрити">×</button>
          </div>
          <div class="modal__bd"></div>
        </div>
      </div>`;
    const modalWrap = document.createElement("div");
    modalWrap.innerHTML = modalTmpl;
    const modal = modalWrap.firstElementChild;
    document.body.appendChild(modal);
    const titleEl = $(".modal__title", modal);
    const bodyEl = $(".modal__bd", modal);
    const closeBtn = $(".modal__close", modal);

    function openModal(title, html) {
        titleEl.textContent = title;
        bodyEl.innerHTML = (html || "")
            .trim()
            .replace(/\n{2,}/g, "\n\n")
            .replace(/^•/gm, "• ");
        modal.classList.add("is-open");
        closeBtn.focus();
        document.documentElement.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("is-open");
        document.documentElement.style.overflow = "";
    }
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

    $$(".card-person .btn.more").forEach(btn => {
        btn.addEventListener("click", () => {
            openModal(btn.dataset.modalTitle || "Деталі", btn.dataset.modalBody || "");
        });
    });

    // ===== Org tree expand/collapse =====
    $$(".org-toggle").forEach(t => {
        t.addEventListener("click", () => {
            const li = t.closest("li");
            const sub = li && li.querySelector(":scope > ul");
            if (!sub) return;
            const isOpen = t.getAttribute("aria-expanded") !== "false";
            t.setAttribute("aria-expanded", String(!isOpen));
            sub.hidden = isOpen;
            t.textContent = isOpen ? "▸" : "▾";
        });
    });
    $$(".org-toggle").forEach(t => {
        const li = t.closest("li");
        const sub = li && li.querySelector(":scope > ul");
        if (sub) sub.hidden = false;
    });

    // Keyboard: Enter on card opens modal
    cards.forEach(card => {
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const btn = $(".btn.more", card);
                if (btn) btn.click();
            }
        });
    });
})();