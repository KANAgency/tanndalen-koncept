/* Brand-agnostic site config helpers. Callers pass identity; no layout. */

export function createSite({ id, name, location = { lat: null, lng: null, radiusM: null } }) {
  return {
    id,
    name,
    location: {
      lat: location.lat ?? null,
      lng: location.lng ?? null,
      radiusM: location.radiusM ?? null
    }
  };
}

export function wifiOnsiteSignal() {
  return null;
}

export function onsiteStorageKey(site) {
  return `td-onsite-${site.id}`;
}

export function stayStorageKey(site) {
  return `td-stay-${site.id}`;
}
