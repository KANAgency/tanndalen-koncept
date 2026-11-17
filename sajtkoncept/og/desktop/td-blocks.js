/* Ported verbatim from td/desktop/index.html (module script ~1041–4463 + Fråga/Boende script ~4515–5292).
   Blocks: en-dag, just-nu, Fråga modal, boende. Excluded: booking, header/top, parallax, hitta, boka-menu, menu, hero video.
   Only path / copy / null-guard adaptations — see inline notes. Do not edit shared/. */
import { initJustNuStack } from "/ds/components/just-nu-stack.js";
import { initSegmented } from "/ds/components/segmented.js";
import { initSeasonToggles, getSeason, setSeason, subscribeSeason } from "/ds/components/season-toggle.js";
import { mountSeasonBanner } from "/ds/components/season-banner.js";
import { OG_FRAGOR, ogFragor, QA, qaFor, RAIN, RAIN_ANSWER, GENERIC, FOLLOW, SUGGEST, WELCOME, WELCOME_TILES, WELCOME_BOOKING, WELCOME_TODAY } from "./orsa-guiden.js";
import { SEASON_TOGGLE, SEASON_BANNER_COPY } from "./site-config.js";

const seasonBannerCopy = SEASON_BANNER_COPY;
let tdBlocksReady = false;

