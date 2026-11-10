/* Rotera Just nu-stacken: ett kort + 24 px, var 5:e sekund.
   Pausa vid hover och när fliken är dold. Ingen rotation vid reduced motion. */

const STEP = 214 + 24;
const INTERVAL = 5000;

export function initJustNuStack(root) {
  const track = root.querySelector(".td-just-nu-stack-track");
  const dots = [...root.querySelectorAll(".td-just-nu-pager-dot")];
  const cards = () => [...track.children];
  if (!track || cards().length < 2) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = 0;
  let paused = false;
  let moving = false;

  function setDot(i) {
    dots.forEach((dot, n) => {
      if (n === i) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function advance() {
    if (moving) return;
    moving = true;
    const first = cards()[0];
    const count = cards().length;
    const horizontal = window.matchMedia("(max-width: 1023px)").matches;
    const delta = horizontal ? first.getBoundingClientRect().width + 16 : STEP;
    const axis = horizontal ? "X" : "Y";
    track.classList.remove("is-instant");
    track.style.transform = `translate${axis}(-${delta}px)`;
    const done = () => {
      track.removeEventListener("transitionend", done);
      moving = false;
      track.classList.add("is-instant");
      track.append(first);
      track.style.transform = "translate3d(0, 0, 0)";
      index = (index + 1) % count;
      setDot(index);
    };
    if (reduced) {
      done();
      return;
    }
    track.addEventListener("transitionend", done);
  }

  function start() {
    if (reduced || paused || timer || root.hidden) return;
    timer = window.setInterval(() => {
      if (root.hidden || document.hidden || paused) return;
      advance();
    }, INTERVAL);
  }

  function stop() {
    window.clearInterval(timer);
    timer = 0;
  }

  root.addEventListener("mouseenter", () => {
    paused = true;
    stop();
  });
  root.addEventListener("mouseleave", () => {
    paused = false;
    start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  track.addEventListener("click", (event) => {
    if (!event.target.closest(".td-just-nu-data")) return;
    advance();
    stop();
    start();
  });

  const order = [...track.children];

  function cardLabel(card) {
    const title = card.querySelector(".td-ui-title")?.textContent.trim() ?? "";
    const values = [...card.querySelectorAll(".td-just-nu-data-value")].map((value) => value.textContent.replace(/\s+/g, " ").trim());
    return [title, ...values].filter(Boolean).join(", ");
  }

  function labelControls() {
    order.forEach((card, n) => {
      const label = cardLabel(card);
      card.setAttribute("aria-label", label);
      const dot = dots[n];
      if (!dot) return;
      dot.setAttribute("role", "button");
      dot.tabIndex = 0;
      dot.setAttribute("aria-label", label);
    });
  }

  function show(i) {
    const count = order.length;
    const next = ((i % count) + count) % count;
    track.classList.add("is-instant");
    track.replaceChildren(...order.slice(next), ...order.slice(0, next));
    track.style.transform = "translate3d(0, 0, 0)";
    index = next;
    setDot(index);
    labelControls();
  }

  root.tabIndex = 0;
  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
    show(index + (back ? -1 : 1));
  });
  dots.forEach((dot, n) => {
    dot.addEventListener("click", () => show(n));
    dot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      show(n);
    });
  });
  root.addEventListener("just-nu-reset", () => show(0));
  root.addEventListener("just-nu-label", labelControls);

  labelControls();
  setDot(0);
  start();
}
