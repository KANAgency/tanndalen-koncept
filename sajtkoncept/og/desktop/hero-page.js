/**
 * OG Hero Page — intro (scenes) → cloud scroll transition → hero.
 * Reuses cloud engine, snow canvas, TD header chrome, shared booking bar.
 * ?debug=1 · ?intro=1 force · ?intro=0 skip
 */

import { HERO_PAGE_CONFIG } from "./hero-page-config.js";
import { mountHeroPageBooking } from "./hero-page-booking.js";
import { initTdBlocks } from "./td-blocks.js";

const INTRO_SEEN_KEY = "og_intro_seen";

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

function deepCloneConfig(base) {
  return structuredClone(base);
}

function parseAspect(aspectRatio) {
  if (!aspectRatio || typeof aspectRatio !== "string") return null;
  const parts = aspectRatio.split("/").map((s) => Number(s.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { w: parts[0], h: parts[1] };
}

function cloudHeightVh(cloud, viewportW, mediaH) {
  const aspect = parseAspect(cloud.aspectRatio);
  if (!aspect || !mediaH) return 100;
  const widthPx = (cloud.widthVw / 100) * viewportW;
  const heightPx = widthPx * (aspect.h / aspect.w);
  return (heightPx / mediaH) * 100;
}

function enforceCloudEdgeSafety(cloud, viewportW, mediaH) {
  let left = cloud.leftVw;
  let width = cloud.widthVw;
  if (left > -5) left = -5;
  if (left + width < 105) width = 105 - left;
  cloud.leftVw = left;
  cloud.widthVw = width;
  const hVh = cloudHeightVh(cloud, viewportW, mediaH);
  const minY = 100 - hVh;
  if (cloud.yEndVh < minY) cloud.yEndVh = minY;
  if (cloud.id === "cloud-2") {
    const hPx = (hVh / 100) * mediaH;
    const overshootPx = ((typeof window !== "undefined" ? window.innerHeight : mediaH) * 5) / 100;
    if (hPx > 1) cloud.yEndVh = ((mediaH + overshootPx - hPx) / hPx) * 100;
  }
  return { heightVh: hVh, minY };
}

const CLOUD_WHITEOUT_BASE = 0.75;

function cloudLocalT(p, cloud, cloudSpeed = 1, whiteoutP = CLOUD_WHITEOUT_BASE) {
  const speed = Math.max(0.2, cloudSpeed);
  /* Remap layer windows so clouds finish as the screen hits whiteoutP */
  const scale = Math.max(0.35, (whiteoutP || CLOUD_WHITEOUT_BASE) / CLOUD_WHITEOUT_BASE);
  const pEff = clamp(p * speed, 0, 1);
  const start = (cloud.startP ?? 0) * scale;
  const end = Math.max(start + 0.001, (cloud.endP ?? 1) * scale);
  if (pEff <= start) return 0;
  if (pEff >= end) return 1;
  return (pEff - start) / (end - start);
}

function cloudY(p, cloud, minY, cloudSpeed = 1, whiteoutP = CLOUD_WHITEOUT_BASE) {
  const local = cloudLocalT(p, cloud, cloudSpeed, whiteoutP);
  const t = easeValue(local, cloud.ease || "easeOut");
  let y = lerp(cloud.yStartVh, cloud.yEndVh, t);
  /* Keep solid white foot of each layer past the viewport bottom (don't rise above minY) */
  if (local > 0 && typeof minY === "number") y = Math.max(y, minY);
  return y;
}

function cloudOpacity(p, cloud, cloudSpeed = 1, whiteoutP = CLOUD_WHITEOUT_BASE) {
  const local = cloudLocalT(p, cloud, cloudSpeed, whiteoutP);
  const startOp = cloud.opacityStart ?? 0;
  const maxOp = cloud.opacityMax ?? 1;
  if (local <= 0) return startOp;
  const fade = clamp(local / 0.1, 0, 1);
  return lerp(startOp, maxOp, fade);
}

function cloudTransform(cloud, yPct) {
  const flip = cloud.flipX ? -1 : 1;
  const rot = cloud.rotateDeg ?? 0;
  return `translate3d(0, ${yPct}%, 0) rotate(${rot}deg) scaleX(${flip})`;
}

function applyCloudLayout(el, cloud) {
  el.style.left = `${cloud.leftVw}vw`;
  el.style.width = `${cloud.widthVw}vw`;
  el.style.aspectRatio = cloud.aspectRatio || "auto";
}

function createCloudLayer(cloud) {
  const img = document.createElement("img");
  img.className = "og-hp-cloud";
  img.dataset.cloud = cloud.id;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.decoding = "async";
  img.draggable = false;
  applyCloudLayout(img, cloud);
  img.style.opacity = "0";
  img.style.transform = cloudTransform(cloud, cloud.yStartVh);
  img.src = cloud.src;
  img.onerror = () => {
    img.hidden = true;
    img.removeAttribute("src");
  };
  return img;
}

function resolveIntroMode() {
  const params = new URLSearchParams(location.search);
  const forced = params.get("intro");
  if (forced === "1") return "intro";
  if (forced === "0") return "skip";
  try {
    if (localStorage.getItem(INTRO_SEEN_KEY) === "1") return "skip";
  } catch {
    /* ignore */
  }
  return "intro";
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

function clearIntroSeen() {
  try {
    localStorage.removeItem(INTRO_SEEN_KEY);
  } catch {
    /* ignore */
  }
}


/**
 * Soft snowflake sprite with a slightly irregular outline: a few overlapping
 * blurred blobs, so flakes read as soft clumps instead of perfect circles.
 */
function makeSnowflakeSprite(size, soft) {
  const c = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.ceil(size * dpr);
  c.height = Math.ceil(size * dpr);
  const ctx = c.getContext("2d");
  const r = (size * dpr) / 2;
  const blobs = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < blobs; i++) {
    const main = i === 0;
    const ang = Math.random() * Math.PI * 2;
    const off = main ? 0 : r * (0.12 + Math.random() * 0.22);
    const cx = r + Math.cos(ang) * off;
    const cy = r + Math.sin(ang) * off;
    const br = r * (main ? 0.72 : 0.38 + Math.random() * 0.3);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, br);
    const core = main ? (soft ? 0.9 : 0.85) : (soft ? 0.55 : 0.5);
    g.addColorStop(0, `rgba(255,255,255,${core})`);
    g.addColorStop(soft ? 0.4 : 0.5, `rgba(255,255,255,${core * (soft ? 0.5 : 0.4)})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, br, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

function createSnowSystem(canvas, getConfig) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const layers = [
    { depth: "far", countShare: 0.6, size: [0.9, 2.6], speed: [18, 36], alpha: [0.25, 0.45], soft: false },
    { depth: "mid", countShare: 0.33, size: [2.2, 4.6], speed: [36, 58], alpha: [0.4, 0.65], soft: false },
    { depth: "near", countShare: 0.07, size: [4, 8.5], speed: [58, 90], alpha: [0.55, 0.85], soft: true }
  ];

  /* Several irregular variants per kind; each flake picks one. */
  const sprites = {
    hard: Array.from({ length: 8 }, () => makeSnowflakeSprite(16, false)),
    soft: Array.from({ length: 8 }, () => makeSnowflakeSprite(24, true))
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
      soft: layer.soft,
      sprite: Math.floor(Math.random() * 8),
      rot: Math.random() * Math.PI * 2,
      spin: lerp(-0.6, 0.6, Math.random()),
      sx: lerp(0.8, 1.2, Math.random()),
      sy: lerp(0.8, 1.2, Math.random())
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
      const sprite = (p.soft ? sprites.soft : sprites.hard)[p.sprite || 0];
      const s = p.r * 2;
      p.rot += (p.spin || 0) * dt;
      ctx.globalAlpha = opacity * p.alpha;
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.scale(p.sx || 1, p.sy || 1);
      ctx.drawImage(sprite, -p.r, -p.r, s, s);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  return { resize, tick, setOpacity, rebuild };
}

/* ---------- Media slot ---------- */

function mountMedia(slot, config, reduced) {
  slot.replaceChildren();

  if (config.mediaType === "video" && config.videoSrc && !reduced) {
    const video = document.createElement("video");
    video.className = "og-hp-media-el";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.poster = config.videoPoster || config.mediaSrc;
    video.src = config.videoSrc;
    video.style.objectPosition = config.mediaObjectPosition || "50% 40%";
    video.onerror = () => {
      video.hidden = true;
      mountImageFallback(slot, config);
    };
    slot.append(video);
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("loadeddata", tryPlay, { once: true });
    return video;
  }

  if (config.mediaType === "video" && reduced) {
    mountImageFallback(slot, config, config.videoPoster || config.mediaSrc);
    return null;
  }

  mountImageFallback(slot, config);
  return null;
}

function mountImageFallback(slot, config, src) {
  const img = document.createElement("img");
  img.className = "og-hp-media-el";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.decoding = "async";
  img.src = src || config.mediaSrc;
  img.style.objectPosition = config.mediaObjectPosition || "50% 40%";
  img.onerror = () => {
    img.hidden = true;
  };
  slot.append(img);
  return img;
}

/* ---------- Header chrome (copied behaviour from TD index.html ~1023–1255) ---------- */

function bindHeaderChrome() {
  const header = document.querySelector("[data-og-hp-header]");
  const menu = document.getElementById("site-menu");
  const menuPanel = document.getElementById("site-menu-panel");
  const menuControl = document.querySelector("[data-og-hp-menu-open]");

  /* Site menu open/close + chevrons + focus trap + Escape + outside click */
  if (menu && menuPanel && menuControl) {
    let menuOpen = false;

    function menuFocusables() {
      return [...menuPanel.querySelectorAll("a, button")].filter(
        (el) => !el.closest("[inert]") && !el.hidden && !el.closest("[hidden]")
      );
    }

    function openMenu() {
      menuOpen = true;
      menu.inert = false;
      menu.classList.add("is-open");
      document.body.classList.add("menu-open");
      menuControl.setAttribute("aria-expanded", "true");
      menuControl.setAttribute("aria-label", "Stäng meny");
      menuFocusables()[0]?.focus();
    }

    function closeMenu() {
      if (!menuOpen) return;
      menuOpen = false;
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuControl.setAttribute("aria-expanded", "false");
      menuControl.setAttribute("aria-label", "Öppna meny");
      menuControl.focus();
      window.setTimeout(() => {
        if (!menuOpen) menu.inert = true;
      }, 160);
    }

    menuControl.addEventListener("click", () => {
      menuOpen ? closeMenu() : openMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const items = menuFocusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!menuOpen) return;
      if (event.target.closest(".site-menu, .menu-control")) return;
      closeMenu();
    });

    menuPanel.addEventListener("click", (event) => {
      const chevron = event.target.closest(".site-menu-chevron");
      if (chevron) {
        const item = chevron.closest(".site-menu-item");
        const sub = item?.querySelector(".site-menu-sub");
        const clip = item?.querySelector(".site-menu-sub-clip");
        if (!item || !sub || !clip) return;
        const open = !sub.classList.contains("is-open");
        menuPanel.querySelectorAll(".site-menu-sub.is-open").forEach((other) => {
          other.classList.remove("is-open");
          other.querySelector(".site-menu-sub-clip").inert = true;
          other.parentElement.querySelector(".site-menu-chevron")?.setAttribute("aria-expanded", "false");
        });
        if (open) {
          sub.classList.add("is-open");
          clip.inert = false;
          chevron.setAttribute("aria-expanded", "true");
        }
        return;
      }
      const link = event.target.closest("a");
      if (link) closeMenu();
    });
  }

  /* Boka dropdown */
  const bokaMenu = document.querySelector("[data-og-hp-boka]");
  const bokaLink = bokaMenu?.querySelector("[data-og-hp-boka-toggle]");
  if (bokaMenu && bokaLink) {
    const setBokaOpen = (open) => {
      bokaMenu.classList.toggle("is-open", open);
      bokaLink.setAttribute("aria-expanded", String(open));
    };
    bokaLink.addEventListener("click", (event) => {
      event.preventDefault();
      setBokaOpen(bokaLink.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", (event) => {
      if (!bokaMenu.contains(event.target)) setBokaOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setBokaOpen(false);
    });
  }

  /* Account panel toggle — TODO: wire to real OG account lookup */
  const accountMenu = document.querySelector("[data-og-hp-account]");
  const accountBtn = document.querySelector("[data-og-hp-account-toggle]");
  const accountPanel = document.getElementById("account-panel");
  if (accountMenu && accountBtn && accountPanel) {
    const setAccountOpen = (open) => {
      accountBtn.setAttribute("aria-expanded", String(open));
      accountPanel.hidden = !open;
    };
    accountBtn.addEventListener("click", () => {
      setAccountOpen(accountBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", (event) => {
      if (!accountMenu.contains(event.target)) setAccountOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setAccountOpen(false);
    });
    accountPanel.querySelector("[data-account-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  /* Fråga oss — TODO: wire to OG help */
  document.getElementById("fraga-launch")?.addEventListener("click", (event) => {
    event.preventDefault();
  });

  return header;
}



/* ---------- Intro scene loop ---------- */

function fillSceneSlot(slot, scene, reduced) {
  slot.replaceChildren();
  slot.dataset.hasVideo = scene.video ? "1" : "0";
  if (scene.video && !reduced) {
    const video = document.createElement("video");
    video.className = "og-hp-scene-media";
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.src = scene.video;
    video.poster = scene.image || "";
    /* Load first frame; play starts together with the new line's first typed chars */
    slot.append(video);
    video.pause();
    video.addEventListener(
      "loadedmetadata",
      () => {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      },
      { once: true }
    );
    return video;
  }
  const img = document.createElement("img");
  img.className = "og-hp-scene-media";
  img.alt = "";
  img.decoding = "async";
  img.draggable = false;
  img.src = scene.image;
  slot.append(img);
  return img;
}

function playSceneVideo(slot) {
  const video = slot?.querySelector?.("video");
  if (!video) return;
  if (video.paused || video.ended) {
    try {
      if (video.currentTime > 0.05) video.currentTime = 0;
    } catch {
      /* ignore */
    }
    video.play().catch(() => {});
  }
}

/** Hold cut so clip still plays at end of fade-out when play starts near fade-in. */
function videoHoldEarlySec(scene, slot, duration, fade, config) {
  const floor = Math.max(0, scene?.advanceEarlySec ?? 0);
  if (!scene?.video) return floor;
  const video = slot?.querySelector?.("video");
  const clip =
    video && Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : (scene.clipDurationSec ?? config.defaultClipDurationSec ?? 5);
  /* play ≈ fade start → fully out: fade + hold + fade */
  const needed = duration + 2 * fade - clip + 0.12;
  return Math.max(floor, needed);
}

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

function jitteredMs(base, jitter) {
  const j = clamp(jitter ?? 0, 0, 1);
  const factor = 1 + (Math.random() * 2 - 1) * j;
  return Math.max(8, base * factor);
}

function createIntroLoop({ config, sceneA, sceneB, line1El, caretEl, reduced }) {
  const scenes = config.scenes || [];
  let index = 0;
  let active = "a";
  let frozen = false;
  let tabHidden = document.visibilityState === "hidden";
  let phase = "hold"; /* hold | transition */
  let holdElapsed = 0;
  let kenBurnsT = 0;
  let typed = "";
  let targetText = "";
  let crossfadeElapsed = 0;
  let crossfadeStarted = false;
  let apiPaused = false;
  let nextDelayMs = 0;
  let textPhase = "idle"; /* idle | fade-out | gap | type */
  let textFadeElapsed = 0;
  let pendingNextIndex = 1;
  let incomingVideoStarted = false;
  const line1Wrap = line1El?.parentElement || line1El;

  if (line1El) line1El.textContent = "";
  if (caretEl) {
    caretEl.hidden = true;
    caretEl.setAttribute("aria-hidden", "true");
  }
  fillSceneSlot(sceneA, scenes[0] || { image: "", video: null, line1: "" }, reduced);
  sceneA.classList.add("is-active");
  sceneB.classList.remove("is-active", "is-leaving");
  /* Opening: text + video together */
  playSceneVideo(sceneA);

  function currentSlot() {
    return active === "a" ? sceneA : sceneB;
  }
  function otherSlot() {
    return active === "a" ? sceneB : sceneA;
  }

  function applyKenBurns(el, t01) {
    if (!el || reduced) {
      const media = el?.querySelector(".og-hp-scene-media");
      if (media) media.style.transform = "none";
      return;
    }
    const media = el.querySelector(".og-hp-scene-media");
    if (!media || media.tagName === "VIDEO") return;
    const scale = lerp(1, config.kenBurnsScale ?? 1.08, t01);
    const panX = lerp(0, config.kenBurnsPanX ?? 3, t01);
    const panY = lerp(0, config.kenBurnsPanY ?? -2, t01);
    media.style.transform = `scale(${scale}) translate(${panX}%, ${panY}%)`;
  }

  /**
   * Same typing rhythm as TD's intro (td/desktop/intro.js typeLine):
   * 25–85 ms per character, +80–170 ms on the character after a space
   * (word-by-word bursts), +150 ms on ".", everything x0.8.
   */
  function scheduleTypeDelay(prevChar, nextChar) {
    const scene = (config.scenes || []).find((sc) => sc.line1 === targetText);
    const sceneSpeed = scene?.typeSpeed ?? config.sceneTypeSpeed ?? 1;
    const speed = Math.max(0.25, (config.typeSpeed ?? 1) * sceneSpeed);
    let wait = 25 + Math.floor(Math.random() * 61);
    if (prevChar === " ") wait += 80 + Math.floor(Math.random() * 91);
    if (nextChar === ".") wait += 150;
    nextDelayMs = Math.max(1, Math.round(wait * 0.8)) / speed;
  }

  function setLine1Opacity(op) {
    if (line1Wrap) line1Wrap.style.opacity = String(op);
  }

  /** Fade out current line1 → type next (used at scene crossfade start). */
  function startTextChange(nextLine) {
    targetText = nextLine;
    if (caretEl) {
      caretEl.hidden = true;
      caretEl.setAttribute("aria-hidden", "true");
    }
    if (reduced) {
      typed = nextLine;
      if (line1El) line1El.textContent = typed;
      setLine1Opacity(1);
      textPhase = "idle";
      nextDelayMs = 0;
      return;
    }
    if (typed.length === 0) {
      setLine1Opacity(1);
      textPhase = "gap";
      nextDelayMs = (config.eraseToTypePause ?? 40) / Math.max(0.25, config.typeSpeed ?? 1);
    } else {
      textPhase = "fade-out";
      textFadeElapsed = 0;
      setLine1Opacity(1);
    }
  }

  /** Start typing immediately (opening line — no erase). */
  function startTypingImmediately(line) {
    targetText = line || "";
    typed = "";
    if (line1El) line1El.textContent = "";
    if (caretEl) {
      caretEl.hidden = true;
      caretEl.setAttribute("aria-hidden", "true");
    }
    if (reduced) {
      typed = targetText;
      if (line1El) line1El.textContent = typed;
      textPhase = "idle";
      nextDelayMs = 0;
      return;
    }
    textPhase = "type";
    nextDelayMs = 40;
  }

  if (scenes[0]) startTypingImmediately(scenes[0].line1 || "");

  function startIncomingVideoWithNewText() {
    if (incomingVideoStarted || phase !== "transition") return;
    incomingVideoStarted = true;
    playSceneVideo(otherSlot());
  }

  function tickText(dtMs) {
    if (textPhase === "idle") return;

    if (textPhase === "fade-out") {
      const typeSpeed = Math.max(0.25, config.typeSpeed ?? 1);
      const dur = Math.max(40, (config.line1FadeOutMs ?? 180) / typeSpeed);
      textFadeElapsed += dtMs;
      const t = clamp(textFadeElapsed / dur, 0, 1);
      setLine1Opacity(1 - t);
      if (t < 1) return;
      typed = "";
      if (line1El) line1El.textContent = "";
      setLine1Opacity(1);
      textPhase = "gap";
      nextDelayMs = (config.eraseToTypePause ?? 40) / typeSpeed;
    }

    nextDelayMs -= dtMs;
    while (nextDelayMs <= 0 && textPhase !== "idle" && textPhase !== "fade-out") {
      if (textPhase === "gap") {
        textPhase = "type";
        scheduleTypeDelay("", targetText.charAt(0));
        /* New line begins → start incoming clip in the same beat */
        startIncomingVideoWithNewText();
      } else if (textPhase === "type") {
        if (!incomingVideoStarted && phase === "transition" && typed.length === 0) {
          startIncomingVideoWithNewText();
        }
        const nextChar = targetText.charAt(typed.length);
        typed = targetText.slice(0, typed.length + 1);
        if (line1El) line1El.textContent = typed;
        if (typed === targetText) {
          textPhase = "idle";
          nextDelayMs = 0;
        } else {
          scheduleTypeDelay(nextChar, targetText.charAt(typed.length));
        }
      } else {
        break;
      }
    }
  }

  function startVisualCrossfade() {
    if (crossfadeStarted) return;
    const next = scenes[pendingNextIndex % scenes.length];
    const from = currentSlot();
    const to = otherSlot();
    fillSceneSlot(to, next, reduced);
    to.classList.add("is-active");
    to.style.opacity = "0";
    from.classList.add("is-leaving", "is-active");
    applyKenBurns(to, 0);
    crossfadeStarted = true;
    crossfadeElapsed = 0;
  }

  function ensurePendingNext() {
    pendingNextIndex = (index + 1) % scenes.length;
    return scenes[pendingNextIndex];
  }

  /** Fade starts → line1 fades out, then type next + play next video together. */
  function beginVisualTransition() {
    const next = ensurePendingNext();
    incomingVideoStarted = false;
    startTextChange(next.line1 || "");
    startVisualCrossfade();
    phase = "transition";
    if (reduced) {
      incomingVideoStarted = true;
      playSceneVideo(otherSlot());
    }
  }

  function finishTransition() {
    const from = active === "a" ? sceneA : sceneB;
    const to = active === "a" ? sceneB : sceneA;
    from.classList.remove("is-active", "is-leaving");
    from.style.opacity = "";
    from.replaceChildren();
    to.classList.add("is-active");
    to.classList.remove("is-leaving");
    to.style.opacity = "";
    active = active === "a" ? "b" : "a";
    index = pendingNextIndex;
    if (reduced || typed === targetText || textPhase === "idle") {
      typed = targetText;
      if (line1El) line1El.textContent = typed;
      textPhase = "idle";
    }
    if (caretEl) caretEl.hidden = true;
    phase = "hold";
    crossfadeStarted = false;
    holdElapsed = 0;
    kenBurnsT = 0;
    applyKenBurns(currentSlot(), 0);
    /* Do not restart — clip already running with the new text */
    if (!incomingVideoStarted) playSceneVideo(currentSlot());
    incomingVideoStarted = false;
  }

  function nextScene() {
    if (phase !== "hold") return;
    holdElapsed = Math.max(holdElapsed, Math.max(0.5, config.sceneDuration ?? 4));
    beginVisualTransition();
  }

  function setPaused(v) {
    apiPaused = !!v;
  }

  function setFrozen(v) {
    frozen = !!v;
  }

  function setTabHidden(v) {
    tabHidden = !!v;
  }

  function tick(dt) {
    if (tabHidden || apiPaused || frozen || !scenes.length) return;

    const duration = Math.max(0.5, config.sceneDuration ?? 4);
    const fade = Math.max(0.2, config.crossfade ?? 1.2);

    if (phase === "hold") {
      holdElapsed += dt;
      kenBurnsT = clamp(holdElapsed / duration, 0, 1);
      applyKenBurns(currentSlot(), kenBurnsT);
      if (!reduced) tickText(dt * 1000);
      const early = videoHoldEarlySec(scenes[index], currentSlot(), duration, fade, config);
      if (holdElapsed >= duration - early) beginVisualTransition();
      return;
    }

    /* transition: rigid fade clock; text erase→type runs in parallel */
    if (!crossfadeStarted) startVisualCrossfade();
    crossfadeElapsed += dt;
    const fadeT = reduced ? 1 : clamp(crossfadeElapsed / fade, 0, 1);
    const from = active === "a" ? sceneA : sceneB;
    const to = active === "a" ? sceneB : sceneA;
    from.style.opacity = String(1 - fadeT);
    to.style.opacity = String(fadeT);
    applyKenBurns(to, fadeT * 0.15);
    if (!reduced) tickText(dt * 1000);

    if (fadeT >= 1) finishTransition();
  }

  return {
    tick,
    nextScene,
    setPaused,
    setFrozen,
    setTabHidden,
    isPaused: () => apiPaused,
    getIndex: () => index,
    /** Scene whose look should drive per-scene effects (incoming scene during a transition). */
    getActiveScene: () => (phase === "transition" ? scenes[pendingNextIndex] : scenes[index])
  };
}

/* ---------- Main ---------- */

function initHeroPage() {
  const config = deepCloneConfig(HERO_PAGE_CONFIG);
  const reduced = prefersReducedMotion();
  const mode = resolveIntroMode();
  const skipIntro = mode === "skip";
  const page = document.body;
  const header = document.querySelector("[data-og-hp-header]");
  const intro = document.querySelector("[data-og-hp-intro]");
  const pin = document.querySelector("[data-og-hp-intro-pin]");
  const spacer = document.querySelector("[data-og-hp-intro-spacer]");
  const sceneA = document.querySelector('[data-og-hp-scene="a"]');
  const sceneB = document.querySelector('[data-og-hp-scene="b"]');
  const logo = document.querySelector("[data-og-hp-intro-logo]");
  const headline = document.querySelector("[data-og-hp-headline]");
  const line1 = document.querySelector("[data-og-hp-headline-l1]");
  const line2 = document.querySelector("[data-og-hp-headline-l2]");
  const caret = document.querySelector("[data-og-hp-caret]");
  const cloudsHost = document.querySelector("[data-og-hp-clouds]");
  const snowCanvas = document.querySelector("[data-og-hp-snow]");
  const heroCopy = document.querySelector("[data-og-hp-hero-copy]");
  const heroTitle = document.querySelector("[data-og-hp-hero-title]");
  const heroBody = document.querySelector("[data-og-hp-hero-body]");
  const heroMediaBlock = document.querySelector("[data-og-hp-hero-media-block]");
  const heroFrameImg = document.querySelector("[data-og-hp-hero-frame-img]");
  const scrimTop = document.querySelector("[data-og-hp-scrim-top]");
  const scrimHeadline = document.querySelector("[data-og-hp-scrim-headline]");
  const whiteoutEl = document.querySelector("[data-og-hp-whiteout]");

  document.documentElement.style.setProperty("--page-bg", config.pageBg);

  let headerHideTimer = 0;
  let headerRevealed = skipIntro;

  function setHeaderIntroHidden(hidden) {
    if (!header) return;
    if (hidden) {
      header.hidden = true;
      header.inert = true;
      header.setAttribute("aria-hidden", "true");
      header.classList.add("is-intro-hidden");
      header.classList.remove("is-revealed", "is-sticky");
    } else {
      header.hidden = false;
      header.inert = false;
      header.removeAttribute("aria-hidden");
      header.classList.remove("is-intro-hidden");
    }
  }

  /** Time-based in (not scroll-scrubbed). Call once when p crosses headerRevealP. */
  function revealHeaderAnimated() {
    if (!header || headerRevealed) return;
    headerRevealed = true;
    if (headerHideTimer) {
      clearTimeout(headerHideTimer);
      headerHideTimer = 0;
    }
    setHeaderIntroHidden(false);
    header.classList.add("is-sticky");
    /* Paint parked state (-100% / opacity 0), then flip to revealed for CSS transition. */
    void header.offsetWidth;
    requestAnimationFrame(() => {
      header?.classList.add("is-revealed");
    });
  }

  /** Slide back out when p falls below headerRevealP − hysteresis. */
  function hideHeaderAnimated() {
    if (!header || !headerRevealed) return;
    headerRevealed = false;
    header.classList.remove("is-revealed");
    if (headerHideTimer) clearTimeout(headerHideTimer);
    const outMs = (config.headerRevealMs ?? 350) + 40;
    headerHideTimer = window.setTimeout(() => {
      headerHideTimer = 0;
      if (!headerRevealed) setHeaderIntroHidden(true);
    }, outMs);
  }

  function syncHeaderRevealTiming() {
    const slideMs = clamp(Number(config.headerRevealMs) || 350, 150, 800);
    const fadeMs = Math.max(80, Math.round(slideMs * (200 / 350)));
    config.headerRevealMs = slideMs;
    if (header) {
      header.style.setProperty("--og-hp-header-reveal-ms", String(slideMs));
      header.style.setProperty("--og-hp-header-fade-ms", String(fadeMs));
    }
  }

  function headerIsVisibleOrFocusable() {
    if (!header) return false;
    const style = getComputedStyle(header);
    const visiblyShown =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) >= 0.05;
    if (visiblyShown) return true;
    if (header.inert || header.hidden || style.display === "none") return false;
    const focusable = header.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return Boolean(focusable);
  }
  if (line2) line2.textContent = config.headlineLine2;
  if (heroTitle) heroTitle.textContent = config.heroTitle;
  if (heroBody) heroBody.textContent = config.heroBody;
  if (heroFrameImg) {
    heroFrameImg.src = config.heroFrameSrc;
    heroFrameImg.alt = "";
  }

  bindHeaderChrome();
  const bookingApi = mountHeroPageBooking();
  // En dag / Just nu / Frågor och svar / Områden — below the hero, independent
  // of the intro/scroll engine above, so it's safe to init right after booking.
  initTdBlocks();

  /** @type {HTMLImageElement[]} */
  const cloudEls = [];
  /** @type {Array<{heightVh:number, minY:number}>} */
  let cloudMetrics = [];

  if (cloudsHost) {
    (config.clouds || []).forEach((cloud) => {
      const el = createCloudLayer(cloud);
      cloudEls.push(el);
      cloudsHost.append(el);
    });
  }

  const snow = snowCanvas ? createSnowSystem(snowCanvas, () => config) : null;
  /* Extra snow only on scenes with snow: true; fades in/out between scenes. */
  let scrollSnowFade = 1;
  let sceneSnow = 1;
  let sceneSnowInit = false;
  function applySnowOpacity() {
    const o = scrollSnowFade * sceneSnow;
    snow?.setOpacity(o);
    if (snowCanvas) snowCanvas.style.opacity = String(o);
  }
  function updateSceneSnow(dtSec) {
    const scene = introLoop?.getActiveScene?.();
    const target = scene && scene.snow ? 1 : 0;
    if (!sceneSnowInit) { sceneSnow = target; sceneSnowInit = true; }
    const fadeSec = config.snowSceneFadeSec ?? 0.8;
    const step = fadeSec > 0 ? dtSec / fadeSec : 1;
    sceneSnow = target > sceneSnow ? Math.min(target, sceneSnow + step) : Math.max(target, sceneSnow - step);
    applySnowOpacity();
  }

  let introLoop = null;
  const introMedia = document.querySelector("[data-og-hp-intro-media]");
  if (!skipIntro && sceneA && sceneB) {
    introLoop = createIntroLoop({
      config,
      sceneA,
      sceneB,
      line1El: line1,
      caretEl: caret,
      reduced
    });
    requestAnimationFrame(() => {
      introMedia?.classList.add("is-ready");
    });
  }

  if (skipIntro) {
    page.classList.add("is-skip-intro");
    setHeaderIntroHidden(false);
    header?.classList.add("is-revealed", "is-sticky");
    heroCopy?.classList.add("is-revealed");
    heroMediaBlock?.classList.add("is-revealed");
  } else {
    setHeaderIntroHidden(true);
  }

  let scrollY = window.scrollY || 0;
  let viewportH = window.innerHeight || 1;
  let progress = 0;
  let rafId = 0;
  let lastTs = 0;
  let dirty = true;
  let introMarked = skipIntro;
  let heroRevealed = skipIntro;
  let mediaRevealed = skipIntro;
  let warnedHeadline = false;
  let warnedEdge = false;
  let warnedHeader = false;
  let warnedGap = false;

  /** Convert a 1440-frame px measure to vw (width-relative). */
  function pxToVw(px) {
    return `${((Number(px) || 0) / 1440) * 100}vw`;
  }

  function syncCssVars() {
    const root = document.documentElement;
    syncHeaderRevealTiming();
    const logoWpx = config.introLogoWidthPx ?? 168;
    const logoTopPx = config.introLogoTopPx ?? 51;
    const headlineLeftPx = config.headlineLeftPx ?? 125;
    const heroCopyLeftPx = config.heroTextAlignWithIntroHeadline
      ? headlineLeftPx
      : (config.heroCopyLeftPx ?? 201);
    const titlePx = config.heroTitleSizePx ?? 60;
    const bodyPx = config.heroBodySizePx ?? 16;
    const bodyLhPx = config.heroBodyLineHeightPx ?? 25.6;
    const headlineSizePx = config.headlineFontSizePx ?? 88;

    root.style.setProperty("--page-bg", config.pageBg);
    root.style.setProperty("--og-hp-intro-scroll", `${config.introScrollVh ?? 200}vh`);
    config.introLogoWidth = pxToVw(logoWpx);
    root.style.setProperty("--og-hp-intro-logo-width", config.introLogoWidth);
    root.style.setProperty("--og-hp-intro-logo-max", `${logoWpx}px`);
    root.style.setProperty("--og-hp-intro-logo-top", pxToVw(logoTopPx));
    root.style.setProperty("--og-hp-headline-left", pxToVw(headlineLeftPx));
    root.style.setProperty("--og-hp-headline-bottom", pxToVw(config.headlineBottomPx ?? 73));
    root.style.setProperty("--og-hp-headline-max-width", pxToVw(config.headlineMaxWidthPx ?? 798));
    /* Heading/xxl-regular — preferred scales as vw; floor/cap from Figma tokens */
    root.style.setProperty("--og-hp-headline-size", pxToVw(headlineSizePx));
    root.style.setProperty("--og-hp-headline-size-min", "var(--og-hp-heading-xxl-size-min)");
    root.style.setProperty("--og-hp-headline-size-max", `${headlineSizePx}px`);
    root.style.setProperty("--og-hp-heading-xxl-size", `${headlineSizePx}px`);
    root.style.setProperty("--og-hp-headline-leading", String(config.headlineLineHeight ?? 1.1));
    root.style.setProperty("--og-hp-headline-tracking", "var(--og-hp-heading-xxl-tracking)");
    const headlineAlign = config.headlineAlign === "center" ? "center" : "left";
    if (headline) headline.dataset.align = headlineAlign;
    root.style.setProperty("--og-hp-scrim-top", String(config.scrimTop ?? 0.35));
    root.style.setProperty("--og-hp-scrim-headline", String(config.scrimHeadline ?? 0.35));
    root.style.setProperty("--og-hp-hero-copy-left", pxToVw(heroCopyLeftPx));
    root.style.setProperty("--og-hp-hero-copy-top", pxToVw(config.heroCopyTopPx ?? 100));
    root.style.setProperty("--og-hp-hero-copy-max-width", pxToVw(config.heroCopyMaxWidthPx ?? 787));
    /* Heading/xl — --heading-2-size is the clamp max */
    root.style.setProperty("--heading-2-size", `${titlePx}px`);
    root.style.setProperty("--og-hp-hero-title-size", pxToVw(titlePx));
    root.style.setProperty("--og-hp-hero-title-size-min", "var(--og-hp-heading-2-size-min)");
    root.style.setProperty("--og-hp-hero-title-leading", "var(--og-hp-heading-xl-leading)");
    root.style.setProperty("--og-hp-hero-title-tracking", "var(--heading-2-letter-spacing)");
    root.style.setProperty("--og-hp-hero-body-size", `${bodyPx}px`);
    root.style.setProperty("--og-hp-hero-body-leading", String(bodyLhPx / bodyPx));
    root.style.setProperty("--og-hp-hero-body-tracking", "var(--og-hp-editorial-body-sm-tracking)");
    root.style.setProperty(
      "--og-hp-hero-title-body-gap",
      `${config.heroTitleBodyGapPx ?? 16}px`
    );
    root.style.setProperty("--og-hp-hero-frame-inset", pxToVw(config.heroFrameInsetPx ?? 80));
    root.style.setProperty("--og-hp-hero-frame-gap-top", pxToVw(config.heroFrameGapTopPx ?? 61));
    root.style.setProperty("--og-hp-booking-overlap-px", `${config.bookingOverlapPx ?? 40.5}px`);
    root.style.setProperty("--og-hp-hero-frame-aspect", config.heroFrameAspect || "1280 / 707");
    if (line2) line2.textContent = config.headlineLine2;
    if (heroTitle) heroTitle.textContent = config.heroTitle;
    if (heroBody) heroBody.textContent = config.heroBody;
    if (heroFrameImg && heroFrameImg.getAttribute("src") !== config.heroFrameSrc) {
      heroFrameImg.src = config.heroFrameSrc;
    }
  }

  function refreshCloudSafety() {
    if (!pin) return;
    const vw = window.innerWidth || 1;
    const mediaH = pin.clientHeight || viewportH;
    cloudMetrics = (config.clouds || []).map((cloud) => enforceCloudEdgeSafety(cloud, vw, mediaH));
    cloudEls.forEach((el, i) => {
      const cloud = config.clouds[i];
      if (!cloud || el.hidden) return;
      applyCloudLayout(el, cloud);
    });
  }

  function computeProgress() {
    if (skipIntro) {
      progress = 1;
      return;
    }
    const coverPx = ((config.introScrollVh ?? 200) / 100) * viewportH;
    progress = coverPx > 0 ? clamp(scrollY / coverPx, 0, 1) : 0;
  }

  function applyClouds(p) {
    const speed = config.cloudSpeed ?? 1;
    const whiteoutP = config.whiteoutP ?? CLOUD_WHITEOUT_BASE;
    cloudEls.forEach((el, i) => {
      const cloud = config.clouds[i];
      if (!cloud || el.hidden) return;
      const y = cloudY(p, cloud, cloudMetrics[i]?.minY, speed, whiteoutP);
      const op = cloudOpacity(p, cloud, speed, whiteoutP);
      el.style.transform = cloudTransform(cloud, y);
      el.style.opacity = String(op);
    });
  }

  function runSelfChecks(p) {
    const headerInP = config.headerRevealP ?? 0.35;
    const headerShouldBeHidden = !skipIntro && p < headerInP - 0.02;
    if (headerShouldBeHidden && headerIsVisibleOrFocusable()) {
      if (!warnedHeader) {
        console.warn("header visible or focusable before headerRevealP");
        warnedHeader = true;
      }
    } else if (!headerShouldBeHidden) {
      warnedHeader = false;
    }

    if (headline && p >= (config.headlineFadeEndP ?? 0.55)) {
      const op = Number(getComputedStyle(headline).opacity || "1");
      const cloudsCovering = cloudEls.some((el) => Number(el.style.opacity || 0) > 0.5);
      if (op > 0.15 && cloudsCovering && !warnedHeadline) {
        console.warn("headline still visible when clouds cover it");
        warnedHeadline = true;
      }
    }

    cloudEls.forEach((el) => {
      if (Number(el.style.opacity || 0) < 0.2 || el.hidden) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < viewportH - 2 && r.height > 40) {
        if (!warnedEdge) {
          console.warn(`hard cloud edge: ${el.dataset.cloud} bottom above viewport`);
          warnedEdge = true;
        }
      }
    });

    if (!skipIntro && p < 1 && pin) {
      const pinRect = pin.getBoundingClientRect();
      const veilOp = whiteoutEl ? Number(whiteoutEl.style.opacity || "0") : 0;
      const mediaBottomExposed = pinRect.bottom < viewportH - 2;
      let stripUncovered = false;
      if (veilOp < 0.95 && mediaBottomExposed) {
        const gapY = pinRect.bottom + 1;
        const cloudCoversGap = cloudEls.some((el) => {
          if (Number(el.style.opacity || 0) < 0.5 || el.hidden) return false;
          const r = el.getBoundingClientRect();
          return r.top <= gapY && r.bottom >= viewportH - 1;
        });
        stripUncovered = !cloudCoversGap;
      }
      if (mediaBottomExposed || stripUncovered) {
        if (!warnedGap) {
          console.warn(
            "intro cover gap while p < 1: media bottom edge and/or a viewport strip shows neither media nor cloud"
          );
          warnedGap = true;
        }
      } else {
        warnedGap = false;
      }
    }

  }

  function applyVisuals() {
    const p = progress;
    syncCssVars();

    if (!skipIntro) {
      /* Logo leaves fast upward */
      if (logo) {
        const logoY = -(config.logoSpeed ?? 1.5) * scrollY;
        logo.style.transform = `translate3d(-50%, ${logoY}px, 0)`;
        logo.style.opacity = String(clamp(1 - p * 1.8, 0, 1));
      }

      /* Headline parallax up + fade */
      if (headline) {
        const speed = config.headlineSpeed ?? 0.35;
        const y = -(speed) * scrollY;
        const fadeStart = config.headlineFadeStartP ?? 0.35;
        const fadeEndCfg = Math.min(config.headlineFadeEndP ?? 0.65, (config.headerRevealP ?? 1) - 0.02);
        const fadeEnd = Math.max(fadeStart + 0.01, fadeEndCfg);
        let fade = 1;
        if (p >= fadeEnd) fade = 0;
        else if (p > fadeStart) fade = clamp(1 - (p - fadeStart) / (fadeEnd - fadeStart), 0, 1);
        const alignX = config.headlineAlign === "center" ? "-50%" : "0";
        headline.style.transform = `translate3d(${alignX}, ${y}px, 0)`;
        headline.style.opacity = String(fade);
        headline.style.visibility = fade <= 0 ? "hidden" : "visible";
      }

      applyClouds(p);
      scrollSnowFade = clamp(1 - p * 1.05, 0, 1);
      applySnowOpacity();

      /* Scrims track media visibility — gone once clouds own the frame */
      const scrimFade = clamp(1 - p / 0.85, 0, 1);
      if (scrimTop) scrimTop.style.opacity = String(scrimFade);
      if (scrimHeadline) scrimHeadline.style.opacity = String(scrimFade);

      const whiteoutP = config.whiteoutP ?? 0.75;
      const veilStart = whiteoutP * 0.55;
      const veilOp = p <= veilStart ? 0 : clamp((p - veilStart) / Math.max(0.001, whiteoutP - veilStart), 0, 1);
      if (whiteoutEl) whiteoutEl.style.opacity = String(veilOp);

      /* Keep intro pinned full-bleed until solid white */
      if (pin) {
        if (p < whiteoutP) pin.classList.add("is-locked");
        else pin.classList.remove("is-locked");
      }

      introLoop?.setFrozen(p > (config.loopFreezeP ?? 0.3));

      /* Header: independent of whiteout — slides in mid-cloud cover (~0.5). */
      const headerInP = config.headerRevealP ?? 0.35;
      const headerOutP = headerInP - 0.05;
      if (p >= headerInP) revealHeaderAnimated();
      else if (p < headerOutP) hideHeaderAnimated();

      /* Hero copy reveals together with the header, in the white of the rising clouds. */
      const heroP = config.heroRevealP ?? config.headerRevealP ?? 0.35;
      /* Image + booking bar reveal with the copy; the stagger is done in CSS. */
      const mediaP = config.mediaRevealP ?? heroP;

      if (p >= heroP && !heroRevealed) {
        heroRevealed = true;
        heroCopy?.classList.add("is-revealed");
      }

      if (p >= mediaP && !mediaRevealed) {
        mediaRevealed = true;
        heroMediaBlock?.classList.add("is-revealed");
      }

      if (p >= 0.98 && !introMarked) {
        introMarked = true;
        markIntroSeen();
      }
    } else {
      applyClouds(1);
      snow?.setOpacity(0);
      if (whiteoutEl) whiteoutEl.style.opacity = "1";
      pin?.classList.remove("is-locked");
    }

    runSelfChecks(p);
  }

  function onScroll() {
    scrollY = window.scrollY || 0;
    dirty = true;
  }

  function onResize() {
    viewportH = window.innerHeight || 1;
    syncCssVars();
    refreshCloudSafety();
    snow?.resize();
    dirty = true;
  }

  function frame(ts) {
    const dt = lastTs ? clamp((ts - lastTs) / 1000, 0, 0.064) : 0.016;
    lastTs = ts;
    if (dirty) {
      computeProgress();
      applyVisuals();
      dirty = false;
    }
    if (!skipIntro) {
      introLoop?.tick(dt);
      updateSceneSnow(dt);
      snow?.tick(dt, document.visibilityState !== "hidden" && progress < 0.95);
    }
    rafId = requestAnimationFrame(frame);
  }

  document.addEventListener("visibilitychange", () => {
    introLoop?.setTabHidden(document.visibilityState === "hidden");
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  syncCssVars();
  refreshCloudSafety();
  snow?.resize();
  computeProgress();
  applyVisuals();
  dirty = true;
  rafId = requestAnimationFrame(frame);

  let debugApi = null;
  if (new URLSearchParams(location.search).get("debug") === "1") {
    debugApi = mountHeaderRevealDebug(config, () => {
      syncCssVars();
      dirty = true;
    });
  }

  return {
    config,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      bookingApi?.destroy();
      debugApi?.destroy();
    }
  };
}

/** Minimal simple debug panel — header reveal timing only. */
function mountHeaderRevealDebug(config, onChange) {
  const panel = document.createElement("aside");
  panel.className = "og-hp-debug";
  panel.setAttribute("data-og-hp-debug", "");

  const title = document.createElement("p");
  title.className = "og-hp-debug-title";
  title.textContent = "Hero page";

  const simple = document.createElement("div");
  simple.className = "og-hp-debug-simple";

  function paintRange({ label, hint, min, max, step, get, set }) {
    const field = document.createElement("label");
    field.className = "og-hp-debug-field";
    const name = document.createElement("span");
    name.className = "og-hp-debug-name";
    name.textContent = label;
    const hintEl = document.createElement("span");
    hintEl.className = "og-hp-debug-hint";
    hintEl.textContent = hint;
    const row = document.createElement("div");
    row.className = "og-hp-debug-range-row";
    const input = document.createElement("input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(get());
    const valueEl = document.createElement("span");
    valueEl.className = "og-hp-debug-value";
    const syncValue = () => {
      valueEl.textContent = String(get());
      input.value = String(get());
    };
    syncValue();
    input.addEventListener("input", () => {
      set(Number(input.value));
      syncValue();
      onChange();
    });
    row.append(input, valueEl);
    field.append(name, hintEl, row);
    return field;
  }

  simple.append(
    paintRange({
      label: "När menyn kommer in",
      hint: "headerRevealP",
      min: 0.15,
      max: 0.9,
      step: 0.01,
      get: () => config.headerRevealP,
      set: (v) => {
        config.headerRevealP = v;
      }
    }),
    paintRange({
      label: "Menyns fart",
      hint: "headerRevealMs · slide (fade snabbare)",
      min: 150,
      max: 800,
      step: 10,
      get: () => config.headerRevealMs,
      set: (v) => {
        config.headerRevealMs = v;
      }
    })
  );

  panel.append(title, simple);
  document.body.append(panel);
  return {
    destroy() {
      panel.remove();
    }
  };
}

initHeroPage();
