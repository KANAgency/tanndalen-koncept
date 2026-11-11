OG hero-test — fog bank images
===============================

Drop files here (WebP preferred, AVIF also fine if you update the .src
extension in hero-test-config.js):

  fog-1.webp   Bank 1 — large dense bank, bottom-left (heaviest)
  fog-2.webp   Bank 2 — thin wisp, mid-right, starts a bit later
  fog-3.webp   Bank 3 — smaller patch, center-left
  fog-4.webp   Bank 4 — optional; enable with fogBanks[3].enabled = true

Image requirements
------------------
- Fog / mist painted in white (or light grey) on a PURE BLACK background.
- The page uses mix-blend-mode: screen, so black disappears and only the
  mist shows. Near-black edges are pushed to true black via CSS
  contrast/brightness (tunable per bank in hero-test-config.js).
- Soft, organic silhouettes work best; hard rectangles will still be
  feathered by a CSS mask on all four edges, but soft assets look better.
- Resolution: roughly 1600–2400 px on the long side is enough.

If a file is missing or fails to load, that bank falls back to a
procedural blurred radial blob — the page never breaks.

Config lives in:
  og/desktop/hero-test/hero-test-config.js  →  fogBanks[]
