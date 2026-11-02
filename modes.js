/* View modes. Overrides only. Mode 4 "På plats" will be added later. */
const MODES = ["new", "returning", "booking"];

/* TODO: demo content, confirm with Tänndalen */
const BOOKING_CALENDAR = {
  range: "12–19 feb · 2027",
  groups: [
    {
      date: "2027-02-13",
      rows: [
        { time: "11:00", title: "Pond skim i Hamra" },
        { time: "16:00", title: "Afterski" },
        { time: "18–21", title: "Kvällsskidåkning" }
      ]
    },
    {
      date: "2027-02-14",
      rows: [
        { time: "10:00", title: "Hundspann från Hamra" },
        { time: "19:00", title: "Fondue i Fjällkåtan" }
      ]
    },
    {
      label: "Resten av veckan",
      rows: [
        { time: "mån–fre", title: "Skidskola, barn 4–6 år", from: "2027-02-15", to: "2027-02-19" },
        { time: "ons 17", title: "Fackeltåg i byn", date: "2027-02-17" }
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

let baseGroups = "";
let baseTitle = "";
let tooltip = null;

function ensureTooltip() {
  const bar = document.getElementById("booking");
  if (!bar || tooltip) return tooltip;
  tooltip = document.createElement("div");
  tooltip.className = "mode-booking-tip";
  tooltip.setAttribute("role", "note");
  tooltip.innerHTML = `<p class="mode-booking-tip-title">Liftkort nästa</p><p class="mode-booking-tip-body">Boendet är på plats. Var redo för backen och köp liftkorten nu.</p><span class="mode-booking-tip-arrow" aria-hidden="true"></span>`;
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
  let left = 0;
  const barLeft = barBox.left;
  if (barLeft + left < 0) left = 16 - barLeft;
  if (barLeft + left + width > window.innerWidth) left = window.innerWidth - 16 - width - barLeft;
  tip.style.width = `${width}px`;
  tip.style.left = `${left}px`;
  tip.style.setProperty("--tip-arrow", `${center - left}px`);
}

function applyBooking() {
  const on = winterBooking();
  const boende = document.querySelector("#booking-cats button[aria-label='Boende']");
  const lift = document.querySelector("#booking-cats button[aria-label='Liftkort']");
  const pill = document.querySelector("#booking-cats .td-booking-pill");
  const tip = ensureTooltip();
  if (boende) {
    boende.classList.toggle("is-done", on);
    if (on && !boende.querySelector(".mode-booking-check")) {
      const mark = document.createElement("span");
      mark.className = "mode-booking-check";
      mark.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.4l4.2 4.2L16 6.2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      boende.querySelector(".booking-icon-slot")?.append(mark);
    }
  }
  if (tip) tip.hidden = !on;
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
  /* Booking list is 477px. The card is 316px. Not rendered, so the card does not grow. */
  if (groups?.dataset.modeCalendar === "booking" && !on) {
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
  window.addEventListener("resize", placeTooltip);
  sync();
  applyBooking();
}
