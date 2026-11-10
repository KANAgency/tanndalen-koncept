/** Mirrors tokens/primitives.json → color.OG / color.TD */

export const COLOR_PALETTE: Record<"OG" | "TD", Record<string, string>> = {
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
    "neutral-strong": "#5D5A57",
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
    "neutral-subtlest": "#E0DFDE",
  },
};

export const SHARED_COLOR_PALETTE: Record<string, string> = {
  error: "#C42B2B",
  "on-error": "#FFFFFF",
};

/**
 * Paint styles = endast rå baspalett. Semantik/state = variabler only.
 * Kanonisk regel: tokens/FIGMA-PRAXIS.md
 */
export const PAINT_STYLE_TOKENS: Record<"OG" | "TD", readonly string[]> = {
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
    "neutral-strong",
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
    "neutral-strong",
  ],
};

/**
 * Paint styles i Figma behåller svenska TD-namn medan variabler är engelska.
 * Variabelnyckel → paint-style-suffix under `TD/`.
 */
export const TD_PAINT_STYLE_ALIAS: Record<string, string> = {
  night: "natt",
  day: "dag",
  snow: "sno",
  "season-spring": "sasong-var",
  "season-summer": "sasong-sommar",
  "season-autumn": "sasong-host",
  "season-winter": "sasong-vinter",
};

export function sharedPaletteVariableName(token: string): string {
  return `color/${token}`;
}

export function sharedPaintStyleName(token: string): string {
  return token;
}

export function paintStyleName(brand: "OG" | "TD", token: string): string {
  if (brand === "TD" && TD_PAINT_STYLE_ALIAS[token]) {
    return `TD/${TD_PAINT_STYLE_ALIAS[token]}`;
  }
  return `${brand}/${token}`;
}

export function paletteVariableName(brand: "OG" | "TD", token: string): string {
  return `color/${brand}/${token}`;
}

/** Swatch frame names (`Swatch …`) → palette token key in COLOR_PALETTE. */
export const SWATCH_DISPLAY_TO_TOKEN: Record<"OG" | "TD", Record<string, string>> = {
  OG: {
    "Off-white": "off-white",
    Mörkgrön: "dark-green",
    "Orsa Black": "orsa-black",
    Signalfärg: "signal-orange",
    CTA: "cta",
    Vit: "white",
    Svart: "black",
  },
  TD: {
    Natt: "night",
    Dag: "day",
    Snö: "snow",
    Accent: "accent",
    CTA: "cta",
    Vår: "season-spring",
    Sommar: "season-summer",
    Höst: "season-autumn",
    Vinter: "season-winter",
  },
};

/** `Chip …` suffix → semantic variable name under `color/`. */
export const SEMANTIC_CHIP_TO_VAR: Record<string, string> = {
  "Bakgrund bas": "bg-base",
  "Bakgrund inverterad": "bg-inverted",
  "Bakgrund overlay": "bg-overlay",
  Frost: "frost",
  "Frost hover": "frost-hover",
  "Frost active": "frost-active",
  "Text primär": "text-primary",
  "Text inverterad": "text-inverted",
  "CTA primär": "cta-primary",
  "CTA on dark": "cta-on-dark",
  "On-cta-on-dark": "on-cta-on-dark",
  Accent: "accent",
  Error: "error",
  "On-error": "on-error",
};

export const SEMANTIC_COLLECTION_NAME: Record<"OG" | "TD", string> = {
  OG: "OG / Semantic",
  TD: "TD / Semantic",
};

export type ContrastPairDef = {
  bg: string;
  text: string;
  label: string;
  textLabel: string;
  status?: "unverified" | "verified-with-restriction";
  note?: string;
  /** Unikt kortnamn när samma bg har två texter (t.ex. natt-sno). Artboard-id kan vara svenska. */
  id?: string;
  /** WCAG-kontrast när uppmätt (t.ex. 3.25). */
  contrastRatio?: number;
};

/** TD bakgrund → godkänd text. Explicit tabell, inte luminance. Tokennycklar = engelska. */
export const TD_CONTRAST_PAIRS: readonly ContrastPairDef[] = [
  { bg: "night", text: "day", label: "Natt", textLabel: "Dag" },
  { bg: "season-summer", text: "day", label: "Sommar", textLabel: "Dag" },
  { bg: "season-autumn", text: "day", label: "Höst", textLabel: "Dag" },
  {
    bg: "cta",
    text: "snow",
    label: "Se mig",
    textLabel: "Snö",
    note: "Undantag — inte Dag",
  },
  { bg: "day", text: "night", label: "Dag", textLabel: "Natt" },
  { bg: "snow", text: "night", label: "Snö", textLabel: "Natt" },
  { bg: "season-spring", text: "night", label: "Vår", textLabel: "Natt" },
  { bg: "season-winter", text: "night", label: "Vinter", textLabel: "Natt" },
  {
    bg: "accent",
    text: "day",
    label: "Accent",
    textLabel: "Dag",
    status: "verified-with-restriction",
    contrastRatio: 3.25,
    note: "3.25:1 — endast icke-text (kantlinjer/badges/ikoner). Aldrig knappfyllning eller brödtext.",
  },
];

/** Visuell 3×3-ordning — `id` behåller svenska artboard-namn. */
export const TD_CONTRAST_GRID: readonly ContrastPairDef[] = [
  { id: "natt", bg: "night", text: "day", label: "Natt", textLabel: "Dag" },
  { id: "dag", bg: "day", text: "night", label: "Dag", textLabel: "Natt" },
  { id: "sasong-sommar", bg: "season-summer", text: "day", label: "Sommar", textLabel: "Dag" },
  { id: "sno", bg: "snow", text: "night", label: "Snö", textLabel: "Natt" },
  { id: "natt-sno", bg: "night", text: "snow", label: "Natt", textLabel: "Snö" },
  { id: "sasong-var", bg: "season-spring", text: "night", label: "Vår", textLabel: "Natt" },
  { id: "sasong-host", bg: "season-autumn", text: "day", label: "Höst", textLabel: "Dag" },
  { id: "sasong-vinter", bg: "season-winter", text: "night", label: "Vinter", textLabel: "Natt" },
  { id: "cta", bg: "cta", text: "snow", label: "Se mig", textLabel: "Snö", note: "Undantag — inte Dag" },
];

export const OG_CONTRAST_PAIRS: readonly ContrastPairDef[] = [
  { bg: "off-white", text: "orsa-black", label: "Off-white", textLabel: "Orsa Black" },
  { bg: "dark-green", text: "white", label: "Mörkgrön", textLabel: "Vit" },
];

export function contrastOnVariableName(bg: string): string {
  return `contrast/on-${bg}`;
}

export function hexToFigmaRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  if (h.length !== 6) throw new Error(`Invalid hex: ${hex}`);
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}
