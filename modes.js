/* View modes. Overrides only. Mode 4 "På plats" will be added later. */
const MODES = ["new", "returning", "booking"];

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
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR } };
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

function setMode(next, reload) {
  if (!MODES.includes(next)) return;
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
}

export function init() {
  const root = document.createElement("div");
  root.className = "mode-switch";
  root.innerHTML = `<button class="mode-switch-button" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Visningsläge"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="mode-switch-menu" role="radiogroup" aria-label="Visningsläge" hidden><button type="button" role="radio" data-mode-choice="new">1 Ny besökare</button><button type="button" role="radio" data-mode-choice="returning">2 Återkommande besökare</button><button type="button" role="radio" data-mode-choice="booking">3 Påbörjad bokning<span class="mode-switch-note" hidden> (endast vinter)</span></button></div>`;
  document.body.append(root);
  const button = root.querySelector(".mode-switch-button");
  const menu = root.querySelector(".mode-switch-menu");
  const radios = [...menu.querySelectorAll("[data-mode-choice]")];
  const sync = () => {
    const mode = document.documentElement.dataset.mode;
    const summer = document.documentElement.dataset.season === "summer";
    radios.forEach((radio) => {
      const on = radio.dataset.modeChoice === mode;
      radio.setAttribute("aria-checked", String(on));
      radio.tabIndex = on ? 0 : -1;
    });
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
  applyBooking();
}