export function initTdBlocks(root = document) {
  if (tdBlocksReady) return;
  tdBlocksReady = true;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- just-nu stack + segmented (td 1050–1059) ---- */
  function initStacks() {
    try {
      const langdStack = document.querySelector('[data-gren-panel="langd"].td-just-nu-stack');
      const sommarStack = document.querySelector('[data-gren-panel="sommar"].td-just-nu-stack');
      if (langdStack) langdStack.hidden = false;
      if (sommarStack) sommarStack.hidden = false;
      document.querySelectorAll(".td-just-nu-stack").forEach(initJustNuStack);
      if (langdStack) langdStack.hidden = true;
      if (sommarStack) sommarStack.hidden = true;
      document.querySelectorAll(".td-segmented").forEach(initSegmented);
    } catch (error) { console.error("stack", error); }
  }

  /* ---- season toggle, en-dag season banner, en-dag scroll/snap/sun (td 1061–2480) ---- */
  function initSeasonAndEnDag() {
      try {
      initSeasonToggles(document, SEASON_TOGGLE);
      if (!document.getElementById("en-dag")) return;
      const enDayLive = document.getElementById("en-dag-live");
      const enDayHeading = document.getElementById("en-dag-title");
      let dayView = getSeason() === "summer" ? "summer" : "winter";
      const summerGaps = [
        "sommarbilderna ligger som sökvägar; filerna saknas ännu",
        "soluppgång och solnedgång följer dagens datum"
      ];
      let enDagSeasonReady = false;
      function applyDayView(view) {
        const section = document.getElementById("en-dag");
        if (section) section.dataset.dayView = view;
        if (enDayHeading) enDayHeading.textContent = view === "summer" ? "En sommardag i Orsa Grönklitt" : "En vinterdag i Orsa Grönklitt";
        if (enDagSeasonReady) syncEnDagContent(view);
        return view === "summer" ? summerGaps : [];
      }
      const seasonBannerHost = document.querySelector("[data-season-banner]");
      const seasonBanner = !seasonBannerHost ? { setMode() {} } : mountSeasonBanner(seasonBannerHost, {
        mode: dayView,
        copy: seasonBannerCopy,
        image: {
          winter: "./assets/img/banner-sommar.jpg",
          summer: "./assets/img/banner-vinter.jpg"
        },
        onSwitch() {
          const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
          const section = document.getElementById("en-dag");
          if (!section || !enDayHeading) return;
          const beforeH = section.offsetHeight;
            const finish = () => {
            const next = dayView === "winter" ? "summer" : "winter";
            const reveal = () => {
              setSeason(next);
              section.classList.remove("is-swapping");
              enDayHeading.focus({ preventScroll: true });
              section.dataset.heightBefore = String(beforeH);
              section.dataset.heightAfter = String(section.offsetHeight);
            };
            if (reducedMotion) reveal();
            else {
              section.classList.add("is-swapping");
              setTimeout(reveal, 150);
            }
          };
          const lockAt = parseFloat(getComputedStyle(enDayHeading).top) || 24;
          const sectionDoc = section.getBoundingClientRect().top + scrollY;
          const desktop = matchMedia("(min-width: 1024px)").matches;
          /* Strax innan strecket börjar ritas. Bara soluppgång syns. */
          const top = desktop
            ? Math.max(0, sectionDoc - lockAt - 220)
            : Math.max(0, enDayHeading.getBoundingClientRect().top + scrollY);
          if (reducedMotion || Math.abs(scrollY - top) < 2) {
            scrollTo(0, top);
            finish();
            return;
          }
          const from = scrollY;
          const dist = top - from;
          const duration = 380;
          const start = performance.now();
          const step = (now) => {
            const u = Math.min(1, (now - start) / duration);
            const e = 1 - (1 - u) * (1 - u) * (1 - u);
            scrollTo(0, from + dist * e);
            if (u < 1) requestAnimationFrame(step);
            else {
              enSunSnap = true;
              scrollTo(0, top);
              finish();
            }
          };
          requestAnimationFrame(step);
        }
      });
      applyDayView(dayView);
      subscribeSeason((season) => {
        document.dispatchEvent(new CustomEvent("td-season", { detail: season }));
        document.dispatchEvent(new CustomEvent("og-season", { detail: season }));
        const next = season === "summer" ? "summer" : "winter";
        if (next === dayView) return;
        dayView = next;
        enSunSnap = true;
        applyDayView(dayView);
        seasonBanner.setMode(dayView);
        if (enDayLive) enDayLive.textContent = seasonBannerCopy[dayView].live;
      });
      document.dispatchEvent(new CustomEvent("td-season", { detail: getSeason() }));
      const enDag = document.getElementById("en-dag");
      const enSlides = [...enDag.querySelectorAll(".en-dag-slide")];
      const enHeading = document.getElementById("en-dag-title");
      const enVideos = [...enDag.querySelectorAll(".en-dag-video")];
      const enHeld = new Set();
      enDag.querySelectorAll(".en-dag-pause").forEach((button) => {
        const video = button.parentElement.querySelector(".en-dag-video");
        button.addEventListener("click", () => {
          if (enHeld.has(video)) enHeld.delete(video);
          else enHeld.add(video);
          const paused = enHeld.has(video);
          button.setAttribute("aria-pressed", String(paused));
          button.textContent = paused ? "▶" : "II";
          if (paused) video.pause();
          else video.play().catch(() => {});
        });
      });
      const enPin = enDag.querySelector(".en-dag-pin");
      const enSun = enDag.querySelector(".en-dag-sun");
      const enEventsHost = document.getElementById("en-dag-events");
      const enRise = enSun.querySelector(".en-dag-sun-rise");
      const enSet = enSun.querySelector(".en-dag-sun-set");
      const enMobile = matchMedia("(max-width: 1023px)");
      const clamp01 = (value) => Math.min(1, Math.max(0, value));
      /* TODO: sommarens 09:00–22:00 är en platshållare tills klienten sätter tiderna. */
      const EN_DAY_WINDOW = {
        winter: { start: 7 * 60, end: 17 * 60 + 30 },
        summer: { start: 9 * 60, end: 22 * 60 }
      };
      let enDayStart = EN_DAY_WINDOW.winter.start;
      let enDayEnd = EN_DAY_WINDOW.winter.end;
      const enMinutes = (stamp) => {
        const [h, m] = String(stamp || "0:0").split(":").map(Number);
        return (h || 0) * 60 + (m || 0);
      };
      const enFmtMinutes = (mins) => {
        const wrapped = ((Math.round(mins) % (24 * 60)) + 24 * 60) % (24 * 60);
        const h = Math.floor(wrapped / 60);
        const m = wrapped % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      };
      function stockholmCivilDate(date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Stockholm",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).formatToParts(date);
        const get = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
        return { y: get("year"), m: get("month"), d: get("day") };
      }
      function stockholmOffsetHours(y, m, d) {
        const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        const tz = new Intl.DateTimeFormat("en-US", {
          timeZone: "Europe/Stockholm",
          timeZoneName: "longOffset",
          hour: "numeric"
        }).formatToParts(utc).find((part) => part.type === "timeZoneName")?.value || "GMT";
        const match = tz.match(/GMT([+-])(\d+)(?::(\d+))?/i);
        if (!match) return 1;
        const sign = match[1] === "-" ? -1 : 1;
        return sign * (Number(match[2]) + Number(match[3] || 0) / 60);
      }
      function julianDay(y, m, d, hourUtc = 0) {
        let yy = y;
        let mm = m;
        if (mm <= 2) { yy -= 1; mm += 12; }
        const A = Math.floor(yy / 100);
        const B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5 + hourUtc / 24;
      }
      function solarUtcMinutes(y, m, d, lat, lon, rising, guessHours) {
        let t = guessHours;
        for (let i = 0; i < 3; i++) {
          const jd = julianDay(y, m, d, t);
          const T = (jd - 2451545) / 36525;
          const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
          const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
          const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
          const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin((M * Math.PI) / 180)
            + (0.019993 - 0.000101 * T) * Math.sin((2 * M * Math.PI) / 180)
            + 0.000289 * Math.sin((3 * M * Math.PI) / 180);
          const sunTrue = L0 + C;
          const omega = 125.04 - 1934.136 * T;
          const lambda = sunTrue - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180);
          const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
          const eps = eps0 + 0.00256 * Math.cos((omega * Math.PI) / 180);
          const yE = Math.tan((eps * Math.PI) / 360) ** 2;
          const eqtime = 4 * (180 / Math.PI) * (
            yE * Math.sin((2 * L0 * Math.PI) / 180)
            - 2 * e * Math.sin((M * Math.PI) / 180)
            + 4 * e * yE * Math.sin((M * Math.PI) / 180) * Math.cos((2 * L0 * Math.PI) / 180)
            - 0.5 * yE * yE * Math.sin((4 * L0 * Math.PI) / 180)
            - 1.25 * e * e * Math.sin((2 * M * Math.PI) / 180)
          );
          const delta = (180 / Math.PI) * Math.asin(Math.sin((eps * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180));
          const cosHa = (Math.cos((90.833 * Math.PI) / 180) / (Math.cos((lat * Math.PI) / 180) * Math.cos((delta * Math.PI) / 180)))
            - Math.tan((lat * Math.PI) / 180) * Math.tan((delta * Math.PI) / 180);
          const ha = (180 / Math.PI) * Math.acos(Math.min(1, Math.max(-1, cosHa)));
          const mins = rising ? 720 - 4 * (lon + ha) - eqtime : 720 - 4 * (lon - ha) - eqtime;
          t = mins / 60;
        }
        return t * 60;
      }
      function tanddalenSunTimes(date = new Date()) {
        const { y, m, d } = stockholmCivilDate(date);
        const lat = 62.4478;
        const lon = 12.3066;
        const tz = stockholmOffsetHours(y, m, d);
        const riseUtc = solarUtcMinutes(y, m, d, lat, lon, true, 6);
        const setUtc = solarUtcMinutes(y, m, d, lat, lon, false, 18);
        return {
          rise: enFmtMinutes(riseUtc + tz * 60),
          set: enFmtMinutes(setUtc + tz * 60),
          riseMin: riseUtc + tz * 60,
          setMin: setUtc + tz * 60
        };
      }
      let enSunTimes = tanddalenSunTimes();
      function applySunClock() {
        const summer = document.getElementById("en-dag")?.dataset.dayView === "summer";
        /* Högsommar i Tänndalen. Dagens datum (höst/vinter) ger solnedgång mitt i kvällsprogrammet. */
        const { y } = stockholmCivilDate();
        const date = summer ? new Date(Date.UTC(y, 6, 15, 12, 0, 0)) : new Date();
        enSunTimes = tanddalenSunTimes(date);
        if (enRise) {
          enRise.dataset.time = enSunTimes.rise;
          const time = enRise.querySelector(".en-dag-sun-time");
          if (time) time.textContent = enSunTimes.rise;
        }
        if (enSet) {
          enSet.dataset.time = enSunTimes.set;
          const time = enSet.querySelector(".en-dag-sun-time");
          if (time) time.textContent = enSunTimes.set;
        }
      }
      applySunClock();
      let enEvents = enSlides.map((slide) => ({
        time: slide.dataset.time || "",
        name: slide.dataset.name || "",
        minutes: enMinutes(slide.dataset.time)
      })).filter((event) => event.time);
      const enEventEls = enEvents.map((event, index) => {
        const el = document.createElement("div");
        el.className = "en-dag-sun-event";
        el.dataset.index = String(index);
        el.innerHTML = `<div class="en-dag-sun-event-label"><p class="en-dag-sun-event-time">${event.time}</p><p class="en-dag-sun-event-name">${event.name}</p></div><span class="en-dag-sun-event-dot"></span>`;
        enEventsHost.append(el);
        return el;
      });
      function linkLabel(anchor, label) {
        const text = [...anchor.childNodes].find((node) => node.nodeType === 3);
        if (text) text.nodeValue = label + " ";
        else anchor.insertBefore(document.createTextNode(label + " "), anchor.firstChild);
      }
      function rememberWinter(slide) {
        if (slide.dataset.winterReady === "1") return;
        slide.dataset.winterTime = slide.dataset.time || "";
        slide.dataset.winterName = slide.dataset.name || "";
        const puff = slide.classList.contains("is-puff");
        const title = slide.querySelector(puff ? ".td-heading-md" : ".td-textblock-title");
        const body = slide.querySelector(".td-textblock-body");
        const label = slide.querySelector(".td-ui-label");
        const link = slide.querySelector(puff ? ".en-dag-puff-copy a" : ".td-textblock-actions a");
        if (title) slide.dataset.winterTitle = title.textContent;
        if (body) slide.dataset.winterBody = body.textContent;
        if (label) slide.dataset.winterLabel = label.textContent;
        if (link) {
          slide.dataset.winterHref = link.getAttribute("href") || "";
          slide.dataset.winterCta = (link.childNodes[0]?.textContent || "").trim();
          slide.dataset.winterFill = [...link.classList].find((name) => name.startsWith("td-button-fill-")) || "";
        }
        const still = slide.querySelector(".en-dag-media > img:not(.en-dag-season-photo)");
        if (still) slide.dataset.winterSrc = still.getAttribute("src") || "";
        slide.dataset.winterReady = "1";
      }
      function showSeasonPhoto(slide, src) {
        const media = slide.querySelector(".en-dag-media");
        const photo = slide.querySelector(".en-dag-season-photo");
        if (!photo) return;
        media.classList.remove("is-missing");
        photo.hidden = false;
        photo.onload = () => media.classList.remove("is-missing");
        photo.onerror = () => {
          media.classList.add("is-missing");
          photo.removeAttribute("src");
        };
        if (src) photo.src = src;
        else media.classList.add("is-missing");
      }
      function syncEnDagContent(view) {
        const summer = view === "summer";
        applySunClock();
        const windowFor = EN_DAY_WINDOW[view] || EN_DAY_WINDOW.winter;
        enDayStart = windowFor.start;
        enDayEnd = windowFor.end;
        enSlides.forEach((slide, index) => {
          rememberWinter(slide);
          const puff = slide.classList.contains("is-puff");
          slide.dataset.time = summer ? slide.dataset.summerTime || slide.dataset.winterTime : slide.dataset.winterTime;
          slide.dataset.name = summer ? slide.dataset.summerName || slide.dataset.winterName : slide.dataset.winterName;
          const title = slide.querySelector(puff ? ".td-heading-md" : ".td-textblock-title");
          const body = slide.querySelector(".td-textblock-body");
          const label = slide.querySelector(".td-ui-label");
          const link = slide.querySelector(puff ? ".en-dag-puff-copy a" : ".td-textblock-actions a");
          const actions = slide.querySelector(".td-textblock-actions");
          if (title) title.textContent = summer ? slide.dataset.summerTitle || slide.dataset.winterTitle : slide.dataset.winterTitle;
          if (body) body.textContent = summer ? slide.dataset.summerBody || slide.dataset.winterBody : slide.dataset.winterBody;
          if (label) label.textContent = summer ? slide.dataset.summerLabel || slide.dataset.winterLabel : slide.dataset.winterLabel;
          if (summer && !puff && !slide.dataset.summerCta && actions) actions.hidden = true;
          else if (actions) actions.hidden = false;
          if (link && !(summer && !puff && !slide.dataset.summerCta)) {
            const href = summer ? slide.dataset.summerHref || slide.dataset.winterHref : slide.dataset.winterHref;
            link.setAttribute("href", href);
            linkLabel(link, summer ? slide.dataset.summerCta || slide.dataset.winterCta : slide.dataset.winterCta);
            link.classList.remove("td-button-fill-winter", "td-button-fill-summer");
            const fill = summer && !puff ? "td-button-fill-summer" : slide.dataset.winterFill;
            if (fill) link.classList.add(fill);
          }
          const still = slide.querySelector(".en-dag-media > img:not(.en-dag-season-photo)");
          const video = slide.querySelector(".en-dag-video");
          const pause = slide.querySelector(".en-dag-pause");
          const photo = slide.querySelector(".en-dag-season-photo");
          if (summer) {
            slide.classList.add("is-summer-media");
            showSeasonPhoto(slide, slide.dataset.summerSrc || "");
            if (video) { video.pause(); video.hidden = true; }
            if (pause) pause.hidden = true;
            if (still) still.hidden = true;
          } else {
            slide.classList.remove("is-summer-media");
            if (photo) { photo.hidden = true; photo.removeAttribute("src"); }
            slide.querySelector(".en-dag-media")?.classList.remove("is-missing");
            if (video) video.hidden = false;
            if (pause) pause.hidden = false;
            if (still) { still.hidden = false; if (slide.dataset.winterSrc) still.src = slide.dataset.winterSrc; }
          }
          if (enEvents[index]) {
            enEvents[index].time = slide.dataset.time;
            enEvents[index].name = slide.dataset.name;
            enEvents[index].minutes = enMinutes(slide.dataset.time);
            const mark = enEventEls[index];
            if (mark) {
              mark.querySelector(".en-dag-sun-event-time").textContent = enEvents[index].time;
              mark.querySelector(".en-dag-sun-event-name").textContent = enEvents[index].name;
            }
          }
        });
        refreshTimelineLabelWidth();
        try { layoutEnDag(); if (!reduced) placeEnDag(); } catch (error) { console.error(error); }
      }
      enDagSeasonReady = true;
      if (reduced) {
        enEventEls.forEach((el) => el.classList.add("is-on"));
        if (enSet) enSet.classList.add("is-on", "is-label-on");
        const endCap = enSun.querySelector(".en-dag-sun-cap-end");
        if (endCap) endCap.style.opacity = "1";
      }
      let enLabelWidth = 120;
      let enSunProgressY = 0;
      let enSunSnap = false;
      let enSunFollowRaf = 0;
      function refreshTimelineLabelWidth() {
        const probe = document.createElement("div");
        probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;display:flex;flex-direction:column;align-items:flex-end;white-space:nowrap;";
        probe.innerHTML = '<p class="en-dag-sun-event-time"></p><p class="en-dag-sun-event-name"></p>';
        document.body.append(probe);
        const timeEl = probe.children[0];
        const nameEl = probe.children[1];
        let max = 0;
        const samples = [
          ...enEvents.map((event) => [event.time, event.name]),
          [enSunTimes.rise, "Soluppgång"],
          [enSunTimes.set, "Solnedgång"]
        ];
        samples.forEach(([time, name]) => {
          timeEl.textContent = time;
          nameEl.textContent = name;
          max = Math.max(max, probe.offsetWidth);
        });
        probe.remove();
        enLabelWidth = Math.max(1, max);
        return enLabelWidth;
      }
      refreshTimelineLabelWidth();
      function focusFrame() {
        const headingHeight = enHeading.offsetHeight || 106;
        const intro = enHeading.closest(".en-dag-intro");
        const stick = parseFloat(getComputedStyle(intro || enHeading).top) || 76;
        const focusTop = stick + headingHeight * 0.5 + 20;
        const edge = 16;
        const textW = 302;
        const textGap = 64;
        /* 10 % större + 5 % bredare (554×680 → 640×748). */
        let height = Math.min(900, Math.max(560, innerHeight - 48 - focusTop));
        let width = height * (640 / 748);
        const maxWidth = innerWidth - edge * 2 - 2 * (textW + textGap);
        if (width > maxWidth) {
          width = Math.max(240, maxWidth);
          height = width * (748 / 640);
        }
        return { height, width, headingHeight };
      }
      function headingInk(head) {
        const cs = getComputedStyle(enHeading);
        const fontSize = parseFloat(cs.fontSize) || 96;
        const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.1;
        const lines = Math.max(1, Math.round(enHeading.offsetHeight / lineHeight));
        const canvas = headingInk.canvas || (headingInk.canvas = document.createElement("canvas"));
        const ctx = canvas.getContext("2d");
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const g = ctx.measureText("g");
        const descent = g.actualBoundingBoxDescent || fontSize * 0.22;
        const fontAscent = g.fontBoundingBoxAscent || fontSize * 0.8;
        const fontDescent = g.fontBoundingBoxDescent || fontSize * 0.2;
        const baseline = (lineHeight - fontAscent - fontDescent) / 2 + fontAscent;
        const bottom = head.top + (parseFloat(cs.paddingTop) || 0) + (lines - 1) * lineHeight + baseline + descent;
        return { bottom };
      }
      function layoutEnDag() {
        if (reduced) return;
        const page = document.querySelector(".page") || document.querySelector("[data-og-hp-blocks]") || document.querySelector(".og-hp-shell") || document.body;
        const placeAfterEnDag = (sectionH) => {
          const sectionDoc = enDag.getBoundingClientRect().top + scrollY;
          const pageDoc = page.getBoundingClientRect().top + scrollY;
          const boendeH = Math.max(640, Math.min(innerHeight, 960));
          /* Rasmus-citat ligger i flöde under utforsakning — inte mellan En dag och Boende. */
          const boendeTop = sectionDoc + sectionH - pageDoc;
          const hittaEl = document.getElementById("hitta");
          const hittaHeading = hittaEl ? hittaEl.querySelector(".td-hitta-copy h2") : null;
          const headingInto = hittaHeading && hittaEl ? hittaHeading.getBoundingClientRect().top - hittaEl.getBoundingClientRect().top : 0;
          const hittaTop = boendeTop + boendeH + Math.max(0, 200 - headingInto);
          page.style.setProperty("--boende-top", `${boendeTop}px`);
          page.style.setProperty("--en-dag-end", `${hittaTop}px`);
        };
        if (enMobile.matches) {
          enDag.style.height = "";
          enPin.style.marginTop = "";
          enDag.querySelectorAll(".en-dag-slide, .en-dag-media, .en-dag-copy, .en-dag-season").forEach((el) => {
            el.style.left = "";
            el.style.width = "";
            el.style.height = "";
            el.style.right = "";
          });
          placeAfterEnDag(enDag.offsetHeight);
          return;
        }
        /* 770×628 → 10 % större + 5 % bredare; landar högre under rubriken. */
        const cardH = Math.min(847, innerHeight - 220);
        const cardW = cardH * ((628 / 770) * 1.05 * 1.08);
        const left = (innerWidth - cardW) / 2;
        enDag.querySelectorAll(".en-dag-slide").forEach((slide) => { slide.style.height = `${cardH}px`; });
        enDag.querySelectorAll(".en-dag-media").forEach((media) => {
          media.style.left = `${left}px`;
          media.style.width = `${cardW}px`;
          media.style.height = `${cardH}px`;
        });
        const lockAt = parseFloat(getComputedStyle(enPin).top) || 0;
        const span = Math.max(1, innerHeight * 1.35 - 188);
        const puffArrives = (enSlides.length - 1) * span;
        // Hold tills linjen når solnedgång. Kort exit — ~120 px lucka till citatet.
        const sunHold = Math.max(120, span * 0.35);
        const hold = sunHold + 120;
        const exitRun = Math.round(innerHeight * 0.4);
        const seasonSlot = document.querySelector(".en-dag-season");
        if (seasonSlot) {
          const sectionBox = enDag.getBoundingClientRect();
          placeSeasonBanner(sectionBox, left, cardW, null, false);
        }
        /* Utan säsongsbanner (dold): håll pin tills puff + tidslinje är klara, släpp sen i naturlig scroll. */
        const seasonH = seasonSlot ? seasonSlot.offsetHeight : 0;
        const sectionH = puffArrives + hold + lockAt + (seasonH ? exitRun + seasonH : innerHeight);
        enDag.style.height = `${sectionH}px`;
        enPin.style.marginTop = "";
        placeAfterEnDag(sectionH);
      }
      function placeEnDagMobile() {
        const slides = [...enDag.querySelectorAll(".en-dag-slide")];
        const pin = enPin.getBoundingClientRect();
        const span = Math.max(1, enDag.offsetHeight - innerHeight * 0.8);
        const start = enDag.getBoundingClientRect().top + scrollY;
        const t = Math.min(1, Math.max(0, (scrollY + 128 - start) / span));
        const index = t * (slides.length - 1);
        slides.forEach((slide, i) => {
          const delta = i - index;
          const abs = Math.abs(delta);
          const scale = delta > 0 ? 1 - Math.min(delta, 1) * 0.06 : 1 - Math.min(-delta, 1) * 0.05;
          const media = slide.querySelector(".en-dag-media");
          const copy = slide.querySelector(".en-dag-copy");
          const sample = slides[0].querySelector(".en-dag-copy");
          const step = Math.min(pin.height - 36, (sample?.offsetTop || 0) + (sample?.offsetHeight || 0) + 24);
          slide.style.transform = `translate3d(0, ${delta * step}px, 0)`;
          slide.style.opacity = abs > 1.15 ? "0" : "1";
          slide.style.zIndex = String(delta <= 0.2 ? 6 : 3);
          if (media) media.style.transform = `scale(${scale})`;
          if (copy) copy.style.opacity = String(Math.max(0, 1 - abs * 1.8));
        });
      }
      function easeOutSoft(u) {
        const x1 = 0.22;
        const y1 = 1;
        const x2 = 0.36;
        const y2 = 1;
        let t = clamp01(u);
        for (let i = 0; i < 8; i++) {
          const mt = 1 - t;
          const x = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
          const dx = 3 * mt * mt * x1 + 6 * mt * t * (x2 - x1) + 3 * t * t * (1 - x2);
          if (Math.abs(dx) < 1e-6) break;
          t = clamp01(t - (x - u) / dx);
        }
        const mt = 1 - t;
        return 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
      }
      function syncHittaVisibility() {
        const hitta = document.getElementById("hitta");
        if (!hitta) return;
        const showHitta = hitta.getBoundingClientRect().top <= innerHeight;
        hitta.style.visibility = showHitta ? "visible" : "hidden";
        const kart = document.getElementById("hitta-kart");
        if (kart) kart.style.opacity = showHitta ? "1" : "0";
      }
      const EN_SEASON_GAP = 40; /* stabil luft under sista kortet */
      function syncEnDagHang() {
        if (reduced || enMobile.matches) return;
        const vh = innerHeight;
        const air = parseFloat(getComputedStyle(enDag).getPropertyValue("--endag-heading-air")) || 0;
        const cardBottom = 188 + air + Math.min(847, vh - 220);
        enDag.style.setProperty("--en-dag-card-bottom", `${Math.round(cardBottom)}px`);
        const season = enDag.querySelector(".en-dag-season");
        const seasonH = season ? season.offsetHeight : 0;
        const hang = cardBottom + EN_SEASON_GAP + seasonH - vh;
        enDag.style.setProperty("--en-dag-hang", `${Math.round(hang)}px`);
      }
      function placeSeasonBanner(sectionBox, cardLeft, cardW, mediaBox, followCard) {
        const season = enDag.querySelector(".en-dag-season");
        if (!season || enMobile.matches) return;
        const left = mediaBox ? mediaBox.left - sectionBox.left : cardLeft - sectionBox.left;
        const width = mediaBox ? mediaBox.width : cardW;
        season.style.left = `${left}px`;
        season.style.width = `${width}px`;
        season.style.right = "auto";
        if (followCard && mediaBox) {
          season.style.bottom = "auto";
          season.style.top = `${mediaBox.bottom + EN_SEASON_GAP - sectionBox.top}px`;
        } else {
          season.style.top = "";
          season.style.bottom = "";
        }
      }
      function placeEnDag() {
        if (reduced) return;
        syncEnDagHang();
        syncHittaVisibility();
        const sectionBox = enDag.getBoundingClientRect();
        if (sectionBox.bottom < -80 || sectionBox.top > innerHeight + 80) return;
        if (enMobile.matches) {
          placeEnDagMobile();
          return;
        }
        const sectionTop = sectionBox.top;
        /* Pin sticky top — inte heading.top (auto→24) som låste för tidigt / lägre. */
        const lockAt = parseFloat(getComputedStyle(enPin).top) || 0;
        const scrolled = Math.max(0, lockAt - sectionTop);
        const vh = innerHeight;
        const pinTop = enPin.getBoundingClientRect().top;
        const n = enSlides.length;
        const cardH = Math.min(847, vh - 220);
        const cardW = cardH * ((628 / 770) * 1.05 * 1.08);
        const cardLeft = (innerWidth - cardW) / 2;
        const front = 188; /* högre under rubriken (var 238) */
        const back = 131;
        const backScale = 0.882;
        const start = vh * 1.35;
        const span = Math.max(1, start - front);
        const mix = (u) => (u <= 0.82 ? u : 0.82 + 0.18 * easeOutSoft((Math.min(1, u) - 0.82) / 0.18));
        const unit = (index) => clamp01((scrolled - index * span) / span);
        const lead = Math.max(0, sectionTop - lockAt);
        const puffArrives = (n - 1) * span;
        const sunHold = Math.max(120, span * 0.35);
        const hold = sunHold + 120;
        const exitLive = Math.max(0, scrolled - puffArrives - hold);
        const sectionDocTop = sectionBox.top + scrollY;
        const releaseAt = sectionDocTop + enDag.offsetHeight - vh;
        const sectionTopAtRelease = sectionDocTop - releaseAt;
        const exitAtRelease = Math.max(0, Math.max(0, lockAt - sectionTopAtRelease) - puffArrives - hold);
        const exit = scrollY >= releaseAt ? exitAtRelease : exitLive;
        const anchor = Math.max(pinTop, 0);
        enSlides.forEach((slide, index) => {
          const media = slide.querySelector(".en-dag-media");
          const copy = slide.querySelector(".en-dag-copy");
          const puff = slide.querySelector(".en-dag-puff-copy");
          const into = index === 0 ? 1 : unit(index - 1);
          const onward = index < n - 1 ? unit(index) : 0;
          /* När nästa kort rör sig bakåt: krymp ytterligare ~2 % så bakre
             inte landar i exakt samma skala som det som närmar sig. */
          const recess = index < n - 1 ? unit(index + 1) : 0;
          const parked = into >= 1;
          const rising = !parked;
          const y = rising
            ? start + (front - start) * mix(into)
            : front + (back - front) * mix(onward);
          const scale = rising
            ? 1
            : 1 + (backScale - 1) * mix(onward) - 0.02 * mix(recess);
          const waiting = index > 0 && into <= 0;
          // Alla kort utom puffen grävs när puffen landat (samma beteende).
          const buried = index < n - 1 && scrolled >= Math.min((index + 2) * span, puffArrives);
          const opacity = buried || waiting ? 0 : 1;
          // Klampa exit så puffen inte går ovanför pin och klipps av.
          const yView = y + lead - (index === n - 1 ? Math.min(exit, y + lead) : 0);
          const slideAnchor = anchor;
          slide.style.opacity = String(opacity);
          slide.style.visibility = opacity <= 0 ? "hidden" : "visible";
          slide.style.zIndex = String(2 + index);
          slide.style.transformOrigin = "top center";
          slide.style.transform = index === n - 1
            ? `translateY(${yView - slideAnchor}px) scale(${scale})`
            : `translateY(${yView - slideAnchor}px)`;
          media.style.width = `${cardW}px`;
          media.style.height = `${cardH}px`;
          media.style.left = `${cardLeft}px`;
          media.style.transformOrigin = "top center";
          media.style.transform = index === n - 1 ? "none" : `translateZ(0) scale(${scale})`;
          /* Mjuk skugga: växer medan kortet lyfter in, krymper när det landar (2026-11-14). */
          {
            const lift = rising ? Math.pow(1 - clamp01(into), 2.5) : 0; /* tonar ned snabbt mot landning */
            media.style.boxShadow = `0 ${Math.round(12 + 48 * lift)}px ${Math.round(36 + 104 * lift)}px rgb(36 39 42 / ${(0.16 + 0.22 * lift).toFixed(3)})`;
          }
          if (copy) {
            const land = index * span;
            const since = scrolled - land;
            let textOpacity = 0;
            // Hold längre (0→0.25 span) så 08:30 hinner landa på 100 % likt övriga.
            if (since < -0.25 * span || since >= 0.45 * span) textOpacity = 0;
            else if (since < 0) textOpacity = (since + 0.25 * span) / (0.25 * span);
            else if (since <= 0.25 * span) textOpacity = 1;
            else textOpacity = (0.45 * span - since) / (0.2 * span);
            // Slide 0 saknar kort-arrival: fada in mot pin (lead→0) så 100 % syns tydligt.
            if (index === 0 && lead > 0) textOpacity *= clamp01(1 - lead / 200);
            const textW = 302;
            const gap = 68;
            copy.style.left = `${cardLeft - textW - gap}px`;
            copy.style.width = `${textW}px`;
            copy.style.bottom = "auto";
            copy.style.transition = "none";
            copy.style.transform = "none";
            copy.style.opacity = String(textOpacity);
            // Vertikalt centrerad mot kortet.
            const copyH = copy.offsetHeight || 0;
            copy.style.top = `${Math.max(0, (cardH - copyH) / 2)}px`;
          }
          if (puff) {
            puff.style.opacity = "1";
            puff.style.transform = "none";
          }
        });
        /* Säsongsbanner: samma left/width som kortet; följer sista kortet med fast gap. */
        {
          const lastMedia = enSlides[n - 1]?.querySelector(".en-dag-media");
          const mediaBox = lastMedia?.getBoundingClientRect();
          const follow = scrolled >= puffArrives - span * 0.2;
          placeSeasonBanner(sectionBox, cardLeft, cardW, mediaBox, follow);
        }
        enHeading.style.opacity = "1";
        enHeading.style.visibility = "visible";
        enHeading.style.top = "";
        enHeading.style.transform = "";
        const exitClamp = exit;
        if (enSun) {
          const linePad = 40;
          const iconSize = 48;
          const sunH = Math.max(220, cardH - linePad * 2);
          const labelW = enLabelWidth;
          const labelToIcon = 12;
          const iconRadius = iconSize / 2;
          const cardToLabel = 96;
          /* Ikon vänster, text höger; linjen 150 px närmre korten (2026-11-14). */
          const lineX = cardLeft + cardW + cardToLabel + labelW + labelToIcon + iconRadius - 150;
          const leftSpan = iconRadius;
          const rightSpan = iconRadius + labelToIcon + labelW;
          const sunW = leftSpan + rightSpan;
          const sunLeft = lineX - leftSpan;
          const lineXInSun = leftSpan;
          const sectionBox = enDag.getBoundingClientRect();
          const sunInView = sectionBox.bottom > 0 && sectionBox.top < vh;
          const sunOpacity = sunInView ? 1 : 0;
          enSun.style.left = `${sunLeft}px`;
          enSun.style.width = `${sunW}px`;
          const stick = Math.max(pinTop, 0);
          enSun.style.top = `${front + linePad + lead - stick - exitClamp}px`;
          enSun.style.height = `${sunH}px`;
          enSun.style.opacity = String(sunOpacity);
          enSun.style.visibility = sunOpacity <= 0 ? "hidden" : "visible";
          enSun.style.setProperty("--en-sun-line-x", `${lineXInSun}px`);
          enSun.style.setProperty("--en-sun-label-w", `${labelW}px`);
          // Soluppgång ovanför linjen, solnedgång under. Kortens prickar ligger jämnt, oberoende av klockslag.
          const riseY = -(iconSize / 2);
          const setY = sunH + iconSize / 2;
          const eventCount = enEventEls.length;
          const markCount = eventCount + 2;
          const markStep = (setY - riseY) / Math.max(1, markCount - 1);
          const eventYs = [];
          for (let i = 0; i < eventCount; i++) eventYs.push(riseY + markStep * (i + 1));
          if (enRise) enRise.style.top = `${riseY}px`;
          enEventEls.forEach((el, index) => {
            el.style.top = `${eventYs[index]}px`;
          });
          if (enSet) enSet.style.top = `${setY}px`;
          // Linjen växer monotoniskt: till 16:00 när kortet landar, vidare till solnedgång under hold.
          let progressTarget = 0;
          const lastEventScroll = (eventCount - 1) * span;
          const sunArriveScroll = lastEventScroll + sunHold;
          if (lead > 0) {
            progressTarget = eventYs[0] * clamp01(1 - lead / 200);
          } else if (eventCount > 0) {
            if (scrolled <= 0) {
              progressTarget = eventYs[0];
            } else if (scrolled >= lastEventScroll - 1) {
              /* Sista kortet nått: linjen animerar själv hela vägen till solnedgång. */
              progressTarget = sunH;
            } else {
              const idx = Math.min(eventCount - 2, Math.floor(scrolled / span));
              const u = clamp01((scrolled - idx * span) / span);
              progressTarget = eventYs[idx] + (eventYs[idx + 1] - eventYs[idx]) * u;
            }
          }
          progressTarget = Math.min(sunH, Math.max(0, progressTarget));
          if (enSunSnap || typeof enSunProgressY !== "number") {
            enSunProgressY = progressTarget;
            enSunSnap = false;
          } else {
            const sunAuto = lead <= 0 && scrolled >= lastEventScroll - 1;
            enSunProgressY += (progressTarget - enSunProgressY) * (reduced ? 1 : sunAuto ? 0.06 : 0.22);
            if (Math.abs(progressTarget - enSunProgressY) < 0.4) enSunProgressY = progressTarget;
          }
          const progressScale = sunH > 0 ? enSunProgressY / sunH : 0;
          enSun.style.setProperty("--en-sun-progress-scale", String(Math.round(progressScale * 10000) / 10000));
          // Sticky reach: event-ploppar (inkl. 16:00) tänds när sitt kort nås.
          // Solnedgång + ändplopp tänds först när linjen nått botten.
          const sunLineReached = reduced || (lead <= 0 && scrolled >= lastEventScroll - 1 && enSunProgressY >= sunH - 0.5);
          enEventEls.forEach((el, index) => {
            const reached = reduced || (lead <= 0 && scrolled >= index * span - 0.5);
            el.classList.toggle("is-on", reached);
          });
          if (enSet) {
            enSet.classList.toggle("is-on", sunLineReached);
            enSet.classList.toggle("is-label-on", sunLineReached);
          }
          const endCap = enSun.querySelector(".en-dag-sun-cap-end");
          const startCap = enSun.querySelector(".en-dag-sun-cap-start");
          if (endCap) endCap.style.opacity = sunLineReached ? "1" : "0";
          if (startCap) startCap.style.opacity = enSunProgressY > 0.5 ? "1" : "0";
          if (!reduced && Math.abs(progressTarget - enSunProgressY) > 0.4) {
            if (!enSunFollowRaf) {
              const tick = () => {
                enSunFollowRaf = 0;
                try { placeEnDag(); } catch (error) { console.error(error); }
              };
              enSunFollowRaf = requestAnimationFrame(tick);
            }
          }
        }
        let playing = 0;
        for (let i = 1; i < n; i++) {
          if (unit(i - 1) >= 1) playing = i;
        }
        enVideos.forEach((video) => {
          const index = enSlides.indexOf(video.closest(".en-dag-slide"));
          const box = video.getBoundingClientRect();
          const early = (video.getAttribute("poster") || "").includes("endag-1530") && box.top < innerHeight - 120 && box.bottom > 120;
          video.muted = true;
          if (!enHeld.has(video) && (early || (index === playing && playing < n - 1))) video.play().catch(() => {});
          else video.pause();
        });
      }
      try {
        applyDayView(dayView);
        seasonBanner.setMode(dayView);
        applySunClock();
        refreshTimelineLabelWidth();
        layoutEnDag();
        if (!reduced) {
          addEventListener("scroll", () => { try { placeEnDag(); } catch (error) { console.error(error); } }, { passive: true });
          addEventListener("resize", () => { try { applySunClock(); refreshTimelineLabelWidth(); layoutEnDag(); placeEnDag(); } catch (error) { console.error(error); } });
          enMobile.addEventListener("change", () => { try { layoutEnDag(); placeEnDag(); } catch (error) { console.error(error); } });
          if (document.fonts?.ready) document.fonts.ready.then(() => { try { refreshTimelineLabelWidth(); placeEnDag(); } catch (error) { console.error(error); } });
          placeEnDag();
          /* Snap: hard (jack) | settle (tröskel efter idle) | off. */
          const EN_FRONT = 188;
          const enSkipBtn = document.getElementById("en-dag-skip");
          const enSkipBar = document.getElementById("en-dag-skip-bar");
          const enNextBtn = document.getElementById("en-dag-next");
          const enSnapParams = new URLSearchParams(location.search);
          const enSnapParam = enSnapParams.get("snap");
          const enSnapModeInit = enSnapParam === "hard" || enSnapParam === "off" || enSnapParam === "settle"
            ? enSnapParam
            : "settle";
          enDag.dataset.snap = enSnapModeInit;
          const enSnapDebugOn = enSnapParams.get("debug") === "snap";
          const enSnapReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
          let enSnapping = false;
          let enSnapRaf = 0;
          let enSnapAcc = 0;
          let enSnapLock = 0;
          let enSettleTimer = 0;
          let enSkipHideTimer = 0;
          let enSkipReady = false;
          let enTouchActive = false;
          let enSnapArmed = false;
          let enVelSamples = []; /* { t, v } — |dy|/dt över senaste 100 ms */
          let enLastScrollAt = 0;
          let enLastDirection = 0; /* +1 ned, −1 upp, 0 okänd — bara auto-settle */
          let enPrevY = scrollY;
          let enPrevT = performance.now();
          let enDebugPick = "—";
          let enDebugEl = null;
          let enDebugMarks = null;
          let enPdCount = { wheel: 0, touchstart: 0, touchmove: 0, keydown: 0 };
          function enSnapMode() {
            const m = enDag.dataset.snap;
            return m === "hard" || m === "off" || m === "settle" ? m : "settle";
          }
          function enSnapCssNum(name, fallback) {
            const raw = getComputedStyle(enDag).getPropertyValue(name).trim();
            const n = parseFloat(raw);
            return Number.isFinite(n) ? n : fallback;
          }
          function enSnapMetrics() {
            const lockAt = parseFloat(getComputedStyle(enPin).top) || 0;
            const span = Math.max(1, innerHeight * 1.35 - EN_FRONT);
            const sectionDocTop = enDag.getBoundingClientRect().top + scrollY;
            const points = enSlides.map((_, i) => sectionDocTop - lockAt + i * span);
            return { lockAt, span, points };
          }
          function enSnapZone() {
            if (enMobile.matches) return false;
            if (document.body.classList.contains("fraga-open")) return false;
            const hitta = document.getElementById("hitta");
            if (hitta?.classList.contains("is-held")) return false;
            const box = enDag.getBoundingClientRect();
            const { lockAt } = enSnapMetrics();
            if (!(box.top <= lockAt + 4 && box.bottom > innerHeight * 0.5)) return false;
            /* När säsongsbanan syns ska Hoppa över/nästa vara borta (annars ligger de kvar över/bakom). */
            const season = enDag.querySelector(".en-dag-season");
            if (season) {
              const s = season.getBoundingClientRect();
              if (s.top < innerHeight - 8 && s.bottom > 8) return false;
            }
            return true;
          }
          function enNearestStep(points) {
            let step = 0;
            let best = Infinity;
            points.forEach((p, i) => {
              const d = Math.abs(scrollY - p);
              if (d < best) { best = d; step = i; }
            });
            return { step, best };
          }
          function enAnchorStep(points, dir) {
            if (dir > 0) {
              let step = 0;
              for (let i = 0; i < points.length; i++) {
                if (points[i] <= scrollY + 2) step = i;
              }
              return step;
            }
            let step = points.length - 1;
            for (let i = points.length - 1; i >= 0; i--) {
              if (points[i] >= scrollY - 2) step = i;
            }
            return step;
          }
          function enEaseSnapHard(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          }
          function enCancelSnap() {
            if (enSnapRaf) cancelAnimationFrame(enSnapRaf);
            enSnapRaf = 0;
            enSnapping = false;
            enSnapArmed = false;
          }
          function enSmoothTo(y, ms) {
            if (enSnapReduced) return;
            const from = scrollY;
            const t0 = performance.now();
            const duration = Math.max(1, ms);
            /* Mjuk start och landning i settle (mindre ryck än ease-out). */
            const ease = enSnapMode() === "hard" ? enEaseSnapHard : (u) => 0.5 - 0.5 * Math.cos(Math.PI * u);
            enCancelSnap();
            enSnapping = true;
            enSnapArmed = true;
            const tick = (now) => {
              if (!enSnapping) return;
              const u = Math.min(1, (now - t0) / duration);
              scrollTo(0, from + (y - from) * ease(u));
              if (u < 1) enSnapRaf = requestAnimationFrame(tick);
              else {
                scrollTo(0, y);
                enSnapping = false;
                enSnapArmed = false;
                enSnapRaf = 0;
              }
            };
            enSnapRaf = requestAnimationFrame(tick);
          }
          function enPruneVel(now = performance.now()) {
            while (enVelSamples.length && now - enVelSamples[0].t > 100) enVelSamples.shift();
          }
          /* Riktning/hastighet: dy/dt mot prevY/prevT — spara först, skriv sen prev (aldrig tvärtom).
             lastDirection nollställs aldrig av tystnad; bara ny rörelse åt andra hållet. */
          function enRecordVel() {
            const now = performance.now();
            const y = scrollY;
            const dy = y - enPrevY;
            const dt = Math.max(0.001, now - enPrevT);
            if (Math.abs(dy) >= 1) {
              enLastDirection = Math.sign(dy);
              enVelSamples.push({ t: now, v: Math.abs(dy) / dt });
              enPruneVel(now);
            }
            enPrevY = y;
            enPrevT = now;
          }
          function enVelocity() {
            enPruneVel();
            if (!enVelSamples.length) return 0;
            let sum = 0;
            for (let i = 0; i < enVelSamples.length; i++) sum += enVelSamples[i].v;
            return sum / enVelSamples.length;
          }
          /* Settle-kandidat: bara punkter i lastDirection, tröskel framåt. */
          function enSettleCandidate(points, span) {
            const threshold = enSnapCssNum("--snap-threshold", 0.3);
            const allowed = [];
            if (!enLastDirection) {
              return { allowed, pick: null, reason: "ingen (riktning okänd)" };
            }
            for (let i = 0; i < points.length; i++) {
              if (Math.abs(scrollY - points[i]) <= 1) {
                return { allowed: [{ i, p: points[i] }], pick: null, reason: "på kort" };
              }
            }
            points.forEach((p, i) => {
              if (enLastDirection > 0 && p >= scrollY - 1) allowed.push({ i, p });
              if (enLastDirection < 0 && p <= scrollY + 1) allowed.push({ i, p });
            });
            let pick = null;
            let bestD = Infinity;
            allowed.forEach((a) => {
              const d = Math.abs(a.p - scrollY);
              if (d < bestD) { bestD = d; pick = a; }
            });
            if (!pick || bestD > span * threshold) {
              /* Ingen död zon: stannar man mellan punkter, gå till närmaste (även bakåt). */
              let near = null;
              let nearD = Infinity;
              points.forEach((p, i) => {
                const d = Math.abs(p - scrollY);
                if (d < nearD) { nearD = d; near = { i, p }; }
              });
              return { allowed, pick: near, reason: near ? `närmast →${near.i}` : "ingen" };
            }
            return { allowed, pick, reason: `→${pick.i}` };
          }
          function enTrySettle() {
            try {
              const mode = enSnapMode();
              if (mode === "off" || enSnapReduced) return;
              if (!enSnapZone() || enSnapping || enTouchActive) return;
              const delay = enSnapCssNum("--snap-settle-delay", 90);
              /* Under pågående scroll: snappa aldrig (timer kan elda mellan ramar). */
              if (performance.now() - enLastScrollAt < delay - 8) {
                enArmSettle();
                return;
              }
              const { points, span } = enSnapMetrics();
              if (!points.length) return;
              const { step, best } = enNearestStep(points);
              const threshold = enSnapCssNum("--snap-threshold", 0.3);
              const velMax = enSnapCssNum("--snap-velocity-max", 1.2);
              const duration = enSnapCssNum("--snap-duration", 520);
              if (mode === "hard") {
                const catchPx = span * 0.12;
                if (best > 3 && best < catchPx) enSmoothTo(points[step], 380);
                return;
              }
              /* settle: utanför första/sista + tröskel → på väg ut, snappa inte */
              const edge = span * threshold;
              /* Förbi sista kortet: släpp, dra aldrig tillbaka (solnedgången animerar själv). */
              if (scrollY < points[0] - edge || scrollY > points[points.length - 1] + 2) {
                enDebugPick = "ingen (ut ur sektion)";
                return;
              }
              const vel = enVelocity();
              if (Math.abs(vel) > velMax) {
                enArmSettle();
                return;
              }
              const cand = enSettleCandidate(points, span);
              enDebugPick = cand.reason;
              if (!cand.pick) return;
              enSmoothTo(cand.pick.p, duration);
            } catch (error) { console.error(error); }
          }
          function enArmSettle() {
            const mode = enSnapMode();
            if (mode === "off") return;
            window.clearTimeout(enSettleTimer);
            const delay = enSnapCssNum("--snap-settle-delay", 90);
            enSnapArmed = true;
            enSettleTimer = window.setTimeout(() => {
              enSnapArmed = false;
              enTrySettle();
            }, delay);
          }
          function enUpdateDebug() {
            if (!enSnapDebugOn) return;
            const mode = enSnapMode();
            const { points, span } = enSnapMetrics();
            const { step, best } = enNearestStep(points);
            const threshold = enSnapCssNum("--snap-threshold", 0.3);
            const vel = enVelocity();
            const cand = enSettleCandidate(points, span);
            const allowedStr = cand.allowed.length
              ? cand.allowed.map((a) => `${a.i}@${a.p | 0}`).join(",")
              : "—";
            if (!enDebugEl) {
              enDebugEl = document.createElement("div");
              enDebugEl.id = "snap-debug";
              document.body.append(enDebugEl);
              enDebugMarks = document.createElement("div");
              enDebugMarks.id = "snap-debug-marks";
              document.body.append(enDebugMarks);
            }
            enDebugEl.textContent =
              `snap=${mode}  y=${scrollY | 0}  dir=${enLastDirection || "?"}  near=${step}  d=${best.toFixed(0)}  allowed=[${allowedStr}]  pick=${cand.reason || enDebugPick}  armed=${enSnapArmed || enSnapping ? 1 : 0}  v=${vel.toFixed(2)}  thr=${threshold}  delay=${enSnapCssNum("--snap-settle-delay", 90)}  dur=${enSnapCssNum("--snap-duration", 520)}`;
            enDebugMarks.replaceChildren();
            points.forEach((p) => {
              const line = document.createElement("div");
              line.className = "snap-debug-line";
              line.style.top = `${p - scrollY}px`;
              enDebugMarks.append(line);
              const zone = document.createElement("div");
              zone.className = "snap-debug-zone";
              const band = span * threshold;
              zone.style.top = `${p - band - scrollY}px`;
              zone.style.height = `${band * 2}px`;
              enDebugMarks.append(zone);
            });
          }
          addEventListener("scroll", () => {
            enLastScrollAt = performance.now();
            enRecordVel();
            if (enSnapDebugOn) enUpdateDebug();
            if (enSnapMode() === "off") return;
            if (enSnapping) return;
            if (!enSnapZone()) return;
            enArmSettle();
          }, { passive: true });
          if ("onscrollend" in window) {
            addEventListener("scrollend", () => {
              /* Armera samma debounce — snappa aldrig direkt på scrollend (kan elda per scrollBy). */
              if (enSnapMode() === "settle" || enSnapMode() === "hard") enArmSettle();
            }, { passive: true });
          }
          addEventListener("wheel", (event) => {
            try {
              const mode = enSnapMode();
              if (mode !== "hard") {
                if (enSnapping) enCancelSnap();
                return;
              }
              if (!enSnapZone()) {
                if (enSnapping) enCancelSnap();
                return;
              }
              if (enSnapping) { event.preventDefault(); enPdCount.wheel++; return; }
              const dir = event.deltaY === 0 ? 0 : event.deltaY > 0 ? 1 : -1;
              if (!dir) return;
              const { points, span } = enSnapMetrics();
              if (!points.length) return;
              const step = enAnchorStep(points, dir);
              if (dir < 0 && step === 0 && scrollY <= points[0] + 12) return;
              if (dir > 0 && step === points.length - 1 && scrollY >= points[points.length - 1] - 12) return;
              const freePx = span * 0.22;
              const traveled = dir > 0 ? scrollY - points[step] : points[step] - scrollY;
              if (traveled >= 0 && traveled < freePx) {
                enSnapAcc = 0;
                return;
              }
              const now = performance.now();
              if (now < enSnapLock) { event.preventDefault(); enPdCount.wheel++; return; }
              event.preventDefault();
              enPdCount.wheel++;
              enSnapAcc += event.deltaY;
              if (Math.abs(enSnapAcc) < 40) return;
              const go = enSnapAcc > 0 ? 1 : -1;
              enSnapAcc = 0;
              const next = Math.max(0, Math.min(points.length - 1, step + go));
              if (next === step) return;
              enSnapLock = now + 320;
              const dist = Math.abs(points[next] - scrollY);
              enSmoothTo(points[next], Math.min(780, Math.max(420, dist * 0.48)));
            } catch (error) { console.error(error); }
          }, { passive: false });
          addEventListener("touchstart", () => {
            enTouchActive = true;
            if (enSnapping) enCancelSnap();
          }, { passive: true });
          addEventListener("touchend", () => {
            enTouchActive = false;
            if (enSnapMode() === "settle") enArmSettle();
          }, { passive: true });
          addEventListener("touchcancel", () => { enTouchActive = false; }, { passive: true });
          addEventListener("keydown", (event) => {
            if (enSnapping) enCancelSnap();
            const mode = enSnapMode();
            if (mode === "off" || enSnapReduced) return;
            if (!enSnapZone()) return;
            const down = ["ArrowDown", "PageDown", " "].includes(event.key);
            const up = ["ArrowUp", "PageUp"].includes(event.key);
            if (!down && !up) return;
            if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
            if (event.target?.isContentEditable) return;
            const { points } = enSnapMetrics();
            if (!points.length) return;
            const dir = down ? 1 : -1;
            const step = enAnchorStep(points, dir);
            const next = Math.max(0, Math.min(points.length - 1, step + dir));
            if (next === step && Math.abs(scrollY - points[step]) < 2) return;
            /* Soft go — ingen preventDefault (fokusordning oförändrad). */
            const duration = enSnapCssNum("--snap-duration", 520);
            enSmoothTo(points[next], mode === "hard" ? Math.min(780, 520) : duration);
          }, { passive: true });
          enEventEls.forEach((el, index) => {
            el.addEventListener("click", () => {
              if (enSnapMode() === "off" || enSnapReduced) return;
              const { points } = enSnapMetrics();
              if (!points[index]) return;
              enSmoothTo(points[index], enSnapCssNum("--snap-duration", 520));
            });
          });
          function enSkipTargetY() {
            /* Blocket som faktiskt följer En dag (ordningen skiljer sig per läge). */
            let after = enDag.nextElementSibling;
            while (after && (after.tagName !== "SECTION" || after.offsetHeight === 0)) after = after.nextElementSibling;
            if (after) return after.getBoundingClientRect().top + scrollY - 24;
            return enDag.getBoundingClientRect().bottom + scrollY - Math.round(innerHeight * 0.15);
          }
          function syncEnDagSkip() {
            if (!enSkipBar || !enSkipBtn) return;
            /* På sista kortet (Tillbaka i stugan) behövs varken nästa-pil eller Hoppa över. */
            const { points: skipPts } = enSnapMetrics();
            const show = enSnapZone() && (!skipPts.length || scrollY < skipPts[skipPts.length - 1] - 24);
            const first = !enSkipReady;
            enSkipReady = true;
            if (first) enSkipBar.style.transition = "none";
            if (show) enSkipBar.classList.add("is-en-skip-live");
            const setTab = (on) => {
              const tab = on ? 0 : -1;
              enSkipBtn.tabIndex = tab;
              if (enNextBtn) enNextBtn.tabIndex = tab;
            };
            if (!show) {
              const already = enSkipBar.classList.contains("is-skip-gone");
              enSkipBar.classList.add("is-skip-gone");
              enSkipBar.setAttribute("aria-hidden", "true");
              setTab(false);
              window.clearTimeout(enSkipHideTimer);
              if (first || already) enSkipBar.style.visibility = "hidden";
              else {
                enSkipHideTimer = window.setTimeout(() => {
                  if (enSkipBar.classList.contains("is-skip-gone")) {
                    enSkipBar.style.visibility = "hidden";
                    enSkipBar.classList.remove("is-en-skip-live");
                  }
                }, 200);
              }
            } else {
              window.clearTimeout(enSkipHideTimer);
              enSkipBar.style.visibility = "";
              enSkipBar.classList.remove("is-skip-gone");
              enSkipBar.setAttribute("aria-hidden", "false");
              setTab(true);
              const { points } = enSnapMetrics();
              if (enNextBtn && points.length) {
                /* Sista steget: pilen fungerar som Hoppa över, aldrig avstängd. */
                enNextBtn.disabled = false;
                enNextBtn.setAttribute("aria-disabled", "false");
              }
            }
            if (first) {
              enSkipBar.getBoundingClientRect();
              enSkipBar.style.transition = "";
            }
          }
          addEventListener("scroll", () => { try { syncEnDagSkip(); } catch (error) { console.error(error); } }, { passive: true });
          syncEnDagSkip();
          enSkipBtn?.addEventListener("click", (event) => {
            event.preventDefault();
            enSmoothTo(enSkipTargetY(), 720);
          });
          enNextBtn?.addEventListener("click", (event) => {
            event.preventDefault();
            if (enSnapReduced || enSnapMode() === "off") return;
            const { points } = enSnapMetrics();
            if (!points.length) return;
            const step = enAnchorStep(points, 1);
            const next = Math.min(points.length - 1, step + 1);
            if (next === step || scrollY >= points[points.length - 1] - 2) { enSmoothTo(enSkipTargetY(), 720); return; }
            enLastDirection = 1;
            enSmoothTo(points[next], enSnapCssNum("--snap-duration", 520));
          });
          if (enSnapDebugOn) {
            addEventListener("scroll", enUpdateDebug, { passive: true });
            enUpdateDebug();
          }
          window.__enSnap = {
            mode: enSnapMode,
            metrics: enSnapMetrics,
            cancel: enCancelSnap,
            smoothTo: enSmoothTo,
            trySettle: enTrySettle,
            settleCandidate: enSettleCandidate,
            forceSettle: () => {
              enLastScrollAt = performance.now() - 1000;
              enVelSamples = [];
              enTrySettle();
            },
            pdCount: () => ({ ...enPdCount }),
            velocity: enVelocity,
            direction: () => enLastDirection,
            setDirection: (d) => { enLastDirection = d; },
            zone: enSnapZone,
          };
        }
      } catch (error) { console.error("season", error); }
      } catch (error) { console.error("season", error); }
  }

  /* ---- just-nu data packs, gren switching, summer pack (td 3974–4432) ---- */
  function initJustNu() {
      try {
      if (!document.querySelector("#fraga-card") || !document.querySelector(".td-rapport") || !document.querySelector(".just-nu .td-pagang-groups") || !document.querySelector(".just-nu .td-kamera") || !document.querySelector(".just-nu .td-segmented")) return;
      /* TODO: demoinnehåll, inte riktiga fakta. */
      const justNuData = {
        alpint: {
          fraga: { title: "Det regnar, vad kan vi göra idag?", sub: "Tre tips för familjen inomhus idag.", href: "#fraga" },
          rapport: {
            chip: "Lätt · [Familjebacken]",
            caption: "Från backen i morse · 07:40",
            quote: "”[Mjukt och fint i barnbacken. Ta första åket före tio, då är det tomt i liften.]”",
            sign: "[Karin Ek], pistförare",
            badge: "Preparerad 05:30",
            image: "./assets/img/rapport-raw-1.png",
            avatar: "./assets/img/rapport-avatar.png"
          }
        },
        langd: {
          /* TODO: demosiffror från Just nu / Data. Byt mot ett riktigt spårflöde. */
          status: {
            spar: { openKm: 142, totalKm: 180, groomedKm: 62 },
            valla: { wax: "Blå", trackTempC: -6 },
            nysno: { cm: 6, forecastCm: 15 },
            snodjup: { upperCm: 78, lowerCm: 52 }
          },
          /* TODO: påhittat OG-event i [hakparentes]. Byt mot riktiga tider. */
          event: {
            place: "[Grönklittsbacken]",
            when: "Idag 19:00",
            title: "[Kvällsåkning i belysta spår]",
            name: "[Månskensturen]",
            body: "[Tisdagar och torsdagar tänds elljusspåret vid Grönklitt till 21. Tre kilometer i skogen, lagom för barnen, och varm saft vid starten.]"
          },
          fraga: {
            sub: "Dagens vallatips.",
            href: "#fraga"
          },
          rapport: {
            /* TODO: byt ut när riktiga filer finns. */
            image: "./assets/img/just-nu/langd/just-nu-01.jpg",
            video: "/videos/langd/just-nu-01.mp4",
            poster: "./assets/img/just-nu/langd/just-nu-01.jpg",
            alt: "Upplysta skidspår i skogen på kvällen."
          },
          calendar: {
            snart: ["[16 feb–8 mar] · Sportlov med barnaktiviteter"],
            senare: ["[mars] · [Orsa Skidmaraton]", "[juli] · [Musik vid Skattungen]"]
          },
          /* TODO: sidan för spårkartan är inte vald. Länken pekar på en platshållare. */
          karta: {
            label: "Spårkarta",
            image: "./assets/img/just-nu/langd/sparkarta.png",
            alt: "Karta över längdspåren i Orsa Grönklitt.",
            line: "Se vilka spår som är öppna",
            href: "#sparkarta",
            name: "Öppna spårkartan"
          }
        },
        /* TODO: demosiffror och påhittat OG-innehåll i [hakparentes]. Byt mot ett sommarflöde. */
        sommar: {
          temperature: { valleyC: 17, summitC: 13, lakeC: 19 },
          lakeName: "[Skattungen]",
          weather: { rainPercent: 20, valleyMs: 4, summitMs: 9 },
          trails: {
            open: 11,
            total: 14,
            condition: "Torra",
            answers: {
              "Blöta": "Mycket regn i natt. Ta vattentäta kängor.",
              "Delvis blöta": "Blött i skogen, torrare på kalfjället.",
              "Torra": "Torrt på lederna. Vanliga skor går bra."
            }
          },
          lift: { open: true, hours: "[10–17]", nextOpen: "10:00" },
          sun: { rise: "03:52", set: "22:14" },
          tip: {
            label: "Aktiviteter",
            pill: "Rovdjursparken",
            title: "[Björnarna vaknar till sommaren]",
            excerpt: "[Orsa Rovdjurspark ligger tio minuter från stugorna. Björn, varg, lodjur och järv, och en lekplats för de minsta.]",
            link: "Se öppettider",
            /* TODO: uthyrningssidan är inte vald. Tom sträng faller tillbaka på #. */
            rentalHref: "",
            image: "./assets/img/just-nu/sommar/svansjon.jpg?v=2",
            alt: "Två personer paddlar kanot på en sjö omgiven av skog."
          },
          calendar: {
            senare: ["[midsommar] · [Midsommar i Orsa]", "[juli] · [Musik vid Skattungen]"]
          },
          fraga: { title: "Är lederna blöta idag?", href: "#fraga" },
          kamera: {
            label: "Webbkamera · [Grönklittstoppen]",
            /* TODO: byt ut när en kamerabild finns. */
            image: "./assets/img/just-nu/sommar/webbkamera.jpg",
            alt: "Webbkamera vid Grönklittstoppen"
          }
        }
      };
      const justNuFraga = document.querySelector("#fraga-card");
      const justNuRapport = document.querySelector(".td-rapport");
      const justNuPagang = document.querySelector(".just-nu .td-pagang-groups");
      const justNuPagangAlpine = justNuPagang.innerHTML;
      const justNuAvatar = justNuRapport.querySelector(".td-rapport-avatar");
      const justNuKamera = document.querySelector(".just-nu .td-kamera");
      const justNuKameraLabel = justNuKamera.querySelector("[data-kamera-label]");
      const justNuKameraLine = justNuKamera.querySelector("[data-kamera-line]");
      const justNuKameraLive = justNuKamera.querySelector(".td-kamera-live");
      const justNuKameraAlpine = { label: justNuKameraLabel.textContent, line: justNuKameraLine.textContent, href: justNuKamera.getAttribute("href"), src: justNuKamera.querySelector("img").getAttribute("src"), alt: "" };
      function tempOrd(tempC) {
        if (tempC === 0) return "noll";
        if (tempC < 0) return `minus ${Math.abs(tempC)}`;
        return String(tempC);
      }
      /* Läge 3 och 4: Längd förvalt (som TD, 16 nov). */
      let justNuGren = /^(booking|onsite)$/.test(document.documentElement.dataset.mode) ? "langd" : "alpint";
      const rowArrow = '<svg class="td-pagang-row-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9.18 3.18 14 8l-4.82 4.82" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel"/></svg>';
      function pagangRow(line, href, divider) {
        const [when, name] = line.split(" · ");
        return `<a class="td-pagang-row" href="${href}"><span class="td-pagang-row-main"><span class="td-pagang-row-text"><span class="td-ui-figure-sm-regular">${when}</span><span class="td-ui-body">${name}</span></span>${rowArrow}</span>${divider ? '<hr class="td-pagang-divider">' : ""}</a>`;
      }
      function setChip(text, marker = true) {
        const chip = justNuRapport.querySelector("[data-rapport-chip]");
        const mark = chip.querySelector(".td-rapport-diff");
        mark.hidden = !marker;
        chip.textContent = "";
        chip.append(mark, document.createTextNode(text));
      }
      function clearActivityLink() {
        justNuRapport.classList.remove("is-activity", "td-just-nu-card");
        justNuRapport.removeAttribute("href");
        justNuRapport.removeAttribute("target");
        justNuRapport.removeAttribute("rel");
        justNuRapport.removeAttribute("aria-label");
        justNuRapport.querySelector("[data-rapport-corner]").hidden = true;
        /* Top behålls synlig — där ligger chip (alpine) / today (längd). */
      }
      function placeRapportChip(where) {
        const chip = justNuRapport.querySelector("[data-rapport-chip]");
        const top = justNuRapport.querySelector("[data-rapport-top]");
        const lower = justNuRapport.querySelector(".td-rapport-lower");
        const corner = justNuRapport.querySelector("[data-rapport-corner]");
        if (where === "top") top.insertBefore(chip, corner);
        else if (where === "before-caption") lower.insertBefore(chip, justNuRapport.querySelector("[data-rapport-caption]"));
        else if (where === "before-title") {
          const title = justNuRapport.querySelector("[data-rapport-title]");
          title.parentElement.insertBefore(chip, title);
        }
      }
      function armImage(img, src, alt, missingHost) {
        missingHost.classList.add("is-missing");
        img.alt = alt || "";
        img.onload = () => missingHost.classList.remove("is-missing");
        img.onerror = () => { img.removeAttribute("src"); missingHost.classList.add("is-missing"); };
        if (src) img.src = src;
      }
      const onsiteMetricEls = [...document.querySelectorAll("[data-onsite-metric]")];
      const onsiteMetricsWinter = onsiteMetricEls.map((el) => el.innerHTML);
      function setOnsiteMetrics(summer) {
        if (!summer) { onsiteMetricEls.forEach((el, i) => { el.innerHTML = onsiteMetricsWinter[i]; }); return; }
        const d = justNuData.sommar;
        const rows = [
          ["Öppet:", `${d.trails.open}/${d.trails.total} leder, ${d.tip.pill} ${d.lift.hours}`],
          ["Väder:", `${d.temperature.valleyC}°, regnrisk ${d.weather.rainPercent} %`],
          ["Bad:", `${d.temperature.lakeC}° i ${d.lakeName}`]
        ];
        onsiteMetricEls.forEach((el, i) => { el.innerHTML = `<strong class="onsite-topbar-label">${rows[i][0]}</strong> ${rows[i][1]}`; });
      }
      function setSummerSwap(summer) {
        document.querySelector(".just-cols .td-pagang").hidden = summer;
        const vaderVinter = document.querySelector(".just-cols-3 .td-vader-block");
        if (vaderVinter) vaderVinter.hidden = summer;
        const kamera = document.querySelector(".just-cols .td-kamera");
        const vaderSommar = document.querySelector(".td-vader-sommar");
        if (summer && vaderSommar) vaderSommar.before(kamera);
        else document.querySelector(".just-cols .td-pagang").after(kamera);
        setOnsiteMetrics(summer);
      }
      function applyJustNu(gren) {
        justNuSwitch.style.display = "";
        setSummerSwap(false);
        justNuGren = gren;
        document.querySelectorAll("[data-gren]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.gren === gren)));
        document.querySelectorAll("[data-gren-panel]").forEach((panel) => { panel.hidden = panel.dataset.grenPanel !== gren; });
        const langd = gren === "langd";
        const pack = justNuData[gren];
        const fragaTitle = langd
          ? `Det är ${tempOrd(justNuData.langd.status.valla.trackTempC)} grader. Vilken valla ska jag ha?`
          : pack.fraga.title;
        justNuFraga.querySelector("[data-fraga-title]").textContent = fragaTitle;
        justNuFraga.querySelector("[data-fraga-sub]").textContent = pack.fraga.sub;
        justNuFraga.removeAttribute("data-fraga-answer");
        justNuFraga.removeAttribute("data-fraga-key");
        if (langd) {
          justNuFraga.setAttribute("data-fraga-key", "valla");
          justNuFraga.setAttribute("data-fraga-answer", pack.fraga.sub);
        }
        if (langd) {
          justNuFraga.removeAttribute("href");
          justNuFraga.tabIndex = 0;
        } else {
          justNuFraga.setAttribute("href", pack.fraga.href);
          justNuFraga.removeAttribute("tabindex");
        }
        const rapport = pack.rapport;
        const event = justNuData.langd.event;
        const rapportTitle = justNuRapport.querySelector("[data-rapport-title]");
        const rapportQuote = justNuRapport.querySelector("[data-rapport-quote]");
        const rapportChip = justNuRapport.querySelector("[data-rapport-chip]");
        const rapportCaption = justNuRapport.querySelector("[data-rapport-caption]");
        const rapportLower = justNuRapport.querySelector(".td-rapport-lower");
        const rapportBody = justNuRapport.querySelector(".td-rapport-body");
        if (langd) {
          setChip(`${event.place} · ${event.when}`);
          placeRapportChip("before-caption");
          rapportCaption.hidden = true;
          rapportTitle.className = "td-heading-xs-regular";
          rapportTitle.textContent = event.title;
          rapportTitle.hidden = false;
          rapportQuote.hidden = true;
          justNuRapport.querySelector(".td-rapport-footer").style.display = "";
          justNuRapport.querySelector("[data-rapport-today]").textContent = "Händer idag";
          justNuRapport.querySelector("[data-rapport-today]").hidden = false;
          justNuRapport.querySelector("[data-rapport-top]").hidden = false;
          justNuRapport.querySelector("[data-rapport-chip]").hidden = false;
          clearActivityLink();
          justNuRapport.querySelector("[data-rapport-corner]").hidden = false;
          justNuRapport.querySelector("[data-rapport-corner-label]").textContent = "Läs mer";
          justNuRapport.querySelector("[data-rapport-excerpt]").hidden = true;
          justNuRapport.querySelector("[data-rapport-more]").hidden = true;
        } else {
          setChip(rapport.chip);
          placeRapportChip("top");
          rapportCaption.hidden = false;
          rapportCaption.textContent = rapport.caption;
          justNuRapport.querySelector("[data-rapport-quote]").textContent = rapport.quote;
          justNuRapport.querySelector("[data-rapport-sign]").textContent = rapport.sign;
          justNuRapport.querySelector("[data-rapport-badge]").textContent = rapport.badge;
          rapportTitle.hidden = true;
          rapportQuote.hidden = false;
          justNuRapport.querySelector("[data-rapport-today]").hidden = true;
          justNuRapport.querySelector("[data-rapport-top]").hidden = false;
          justNuRapport.querySelector("[data-rapport-chip]").hidden = false;
          clearActivityLink();
          justNuRapport.querySelector("[data-rapport-excerpt]").hidden = true;
          justNuRapport.querySelector("[data-rapport-more]").hidden = true;
          justNuRapport.querySelector(".td-rapport-footer").style.display = "";
        }
        justNuRapport.classList.toggle("is-langd", langd);
        const photo = justNuRapport.querySelector("img.td-rapport-image");
        const film = justNuRapport.querySelector("[data-langd-video]");
        film.hidden = true;
        film.removeAttribute("src");
        if (langd) {
          armImage(photo, rapport.image, rapport.alt, justNuRapport);
          film.poster = rapport.poster;
          film.onloadeddata = () => { film.hidden = false; justNuRapport.classList.remove("is-missing"); };
          film.onerror = () => { film.hidden = true; };
          film.src = rapport.video;
          justNuAvatar.hidden = true;
        } else {
          justNuRapport.classList.remove("is-missing");
          photo.onload = null;
          photo.onerror = null;
          photo.alt = "";
          photo.src = rapport.image;
          justNuAvatar.hidden = false;
          justNuAvatar.classList.remove("is-missing");
          justNuAvatar.alt = "";
          justNuAvatar.src = rapport.avatar;
        }
        if (langd) {
          const status = justNuData.langd.status;
          const stack = document.querySelector('[data-gren-panel="langd"].td-just-nu-stack');
          const signed = (n) => (n < 0 ? `−${Math.abs(n)}` : String(n));
          const fill = (key, value, secondary) => {
            const card = stack.querySelector(`[data-status="${key}"]`);
            card.querySelector("[data-status-value]").textContent = value;
            const extra = card.querySelector("[data-status-value-2]");
            if (extra) extra.textContent = secondary;
          };
          fill("spar", String(status.spar.openKm), String(status.spar.groomedKm));
          stack.querySelector('[data-status="spar"] [data-status-unit]').textContent = String(status.spar.totalKm);
          /* Valla har ett eget kort (Dagens vallatips) i tredje raden. */
          fill("nysno", String(status.nysno.cm), String(status.nysno.forecastCm));
          fill("snodjup", String(status.snodjup.upperCm), String(status.snodjup.lowerCm));
          stack.dispatchEvent(new Event("just-nu-label"));
          const first = `${event.when} · ${event.name}`;
          const snart = [first, ...justNuData.langd.calendar.snart];
          const senare = justNuData.langd.calendar.senare;
          justNuPagang.innerHTML = `<section><h3 class="td-pagang-group-name td-ui-nav">Snart</h3>${snart.map((line, i) => pagangRow(line, "#langd-snart", i < snart.length - 1)).join("")}</section><section><h3 class="td-pagang-group-name td-ui-nav">Längre fram</h3>${senare.map((line, i) => pagangRow(line, "#langd-senare", i < senare.length - 1)).join("")}</section>`;
          const karta = justNuData.langd.karta;
          justNuKamera.classList.add("is-karta");
          justNuKamera.href = karta.href;
          justNuKamera.setAttribute("aria-label", karta.name);
          justNuKameraLabel.textContent = karta.label;
          justNuKamera.querySelector(".td-corner-link-label").textContent = "Öppna spårkartan";
          justNuKameraLine.textContent = karta.line;
          justNuKameraLive.hidden = true;
          armImage(justNuKamera.querySelector("img"), karta.image, karta.alt, justNuKamera);
        } else {
          justNuPagang.innerHTML = justNuPagangAlpine;
          justNuKamera.classList.remove("is-karta", "is-missing");
          justNuKamera.href = justNuKameraAlpine.href;
          justNuKamera.removeAttribute("aria-label");
          justNuKameraLive.hidden = false;
          justNuKameraLine.textContent = justNuKameraAlpine.line;
          const kameraImg = justNuKamera.querySelector("img");
          kameraImg.onload = null;
          kameraImg.onerror = null;
          kameraImg.alt = justNuKameraAlpine.alt;
          kameraImg.src = justNuKameraAlpine.src;
          justNuKameraLabel.textContent = justNuKameraAlpine.label;
          justNuKamera.querySelector(".td-corner-link-label").textContent = "Alla kameror";
        }
        document.querySelector(`[data-gren-panel="${gren}"].td-just-nu-stack`)?.dispatchEvent(new Event("just-nu-reset"));
      }
      function markWordPrimary(el) {
        if (!el) return;
        const text = el.textContent.trim();
        const numeric = /^[\d\s.,+\-−–/]+$/.test(text);
        el.classList.toggle("is-word-primary", el.classList.contains("td-ui-figure-lg") && text.length > 0 && !numeric);
      }
      const justNuSwitch = document.querySelector(".just-nu .td-segmented");
      function applySummer() {
        justNuSwitch.style.display = "none";
        document.querySelectorAll("[data-gren-panel]").forEach((panel) => { panel.hidden = panel.dataset.grenPanel !== "sommar"; });
        setSummerSwap(true);
        const summer = justNuData.sommar;
        const stack = document.querySelector('[data-gren-panel="sommar"].td-just-nu-stack');
        const card = (key) => stack.querySelector(`[data-summer="${key}"]`);
        const set = (key, value, secondary, third) => {
          const node = card(key);
          node.querySelector("[data-summer-value]").textContent = value;
          const extra = node.querySelector("[data-summer-value-2]");
          if (extra) extra.textContent = secondary;
          const more = node.querySelector("[data-summer-value-3]");
          if (more) more.textContent = third;
        };
        set("temperatur", String(summer.temperature.valleyC), String(summer.temperature.summitC), String(summer.temperature.lakeC));
        set("vader", String(summer.weather.rainPercent), String(summer.weather.valleyMs), String(summer.weather.summitMs));
        set("leder", String(summer.trails.open), summer.trails.condition);
        card("leder").querySelector("[data-summer-unit]").textContent = String(summer.trails.total);
        const liftOpen = summer.lift.open;
        set("lift", liftOpen ? "Öppen" : "Stängd", liftOpen ? summer.lift.hours : summer.lift.nextOpen);
        markWordPrimary(card("lift").querySelector("[data-summer-value]"));
        card("lift").querySelector("[data-summer-dot]").dataset.tone = liftOpen ? "open" : "closed";
        card("lift").querySelector("[data-summer-caption-2]").textContent = liftOpen ? "dagens öppettider" : "nästa öppning";
        set("sol", summer.sun.rise, summer.sun.set);
        stack.dispatchEvent(new Event("just-nu-label"));
        const tip = summer.tip;
        const rapportTitle = justNuRapport.querySelector("[data-rapport-title]");
        const rapportChip = justNuRapport.querySelector("[data-rapport-chip]");
        const rapportCaption = justNuRapport.querySelector("[data-rapport-caption]");
        setChip(tip.pill, false);
        placeRapportChip("before-title");
        rapportCaption.hidden = true;
        rapportTitle.className = "td-heading-sm-regular";
        rapportTitle.textContent = tip.title;
        rapportTitle.hidden = false;
        justNuRapport.querySelector("[data-rapport-quote]").hidden = true;
        const today = justNuRapport.querySelector("[data-rapport-today]");
        today.textContent = tip.label;
        today.hidden = false;
        justNuRapport.querySelector("[data-rapport-chip]").hidden = false;
        const excerpt = justNuRapport.querySelector("[data-rapport-excerpt]");
        excerpt.hidden = false;
        excerpt.textContent = tip.excerpt;
        justNuRapport.querySelector("[data-rapport-more]").hidden = true;
        justNuRapport.querySelector("[data-rapport-top]").hidden = false;
        justNuRapport.querySelector("[data-rapport-corner]").hidden = false;
        justNuRapport.querySelector("[data-rapport-corner-label]").textContent = tip.link;
        justNuRapport.classList.add("is-activity", "td-just-nu-card");
        justNuRapport.href = tip.rentalHref || "#";
        justNuRapport.target = "_blank";
        justNuRapport.rel = "noopener";
        justNuRapport.setAttribute("aria-label", `${tip.link}, öppnas i ny flik`);
        justNuRapport.querySelector(".td-rapport-footer").style.display = "none";
        justNuRapport.classList.remove("is-langd");
        const trailAnswer = summer.trails.answers[summer.trails.condition];
        justNuFraga.querySelector("[data-fraga-title]").textContent = summer.fraga.title;
        justNuFraga.querySelector("[data-fraga-sub]").textContent = trailAnswer;
        justNuFraga.setAttribute("data-fraga-answer", trailAnswer);
        justNuFraga.setAttribute("data-fraga-key", "leder");
        justNuFraga.setAttribute("href", summer.fraga.href);
        justNuFraga.removeAttribute("tabindex");
        const photo = justNuRapport.querySelector("img.td-rapport-image");
        const film = justNuRapport.querySelector("[data-langd-video]");
        film.hidden = true;
        film.removeAttribute("src");
        justNuRapport.classList.remove("is-missing");
        photo.alt = tip.alt;
        photo.src = tip.image;
        const senare = summer.calendar.senare;
        justNuPagang.innerHTML = `<section><h3 class="td-pagang-group-name td-ui-nav">Längre fram</h3>${senare.map((line, i) => pagangRow(line, "#sommar-senare", i < senare.length - 1)).join("")}</section>`;
        justNuKamera.classList.remove("is-karta");
        justNuKamera.href = justNuKameraAlpine.href;
        justNuKamera.removeAttribute("aria-label");
        justNuKameraLive.hidden = false;
        justNuKameraLine.textContent = justNuKameraAlpine.line;
        justNuKameraLabel.textContent = summer.kamera.label;
        armImage(justNuKamera.querySelector("img"), summer.kamera.image, summer.kamera.alt, justNuKamera);
        stack.dispatchEvent(new Event("just-nu-reset"));
      }
      function closeSeasonOverlays() {
        const layer = document.getElementById("fraga-layer");
        if (layer && !layer.hidden) layer.querySelector("[data-fraga-close]")?.click();
        const boka = document.querySelector(".boka-menu");
        if (boka?.classList.contains("is-open")) {
          boka.classList.remove("is-open");
          boka.querySelector("a")?.setAttribute("aria-expanded", "false");
        }
      }
      document.addEventListener("td-season", (event) => {
        const summer = event.detail === "summer";
        const sun = document.querySelector(".hero-sun");
        const goggles = document.querySelector(".hero-goggles");
        if (sun && goggles) {
          sun.toggleAttribute("aria-hidden", !summer);
          goggles.toggleAttribute("aria-hidden", summer);
        }
        closeSeasonOverlays();
        if (event.detail === "summer") applySummer();
        else {
          justNuSwitch.style.display = "";
          applyJustNu(justNuGren);
        }
      });
      document.querySelector(".just-nu .td-segmented").addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        const buttons = [...event.currentTarget.querySelectorAll("[data-gren]")];
        const index = buttons.indexOf(document.activeElement);
        if (index < 0) return;
        event.preventDefault();
        const next = buttons[(index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length];
        next.focus();
        applyJustNu(next.dataset.gren);
      });
      document.querySelectorAll("[data-gren]").forEach((button) => {
        button.addEventListener("click", () => {
          if (document.documentElement.dataset.season === "summer") return;
          applyJustNu(button.dataset.gren);
        });
      });
      applyJustNu(justNuGren);
      /* Byte till På plats: Längd förvalt. Motorn skickar inget og-mode → observera attributet. */
      let lastMode = document.documentElement.dataset.mode;
      new MutationObserver(() => {
        const mode = document.documentElement.dataset.mode;
        if (mode === lastMode) return;
        lastMode = mode;
        if (mode === "onsite" && justNuGren !== "langd" && document.documentElement.dataset.season !== "summer") applyJustNu("langd");
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
      try {
        const seasonKey = `${SEASON_TOGGLE.storagePrefix}-season`;
        if (localStorage.getItem(seasonKey) === "summer" || localStorage.getItem(seasonKey) === "sommar") applySummer();
      } catch (e) {}
      /* TODO: demosvar. Korten läser Just nu-fälten, de kopierar inte siffrorna. */
      window.fragaAnswerFor = (question) => {
        const card = document.getElementById("fraga-card");
        const key = card?.getAttribute("data-fraga-key");
        const cardQuestion = card?.querySelector("[data-fraga-title]")?.textContent.trim();
        const summer = justNuData.sommar;
        const langd = justNuData.langd;
        const signed = (n) => (n < 0 ? `−${Math.abs(n)}` : String(n));
        const configs = {
          leder: {
            question: summer.fraga.title,
            answer: summer.trails.answers[summer.trails.condition],
            source: "Baserat på ledstatus",
            follow: ["Vilken led är torrast?", "Är liften öppen?", "Var hyr jag cykel?"],
            tiles: [
              { title: "Lederna", number: String(summer.trails.open), slash: String(summer.trails.total), caption: "cykelleder öppna" },
              { title: "Väder", number: String(summer.weather.rainPercent), unit: "%", caption: "risk för regn" }
            ]
          },
          valla: {
            question: "Vilken valla ska jag ha?",
            answer: langd.fraga.sub,
            source: "Baserat på spårdata",
            follow: ["Hur är spårläget idag?", "Hur mycket nysnö väntas?", "Var hittar jag spårkartan?"],
            tiles: [
              { title: "Valla", word: langd.status.valla.wax, caption: "fästvalla" },
              { title: "Spår", number: signed(langd.status.valla.trackTempC), unit: "°C", caption: "i spåret" }
            ]
          }
        };
        const config = configs[key];
        if (!config) return null;
        if (question !== config.question && question !== cardQuestion) return null;
        return config;
      };
      } catch (error) { console.error("just nu", error); }
  }

  /* ---- En frågekälla (OG_FRAGOR): Vanliga frågor-blocket och Orsaguiden i Just nu, per läge × säsong (td TD_FRAGOR-render) ---- */
  function renderFragor() {
    const esc = (t) => t.replace(/"/g, "&quot;");
    const faqArrow = '<span class="td-fraga-fragelista-rad-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"/></svg></span>';
    const guideArrow = '<span class="td-guide-pil"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9.18 3.18 14 8l-4.82 4.82" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel"/></svg></span>';
    const guideRows = (list) => list.slice(0, 3).map((q) => `<li class="td-guide-rad"><button type="button" class="td-guide-fraga td-ui-body" data-fraga-title="${esc(q)}"><span>${q}</span>${guideArrow}</button></li>`).join("");
    function render() {
      const faq = document.querySelector("#fragor .td-fraga-fragelista-platta");
      if (faq) faq.innerHTML = ogFragor().map((q, i) => `<li class="td-fraga-fragelista-rad"><button class="td-fraga-fragelista-knapp td-body-sm" type="button"${i ? ' data-avdelare="ja"' : ""} data-fraga-title="${esc(q)}"><span class="td-fraga-fragelista-rad-text">${q}</span>${faqArrow}</button></li>`).join("");
      const F = OG_FRAGOR;
      const set = (sel, list) => { const el = document.querySelector(sel); if (el) el.innerHTML = guideRows(list); };
      set('.td-guide-lista.td-guide-bokning[data-gren-panel="alpint"]', F.booking);
      set('.td-guide-lista:not(.td-guide-bokning)[data-gren-panel="alpint"]', F.onsite);
      set('.td-guide-lista.td-guide-bokning[data-gren-panel="sommar"]', F.bookingSummer);
      set('.td-guide-lista:not(.td-guide-bokning)[data-gren-panel="sommar"]', F.onsiteSummer);
    }
    render();
    document.addEventListener("og-season", () => setTimeout(render, 0));
    /* Motorns setMode skickar inget og-mode-event → lyssna på attributet. */
    new MutationObserver(() => setTimeout(render, 0)).observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  }

  /* ---- Fråga modal: open/close, focus trap, Escape, ask flow, FAQ wiring (td 4516–4962) ---- */
  function initFragaModal() {
        /* Innehållet (frågekälla, svar, startvy) ligger i orsa-guiden.js. Logiken är TD:s (index.html 5777–6294, 15 nov). */
        const FRAGA_SLOW = 1.667;
        const REVEAL_SHORT = 600 * FRAGA_SLOW;
        const REVEAL_LONG = 900 * FRAGA_SLOW;
        const REVEAL_STAGGER = 100 * FRAGA_SLOW;
        renderFragor();
        try {
        if (!document.getElementById("fraga-layer") || !document.getElementById("fraga-panel")) return;
        const mobileQ = matchMedia("(max-width: 1023px)");
        const layer = document.getElementById("fraga-layer");
        const panel = document.getElementById("fraga-panel");
        const dim = layer.querySelector(".fraga-dim");
        const input = document.getElementById("fraga-input");
        const views = [...panel.querySelectorAll(".fraga-view")];
        const suggest = document.getElementById("fraga-suggest");
        const qEl = document.getElementById("fraga-q");
        const think = document.getElementById("fraga-think");
        const answer = document.getElementById("fraga-answer");
        const answerLive = document.getElementById("fraga-answer-live");
        const closeBtn = panel.querySelector(".fraga-x");
        const sources = document.getElementById("fraga-sources");
        const nowLabel = document.getElementById("fraga-now");
        const tiles = document.getElementById("fraga-tiles");
        const cards = document.getElementById("fraga-cards");
        const chips = document.getElementById("fraga-chips");
        const note = document.getElementById("fraga-note");
        const follow = document.getElementById("fraga-follow");
        const launch = document.getElementById("fraga-launch");
        const card = document.getElementById("fraga-card");
        const kbd = document.getElementById("fraga-kbd");
        let gen = 0;
        let timers = [];
        let trigger = launch;
        let typing = false;
        let answerFull = "";
        let questionFull = "";
        if (kbd) kbd.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";
        const suggestArrow = '<span class="td-fraga-fragelista-rad-icon" aria-hidden="true"><svg class="fraga-suggest-arrow" width="16" height="16" viewBox="0 0 16 16"><path d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"/></svg></span>';
        /* Startvyn (ingen fråga ställd). Fyra varianter: vinter ny/återkommande, påbörjad bokning, på plats, sommar.
           Sommar är en enda variant (återkommande). Bokningsdata speglar DEMO_STAY; [Anna] är platshållare. */
        const welcomeEl = document.getElementById("fraga-welcome");
        const suggestLabel = document.querySelector(".fraga-suggest-label");
        const welcomeState = () => {
          if (document.documentElement.dataset.season === "summer") return "summer";
          const mode = document.documentElement.dataset.mode;
          return mode === "booking" || mode === "onsite" ? mode : "general";
        };
        const welcomeCard = (c) => `<button class="fraga-card fraga-welcome-card" type="button" data-ask="${c.ask}"><span class="fraga-card-media"><img src="${c.image}" alt="" /></span><span class="fraga-card-copy"><span class="td-ui-kicker">${c.kicker}</span><span class="fraga-card-title"><span class="td-ui-title-sm">${c.title}</span></span><span class="td-ui-body-sm">${c.line}</span></span></button>`;
        function renderWelcome() {
          const w = WELCOME[welcomeState()];
          let html = `<h3 class="td-heading-sm fraga-welcome-title">${w.title}</h3><p class="td-body fraga-welcome-lead">${w.lead}</p>`;
          if (w.booking) {
            html += `<div class="fraga-welcome-booking"><div class="fraga-welcome-booking-head"><span class="td-ui-kicker">Er bokning</span><span class="td-ui-caption fraga-welcome-ok">Boende bokat</span></div><p class="td-ui-title">${WELCOME_BOOKING.title}</p><p class="td-ui-body-sm">${WELCOME_BOOKING.line}</p><div class="fraga-welcome-next"><p class="td-ui-body-sm">${WELCOME_BOOKING.next}</p><button class="td-ui-body-sm fraga-welcome-chip" type="button" data-ask="${WELCOME_BOOKING.nextAsk}">${WELCOME_BOOKING.nextAsk}</button></div></div>`;
            html += `<p class="td-ui-kicker fraga-welcome-kicker">Under er vecka</p><div class="fraga-cards fraga-welcome-cards">${WELCOME_BOOKING.week.map(welcomeCard).join("")}</div>`;
          }
          if (w.events) {
            html += `<p class="td-ui-kicker fraga-welcome-kicker">Kul för hela familjen idag</p><div class="fraga-cards fraga-welcome-cards">${WELCOME_TODAY.map(welcomeCard).join("")}</div>`;
          }
          if (w.tiles) html += `<p class="td-ui-kicker fraga-welcome-kicker">${w.nowLabel}</p><div class="fraga-welcome-tiles">${WELCOME_TILES[w.tiles].map(tileMarkup).join("")}</div>`;
          welcomeEl.innerHTML = html;
          suggestLabel.textContent = w.label;
          return ogFragor();
        }
        welcomeEl.addEventListener("click", (event) => {
          const target = event.target.closest("[data-ask]");
          if (target) ask(target.getAttribute("data-ask"));
        });
        const renderSuggest = () => suggest.innerHTML = renderWelcome().map((text) => `<li class="td-fraga-fragelista-rad"><button class="td-fraga-fragelista-knapp fraga-suggest-row td-body-sm" type="button"><span class="td-fraga-fragelista-rad-text fraga-suggest-text">${text}</span>${suggestArrow}</button></li>`).join("");
        renderSuggest();
        function later(ms, fn) {
          const id = setTimeout(fn, ms);
          timers.push(id);
          return id;
        }
        function clearTimers() {
          timers.forEach(clearTimeout);
          timers = [];
          typing = false;
        }
        function show(name) {
          views.forEach((view) => view.classList.toggle("is-on", view.dataset.view === name));
          panel.classList.toggle("is-answer", name === "answer");
        }
        function dock() {
          const w = Math.min(720, innerWidth - 32);
          const h = Math.min(760, innerHeight - 160);
          return { top: 96, left: (innerWidth - w) / 2, width: w, height: h };
        }
        function markOverflow() {
          views.forEach((view) => view.classList.toggle("is-overflow", view.scrollHeight > view.clientHeight + 48));
        }
        function place(animate) {
          const box = dock();
          const top = box.top;
          const left = box.left;
          const w = box.width;
          const h = box.height;
          const move = `${420 * FRAGA_SLOW}ms var(--motion-easing-out-soft)`;
          panel.style.transition = animate && !reduced
            ? `top ${move}, left ${move}, width ${move}, height ${move}, border-radius ${move}`
            : "none";
          panel.style.top = `${top}px`;
          panel.style.left = `${left}px`;
          panel.style.width = `${w}px`;
          panel.style.height = `${h}px`;
        }
        function resetAnswer() {
          qEl.textContent = "";
          think.hidden = true;
          answer.textContent = "";
          answer.classList.remove("is-caret", "is-reveal");
          answerLive.textContent = "";
          answerFull = "";
          questionFull = "";
          sources.hidden = true;
          sources.textContent = "";
          nowLabel.hidden = true;
          tiles.hidden = true;
          tiles.innerHTML = "";
          cards.innerHTML = "";
          chips.innerHTML = "";
          note.hidden = true;
          note.textContent = "";
          follow.reset();
        }
        let fragaOmContext = "";
        function setOmContext(from, explicit) {
          const raw = explicit
            || from?.getAttribute?.("data-fraga-context")
            || from?.closest?.("[data-fraga-context]")?.getAttribute("data-fraga-context")
            || "";
          fragaOmContext = raw;
          if (raw) {
            sources.hidden = false;
            sources.textContent = raw;
          }
        }
        function clearOmContext() {
          fragaOmContext = "";
        }
        function open(from, direct) {
          renderSuggest();
          gen += 1;
          const token = gen;
          clearTimers();
          trigger = from;
          resetAnswer();
          clearOmContext();
          const question = direct ? (from.querySelector("[data-fraga-title]")?.textContent.trim() || from.getAttribute("data-fraga-title") || "") : "";
          if (direct) {
            setOmContext(from);
            show("answer");
          } else show("search");
          input.value = "";
          layer.hidden = false;
          document.body.classList.add("fraga-open");
          const fromRect = from.getBoundingClientRect();
          panel.classList.remove("is-settled");
          panel.style.transition = "none";
          dim.style.transition = "none";
          dim.style.opacity = "0";
          panel.style.top = `${fromRect.top}px`;
          panel.style.left = `${fromRect.left}px`;
          panel.style.width = `${fromRect.width}px`;
          panel.style.height = `${fromRect.height}px`;
          if (direct && reduced) ask(question, token);
          requestAnimationFrame(() => {
            if (token !== gen) return;
            dim.style.transition = reduced ? "none" : `opacity ${420 * FRAGA_SLOW}ms var(--motion-easing-out-soft)`;
            dim.style.opacity = "1";
            place(true);
            later(reduced ? 0 : 420 * FRAGA_SLOW, () => {
              if (token !== gen) return;
              panel.classList.add("is-settled");
              (direct ? closeBtn : input).focus();
              if (direct && !reduced) later(200 * FRAGA_SLOW, () => { if (token === gen) ask(question, token, 0); });
            });
          });
        }
        function close() {
          gen += 1;
          clearTimers();
          const back = trigger && trigger.isConnected ? trigger : launch;
          const rect = (back || document.body).getBoundingClientRect();
          panel.classList.remove("is-settled");
          const shut = `${300 * FRAGA_SLOW}ms var(--motion-easing-out-soft)`;
          dim.style.transition = reduced ? "none" : `opacity ${shut}`;
          dim.style.opacity = "0";
          panel.style.transition = reduced ? "none" : `top ${shut}, left ${shut}, width ${shut}, height ${shut}`;
          panel.style.top = `${rect.top}px`;
          panel.style.left = `${rect.left}px`;
          panel.style.width = `${rect.width}px`;
          panel.style.height = `${rect.height}px`;
          const token = gen;
          later(reduced ? 0 : 300 * FRAGA_SLOW, () => {
            if (token !== gen) return;
            layer.hidden = true;
            document.body.classList.remove("fraga-open");
            show("search");
            resetAnswer();
            input.value = "";
            back?.focus();
          });
        }
        function typeQuestion(token) {
          typing = true;
          let i = 0;
          const step = () => {
            if (token !== gen || !typing) return;
            i += 1;
            input.value = RAIN.slice(0, i);
            input.setSelectionRange(i, i);
            if (i < RAIN.length) later((30 + Math.random() * 15) * FRAGA_SLOW, step);
            else later(400 * FRAGA_SLOW, () => { if (token === gen && typing) ask(RAIN, token); });
          };
          step();
        }
        function stopTyping() {
          typing = false;
        }
        function humanDelay(char) {
          let ms = 26 + Math.random() * 70;
          if (char === " ") ms += 35 + Math.random() * 110;
          if (",.;?!:".includes(char)) ms += 140 + Math.random() * 220;
          if (Math.random() < 0.07) ms += 180 + Math.random() * 260;
          return ms * 0.6 * FRAGA_SLOW;
        }
        function typeLine(el, text, token, done) {
          let i = 0;
          typing = true;
          const step = () => {
            if (token !== gen || !typing) return;
            i += 1;
            el.textContent = text.slice(0, i);
            if (i < text.length) later(humanDelay(text[i - 1]), step);
            else done();
          };
          step();
        }
        function ask(question, token = gen, delay = 200 * FRAGA_SLOW) {
          clearTimers();
          const mine = token;
          resetAnswer();
          show("answer");
          questionFull = question;
          const card = document.getElementById("fraga-card");
          const cardAnswer = card?.getAttribute("data-fraga-answer") || "";
          const cardQuestion = card?.querySelector("[data-fraga-title]")?.textContent.trim() || "";
          const config = window.fragaAnswerFor?.(question) || null;
          const fromCard = cardAnswer && question === cardQuestion;
          const rain = !config && !fromCard && !!QA[question];
          const text = config?.answer || (fromCard ? cardAnswer : rain ? qaFor(question).answer : GENERIC);
          answerFull = text;
          if (reduced) {
            qEl.textContent = question;
            answer.textContent = text;
            answerLive.textContent = text;
            finish(rain, mine, fromCard);
            return;
          }
          qEl.textContent = question;
          typeAnswer(text, mine, () => {
            answerLive.textContent = text;
            finish(rain, mine, fromCard);
          });
        }
        function skipAnswer() {
          if (!typing || !answerFull) return;
          const card = document.getElementById("fraga-card");
          const fromCard = card?.getAttribute("data-fraga-answer") && questionFull === card.querySelector("[data-fraga-title]")?.textContent.trim();
          const rain = !fromCard && !!QA[questionFull];
          clearTimers();
          qEl.textContent = questionFull;
          answer.textContent = answerFull;
          answer.classList.remove("is-caret", "is-reveal");
          answerLive.textContent = answerFull;
          finish(rain, gen, fromCard);
        }
        function typeAnswer(text, token, done) {
          const words = text.match(/\S+\s*/g) || [text];
          const duration = Math.min(REVEAL_LONG, Math.max(REVEAL_SHORT, words.length * 40 * FRAGA_SLOW));
          const stepMs = duration / words.length;
          let i = 0;
          typing = true;
          answer.textContent = "";
          const step = () => {
            if (token !== gen || !typing) return;
            const chunk = document.createElement("span");
            chunk.className = "fraga-chunk";
            chunk.textContent = words[i];
            answer.append(chunk);
            i += 1;
            if (i < words.length) later(stepMs, step);
            else { typing = false; done(); }
          };
          step();
        }
        function tileMarkup(tile) {
          const figure = tile.word
            ? `<span class="td-ui-figure-lg">${tile.word}</span>`
            : tile.degree
              ? `<span class="td-ui-figure-lg">${tile.number}</span>`
              : `<span class="td-ui-figure-lg">${tile.number}</span>${tile.slash ? `<span class="td-ui-figure-unit-lg">/</span><span class="td-ui-figure-unit-lg">${tile.slash}</span>` : ""}${tile.unit ? `<span class="td-ui-figure-unit-lg">${tile.unit}</span>` : ""}`;
          const note = tile.note ? `<p class="td-ui-body-sm td-just-nu-data-caption">${tile.note}</p>` : "";
          return `<article class="fraga-tile"><h3 class="td-ui-title">${tile.title}</h3><div class="td-just-nu-data-figure">${figure}</div><p class="td-ui-body-sm td-just-nu-data-caption">${tile.caption}</p>${note}</article>`;
        }
        function showConfig(config) {
          const time = document.querySelector("[data-just-nu-updated]")?.textContent.trim() || "";
          nowLabel.hidden = true;
          tiles.hidden = true;
          tiles.innerHTML = config.tiles.map(tileMarkup).join("");
          chips.innerHTML = config.follow.map((text) => `<button class="td-ui-body-sm" type="button" data-fraga-follow="${text}">${text}</button>`).join("");
          const base = time ? `${config.source} kl. ${time}` : config.source;
          sources.textContent = fragaOmContext ? `${fragaOmContext} · ${base}` : base;
          nowLabel.hidden = true;
          tiles.hidden = true;
          chips.hidden = true;
          sources.hidden = true;
          later(REVEAL_STAGGER, () => {
            nowLabel.hidden = false;
            tiles.hidden = false;
            chips.hidden = false;
            sources.hidden = false;
            markOverflow();
          });
        }
        function finish(rain, token, quiet) {
          if (token !== gen) return;
          const config = window.fragaAnswerFor?.(questionFull) || null;
          if (config) {
            showConfig(config);
            return;
          }
          if (fragaOmContext) {
            sources.hidden = false;
            sources.textContent = fragaOmContext;
          }
          if (!rain) {
            if (quiet) return;
            note.hidden = false;
            note.innerHTML = `<button class="td-ui-body-sm" type="button" id="fraga-rain">Prova regnfrågan</button>`;
            markOverflow();
            return;
          }
          const qa = qaFor(questionFull) || qaFor(RAIN);
          sources.innerHTML = qa.sources;
          cards.innerHTML = qa.cards.map((item) => {
            const media = item.image ? `<img src="${item.image}" alt="" onerror="this.parentNode.classList.add('is-empty');this.remove()" />` : "";
            return `<a class="fraga-card" href="#"><span class="fraga-card-media${item.image ? "" : " is-empty"}">${media}</span><span class="fraga-card-copy"><span class="td-ui-kicker">${item.kicker}</span><span class="fraga-card-title"><span class="td-ui-title-sm">${item.title}</span><svg class="fraga-card-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9.18 3.18 14 8l-4.82 4.82" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel"/></svg></span><span class="td-ui-body-sm">${item.line}</span></span></a>`;
          }).join("");
          chips.innerHTML = qa.chips.map((text) => `<button class="td-ui-body-sm" type="button" data-fraga-follow="${text}">${text}</button>`).join("");
          [...cards.children].forEach((el) => { el.hidden = true; });
          chips.hidden = true;
          sources.hidden = true;
          const bits = [sources, ...cards.children, chips];
          const reveal = (index) => {
            if (token !== gen) return;
            bits[index].hidden = false;
            markOverflow();
            requestAnimationFrame(() => bits[index].classList.add("is-in"));
            if (index < bits.length - 1) later(80 * FRAGA_SLOW, () => reveal(index + 1));
          };
          reveal(0);
        }
        function demoNote() {
          note.hidden = false;
          note.textContent = FOLLOW;
          markOverflow();
        }
        panel.querySelector(".fraga-new").addEventListener("click", () => {
          gen += 1;
          clearTimers();
          resetAnswer();
          renderSuggest();
          show("search");
          input.value = "";
          input.focus();
          markOverflow();
        });
        launch.addEventListener("click", () => open(launch, false));
        card.addEventListener("click", (event) => {
          event.preventDefault();
          const row = event.target.closest(".td-guide-fraga");
          if (row) { open(row, true); return; }
          if (card.classList.contains("td-guide")) return;
          open(card, true);
        });
        layer.addEventListener("click", (event) => {
          if (event.target.closest("[data-fraga-close]")) close();
        });
        suggest.addEventListener("click", (event) => {
          const button = event.target.closest("button");
          if (button) ask(button.textContent);
        });
        input.addEventListener("keydown", (event) => {
          if (typing && event.key !== "Tab") stopTyping();
        });
        input.addEventListener("pointerdown", () => { if (typing) stopTyping(); });
        chips.addEventListener("click", (event) => {
          const chip = event.target.closest("[data-fraga-follow]");
          if (chip) { ask(chip.getAttribute("data-fraga-follow")); return; }
          if (event.target.closest("button")) demoNote();
        });
        note.addEventListener("click", (event) => {
          if (event.target.id === "fraga-rain") ask(RAIN);
        });
        follow.addEventListener("submit", (event) => {
          event.preventDefault();
          const value = input.value.trim();
          if (value) ask(value);
          else demoNote();
        });
        panel.addEventListener("pointerdown", (event) => {
          if (!typing || event.target.closest("button, a, input")) return;
          skipAnswer();
        });
        addEventListener("keydown", (event) => {
          const hotkey = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
          if (hotkey) { event.preventDefault(); if (layer.hidden) open(launch, false); else close(); return; }
          if (layer.hidden) return;
          if (!event.metaKey && !event.ctrlKey && !event.altKey && typing && event.key !== "Escape" && event.key !== "Tab") {
            event.preventDefault();
            skipAnswer();
            return;
          }
          if (event.key === "Escape") { event.preventDefault(); close(); return; }
          if (event.key !== "Tab") return;
          const nodes = [...panel.querySelectorAll("button, a, input")].filter((el) => el.getClientRects().length);
          if (!nodes.length) return;
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
        window.tdFragaAsk = (question, from, context) => {
          open(from || launch, false);
          if (context) setOmContext(from || launch, context);
          else if (from) setOmContext(from);
          const token = gen;
          later(reduced ? 0 : 480, () => { if (token === gen) ask(question, token, 0); });
        };
        const faq = document.getElementById("fragor");
        if (faq) {
          faq.addEventListener("click", (event) => {
            const row = event.target.closest(".td-fraga-fragelista-knapp[data-fraga-title], .td-fraga-rad[data-fraga-title]");
            if (row) open(row, true);
          });
          const faqForm = faq.querySelector("[data-fraga-falt]");
          if (faqForm) {
            faqForm.addEventListener("submit", (event) => {
              event.preventDefault();
              const value = faqForm.querySelector("input")?.value.trim() || "";
              setOmContext(faqForm);
              open(faqForm, false);
              if (value) {
                const token = gen;
                later(reduced ? 0 : 480, () => { if (token === gen) ask(value, token, 0); });
              }
            });
          }
          if (!reduced) {
            const io = new IntersectionObserver((entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              faq.classList.add("is-in");
              io.disconnect();
            }, { threshold: 0.2 });
            io.observe(faq);
          } else faq.classList.add("is-in");
        }
        document.querySelectorAll(".td-aktuellt-kort[data-typ='fraga']").forEach((card) => {
          card.addEventListener("click", () => open(card, true));
        });
        } catch (error) { console.error("frågerutan", error); }
  }

  /* ---- boende slideshow + parallax (td 4963–5291) ---- */
  function initBoende() {
      try {
      if (!document.getElementById("boende") || !document.getElementById("boende-parallax") || !document.querySelector("#boende .boende-video") || !document.querySelector("#boende .boende-pill") || !document.querySelector("#boende .boende-toggle")) return;
      const boendeReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const boendeLinks = { search: "", all: "" };
      // OG-områden: platshållare. Namn och fakta i [ ] är påhittade tills kunden levererar.
      const boendeStugbyn = {
          id: "stugbyn",
          name: "[Stugbyn]",
          title: "Egen stuga, nära backen.",
          body: "Fristående stugor med plats för hela familjen och lite till. Barnbacken syns från fönstret och liften ligger [ett par hundra meter] bort. Eldstad, bastu och plats att torka kläderna efter en lång dag.",
          facts: [
            { label: "Närmaste lift", value: "[200 m]" },
            { label: "Boyta", value: "[60–90 m²]" },
            { label: "Sovrum", value: "[2–3]" },
            { label: "Boende", value: "Stugor" },
            { label: "Passar för", value: "Barnfamiljer" },
            { label: "Bastu", value: "[I alla]" }
          ],
          video: "",
          poster: "./assets/img/platshallare.svg",
          mirror: false,
          parallax: 0.2,
          r360AreaId: "",
          ctaLabel: "Sök boenden i [Stugbyn]",
          cardTitle: "Kort om området",
          linkLabel: "Se alla boenden",
          scrim: { maskFrom: 50, maskTo: 60 },
          placeholder: true
      };
      const boendeToppen = {
        ...boendeStugbyn,
        id: "toppen",
        name: "[Toppen]",
        title: "Utsikt över Orsasjön.",
        body: "Lägenheter högt upp på berget, med skidorna på redan i dörren. Härifrån ser ni ut över Orsasjön och skogarna. Restaurangen och skiduthyrningen ligger [i samma hus].",
        ctaLabel: "Sök boenden i [Toppen]",
        facts: [
          { label: "Närmaste lift", value: "[50 m]" },
          { label: "Boyta", value: "[40–70 m²]" },
          { label: "Sovrum", value: "[1–3]" },
          { label: "Boende", value: "Lägenheter" },
          { label: "Utsikt", value: "Orsasjön" },
          { label: "Bastu", value: "[I flera]" }
        ]
      };
      const boendeSkogsbyn = {
        ...boendeStugbyn,
        id: "skogsbyn",
        name: "[Skogsbyn]",
        title: "Lugnt i skogen, nära björnarna.",
        body: "Stugor en bit från backarna, där det är tyst på kvällen. Längdspåren börjar utanför knuten och Orsa Rovdjurspark ligger [några minuter] bort. Ett bra val för er som vill blanda backe med annat.",
        ctaLabel: "Sök boenden i [Skogsbyn]",
        facts: [
          { label: "Närmaste lift", value: "[800 m]" },
          { label: "Längdspår", value: "[50 m]" },
          { label: "Sovrum", value: "[2–4]" },
          { label: "Bäddar", value: "[6–10]" },
          { label: "Husdjur", value: "[I vissa]" },
          { label: "Bastu", value: "[I alla]" }
        ]
      };
      const boendeSlides = [boendeStugbyn, boendeToppen, boendeSkogsbyn];
      const boende = document.getElementById("boende");
      const boendeParallax = document.getElementById("boende-parallax");
      const boendeMedia = boende.querySelector(".boende-media");
      const boendePoster = boende.querySelector(".boende-poster");
      const boendeScrim = boende.querySelector(".boende-scrim");
      const boendeVideo = boende.querySelector(".boende-video");
      const boendeCopy = boende.querySelector(".boende-copy");
      const boendeCard = boende.querySelector(".boende-card");
      const boendeList = boende.querySelector(".boende-pill");
      const boendeToggle = boende.querySelector(".boende-toggle");
      const boendeNarrow = matchMedia("(max-width: 767px)");
      let boendeIndex = 0;
      let boendeMode = reduced ? "still" : "paused";
      let boendeAuto = !reduced;
      let boendeSeen = false;
      let boendeHold = false;
      let boendeParallaxInView = false;
      let boendeParallaxRaf = 0;
      let boendeH = 0;
      let boendeV = 0;
      let boendeTravel = 0;
      let boendeFactor = 0;
      function boendeHref(kind, id) {
        const base = boendeLinks[kind];
        if (!base || !id) return "#";
        return base.replace("{id}", encodeURIComponent(id));
      }
      function boendeMask(scrim) {
        const from = scrim && scrim.maskFrom;
        const to = scrim && scrim.maskTo;
        if (!from && !to) return "none";
        const span = to - from;
        const stops = [[0, 1], [0.2, 0.896], [0.4, 0.648], [0.5, 0.5], [0.6, 0.352], [0.8, 0.104], [1, 0]];
        const parts = ["#000 0%", `#000 ${from}%`];
        stops.forEach(([t, alpha]) => {
          const at = (from + span * t).toFixed(2).replace(/\.00$/, "");
          const color = alpha >= 1 ? "#000" : alpha <= 0 ? "transparent" : `rgba(0,0,0,${alpha})`;
          parts.push(`${color} ${at}%`);
        });
        parts.push("transparent 100%");
        return `linear-gradient(to right, ${parts.join(", ")})`;
      }
      function boendeIcons(mode) {
        boendeToggle.classList.toggle("is-playing", mode === "playing");
        boendeToggle.classList.toggle("is-paused", mode === "paused" || mode === "still");
        boendeToggle.classList.toggle("is-end", mode === "end");
        boendeToggle.querySelector(".boende-icon-play").hidden = mode !== "paused" && mode !== "still";
        boendeToggle.querySelector(".boende-icon-pause").hidden = mode !== "playing";
        boendeToggle.querySelector(".boende-icon-replay").hidden = mode !== "end";
        boendeToggle.setAttribute("aria-label", mode === "playing" ? "Pausa områdesbildspelet" : mode === "end" ? "Spela om områdesbildspelet" : "Spela områdesbildspelet");
      }
      function boendeReadyVideo(slide) {
        const next = slide.video || "";
        if (!next) { boendeVideo.removeAttribute("src"); boendeVideo.load(); boendeVideo.style.visibility = "hidden"; return Promise.resolve(); }
        boendeVideo.style.visibility = "";
        if (boendeVideo.getAttribute("src") === next) {
          try { boendeVideo.currentTime = 0; } catch (_) {}
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          const done = () => {
            boendeVideo.removeEventListener("loadeddata", done);
            boendeVideo.removeEventListener("error", done);
            resolve();
          };
          boendeVideo.addEventListener("loadeddata", done);
          boendeVideo.addEventListener("error", done);
          boendeVideo.src = next;
          boendeVideo.load();
          window.setTimeout(done, 800);
        });
      }
      function boendePaint(index) {
        const slide = boendeSlides[index];
        [...boendeList.querySelectorAll("[role=tab]")].forEach((tab, i) => {
          const on = i === index;
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.classList.toggle("is-on", on);
          const fill = tab.querySelector(".boende-fill");
          if (fill) fill.style.width = on ? "0%" : "";
        });
        [boendeMedia, boendeScrim, boendeCopy, boendeCard].forEach((el) => el.classList.add("is-swap"));
        return new Promise((resolve) => {
          window.setTimeout(() => {
            boendeMedia.classList.toggle("is-mirror", slide.mirror === true);
            boendePoster.style.backgroundImage = slide.poster ? `url("${slide.poster}")` : "";
            const mask = boendeMask(slide.scrim);
            boendeScrim.style.maskImage = mask;
            boendeScrim.style.webkitMaskImage = mask;
            boendeCacheParallax();
            boendePaintParallax(true);
            boende.querySelector(".boende-kicker").textContent = slide.name;
            boende.querySelector(".boende-title").textContent = slide.title;
            boende.querySelector(".boende-body").textContent = slide.body;
            const search = boende.querySelector(".boende-search");
            search.href = boendeHref("search", slide.r360AreaId);
            search.replaceChildren(document.createRange().createContextualFragment('<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.2 10.2 13.5 13.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>'), document.createTextNode(" " + slide.ctaLabel));
            const all = boende.querySelector(".boende-all");
            all.href = boendeHref("all", slide.r360AreaId);
            boende.querySelector(".boende-link-label").textContent = slide.linkLabel;
            boendeCard.replaceChildren();
            const cardTitle = document.createElement("h3");
            cardTitle.id = "boende-card-title";
            cardTitle.className = "boende-card-title td-heading-xxs-regular";
            cardTitle.textContent = slide.cardTitle || "Kort om området";
            const facts = document.createElement("div");
            facts.className = "boende-facts";
            slide.facts.forEach(({ label, value }) => {
              const cell = document.createElement("p");
              cell.className = "boende-fact";
              cell.innerHTML = `<span class="td-ui-caption">${label}</span><span class="td-ui-title-sm">${value}</span>`;
              facts.append(cell);
            });
            boendeCard.append(cardTitle, facts);
            boendeReadyVideo(slide).then(() => {
              [boendeMedia, boendeScrim, boendeCopy, boendeCard].forEach((el) => el.classList.remove("is-swap"));
              resolve();
            });
          }, 150);
        });
      }
      boendeSlides.forEach((slide, index) => {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "boende-tab";
        tab.role = "tab";
        tab.id = `boende-tab-${index}`;
        tab.setAttribute("aria-controls", "boende-panel");
        tab.setAttribute("aria-label", slide.name);
        tab.innerHTML = '<span class="boende-pip"><span class="boende-fill"></span></span>';
        tab.addEventListener("click", () => {
          // Byte av slide pausar inte: nya slidens video startar och bildspelet fortsätter.
          boendeAuto = true;
          boendeHold = false;
          boendeSeen = true;
          boendeGo(index);
        });
        boendeList.append(tab);
      });
      function boendeGo(next) {
        boendeIndex = (next + boendeSlides.length) % boendeSlides.length;
        boendeMode = "paused";
        boendePauseAll();
        boendeIcons(reduced ? "still" : "paused");
        const want = boendeIndex;
        boendePaint(want).then(() => {
          if (boendeIndex !== want) return;
          if (boendeAuto && boendeSeen && !boendeHold && !reduced) boendeStart();
        });
      }
      function boendeVisible() {
        const box = boende.getBoundingClientRect();
        const visible = Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
        return box.height > 0 && visible / box.height >= 0.5;
      }
      // Kort utan video (platshållarbild): bildspelet går vidare på timer i stället för på videons "ended".
      const BOENDE_STILL_MS = 6000;
      let boendeStillTimer = 0;
      let boendeStillAt = 0;
      let boendeStillIndex = -1;
      function boendePauseAll() {
        boendeVideo.pause();
        if (boendeStillTimer) { clearInterval(boendeStillTimer); boendeStillTimer = 0; }
      }
      function boendeAdvance() {
        if (boendeAuto) boendeGo((boendeIndex + 1) % boendeSlides.length); // loopar till första
        else { boendeMode = "end"; boendeIcons("end"); }
      }
      function boendeStillRun() {
        if (boendeStillTimer) return;
        if (boendeStillIndex !== boendeIndex) { boendeStillIndex = boendeIndex; boendeStillAt = 0; }
        boendeMode = "playing";
        boendeIcons("playing");
        let last = Date.now();
        boendeStillTimer = setInterval(() => {
          const now = Date.now();
          boendeStillAt += now - last;
          last = now;
          const tab = boendeList.querySelectorAll("[role=tab]")[boendeIndex];
          const fill = tab && tab.querySelector(".boende-fill");
          if (fill) fill.style.width = `${Math.min(100, boendeStillAt / BOENDE_STILL_MS * 100)}%`;
          if (boendeStillAt < BOENDE_STILL_MS) return;
          clearInterval(boendeStillTimer);
          boendeStillTimer = 0;
          boendeStillIndex = -1;
          boendeAdvance();
        }, 100);
      }
      function boendeStart() {
        if (boendeVisible()) boendeSeen = true;
        if (reduced || !boendeAuto || !boendeSeen || boendeHold) return;
        if (!boendeVideo.getAttribute("src")) { boendeStillRun(); return; }
        boendeMode = "playing";
        boendeIcons("playing");
        boendeVideo.play().then(() => { boendeMode = "playing"; boendeIcons("playing"); }).catch(() => { if (!boendeVideo.paused) return; boendeMode = "paused"; boendeIcons("paused"); });
      }
      boendeVideo.addEventListener("play", () => { boendeMode = "playing"; boendeIcons("playing"); });
      boendeVideo.addEventListener("playing", () => { boendeMode = "playing"; boendeIcons("playing"); });
      boendeVideo.addEventListener("pause", () => {
        queueMicrotask(() => {
          if (!boendeVideo.paused || boendeVideo.ended || boendeMode === "end") return;
          boendeMode = "paused";
          boendeIcons("paused");
        });
      });
      boendeVideo.addEventListener("timeupdate", () => {
        if (!boendeVideo.paused && !boendeVideo.ended && boendeMode !== "playing") { boendeMode = "playing"; boendeIcons("playing"); }
        const tab = boendeList.querySelectorAll("[role=tab]")[boendeIndex];
        const fill = tab && tab.querySelector(".boende-fill");
        if (fill && boendeVideo.duration) fill.style.width = `${Math.min(100, boendeVideo.currentTime / boendeVideo.duration * 100)}%`;
      });
      boendeVideo.addEventListener("ended", () => {
        if (boendeAuto) boendeGo((boendeIndex + 1) % boendeSlides.length); // loopar till första
        else { boendeMode = "end"; boendeIcons("end"); }
      });
      boendeToggle.addEventListener("click", () => {
        if (boendeMode === "end") {
          boendeHold = false;
          boendeAuto = true;
          boendeIndex = 0;
          boendePaint(0).then(() => boendeStart());
          return;
        }
        if (boendeMode === "playing") { boendeAuto = false; boendePauseAll(); boendeMode = "paused"; boendeIcons("paused"); return; }
        boendeHold = false;
        boendeAuto = true;
        boendeStart();
      });
      boendeList.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        boendeAuto = true;
        boendeSeen = true;
        boendeGo(boendeIndex + delta);
        boendeList.querySelectorAll("[role=tab]")[boendeIndex].focus();
      });
      boende.addEventListener("focusin", (event) => { if (event.target.closest(".boende-toggle, [role=tab]")) return; boendeHold = true; if (boendeMode === "playing") { boendePauseAll(); boendeMode = "paused"; boendeIcons("paused"); } });
      boende.addEventListener("focusout", () => { if (boende.contains(document.activeElement)) return; boendeHold = false; if (boendeAuto && boendeSeen) boendeStart(); });
      function boendeActiveFactor() {
        if (boendeReduced || matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
        if (boendeNarrow.matches) return 0;
        const slide = boendeSlides[boendeIndex];
        const value = slide && Number(slide.parallax);
        return Number.isFinite(value) ? Math.max(0, value) : 0.2;
      }
      function boendeCacheParallax() {
        boendeH = boende.offsetHeight;
        boendeV = innerHeight;
        boendeFactor = boendeActiveFactor();
        boendeTravel = boendeFactor * (boendeV + boendeH);
        if (boendeTravel <= 0) {
          boendeParallax.style.top = "0px";
          boendeParallax.style.height = "100%";
          boendeParallax.style.transform = "translateX(-50%) translate3d(0, 0, 0)";
          return;
        }
        boendeParallax.style.height = `${boendeH + boendeTravel}px`;
        boendeParallax.style.top = `${-boendeTravel / 2}px`;
      }
      function boendePaintParallax(force) {
        boendeParallaxRaf = 0;
        if (boendeTravel <= 0) {
          boendeParallax.style.transform = "translateX(-50%) translate3d(0, 0, 0)";
          return;
        }
        if (!force && !boendeParallaxInView) return;
        const top = boende.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (boendeV - top) / (boendeV + boendeH)));
        const y = (p - 0.5) * boendeTravel;
        boendeParallax.style.transform = `translateX(-50%) translate3d(0, ${y}px, 0)`;
      }
      function boendeRequestParallax() {
        if (boendeTravel <= 0 || !boendeParallaxInView) return;
        if (!boendeParallaxRaf) boendeParallaxRaf = requestAnimationFrame(() => boendePaintParallax(false));
      }
      if ("IntersectionObserver" in window) {
        const watchPlay = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            boendeSeen = entry.isIntersecting && entry.intersectionRatio >= 0.5;
            if (!reduced && boendeSeen && boendeAuto && !boendeHold) boendeStart();
            else if (!boendeSeen && boendeMode === "playing") { boendePauseAll(); boendeMode = "paused"; boendeIcons("paused"); }
          });
        }, { threshold: [0, 0.5, 1] });
        watchPlay.observe(boende);
        const watchParallax = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            boendeParallaxInView = entry.isIntersecting;
            if (boendeParallaxInView) boendeRequestParallax();
          });
        }, { rootMargin: "20% 0px", threshold: [0, 0.01, 1] });
        watchParallax.observe(boende);
      } else {
        boendeParallaxInView = true;
      }
      addEventListener("scroll", () => {
        boendeRequestParallax();
        if (boendeMode === "end" || !boendeAuto || boendeHold || reduced) return;
        if (boendeVisible() && boendeVideo.paused) boendeStart();
      }, { passive: true });
      addEventListener("resize", () => {
        boendeCacheParallax();
        boendePaintParallax(true);
      });
      boendeNarrow.addEventListener("change", () => {
        boendeCacheParallax();
        boendePaintParallax(true);
      });
      boendeCacheParallax();
      boendePaint(0);
      boendeIcons(boendeReduced ? "still" : "paused");
      boendePaintParallax(true);
      } catch (error) { console.error("boende", error); }
  }

  initStacks();
  /* ---- videokort (läge 1/2) + modal (td index ~6943–7010, OG: lokal mp4 i stället för YouTube) ---- */
  function initVideokort() {
    try {
      const card = document.querySelector(".td-videokort");
      const dlg = document.getElementById("td-videomodal");
      if (!card || !dlg) return;
      /* Vinter: familjefilmen. Sommar: kundens parfilm (Par 16x9 utan grafik), 15 s båda. */
      const FILMS = {
        winter: { src: card.dataset.src, title: "[En vinterdag i Orsa Grönklitt]" },
        summer: { src: "./assets/video/summer.web.mp4", title: "[En sommardag i Orsa Grönklitt]" }
      };
      let src = card.dataset.src;
      const media = card.querySelector(".td-videokort-media");
      const frame = dlg.querySelector(".td-videomodal-frame");
      const titleEl = card.querySelector(".td-heading-xs");
      let bg = null;
      const applySeason = (season = document.documentElement.dataset.season) => {
        const film = season === "summer" ? FILMS.summer : FILMS.winter;
        if (titleEl) titleEl.textContent = film.title;
        card.setAttribute("aria-label", `Spela filmen ${film.title}`);
        if (film.src === src) return;
        src = film.src;
        if (bg) {
          bg.src = src;
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches) bg.play().catch(() => {});
        }
      };
      applySeason();
      document.addEventListener("og-season", (event) => applySeason(event.detail));
      const mountBg = () => {
        if (bg || getComputedStyle(card).display === "none") return;
        bg = document.createElement("video");
        Object.assign(bg, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "metadata", src });
        bg.setAttribute("aria-hidden", "true");
        media.append(bg);
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) bg.play().catch(() => {});
      };
      mountBg();
      new MutationObserver(() => setTimeout(mountBg, 50)).observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
      card.addEventListener("click", () => {
        frame.innerHTML = "";
        const v = document.createElement("video");
        Object.assign(v, { controls: true, autoplay: true, playsInline: true, src });
        frame.append(v);
        bg?.pause();
        dlg.showModal();
        v.play().catch(() => {});
      });
      const shut = () => { if (dlg.open) dlg.close(); };
      dlg.querySelector(".td-videomodal-x").addEventListener("click", shut);
      dlg.addEventListener("click", (event) => { if (event.target === dlg) shut(); });
      dlg.addEventListener("close", () => {
        frame.innerHTML = "";
        bg?.play().catch(() => {});
        card.focus();
      });
    } catch (error) { console.error("videokort", error); }
  }

  initSeasonAndEnDag();
  initVideokort();
  initJustNu();
  initFragaModal();
  initBoende();
}
