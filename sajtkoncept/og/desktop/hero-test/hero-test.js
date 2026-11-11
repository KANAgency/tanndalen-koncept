/**
 * OG Hero Test — isolated mist/snow scroll hero.
 *
 * HOW TO SWAP ASSETS / COPY
 * -------------------------
 * 1. Headline lead: set `HERO_TEST_CONFIG.headlineLead` (e.g. "Sommar i", "Weekend i").
 * 2. Background image: og/desktop/hero-test.jpg → /hero-test.jpg (or change image.src).
 * 3. Clouds: transparent PNGs in assets/img/fog/ (cloud-1, cloud-2, cloud-gradient).
 * 4. Sticky runway: scrollLengthVh (default 200). p = 1 when sticky hero releases.
 * 5. pageBg defaults to #ffffff; cloud-2 bottom is sampled on load to kill the seam.
 *
 * At scrollY = 0 every cloud is parked below the hero (opacity 0 in CSS — no flash).
 * Stack: rAF + IntersectionObserver + canvas + CSS transform/opacity. No GSAP.
 */

import { HERO_TEST_CONFIG } from "./hero-test-config.js";

function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOut(t) {
  const x = clamp(t, 0, 1);
  return 1 - (1 - x) * (1 - x);
}

function easeValue(t, ease) {
  if (ease === "linear") return clamp(t, 0, 1);
  return easeOut(t);
}

/** Map /assets/… → /og/assets/… when multi-site dev prefixes /og/. */
function resolveSiteAsset(src) {
  if (!src || !src.startsWith("/")) return src;
  if (
    location.pathname.startsWith("/og/") &&
    !src.startsWith("/og/") &&
    !src.startsWith("/ds/") &&
    !src.startsWith("/shared/")
  ) {
    return `/og${src}`;
  }
  return src;
}

function deepCloneConfig(base) {
  return structuredClone(base);
}

