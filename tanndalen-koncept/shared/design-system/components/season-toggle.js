/**
 * SeasonToggle — globalt säsongsläge winter | summer.
 * State: documentElement[data-season] (+ body), localStorage via site options.
 * Montera: <div data-season-toggle="labeled|icon"></div> + initSeasonToggles().
 * Prefix och copy måste sättas via configureSeasonToggle / initSeasonToggles options.
 */

const DEFAULT_SEASON = "winter";
const SEASONS = Object.freeze(["winter", "summer"]);

const defaults = Object.freeze({
  storagePrefix: "",
  labels: Object.freeze({ winter: "Vinter", summer: "Sommar" }),
  groupLabel: "Säsong",
  switchLabel: "Byt säsong"
});

let config = {
  storagePrefix: defaults.storagePrefix,
  labels: { ...defaults.labels },
  groupLabel: defaults.groupLabel,
  switchLabel: defaults.switchLabel
};

const listeners = new Set();
let current = DEFAULT_SEASON;
let bootstrapped = false;

function storageKey() {
  const prefix = String(config.storagePrefix || "").replace(/-+$/, "");
  return prefix ? `${prefix}-season` : "season";
}

export function configureSeasonToggle(options = {}) {
  if (options.storagePrefix != null) config.storagePrefix = String(options.storagePrefix);
  if (options.storageKey != null) {
    const key = String(options.storageKey);
    config.storagePrefix = key.endsWith("-season") ? key.slice(0, -"-season".length) : key;
  }
  if (options.labels && typeof options.labels === "object") {
    config.labels = {
      winter: options.labels.winter ?? config.labels.winter,
      summer: options.labels.summer ?? config.labels.summer
    };
  }
  if (options.groupLabel != null) config.groupLabel = String(options.groupLabel);
  if (options.switchLabel != null) config.switchLabel = String(options.switchLabel);
  return { ...config, storageKey: storageKey() };
}

function normalize(value) {
  if (value === "summer" || value === "sommar") return "summer";
  if (value === "winter" || value === "vinter") return "winter";
  return null;
}

function readStored() {
  try {
    return normalize(localStorage.getItem(storageKey()));
  } catch {
    return null;
  }
}

function writeStored(season) {
  try {
    localStorage.setItem(storageKey(), season);
  } catch {
    /* localStorage kan saknas — sidan fungerar med förval */
  }
}

function applySeasonContent(season) {
  const isSummer = season === "summer";

  document.querySelectorAll("[data-title-vinter]").forEach((node) => {
    const next = isSummer
      ? node.dataset.titleSommar || node.dataset.titleVinter
      : node.dataset.titleVinter;
    if (next != null) node.textContent = next;
  });

  document.querySelectorAll("[data-src-vinter]").forEach((img) => {
    const next = isSummer
      ? img.dataset.srcSommar || img.dataset.srcVinter
      : img.dataset.srcVinter;
    if (next) img.src = next;
  });

  document.querySelectorAll("[data-season-list]").forEach((list) => {
    const listSeason = normalize(list.dataset.seasonList);
    list.hidden = Boolean(listSeason) && listSeason !== season;
  });

  /* Saknas sommarinnehåll i en menygrupp: visa vinterlistan. */
  document.querySelectorAll(".site-menu-sub-clip").forEach((clip) => {
    const lists = [...clip.querySelectorAll("[data-season-list]")];
    if (!lists.length) return;
    if (lists.some((list) => !list.hidden)) return;
    const winter = lists.find((list) => normalize(list.dataset.seasonList) === "winter");
    if (winter) winter.hidden = false;
  });

  /* Säsongsbyte: fäll ihop öppna undermenyer. */
  document.querySelectorAll(".site-menu-sub.is-open").forEach((sub) => {
    sub.classList.remove("is-open");
    const clip = sub.querySelector(".site-menu-sub-clip");
    if (clip) clip.inert = true;
    sub.parentElement?.querySelector(".site-menu-chevron")?.setAttribute("aria-expanded", "false");
  });

  const ski = document.querySelector('[data-key="skida"] .site-menu-chevron');
  if (ski) {
    const title =
      season === "summer"
        ? document.querySelector('[data-key="skida"] [data-title-vinter]')?.dataset.titleSommar ||
          "Cykling"
        : document.querySelector('[data-key="skida"] [data-title-vinter]')?.dataset.titleVinter ||
          "Skidåkning";
    ski.setAttribute("aria-label", `Visa undersidor för ${title}`);
  }

  /* Sync legacy site-season controls if still present */
  document.querySelectorAll(".site-season [data-season]").forEach((button) => {
    const value = normalize(button.dataset.season);
    button.setAttribute("aria-pressed", String(value === season));
  });
}

