(function() {
    const dict = {
        uk: {
            // header
            home: "Головна",
            about: "Про фонд",
            news: "Новини",
            contacts: "Контакти",
            enc_lex: "ENC-LEX ▾",
            publications: "Publications ▾",
            ukraine_support: "Ukraine Support ▾",
            login: "Login",
            search: "🔍",
            menu: "Меню",

            // hero section
            hero_l1: "NARODNA RADA FOND",
            hero_l2: "ДЛЯ СИЛЬНОГО МАЙБУТНЬОГО",
            hero_p: "Прискорюємо розвиток через партнерства, інновації та прозорість.",
            cta_more: "Дізнатись більше ▸",
            cta_contact: "Зв’язатися ▸",

            // features
            projects: "Проєкти",
            partnerships: "Партнерства",
            innovation: "Інновації",
            transparency: "Прозорість",

            // about page
            about_title: "Про фонд",
            about_text: "Narodna Rada Fond — це платформа, що об’єднує громади, бізнес і державу для сталого розвитку та цифрових змін.",

            // news page
            news_title: "Новини",
            news_card1: "NRF запускає програму мікрогрантів для громад",
            news_card2: "Меморандум з інвесторами у ВДЕ",
            news_card3: "Звіт: прозорість закупівель у регіонах",

            // contact page
            contacts_title: "Контакти",
            contacts_hint: "Наведи курсор на відділ, щоб побачити анімацію.",
            contacts_secretariat: "Секретаріат",
            contacts_legal: "Юридичний відділ",
            contacts_comm: "Комунікації",
            contacts_events: "Відкрита Трибуна",

            // footer
            footer: "© 2025 Narodna Rada Fond — Усі права захищено",

            // contracting page
            contracting_parties: "Contracting Parties",

            // ecrb page
            ecrb: "ECRB",

            // secretariat page
            secretariat_title: "Secretariat",
            secretariat_description: "Information about the secretariat of the Narodna Rada Fond.",

            // topics page
            topics: "Topics",

            // events page
            events: "Events",

            // publications page
            publications: "Publications",

            // news post page
            post_title: "News Article",
            post_date: "Дата",
            post_country: "Країна",
            post_category: "Категорія",
            post_content: "Текст новини",

            // pagination
            all_news: "Усі новини"
        },
        en: {
            // header
            home: "Home",
            about: "About",
            news: "News",
            contacts: "Contacts",
            enc_lex: "ENC-LEX ▾",
            publications: "Publications ▾",
            ukraine_support: "Ukraine Support ▾",
            login: "Login",
            search: "🔍",
            menu: "Menu",

            // hero section
            hero_l1: "NARODNA RADA FOND",
            hero_l2: "FOR A STRONGER FUTURE",
            hero_p: "Accelerating development through partnerships, innovation, and transparency.",
            cta_more: "Learn more ▸",
            cta_contact: "Contact us ▸",

            // features
            projects: "Projects",
            partnerships: "Partnerships",
            innovation: "Innovation",
            transparency: "Transparency",

            // about page
            about_title: "About",
            about_text: "Narodna Rada Fond unites communities, businesses, and the state to foster sustainable development and digital transformation.",

            // news page
            news_title: "News",
            news_card1: "NRF launches micro-grant program for communities",
            news_card2: "Memorandum with renewable energy investors",
            news_card3: "Report: procurement transparency in regions",

            // contact page
            contacts_title: "Contacts",
            contacts_hint: "Hover over a department to see the animation.",
            contacts_secretariat: "Secretariat",
            contacts_legal: "Legal Affairs",
            contacts_comm: "Communications",
            contacts_events: "Events",

            // footer
            footer: "© 2025 Narodna Rada Fond — All rights reserved",

            // contracting page
            contracting_parties: "Contracting Parties",

            // ecrb page
            ecrb: "ECRB",

            // secretariat page
            secretariat_title: "Secretariat",
            secretariat_description: "Information about the secretariat of the Narodna Rada Fond.",

            // topics page
            topics: "Topics",

            // events page
            events: "Events",

            // publications page
            publications: "Publications",

            // news post page
            post_title: "News Article",
            post_date: "Date",
            post_country: "Country",
            post_category: "Category",
            post_content: "News content",

            // pagination
            all_news: "All news"
        }
    };

    const $$ = s => Array.from(document.querySelectorAll(s));

    function apply(lang) {
        const pack = dict[lang] || dict.en;
        $$("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (pack[key] != null) el.textContent = pack[key];
        });
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
    }

    const saved = localStorage.getItem("lang") || "uk";
    apply(saved);
    document.getElementById("lang-uk") ? .addEventListener("click", () => apply("uk"));
    document.getElementById("lang-en") ? .addEventListener("click", () => apply("en"));
})();