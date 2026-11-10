import {
  COLOR_PALETTE,
  contrastOnVariableName,
  hexToFigmaRgb,
  OG_CONTRAST_PAIRS,
  PAINT_STYLE_TOKENS,
  paintStyleName,
  paletteVariableName,
  SEMANTIC_CHIP_TO_VAR,
  SEMANTIC_COLLECTION_NAME,
  SHARED_COLOR_PALETTE,
  sharedPaletteVariableName,
  SWATCH_DISPLAY_TO_TOKEN,
  TD_CONTRAST_GRID,
  TD_CONTRAST_PAIRS,
  type ContrastPairDef,
} from "./color-defs";
import {
  BREAKPOINT_PX,
  breakpointVariableName,
  RADIUS_PX,
  radiusVariableName,
  STROKE_PX,
  strokeVariableName,
  SPACE_PX,
  SPACE_RENAME_FROM_NUMERIC,
  SPACE_RENAME_FROM_SLASH,
  SPACE_STEPS,
  SPACING_COLLECTION,
  spaceVariableName,
  Z_INDEX,
  zVariableName,
} from "./layout-defs";
import { SPECIMEN_REFERENCE_TEXTS } from "./specimen-texts";
import {
  allStyleVariableSpecs,
  familyVariableName,
  figmaFamilyVariableValue,
  figmaStyleValue,
  FONT_SIZE_PX,
  LEADING_FIGMA_PERCENT,
  leadingVariableName,
  OG_STYLE_DEFS,
  OG_STYLE_KEYS,
  styleVariableName,
  TD_STYLE_DEFS,
  TD_STYLE_KEYS,
  tokenLineForStyle,
  TRACKING_FIGMA_PX,
  trackingVariableName,
  type StyleDef,
} from "./style-defs";

type BindResult = {
  styleName: string;
  ok: boolean;
  message?: string;
};

const PRIMITIVES_COLLECTION = "Shared / Primitives";

async function getFoundationsPage(): Promise<PageNode> {
  await figma.loadAllPagesAsync();
  const page = figma.root.children.find((p) => p.name.includes("Foundations"));
  if (!page) throw new Error("Sidan Foundations saknas.");
  await page.loadAsync();
  return page;
}

function findSpecimenSample(specimen: SceneNode): TextNode | null {
  const named = specimen.findOne((n) => n.name === "Sample");
  if (named?.type === "TEXT") return named;
  const texts = specimen.findAll((n) => n.type === "TEXT") as TextNode[];
  return (
    texts.find((t) => t.name !== "StyleName" && t.name !== "TokenLine") ?? null
  );
}

