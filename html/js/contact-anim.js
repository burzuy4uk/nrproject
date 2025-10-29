/* contact-anim.js */

// ===== Reveal on scroll =====
(function revealOnScroll() {
    const cards = document.querySelectorAll('.contact-card');
    if (!('IntersectionObserver' in window) || cards.length === 0) {
        cards.forEach(c => c.classList.add('reveal'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('reveal');
                io.unobserve(e.target);
            }
        });
    }, { threshold: .15 });
    cards.forEach(c => io.observe(c));
})();

// ===== Hover accent =====
(function hoverAccent() {
    document.addEventListener('mouseenter', e => {
        const card = e.target.closest('.contact-card');
        if (card) card.classList.add('hovered');
    }, true);
    document.addEventListener('mouseleave', e => {
        const card = e.target.closest('.contact-card');
        if (card) card.classList.remove('hovered');
    }, true);
})();

// ===== Copy to clipboard (emails/phones) =====
(function copySupport() {
    let toast;

    function showToast(text) {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), 1600);
    }

    document.addEventListener('click', async(e) => {
        const a = e.target.closest('.copyable');
        if (!a) return;
        const value = a.getAttribute('data-copy') || a.textContent.trim();
        try {
            await navigator.clipboard.writeText(value);
            showToast('Скопійовано: ' + value);
        } catch {
            showToast('Не вдалося скопіювати');
        }
    });
})();

// ===== Open/Closed status & highlight today =====
(function businessHours() {
    // Київський час — використовуємо локальний; якщо сайт відвідують з іншого TZ,
    // все одно підпис пояснює, що час за Києвом.
    const now = new Date();
    const day = now.getDay(); // 0=Нд, 1=Пн, ...
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Робочі дні: Пн–Пт 08:00–18:00
    const isWeekend = (day === 0 || day === 6);
    const openMinutes = 8 * 60,
        closeMinutes = 18 * 60;
    const currentMinutes = hour * 60 + minute;

    const isOpen = !isWeekend && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    const status = document.getElementById('openStatusText');
    const badge = status ? status.closest('.open-badge') : null;
    if (status && badge) {
        status.textContent = isOpen ? 'Зараз відкрито (до 18:00)' : 'Зараз зачинено';
        badge.classList.toggle('closed', !isOpen);
    }

    // Підсвічуємо сьогодні
    const row = document.querySelector(`.hours__table tr[data-day="${day}"]`);
    if (row) row.classList.add('today');
})();