# Beslut

## 2026-11-09 (Onsite-titel vänster)

«På plats i Tänndalen» i vänsterkolumn, större inline-start (pad 2xl + margin lg). Data centrerad, leave höger. Ratades: titel i mittenflödet. Öppet: inget.

## 2026-11-09 (Onsite-leave som textlänk)

Leave utan `td-button-text` — nollställd knapp, underline. Ratades: button-text hover/padding. Öppet: inget.

## 2026-11-09 (Onsite-topbar säsongsfärg)

Topbar-bg: winter/summer via `data-season` + matchande contrast-text. Ratades: alltid winter. Öppet: inget.

## 2026-11-09 (Onsite-dataetiketter bold)

Öppet, Nysnö, Snödjup bold i topbaren (samma som «På plats…»). Ratades: hela datasträngen bold. Öppet: inget.

## 2026-11-09 (Onsite-leave höger)

«Jag är inte på plats» högerställd i topbaren; statusraden centrerad. Ratades: leave i mittenflödet. Öppet: inget.

## 2026-11-09 (Onsite-topbar label + leave utan outline)

Rad börjar med bold «På plats i Tänndalen»; leave-länk utan focus-outline. Ratades: behålla tom outline. Öppet: inget.

## 2026-11-09 (Meny-sub hover CTA + pil)

Undermenylänkar: hover/focus = CTA-textfärg, ingen bakgrund; textpil (arrow-right) animeras in. Ratades: säsongsfärgad hover-yta. Öppet: inget.

## 2026-11-09 (Onsite-topbar ersätter quiet-pill)

Quiet-pill bort. Statusrad längst upp (inte sticky), winter-färg, centrerad text: Öppet/Nysnö/Snödjup + länk «Jag är inte på plats» (stänger onsite). Ratades: sticky pill under meny. Öppet: live-data vs hårdkodat; sommarvariant.

## 2026-11-09 (Quiet-pill synlig med öppen meny)

Tog bort `.page:has(.site-menu.is-open) .onsite-quiet-row { display: none }`. Ratades: dölja pillen när menyn är öppen. Öppet: om z-index mot fullbreddsmeny på mobil.

## 2026-11-06 (Account stay-head botten)

`.account-stay-head` utan bottenpadding; barn `margin: 0` (h2-default). Ratades: röra stay-gap. Öppet: inget.

## 2026-11-06 (Rasmus parallax)

Rasmus-citat in i `#parallax-layer` (`.parallax-item--citat`, ankare `#citat-band`). Samma lager-offset + label-delta som övrig bg-text. Flödessektion = luft. Ratades: flöde utan parallax. Öppet: ankarehöjd 252 kan trimmas.

## 2026-11-06 (Lager-tona 30 %)

Storvigeln-etikett, Skarvarna-info, Anna-citat, Rasmus: `is-covered` → opacity 0.3 vid AABB mot foreground (Just nu, FAQ, m.fl.). Tidigare Skarvarna gick till 0. Ratades: dölja helt. Öppet: om fler occluders behövs.

## 2026-11-06 (Cykel-ikon −4 px)

Cykel/MTB-ikon `translateY(-4px)` i `.booking-icon-slot--cykel`. Ratades: ändra SVG-viewBox. Öppet: inget.

## 2026-11-06 (Sommar: Aktiviteter ersätter Skidskola)

Sommar-cats: Boende, Liftkort, Cykel, Aktiviteter, Paket (samma remap-mönster som Cykel). Kompass inline med CSS-var; kanot bara i ikonsettet. Fält = dag/period som Skidhyra. R360-id tomt. Länk `#aktiviteter` «Utforska aktiviteter». Ratades: röra vinterraden. Öppet: R360-id för Aktiviteter (och Cykel).

## 2026-11-06 (Visa På plats bort)

Knapp «Visa På plats» i account stay-vy bort (HTML + handlers). På plats via meny-toggle / quiet-pill. Ratades: CTA i vistelsepanelen. Öppet: inget.

