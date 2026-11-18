/* Sidfot – delad komponent för TD och OG (18 nov). Grundformen är TD:s footer; innehållet kommer från
   sajtens config så att båda sajterna ändras på ett ställe. Stil: /ds/components/site-footer.css.
   Användning: <footer class="site-footer" data-site-footer></footer> + renderSiteFooter(el, config). */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const link = (l, cls = "") => `<a${cls ? ` class="${cls}"` : ""} href="${esc(l.href || "#")}"${l.todo ? ` data-todo="${esc(l.todo)}"` : ""}>${esc(l.label)}</a>`;

export function renderSiteFooter(host, cfg) {
  if (!host || !cfg) return;
  host.innerHTML = `
      <div class="site-footer-inner">
        <div class="site-footer-top">
          <div class="site-footer-brand">
            <img src="${esc(cfg.logo.src)}" alt="${esc(cfg.logo.alt)}" width="${cfg.logo.width}" height="${cfg.logo.height}">
            <p class="td-heading-sm">${esc(cfg.tagline)}</p>
            ${link(cfg.cta, "td-button td-button-secondary td-button-md")}
          </div>
          <nav class="site-footer-nav" aria-label="Sidfot">
            ${cfg.columns.map((col) => `
            <div>
              <h2>${esc(col.title)}</h2>
              <ul>
                ${col.links.map((l) => `<li>${link(l)}</li>`).join("\n                ")}
              </ul>
            </div>`).join("")}
          </nav>
        </div>
        <div class="site-footer-rule"></div>
        <div class="site-footer-bottom">
          <p class="td-ui-body-sm">${esc(cfg.copyright)}</p>
          <ul class="site-footer-legal">
            ${cfg.legal.map((l) => `<li>${link(l, "td-ui-body-sm")}</li>`).join("\n            ")}
          </ul>
        </div>
      </div>`;
}
