/* ============================================================
 * Documents page scripts
 * - Reveal animation on scroll
 * - Tabs (2 sections): Статутні / Звіти
 * - Multiple PDF viewers with open/download/fullscreen
 * - Image lightbox for certificates
 * ============================================================ */

/* ---------- 1) Плавна поява секцій ---------- */
(function initReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();

/* ---------- 2) Таби (дві вкладки) ---------- */
(function initTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    const panels = document.querySelectorAll('.tabpanels .tabpanel');
    if (!tabs.length || !panels.length) return;

    function activate(tabEl) {
        const id = tabEl.id.replace('tab', 'panel');

        tabs.forEach((b) => {
            const active = b === tabEl;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
            b.tabIndex = active ? 0 : -1;
        });

        panels.forEach((p) => { p.hidden = (p.id !== id); });
    }

    // Клік і клавіатура
    tabs.forEach((btn) => {
        btn.addEventListener('click', () => activate(btn));
        btn.addEventListener('keydown', (e) => {
            const idx = Array.from(tabs).indexOf(btn);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = tabs[(idx + 1) % tabs.length];
                next.focus();
                activate(next);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                prev.focus();
                activate(prev);
            }
        });
    });

    // Ініціалізація (перша активна)
    const initial = document.querySelector('.tabs .tab.is-active') || tabs[0];
    if (initial) activate(initial);
})();

/* ---------- 3) Універсальний PDF-вʼюер ---------- */
(function initPdfViewers() {
    const viewers = document.querySelectorAll('.pdf-viewer');
    if (!viewers.length) return;

    viewers.forEach((viewer) => {
        const rawUrl = viewer.getAttribute('data-pdf'); // шлях з пробілами/укр.
        if (!rawUrl) return;

        // Коректне кодування + параметри перегляду
        const encoded = encodeURI(rawUrl) + '#toolbar=1&navpanes=0&scrollbar=1&zoom=page-width';

        // Підставляємо у <iframe>
        const frame = viewer.querySelector('iframe');
        if (frame) frame.src = encoded;

        // Знаходимо кнопки саме в межах картки
        const card = viewer.closest('.card') || viewer;
        const openB = card.querySelector('[data-pdf-open]');
        const downA = card.querySelector('[data-pdf-download]');
        const fullB = card.querySelector('[data-pdf-fullscreen]');

        if (openB) openB.addEventListener('click', () => window.open(encoded, '_blank', 'noopener'));
        if (downA) downA.setAttribute('href', rawUrl); // сирий шлях — для коректного імені файлу

        if (fullB) {
            fullB.addEventListener('click', () => {
                viewer.classList.toggle('is-fullscreen');
                fullB.textContent = viewer.classList.contains('is-fullscreen') ?
                    'Вийти з повного екрана' :
                    'На весь екран';
            });
        }
    });

    // Вихід із «повноекранного» контейнера по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.pdf-viewer.is-fullscreen').forEach((v) => {
            v.classList.remove('is-fullscreen');
            const host = v.closest('.card');
            const btn = host ? host.querySelector('[data-pdf-fullscreen]') : null;
            if (btn) btn.textContent = 'На весь екран';
        });
    });
})();

/* ---------- 4) Лайтбокс для зображень ---------- */
(function initLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = lb ? lb.querySelector('.lightbox__img') : null;
    if (!lb || !lbImg) return;

    // Відкриття
    document.querySelectorAll('[data-lightbox]').forEach((img) => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('data-lightbox');
            if (!src) return;
            lbImg.src = src;
            lb.classList.add('is-open');
            lb.setAttribute('aria-hidden', 'false');
        });
    });

    // Закриття кнопкою
    document.querySelectorAll('[data-lightbox-close]').forEach((btn) => {
        btn.addEventListener('click', () => closeLB());
    });

    // Клік по фону
    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLB();
    });

    // Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLB();
    });

    function closeLB() {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        lbImg.src = '';
    }
})();