function parseAspect(aspectRatio) {
  if (!aspectRatio || typeof aspectRatio !== "string") return null;
  const parts = aspectRatio.split("/").map((s) => Number(s.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { w: parts[0], h: parts[1] };
}

/** Rendered cloud height in vh for current viewport. */
function cloudHeightVh(cloud, viewportW, viewportH) {
  const aspect = parseAspect(cloud.aspectRatio);
  if (!aspect || !viewportH) return 100;
  const widthPx = (cloud.widthVw / 100) * viewportW;
  const heightPx = widthPx * (aspect.h / aspect.w);
  return (heightPx / viewportH) * 100;
}

/**
 * Clamp cloud geometry so edges never show.
 * (i) leftVw ≤ -5 and leftVw + widthVw ≥ 105
 * (ii) yEnd (and live y) keep bottom edge at/below viewport bottom
 */
function enforceCloudEdgeSafety(cloud, viewportW, viewportH, { warn = true } = {}) {
  const id = cloud.id || "cloud";
  let left = cloud.leftVw;
  let width = cloud.widthVw;

  if (left > -5) {
    if (warn) console.warn(`[hero-test] ${id}: leftVw ${left} > -5 — clamped to -5`);
    left = -5;
  }
  if (left + width < 105) {
    const next = 105 - left;
    if (warn) console.warn(`[hero-test] ${id}: width too narrow — clamped widthVw ${width} → ${next}`);
    width = next;
  }
  cloud.leftVw = left;
  cloud.widthVw = width;

  const hVh = cloudHeightVh(cloud, viewportW, viewportH);
  /* Bottom edge at y + h must be ≥ 100 → y ≥ 100 - h  (i.e. y must not go above that) */
  const minY = 100 - hVh;
  if (cloud.yEndVh < minY) {
    if (warn) {
      console.warn(
        `[hero-test] ${id}: yEndVh ${cloud.yEndVh} would expose bottom edge — clamped to ${minY.toFixed(1)}`
      );
    }
    cloud.yEndVh = minY;
  }

  /* cloud-2: cover viewport with solid lower half → yEnd ≤ -h/2, within safety */
  if (cloud.id === "cloud-2") {
    const coverY = -hVh / 2;
    const target = Math.max(coverY, minY);
    cloud.yEndVh = target;
  }

  return { heightVh: hVh, minY };
}

function cloudLocalT(p, cloud) {
  const start = cloud.startP ?? 0;
  const end = Math.max(start + 0.001, cloud.endP ?? 1);
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

function cloudY(p, cloud, minY) {
  const t = easeValue(cloudLocalT(p, cloud), cloud.ease || "easeOut");
  let y = lerp(cloud.yStartVh, cloud.yEndVh, t);
  /* Once started, never let the bottom edge rise above the viewport */
  if (cloudLocalT(p, cloud) > 0 && typeof minY === "number") {
    y = Math.max(y, minY);
  }
  return y;
}

function cloudOpacity(p, cloud) {
  const local = cloudLocalT(p, cloud);
  if (local <= 0) return 0;
  const fade = clamp(local / 0.15, 0, 1);
  return (cloud.opacityMax ?? 1) * fade;
}

function cloudTransform(cloud, yVh) {
  const flip = cloud.flipX ? -1 : 1;
  const rot = cloud.rotateDeg ?? 0;
  return `translate3d(0, ${yVh}vh, 0) rotate(${rot}deg) scaleX(${flip})`;
}

function applyCloudLayout(el, cloud) {
  el.style.left = `${cloud.leftVw}vw`;
  el.style.width = `${cloud.widthVw}vw`;
  el.style.aspectRatio = cloud.aspectRatio || "auto";
}

function sampleBottomColor(img) {
  try {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;
    const canvas = document.createElement("canvas");
    const sw = Math.min(64, w);
    const sh = Math.min(16, h);
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const sx = Math.floor(w * 0.4);
    const sy = Math.max(0, h - sh);
    const sWidth = Math.floor(w * 0.2);
    ctx.drawImage(img, sx, sy, sWidth, sh, 0, 0, sw, sh);
    const data = ctx.getImageData(0, 0, sw, sh).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 200) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n += 1;
    }
    if (!n) return null;
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  } catch {
    return null;
  }
}

function createCloudLayer(cloud) {
  const img = document.createElement("img");
  img.className = "og-ht-cloud";
  img.dataset.cloud = cloud.id;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.decoding = "async";
  img.draggable = false;
  applyCloudLayout(img, cloud);
  img.style.opacity = "0";
  img.style.transform = cloudTransform(cloud, cloud.yStartVh);
  img.src = resolveSiteAsset(cloud.src);
  img.onerror = () => {
    img.hidden = true;
    img.removeAttribute("src");
  };
  return img;
}

/* ---------- Snow ---------- */

function makeSnowflakeSprite(size, soft) {
  const c = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.ceil(size * dpr);
  c.height = Math.ceil(size * dpr);
  const ctx = c.getContext("2d");
  const r = (size * dpr) / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  if (soft) {
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
  } else {
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.5, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

function createSnowSystem(canvas, getConfig) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const layers = [
    { depth: "far", countShare: 0.55, size: [1.2, 2.2], speed: [18, 36], alpha: [0.25, 0.45], soft: false },
    { depth: "mid", countShare: 0.3, size: [2.2, 3.6], speed: [36, 58], alpha: [0.4, 0.65], soft: false },
    { depth: "near", countShare: 0.15, size: [3.6, 5.5], speed: [58, 90], alpha: [0.55, 0.85], soft: true }
  ];

  const sprites = {
    hard: makeSnowflakeSprite(16, false),
    soft: makeSnowflakeSprite(24, true)
  };

  /** @type {Array<{x:number,y:number,r:number,vy:number,amp:number,freq:number,phase:number,alpha:number,soft:boolean}>} */
  let particles = [];
  let w = 0;
  let h = 0;
  let opacity = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
  }

  function targetCount() {
    const cfg = getConfig().snow;
    const area = w * h;
    const base = Math.round((area / 18000) * (cfg.density || 1));
    return clamp(base, 24, cfg.maxParticles || 90);
  }

  function rebuild() {
    const total = targetCount();
    const next = [];
    for (const layer of layers) {
      const n = Math.max(1, Math.round(total * layer.countShare));
      for (let i = 0; i < n; i++) next.push(spawn(layer, true));
    }
    particles = next.slice(0, getConfig().snow.maxParticles || 90);
  }

  function spawn(layer, randomY) {
    const size = lerp(layer.size[0], layer.size[1], Math.random());
    const vy = lerp(layer.speed[0], layer.speed[1], Math.random());
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -size * 2,
      r: size,
      vy,
      amp: lerp(8, 28, Math.random()) * (layer.depth === "near" ? 1.2 : 0.8),
      freq: lerp(0.35, 0.9, Math.random()),
      phase: Math.random() * Math.PI * 2,
      alpha: lerp(layer.alpha[0], layer.alpha[1], Math.random()),
      soft: layer.soft
    };
  }

  function setOpacity(v) {
    opacity = v;
  }

  function tick(dt, running) {
    if (!running || opacity <= 0.01) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    const speedMul = getConfig().snow.speed || 1;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.phase += dt * p.freq;
      p.y += p.vy * speedMul * dt;
      const x = p.x + Math.sin(p.phase) * p.amp;
      if (p.y - p.r > h) {
        p.y = -p.r * 2;
        p.x = Math.random() * w;
      }
      const sprite = p.soft ? sprites.soft : sprites.hard;
      const s = p.r * 2;
      ctx.globalAlpha = opacity * p.alpha;
      ctx.drawImage(sprite, x - p.r, p.y - p.r, s, s);
    }
    ctx.globalAlpha = 1;
  }

  return { resize, tick, setOpacity, rebuild };
}

