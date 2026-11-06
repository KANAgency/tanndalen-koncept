/* Site identity and on-site geo config. Orsa Grönklitt can swap this later. */
export const SITE = {
  id: "tanndalen",
  name: "Tänndalen",
  /* TODO verify with Tänndalen — do not guess values. */
  location: {
    lat: null,
    lng: null,
    radiusM: null
  }
};

/* Hook only: browsers cannot detect resort Wi‑Fi. Wire a real signal here later. */
export function wifiOnsiteSignal() {
  return null;
}

export function onsiteStorageKey() {
  return `td-onsite-${SITE.id}`;
}

export function stayStorageKey() {
  return `td-stay-${SITE.id}`;
}
