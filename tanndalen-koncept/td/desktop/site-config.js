/* Tänndalen site identity. Shared helpers live in koncept/shared. */
import {
  createSite,
  wifiOnsiteSignal,
  onsiteStorageKey as onsiteKeyFor,
  stayStorageKey as stayKeyFor
} from "/shared/config/create-site.js";

export const SITE = createSite({
  id: "tanndalen",
  name: "Tänndalen",
  /* TODO verify with Tänndalen — do not guess values. */
  location: {
    lat: null,
    lng: null,
    radiusM: null
  }
});

/** Season toggle — prefix + copy for ds/season-toggle. */
export const SEASON_TOGGLE = {
  storagePrefix: "td",
  labels: { winter: "Vinter", summer: "Sommar" },
  groupLabel: "Säsong",
  switchLabel: "Byt säsong"
};

/** Season banner copy — passed as mount options. */
export const SEASON_BANNER_COPY = {
  winter: {
    title: "Tänndalen på sommaren",
    lead: "Se hur en dag ser ut när snön är borta.",
    action: "Se en sommardag",
    live: "Visar en vinterdag i Tänndalen"
  },
  summer: {
    title: "Tänndalen på vintern",
    lead: "Se hur en dag ser ut när snön ligger.",
    action: "Se en vinterdag",
    live: "Visar en sommardag i Tänndalen"
  }
};

/** Guest picker rows for ds/booking. */
export const BOOKING_GUEST_CATEGORIES = [
  { key: "vuxen", label: "Vuxen", hint: "18 år och äldre", summaryOne: "vuxen", summaryMany: "vuxna" },
  { key: "ungdom", label: "Ungdom", hint: "13–17 år", summaryOne: "ungdom", summaryMany: "ungdomar" },
  { key: "barn", label: "Barn", hint: "4–12 år", summaryMany: "barn" },
  { key: "smabarn", label: "Barn", hint: "0–3 år", summaryMany: "barn" }
];

/** Modes engine — selectors, labels, tip, storage keys. Calendar content stays in modes-content. */
export const MODES_UI = {
  modeStorageKey: "td-mode",
  suggestDismissKey: "td-onsite-suggest-dismiss",
  modeEvent: "td-mode",
  seasonEvent: "td-season",
  tip: {
    title: "Liftkort nästa",
    body: "Boendet är på plats. Var redo för backen och köp liftkorten nu."
  },
  cats: {
    boende: "Boende",
    liftkort: "Liftkort",
    skidhyra: "Skidhyra"
  },
  labels: {
    tipClose: "Stäng",
    accountStay: "Din vistelse",
    accountBooking: "Min bokning",
    modeSwitch: "Visningsläge",
    demoToday: "Demo: vistelse pågår nu",
    modeChoices: [
      { id: "new", label: "1 Ny besökare" },
      { id: "returning", label: "2 Återkommande besökare" },
      { id: "booking", label: "3 Påbörjad bokning", note: " (endast vinter)" },
      { id: "onsite", label: "4 På plats" }
    ]
  },
  selectors: {
    booking: "#booking",
    bookingCats: "#booking-cats",
    bookingCatsInner: "#booking-cats",
    bookingPill: "#booking-cats .td-booking-pill",
    pagangGroups: ".just-nu .td-pagang-groups",
    pagangTitle: ".just-nu .td-pagang .td-ui-title",
    grenAlpint: "[data-gren='alpint']",
    grenAny: "[data-gren]",
    onsiteStatus: "[data-onsite-status]",
    onsiteMetrics: "[data-onsite-metrics]",
    onsiteTopbarStart: ".onsite-topbar-start",
    onsiteMetric: "[data-onsite-metric]",
    onsiteMetricSep: "[data-onsite-metric-sep]",
    onsitePillRow: "[data-onsite-pill-row]",
    onsiteSuggest: "[data-onsite-suggest]",
    onsiteToggle: "[data-onsite-toggle]",
    onsiteLeave: "[data-onsite-leave]",
    onsiteSuggestYes: "[data-onsite-suggest-yes]",
    onsiteSuggestNo: "[data-onsite-suggest-no]",
    modeChoice: "[data-mode-choice]",
    demoToday: "[data-demo-today]",
    accountUser: "#account-user",
    accountPanel: "#account-panel",
    accountMenu: ".account-menu",
    accountInitials: "[data-account-initials]",
    accountIcon: "[data-account-icon]",
    accountViewLogin: "[data-account-view='login']",
    accountViewStay: "[data-account-view='stay']",
    accountFraga: "[data-account-fraga]",
    accountLogout: "[data-account-logout]",
    accountForm: "[data-account-form]",
    stayStatus: "[data-stay-status]",
    stayTitle: "[data-stay-title]",
    stayParty: "[data-stay-party]",
    stayCheckin: "[data-stay-checkin]",
    fragaLaunch: "#fraga-launch"
  }
};

export { wifiOnsiteSignal };

export function onsiteStorageKey() {
  return onsiteKeyFor(SITE);
}

export function stayStorageKey() {
  return stayKeyFor(SITE);
}
