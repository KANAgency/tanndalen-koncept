/**
 * OG hero-page — intro → cloud transition → hero.
 * Tunable values for intro → cloud → hero.
 */

/**
 * @typedef {{
 *   image: string,
 *   video: string | null,
 *   line1: string,
 *   advanceEarlySec?: number
 * }} IntroScene
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
 *   opacityStart: number,
 *   opacityMax: number,
 *   ease: 'easeOut' | 'linear',
 *   aspectRatio: string
 * }} CloudLayerConfig
 */

export const HERO_PAGE_CONFIG = {
  pageBg: "#f5eee5",

  /* ——— Intro scenes ——— */
  headlineLine2: "i skidparadiset",
  /**
   * Layout px are measured on a 1440-wide Figma frame and synced to vw/clamp in CSS.
   * Desktop — 32 (4042:18225).
   */
  introLogoWidthPx: 168,
  introLogoTopPx: 51,
  /** @deprecated use introLogoWidthPx — kept as CSS length override when set */
  introLogoWidth: "11.67vw",
  headlineLeftPx: 125,
  headlineBottomPx: 73,
  headlineMaxWidthPx: 798,
  headlineFontSizePx: 88,
  headlineLineHeight: 1.1,
  /** Intro headline: "left" | "center" (position + text-align). */
  headlineAlign: "center",

  /**
   * Five placeholder scenes. video: null → Ken Burns on image.
   * @type {IntroScene[]}
   */
  scenes: [
    /* advanceEarlySec = minimum early cut; JS also enforces clipDuration vs fade+hold+fade */
    { image: "../assets/img/og-hero-winter.jpg", video: "../assets/video/intro/tystnad.mp4", line1: "Total tystnad", typeSpeed: 1, snow: true, clipDurationSec: 5, advanceEarlySec: 0.25 },
    { image: "../assets/img/snow.jpg", video: "../assets/video/intro/kaffepaus.mp4", line1: "Kaffepaus", clipDurationSec: 5, advanceEarlySec: 0.6 },
    { image: "../assets/img/og-hero-winter.jpg", video: "../assets/video/intro/vinterbad.mp4", line1: "Vinterbad", snow: true, clipDurationSec: 5, advanceEarlySec: 0.3 },
    { image: "../assets/img/og-hero-winter.jpg", video: "../assets/video/intro/kvallsmys.mp4", line1: "Kvällsmys", clipDurationSec: 5, advanceEarlySec: 0.3 }
  ],

  /** How long each scene holds before crossfade (seconds). */
  sceneDuration: 4,
  /** Crossfade length (seconds). */
  crossfade: 1.2,
  /** Fallback when <video>.duration is not ready yet. */
  defaultClipDurationSec: 5,

  /**
   * Typing: write soon after scene start; old line1 fades out (no erase)
   * just before the next line types in.
   */
  line1FadeOutMs: 180,
  /** Default typing speed per scene (1 = TD rhythm). Override per scene with scene.typeSpeed. */
  sceneTypeSpeed: 0.93,
  /** Seconds for the extra snow to fade in/out between scenes (scene.snow: true shows it). */
  snowSceneFadeSec: 0.8,
  typeBase: 78,
  typeJitter: 0.3,
  typeHesitationChance: 0.06,
  typeHesitationMin: 80,
  typeHesitationMax: 160,
  typeSpacePauseMin: 90,
  typeSpacePauseMax: 160,
  /** Tiny beat after fade-out before the next line (ms). */
  eraseToTypePause: 40,

  /** Ken Burns end scale on stills. */
  kenBurnsScale: 1.08,
  /** Small Ken Burns pan in % of media (x, y). */
  kenBurnsPanX: 3,
  kenBurnsPanY: -2,

  /** Soft dark scrims over intro media (0–1 = peak black opacity). */
  scrimTop: 0.35,
  scrimHeadline: 0.35,

  /* ——— Scroll transition (pinned intro) ——— */
  /** Scroll length while intro stays pinned (vh). */
  introScrollVh: 200,
  /** Master cloud rise speed (1 = base layer timings). */
  cloudSpeed: 1,
  /** p at which viewport is solid page-bg white. */
  whiteoutP: 0.75,
  /** Logo leaves upward; 1 = with scroll, >1 = faster. */
  logoSpeed: 1.5,
  /** Headline net upward speed vs scroll (0.35 = slower than scroll). */
  headlineSpeed: 0.35,
  /** Headline fade window on cover progress p (0–1). */
  headlineFadeStartP: 0.15,
  /** Headline is fully gone by the time the header reveals (capped at headerRevealP in code). */
  headlineFadeEndP: 0.33,
  /** Freeze scene autoplay when p exceeds this. */
  loopFreezeP: 0.3,
  /** Typewriter speed master (1 = config typeBase as-is; higher = faster). */
  typeSpeed: 1,

  /* ——— Hero reveal (on white page) — only after whiteout ——— */
  /** When hero copy starts animating in. */
  heroRevealP: 0.78,
  /**
   * When TD header slides in (time-based, not scrubbed).
   * ~0.35 ≈ clouds covering the lower part of the viewport.
   */
  headerRevealP: 0.35,
  /** Header slide-in duration (ms). Fade is ~57% of this (200 @ 350). */
  headerRevealMs: 350,
  /** When framed media + booking start fading in. */
  mediaRevealP: 0.85,

  /** Framed hero media (Figma 1280×707 @ 1440). */
  heroFrameSrc: "../assets/img/og-hero-winter.jpg",
  heroFrameAspect: "1280 / 707",
  heroFrameInsetPx: 80,
  heroFrameGapTopPx: 61,
  bookingOverlapPx: 40.5,

  heroCopyLeftPx: 201,
  heroCopyTopPx: 100,
  heroCopyMaxWidthPx: 787,
  heroTitleSizePx: 60,
  heroBodySizePx: 16,
  heroBodyLineHeightPx: 25.6, /* 16 × 1.6 Editorial/body-sm */
  heroTitleBodyGapPx: 16, /* --space-lg */
  /** When true, hero copy uses headlineLeftPx instead of heroCopyLeftPx. */
  heroTextAlignWithIntroHeadline: false,

  heroTitle: "Ett skidparadis i Dalarna",
  heroBody:
    "Stugor nära backen, långa dagar i pist och skog, och plats för hela familjen. Placeholder-text för layouttesten — byt till riktig copy senare.",

  /**
   * Rising cloud layers during intro scroll. Order: cloud-1 → cloud-2 → cloud-gradient.
   * @type {CloudLayerConfig[]}
   */
  clouds: [
    {
      id: "cloud-1",
      src: "../assets/img/fog/cloud-1.png?v=1024",
      widthVw: 160,
      leftVw: -40,
      flipX: false,
      rotateDeg: -2,
      yStartVh: 88,
      yEndVh: -25,
      startP: 0.0,
      endP: 0.45,
      opacityStart: 0,
      opacityMax: 1,
      ease: "easeOut",
      aspectRatio: "1024 / 391"
    },
    {
      id: "cloud-2",
      src: "../assets/img/fog/cloud-2.png?v=1024",
      widthVw: 200,
      leftVw: -40,
      flipX: true,
      rotateDeg: 1.5,
      yStartVh: 100,
      yEndVh: -55,
      startP: 0.05,
      endP: 0.55,
      opacityStart: 0,
      opacityMax: 1,
      ease: "easeOut",
      aspectRatio: "1024 / 640"
    },
    {
      id: "cloud-gradient",
      src: "../assets/img/fog/cloud-gradient.png?v=1024g",
      widthVw: 180,
      leftVw: -35,
      flipX: false,
      rotateDeg: 0,
      yStartVh: 95,
      yEndVh: -45,
      startP: 0.15,
      endP: 0.72,
      opacityStart: 0,
      opacityMax: 1,
      ease: "easeOut",
      aspectRatio: "1024 / 640"
    }
  ],

  snow: {
    /* +25 % then +15 % vs the earlier 1 / 90 */
    density: 1.44,
    speed: 1,
    maxParticles: 130
  }
};

