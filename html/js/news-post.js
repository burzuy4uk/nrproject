// news-post.js — render article from slug (supports /news/:slug and ?slug=)
document.addEventListener("DOMContentLoaded", async () => {
    const lang = localStorage.getItem("lang") || document.documentElement.lang || "uk";
  
    // slug from /news/:slug or ?slug=
    const params = new URLSearchParams(location.search);
    let slug = params.get("slug");
    if (!slug) {
      const m = location.pathname.match(/\/news\/([^/]+)/);
      slug = m ? decodeURIComponent(m[1]) : null;
    }
  
    const data = await fetch("./data/news.json").then(r=>r.json());
    const post = data.find(x => x.slug === slug);
  
    if (!post) {
      document.getElementById("post-title").textContent = "Article not found";
      return;
    }
  
    const title   = lang==='uk' ? (post.title_uk   || post.title_en)   : (post.title_en   || post.title_uk);
    const content = lang==='uk' ? (post.content_uk || post.content_en) : (post.content_en || post.content_uk);
    const excerpt = lang==='uk' ? (post.excerpt_uk || post.excerpt_en) : (post.excerpt_en || post.excerpt_uk);
  
    document.title = `${title} — News`;
    document.getElementById("post-title").textContent = title;
    document.getElementById("post-date").textContent =
      new Date(post.date).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
    document.getElementById("post-country").textContent = post.country;
    document.getElementById("post-category").textContent = post.category;
  
    const holder = document.getElementById("post-content");
    holder.innerHTML = content || `<p>${escapeHTML(excerpt)}</p>`;
  
    // related (same category/country, exclude current)
    const related = data
      .filter(x => x.slug !== post.slug && (x.category===post.category || x.country===post.country))
      .sort((a,b)=>new Date(b.date)-new Date(a.date))
      .slice(0,5);
  
    document.getElementById("related-list").innerHTML = related.map(x => `
      <li>
        <a href="/news/${encodeURIComponent(x.slug)}">
          ${escapeHTML(lang==='uk' ? (x.title_uk||x.title_en) : (x.title_en||x.title_uk))}
        </a>
        <span class="date">${new Date(x.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
      </li>
    `).join("");
  
    function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  });
  