/* ---------- Mount ---------- */

/**
 * @param {HTMLElement} root
 * @param {{ headlineLead?: string, config?: typeof HERO_TEST_CONFIG }} [options]
 */
export function mountHeroTest(root, options = {}) {
  const config = deepCloneConfig(options.config || HERO_TEST_CONFIG);
  if (options.headlineLead) config.headlineLead = options.headlineLead;

  const reduced = prefersReducedMotion();
  document.documentElement.style.setProperty("--page-bg", config.pageBg);

  const runway = document.createElement("div");
  runway.className = "og-ht-runway";
  runway.setAttribute("data-og-ht-runway", "");

  const hero = document.createElement("section");
  hero.className = "og-ht-hero";
  hero.setAttribute("data-og-hero-test", "");

  if (reduced) {
    runway.style.height = "auto";
    hero.style.position = "relative";
    hero.style.top = "auto";
  } else {
    syncRunwayHeight();
  }

  function syncRunwayHeight() {
    const len = Math.max(100, config.scrollLengthVh || 200);
    config.scrollLengthVh = len;
    document.documentElement.style.setProperty("--og-ht-scroll-length", `${len}vh`);
    runway.style.height = `${len}vh`;
  }

  const bg = document.createElement("img");
  bg.className = "og-ht-bg";
  bg.alt = "";
  bg.setAttribute("aria-hidden", "true");
  bg.decoding = "async";
  bg.style.objectPosition = config.image.objectPosition;
  bg.style.transform = `scale(${config.image.scale}) translate3d(0, 0, 0)`;
  bg.src = resolveSiteAsset(config.image.src);
  bg.onerror = () => {
    bg.hidden = true;
  };

  const scrimTop = document.createElement("div");
  scrimTop.className = "og-ht-scrim-top";
  scrimTop.setAttribute("aria-hidden", "true");

  const scrimHeadline = document.createElement("div");
  scrimHeadline.className = "og-ht-scrim-headline";
  scrimHeadline.setAttribute("aria-hidden", "true");

  const title = document.createElement("h1");
  title.className = "og-ht-title";
  const line1 = document.createElement("span");
  line1.className = "og-ht-title-line";
  line1.dataset.ogHtLead = "";
  line1.textContent = config.headlineLead;
  const line2 = document.createElement("span");
  line2.className = "og-ht-title-line";
  line2.textContent = config.headlineFixed;
  title.append(line1, line2);

  /** @type {HTMLImageElement[]} */
  const cloudEls = [];
  /** @type {Array<{heightVh:number, minY:number}>} */
  let cloudMetrics = [];
  const cloudsHost = document.createDocumentFragment();
  (config.clouds || []).forEach((cloud) => {
    const el = createCloudLayer(cloud);
    cloudEls.push(el);
    cloudsHost.append(el);

    if (cloud.id === "cloud-2") {
      const applySample = () => {
        const sampled = sampleBottomColor(el);
        if (!sampled) return;
        config.pageBg = sampled;
        document.documentElement.style.setProperty("--page-bg", sampled);
      };
      if (el.complete && el.naturalWidth) applySample();
      else el.addEventListener("load", applySample, { once: true });
    }
  });

  const bottomFade = document.createElement("div");
  bottomFade.className = "og-ht-bottom-fade";
  bottomFade.setAttribute("aria-hidden", "true");
  if (!reduced) bottomFade.style.opacity = "0";

  const snowCanvas = document.createElement("canvas");
  snowCanvas.className = "og-ht-snow";
  snowCanvas.setAttribute("aria-hidden", "true");

  hero.append(bg, scrimTop, scrimHeadline, title, cloudsHost, bottomFade, snowCanvas);
  runway.append(hero);
  root.prepend(runway);

  const snow = createSnowSystem(snowCanvas, () => config);

  function syncHeadlineVars() {
    const rootEl = document.documentElement;
    rootEl.style.setProperty("--og-ht-headline-left", `${config.headlineLeft}vw`);
    rootEl.style.setProperty("--og-ht-headline-top", `${config.headlineTop}vh`);
    rootEl.style.setProperty("--og-ht-headline-size", `${config.headlineFontSizeVw}vw`);
    rootEl.style.setProperty("--og-ht-headline-leading", String(config.headlineLineHeight ?? 1.05));
    line1.textContent = config.headlineLead;
  }
  syncHeadlineVars();

  function refreshCloudSafety(warn) {
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    cloudMetrics = (config.clouds || []).map((cloud) =>
      enforceCloudEdgeSafety(cloud, vw, vh, { warn })
    );
    cloudEls.forEach((el, i) => {
      const cloud = config.clouds[i];
      if (!cloud || el.hidden) return;
      applyCloudLayout(el, cloud);
    });
  }
  refreshCloudSafety(true);

  let scrollY = window.scrollY || 0;
  let viewportH = window.innerHeight || 1;
  let wrapperTop = 0;
  let progress = 0;
  let pinScroll = 0;
  let intersecting = true;
  let tabVisible = document.visibilityState !== "hidden";
  let rafId = 0;
  let lastTs = 0;
  let dirty = true;

  function measureWrapperTop() {
    /* Layout read — only on resize / init, never in the rAF hot path */
    const rect = runway.getBoundingClientRect();
    wrapperTop = rect.top + (window.scrollY || 0);
  }

  function computeProgress() {
    if (reduced) {
      pinScroll = 0;
      progress = scrollY > 0 ? 1 : 0;
      return;
    }
    const len = Math.max(100, config.scrollLengthVh || 200);
    const pinDistance = ((len - 100) / 100) * viewportH;
    pinScroll = Math.max(0, scrollY - wrapperTop);
    progress = pinDistance > 0 ? clamp(pinScroll / pinDistance, 0, 1) : 0;
  }

  function applyCloudVisual(el, cloud, metrics, p, forceStaticEnd) {
    if (el.hidden) return;
    const minY = metrics?.minY;
    if (forceStaticEnd) {
      const y = typeof minY === "number" ? Math.max(cloud.yEndVh, minY) : cloud.yEndVh;
      el.style.transform = cloudTransform(cloud, y);
      el.style.opacity = String(cloud.opacityMax ?? 1);
      return;
    }
    const y = cloudY(p, cloud, minY);
    const op = cloudOpacity(p, cloud);
    el.style.transform = cloudTransform(cloud, y);
    el.style.opacity = String(op);
  }

  function applyVisuals() {
    const p = progress;
    const clouds = config.clouds || [];

    /* Headline: fade toward hard-gone at p = 0.5; then opacity 0 + visibility hidden */
    const HEADLINE_GONE_P = 0.5;
    let headlineFade = 1;
    if (reduced && scrollY <= 0) {
      headlineFade = 1;
    } else if (p >= HEADLINE_GONE_P) {
      headlineFade = 0;
    } else {
      const fadeStart = Math.min(config.headlineFadePoint ?? 0.25, HEADLINE_GONE_P - 0.01);
      headlineFade =
        p <= fadeStart
          ? 1
          : clamp(1 - (p - fadeStart) / (HEADLINE_GONE_P - fadeStart), 0, 1);
    }
    const headlineY = reduced ? 0 : pinScroll * 0.35;
    const blurPx = reduced || headlineFade <= 0 ? 0 : (1 - headlineFade) * 8;
    title.style.transform = `translate3d(0, ${headlineY}px, 0)`;
    title.style.opacity = String(headlineFade);
    title.style.visibility = headlineFade <= 0 ? "hidden" : "visible";
    title.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "none";

    if (reduced) {
      bg.style.transform = `scale(${config.image.scale}) translate3d(0, 0, 0)`;
      bottomFade.style.opacity = "1";
      const show = scrollY > 0;
      cloudEls.forEach((el, i) => {
        const cloud = clouds[i];
        if (!cloud) return;
        if (!show) {
          el.style.transform = cloudTransform(cloud, cloud.yStartVh);
          el.style.opacity = "0";
        } else {
          applyCloudVisual(el, cloud, cloudMetrics[i], 1, true);
        }
      });
      snow.setOpacity(0);
      snowCanvas.style.opacity = "0";
      return;
    }

    const bgY = config.bgParallax * pinScroll;
    bg.style.transform = `scale(${config.image.scale}) translate3d(0, ${bgY}px, 0)`;

    cloudEls.forEach((el, i) => {
      const cloud = clouds[i];
      if (!cloud) return;
      applyCloudVisual(el, cloud, cloudMetrics[i], p, false);
    });

    /* Soft bottom fade in over p = 0 → 0.15 */
    bottomFade.style.opacity = String(clamp(p / 0.15, 0, 1));

    const snowFade = clamp(1 - p * 1.15, 0, 1);
    snow.setOpacity(snowFade);
    snowCanvas.style.opacity = String(snowFade);
  }

  function syncFromConfig() {
    if (!reduced) syncRunwayHeight();
    refreshCloudSafety(true);
    syncHeadlineVars();
    document.documentElement.style.setProperty("--page-bg", config.pageBg);
    measureWrapperTop();
  }

  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
    lastTs = ts;

    if (dirty) {
      computeProgress();
      applyVisuals();
      dirty = false;
    }

    const runSnow = !reduced && intersecting && tabVisible && progress < 0.98;
    snow.tick(dt, runSnow);
  }

  function onScroll() {
    scrollY = window.scrollY || 0;
    dirty = true;
  }

  function onResize() {
    viewportH = window.innerHeight || 1;
    measureWrapperTop();
    refreshCloudSafety(false);
    snow.resize();
    dirty = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    tabVisible = document.visibilityState !== "hidden";
  });

  const io = new IntersectionObserver(
    (entries) => {
      intersecting = entries.some((e) => e.isIntersecting);
    },
    { threshold: 0.01 }
  );
  io.observe(hero);

  measureWrapperTop();
  snow.resize();
  computeProgress();
  applyVisuals();
  rafId = requestAnimationFrame(frame);

  let debugApi = null;
  if (new URLSearchParams(location.search).get("debug") === "1") {
    debugApi = mountDebugPanel(config, () => {
      syncFromConfig();
      snow.rebuild();
      dirty = true;
    });
  }

  return {
    config,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      debugApi?.destroy();
      runway.remove();
    }
  };
}

