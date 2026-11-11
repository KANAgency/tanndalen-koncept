/* Start-page intro. One film: the hero card video, never moved. */

const TANNDALEN_HOLD_MS = 1100; /* was HOLD_A 600; +500ms on the word, not the fade */
const GROW = 900; /* ms symbol growth */
const HOLD_B = 450; /* ms before typing */
const ZOOM_START = 0.1; /* × viewport height */
const ZOOM_LEN = 0.6;
const HOLD_LEN = 0.5;
const FOLLOW_TAU = 0.14; /* seconds, time constant of the displayed zoom follow */
const DT_MAX = 50; /* ms, a stalled frame cannot jump the follow */
const SNAP = 0.0005; /* displayed p snaps to raw p inside this gap */
const REVEAL_P = 0.97; /* entrance may start only from here */
const EDGE_P = 0.92; /* the last symbol edge must have left the card by here */
const CARD_MARGIN = 0.12; /* extra card margin the hole must cover */
const TEXT_LIFT = 80; /* px, #intro-copy higher than the previous build */
const TEXT_DOWN = 28; /* px, extra drop of the typed line */
const COPY_Y = { 1440: 577, 393: 546 }; /* measured in the previous build, state B */
const SEEN = "td-startsida-seen";

const GROW_EASE = [0.22, 1, 0.36, 1];
const FADE_EASE = [0, 0, 0.58, 1];

function bezier([x1, y1, x2, y2]) {
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const mt = 1 - t;
      const xt = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
      const dx = 3 * mt * mt * x1 + 6 * mt * t * (x2 - x1) + 3 * t * t * (1 - x2);
      if (Math.abs(xt - x) < 1e-4) break;
      if (dx) t = Math.min(1, Math.max(0, t - (xt - x) / dx));
    }
    const mt = 1 - t;
    return 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
  };
}

const growEase = bezier(GROW_EASE);

