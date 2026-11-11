/* localStorage JSON helpers. No layout, no brand copy. */

export function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function writeJson(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {}
}

export function endOfLocalDay(from = new Date()) {
  const d = new Date(from);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
