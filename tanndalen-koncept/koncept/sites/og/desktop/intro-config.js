/* OG intro config — videos, season calendar, brand mark, timing.
   Videos live outside git under assets/video/ (same ignore as TD). */

/** Seen-flag for ny-besökare intro (mirrors TD td-startsida-seen). */
export const INTRO_SEEN_KEY = "og-startsida-seen";

/**
 * Brand mark — SVG when present; text wordmark only if an image fails to load.
 * light = over hero video, dark = topbar.
 */
export const BRAND_MARK = Object.freeze({
  label: "Orsa Grönklitt",
  src: Object.freeze({
    light: "assets/brand/logo-horizontal-white.svg",
    dark: "assets/brand/logo-horizontal-black.svg"
  })
});

/** Season default when og-season is unset. Months are 1–12 inclusive. */
export const SEASON_CALENDAR = Object.freeze({
  /* Winter: October–April */
  winterMonths: Object.freeze([10, 11, 12, 1, 2, 3, 4]),
  /* Summer: May–September */
  summerMonths: Object.freeze([5, 6, 7, 8, 9])
});

export const HERO_MEDIA = Object.freeze({
  winter: Object.freeze({
    video: "assets/video/winter.mp4",
    poster: "assets/img/og-hero-winter.jpg"
  }),
  /* Summer: no clip/poster yet — hero falls back to Orsa-black placeholder. */
  summer: Object.freeze({
    video: null,
    poster: null
  })
});

/** Typewriter pacing (ms). Hold = how long a finished phrase stays. */
export const TYPEWRITER = Object.freeze({
  typeMs: 95,
  deleteMs: 55,
  holdMs: 3500,
  pauseBetweenMs: 280
});

/** Scroll: progress 0→1 shrinks hero; topbar fades in from this point. */
export const SCROLL = Object.freeze({
  runwayFactor: 0.55, /* extra runway as fraction of viewport */
  shrinkMin: 0.88, /* scale at full progress */
  topbarAt: 0.35
});

export function defaultSeasonFromDate(date = new Date()) {
  const month = date.getMonth() + 1;
  if (SEASON_CALENDAR.summerMonths.includes(month)) return "summer";
  return "winter";
}
