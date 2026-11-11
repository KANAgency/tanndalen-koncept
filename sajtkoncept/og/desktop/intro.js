/* OG intro — fullscreen season video, typewriter phrases, scroll shrink + topbar.
   Site-local only. Does not touch TD / shared / DS. */

import { INTRO_PHRASES, INTRO_SUFFIX } from "./intro-content.js";
import {
  BRAND_MARK,
  HERO_MEDIA,
  INTRO_SEEN_KEY,
  SCROLL,
  TYPEWRITER,
  defaultSeasonFromDate
} from "./intro-config.js";

function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function preferPosterOnly() {
  if (prefersReducedMotion()) return true;
  if (matchMedia("(max-width: 1023px)").matches) return true;
  try {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn?.saveData) return true;
    const type = String(conn?.effectiveType || "");
    if (type === "slow-2g" || type === "2g" || type === "3g") return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** Apply brand mark into every [data-og-logo] host. tone = light | dark */
export function paintBrandMarks(root = document) {
  root.querySelectorAll("[data-og-logo]").forEach((host) => {
    const tone = host.getAttribute("data-og-logo") === "light" ? "light" : "dark";
    const src = BRAND_MARK.src[tone];
    host.dataset.ogLogoTone = tone;
    host.classList.add("og-brand-mark");
    host.setAttribute("aria-label", BRAND_MARK.label);
    const paintText = () => {
      host.textContent = BRAND_MARK.label;
      host.dataset.ogLogoText = "1";
    };
    if (src) {
      host.textContent = "";
      delete host.dataset.ogLogoText;
      const img = document.createElement("img");
      img.src = src;
      img.alt = BRAND_MARK.label;
      img.decoding = "async";
      img.onerror = () => {
        img.remove();
        paintText();
      };
      host.append(img);
    } else if (!host.dataset.ogLogoText) {
      paintText();
    }
  });
}

function phrasesFor(season) {
  return INTRO_PHRASES[season === "summer" ? "summer" : "winter"] || INTRO_PHRASES.winter;
}

function mediaFor(season) {
  return HERO_MEDIA[season === "summer" ? "summer" : "winter"] || HERO_MEDIA.winter;
}

function longestPhrase(list) {
  return list.reduce((a, b) => (b.length > a.length ? b : a), "");
}

export function initOgIntro({ getSeason, subscribeSeason } = {}) {
  const root = document.documentElement;
  const runway = document.getElementById("og-hero-runway");
  const stage = document.getElementById("og-hero-stage");
  const hero = document.querySelector(".og-hero");
  const video = document.querySelector(".og-hero-video");
  const poster = document.querySelector(".og-hero-poster");
  const phraseEl = document.querySelector("[data-og-phrase]");
  const measureEl = document.querySelector("[data-og-phrase-measure]");
  const fullEl = document.querySelector("[data-og-phrase-full]");
  const fixedEl = document.querySelector("[data-og-title-fixed]");
  const pauseBtn = document.querySelector("[data-og-video-pause]");
  const topbar = document.querySelector(".og-topbar");
  const slot = document.querySelector(".og-hero-phrase-slot");

  if (!hero || !phraseEl) return;

  paintBrandMarks();
  if (fixedEl) fixedEl.textContent = ` ${INTRO_SUFFIX}`;

  root.style.setProperty("--og-runway-factor", String(SCROLL.runwayFactor));

  const reduced = prefersReducedMotion();
  let introActive = root.classList.contains("is-intro") && !root.classList.contains("is-intro-done");
  let season = typeof getSeason === "function" ? getSeason() : root.dataset.season || "winter";
  let phraseIndex = 0;
  let typed = "";
  let freeze = false;
  let freezeDone = false;
  let timer = 0;
  let phase = "idle"; /* type | hold | delete | idle */
  let videoEnabled = false;
  let userPaused = false;

  function setFullLabel(text) {
    if (fullEl) fullEl.textContent = `${text} ${INTRO_SUFFIX}`;
  }

  function reservePhraseWidth(list) {
    if (!measureEl || !slot) return;
    measureEl.textContent = longestPhrase(list);
    const width = measureEl.getBoundingClientRect().width;
    if (width > 0) slot.style.setProperty("--og-phrase-min-width", `${Math.ceil(width)}px`);
  }

  function showPosterOnly() {
    videoEnabled = false;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.hidden = true;
      try {
        video.load();
      } catch {
        /* ignore */
      }
    }
    if (poster) poster.hidden = false;
    if (pauseBtn) pauseBtn.hidden = true;
  }

  function syncPosterSrc(media) {
    if (!poster) return;
    poster.hidden = false;
    if (media.poster) {
      poster.src = media.poster;
      poster.onerror = () => {
        poster.removeAttribute("src");
        poster.hidden = true;
      };
    } else {
      poster.removeAttribute("src");
      poster.hidden = true;
    }
  }

  function tryPlayVideo(media) {
    if (!video) {
      syncPosterSrc(media);
      return;
    }
    if (preferPosterOnly()) {
      syncPosterSrc(media);
      showPosterOnly();
      return;
    }

    syncPosterSrc(media);
    const src = media.video;
    if (!src) {
      showPosterOnly();
      return;
    }
    const onReady = () => {
      videoEnabled = true;
      video.hidden = false;
      if (pauseBtn) {
        pauseBtn.hidden = false;
        pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
        pauseBtn.textContent = userPaused ? "Spela video" : "Pausa video";
      }
      if (!userPaused) video.play().catch(() => showPosterOnly());
    };
    const onError = () => showPosterOnly();

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");

    video.removeEventListener("canplay", onReady);
    video.removeEventListener("error", onError);

    if (video.getAttribute("src") === src && video.readyState >= 2) {
      onReady();
      return;
    }

    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.hidden = false;
    video.src = src;
    video.load();
    /* Safety: if neither fires (odd network), keep poster */
    window.setTimeout(() => {
      if (!videoEnabled && video.readyState < 2) showPosterOnly();
    }, 2500);
  }

  function applySeasonMedia(next) {
    season = next === "summer" ? "summer" : "winter";
    const list = phrasesFor(season);
    reservePhraseWidth(list);
    if (phraseIndex >= list.length) phraseIndex = 0;
    const current = list[phraseIndex] || list[0] || "";
    if (freeze || freezeDone || reduced || !introActive) {
      typed = current;
      phraseEl.textContent = typed;
      setFullLabel(typed);
      phase = "hold";
    } else if (phase === "idle") {
      typed = "";
      phraseEl.textContent = "";
      setFullLabel(current);
    }
    tryPlayVideo(mediaFor(season));
  }

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer);
      timer = 0;
    }
  }

  function schedule(fn, ms) {
    clearTimer();
    timer = window.setTimeout(fn, ms);
  }

  function markIntroDone() {
    if (!introActive && root.classList.contains("is-intro-done")) return;
    introActive = false;
    const anchor = stage || hero;
    const beforeTop = anchor?.getBoundingClientRect().top ?? 0;
    root.classList.add("is-intro-done");
    root.classList.remove("is-intro");
    document.body.classList.add("is-returning");
    document.body.classList.remove("is-intro");
    root.style.setProperty("--og-hero-scale", "1");
    root.style.setProperty("--og-hero-shrink", "0");
    root.style.setProperty("--og-topbar-reveal", "1");
    topbar?.classList.add("is-revealed");
    if (runway) runway.style.height = "auto";
    const afterTop = anchor?.getBoundingClientRect().top ?? 0;
    const drift = afterTop - beforeTop;
    if (Math.abs(drift) > 1) window.scrollBy(0, drift);
    window.removeEventListener("scroll", onScroll);
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    document.dispatchEvent(new CustomEvent("og-intro-done"));
  }

  function requestFreeze() {
    if (freeze || freezeDone || reduced || !introActive) return;
    freeze = true;
    if (phase === "hold" || phase === "idle") {
      freezeDone = true;
      clearTimer();
    }
  }

  function typeStep() {
    if (freezeDone) return;
    const list = phrasesFor(season);
    const target = list[phraseIndex] || "";

    if (phase === "type") {
      if (typed.length < target.length) {
        typed = target.slice(0, typed.length + 1);
        phraseEl.textContent = typed;
        schedule(typeStep, TYPEWRITER.typeMs);
        return;
      }
      setFullLabel(typed);
      phase = "hold";
      if (freeze) {
        freezeDone = true;
        clearTimer();
        return;
      }
      schedule(() => {
        phase = "delete";
        typeStep();
      }, TYPEWRITER.holdMs);
      return;
    }

    if (phase === "delete") {
      if (typed.length > 0) {
        typed = typed.slice(0, -1);
        phraseEl.textContent = typed;
        schedule(typeStep, TYPEWRITER.deleteMs);
        return;
      }
      phraseIndex = (phraseIndex + 1) % list.length;
      const next = list[phraseIndex] || "";
      setFullLabel(next);
      phase = "type";
      if (freeze) {
        /* Land on a complete next phrase, then freeze */
        typed = next;
        phraseEl.textContent = typed;
        freezeDone = true;
        clearTimer();
        return;
      }
      schedule(typeStep, TYPEWRITER.pauseBetweenMs);
    }
  }

  function startTypewriter() {
    const list = phrasesFor(season);
    phraseIndex = 0;
    typed = "";
    phraseEl.textContent = "";
    setFullLabel(list[0] || "");
    reservePhraseWidth(list);
    if (reduced || !introActive) {
      typed = list[0] || "";
      phraseEl.textContent = typed;
      setFullLabel(typed);
      freezeDone = true;
      return;
    }
    phase = "type";
    schedule(typeStep, TYPEWRITER.pauseBetweenMs);
  }

  function onScroll() {
    if (!introActive || reduced) return;
    const y = window.scrollY || 0;
    if (y > 4) requestFreeze();

    const vh = window.innerHeight || 1;
    const max = vh * SCROLL.runwayFactor;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    const scale = 1 - (1 - SCROLL.shrinkMin) * p;
    root.style.setProperty("--og-hero-shrink", String(p));
    root.style.setProperty("--og-hero-scale", String(scale));

    const reveal = p <= SCROLL.topbarAt ? 0 : Math.min(1, (p - SCROLL.topbarAt) / (1 - SCROLL.topbarAt));
    root.style.setProperty("--og-topbar-reveal", String(reveal));
    if (reveal > 0.05) topbar?.classList.add("is-revealed");
    else topbar?.classList.remove("is-revealed");

    if (p >= 0.98) markIntroDone();
  }

  pauseBtn?.addEventListener("click", () => {
    if (!video || !videoEnabled) return;
    userPaused = !userPaused;
    if (userPaused) video.pause();
    else video.play().catch(() => {});
    pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
    pauseBtn.textContent = userPaused ? "Spela video" : "Pausa video";
  });

  applySeasonMedia(season);
  startTypewriter();

  if (typeof subscribeSeason === "function") {
    subscribeSeason((next) => {
      clearTimer();
      phraseIndex = 0;
      phase = freeze || freezeDone || reduced || !introActive ? "hold" : "idle";
      applySeasonMedia(next);
      if (!(freeze || freezeDone || reduced || !introActive)) {
        phase = "type";
        typed = "";
        phraseEl.textContent = "";
        schedule(typeStep, TYPEWRITER.pauseBetweenMs);
      }
    });
  }

  if (introActive && !reduced) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  } else {
    root.style.setProperty("--og-topbar-reveal", "1");
    topbar?.classList.add("is-revealed");
    if (introActive) markIntroDone();
  }

  window.addEventListener("resize", () => reservePhraseWidth(phrasesFor(season)), { passive: true });
}

export { defaultSeasonFromDate, INTRO_SEEN_KEY, BRAND_MARK };
