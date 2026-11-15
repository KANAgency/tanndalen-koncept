/**
 * Thin OG hero-page wrapper around shared booking.css / booking.js.
 * Markup shell matches TD #booking; cats/icons come from hero-page config.
 * Does not edit shared/ — only mounts and parameterises.
 */

import { initBookingFields } from "/ds/components/booking.js";
import { BOOKING_GUEST_CATEGORIES } from "../site-config.js";
import { HERO_PAGE_BOOKING } from "./hero-page-config.js";

const CAL_ICON = `<svg class="td-field-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3V6M10 3V6M4 8H12M4 5H12V13H4V5Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEV_ICON = `<svg class="td-field-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5.5L8 10.5L13 5.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SEARCH_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 10L13 13M7 3C4.791 3 3 4.791 3 7C3 9.209 4.791 11 7 11C9.209 11 11 9.209 11 7C11 4.791 9.209 3 7 3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function iconHtml(tab) {
  if (tab.iconSvg) return `<span class="booking-icon-slot">${tab.iconSvg}</span>`;
  const src = tab.iconSrc || `../assets/icons/${tab.id}.svg`;
  return `<span class="booking-icon-slot"><img alt="" src="${src}" /></span>`;
}

function paneLinks(tab) {
  return tab.linksHtml || `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>`;
}

/**
 * Mount TD-identical booking bar into #booking using hero-page tab config.
 * @returns {{ destroy: () => void } | null}
 */
export function mountHeroPageBooking() {
  const root = document.getElementById("booking");
  const catsRoot = document.getElementById("booking-cats");
  const clip = document.getElementById("booking-clip");
  if (!root || !catsRoot || !clip) return null;

  const tabs = HERO_PAGE_BOOKING.tabs || [];
  const pill = document.createElement("span");
  pill.className = "td-booking-pill";
  pill.hidden = true;
  catsRoot.append(pill);

  function addBookingCat(tab, index) {
    const { id, label } = tab;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "td-ui-label";
    button.setAttribute("aria-label", label);
    button.innerHTML = `${iconHtml(tab)}<span>${label}</span>`;
    button.addEventListener("click", () => {
      const same = button.getAttribute("aria-pressed") === "true";
      [...catsRoot.querySelectorAll("button")].forEach((item) => item.setAttribute("aria-pressed", "false"));
      pill.hidden = same;
      if (!same) {
        button.setAttribute("aria-pressed", "true");
        pill.style.transform = `translateX(${index * (HERO_PAGE_BOOKING.pillStepPx ?? 78)}px)`;
      }
      clip.querySelectorAll(".td-booking-pane").forEach((pane) =>
        pane.classList.toggle("is-shown", !same && pane.dataset.cat === id)
      );
      const shown = clip.querySelector(".is-shown");
      clip.style.height = shown ? `${shown.offsetHeight}px` : "0px";
    });
    catsRoot.append(button);

    const pane = document.createElement("div");
    pane.className = "td-booking-pane";
    pane.dataset.cat = id;
    pane.dataset.r360CategoryId = tab.r360CategoryId || "";
    const search = tab.searchLabel || `Sök ${label.toLowerCase()}`;
    const dateLabel = tab.dateLabel || "Datum";
    const dateValue = tab.dateValue || "Välj reseperiod";
    const whoLabel = tab.whoLabel || "Resesällskap";
    const whoValue = tab.whoValue || "Välj resande";
    pane.innerHTML = `<div class="td-field-group"><button class="td-field" type="button"><span><span class="td-field-label td-ui-label">${dateLabel}</span><span class="td-field-value td-ui-body">${dateValue}</span></span>${CAL_ICON}</button><hr class="td-field-divider"><button class="td-field" type="button"><span><span class="td-field-label td-ui-label">${whoLabel}</span><span class="td-field-value td-ui-body">${whoValue}</span></span>${CHEV_ICON}</button></div><button class="td-button td-button-primary td-ui-cta td-booking-search" type="button">${SEARCH_ICON}${search}</button>${paneLinks(tab)}`;
    clip.append(pane);
  }

  tabs.forEach(addBookingCat);

  const bookingFields = initBookingFields(root, {
    inline: true,
    guestCategories: HERO_PAGE_BOOKING.guestCategories || BOOKING_GUEST_CATEGORIES
  });

  const onPointerDown = (event) => {
    if (event.target.closest("#booking-clip, #booking-cats")) return;
    if (!clip.querySelector(".td-booking-pane.is-shown")) return;
    [...catsRoot.querySelectorAll("button")].forEach((item) => item.setAttribute("aria-pressed", "false"));
    pill.hidden = true;
    clip.querySelectorAll(".td-booking-pane").forEach((pane) => pane.classList.remove("is-shown", "is-swapped"));
    clip.style.height = "0px";
  };
  document.addEventListener("pointerdown", onPointerDown);

  return {
    bookingFields,
    destroy() {
      document.removeEventListener("pointerdown", onPointerDown);
    }
  };
}
