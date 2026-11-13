# Status (uppdatera i slutet av varje uppgift)

Senast uppdaterad: 2026-11-13 (efter `9b402c4`). Detaljer om vad som är byggt finns i `startsida-td.md` (Del 2).

## Läge
- TD startsida desktop: intro, header (Fjällguiden), Aktuellt, En dag, Just nu (Alpint + Längd, tredje raden i På plats), varumärkessektionen, Fjällguiden-blocket och svarsmodalen (15 frågor) är byggda. Allt innehåll i Just nu och modalen är hårdkodat/påhittat.
- OG: hero-sida, booking och intro uppdaterade, En dag-växlare dold, nya SVG-logotyper. Ingen OG-motsvarighet till Fjällguiden, vallakort eller 13 px caption.
- Prioritet: OG-prototypen (0 % klar) går före det som återstår för TD (mobil, mindre tweaks, lägesanpassningar).
- Senaste HEAD: `9b402c4` på `main`. Inte pushad.

## Klart 13 nov: vallafärger som tokens (`9b402c4`)
- Figma: primitiver `wax/green|blue|violet|red|yellow` i `Shared / Primitives` (2691:2353/2355/2357/2359/2361, dolda), semantiska `wax-*` i `Semantic` (2691:2354/2356/2358/2360/2362) aliasade till primitiverna. Scopes FRAME_FILL + SHAPE_FILL, code syntax `var(--wax-*)` / `var(--color-wax-*)`. Verifierat med `get_variable_defs`.
- Kod: `color.wax.*` i `primitives.json`, `wax`-grupp i båda `*.semantic.json`, generatorn emitterar `--wax-*` (TD + OG). `startsida.css` använder `var(--wax-*)`. Computed color identisk före/efter för alla fem, aktiv och inaktiv (40 %).
- Ingen `-dark`: kortet ligger alltid på snö. Kontrast mot vit: grön 5,08, blå 5,30, violett 6,64, röd 5,35, **gul 2,42 (under 3:1)**. Inaktiva på 40 %: 1,39–1,88.

## Commit-historik (nyast först)

| Hash | Innehåll |
|---|---|
| `9b402c4` | TD: vallafärger som tokens (`wax-*`) i Figma och kod, oförändrad rendering |
| `2a1899b` | TD: Dagens vallatips (Längd), Fjällguiden-svar för alla frågor/följdfrågor, FG-varumärke i header + block, live-prick, En dag efter FG-block i På plats, diverse rättningar |
| `e412400` | TD: klockikon `klocka.svg` + nio genererade bilder `fraga-*.jpg` |
| `906d893` | TD: Längd-variant av Fjällguiden, Öppet nu och Väder; Pistkartor bara i alpint |
| `ea80c19` | OG: hero-sida, booking och intro uppdaterade, En dag-växlare dold |
| `8093244` | OG: SVG-logotyper (vertikal), kurbits, uppdaterade ikoner |
| `04b7306` | TD: Just nu enligt Figma – Fjällguiden, pistförare, tredje raden |
| `ee46b9b` | TD: Fråga oss säsongsfärgad, En dag-växlare dold, pilar, Aktuellt-ordning |
| `22640d8` | TD: varumärkessektion "Lev. Andas. Tänndalen." |
| `5f5cece` | TD: intro – svart start, logotyp-fade, Hoppa över efter övergången |
| `4ab8c14` | DS: knappars ikon-padding, figure-xl, 13 px caption |
| `290854e` | (före chatten) OG: hero-page med intro, molnövergång, TD-header och TD-block |

Medvetet ocommittad: `td/desktop/assets/img/brand/td-brand-3.png` (32 MB original; sajten använder `td-brand-3.jpg`).

Commit-trailer som använts: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01TLNL3tB7DVfjayBHSWwd5v`.

## Öppna punkter
- [ ] **För många vita kort i Längd** (datakort, På gång, Vallatips, Öppet nu). Rekommendation: Öppet nu utan kort, som Väder. Inte beslutat.
- [x] Vallafärger som tokens/variabler i designsystemet (`9b402c4`).
- [ ] **Gul valla har kontrast 2,42 mot vit** (under 3:1 för grafiska element). Beslut: mörkare gul, eller räcker storleksskillnad + `aria-label`?
- [ ] Violett i Just nu-modulen (`just-nu-data.css:82`) faller tillbaka på `--color-TD-neutral`. Beslut: byt till `--wax-violet`? (grön/blå/röd där använder difficulty-färger, inte wax.)
- [ ] Klister-läge för vallakortet (förslag: egen rad som ersätter skalan de dagarna).
- [ ] Snötemperatur i personalens formulär (bättre än lufttemp för valla; skulle kunna visas märkt).
- [ ] Koppla vallakort, tredje raden och modal-svar till riktig data; svaren för backar/valla kan genereras från befintlig data.
- [ ] Ersätt alla [hakparentes]-namn, tider och påhittade fakta i modalen med riktigt innehåll från Tänndalen.
- [ ] Modalen: korttext kan klippas när modalen är låg.
- [ ] Fjällguiden-status: kvällsvariant (öppen ring, "Åter i morgon från 08.00") – bara föreslagen.
- [ ] "Ställ en egen fråga…"-rad i Fjällguiden-kortet – bara föreslagen.
- [ ] Kvarvarande "Fråga oss"-texter i menyer ("Fråga oss om bokning") – inte omdöpta.
- [ ] Hörnpil-beteendet (vila/hover) in i de delade komponenterna i stället för `startsida.css`.
- [ ] Modal för datakort (hörnknapparna på stacken gör inget och är dolda).
- [ ] OG: motsvarande ändringar (13 px caption, Fjällguiden m.m.) ej gjorda.
- [ ] Push av `main` (John, på begäran).

## Medvetna begränsningar och fällor
- **`npm run tokens:css` skriver över `generated/typography-td.css`** och tar bort handtillägg från `4ab8c14` (`.td-ui-figure-xl`, fallback på `--font-size-13`, kommentar). Återställ filen med `git checkout -- …/generated/typography-td.css` efter körning, tills tilläggen flyttats in i typografikällan. Eller kör bara `npm run generate:css` i `shared/design-system/`.
- Figma `difficulty/*`-primitiver har code syntax `var(--color-TD-difficulty-*)`, men CSS heter `--color-difficulty-*` (fanns före wax-jobbet, orört).
- Valla-skisstavlan i Figma (2672:2313) finns inte längre. Vald riktning är byggd i kod; se `startsida-td.md`.
- Figma-asset-URL:er kan inte laddas ned från molncontainern; John exporterar bilder manuellt.
- Många av chattens CSS-ändringar ligger som kronologiska tillägg i slutet av `td/desktop/startsida.css`; senare block överstyr tidigare. Vid städning: slå ihop och flytta till `shared/design-system/components/`.
- Figma-bibliotekets radhöjdsrättningar (unit-lg 24/26, unit-md 16/18, unit 12/13, figure-sm-regular 14/15) är lokala tills biblioteket publiceras och uppdateringen accepteras.
- Concept-sidan har åtta brutna Boka-instanser.
