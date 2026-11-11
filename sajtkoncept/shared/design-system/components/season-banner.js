import "./td-icon.js";

/** Ikonpar per mode — copy kommer via mount-options från sajten. */
const ICONS = {
  winter: ["snowflake", "arrow-right", "sun"],
  summer: ["sun", "arrow-right", "snowflake"]
};

export function mountSeasonBanner(host, { mode = "winter", image, onSwitch, copy } = {}) {
  if (!copy?.winter || !copy?.summer) {
    throw new Error("mountSeasonBanner: copy.winter and copy.summer are required");
  }
  host.classList.add("td-season-banner");
  host.replaceChildren();
  const copyEl = document.createElement("div");
  copyEl.className = "td-season-banner-copy";
  const text = document.createElement("div");
  text.className = "td-season-banner-text";
  const title = document.createElement("p");
  title.className = "td-season-banner-title td-heading-xxs-regular";
  const lead = document.createElement("p");
  lead.className = "td-season-banner-lead td-ui-caption";
  text.append(title, lead);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "td-season-banner-link td-ui-cta-sm";
  copyEl.append(text, button);
  const media = document.createElement("div");
  media.className = "td-season-banner-media";
  const img = document.createElement("img");
  img.alt = "";
  media.append(img);
  const icons = document.createElement("div");
  icons.className = "td-season-banner-icons";
  icons.setAttribute("aria-hidden", "true");
  host.append(copyEl, media, icons);

  function paint(next) {
    const data = copy[next] || copy.winter;
    host.dataset.mode = next;
    title.textContent = data.title;
    lead.textContent = data.lead;
    button.textContent = data.action;
    const src = image && image[next];
    if (src) {
      img.hidden = false;
      img.src = src;
      media.hidden = false;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
      media.hidden = false;
    }
    icons.replaceChildren(...(ICONS[next] || ICONS.winter).map((name) => {
      const icon = document.createElement("td-icon");
      icon.setAttribute("name", name);
      icon.setAttribute("size", "20");
      return icon;
    }));
  }

  button.addEventListener("click", () => onSwitch?.());
  paint(mode);
  return { setMode: paint };
}
