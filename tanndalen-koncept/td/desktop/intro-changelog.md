# 2026-11-06 — Hitta din bokning-panel styling

Matcha Figma 2376:16465 / Form Text field.

## Filer

- `startsida.css` (account-panel layout, fält, divider, foot)
- `index.html` (divider, fill-spring, placeholders oförändrade Efternamn)
- `ds/components/button.css` + design-system `button.css` (`td-button-fill-spring`)
- Backups: `*.bak-account-panel-2026-11-06`

## solved / remains

| | |
|---|---|
| Fält bg-base, radius-md, ingen kant | solved |
| Knapp season-spring fullbredd | solved |
| Avdelare + foot space-between | solved |
| Efternamn (inte E-post) | solved — prompt vinner |

# 2026-11-06 — På plats-läge (onsite)

Fjärde visningsläget: status först, quiet pill, meny-toggle, mockad inloggning/vistelse, geo som svag signal.

## Filer

- `modes.js` (omskriven: onsite-state, demo-selector, konto/vistelse, geo-banner)
- `site-config.js` (ny: site-namn, geo TODO, wifi-hook)
- `demo-stay.js` (ny: mockvistelse + today-override)
- `index.html` (boot onsite, meny-toggle, quiet pill, account-panel, footer-länk, kompakta booking-cats)
- `startsida.css` (onsite UI + `main` order för Just nu)
- `assets/icons/map-pin-20.svg` (från Figma Button/Secondary)
- Backups: `index.html.bak-onsite-2026-11-05`, `startsida.css.bak-onsite-2026-11-05`, `modes.js.bak`

## Preflight

Figma läst (HW7ZST3CotlOepEcjNI5LC). Topografi ankras till `#statement` / `#fragor`. En dag är `position: relative` på både 1440×900 och 393×852 — ingen fixed-top-refaktor behövdes.

## Mätt

Bas (returning) före: aktuellt 1443/916, en-dag 2269/1573, just-nu 7792/4381, fragor 8603/5088 (1440/393).

Efter, returning oförändrat på huvudsektioner 1440 (dTop/dH 0). Logo +2. Skarvarna/citat-delta hör till parallellt Skarvarna−30 % / citat text-only (se beslut), inte onsite.

Acceptance: toggle ↔ pill ↔ demo ↔ localStorage ↔ Just nu ovan Aktuellt; persist efter reload; manuell av blockerar `?plats=1`; geoCalls=0 vid load; login→Pågår nu→Visa På plats→logout rensar stay; mobil quiet-row `display:flex`, brand-pill `none`.

## solved / remains

| Krav | Status | Mätt |
|---|---|---|
| 1. Toggle ↔ pill ↔ demo ↔ LS ↔ sidordning, överlever reload | solved | mode=onsite, justNuAbove=true, LS value:true, persist ok |
| 2. Manuell av kvar till dagens slut trots `?plats=1` / pågående vistelse | solved | mode=returning, LS value:false source:manual |
| 3. Ingen geolocation vid sidladdning | solved | geoCalls=0 @ load 1440 och 393 |
| 4. Login → Din vistelse → Visa På plats; logout rensar | solved | stay utan bokningsnr; status Pågår nu med demo-today; after logout stay=null |
| 5. Övriga lägen oförändrade | solved (huvudsektioner) | 1440 returning dTop 0 på aktuellt/en-dag/just-nu/fragor/statement/booking. Logo +2. Mobil citat −33 / just-nu −33 från parallell citat-ändring |
| 6. Quiet pill mobil under header | solved | rowDisplay=flex, brandPillDisplay=none @ 393 |
| Geo-koordinater/radie | remains | TODO verify with Tänndalen — null i config, neutral toast |
| Wifi-signal | remains | dokumenterad hook `wifiOnsiteSignal()` |
| Morgonrapport/dagstatus nytt innehåll | remains | öppet för John — befintlig Just nu oförändrad |
| Skarvarna absolute delta vs bas | could not measure stabilt mot onsite | parallell SCALE 0.7 / −300 shift |

## Antaget

- Site-id `tanndalen`, lagring `td-onsite-tanndalen` / `td-stay-tanndalen`
- Demo-today sätter idag = `2027-02-15` (mitt i vistelsen)
- Aktiviteter i kompakt booking-bar återanvänder skidskola-ikon
- Prompt vinner över Figma där skissen fortfarande säger «Byt läge»
