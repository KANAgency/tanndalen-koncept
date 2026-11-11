export function initSegmented(root) {
  if (root.dataset.segmented) return;
  root.dataset.segmented = "true";
  const thumb = document.createElement("span");
  thumb.className = "td-segmented-thumb";
  thumb.setAttribute("aria-hidden", "true");
  root.prepend(thumb);
  const buttons = () => [...root.querySelectorAll("button")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  function measure(button) {
    const rootBox = root.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    return {
      left: box.left - rootBox.left,
      right: rootBox.right - box.right
    };
  }

  function paintLabels() {
    const rootBox = root.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const pressed = current();
    const rest = pressed ? measure(pressed) : null;
    const restWidth = rest ? rootBox.width - rest.left - rest.right : thumbBox.width;
    const stretch = restWidth > 0 ? Math.max(0, thumbBox.width / restWidth - 1) : 0;
    const inset = reduced.matches ? 0 : Math.min(5, stretch * 10);
    root.style.setProperty("--inset-y", `${inset}px`);
    const mid = (thumbBox.left + thumbBox.right) / 2 - rootBox.left;
    const items = buttons().map((button) => {
      const box = button.getBoundingClientRect();
      return { button, left: box.left - rootBox.left, right: box.right - rootBox.left };
    });
    items.forEach((item, index) => {
      const start = index === 0 ? -Infinity : (items[index - 1].right + item.left) / 2;
      const end = index === items.length - 1 ? Infinity : (item.right + items[index + 1].left) / 2;
      item.button.dataset.covered = mid >= start && mid < end ? "true" : "false";
    });
  }

  let frame = 0;
  function track() {
    cancelAnimationFrame(frame);
    const start = performance.now();
    const step = (now) => {
      paintLabels();
      if (now - start < 420) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  function apply(button, animate) {
    const next = measure(button);
    const currentLeft = parseFloat(getComputedStyle(thumb).left);
    const currentRight = parseFloat(getComputedStyle(thumb).right);
    thumb.style.transition = "none";
    root.style.setProperty("--left", `${currentLeft}px`);
    root.style.setProperty("--right", `${currentRight}px`);
    thumb.offsetWidth;
    const skip = !animate || reduced.matches || Number.isNaN(currentLeft);
    if (skip) {
      root.style.setProperty("--left", `${next.left}px`);
      root.style.setProperty("--right", `${next.right}px`);
      thumb.offsetWidth;
      thumb.style.transition = "";
      paintLabels();
      return;
    }
    thumb.classList.toggle("is-move-right", next.left > currentLeft);
    thumb.classList.toggle("is-move-left", next.left <= currentLeft);
    thumb.style.transition = "";
    root.style.setProperty("--left", `${next.left}px`);
    root.style.setProperty("--right", `${next.right}px`);
    track();
  }

  const current = () => buttons().find((button) => button.getAttribute("aria-pressed") === "true") || buttons()[0];
  apply(current(), false);
  const observer = new MutationObserver(() => apply(current(), true));
  buttons().forEach((button) => observer.observe(button, { attributes: true, attributeFilter: ["aria-pressed"] }));
  addEventListener("resize", () => apply(current(), false));
}