function syncToggle(root, season) {
  root.dataset.season = season;
  root.querySelectorAll('[role="radio"]').forEach((option) => {
    const value = normalize(option.dataset.season);
    const checked = value === season;
    option.setAttribute("aria-checked", String(checked));
    option.tabIndex = checked ? 0 : -1;
  });
}

function paintAllToggles(season) {
  document.querySelectorAll(".td-season-toggle").forEach((root) => syncToggle(root, season));
}

export function applySeasonToDocument(season) {
  const next = normalize(season) || DEFAULT_SEASON;
  document.documentElement.dataset.season = next;
  if (document.body) document.body.dataset.season = next;
  applySeasonContent(next);
  paintAllToggles(next);
  return next;
}

export function getSeason() {
  return current;
}

export function setSeason(next, { persist = true } = {}) {
  const season = normalize(next) || DEFAULT_SEASON;
  current = season;
  applySeasonToDocument(season);
  if (persist) writeStored(season);
  listeners.forEach((fn) => {
    try {
      fn(season);
    } catch {
      /* listener errors should not break season */
    }
  });
  return season;
}

export function subscribeSeason(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function bootstrapSeason() {
  if (bootstrapped) return current;
  bootstrapped = true;
  /* localStorage vinner över HTML-förval (data-season i markup). */
  current = readStored() || normalize(document.documentElement.dataset.season) || normalize(document.body?.dataset?.season) || DEFAULT_SEASON;
  applySeasonToDocument(current);
  return current;
}

function onKeydown(event) {
  const option = event.currentTarget;
  const root = option.closest(".td-season-toggle");
  if (!root) return;
  const options = [...root.querySelectorAll('[role="radio"]')];
  const index = options.indexOf(option);
  if (index < 0) return;

  let nextIndex = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    nextIndex = (index + 1) % options.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    nextIndex = (index - 1 + options.length) % options.length;
  } else if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    setSeason(option.dataset.season);
    return;
  } else {
    return;
  }

  const next = options[nextIndex];
  setSeason(next.dataset.season);
  next.focus();
}

function buildOption(season, variant) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "td-season-toggle-option";
  button.dataset.season = season;
  button.setAttribute("role", "radio");
  button.setAttribute("aria-checked", "false");
  button.tabIndex = -1;

  if (variant === "icon") {
    button.setAttribute("aria-label", config.labels[season]);
    button.dataset.tooltip = config.labels[season];
  }

  const glyph = document.createElement("span");
  glyph.className = "td-season-toggle-glyph";
  glyph.setAttribute("aria-hidden", "true");
  button.append(glyph);

  const text = document.createElement("span");
  text.className = "td-season-toggle-text";
  text.textContent = config.labels[season];
  button.append(text);

  button.addEventListener("click", () => setSeason(season));
  button.addEventListener("keydown", onKeydown);
  return button;
}

export function mountSeasonToggle(host) {
  if (!(host instanceof Element)) return null;
  if (host.dataset.seasonMounted === "true") {
    return host.querySelector(".td-season-toggle");
  }

  const variant = host.dataset.seasonToggle === "icon" || host.dataset.variant === "icon"
    ? "icon"
    : "labeled";

  host.dataset.seasonMounted = "true";
  host.classList.add("td-season-toggle-host", `td-season-toggle-host--${variant}`);
  if (variant === "labeled") host.classList.add("td-season-toggle-group");

  let label = null;
  if (variant === "labeled") {
    label = document.createElement("p");
    label.className = "td-season-toggle-label td-ui-body-sm";
    label.id = `td-season-label-${Math.random().toString(36).slice(2, 9)}`;
    label.textContent = config.switchLabel;
    host.append(label);
  }

  const root = document.createElement("div");
  root.className = `td-season-toggle td-season-toggle--${variant}`;
  root.setAttribute("role", "radiogroup");
  root.setAttribute("aria-label", config.groupLabel);
  if (label) root.setAttribute("aria-labelledby", label.id);

  const thumb = document.createElement("span");
  thumb.className = "td-season-toggle-thumb";
  thumb.setAttribute("aria-hidden", "true");
  root.append(thumb);

  SEASONS.forEach((season) => root.append(buildOption(season, variant)));
  host.append(root);

  syncToggle(root, current);
  return root;
}

export function initSeasonToggles(scope = document, options) {
  if (options) configureSeasonToggle(options);
  bootstrapSeason();
  scope.querySelectorAll("[data-season-toggle]").forEach((host) => mountSeasonToggle(host));
  return current;
}
