/** Mirrors tokens/typography-styles-*.json — update when JSON changes. */

export type StyleDef = {
  family: string;
  size: string;
  weight: string;
  leading: "tight" | "snug" | "title" | "relaxed" | "normal";
  tracking?: "wide" | "normal" | "fine" | "snug" | "tight" | "tighter" | "tightest" | "compressed";
  textCase?: "uppercase";
  leadingTrim?: "CAP_HEIGHT";
  group?: "Editorial" | "UI";
};

/** Figma line-height variables (percent points). CSS uses unitless multipliers in JSON. */
export const LEADING_FIGMA_PERCENT: Record<StyleDef["leading"], number> = {
  tight: 110,
  snug: 125,
  title: 130,
  relaxed: 140,
  normal: 150,
};

/** Figma letter-spacing variables (px). CSS: --font-tracking-* */
export const TRACKING_FIGMA_PX: Record<NonNullable<StyleDef["tracking"]>, number> = {
  wide: -1,
  normal: 0,
  fine: -0.5,
  snug: -1,
  tight: -2,
  tighter: -3,
  tightest: -4,
  compressed: -5,
};

/** All font sizes in primitives.json (Shared / Primitives → font/size/*) */
export const FONT_SIZE_PX: Record<string, number> = {
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
  "7xl": 96,
};

/** family key e.g. OG.primary → font/family/OG/primary */
export function familyVariableName(familyKey: string): string {
  const dot = familyKey.indexOf(".");
  if (dot === -1) {
    throw new Error(`Invalid family key: ${familyKey}`);
  }
  const brand = familyKey.slice(0, dot);
  const role = familyKey.slice(dot + 1);
  return `font/family/${brand}/${role}`;
}

/** font/style/OG/primary/bold */
export function styleVariableName(familyKey: string, weight: string): string {
  const dot = familyKey.indexOf(".");
  if (dot === -1) throw new Error(`Invalid family key: ${familyKey}`);
  const brand = familyKey.slice(0, dot);
  const role = familyKey.slice(dot + 1);
  return `font/style/${brand}/${role}/${weight}`;
}

export function leadingVariableName(leading: StyleDef["leading"]): string {
  return `font/leading/${leading}`;
}

export function trackingVariableName(tracking: NonNullable<StyleDef["tracking"]>): string {
  return `font/tracking/${tracking}`;
}

export function tokenLineForStyle(def: StyleDef): string {
  const parts = [
    familyVariableName(def.family),
    `font/size/${def.size}`,
    styleVariableName(def.family, def.weight),
    leadingVariableName(def.leading),
  ];
  const tr = def.tracking ?? "normal";
  parts.push(trackingVariableName(tr));
  return parts.join(" · ");
}

/** Figma-installed family names. CSS uses primitives.font.family.*.value. */
export const FIGMA_FAMILY_STRING: Record<string, Record<string, string>> = {
  OG: {
    primary: "Literata",
    secondary: "Radio Canada Big",
  },
  TD: {
    primary: "Superclarendon",
    secondary: "CircularXX TT",
  },
};

export function figmaFamilyVariableValue(familyKey: string): string {
  const dot = familyKey.indexOf(".");
  if (dot === -1) throw new Error(`Invalid family key: ${familyKey}`);
  const brand = familyKey.slice(0, dot);
  const role = familyKey.slice(dot + 1);
  const v = FIGMA_FAMILY_STRING[brand]?.[role];
  if (!v) throw new Error(`Ingen Figma family för ${familyKey}`);
  return v;
}

const FIGMA_STYLE_BY_FAMILY_WEIGHT: Record<string, Record<string, string>> = {
  "OG.primary": {
    regular: "Regular",
    italic: "Italic",
    black: "Black",
    bold: "Bold",
    semibold: "SemiBold",
    medium: "Medium",
  },
  "OG.secondary": {
    regular: "Regular",
    italic: "Italic",
    medium: "Medium",
    semibold: "SemiBold",
  },
  "TD.primary": {
    regular: "Regular",
    bold: "Bold",
  },
  "TD.secondary": {
    regular: "Book",
    book: "Book",
    bold: "Bold",
  },
};

export function figmaStyleValue(familyKey: string, weight: string): string {
  const style = FIGMA_STYLE_BY_FAMILY_WEIGHT[familyKey]?.[weight];
  if (!style) {
    throw new Error(`Ingen Figma style för ${familyKey} + ${weight}`);
  }
  return style;
}

/** Canonical specimen + style order (no deprecated keys). */
export const OG_STYLE_KEYS = [
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
  "caption",
] as const;

export const TD_STYLE_KEYS = [
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
  "caption",
] as const;

