/* Lev. Andas. Tänndalen. – scrollstyrd sekvens: ram -> bild -> text, sist öppnas ramen */
(function () {
  const root = document.getElementById("td-brand");
  if (!root) return;
  const frame = root.querySelector(".td-brand-frame");
  const imgs = [...root.querySelectorAll(".td-brand-img")];
  const words = [...root.querySelectorAll(".td-brand-word")];
  const sign = root.querySelector(".td-brand-sign");
  const COLORS = ["#A1B5BA", "#BF6A15", "#1B4021"];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  words.forEach((w) => {
    const t = w.textContent;
    w.setAttribute("aria-label", t);
    w.innerHTML = [...t].map((c) => `<span aria-hidden="true">${c === " " ? "&nbsp;" : c}</span>`).join("");
  });

  const clamp = (x) => Math.min(1, Math.max(0, x));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };

  function setWord(w, inT, outT) {
    const spans = w.children, n = spans.length;
    for (let i = 0; i < n; i++) {
      const st = 0.5 / n;
      const a = ease(clamp((inT - i * st) / 0.5));
      const o = ease(clamp((outT - i * st * 0.6) / 0.5));
      spans[i].style.opacity = String(a * (1 - o));
      spans[i].style.transform = `translateY(${(1 - a) * 0.35 - o * 0.3}em)`;
    }
  }

  /* Tidslinje (p 0..1 över runway):
     Kortare runway (300vh) och längre byten = mindre "död" scroll mellan händelserna.
     0.00–0.10 Lev. in | 0.18–0.40 byte till Andas. | 0.48–0.70 byte till Tänndalen | 0.72–0.88 ramen öppnas + avsändare */
  const SWAPS = [0.18, 0.48];
  const SWAP_LEN = 0.22;

  function paint() {
    const r = root.getBoundingClientRect();
    const pin = root.firstElementChild;
    const run = r.height - pin.offsetHeight;
    const p = clamp(-r.top / run);
    const vw = pin.clientWidth, vh = pin.clientHeight;

    const open = ease(seg(p, 0.72, 0.88));
    /* bildens storlek; ramarna (46 färg + 23 svart per sida) läggs utanpå */
    const R = 46 * 1.5 * 2;
    const w0 = Math.min(1180, vw - R - 120), h0 = Math.min(w0 * 0.67, vh - R - 80);
    frame.style.setProperty("--brand-w", `${w0 + (vw - w0) * open}px`);
    frame.style.setProperty("--brand-h", `${h0 + (vh - h0) * open}px`);
    frame.style.setProperty("--brand-pad", `${46 * (1 - open)}px`);

    let color = COLORS[0];
    SWAPS.forEach((s, i) => {
      const t = seg(p, s, s + SWAP_LEN);
      const c = ease(seg(t, 0, 0.4));
      if (t > 0) color = mix(COLORS[i], COLORS[i + 1], c);
      imgs[i + 1].style.setProperty("--clip", `${(1 - ease(seg(t, 0.15, 0.75))) * 100}%`);
    });
    frame.style.setProperty("--brand-frame", color);

    imgs.forEach((im, i) => {
      const start = i === 0 ? 0 : SWAPS[i - 1];
      const end = i === 2 ? 1 : SWAPS[i] + SWAP_LEN;
      const local = seg(p, start, end);
      const img = im.firstElementChild;
      img.style.setProperty("--py", `${(local - 0.5) * -8}%`);
      img.style.setProperty("--ps", String(1.06 - 0.06 * local));
    });

    const t1 = seg(p, SWAPS[0], SWAPS[0] + SWAP_LEN);
    const t2 = seg(p, SWAPS[1], SWAPS[1] + SWAP_LEN);
    setWord(words[0], seg(p, 0, 0.10) * 2, seg(t1, 0, 0.4) * 2);
    setWord(words[1], seg(t1, 0.5, 1) * 2, seg(t2, 0, 0.4) * 2);

    const s = ease(seg(p, 0.80, 0.94));
    sign.style.setProperty("--sign-o", String(s));
    sign.style.setProperty("--sign-y", `${(1 - s) * 24}px`);
    sign.classList.toggle("is-on", s > 0.5);
  }

  if (reduced) {
    words.forEach((w) => setWord(w, 1, 0));
    return;
  }
  let raf = 0;
  const req = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); }); };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
  paint();
})();