/**
 * OG booking tabs (shared booking.js). TODO(OG): real tabs/icons.
 */
export const HERO_PAGE_BOOKING = {
  pillStepPx: 78,
  tabs: [
    {
      id: "boende",
      label: "Boende",
      iconSrc: "../assets/icons/boende.svg",
      dateLabel: "Datum",
      dateValue: "Välj reseperiod",
      whoLabel: "Resesällskap",
      whoValue: "Välj resande",
      searchLabel: "Sök boende",
      linksHtml:
        `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>` +
        `<a class="td-booking-teaser" href="#omraden"><img src="../assets/img/teaser-boende-b.jpeg" alt="" loading="lazy"><span><strong class="td-ui-title-sm">Var vill ni bo?</strong><span class="td-teaser-sub td-ui-caption">Från ski in/ski out till stugby i skogen</span></span></a>`
    },
    {
      id: "liftkort",
      label: "Liftkort",
      iconSrc: "../assets/icons/liftkort.svg",
      dateLabel: "Dag",
      dateValue: "Välj dag",
      whoLabel: "Antal",
      whoValue: "Välj antal",
      searchLabel: "Sök liftkort",
      linksHtml:
        `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#priser">Liftkort och priser</a><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>`
    },
    {
      id: "skidhyra",
      label: "Skidhyra",
      iconSrc: "../assets/icons/skidhyra.svg",
      dateLabel: "Datum",
      dateValue: "Välj dag eller period",
      whoLabel: "Antal",
      whoValue: "Välj antal",
      searchLabel: "Sök skidhyra",
      linksHtml:
        `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#hyra">Om skidhyran</a><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>`
    },
    {
      id: "skidskola",
      label: "Skidskola",
      iconSrc: "../assets/icons/skidskola.svg",
      dateLabel: "Datum",
      dateValue: "Välj dag eller period",
      whoLabel: "Antal",
      whoValue: "Välj antal",
      searchLabel: "Sök skidskola",
      linksHtml:
        `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>` +
        `<a class="td-booking-teaser" href="#kurser"><img src="../assets/img/teaser-skola-b.png" alt="" loading="lazy"><span><strong class="td-ui-title-sm">Kurser och grupper</strong><span class="td-teaser-sub td-ui-caption">För barn från 4 år och vuxna</span></span></a>`
    },
    {
      id: "paket",
      label: "Paket",
      iconSrc: "../assets/icons/paket.svg",
      dateLabel: "Datum",
      dateValue: "Välj reseperiod",
      whoLabel: "Resesällskap",
      whoValue: "Välj resande",
      searchLabel: "Sök paket",
      linksHtml:
        `<p class="td-booking-links"><a class="td-ui-cta-sm" href="#kod">Har du en kampanjkod?</a></p>` +
        `<a class="td-booking-teaser" href="#paket"><img src="../assets/img/teaser-paket-b.png" alt="" loading="lazy"><span><strong class="td-ui-title-sm">Alla paket</strong><span class="td-teaser-sub td-ui-caption">Boende och liftkort i ett, från 2 nätter</span></span></a>`
    }
  ]
};
