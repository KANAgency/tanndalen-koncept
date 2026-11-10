/**
 * OG base — menu open/close, Escape, focus trap, focus return.
 * Storage prefix remains og-* (handled elsewhere). Idempotent.
 */
(function initOgBase() {
  const menu = document.getElementById("site-menu");
  const menuPanel = document.getElementById("site-menu-panel");
  const menuControl = document.querySelector(".menu-control");
  const menuClose = document.querySelector("[data-og-menu-close]");
  if (!menu || !menuPanel || !menuControl) return;
  if (menu.dataset.ogBaseBound === "1") return;
  menu.dataset.ogBaseBound = "1";

  let open = false;

  function focusables() {
    return [...menuPanel.querySelectorAll("a, button, input, [tabindex]:not([tabindex='-1'])")].filter(
      (el) => !el.closest("[inert]") && !el.hidden && el.getAttribute("aria-hidden") !== "true"
    );
  }

  function setOpen(next) {
    open = next;
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuControl.setAttribute("aria-expanded", open ? "true" : "false");
    menuControl.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
    if (open) {
      menu.inert = false;
      const first = focusables()[0] || menuClose || menuPanel;
      first?.focus?.();
    } else {
      menuControl.focus();
      window.setTimeout(() => {
        if (!open) menu.inert = true;
      }, 0);
    }
  }

  menuControl.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setOpen(!open);
  });

  menuClose?.addEventListener("click", (event) => {
    event.preventDefault();
    setOpen(false);
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
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
    },
    true
  );

  menuPanel.addEventListener("click", (event) => {
    const chevron = event.target.closest(".site-menu-chevron");
    if (!chevron) return;
    const item = chevron.closest(".site-menu-item");
    if (!item) return;
    const sub = item.querySelector(".site-menu-sub");
    const clip = item.querySelector(".site-menu-sub-clip");
    if (!sub || !clip) return;
    const willOpen = !sub.classList.contains("is-open");
    menuPanel.querySelectorAll(".site-menu-sub.is-open").forEach((other) => {
      other.classList.remove("is-open");
      const otherClip = other.querySelector(".site-menu-sub-clip");
      if (otherClip) otherClip.inert = true;
      other.parentElement?.querySelector(".site-menu-chevron")?.setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      sub.classList.add("is-open");
      clip.inert = false;
      chevron.setAttribute("aria-expanded", "true");
    } else {
      sub.classList.remove("is-open");
      clip.inert = true;
      chevron.setAttribute("aria-expanded", "false");
    }
  });

  menuPanel.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    setOpen(false);
  });
})();