export const OG_STYLE_DEFS: Record<string, StyleDef> = {
  "heading-1": {
    family: "OG.primary",
    size: "7xl",
    weight: "regular",
    leading: "tight",
    tracking: "tighter",
  },
  "heading-2": {
    family: "OG.primary",
    size: "5xl",
    weight: "regular",
    leading: "tight",
    tracking: "tight",
  },
  "heading-3": {
    family: "OG.primary",
    size: "4xl",
    weight: "regular",
    leading: "tight",
    tracking: "wide",
  },
  "heading-4": {
    family: "OG.primary",
    size: "3xl",
    weight: "regular",
    leading: "snug",
    tracking: "wide",
  },
  "heading-5": {
    family: "OG.primary",
    size: "xl",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  "heading-6": {
    family: "OG.primary",
    size: "md",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  eyebrow: {
    family: "OG.secondary",
    size: "lg",
    weight: "medium",
    leading: "relaxed",
    tracking: "normal",
    textCase: "uppercase",
  },
  "eyebrow-sm": {
    family: "OG.secondary",
    size: "md",
    weight: "medium",
    leading: "relaxed",
    tracking: "normal",
    textCase: "uppercase",
  },
  intro: {
    family: "OG.secondary",
    size: "base",
    weight: "semibold",
    leading: "normal",
    tracking: "normal",
  },
  "lead": {
    family: "OG.primary",
    size: "lg",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  "lead-sm": {
    family: "OG.primary",
    size: "md",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  quote: {
    family: "OG.primary",
    size: "2xl",
    weight: "italic",
    leading: "relaxed",
    tracking: "normal",
  },
  "quote-sm": {
    family: "OG.primary",
    size: "xl",
    weight: "italic",
    leading: "relaxed",
    tracking: "normal",
  },
  body: { family: "OG.secondary", size: "base", weight: "regular", leading: "normal", tracking: "normal" },
  "body-sm": {
    family: "OG.secondary",
    size: "sm",
    weight: "regular",
    leading: "normal",
    tracking: "normal",
  },
  cta: {
    family: "OG.primary",
    size: "base",
    weight: "medium",
    leading: "tight",
    tracking: "fine",
    leadingTrim: "CAP_HEIGHT",
  },
  "cta-sm": {
    family: "OG.primary",
    size: "sm",
    weight: "medium",
    leading: "tight",
    tracking: "fine",
    leadingTrim: "CAP_HEIGHT",
  },
  nav: { family: "OG.secondary", size: "sm", weight: "medium", leading: "tight", tracking: "normal" },
  label: { family: "OG.secondary", size: "sm", weight: "semibold", leading: "tight", tracking: "normal" },
  caption: { family: "OG.secondary", size: "xs", weight: "regular", leading: "normal", tracking: "normal" },
};

export const TD_STYLE_DEFS: Record<string, StyleDef> = {
  "heading-1": {
    group: "Editorial",
    family: "TD.primary",
    size: "7xl",
    weight: "bold",
    leading: "tight",
    tracking: "compressed",
  },
  "heading-2": {
    group: "Editorial",
    family: "TD.primary",
    size: "5xl",
    weight: "bold",
    leading: "tight",
    tracking: "tighter",
  },
  "heading-3": {
    group: "Editorial",
    family: "TD.primary",
    size: "4xl",
    weight: "bold",
    leading: "tight",
    tracking: "tight",
  },
  "heading-4": {
    group: "Editorial",
    family: "TD.primary",
    size: "3xl",
    weight: "bold",
    leading: "snug",
    tracking: "snug",
  },
  "heading-5": {
    group: "Editorial",
    family: "TD.primary",
    size: "xl",
    weight: "bold",
    leading: "relaxed",
    tracking: "normal",
  },
  "heading-6": {
    group: "Editorial",
    family: "TD.primary",
    size: "md",
    weight: "bold",
    leading: "relaxed",
    tracking: "normal",
  },
  eyebrow: {
    group: "Editorial",
    family: "TD.secondary",
    size: "lg",
    weight: "bold",
    leading: "relaxed",
    tracking: "normal",
    textCase: "uppercase",
  },
  "eyebrow-sm": {
    group: "Editorial",
    family: "TD.secondary",
    size: "md",
    weight: "bold",
    leading: "relaxed",
    tracking: "normal",
    textCase: "uppercase",
  },
  intro: {
    group: "Editorial",
    family: "TD.primary",
    size: "base",
    weight: "regular",
    leading: "normal",
    tracking: "fine",
  },
  lead: {
    group: "Editorial",
    family: "TD.primary",
    size: "lg",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  "lead-sm": {
    group: "Editorial",
    family: "TD.primary",
    size: "md",
    weight: "regular",
    leading: "relaxed",
    tracking: "normal",
  },
  quote: {
    group: "Editorial",
    family: "TD.secondary",
    size: "2xl",
    weight: "book",
    leading: "relaxed",
    tracking: "fine",
  },
  "quote-sm": {
    group: "Editorial",
    family: "TD.secondary",
    size: "xl",
    weight: "book",
    leading: "relaxed",
    tracking: "fine",
  },
  title: {
    group: "UI",
    family: "TD.secondary",
    size: "lg",
    weight: "bold",
    leading: "title",
    tracking: "normal",
  },
  "title-sm": {
    group: "UI",
    family: "TD.secondary",
    size: "base",
    weight: "bold",
    leading: "title",
    tracking: "normal",
  },
  body: {
    group: "UI",
    family: "TD.secondary",
    size: "base",
    weight: "book",
    leading: "normal",
    tracking: "normal",
  },
  "body-sm": {
    group: "UI",
    family: "TD.secondary",
    size: "sm",
    weight: "book",
    leading: "normal",
    tracking: "normal",
  },
  cta: {
    group: "UI",
    family: "TD.secondary",
    size: "base",
    weight: "bold",
    leading: "tight",
    tracking: "normal",
  },
  "cta-sm": {
    group: "UI",
    family: "TD.secondary",
    size: "sm",
    weight: "bold",
    leading: "tight",
    tracking: "normal",
  },
  nav: {
    group: "UI",
    family: "TD.secondary",
    size: "sm",
    weight: "book",
    leading: "tight",
    tracking: "normal",
  },
  label: {
    group: "UI",
    family: "TD.secondary",
    size: "xs",
    weight: "bold",
    leading: "tight",
    tracking: "normal",
  },
  caption: {
    group: "UI",
    family: "TD.secondary",
    size: "xs",
    weight: "book",
    leading: "normal",
    tracking: "normal",
  },
};

/** All style STRING variables to ensure in Shared / Primitives */
export function allStyleVariableSpecs(): { name: string; value: string }[] {
  const specs: { name: string; value: string }[] = [];
  const seen = new Set<string>();
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
