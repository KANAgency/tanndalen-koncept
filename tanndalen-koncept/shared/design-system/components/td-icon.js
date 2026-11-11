/* <td-icon name="boende" size="32"> loads components/icons/content/{name}-{size}.svg
   Utility icons (16px) live in components/icons/utility/{name}.svg and ignore size.
   Sized utility icons live in components/icons/utility/{name}-{size}.svg. */

const UTILITY = new Set([
  "arrow-left", "arrow-right", "arrow-up-right", "chevron-down", "chevron-up", "chevron-right",
  "close", "menu", "search", "calendar", "plus", "minus", "check", "info", "external-link",
  "map-pin-area",
]);

const SIZED_UTILITY = new Set(["map-pin-area"]);

const NAMED = {
  snowflake: "season-snowflake-24.svg",
  sun: "season-sun-24.svg",
};

class TdIcon extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name");
    const size = this.getAttribute("size") || (UTILITY.has(name) ? "16" : "24");
    const file = NAMED[name]
      ? NAMED[name]
      : SIZED_UTILITY.has(name)
        ? `utility/${name}-${size}.svg`
        : UTILITY.has(name)
          ? `utility/${name}.svg`
          : `content/${name}-${size}.svg`;
    fetch(new URL(`icons/${file}`, import.meta.url))
      .then((r) => r.text())
      .then((svg) => {
        this.innerHTML = svg;
        const el = this.querySelector("svg");
        if (!el) return;
        el.setAttribute("width", size);
        el.setAttribute("height", size);
        el.setAttribute("aria-hidden", "true");
      });
  }
}

customElements.define("td-icon", TdIcon);
