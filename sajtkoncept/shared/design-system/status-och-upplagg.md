# Designsystem — status och upplägg (kontext för Cursor)

Uppdaterad 2026-09-23. Speglar Figma-arbetsfil + lokala tokens. Bygg/komponenter endast på explicit kommando.

---

## Arkitektur

Ett Git-repo (`/design-system`) som enda källa:
- **Figma** — Variables / Modes / text styles (plugin `bind-typography-variables`)
- **Cursor** — tokens-JSON → `generated/tokens.css`
- **Claude Design** — GitHub-import för presentation

**Figma-praxis (paint styles, collections, scrim, öppna frågor):** [`tokens/FIGMA-PRAXIS.md`](tokens/FIGMA-PRAXIS.md) — kanonisk. Uppdatera den filen, inte duplicera här.

Medvetet bortvalt för nu: Storybook, Figma Code Connect.

## Tokenstruktur

`primitives.json` → `{varumärke}.semantic.json` → typography-styles-*.json. CSS via `scripts/generate-css-vars.mjs` → `generated/tokens.css`; TD text styles + `@font-face` via `scripts/generate-typography-css.mjs` → `generated/typography-td.css`, `generated/fonts-td.css`. Webfonts: `fonts/` (produkt — inte sajtprototyperna).

**Gräns:** `src/sajtkoncept` = TD/OG-prototyper (`td/desktop`, `og/desktop`) plus `shared/`. Designsystemet ligger i `shared/design-system/` och serveras på `/ds/` av `scripts/dev-server.py`. Inga symlänkar.

### Demo lokalt vs delning

- **Lokalt:** från `sajtkoncept/` kör `python3 scripts/dev-server.py` → `/td/`, `/og/`, `/ds/`, `/shared/`.
- **Export (zip/hosting):** `npm run build:td` → `dist/td/`, `npm run build:og` → `dist/og/` (materialiserad `ds/` + `shared/`, inga symlänkar).

## Status per beslut

### Orsa Grönklitt — färg
Klar i Figma/tokens: off-white, dark-green, orsa-black, signal-orange, CTA (`cta` / `cta-on-dark`).  
`bg-overlay` = orsa-black @ 55% (scrim). Dark-green @ 55% testades och förkastades (grönskimmer) — se `orsagronklitt.semantic.json`.

### Orsa Grönklitt — typografi
Låst, produktion: **Literata** (rubrik) + **Radio Canada Big** (bröd/UI). Stilar i `typography-styles-orsagronklitt.json`.

**Öppen fråga:** manualens "The Bartender" — digitalt eller ej.

### Tänndalen — färg
Klar: night / day / snow / accent / CTA + årstider.  
`bg-overlay` = night @ 55%.  
`contrast-pair.accent` = verified-with-restriction 3.25:1 — endast icke-text (kantlinjer/badges/ikoner).

### Tänndalen — typografi (Figma-arbetsfil)
**Superclarendon** (rubrik/primary) + **CircularXX TT** (bröd/UI/secondary). Book = regular-vikt.

| Roll | Familj | Vikt |
|---|---|---|
| heading-1–6 | Superclarendon | Bold |
| intro / lead / lead-sm | Superclarendon | Regular |
| eyebrow / cta / label (+sm där relevant) | CircularXX TT | Bold |
| nav | CircularXX TT | Book |
| quote / quote-sm | CircularXX TT | Book + accentlinje-markör (inte kursiv) |
| body / caption | CircularXX TT | Bold |

Superclarendon Italic är övergivet. Äldre kandidater (Erode, Switzer, Gambetta) hör **inte** hit — historik endast.

**Kundfråga #9:** produktionstypsnitt kan fortfarande skilja från Figma-arbetsfilen. Tokens speglar Figma tills kundbeslut.

### Formkontroller
Toggle / Checkbox / Radio har Light + Dark; Toggle även Hover/Focus/Disabled. Byggt enligt systemmönster, ej unikt designgranskat — se `tokens/components-notes.json`.

## Vad som finns / saknas

Finns: färg, typografi, spacing (`space-*`), radii, z, contrast-par, form-variant-anteckning.  
Motion/duration: opåbörjat. Komponentbibliotek i kod: vänta på explicit byggkommando.

## Nästa steg

1. Kundworkshop — låser #9 och eventuella OG-öppna frågor.
2. Plugin-sync tokens → Figma vid behov (cta/label Bold om Figma fortfarande Book).
3. Komponenter i kod först efter uttryckligt kommando.
