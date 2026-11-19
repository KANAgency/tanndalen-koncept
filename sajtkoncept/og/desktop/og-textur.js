/*
 * Jämförelseverktyg för OG:s materialton. Standard (papper 35) ligger statiskt i
 * og-textur.css + assets/img/textur-papper.svg. Detta skript är bara aktivt med ?textur=papper|linne|sandsten|tra|lader (&styrka=0–100).
 * Texturen genereras som SVG-brus med relief (feTurbulence + feDiffuseLighting),
 * kaklas sömlöst (stitchTiles) och blandas med soft-light, så att grundfärgen
 * ligger kvar: flat yta = 50 % grå = neutral i soft-light.
 */
(function () {
  var p = new URLSearchParams(location.search);
  if (!p.has("textur")) return;

  // Varje preset: brus-lager (summeras) + relief + standardstyrka.
  // f = baseFrequency, o = numOctaves, t = turbulence|fractalNoise, w = vikt.
  var PRESETS = {
    papper: { label: "Grängat papper", ss: 12, def: 35, layers: [
      { t: "fractalNoise", f: "0.035", o: 4, w: 0.6 },
      { t: "fractalNoise", f: "0.7", o: 2, w: 0.4 } ] },
    linne: { label: "Linne", ss: 9, def: 30, layers: [
      { t: "fractalNoise", f: "0.9 0.035", o: 2, w: 0.42 },
      { t: "fractalNoise", f: "0.035 0.9", o: 2, w: 0.42 },
      { t: "fractalNoise", f: "0.01 0.2", o: 2, w: 0.16 } ] },
    sandsten: { label: "Sandsten", ss: 8, def: 35, layers: [
      { t: "fractalNoise", f: "0.55", o: 3, w: 0.65 },
      { t: "fractalNoise", f: "0.012", o: 3, w: 0.35 } ] },
    tra: { label: "Ljust trä", ss: 12, def: 25, layers: [
      { t: "turbulence", f: "0.0035 0.09", o: 4, w: 0.8 },
      { t: "fractalNoise", f: "0.6", o: 1, w: 0.2 } ] },
    lader: { label: "Läder/skinn", ss: 13, def: 25, layers: [
      { t: "turbulence", f: "0.045", o: 3, w: 0.55 },
      { t: "fractalNoise", f: "0.5", o: 2, w: 0.45 } ] }
  };

  var TILE = 480;

  function svgFor(key, styrka) {
    var pr = PRESETS[key];
    var s = Math.max(0, Math.min(1, styrka / 100));
    var parts = [], names = [];
    pr.layers.forEach(function (l, i) {
      var n = "n" + i;
      parts.push(
        '<feTurbulence type="' + l.t + '" baseFrequency="' + l.f + '" numOctaves="' + l.o +
        '" seed="' + (7 + i * 13) + '" stitchTiles="stitch" result="r' + i + '"/>' +
        '<feColorMatrix in="r' + i + '" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ' +
        l.w + ' 0 0 0 0" result="' + n + '"/>'
      );
      names.push(n);
    });
    // Summera vikterna i alfakanalen (höjdkarta för reliefen).
    var acc = names[0];
    for (var i = 1; i < names.length; i++) {
      parts.push('<feComposite in="' + acc + '" in2="' + names[i] + '" operator="arithmetic" k2="1" k3="1" result="a' + i + '"/>');
      acc = "a" + i;
    }
    // Ljus snett från vänster ovan. kd normaliserar så att flat yta = 0,5 (neutral i soft-light).
    var elev = 55, kd = (0.5 / Math.sin((elev * Math.PI) / 180)).toFixed(4);
    parts.push(
      '<feDiffuseLighting in="' + acc + '" surfaceScale="' + pr.ss + '" diffuseConstant="' + kd +
      '" lighting-color="#fff" result="lit"><feDistantLight azimuth="225" elevation="' + elev + '"/></feDiffuseLighting>' +
      // Styrka: 0,5 + s·(x − 0,5)
      '<feComponentTransfer in="lit">' +
      ['R', 'G', 'B'].map(function (c) {
        return '<feFunc' + c + ' type="linear" slope="' + s.toFixed(3) + '" intercept="' + (0.5 - 0.5 * s).toFixed(3) + '"/>';
      }).join('') +
      '<feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer>'
    );
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + TILE + '" height="' + TILE + '">' +
      '<filter id="t" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      parts.join('') + '</filter><rect width="100%" height="100%" filter="url(#t)"/></svg>';
  }

  var root = document.documentElement;
  var key = p.get("textur");
  if (!PRESETS[key]) key = "papper";
  var styrka = p.has("styrka") ? +p.get("styrka") : PRESETS[key].def;

  function apply() {
    var url = "url(\"data:image/svg+xml," + encodeURIComponent(svgFor(key, styrka)) + "\")";
    root.style.setProperty("--og-textur", url);
    root.dataset.ogTextur = key;
    var q = new URLSearchParams(location.search);
    q.set("textur", key);
    q.set("styrka", String(styrka));
    history.replaceState(null, "", location.pathname + "?" + q.toString() + location.hash);
  }
  apply();

  function panel() {
    var el = document.createElement("div");
    el.className = "og-textur-panel";
    el.innerHTML =
      '<label>Material <select>' +
      Object.keys(PRESETS).map(function (k) {
        return '<option value="' + k + '"' + (k === key ? " selected" : "") + ">" + PRESETS[k].label + "</option>";
      }).join("") + '<option value="av">Av</option></select></label>' +
      '<label>Styrka <input type="range" min="0" max="100" step="5" value="' + styrka + '"><output>' + styrka + '</output></label>';
    var sel = el.querySelector("select"), rng = el.querySelector("input"), out = el.querySelector("output");
    sel.addEventListener("change", function () {
      if (sel.value === "av") { root.style.setProperty("--og-textur", "none"); delete root.dataset.ogTextur; return; }
      key = sel.value; styrka = PRESETS[key].def; rng.value = styrka; out.textContent = styrka; apply();
    });
    rng.addEventListener("input", function () { styrka = +rng.value; out.textContent = styrka; apply(); });
    document.body.appendChild(el);
  }
  if (document.body) panel(); else document.addEventListener("DOMContentLoaded", panel);
})();
