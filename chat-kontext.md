# Chatkontext — Tänndalen startsida

Källa: den här sessionen. Fokus på den senare halvan. Tidigare arbete nämns bara där det fortfarande styr koden.

Projekt: `src/testing` (vanilla HTML/CSS/JS). Designsystem via `testing/ds`. Dev: `http://127.0.0.1:4173`. Mät med `domcontentloaded` + `body.is-landed`. Inte `networkidle`. Ommätbart = "could not measure". Ingen git om det inte efterfrågas. Rör inte `src/backup-2026-11-01-before-hero-revert`, `testing/recovered/` eller befintliga `.bak`-filer.

## Senare halvan, i ordning

### Utförsåkning
Sektion `#utforsakning` direkt efter blå Fjällöga (`#boende`), före `#hitta`. Figma `2223:17963` i `HW7ZST3CotlOepEcjNI5LC`.

- Media vid 1440: vänster 80, 1063×732, radie 4. Kort överlappar: 869 från media, topp +75.3, bredd 410, padding 40/40/56, bakgrund `--color-TD-night`, gap 40.
- Under ~1024 blir kortet fullbredd under median och överlappar nederkanten med 40 px.
- Handske 258×258 vid −26 / +560, `scaleY(-1)`, `data-depth="mitt"`.
- Tre flikar med ARIA och piltangenter. Längdåkning och Snowboard är utkast (`data-draft="to be verified with Tänndalen"`).
- **Längdåkning är förvald** (flik, panel och `langd.jpg`). Utförsåkningsfilmen spelas bara när den fliken är aktiv, sektionen syns och reduced motion är av.

Media:

| Flik | Fil |
|---|---|
| Utförsåkning | `assets/utforsakning/klipp-8.mp4` (från Klipp_8.mp4, ingen poster) |
| Längdåkning | `assets/utforsakning/langd.jpg` |
| Snowboard | `assets/utforsakning/snow.jpg` — senast bytt till hoppet mot blå himmel, gul jacka, Salomon-bräda. `object-position: center top` (behåll toppen, skär botten). Första försöket var `center bottom` och vändes. |

### Flikkortets höjd
Kortet följer den aktiva panelen, inte den högsta. Inaktiv panel är `position: absolute`. Höjd animeras med WAAPI 350 ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Avbruten animation läses från `getBoundingClientRect` före `cancel`, annars snappar den tillbaka. `fill: forwards` får inte låsa höjden efteråt.

Vila: Utförsåkning 587 (1440) / 538 (390). Längdåkning och Snowboard 531 / 488. 56 px under knappen. På desktop är kortet absolut, så `#hitta` står still. På 390 är kortet i flödet, så en kortare panel drar `#hitta` uppåt lika mycket.

### Texten skrivs ut rad för rad
Vid flikbyte delas ögonbryn, rubrik och brödtext i visuella rader och tonas in uppifrån. 38 ms mellan raderna, 160 ms per rad. Knappen är en rad. Första paint animeras inte. Reduced motion visar allt direkt. Höjdanimationen är kvar.

### En dag — luft under rubriken
`--endag-heading-air: 48px` som `padding-top` på `.en-dag-stack` inuti `.en-dag-pin`, desktop `min-width: 1024`. Rubriken sitter kvar 40 px under menyn. `syncEnDagHang` lägger samma 48 px på `cardBottom` så banneravståndet stannar på 80. Aktuellt → `#en-dag` är 99 px (`--aktuellt-endag-overlap: 64px`).

Inträdesmått vid 1440: kort 66, tidslinje 64.5, align 1.5. Ett sent bakgrundsmått på 15.1 var pinnat/krympande läge, inte inträdet.

### Hoppa över i kartan (`#hitta`)
Syns från att Från Stockholm tänds (`hittaDocTop + START_PX`, START_PX = 120) till ankomst (`hittaDocTop + 0.9 * 2.5 * innerHeight`). Vid 1440×900: visa 10469, göm 12374.

Klick scrollar 800 ms ease-out till ankomsten och landar inom 1 px. Sista framen tvingar exakt y. Ett direkt hopp dit tänder inte Tänndalen-stoppet, eftersom `finishIntro()` sätter `journeyOriginPx` till ankomsten och resan aldrig startar. Fokus flyttas till sektionens h2.

Klassen är `is-skip-gone` på `#hitta-skip`, inte på `html` (det skulle visa introts Hoppa över). Knappen börjar gömd. Första `syncHittaSkip` har `transition: none`.

### Hero-parallax fryser
Behåll parallaxen tills Aktuellt-kortens topp är `0.647 * viewport`, sedan håll `--parallax-y` (1:1 med sidan). `freezeY = cardsDocumentTop − 0.647 * innerHeight`. Vid 1440×900 är freezeY 855.

Gäller hero-topo, platsetiketter och stage-element i den generiska loopen (goggles/sol, statement). Etikett-fade mot Aktuellt är borttagen. Rörelsen före fryspunkten är oförändrad.