/** Stable export/import shape for the debug panel (round-trip). */
function serializeDebugConfig(config) {
  return {
    scrollLengthVh: config.scrollLengthVh,
    bgParallax: config.bgParallax,
    headlineFadePoint: config.headlineFadePoint,
    headlineLeft: config.headlineLeft,
    headlineTop: config.headlineTop,
    headlineFontSizeVw: config.headlineFontSizeVw,
    snow: {
      density: config.snow.density,
      speed: config.snow.speed
    },
    clouds: (config.clouds || []).map((c) => ({
      id: c.id,
      leftVw: c.leftVw,
      widthVw: c.widthVw,
      flipX: c.flipX,
      rotateDeg: c.rotateDeg,
      yStartVh: c.yStartVh,
      yEndVh: c.yEndVh,
      startP: c.startP,
      endP: c.endP,
      opacityMax: c.opacityMax
    }))
  };
}

const DEBUG_TOP_KEYS = new Set([
  "scrollLengthVh",
  "bgParallax",
  "headlineFadePoint",
  "headlineLeft",
  "headlineTop",
  "headlineFontSizeVw",
  "snow",
  "clouds"
]);

const DEBUG_SNOW_KEYS = new Set(["density", "speed"]);
const DEBUG_CLOUD_KEYS = new Set([
  "id",
  "leftVw",
  "widthVw",
  "flipX",
  "rotateDeg",
  "yStartVh",
  "yEndVh",
  "startP",
  "endP",
  "opacityMax"
]);