## 2026-11-06 (Onsite booking = vanliga)

På plats: samma cats (Boende–Paket) och ingen compact (scale 0.92 / opacity 0.82 bort). Ratades: separat onsite-rad och nedtonad bar. Öppet: inget.

## 2026-11-06 (På plats-fält avstånd)

`.onsite-toggle-field`: margin-top −16 (space-md−16) och margin-bottom +16 mot foot. Ratades: röra season-toggle padding. Öppet: inget.

## 2026-11-06 (Just nu +80 mot säsong)

`.just-nu` `padding-top: 80px` mot säsongsbannern. Margin på head/sektion kollapsade mot `--en-dag-hang` (≥1024). Ratades: margin-top på `.just-nu-head`. Öppet: om mobil ska ha mindre.

## 2026-11-06 (På plats-pill under menyn)

Pillen «På plats i Tänndalen» ligger nu bara i `.onsite-quiet-row` direkt efter headern, centrerad under hela menyraden på desktop och mobil. Raden är sticky med höjd 0 (ingen layoutförskjutning) och döljs när menypanelen är öppen. Klick öppnar menyn med fokus på onsite-toggle som förut. Brand-center-dubbletten och mobil-/desktop-växlingen i CSS är borta. Ratades: pill i brand-center på desktop. Öppet: inget.

## 2026-11-06 (Rasmus under utforsakning)

`#citat-band` flyttat till flöde efter utforsakning, centrerat. Parallax/klipp bort. Boende ankras direkt efter En dag. Ratades: absolut band före Just nu. Öppet: vertikal padding kan trimmas.

## 2026-11-06 (Geo-suggest bort)

Länk «Är du i Tänndalen?» (meny + footer), geo-banner och haversine bort. På plats = meny-toggle / konto. Ratades: geo-förslag. Öppet: coords/wifi-hook kvar i config oanvänd.

## 2026-11-06 (Account-fält utan active-ring)

Bokningsfält: ingen orange accent-outline/inset vid focus. Ratades: accent-ring. Öppet: om fokusindikator ska återkomma i annan form.

## 2026-11-06 (Onsite-toggle Form/Toggle Light)

Off = day-track + snow-thumb; on = night-track + snow-thumb; 2 px inset. Ratades: night även i off (tidigare). Öppet: inget.

## 2026-11-06 (Citat färg tillbaka)

Anna+Rasmus → `--color-TD-neutral` igen (ångrade muted). Ratades: muted. Öppet: inget.

## 2026-11-06 (Citat regular)

Anna+Rasmus citat och avsändare → `font-weight-regular` + `font-synthesis: none` (avsändare var book). Ratades: behålla book. Öppet: inget.

## 2026-11-06 (Citat muted + Rasmus −1)

Anna+Rasmus färg → `--color-TD-neutral-muted`. Rasmus citat 30→`font-size-xl` (24). Ratades: behålla neutral. Öppet: inget.

## 2026-11-06 (Citat-gap 8 + Rasmus vänster)

Gap 20→8 (−12). Rasmus `align-items/text-align: left` (var centrerad via `.td-citat`). Ratades: behålla center. Öppet: inget.

## 2026-11-06 (Meny bleed smal desktop)

`--menu-bleed` 0 under 1440, 16 från 1440. Under 1440: `--menu-inline-pad: 16px` så glaset behåller sidopadding utan att blöda ut. Logo 190×22 bara under 1280; 206×24 från 1280. Ratades: nolla vertikal edge; 32 px pad via pad+bleed; mindre logo överallt. Öppet: om 1280–1439 också ska blöda lite.

## 2026-11-06 (Account-lead body-xs)

Ingress «Fyll i…» → `td-body-xs` (14/150). Klassen saknades i genererad typografi — tillagd manuellt. Ratades: behålla body-sm (16). Öppet: synka body-xs in i typography-styles JSON vid nästa token-export.

