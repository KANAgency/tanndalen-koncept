"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // ui.html
  var ui_default = '<style>\n  body {\n    font: 12px/1.4 Inter, system-ui, sans-serif;\n    margin: 12px;\n    color: var(--figma-color-text);\n  }\n  h1 {\n    font-size: 13px;\n    font-weight: 600;\n    margin: 0 0 8px;\n  }\n  p {\n    margin: 0 0 12px;\n    color: var(--figma-color-text-secondary);\n  }\n  button {\n    margin-top: 8px;\n    width: 100%;\n    padding: 8px;\n    font-weight: 600;\n    cursor: pointer;\n  }\n  #sync {\n    margin-top: 4px;\n  }\n  #log {\n    margin-top: 10px;\n    max-height: 100px;\n    overflow: auto;\n    font-size: 11px;\n    white-space: pre-wrap;\n    color: var(--figma-color-text-secondary);\n  }\n  .err {\n    color: var(--figma-color-text-danger);\n  }\n</style>\n<h1>Typography sync</h1>\n<p>\n  Uppdaterar <code>font/size</code>, <code>font/tracking</code>, <code>font/style</code>, <code>font/family</code> och\n  <code>font/leading</code> (referens). Binder <code>OG/*</code> och <code>TD/*</code>: family, style, size,\n  letterSpacing. Line height = 110/125/150&nbsp;% p\xE5 styles (ej variabel). Kopplar ocks\xE5 varje\n  <strong>Sample</strong> till r\xE4tt local text style. Skapar/uppdaterar \xE4ven palett som\n  <strong>color styles</strong> (<code>OG/*</code>, <code>TD/*</code> \u2192 variabler <code>color/OG/*</code>).\n  Numerisk <code>font/weight</code> anv\xE4nds inte i Figma. Skapar \xE4ven layout-tokens:\n  <code>space/*</code> (collection Spacing, modes OG/TD), plus delade <code>radius/*</code>,\n  <code>bp/*</code>, <code>z/*</code> i Shared / Primitives.\n</p>\n<button id="sync" type="button">Synka variabler + text styles + specimens</button>\n<button id="colors" type="button">Endast color styles (paletter)</button>\n<button id="specimens" type="button">Endast specimens (copy + style + TokenLine)</button>\n<button id="concept" type="button">Concept: binda text styles</button>\n<div id="log"></div>\n<script>\n  const log = document.getElementById("log");\n  document.getElementById("sync").onclick = () => {\n    log.textContent = "Synkar\u2026";\n    parent.postMessage({ pluginMessage: { type: "sync" } }, "*");\n  };\n  document.getElementById("specimens").onclick = () => {\n    log.textContent = "Uppdaterar specimens\u2026";\n    parent.postMessage({ pluginMessage: { type: "updateSpecimens" } }, "*");\n  };\n  document.getElementById("colors").onclick = () => {\n    log.textContent = "Synkar color styles\u2026";\n    parent.postMessage({ pluginMessage: { type: "syncColors" } }, "*");\n  };\n  document.getElementById("concept").onclick = () => {\n    log.textContent = "Binder Concept-text\u2026";\n    parent.postMessage({ pluginMessage: { type: "bindConcept" } }, "*");\n  };\n  onmessage = (event) => {\n    const msg = event.data.pluginMessage;\n    if (!msg) return;\n    if (msg.type === "done") {\n      const lines = msg.results\n        .filter((r) => !r.ok)\n        .map((r) => `${r.styleName}: ${r.message}`);\n      log.innerHTML =\n        lines.length === 0\n          ? msg.summary\n          : `<span class="err">${lines.join("\\n")}</span>`;\n    }\n    if (msg.type === "error") {\n      log.innerHTML = `<span class="err">${msg.message}</span>`;\n    }\n  };\n<\/script>\n';

  // src/color-defs.ts
  var COLOR_PALETTE = {
    OG: {
      "off-white": "#F5EEE5",
      "off-white-hover": "#F9F6F0",
      "off-white-active": "#EBE3D5",
      "off-white-link-active": "#D9D1C7",
      "dark-green": "#003E3A",
      "dark-green-hover": "#0F524D",
      "dark-green-active": "#002D2A",
      "orsa-black": "#3C3C3B",
      black: "#000000",
      white: "#FFFFFF",
      "signal-orange": "#E74011",
      "signal-orange-hover": "#F3582B",
      "signal-orange-active": "#D23B0F",
      cta: "#D23B0F",
      "cta-on-dark": "#F59678",
      tonal: "#E1E1D7",
      "tonal-hover": "#D5D5CB",
      "tonal-active": "#C9C9BF",
      "neutral-subtle": "#D2CCC4",
      neutral: "#8C8985",
      "neutral-strong": "#5D5A57"
    },
    TD: {
      night: "#24272A",
      day: "#EBE8E5",
      snow: "#FFFFFF",
      accent: "#BF6A15",
      cta: "#AE6113",
      "season-spring": "#F6E0A2",
      "season-summer": "#1B4021",
      "season-autumn": "#3C1F17",
      "season-winter": "#A1B5BA",
      "neutral-subtle": "#C3C1C0",
      "neutral-muted": "#A5A4A4",
      neutral: "#686868",
      "neutral-strong": "#4C4D4F",
      "neutral-subtlest": "#E0DFDE"
    }
  };
  var SHARED_COLOR_PALETTE = {
    error: "#C42B2B",
    "on-error": "#FFFFFF"
  };
  var PAINT_STYLE_TOKENS = {
    OG: [
      "off-white",
      "dark-green",
      "orsa-black",
      "black",
      "white",
      "signal-orange",
      "signal-orange-active",
      "cta",
      "neutral-subtle",
      "neutral",
      "neutral-strong"
    ],
    TD: [
      "night",
      "day",
      "snow",
      "accent",
      "cta",
      "season-spring",
      "season-summer",
      "season-autumn",
      "season-winter",
      "neutral-subtle",
      "neutral-muted",
      "neutral",
      "neutral-strong"
    ]
  };
  var TD_PAINT_STYLE_ALIAS = {
    night: "natt",
    day: "dag",
    snow: "sno",
    "season-spring": "sasong-var",
    "season-summer": "sasong-sommar",
    "season-autumn": "sasong-host",
    "season-winter": "sasong-vinter"
  };
  function sharedPaletteVariableName(token) {
    return `color/${token}`;
  }
  function paintStyleName(brand, token) {
    if (brand === "TD" && TD_PAINT_STYLE_ALIAS[token]) {
      return `TD/${TD_PAINT_STYLE_ALIAS[token]}`;
    }
    return `${brand}/${token}`;
  }
  function paletteVariableName(brand, token) {
    return `color/${brand}/${token}`;
  }
  var SWATCH_DISPLAY_TO_TOKEN = {
    OG: {
      "Off-white": "off-white",
      M\u00F6rkgr\u00F6n: "dark-green",
      "Orsa Black": "orsa-black",
      Signalf\u00E4rg: "signal-orange",
      CTA: "cta",
      Vit: "white",
      Svart: "black"
    },
    TD: {
      Natt: "night",
      Dag: "day",
      Sn\u00F6: "snow",
      Accent: "accent",
      CTA: "cta",
      V\u00E5r: "season-spring",
      Sommar: "season-summer",
      H\u00F6st: "season-autumn",
      Vinter: "season-winter"
    }
  };
  var SEMANTIC_CHIP_TO_VAR = {
    "Bakgrund bas": "bg-base",
    "Bakgrund inverterad": "bg-inverted",
    "Bakgrund overlay": "bg-overlay",
    Frost: "frost",
    "Frost hover": "frost-hover",
    "Frost active": "frost-active",
    "Text prim\xE4r": "text-primary",
    "Text inverterad": "text-inverted",
    "CTA prim\xE4r": "cta-primary",
    "CTA on dark": "cta-on-dark",
    "On-cta-on-dark": "on-cta-on-dark",
    Accent: "accent",
    Error: "error",
    "On-error": "on-error"
  };
  var SEMANTIC_COLLECTION_NAME = {
    OG: "OG / Semantic",
    TD: "TD / Semantic"
  };
  var TD_CONTRAST_PAIRS = [
    { bg: "night", text: "day", label: "Natt", textLabel: "Dag" },
    { bg: "season-summer", text: "day", label: "Sommar", textLabel: "Dag" },
    { bg: "season-autumn", text: "day", label: "H\xF6st", textLabel: "Dag" },
    {
      bg: "cta",
      text: "snow",
      label: "Se mig",
      textLabel: "Sn\xF6",
      note: "Undantag \u2014 inte Dag"
    },
    { bg: "day", text: "night", label: "Dag", textLabel: "Natt" },
    { bg: "snow", text: "night", label: "Sn\xF6", textLabel: "Natt" },
    { bg: "season-spring", text: "night", label: "V\xE5r", textLabel: "Natt" },
    { bg: "season-winter", text: "night", label: "Vinter", textLabel: "Natt" },
    {
      bg: "accent",
      text: "day",
      label: "Accent",
      textLabel: "Dag",
      status: "verified-with-restriction",
      contrastRatio: 3.25,
      note: "3.25:1 \u2014 endast icke-text (kantlinjer/badges/ikoner). Aldrig knappfyllning eller br\xF6dtext."
    }
  ];
  var TD_CONTRAST_GRID = [
    { id: "natt", bg: "night", text: "day", label: "Natt", textLabel: "Dag" },
    { id: "dag", bg: "day", text: "night", label: "Dag", textLabel: "Natt" },
    { id: "sasong-sommar", bg: "season-summer", text: "day", label: "Sommar", textLabel: "Dag" },
    { id: "sno", bg: "snow", text: "night", label: "Sn\xF6", textLabel: "Natt" },
    { id: "natt-sno", bg: "night", text: "snow", label: "Natt", textLabel: "Sn\xF6" },
    { id: "sasong-var", bg: "season-spring", text: "night", label: "V\xE5r", textLabel: "Natt" },
    { id: "sasong-host", bg: "season-autumn", text: "day", label: "H\xF6st", textLabel: "Dag" },
    { id: "sasong-vinter", bg: "season-winter", text: "night", label: "Vinter", textLabel: "Natt" },
    { id: "cta", bg: "cta", text: "snow", label: "Se mig", textLabel: "Sn\xF6", note: "Undantag \u2014 inte Dag" }
  ];
  var OG_CONTRAST_PAIRS = [
    { bg: "off-white", text: "orsa-black", label: "Off-white", textLabel: "Orsa Black" },
    { bg: "dark-green", text: "white", label: "M\xF6rkgr\xF6n", textLabel: "Vit" }
  ];
  function contrastOnVariableName(bg) {
    return `contrast/on-${bg}`;
  }
  function hexToFigmaRgb(hex) {
    const h = hex.replace("#", "");
    if (h.length !== 6) throw new Error(`Invalid hex: ${hex}`);
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255
    };
  }

  // src/layout-defs.ts
  var SPACING_COLLECTION = "Spacing";
  var SPACE_STEPS = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "8xl"
  ];
  var SPACE_PX = {
    xs: { OG: 4, TD: 4 },
    sm: { OG: 8, TD: 8 },
    md: { OG: 12, TD: 12 },
    lg: { OG: 16, TD: 16 },
    xl: { OG: 20, TD: 24 },
    "2xl": { OG: 24, TD: 32 },
    "3xl": { OG: 32, TD: 40 },
    "4xl": { OG: 40, TD: 56 },
    "5xl": { OG: 48, TD: 64 },
    "6xl": { OG: 64, TD: 88 },
    "7xl": { OG: 80, TD: 112 },
    "8xl": { OG: 96, TD: 144 }
  };
  var SPACE_RENAME_FROM_NUMERIC = {
    "1": "xs",
    "2": "sm",
    "3": "md",
    "4": "lg",
    "5": "xl",
    "6": "2xl",
    "8": "3xl",
    "10": "4xl",
    "12": "5xl",
    "16": "6xl",
    "20": "7xl",
    "24": "8xl"
  };
  var SPACE_RENAME_FROM_SLASH = Object.fromEntries(
    SPACE_STEPS.map((step) => [`space/${step}`, `space-${step}`])
  );
  var RADIUS_PX = {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999
  };
  var STROKE_PX = {
    "0.5": 0.5,
    "1": 1,
    "1.5": 1.5,
    "2": 2,
    "2.5": 2.5,
    "3": 3
  };
  var BREAKPOINT_PX = {
    sm: 640,
    md: 1024,
    lg: 1280
  };
  var Z_INDEX = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400
  };
  function spaceVariableName(step) {
    return `space-${step}`;
  }
  function radiusVariableName(key) {
    return `radius/${key}`;
  }
  function strokeVariableName(key) {
    return `stroke/${key.replace(".", "-")}`;
  }
  function breakpointVariableName(key) {
    return `bp/${key}`;
  }
  function zVariableName(key) {
    return `z/${key}`;
  }

  // src/specimen-texts.ts
  var SPECIMEN_REFERENCE_TEXTS = {
    OG: {
      "heading-1": "Upplev mer",
      "heading-2": "Vinter i Dalarna",
      "heading-3": "Barnens b\xE4sta vinterveckor",
      "heading-4": "Sportlov i skidparadiset",
      "heading-5": "Skid\xE5kning f\xF6r familjen",
      "heading-6": "Nyheter vinter 2026/27",
      eyebrow: "kombikort & skipass",
      "eyebrow-sm": "inf\xF6r ditt bes\xF6k",
      intro: "Sportloven h\xE4r i hj\xE4rtat av Dalarna bjuder p\xE5 skid\xE5kning i sp\xE5r och backar.",
      lead: "Boka boende och spara p\xE5 kombikort och skipass.",
      "lead-sm": "G\xE4ller vid boendebokning vinter 2026/27.",
      quote: "Dalarna bjuder p\xE5 vinter som stannar kvar.",
      "quote-sm": "Mer tid i backen \u2014 mindre i k\xF6n.",
      body: "Sportloven h\xE4r i hj\xE4rtat av Dalarna bjuder p\xE5 skid\xE5kning i sp\xE5r och backar. Till vintern finns en rad nyheter som sn\xF6s\xF6kerhet, mer skid\xE5kning och en helt ny inomhusmilj\xF6 f\xF6r barn.",
      "body-sm": "G\xE4ller vid boendebokning vinter 2026/27.",
      cta: "Boka nu",
      "cta-sm": "Boka",
      nav: "Skipass",
      label: "Pris fr\xE5n 5 490 kr",
      caption: "Nyhet! Lekmilj\xF6n i Bl\xE5b\xE4rslyan utvecklas och erbjuder nya aktiviteter."
    },
    TD: {
      "heading-1": "Fj\xE4lltagen",
      "heading-2": "Stugor med fj\xE4llutsikt",
      "heading-3": "\xC4kta fj\xE4llsemester",
      "heading-4": "Skid\xE5kning i T\xE4nndalen",
      "heading-5": "Barnens fj\xE4llvecka",
      "heading-6": "Hamra Syd",
      eyebrow: "fun\xE4sfj\xE4llen",
      "eyebrow-sm": "inf\xF6r ditt bes\xF6k",
      intro: "Utf\xF6rs\xE5kning, l\xE4ngd och stillhet i samma dal.",
      lead: "Stunder som stannar kvar i T\xE4nndalen.",
      "lead-sm": "Spara 15 % p\xE5 liftkort bokat i f\xF6rv\xE4g.",
      quote: "Fj\xE4llvinden rensar tankarna \u2014 skrattet i backen v\xE4xer.",
      "quote-sm": "Utan att stressa hem \u2014 bara fj\xE4ll.",
      body: "T\xE4nndalen \xE4r en del av Fun\xE4sfj\xE4llen \u2013 Sveriges mest omtyckta fj\xE4llomr\xE5de. \xC4r man omtyckt, s\xE5 g\xE4ller det att ha en stor famn.",
      "body-sm": "Mer skid\xE5kning till b\xE4ttre pris. Boka ditt 6\u201314 dagars liftkort minst 30 dagar i f\xF6rv\xE4g och spara 15 %.",
      cta: "Boka",
      "cta-sm": "Boka",
      nav: "Utf\xF6rs\xE5kning",
      label: "Pris fr. 7 395 :-",
      caption: "Spana in hur det ser ut i T\xE4nndalen just nu!"
    }
  };

  // src/style-defs.ts
  var LEADING_FIGMA_PERCENT = {
    tight: 110,
    snug: 125,
    title: 130,
    relaxed: 140,
    normal: 150
  };
  var TRACKING_FIGMA_PX = {
    wide: -1,
    normal: 0,
    fine: -0.5,
    snug: -1,
    tight: -2,
    tighter: -3,
    tightest: -4,
    compressed: -5
  };
  var FONT_SIZE_PX = {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 36,
    "4xl": 48,
    "5xl": 60,
    "6xl": 72,
    "88": 88,
    "112": 112
  };
  function familyVariableName(familyKey) {
    const dot = familyKey.indexOf(".");
    if (dot === -1) {
      throw new Error(`Invalid family key: ${familyKey}`);
    }
    const brand = familyKey.slice(0, dot);
    const role = familyKey.slice(dot + 1);
    return `font/family/${brand}/${role}`;
  }
  function styleVariableName(familyKey, weight) {
    const dot = familyKey.indexOf(".");
    if (dot === -1) throw new Error(`Invalid family key: ${familyKey}`);
    const brand = familyKey.slice(0, dot);
    const role = familyKey.slice(dot + 1);
    return `font/style/${brand}/${role}/${weight}`;
  }
  function leadingVariableName(leading) {
    return `font/leading/${leading}`;
  }
  function trackingVariableName(tracking) {
    return `font/tracking/${tracking}`;
  }
  function tokenLineForStyle(def) {
    var _a;
    const parts = [
      familyVariableName(def.family),
      `font/size/${def.size}`,
      styleVariableName(def.family, def.weight),
      leadingVariableName(def.leading)
    ];
    const tr = (_a = def.tracking) != null ? _a : "normal";
    parts.push(trackingVariableName(tr));
    return parts.join(" \xB7 ");
  }
  var FIGMA_FAMILY_STRING = {
    OG: {
      primary: "Literata",
      secondary: "Radio Canada Big"
    },
    TD: {
      primary: "Superclarendon",
      secondary: "CircularXX TT"
    }
  };
  function figmaFamilyVariableValue(familyKey) {
    var _a;
    const dot = familyKey.indexOf(".");
    if (dot === -1) throw new Error(`Invalid family key: ${familyKey}`);
    const brand = familyKey.slice(0, dot);
    const role = familyKey.slice(dot + 1);
    const v = (_a = FIGMA_FAMILY_STRING[brand]) == null ? void 0 : _a[role];
    if (!v) throw new Error(`Ingen Figma family f\xF6r ${familyKey}`);
    return v;
  }
  var FIGMA_STYLE_BY_FAMILY_WEIGHT = {
    "OG.primary": {
      regular: "Regular",
      italic: "Italic",
      black: "Black",
      bold: "Bold",
      semibold: "SemiBold",
      medium: "Medium"
    },
    "OG.secondary": {
      regular: "Regular",
      italic: "Italic",
      medium: "Medium",
      semibold: "SemiBold"
    },
    "TD.primary": {
      regular: "Regular",
      bold: "Bold"
    },
    "TD.secondary": {
      regular: "Book",
      book: "Book",
      bold: "Bold"
    }
  };
  function figmaStyleValue(familyKey, weight) {
    var _a;
    const style = (_a = FIGMA_STYLE_BY_FAMILY_WEIGHT[familyKey]) == null ? void 0 : _a[weight];
    if (!style) {
      throw new Error(`Ingen Figma style f\xF6r ${familyKey} + ${weight}`);
    }
    return style;
  }
  var OG_STYLE_KEYS = [
    "heading-1",
    "heading-2",
    "heading-3",
    "heading-4",
    "heading-5",
    "heading-6",
    "eyebrow",
    "eyebrow-sm",
    "intro",
    "lead",
    "lead-sm",
    "quote",
    "quote-sm",
    "body",
    "body-sm",
    "cta",
    "cta-sm",
    "nav",
    "label",
    "caption"
  ];
  var TD_STYLE_KEYS = [
    "heading-1",
    "heading-2",
    "heading-3",
    "heading-4",
    "heading-5",
    "heading-6",
    "eyebrow",
    "eyebrow-sm",
    "intro",
    "lead",
    "lead-sm",
    "quote",
    "quote-sm",
    "title",
    "title-sm",
    "body",
    "body-sm",
    "cta",
    "cta-sm",
    "nav",
    "label",
    "caption"
  ];
  var OG_STYLE_DEFS = {
    "heading-1": {
      family: "OG.primary",
      size: "88",
      weight: "regular",
      leading: "tight",
      tracking: "tighter"
    },
    "heading-2": {
      family: "OG.primary",
      size: "5xl",
      weight: "regular",
      leading: "tight",
      tracking: "tight"
    },
    "heading-3": {
      family: "OG.primary",
      size: "4xl",
      weight: "regular",
      leading: "tight",
      tracking: "wide"
    },
    "heading-4": {
      family: "OG.primary",
      size: "3xl",
      weight: "regular",
      leading: "snug",
      tracking: "wide"
    },
    "heading-5": {
      family: "OG.primary",
      size: "xl",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    "heading-6": {
      family: "OG.primary",
      size: "md",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    eyebrow: {
      family: "OG.secondary",
      size: "lg",
      weight: "medium",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
    },
    "eyebrow-sm": {
      family: "OG.secondary",
      size: "md",
      weight: "medium",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
    },
    intro: {
      family: "OG.secondary",
      size: "base",
      weight: "semibold",
      leading: "normal",
      tracking: "normal"
    },
    "lead": {
      family: "OG.primary",
      size: "lg",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    "lead-sm": {
      family: "OG.primary",
      size: "md",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    quote: {
      family: "OG.primary",
      size: "2xl",
      weight: "italic",
      leading: "relaxed",
      tracking: "normal"
    },
    "quote-sm": {
      family: "OG.primary",
      size: "xl",
      weight: "italic",
      leading: "relaxed",
      tracking: "normal"
    },
    body: { family: "OG.secondary", size: "base", weight: "regular", leading: "normal", tracking: "normal" },
    "body-sm": {
      family: "OG.secondary",
      size: "sm",
      weight: "regular",
      leading: "normal",
      tracking: "normal"
    },
    cta: {
      family: "OG.primary",
      size: "base",
      weight: "medium",
      leading: "tight",
      tracking: "fine",
      leadingTrim: "CAP_HEIGHT"
    },
    "cta-sm": {
      family: "OG.primary",
      size: "sm",
      weight: "medium",
      leading: "tight",
      tracking: "fine",
      leadingTrim: "CAP_HEIGHT"
    },
    nav: { family: "OG.secondary", size: "sm", weight: "medium", leading: "tight", tracking: "normal" },
    label: { family: "OG.secondary", size: "sm", weight: "semibold", leading: "tight", tracking: "normal" },
    caption: { family: "OG.secondary", size: "xs", weight: "regular", leading: "normal", tracking: "normal" }
  };
  var TD_STYLE_DEFS = {
    "heading-1": {
      group: "Editorial",
      family: "TD.primary",
      size: "88",
      weight: "bold",
      leading: "tight",
      tracking: "compressed"
    },
    "heading-2": {
      group: "Editorial",
      family: "TD.primary",
      size: "5xl",
      weight: "bold",
      leading: "tight",
      tracking: "tighter"
    },
    "heading-3": {
      group: "Editorial",
      family: "TD.primary",
      size: "4xl",
      weight: "bold",
      leading: "tight",
      tracking: "tight"
    },
    "heading-4": {
      group: "Editorial",
      family: "TD.primary",
      size: "3xl",
      weight: "bold",
      leading: "snug",
      tracking: "snug"
    },
    "heading-5": {
      group: "Editorial",
      family: "TD.primary",
      size: "xl",
      weight: "bold",
      leading: "relaxed",
      tracking: "normal"
    },
    "heading-6": {
      group: "Editorial",
      family: "TD.primary",
      size: "md",
      weight: "bold",
      leading: "relaxed",
      tracking: "normal"
    },
    eyebrow: {
      group: "Editorial",
      family: "TD.secondary",
      size: "lg",
      weight: "bold",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
    },
    "eyebrow-sm": {
      group: "Editorial",
      family: "TD.secondary",
      size: "md",
      weight: "bold",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
    },
    intro: {
      group: "Editorial",
      family: "TD.primary",
      size: "base",
      weight: "regular",
      leading: "normal",
      tracking: "fine"
    },
    lead: {
      group: "Editorial",
      family: "TD.primary",
      size: "lg",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    "lead-sm": {
      group: "Editorial",
      family: "TD.primary",
      size: "md",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    quote: {
      group: "Editorial",
      family: "TD.secondary",
      size: "2xl",
      weight: "book",
      leading: "relaxed",
      tracking: "fine"
    },
    "quote-sm": {
      group: "Editorial",
      family: "TD.secondary",
      size: "xl",
      weight: "book",
      leading: "relaxed",
      tracking: "fine"
    },
    title: {
      group: "UI",
      family: "TD.secondary",
      size: "lg",
      weight: "bold",
      leading: "title",
      tracking: "normal"
    },
    "title-sm": {
      group: "UI",
      family: "TD.secondary",
      size: "base",
      weight: "bold",
      leading: "title",
      tracking: "normal"
    },
    body: {
      group: "UI",
      family: "TD.secondary",
      size: "base",
      weight: "book",
      leading: "normal",
      tracking: "normal"
    },
    "body-sm": {
      group: "UI",
      family: "TD.secondary",
      size: "sm",
      weight: "book",
      leading: "normal",
      tracking: "normal"
    },
    cta: {
      group: "UI",
      family: "TD.secondary",
      size: "base",
      weight: "bold",
      leading: "tight",
      tracking: "normal"
    },
    "cta-sm": {
      group: "UI",
      family: "TD.secondary",
      size: "sm",
      weight: "bold",
      leading: "tight",
      tracking: "normal"
    },
    nav: {
      group: "UI",
      family: "TD.secondary",
      size: "sm",
      weight: "book",
      leading: "tight",
      tracking: "normal"
    },
    label: {
      group: "UI",
      family: "TD.secondary",
      size: "xs",
      weight: "bold",
      leading: "tight",
      tracking: "normal"
    },
    caption: {
      group: "UI",
      family: "TD.secondary",
      size: "xs",
      weight: "book",
      leading: "normal",
      tracking: "normal"
    }
  };
  function allStyleVariableSpecs() {
    const specs = [];
    const seen = /* @__PURE__ */ new Set();
    for (const defs of [OG_STYLE_DEFS, TD_STYLE_DEFS]) {
      for (const def of Object.values(defs)) {
        const name = styleVariableName(def.family, def.weight);
        if (seen.has(name)) continue;
        seen.add(name);
        specs.push({ name, value: figmaStyleValue(def.family, def.weight) });
      }
    }
    return specs;
  }

  // src/sync-engine.ts
  var PRIMITIVES_COLLECTION = "Shared / Primitives";
  async function getFoundationsPage() {
    await figma.loadAllPagesAsync();
    const page = figma.root.children.find((p) => p.name.includes("Foundations"));
    if (!page) throw new Error("Sidan Foundations saknas.");
    await page.loadAsync();
    return page;
  }
  function findSpecimenSample(specimen) {
    var _a;
    const named = specimen.findOne((n) => n.name === "Sample");
    if ((named == null ? void 0 : named.type) === "TEXT") return named;
    const texts = specimen.findAll((n) => n.type === "TEXT");
    return (_a = texts.find((t) => t.name !== "StyleName" && t.name !== "TokenLine")) != null ? _a : null;
  }
  async function loadFontFamilyStyle(family, style) {
    const attempts = [
      style,
      style.replace(/ /g, ""),
      style.replace("Semi Bold", "Semibold"),
      style.replace("Semibold", "Semi Bold"),
      style.replace("SemiBold", "Semi Bold")
    ];
    if (style === "Regular") attempts.push("Book");
    if (style === "Book") attempts.push("Regular");
    const tried = /* @__PURE__ */ new Set();
    let lastError;
    for (const candidate of attempts) {
      if (tried.has(candidate)) continue;
      tried.add(candidate);
      try {
        await figma.loadFontAsync({ family, style: candidate });
        return;
      } catch (e) {
        lastError = e;
      }
    }
    if (style.toLowerCase().includes("italic")) {
      for (const candidate of ["Italic", "Regular Italic", "It"]) {
        if (tried.has(candidate)) continue;
        tried.add(candidate);
        try {
          await figma.loadFontAsync({ family, style: candidate });
          return;
        } catch (e) {
          lastError = e;
        }
      }
    }
    const available = await figma.listAvailableFontsAsync();
    const related = available.filter(
      (f) => f.fontName.family === family || f.fontName.family.replace(/\s+/g, "") === family.replace(/\s+/g, "")
    );
    for (const f of related) {
      try {
        await figma.loadFontAsync(f.fontName);
        if (f.fontName.style === style || f.fontName.style.replace(/\s+/g, "") === style.replace(/\s+/g, "")) {
          return;
        }
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
  async function loadFontsForStyleDef(def) {
    const family = figmaFamilyVariableValue(def.family);
    const style = figmaStyleValue(def.family, def.weight);
    await loadFontFamilyStyle(family, style);
  }
  async function assignSampleTextStyle(sample, style, def, text) {
    await loadFontsForStyleDef(def);
    try {
      await figma.loadFontAsync(style.fontName);
    } catch (e) {
    }
    try {
      await figma.loadFontAsync(sample.fontName);
    } catch (e) {
    }
    sample.characters = text;
    await sample.setTextStyleIdAsync(style.id);
  }
  async function updateFoundationSpecimens() {
    const page = await getFoundationsPage();
    const styles = new Map(
      (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s])
    );
    const results = [];
    for (const prefix of ["OG", "TD"]) {
      const frame = page.findOne((n) => n.name === `${prefix} \u2014 Foundations exempel`);
      const typoSec = frame == null ? void 0 : frame.findOne((n) => n.name === "Typografi \u2014 text styles");
      if (!typoSec) {
        results.push({ styleName: `${prefix}/*`, ok: false, message: "Typografi-sektion saknas" });
        continue;
      }
      if (prefix === "OG" || prefix === "TD") {
        await removeDisplayArtifacts(prefix, typoSec, styles);
      }
      await migrateLegacyLeadNames(prefix, typoSec, styles);
      if (prefix === "OG") {
        await migrateLegacyOgEyebrowNames(typoSec, styles);
      }
      if (prefix === "TD") {
        await migrateLegacyTdEyebrowNames(typoSec, styles);
      }
      const defs = prefix === "OG" ? OG_STYLE_DEFS : TD_STYLE_DEFS;
      const keys = prefix === "OG" ? OG_STYLE_KEYS : TD_STYLE_KEYS;
      await removeRetiredTypographyStyles(prefix, keys, typoSec, styles);
      await ensureDerivedTypographyArtifacts(prefix, typoSec, styles);
      ensureCanonicalTextStyles(prefix, keys, styles);
      await ensureAllSpecimensForPrefix(page, prefix, typoSec, keys);
      const texts = SPECIMEN_REFERENCE_TEXTS[prefix];
      for (const key of keys) {
        const text = texts[key];
        if (text === void 0) continue;
        const styleName = `${prefix}/${key}`;
        const style = styles.get(styleName);
        const specimen = typoSec.findOne((n) => n.name === `Specimen ${styleName}`);
        const sample = specimen ? findSpecimenSample(specimen) : null;
        const def = defs[key];
        if (!style) {
          results.push({ styleName, ok: false, message: "Local text style saknas i filen" });
          continue;
        }
        if (!specimen || !sample || !def) {
          results.push({
            styleName,
            ok: false,
            message: specimen ? "Sample-lager saknas i specimen" : `Specimen ${styleName} saknas`
          });
          continue;
        }
        try {
          await assignSampleTextStyle(sample, style, def, text);
          const styleNameNode = specimen.findOne((n) => n.name === "StyleName");
          if (styleNameNode) {
            await figma.loadFontAsync(styleNameNode.fontName);
            styleNameNode.characters = styleName;
          }
          const tokenLine = specimen.findOne((n) => n.name === "TokenLine");
          if (tokenLine) {
            await figma.loadFontAsync(tokenLine.fontName);
            tokenLine.characters = tokenLineForStyle(def);
          }
          results.push({ styleName, ok: true });
        } catch (e) {
          results.push({
            styleName,
            ok: false,
            message: e instanceof Error ? e.message : String(e)
          });
        }
      }
      await reorderTypoSpecimens(typoSec, prefix, keys);
    }
    return results;
  }
  async function removeDisplayArtifacts(prefix, typoSec, styles) {
    const displaySpec = typoSec.findOne((n) => n.name === `Specimen ${prefix}/display`);
    if (displaySpec) displaySpec.remove();
    const displayStyle = styles.get(`${prefix}/display`);
    if (displayStyle) {
      displayStyle.remove();
      styles.delete(`${prefix}/display`);
    }
  }
  var LEGACY_LEAD_RENAMES = [
    ["lead-1", "lead"],
    ["lead-2", "lead-sm"]
  ];
  var LEGACY_EYEBROW_RENAMES = [
    ["heading-8", "eyebrow"],
    ["heading-9", "eyebrow-sm"]
  ];
  var RETIRED_STYLE_KEYS = ["heading-7", "heading-8", "heading-9"];
  async function migrateLegacyStyleNames(prefix, renames, typoSec, styles) {
    for (const [oldKey, newKey] of renames) {
      const oldStyleName = `${prefix}/${oldKey}`;
      const newStyleName = `${prefix}/${newKey}`;
      const oldStyle = styles.get(oldStyleName);
      const newStyle = styles.get(newStyleName);
      if (oldStyle && !newStyle) {
        oldStyle.name = newStyleName;
        styles.delete(oldStyleName);
        styles.set(newStyleName, oldStyle);
      } else if (oldStyle && newStyle) {
        oldStyle.remove();
        styles.delete(oldStyleName);
      }
      const oldSpec = typoSec.findOne((n) => n.name === `Specimen ${oldStyleName}`);
      const newSpec = typoSec.findOne((n) => n.name === `Specimen ${newStyleName}`);
      if (oldSpec && !newSpec) {
        oldSpec.name = `Specimen ${newStyleName}`;
      } else if (oldSpec && newSpec) {
        oldSpec.remove();
      }
    }
  }
  async function migrateLegacyLeadNames(prefix, typoSec, styles) {
    await migrateLegacyStyleNames(prefix, LEGACY_LEAD_RENAMES, typoSec, styles);
  }
  async function migrateLegacyOgEyebrowNames(typoSec, styles) {
    await migrateLegacyStyleNames("OG", LEGACY_EYEBROW_RENAMES, typoSec, styles);
  }
  async function migrateLegacyTdEyebrowNames(typoSec, styles) {
    await migrateLegacyStyleNames("TD", LEGACY_EYEBROW_RENAMES, typoSec, styles);
  }
  async function removeRetiredTypographyStyles(prefix, keys, typoSec, styles) {
    const allowed = new Set(keys);
    for (const [name, style] of [...styles.entries()]) {
      const parsed = parseStyleName(name);
      if (!parsed || parsed.prefix !== prefix) continue;
      if (allowed.has(parsed.key)) continue;
      style.remove();
      styles.delete(name);
    }
    for (const retired of RETIRED_STYLE_KEYS) {
      if (allowed.has(retired)) continue;
      const spec = typoSec.findOne((n) => n.name === `Specimen ${prefix}/${retired}`);
      spec == null ? void 0 : spec.remove();
    }
  }
  async function loadAllTextFonts(node) {
    if (node.type === "TEXT") {
      try {
        await figma.loadFontAsync(node.fontName);
      } catch (e) {
      }
    }
    if ("children" in node) {
      for (const child of node.children) {
        await loadAllTextFonts(child);
      }
    }
  }
  async function ensureTextStyleClone(prefix, targetKey, sourceKey, styles) {
    const targetName = `${prefix}/${targetKey}`;
    if (styles.has(targetName)) return;
    const source = styles.get(`${prefix}/${sourceKey}`);
    if (!source) return;
    const created = figma.createTextStyle();
    created.name = targetName;
    await figma.loadFontAsync(source.fontName);
    created.fontName = source.fontName;
    created.fontSize = source.fontSize;
    created.lineHeight = source.lineHeight;
    created.letterSpacing = source.letterSpacing;
    created.textCase = source.textCase;
    styles.set(targetName, created);
  }
  function ensureCanonicalTextStyles(prefix, keys, styles) {
    for (const key of keys) {
      const name = `${prefix}/${key}`;
      if (styles.has(name)) continue;
      const created = figma.createTextStyle();
      created.name = name;
      styles.set(name, created);
    }
  }
  async function ensureSpecimenClone(typoSec, prefix, targetKey, sourceKey) {
    const targetSpecName = `Specimen ${prefix}/${targetKey}`;
    if (typoSec.findOne((n) => n.name === targetSpecName)) return;
    const source = typoSec.findOne((n) => n.name === `Specimen ${prefix}/${sourceKey}`);
    if (!source) return;
    await loadAllTextFonts(source);
    const clone = source.clone();
    clone.name = targetSpecName;
    await loadAllTextFonts(clone);
    typoSec.appendChild(clone);
  }
  async function ensureDerivedTypographyArtifacts(prefix, typoSec, styles) {
    await ensureTextStyleClone(prefix, "eyebrow", "label", styles);
    if (!styles.has(`${prefix}/eyebrow`)) {
      await ensureTextStyleClone(prefix, "eyebrow", "nav", styles);
    }
    await ensureTextStyleClone(prefix, "eyebrow-sm", "eyebrow", styles);
    if (!styles.has(`${prefix}/eyebrow-sm`)) {
      await ensureTextStyleClone(prefix, "eyebrow-sm", "label", styles);
    }
    await ensureTextStyleClone(prefix, "quote", "lead", styles);
    await ensureTextStyleClone(prefix, "quote-sm", "lead-sm", styles);
    await ensureSpecimenClone(typoSec, prefix, "quote", "lead");
    await ensureSpecimenClone(typoSec, prefix, "quote-sm", "lead-sm");
    await ensureTextStyleClone(prefix, "intro", "body", styles);
    await ensureSpecimenClone(typoSec, prefix, "intro", "body");
    await ensureSpecimenClone(typoSec, prefix, "eyebrow", "label");
    await ensureSpecimenClone(typoSec, prefix, "eyebrow-sm", "eyebrow");
    await ensureTextStyleClone(prefix, "cta-sm", "cta", styles);
    await ensureSpecimenClone(typoSec, prefix, "cta-sm", "cta");
  }
  async function ensureAllSpecimensForPrefix(page, prefix, typoSec, keys) {
    var _a, _b, _c, _d;
    const ogTypo = (_a = page.findOne((n) => n.name === "OG \u2014 Foundations exempel")) == null ? void 0 : _a.findOne((n) => n.name === "Typografi \u2014 text styles");
    const fallbackInSection = (_c = (_b = typoSec.findOne((n) => n.name === `Specimen ${prefix}/heading-4`)) != null ? _b : typoSec.findOne((n) => n.name === `Specimen ${prefix}/body`)) != null ? _c : typoSec.findOne((n) => n.name.startsWith("Specimen "));
    for (const key of keys) {
      const targetName = `Specimen ${prefix}/${key}`;
      if (typoSec.findOne((n) => n.name === targetName)) continue;
      let source = null;
      if (prefix === "TD" && ogTypo) {
        source = ogTypo.findOne((n) => n.name === `Specimen OG/${key}`);
      }
      if (!source) {
        source = (_d = typoSec.findOne((n) => n.name === `Specimen ${prefix}/${key.replace(/-.*/, "")}`)) != null ? _d : fallbackInSection;
      }
      if (!source) continue;
      await loadAllTextFonts(source);
      const clone = source.clone();
      clone.name = targetName;
      await loadAllTextFonts(clone);
      const styleNameNode = clone.findOne((n) => n.name === "StyleName");
      if ((styleNameNode == null ? void 0 : styleNameNode.type) === "TEXT") {
        await figma.loadFontAsync(styleNameNode.fontName);
        styleNameNode.characters = `${prefix}/${key}`;
      }
      typoSec.appendChild(clone);
    }
  }
  async function reorderTypoSpecimens(typoSec, prefix, keys) {
    await loadAllTextFonts(typoSec);
    let index = 0;
    for (const key of keys) {
      const specimen = typoSec.findOne((n) => n.name === `Specimen ${prefix}/${key}`);
      if (specimen) typoSec.insertChild(index++, specimen);
    }
  }
  async function reorderLocalTextStyles(stylesByName, keys, prefix, afterReference) {
    let previous = afterReference;
    for (const key of keys) {
      const style = stylesByName.get(`${prefix}/${key}`);
      if (!style) continue;
      figma.moveLocalTextStyleAfter(style, previous);
      previous = style;
    }
    return previous;
  }
  async function reorderAllLocalTextStyles(stylesByName) {
    await reorderLocalTextStyles(stylesByName, OG_STYLE_KEYS, "OG", null);
    await reorderLocalTextStyles(stylesByName, TD_STYLE_KEYS, "TD", null);
  }
  async function ensurePaletteColorVariables() {
    var _a;
    const col = await getPrimitivesCollection();
    const modeId = col.modes[0].modeId;
    const byName = new Map(
      (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v])
    );
    const tdRename = {
      "color/TD/dag": "color/TD/day",
      "color/TD/natt": "color/TD/night",
      "color/TD/sno": "color/TD/snow",
      "color/TD/sasong-var": "color/TD/season-spring",
      "color/TD/sasong-sommar": "color/TD/season-summer",
      "color/TD/sasong-host": "color/TD/season-autumn",
      "color/TD/sasong-vinter": "color/TD/season-winter"
    };
    for (const [oldName, newName] of Object.entries(tdRename)) {
      const oldVar = byName.get(oldName);
      if (!oldVar || oldVar.variableCollectionId !== col.id) continue;
      if (((_a = byName.get(newName)) == null ? void 0 : _a.variableCollectionId) === col.id) {
        oldVar.remove();
        byName.delete(oldName);
        continue;
      }
      oldVar.name = newName;
      byName.delete(oldName);
      byName.set(newName, oldVar);
    }
    for (const brand of ["OG", "TD"]) {
      for (const [token, hex] of Object.entries(COLOR_PALETTE[brand])) {
        const name = paletteVariableName(brand, token);
        let v = byName.get(name);
        if (!v) {
          v = figma.variables.createVariable(name, col, "COLOR");
          byName.set(name, v);
        }
        if (v.resolvedType !== "COLOR") throw new Error(`${name} m\xE5ste vara COLOR`);
        v.setValueForMode(modeId, __spreadProps(__spreadValues({}, hexToFigmaRgb(hex)), { a: 1 }));
      }
    }
    for (const [token, hex] of Object.entries(SHARED_COLOR_PALETTE)) {
      const name = sharedPaletteVariableName(token);
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "COLOR");
        byName.set(name, v);
      }
      if (v.resolvedType !== "COLOR") throw new Error(`${name} m\xE5ste vara COLOR`);
      v.setValueForMode(modeId, __spreadProps(__spreadValues({}, hexToFigmaRgb(hex)), { a: 1 }));
      v.description = "Systemf\xE4rg \u2014 identisk OG och TD.";
    }
  }
  async function syncColorPaintStyles() {
    const varByName = new Map(
      (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v])
    );
    const paintByName = new Map(
      (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s])
    );
    const results = [];
    for (const brand of ["OG", "TD"]) {
      for (const token of PAINT_STYLE_TOKENS[brand]) {
        const hex = COLOR_PALETTE[brand][token];
        if (!hex) {
          results.push({
            styleName: paintStyleName(brand, token),
            ok: false,
            message: `Token saknas i COLOR_PALETTE: ${token}`
          });
          continue;
        }
        const name = paintStyleName(brand, token);
        const varName = paletteVariableName(brand, token);
        const variable = varByName.get(varName);
        let style = paintByName.get(name);
        if (!style) {
          style = figma.createPaintStyle();
          style.name = name;
          paintByName.set(name, style);
        }
        try {
          style.paints = [
            {
              type: "SOLID",
              color: hexToFigmaRgb(hex),
              opacity: 1
            }
          ];
          if (variable && typeof style.setBoundVariable === "function") {
            style.setBoundVariable("paints", variable);
          }
          results.push({ styleName: name, ok: true });
        } catch (e) {
          results.push({
            styleName: name,
            ok: false,
            message: e instanceof Error ? e.message : String(e)
          });
        }
      }
    }
    return results;
  }
  function isSolidFillNode(node) {
    return "fills" in node && "fillStyleId" in node;
  }
  function bindNodeToPaintStyle(node, style) {
    node.fillStyleId = style.id;
  }
  function bindNodeFillToVariable(node, variable) {
    const base = { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
    node.fillStyleId = "";
    node.fills = [figma.variables.setBoundVariableForPaint(base, "color", variable)];
  }
  async function bindFoundationColorSwatches() {
    const page = await getFoundationsPage();
    const paintByName = new Map(
      (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s])
    );
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVars = await figma.variables.getLocalVariablesAsync();
    const results = [];
    for (const prefix of ["OG", "TD"]) {
      const frame = page.findOne((n) => n.name === `${prefix} \u2014 Foundations exempel`);
      const colorSec = frame == null ? void 0 : frame.findOne((n) => n.name === "F\xE4rger \u2014 semantiska och primitiver");
      if (!colorSec) {
        results.push({
          styleName: `${prefix}/swatches`,
          ok: false,
          message: "F\xE4rgsektion saknas"
        });
        continue;
      }
      const semanticCol = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[prefix]);
      const semanticVarByKey = /* @__PURE__ */ new Map();
      if (semanticCol) {
        for (const v of allVars) {
          if (v.variableCollectionId !== semanticCol.id) continue;
          if (!v.name.startsWith("color/")) continue;
          semanticVarByKey.set(v.name.slice("color/".length), v);
        }
      }
      const swatchMap = SWATCH_DISPLAY_TO_TOKEN[prefix];
      for (const node of colorSec.findAll((n) => n.name.startsWith("Swatch "))) {
        if (!isSolidFillNode(node)) continue;
        const display = node.name.slice("Swatch ".length);
        if (display.startsWith("row ")) continue;
        const token = swatchMap[display];
        if (!token) {
          results.push({
            styleName: node.name,
            ok: false,
            message: `Ingen palette-token f\xF6r ${prefix}/${display}`
          });
          continue;
        }
        const style = paintByName.get(paintStyleName(prefix, token));
        if (!style) {
          results.push({
            styleName: paintStyleName(prefix, token),
            ok: false,
            message: "Paint style saknas \u2014 k\xF6r f\xE4rgsynk f\xF6rst"
          });
          continue;
        }
        try {
          bindNodeToPaintStyle(node, style);
          results.push({ styleName: style.name, ok: true });
        } catch (e) {
          results.push({
            styleName: style.name,
            ok: false,
            message: e instanceof Error ? e.message : String(e)
          });
        }
      }
      for (const node of colorSec.findAll((n) => n.name.startsWith("Chip "))) {
        if (!isSolidFillNode(node)) continue;
        const suffix = node.name.slice("Chip ".length);
        if (suffix === "Bakgrund overlay" && prefix === "TD") {
          const variable2 = semanticVarByKey.get("bg-overlay");
          if (!variable2) {
            results.push({
              styleName: "color/bg-overlay",
              ok: false,
              message: "Variabel saknas i TD / Semantic"
            });
            continue;
          }
          try {
            bindNodeFillToVariable(node, variable2);
            results.push({ styleName: "color/bg-overlay", ok: true });
          } catch (e) {
            results.push({
              styleName: "color/bg-overlay",
              ok: false,
              message: e instanceof Error ? e.message : String(e)
            });
          }
          continue;
        }
        const varKey = SEMANTIC_CHIP_TO_VAR[suffix];
        if (!varKey) {
          results.push({
            styleName: node.name,
            ok: false,
            message: "Ingen semantisk mappning"
          });
          continue;
        }
        const variable = semanticVarByKey.get(varKey);
        if (!variable) {
          results.push({
            styleName: `color/${varKey}`,
            ok: false,
            message: `Variabel saknas i ${SEMANTIC_COLLECTION_NAME[prefix]}`
          });
          continue;
        }
        try {
          bindNodeFillToVariable(node, variable);
          results.push({ styleName: `color/${varKey}`, ok: true });
        } catch (e) {
          results.push({
            styleName: `color/${varKey}`,
            ok: false,
            message: e instanceof Error ? e.message : String(e)
          });
        }
      }
    }
    return results;
  }
  async function ensureContrastPairVariables() {
    var _a, _b, _c;
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVars = await figma.variables.getLocalVariablesAsync();
    const primByName = new Map(
      allVars.filter((v) => v.name.startsWith("color/OG/") || v.name.startsWith("color/TD/")).map((v) => [v.name, v])
    );
    const specs = [
      { brand: "OG", pairs: OG_CONTRAST_PAIRS },
      { brand: "TD", pairs: TD_CONTRAST_PAIRS }
    ];
    for (const { brand, pairs } of specs) {
      const col = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[brand]);
      if (!col) continue;
      const modeId = col.modes[0].modeId;
      const inCol = new Map(
        allVars.filter((v) => v.variableCollectionId === col.id).map((v) => [v.name, v])
      );
      for (const pair of pairs) {
        const name = contrastOnVariableName(pair.bg);
        const target = primByName.get(paletteVariableName(brand, pair.text));
        if (!target) continue;
        let v = inCol.get(name);
        if (!v) {
          v = figma.variables.createVariable(name, col, "COLOR");
          inCol.set(name, v);
          allVars.push(v);
        }
        v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: target.id });
        v.description = pair.status === "verified-with-restriction" ? `RESTRICTED ${(_a = pair.contrastRatio) != null ? _a : ""}:1 \u2014 ${(_b = pair.note) != null ? _b : ""}`.trim() : pair.status === "unverified" ? `UNVERIFIED: text p\xE5 ${pair.label} \u2192 ${pair.textLabel}. ${(_c = pair.note) != null ? _c : ""}`.trim() : `Text p\xE5 ${pair.label} \u2192 ${pair.textLabel}${pair.note ? `. ${pair.note}` : ""}`;
      }
    }
  }
  async function bindFoundationContrastPairs() {
    var _a;
    const page = await getFoundationsPage();
    const paintByName = new Map(
      (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s])
    );
    const allVars = await figma.variables.getLocalVariablesAsync();
    const primByName = new Map(
      allVars.filter((v) => v.name.startsWith("color/OG/") || v.name.startsWith("color/TD/")).map((v) => [v.name, v])
    );
    const results = [];
    const board = page.findOne((n) => n.name === "TD \u2014 Kontrastpar");
    if (!board) {
      results.push({ styleName: "TD \u2014 Kontrastpar", ok: false, message: "Artboard saknas" });
      return results;
    }
    for (const pair of TD_CONTRAST_GRID) {
      const id = (_a = pair.id) != null ? _a : pair.bg;
      const card = board.findOne((n) => n.name === `Pair TD/${id}`);
      if (!card || !isSolidFillNode(card)) {
        results.push({ styleName: `Pair TD/${id}`, ok: false, message: "Cell saknas" });
        continue;
      }
      const paint = paintByName.get(paintStyleName("TD", pair.bg));
      if (paint) bindNodeToPaintStyle(card, paint);
      const textVar = primByName.get(paletteVariableName("TD", pair.text));
      if (textVar) {
        for (const t of card.findAll((n) => n.type === "TEXT")) {
          bindNodeFillToVariable(t, textVar);
        }
      }
      results.push({ styleName: `Pair TD/${id}`, ok: true });
    }
    return results;
  }
  async function removeObsoleteWeightVariables() {
    let removed = 0;
    for (const v of await figma.variables.getLocalVariablesAsync()) {
      if (!v.name.startsWith("font/weight/")) continue;
      v.remove();
      removed++;
    }
    return removed;
  }
  async function getPrimitivesCollection() {
    const col = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (c) => c.name === PRIMITIVES_COLLECTION
    );
    if (!col) throw new Error(`Variabelcollection '${PRIMITIVES_COLLECTION}' saknas.`);
    return col;
  }
  async function ensureTypographyVariables() {
    const col = await getPrimitivesCollection();
    const modeId = col.modes[0].modeId;
    const byName = new Map(
      (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v])
    );
    for (const { name, value } of allStyleVariableSpecs()) {
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "STRING");
        byName.set(name, v);
      }
      if (v.resolvedType !== "STRING") throw new Error(`${name} m\xE5ste vara STRING`);
      v.setValueForMode(modeId, value);
    }
    for (const [key, percent] of Object.entries(LEADING_FIGMA_PERCENT)) {
      const name = leadingVariableName(key);
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "FLOAT");
        byName.set(name, v);
      }
      v.setValueForMode(modeId, percent);
    }
    for (const [key, px] of Object.entries(FONT_SIZE_PX)) {
      const name = `font/size/${key}`;
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "FLOAT");
        byName.set(name, v);
      }
      v.setValueForMode(modeId, px);
    }
    for (const [key, px] of Object.entries(TRACKING_FIGMA_PX)) {
      const name = trackingVariableName(key);
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "FLOAT");
        byName.set(name, v);
      }
      v.setValueForMode(modeId, px);
    }
    for (const [brand, roles] of Object.entries({
      OG: ["primary", "secondary"],
      TD: ["primary", "secondary"]
    })) {
      for (const role of roles) {
        const name = `font/family/${brand}/${role}`;
        const familyKey = `${brand}.${role}`;
        let v = byName.get(name);
        if (!v) {
          v = figma.variables.createVariable(name, col, "STRING");
          byName.set(name, v);
        }
        v.setValueForMode(modeId, figmaFamilyVariableValue(familyKey));
      }
    }
    const allowedStyleVars = new Set(allStyleVariableSpecs().map((s) => s.name));
    for (const v of [...byName.values()]) {
      if (!v.name.startsWith("font/style/TD/")) continue;
      if (allowedStyleVars.has(v.name)) continue;
      v.remove();
      byName.delete(v.name);
    }
  }
  async function ensureFloatVariable(col, byName, name, modeId, value) {
    let v = byName.get(name);
    if (!v || v.variableCollectionId !== col.id) {
      v = figma.variables.createVariable(name, col, "FLOAT");
      byName.set(name, v);
    }
    if (v.resolvedType !== "FLOAT") throw new Error(`${name} m\xE5ste vara FLOAT`);
    v.setValueForMode(modeId, value);
  }
  async function ensureSpacingCollection() {
    var _a, _b;
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    let col = collections.find((c) => c.name === SPACING_COLLECTION);
    if (!col) {
      col = figma.variables.createVariableCollection(SPACING_COLLECTION);
    }
    if (!col.modes.some((m) => m.name === "OG")) {
      col.renameMode(col.modes[0].modeId, "OG");
    }
    if (!col.modes.some((m) => m.name === "TD")) {
      if (col.modes.length === 1) {
        col.addMode("TD");
      } else {
        const other = col.modes.find((m) => m.name !== "OG");
        if (other) col.renameMode(other.modeId, "TD");
        else col.addMode("TD");
      }
    }
    const modeOg = (_a = col.modes.find((m) => m.name === "OG")) == null ? void 0 : _a.modeId;
    const modeTd = (_b = col.modes.find((m) => m.name === "TD")) == null ? void 0 : _b.modeId;
    if (!modeOg || !modeTd) throw new Error("Spacing-collection saknar mode OG eller TD.");
    return { col, modeOg, modeTd };
  }
  async function ensureLayoutVariables() {
    var _a, _b;
    const { col: spaceCol, modeOg, modeTd } = await ensureSpacingCollection();
    const prim = await getPrimitivesCollection();
    const primMode = prim.modes[0].modeId;
    const byName = new Map(
      (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v])
    );
    for (const [from, to] of Object.entries(SPACE_RENAME_FROM_NUMERIC)) {
      const oldName = `space/${from}`;
      const newName = spaceVariableName(to);
      const oldVar = byName.get(oldName);
      if (!oldVar || oldVar.variableCollectionId !== spaceCol.id) continue;
      if (((_a = byName.get(newName)) == null ? void 0 : _a.variableCollectionId) === spaceCol.id) {
        oldVar.remove();
        byName.delete(oldName);
        continue;
      }
      oldVar.name = newName;
      byName.delete(oldName);
      byName.set(newName, oldVar);
    }
    for (const [oldName, newName] of Object.entries(SPACE_RENAME_FROM_SLASH)) {
      const oldVar = byName.get(oldName);
      if (!oldVar || oldVar.variableCollectionId !== spaceCol.id) continue;
      if (((_b = byName.get(newName)) == null ? void 0 : _b.variableCollectionId) === spaceCol.id) {
        oldVar.remove();
        byName.delete(oldName);
        continue;
      }
      oldVar.name = newName;
      byName.delete(oldName);
      byName.set(newName, oldVar);
    }
    for (const step of SPACE_STEPS) {
      const name = spaceVariableName(step);
      let v = byName.get(name);
      if (!v || v.variableCollectionId !== spaceCol.id) {
        v = figma.variables.createVariable(name, spaceCol, "FLOAT");
        byName.set(name, v);
      }
      if (v.resolvedType !== "FLOAT") throw new Error(`${name} m\xE5ste vara FLOAT`);
      v.setValueForMode(modeOg, SPACE_PX[step].OG);
      v.setValueForMode(modeTd, SPACE_PX[step].TD);
    }
    for (const [key, px] of Object.entries(RADIUS_PX)) {
      await ensureFloatVariable(prim, byName, radiusVariableName(key), primMode, px);
    }
    for (const [key, px] of Object.entries(STROKE_PX)) {
      const name = strokeVariableName(key);
      await ensureFloatVariable(prim, byName, name, primMode, px);
      const v = byName.get(name);
      if (v) {
        v.scopes = ["STROKE_FLOAT"];
        v.description = `${px}px`;
      }
    }
    for (const [key, px] of Object.entries(BREAKPOINT_PX)) {
      await ensureFloatVariable(prim, byName, breakpointVariableName(key), primMode, px);
    }
    for (const [key, z] of Object.entries(Z_INDEX)) {
      await ensureFloatVariable(prim, byName, zVariableName(key), primMode, z);
    }
  }
  async function applyTypographyMigrations() {
    const page = await getFoundationsPage();
    const styles = new Map(
      (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s])
    );
    for (const prefix of ["OG", "TD"]) {
      const frame = page.findOne((n) => n.name === `${prefix} \u2014 Foundations exempel`);
      const typoSec = frame == null ? void 0 : frame.findOne((n) => n.name === "Typografi \u2014 text styles");
      if (!typoSec) continue;
      if (prefix === "OG" || prefix === "TD") {
        await removeDisplayArtifacts(prefix, typoSec, styles);
      }
      await migrateLegacyLeadNames(prefix, typoSec, styles);
      if (prefix === "OG") {
        await migrateLegacyOgEyebrowNames(typoSec, styles);
      }
      if (prefix === "TD") {
        await migrateLegacyTdEyebrowNames(typoSec, styles);
      }
      const keys = prefix === "OG" ? OG_STYLE_KEYS : TD_STYLE_KEYS;
      await removeRetiredTypographyStyles(prefix, keys, typoSec, styles);
      await ensureDerivedTypographyArtifacts(prefix, typoSec, styles);
      ensureCanonicalTextStyles(prefix, keys, styles);
    }
    await reorderAllLocalTextStyles(styles);
  }
  async function bindAllLocalTextStyles() {
    const varMap = await loadVariableMap();
    const styles = await figma.getLocalTextStylesAsync();
    const results = [];
    for (const style of styles) {
      const parsed = parseStyleName(style.name);
      if (!parsed) continue;
      const def = parsed.prefix === "OG" ? OG_STYLE_DEFS[parsed.key] : TD_STYLE_DEFS[parsed.key];
      if (!def) {
        style.remove();
        results.push({
          styleName: style.name,
          ok: true,
          message: "Borttagen (ingen mappning \u2014 utfasad stil)"
        });
        continue;
      }
      try {
        await bindOneStyle(style, def, varMap);
        results.push({ styleName: style.name, ok: true });
      } catch (e) {
        results.push({
          styleName: style.name,
          ok: false,
          message: e instanceof Error ? e.message : String(e)
        });
      }
    }
    return results;
  }
  function parseStyleName(name) {
    const m = /^(OG|TD)\/(.+)$/.exec(name);
    if (!m) return null;
    return { prefix: m[1], key: m[2] };
  }
  async function loadVariableMap() {
    const vars = await figma.variables.getLocalVariablesAsync();
    return new Map(vars.map((v) => [v.name, v]));
  }
  function requireVar(varMap, name) {
    const v = varMap.get(name);
    if (!v) throw new Error(`Variabel saknas: ${name}`);
    return v;
  }
  async function bindOneStyle(style, def, varMap) {
    const apply = () => {
      var _a;
      style.setBoundVariable("fontWeight", null);
      style.setBoundVariable("lineHeight", null);
      const familyVar = requireVar(varMap, familyVariableName(def.family));
      style.setBoundVariable("fontFamily", familyVar);
      const styleVar = requireVar(varMap, styleVariableName(def.family, def.weight));
      style.setBoundVariable("fontStyle", styleVar);
      const sizeVar = requireVar(varMap, `font/size/${def.size}`);
      style.setBoundVariable("fontSize", sizeVar);
      style.lineHeight = {
        unit: "PERCENT",
        value: LEADING_FIGMA_PERCENT[def.leading]
      };
      const tracking = (_a = def.tracking) != null ? _a : "normal";
      const trackingVar = requireVar(varMap, trackingVariableName(tracking));
      style.setBoundVariable("letterSpacing", trackingVar);
      style.textCase = def.textCase === "uppercase" ? "UPPER" : "ORIGINAL";
      style.leadingTrim = def.leadingTrim === "CAP_HEIGHT" ? "CAP_HEIGHT" : "NONE";
    };
    await loadFontsForStyleDef(def);
    try {
      await figma.loadFontAsync(style.fontName);
      apply();
      await figma.loadFontAsync(style.fontName);
    } catch (e) {
      apply();
    }
  }
  var CONCEPT_TEXT_STYLE_BY_ID = {
    "274:12": "OG/heading-2",
    "274:30": "OG/heading-2",
    "274:48": "OG/heading-4",
    "274:50": "OG/heading-4",
    "274:39": "TD/heading-1",
    "274:40": "TD/lead",
    "274:44": "TD/heading-1",
    "274:53": "TD/heading-1",
    "274:54": "TD/heading-1",
    "274:55": "TD/heading-2",
    "274:56": "TD/body-sm",
    "274:57": "TD/heading-1"
  };
  function pickConceptTextStyleName(node, stylesByName) {
    const explicit = CONCEPT_TEXT_STYLE_BY_ID[node.id];
    if (explicit && stylesByName.has(explicit)) return explicit;
    if (node.fontName === figma.mixed || node.fontSize === figma.mixed) return null;
    const family = node.fontName.family;
    const style = node.fontName.style;
    const size = node.fontSize;
    const isBold = /bold/i.test(style);
    const isItalic = /italic/i.test(style);
    const isRegular = /regular|book/i.test(style);
    if (family.includes("Literata")) {
      if (isItalic) return size >= 28 ? "OG/quote" : "OG/quote-sm";
      if (size >= 84) return "OG/heading-1";
      if (size >= 54) return "OG/heading-2";
      if (size >= 42) return "OG/heading-3";
      if (size >= 32) return "OG/heading-4";
      if (size >= 21) return "OG/heading-5";
      if (size >= 17) return "OG/heading-6";
      return "OG/lead-sm";
    }
    if (family.includes("Radio Canada")) {
      if (node.textCase === "UPPER") return size >= 18 ? "OG/eyebrow" : "OG/eyebrow-sm";
      if (/semi/i.test(style)) return "OG/intro";
      if (size >= 16) return "OG/body";
      return "OG/body-sm";
    }
    if (family.includes("Superclarendon")) {
      if (isRegular && !isBold) {
        return size >= 18 ? "TD/lead" : "TD/lead-sm";
      }
      if (size >= 80) return "TD/heading-1";
      if (size >= 54) return "TD/heading-2";
      if (size >= 42) return "TD/heading-3";
      if (size >= 32) return "TD/heading-4";
      if (size >= 21) return "TD/heading-5";
      return "TD/heading-6";
    }
    if (family.includes("Circular")) {
      if (isBold) {
        if (size >= 18) return "TD/eyebrow";
        if (size >= 15) return "TD/cta";
        return "TD/nav";
      }
      return size >= 16 ? "TD/body" : "TD/body-sm";
    }
    return null;
  }
  async function getConceptPage() {
    await figma.loadAllPagesAsync();
    const page = figma.root.children.find((p) => p.name === "Concept");
    if (!page) return null;
    await page.loadAsync();
    return page;
  }
  async function bindConceptPageTextStyles() {
    const page = await getConceptPage();
    if (!page) {
      return [{ styleName: "Concept", ok: false, message: "Sida saknas" }];
    }
    const stylesByName = new Map(
      (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s])
    );
    const styleNameById = new Map(
      [...stylesByName.values()].map((s) => [s.id, s.name])
    );
    const results = [];
    for (const node of page.findAll((n) => n.type === "TEXT")) {
      if (node.name.startsWith("Notis")) continue;
      if (node.fontName !== figma.mixed && node.fontName.family === "Inter") continue;
      const currentStyleName = typeof node.textStyleId === "string" ? styleNameById.get(node.textStyleId) : void 0;
      if ((currentStyleName == null ? void 0 : currentStyleName.startsWith("OG/")) || (currentStyleName == null ? void 0 : currentStyleName.startsWith("TD/"))) {
        results.push({ styleName: `${currentStyleName} \u2190 ${node.name}`, ok: true, message: "redan bunden" });
        continue;
      }
      const styleName = pickConceptTextStyleName(node, stylesByName);
      const style = styleName ? stylesByName.get(styleName) : void 0;
      if (!style || !styleName) {
        results.push({
          styleName: node.name,
          ok: false,
          message: "Ingen text style-mappning"
        });
        continue;
      }
      try {
        const parsed = parseStyleName(styleName);
        const def = parsed ? parsed.prefix === "OG" ? OG_STYLE_DEFS[parsed.key] : TD_STYLE_DEFS[parsed.key] : void 0;
        if (def) {
          try {
            await loadFontsForStyleDef(def);
          } catch (e) {
          }
        }
        if (node.fontName !== figma.mixed) {
          try {
            await figma.loadFontAsync(node.fontName);
          } catch (e) {
          }
        }
        try {
          await figma.loadFontAsync(style.fontName);
        } catch (e) {
        }
        await node.setTextStyleIdAsync(style.id);
        results.push({ styleName: `${styleName} \u2190 ${node.name}`, ok: true });
      } catch (e) {
        results.push({
          styleName: `${styleName} \u2190 ${node.name}`,
          ok: false,
          message: e instanceof Error ? e.message : String(e)
        });
      }
    }
    return results;
  }
  async function ensureSharedSemanticColorAliases() {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVars = await figma.variables.getLocalVariablesAsync();
    const errorPrim = allVars.find((v) => v.name === "color/error");
    const onErrorPrim = allVars.find((v) => v.name === "color/on-error");
    if (!errorPrim || !onErrorPrim) return;
    for (const brand of ["OG", "TD"]) {
      const col = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[brand]);
      if (!col) continue;
      const modeId = col.modes[0].modeId;
      const inCol = new Map(
        allVars.filter((v) => v.variableCollectionId === col.id).map((v) => [v.name, v])
      );
      for (const [name, target] of [
        ["color/error", errorPrim],
        ["color/on-error", onErrorPrim]
      ]) {
        let v = inCol.get(name);
        if (!v) {
          v = figma.variables.createVariable(name, col, "COLOR");
          inCol.set(name, v);
          allVars.push(v);
        }
        v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: target.id });
        v.description = "Systemf\xE4rg \u2014 identisk hex i OG och TD.";
      }
    }
  }
  async function runFullSync() {
    await removeObsoleteWeightVariables();
    await ensureTypographyVariables();
    await ensureLayoutVariables();
    await ensurePaletteColorVariables();
    await ensureSharedSemanticColorAliases();
    await ensureContrastPairVariables();
    await applyTypographyMigrations();
    const results = [
      ...await syncColorPaintStyles(),
      ...await bindFoundationColorSwatches(),
      ...await bindFoundationContrastPairs(),
      ...await bindAllLocalTextStyles(),
      ...await updateFoundationSpecimens(),
      ...await bindConceptPageTextStyles()
    ];
    const failed = results.filter((r) => !r.ok);
    const summary = failed.length === 0 ? `Synk: ${results.length} ok.` : `Synk: ${results.length - failed.length} ok, ${failed.length} misslyckades.`;
    return { summary, results };
  }

  // src/code.ts
  figma.showUI(ui_default, { width: 340, height: 420, themeColors: true });
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "updateSpecimens") {
      try {
        const results = await updateFoundationSpecimens();
        postDone(results, "Specimens");
      } catch (e) {
        postError(e);
      }
      return;
    }
    if (msg.type === "syncColors") {
      try {
        const results = [
          ...await syncColorPaintStyles(),
          ...await bindFoundationColorSwatches(),
          ...await bindFoundationContrastPairs()
        ];
        postDone(results, "F\xE4rgstilar");
      } catch (e) {
        postError(e);
      }
      return;
    }
    if (msg.type === "bindConcept") {
      try {
        const results = await bindConceptPageTextStyles();
        postDone(results, "Concept-text");
      } catch (e) {
        postError(e);
      }
      return;
    }
    if (msg.type === "sync") {
      try {
        const { summary, results } = await runFullSync();
        postDone(results, "Synk");
      } catch (e) {
        postError(e);
      }
    }
  };
  function postDone(results, label) {
    const failed = results.filter((r) => !r.ok);
    const summary = failed.length === 0 ? `${label}: ${results.length} ok.` : `${label}: ${results.length - failed.length} ok, ${failed.length} misslyckades.`;
    figma.ui.postMessage({ type: "done", results, summary });
    figma.notify(summary, failed.length ? { error: true } : void 0);
  }
  function postError(e) {
    const message = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: "error", message });
    figma.notify(message, { error: true });
  }
})();
