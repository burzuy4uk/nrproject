// news.js — список + фільтри + пошук + пагінація + красиві URL
document.addEventListener("DOMContentLoaded", () => {
    const PAGE_SIZE = 6;
  
    const els = {
      list: document.getElementById("news-list"),
      feed: document.getElementById("sidebar-feed"),
      pag:  document.getElementById("pagination"),
      country: document.getElementById("filter-country"),
      year:    document.getElementById("filter-year"),
      cat:     document.getElementById("filter-category"),
      q:       document.getElementById("filter-q"),
      reset:   document.getElementById("reset-filters"),
    };
  
    let data = [];
    let view = { country: "", year: "", cat: "", q: "", page: 1 };
  
    init();
  
    async function init() {
      data = await fetch("/data/news.json").then(r => r.json());
  
      // заповнити селекти
      fillSelect(els.country, uniq(data.map(x => x.country)).sort());
      fillSelect(els.year,    uniq(data.map(x => new Date(x.date).getFullYear())).sort((a,b)=>b-a));
      fillSelect(els.cat,     uniq(data.map(x => x.category)).sort());
  
      // прочитати URL (query + route /news/page/N)
      const params = new URLSearchParams(location.search);
      const pageMatch = location.pathname.match(/\/news\/page\/(\d+)/);
  
      view.country = params.get("country") || "";
      view.year    = params.get("year") || "";
      view.cat     = params.get("category") || "";
      view.q       = params.get("q") || "";
      view.page    = pageMatch ? Number(pageMatch[1]) : Number(params.get("page") || 1);
  
      els.country.value = view.country;
      els.year.value    = view.year;
      els.cat.value     = view.cat;
      els.q.value       = view.q;
  
      attachEvents();
      renderAll();
    }
  
    function attachEvents(){
      const onChange = () => { view.page = 1; syncURL(); renderAll(); };
  
      els.country.addEventListener("change", e => { view.country = e.target.value; onChange(); });
      els.year.addEventListener("change",    e => { view.year    = e.target.value; onChange(); });
      els.cat.addEventListener("change",     e => { view.cat     = e.target.value; onChange(); });
  
      els.q.addEventListener("input", debounce(() => {
        view.q = els.q.value.trim();
        view.page = 1;
        syncURL();
        renderAll();
      }, 180));
  
      els.reset.addEventListener("click", () => {
        view = { country:"", year:"", cat:"", q:"", page:1 };
        [els.country, els.year, els.cat].forEach(s => s.value="");
        els.q.value = "";
        syncURL();
        renderAll();
      });
    }
  
    function renderAll(){
      const filtered = data
        .filter(x =>
          (!view.country || x.country === view.country) &&
          (!view.year || new Date(x.date).getFullYear().toString() === view.year) &&
          (!view.cat || x.category === view.cat)
        )
        .filter(x => {
          if (!view.q) return true;
          const q = view.q.toLowerCase();
          return title(x).toLowerCase().includes(q) || excerpt(x).toLowerCase().includes(q);
        })
        .sort((a,b) => new Date(b.date) - new Date(a.date));
  
      // сайдбар
      els.feed.innerHTML = filtered.slice(0,5).map(item => `
        <li>
          <a href="${postUrl(item.slug)}">${escapeHTML(title(item))}</a>
          <span class="date">${fmtDate(item.date)}</span>
        </li>
      `).join("");
  
      // пагінація
      const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (view.page > pages) view.page = pages;
      const start = (view.page - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);
  
      // список
      els.list.innerHTML = pageItems.map(item => `
        <article class="card-article">
          <h3 class="title">${escapeHTML(title(item))}</h3>
          <p class="excerpt">${escapeHTML(excerpt(item))}</p>
          <div class="meta">
            <span>${fmtDate(item.date)}</span>
            <span class="chip">${escapeHTML(item.country)}</span>
            <span class="chip">${escapeHTML(item.category)}</span>
          </div>
          <a class="more" href="${postUrl(item.slug)}">Read more →</a>
        </article>
      `).join("");
  
      // контрол пагінації
      els.pag.innerHTML = pagerHTML(pages, view.page);
      els.pag.querySelectorAll("[data-page]").forEach(btn => {
        btn.addEventListener("click", () => {
          view.page = Number(btn.dataset.page);
          syncURL();
          renderAll();
          window.scrollTo({top: 0, behavior: "smooth"});
        });
      });
    }
  
    // допоміжні
    function title(it){ return (getLang()==='uk' ? it.title_uk : it.title_en) || it.title_en; }
    function excerpt(it){ return (getLang()==='uk' ? it.excerpt_uk : it.excerpt_en) || it.excerpt_en; }
    const getLang = () => localStorage.getItem("lang") || document.documentElement.lang || "uk";
    const postUrl = slug => `/news/${encodeURIComponent(slug)}`;
  
    function pagerHTML(pages,current){
      if (pages<=1) return "";
      let out = `<button class="page-btn" ${current===1?'disabled':''} data-page="${current-1}">‹</button>`;
      for (let p=1;p<=pages;p++) out += `<button class="page-btn ${p===current?'active':''}" data-page="${p}">${p}</button>`;
      out += `<button class="page-btn" ${current===pages?'disabled':''} data-page="${current+1}">›</button>`;
      return out;
    }
  
    function syncURL(){
      const q = new URLSearchParams();
      if (view.country) q.set("country", view.country);
      if (view.year)    q.set("year", view.year);
      if (view.cat)     q.set("category", view.cat);
      if (view.q)       q.set("q", view.q);
  
      const base = view.page>1 ? `/news/page/${view.page}` : `/news`;
      const url = q.toString() ? `${base}?${q.toString()}` : base;
      history.replaceState(null, "", url);
    }
  
    function fillSelect(sel, values){
      values.forEach(v => {
        const o = document.createElement("option");
        o.value = o.textContent = v;
        sel.appendChild(o);
      });
    }
  
    const uniq = arr => [...new Set(arr)];
    const fmtDate = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
    const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }
  });
  