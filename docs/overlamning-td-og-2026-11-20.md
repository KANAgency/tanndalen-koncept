# Tänndalen: överlämning 2026-11-20

> **Källa:** trådsammanfattning från claude.ai, importerad 2026-11-20. Vid konflikt gäller `docs/status.md` (se CLAUDE.md). Figma-noder och sidnamn kan vara inaktuella efter Figma-granskningen 20 nov (commit 6290144: Old, Blocks och _Arkiv raderade, Frågerutan arkiverad).

*Tråd: uppdelning TD/OG i prototypen. Fullständig bakgrund för OG-arbetet finns i `td-og-overlamning.md`.*

## Arbetssätt (bara ändringar mot arbetsinstruktionen)
- Prompter till andra agenter: alltid kompletta, fristående och i kodblock, aldrig tillägg. Inga git-steg.
- Cursor ska aldrig själv öppna eller analysera skärmdumpar (kostade mycket quota). Pixeldiff rapporteras som siffror; John öppnar bilder själv vid behov.
- Cursor ska stanna och rapportera vid avvikelser i stället för att felsöka på egen hand.
- OG-arbetet fortsätter i Johns andra Claude-konto.

## Arkitektur TD/OG (kod)
- Beslut: isolation före delad kod; TD får inte gå sönder. Struktur `koncept/shared/` (bara JS + config-modell) och `koncept/sites/td/desktop/`, senare `sites/og/desktop/`.
- Beslut: HTML delas inte (OG får kopia). OG:s CSS skrivs från grunden på OG:s tokens. Delad JS får inte förutsätta TD-layout. Parallax/topo/bakgrundslager, intro och Hitta hit är TD-specifika.
- Beslut: visningslägen styrs av config per sajt. Mobil görs senare för båda; upplägg ej låst.
- Beslut, klassning: **Samma** = site-config, demo-stay, säsongsväxling, säsongsbanner, bokningsraden, lägesmotorn. **Variant** (kopieras) = Frågerutan, meny, topprad, footer, Aktuellt, Just nu, boendemodulen, media + text, En dag. **Bara TD** = intro, parallax/topo, Hitta hit.
- Cursor: refaktorn till shared + sites/td/desktop – **Skickad**, mätt klar.
- Mätt/facit: 10 skärmdumpar (4 lägen × vinter/sommar + intro start/slut), videomask från DOM, tolerans ≤ 0,01 % och max 50 × 50 px. Alla tio godkända. Baseline i `regression/td-baseline/`; `npm run test:td` är grinden för ändringar i shared och ds.
- Cursor: flytt av de fyra Samma-modulerna till shared, en i taget med test – **Oklart** (pågår i andra kontot).
- Cursor: hero-video-rättning – **Skriven, ej skickad**, struken. Heron spelar i alla lägen (John verifierat i Chrome Incognito); var aldrig en regression.

## OG-innehåll
- Beslut: nästan allt har samma funktion som TD men egen styling och content. Längd primärt för OG. Eget intro för nya besökare. Fullbleed i stället för parallax. Kartan ersätts av OG-specifik modul (platshållare). Redaktörsblock saknas för båda och byggs som delade moduler.
- Beslut: OG:s design tas fram iterativt i kod; OG-Figmafilen behöver bara grunderna.

## Tokens och Figma
- Beslut: färg och spacing är temaneutrala i CSS (samma namn, olika värden). Typsnitt och färgprimitiver är varumärkesprefixade (`--font-family-OG-primary`, `--color-TD-…`). OG:s färgvärden i `primitives.json` är platshållare.
- Figma (gjort, TD-fil `HW7ZST3CotlOepEcjNI5LC`): audit klar, 0 externa instanser. Alla 46 textstilar bundna till `font/family`/`font/style`. `Editorial/quote-sm` rättad. Code syntax på `font/style/*`, `space-2xs`, `color/neutral-light`, `color/neutral-highlight`.
- Figma (gjort): code syntax på `space-xl` och `space-5xl` borttagen igen (krock).
- Cursor: spacing-frågan (vilka CSS-namn `space-xl`/`space-5xl` ska få) – **Skickad**, svar ej inkommet.
- Figma Agent: OG-filens grundbyte (typsnitt, code syntax TD → OG, collections) – **Skriven, ej skickad**. Körs efter duplicering. Text i `td-og-overlamning.md` (9b).

## Öppet (kräver beslut av John)
1. CSS-namn för `space-xl` (20) och `space-5xl` (48) när Cursor svarat.
2. Om och när Frågerutan och menyn ska flyttas till shared.
3. Vad OG:s egna modul (i stället för kartan) ska vara.
4. Mobilupplägget.

## Att göra, i ordning
1. Granska Cursors rapport om flytten av de fyra Samma-modulerna.

Därefter: spacing-syntax i Figma → duplicera TD-filen till ny OG-fil → Figma Agent-prompten 9b → prompt för OG-skalet (ej skriven).

## Kända fällor
- Figma och CSS har förskjutna spacing-namn (Figma `space-2xl` = CSS `--space-xl` osv.). Byt inte namn på skalan; det ändrar TD:s CSS.
- `tanndalen-koncept-backup` är trasig (delar `ds` med levande koden). Använd inte som referens. Ny fristående backup önskvärd men inte bråttom.
- `npm run test:td` fryser och maskar videor och fångar inte uppspelningsfel. Kontrollera video manuellt i Chrome Incognito, alltid före presentation.
- Cursors rapporter har blandat resultat från olika körningar och räknat fel på skala. Kontrollera siffror (filernas SHA/ändringstid, skala 1 eftersom DPR är 1).
- Heroparallaxen gör helsidesbilden 2042 px bred; klipps i sajten (`scrollWidth` 1440), ingen regression.
- Exempeladressen `hello@tallbergsgarden.se` ligger kvar i Form / Text field i TD-Figman.
