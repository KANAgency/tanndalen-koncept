/* View modes. Overrides only. Priority: onsite > booking > returning > new. */
import { onsiteStorageKey, stayStorageKey, wifiOnsiteSignal } from "./site-config.js";
import {
  DEMO_STAY,
  demoToday,
  loadTodayOverride,
  lookupStay,
  setTodayOverride,
  statusLabel,
  stayStatus,
  stayToStorage
} from "./demo-stay.js";

const BASE_MODES = ["new", "returning", "booking"];
const MODES = [...BASE_MODES, "onsite"];

/* TODO: demo content, confirm with Tänndalen */
/* TODO: time for Utrustning and Utcheckning are placeholders, confirm with Tänndalen */
const BOOKING_CALENDAR = {
  range: "12–19 feb · 2027",
  groups: [
    {
      date: "2027-02-12",
      rows: [
        { time: "12:00", title: "Checka in på Ski Lodge Premium" },
        { time: "14:00", title: "Utrustning redo", link: "Se var" }
      ]
    },
    {
      date: "2027-02-13",
      rows: [
        { time: "11:00", title: "Pond skim i Hamra" }
      ]
    },
    {
      date: "2027-02-14",
      rows: [
        { time: "10:00", title: "Hundspann från Hamra" },
        { time: "19:00", title: "Fondue i Fjällkåtan" }
      ]
    },
    /* TODO: restore when the card can hold them.
    {
      label: "Resten av veckan",
      rows: [
        { time: "mån–fre", title: "Skidskola, barn 4–6 år", from: "2027-02-15", to: "2027-02-19" },
        { time: "ons 17", title: "Fackeltåg i byn", date: "2027-02-17" }
      ]
    },
    { time: "18–21", title: "Kvällsskidåkning" },
    { time: "16:00", title: "Afterski" },
    */
    {
      date: "2027-02-19",
      rows: [
        { time: "10:00", title: "Utcheckning" }
      ]
    }
  ]
};

export function modes() {
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR }, onsite: {} };
}

