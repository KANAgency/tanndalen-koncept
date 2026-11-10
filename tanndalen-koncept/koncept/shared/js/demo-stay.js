/* Stay helpers. No layout. Brand data (DEMO_STAY) stays in the site package. */

export function createTodayOverrideApi(storageKey) {
  let override = null;

  function loadTodayOverride() {
    try {
      const stored = localStorage.getItem(storageKey);
      override = stored || null;
    } catch (err) {
      override = null;
    }
    return override;
  }

  function setTodayOverride(isoOrNull) {
    override = isoOrNull || null;
    try {
      if (override) localStorage.setItem(storageKey, override);
      else localStorage.removeItem(storageKey);
    } catch (err) {}
    return override;
  }

  function demoToday() {
    if (override) return override;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getOverride() {
    return override;
  }

  return { loadTodayOverride, setTodayOverride, demoToday, getOverride };
}

/** @returns {"ongoing"|"upcoming"|"ended"} */
export function stayStatus(stay, today) {
  if (today < stay.checkIn) return "upcoming";
  if (today > stay.checkOut) return "ended";
  return "ongoing";
}

export function statusLabel(status, stay) {
  const range = stay.rangeLabel.toUpperCase();
  if (status === "ongoing") return `Pågår nu · ${range}`;
  if (status === "ended") return `Avslutad · ${range}`;
  return `Kommande · ${range}`;
}

export function lookupStay(bookingNumber, lastName, demoStay) {
  const number = String(bookingNumber || "").trim();
  const name = String(lastName || "").trim();
  if (!number || !name) return null;
  return {
    ...demoStay,
    bookingNumber: number,
    lastName: name
  };
}

export function stayToStorage(stay, demoStay) {
  return {
    party: stay.party,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    title: stay.title,
    checkInTime: stay.checkInTime,
    rangeLabel: stay.rangeLabel,
    initials: stay.initials || demoStay.initials
  };
}
