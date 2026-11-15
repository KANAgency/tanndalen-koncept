# Status (uppdatera i slutet av varje uppgift)

Senast uppdaterad: 2026-11-15 (OG lägessystem, Just nu, Orsa-guiden, En dag). Detaljer om vad som är byggt finns i `startsida-td.md` (Del 2).

## Läge
- TD startsida desktop: intro, header (Fjällguiden), Aktuellt, En dag, Just nu (Alpint + Längd, tredje raden i På plats), varumärkessektionen, Fjällguiden-blocket och svarsmodalen (15 frågor) är byggda. Allt innehåll i Just nu och modalen är hårdkodat/påhittat.
- OG: hero-sida, booking och intro uppdaterade, En dag-växlare dold, nya SVG-logotyper. Ingen OG-motsvarighet till Fjällguiden, vallakort eller 13 px caption.
- Prioritet: OG-prototypen (0 % klar) går före det som återstår för TD (mobil, mindre tweaks, lägesanpassningar).
- Senaste HEAD: `f76a8b9` på `main`. Inte pushad.
- Lägesmodell (beslut 14 nov): vinter är master för alla lägen (ny besökare, återkommande, påbörjad bokning, på plats). Sommar är EN variant = återkommande besökare. Ny besökare skiljer sig bara genom att introt visas. Samma logik ska gälla OG (andra introregler).
- Demopersona: [Anna] (platshållare), 2 vuxna + 2 barn (6 och 9 år), bokat Ski Lodge Premium 12–19 feb 2027 (`td/desktop/demo-stay.js`). Boende bokat, liftkort inte (nästa steg).

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
- Citatet och topografin mellan Fjällguiden och `#boende` ankras nu efter `#boenden-waabi` (faller tillbaka på `.faq`).
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

Medvetet ocommittad: `td/desktop/assets/img/brand/td-brand-3.png` (32 MB original; sajten använder `td-brand-3.jpg`).

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
- [ ] Platshållare att ersätta: [Anna], restid [ca 7 h], priser fr. [X] kr, hund-/ombokningsregler, hundrum Ski Lodge, liftkortsregler barn, hjälmkrav skidskola, [Hamraslingan]/[Utsiktsstenen]/[Fäbodstigen], [Cykeluthyrningen] m.fl. Sjönamnet Svansjön är inte bestämt.
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
