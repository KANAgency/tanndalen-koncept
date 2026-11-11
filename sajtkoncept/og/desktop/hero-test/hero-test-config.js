/**
 * OG hero-test — tunable config (single object).
 * Swap headlineLead, image.src, and clouds[].src without touching the component.
 * With ?debug=1 the panel mutates a live copy of this object.
 */

/**
 * @typedef {{
 *   id: string,
 *   src: string,
 *   widthVw: number,
 *   leftVw: number,
 *   flipX: boolean,
 *   rotateDeg: number,
 *   yStartVh: number,
 *   yEndVh: number,
 *   startP: number,
 *   endP: number,
 *   opacityMax: number,
 *   ease: 'easeOut' | 'linear',
 *   aspectRatio: string
 * }} CloudLayerConfig
 */

export const HERO_TEST_CONFIG = {
  /** First headline line — swap later ("Sommar i", "Weekend i", …). */
  headlineLead: "Paus i",
  /** Second line — fixed brand phrase. */
  headlineFixed: "skidparadiset",

  /** Left edge of headline block (vw). */
  headlineLeft: 14,
  /** Top of first line (vh). */
  headlineTop: 68,
  /**
   * Font-size as vw inside clamp(3.75rem, Nvw, 8.5rem).
   */
  headlineFontSizeVw: 5.35,
  headlineLineHeight: 1.05,

  image: {
    /**
     * Site-root asset on OG-only serve (preview:og / deploy) → /hero-test.jpg
     * Multi-site dev (/og/…) remaps to /og/hero-test.jpg in the component.
     * Missing file → neutral blue-grey gradient placeholder.
     */
    src: "/hero-test.jpg",
    objectPosition: "50% 40%",
    scale: 1.12
  },

  /** Background parallax: translateY = bgParallax × pinScroll */
  bgParallax: 0.15,

  /**
   * Sticky runway height in vh. Hero is sticky 100svh inside;
   * pin distance = (scrollLengthVh - 100)vh. p = 1 when sticky releases.
   */
  scrollLengthVh: 200,

  /**
   * Transparent PNG cloud layers (normal blend, not screen).
   * Parked below the hero at p = 0; rise on their own startP→endP ranges.
   * Edge safety (clamped in JS): leftVw ≤ -5, leftVw+widthVw ≥ 105,
   * bottom edge never above viewport once started.
   * @type {CloudLayerConfig[]}
   */
  clouds: [
    {
      id: "cloud-1",
      src: "/assets/img/fog/cloud-1.png",
      widthVw: 150,
      leftVw: -35,
      flipX: false,
      rotateDeg: -2,
      yStartVh: 110,
      yEndVh: 55,
      startP: 0.08,
      endP: 0.45,
      opacityMax: 1,
      ease: "easeOut",
      aspectRatio: "1440 / 550"
    },
    {
      id: "cloud-2",
      src: "/assets/img/fog/cloud-2.png",
      widthVw: 190,
      leftVw: -30,
      flipX: true,
      rotateDeg: 1.5,
      yStartVh: 125,
      /* Recomputed on resize so solid white lower half fills the viewport */
      yEndVh: -80,
      startP: 0.12,
      endP: 0.8,
      opacityMax: 1,
      ease: "easeOut",
      aspectRatio: "1440 / 900"
    },
    {
      id: "cloud-gradient",
      src: "/assets/img/fog/cloud-gradient.png",
      widthVw: 150,
      leftVw: -20,
      flipX: false,
      rotateDeg: 0,
      yStartVh: 115,
      yEndVh: 30,
      startP: 0.05,
      endP: 0.6,
      opacityMax: 0.4,
      ease: "easeOut",
      aspectRatio: "1440 / 900"
    }
  ],

  snow: {
    /** Multiplier on area-scaled count (capped ~90). */
    density: 1,
    /** Fall-speed multiplier. */
    speed: 1,
    maxParticles: 90
  },

  /**
   * Headline fade starts around this progress (0–1).
   * Hard cut: opacity 0 + visibility hidden for every p ≥ 0.5.
   */
  headlineFadePoint: 0.25,

  /**
   * Next-section / seam colour. Default pure white.
   * On load, cloud-2 bottom is sampled; --page-bg updated to match.
   */
  pageBg: "#ffffff"
};
