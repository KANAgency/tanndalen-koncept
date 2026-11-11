"use strict";
var __designSystemSync = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/remote-sync.ts
  var remote_sync_exports = {};
  __export(remote_sync_exports, {
    default: () => remote_sync_default
  });

  // src/color-defs.ts
  var COLOR_PALETTE = {
    OG: {
      "off-white": "#F5EEE5",
      "dark-green": "#003E3A",
      "orsa-black": "#3C3C3B",
      black: "#000000",
      white: "#FFFFFF",
      "signal-orange": "#E74011"
    },
    TD: {
      natt: "#24272A",
      dag: "#EBE8E5",
      sno: "#FFFFFF",
      accent: "#BF6A15",
      cta: "#AE6113",
      "sasong-var": "#F6E0A2",
      "sasong-sommar": "#1B4021",
      "sasong-host": "#3C1F17",
      "sasong-vinter": "#A1B5BA"
    }
  };
  function paintStyleName(brand, token) {
    return `${brand}/${token}`;
  }
  function paletteVariableName(brand, token) {
    return `color/${brand}/${token}`;
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

  // src/specimen-texts.ts
  var SPECIMEN_REFERENCE_TEXTS = {
    OG: {
      "heading-1": "Upplev mer",
      "heading-2": "Betala mindre",
      "heading-3": "Vinter i Dalarna",
      "heading-4": "Barnens b\xE4sta vinterveckor",
      "heading-5": "Sportlov i skidparadiset",
      "heading-6": "Nyheter vinter 2026/27",
      "heading-7": "Skid\xE5kning f\xF6r familjen",
      "heading-8": "Kombikort & skipass",
      "heading-9": "Inf\xF6r ditt bes\xF6k",
      lead: "Boka boende och spara p\xE5 kombikort och skipass.",
      "lead-sm": "G\xE4ller vid boendebokning vinter 2026/27.",
      quote: "Dalarna bjuder p\xE5 vinter som stannar kvar.",
      "quote-sm": "Mer tid i backen \u2014 mindre i k\xF6n.",
      body: "Sportloven h\xE4r i hj\xE4rtat av Dalarna bjuder p\xE5 skid\xE5kning i sp\xE5r och backar. Till vintern finns en rad nyheter som sn\xF6s\xF6kerhet, mer skid\xE5kning och en helt ny inomhusmilj\xF6 f\xF6r barn.",
      "body-sm": "G\xE4ller vid boendebokning vinter 2026/27.",
      cta: "Boka nu",
      nav: "Skipass",
      label: "Pris fr\xE5n 5 490 kr",
      caption: "Nyhet! Lekmilj\xF6n i Bl\xE5b\xE4rslyan utvecklas och erbjuder nya aktiviteter."
    },
    TD: {
      "heading-1": "Fj\xE4lltagen",
      "heading-2": "Fj\xE4lltagen",
      "heading-3": "Fj\xE4lltagen",
      "heading-4": "\xC4kta fj\xE4llsemester",
      "heading-5": "Skid\xE5kning i T\xE4nndalen",
      "heading-6": "Hamra Syd",
      "heading-7": "Skid\xE5kning i T\xE4nndalen",
      "heading-8": "Hamra Syd",
      "heading-9": "Hamra Syd",
      display: "Fj\xE4lltagen",
      lead: "Stunder som stannar kvar i T\xE4nndalen.",
      "lead-sm": "Spara 15 % p\xE5 liftkort bokat i f\xF6rv\xE4g.",
      quote: "Fj\xE4llvinden rensar tankarna \u2014 skrattet i backen v\xE4xer.",
      "quote-sm": "\xC4kta fj\xE4llsemester, utan att stressa hem.",
      body: "T\xE4nndalen \xE4r en del av Fun\xE4sfj\xE4llen \u2013 Sveriges mest omtyckta fj\xE4llomr\xE5de. \xC4r man omtyckt, s\xE5 g\xE4ller det att ha en stor famn.",
      "body-sm": "Mer skid\xE5kning till b\xE4ttre pris. Boka ditt 6\u201314 dagars liftkort minst 30 dagar i f\xF6rv\xE4g och spara 15 %.",
      cta: "Boka",
      nav: "Utf\xF6rs\xE5kning",
      label: "Pris fr. 7 395 :-",
      caption: "Spana in hur det ser ut i T\xE4nndalen just nu!"
    }
  };

  // src/style-defs.ts
  var LEADING_FIGMA_PERCENT = {
    tight: 110,
    snug: 125,
    relaxed: 140,
    normal: 150
  };
  var TRACKING_FIGMA_PX = {
    normal: 0,
    snug: -1,
    tight: -2,
    tighter: -3,
    tightest: -4
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
      primary: "Erode Variable",
      secondary: "Switzer Variable"
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
      bold: "Bold",
      semibold: "Semibold",
      medium: "Semibold",
      italic: "Italic"
    },
    "TD.secondary": {
      regular: "Regular",
      italic: "Italic",
      medium: "Medium",
      semibold: "Semibold"
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
    "heading-7",
    "heading-8",
    "heading-9",
    "lead",
    "lead-sm",
    "quote",
    "quote-sm",
    "body",
    "body-sm",
    "cta",
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
    "heading-7",
    "heading-8",
    "heading-9",
    "display",
    "lead",
    "lead-sm",
    "quote",
    "quote-sm",
    "body",
    "body-sm",
    "cta",
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
      size: "6xl",
      weight: "regular",
      leading: "tight",
      tracking: "tighter"
    },
    "heading-3": {
      family: "OG.primary",
      size: "5xl",
      weight: "regular",
      leading: "tight",
      tracking: "tight"
    },
    "heading-4": {
      family: "OG.primary",
      size: "4xl",
      weight: "regular",
      leading: "tight",
      tracking: "tight"
    },
    "heading-5": {
      family: "OG.primary",
      size: "3xl",
      weight: "regular",
      leading: "snug",
      tracking: "snug"
    },
    "heading-6": {
      family: "OG.primary",
      size: "2xl",
      weight: "regular",
      leading: "snug",
      tracking: "normal"
    },
    "heading-7": {
      family: "OG.primary",
      size: "xl",
      weight: "regular",
      leading: "relaxed",
      tracking: "normal"
    },
    "heading-8": {
      family: "OG.secondary",
      size: "lg",
      weight: "medium",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
    },
    "heading-9": {
      family: "OG.secondary",
      size: "md",
      weight: "medium",
      leading: "relaxed",
      tracking: "normal",
      textCase: "uppercase"
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
    cta: { family: "OG.secondary", size: "base", weight: "semibold", leading: "tight", tracking: "normal" },
    nav: { family: "OG.secondary", size: "sm", weight: "medium", leading: "tight", tracking: "normal" },
    label: { family: "OG.secondary", size: "xs", weight: "semibold", leading: "tight", tracking: "normal" },
    caption: { family: "OG.secondary", size: "xs", weight: "regular", leading: "normal", tracking: "normal" }
  };
  var TD_STYLE_DEFS = {
    "heading-1": { family: "TD.primary", size: "88", weight: "bold", leading: "tight", tracking: "normal" },
    "heading-2": { family: "TD.primary", size: "6xl", weight: "bold", leading: "tight", tracking: "normal" },
    "heading-3": { family: "TD.primary", size: "5xl", weight: "bold", leading: "tight", tracking: "normal" },
    "heading-4": { family: "TD.primary", size: "4xl", weight: "bold", leading: "tight", tracking: "normal" },
    "heading-5": { family: "TD.primary", size: "3xl", weight: "semibold", leading: "snug", tracking: "normal" },
    "heading-6": { family: "TD.primary", size: "2xl", weight: "medium", leading: "snug", tracking: "normal" },
    "heading-7": { family: "TD.primary", size: "xl", weight: "medium", leading: "relaxed", tracking: "normal" },
    "heading-8": { family: "TD.primary", size: "lg", weight: "medium", leading: "relaxed", tracking: "normal" },
    "heading-9": { family: "TD.primary", size: "md", weight: "medium", leading: "relaxed", tracking: "normal" },
    display: { family: "TD.primary", size: "5xl", weight: "bold", leading: "tight" },
    lead: { family: "TD.secondary", size: "md", weight: "medium", leading: "normal" },
    "lead-sm": { family: "TD.secondary", size: "sm", weight: "medium", leading: "normal" },
    quote: { family: "TD.secondary", size: "xl", weight: "italic", leading: "normal" },
    "quote-sm": { family: "TD.secondary", size: "lg", weight: "italic", leading: "normal" },
    body: { family: "TD.secondary", size: "base", weight: "regular", leading: "normal" },
    "body-sm": { family: "TD.secondary", size: "sm", weight: "regular", leading: "normal" },
    cta: { family: "TD.secondary", size: "base", weight: "semibold", leading: "tight" },
    nav: { family: "TD.secondary", size: "sm", weight: "medium", leading: "tight" },
    label: { family: "TD.secondary", size: "xs", weight: "semibold", leading: "tight" },
    caption: { family: "TD.secondary", size: "xs", weight: "regular", leading: "normal" }
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
      if (prefix === "OG") {
        await removeOgDisplayArtifacts(typoSec, styles);
      }
      await migrateLegacyLeadNames(prefix, typoSec, styles);
      await ensureDerivedTypographyArtifacts(prefix, typoSec, styles);
      const defs = prefix === "OG" ? OG_STYLE_DEFS : TD_STYLE_DEFS;
      const keys = prefix === "OG" ? OG_STYLE_KEYS : TD_STYLE_KEYS;
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
  async function removeOgDisplayArtifacts(typoSec, styles) {
    const displaySpec = typoSec.findOne((n) => n.name === "Specimen OG/display");
    if (displaySpec) displaySpec.remove();
    const displayStyle = styles.get("OG/display");
    if (displayStyle) {
      displayStyle.remove();
      styles.delete("OG/display");
    }
  }
  var LEGACY_LEAD_RENAMES = [
    ["lead-1", "lead"],
    ["lead-2", "lead-sm"]
  ];
  async function migrateLegacyLeadNames(prefix, typoSec, styles) {
    for (const [oldKey, newKey] of LEGACY_LEAD_RENAMES) {
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
    styles.set(targetName, created);
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
    await ensureTextStyleClone(prefix, "quote", "lead", styles);
    await ensureTextStyleClone(prefix, "quote-sm", "lead-sm", styles);
    await ensureSpecimenClone(typoSec, prefix, "quote", "lead");
    await ensureSpecimenClone(typoSec, prefix, "quote-sm", "lead-sm");
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
  async function syncColorPaintStyles() {
    const varByName = new Map(
      (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v])
    );
    const paintByName = new Map(
      (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s])
    );
    const results = [];
    for (const brand of ["OG", "TD"]) {
      for (const [token, hex] of Object.entries(COLOR_PALETTE[brand])) {
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
        results.push({ styleName: style.name, ok: false, message: `Ingen mappning f\xF6r ${parsed.key}` });
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
  async function runFullSync() {
    await removeObsoleteWeightVariables();
    await ensureTypographyVariables();
    const results = [
      ...await syncColorPaintStyles(),
      ...await bindAllLocalTextStyles(),
      ...await updateFoundationSpecimens()
    ];
    const failed = results.filter((r) => !r.ok);
    const summary = failed.length === 0 ? `Synk: ${results.length} ok.` : `Synk: ${results.length - failed.length} ok, ${failed.length} misslyckades.`;
    return { summary, results };
  }

  // src/remote-sync.ts
  var remote_sync_default = runFullSync;
  return __toCommonJS(remote_sync_exports);
})();

return await __designSystemSync.default();