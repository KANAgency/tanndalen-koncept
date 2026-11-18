# Status (uppdatera i slutet av varje uppgift)

- 2026-11-18 (forts. 9): **Sajtväljarens mobilram = Safari på iPhone 16 Pro, iOS 26 (Compact)** (`sajtkoncept/index.html`, bara mobilläget; `?desktop=td|og` uppmätt oförändrat, 1440 bred). Statusrad 54 pt (9:41, Dynamic Island 125×37 på y 11, signal/wifi/batteri, systemfont/SF), Safari-fältet flytande i botten (bakåt, adressfält med domän, •••; flytande glas, mörkt när sidan är mörk), hemindikator 139×5. Sajtens iframe börjar vid säkra zonen 62 och slutar 8 pt ovanför fältet, så sajten får riktig viewport: **402 × 726**, fältet hopfällt vid scroll nedåt **402 × 748** (fälls ut vid scroll uppåt/toppen). TD:s bokningsbar slutar på 788 pt (fältet börjar 796), hopfällt 810. `env(safe-area-inset-*)` = 0 både här och i riktig Safari (sidorna saknar `viewport-fit=cover`). Ytan bakom statusrad/fält tonas efter sidans färg i topp/botten (`elementsFromPoint`, även SVG-fill, så introns mörka yta ger mörk ton och vit text). Scrollen läses med en 100 ms-timer (scroll-händelser kom inte när panelen var dold). Verifierat TD och OG, inga scrollhopp vid hopfällning efter intron (300 → 2600 → 5200 → 5000). Källor: useyourloaf (16 Pro-mått), 9to5Mac/MacRumors/bzamayo (fältets uppbyggnad), Apple-forum 800798 (fixed ritas inte under fältet). **Antaget, ej uppmätt:** fältets höjd 48/hopfällt 30, 30 pt till underkant, viewportens topp 62 (inte 54), ••• till höger (källorna oense), domänerna tanndalen.se/orsagronklitt.se. Glaseffekt över innehåll saknas (iframen kan inte rita bakom fältet). **Öppet:** kalibrera mot Johns iPhone 16 Pro (`innerHeight` med utfällt/hopfällt fält) och justera `--ip-bar-h`/`--ip-bar-bottom`/`--ip-top`.
- 2026-11-18 (forts. 7): **TD mobil runda 9** (bara <1024 utom reglaget; block "Mobilrunda 9A/9B" sist i `startsida.css`, `placeEnDagMobile()` i `index.html`; Skarvarnas förankring i Frågeblocket kom med i 190d3ec). Mätt 375×812, inga konsolfel, scrollWidth 375. **Header:** logga 8 px vänster (x 28), menyknapp 20 px höger (323–363, 4 px till glaskanten), Fjällguiden som pill med namn 13 px (185–315). **Storvigeln-etiketten:** 50 vänster, 122 ned (inte 150: då hamnar den på första Aktuellt-kortet vid 393×852); nudge −10/−72, 152–309 × 975–996. **Aktuellt:** Fjällguiden-kortet 3:4 under 768, 516 → 425 (−17,6 %). **Läget just nu:** Alpint/Längd-reglaget `neutral-subtlest` med Natt-text, **även desktop** (storlek oförändrad där); mobil 44 hög, 14 px. Kortens ytterradie 2, inre media 0; Fjällguiden-kortet fullbredd (375, radie 0 – fråga John om 2). **En vinterdag:** inte längre sticky – svepkarusell med scroll-snap, kort 319, peek 28, sektionen 2 274 → 715; rubriken 36 vänsterställd (var 48 centrerad, att godkänna). z-index: En dag 1, bokningsbaren 25 (under header 30); sidfoten ligger fortfarande över baren längst ned. **Skarvarna:** topo 40 höger, 60 upp; etiketten mellan Här bor och Utförsåkning (x 104–267), typografi som Storvigeln. **Utförsåkning:** textytan full bleed, bilden i innehållsbredd med 40 px överlapp; rubrik 24 → 36; inre padding 80/24/56. **Områdesvideon:** texten centrerad inom blocket (x 24–351), 72 px från toppen (var 105). **Kort om området:** under videon kloss i kloss i Natt-ruta, blocket 812 → 1 086. **Ej verifierat:** riktig iPhone, sommar, På plats, kontrast på ljusa områdesbilder. **Figma:** inget (TEST).
- 2026-11-18 (forts. 8): **Hitta hit mobil runda 4 + Lev. Andas. mobil.** **Hitta hit (<1024):** kartan inzoomad 0,504 → 0,628 på 375×812 (+25 %; Tänndalen–Stockholm 256 → 319 px i sidled). För att få plats: Tänndalen-namnet vänsterställt, vänsterkant 24 px vänster om ploppen (samma kant som Tänndalens ruta) i stället för centrerat; Stockholms plopp 16 px från högerkant. Kameran är inte längre helt stilla: den glider 101 px (kartan nedåt) under resan, från start (Stockholms ruta 16 px ovanför Hoppa över) till mål (Tänndalens ruta 16 px under menyområdet), smoothstep mellan att Stockholms ruta tonats ut och t = 0,95. Etiketter/ploppar skrivs bara vid skaländring, rutornas mått cachas. Paus i mål: resan är framme 160 px scroll tidigare (`TAND_HOLD_PX_MOBILE`, samma som starten), Hoppa över landar på ankomsten; från ankomst till att faktakortet når skärmen ca 230 px. 390×664: skala 0,425, Stockholms ruta 12 px ovanför Hoppa över. **Lev. Andas. Tänndalen. (<1024):** stående kort i full innehållsbredd: svart ramkant 16 px från skärmkant och 16 px över bokningsraden, färgram 16, svart 10 (desktop 46/23). 375×812: bild 291×667. Kortet toppställt (menyn är undanstoppad här) och öppnas till helskärm som förut. Vinterbild 1 beskärs från vänster (`object-position: 0%`) så skidåkarna är med; bild 2 och 3 centrerat. Desktop oförändrat (1280×800: bild 1022×582, ramar 46/23, ankomst 1800 px). **Ej verifierat:** riktig iPhone, sommarbilderna i det stående kortet (bara geometri mätt; förhandsvisningen var dold så animationen kördes med simulerad bildloop). **Figma-skuld:** Hitta hit mobil, Lev. Andas. mobil.
- 2026-11-18 (forts. 7): **TD prestanda + Hitta hit mobil runda 3.** **Prestanda (hela sidan):** boven var sidans globala parallax-loop, inte kartan. Den satte `--parallax-offset` på `<html>` (omräkning av all stil varje bild), läste `getComputedStyle(root)` 4–6 gånger per bild och läste layout (footer, täcktest) efter skrivningar. Nu: variabeln på `#parallax-layer`, rotens CSS-tal cachas (rensas i `placeAnchors`/resize), läsningar före skrivningar, variabler och lagrets höjd skrivs bara vid ändring (`setVar`). Hitta hit läser sticky-läget innan den skriver. Uppmätt skript per bild vid scroll genom Hitta hit, Mac 375×812: 4,02 → 0,66 ms (parallax 3,7 → 0,31). Desktop 1280×800: parallax 0,2 × scroll som förut (300 px vid 1500), resan når Tänndalen, etiketter på desktopvärden. **Hitta hit mobil:** markören står kvar i Stockholm 160 px scroll efter att den poppat upp (`STOCK_HOLD_PX_MOBILE`, plus introts 220 ms). Stockholms ruta 20 px ned och 20 px vänster (högerkant ploppen − 8, topp ploppen + 40). Stockholm- och Orsa-namnen 12 px vänster, Tänndalen 12 px upp (Tänndalens ruta följer med upp). Kamerans skalgolv 0,3 → 0,2 så resan ryms även på kort skärm. Uppmätt: 375×812 Stockholms ruta 16 px ovanför Hoppa över; 390×664 16 px (kartan mindre där, Tänndalen–Stockholm ca 125 px i sidled). **Ej verifierat:** riktig iPhone. **Figma-skuld:** Hitta hit mobil (oförändrat).
- 2026-11-18 (forts. 6): **TD mobil runda 8** (bara <1024, testvärden; ett block sist i `startsida.css`; desktop 1440 jämfört med/utan blocket: 0 skillnader). Mätt 375×812. **Hero:** statement 32 → 34 px + 4 px sidopadding (7 rader, sommar 8); Storvigeln-etiketten ett steg mindre (14/13) och ljusare (#A5A4A4), högerställd strax ovanför "AKTUELLT" (853–874, eyebrow 888) – kontrasten bedöms i telefon. **Aktuellt:** bilder 10:9 i stället för 1:1 (John valde 10:9) så frågekortet blir 29 px lägre (545 → 516) och fortfarande matchar högsta kortet; frågekortets padding 14 → 20; "Ställ frågan" syns alltid på mobil. **Läget just nu:** rubriken på egen rad, Alpint/Längd som segmentrad i full bredd under (x 16–359); film och webbkamera bredvid varandra som stående kort 164×218 (play uppe till vänster); På gång ryms i bredden; alla kortavstånd 16; Fjällguiden +4 sidopadding. I Påbörjad bokning/På plats tar webbkameran hela bredden (ej visuellt genomgånget). **Resten:** frågeblockets bottenpadding 40 → 28, luft till Här bor skidåkarna 288 → 120; Skarvarna-topografin 230 px högre, etiketten mitt i luckan; boendekortets rubrik 30 → 24, namn 14 → 13; utförsåkning: bild 4:5, textblocket i full bredd utan radie direkt under bilden, tätare flikar; doodlen (handske 88×135, sommar sol 88×88) sticker upp över bildens övre högra hörn. **Ej verifierat:** riktig iPhone, Skarvarna-etiketten, sommarens "m/s"-radbrytning i väderkortet (fanns före). **Figma:** inget ändrat (TEST). **Öppet:** En vinterdag i mobil.
- 2026-11-18 (forts. 5): **TD mobil Hitta hit runda 2 + typografi** (bara <1024, testvärden; desktop 1280×800 uppmätt oförändrat: resan når Tänndalen, etikettskala 0,618, copy/kort i sticky). **Typografi:** `.td-heading-lg`/`.td-heading-3` 30 → 36 px på mobil (= heading-xl mobil), override i `startsida.css`, inte i token-generatorn. Träffar Hitta hit, "Här bor skidåkarna", Fjällguiden-blocket, boende-titeln. **Indrag:** text direkt på bakgrund 24 px från kant (korten 16): Aktuellt-rubriken, En dag-rubriken, Läget just nu-texten (inte segmentet), Här bor-huvudet, Hitta hit-texten + knappen. **Hitta hit:** rubrik → ingress 12 px (var 32), ingress → knapp 24. Kartan klipptes skarpt av en gammal mobilregel (`.td-hitta-kart` overflow hidden, 68svh) – nu hela underlaget och mjuk botten (mask 100 px topp, utfasning från 100 % − 220 till 100 % − 64 ovanför bokningsbaren). Toningen under texten är en statisk `::before` på texten (ingen JS per bild). Stopprutorna ligger på mobil i `.hitta-pan-geo` utanför kartmasken (Tänndalens ruta tonas inte längre). Kameran räknas en gång (cache, stabil höjd = `clientHeight` mot iOS-verktygsfält), 25 % av överskottet ovanför. Uppmätt 390×664: Stockholms ruta slutar 16 px ovanför Hoppa över; 375×812: 34 px. Faktakortet dras upp (JS `margin-top`, −135 px vid 812) och kommer 24 px under Stockholms ruta när kartan släpper; Karta-länken dold på mobil; 7 h/med bil-glappet 11 → 6. **Prestanda:** inga omskrivningar per scrollbild av kartans transform, etiketter, ploppar, ruttens `d`, stopprutor eller markör om inget ändrats; kartbilden och kartan på egna lager (`will-change`). Mätt på Mac i 375: 0 long tasks, p95 18,9 ms per två bilder. **Ej verifierat:** riktig iPhone (fps), surfplatta. **Figma-skuld:** heading-lg mobil 36, mobilindrag 24, Hitta hit mobil. Annan sessions okommitterade "Mobilrunda 8" i `startsida.css` ligger kvar orörd.
- 2026-11-18 (forts. 3): **Stora block utan radie.** Heron (ram, film och säsongsramens clip-path, desktop + mobil), `.en-dag-media` och `.td-fraga-block` → `radius-none`. Uppmätt: 1440 och 393 hero/film/En dag/Fråga-block 0 px, Aktuellt-platta/boendekort/faktakort/utförsåkning 4 px, Lev. Andas 0. Figma: `En dag / Kort` alla 5 varianter (2043:16803–16807, var 8 och 0 blandat) och `Fråga / Block` 2363:16904 → `radius/none`; mobilheron på Concept (ram 2838:2660, film 2838:2354) → none. Regler uppdaterade i `docs/startsida-td.md` §3. **Kvar:** desktopheron i Concept-layouterna (Figma-skuld); Aktuellt-kortets bild i plattan är nästlad 4 i 4; konsolfel på mobil `pan ReferenceError: Cannot access 'cards' before initialization` (index.html `placeStopLayer`, inte från radieändringen, ej undersökt).

- 2026-11-18 (forts. 4): **TD mobil Hitta hit** (bara <1024; desktop uppmätt oförändrat: copy/kort i sticky, mask 180 px, resan startar vid 120 px). Mätt i 375×812, inga konsolfel. Pan-läget körde desktoplayouten på mobil (rubrik 150 px bred, kortet utanför skärmen, sticky avstängd). Nu: **textblocket** i fullbredd absolut överst i sektionen, över kartans intoning; kartan tonas bort under texten (`--hitta-fade-a/b` på `.hitta-pan-frame` från JS) och resan startar först när texten scrollat ut (`startPx()` = textens underkant + 24, uppmätt 284 px). **Kartan** låst (sticky 100vh) med fast kamera `mobileFitCam()` som rymmer alla tre stoppen, etiketter och stopprutor mellan menyn (88 px) och Hoppa över; Stockholm-etiketten till vänster om ploppen på mobil. **Stopprutor** 172 px, placerade i skärmpx: Stockholm under, Orsa vänster-under, Tänndalen ovanför (Claudes val, ej beslutat av John). **Faktakortet** flyttas efter sektionen (`.td-hitta-fakta-mobil`, dolt i läge 3–4) och syns först när kartan scrollat ut. **Hoppa över** bara under resan (284–1827 px), 16 px ovanför bokningsbaren. Koden landade till största delen i 2b8daa6 (annan session), toningen i denna commit. **Figma-skuld:** mobillayout för Hitta hit saknas. **Ej verifierat:** 393 px, surfplatta, riktig iPhone.
- 2026-11-18 (forts. 3): **TD mobil runda 6–7** (bara <1024; desktop uppmätt oförändrat, inga konsolfel). Mätt i 375×812. **Intro:** maskade symbolen 24 px högre i payoff-läget (`MOBILE_SYMBOL_LIFT`, mitt y 317 av 812), payoffen 40 px under symbolen (`MOBILE_COPY_GAP` 28 → 40), `intro.js`. **Hero:** glasmenyn 8 px bredare per sida (`.top-glass` inset 0 −8px, x 8–367; innehållet kvar i sidans linjer); doodlen tillbaka nere till höger i ~halv storlek (glasögon 148×73, sol 129×129, högerkant −12, botten −28/−52); statement 28 → 32 px; Storvigeln `--topo-shift-x` 200 → 50 (vänsterkant x 170). **Topografietiketten** syns i mobilen: toppen ligger bakom statement-texten, så etiketten står högerställd i luckan statement → Aktuellt (8 px luft upp/ned, nudge 40/−221) och står still mot sidan. Trångt – John bedömer i telefon. "1 561 m" är fortfarande platshållare (Storviglen, Norge). **Parallaxen** var hackig för att JS satte transform per scroll-event (en bildruta efter iOS:s egen scroll). Nu scrollstyrd CSS-animation (`hero-topo-par`, `animation-timeline: scroll(root block)`), JS sätter bara slutvärdet `--hero-topo-par-end` = (1 − f) × max-scroll; samma rörelse (48 px vid 600 scroll). Fallback till JS utan stöd (iOS < 26). Ej testad på riktig iPhone. **Aktuellt:** eyebrow → rubrik 12 → 4, rubrik → kort 40 → 28, blocket 24 px upp (margin 32 → 8); korten ram 16 → 14 och kvadratiska bilder (`aktuellt-kort.css`, max-width 767). Övriga eyebrow/rubrik-par var redan ≤ 4 utom bildblocket "Allmoge, fast i fjället" (8, orört). **En vinterdag** 64 px ned (margin 48 → 112, 56 px luft till korten). Hur blocket ska fungera i mobil är **öppet** – John har inte sagt vad som ska ändras. **Läget just nu:** en kolumn inom innehållsytan (16 px båda sidor, var 411 px breda kort som klipptes); datakortens paginering lodrätt till höger inne i kortet (12 px från kanten). Ändringarna ligger i mobilblocket sist i `startsida.css`. `.claude/launch.json` har `td-lan` (port 4174, `--lan`). **Figma:** inget ändrat – allt är TEST tills John godkänt.

- 2026-11-18 (forts. 2): **TD-radier städade efter fem regler** (`docs/startsida-td.md` §3, `beslut.md` 2026-11-18). Kod: hårdkodade 2/3/4/12/16 px, `50%` och `999px` → tokens i `startsida.css`, `aktuellt-kort.css`, `fraga-block.css`; Fråga-blocket och frågekortet `md` → `sm`; hero-filmen och glaskortet 2 → 4. OG oförändrat via override i `og-overrides.css`. Uppmätt (beräknad radie): TD 1440 och 393 hero-ram/film 4/4, glaskortets bild 4, frågekort 4, Fråga-block 4, knapp 9999; OG 1440 Fråga-block 8, frågekort 8, glasbild/-platta 2. Inga konsolfel. **Figma** (`HW7ZST3…`), bundet till `radius/sm`: `Aktuellt / Kort` glas- och glas svart-bilder/plattor (2332:16893, 2316:16766, 2332:17007, 2318:16836, 2834:16167, 2834:16183) och de fyra Typ=Fråga-varianterna (2319:16836/16853/16870/16887), `Fråga / Block` 2363:16904, `Booking / Panel`-bilderna (1481:3115 m.fl., 6 st), `Button / Text button` alla 10 varianter (446:451–469, var 6), `Top Menu` Menu / Label Button (935:1325, 2042:22695, var 6), mobilherons film på Concept 2838:2354. Verifierat med skärmdumpar. **Kvar:** `Form / Dropdown` (6) och `Calendar / October` (12) i Figma; OG:s radieregler; biblioteket måste publiceras.

- 2026-11-18 (forts.): **OG Aktuellt läge 3–4 + Mer-blocken.** Aktuellt har nu egna kort för läge 3 (påbörjad bokning) och läge 4 (på plats) i både vinter och sommar, 5 kort per uppsättning med Orsaguiden-frågan som kort 3 (vinter 3: Barnens Vasalopp, skidskola, "Vad behöver vi ta med till stugan?", liftkort, hyra; vinter 4: Superfredag, kvällsbacke till 19, matsäck, slädtur Fryksås, hundspann; sommar 3: klätterpark, cyklar, bad-frågan, lakan/slutstädning, veckans program; sommar 4: klättra efter lunch, grillbuffé Toppstugan, regnfrågan, minigolf, [Bärra i blåbärsskogen]). Platshållaren "Aktuellt (läge 3–4)" borttagen. **Mer till er vecka** (`#mer-resa` vinter, `#mer-resa-sommar`) och **Mer att hitta på i dag** (`#mer-nu` vinter, `#mer-nu-sommar`) byggda som port av TD:s `.td-mer` (boendekortets layout, 6/6/6/5 kort, OG-innehåll: Blåbärskort, snowparkgrupp, Toppstugan, slädtur, kalas, pulka, grillplats, längd, Nya Skafferiet, bastuflotten; sommar klätterpark, cykelhyra, Skärmfria barn, bastu, fiske, bad, pool, skillsbana, spången). OG har blocken även på sommaren (TD bara vinter) – beslut från innehållsgenomgången, ändra i blockordningen om John vill ha som TD. Saknade bilder = tom taupe-platta "Bild saknas: …" (10 st). Bilder i `assets/img/mer/` och `assets/img/aktuellt/`. Dubbletter mellan Aktuellt och Mer i samma läge rensade. Verifierat i alla 8 läge×säsong: rätt blockordning, rätt kort, 0 trasiga bilder, inga konsolfel; Mer 160 px under Just nu. **Påhittat i [ ]:** de flesta priser, klockslag, avstånd, slädturens detaljer, sommarveckans program, "Bärra i blåbärsskogen". Verifierat (orsagronklitt.se): Blåbärskort 350 kr/dag, kalas tisdagar, Superfredag, kvällsåkning tis/fre till 19, hundspann fr. 325 kr, klätterpark 320/390 kr, 110/140 cm, sista start 14, 24 nedfarter, barn ≤6 år gratis med hjälm. Orsa Rovdjurspark stängd 2022 – får inte nämnas. **Öppet:** läge 3-kalendern i `modes-content.js` har "[Fackeltåg i barnbacken]" ons 17 feb som inte finns i OG:s program (förslag: Barnens Vasalopp). **Figma:** `Top Menu`-komponenten hade Tänndalens logga; nu `Logo / Orsa Grönklitt` (Light) i båda varianterna, Concept Desktop-28:s lösa loggvektor bytt mot instans, en lös TD-menyinstans (fjärrbibliotek, y −13673 på Concept) borttagen.

- 2026-11-18: OG-Figma (`jrzIaMmpGk3vCmbOC0gEjP`) synkad med dagens kod. **Ny textstil `UI/figure-xl`** (S:ebad8035…): Literata Bold 96/96, −1,92 px (−2 %), bunden till nya variabler i `OG / Typography – responsive`: `figure-xl/size` 4092:1382 (96, code syntax `var(--font-size-96)`), `figure-xl/line-height` 4092:1383, `figure-xl/letter-spacing` 4092:1384 (samma värde Desktop/Mobile, som koden). **Ny komponent `Logo / Orsa Grönklitt`** 4094:15621 (Context=Light 4094:15617 fyllning `color/night`, Dark 4094:15620 `color/snow`), byggd från `og/desktop/assets/brand/logo-vertical-white.svg`; filens `Logo` var Tänndalens ordmärke. **Ny komponent `Footer`** 4093:15609 på Foundations & Components (x 26181, y 32212): 1440 bred, kodens grundform (padding 96/80/40, kolumn 360 + nav 3 kolumner, glipa 80/48, linje 64/24), `color/bg-inverted`, text `color/day`, rubriker `color/neutral-subtle` versaler `Editorial/eyebrow-xs`, länkar `Editorial/body-sm`, juridik `UI/nav` `color/neutral-muted`, `Button / Secondary` Fill=snow Medium Dark, logga Dark. Uppmätt 1440 × 459 (koden 1440 × 501; skillnad = radhöjder i textstilarna). Paddingar 96/80 är inte bundna (Spacing-samlingen saknar 96 och 80). Verifierat med skärmdump. `Aktuellt / Kort` stämmer redan med koden (frågekortet i guidefärgen sedan 17 nov). **Kvar (Figma-skuld):** `Just nu / Webbkamera` har fortfarande TD-panoramat som bildfyllning (byt till `assets/img/webbkamera-vinter.jpg` manuellt); Concept-skärmarna för OG (Aktuellt, footer, borttagen hero-ram, En dag-luft) är inte omritade; `Top Menu` har kvar TD-loggan (kan nu bytas till `Logo / Orsa Grönklitt`); biblioteket måste publiceras.

- 2026-11-18: OG desktop, tweaks läge 1–2 (sommar + vinter). **Heroramen borttagen** (snöiga tallar under bokningsbaren), båda säsongerna; bokningsbaren står i flödet under ingressen, ankaret 81 px så panelen fälls ut uppåt som förut (täcker rubriken när den är öppen – OG ska få en annan lösning). **En dag:** mörka ytan +64 px ovanför och 96 px under kortet (marginal + utökad clip-path, sektionens box orörd så scrollmotorn räknar som förut); uppmätt rubrik 112 px från mörk kant (var 48). **Handplockade boenden** (sommar, läge 1–2): +96 px luft efter En dag (padding-top, marginal kollapsade). **Väderkortet:** OG saknade `.td-ui-figure-xl` → ny OG-stil `UI/figure-xl` i `typography-og.css` (Literata Bold 96/96, −0,02 em); uppmätt 96 px. **Webbkameran:** var TD:s Storvigeln-panorama; nu 5:1-utsnitt ur kundens drönarbilder: vinter `assets/img/webbkamera-vinter.jpg` (DJI_…0037, stugbyn i gryning), sommar `assets/img/just-nu/sommar/webbkamera-sommar.jpg` (DJI_…0799, tjärnen); samma pan-animation. **Aktuellt** (nytt block, port av TD:s): 6 kort per säsong i läge 1–2, innehåll från innehållsgenomgång (orsagronklitt.se 18 nov + bildbanken, bilder i `assets/img/aktuellt/`); frågekortet = Orsaguiden i guidefärgen; rubrik i boendeblockets stil; karusell, glasplattor och "Gå till säsong" portade. Läge 3–4 visar platshållaren "Aktuellt (läge 3–4)". Verifierat: rätt kort per säsong, alla bilder laddar, pilar fungerar. **Footer = delad komponent:** `shared/design-system/components/site-footer.css` (TD:s regler flyttade ur `startsida.css`, färger/typsnitt som `--site-footer-*`) + `shared/js/site-footer.js` (markup från `SITE_FOOTER` i respektive `site-config.js`). TD-footern uppmätt identisk mot HEAD (52 element, mått + beräknade stilar). OG-footern i Orsa svart/off-white, Radio Canada Big, vertikal vit logga; ersätter platshållaren. Inga 404/konsolfel i OG. **Påhittat i Aktuellt (står i [ ]):** julpris (kampanjpris på sajten), skidskolepris/ålder, sommarpriser, midsommar, Skärmfria barn-detaljer, barncyklar. **Figma-skuld:** textstilen `UI/figure-xl` för OG, OG-instanser av Aktuellt i Concept, footern. **Ej verifierat:** mobil, läge 1 efter introt i webbläsare (rAF), bokningspanelens läge utan bild i alla lägen.

- 2026-11-17: Sajtväljaren (`sajtkoncept/index.html`): **Desktop** öppnar nu `/?desktop=td|og` – sajten i iframe över hela fönstret utan toppbar, bara en liten ljusgrå rund bakåtpil (28 px) uppe till vänster. Bredden är minst 1440: fönster ≥ 1440 → sajten fyller bredden i 100 %; smalare → 1440-layouten skalas ned så att den fyller bredden (ingen surfplattelayout i kundmöten). **Mobil** är nu iPhone 16 Pro, 402 × 874, ram 15 px, radier 70/55, och visas i ungefär verklig storlek (skala högst 0,83 ≈ 150 mm hög på en Mac-skärm, antar ~0,2 mm per CSS-px). Toppraden i mobilläget har en helskärmsikon (fyra hörn, Fullscreen API) i stället för "Öppna ↗". **Förhandsvisningarna startar som Ny besökare** (`mode=new`, och sparat På plats för sajten rensas) om adressen saknar `mode`/`plats`/`visit`/`intro`; tidigare tog sparat läge/På plats över. Uppmätt: desktop 1920×1000 → 1920×941 i 100 %, 1280×800 → 1440×834 skalad 89 %; mobil 402×874, 750 px hög i fönster 1600×950; lägen `?mobil=td`, `?mobil=og`, `?desktop=td` = new, `?mobil=td&plats=1` = onsite. Inga konsolfel. **Ratat samma dag:** laptopram (CSS-ritad och Adobe Stock 438596236; utskuren PNG ligger kvar i Johns Downloads), svart kant runt 1440-scenen. **Ej verifierat:** helskärmsknappen med riktigt klick; `?desktop=og` i bred skärm.

- 2026-11-17: OG-Figma, Orsaguiden del 2 (mått uppmätta i koden 1440). Nya komponenter bredvid `Fråga / Block` på Foundations: **`Guide / AI-tagg`** 4091:15530 (Size=Small 16×13 header, Medium 18×14 kort, Large 20×16 block; Radio Canada Bold 8/9/10, kant 1 px text-primary, radie 3). **`Guide / Live`** 4091:15531 (8 px, `status-open` #2E7D46). **`Guide / Knapp`** 4091:15555 (Säsong=Vinter/Sommar, 196×40, pill `radius/full`, padding 8/24/8/16, glipa 8: Guide 24, "Orsaguiden" Literata Bold 14/−1 %, AI Small, Live). **`Just nu / Orsaguiden`** 4091:15622 (Säsong=Vinter/Sommar, 411×262, padding 24/24/16, `radius/sm`): topp 36 (Guide 36, namn Heading/xxs 20/26 −1 %, AI Medium; status prick + "Vi är här" 13 bold + "[till 17.00]" 13), överrubrik UI/kicker versaler +2 %, tre frågerader 44 px (Editorial/body-sm 16/26, pil 16 px 40 %, avdelare text-primary 30 %). **`Top Menu`** (båda varianterna): "Behöver du hjälp?" ersatt av `Guide / Knapp` Vinter. **`Fråga / Block`**: namnet + AI Large + Live i en rad (glipa 8). **Concept** Desktop-28: `Just nu / Fråga` (1999:22511) bytt mot `Just nu / Orsaguiden` Vinter. Verifierat med skärmdumpar. **Kvar:** `Top Menu` har fortfarande Tänndalen-loggan (fanns före); mobilvarianten av knappen (bara märket, 40×40) och mobilkortet är inte inritade; `Aktuellt / Kort` Typ=Fråga är fortfarande enfrågekortet; biblioteket måste publiceras.

- 2026-11-17: Figma OG-filen (`jrzIaMmp…`) synkad med Orsaguiden-varumärket (kod 4e3dde5). **Ny ikon** `Icons / Content` Name=Guide (24/32/48 × Light/Dark, 4088:15686–15731): guidemärket från koden, konturerat; linjer `color/text-primary`/`text-inverted`, prick `color/accent` (signalorange), halo `color/season-winter` (byts mot `color/season-spring` på sommarytor). **Nya variabler** `color/season-spring` primitiv 4088:15622 (#F6E0A2, code syntax `--color-OG-season-spring`) + semantisk 4088:15623 (alias, `--color-season-spring`). **`Aktuellt / Kort` Typ=Fråga** (2319:16836/16853/16870/16887): Guide-ikonen 32, namnet "Orsaguiden" i Literata Bold (−1 %), plattan `color/season-winter` (Vinter) och `color/season-spring` (Sommar, var mörkgrön), all text Orsa svart (`contrast/on-season-*`), headern Context=Light. **`Fråga / Block`** (2363:16904): Guide-ikonen 48, "Fråga oss" → "Orsaguiden" (Literata Bold 24, ej versaler), bakgrund `color/season-winter`. Verifierat med skärmdumpar av komponenterna. Instansen på Concept (2360:23734) har rätt data men Figmas rendering visade fortfarande versal-etiketten vid kontrollen (troligen fördröjd rendering). **Figma-skuld:** guidekortets struktur i koden (status "Vi är här", lista med frågor, AI-tagg) finns inte i `Aktuellt / Kort`; (löst samma dag, se ovan); `Just nu / Fråga` (äldre, "Undrar du något?") orörd. Biblioteket måste publiceras.

- 2026-11-17: Figma `Meny / Panel` (2042:22727, båda varianterna) följer nu koden (beslut John: komponenten ska följa koden). Ordning Boende → Skidåkning → Aktiviteter → På plats → Planera resan → **Vanliga frågor** (ny rad). Raderna 56 px (rad-padding 2, utfälld 2/6), variabeln `menu/row-gap` 6 → 4. Panelens topp-padding 16 (`space-lg`). Ny grupp **Reglagegrupp · på plats** mellan säsongsväljaren och foten: fält 392×42 med `UI/nav` "Jag är på plats i Tänndalen" + `Form / Toggle` Off/Light, padding 8/12 (`space-sm`/`space-md`), kant `neutral-light` 1 px, `radius/sm`, 4 px ovanför och 24 px under. Uppmätt mot koden i 1440: panelen 609 px i både kod och Figma (rader y 16/76/…/316, säsong 380, fält 485, fot 551). Helskärmsmenyn på Concept (2839:3115) var kopplad till en importerad bibliotekskopia; nu bytt till den lokala komponenten med 393 bredd och padding 64/20/20 (`space-xl`). Verifierat med skärmdumpar. Tumnageln för Vanliga frågor är `meny-fragor.jpg` (vinterbilden, uppladdad till Figma, båda varianterna). **Biblioteket måste publiceras.**

- 2026-11-17: TD-mobilen inritad i Figma (Concept) som byggd i kod, mätt i 393×852. Tre nya ramar till höger om skissen `iPhone 16 - 1` (935:1511, orörd): **Startsida** 2838:2353 – header med glas (Dag 65 %, blur 28), Fjällguiden-ikon 32 px + meny; hero med säsongsram 361×456 och film 329×424 (radie 4/2), ingen sol; ingress 361 bred; topografin på x 320 (uppmätt, etiketten dold eftersom den inte renderas i koden); Aktuellt med eyebrow, rubrik 36 och spår med fyra `Aktuellt / Kort`-instanser (337 bred, glipa 12 = `space-md`, peek ~28 px). Header, statusrad och bokningsrad är fasta vid scroll. **Intro, payoff-läge** 2839:2552 – symbolen 314 px (80vw) vid y 266, payoff 44/110 %, −2 %, "Hoppa över" som `Button / Secondary` Large. **Helskärmsmeny** 2839:3114 – `Meny / Panel` Läge=Samlad, 393 bred, padding 64/20/20, headern med stängknapp på `neutral-subtlest`. Statusraden (59 px) ligger ovanpå kodens y-värden i startsidan; intro och meny är ritade som viewport utan statusrad. **Avvikelser att ta ställning till:** (1) payoffen 44 px och Aktuellt-rubriken 36 px ligger utanför Figmas mobilskala (Heading/md ger 24 i Mobile-läget; jag använde Heading/xl = 36), se `docs/typografi-mobil.md`. (2) Löst samma dag, se raden ovan (menykomponenten följer koden). (3) Film går inte att lägga som fyllning via API:t: introsymbolen har en stillbild (pistkartan) som platshållare, korten har komponentens mörka bildplatshållare. (4) Bokningsraden är skissens `Booking / Bar · mobil` (103 px med marginal), koden är 61 px i startform.

- 2026-11-17 (4e3dde5): OG Orsaguiden-varumärket överallt, inte bara i headern. Just nu-kortet (`#fraga-card`, alla lägen) och Fråga-blocket (`#fragor`) har guidemärket (samma SVG som headern, pricken i `--color-accent`) i stället för chattikonen och namnet "Orsaguiden" i Literata Bold. I Fråga-blocket är "Fråga oss" ersatt av Orsaguiden med AI-tagg och live-prick, som TD:s Fjällguiden. Båda ytorna har `--color-OG-guide` med Orsa svart text (`og-overrides.css`; `html.theme-OG[data-season]` slår td-blocks sommarregler). Uppmätt guidefärg: vinter #A1B5BA (TD-vintern via season-winter-testet), sommar #F6E0A2. Lägesmenyn (OG): "(endast vinter)" borttaget från Påbörjad bokning (`site-config.js`), menyn har `width: max-content` + `nowrap` så att "Återkommande besökare" ryms på en rad. Verifierat i iframes 1440: alla fyra lägen × vinter/sommar visar kortet och blocket i guidefärg, och Påbörjad bokning i sommar har egna frågor. Modalens följdfält har kvar chattikonen (som TD). Inte sett på skärm (dold panel). **Figma-skuld:** OG-filens guidekort och Fråga-block har inte uppdaterats.

- 2026-11-17: Figma synkat mot koden (ny stående regel i `CLAUDE.md` §6: systemnivå synkas i samma uppgift, sidlayouter blir Figma-skuld). **TD-filen** (`HW7ZST3…`): `Aktuellt / Kort` (2235:16983) – alla Layout=Mobil har tunnare ram 16 px (`space-lg` på Platta och Innehållets sidor, Fråga-kortens topp/sidor), som kod 5801e46; nya varianter **Platta=Glas svart** Desktop 2834:16165 / Mobil 2834:16181 (Natt 80 %, kant Snö 10 %, `radius/sm`, skugga 0 8 12 6 %, bakgrundsoskärpa 14) = `data-platta="glas-svart"`. Ny textstil **UI/body** (CircularXX Book 16/150 %) – fanns i koden men inte i Figma – används på Fjällguidens datakort i Frågerutan (2384:2771, tre etiketter). **OG-filen** (`jrzIaMmp…`): `UI/figure*` (7 stilar) har letter-spacing 0 som koden (9d944bc); "OG-sifferstilar saknas i Figma" stämde inte, de fanns med TD:s tracking. Verifierat med skärmdumpar. **Biblioteket måste publiceras** för att ändringarna ska nå andra filer. **Figma-skuld (ej gjort):** TD mobil-layouter på Concept (topografin, Aktuellt-karusellens peek/snap, payoff/intro-mått, helskärmsmenyn) är byggda i kod efter 948:2254/935:1592; glas svart i Figma saknar kortets egen suddiga bild bakom plattan (Figma kan inte göra det dynamiskt); `neutral-subtlest` #E0DFDB i Figma vs #E0DFDE i kod (3/255, orört); OG-vinterfärg och menyknapp är TEST och förs inte in förrän John bestämt.

- 2026-11-17: Orsaguiden, bilder mappade mot kundens bildbank (`../assets/og/bilder och videos/Webb_vinter` + `Webb_sommar`, 1 437 bilder genomgångna via kontaktark). 25 av 27 platshållare i `og/desktop/orsa-guiden.js` ersatta med 22 nya 1024²-utsnitt i `og/desktop/assets/img/guide/` (3 MB). Källor: Blåbärslyan AA103392, Wärdshuset AA105716, Skidskola AA102944, Blåbärsskogen AA101823 (Härbret), Barnområdet AA102614, Bärra i barnbacken AA101342, Barnbacken AA102501, Toppstugan AA102173, Björnjakt AA101756, Bärra dansar AA101603, Fiket vid spårstarten AA104266, Klätterparken AA106412/AA106323/AA106287/AA106405, Rädsjön DJI_…211612_0807/AA107502/AA107417, Tjärnen AA109657, Trollstigen AA108148/AA107161, Cykel AA106962. Verifierat: alla 22 laddar (200, 1024 px), svar renderas med nya bilder. **Osäkert (John bedömer):** Wärdshuset = levande ljus-middag i timmerstuga, Toppstugan = stora glasfasaden, Blåbärslyan = interiör med lyktor – inte bekräftat att det är just de platserna; Rädsjön-bilderna är okänd sjö. **Kvar som platshållare:** [Kulturhuset i Orsa] och [Musik vid Skattungen] (inga motiv i banken). En dag sommar och boendeposter: se nästa rad.
- 2026-11-17: OG En dag sommar och boendeblocket har riktiga bilder från kundens bildbank (inga platshållare kvar i `index.html`/`td-blocks.js`). En dag (`og/desktop/assets/img/en-dag/sommar-*.jpg`, 1800 px långsida, alt-texter uppdaterade): Cykla från toppen AA106922 (familj med cyklar, utsikt över Orsasjön), Pizza på Wärdshuset AA106804 (pizza utomhus i skogen, inte Wärdshuset), Klätterparken AA106287-2, Grilla vid stugan AA108996 (korv på grillen, närbild), Kvällsdopp AA107430 (porträtt, annan bild än introts AA107523). [Stugbyn]-posten: drönarbild över stugbyn i snö vid skymning, DJI_20260212070220_0031 → `assets/img/boende-stugbyn.jpg` (2500 px, 940 kB). Verifierat: alla sex laddar, sommarbilderna visas efter säsongsbyte, poster satt som bakgrund. Utsnitten i layouten har inte setts på skärm (dold panel).

- 2026-11-17: Kartläggning av mobilvärden för alla TD-textstilar i `docs/typografi-mobil.md`. Fynd: mobiltrappan för rubriker är inte monoton (md 24 < sm 30, lg = sm = 30), 30 stilar saknar mobilvärde, heading-2-hero är flytande och oanvänd, Aktuellt-eyebrow motsvarar eyebrow-sm. Fem beslut väntar på John. Ingen kod ändrad.

- 2026-11-17: OG-intro sommar: rad 2 är "i skidparadiset" som på vinter (var "med hela familjen", `hero-page-config.js`). Verifierat vid sidladdning och live säsongsbyte.
- 2026-11-17: TD mobil runda 5: båda topografierna ett steg mörkare under 1024 px (neutral-light → neutral-subtle #C3C1C0, fortfarande 80 %). Storvigeln flyttad 250 px upp och 200 px höger (`--topo-shift-x/y` i mobilblocket): vänsterkant x 320 av 393, topp 15 px ovanför ingressen, så ca 73 px syns i högerkanten och den går in bakom ingressens slut. Verifierat 393. Desktop orört (regeln ligger i max-width 1023).
- 2026-11-17: TD mobil runda 4: topografin ~1 skärmhöjd utanför flödet, ingress → Aktuellt 112 px, Aktuellt-kort med tunnare ram (16), peek, snap och rätt slut (bugg: oändlig spacer på mobil). Verifierat 393 och 1440. Öppet: fontskalning – mobilstorlekar finns för 33 textstilar (generator, brytpunkt 1023), men UI/kicker saknar mobilvärde och 82 regler i startsida.css sätter font-size direkt.

- 2026-11-17: OG faktakoll mot orsagronklitt.se. Verifierade fakta med källor i `docs/og-fakta.md`. Rättat i konceptet: 24 nedfarter, 145 km spår, elljusspår 4,2 km, incheckning 16:00/utcheckning 11:00, reception 08:30–16:00, skiduthyrning bakom receptionen, skidskola från 3–4 år, Barnbacken, Rädsjön i stället för Skattungen, cykel 50+ km och sommarlift tis/tor/fre 10–14, riktiga evenemang (Ski Marathon 6 feb, sportlov 14/2–7/3, Orsa GRVL, Grönklitt Trail), webbkameror (Barnområdet, Södra skidområdet), boendebyar Toppbyn och Skogsbyn, Fryksåsturen borttagen. Rovdjursparken bortplockad (John 17 nov): vinter → Bärra Blåbär, Blåbärsskogen och Blåbärslyan (inomhus, regnalternativ); sommar → klätterparken och Rädsjön (bastuflotte, SUP). Nya frågan "Är klätterparken öppen idag?" verifierad i Orsaguiden. Tider/åldrar för Blåbärslyan och klätterparken är [platshållare]. En dag sommar utan TD-rester: Cykla från toppen (Toppstugan 561 m, 50+ km leder), Pizza på Wärdshuset, Klätterparken, puffen Kvällsdopp i Rädsjön (verifierat i sommarläge). Bilderna är fortfarande platshållare. **Öppet, John beslutar:** fika vid spåret; regnsvaret (Kulturhuset, biblioteket); restid/väg från Stockholm; [Stugbyn]; spårkortpris och barngräns.
- 2026-11-17: OG-introt (vinter): Lägereld-scenen (`brasa.mp4`) har nu HTML-snön (`snow: true` i `og/desktop/hero-page-config.js`). Snö i Total tystnad, Vinterbad och Lägereld; ingen i Kaffepaus och Kvällsmys. Uppmätt: snöcanvasens opacitet 1,00 genom hela brasa-klippet.
- 2026-11-17: TD mobil runda 3: payoff 44 px, bokningsraden 61 px och kompaktläge 57 px vid scroll (Figma Mode=Compact), pill efter knappens mått, Storvigeln-topografin synlig under ingressen, helskärmsmeny med chevrons i linje. Verifierat 393 (övergångar mätta utan transition, eftersom panelen pausar animationer) och 1440. Öppet: topografins etikett, beslut 3–5 i `docs/mobil-td.md`.

- 2026-11-17: OG taupe skild från vinter: `color/OG/taupe`, `taupe-tint`, `taupe-light` och `color/cta-secondary` (→ taupe-tint) finns nu i tokens som i OG-Figma (`jrzIaMmpGk3vCmbOC0gEjP`). Overriden `--color-season-winter: taupe-tint` borttagen; sekundärknappar (`td-button-fill-winter`, `fraga-send`, `fraga-follow-icon`) använder `--color-cta-secondary`. Säsongsytor (Orsaguiden-kortet, Fråga oss-blocket, På plats-toppbaren, säsongsväljaren, progressbaren) följer nu riktig vinterfärg. Vinterfärgen = **TEST: TD:s #A1B5BA** (sjöblå ratad, för turkos). Figma: nya `color/season-winter` (primitiv + semantisk alias, code syntax satt), beskrivningar på cta/accent, code syntax på taupe-variablerna. **Öppet:** (1) John bedömer TD-vintern i OG. (2) Löst: `color/icon-highlight` i OG-Figma pekar nu på signalorange, som koden; regeln "orange = liten signal, grön = yta/tillstånd" i `beslut.md`. (3) Menyknappen mäts solid (#E0DFDB, opacitet 1) – kunde inte återskapa transparensen John såg.
- 2026-11-17: TD intro: ordmärket ligger utanför zoomgruppen (#intro-wordmark direkt i #intro-plate), så bara symbolen växer. Ordmärket står still och tonar ut. Verifierat: startlägets position oförändrad (mobil 237 px, desktop 543 px), ordmärket har samma storlek efter tillväxten.

- 2026-11-17: TD intro startar nu med riktiga vertikala loggan (ordmärket från SVG:n, inte live-text), både mobil och desktop. Mobil: payoff 48 px, 28 px under symbolen. Heroramen till ingressens kanter, Fjällguiden-cirkeln 32 px. Verifierat 393 och 1440.

- 2026-11-17: Fjällguiden/Orsaguiden, datakorten i startvyn (TD + OG): kortrubriken (Nysnö, Liftar …) är nu `td-ui-body` (16 px, Book/Regular) i stället för `td-ui-title` (18 px bold). OG-siffrorna: alla `.td-ui-figure*` i `generated/typography-og.css` har `letter-spacing: 0em` (var TD:s Superclarendon-värden −0,017 till −0,04em, handkopierade, inte från Figma; påverkar också OG:s Just nu-block). "Andra brukar fråga" vänsterställd när välkomstvyn visas (gäller i praktiken alla lägen, välkomstvyn är aldrig tom). Öppet: OG-sifferstilar saknas i Figma.
- 2026-11-17: OG färgroller och meny: `color/OG/cta` = mörkgrön #003E3A (fyllning/bakgrund), `color/OG/accent` = signalorange (förgrund), `color/OG/season-winter` = sjöblå #9DC7CB i `primitives.json`, tokens regenererade (bara OG-raderna ändrade). Hårdkodad cta-override i `og-overrides.css`/`hero-page.css` borttagen. Orsaguiden utan bindestreck; guidefärgen pekar på season-winter; märkets prick = `--color-accent`. Menyns säsongsväljare: vintertummen sjöblå. Utfälld meny: 8 px mellan bild och underruta (var 2), 14 px ned till nästa bild. Verifierat 1440. **Öppet:** OG-Figmafilens variabler är inte uppdaterade – nyckel till OG-filen saknas (`HW7ZST3…` har bara TD-primitiver). `cta-on-dark` PLACEHOLDER. `--color-season-winter` i `.theme-OG` är fortfarande taupe-tint för sekundärknappar.
- 2026-11-17: Dev-servern svarar 206 på Range-anrop (krävs för video i iOS Safari) och loggar inte längre BrokenPipe. Verifierat med curl: 206 + rätt bytes, full GET 200. Öppet: hero-vinter.mov är 56 MB QuickTime – mobil behöver en lättare mp4 före skarp visning.

- 2026-11-17: TD mobil, Johns feedback runda 1: introsymbolerna större (maskad 80vw), payoff på två rader nära symbolen, säsongsknapp borttagen, headerglas som desktop, allt 32 px högre, säsongsram på heron. Bugg rättad: intro kunde fastna svart vid sen första bildruta (gäller även desktop). Verifierat 393 och 1440. Detaljer i `docs/mobil-td.md`.

- 2026-11-17: TD Lev. Andas. Tänndalen., sommar: slutbilden var oskarp (1333 px bred porträttfil uppskalad till helskärm, ~2× vid DPR 2). Ny export `brand/td-brand-3-sommar-skarp.jpg` 3000 × 4500 från originalet `../assets/td/bilder och video/sommar/IMG_0141.jpg`, samma komposition, 660 kB. Gamla `td-brand-3-sommar.jpg` ligger kvar oanvänd.
- 2026-11-17: Dev-servern har `--lan` (lyssnar på 0.0.0.0, skriver ut LAN-URL) för test i iPhone på samma Wi-Fi. Verifierat: 200 via 192.168.68.56 med `--lan`, inte nåbar via IP utan. Instruktion i `sajtkoncept/STRUKTUR.md`.

- 2026-11-17: TD Lev. Andas. Tänndalen., sommar: Andas-bilden är nu porträttet av Sofie med cykelhjälm (`brand/td-brand-2-sommar-sofie.jpg`, 2000 × 1333, beskuren tätt på ansiktet som vinterbilden, källa `../assets/td/bilder och video/porträtt/sofie_tanndalen_portratt.jpg`). Regel: Andas ska alltid vara ett porträtt. Annas porträtt (`td-brand-2-sommar.jpg`) ratat av John, ligger kvar oanvänt. Sofie är det enda sommarporträttet i bildbanken; vill John ha annat tas det från varumärkesmanualen.
- 2026-11-17: TD mobil hero: filmen 345×440 (4:5) enligt Figma 948:2254, ingen säsongsram och inga doodles på mobil. Intro → hero verifierat i 393, desktop oförändrad. Öppet: beslut 3–5 i `docs/mobil-td.md` (En dag, områdesblocket, Hitta hit). Därefter A-blocken.

- 2026-11-17: OG huvudmeny: (1) Meny- och kontoknappen på `--color-OG-neutral-subtlest` #E0DFDB (var taupe-light #EBEAE6, för lik panelens glas #F5F4F0) – TEST, John bedömer. (2) "Fråga oss" i headern är nu **Orsa-guiden** (platshållarnamn) med Fjällguidens märke (pricken i OG-signalorange #E74011), AI-tagg och live-prick. Egen färg `--color-OG-guide`: vinter sjöblå #9DC7CB (`--color-OG-guide-winter`, beslut John 17 nov, ersätter TD:s #A1B5BA; finns bara i `og-overrides.css`, inte i primitives/Figma), sommar vår-gul #F6E0A2 (sommargrönt krockar med mörkgröna CTA). <1024 bara märket, 40 px. (3) Introt: när menyn väl kommit in ligger den kvar när man scrollar tillbaka upp och ersätter stora loggan (`hideHeaderAnimated` borttagen i `hero-page.js`). Verifierat 1440 (vinter/sommar, scroll ned→upp, modalen öppnas). Känt: OG saknar mobilheader (260 px menyknapp gör att actions sticker ut i 375); bör tas i OG-mobil.

- 2026-11-17: TD mobil grunden: header enligt Figma 935:1592 (logga vänster, Fjällguiden-ikon, säsong, meny; konto dolt), bokningsraden ryms på 393 (`booking.css`, gäller även OG), lägesknappen dold <1024. Verifierat 393 och 1440 (desktop oförändrad). Öppet: beslut 2–5 i `docs/mobil-td.md`, därefter hero.

- 2026-11-17: Sajtväljaren (`sajtkoncept/index.html`, `/`) omgjord: mörk sida med två bildkort (TD stjärnhimmel, OG vinterskog) med logga, payoff och knapparna Desktop/Mobil. Mobil = `/?mobil=td|og` visar sajten i iframe 393 × 852 i telefonram (skalas för att få plats, växla sajt, ladda om, öppna i nytt fönster; övriga parametrar som `?plats=1` skickas vidare). På en riktig telefon öppnar Mobil sajten direkt. Fristående sida, inga nya filer; `npm run build` verifierad (bilder/loggor finns i dist).
- 2026-11-17: TD Hitta hit har sommarcopy: ingressen ("Kör på morgonen, vandra i kvällssol …") och de tre stopptexterna (Stockholm/Orsa/Tänndalen) byts med säsongen via `data-summer` + `HITTA_STOP_BODIES`/`syncHittaCopy` i `td/desktop/index.html`. Gäller både standardkartan och `?hitta=pin`. Rubrik, knapp och faktakort är oförändrade. Öppet: verifiera att bussen Östersund–Tänndalen går sommartid. Känt sedan tidigare: `?hitta=pin` kastar `mobileQ is not defined` i `placeHittaFrame`.
- 2026-11-17: TD mobil påbörjad: triage av nybesökarläget i 393 px finns i `docs/mobil-td.md` (A 8, B 3, C 4 block + Hitta hit). Lägesväljaren skippas i v1. Öppet: Johns fem beslut (header, hero-porträtt/sol, En dag, områdesblockets karusell, Hitta hit), sedan bygge enligt ordningen i filen. Ingen kod ändrad.

- 2026-11-17: TD områdesblocket, Järven: `posterSize: auto max(138%, 56vw)` + `posterPosition: 50% 0%` (zoom relativt blockhöjden; första versionen 76vw zoomade för mycket i breda/låga fönster). Förra lösningen (50% 65%) gjorde inget på skärmar nära 16:9 eftersom bilden (1,79:1) inte var högre än blocket. Verifierat i 2000×860 och 1600×900: text och CTA i snön ovanför trädlinjen, stugan syns. Stugans nederkant hamnar bakom karusellkontrollen.
- 2026-11-17: TD läge 1–2 (vinter): utförsåkningsblocket (`#utforsakning`) ligger nu före områdesblocket (`#boende`), ordningen är bytt i DOM:en. I läge 3, läge 4 och sommar är `#boende` dolt, så där påverkas inget. Rasmus-citatet (`#citat-band`) kommer nu efter områdesblocket. 120 px luft mellan utförsåkning och områdesblocket (`.utforsakning + .boende` i `startsida.css`).
- 2026-11-17: TD: Aktuellt-kortet "Vintern kommer" utan nedräkning – kicker "Vinter 27/28" (var "23 dagar kvar"), brödtext utan brådska. Anna-citatet vid Skarvarna dolt i läge 4 (`visibility: hidden` i `startsida.css`, övriga lägen oförändrade).
- 2026-11-17: TD läge 4 (På plats), Just nu-kalendern: länken "Skidorna" på raden 14:00 Längd borttagen (gäller både Alpint och Längd, samma data i `modes-content.js`).
- 2026-11-17: TD: alla siffer-platshållare (`[X]`, `[60]`, `[1 690]`, tider, datum) ersatta med rimliga exempelvärden utan hakparentes (68 ställen i `td/desktop/index.html`). Beslut (John): [] bara för textplatshållare ([Artist], [plats], [Namn]); siffror är exempel och ska se ut som riktigt innehåll. Värdena är påhittade och ska bytas mot R360/kunddata före skarp lansering.
- 2026-11-17: OG-intro byter säsong live (og-season-event → `setScenes` i `hero-page.js`), byter direkt till säsongens första klipp, rubrikrad 2 och herotitel. Tidigare krävdes omladdning.
- 2026-11-17: TD-videor hostas i Cloudflare R2 (Johns KAN-konto, bucket `td-video`, prefix `td/` och `og/`, publik r2.dev-URL). `build-dist.mjs` skriver om `assets/video/` till R2 när `TD_VIDEO_BASE` är satt (görs i deploy-workflow). Lokal dev oförändrad. Nya/ändrade videor: `npx wrangler r2 object put td-video/<td|og>/<fil> --file <fil> --remote`.
- 2026-11-16: Deploy-fix: TD importerade ds-JS relativt (`./ds/…`), vilket bara fungerade via dev-serverns mappning. I dist blev det /td/ds/… → 404 och sidan fastnade på introt. Nu `/ds/…`. Deploy-grenen ligger 20 commits efter main; behöver mergas och pushas (Johns beslut). Postrar/videor i deploy kommer från blob-containern, inte git.

Senast uppdaterad: 2026-11-16 (TD lägesjusteringar läge 2–4, lägesmeny, scrollfix). Detaljer om vad som är byggt finns i `startsida-td.md` (Del 2).

## Läge
- TD startsida desktop: intro, header (Fjällguiden), Aktuellt, En dag, Just nu (Alpint + Längd, tredje raden i På plats), varumärkessektionen, Fjällguiden-blocket och svarsmodalen (15 frågor) är byggda. Allt innehåll i Just nu och modalen är hårdkodat/påhittat.
- OG: hero-sida, booking och intro uppdaterade, En dag-växlare dold, nya SVG-logotyper. Ingen OG-motsvarighet till Fjällguiden, vallakort eller 13 px caption.
- Prioritet: OG-prototypen (0 % klar) går före det som återstår för TD (mobil, mindre tweaks, lägesanpassningar).
- Senaste HEAD: se `git log` på `main`. Inte pushad.
- Lägesmodell (beslut 14 nov): vinter är master för alla lägen (ny besökare, återkommande, påbörjad bokning, på plats). Sommar är EN variant = återkommande besökare. Ny besökare skiljer sig bara genom att introt visas. Samma logik ska gälla OG (andra introregler).
- Demopersona: [Anna] (platshållare), 2 vuxna + 2 barn (6 och 9 år), bokat Ski Lodge Premium 12–19 feb 2027 (`td/desktop/demo-stay.js`). Boende bokat, liftkort inte (nästa steg).

## Klart 16 nov: sommarintro OG – första scenen Kvällsdopp
- Bildurval ur Webb_sommar (350 bilder): AA107523 (barn hoppar från brygga i motljus) vald och godkänd. AA106962 (cyklar, utsikt över Orsasjön) och AA109369 (axelridning på spången) föreslagna men John är osäker – inte körda.
- `og/desktop/assets/video/intro/kvallsdopp.mp4`: Kling 2.5, 5 s, 1080p-körning (1760×1176), startbild AA107523, 325 credits. Webbversion utan ljud, 3,2 MB. John: "otroligt bra" trots att barnen landar på ytan 1,2–1,8 s. Gitignorerad: ladda upp till blob-containern före deploy.
- Inkopplat i sommarläge som enda klipp: `summer`-block i `hero-page-config.js` (rad 2 "med hela familjen", hero-rubrik "Sommarlov i Dalarna", poster `assets/img/og-intro-kvallsdopp.jpg`). Säsongen läses vid sidladdning. En scen = ingen övertoning, videon loopar (`scene.loop`). Verifierat: summer + mode=new laddar kvallsdopp.mp4, loopar 4,4 → 0,1 s, inga konsolfel. Rad 1 "Kvällsdopp" sågs i första körningen; efter loopfixen gick det inte att se eftersom rAF stod still i den dolda panelen.
- 16 nov kväll: sommarintrot har fyra scener i `summer.scenes`: Kvällsdopp, Höghöjdsbana, Cykelbanan, Bryggfika (rad 2 "med hela familjen"). John: höghöjdsbana och cykel bra, bryggan osäker, uppurvattnet.mp4 underkänd (ser ut som skräckfilm) och ligger kvar oanvänd. Verifierat: alla fyra videor och postrar svarar 200, inga konsolfel. Uppspelning och övertoningar inte verifierade, eftersom rAF står still i den dolda panelen.
- Sommarintro, scen 2–5 genererade (Kling 2.5, 5 s, 4 × 325 credits), i `og/desktop/assets/video/intro/`, gitignorerade, inte inkopplade: `hoghojdsbana.mp4` (drönare DJI_…0736 beskuren till 16:9, 1920×1080, 5,6 MB), `cykelparken.mp4` (AA106559, 3,5 MB), `bryggfika.mp4` (AA109657, 5,9 MB), `uppurvattnet.mp4` (AA109824, 3,5 MB). Väntar på Johns granskning. Föreslagna rader: Höghöjdsbana / Cykelparken [namn ej verifierat] / Fika på bryggan / Upp ur vattnet.
- Nya kandidater från John: AA109657 (picknick på bryggan), AA109801 (kvinna upp ur vattnet), drönarbild höghöjdsbana, AA109821–29 (pappa med dotter på ryggen upp ur vattnet).

## Klart 16 nov: ny introscen i OG – Lägereld
- `og/desktop/assets/video/intro/brasa.mp4`: Kling 2.5, 5 s, 1080p-körning (1760×1176), startbild kundens AA104245 (elden skarp, mamma och barn ur fokus). 325 credits. Webbversion utan ljud, 2,5 MB. Gitignorerad: ladda upp till blob-containern före deploy.
- Scen 4 av 5 i `hero-page-config.js`: "Lägereld" (+ fasta raden "i skidparadiset"), mellan Vinterbad och Kvällsmys.
- Verifierat: alla fem klippen spelas i ordning i läge 1, brasa.mp4 svarar 200, inga konsolfel. Texten på skärm inte fångad (rAF i dold panel).
- Kvar i Webb_vinter för fler introscener: AA104292 (Orsa Grönklitt-kåsan som ångar, risk att logotypen förvrängs), AA104446 (vidbild, mamman vid elden).

## Klart 16 nov: läge 1 i lägesmenyn utan modal (TD + OG)
- Val av läge 1 (Ny besökare) visar ingen "Du är nu i"-modal, bara introt. Övriga lägen visar modalen som förut (`shared/js/modes-engine.js`).
- Bugg rättad samtidigt: omladdningen efter val i menyn återanvände gamla URL:en och skrev över `?mode=new`, så byte till läge 1 hamnade kvar i förra läget. Nu sätts `mode` i URL:en.
- Verifierat på /td/ och /og/: på plats → 1, återkommande → 1 (mode=new, ingen modal), på plats → 2 och 1 → 3 (rätt läge, modal).

## Klart 16 nov: OG lägesmeny och blockordning som TD
- Lägesmenyn i OG beter sig som TD: val laddar om i toppläget och visar modalen "Du är nu i / Läge N: …" (`announceSwitch` i `og/desktop/site-config.js`, CSS portad till `og-overrides.css`).
- Blockordning per läge × säsong = TD:s, uppmätt i båda sajterna (tabell `ORDER` i skriptet i `og/desktop/index.html`, ersätter gamla omordningsskriptet). Block som saknas i OG visas som streckad platshållare "Finns i Tänndalen / <namn>": Aktuellt, Handplockade boenden, Älskat av skidåkare, Citat, Hitta hit, Lev. Andas. Tänndalen., Mer till er vecka (läge 3 vinter), Mer att hitta på i dag (läge 4 vinter), Footer.
- Följer TD även i det som döljs: läge 3 och 4 visar inte En dag eller boendeblocket, Handplockade boenden visas bara i läge 1/2.
- Fix: lägesväljaren låg i flödet längst ned (OG saknar aliaset `--space-m`, så right/bottom var ogiltiga). Nu `--space-md`, fast nere till höger.
- Verifierat 1440×900: alla 8 kombinationer läge × säsong matchar TD-ordningen, modalen visas efter byte till På plats, inga konsolfel. Mobil ej granskad.
- Utanför listan: hero och TD:s introtext (`#statement`), som motsvaras av OG-heron. Läge 1 med `?intro=0` blir återkommande i OG (OG:s introregel), ordningen är densamma.

## Klart 16 nov: OG Just nu – läge 3/4-varianterna från TD
- Läge 3 och 4: Längd förvalt (även vid byte till På plats). Kalendern visas i båda grenarna i full höjd, webbkameran/spårkartan dold (CSS från TD `startsida.css` 5128–5150).
- Läge 4: egen dagskalender `ONSITE_CALENDAR` i `og/desktop/modes-content.js` ("Er dag · [tis 16 feb]", I dag + I morgon, påhittat i [ ]). `modes.js` skickar `onsiteCalendar` + `calendarAllGren` till motorn.
- Verifierat 1440×900: booking (Längd/Alpint → bokningskalender, kamera dold), onsite (Längd, dagskalender), returning (Alpint, På gång, kamera synlig). Inga konsolfel.
- Sommarfilm i videokortet: kundens "Par 16x9  utan grafik 1080p.mp4" (`assets/og/bilder och videos/Video/Par/`) som `og/desktop/assets/video/summer.web.mp4` (H.264 CRF 23, utan ljud, faststart, 15 s, 10 MB). Byts med säsong i bakgrunden och i modalen, titel "[En sommardag i Orsa Grönklitt]". Kicker "Film · 15 s" för båda (uppmätt; var "[1 min]"). Videon är gitignorerad: måste laddas upp till blob-containern före deploy.
- Inte portat: Mer-karusellerna (`#mer-resa`/`#mer-nu`) räknas som egna block, inte Just nu.

## Klart 16 nov: sommarjusteringar (TD)
- Utförsåkningsblocket i sommar: knappen i sommarfärg (#1B4021, Snö-text), doodle = `doodle-sol.svg` (från assets/td/doodles). Bad- och vandringsbilden utvidgade med Magnific Expand (magnific-expand, 3:2, 2 × 30 credits): bad utzoomad med fjällen, vandring med skarp ängsull i förgrunden.
- Sommar: Handplockade boenden flyttas till direkt efter En dag (före Just nu). Områdesblocket (#boende) är dolt. Rubriken är "Här bor fjällvandrarna". Järven heter "Braskamin och söderläge".

## Klart 16 nov: runda 3 – scrim, läge 3/4, karusellpilar, sommar (TD)
- Mer-karusellernas scrim: kortare (48 %) och svart i stället för Natt, så mellangrått försvinner.
- Läge 4: Musik på Lodgen och Belysta spåret först. Klockslag med fyra siffror och kolon (14:00, 21:00, 16:00–20:00). Toppstugan har inte längre två våffelbilder (stolliften ersätter endag-1300). Dolda i läge 4: Handplockade boenden, områdesvideon och utförsåkningsblocket ("Älskat av skidåkare"). Kalenderrubrik: "Idag, måndag 15 februari".
- Läge 3: 160 px luft mellan Just nu och Mer till er vecka (tidigare 0). Fondue i Fjällkåtan ligger som kort 3.
- Karusellpilar (Aktuellt + alla .td-bo): egen rAF-animering `window.tdScrollTrack` (480 ms ease-out). Snap stängs av under rörelsen och upprepade klick bygger på målet. Ersätter native smooth scrollBy, som hackade med mus. Kunde inte mätas i dold browserpanel, så det behöver testas med riktig mus.
- Sommar, Just nu: videokortet byter till "Sommarfjäll" (YouTube bSEN60fTL58, från tanndalen.com) i sommar, loop 5–25 s. Mittenkortet fanns, men visade vintervideon.
- Sommar, utförsåkningsblocket: flikarna Vandring/Cykling/Bad med egen copy (Fäbodstigen, Fjällcykelparken med fjorton leder, badplats "[sjön]"). Bilder: `sommar-vandring.jpg` (projektets IMG_0114), `sommar-dag-01.jpg` (genererad), `sommar-bad.jpg` (181A9559). Kortet är inverterat (Snö, Natt-text).
- Sommar, Lev. Andas. Tänndalen.: `td-brand-1/2/3-sommar.jpg` = människor vid en fjällsjö (181A9545), porträtt av Anna och vandrare i midnattssol (IMG_0141). Bytet sker med `data-src-sommar`.
- Öppet: mobilvy. Mellan Fjällguiden och Mer att hitta på i dag är det 288 px i läge 4, mot 160 px på andra ställen. Sommarvideons längd är okänd.

## Klart 16 nov: genererade bilder + kraftigare scrim i Mer-karusellerna (TD läge 3–4)
- 13 saknade motiv genererade i Magnific (Nano Banana Pro, 1:1, 2K, 13 × 75 = 975 credits, Personal-projektet): matkasse, middag i stugan, fondue i kåtan, eldstad, hundarna, utsikt från släden, liveband, publiken, snöbad, pulka, pulkor, termos, skoterguide. JPG 1024 px i `assets/img/mer/`. Inga platshållare kvar.
- Scrim på `.td-mer`-korten: 65 % höjd, 0,72 → 0,45 → 0 (övriga boendekort orörda).

## Klart 16 nov: bilder och video i Mer till er vecka / Mer att hitta på i dag (TD läge 3–4)
- Runda 1 (kundmaterial i `assets/td/bilder och video`): 2 videor, ljudlösa, 720p, i `assets/video/` (gitignorerad): `mer-liftkort.mp4` (Klipp_5, 2–10 s) och `mer-spar.mp4` (Klipp_4, 9–18 s). 6 foton nedskalade till 1000 px i `assets/img/mer/` (stollift, lift-ko, familj-backen, vafflor, terrass, fjallvy).
- Runda 2: kort som saknade kundbild fick befintliga genererade bilder (fraga-skidskola/hundspann/bastu/fjallrundan/raststuga/barnbacke/livs/vindskydd/restaurang/sparcentral, langd, endag-1300/1700, meny-aktiviteter).
- Videor: 2 i läge 3, 0 i läge 4. Toppstugans terrassklipp (Klipp_1) var bara ca 1,9 s långt och ersattes av foto.
- Öppet: mobilvy ej granskad.

## Klart 16 nov: lägesjusteringar TD (läge 2–4), lägesmeny och scrollfix
- Läge 1/2: första boendekortet (Fjällöga 13 A) heter "För det stora sällskapet" i stället för "Sju meter till taket".
- Scroll förbi footern (alla lägen): `#parallax-layer` flyttas med `translateY` och drog ut dokumentet varje gång man scrollade (1440×900: 18 166 → 21 726 px). Fix: `.page { overflow-y: clip }`. Verifierat: scrollHeight = footerns botten (18 268 px i läge 2).
- Läge 3: Just nu förvalt på Längd. Bokningskalendern 12–19 feb visas i båda grenarna, och spårkartan/webbkameran är dolda så kalendern får full höjd. Dolda: En dag, Handplockade boenden, områdesblocket (Fjällöga/Allmoge), Hitta hit-kartan.
- Ny karusell `.td-mer` (samma grid som boendekorten, bilder är grå platshållare med text "Bild: …"). Läge 3 `#mer-resa` "Mer till er vecka": liftkort, spårkort, skidskola, hundspann, matkasse, bord i Fjällkåtan. Läge 4 `#mer-nu` "Mer att hitta på i dag": Toppstugan, hundspann, musik på Lodgen, belysta spåret, bastu, pulkabacken, skotersafari. Påhittat innehåll står i [ ].
- Läge 4: Längd förvalt, egen dagskalender för familjen (`ONSITE_CALENDAR` i `modes-content.js`, "Er dag · mån 15 feb", I dag + I morgon, alpint + längd) i full höjd. Dolda: En dag, Hitta hit-kartan. Bokningsbaren bockar av Boende, Liftkort och Skidhyra, utan tooltip. Handplockade boenden och områdesblocket ligger kvar i läge 4 (inte nämnt i feedbacken).
- Lägesmenyn (TD): val laddar om sidan i toppläget och visar en modal med suddig bakgrund, "Du är nu i / Läge N: …" + OK. Opt-in via `MODES_UI.labels.announceSwitch`, så OG påverkas inte. Motorn (`shared/js/modes-engine.js`) har nya valfria `onsiteCalendar` och `calendarAllGren` (bara TD skickar in dem).
- Verifierat i 1440×900: alla fyra lägesbyten via menyn (modal, scrollY 0), sektionsordning/visning per läge, bockar, inga konsolfel. Öppet: mobilvyn av den nya karusellen och kalendern har inte granskats. Riktiga bilder och innehåll till karusellerna saknas.

## Klart 15 nov: intro – resten av zoomen spelas automatiskt (TD)
- När användaren scrollat 40 % av intro-zoomen (`AUTO_P`) spelas resten upp själv på 800 ms (`AUTO_MS`, easing `AUTO_EASE` [0.25, 0.6, 0.3, 1]) och sidan scrollas till zoomens slut. Hjul/touch blockeras under tiden. Av vid reduced motion. Konstanter överst i `intro.js`.
- Öppet: ej testat med riktigt hjul/touchpad eller på mobil.

## Klart 15 nov: boendekort v3 (TD, Waabi-raden)
- Lift-avstånd + bäddar i samma faktaruta (Natt-bakgrund, Snö-text). Den grå rutan ersatt av en ny bild från boendet (`boende-*-soffa/allrum/loft/kok/matbord.jpg`, 900 px).
- Fjällsippan 4 saknar källbilder: lånar `boende-skarljus-7a-fonster.jpg` som platshållare. Byt mot riktig bild.
- Namn + rubrik vita i bildens topp (scrim översta 45 %, 32 px inset, namn 14 px, rubrik 2xl/30 px). Bild 1:1.1. CTA-knappen borta; "Se tillgänglighet" (Small, 60 % vit, svart text) tonar in mitt i bilden vid hover, dold på touch.
- "Här bor skidåkarna" td-heading-4 → td-heading-3. Sommarsolen i heron är Natt i stället för säsongsgrön.
- Samma commit tar med parallellt arbete: hero-ram, skidhyra-rader i kontot, AB bara i läge 3/På plats (modes-engine).
- Öppet: mobilvy av nya kortet ej granskad visuellt; långa rubriker (Järven) bryts på tre rader.

## Klart 15 nov: "Pågår nu" bara i platsläge
- Grön prick på AB-avataren och "PÅGÅR NU" i kontopanelen visas bara när platsläge är aktivt. Utanför platsläge visas en pågående vistelse som "Kommande · datum" (grå prick). Ändring i `shared/js/modes-engine.js` (`renderAccountUi`), gäller TD och OG.
- Verifierat i TD (today-override 2027-02-15, inloggad): platsläge → `is-ongoing`, "Pågår nu"; returning → ingen prick, "Kommande". OG inloggat läge: could not measure (samma kodväg).

## Klart 16 nov: Järven som slide 5
- Ordning: Fjällöga, Fjällstugan Järven, Fjällbruden, Brunkullan, Fjällstjärnan. Bildspelet loopar (efter slide 5 → slide 1). OG loopar också (td-blocks.js). Karusellkontrollen (`.boende-pill`) har nu auto-bredd – fasta 168 px klippte femte punkten.
- Järvens drönarbild (scrapad 17) omrenderad i Magnific (Nano Banana 2.1, mulet nysnöljus, 2 varianter 4K = 290 credits ≈ 0,73 EUR). Variant B → `assets/img/boende-jarven-sno.jpg` (3600 px).
- Context Light (svart text), parallax 0, förankrad i överkant med zoom (se 17 nov). Rubrik "Timmerstuga i nysnön." (förslag). Fakta R360: lift 800 m, längdspår 600 m, 3 sovrum, 6 bäddar, 96 m², bastu. `r360AreaId` saknas för Järven och Fjällstjärnan.
- Verifierat 1600×900. Ej kollat: 2000 px, mobil.

## Klart 16 nov: Fjällbruden med blå himmel
- Startbilden omrenderad i Magnific (Nano Banana 2.1, ref Fjällstjärnan-fotot, 2 varianter 4K = 290 credits ≈ 0,73 EUR). Variant A vald → `assets/img/boende-fjallbruden-sol.jpg` (3600 px). Röda taksaker borta, dalen något bredare – accepterat.
- Slide: vit text utan scrim (`noScrim`), 155 % förankrad `40% 0%`. Verifierat 1600×900.

## Klart 16 nov: Boende – ordning, spegling och uppskalad Fjällbruden
- Ordning (uppdaterad 16 nov kväll): Fjällöga, Brunkullan, Fjällbruden, Fjällstjärnan.
- Brunkullan spegelvänd (`mirror: true`), 175 % förankrad `100% 100%`, bild omexporterad till 3600 px (2 MB). Björkdungen ligger nu ovanför bild.
- Fjällbruden: startbilden uppskalad i Magnific (Ultra Photo 2x, 180 credits ≈ 0,45 EUR) → `assets/img/boende-fjallbruden-still.jpg` (3000 px). Gamla postern ligger kvar i video/.
- Verifierat 1600×900.

## Klart 16 nov: Boendeblocket – Context Light, utsnitt och fjärde område
- Nya slide-fält: `context: "light"` (klass `.boende.is-light`: Natt-text, inverterad sökknapp, ingen scrim), `noScrim` (`.is-noscrim`), `posterSize`/`posterPosition` (utsnitt för stillbilder).
- Fjällbruden: Context Light, parallax 0, bild 130 % förankrad i överkant – texten i den grå himlen ovanför åsen. Startbilden är bara 1924 px, något mjuk vid 2000 px.
- Brunkullan: Context Light, parallax 0, bild 145 % förankrad nere till vänster – texten på öppen backe, björkdungen till höger. Bild omexporterad till 3000 px.
- Ny slide 4 Fjällstjärnan: R360-foto (lgh A, bild 01) med blå himmel, vit text utan scrim. Fakta från R360 lgh A/B: lift 900 m, längdspår 100 m, 3 sovrum, 10 bäddar, 124 m², bastu. `r360AreaId` saknas.
- Verifierat 1600×900 och 2000×900. Mobil ej kollad. Den starka scrimvarianten (c23994f) är borttagen.

## Klart 16 nov: Stillbilder på boende-slide 2 och 3
- Fjällbruden: video avstängd (`video: ""`), visar startbilden `boende-fjallbruden-poster.jpg`. Videofilen ligger kvar.
- Brunkullan: R360-foto 08 (Brunkullan 23 mot backen) som `assets/img/boende-brunkullan-23-backen-stor.jpg` (2400 px, 1 MB), placeholder av.
- Brunkullan: `parallax: 0` (bilden = sektionens höjd, huset syns helt), `scrimOpacity: 1` och `scrimStrong: true` (`.boende-scrim.is-strong`, 760 px, mörkare). Nya slide-fält, övriga slides opåverkade. Verifierat 1600×900.

## Klart 16 nov: Fjällöga-videon uppskalad (TD boende slide 1)
- `area1.mp4` uppskalad med Magnific Precision (1920 px, 5 097 credits ≈ 12,70 EUR; förhandsvisning 497 credits). Kodad om för webb: 1920×1428, CRF 20, ingen ljudspår, 21 MB (förut 1668×1240, 34 MB).
- Originalet sparat som `assets/video/area1-original.mp4` (gitignorerad mapp, ingen annan kopia). Ingen kodändring.
- Verifierat: laddas i 1600 px utan fel, 4 rutor jämförda utan flimmer/förvrängning. Uppspelning i synligt läge inte kollad i hidden pane.

## Klart 15 nov: Fjällbruden ersätter Fjällviolen Mosippan i boendeblocket (TD slide 2)
- Första videon (uppskalat foto, Kling 2.5, 650 cr) underkändes: för inzoomad, texten låg på husen, skylten blev oläslig.
- Lösning: originalet utvidgat med Magnific Expand (läget `magnific-expand`, 30 cr; BFL/auto ritade om scenen) till 2720×1520 med himmel och fjäll runt om. Ny Kling 2.5-video 10 s (650 cr) med långsam drift framåt och åt höger. Totalt cirka 1 680 credits.
- Ny slide-egenskap `focus` (object-position för videon). Fjällbruden har `0% 0%`, så rubriken ligger mot himlen och husen hamnar mellan texten och faktakortet. Verifierat i 1440×900.
- `assets/video/boende-fjallbruden.mp4` (8,5 MB) + poster, gitignorerade som övriga videor. `area2.mp4` (Mosippan) är oanvänd.
- Fakta från R360: lift 270 m och bastu anges bara för nr 9–12. Rubrik och brödtext är KAN-text.
- Boendeblocket (TD+OG): byte av slide pausar inte längre, bara pausknappen gör det.
- Boendeblockets scrim (TD, alla slides): diagonal gradient från övre vänstra hörnet (170°, transparent vid 72 %), 640 px hög, opacitet 0,7. Högersidan maskas ut mjukt (maskFrom 30 → maskTo 85).
- Öppet: kontrollera mobil och andra bredder med `focus` 0% 0%.

## Klart 15 nov: ny sommarbild för "Grilla vid stugan" (TD En dag, sommar 17:00)
Redigering av originalet i Magnific (Nano Banana Pro, bilden som referens, 2K 3:4, 3 varianter, 225 credits). Variant 1 vald: armen borttagen, familj på avstånd (grillare bakifrån, en bär tallrikar, barn på bänken), låg kvällssol. Original i `tanndalen-orsa/assets/magnific/sommar-dag-04-grill-v1.png`. Grillen syns dåligt bakom grillaren.

## Klart 15 nov: ny bild för "Våfflor i solgropen" (TD En dag 13:00)
Redigering av originalet i Magnific (Nano Banana Pro med bilden som referens, 2K 3:4, 3 varianter, 225 credits). Variant 3 vald: klarblå himmel och sol, stavarna i snövallen i stället för stående vid bordet, värmeljuset borttaget. Besticken står fortfarande upp. Original i `tanndalen-orsa/assets/magnific/endag-1300-vafflor-v3.png`. Används även i guidekorten (Toppstugan, Fikat vid Ladan).
Bild 5 (endag-1700, stugan med badtunna): 3 omgenereringar (225 credits) blev kopior av originalet. I stället uppskalad med Magnific Precision (photo) 2x, 720→1440 px (90 credits), nu `endag-1700.jpg` (png borttagen). HDR-looken kvar. Original i `tanndalen-orsa/assets/magnific/endag-1700-uppskalad.png`.

## Klart 15 nov: ny bild för "Barnen drar iväg själva" (TD En dag 10:15)
Nano Banana Pro i Magnific, 2K 4:5, 3 varianter (225 credits), variant 2 vald: barnen bakifrån, förälderns mobilperspektiv. Original (1856×2304) i `tanndalen-orsa/assets/magnific/endag-1015-barnen-v2.png` (utanför repot), sajtversion 824×1024. Öppet: barnen står still, nästa runda kan be om sväng/rörelse.

## Klart 15 nov: tredje TD-området + tre OG-områden i boendeblocket
- TD: Brunkullan tillagt (fakta från R360, Brunkullan 23; sovrum/bäddar/bastu i [ ] gäller en lägenhet). Dubbletterna av Fjällöga/Hamra borttagna, nu 3 flikar.
- OG: [Stugbyn], [Toppen], [Skogsbyn] ersätter TD:s kopior. Allt påhittat i [ ] utom Orsasjön och Orsa Rovdjurspark.
- Kort utan video visar `assets/img/platshallare.svg` och går vidare på 6 s timer med progress i fliken (`boendeStillRun`, båda sajterna). Verifierat: flikbyte, timer (50 % efter 3 s, byter kort efter 6 s), inga konsolfel.
- Öppet: videor för Brunkullan och OG-områdena, riktiga OG-områdesnamn och fakta.

## Klart 15 nov: OG – TD:s media bortplockad
TD:s En dag-bilder/-videor (endag-*, sommar-dag-*) och videorna i stora boendeblocket (area1/2, klipp-8) är raderade ur `og/desktop/assets/` och ersatta av `assets/img/platshallare.svg` (index.html, td-blocks.js, orsa-guiden.js). Boendeblockets video är tom, bara poster. Hero-videor finns bara i TD. Verifierat: inga 404:or eller konsolfel på /og/. Öppet: John tar fram riktiga OG-exempel. Övriga TD-kopior i OG (meny-, teaser-, banner-, rapport- m.fl.) ligger kvar.

## Klart 15 nov: säsongsväljare i OG-menyn
- `<div data-season-toggle="labeled">` ovanför "Jag är på plats", som i TD. Hade fallit bort när hero-page blev /og/ (059f107). Verifierat: Vinter/Sommar syns i menyn, klick byter `data-season` och strecket byter färg.

## Klart 15 nov: progress-strecket i glasmenyn (OG)
- OG fyller strecket vid scroll (`initTopProgress()` i `hero-page.js`), sommarfärg via `data-season="summer"` i `hero-page-header.css`. Vinter = ljusblå `#A1B5BA` (`--color-OG-season-winter`, medvetet inte OG:s taupe-override som syntes för svagt), sommar = `#1B4021`.

## Klart 15 nov: progress-strecket i glasmenyn (TD)
- Strecket uppdateras vid scroll igen (`paintProgress()` anropas i `syncTopBar`). Anropet hade försvunnit i 341518d. Verifierat: halvvägs = scaleX(0.47), vinterfärg, 2 px.

## Klart 15 nov: TD En dag – sista kortet som OG
- Textytan centrerad i hela bilden, tidsetiketten 18 px Book (tunnare), tätt mot rubriken (8 px), rubriken 36/40 px, knappen 32 px ner. Samma regler som OG (`og-overrides.css`), här i `td/desktop/startsida.css`.

## Klart 15 nov: boendekort v2
- CTA nu `td-button-fill-neutral` (#E0DFDE), fast 24 px under rubriken (inte bottenlinjerad).
- Pristaggen nere till höger på bilden/videon (12 px från kanterna).
- Lift-rutan: `--color-TD-neutral-subtle` (#C3C1C0) med mörk text i stället för svart.

## Klart 15 nov: boendekort – pristagg, CTA och bildmodal (test)
- Priset flyttat från textrad till tagg uppe till vänster på bilden/videon (`td-chip-tag-solid td-chip-tag-dark`, Snö-bakgrund).
- Ny CTA under varje kort: "Se tillgänglighet", `td-button-secondary td-button-md` (vit). Alternativ att testa: byt till `td-button-fill-neutral`. Knapparna linjerade i botten (margin-top:auto).
- Detaljbilden är en knapp som öppnar `#td-bo-bildmodal` (dialog, stäng-knapp, klick på bakgrund, Esc).
- Gäller bara kvadratiska raden (Waabi).

## Klart 15 nov: Waabi-raden – Brunkullan bort, nya Rosa Byn och Skarljus
- Ordning nu: Fjällöga 13 A, Fjällstjärnan B, Järven, Fjällsippan 4, Rosa Byn D32, Skarljus 4 C (6 kort).
- Ski Lodge Premium 203 ersatt av Rosa Byn D32 (dåliga bilder i R360): "Backen rakt utanför fönstret", 230 m, 6 bäddar; huvud = allrum, detalj = utsikt mot stolliften.
- Skarljus 7 A ersatt av Skarljus 4 C: "Hamrafjället i panoramafönstret" (R360: utsikt över Hamrafjället), 270 m, 8 bäddar; huvud = allrum med panoramafönster, detalj = fönsterbänk.
- Bilder i `tanndalen-orsa/assets/boenden/rosa-byn/` och `skarljus/`. Oura-raden orörd.

## Klart 15 nov: Fjällstjärnan B i Waabi-raden, ny ordning
- Ordning: Fjällöga 13 A, Fjällstjärnan B, Järven, Fjällsippan 4, Ski Lodge 203, Skarljus 7 A, Brunkullan 23.
- Fjällstjärnan B (R360, grouppoollid 30243): "Hunden får följa med" (husdjur tillåtet), 900 m till liften, 10 bäddar, pris [X]. Huvudbild = exteriören beskuren kvadratiskt kring huset, detaljbild = `fraga-hund-stuga.jpg` (AI-genererad, inte boendet). Bilder i `tanndalen-orsa/assets/boenden/fjallstjarnan/`.

## Klart 15 nov: Fjällöga 13 A först i Waabi-raden, med video
- Kort 1 i kvadratiska raden: "Sju meter till taket" (R360: 7 m takhöjd), 200 m till liften, 9 bäddar, pris [X]. Detaljbild = huset utifrån (R360-bild 23, `boende-fjalloga-13a-huset.jpg`).
- Video: kök (höger) → allrum med loft (bakåt) → vardagsrum (vänster) → loftet ner mot fönstret (höger). Kling 2.5, 16:9 1080p, bara startbild (utsnitt 75 % mot rörelseriktningen), 1 300 credits. 17,6 s, 5,7 MB: `td/desktop/assets/video/boende-fjalloga-13a-rundtur.mp4` (gitignorerad). Råklipp i `tanndalen-orsa/assets/boenden/fjalloga/fjalloga-13-a/video/`.
- Kända brister: Kling tände eld i kaminen i vardagsrumsklippet. Ej bekräftat att 13 A är ett eget hus (R360 kallar det "fjällägenhet på tre plan") – skriv inte "hela huset" i copy.
- Alla 9 Fjällöga-boenden + bilder hämtade med `scripts/hamta-boendebilder.py --omrade 33295` (katalogsökning, checkavail=false).

## Klart 15 nov: AI-video i Järven-korten (test)
- Fjällstugan Järven: 3 rum (allrum sväng höger → kamin drar ut → allrum framåt mot fönstret), Kling 2.5 1080p med start- och slutbild utskurna ur riktiga foton så att det som avslöjas är äkta. 6 klipp (9:16 + 1:1), 1 950 credits, Magnific-projektet "Tänndalen - Orsa Grönklitt - Sajt - Inledande fas - 09665".
- Ihopklippt med ffmpeg (0,8 s toning, 13,6 s): `td/desktop/assets/video/boende-jarven-916.mp4` (Oura) och `-11.mp4` (Waabi), ca 4 MB styck. Videomappen är gitignorerad – råklipp och utsnitt ligger i `tanndalen-orsa/assets/boenden/fjallstugan-jarven/`.
- JS: en video spelar per rad, hover/fokus byter, pausar utanför skärm och vid reducerad rörelse. Ingen hover-zoom på videokort.
- Johns feedback (15 nov): rörelserna för stora, in-/utzoomningarna gigantiska och det känns som Ken Burns på ett foto, inte en riktig kamera. Sidoåkningen (allrum) bäst. Orsak troligen upplägget: start/slut är utsnitt ur samma foto, så modellen interpolerar bara beskärningen. Prompt vs modell ej utrett.
- Regel framåt: ett videoformat (stående), kvadraten beskärs ur samma video – kör aldrig båda.
- Regel framåt: boendets feature (Järven: kaminen eller balkongen) är den lilla detaljbilden och ska INTE vara med i videon.
- Test 2 (bastun, Veo 3.1 Fast, bara startbild, 8 s, 800 credits, `assets/boenden/fjallstugan-jarven/video/veo-916-bastu.mp4`): riktig 3D-rörelse med parallax, men för stor – åker ut genom dörren och hittar på en panelvägg och glasdörr. Första ~3 s användbara.
- Beslut 2026-11-15: Oura-raden (`#boenden-oura`) borttagen ur TD. Waabi (kvadratiska kort) är kvar som enda boendevisning.
- Ny Järven-video i Waabi-kortet (kvadrat, kortet flyttat till plats 2): allrum (sväng höger mot köket) → bastu (bakåt/vänster) → kök (sväng höger). Kling 2.5, 16:9 1080p, bara startbild = oklippt/brett foto (allrum och kök: vänstra 75 %), CSS beskär till kvadrat. 13,4 s, 4,1 MB: `td/desktop/assets/video/boende-jarven-rundtur.mp4`. Bastutestet med Veo 3.1 Lite förkastat. Oura-raden har kvar gamla 9:16-videon.
- Öppet: John funderar på nästa steg. Mobil fortfarande öppet.

## Klart 18 nov: pushat och deployat
- `main` och `deploy` pushade till 912e4b5 (15 commits). Deploy-run 44286263320 lyckades. Live: https://proud-field-005de6103.4.azurestaticapps.net/og/ – Handplockade boenden med båda rundturvideorna från R2. Före push: lokalt bygge OK, alla 29 R2-videoreferenser svarar 200.
- GitHub-konto per mapp: `~/.config/git/kan.gitconfig` sätter användare `johnscottguggenheimerKAN` för KAN-mappar; ny PAT (repo, 1 år) sparad i macOS nyckelring. Gamla PAT "Push" (ingen utgång) kan tas bort. `gh` är inloggad med privata kontot men kan läsa KANAgency-repot.

## Klart 18 nov: OG-boendevideorna i R2
- Uppladdade till KAN:s R2 (`td-video/og/`): `boende-lonnstigen-6-rundtur.mp4` + poster, `boende-limbygarden-rundtur.mp4` + poster. Verifierat: alla fyra svarar 200 på `pub-4e0fd720b7c94611ae98332f7f97e772.r2.dev/og/…`, rätt content-type, samma bytestorlek som lokalt.
- Kontouppdelning: `sajtkoncept/.env` (gitignorerad) har KAN-kontots id + en R2-token (Workers R2 Storage: Edit, 1 år). Wrangler från `sajtkoncept/` går mot KAN, `wrangler login` (privat konto) orörd. Se `STRUKTUR.md` → Cloudflare-konto.

## Klart 18 nov: OG – rundturvideo i Limbygården-kortet
- Kling 2.5, 4 × 5 s, 16:9 1080p, bara startbild, 1 300 credits ≈ 3,25 EUR. Bara breda rumsbilder (Johns regel: inga närbilder). Klipp: a allrum mot glasdörrarna (glid höger, bild 02, vänstra 75 %) → b genom spröjsdörrarna in i matsalen (framåt, 06) → c köket (lätt framåt, 10) → d glasverandan med utsikt (glid vänster, 26).
- Granskat: inga deformerade möbler, ingen eld. b hittar på ett fönster, en taklampa och en rund matta till vänster; d en pall/soffkant i vänster förgrund. Startbilderna är sommarbilder (Lönnstigen är vinter).
- `og/desktop/assets/video/boende-limbygarden-rundtur.mp4` (17,6 s, 2,6 Mbit/s, 5,8 MB) + poster. Råklipp i `tanndalen-orsa/assets/boenden/orsa/limbygarden/limbygarden/video*/`. Ladda upp till R2 (`og/`) före deploy.
- Kortet: video i stället för huvudbild; stödbild 2 = stenspisen med älghorn (bild 04, featuren) i stället för matsalen.
- Verifierat 1440 px: Limbygården-videon spelar (17,6 s, 400 px bred), Lönnstigen 6 väntar pausad (en video per rad), stödbild 2 = stenspisen (serverad fil = disk, 275 534 B), inga konsolfel. Gammal stödbild kan ligga kvar i webbläsarcachen (samma filnamn) – hård omladdning.

## Klart 18 nov: OG – rundturvideo i Lönnstigen 6-kortet
- Samma form som TD (Fjällöga/Järven): Kling 2.5, 4 × 5 s, 16:9 1080p, bara startbild (16:9-utsnitt, 75 % av bredden bort från rörelsen; vardagsrummet helbild för rak push), negativ prompt mot folk/eld/nya objekt. 4 × 325 = 1 300 credits ≈ 3,25 EUR. Magnific-projektet "Tänndalen - Orsa Grönklitt - Sajt - Inledande fas - 09665".
- Klipp: a översikt med loftgång (dolly bakåt, bild 07) → b köksö (glid höger, 06) → c vardagsrum (framåt, 09) → d loftsoffan (drift vänster, 22). Kontrollerat bildruta för bildruta: inga deformerade möbler, ingen eld. d hittar på en trappöppning med två rottingstolar bakom räcket (trovärdigt, men inte verkligt).
- Ihopklippt med 0,8 s toning: `og/desktop/assets/video/boende-lonnstigen-6-rundtur.mp4` (17,6 s, 1920×1080, 2,6 Mbit/s, 5,7 MB, utan ljud) + poster. Råklipp och startbilder i `tanndalen-orsa/assets/boenden/orsa/skogsbyn/lonnstigen-6/video*/`. Videomappen är gitignorerad: ladda upp till R2 (`og/`) före deploy.
- Kortet: videon ersätter huvudbilden; stödbild 2 bytt från köket (finns nu i videon) till braskaminen under takfönstren (bild 24, featuren). Video-JS från TD (en video per rad, hover byter, paus utanför skärm, reducerad rörelse → poster).
- Verifierat 1440 px: videon spelar (400×440, cover), stödbilden laddar, inga konsolfel.
- 18 nov, John: loftklippet (närbild på brun soffa) borttaget. Videon är nu 3 klipp, 13,5 s, 4,4 MB. Regel: inga närbilder i rundturerna, bara breda rumsbilder.
- Nästa: Limbygården (02 allrum → 06 genom spröjsdörrarna → 10 kök → 26 glasverandan; stödbild 2 byts till stenspisen 04).

## Klart 17 nov: OG – Handplockade boenden (karusell med riktiga R360-boenden)
- TD:s `#boenden-waabi` portad till OG och ersätter platshållaren "Handplockade boenden" i blockordningen (vinter: efter Frågor, före Boende; sommar: efter En dag). Dold i Påbörjad bokning och På plats som i TD.
- 8 kort: huvudbild + 2 stödbilder (klickbara, öppnas i bildmodal) + faktaruta med boyta och bäddar (ur R360). Rubrik "Här bor familjerna" (mitt förslag, ej beslutat). Kortrubrikerna bygger på R360-beskrivningen (t.ex. Lönnstigen 6: matplats för 12, Norra Stugvägen 10: husdjur tillåtet).
- Bildval (nr i `assets/boenden/orsa/…`, huvud/stöd/stöd): Limbygården 04/01/07, Lönnstigen 6 24/01/05, Aspstigen 2B 04/01/06, Rönnbärsstigen 1 05/01/07, Norra Stugvägen 10 01/05/03, Illerstigen 4B 06/01/08, Hallonstigen 9B 04/01/06, Uttern 7 05/01/06. Webbversioner (max 1400 px, q82, 5,0 MB totalt) i `og/desktop/assets/img/boenden/<slug>-huvud|stod-1|stod-2.jpg`.
- Kod: sektion + bildmodal i `og/desktop/index.html`, CSS verbatim från TD sist i `og/desktop/td-blocks.css`, karusellpilar/`tdScrollTrack`/modal-JS sist i `og/desktop/index.html`. Typsnitt följer OG via `--font-family-TD-*`-mappningen.
- Verifierat (1440 och 1024 px): 24/24 bilder laddar, kort 400 px vid 1440, vänsterkant 80 px = rubriken, Nästa-pil scrollar 440 px, modal öppnar, ingen horisontell overflow, inga konsolfel. Mobil inte kontrollerad.
- Öppet: pris `fr. [X] kr/vecka` (R360 gav inga priser för dessa veckan 9–16 jan 2027). Nästa steg: boendevideor för huvudbilden (behöver fler bilder per boende). Figma: blocket finns inte i OG-Figma (Figma-skuld).

## Klart 17 nov: OG-boenden hämtade ur R360 (8 st, olika stil)
- `hamta-boendebilder.py` har nu `--sajt td|og`. OG: `orsagronklitt.r360online.se`, boende = resvtype 1000 (1002 = skidhyra, 1007 = längdskidåkning). Listan `BOENDEN_OG` i skriptet; exakt namnträff går före prefixträff.
- Katalogen: 574 enheter, 347 utan camping/ställplatser, 340 unika bildset. Alla granskades på kontaktark; valda på foto och inredning, spridda över byarna och stilarna:
  Limbygården (lodge, 32 bilder), Lönnstigen 6 (Skogsbyn, nybyggt/stora fönster, 24), Aspstigen 2B (Skogsbyn, stylat skandinaviskt, 17), Rönnbärsstigen 1 (Blåbärsbyn, timmerstuga, 21), Norra Stugvägen 10 (Centrumbyn, klassisk furustuga, kvällsbild, 10), Illerstigen 4B (Toppbyn, rustik/vintage, 10), Hallonstigen 9B (Blåbärsbyn, varm retro, 14), Uttern 7 (Rovdjursbyn, röd stuga, mörk/mysig, 13).
- 141 originalbilder + `fakta.json` (beskrivning, kriterier, R360-länk), 276 MB i `tanndalen-orsa/assets/boenden/orsa/<by>/<boende>/` (utanför repot). Reserv om något ska bytas: Aspstigen 2A, Örnen 13, Tallstigen 9, Granstigen 1.
- Öppet: inte inlagda på OG-sajten än. Katalogen har inga priser.

## Klart 15 nov: riktiga R360-boenden i karusellerna + bildskript
- Platshållarna ersatta med Skarljus 7 A (Hamra), Brunkullan 23 och Fjällstugan Järven (Tänndalen). Fakta (lift, bäddar) från R360, priser = en ledig vecka i R360 inom hakparentes, nu "kr/vecka" på alla kort.
- `sajtkoncept/scripts/hamta-boendebilder.py` hämtar alla originalbilder + `fakta.json` via R360:s publika sök-API till `tanndalen-orsa/assets/boenden/` (utanför repot). Fjällsippan 4 finns inte i R360.
- Plan och prompter för AI-animering i Magnific: `docs/boenden-video.md`. Öppet: videoformat.

## Klart 15 nov: OG – menyn göms på En dag
- Som TD: headern (`.og-hp-header`) får `is-tucked` när En dag fyller skärmen (topp ≤ 10 vh, botten ≥ 125 vh), inte när menyn är öppen/fokuserad. Skript sist i `og/desktop/index.html`, CSS i `og-overrides.css` med `translate` så headerns egen transform (centrering/reveal) och dess övergångar lämnas orörda.
- Verifierat: villkoret sant mitt i En dag (top −200, botten 5288 vid 900 px), klassen ger opacity 0 och translate uppåt, centreringen kvar. Rörelsen live kunde inte mätas (rAF i dold browserpanel).

## Klart 15 nov: OG En dag (steg 4 av TD→OG-synken, synken klar)
- Hoppa över går till nästa synliga sektion efter En dag (följer blockordningen per läge): returning → Just nu, bokning/På plats → Boende. Uppmätt i DOM i alla tre lägena.
- Nästa-pilen är aldrig avstängd; på sista steget fungerar den som Hoppa över (TD 2987–3010). Uppmätt: `disabled=false`. Själva scrollrörelsen kunde inte mätas (rAF i dold browserpanel).
- Inga konsolfel på /og/ (vinter/sommar, alla lägen) och /td/ i ren flik. Inga filer under `td/` eller `shared/` ändrade i synken.
- Öppet för John: granska påhittat OG-content (lista i sessionens slutrapport, källor `og/desktop/orsa-guiden.js`, `modes-content.js`, `demo-stay.js`, `justNuData` i `td-blocks.js`, Just nu-markup i `index.html`), längd före alpint i Just nu-växlaren (default är fortfarande Alpint), eget märke för Orsa-guiden, riktig OG-film till videokortet.

## Klart 15 nov: Orsa-guiden (steg 3 av TD→OG-synken)
- Nytt `og/desktop/orsa-guiden.js`: en frågekälla `OG_FRAGOR` (general/booking/onsite + Summer, motsvarar `window.TD_FRAGOR`), 34 QA-svar med kort och följdfrågor, `qaFor` med sommarvarianter, startvyns data (`WELCOME`, `WELCOME_TILES`, bokning, dagens händelser). Allt påhittat, fakta i [hakparentes]. Ändra frågor och svar bara där.
- `td-blocks.js`: Fråga-logiken ersatt med TD:s nuvarande (index.html 5777–6294): startvy per läge (`renderWelcome`), delegerade klick, svar via `qaFor`. `renderFragor()` fyller Vanliga frågor-blocket och Just nu-guiden från källan, ritas om vid säsong och läge (MutationObserver på `data-mode`, eftersom motorns `setMode` inte skickar `og-mode`).
- Verifierat: startvyn i returning/booking/onsite (rätt rubrik, etikett, kort, rutor), sommarvarianterna, FAQ-blocket byter frågor per läge × säsong, alla 31 frågor i listorna + följdfrågor har svar, svar med bilder via frågevägen. Direktklick på en fråga kunde inte mätas (rAF går inte i dold browserpanel). Inga konsolfel på /og/ och /td/ (ren flik).
- Även: menyns "Hamra Syd"/"Om Tänndalen" och Fråga-blockets ingress omskrivna för OG. Pistkarte-CSS borttagen ur OG-porten (404 på bilden).

## Klart 15 nov: OG Just nu (steg 2 av TD→OG-synken)
- Orsa-guiden-kort (platshållarnamn) med frågelistor per läge × gren (bokning: "Inför er resa"), OG:s chattikon (ljus/mörk per säsong) i stället för TD:s Fjällguiden-märke. Klick på en fråga öppnar svarsmodalen.
- Läge 1/2: videokort med lokal `assets/video/winter.web.mp4` (loop i bakgrunden, `<dialog>` med ljud och kontroller), inte YouTube. Läge 3: Nästa steg (liftkort/spårkort, priser i [hakparentes]). Läge 4: Rapport + tredje raden utan pistkarta (Alpint: Öppet nu + Väder, Längd: Dagens vallatips + Öppet nu + Väder; kolumner = synliga kort).
- Sommar: väderkort "Väder i Orsa", `setSummerSwap` (webbkamera ovanför vädret, På gång dolt), toppbarens sommartext (leder, väder, bad). Valla flyttad från längdstacken till tredje raden som i TD.
- `justNuData`, Rapport och På gång omskrivna till OG (påhittat i [hakparentes]). CSS: TD `startsida.css` 5660–6215 portad sist i `td-blocks.css` utan CircularXX. `klocka.svg` kopierad till OG.
- Verifierat 1440×900: rätt kort per läge (returning: videokort, booking: Nästa steg, onsite: Rapport + tredje raden) i Alpint och Längd, vinter och sommar. Inga konsolfel.
- Öppet: bokning + sommar ger tom mittkolumn och tom guidelista (samma som TD, läge 3 är "endast vinter"). Boendeslidern och Fråga-förslagen nämner fortfarande Hamra/Tänndalen (steg 3 tar förslagen).

## Klart 15 nov: OG lägessystem (steg 1 av TD→OG-synken)
- `og/desktop/modes.js`, `modes-content.js` (bokningskalender läge 3), `demo-stay.js` (demovistelse [Grönklitt Stugby] 15–22 feb 2027, 2 vuxna 2 barn) efter TD:s mönster, på `shared/js/modes-engine.js` + `MODES_UI` (og-mode/og-season). `td-blocks.js` skickar nu `og-season` bredvid `td-season`.
- Head-skript i `og/desktop/index.html` sätter `data-mode` före render: `?mode`, `?intro=1` (= ny), `?intro=0` (aldrig ny), sparat `og-mode`, annars `og_intro_seen` → återkommande. `?plats=1` / sparat `og-onsite-orsa` → På plats.
- `resolveIntroMode()` i `hero-page.js` läser `data-mode`: bara "ny" visar introt. Motorn laddar om med `?mode=new` vid byte till/från ny, så introt startar om rent. Verifierat: byte returning → new laddar om och introt spelar.
- På plats-toppbar (platshållarmått i [hakparentes]), `[data-onsite-toggle]` i menyn, vistelsevy i kontopanelen. Kontopanelens öppna/stäng flyttad från `hero-page.js` till motorn. CSS portad från TD till `og-overrides.css` (TD-namn mappas redan till OG-färger). Headern flyttas ned med toppbarens höjd (`--og-topbar-offset`).
- Blockordning per läge, live: bokning = Fråga, Just nu, En dag; På plats = Just nu, Fråga, En dag; övriga = En dag, Just nu, Fråga. Verifierat i alla fyra lägen × vinter/sommar, inga konsolfel.
- Öppet: toppbarens sommartext (steg 2), visuell granskning av header + toppbar.

## Klart 15 nov: OG = hero-page på /og/
- `og/desktop/hero-page/` flyttad till `og/desktop/` (`7a1b289`). Gamla OG-startsidan, hero-test och oanvända OG-filer borttagna (finns i git). Ospårade `.old`-filer i `src/backups/og-hero-page-old/`. Verifierat: /og/?intro=1 laddar utan 404 eller konsolfel, sektioner en-dag/just-nu/fragor/boende.
- Beslut (John 15 nov): OG får lägessystem som TD (eget content), Fjällguiden heter i OG platshållaren "Orsa-guiden", OG-content omskrivet (längd, familj, aktiviteter, sommar, Dalarna/historia, nära storstäderna), fakta i [hakparentes], ingen pistkarta, bilder senare.
- Inventering TD→OG: En dag har allt utom Hoppa över till nästa synliga sektion och pil aktiv på sista steget. Saknas: Just nu (guidekort, videokort, Nästa steg, tredje raden, sommarväder), Fråga (en frågekälla, QA-tabell, startvy per läge, delegerade klick), lägessystem (modes.js/modes-content/demo-stay, På plats-toppbar, omordning per läge). Boende: inga generella ändringar.

## Klart 15 nov: TD-typografi synkad mot Figma
- Ny `eyebrow-xs` (16/22) och `ui-figure-xl` (96/96) i `typography-styles-tanndalen.json`; storlekarna 40 och 96 i `primitives.json`. Eyebrows i `startsida.css` följer eyebrow-xs.
- Rättat efter Figma: `quote` 30/38, `ui-figure-lg` 40/44 (var 48), tracking `heading-xxxl` −0.034em, `heading-xxl` −0.043em. Mobilvärden orörda.
- `typography-td.css` saknar nu handpatchar, så hela filen kan genereras om med `npm run tokens:css`.

## Klart 14 nov: Aktivitetsflikarnas default per läge
- Utförsåkning är default i läge 1, 2 och 4, Längdåkning i läge 3 (booking). Följer live-byte av läge (`setDefault` i TD startsidans flikscript).

## Klart 15 nov: geometricPrecision på all text
- Global regel överst i `td/desktop/startsida.css`, `og/desktop/og-startsida.css` och `og/desktop/hero-page/hero-page.css`. Uppmätt: 0 textelement utan geometricPrecision på /td/, /og/ och /og/hero-page/.

## Klart 15 nov: två testrader med boendekort under Fjällguiden
- `#boenden-oura` och `#boenden-waabi` i `td/desktop/index.html`, CSS sist i `startsida.css` (`.td-bo-*`). Tre platshållarboenden med påhittad data och priser i [hakparentes], befintliga bilder.
- Kortens typografi via TD-klasser (namn `td-ui-caption` på egen rad, rubrik Superclarendon Bold 24, siffror `td-ui-figure`, pris `td-ui-title-sm`), radie 4 px på alla bilder och rutor.
- Första kortet i båda raderna har riktiga Fjällsippan-bilder: `boende-fjallsippan-exterior.jpg` (stor) och `boende-fjallsippan-bastu.jpg` (feature). Rubrik "Egen bastu efter sista åket". Plan: stora bilden blir en film av stillbilder (exteriör, vardagsrum, kök, sovrum, skidspår), en spelar åt gången, hovring byter.
- Kort 2 = Ski Lodge Premium 203 – backvy (r360: 46 m², 6 bäddar, 2 sovrum, söderbalkong mot backen, 25 m till lift och längdspår, handikappanpassad, våning 2). Bilder från R360: `boende-skilodge-203-allrum.jpg` (stor) och `boende-skilodge-203-balkong.jpg` (balkongdörren, beskuren). Ingen bild på utsikten finns. Pris okänt.
- Båda raderna är karuseller (pilar som Aktuellt, fullbredd, snap, tangentbord) med 5 kort: kort 4 och 5 är platshållare ([Boende 4], [Boende 5]).
- Rubrik i Utförsåkningsblockets stil (`utforsakning-eyebrow` "Handplockade boenden" + `td-heading-4`), ingen pilknapp.
- Oura: rubriken ovanpå bilden, detaljen som rund närbild. Waabi: stor bild + tre rutor (detalj, avstånd till liften, bäddar), CTA-pil.
- En dag (TD + OG): när sista kortet (Tillbaka i stugan) nås animerar tidslinjen själv till solnedgång, och nästa-pil/Hoppa över döljs. Settle drar aldrig tillbaka förbi sista kortet. (Ersätter tidigare eget snapstopp för solnedgången.)
- OG: sista kortets text centrerad i hela bilden, tidsetiketten 18 px bold. Alla högerpilar i OG använder En dag-pilens grafik (16 px, stroke 1,5, square/bevel), även arrow-right.svg. Kort 4 heter "Pulka och varm choklad vid elden".
- OG En dag (vinter): riktiga bilder från kundens bildbank (`og/desktop/assets/img/en-dag/`, 1800 px, 1,2 MB) och nytt manus: 08:30 Först ner i ljuset, 10:00 Bärra i backen, 12:30 Ut i skogen (längd), 15:00 Pulka och kakao vid elden, 16:00 stugan i mörkret. Inga videor (kundens var dåliga). Härbret (Bärras stuga, AA103392) bortvalt för att behålla 4 kort + avslut så sommarvyn inte bryts. Öppet: verifiera med kund att Bärra/skidskolan och eldstaden finns som beskrivet. Urvalsark: `../assets/og/og-en-dag-urval.jpg`.
- Anna-citatet (Skarvarna) sitter i glappet mellan frågekortet (`.faq`, 288 px efter) och `#boenden-waabi` (160 px före `#boende`).
- Skisser av 13 kortvarianter (en per inspo) i artefakten "TD boendekort".
- Öppet: välj en av raderna (den andra tas bort), riktiga boenden och bilder, video i stora bilden, mobil ej granskad.

## Klart 14 nov: En källa för frågeförslag, midsommarbild, ledkortets copy
- `window.TD_FRAGOR` i `td/desktop/index.html` styr huvudmenyn (Fjällguiden), Vanliga frågor-blocket (alla sex) och Läget just nu (tre första) per läge × säsong: general, booking, onsite + Summer-varianter. Ändra frågor bara där.
- Nytt svar: "Vad gör vi om det blåser?" (På plats vinter, ersätter regn). Längdlistorna i Just nu är oförändrade och styrs inte av källan.
- FAQ-blockets klick är delegerat (raderna renderas om vid td-mode/td-season).
- Midsommarkortet: AI-genererad `assets/img/midsommar-fjallet.jpg` (Figma-nod 2780:2353). Ledkortet: "Pistgängets nya led".
- Öppet: "genom fjällbjörkskogen" i ledkortet är ej verifierat. Platshållare i [hakparentes] i nya svaret.

## Klart 13 nov: vallafärger som tokens (`9b402c4`)
- Figma: primitiver `wax/green|blue|violet|red|yellow` i `Shared / Primitives` (2691:2353/2355/2357/2359/2361, dolda), semantiska `wax-*` i `Semantic` (2691:2354/2356/2358/2360/2362) aliasade till primitiverna. Scopes FRAME_FILL + SHAPE_FILL, code syntax `var(--wax-*)` / `var(--color-wax-*)`. Verifierat med `get_variable_defs`.
- Kod: `color.wax.*` i `primitives.json`, `wax`-grupp i båda `*.semantic.json`, generatorn emitterar `--wax-*` (TD + OG). `startsida.css` använder `var(--wax-*)`. Computed color identisk före/efter för alla fem, aktiv och inaktiv (40 %).
- Ingen `-dark`: kortet ligger alltid på snö. Kontrast mot vit: grön 5,08, blå 5,30, violett 6,64, röd 5,35, **gul 2,42 (under 3:1)**. Inaktiva på 40 %: 1,39–1,88.

## Klart 14 nov: Fjällguiden och Just nu sommar
- Just nu sommar: Fjällguiden-lista (3 frågor), väderkort i stället för På gång (vinterns väderblock i tredje raden dolt på sommaren).
- Fjällguiden-svar (`QA` i `td/desktop/index.html`): alla frågor och följdfrågor har svar med bilder, verifierat i webbläsaren för vinter och sommar (36 + 6 frågor). Frågor som ställs året runt har `summer`-variant (`qaFor()` väljer efter `data-season`). Inga kort utan bild.
- Startvyn (ingen fråga ställd) i fyra varianter (`renderWelcome()`): vinter ny/återkommande (läget just nu + vanliga frågor), påbörjad bokning (bokningssammanfattning, nästa steg liftkort, veckans händelser, frågor om bokningen), på plats (dagens familjeaktiviteter, frågor för dagen), sommar.
- Genererade bilder `td/desktop/assets/img/fraga-*.jpg` (Figma generate_image, 1024 px). Bildramarna ligger kvar på Figma-sidan Concept (2695:*, 2696:2353, 2775:2353–2361, 2776:2353–2354); kan tas bort.
- UI: På gång utan hover-bakgrund (delade komponenten), menyknapp hover `neutral-subtlest`/active `neutral-light`, På plats-reglaget hoppar till toppen, Fjällguiden-ikon vit i sommar, sökknappen i FG-blocket CTA-färg, varumärkesblocket sist efter Hitta hit, live-prickar pulserar, aktivitetskortets hörnlänk bara på hover.

## Klart 14 nov: Fjällguidens startvy
- Rubriken delar rad med stäng-knappen (mitt 57 px från panelens topp för båda), siffror i datarutor 30 px / enheter 18 px, kicker "Läget i Tänndalen just nu" (på plats: "Läget i backarna just nu"). Verifierat i sommarläge; vinter/på plats ej kontrollerat. X centreras mot en rad rubrik – tvåradig personaliserad rubrik hamnar i höjd med första raden.
- Sommarens vanliga frågor 6 → 5 ("Behöver vi myggmedel?" borttagen): ingen scroll vid 1440×900, men scroll vid 810 px höjd. Vinter/på plats har kvar 6 frågor, ej kontrollerat.

## Klart 14 nov: topografier och På plats
- På plats: introtexten (`#statement`) dold. Storvigeln-topon ankras mot `.just-nu-head`; etiketten räknas i JS till mitten av glappet Just nu → Aktuellt +100 px (följer parallaxen), topon till höger och nedanför.
- Skarvarna: i På plats (En dag flyttas efter Fråga) centreras topo + text i glappet Fråga-blocket → En dag-rubriken och scrollar ut när En dag är i fokus. I övriga lägen (En dag före Fråga) ligger topon kvar på gamla platsen och texten mitt i glappet Just nu → Fråga, 170 px åt höger (+40 px uppmätt korrektion). Uppmätt i På plats och återkommande vid 1260 px; ny/bokning ej kontrollerade.
- Topografierna: `neutral-light` på 80 % via `color-mix` (opacity skrivs över av introt). Aktuellt-korten utan bakgrund så topon inte klipps.
- Öppet: ska En dag ligga efter Fråga även i andra lägen? (designbeslut)

## Klart 14 nov: En dag – meny, layout, snap, skugga (TD + OG hero-page)
- Menyn (`.top.is-tucked`) glider upp medan En dag och Lev/Andas fyller skärmen, tillbaka när sektionens botten < 1,25 vh eller man scrollar upp ur den. Göms inte när menyn är öppen/fokuserad. Bara TD. Verifierat vinter + sommar.
- En dag-pin lyft `--en-dag-lift: 40px` (TD desktop): rubriken 48 px från toppen vid 1440×900. Hoppa över/nästa 32 px från botten (TD + OG hero-page).
- Korten 8 % bredare (`* 1.08`), samma höjd. Text vänster om kortet +20 px (gap 68). Tidslinjen vänd: ikon vänster, text höger vänsterställd, linjen 150 px närmre korten.
- Skugga på korten i JS: vila 0 12 36 / 16 %, lyft upp till 0 60 140 / 38 %, tonar ned med (1−into)^2,5 mot landning.
- Snap (settle): delay 40 ms, tröskel 0,65, vel-max 2,0, duration 700 ms, cosinus-ease. Ingen död zon: utan kandidat framåt inom tröskeln går den till närmaste punkt. Testat med simulerade stopp i TD; känslan inte bedömd i riktig browser.
- Bugg: sektionen släppte innan puffen landat när säsongsbannern är dold → höjden får `innerHeight` i stället för bannerhöjd. Tidslinjen når nu solnedgång före släpp.
- OG-startsidan (`og/desktop/index.html`) har samma JS-ändringar men saknar En dag-CSS helt; ej verifierad.
- Öppet: känsla på snap/skugga i riktig browser; ska OG få samma meny-tuck och lyft?

## Klart 14 nov: På plats sommar – väderkort, toppbar, Storvigeln
- Väderkortet sommar: ingen bakgrundsplatta, rubrik "Väder i dalen", "Nu · Halvklart" på egen rad, detaljrader (body 16 px, tätare) toppalignade mot glyfftoppen på 14° (padding-top 13 px, mätt 0,2 px diff), 8 px under 14°, prognos i ett stycke 18 px. Vinterkortet orört.
- Sommarläge: webbkameran ligger ovanför vädret (DOM-flytt i `setSummerSwap`, återställs vid vinter).
- Toppbaren På plats visar sommardata från `justNuData.sommar` (Öppet / Väder / Lederna); vintertext återställs vid växling. Rubrikerna är Claudes förslag.
- Storvigeln-etiketten På plats sommar: `--label-nudge-x: -32px` (vinter 40 px).

## Klart 14 nov: Menyn i startläge under introt
- Orsak (Johns DevTools): när introt "landat" är man fortfarande i runwayn (`is-intro` utan `is-intro-done`, runway 2393 px), scrollad långt ner → `is-scrolled` → glaspanelen syns. Släppet (`markSeen`) kommer först vid data-release.
- `intro.css`: `html.is-intro:not(.is-intro-done) .top-glass { opacity: 0 !important }`. De tre scrollTo(0)-försöken (260d110, b8fee60, a14563a) återställda; `intro.js` = 011b052. Cache-bust `intro.css/intro.js?v=glas0`.
- Verifierat: under introt med is-scrolled → glas opacity 0; med is-intro-done → 1.

## Klart 14 nov: Ingen "Tänndalen"-blixt vid sidladdning
- Orsak: `.intro-word` (stor Superclarendon) syntes överst tills `intro.js` hann placera/tona in den, och för återkommande tills JS tog bort `#intro-lock`.
- `intro.css`: `.intro-word { opacity: 0 }` (JS sätter inline opacity i introt) + `html.is-returning .intro-lock, #intro-scroll { display: none }` (klassen sätts i head-skriptet). Cache-bust `intro.css?v=noflash`.
- Verifierat i iframe utan JS: ordet opacity 0, låset display none med is-returning. Introts intoning i läge 1 ej visuellt kontrollerad (rAF körs inte i dold panel).

## Klart 14 nov: Lägesväljaren och liftkortstipset
- Lägesväljaren (`shared/js/modes-engine.js` + `.mode-switch*` i startsida.css): demoraden "Demo: vistelse pågår nu" borttagen (handlern ligger kvar men hittar ingen knapp; `labels.demoToday` oanvänd). Ny stil: rubrik "VISNINGSLÄGE" 12 px, rader 40 px CircularXX 15 px, hover neutral-subtlest, valt läge Bold + bock, radie 8 px, tunn kant.
- Lägesmenyn: siffran i CTA-färgad cirkel 24 px (`.mode-switch-num`, Snö 13 px Bold), texten bredvid.
- Liftkortstipset i läge 3 visas igen: regeln `html[data-mode="booking"] .mode-booking-tip { display:none !important }` (från e165d35, när Nästa steg-kortet skulle ersätta tipset) borttagen. Mätt: tipset centrerat över Liftkort (642 px = 642 px), 7 px ovanför ikonraden.

## Klart 14 nov: Glaskort – parallax i ramen
- Den suddiga bildkopian (`::before`) flyttas med `--td-glas-px/py` (max ±24 px, motsatt kortets läge i viewporten) vid sidscroll, karusellscroll och resize. Av vid prefers-reduced-motion. Ryms i `inset: -40px`.
- Verifierat: CSS-transformen följer variablerna (t.ex. −24 px för kortet längst ut). Kunde inte mätas live: rAF körs inte i dold browserpanel.

## Klart 14 nov: Ny snowboardbild
- `td/desktop/assets/img/snowboard.jpg` (genererad, Figma generate_image, 1536×1024, nod 2777:2353 på Concept – kan tas bort): åkare svänger i pist, kvällssol, björk och lift i bakgrunden. Ersätter `snow.jpg` i Snowboard-fliken (Vad gör man här) och i läge 3-kortet "Det här händer veckan du kommer". `snow.jpg` ligger kvar oanvänd.
- Verifierat: båda laddar (1536 px, object-fit cover). Beskärningen i fliken ej visuellt granskad.

## Klart 14 nov: Aktuellt vinter – kort per läge
- `data-lage` på vinterkorten: `bas` (läge 1/2), `booking` (läge 3), `onsite` (läge 4). Synlighet via `html[data-mode]` i `startsida.css`. Sommar har en uppsättning för alla lägen.
- Läge 3: Fackelåkning nedför Hamra (glas-svart, event under besökarens vecka, chip "[Tor 18 feb] · under din vecka"), Skidskola för barnen (glas), fråga "Hur tidigt kan vi checka in?" (vinter), Skidorna står klara (host), Det här händer veckan du kommer (vinter). Liftkortskortet borttaget (John 14 nov: event först).
- Läge 4: Middag på Toppstugan (glas-svart), Hamra Syd efter lunch (vinter), fråga "Var äter vi lunch i backen?" (vinter), Hundspann från Hamra (host), After ski och livemusik (glas).
- Frågorna har befintliga QA-svar. Allt i [hakparentes] är platshållare; bilder återanvända. Ingen brådska i texterna (TD prisneutralt).
- Verifierat: rätt 5–6 kort per läge (returning/booking/onsite), 6 sommarkort i booking och onsite, alla bilder laddar, glaskorten har suddig bild. Ej visuellt granskat av John.

## Klart 14 nov: Aktuellt – säsongsbyte och plattor
- Vitt glas: kanten vit 0.3 (var 0.7).
- Sommarkorten matchar bilden i stället för glas: Midsommar `var`, Leden `sommar`, frågan `sommar`, Augusti `host`, Fjällnatt `glas`, Vintern kommer `vinter`. Blocket får använda alla säsongsfärger.
- "Vintern kommer": knappen "Gå till vintersäsong" byter säsong (klickar säsongsväxlaren) och scrollar till Aktuellt. Nytt vinterkort sist i läge 1/2: "Sommaren kommer också" (sommarplatta, banner-sommar.jpg) med "Gå till sommarsäsong". Dolt i läge 3/4.
- Verifierat: båda knapparna byter säsong (winter→summer→winter), nya kortet syns sist i läge 2 och är dolt i På plats, kantfärg rgba(255,255,255,0.3). Kunde inte mätas: slutläget i karusellen, eftersom smooth scroll står still i dold browserpanel.

## Klart 14 nov: Aktuellt – svart glas
- Plattvariant `data-platta="glas-svart"` i `shared/design-system/components/aktuellt-kort.css` = samma svarta glas som boendekortet (`.boende-card`): Natt 60 % (color-mix), kant Snö 10 %, `radius-sm`, skugga 0 8 12 / 0.06, blur 14 px. Ingen egen stil. Ej i Figma än.
- Applicerad på "Skidsäsongen är igång!". Mätt: alla fem värden identiska med boendekortet.
- Över Dag-ytan blev glaset bara grått (inget motiv bakom). Nu ligger kortets egen bild suddig (blur 14 px, inset −40 px) i `::before` och Natt 60 % i `::after`. Bilden sätts som `--td-glas-bild` i JS med absolut URL (relativ URL löstes mot CSS-filens mapp). Verifierat att bilden laddas och syns i ramen.
- Svart glas mörkare än boendekortet: Natt 80 % (John: "mörkare platta").
- Samma approach på vitt glas (Sprakande nyår): suddig kortbild under vit 0.4. Mätt: bilden laddas, ton rgba(255,255,255,0.4). Johns visuella godkännande saknas för båda.

## Klart 14 nov: Väderkortet vinter = sommarns styling
- Vinterkortet (`.just-cols-3 .td-vader-block`) har samma struktur som sommar: "Nu · Klart" på egen rad med prick, `td-vader-main-top`, detaljrader `td-vader-detalj-tight` i body 16 px, prognos `td-vader-text-lg` 18 px. Ingen CSS ändrad, bara klasser/markup.
- Mätt 1440×900 i `?mode=onsite`: Nu-raden 62 px från kortets topp, 4 px till 6°, detaljerna toppalignade (0 px), prognosen 20 px under siffran – identiskt med sommarkortet. Längdvarianten har samma markup, ej visuellt kontrollerad.

## Klart 14 nov: Aktuellt sommar
- Sommarläget har egen kortuppsättning (`data-sasong="sommar"`), vinterkorten (`data-sasong="vinter"`) döljs via `html[data-season]` i `startsida.css`. Ordning: Midsommar på fjället (erbjudande), Leden vi röjde i våras (sommarplatta), Fjällguiden-frågan "Vad gör vi om det regnar?" (finns i QA), Stanna en vecka i augusti (erbjudande), Fjällnatt med lavinteknikern, Vintern kommer (vinterplatta).
- Allt innehåll är platshållare: [pris], [datum], [led], [plats], [namn] måste bytas mot riktiga uppgifter innan kunden ser det som sant. Bilderna är återanvända (sommar-dag-01, fraga-fabodstigen, meny-cykling-sommar, fraga-utsiktsstenen, banner-vinter).
- Karusellen räknar bara synliga kort och nollställer scroll vid säsongsbyte. Verifierat 1440×900: sista kortets bildkant = pilens högerkant (1360 px) i både vinter och sommar, vinterordningen orörd.

## Klart 14 nov: Aktuellt – frågekortet
- Frågekortet har säsongsplatta igen (vinter `#A1B5BA`, sommar `#1B4021` med ljus text/ikon), följer `html[data-season]`. Transparent-regeln för Aktuellt-kort gäller fortfarande övriga kort.
- Läge 1/2 (ny/återkommande): frågekortet ligger som kort nr 3 via CSS `order`. Läge 3/4: sist som förut. Verifierat i alla 8 kombinationer läge × säsong.
- Nytt kort 5 "Skidsäsongen är igång!" (vinterplatta, chip "Premiär 24 oktober", bara Boka boende, vit sekundärknapp). Bild `td/desktop/assets/img/skidsasongen.jpg` committad 14 nov. `.td-aktuellt-end` får `order` i läge 1/2 så den ligger sist.
- Storvigeln-etiketten fadar redan bakom Aktuellt-pilarna (`.td-aktuellt-nav` tillagd i `LAYER_OCCLUDERS`). Ej visuellt verifierad: rAF gick inte att driva i dold browserpanel.
- Glasplattan i Aktuellt: vit 0.4 i stället för frost-active 0.28 (lokal override, token orörd).
- Frågekortet i Aktuellt: toppen visar Fjällguiden-märket + "Fjällguiden" + AI-badge i stället för chattikon + "Fråga oss".
- Aktuellt-ordning: Sprakande nyår först, Jobba fjällifrån andra.
- Just nu, läge 1/2: Rapport ersatt av videokort (`.td-videokort`, 410×500) – YouTube-nocookie `NM2Rb1ShiwE` loopar 20–40 s mutad i bakgrund, play centrerad, kicker "Film · 1 min" (ej verifierad längd) + titel nere till vänster. Klick öppnar `<dialog>` med filmen med ljud. Läge 3/4 visar Rapport som förut. Öppet: egen mp4 från kunden (YouTube-embed visar logga/UI vid start), visuellt ej granskad (dold browserpanel).
- Videokort: stillbild (YouTube-thumbnail) tills spelaren rapporterar playing via JS-API, egen loop 20–40 s (ingen spellista → inga föregående/nästa), iframe skalad 1.25 så titeln hamnar utanför. Play 56 px med Icon/Play-triangeln (samma som boende-karusellen), ikon 28 px, ingen förskjutning.

- Just nu, läge 3 (påbörjad bokning): Rapport ersatt av Nästa steg-kort (`.td-nastasteg`, 410×500, per gren). Alpint: "Liftkort för hela veckan", 54 nedfarter/17 liftar, bild `fraga-lift.jpg`. Längd: "Spårkort för hela veckan", 145 km spår (demodata), bild `langd.jpg`. Kicker "Din resa · 12–19 feb", "fr. [X] kr" (platshållare), CTA-knapp, vit text, lätt scrim nedtill. Liftkortstipset (`.mode-booking-tip`) dolt i läge 3. Öppet: riktiga priser, länk till R360, logik för "första som saknas" är hårdkodad (liftkort/spårkort).

- Fjällguiden i Just nu, läge 3: eyebrow "Inför er resa" + egna frågor. Alpint: Var hämtar vi skidhyran? / Behöver barnen skidskola första dagen? / Hur tar vi oss från boendet till liften? Längd: Var hyr vi längdskidor? / Vilket spår passar första dagen? / Kan vi köpa spårkort på plats? (`.td-guide-bokning`). Svar i `QA` (index.html) med kort och följdfrågor; påhittade namn/priser i [hakparentes]. Svarsvisningen ej sedd i browser (rAF i dold panel).

## Klart 14 nov: Läge 3/4-ordning, Hoppa över, footer-scroll, rubriker
- Påbörjad bokning (`data-mode="booking"`): Utförsåkning-flikarna, Fjällguiden och Just nu flyttas före En dag (skript i `index.html`, återställs vid lägesbyte via kommentarsmarkörer). Luft under Fjällguiden 144 px desktop / 48 px mobil i det läget (`startsida.css`); Fjällguiden → Just nu-rubriken mätt 251 px.
- En dag: Hoppa över går till blocket som faktiskt följer En dag (Boende i läge 3). Pilen är aktiv även på sista steget och gör då samma sak som Hoppa över.
- Scroll förbi footern: `#parallax-layer` translateras nedåt och stack ut ~2 500 px under footern. Höjden kapas nu varje bildruta mot `footer.site-footer` (`capLayerHeight`). Mätt: dokument = footerns nederkant. Plus `overscroll-behavior-y: none` på html/body.
- Lev. Andas.-sekvensen: `calc(300vh - 1000px)` på desktop (test, John utvärderar). Mobil oförändrad.
- Läge 4 (På plats vinter): frågekortet "Var äter vi lunch i backen?" och "Hamra Syd efter lunch" sist i Aktuellt, frågan först.
- Rubriker: "Nytt i Tänndalen." → "Detta är på gång.", "Just nu i dalen" → "Läget just nu" (alla lägen).

## Commit-historik (nyast först)

| Hash | Innehåll |
|---|---|
| `f76a8b9` | TD: Fjällguidens startvy per läge, säsongsfrågor, live-prickar |
| `8cc9f54` | TD: svar på alla Fjällguiden-frågor, sommarvarianter, UI-rättningar (hover, meny, På plats-scroll, ikon, CTA, varumärkesblock sist) |
| `ba32de9` | TD: genererade sommarbilder till Fjällguidens svarskort |
| `c9b0451` | TD: Just nu sommar – Fjällguiden-frågor och väder i stället för På gång |
| `5099de3` | Docs: CLAUDE.md + docs/ |
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

td-brand-3.png (32 MB original, oanvänd) borttagen 2026-11-15. Öppet: `td/desktop/assets/brand/` (logotyper) och `assets/img/brand/` (bilder) har förvirrande lika namn – föreslaget att döpa om den senare.

Commit-trailer som använts: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01TLNL3tB7DVfjayBHSWwd5v`.

## Öppna punkter
- Lev. Andas.-sekvensens höjd `calc(300vh - 1000px)` är ett test: under ~500 px fönsterhöjd blir sektionen kortare än skärmen. Bestäm värde och skriv om robust.
- Scrollanimationerna (Hoppa över/pil, parallaxtak) är verifierade med mätning, inte visuellt i synlig webbläsare.
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
- [ ] Sommarsvaren i Just nu förutsätter känd familj ("sexåringen", "nioåringen") trots att sommar = återkommande besökare. Beslut: ta bort barnen ur sommarsvaren?
- [ ] Platshållare att ersätta: [Anna], exempelpriser/tider (utan [] sedan 17 nov), hund-/ombokningsregler, hundrum Ski Lodge, liftkortsregler barn, hjälmkrav skidskola, [Hamraslingan]/[Utsiktsstenen]/[Fäbodstigen], [Cykeluthyrningen] m.fl. Sjönamnet Svansjön är inte bestämt.
- [ ] Bokningsvyn i Fjällguiden är lång (~1000 px i 760 px panel, scrollar).
- [ ] Ocommittat i `td/desktop/startsida.css` som inte är Claudes: AI-taggens storlek (8 rader) och skärpt selektor + `::before` på FG-sökknappen. John avgör.
- [ ] Push av `main` (John, på begäran).

## Medvetna begränsningar och fällor
- **`npm run tokens:css` skriver över `generated/typography-td.css`** och tar bort handtillägg från `4ab8c14` (`.td-ui-figure-xl`, fallback på `--font-size-13`, kommentar). Återställ filen med `git checkout -- …/generated/typography-td.css` efter körning, tills tilläggen flyttats in i typografikällan. Eller kör bara `npm run generate:css` i `shared/design-system/`.
- Figma `difficulty/*`-primitiver har code syntax `var(--color-TD-difficulty-*)`, men CSS heter `--color-difficulty-*` (fanns före wax-jobbet, orört).
- Valla-skisstavlan i Figma (2672:2313) finns inte längre. Vald riktning är byggd i kod; se `startsida-td.md`.
- Figma-asset-URL:er kan inte laddas ned från molncontainern; John exporterar bilder manuellt.
- Många av chattens CSS-ändringar ligger som kronologiska tillägg i slutet av `td/desktop/startsida.css`; senare block överstyr tidigare. Vid städning: slå ihop och flytta till `shared/design-system/components/`.
- Figma-bibliotekets radhöjdsrättningar (unit-lg 24/26, unit-md 16/18, unit 12/13, figure-sm-regular 14/15) är lokala tills biblioteket publiceras och uppdateringen accepteras.
- Concept-sidan har åtta brutna Boka-instanser.
