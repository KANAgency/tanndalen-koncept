# Beslut

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
