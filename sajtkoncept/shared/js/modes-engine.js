/* Layout-free view-mode engine. Selectors, labels and tip copy come from site config. */
import { endOfLocalDay, readJson, writeJson } from "./json-storage.js";

const BASE_MODES = ["new", "returning", "booking"];
const MODES = [...BASE_MODES, "onsite"];

/**
 * @param {object} deps
 * @param {() => string} deps.onsiteStorageKey
 * @param {() => string} deps.stayStorageKey
 * @param {() => unknown} deps.wifiOnsiteSignal
 * @param {object} deps.stayApi — demo-stay surface from the site
 * @param {object} deps.bookingCalendar — from site modes-content
 * @param {object} deps.ui — selectors, labels, tip, storage keys, event names
 */
export function createModesEngine(deps) {
  const {
    onsiteStorageKey,
    stayStorageKey,
    wifiOnsiteSignal,
    stayApi,
    bookingCalendar,
    ui
  } = deps;

  const {
    DEMO_STAY,
    demoToday,
    loadTodayOverride,
    lookupStay,
    setTodayOverride,
    statusLabel,
    stayStatus,
    stayToStorage
  } = stayApi;

  const {
    modeStorageKey,
    suggestDismissKey,
    modeEvent,
    seasonEvent,
    tip,
    labels,
    cats,
    selectors
  } = ui;

  function catButton(ariaLabel) {
    return document.querySelector(`${selectors.bookingCats} button[aria-label='${ariaLabel}']`);
  }

  function readOnsite() {
    const data = readJson(onsiteStorageKey());
    if (!data || typeof data.value !== "boolean") return null;
    if (typeof data.until === "number" && Date.now() > data.until) {
      writeJson(onsiteStorageKey(), null);
      return null;
    }
    return data;
  }

  function writeOnsite(state) {
    writeJson(onsiteStorageKey(), state || null);
  }

  function readStay() {
    return readJson(stayStorageKey());
  }

  function writeStay(stay) {
    writeJson(stayStorageKey(), stay ? stayToStorage(stay) : null);
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
    try { localStorage.setItem(modeStorageKey, next); } catch (err) {}
  }

  function applyEffectiveMode(reloadIntro) {
    const onsite = isOnsiteActive();
    const base = baseModeFromDom();
    const effective = onsite ? "onsite" : base;
    const current = document.documentElement.dataset.mode;
    const introFlip = (current === "new") !== (effective === "new");
    if ((introFlip || reloadIntro) && effective !== "onsite" && current !== "onsite") {
      try { localStorage.setItem(modeStorageKey, effective); } catch (err) {}
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
    document.dispatchEvent(new CustomEvent(modeEvent, { detail: { mode: effective, onsite, base } }));
  }

  function isOnsiteActive() {
    const state = readOnsite();
    return Boolean(state?.value);
  }

  /** Manual always wins until `until`. Turning off blocks auto for the same day. */
  function setOnsite(value, source = "manual") {
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
    const button = document.querySelector(selectors.grenAlpint);
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
    return bookingCalendar.groups.map((group) => {
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

  function dismissTooltip() {
    tipClosed = true;
    if (tooltip) tooltip.hidden = true;
  }

  function ensureTooltip() {
    const bar = document.querySelector(selectors.booking);
    if (!bar || tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.className = "mode-booking-tip";
    tooltip.setAttribute("role", "note");
    tooltip.innerHTML = `<p class="mode-booking-tip-title">${tip.title}</p><p class="mode-booking-tip-body">${tip.body}</p><button class="mode-booking-tip-close" type="button" aria-label="${labels.tipClose}">×</button><span class="mode-booking-tip-arrow" aria-hidden="true"></span>`;
    tooltip.querySelector(".mode-booking-tip-close").addEventListener("click", dismissTooltip);
    bar.querySelector(selectors.bookingCatsInner)?.addEventListener("click", (event) => {
      if (!event.target.closest("button")) return;
      dismissTooltip();
    });
    bar.append(tooltip);
    return tooltip;
  }

  function placeTooltip() {
    const tipEl = ensureTooltip();
    const bar = document.querySelector(selectors.booking);
    const item = catButton(cats.liftkort);
    if (!tipEl || !bar || !item || tipEl.hidden) return;
    const barBox = bar.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    const center = itemBox.left + itemBox.width / 2 - barBox.left;
    const declared = parseFloat(getComputedStyle(tipEl).getPropertyValue("--tooltip-w")) || 525;
    const width = Math.min(declared, window.innerWidth - 32);
    let left = center - width / 2;
    const barLeft = barBox.left;
    if (barLeft + left < 16) left = 16 - barLeft;
    if (barLeft + left + width > window.innerWidth - 16) left = window.innerWidth - 16 - width - barLeft;
    tipEl.style.width = `${width}px`;
    tipEl.style.left = `${left}px`;
    tipEl.style.setProperty("--tip-arrow", "50%");
  }

  function applyBooking() {
    const on = winterBooking();
    const boende = catButton(cats.boende);
    const lift = catButton(cats.liftkort);
    const pill = document.querySelector(selectors.bookingPill);
    const tipEl = ensureTooltip();
    markDone(boende, on);
    markDone(catButton(cats.skidhyra), on);
    if (tipEl) {
      if (!on) tipClosed = false;
      tipEl.hidden = !on || tipClosed;
    }
    if (pill && !on && lift?.getAttribute("aria-pressed") !== "true") {
      const pressed = document.querySelector(`${selectors.bookingCats} > button[aria-pressed='true']`);
      if (!pressed) pill.hidden = true;
    }
    const groups = document.querySelector(selectors.pagangGroups);
    const title = document.querySelector(selectors.pagangTitle);
    if (groups && !baseGroups) {
      baseGroups = groups.innerHTML;
      baseTitle = title ? title.textContent : "";
    }
    const showCalendar = on && alpineOn();
    if (groups && title && showCalendar) {
      title.textContent = bookingCalendar.range;
      groups.innerHTML = calendarHtml();
      groups.dataset.modeCalendar = "booking";
    } else if (groups?.dataset.modeCalendar === "booking") {
      groups.innerHTML = baseGroups;
      if (title) title.textContent = baseTitle;
      delete groups.dataset.modeCalendar;
    }
    placeTooltip();
  }

  function isOnsiteSuggestDismissed() {
    try {
      const raw = localStorage.getItem(suggestDismissKey);
      if (!raw) return false;
      const until = Number(raw);
      if (!Number.isFinite(until) || Date.now() > until) {
        localStorage.removeItem(suggestDismissKey);
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function dismissOnsiteSuggest() {
    try {
      localStorage.setItem(suggestDismissKey, String(endOfLocalDay()));
    } catch (err) {}
  }

  function clearOnsiteSuggestDismiss() {
    try {
      localStorage.removeItem(suggestDismissKey);
    } catch (err) {}
  }

  function syncOnsiteMetricSeps(metrics, seps) {
    seps.forEach((sep, index) => {
      const left = metrics[index];
      const right = metrics[index + 1];
      sep.hidden = Boolean(!left || !right || left.hidden || right.hidden);
    });
  }

  /** Hide metrics from the end until the row fits; right-align as soon as centered layout is too tight. */
  function fitOnsiteMetrics() {
    document.querySelectorAll(selectors.onsiteStatus).forEach((status) => {
      const text = status.querySelector(selectors.onsiteMetrics);
      const start = status.querySelector(selectors.onsiteTopbarStart);
      if (!text || !start || status.hidden) return;

      const metrics = [...text.querySelectorAll(selectors.onsiteMetric)];
      const seps = [...text.querySelectorAll(selectors.onsiteMetricSep)];
      metrics.forEach((metric) => {
        metric.hidden = false;
      });
      syncOnsiteMetricSeps(metrics, seps);
      status.classList.remove("is-metrics-tight");

      const styles = getComputedStyle(status);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const statusRect = status.getBoundingClientRect();
      const startRect = start.getBoundingClientRect();
      const startWidth = startRect.right - statusRect.left;
      const textWidth = text.scrollWidth;

      /* Centered needs equal side columns ≥ start block. */
      const fitsCentered = startWidth * 2 + textWidth + gap * 2 <= statusRect.width + 0.5;
      if (!fitsCentered) status.classList.add("is-metrics-tight");

      const available = Math.max(0, statusRect.right - startRect.right - gap);
      for (let i = metrics.length - 1; i >= 0; i -= 1) {
        if (text.scrollWidth <= available + 0.5) break;
        metrics[i].hidden = true;
        syncOnsiteMetricSeps(metrics, seps);
        if (!status.classList.contains("is-metrics-tight")) status.classList.add("is-metrics-tight");
      }
    });
  }

  function applyOnsitePage() {
    const on = isOnsiteActive();
    const showSuggest = !on && baseModeFromDom() === "booking" && !isOnsiteSuggestDismissed();
    document.documentElement.classList.toggle("is-onsite", on);
    document.querySelectorAll(selectors.onsitePillRow).forEach((el) => {
      el.hidden = !(on || showSuggest);
      el.dataset.onsiteVariant = on ? "status" : showSuggest ? "suggest" : "";
    });
    document.querySelectorAll(selectors.onsiteStatus).forEach((el) => {
      el.hidden = !on;
    });
    document.querySelectorAll(selectors.onsiteSuggest).forEach((el) => {
      el.hidden = !showSuggest;
    });
    requestAnimationFrame(fitOnsiteMetrics);
  }

  function initOnsiteMetricsFit() {
    const topbar = document.querySelector(selectors.onsitePillRow);
    if (!topbar || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", fitOnsiteMetrics);
      return;
    }
    const ro = new ResizeObserver(() => fitOnsiteMetrics());
    ro.observe(topbar);
    document.querySelectorAll(`${selectors.onsiteStatus} ${selectors.onsiteTopbarStart}`).forEach((start) => ro.observe(start));
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
    /* Demo: picking Påbörjad bokning always resurfaces the suggest bar. */
    if (next === "booking") clearOnsiteSuggestDismiss();
    setBaseMode(next);
    const current = document.documentElement.dataset.mode;
    if ((current === "new") !== (next === "new") || reload) {
      try { localStorage.setItem(modeStorageKey, next); } catch (err) {}
      const url = new URL(location.href);
      url.searchParams.set("mode", next);
      url.searchParams.delete("visit");
      location.assign(url.pathname + url.search + url.hash);
      return;
    }
    document.documentElement.dataset.mode = next;
    try { localStorage.setItem(modeStorageKey, next); } catch (err) {}
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
    document.querySelectorAll(selectors.onsiteToggle).forEach((input) => {
      input.checked = on;
      input.setAttribute("aria-checked", String(on));
    });
    document.querySelectorAll(selectors.modeChoice).forEach((radio) => {
      const choice = radio.dataset.modeChoice;
      const selected = on ? choice === "onsite" : choice === baseModeFromDom();
      radio.setAttribute("aria-checked", String(selected));
      radio.tabIndex = selected ? 0 : -1;
    });
    const todayOpt = document.querySelector(selectors.demoToday);
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
    const userBtn = document.querySelector(selectors.accountUser);
    const panel = document.querySelector(selectors.accountPanel);
    if (!userBtn || !panel) return;
    userBtn.classList.toggle("is-logged-in", loggedIn);
    userBtn.classList.toggle("is-ongoing", status === "ongoing");
    userBtn.setAttribute("aria-label", loggedIn ? labels.accountStay : labels.accountBooking);
    const initials = userBtn.querySelector(selectors.accountInitials);
    const icon = userBtn.querySelector(selectors.accountIcon);
    if (initials) {
      initials.hidden = !loggedIn;
      initials.textContent = stay?.initials || DEMO_STAY.initials;
    }
    if (icon) icon.hidden = loggedIn;
    const loginView = panel.querySelector(selectors.accountViewLogin);
    const stayView = panel.querySelector(selectors.accountViewStay);
    if (loginView) loginView.hidden = loggedIn;
    if (stayView) stayView.hidden = !loggedIn;
    if (loggedIn && stayView) {
      const statusEl = stayView.querySelector(selectors.stayStatus);
      const titleEl = stayView.querySelector(selectors.stayTitle);
      const partyEl = stayView.querySelector(selectors.stayParty);
      const checkEl = stayView.querySelector(selectors.stayCheckin);
      if (statusEl) {
        statusEl.textContent = statusLabel(status, stay);
        statusEl.dataset.status = status;
      }
      if (titleEl) titleEl.textContent = stay.title || DEMO_STAY.title;
      if (partyEl) partyEl.textContent = stay.party || DEMO_STAY.party;
      if (checkEl) checkEl.textContent = stay.checkInTime || DEMO_STAY.checkInTime;
    }
  }

  function initAccount() {
    const userBtn = document.querySelector(selectors.accountUser);
    const panel = document.querySelector(selectors.accountPanel);
    if (!userBtn || !panel) return;
    const setOpen = (open) => {
      panel.hidden = !open;
      userBtn.setAttribute("aria-expanded", String(open));
      document.querySelector(selectors.accountMenu)?.classList.toggle("is-open", open);
    };
    userBtn.addEventListener("click", () => {
      setOpen(panel.hidden);
    });
    document.addEventListener("pointerdown", (event) => {
      if (event.target.closest(selectors.accountMenu)) return;
      setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
    panel.addEventListener("click", (event) => {
      const fraga = event.target.closest(selectors.accountFraga);
      if (fraga) {
        event.preventDefault();
        setOpen(false);
        document.querySelector(selectors.fragaLaunch)?.click();
        return;
      }
      const logout = event.target.closest(selectors.accountLogout);
      if (logout) {
        event.preventDefault();
        writeStay(null);
        renderAccountUi();
        tryAutoOnsite();
        applyEffectiveMode(false);
        return;
      }
    });
    const form = panel.querySelector(selectors.accountForm);
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
    document.querySelectorAll(selectors.onsiteToggle).forEach((input) => {
      input.addEventListener("change", () => {
        setOnsite(input.checked, "manual");
      });
    });
    document.querySelectorAll(selectors.onsiteLeave).forEach((btn) => {
      btn.addEventListener("click", () => {
        setOnsite(false, "manual");
      });
    });
    document.querySelectorAll(selectors.onsiteSuggestYes).forEach((btn) => {
      btn.addEventListener("click", () => {
        clearOnsiteSuggestDismiss();
        setOnsite(true, "manual");
      });
    });
    document.querySelectorAll(selectors.onsiteSuggestNo).forEach((btn) => {
      btn.addEventListener("click", () => {
        dismissOnsiteSuggest();
        setOnsite(false, "manual");
      });
    });
  }

  function initModeSwitch() {
    const root = document.createElement("div");
    root.className = "mode-switch";
    const choiceButtons = labels.modeChoices
      .map((choice) => {
        const note = choice.note
          ? `<span class="mode-switch-note" hidden>${choice.note}</span>`
          : "";
        return `<button type="button" role="radio" data-mode-choice="${choice.id}">${choice.label}${note}</button>`;
      })
      .join("");
    root.innerHTML = `<button class="mode-switch-button" type="button" aria-expanded="false" aria-haspopup="true" aria-label="${labels.modeSwitch}"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="mode-switch-menu" role="radiogroup" aria-label="${labels.modeSwitch}" hidden>${choiceButtons}<button type="button" data-demo-today aria-pressed="false">${labels.demoToday}</button></div>`;
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
    document.addEventListener(seasonEvent, () => { sync(); applyBooking(); });
    document.addEventListener("click", (event) => {
      if (event.target.closest(selectors.grenAny)) applyBooking();
    });
    window.addEventListener("resize", placeTooltip);
    sync();
  }

  function init() {
    loadTodayOverride();
    const params = new URLSearchParams(location.search);
    let modeParam = params.get("mode");
    const current = document.documentElement.dataset.mode;
    if (BASE_MODES.includes(current)) setBaseMode(current);
    else if (BASE_MODES.includes(modeParam)) setBaseMode(modeParam);
    else {
      try {
        const stored = localStorage.getItem(modeStorageKey);
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
    initOnsiteMetricsFit();
    initAccount();
    applyEffectiveMode(false);
    applyBooking();
  }

  return {
    init,
    isOnsiteActive,
    setOnsite
  };
}
