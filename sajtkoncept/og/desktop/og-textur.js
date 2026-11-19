/*
 * Texturväljare för OG:s materialton (John 19 nov): fyra knappar nere till vänster,
 * Ingen | Papper 70 | Sandsten 65 | Läder 50. Valet sparas i localStorage ("og-textur").
 * Länk direkt till ett val: ?textur=ingen|papper|sandsten|lader. Dold med ?demo=0
 * (samma regel som lägesväljaren). Utan val gäller standarden i og-textur.css.
 *
 * Texturen genereras som SVG-brus med relief (feTurbulence + feDiffuseLighting),
 * kaklas sömlöst (stitchTiles) och blandas med soft-light: flat yta = 50 % grå = neutral,
 * så off-white-färgen ligger kvar.
 */
(function () {
  // t = turbulence|fractalNoise, f = baseFrequency, o = numOctaves, w = vikt. ss = relief, styrka 0–100.
  var PRESETS = {
    ingen: { label: "Ingen" },
    papper: { label: "Papper", styrka: 70, ss: 12, layers: [
      { t: "fractalNoise", f: "0.035", o: 4, w: 0.6 },
      { t: "fractalNoise", f: "0.7", o: 2, w: 0.4 } ] },
    sandsten: { label: "Sandsten", styrka: 65, ss: 8, layers: [
      { t: "fractalNoise", f: "0.55", o: 3, w: 0.65 },
      { t: "fractalNoise", f: "0.012", o: 3, w: 0.35 } ] },
    lader: { label: "Läder", styrka: 50, ss: 13, layers: [
      { t: "turbulence", f: "0.045", o: 3, w: 0.55 },
      { t: "fractalNoise", f: "0.5", o: 2, w: 0.45 } ] }
  };
  var TILE = 480;

  function svgFor(pr) {
    var s = Math.max(0, Math.min(1, pr.styrka / 100));
    var parts = [], names = [];
    pr.layers.forEach(function (l, i) {
      parts.push(
        '<feTurbulence type="' + l.t + '" baseFrequency="' + l.f + '" numOctaves="' + l.o +
        '" seed="' + (7 + i * 13) + '" stitchTiles="stitch" result="r' + i + '"/>' +
        '<feColorMatrix in="r' + i + '" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ' +
        l.w + ' 0 0 0 0" result="n' + i + '"/>'
      );
      names.push("n" + i);
    });
    var acc = names[0];
    for (var i = 1; i < names.length; i++) {
      parts.push('<feComposite in="' + acc + '" in2="' + names[i] + '" operator="arithmetic" k2="1" k3="1" result="a' + i + '"/>');
      acc = "a" + i;
    }
    var elev = 55, kd = (0.5 / Math.sin((elev * Math.PI) / 180)).toFixed(4);
    parts.push(
      '<feDiffuseLighting in="' + acc + '" surfaceScale="' + pr.ss + '" diffuseConstant="' + kd +
      '" lighting-color="#fff" result="lit"><feDistantLight azimuth="225" elevation="' + elev + '"/></feDiffuseLighting>' +
      '<feComponentTransfer in="lit">' +
      ["R", "G", "B"].map(function (c) {
        return '<feFunc' + c + ' type="linear" slope="' + s.toFixed(3) + '" intercept="' + (0.5 - 0.5 * s).toFixed(3) + '"/>';
      }).join("") +
      '<feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer>'
    );
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + TILE + '" height="' + TILE + '">' +
      '<filter id="t" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      parts.join("") + '</filter><rect width="100%" height="100%" filter="url(#t)"/></svg>';
  }

  var root = document.documentElement;
  var key = new URLSearchParams(location.search).get("textur");
  if (!PRESETS[key]) { try { key = localStorage.getItem("og-textur"); } catch (e) { key = null; } }
  if (!PRESETS[key]) key = null;

  function apply() {
    if (!key) { root.style.removeProperty("--og-textur"); delete root.dataset.ogTextur; return; }
    root.style.setProperty("--og-textur",
      key === "ingen" ? "none" : "url(\"data:image/svg+xml," + encodeURIComponent(svgFor(PRESETS[key])) + "\")");
    root.dataset.ogTextur = key;
  }
  apply();

  function panel() {
    if (root.dataset.demo === "0") return;
    var el = document.createElement("div");
    el.className = "og-textur-panel";
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", "Textur");
    el.innerHTML = Object.keys(PRESETS).map(function (k) {
      return '<button type="button" data-k="' + k + '" aria-pressed="' + (k === key) + '">' + PRESETS[k].label + "</button>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      key = b.dataset.k;
      try { localStorage.setItem("og-textur", key); } catch (err) {}
      apply();
      el.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
    document.body.appendChild(el);
  }
  if (document.body) panel(); else document.addEventListener("DOMContentLoaded", panel);
})();