async function loadFontFamilyStyle(family: string, style: string): Promise<void> {
  const attempts = [
    style,
    style.replace(/ /g, ""),
    style.replace("Semi Bold", "Semibold"),
    style.replace("Semibold", "Semi Bold"),
    style.replace("SemiBold", "Semi Bold"),
  ];
  if (style === "Regular") attempts.push("Book");
  if (style === "Book") attempts.push("Regular");
  const tried = new Set<string>();
  let lastError: unknown;
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
    (f) =>
      f.fontName.family === family ||
      f.fontName.family.replace(/\s+/g, "") === family.replace(/\s+/g, ""),
  );
  for (const f of related) {
    try {
      await figma.loadFontAsync(f.fontName);
      if (
        f.fontName.style === style ||
        f.fontName.style.replace(/\s+/g, "") === style.replace(/\s+/g, "")
      ) {
        return;
      }
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function loadFontsForStyleDef(def: StyleDef): Promise<void> {
  const family = figmaFamilyVariableValue(def.family);
  const style = figmaStyleValue(def.family, def.weight);
  await loadFontFamilyStyle(family, style);
}

async function assignSampleTextStyle(
  sample: TextNode,
  style: TextStyle,
  def: StyleDef,
  text: string,
): Promise<void> {
  await loadFontsForStyleDef(def);
  try {
    await figma.loadFontAsync(style.fontName);
  } catch {
    /* style.fontName can be stale when family/style are variable-bound */
  }
  try {
    await figma.loadFontAsync(sample.fontName);
  } catch {
    /* sample may use Inter on first run */
  }

  sample.characters = text;
  await sample.setTextStyleIdAsync(style.id);
}

async function updateFoundationSpecimens(): Promise<BindResult[]> {
  const page = await getFoundationsPage();

  const styles = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const results: BindResult[] = [];

  for (const prefix of ["OG", "TD"] as const) {
    const frame = page.findOne((n) => n.name === `${prefix} — Foundations exempel`);
    const typoSec = frame?.findOne((n) => n.name === "Typografi — text styles");
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
      if (text === undefined) continue;
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
          message: specimen ? "Sample-lager saknas i specimen" : `Specimen ${styleName} saknas`,
        });
        continue;
      }

      try {
        await assignSampleTextStyle(sample, style, def, text);
        const styleNameNode = specimen.findOne((n) => n.name === "StyleName") as TextNode | null;
        if (styleNameNode) {
          await figma.loadFontAsync(styleNameNode.fontName);
          styleNameNode.characters = styleName;
        }
        const tokenLine = specimen.findOne((n) => n.name === "TokenLine") as TextNode | null;
        if (tokenLine) {
          await figma.loadFontAsync(tokenLine.fontName);
          tokenLine.characters = tokenLineForStyle(def);
        }
        results.push({ styleName, ok: true });
      } catch (e) {
        results.push({
          styleName,
          ok: false,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    await reorderTypoSpecimens(typoSec, prefix, keys);
  }

  return results;
}

async function removeDisplayArtifacts(
  prefix: "OG" | "TD",
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
  const displaySpec = typoSec.findOne((n) => n.name === `Specimen ${prefix}/display`);
  if (displaySpec) displaySpec.remove();

  const displayStyle = styles.get(`${prefix}/display`);
  if (displayStyle) {
    displayStyle.remove();
    styles.delete(`${prefix}/display`);
  }
}

const LEGACY_LEAD_RENAMES: [string, string][] = [
  ["lead-1", "lead"],
  ["lead-2", "lead-sm"],
];

const LEGACY_EYEBROW_RENAMES: [string, string][] = [
  ["heading-8", "eyebrow"],
  ["heading-9", "eyebrow-sm"],
];

const RETIRED_STYLE_KEYS = ["heading-7", "heading-8", "heading-9"] as const;

async function migrateLegacyStyleNames(
  prefix: "OG" | "TD",
  renames: [string, string][],
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
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

async function migrateLegacyLeadNames(
  prefix: "OG" | "TD",
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
  await migrateLegacyStyleNames(prefix, LEGACY_LEAD_RENAMES, typoSec, styles);
}

async function migrateLegacyOgEyebrowNames(
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
  await migrateLegacyStyleNames("OG", LEGACY_EYEBROW_RENAMES, typoSec, styles);
}

async function migrateLegacyTdEyebrowNames(
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
  await migrateLegacyStyleNames("TD", LEGACY_EYEBROW_RENAMES, typoSec, styles);
}

async function removeRetiredTypographyStyles(
  prefix: "OG" | "TD",
  keys: readonly string[],
  typoSec: SceneNode,
  styles: Map<string, TextStyle>,
): Promise<void> {
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
    spec?.remove();
  }
}

async function loadAllTextFonts(node: SceneNode): Promise<void> {
  if (node.type === "TEXT") {
    try {
      await figma.loadFontAsync(node.fontName);
    } catch {
      /* MCP / partial installs */
    }
  }
  if ("children" in node) {
    for (const child of node.children) {
      await loadAllTextFonts(child);
    }
  }
}

async function ensureTextStyleClone(
  prefix: "OG" | "TD",
  targetKey: string,
  sourceKey: string,
  styles: Map<string, TextStyle>,
): Promise<void> {
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

/** Skapa tomma local text styles för alla canonical keys som fortfarande saknas (t.ex. nya TD/eyebrow). */
function ensureCanonicalTextStyles(
  prefix: "OG" | "TD",
  keys: readonly string[],
  styles: Map<string, TextStyle>,
): void {
  for (const key of keys) {
    const name = `${prefix}/${key}`;
    if (styles.has(name)) continue;
    const created = figma.createTextStyle();
    created.name = name;
    styles.set(name, created);
  }
}

async function ensureSpecimenClone(
  typoSec: SceneNode & ChildrenMixin,
  prefix: "OG" | "TD",
  targetKey: string,
  sourceKey: string,
): Promise<void> {
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

async function ensureDerivedTypographyArtifacts(
  prefix: "OG" | "TD",
  typoSec: SceneNode & ChildrenMixin,
  styles: Map<string, TextStyle>,
): Promise<void> {
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

async function ensureAllSpecimensForPrefix(
  page: PageNode,
  prefix: "OG" | "TD",
  typoSec: SceneNode & ChildrenMixin,
  keys: readonly string[],
): Promise<void> {
  const ogTypo = page
    .findOne((n) => n.name === "OG — Foundations exempel")
    ?.findOne((n) => n.name === "Typografi — text styles") as (SceneNode & ChildrenMixin) | null;

  const fallbackInSection =
    typoSec.findOne((n) => n.name === `Specimen ${prefix}/heading-4`) ??
    typoSec.findOne((n) => n.name === `Specimen ${prefix}/body`) ??
    typoSec.findOne((n) => n.name.startsWith("Specimen "));

  for (const key of keys) {
    const targetName = `Specimen ${prefix}/${key}`;
    if (typoSec.findOne((n) => n.name === targetName)) continue;

    let source: SceneNode | null = null;
    if (prefix === "TD" && ogTypo) {
      source = ogTypo.findOne((n) => n.name === `Specimen OG/${key}`);
    }
    if (!source) {
      source =
        typoSec.findOne((n) => n.name === `Specimen ${prefix}/${key.replace(/-.*/, "")}`) ??
        fallbackInSection;
    }
    if (!source) continue;

    await loadAllTextFonts(source);
    const clone = source.clone();
    clone.name = targetName;
    await loadAllTextFonts(clone);
    const styleNameNode = clone.findOne((n) => n.name === "StyleName") as TextNode | null;
    if (styleNameNode?.type === "TEXT") {
      await figma.loadFontAsync(styleNameNode.fontName);
      styleNameNode.characters = `${prefix}/${key}`;
    }
    typoSec.appendChild(clone);
  }
}

async function reorderTypoSpecimens(
  typoSec: SceneNode & ChildrenMixin,
  prefix: "OG" | "TD",
  keys: readonly string[],
): Promise<void> {
  await loadAllTextFonts(typoSec);
  let index = 0;
  for (const key of keys) {
    const specimen = typoSec.findOne((n) => n.name === `Specimen ${prefix}/${key}`);
    if (specimen) typoSec.insertChild(index++, specimen);
  }
}

/** Panel order for local text styles — TD follows OG key order (same as OG_STYLE_KEYS). */
async function reorderLocalTextStyles(
  stylesByName: Map<string, TextStyle>,
  keys: readonly string[],
  prefix: "OG" | "TD",
  afterReference: TextStyle | null,
): Promise<TextStyle | null> {
  let previous = afterReference;
  for (const key of keys) {
    const style = stylesByName.get(`${prefix}/${key}`);
    if (!style) continue;
    figma.moveLocalTextStyleAfter(style, previous);
    previous = style;
  }
  return previous;
}

async function reorderAllLocalTextStyles(stylesByName: Map<string, TextStyle>): Promise<void> {
  await reorderLocalTextStyles(stylesByName, OG_STYLE_KEYS, "OG", null);
  await reorderLocalTextStyles(stylesByName, TD_STYLE_KEYS, "TD", null);
}

async function ensurePaletteColorVariables(): Promise<void> {
  const col = await getPrimitivesCollection();
  const modeId = col.modes[0].modeId;
  const byName = new Map(
    (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]),
  );

  /** Legacy svenska TD-nycklar → engelska (Figma 2026-09-23). */
  const tdRename: Record<string, string> = {
    "color/TD/dag": "color/TD/day",
    "color/TD/natt": "color/TD/night",
    "color/TD/sno": "color/TD/snow",
    "color/TD/sasong-var": "color/TD/season-spring",
    "color/TD/sasong-sommar": "color/TD/season-summer",
    "color/TD/sasong-host": "color/TD/season-autumn",
    "color/TD/sasong-vinter": "color/TD/season-winter",
  };
  for (const [oldName, newName] of Object.entries(tdRename)) {
    const oldVar = byName.get(oldName);
    if (!oldVar || oldVar.variableCollectionId !== col.id) continue;
    if (byName.get(newName)?.variableCollectionId === col.id) {
      oldVar.remove();
      byName.delete(oldName);
      continue;
    }
    oldVar.name = newName;
    byName.delete(oldName);
    byName.set(newName, oldVar);
  }

  for (const brand of ["OG", "TD"] as const) {
    for (const [token, hex] of Object.entries(COLOR_PALETTE[brand])) {
      const name = paletteVariableName(brand, token);
      let v = byName.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "COLOR");
        byName.set(name, v);
      }
      if (v.resolvedType !== "COLOR") throw new Error(`${name} måste vara COLOR`);
      v.setValueForMode(modeId, { ...hexToFigmaRgb(hex), a: 1 });
    }
  }

  for (const [token, hex] of Object.entries(SHARED_COLOR_PALETTE)) {
    const name = sharedPaletteVariableName(token);
    let v = byName.get(name);
    if (!v) {
      v = figma.variables.createVariable(name, col, "COLOR");
      byName.set(name, v);
    }
    if (v.resolvedType !== "COLOR") throw new Error(`${name} måste vara COLOR`);
    v.setValueForMode(modeId, { ...hexToFigmaRgb(hex), a: 1 });
    v.description = "Systemfärg — identisk OG och TD.";
  }
}

async function syncColorPaintStyles(): Promise<BindResult[]> {
  const varByName = new Map(
    (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]),
  );
  const paintByName = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );
  const results: BindResult[] = [];

  // Endast rå baspalett — se tokens/FIGMA-PRAXIS.md
  for (const brand of ["OG", "TD"] as const) {
    for (const token of PAINT_STYLE_TOKENS[brand]) {
      const hex = COLOR_PALETTE[brand][token];
      if (!hex) {
        results.push({
          styleName: paintStyleName(brand, token),
          ok: false,
          message: `Token saknas i COLOR_PALETTE: ${token}`,
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
            opacity: 1,
          },
        ];
        if (variable && typeof style.setBoundVariable === "function") {
          style.setBoundVariable("paints", variable);
        }
        results.push({ styleName: name, ok: true });
      } catch (e) {
        results.push({
          styleName: name,
          ok: false,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  // SHARED (error/on-error) = semantic → variabler only. Skapa/uppdatera inte paint styles.
  return results;
}

function isSolidFillNode(node: SceneNode): node is SceneNode & MinimalFillsMixin {
  return "fills" in node && "fillStyleId" in node;
}

function bindNodeToPaintStyle(
  node: SceneNode & MinimalFillsMixin,
  style: PaintStyle,
): void {
  node.fillStyleId = style.id;
}

function bindNodeFillToVariable(node: SceneNode & MinimalFillsMixin, variable: Variable): void {
  const base: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
  node.fillStyleId = "";
  node.fills = [figma.variables.setBoundVariableForPaint(base, "color", variable)];
}

async function bindFoundationColorSwatches(): Promise<BindResult[]> {
  const page = await getFoundationsPage();
  const paintByName = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVars = await figma.variables.getLocalVariablesAsync();
  const results: BindResult[] = [];

  for (const prefix of ["OG", "TD"] as const) {
    const frame = page.findOne((n) => n.name === `${prefix} — Foundations exempel`);
    const colorSec = frame?.findOne((n) => n.name === "Färger — semantiska och primitiver");
    if (!colorSec) {
      results.push({
        styleName: `${prefix}/swatches`,
        ok: false,
        message: "Färgsektion saknas",
      });
      continue;
    }

    const semanticCol = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[prefix]);
    const semanticVarByKey = new Map<string, Variable>();
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
          message: `Ingen palette-token för ${prefix}/${display}`,
        });
        continue;
      }
      const style = paintByName.get(paintStyleName(prefix, token));
      if (!style) {
        results.push({
          styleName: paintStyleName(prefix, token),
          ok: false,
          message: "Paint style saknas — kör färgsynk först",
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
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    for (const node of colorSec.findAll((n) => n.name.startsWith("Chip "))) {
      if (!isSolidFillNode(node)) continue;
      const suffix = node.name.slice("Chip ".length);
      if (suffix === "Bakgrund overlay" && prefix === "TD") {
        const variable = semanticVarByKey.get("bg-overlay");
        if (!variable) {
          results.push({
            styleName: "color/bg-overlay",
            ok: false,
            message: "Variabel saknas i TD / Semantic",
          });
          continue;
        }
        try {
          bindNodeFillToVariable(node, variable);
          results.push({ styleName: "color/bg-overlay", ok: true });
        } catch (e) {
          results.push({
            styleName: "color/bg-overlay",
            ok: false,
            message: e instanceof Error ? e.message : String(e),
          });
        }
        continue;
      }

      const varKey = SEMANTIC_CHIP_TO_VAR[suffix];
      if (!varKey) {
        results.push({
          styleName: node.name,
          ok: false,
          message: "Ingen semantisk mappning",
        });
        continue;
      }
      const variable = semanticVarByKey.get(varKey);
      if (!variable) {
        results.push({
          styleName: `color/${varKey}`,
          ok: false,
          message: `Variabel saknas i ${SEMANTIC_COLLECTION_NAME[prefix]}`,
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
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  return results;
}

async function ensureContrastPairVariables(): Promise<void> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVars = await figma.variables.getLocalVariablesAsync();
  const primByName = new Map(
    allVars
      .filter((v) => v.name.startsWith("color/OG/") || v.name.startsWith("color/TD/"))
      .map((v) => [v.name, v]),
  );

  const specs: { brand: "OG" | "TD"; pairs: readonly ContrastPairDef[] }[] = [
    { brand: "OG", pairs: OG_CONTRAST_PAIRS },
    { brand: "TD", pairs: TD_CONTRAST_PAIRS },
  ];

  for (const { brand, pairs } of specs) {
    const col = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[brand]);
    if (!col) continue;
    const modeId = col.modes[0].modeId;
    const inCol = new Map(
      allVars.filter((v) => v.variableCollectionId === col.id).map((v) => [v.name, v]),
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
      v.description =
        pair.status === "verified-with-restriction"
          ? `RESTRICTED ${pair.contrastRatio ?? ""}:1 — ${pair.note ?? ""}`.trim()
          : pair.status === "unverified"
            ? `UNVERIFIED: text på ${pair.label} → ${pair.textLabel}. ${pair.note ?? ""}`.trim()
            : `Text på ${pair.label} → ${pair.textLabel}${pair.note ? `. ${pair.note}` : ""}`;
    }
  }
}

async function bindFoundationContrastPairs(): Promise<BindResult[]> {
  const page = await getFoundationsPage();
  const paintByName = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );
  const allVars = await figma.variables.getLocalVariablesAsync();
  const primByName = new Map(
    allVars
      .filter((v) => v.name.startsWith("color/OG/") || v.name.startsWith("color/TD/"))
      .map((v) => [v.name, v]),
  );
  const results: BindResult[] = [];
  const board = page.findOne((n) => n.name === "TD — Kontrastpar");
  if (!board) {
    results.push({ styleName: "TD — Kontrastpar", ok: false, message: "Artboard saknas" });
    return results;
  }

  for (const pair of TD_CONTRAST_GRID) {
    const id = pair.id ?? pair.bg;
    const card = board.findOne((n) => n.name === `Pair TD/${id}`);
    if (!card || !isSolidFillNode(card)) {
      results.push({ styleName: `Pair TD/${id}`, ok: false, message: "Cell saknas" });
      continue;
    }
    const paint = paintByName.get(paintStyleName("TD", pair.bg));
    if (paint) bindNodeToPaintStyle(card, paint);
    const textVar = primByName.get(paletteVariableName("TD", pair.text));
    if (textVar) {
      for (const t of card.findAll((n) => n.type === "TEXT") as TextNode[]) {
        bindNodeFillToVariable(t, textVar);
      }
    }
    results.push({ styleName: `Pair TD/${id}`, ok: true });
  }

  return results;
}

async function removeObsoleteWeightVariables(): Promise<number> {
  let removed = 0;
  for (const v of await figma.variables.getLocalVariablesAsync()) {
    if (!v.name.startsWith("font/weight/")) continue;
    v.remove();
    removed++;
  }
  return removed;
}

async function getPrimitivesCollection(): Promise<VariableCollection> {
  const col = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (c) => c.name === PRIMITIVES_COLLECTION,
  );
  if (!col) throw new Error(`Variabelcollection '${PRIMITIVES_COLLECTION}' saknas.`);
  return col;
}

async function ensureTypographyVariables(): Promise<void> {
  const col = await getPrimitivesCollection();
  const modeId = col.modes[0].modeId;
  const byName = new Map(
    (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]),
  );

  for (const { name, value } of allStyleVariableSpecs()) {
    let v = byName.get(name);
    if (!v) {
      v = figma.variables.createVariable(name, col, "STRING");
      byName.set(name, v);
    }
    if (v.resolvedType !== "STRING") throw new Error(`${name} måste vara STRING`);
    v.setValueForMode(modeId, value);
  }

  for (const [key, percent] of Object.entries(LEADING_FIGMA_PERCENT) as [
    StyleDef["leading"],
    number,
  ][]) {
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
    TD: ["primary", "secondary"],
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

async function ensureFloatVariable(
  col: VariableCollection,
  byName: Map<string, Variable>,
  name: string,
  modeId: string,
  value: number,
): Promise<void> {
  let v = byName.get(name);
  if (!v || v.variableCollectionId !== col.id) {
    v = figma.variables.createVariable(name, col, "FLOAT");
    byName.set(name, v);
  }
  if (v.resolvedType !== "FLOAT") throw new Error(`${name} måste vara FLOAT`);
  v.setValueForMode(modeId, value);
}

async function ensureSpacingCollection(): Promise<{
  col: VariableCollection;
  modeOg: string;
  modeTd: string;
}> {
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

  const modeOg = col.modes.find((m) => m.name === "OG")?.modeId;
  const modeTd = col.modes.find((m) => m.name === "TD")?.modeId;
  if (!modeOg || !modeTd) throw new Error("Spacing-collection saknar mode OG eller TD.");
  return { col, modeOg, modeTd };
}

async function ensureLayoutVariables(): Promise<void> {
  const { col: spaceCol, modeOg, modeTd } = await ensureSpacingCollection();
  const prim = await getPrimitivesCollection();
  const primMode = prim.modes[0].modeId;
  const byName = new Map(
    (await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]),
  );

  for (const [from, to] of Object.entries(SPACE_RENAME_FROM_NUMERIC)) {
    const oldName = `space/${from}`;
    const newName = spaceVariableName(to);
    const oldVar = byName.get(oldName);
    if (!oldVar || oldVar.variableCollectionId !== spaceCol.id) continue;
    if (byName.get(newName)?.variableCollectionId === spaceCol.id) {
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
    if (byName.get(newName)?.variableCollectionId === spaceCol.id) {
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
    if (v.resolvedType !== "FLOAT") throw new Error(`${name} måste vara FLOAT`);
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

/** Migrera/byt namn/rensa text styles innan bind — bind kördes tidigare före cleanup och failade på heading-7…9. */
async function applyTypographyMigrations(): Promise<void> {
  const page = await getFoundationsPage();
  const styles = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );

  for (const prefix of ["OG", "TD"] as const) {
    const frame = page.findOne((n) => n.name === `${prefix} — Foundations exempel`);
    const typoSec = frame?.findOne((n) => n.name === "Typografi — text styles");
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

async function bindAllLocalTextStyles(): Promise<BindResult[]> {
  const varMap = await loadVariableMap();
  const styles = await figma.getLocalTextStylesAsync();
  const results: BindResult[] = [];

  for (const style of styles) {
    const parsed = parseStyleName(style.name);
    if (!parsed) continue;

    const def = parsed.prefix === "OG" ? OG_STYLE_DEFS[parsed.key] : TD_STYLE_DEFS[parsed.key];
    if (!def) {
      style.remove();
      results.push({
        styleName: style.name,
        ok: true,
        message: "Borttagen (ingen mappning — utfasad stil)",
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
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return results;
}

function parseStyleName(name: string): { prefix: "OG" | "TD"; key: string } | null {
  const m = /^(OG|TD)\/(.+)$/.exec(name);
  if (!m) return null;
  return { prefix: m[1] as "OG" | "TD", key: m[2] };
}

async function loadVariableMap(): Promise<Map<string, Variable>> {
  const vars = await figma.variables.getLocalVariablesAsync();
  return new Map(vars.map((v) => [v.name, v]));
}

function requireVar(varMap: Map<string, Variable>, name: string): Variable {
  const v = varMap.get(name);
  if (!v) throw new Error(`Variabel saknas: ${name}`);
  return v;
}

async function bindOneStyle(
  style: TextStyle,
  def: StyleDef,
  varMap: Map<string, Variable>,
): Promise<void> {
  const apply = () => {
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
      value: LEADING_FIGMA_PERCENT[def.leading],
    };

    const tracking = def.tracking ?? "normal";
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
  } catch {
    apply();
  }
}

/** Explicit Concept-page ids (unstyled copy mapped to closest OG/TD style). */
const CONCEPT_TEXT_STYLE_BY_ID: Record<string, string> = {
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
  "274:57": "TD/heading-1",
};

function pickConceptTextStyleName(node: TextNode, stylesByName: Map<string, TextStyle>): string | null {
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

async function getConceptPage(): Promise<PageNode | null> {
  await figma.loadAllPagesAsync();
  const page = figma.root.children.find((p) => p.name === "Concept");
  if (!page) return null;
  await page.loadAsync();
  return page;
}

async function bindConceptPageTextStyles(): Promise<BindResult[]> {
  const page = await getConceptPage();
  if (!page) {
    return [{ styleName: "Concept", ok: false, message: "Sida saknas" }];
  }

  const stylesByName = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const styleNameById = new Map(
    [...stylesByName.values()].map((s) => [s.id, s.name]),
  );
  const results: BindResult[] = [];

  for (const node of page.findAll((n) => n.type === "TEXT") as TextNode[]) {
    if (node.name.startsWith("Notis")) continue;
    if (node.fontName !== figma.mixed && node.fontName.family === "Inter") continue;
    const currentStyleName =
      typeof node.textStyleId === "string" ? styleNameById.get(node.textStyleId) : undefined;
    if (currentStyleName?.startsWith("OG/") || currentStyleName?.startsWith("TD/")) {
      results.push({ styleName: `${currentStyleName} ← ${node.name}`, ok: true, message: "redan bunden" });
      continue;
    }

    const styleName = pickConceptTextStyleName(node, stylesByName);
    const style = styleName ? stylesByName.get(styleName) : undefined;
    if (!style || !styleName) {
      results.push({
        styleName: node.name,
        ok: false,
        message: "Ingen text style-mappning",
      });
      continue;
    }

    try {
      const parsed = parseStyleName(styleName);
      const def = parsed
        ? parsed.prefix === "OG"
          ? OG_STYLE_DEFS[parsed.key]
          : TD_STYLE_DEFS[parsed.key]
        : undefined;
      if (def) {
        try {
          await loadFontsForStyleDef(def);
        } catch {
          /* family may still load via setTextStyleIdAsync */
        }
      }
      if (node.fontName !== figma.mixed) {
        try {
          await figma.loadFontAsync(node.fontName);
        } catch {
          /* */
        }
      }
      try {
        await figma.loadFontAsync(style.fontName);
      } catch {
        /* style.fontName can be stale when family/style are variable-bound */
      }
      await node.setTextStyleIdAsync(style.id);
      results.push({ styleName: `${styleName} ← ${node.name}`, ok: true });
    } catch (e) {
      results.push({
        styleName: `${styleName} ← ${node.name}`,
        ok: false,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return results;
}

async function ensureSharedSemanticColorAliases(): Promise<void> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVars = await figma.variables.getLocalVariablesAsync();
  const errorPrim = allVars.find((v) => v.name === "color/error");
  const onErrorPrim = allVars.find((v) => v.name === "color/on-error");
  if (!errorPrim || !onErrorPrim) return;

  for (const brand of ["OG", "TD"] as const) {
    const col = collections.find((c) => c.name === SEMANTIC_COLLECTION_NAME[brand]);
    if (!col) continue;
    const modeId = col.modes[0].modeId;
    const inCol = new Map(
      allVars.filter((v) => v.variableCollectionId === col.id).map((v) => [v.name, v]),
    );
    for (const [name, target] of [
      ["color/error", errorPrim],
      ["color/on-error", onErrorPrim],
    ] as const) {
      let v = inCol.get(name);
      if (!v) {
        v = figma.variables.createVariable(name, col, "COLOR");
        inCol.set(name, v);
        allVars.push(v);
      }
      v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: target.id });
      v.description = "Systemfärg — identisk hex i OG och TD.";
    }
  }
}

export async function runFullSync(): Promise<{
  summary: string;
  results: BindResult[];
}> {
  await removeObsoleteWeightVariables();
  await ensureTypographyVariables();
  await ensureLayoutVariables();
  await ensurePaletteColorVariables();
  await ensureSharedSemanticColorAliases();
  await ensureContrastPairVariables();
  await applyTypographyMigrations();
  const results = [
    ...(await syncColorPaintStyles()),
    ...(await bindFoundationColorSwatches()),
    ...(await bindFoundationContrastPairs()),
    ...(await bindAllLocalTextStyles()),
    ...(await updateFoundationSpecimens()),
    ...(await bindConceptPageTextStyles()),
  ];
  const failed = results.filter((r) => !r.ok);
  const summary =
    failed.length === 0
      ? `Synk: ${results.length} ok.`
      : `Synk: ${results.length - failed.length} ok, ${failed.length} misslyckades.`;
  return { summary, results };
}

export {
  bindConceptPageTextStyles,
  bindFoundationColorSwatches,
  bindFoundationContrastPairs,
  syncColorPaintStyles,
  updateFoundationSpecimens,
};
export type { BindResult };