### Områdeskort
Rubriken "Kort om området" på både mörkt och ljust boendekort, från `slide.cardTitle`. Inte `.td-faktakort`. `h3#boende-card-title`. Mörk text `--color-text-inverted`, ljus `--color-text-primary`. Kortet är `height: auto`. Mätt 302×252 vid 1440 (spec 251, en pixel border + facts). På 390 är rubriken låst till `--font-size-lg` så mobile-krympningen till 18 px inte slår.

### Intro
"Tänndalen" hålls 0.5 s längre. `TANNDALEN_HOLD_MS = 1100` (var `HOLD_A` 600). Fade, grow, HOLD_B och typing är relativa och skjuts med. CSS `--intro-hold-a: 1100ms` är inte timern. `?visit=new` kör introt. `?visit=returning` hoppar över det.

### Huvudmeny och Boka
Skuggan satt på panelen inuti `.site-menu`, och `overflow: auto` klippte den. Den ligger nu på `.site-menu.is-open`: `0 16px 40px rgb(36 39 42 / 0.16)`. Samma på `.boka-panel`. Den tidigare ljusa `rgb(180 178 174 / 0.55)` syntes inte mot bakgrunden. Mobil huvudmeny är kant i kant och har ingen skugga.

### Hero-doodles (sol + goggles)
Figma, hero-relativt i 1280-ramen: sol 258×258 vid (1077, 525), goggles 295×145 vid (1042, 587). Goggles över sol. Båda ovanför videon, under menyn.

`sol-mask.png` är en orange sol. Den användes som `img` men maskades med `goggles-doodle.png`, så bara goggles syntes. Nudgarna +40 px (goggles) och −120 px (sol) satt på samma `.hero-doodle`: vinterbox `top: 536px` 300×147, sommarregel `top: 611px` 258×258.

Nu två element inuti `.hero`, båda `data-depth="sun"`:

- `.hero-sun` — `assets/startsida/doodle-sol-black.svg`, kopierad från `assets/td/doodles/Doodle-Sol.svg`. Ingen ny sol ritades.
- `.hero-goggles` — samma mask och vinterfärg som förut, z-index 2 mot solens 1.

Position via `calc(100% * figma / 1280)` och `/ 630`, så de skalar med heron. Vid 1440 och 1920 är viloläget (rect minus `--parallax-y`) delta 0. Vid scroll 0 målar parallaxen båda cirka 13 px högre (−13.20 / −13.42 vid 1440×900). Det är `--depth-sun: 1.04`, inte en extra rörelse. Efter freezeY rör de sig 1:1.

Vid viewport 1280 är heron 1248 px (sidmarginal 16). Kvoterna mot heron matchar Figma. Samma vid 1024.

`elementFromPoint` träffar goggles i överlappet bara om `pointer-events` slås på. I sidan är de `none`, så träffen går igenom till videon.

Changelog: `hero-doodles-fix-changelog.md`. Backup: `*.bak-2026-11-01-hero-doodles-fix`.

## Sådant som måste stå kvar

- Hero-film: `assets/video/hero-vinter.mov` och `hero-sommar.mov`.
- Just nu: ord-primärer 24 px desktop / 22 px under 1024. Siffror `--font-size-40` (40 desktop, 36 mobil). `--font-size-4xl` är bara rubriker. `is-wind` "Hård vind" 32 px.
- Meny/Boka-skuggan ovan. Boka-padding `calc(var(--space-xl) - 12px) var(--space-md) var(--space-xl)`.
- Hamrafjället: "1 137 m ö.h. · 295 m fallhöjd".
- En dag: rubrik desktop = menybotten + 40 (108 px). Mobil rubrik 92, främsta kort 238. Release oförändrad utöver 64 px dokumentförskjutning och +48 px luft. Aktuellt-gap 99.
- Introkonstanter utöver hold: FOLLOW_TAU 0.14, GROW 900, HOLD_B 450, REVEAL_P 0.97. Skip kollapsar runway och scrollar till 0. `visit=new` tar bara bort visit-parametern och sätter localStorage direkt.
- Hero-pin `--stage-top` 116 vid ≥1024.
- Topo2-konstverket överlappar fortfarande den blå sektionen med ungefär 205 px i vila. Det är en känd rest, inte något som ska "fixas" i förbifarten.

## Filer som rör den senare halvan

- `index.html` — Utförsåkning, flikscript med radvisning, En dag-luft, hitta-skip, hero-freeze, boendekortets rubrik, sol + goggles.
- `startsida.css` — samma ytor, meny/boka-skugga, snow `object-position`.
- `intro.js` / `intro.css` — hold 1100 ms.
- `assets/utforsakning/` — klipp-8.mp4, langd.jpg, snow.jpg.
- `assets/startsida/doodle-sol-black.svg`.

Changelogs från sträckan: `utforsakning-changelog.md`, `endag-heading-air-changelog.md`, `resa-skip-changelog.md`, `hitta-hit-skip-window-changelog.md`, `hero-parallax-freeze-changelog.md`, `omradeskort-rubrik-changelog.md`, `intro-tanndalen-hold-changelog.md`, `tabcard-height-changelog.md`, `hero-doodles-fix-changelog.md`. Ingen changelog för snow-beskärning, radvisning, menyskugga, ny snowboardbild eller förvald längdåkning.
