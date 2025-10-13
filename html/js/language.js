(function(){
  const dict = {
    uk: {
      // header
      home: "Головна",
      about: "Про фонд",
      news: "Новини",
      contacts: "Контакти",

      // index
      hero_l1: "NARODNA RADA FOND",
      hero_l2: "ДЛЯ СИЛЬНОГО МАЙБУТНЬОГО",
      hero_p:  "Прискорюємо розвиток через партнерства, інновації та прозорість.",
      cta_more:"Дізнатись більше ▸",
      cta_contact:"Зв’язатися ▸",
      projects:"Проєкти",
      partnerships:"Партнерства",
      innovation:"Інновації",
      transparency:"Прозорість",
      latest_news:"Останні новини",
      all_news:"Усі новини",

      // about
      about_title:"Про фонд",
      about_text:"Narodna Rada Fond — це платформа, що об’єднує громади, бізнес і державу для сталого розвитку та цифрових змін.",

      // news
      news_title:"Новини",
      news_card1:"NRF запускає програму мікрогрантів для громад",
      news_card2:"Меморандум з інвесторами у ВДЕ",
      news_card3:"Звіт: прозорість закупівель у регіонах",

      // contacts
      contacts_title:"Контакти",
      contacts_hint:"Наведи курсор на відділ, щоб побачити анімацію.",
      contacts_secretariat:"Секретаріат",
      contacts_legal:"Юридичний відділ",
      contacts_comm:"Комунікації",
      contacts_events:"Події",

      // footer
      footer:"© 2025 Narodna Rada Fond — Усі права захищено"
    },
    en: {
      // header
      home: "Home",
      about: "About",
      news: "News",
      contacts: "Contacts",

      // index
      hero_l1: "NARODNA RADA FOND",
      hero_l2: "FOR A STRONGER FUTURE",
      hero_p:  "Accelerating development through partnerships, innovation and transparency.",
      cta_more:"Learn more ▸",
      cta_contact:"Contact us ▸",
      projects:"Projects",
      partnerships:"Partnerships",
      innovation:"Innovation",
      transparency:"Transparency",
      latest_news:"Latest news",
      all_news:"All news",

      // about
      about_title:"About",
      about_text:"Narodna Rada Fond unites communities, businesses and the state to foster sustainable development and digital transformation.",

      // news
      news_title:"News",
      news_card1:"NRF launches micro-grant program for communities",
      news_card2:"Memorandum with renewable energy investors",
      news_card3:"Report: procurement transparency in regions",

      // contacts
      contacts_title:"Contacts",
      contacts_hint:"Hover over a department to see the animation.",
      contacts_secretariat:"Secretariat",
      contacts_legal:"Legal Affairs",
      contacts_comm:"Communications",
      contacts_events:"Events",

      // footer
      footer:"© 2025 Narodna Rada Fond — All rights reserved"
    }
  };

  const $$ = s => Array.from(document.querySelectorAll(s));
  function apply(lang){
    const pack = dict[lang] || dict.en;
    $$("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }

  const saved = localStorage.getItem("lang") || "uk";
  apply(saved);
  document.getElementById("lang-uk")?.addEventListener("click",()=>apply("uk"));
  document.getElementById("lang-en")?.addEventListener("click",()=>apply("en"));
})();