/**
 * Apply a partial debug JSON into the live config. Never throws.
 * @returns {{ applied: number, unknown: string[], error?: string }}
 */
function applyDebugJson(config, raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { applied: 0, unknown: [], error: "Invalid JSON" };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { applied: 0, unknown: [], error: "JSON must be an object" };
  }

  let applied = 0;
  const unknown = [];

  for (const key of Object.keys(data)) {
    if (!DEBUG_TOP_KEYS.has(key)) {
      unknown.push(key);
      continue;
    }

    if (key === "snow") {
      const snow = data.snow;
      if (!snow || typeof snow !== "object" || Array.isArray(snow)) {
        return { applied, unknown, error: "snow must be an object" };
      }
      for (const sk of Object.keys(snow)) {
        if (!DEBUG_SNOW_KEYS.has(sk)) {
          unknown.push(`snow.${sk}`);
          continue;
        }
        if (typeof snow[sk] !== "number" || Number.isNaN(snow[sk])) {
          return { applied, unknown, error: `snow.${sk} must be a number` };
        }
        config.snow[sk] = snow[sk];
        applied += 1;
      }
      continue;
    }

    if (key === "clouds") {
      const list = data.clouds;
      if (!Array.isArray(list)) {
        return { applied, unknown, error: "clouds must be an array" };
      }
      for (let i = 0; i < list.length; i++) {
        const entry = list[i];
        if (!entry || typeof entry !== "object") continue;
        let target = null;
        if (typeof entry.id === "string") {
          target = config.clouds.find((c) => c.id === entry.id) || null;
          if (!target) {
            unknown.push(`clouds[${entry.id}]`);
            continue;
          }
        } else if (config.clouds[i]) {
          target = config.clouds[i];
        } else {
          unknown.push(`clouds[${i}]`);
          continue;
        }
        for (const ck of Object.keys(entry)) {
          if (ck === "id") continue;
          if (!DEBUG_CLOUD_KEYS.has(ck)) {
            unknown.push(`clouds.${target.id}.${ck}`);
            continue;
          }
          if (ck === "flipX") {
            if (typeof entry.flipX !== "boolean") {
              return { applied, unknown, error: `clouds.${target.id}.flipX must be boolean` };
            }
            target.flipX = entry.flipX;
            applied += 1;
            continue;
          }
          if (typeof entry[ck] !== "number" || Number.isNaN(entry[ck])) {
            return { applied, unknown, error: `clouds.${target.id}.${ck} must be a number` };
          }
          target[ck] = entry[ck];
          applied += 1;
        }
      }
      continue;
    }

    if (typeof data[key] !== "number" || Number.isNaN(data[key])) {
      return { applied, unknown, error: `${key} must be a number` };
    }
    config[key] = data[key];
    applied += 1;
  }

  return { applied, unknown };
}