function smootherstep(p) {
  const x = Math.min(1, Math.max(0, p));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function seasonLine() {
  return document.documentElement.dataset.season === "summer"
    ? "Älskat av fjällvandrare."
    : "Älskat av skidåkare.";
}

export function init() {
  const root = document.documentElement;
  const lock = document.getElementById("intro-lock");
  const runway = document.getElementById("intro-runway");
  const stage = document.getElementById("stage");
  const plate = document.getElementById("intro-plate");
  const platePath = document.getElementById("intro-plate-path");
  const fill = document.getElementById("intro-fill");
  const zoom = document.getElementById("intro-zoom");
  const word = document.getElementById("intro-word");
  const copy = document.getElementById("intro-copy");
  const skip = document.getElementById("intro-scroll");
  const card = document.querySelector(".hero-frame");
  const heading = document.getElementById("hero-heading");
  const video = document.querySelector(".hero-media");
  const page = document.querySelector(".page");
  if (!lock || !runway || !stage) return;

  document.body.classList.add("is-landed");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const returning = root.classList.contains("is-returning") || reduced;
  if (returning) {
    lock.remove();
    skip.remove();
    runway.style.height = "auto";
    root.classList.add("is-intro-done");
    return;
  }

  video?.play().catch(() => {});

  let introDone = false;
  let revealed = false;
  let origin = [innerWidth / 2, innerHeight / 2];
  let logoCenter = [innerWidth / 2, innerHeight / 2];
  let sMax = 8;
  let symbolPath = null;
  let phase = 0;
  let displayed = 0;
  let warned = false;
  const t0 = performance.now();

  function placeZoom(scale, ox, oy, tx, ty) {
    zoom.style.transform = "";
    const x = ox * (1 - scale) + tx;
    const y = oy * (1 - scale) + ty;
    zoom.setAttribute("transform", `matrix(${scale} 0 0 ${scale} ${x} ${y})`);
  }

  function markSeen() {
    if (introDone) return;
    const aktuellt = document.querySelector(".td-aktuellt");
    const before = aktuellt ? aktuellt.getBoundingClientRect().top : 0;
    introDone = true;
    root.classList.add("is-intro-done", "is-intro-reveal");
    root.style.setProperty("--intro-extra", "0px");
    runway.style.height = "auto";
    runway.dataset.extra = "0";
    const quote = document.querySelector("blockquote.quote");
    if (quote) quote.style.top = "";
    if (aktuellt) {
      const shift = before - aktuellt.getBoundingClientRect().top;
      if (shift > 1) scrollTo(0, Math.max(0, scrollY - shift));
    }
    lock.style.visibility = "hidden";
    lock.style.display = "none";
    skip.hidden = true;
    try { localStorage.setItem(SEEN, "1"); } catch (error) {}
  }

  function subpaths(d) {
    return d.split(/(?=M)/).filter(Boolean).map((part) => {
      const nums = part.match(/-?\d*\.?\d+/g).map(Number);
      let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
      for (let i = 0; i < nums.length; i += 2) {
        minX = Math.min(minX, nums[i]);
        maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]);
        maxY = Math.max(maxY, nums[i + 1]);
      }
      return { d: part, minX, minY, maxX, maxY };
    });
  }

  async function loadLogo() {
    const text = await fetch("assets/brand/logo-vertical-black.svg").then((r) => r.text());
    const d = new DOMParser().parseFromString(text, "image/svg+xml").querySelector("path").getAttribute("d");
    const parts = subpaths(d);
    const symbol = parts.filter((p) => p.maxY < 60);
    const right = symbol.slice().sort((a, b) => b.minX - a.minX)[0];
    symbolPath = symbol.map((p) => p.d).join("");
    return { d, symbol: symbolPath, right };
  }

  function layout(symbolD, right) {
    const w = innerWidth;
    const h = innerHeight;
    const bW = w * (parseFloat(getComputedStyle(root).getPropertyValue("--intro-b-symbol-w")) || 26) / 100;
    const aW = w * (parseFloat(getComputedStyle(root).getPropertyValue("--intro-a-symbol-w")) || 15) / 100;
    const nums = symbolD.match(/-?\d*\.?\d+/g).map(Number);
    let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
    for (let i = 0; i < nums.length; i += 2) {
      minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
    }
    const sw = maxX - minX;
    const sh = maxY - minY;
    const bh = bW * (sh / sw);
    const cx = w * 0.5;
    const cy = h * 0.42;
    const left = cx - bW / 2;
    const top = cy - bh / 2;
    const map = (x, y) => [left + (x - minX) / sw * bW, top + (y - minY) / sh * bh];
    const draw = (d) => d.split(/(?=M)/).filter(Boolean).map((part) => {
      const n = part.match(/-?\d*\.?\d+/g).map(Number);
      let out = "M";
      for (let i = 0; i < n.length; i += 2) {
        const [px, py] = map(n[i], n[i + 1]);
        out += `${i ? "L" : ""}${px.toFixed(2)} ${py.toFixed(2)}`;
      }
      return `${out}Z`;
    }).join("");
    const drawn = draw(symbolD);
    plate.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const plateLeft = cx - w * 3.5;
    const plateTop = cy - h * 3.5;
    platePath.setAttribute("d", `M${plateLeft.toFixed(2)} ${plateTop.toFixed(2)}H${(cx + w * 3.5).toFixed(2)}V${(cy + h * 3.5).toFixed(2)}H${plateLeft.toFixed(2)}Z${drawn}`);
    fill.setAttribute("d", drawn);
    if (!layout.checker) {
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;pointer-events:none";
      layout.checker = document.createElementNS("http://www.w3.org/2000/svg", "path");
      probe.append(layout.checker);
      lock.append(probe);
    }
    layout.checker.setAttribute("d", symbolD);
    logoCenter = [cx, cy];
    const rb = right;
    let best = null;
    let bestD = Infinity;
    const corner = [rb.minX + (rb.maxX - rb.minX) * 0.2, rb.minY + (rb.maxY - rb.minY) * 0.25];
    const steps = 28;
    for (let iy = 0; iy <= steps; iy++) {
      for (let ix = 0; ix <= steps; ix++) {
        const x = rb.minX + (ix / steps) * (rb.maxX - rb.minX);
        const y = rb.minY + (iy / steps) * (rb.maxY - rb.minY);
        if (!layout.checker.isPointInFill(new DOMPoint(x, y))) continue;
        const dist = (x - corner[0]) ** 2 + (y - corner[1]) ** 2;
        if (dist < bestD) { bestD = dist; best = [x, y]; }
      }
    }
    if (!best) {
      best = [(minX + maxX) / 2, (minY + maxY) / 2];
      if (!warned) { console.warn("intro origin fallback: symbol centre"); warned = true; }
    }
    origin = map(best[0], best[1]);
    lock.dataset.origin = `${origin[0].toFixed(1)} ${origin[1].toFixed(1)}`;
    lock.dataset.originSvg = `${best[0].toFixed(1)} ${best[1].toFixed(1)}`;
    const rect = card.getBoundingClientRect();
    const pointsOf = (box) => {
      const list = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        list.push(
          [box.left + box.width * t, box.top],
          [box.left + box.width * t, box.bottom],
          [box.left, box.top + box.height * t],
          [box.right, box.top + box.height * t],
        );
      }
      return list;
    };
    const covers = (samples, s) => samples.every(([x, y]) => fill.isPointInFill(new DOMPoint(
      origin[0] + (x - origin[0]) / s,
      origin[1] + (y - origin[1]) / s,
    )));
    const smallest = (samples) => {
      let lo = 1;
      let hi = 80;
      if (!covers(samples, hi)) hi = 400;
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        if (covers(samples, mid)) hi = mid;
        else lo = mid;
      }
      return hi;
    };
    const cardPts = pointsOf(rect);
    const marginBox = {
      left: rect.left - rect.width * CARD_MARGIN,
      top: rect.top - rect.height * CARD_MARGIN,
      right: rect.right + rect.width * CARD_MARGIN,
      bottom: rect.bottom + rect.height * CARD_MARGIN,
      width: rect.width * (1 + CARD_MARGIN * 2),
      height: rect.height * (1 + CARD_MARGIN * 2),
    };
    const sCard = smallest(cardPts);
    const sMargin = smallest(pointsOf(marginBox));
    const eEdge = smootherstep(EDGE_P);
    sMax = Math.max(sMargin, sCard ** (1 / eEdge));
    let leave = 1;
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      if (sMax ** smootherstep(p) >= sCard) { leave = p; break; }
    }
    lock.dataset.sMax = sMax.toFixed(2);
    lock.dataset.pLeave = leave.toFixed(3);
    lock.dataset.covered = covers(pointsOf(marginBox), sMax) ? "1" : "0";
  }

  function applyGrow(u, t) {
    const a = (parseFloat(getComputedStyle(root).getPropertyValue("--intro-a-symbol-w")) || 15) / (parseFloat(getComputedStyle(root).getPropertyValue("--intro-b-symbol-w")) || 26);
    const scale = a + (1 - a) * u;
    const gx = (1 - u) * (innerWidth * 0.5 - logoCenter[0]);
    const gy = (1 - u) * (innerHeight * 0.48 - logoCenter[1]);
    placeZoom(scale, logoCenter[0], logoCenter[1], gx, gy);
    const fade = Math.min(1, t / 0.25);
    word.style.opacity = t <= 0 ? "1" : t >= 0.25 ? "0" : String(1 - fade);
    if (!lock.dataset.wordAt100 && t >= 100 / GROW) lock.dataset.wordAt100 = word.style.opacity;
    fill.style.opacity = t <= 0.3 ? "1" : t >= 0.8 ? "0" : String(1 - (t - 0.3) / 0.5);
    lock.dataset.growT = String(t);
    const sym = fill.getBoundingClientRect();
    const gap = 24;
    if (t === 0) word.style.top = `${sym.bottom + gap}px`;
    const key = innerWidth <= 500 ? 393 : 1440;
    const wanted = (COPY_Y[key] || 577) - TEXT_LIFT;
    const minTop = sym.bottom + gap;
    copy.style.top = `${Math.max(wanted, minTop) + TEXT_DOWN}px`;
  }

  function finishText() {
    phase = 1;
    applyGrow(1, 1);
    copy.textContent = seasonLine();
    copy.setAttribute("aria-label", `Tänndalen. ${seasonLine()}`);
    lock.dataset.typed = "1";
  }

  function typeLine() {
    const text = seasonLine();
    copy.textContent = "";
    copy.setAttribute("aria-label", `Tänndalen. ${text}`);
    const gaps = [];
    for (let i = 0; i < text.length; i++) {
      let wait = 25 + Math.floor(Math.random() * 61);
      if (i > 0 && text[i - 1] === " ") wait += 80 + Math.floor(Math.random() * 91);
      if (text[i] === ".") wait += 150;
      gaps.push(Math.max(1, Math.round(wait * 0.8))); /* 20% faster than the base gaps */
    }
    lock.dataset.typeMs = String(gaps.reduce((a, b) => a + b, 0));
    const started = performance.now();
    let i = 0;
    const step = () => {
      if (lock.dataset.typed === "1") return;
      copy.textContent += text[i];
      i += 1;
      if (i < text.length) setTimeout(step, gaps[i] || 40);
      else {
        lock.dataset.typed = "1";
        lock.dataset.typedMs = String(Math.round(performance.now() - started));
      }
    };
    setTimeout(step, gaps[0] || 40);
  }

  function splitLines() {
    const p = document.querySelector(".statement");
    if (!p || p.dataset.split === "1") return;
    const text = p.textContent;
    p.dataset.split = "1";
    const words = text.split(/(\s+)/);
    p.textContent = "";
    const spans = words.map((word) => {
      const s = document.createElement("span");
      s.textContent = word;
      p.append(s);
      return s;
    });
    const lines = [];
    let current = [];
    let last = null;
    spans.forEach((s) => {
      const top = s.getBoundingClientRect().top;
      if (last !== null && Math.abs(top - last) > 2 && s.textContent.trim()) {
        lines.push(current);
        current = [];
      }
      current.push(s);
      if (s.textContent.trim()) last = top;
    });
    if (current.length) lines.push(current);
    p.textContent = "";
    lines.forEach((line, index) => {
      const row = document.createElement("span");
      row.className = "intro-line";
      row.style.animationDelay = `${200 + index * 80}ms`;
      line.forEach((s) => row.append(s.textContent));
      p.append(row);
    });
    lock.dataset.lines = String(lines.length);
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    splitLines();
    root.classList.add("is-intro-reveal");
    lock.style.visibility = "hidden";
    lock.dataset.revealedAt = String(Math.round(performance.now() - t0));
  }

  function maskHold() {
    return Math.min(320, Math.max(220, innerHeight * 0.3));
  }

  function sizeRunway() {
    const end = innerHeight * (ZOOM_START + ZOOM_LEN + HOLD_LEN);
    const extra = Math.max(innerHeight * (ZOOM_LEN + HOLD_LEN), end - runway.offsetTop) + maskHold();
    runway.style.height = `${stage.offsetHeight + extra}px`;
    runway.dataset.extra = String(Math.round(extra));
    runway.dataset.maskHold = String(Math.round(maskHold()));
    runway.dataset.release = String(Math.round(runway.offsetTop + extra));
  }

  let gateOn = false;
  let gateUsed = false;
  let gateOff = () => {};
  function releaseGate() {
    gateOn = false;
    gateOff();
    gateOff = () => {};
  }
  function armGate() {
    if (gateUsed || reduced) return;
    gateUsed = true;
    gateOn = true;
    const zoomEnd = innerHeight * (ZOOM_START + ZOOM_LEN);
    const cap = zoomEnd + maskHold();
    if (scrollY > cap) scrollTo(0, cap);
    const onWheel = (event) => { if (event.deltaY > 0) event.preventDefault(); };
    let touchY = 0;
    const onTouchStart = (event) => { touchY = event.touches[0]?.clientY || 0; };
    const onTouch = (event) => {
      const y = event.touches[0]?.clientY || 0;
      if (y < touchY) event.preventDefault();
      touchY = y;
    };
    const onKey = (event) => {
      if (event.key === "Escape") { releaseGate(); return; }
      if (event.key === "PageDown" || event.key === " " || event.key === "ArrowDown" || event.key === "End") event.preventDefault();
    };
    const onScroll = () => { if (scrollY > cap) scrollTo(0, cap); };
    try {
      addEventListener("wheel", onWheel, { passive: false });
      addEventListener("touchstart", onTouchStart, { passive: true });
      addEventListener("touchmove", onTouch, { passive: false });
      addEventListener("keydown", onKey);
      addEventListener("scroll", onScroll, { passive: true });
      gateOff = () => {
        removeEventListener("wheel", onWheel);
        removeEventListener("touchstart", onTouchStart);
        removeEventListener("touchmove", onTouch);
        removeEventListener("keydown", onKey);
        removeEventListener("scroll", onScroll);
      };
      setTimeout(releaseGate, 650);
    } catch (error) {
      releaseGate();
    }
  }

  function rawP() {
    const start = innerHeight * ZOOM_START;
    const length = innerHeight * ZOOM_LEN;
    return Math.min(1, Math.max(0, (scrollY - start) / length));
  }

  let last = performance.now();
  function frame(now) {
    if (introDone) return;
    const dt = Math.min(DT_MAX, now - last);
    last = now;
    const elapsed = now - t0;
    if (phase < 1) {
      if (scrollY > 0) finishText();
      else if (elapsed < TANNDALEN_HOLD_MS) applyGrow(0, 0);
      else if (elapsed < TANNDALEN_HOLD_MS + GROW) {
        const t = (elapsed - TANNDALEN_HOLD_MS) / GROW;
        applyGrow(growEase(t), t);
      } else if (!lock.dataset.held) {
        phase = 1;
        applyGrow(1, 1);
        lock.dataset.held = "1";
        lock.dataset.growEnd = String(Math.round(elapsed));
        setTimeout(() => {
          lock.dataset.typeStart = String(Math.round(performance.now() - t0));
          if (lock.dataset.typed !== "1") typeLine();
        }, HOLD_B);
      }
    }
    const raw = phase >= 1 ? rawP() : 0;
    if (raw > 0 && lock.dataset.typed !== "1") finishText();
    const zoomEnd = innerHeight * (ZOOM_START + ZOOM_LEN);
    if (scrollY >= zoomEnd) armGate();
    if (scrollY >= zoomEnd - 1) displayed = 1;
    else {
      const alpha = 1 - Math.exp(-(dt / 1000) / FOLLOW_TAU);
      displayed += (raw - displayed) * alpha;
      if (Math.abs(displayed - raw) < SNAP) displayed = raw;
    }
    copy.style.opacity = raw > 0 ? "0" : "";
    if (phase >= 1) {
      const e = smootherstep(displayed);
      const s = sMax ** e;
      placeZoom(s, origin[0], origin[1], 0, 0);
      lock.dataset.zoomS = String(s);
    }
    lock.dataset.zoomP = String(raw);
    lock.dataset.zoomShown = String(displayed);
    if (!lock.dataset.firstScroll && raw > 0) lock.dataset.firstScroll = String(Math.round(now - t0));
    if (!revealed && displayed >= REVEAL_P && lock.dataset.covered === "1") {
      lock.dataset.reached = String(Math.round(scrollY));
      lock.dataset.reachedAt = String(Math.round(now));
      reveal();
    }
    const release = Number(runway.dataset.release) || innerHeight;
    if (scrollY >= release - 1) markSeen();
    if (!introDone) requestAnimationFrame(frame);
  }

  function hideSkip() {
    if (root.classList.contains("is-skip-gone")) return;
    root.classList.add("is-skip-gone");
    if (document.activeElement === skip) heading.focus({ preventScroll: true });
    setTimeout(() => { skip.hidden = true; }, 200);
  }
  addEventListener("wheel", (event) => {
    if (gateUsed || event.deltaY <= 0) return;
    const zoomEnd = innerHeight * (ZOOM_START + ZOOM_LEN);
    if (scrollY + event.deltaY < zoomEnd) return;
    event.preventDefault();
    const cap = zoomEnd + maskHold();
    if (scrollY < cap) scrollTo(0, cap);
    armGate();
  }, { passive: false });
  addEventListener("scroll", () => { if (scrollY > 4) hideSkip(); }, { passive: true });
  addEventListener("wheel", () => hideSkip(), { passive: true });
  addEventListener("touchmove", () => hideSkip(), { passive: true });
  addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " " || event.key === "End") hideSkip();
  });

  skip.addEventListener("click", () => {
    releaseGate();
    finishText();
    reveal();
    markSeen();
    runway.style.height = "auto";
    scrollTo({ top: 0, left: 0, behavior: "instant" });
    heading.focus({ preventScroll: true });
  });

  function failIntro(error) {
    try { releaseGate(); } catch (ignore) {}
    console.error("intro", error);
    root.classList.remove("is-intro-ready");
    root.classList.add("is-intro-done", "is-intro-reveal");
    lock.style.visibility = "hidden";
  }

  loadLogo().then(({ symbol, right }) => {
    layout(symbol, right);
    sizeRunway();
    applyGrow(0, 0);
    addEventListener("resize", () => { layout(symbol, right); if (!introDone) sizeRunway(); });
    requestAnimationFrame(frame);
    root.classList.add("is-intro-ready");
  }).catch(failIntro);
}

init();
