// js/i18n.js
(function () {
    const dict = {
      en: {
        title: "Narodna Rada Fond — Home",
        enclex: "ENC-LEX",
        publications: "PUBLICATIONS",
        ukraine_support: "UKRAINE SUPPORT",
        brand_name: "Narodna Rada Fond",
        brand_tag: "National Development Fund",
        menu_enclex: "ENC-LEX ▾",
        menu_publications: "PUBLICATIONS ▾",
        menu_ukraine: "UKRAINE SUPPORT ▾",
        treaty: "Treaty",
        legal_acts: "Legal Acts",
        case_law: "Case Law",
        annual_report: "Annual Report",
        studies: "Studies",
        initiatives: "Initiatives",
        updates: "Updates",
        login: "Login",
        search: "Search",
        headline_l1: "UNITING EUROPE'S",
        headline_l2: "ENERGY, TODAY!",
        our_mission: "OUR MISSION ▸",
        news: "NEWS",
        all_news: "All news",
        news1_h: "Regulators drove progress on electricity market coupling",
        news1_p: "Brief teaser text to simulate a real post.",
        news2_h: "Stronger regulators key to accelerate reforms",
        news2_p: "Another short abstract goes here.",
        read_more: "Read more →",
        footer_copy: "© 2025 BrandName — All rights reserved"
      },
      uk: {
        title: "Narodna Rada Fond — Головна",
        enclex: "ENC-LEX",
        publications: "ПУБЛІКАЦІЇ",
        ukraine_support: "ПІДТРИМКА УКРАЇНИ",
        brand_name: "Narodna Rada Fond",
        brand_tag: "Національний фонд розвитку",
        menu_enclex: "ENC-LEX ▾",
        menu_publications: "ПУБЛІКАЦІЇ ▾",
        menu_ukraine: "ПІДТРИМКА УКРАЇНИ ▾",
        treaty: "Договір",
        legal_acts: "Нормативні акти",
        case_law: "Судова практика",
        annual_report: "Річний звіт",
        studies: "Дослідження",
        initiatives: "Ініціативи",
        updates: "Оновлення",
        login: "Увійти",
        search: "Пошук",
        headline_l1: "ЄДНАЄМО ЕНЕРГІЮ",
        headline_l2: "ЄВРОПИ, СЬОГОДНІ!",
        our_mission: "НАША МІСІЯ ▸",
        news: "НОВИНИ",
        all_news: "Усі новини",
        news1_h: "Регулятори просунулися у куплінгу ринку електроенергії",
        news1_p: "Короткий анонс, щоб змоделювати реальний запис.",
        news2_h: "Сильніші регулятори — ключ до прискорення реформ",
        news2_p: "Ще один короткий підзаголовок.",
        read_more: "Читати далі →",
        footer_copy: "© 2025 BrandName — Усі права захищено"
      }
    };
  
    // helpers
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    function applyLang(lang) {
      const bundle = dict[lang] || dict.en;
  
      // атрибут lang на <html>
      document.documentElement.setAttribute("lang", lang);
  
      // елементи з data-i18n -> textContent
      $$("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (bundle[key] != null) el.textContent = bundle[key];
      });
  
      // плейсхолдери (input/textarea)
      $$("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (bundle[key] != null) el.setAttribute("placeholder", bundle[key]);
      });
  
      // зберегти вибір
      localStorage.setItem("lang", lang);
    }
  
    // ініціалізація
    const saved = localStorage.getItem("lang");
    const initial = saved || (document.documentElement.lang === "uk" ? "uk" : "en");
    applyLang(initial);
  
    // кнопки
    const btnUK = $("#lang-uk");
    const btnEN = $("#lang-en");
    if (btnUK) btnUK.addEventListener("click", () => applyLang("uk"));
    if (btnEN) btnEN.addEventListener("click", () => applyLang("en"));
  })();
  