function copyDefaultsInto(config) {
  const fresh = structuredClone(HERO_TEST_CONFIG);
  config.scrollLengthVh = fresh.scrollLengthVh;
  config.bgParallax = fresh.bgParallax;
  config.headlineFadePoint = fresh.headlineFadePoint;
  config.headlineLeft = fresh.headlineLeft;
  config.headlineTop = fresh.headlineTop;
  config.headlineFontSizeVw = fresh.headlineFontSizeVw;
  config.headlineLead = fresh.headlineLead;
  config.headlineFixed = fresh.headlineFixed;
  config.headlineLineHeight = fresh.headlineLineHeight;
  config.pageBg = fresh.pageBg;
  config.snow.density = fresh.snow.density;
  config.snow.speed = fresh.snow.speed;
  config.snow.maxParticles = fresh.snow.maxParticles;
  fresh.clouds.forEach((src, i) => {
    const dst = config.clouds[i];
    if (!dst) return;
    dst.widthVw = src.widthVw;
    dst.leftVw = src.leftVw;
    dst.flipX = src.flipX;
    dst.rotateDeg = src.rotateDeg;
    dst.yStartVh = src.yStartVh;
    dst.yEndVh = src.yEndVh;
    dst.startP = src.startP;
    dst.endP = src.endP;
    dst.opacityMax = src.opacityMax;
  });
}

