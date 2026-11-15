/* Mock R360 stay for the OG demo. No real booking call. Platshållare i [hakparentes]. */
import {
  createTodayOverrideApi,
  stayStatus as stayStatusCore,
  statusLabel as statusLabelCore,
  lookupStay as lookupStayCore,
  stayToStorage as stayToStorageCore
} from "/shared/js/demo-stay.js";

export const DEMO_STAY = {
  title: "[Grönklitt Stugby, stuga 4 bäddar]",
  checkIn: "2027-02-15",
  checkOut: "2027-02-22",
  party: "2 vuxna, 2 barn",
  checkInTime: "Från 15:00",
  rangeLabel: "[15–22 feb 2027]",
  initials: "AB"
};

const todayApi = createTodayOverrideApi("og-demo-today-override");

/** @type {string|null} */
export let DEMO_TODAY_OVERRIDE = null;

export function loadTodayOverride() {
  DEMO_TODAY_OVERRIDE = todayApi.loadTodayOverride();
  return DEMO_TODAY_OVERRIDE;
}

export function setTodayOverride(isoOrNull) {
  DEMO_TODAY_OVERRIDE = todayApi.setTodayOverride(isoOrNull);
  return DEMO_TODAY_OVERRIDE;
}

export function demoToday() {
  return todayApi.demoToday();
}

export function stayStatus(stay = DEMO_STAY, today = demoToday()) {
  return stayStatusCore(stay, today);
}

export function statusLabel(status, stay = DEMO_STAY) {
  return statusLabelCore(status, stay);
}

export function lookupStay(bookingNumber, lastName) {
  return lookupStayCore(bookingNumber, lastName, DEMO_STAY);
}

export function stayToStorage(stay) {
  return stayToStorageCore(stay, DEMO_STAY);
}