## 2026-11-06 (Hitta din bokning-panel)

Panel mot Figma 2376:16465: gap 16, fält `bg-base` + radius-md utan kant, knapp Secondary fill-spring fullbredd, avdelare + foot space-between. Efternamn behålls (prompt > skissens E-post). Ratades: fill-autumn. Öppet: inget.

## 2026-11-06 (På plats-läge)

Nytt läge `onsite` ovanpå new/returning/booking. State i `td-onsite-tanndalen` (value/source/until), manuell av stänger auto till dagens slut. Quiet pill under logo (mobil: rad under header). Meny-toggle, geo bara på klick, mockad vistelse utan bokningsnummer i storage. Just nu order −1. En dag redan flödesankrad — ingen top-refaktor. Ratades: wifi, gissade koordinater, Byt läge-länk. Öppet: geo-koordinater TODO; morgonrapport-innehåll.

## 2026-11-06 (Anna-citat + avsändaravstånd)

Citatblock till höger om topo, mitt i Fråga→Boende-gap. `.quote-text`/`.quote-by` i flöde med `margin-top: 44px` (36+8) — absolute top ratades (margin dog, SOURCE_GAP_NUDGE räckte inte). Öppet: inget.

## 2026-11-06 (Skarvarna-info i gap)

Namn+fakta till höger om topo (`W+24`) och mitt i Just nu→Fråga-gapet (skärmmål vh/2 vid s_gap). Enhetens L/T oförändrad. Ratades: flytta via PANEL_LABEL. Öppet: textTy-drift ~22 px vid s_gap vs s_c.

## 2026-11-06 (Skarvarna −300 px)

`--topo2-shift-y: -300px` (CSS transform). Panelankare oförändrade. Ratades: ändra top i placeSkarvarna. Öppet: om etikett/citat ska följa panelen snarare än topon.

## 2026-11-06 (Ny fråga → textlänk i fält)

”Ny fråga” bort från fraga-top; textlänk (`td-button-text`) till vänster om Skicka i `.fraga-follow`, syns i is-answer. Brand redan bort. Ratades: fill-neutral i toppen. Öppet: inget.

## 2026-11-06 (Skarvarna topo −30 %)

`TOPO2_LAYOUT.SCALE: 0.7` i `computeTopo2W`; CSS-fallback `--topo2-w` 568. Etikett/citat följer W_b. Ratades: skala bara mask/CSS utan W. Öppet: panelankare kan behöva finjusteras visuellt.

## 2026-11-06 (Rasmus citat text-only)

Porträtt bort. `.td-citat--text`: samma typografi som Skarvarna `.quote-text`/`.quote-by`, gap 44 px (36+8). En rad `Rasmus Bent · VD…`. Ratades: behålla namn+roll-stack. Öppet: bandhöjd/parallax kan behöva trim utan bild.

## 2026-11-06 (Skarvarna citat–avsändare)

`SOURCE_GAP_NUDGE: 8` på källradens top (W_b-placering). Visuellt +8 px mellan citat och Anna-rad. Ratades: CSS margin (absolute top från JS). Öppet: inget.

## 2026-11-05 (En dag Hoppa över vs säsong)

`enSnapZone` false när `.en-dag-season` syns i viewport — Hoppa över/nästa döljs så de inte ligger kvar över säsongsbanan.

## 2026-11-05 (Frågeblock luft)

`--fraga-space-before/after` 224/288 (mobil 96/128) på `.faq`. Ersätter 156 + citat-driven Boende-marginal. Boende `margin-top: 0 !important` så efter-gap = variabeln.

## 2026-11-05 (Rasmus-citat parallax)