function endOfLocalDay(from = new Date()) {
  const d = new Date(from);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function readOnsite() {
  try {
    const raw = localStorage.getItem(onsiteStorageKey());
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.value !== "boolean") return null;
    if (typeof data.until === "number" && Date.now() > data.until) {
      localStorage.removeItem(onsiteStorageKey());
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}

function writeOnsite(state) {
  try {
    if (!state) localStorage.removeItem(onsiteStorageKey());
    else localStorage.setItem(onsiteStorageKey(), JSON.stringify(state));
  } catch (err) {}
}

function readStay() {
  try {
    const raw = localStorage.getItem(stayStorageKey());
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function writeStay(stay) {
  try {
    if (!stay) localStorage.removeItem(stayStorageKey());
    else localStorage.setItem(stayStorageKey(), JSON.stringify(stayToStorage(stay)));
  } catch (err) {}
}

function stayCoversToday(stay) {
  if (!stay?.checkIn || !stay?.checkOut) return false;
  const today = demoToday();
  return today >= stay.checkIn && today <= stay.checkOut;
}

function untilForOnsite(stay) {
  if (stay?.checkOut) {
    const end = new Date(`${stay.checkOut}T23:59:59`);
    if (!Number.isNaN(end.getTime())) return end.getTime();
  }
  return endOfLocalDay();
}

function baseModeFromDom() {
  const mode = document.documentElement.dataset.baseMode || document.documentElement.dataset.mode;
  return BASE_MODES.includes(mode) ? mode : "returning";
}

function setBaseMode(next) {
  if (!BASE_MODES.includes(next)) return;
  document.documentElement.dataset.baseMode = next;
  try { localStorage.setItem("td-mode", next); } catch (err) {}
}

function applyEffectiveMode(reloadIntro) {
  const onsite = isOnsiteActive();
  const base = baseModeFromDom();
  const effective = onsite ? "onsite" : base;
  const current = document.documentElement.dataset.mode;
  const introFlip = (current === "new") !== (effective === "new");
  if ((introFlip || reloadIntro) && effective !== "onsite" && current !== "onsite") {
    try { localStorage.setItem("td-mode", effective); } catch (err) {}
    const url = new URL(location.href);
    url.searchParams.set("mode", effective);
    url.searchParams.delete("visit");
    location.assign(url.pathname + url.search + url.hash);
    return;
  }
  document.documentElement.dataset.mode = effective;
  if (effective === "onsite" || effective === "returning" || effective === "booking") {
    document.documentElement.classList.add("is-returning");
    document.documentElement.classList.remove("is-intro");
    document.body.classList.add("is-returning");
    document.body.classList.remove("is-intro");
  }
  const url = new URL(location.href);
  if (onsite) url.searchParams.set("mode", "onsite");
  else url.searchParams.set("mode", base);
  url.searchParams.delete("visit");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
  applyBooking();
  applyOnsitePage();
  syncOnsiteUi();
  document.dispatchEvent(new CustomEvent("td-mode", { detail: { mode: effective, onsite, base } }));
}

export function isOnsiteActive() {
  const state = readOnsite();
  return Boolean(state?.value);
}

/** Manual always wins until `until`. Turning off blocks auto for the same day. */
export function setOnsite(value, source = "manual") {
  const stay = readStay();
  if (value) {
    writeOnsite({ value: true, source, until: untilForOnsite(stay) });
  } else {
    writeOnsite({ value: false, source: "manual", until: endOfLocalDay() });
  }
  applyEffectiveMode(false);
}

function canAutoEnable() {
  const state = readOnsite();
  if (!state) return true;
  if (state.source === "manual" && state.value === false && Date.now() <= state.until) return false;
  if (state.value === true) return false;
  return true;
}

function tryAutoOnsite() {
  /* wifiOnsiteSignal is a documented hook only — browsers cannot detect resort Wi‑Fi. */
  void wifiOnsiteSignal;
  if (!canAutoEnable()) return;
  const params = new URLSearchParams(location.search);
  const fromPlats = params.get("plats") === "1";
  const fromStay = stayCoversToday(readStay());
  if (!fromPlats && !fromStay) return;
  writeOnsite({ value: true, source: "auto", until: untilForOnsite(readStay()) });
}

function weekdayLabel(iso) {
  const date = new Date(`${iso}T12:00:00`);
  const day = new Intl.DateTimeFormat("sv-SE", { weekday: "short" }).format(date).replace(".", "");
  const rest = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" }).format(date).replace(".", "");
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} ${rest}`;
}

function winterBooking() {
  return document.documentElement.dataset.mode === "booking" && document.documentElement.dataset.season !== "summer";
}

function alpineOn() {
  const button = document.querySelector("[data-gren='alpint']");
  return !button || button.getAttribute("aria-pressed") === "true";
}

function markDone(button, on) {
  if (!button) return;
  button.classList.toggle("is-done", on);
  if (on && !button.querySelector(".mode-booking-check")) {
    const mark = document.createElement("span");
    mark.className = "mode-booking-check";
    mark.innerHTML = `<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="13" fill="currentColor"/><path d="M7 13.4l4 4.1L19 9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    button.querySelector(".booking-icon-slot")?.append(mark);
  }
}

function calendarHtml() {
  const arrow = `<svg class="td-pagang-row-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9 4l5 4-5 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  return BOOKING_CALENDAR.groups.map((group) => {
    const name = group.date ? weekdayLabel(group.date) : group.label;
    const rows = group.rows.map((row, i) => {
      const divider = i < group.rows.length - 1 ? `<hr class="td-pagang-divider">` : "";
      /* TODO: placeholder href until the pickup place exists. */
      const where = row.link ? ` <a class="mode-booking-where" href="#">${row.link}</a>` : "";
      return `<div class="td-pagang-row"><span class="td-pagang-row-main"><span class="td-pagang-row-text"><span class="td-ui-figure-sm-regular">${row.time}</span><span class="td-ui-body">${row.title}${where}</span></span>${arrow}</span>${divider}</div>`;
    }).join("");
    return `<section><h3 class="td-pagang-group-name td-ui-nav">${name}</h3>${rows}</section>`;
  }).join("");
}

let baseGroups = "";
let baseTitle = "";
let tooltip = null;
let tipClosed = false;

function ensureTooltip() {
  const bar = document.getElementById("booking");
  if (!bar || tooltip) return tooltip;
  tooltip = document.createElement("div");
  tooltip.className = "mode-booking-tip";
  tooltip.setAttribute("role", "note");
  tooltip.innerHTML = `<p class="mode-booking-tip-title">Liftkort nästa</p><p class="mode-booking-tip-body">Boendet är på plats. Var redo för backen och köp liftkorten nu.</p><button class="mode-booking-tip-close" type="button" aria-label="Stäng">×</button><span class="mode-booking-tip-arrow" aria-hidden="true"></span>`;
  tooltip.querySelector(".mode-booking-tip-close").addEventListener("click", () => {
    tipClosed = true;
    tooltip.hidden = true;
  });
  bar.append(tooltip);
  return tooltip;
}

function placeTooltip() {
  const tip = ensureTooltip();
  const bar = document.getElementById("booking");
  const item = document.querySelector("#booking-cats button[aria-label='Liftkort']");
  if (!tip || !bar || !item || tip.hidden) return;
  const barBox = bar.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  const center = itemBox.left + itemBox.width / 2 - barBox.left;
  const declared = parseFloat(getComputedStyle(tip).getPropertyValue("--tooltip-w")) || 525;
  const width = Math.min(declared, window.innerWidth - 32);
  let left = center - width / 2;
  const barLeft = barBox.left;
  if (barLeft + left < 16) left = 16 - barLeft;
  if (barLeft + left + width > window.innerWidth - 16) left = window.innerWidth - 16 - width - barLeft;
  tip.style.width = `${width}px`;
  tip.style.left = `${left}px`;
  tip.style.setProperty("--tip-arrow", "50%");
}

function applyBooking() {
  const on = winterBooking();
  const boende = document.querySelector("#booking-cats button[aria-label='Boende']");
  const lift = document.querySelector("#booking-cats button[aria-label='Liftkort']");
  const pill = document.querySelector("#booking-cats .td-booking-pill");
  const tip = ensureTooltip();
  markDone(boende, on);
  markDone(document.querySelector("#booking-cats button[aria-label='Skidhyra']"), on);
  if (tip) {
    if (!on) tipClosed = false;
    tip.hidden = !on || tipClosed;
  }
  if (pill && !on && lift?.getAttribute("aria-pressed") !== "true") {
    const pressed = document.querySelector("#booking-cats > button[aria-pressed='true']");
    if (!pressed) pill.hidden = true;
  }
  const groups = document.querySelector(".just-nu .td-pagang-groups");
  const title = document.querySelector(".just-nu .td-pagang .td-ui-title");
  if (groups && !baseGroups) {
    baseGroups = groups.innerHTML;
    baseTitle = title ? title.textContent : "";
  }
  const showCalendar = on && alpineOn();
  if (groups && title && showCalendar) {
    title.textContent = BOOKING_CALENDAR.range;
    groups.innerHTML = calendarHtml();
    groups.dataset.modeCalendar = "booking";
  } else if (groups?.dataset.modeCalendar === "booking") {
    groups.innerHTML = baseGroups;
    if (title) title.textContent = baseTitle;
    delete groups.dataset.modeCalendar;
  }
  placeTooltip();
}

function applyOnsitePage() {
  const on = isOnsiteActive();
  document.documentElement.classList.toggle("is-onsite", on);
  const bar = document.getElementById("booking");
  if (bar) bar.classList.toggle("is-onsite-compact", on);
  document.querySelectorAll("[data-onsite-pill]").forEach((el) => {
    el.hidden = !on;
  });
  document.querySelectorAll("[data-onsite-pill-row]").forEach((el) => {
    el.hidden = !on;
  });
  document.dispatchEvent(new CustomEvent("td-onsite-booking-cats", { detail: { onsite: on } }));
}

function setMode(next, reload) {
  if (!MODES.includes(next)) return;
  if (next === "onsite") {
    setOnsite(true, "manual");
    return;
  }
  /* Leaving onsite via demo selector: manual off for the day. */
  if (isOnsiteActive() || readOnsite()?.value === false) {
    writeOnsite({ value: false, source: "manual", until: endOfLocalDay() });
  } else {
    writeOnsite(null);
  }
  setBaseMode(next);
  const current = document.documentElement.dataset.mode;
  if ((current === "new") !== (next === "new") || reload) {
    try { localStorage.setItem("td-mode", next); } catch (err) {}
    const url = new URL(location.href);
    url.searchParams.set("mode", next);
    url.searchParams.delete("visit");
    location.assign(url.pathname + url.search + url.hash);
    return;
  }
  document.documentElement.dataset.mode = next;
  try { localStorage.setItem("td-mode", next); } catch (err) {}
  const url = new URL(location.href);
  url.searchParams.set("mode", next);
  url.searchParams.delete("visit");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
  applyBooking();
  applyOnsitePage();
  syncOnsiteUi();
}

function syncOnsiteUi() {
  const on = isOnsiteActive();
  document.querySelectorAll("[data-onsite-toggle]").forEach((input) => {
    input.checked = on;
    input.setAttribute("aria-checked", String(on));
  });
  document.querySelectorAll("[data-mode-choice]").forEach((radio) => {
    const choice = radio.dataset.modeChoice;
    const selected = on ? choice === "onsite" : choice === baseModeFromDom();
    radio.setAttribute("aria-checked", String(selected));
    radio.tabIndex = selected ? 0 : -1;
  });
  const todayOpt = document.querySelector("[data-demo-today]");
  if (todayOpt) {
    const active = Boolean(loadTodayOverride());
    todayOpt.setAttribute("aria-pressed", String(active));
  }
  renderAccountUi();
}

function renderAccountUi() {
  const stay = readStay();
  const loggedIn = Boolean(stay);
  const status = stay ? stayStatus(stay) : null;
  const userBtn = document.getElementById("account-user");
  const panel = document.getElementById("account-panel");
  if (!userBtn || !panel) return;
  userBtn.classList.toggle("is-logged-in", loggedIn);
  userBtn.classList.toggle("is-ongoing", status === "ongoing");
  userBtn.setAttribute("aria-label", loggedIn ? "Din vistelse" : "Min bokning");
  const initials = userBtn.querySelector("[data-account-initials]");
  const icon = userBtn.querySelector("[data-account-icon]");
  if (initials) {
    initials.hidden = !loggedIn;
    initials.textContent = stay?.initials || DEMO_STAY.initials;
  }
  if (icon) icon.hidden = loggedIn;
  const loginView = panel.querySelector("[data-account-view='login']");
  const stayView = panel.querySelector("[data-account-view='stay']");
  if (loginView) loginView.hidden = loggedIn;
  if (stayView) stayView.hidden = !loggedIn;
  if (loggedIn && stayView) {
    const statusEl = stayView.querySelector("[data-stay-status]");
    const titleEl = stayView.querySelector("[data-stay-title]");
    const partyEl = stayView.querySelector("[data-stay-party]");
    const checkEl = stayView.querySelector("[data-stay-checkin]");
    const onsiteBtn = stayView.querySelector("[data-stay-onsite]");
    if (statusEl) {
      statusEl.textContent = statusLabel(status, stay);
      statusEl.dataset.status = status;
    }
    if (titleEl) titleEl.textContent = stay.title || DEMO_STAY.title;
    if (partyEl) partyEl.textContent = stay.party || DEMO_STAY.party;
    if (checkEl) checkEl.textContent = stay.checkInTime || DEMO_STAY.checkInTime;
    if (onsiteBtn) onsiteBtn.hidden = isOnsiteActive();
  }
}

function initAccount() {
  const userBtn = document.getElementById("account-user");
  const panel = document.getElementById("account-panel");
  if (!userBtn || !panel) return;
  const setOpen = (open) => {
    panel.hidden = !open;
    userBtn.setAttribute("aria-expanded", String(open));
    document.querySelector(".account-menu")?.classList.toggle("is-open", open);
  };
  userBtn.addEventListener("click", () => {
    setOpen(panel.hidden);
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".account-menu")) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  panel.addEventListener("click", (event) => {
    const fraga = event.target.closest("[data-account-fraga]");
    if (fraga) {
      event.preventDefault();
      setOpen(false);
      document.getElementById("fraga-launch")?.click();
      return;
    }
    const logout = event.target.closest("[data-account-logout]");
    if (logout) {
      event.preventDefault();
      writeStay(null);
      renderAccountUi();
      tryAutoOnsite();
      applyEffectiveMode(false);
      return;
    }
    const onsiteBtn = event.target.closest("[data-stay-onsite]");
    if (onsiteBtn) {
      event.preventDefault();
      setOnsite(true, "manual");
      setOpen(false);
      return;
    }
  });
  const form = panel.querySelector("[data-account-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = form.querySelector("[name='booking-number']")?.value;
    const lastName = form.querySelector("[name='last-name']")?.value;
    const found = lookupStay(number, lastName);
    if (!found) return;
    writeStay(found);
    renderAccountUi();
    tryAutoOnsite();
    applyEffectiveMode(false);
  });
  renderAccountUi();
}

function initOnsiteToggle() {
  document.querySelectorAll("[data-onsite-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      setOnsite(input.checked, "manual");
    });
  });
  document.querySelectorAll("[data-onsite-pill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("td-open-menu", { detail: { focus: "onsite" } }));
    });
  });
}

function initModeSwitch() {
  const root = document.createElement("div");
  root.className = "mode-switch";
  root.innerHTML = `<button class="mode-switch-button" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Visningsläge"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="mode-switch-menu" role="radiogroup" aria-label="Visningsläge" hidden><button type="button" role="radio" data-mode-choice="new">1 Ny besökare</button><button type="button" role="radio" data-mode-choice="returning">2 Återkommande besökare</button><button type="button" role="radio" data-mode-choice="booking">3 Påbörjad bokning<span class="mode-switch-note" hidden> (endast vinter)</span></button><button type="button" role="radio" data-mode-choice="onsite">4 På plats</button><button type="button" data-demo-today aria-pressed="false">Demo: vistelse pågår nu</button></div>`;
  document.body.append(root);
  const button = root.querySelector(".mode-switch-button");
  const menu = root.querySelector(".mode-switch-menu");
  const radios = [...menu.querySelectorAll("[data-mode-choice]")];
  const sync = () => {
    syncOnsiteUi();
    const summer = document.documentElement.dataset.season === "summer";
    const note = menu.querySelector(".mode-switch-note");
    if (note) note.hidden = !summer;
  };
  const close = (focus) => {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (focus) button.focus();
  };
  const open = () => {
    sync();
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    (radios.find((radio) => radio.getAttribute("aria-checked") === "true") || radios[0]).focus();
  };
  button.addEventListener("click", () => { if (menu.hidden) open(); else close(false); });
  radios.forEach((radio, index) => {
    radio.addEventListener("click", () => {
      setMode(radio.dataset.modeChoice, false);
      sync();
      close(true);
    });
    radio.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); close(true); return; }
      let next = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = radios[(index + 1) % radios.length];
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = radios[(index - 1 + radios.length) % radios.length];
      if (!next) return;
      event.preventDefault();
      next.focus();
    });
  });
  menu.querySelector("[data-demo-today]")?.addEventListener("click", () => {
    const on = !loadTodayOverride();
    /* Mid-stay date so status becomes Pågår nu without guessing real GPS/time. */
    setTodayOverride(on ? "2027-02-15" : null);
    if (on && !readStay()) writeStay(DEMO_STAY);
    tryAutoOnsite();
    applyEffectiveMode(false);
    sync();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) { event.preventDefault(); close(true); }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!root.contains(event.target)) close(false);
  });
  document.addEventListener("td-season", () => { sync(); applyBooking(); });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-gren]")) applyBooking();
  });
  window.addEventListener("resize", placeTooltip);
  sync();
}

export function init() {
  loadTodayOverride();
  const params = new URLSearchParams(location.search);
  let modeParam = params.get("mode");
  const current = document.documentElement.dataset.mode;
  if (BASE_MODES.includes(current)) setBaseMode(current);
  else if (BASE_MODES.includes(modeParam)) setBaseMode(modeParam);
  else {
    try {
      const stored = localStorage.getItem("td-mode");
      setBaseMode(BASE_MODES.includes(stored) ? stored : "returning");
    } catch (err) {
      setBaseMode("returning");
    }
  }
  if (modeParam === "onsite") {
    writeOnsite({ value: true, source: "manual", until: untilForOnsite(readStay()) });
  }
  tryAutoOnsite();
  initModeSwitch();
  initOnsiteToggle();
  initAccount();
  applyEffectiveMode(false);
  applyBooking();
}
