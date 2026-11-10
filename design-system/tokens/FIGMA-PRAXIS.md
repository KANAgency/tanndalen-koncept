# Figma-praxis (kanonisk)

**En** plats för Figma-regler i det här repot. Plugin-README och kodkommentarer pekar hit — uppdatera den här filen, inte tre ställen.

Senast: 2026-10-02.

## 1. Sanningskälla

- Efter manuella Figma-ändringar: **Figma → tokens** (dump/diff), inte push som skriver över artboards.
- När tokens är i fas: push-synk får uppdatera variables/styles enligt listorna nedan — inte rita om layouts.
- TD och OG ligger i **separata Figma-filer**. Synka dem var för sig; rör aldrig OG-filen i en TD-körning.

## 2. Paint styles vs variabler

| Typ | Var | Exempel |
|-----|-----|---------|
| Rå baspalett | Variable **och** paint style (`OG/*`, `TD/*`) | `off-white`, `cta`, `day`/`TD/dag` |
| Semantisk roll | **Bara** variable (OG/TD Semantic eller shared) | `cta-primary`, `error`, `on-error`, `bg-base`, `frost` |
| Tillstånd / kontext | **Bara** variable (ofta under Shared primitives) | `off-white-hover`, `tonal`, `cta-on-dark` |

Skäl: samma roll som både style och variable = duplicering (samma problem som `typography-primitives.json`, som togs bort).

Allowlist för paint-style-synk: `PAINT_STYLE_TOKENS` i `figma-plugins/bind-typography-variables/src/color-defs.ts`.

**PAINT_STYLE_TOKENS ska bara innehålla rå baspalett** — aldrig frost, bg-overlay eller andra semantiska/alfa-färger.

TD: Figma-**variabler** engelska (`color/TD/day`); **paint styles** behåller svenska (`TD/dag`) via `TD_PAINT_STYLE_ALIAS`.

## 3. Collections

| Collection | Modes | Innehåll |
|------------|-------|----------|
| Shared / Primitives | Value | Färgprimitiver, font/*, **radius/**, **stroke/**, **bp/**, **z/**, **size/control-*** (slash) |
| Spacing | OG / TD (eller Default i TD-only-fil) | **Bara** `space-{xs…8xl}` (bindestreck). Inte bp/radius/z |
| OG / Semantic | Default | Semantiska färgalias |
| TD / Semantic (eller Semantic i TD-only-fil) | Default | Semantiska färgalias, **opacity/disabled**, frost* |

`bp-*` / `radius-*` / `z-*` i Spacing är **förbjudna dubbletter** (städat 2026-09-23). Källa = Shared slash-namn.

**TD / Semantic har inga Light/Dark-lägen.** Mörka varianter är egna variabler med suffixet `-dark` (t.ex. `cta-on-dark`, `status-*-dark`) — inte modes på samma token.

## 4. Alfa i variabeln (frost, overlay, disabled)

För `color/frost`, `color/frost-hover`, `color/frost-active`, `color/bg-overlay` och `opacity/disabled`:

- **Alfan sitter i variabeln** (t.ex. snow @ 12 % → CSS `rgba(255,255,255,0.12)`).
- **Fyllningens egen opacitet i Figma ska alltid vara 100 %** — multiplicera aldrig lageropacitet ovanpå variabelns alfa.
- Samma mönster som `bg-overlay` (night @ 55 %).

## 5. Storleksvariabler (`size/control-*`)

| Token | px | Användning |
|-------|-----|------------|
| `size/control-lg` | 48 | Knappar Large, pagination Large, avatar Large |
| `size/control-md` | 40 | Knappar Medium, pagination Medium, chips, avatar Medium |
| `size/control-sm` | 32 | Knappar Small, pagination Small, chips Small, avatar Small |
| `size/control-xs` | 24 | Extra small (t.ex. kompakt avatar/ikon-yta) |

Bind kontrollhöjd/-bredd till dessa — hardkoda inte px i komponenter.

## 6. TD typografi (låst i Figma-arbetsfil)

- Gruppering: **Editorial/** (display/bröd) och **UI/** (gränssnitt)
- Rubrik: **Superclarendon** (Regular + Bold only — **ingen** Italic)
- Bröd/UI: **CircularXX TT** (Book = 450, Bold = 700)
- Nya UI-stilar: `UI/title`, `UI/title-sm` (Bold, leading 130 %)
- Quote: CircularXX TT Book + accentlinje-markör — **inte** Superclarendon Italic
- eyebrow / cta / label / title: Bold; body / nav / caption / quote: Book; intro/lead: Superclarendon Regular
- Produktionstypsnitt (#9) kan skilja — se `status-och-upplagg.md`

### `heading-2-hero` — kod-only

- Finns **medvetet inte** som Figma text style.
- CSS-klass `.td-heading-2-hero`: flytande storlek med `clamp()` (responsiv display mellan heading-2 och större hero).
- Synka aldrig till Figma; hålls i `typography-styles-tanndalen.json` + generated CSS.

## 7. Knappar: Arrow-egenskap

Boolean-egenskapen **Arrow** på Primary, Secondary, Tertiary, Destructive, Text button och Link / Standalone:

- Visar `Icon / Arrow right`
- **Ersätter "→" i text** — ingen pil-glyph i labeln

## 8. Kategoriikoner

`Icons / Category /*` använder **`color/accent`** för accentfärg — ingen egen ikonfärgtoken.

## 9. Contrast / accent

`contrast/on-accent` (TD): **verified-with-restriction**, ~3.25:1 — endast icke-text (kantlinjer/badges/ikoner). Aldrig knappfyllning eller brödtext.

## 10. Öppna designfrågor (färg)

- ~~TD `bg-overlay`~~ — **decided** 2026-09-23: scrim = `night` @ 55% (`rgba(36,39,42,0.55)`).
- ~~OG `bg-overlay`~~ — **decided** 2026-09-23: scrim = `orsa-black` @ 55% (`rgba(60,60,59,0.55)`). **Inte** dark-green — A/B visade grönskimmer; se `orsagronklitt.semantic.json`.
- ~~Paint style / token `neutral-subtlest`~~ — speglad 2026-10-02 (`color.TD.neutral-subtlest` → `--color-TD-neutral-subtlest`).
- ~~`radius/xs`~~ — borttagen ur tokens **och** Figma 2026-10-02 (0 bindings).
- `opacity/*` med Figma-scope **OPACITY** lagras som procent (t.ex. 40); `generate-css-vars.mjs` emitterar decimal (0.4).
- `color/frost*` är rena rgba-värden i Figma (inte alias).