`#citat-band` → `--citat-band-h: 300px` (−167 vs padding-flöde). `.td-citat` i `.citat-window` (clip till Just nu-kortrad), parallax d = 24+(1−f)×(y′−s_start) i samma rAF. Mobil/<1024 och reduced-motion: static flöde 48/64. Ratades: citat i #parallax-layer. Öppet: geometriskt AABB-överlapp mot Just nu-rubrik/reglage bakom z-index 5 — ej layoutändrat.

## 2026-11-05 (Skarvarna-SVG UTF-8)

`topografi-skarvarna.svg` var Latin-1 med UTF-8-deklaration (ö i Höjdkurvor) → Chrome naturalWidth 0, mask osynlig. Omencodad till UTF-8. `.td-topo2` fick samma mask-shorthand + alpha som hero-topo.

## 2026-11-05 (Skarvarna mot Frågepanelen)

Enheten ankras till `.td-fraga-block` vid s_c (panelmitt = viewportmitt), inte luckan Just nu↔panel. Etikett/citat/källa i W_b-enheter från SVG-getBBox; top via jämn fördelning av ~29 px höjdfelet (865 vs 895). Fakta = platshållare + TODO/verify. Text+topo bakom (#parallax-layer −1), panel blur 5 px framför. Ratades: citat i luckan ovanför panelen; låst LOCK_DOC_TOP. Öppet: slutetikett ~+124 vs mål +86 (text-delta 0,04); citat/källa ryms inte i 127 px gap till Boende.

## 2026-11-05 (Städning testing-katalog)

Bak, changelogs, qa/ och one-shot-skript bort. Assets till brand/icons/video/img. Topo-fil → topografi-skarvarna.svg, klass --skarvarna. Oanvända ikoner/bildkällor bort. Syskon-backup och parent-testing orörda.

## 2026-11-05 (Skarvarna ersätter Hamrafjället)

Hamra-topo bytt till Skarvarna-SVG (samma filnamn). Etikett+citat ett textlager med delta 0,04 / max 40. Placering via % mot topo; W från fontstorlekar (~811). Top låst till tidigare doc-top. Överlapp citat↔citat-band / källa↔just-nu vid s0 — ej justerat, väntar shift.

## 2026-11-05 (Hoppa över + En dag nästa)

Chevron bort från alla Hoppa över. En dag: cirkelknapp med nedåtpil till vänster → nästa kort.

## 2026-11-05 (Aktuellt-pil ett kort)

Nästa/föregående stegar `cardWidth + gap` i stället för hopp till start/slut.

## 2026-11-05 (Storvigeln +200 / etikett −100/−40)

`--topo-shift-y` 400→600. Etikett `--label-nudge` −40×/−300y (net −100 upp vs innan). Nudge nollställs vid ankarmätning.

## 2026-11-05 (Fråga sökvy topp)

Dialog sökvy: mid-margin 16→4 px, listrubrik padding-top 0 — listan högre upp.

## 2026-11-05 (En dag settle-delay)

`--snap-settle-delay` 140 → 90 ms.

## 2026-11-05 (Frågelista hover)

Hover: `--color-accent` + pil `translate(2px, -2px)` som `.faq-row`. Gäller delad `.td-fraga-fragelista-knapp`.

## 2026-11-05 (Snap settle dir/v)

Riktning via prevY/prevT (spara dy först, skriv sen prev) — inte sample-fönster som krävde två punkter inom 100 ms. lastDirection kvarstår vid tystnad. Standard utan param = settle. Ratades: param-gren.

## 2026-11-05 (Frågelista Figma-stil)

Delad `.td-fraga-fragelista*` i design-system — block + dialog. Platta: neutral-light-kant, radius-sm, ingen fyllning. Rad `.rad + .rad` på `<li>`. Mobil samma värden (antagande). Ratades: behålla vintertonad platta; duplicerad CSS.

## 2026-11-05 (Topo-parallax + neutral-light)

Storvigeln-parallax på `.hero-topo-unit` (400+(1−f)×y′), samma f/y′ som `#parallax-layer` — inte på `.hero-topo` (intro sätter transform:none). Etikett-delta clamp ±40 via `--label-parallax-delta` på :root. Hamra img→mask-div, färg `--color-TD-neutral-light`. Ratades: ny scroll-lyssnare; röra intro.css.

## 2026-11-05 (Storvigeln +400)

`--topo-shift-y: 400px` — topo + etikett.

## 2026-11-05 (Vanliga frågor-lista)

`.td-fraga-block-fragor` samma platta/rad/↗ som Fråga-panelens suggest.

## 2026-11-05 (Fråga suggest-lista)

Sökvy: platta med titel; rader med text + ↗ och avdelare (ref).

## 2026-11-05 (Storvigeln dual-parallax)

Topo `--topo-w` ≈1249 (16/0,0136 och 14/0,0106). Etikett 21,8 %/58 %. `f_label = f_topo + 0,04`, drift clamp ±40. Ratades: gemensam transform.

## 2026-11-05 (Snap settle hastighet)

Hastighetssamples prunas mot nu-tid (inte bara vid scroll) — annars låg settle kvar i re-arm-loop.

## 2026-11-05 (Snap settle riktning)

Auto-settle snappar bara i lastDirection (aldrig bakåt). Tangentbord/tidslinje/hard oförändrade.

## 2026-11-05 (Fråga-fält pil)

Submit «Fråga» → samma SVG-pil som `.fraga-send` i panelen (aria-label kvar).

## 2026-11-05 (Fråga-fält outline)

Ingen outline/stroke på `.td-fraga-falt` focus-within/active (inkl. submit).

## 2026-11-05 (Storvigeln-etikett)

Place-label ~100 px höger, ~200 px ner.

## 2026-11-05 (En dag snap settle)

Standard `?snap=settle` (fri scroll + tröskel 30 % efter idle). `hard` = gamla wheel-jack. `off` = ingen snap. Ratades: snap som tar över vid första hjulrörelse. Öppet: fintrim av delay/tröskel via CSS-variabler.

## 2026-11-05 (En dag puff-copy)

Puff-text + knapp i övre tredjedelen (höjd 33 %, centrerad där). Ratades: vertical center över hela bilden.

## 2026-11-05 (Parallax reset)

Enkel faktor (`--parallax-factor` 0.8 / mobil 0.92) + ankare per topografi. Bort: faser, PHASE*_SPEED, START_OFFSET, fryspunkter, depth-tick. scrollY′ efter intro (R=0 när intro klart). Ratades: multi-fas och korttopp-räkning (ojämn fart, ibland osynlig). Öppet: mobil hero-topo (Storvigeln) ligger kvar i stage, inte ankarparallax.

## 2026-11-05 (En dag hoppa över)

Samma secondary «Hoppa över» som Hitta, synlig i sticky-zonen, scrollar till citat-band.

## 2026-11-05 (Fråga kbd)

`#fraga-kbd` (⌘K) dold i UI; genväg kvar i JS.

## 2026-11-05 (Hero-topo)

Storvigeln-topo + place-labels ×1,2 (974×1154, centrerad). Ratades: bara width utan omcentrering.

## 2026-11-05 (Citat layout)

`.td-citat` vertikal centrerad stack (porträtt → citat → credit). Ratades: horisontell rad.

## 2026-11-05 (Fråga-rad typo)

`.td-fraga-rad` `td-lead-sm` → `td-body-sm` (ett steg ner i body/lead-skalan).

## 2026-11-05 (Rapport chip + pil)

Chip i `.td-rapport-top` (Figma), inte tredje space-between-barn. Alpine: ingen hörnpil. Chip-padding 4×12, diff 12×12 med 6 px streck. Ratades: chip som sibling under body (hamnade mitt i kortet).

## 2026-11-05 (En dag snap)

Fri scroll ~22 % av span mellan punkter, sedan snap. Magnetisk settle inom 12 % efter idle. Ratades: hård preventDefault på varje wheel.

## 2026-11-05 (En dag season)

Säsongsbanner låst under sista kortet (gap 40) när puffen närmar sig — samma left/width som media. Ratades: hang-parallax (för långt→för nära) och left via section-inset.

## 2026-11-05 (En dag våfflor)

Ny stillbild `endag-1300.jpg` (bord med våfflor, pist och röda stugor). Cache-bust `?v=2`.

## 2026-11-05 (En dag kort)

Kort 10 % större + 5 % bredare (847 max-höjd, ratio ×1,05). Landar högre under rubriken (front 188, heading-air 28). Rubrik intro-top under meny från start (samma som sticky-läge); lockAt = pin.top. Wheel snappar till varje kortpunkt med ease-in-out; native scroll i ändarna. Ratades: behålla 238/770/628; CSS scroll-snap; intro +40+40.

## 2026-11-05 (Fråga sticky)

`#fraga-launch` behåller fill-winter i sticky — tog bort `.top.is-scrolled` snow-override.

## 2026-11-05 (Fråga-panel foot)

Footer bytt till live-status (prick + «Prata med en människa» + öppettider) och outlined «Chatta». Fullbredd grå list under fältet. Ratades: «Esc för att stänga» i foot (Esc kvar via tangentbord).

## 2026-11-05 (meny-hover)

Site-menu-länk hover/focus → `--color-accent` (samma som is-current). Boka-rad hover → accent. Boka-foot padding-inline = `space-md` så Kampanjkod linjerar med raderna. Ratades: säsongsfärg på hover; foot `space-xl`.

## 2026-11-05 (Fråga-panel fält)

Övre sökfältet (`.fraga-field`) bort. Caption «Fråga eller sök» flyttad till nedre follow-fältet (`#fraga-input`). Chatt-24-light i fältet (samma som launch). Skicka-knapp fill-winter. Submit frågar om värde finns. Ratades: två fält; förstoringsglas; neutral-subtlest på send.

## 2026-11-05 (citat z-index)

Anna-citatet z-index 0, Fråga/Block (`.faq`) z-index 1 — citat + person under glaset. Ratades: kvar på 6 ovanpå blocket.

## 2026-11-05 (Fråga/Fält knapp)

Pil bort från «Fråga». Fältets högerpadding = uppe/nere (`space-md`); vänster kvar `space-2xl`.

## 2026-11-05 (Aktuellt vänsterkant)

Track-padding = samma formel som `.page` (`max(space-lg, (100vw−1280)/2)`). Ratades: egna 80/40/20-steg som bröt alignment med «Nytt» under 1440.

## 2026-11-05 (Aktuellt Boka)

Sprakande nyår: Boka bytt från Primary till Secondary.

## 2026-11-05 (Aktuellt platshållare bort)

Första Aktuellt-kortet (`data-measure=figma-placeholder`, Erbjudande + [platshållare]-text) borttaget — bara mätkort. Sprakande nyår är första innehållet nu.

## 2026-11-04 (sommar-rapport CTA)

«Hyr kanot eller kajak» var osynlig: hörnlänk-label har opacity 0 tills hover. På is-activity visas etiketten alltid (min-width 0, gap 8). Övriga hörnlänkar orörda.

## 2026-11-04 (Fråga/Fält submit)

Ikon-only up-right i fältet bytt till Secondary + fill-winter md «Fråga» med vanlig högerpil (samma som textblock-CTA). Ratades: behålla Figma-fältets nakna pil.

## 2026-11-04 (Group 14 bakom Fråga)

Hamrafjället-topo + etikett + Anna-citat flyttade till Figmas Group 14-läge: topo ankrad Just nu −20 / block −779 @ 845, etikett 53 %/8 % centrerad ovanför glaset (inte 101 % till höger), citat under block +645. Boende-marginal bara för citatets häng — inte längre topoH−119 (Fråga tar ytan i flödet). Täckningskoll mot just-cols, inte stackade kort utanför klipp. Ratades: ny bakgrunds-SVG; befintlig topografi-hamrafjallet behålls.

## 2026-11-04 (Fråga/Rad hover)

Hover/focus → `--color-accent`, ingen bakgrundspiller. Ratades: night-opacity-pill.

## 2026-11-04 (Fråga Block placering + typo)

Block flyttat till efter Just nu, före Anna-citatet (id=fragor kvar). Gap 156 px explicit (inga tokens matchar). Input/rader fick Editorial/body explicit — font:inherit hade raderat td-lead-sm. Group 14 i Figma = Hamrafjället-topo + etikett (inte egen block-bakgrund); demots td-topo2 finns redan men frågas innan ny bakgrund.

## 2026-11-04 (en-dag-stack)

Bakre kort i En dag krymper ytterligare ~2 % medan nästa rör sig bakåt (recess), så det inte landar i exakt samma skala.

## 2026-11-04 (aktuellt-scroll)

Aktuellt endGap tittade bara på sista kortets bild. Fråga-kortet har ingen → ingen spacer, sista kortet klipptes. Spacer baseras nu på bild eller hela sista kortet.

## 2026-11-04 (Chatt-SVG + ls)

Johns sex Figma-SVG (2067:16441–16471) lagda orörda i icons/content; bakad fraga-oss ersatt i Button/Just nu/Aktuellt/Block. Dark vid ljus etikett (Primary, summer/autumn-fill, fill-winter under summer). currentColor-chatt kvar. Mask-id unika per nod; används som img. LS-overrides (−2 / −0,8) bara i fraga-block.css och aktuellt-kort.css — orsak: Superclarendon-Bold-06.ttf bredare wrap än Figma vid −1,9/−0,6. Block-mobil fortfarande provisorisk @ 1023.

## 2026-11-04 (verifikation)

Block +52 kom från Heading/lg på tre rader; letter-spacing −2 px ger Figmas två rader (~845). Kort-platshållare: Heading/sm −0,8 px för två rader → 631,8 @ 519 (mål 633; −1,2 LH-fraktion). Chatt stoppade tills Johns SVG.

## 2026-11-04

Button fick graphicIcon (Chatt Light/Dark, Medium 24 / Large 32). Aktuellt/Kort ombyggd till Typ Innehåll|Fråga med plate-alias. #fragor ersatt av Fråga/Block. Just nu Header Small → 32 px. Om:-kontext vid öppning från Block/Kort. Mobil för Block är provisorisk. Brytpunkt för kort-mobil: 767 (där Aktuellt redan byter).

Frågerutan heter «Fråga oss» i panelens brand. Övriga texter (Behöver du hjälp?, Undrar du något?, placeholders) orörda.

Hårdkodade border-radius byttes till närmaste token: 0→none, 2/4→sm, 8→md, 16/18→lg, 50%/999→full. Fallbacks på radius-var togs bort. `inherit` lämnades. Ratades: behålla 2px/18px som egna värden — token-setet räcker.

Öppet: R360-id för Cykel (kvar från 11-03). Chatt SVG från Figma.

## 2026-11-03

Visningsläge är ett attribut och små överstyrningar. Inget klonas. Säsongen är ett eget spår och rörs inte av läget.

Booking-kalendern får bara ritas om den ryms i kortet på 500 px. Afterski, kvällsskidåkning och fackeltåg ligger utanför av den anledningen, inte för att de är strukna.

Tooltipens bredd stannade där brödtexten fortfarande är två rader. Pilen sitter i panelens mitt och panelen flyttas så den pekar på Liftkort.

Cykel ersätter Skidhyra i sommar och använder Skidhyras fält. Det är ett antagande. R360-id för Cykel är tomt tills John ger ett.

Öppet: R360-id för Cykel.
