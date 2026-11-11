/* Guest picker och kalender, kopplade till Booking-fälten. */
import { BREAKPOINTS_PX } from "../generated/breakpoints.mjs";

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
const WEEKDAYS = ["mån", "tis", "ons", "tor", "fre", "lör", "sön"];
const MOBILE_MAX_PX = BREAKPOINTS_PX.md - 1;

const ICON_LEFT = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 3L5.5 8L10.5 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_RIGHT = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3L10.5 8L5.5 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_MINUS = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8H13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const ICON_PLUS = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3V13M3 8H13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function normalizeGuestCategories(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("initBookingFields: guestCategories from site config is required");
  }
  return rows.map((row) => {
    if (Array.isArray(row)) {
      const [key, label, hint, summaryOne, summaryMany] = row;
      return { key, label, hint, summaryOne, summaryMany };
    }
    return row;
  });
}

export function initBookingFields(root, options = {}) {
  const inline = options.inline === true;
  const guestCategories = normalizeGuestCategories(options.guestCategories);
  const clip = root.querySelector(".td-booking-clip");
  const backdrop = document.createElement("div");
  backdrop.className = "td-booking-backdrop";
  backdrop.hidden = true;
  const guests = document.createElement("div");
  guests.className = "td-guest-picker";
  const calendar = document.createElement("div");
  calendar.className = "td-calendar";
  if (inline) {
    guests.classList.add("td-booking-view");
    calendar.classList.add("td-booking-view");
    clip.append(guests, calendar);
  } else {
    guests.setAttribute("role", "dialog");
    guests.setAttribute("aria-modal", "true");
    calendar.setAttribute("role", "dialog");
    calendar.setAttribute("aria-modal", "true");
    document.body.append(backdrop, guests, calendar);
  }

  const counts = new WeakMap();
  const dates = new WeakMap();
  let field = null;
  let month = new Date(2026, 9, 1);
  const emptyCounts = () => Object.fromEntries(guestCategories.map(({ key }) => [key, key === "vuxen" ? 2 : 0]));

  function mobile() {
    return matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches;
  }

  function place(node) {
    if (mobile()) {
      node.style.top = "auto";
      node.style.left = "0";
      return;
    }
    const rect = field.getBoundingClientRect();
    node.style.top = `${rect.bottom + 8}px`;
    node.style.left = `${Math.min(rect.left, innerWidth - node.offsetWidth - 8)}px`;
  }

  function focusables(node) {
    return [...node.querySelectorAll("button, a, input")].filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function open(node) {
    const pane = field.closest(".td-booking-pane");
    if (inline) {
      pane.classList.add("is-swapped");
      node.classList.add("is-open");
      field.setAttribute("aria-expanded", "true");
      clip.style.height = `${node.offsetHeight}px`;
      node.querySelector(".td-picker-title")?.focus();
      return;
    }
    backdrop.hidden = false;
    node.classList.add("is-open");
    place(node);
    field.setAttribute("aria-expanded", "true");
    const items = focusables(node);
    if (items[0]) items[0].focus();
  }

  function apply() {
    const value = field.querySelector(".td-field-value");
    if (field.dataset.kind === "guests") {
      const text = summary(counts.get(field));
      value.textContent = text || field.dataset.empty;
      field.classList.toggle("is-filled", Boolean(text));
      return;
    }
    const state = dates.get(field);
    value.textContent = state.label || field.dataset.empty;
    field.classList.toggle("is-filled", Boolean(state.label));
  }

  function close(options) {
    const restoreFocus = !(options && options.restoreFocus === false);
    guests.classList.remove("is-open");
    calendar.classList.remove("is-open");
    backdrop.hidden = true;
    if (!field) return;
    const pane = field.closest(".td-booking-pane");
    const back = field;
    apply();
    back.setAttribute("aria-expanded", "false");
    field = null;
    if (pane) pane.classList.remove("is-swapped");
    if (inline && pane?.classList.contains("is-shown") && clip) {
      clip.style.height = `${pane.offsetHeight}px`;
    }
    if (restoreFocus) back.focus();
  }

  function summary(count) {
    const parts = [];
    const byKey = Object.fromEntries(guestCategories.map((row) => [row.key, row]));
    const vuxen = byKey.vuxen;
    const ungdom = byKey.ungdom;
    if (count.vuxen && vuxen) {
      const word = count.vuxen === 1
        ? (vuxen.summaryOne || vuxen.label.toLowerCase())
        : (vuxen.summaryMany || vuxen.label.toLowerCase());
      parts.push(`${count.vuxen} ${word}`);
    }
    if (count.ungdom && ungdom) {
      const word = count.ungdom === 1
        ? (ungdom.summaryOne || ungdom.label.toLowerCase())
        : (ungdom.summaryMany || ungdom.label.toLowerCase());
      parts.push(`${count.ungdom} ${word}`);
    }
    const barn = (count.barn || 0) + (count.smabarn || 0);
    if (barn) {
      const barnRow = byKey.barn || byKey.smabarn;
      parts.push(`${barn} ${(barnRow?.summaryMany || barnRow?.label || "barn").toLowerCase()}`);
    }
    return parts.join(", ");
  }

  function pickerHead(title) {
    return `<div class="td-picker-head"><button type="button" class="td-button td-button-secondary td-button-fill-neutral td-button-sm td-picker-back" data-back aria-label="Tillbaka">${ICON_LEFT}</button><h3 class="td-picker-title td-ui-title-sm" tabindex="-1">${title}</h3></div>`;
  }

  function renderGuests() {
    const count = counts.get(field);
    const title = field.querySelector(".td-field-label").textContent;
    guests.setAttribute("aria-label", title);
    guests.innerHTML = (inline ? pickerHead(title) : "") + guestCategories.map(({ key, label, hint }) => `
      <div class="td-guest-row">
        <p><span class="td-ui-title-sm">${label}</span><span class="td-guest-hint td-ui-body-sm">${hint}</span></p>
        <div class="td-stepper">
          <button type="button" data-step="${key}" data-dir="-1" aria-label="Minska ${label.toLowerCase()}" ${count[key] <= 0 ? "disabled" : ""}>${ICON_MINUS}</button>
          <output class="td-ui-figure">${count[key]}</output>
          <button type="button" data-step="${key}" data-dir="1" aria-label="Öka ${label.toLowerCase()}">${ICON_PLUS}</button>
        </div>
      </div>`).join("") + `<button type="button" class="td-button td-button-primary td-ui-cta" data-done>Klar</button>`;
  }

  function weeksFor(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const first = new Date(year, monthIndex, 1);
    const start = new Date(first);
    const mondayOffset = (first.getDay() + 6) % 7;
    start.setDate(1 - mondayOffset);
    const last = new Date(year, monthIndex + 1, 0);
    const rows = [];
    for (let cursor = new Date(start); cursor <= last || rows.length === 0; cursor.setDate(cursor.getDate() + 7)) {
      const week = [];
      for (let day = 0; day < 7; day += 1) {
        const cell = new Date(cursor);
        cell.setDate(cursor.getDate() + day);
        week.push(cell);
      }
      rows.push(week);
      if (week[6] >= last) break;
    }
    return rows;
  }

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function formatDay(date) {
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
  }

  function formatRange(start, end) {
    if (!start) return "";
    if (!end || sameDay(start, end)) return formatDay(start);
    const mon = (date) => MONTHS[date.getMonth()].slice(0, 3);
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()}–${end.getDate()} ${mon(start)}`;
    }
    return `${formatDay(start)}–${formatDay(end)}`;
  }

  function renderCalendar() {
    const state = dates.get(field);
    const rows = weeksFor(month);
    const title = field.querySelector(".td-field-label").textContent;
    const ranged = state.start && state.end && !sameDay(state.start, state.end);
    const today = new Date();
    const atStart = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
    const chevron = (flip) => `<svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"${flip ? ' style="transform:scaleX(-1)"' : ""}><path d="M5.5 3L10.5 8L5.5 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    calendar.setAttribute("aria-label", title);
    calendar.innerHTML = (inline ? pickerHead(title) : "") + `
      <div class="td-calendar-nav">
        <button type="button" class="td-calendar-icon" data-month="-1" aria-label="Föregående månad"${atStart ? " disabled" : ""}>${chevron(true)}</button>
        <p class="td-ui-title-sm">${MONTHS[month.getMonth()]} ${month.getFullYear()}</p>
        <button type="button" class="td-calendar-icon" data-month="1" aria-label="Nästa månad">${chevron(false)}</button>
      </div>
      <div class="td-calendar-month">
        <div class="td-calendar-weekdays">${WEEKDAYS.map((day) => `<span class="td-ui-caption">${day}</span>`).join("")}</div>
        ${rows.map((week) => `<div class="td-calendar-week">${week.map((date, index) => {
          const outside = date.getMonth() !== month.getMonth();
          if (outside) return `<span></span>`;
          const selected = sameDay(date, state.start) || sameDay(date, state.end);
          const inRange = ranged && date > state.start && date < state.end;
          const edge = ranged && sameDay(date, state.start) ? "start" : ranged && sameDay(date, state.end) ? "end" : "";
          const capLeft = inRange && index === 0;
          const capRight = inRange && index === 6;
          const round = capLeft && capRight ? "both" : capLeft ? "left" : capRight ? "right" : "";
          return `<button type="button" class="td-ui-body" data-date="${date.toISOString()}" aria-pressed="${selected}" ${edge ? `data-edge="${edge}"` : ""} ${inRange ? `data-in-range="true"` : ""} ${round ? `data-round="${round}"` : ""}>${date.getDate()}</button>`;
        }).join("")}</div>`).join("")}
      </div>
      <div class="td-calendar-foot${state.label ? "" : " is-empty"}">
        <button type="button" class="td-button td-button-secondary td-button-fill-neutral td-button-md" data-clear${state.label ? "" : " disabled"}>Rensa</button>
        <p class="td-ui-body">${state.label || "Välj datum"}</p>
        <button type="button" class="td-button td-button-primary td-button-md" data-done>Klar</button>
      </div>`;
  }

  function pickDate(date) {
    const state = dates.get(field);
    if (field.dataset.mode === "day") {
      state.start = date;
      state.end = null;
      state.label = formatDay(date);
    } else if (!state.start || state.end) {
      state.start = date;
      state.end = null;
      state.label = formatRange(state.start, state.end);
    } else if (date < state.start) {
      state.end = state.start;
      state.start = date;
      state.label = formatRange(state.start, state.end);
    } else {
      state.end = date;
      state.label = formatRange(state.start, state.end);
    }
    renderCalendar();
    if (inline) clip.style.height = `${calendar.offsetHeight}px`;
  }

  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    const node = guests.classList.contains("is-open") ? guests : calendar.classList.contains("is-open") ? calendar : null;
    if (!node) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      const items = focusables(node);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  guests.addEventListener("click", (event) => {
    const step = event.target.closest("[data-step]");
    if (step) {
      const count = counts.get(field);
      count[step.dataset.step] = Math.max(0, count[step.dataset.step] + Number(step.dataset.dir));
      renderGuests();
      guests.querySelector(`[data-step="${step.dataset.step}"][data-dir="${step.dataset.dir}"]`)?.focus();
      if (inline) clip.style.height = `${guests.offsetHeight}px`;
      return;
    }
    if (event.target.closest("[data-done]") || event.target.closest("[data-back]")) close();
  });

  calendar.addEventListener("click", (event) => {
    const shift = event.target.closest("[data-month]");
    if (shift) {
      if (shift.disabled) return;
      month = new Date(month.getFullYear(), month.getMonth() + Number(shift.dataset.month), 1);
      renderCalendar();
      calendar.querySelector("[data-month]")?.focus();
      return;
    }
    const day = event.target.closest("[data-date]");
    if (day) {
      pickDate(new Date(day.dataset.date));
      return;
    }
    if (event.target.closest("[data-clear]")) {
      dates.set(field, { start: null, end: null, label: "" });
      field.querySelector(".td-field-value").textContent = field.dataset.empty;
      field.classList.remove("is-filled");
      renderCalendar();
      if (inline) clip.style.height = `${calendar.offsetHeight}px`;
      return;
    }
    if (event.target.closest("[data-done]") || event.target.closest("[data-back]")) close();
  });

  calendar.addEventListener("keydown", (event) => {
    const current = event.target.closest("[data-date]");
    if (!current) return;
    const keys = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const buttons = [...calendar.querySelectorAll("[data-date]")];
    const next = buttons[buttons.indexOf(current) + keys[event.key]];
    if (next) next.focus();
  });

  function bindPanes() {
    if (field) close({ restoreFocus: false });
    root.querySelectorAll(".td-booking-pane").forEach((pane) => {
      if (pane.dataset.fieldsBound === "true") return;
      pane.dataset.fieldsBound = "true";
      const [dateField, guestField] = pane.querySelectorAll(".td-field");
      dateField.dataset.mode = pane.dataset.cat === "liftkort" ? "day" : "range";
      dateField.dataset.empty = dateField.querySelector(".td-field-value").textContent;
      guestField.dataset.empty = guestField.querySelector(".td-field-value").textContent;
      if (!inline) {
        dateField.setAttribute("aria-haspopup", "dialog");
        guestField.setAttribute("aria-haspopup", "dialog");
      }
      dateField.setAttribute("aria-expanded", "false");
      guestField.setAttribute("aria-expanded", "false");
      dateField.dataset.kind = "date";
      guestField.dataset.kind = "guests";
      counts.set(guestField, emptyCounts());
      dates.set(dateField, { start: null, end: null, label: "" });
      guestField.addEventListener("click", () => {
        field = guestField;
        renderGuests();
        open(guests);
      });
      dateField.addEventListener("click", () => {
        field = dateField;
        renderCalendar();
        open(calendar);
      });
    });
  }

  bindPanes();

  if (inline) {
    root.querySelector(".td-booking-cats")?.addEventListener("click", () => {
      if (field) close();
    }, true);
    document.addEventListener("pointerdown", (event) => {
      if (!field) return;
      if (event.target.closest(".td-booking-clip, .td-booking-cats")) return;
      close({ restoreFocus: false });
    });
  }

  return { bindPanes };
}
