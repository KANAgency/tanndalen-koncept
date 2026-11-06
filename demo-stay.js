/* Mock R360 stay for the demo. No real booking call. */

export const DEMO_STAY = {
  title: "Ski Lodge Premium",
  checkIn: "2027-02-12",
  checkOut: "2027-02-19",
  party: "2 vuxna, 1 barn",
  checkInTime: "Från 15:00",
  rangeLabel: "12–19 feb 2027",
  initials: "AB"
};

/* Demo override for "today" so status can show Pågår nu. ISO date or null. */
export let DEMO_TODAY_OVERRIDE = null;

const TODAY_KEY = "td-demo-today-override";

export function loadTodayOverride() {
  try {
    const stored = localStorage.getItem(TODAY_KEY);
    DEMO_TODAY_OVERRIDE = stored || null;
  } catch (err) {
    DEMO_TODAY_OVERRIDE = null;
  }
  return DEMO_TODAY_OVERRIDE;
}

export function setTodayOverride(isoOrNull) {
  DEMO_TODAY_OVERRIDE = isoOrNull || null;
  try {
    if (DEMO_TODAY_OVERRIDE) localStorage.setItem(TODAY_KEY, DEMO_TODAY_OVERRIDE);
    else localStorage.removeItem(TODAY_KEY);
  } catch (err) {}
  return DEMO_TODAY_OVERRIDE;
}

export function demoToday() {
  if (DEMO_TODAY_OVERRIDE) return DEMO_TODAY_OVERRIDE;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** @returns {"ongoing"|"upcoming"|"ended"} */
export function stayStatus(stay = DEMO_STAY, today = demoToday()) {
  if (today < stay.checkIn) return "upcoming";
  if (today > stay.checkOut) return "ended";
  return "ongoing";
}

export function statusLabel(status, stay = DEMO_STAY) {
  const range = stay.rangeLabel.toUpperCase();
  if (status === "ongoing") return `Pågår nu · ${range}`;
  if (status === "ended") return `Avslutad · ${range}`;
  return `Kommande · ${range}`;
}

/** Accept any non-empty booking number + last name; return demo stay with typed number. */
export function lookupStay(bookingNumber, lastName) {
  const number = String(bookingNumber || "").trim();
  const name = String(lastName || "").trim();
  if (!number || !name) return null;
  return {
    ...DEMO_STAY,
    bookingNumber: number,
    lastName: name
  };
}

/** Persist only party size and dates — never booking number or details. */
export function stayToStorage(stay) {
  return {
    party: stay.party,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    title: stay.title,
    checkInTime: stay.checkInTime,
    rangeLabel: stay.rangeLabel,
    initials: stay.initials || DEMO_STAY.initials
  };
}