function mountDebugPanel(config, onChange) {
  const panel = document.createElement("aside");
  panel.className = "og-ht-debug";
  panel.setAttribute("data-og-ht-debug", "");

  const bar = document.createElement("div");
  bar.className = "og-ht-debug-bar";
  const heading = document.createElement("h2");
  heading.textContent = "Hero debug";
  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "og-ht-debug-toggle";
  collapseBtn.textContent = "Collapse";
  collapseBtn.addEventListener("click", () => {
    const collapsed = panel.classList.toggle("is-collapsed");
    collapseBtn.textContent = collapsed ? "Expand" : "Collapse";
  });
  bar.append(heading, collapseBtn);

  const body = document.createElement("div");
  body.className = "og-ht-debug-body";

  const msg = document.createElement("p");
  msg.className = "og-ht-debug-msg";
  msg.setAttribute("aria-live", "polite");

  function setMsg(text, tone) {
    msg.textContent = text || "";
    if (tone) msg.dataset.tone = tone;
    else delete msg.dataset.tone;
  }

  const pasteWrap = document.createElement("label");
  pasteWrap.className = "og-ht-debug-paste";
  const pasteLabel = document.createElement("span");
  pasteLabel.textContent = "Paste JSON";
  const pasteArea = document.createElement("textarea");
  pasteArea.spellcheck = false;
  pasteArea.placeholder = '{ "scrollLengthVh": 200, "clouds": [ … ] }';
  pasteWrap.append(pasteLabel, pasteArea);

  const actions = document.createElement("div");
  actions.className = "og-ht-debug-actions";
  const applyBtn = document.createElement("button");
  applyBtn.type = "button";
  applyBtn.textContent = "Apply";
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.textContent = "Copy JSON";
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Reset to defaults";
  resetBtn.style.gridColumn = "1 / -1";
  actions.append(applyBtn, copyBtn, resetBtn);

  /** @type {Array<() => void>} */
  const syncers = [];

  function syncAllControls() {
    for (const sync of syncers) sync();
  }

  function paintNumberField({ label, hint, min, max, step, get, set }) {
    const field = document.createElement("label");
    field.className = "og-ht-debug-field";
    const name = document.createElement("span");
    name.className = "og-ht-debug-name";
    name.textContent = label;
    const hintEl = document.createElement("span");
    hintEl.className = "og-ht-debug-hint";
    hintEl.textContent = hint;
    const range = document.createElement("input");
    range.type = "range";
    range.min = String(min);
    range.max = String(max);
    range.step = String(step);
    const num = document.createElement("input");
    num.type = "number";
    num.min = String(min);
    num.max = String(max);
    num.step = String(step);

    function writeUI(v) {
      const clamped = clamp(v, min, max);
      range.value = String(clamped);
      num.value = String(clamped);
    }

    function commit(v) {
      const clamped = clamp(v, min, max);
      set(clamped);
      writeUI(clamped);
      onChange();
    }

    range.addEventListener("input", () => commit(Number(range.value)));
    num.addEventListener("change", () => {
      const v = Number(num.value);
      if (Number.isNaN(v)) {
        writeUI(get());
        return;
      }
      commit(v);
    });

    writeUI(get());
    syncers.push(() => writeUI(get()));
    field.append(name, hintEl, range, num);
    return field;
  }

  function paintCheck({ label, hint, get, set }) {
    const field = document.createElement("label");
    field.className = "og-ht-debug-check";
    const input = document.createElement("input");
    input.type = "checkbox";
    const text = document.createElement("span");
    text.className = "og-ht-debug-check-text";
    const name = document.createElement("span");
    name.textContent = label;
    const hintEl = document.createElement("span");
    hintEl.className = "og-ht-debug-hint";
    hintEl.textContent = hint;
    text.append(name, hintEl);
    input.addEventListener("change", () => {
      set(input.checked);
      onChange();
    });
    function writeUI() {
      input.checked = !!get();
    }
    writeUI();
    syncers.push(writeUI);
    field.append(input, text);
    return field;
  }

  function paintSection(title, open, build) {
    const details = document.createElement("details");
    details.className = "og-ht-debug-section";
    details.open = !!open;
    const summary = document.createElement("summary");
    summary.textContent = title;
    const inner = document.createElement("div");
    inner.className = "og-ht-debug-section-body";
    build(inner);
    details.append(summary, inner);
    return details;
  }

  body.append(
    msg,
    pasteWrap,
    actions,
    paintSection("Global", true, (inner) => {
      inner.append(
        paintNumberField({
          label: "scrollLengthVh",
          hint: "how tall the pinned intro runway is (100 = no pin)",
          min: 100,
          max: 400,
          step: 10,
          get: () => config.scrollLengthVh,
          set: (v) => {
            config.scrollLengthVh = v;
          }
        }),
        paintNumberField({
          label: "snow density",
          hint: "how many snowflakes (scaled by viewport, capped)",
          min: 0.2,
          max: 2,
          step: 0.05,
          get: () => config.snow.density,
          set: (v) => {
            config.snow.density = v;
          }
        }),
        paintNumberField({
          label: "snow speed",
          hint: "how fast the snow falls",
          min: 0.2,
          max: 2.5,
          step: 0.05,
          get: () => config.snow.speed,
          set: (v) => {
            config.snow.speed = v;
          }
        }),
        paintNumberField({
          label: "bg parallax",
          hint: "how much the background drifts while pinned",
          min: 0,
          max: 0.5,
          step: 0.01,
          get: () => config.bgParallax,
          set: (v) => {
            config.bgParallax = v;
          }
        }),
        paintNumberField({
          label: "headline fade point",
          hint: "when the headline starts fading (hard-gone at 0.5)",
          min: 0,
          max: 0.49,
          step: 0.01,
          get: () => config.headlineFadePoint,
          set: (v) => {
            config.headlineFadePoint = v;
          }
        })
      );
    }),
    paintSection("Headline", false, (inner) => {
      inner.append(
        paintNumberField({
          label: "left (vw)",
          hint: "distance from the left edge of the viewport",
          min: 4,
          max: 30,
          step: 0.5,
          get: () => config.headlineLeft,
          set: (v) => {
            config.headlineLeft = v;
          }
        }),
        paintNumberField({
          label: "top (vh)",
          hint: "distance from the top of the viewport",
          min: 40,
          max: 85,
          step: 0.5,
          get: () => config.headlineTop,
          set: (v) => {
            config.headlineTop = v;
          }
        }),
        paintNumberField({
          label: "size (vw)",
          hint: "font size as a share of viewport width",
          min: 3,
          max: 8,
          step: 0.05,
          get: () => config.headlineFontSizeVw,
          set: (v) => {
            config.headlineFontSizeVw = v;
          }
        })
      );
    })
  );

  const cloudHints = {
    leftVw: "horizontal position (negative = shifted left)",
    widthVw: "how wide the cloud image is drawn",
    rotateDeg: "slight tilt in degrees",
    yStartVh: "vertical park position before it starts (below the hero)",
    yEndVh: "vertical position when its scroll range ends",
    startP: "when the cloud starts moving (0 = top of page, 1 = end of intro)",
    endP: "when the cloud finishes its rise",
    opacityMax: "how dense the cloud gets",
    flipX: "mirror the cloud horizontally"
  };

  const cloudTitles = {
    "cloud-1": "Cloud-1",
    "cloud-2": "Cloud-2",
    "cloud-gradient": "Cloud-gradient"
  };

  (config.clouds || []).forEach((cloud) => {
    const title = cloudTitles[cloud.id] || cloud.id;
    body.append(
      paintSection(title, false, (inner) => {
        inner.append(
          paintNumberField({
            label: "leftVw",
            hint: cloudHints.leftVw,
            min: -100,
            max: 80,
            step: 1,
            get: () => cloud.leftVw,
            set: (v) => {
              cloud.leftVw = v;
            }
          }),
          paintNumberField({
            label: "startP",
            hint: cloudHints.startP,
            min: 0,
            max: 0.9,
            step: 0.01,
            get: () => cloud.startP,
            set: (v) => {
              cloud.startP = v;
            }
          }),
          paintNumberField({
            label: "endP",
            hint: cloudHints.endP,
            min: 0.1,
            max: 1,
            step: 0.01,
            get: () => cloud.endP,
            set: (v) => {
              cloud.endP = v;
            }
          }),
          paintNumberField({
            label: "opacityMax",
            hint: cloudHints.opacityMax,
            min: 0,
            max: 1,
            step: 0.01,
            get: () => cloud.opacityMax,
            set: (v) => {
              cloud.opacityMax = v;
            }
          }),
          paintCheck({
            label: "flipX",
            hint: cloudHints.flipX,
            get: () => cloud.flipX,
            set: (v) => {
              cloud.flipX = v;
            }
          })
        );

        const advanced = document.createElement("details");
        advanced.className = "og-ht-debug-advanced";
        const advSummary = document.createElement("summary");
        advSummary.textContent = "Advanced";
        const advBody = document.createElement("div");
        advBody.append(
          paintNumberField({
            label: "widthVw",
            hint: cloudHints.widthVw,
            min: 40,
            max: 240,
            step: 1,
            get: () => cloud.widthVw,
            set: (v) => {
              cloud.widthVw = v;
            }
          }),
          paintNumberField({
            label: "rotateDeg",
            hint: cloudHints.rotateDeg,
            min: -15,
            max: 15,
            step: 0.1,
            get: () => cloud.rotateDeg,
            set: (v) => {
              cloud.rotateDeg = v;
            }
          }),
          paintNumberField({
            label: "yStartVh",
            hint: cloudHints.yStartVh,
            min: 80,
            max: 180,
            step: 1,
            get: () => cloud.yStartVh,
            set: (v) => {
              cloud.yStartVh = v;
            }
          }),
          paintNumberField({
            label: "yEndVh",
            hint: cloudHints.yEndVh,
            min: -120,
            max: 100,
            step: 1,
            get: () => cloud.yEndVh,
            set: (v) => {
              cloud.yEndVh = v;
            }
          })
        );
        advanced.append(advSummary, advBody);
        inner.append(advanced);
      })
    );
  });

  applyBtn.addEventListener("click", () => {
    const result = applyDebugJson(config, pasteArea.value);
    if (result.error) {
      setMsg(result.error, "error");
      return;
    }
    syncAllControls();
    onChange();
    const unknownPart =
      result.unknown.length > 0 ? ` Ignored: ${result.unknown.join(", ")}.` : "";
    setMsg(`Applied ${result.applied} values.${unknownPart}`, "ok");
  });

  copyBtn.addEventListener("click", async () => {
    const text = JSON.stringify(serializeDebugConfig(config), null, 2);
    pasteArea.value = text;
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Copied JSON", "ok");
    } catch {
      setMsg("Copy failed — JSON is in the paste field", "error");
    }
  });

  resetBtn.addEventListener("click", () => {
    copyDefaultsInto(config);
    syncAllControls();
    onChange();
    setMsg("Reset to defaults", "ok");
  });

  panel.append(bar, body);
  document.body.append(panel);

  return {
    destroy() {
      panel.remove();
    }
  };
}

/* Auto-boot when this module is the page entry */
if (document.body?.hasAttribute("data-og-hero-test-page")) {
  const mount = document.querySelector("[data-og-hero-test-root]") || document.body;
  mountHeroTest(mount);
}
