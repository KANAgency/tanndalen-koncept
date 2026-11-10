/** Mirrors tokens/primitives.json → space / radius / stroke / breakpoint / z */

export const SPACING_COLLECTION = "Spacing";

export const SPACE_STEPS = [
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
  "8xl",
] as const;

export const SPACE_PX: Record<(typeof SPACE_STEPS)[number], { OG: number; TD: number }> = {
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
  "8xl": { OG: 96, TD: 144 },
};

/** Legacy Tailwind-steg → abstrakt namn (behåller variabel-id vid rename). */
export const SPACE_RENAME_FROM_NUMERIC: Record<string, (typeof SPACE_STEPS)[number]> = {
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
  "24": "8xl",
};

/** Legacy slash-namn (`space/xs`) → bindestreck (`space-xs`), speglar Figma 2026-09-23. */
export const SPACE_RENAME_FROM_SLASH: Record<string, string> = Object.fromEntries(
  SPACE_STEPS.map((step) => [`space/${step}`, `space-${step}`]),
);

export const RADIUS_PX: Record<string, number> = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const STROKE_PX: Record<string, number> = {
  "0.5": 0.5,
  "1": 1,
  "1.5": 1.5,
  "2": 2,
  "2.5": 2.5,
  "3": 3,
};

export const BREAKPOINT_PX: Record<string, number> = {
  sm: 640,
  md: 1024,
  lg: 1280,
};

export const Z_INDEX: Record<string, number> = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
};

/** Control sizes (Shared / Primitives → size/control-*) */
export const CONTROL_SIZE_PX: Record<string, number> = {
  lg: 48,
  md: 40,
  sm: 32,
  xs: 24,
};

/** CSS decimal (0–1). Figma OPACITY-scope lagrar procent (40 → 0.4). */
export const OPACITY_DISABLED = 0.4;
export const OPACITY_DISABLED_FIGMA_PERCENT = 40;

export function spaceVariableName(step: string): string {
  return `space-${step}`;
}

export function radiusVariableName(key: string): string {
  return `radius/${key}`;
}

export function strokeVariableName(key: string): string {
  return `stroke/${key.replace(".", "-")}`;
}

export function breakpointVariableName(key: string): string {
  return `bp/${key}`;
}

export function zVariableName(key: string): string {
  return `z/${key}`;
}

export function controlSizeVariableName(key: string): string {
  return `size/control-${key}`;
}

export function opacityVariableName(key: string): string {
  return `opacity/${key}`;
}
