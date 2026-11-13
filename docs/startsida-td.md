# TD startsida – koncept, beslut och byggt läge

Del 1 är konceptet (vad sidan ska vara). Del 2 är det som är byggt i koden per 13 nov 2026, med Figma-noder och designbeslut. Där de skiljer sig gäller Figma, sedan Del 2.

# DEL 1 – KONCEPT

## Grundidé
Unik första upplevelse utan att kännas som en designdemo. Varumärket bär sidan, men bokning och tydlig information offras aldrig för effekter. Mobil först (78 % av trafiken). Belägg hellre än påstå. Prisneutralt.

## Besökarlägen (en sida, en CSS, en JS; läge = uppsättning överstyrningar i `modes.js`, `data-mode` på `<html>`)
1. **Ny besökare hemifrån** (det som designas först): intro, varumärke, bevis, inspiration, bokning.
2. **Återkommande hemifrån:** ingen intro, mindre animation, bokningsraden högst upp (gärna förifylld), dagens status.
3. **Påbörjad bokning:** bokad vecka ersätter kalenderkortet, "nästa steg" i bokningsraden.
4. **På plats:** Just nu över Aktuellt, status och morgonrapport först, På plats-bokning (Skidskola, Skidhyra, Aktiviteter). Finns i både vinter och sommar.
- Läge väljs av webbläsarmarkering, wifi/säsong/tid som stöd; besökaren kan alltid byta själv (växel i huvudmenyn). Läge 1 är standard för sökmotorer. Bokningen göms aldrig helt.
- Väljare i demon: liten knapp nere till höger; `?mode=` och localStorage; `?demo=0` döljer.
- Risk: ordningsbytet (läge 4) flyttar fasta `top`-värden och topografins kopplingar. Positioner ska hänga på verkliga element, inte fasta `top`.
- Säsong är en egen växel (vinter/sommar); sommar är baslayout. Reglaget bor bara i menypanelen och påverkar hela sajten.

## Sidans ordning (läge 1, desktop)
1. **Intro** (se nedan). 2. **Steg II, stor film.** 3. **Steg III, slutkomposition** (scrollstyrd, scrubbad, ingen låst scroll): filmen krymper, två porträtt glider in, bokningsraden och solen dyker upp. 4. **Stor ingress** ("Tänndalen är renodlat skidåkning och fjäll på riktigt. Buret av hundra års genuint värdskap, med gott om plats i både pister och liftköer."). 5. **Aktuellt.** 6. **Just nu i dalen.** 7. **Varumärkessektionen "Lev. Andas. Tänndalen."** 8. **En dag i Tänndalen.** 9. Vad gör man här, Var bor man/Paket, Året om, Hitta hit (Hitta hit är pausad). Mobil: intro mindre, ingen krympning, filmen 4:5, bokningsraden fast i nederkant från steg II, ingen parallax.

## Intro (alltid beskriv sekvensen i prompter; den har tappats bort flera gånger)
1. Hela den vertikala loggan (symbolen över "Tänndalen", Natt på Dag) laddas, kort paus (svart start 300 ms, logotyp-fade 450 ms).
2. Symbolen växer med easing (inte lika mycket som i Cursors första bygge) och blir mask till videon. Ordet "Tänndalen" fadar ut DIREKT när tillväxten börjar.
3. När masken landat, kort paus, sedan skrivs "Älskat av skidåkare." (sommar: "Älskat av fjällvandrare.") ut bokstav för bokstav, ojämnt som en människa.
4. Vid scroll maskar masken som på Polestar (zoom in i en bestämd punkt i symbolens högra bergs vänstra ben) tills startsidans topp syns exakt som i hero-läget.
- Exakt samma video på exakt samma position hela tiden (hero-kortets video). Ingen separat intro-film, ingen full-bleed-fas, ingen krympning in i kortet.
- Ingen pausknapp i introt. "Hoppa över" är en riktig knapp med sidans Text button-utseende, centrerad nere, finns bara under introt och visas först efter övergången.
- Reduced motion: inget intro, slutläget direkt.

## Hero (steg III)
Header: Meny vänster, logga mitten, Fjällguiden och Boka höger (mobil: Fjällguiden ersätter Boka). Komposition: filmen störst, kvinnan uppe till höger (större), mannen till vänster (mindre, längre bak), solen överlappar filmens nedre högra hörn, bokningsraden centrerad över filmens nederkant. Manualens tre ord: Rörelse = filmen, Närhet = porträtten, Överblick = topografin och Storvigeln. Porträtten byter långsamt (12 s, förskjutet 6 s); riktiga TD-porträtt, kontrollera rättigheter. Parallax efter steg III: topografi 0.6, litet porträtt 0.85, film/bokning/ingress 1.0, stort porträtt 1.1, sol 1.15 (generell parallax som utgångsläge, lugn: `START_OFFSET` 100, `PHASE3_SPEED` 0,96). Pausknapp för all rörelse i heron (WCAG).

## Bokningsraden
Fem kategorier: Boende, Liftkort, Skidhyra (sommar: MTB), Skidskola, Paket. Full i heron, kompakt och fast i nederkant efter scroll (mobil: fast från start). Tryck på kategori → panel ovanför raden. **R360 är facit** för fält: A Period + personer (Boende, Paket), B Period eller en dag (Skidhyra, Skidskola, Aktiviteter; ingen kryssruta, tryck samma dag två gånger), C En dag (Liftkort, Spårkort). Gästväljare förval 2 vuxna. Kalendern visar inte tillgänglighet. Sök-knappen alltid CTA-färg, text per kategori ("Sök boende"), fungerar utan datum. Datumregel: veckodagar räknas från ISO-datum med `Intl.DateTimeFormat('sv-SE')`, aldrig hårdkodade.

## Övriga sektioner (kort)
- **En dag:** sex kort 07:45 Frukost med utsikt, 08:30 Först i liften (video), 10:15 Barnen drar iväg själva, 13:00 Våfflor i solgropen, 15:30 Sista åket (video), 17:00 Tillbaka i stugan. Max två videor, inte i följd. Riktiga TD-bilder i slutändan. Snap: läget "settle", aldrig bakåt mot passerat kort.
- **Var bor man:** ett område i taget, nästan helbredd bild, stabil fakta i bilden, förfiltrerad R360-länk, inga priser. **Paket:** prisneutralt, "fr. X kr".
- **Redaktörsblock (generella):** Text, Ingress, Citat, Bild, Bild och text, Galleri, Video, Faktaruta, Steg, Frågor och svar, Info, Kort, CTA, Fråga oss. Inga fria färger; samma block i TD och OG.
- **Allt om / Fjällguiden:** vektorsök, FAQ och LLM-kundtjänst som en gemensam tjänst, kontextmedveten, små ingångar i sidornas innehåll i stället för inbäddad chatt. Copy ska inte lova att en människa alltid finns.

## Just nu i dalen (regler)
Rubrik "Just nu i dalen", "Uppdaterat 09:42", växel Alpint | Längd (förval Alpint). Datastack: ett kort i taget, två värden som hör ihop, inga snitt, aldrig "Live", aldrig "0 cm" som hjälte; under 5 cm nysnö visas Snödjup. Alpint: Nysnö, Snödjup, Öppet, Nypreparerat (Vind bara vid storm). Längd: Spår, Valla. Rapport: senaste rapporten för valt läge, bara från idag, en ny ersätter den gamla; finns ingen visas en artikel. På gång (heter inte "Kalender"): I dag / Snart / Längre fram, max 7–8 rader, datumformat "28 apr–3 maj", inga veckonummer. Data: SLAO tre gånger/dag, manuell överstyrning, Axess för trängsel.

# DEL 2 – BYGGT LÄGE (handoff 13 nov 2026)

## 3. Designsystem (shared)

### Knappar – `components/button.css`
- `.td-button` 48 px, padding 12/32. `.td-button-md` 40 px, 8/24. `.td-button-sm` 32 px, 8/12.
- **Ikon-padding:** när en ikon står först *och följs av text* minskas padding på ikonsidan: Large 24, Medium 16, Small 8. Regeln: `:has(> :is(svg, .td-button-icon, .td-button-graphic):first-child + *)`.
  - Bugg rättad: första versionen träffade även ikon-only-knappar (karusellpilarna i Aktuellt hamnade snett).

### Typografi – `generated/typography-td.css`
- **Ny:** `.td-ui-figure-xl` – Superclarendon Bold, 6rem (96 px), line-height 1, letter-spacing −0.04em. Figma-stil "UI/figure-xl".
- **UI/caption = 13 px** (`--font-size-13`, line-height 1.385). Ändrat i `tokens.css`, `primitives.json` ("13": 13) och `typography-styles-tanndalen.json`. Figma-variabel `font/size/13`.
- `--font-size-40` (2.5rem) lades till lokalt i `startsida.css` för datakortens primärsiffra (saknades i genererade tokens).

### Färger/variabler (Figma ↔ kod)
- Skiljelinjer: vita kort `color/neutral-subtlest` (`--color-TD-neutral-subtlest` #E0DFDE); i Fjällguiden `color/neutral` på 30 %.
- Segmentväljarens spår (Alpint/Längd) i Just nu: `neutral-strong` (#4C4D4F). Alternativ `night` om det känns för ljust.
- Status grön: `--status-open`.
- **Saknas i systemet:** vallafärger (grön/blå/violett/röd/gul) – ligger som hex i `startsida.css` (`.td-valla-seg[data-tone=…]`). Violett faller i övrigt tillbaka på neutral i `just-nu-data.css`.
- Ingen husikon i ikonbiblioteket (pistkortets "Visa var jag bor" återanvänder kartnålen).

---

## 4. TD startsida – sektion för sektion

### 4.1 Intro (`intro.css/js`)
- Dag/natt inverterad: plåt och text i `--color-text-primary`, fyllnad i `--color-bg-base`.
- Sekvens: helt svart (`BLACK_MS = 300`) → snabb logotyp-fade (`LOGO_FADE_MS = 450`) → befintlig mask/text-övergång → **därefter** "Hoppa över" (klass `is-skip-ready` på `html`).

### 4.2 Toppmeny
- "Fråga oss"-knappen (`#fraga-launch`) heter nu **Fjällguiden**: symbol (två toppar + sol, 24 px), namn i Superclarendon **14 px**, AI-tagg, **blinkande grön live-prick** (`.fg-live`), ⌘K kvar. På smal skärm visas också "Fjällguiden".
- Symbolens ljusa kant (`.td-guide-mark-halo`) följer säsongsfärgen.

### 4.3 Aktuellt
- Ordning: "Jobba fjällifrån" först, "Sprakande nyår" andra.
- Karusellpilarna rättade efter knapp-padding-buggen.

### 4.4 En dag
- Sommar/vinter-växlaren dold (`.en-dag .en-dag-season { display:none !important }`) i både TD och OG.
- **På plats-läge:** sektionen flyttas till efter Fjällguiden-blocket (`#fragor`) via ett litet skript längst ner i `index.html` som kör när `data-mode="onsite"`.

### 4.5 Just nu (`#just-nu`)
Grid `.just-cols` (411 / 410 / 411, gap 24) + ny rad `.just-cols-3`.

**Datakort-stack (`.td-just-nu-stack`)**
- Klick på kort byter till nästa; pager-prickar; rotation var 5:e s (`just-nu-stack.js`).
- Inga hörnpilar (`.td-just-nu-stack-corner` dold).
- Alpint: Vind-kortet bortkommenterat – visas bara vid avvikelse (storm). Pager har en prick mindre.
- Längd: valla-datakortet borttaget (har nu eget kort, se nedan). JS-raderna som fyllde det är borttagna och ersatta med en kommentar.

**Fjällguiden-kortet (`#fraga-card.td-guide`)** – ersatte "Fråga oss"-kortet
- Säsongsfärgad platta, 411×262, padding 24/24/16/24 (mätt mot Figma 2592:16434).
- Topp (36 px): symbol 36 px, "Fjällguiden" Superclarendon 20 px, AI-tagg 26×22, gap 9. Status uppe till höger: grön prick + "Vi är här" (13 px fet) över "till **18.00**" (13 px), andra raden indragen till textens vänsterkant, radhöjd 15 px.
- Eyebrow "VANLIGA FRÅGOR PÅ PLATS" (y 91), frågerader från y 111, 45 px höga, ↗ 16 px på 40 % (100 % + rörelse vid hover, 70 % på touch).
- Kortet i sig går inte att öppna (ingen hörnpil); bara raderna öppnar modalen med sin egen fråga (bugg rättad – tidigare öppnades kortets gamla fråga).
- Alpint: "Vilka backar är bäst just nu?", "Var äter vi lunch i backen?", "Vad gör vi om det regnar?"
- Längd: "Vilka spår är nypreparerade?", "Vilken valla ska jag använda idag?", "Var kan vi fika vid spåret?"

**Pistförare / rapport (`a.td-rapport`)**
- Alpint: overlay slutar ovanför "FRÅN BACKEN I MORSE"; caption versal; citat 22 px (tre rader); avstånd 12 px; Medelsvår-chip och "Preparerad"-tagg vita. Ingen hörnpil.
- Längd: "Händer idag" – rubrik 20/26 px Superclarendon, 24 px in, centrerad mot pilen (exakt som Väder-rubriken). Hörnpil med hover-etikett **"Läs mer"**.

**På gång** – vitt kort, ingen hörnpil, radpilar → kvar.

**Webbkamera / Spårkarta (`.td-kamera`)**
- Alpint: webbkamera, etikett "Alla kameror".
- Längd (`.is-karta`): mörk spårkarta, **spårikonen** (langdspar.svg som mask, vit) i stället för kartnål, etikett "Öppna spårkartan". Text/pil ljusa (en felaktig regel som gjorde dem svarta är borttagen).

**Tredje raden `.just-cols-3` – bara i På plats-läget**
- *Alpint:* Pistkartor · Öppet nu · Väder
  - **Pistkartor:** illustration `assets/img/pistkarta.png` (exporterad från Figma), rubrik, hörnpil med "Se alla pistkartor", knappar "Visa var jag är" / "Visa var jag bor" (vita, kartnål).
  - **Öppet nu:** vitt kort, **klockikon** (`assets/icons/klocka.svg`, exporterad från Figma), hörnpil "Se alla öppettider". Rader: 09:00–16:00 Liftar, 09:00–15:30 Hamra Syd, 10:00–14:00 Toppstugan · lunch, 09:00–19:00 Hamra livs. Tid och namn på samma baslinje; listan mot botten (16 px), radhöjd som Fjällguiden.
  - **Väder · Hamrafjället:** utan kort, ingen hörnpil. "Nu", −6° i figure-xl, "Klart", "Känns som −11°", "Vind på toppen 12 m/s", "Sikt god", "Klart hela dagen. Blåsigast på toppen efter 14."
- *Längd:* Dagens vallatips · Öppet nu · Väder
  - **Dagens vallatips (`.td-valla`)** – vitt kort: valla-ikon + "Dagens vallatips", "Uppdaterat 21:20"; "SNÖN / Ny och finkornig" (Heading/xxs); hårdhetsskala med fem lika segment grön→blå→violett→röd→gul, aktiv (violett) 20 px hög i full färg, övriga 10 px på 40 %; "Hårt · kallt" / "Mjukt · varmt"; "FÄSTE Viola extra" och "GLID Violett paraffin" i två kolumner. **Ingen temperatur.**
  - **Öppet nu:** klockikon; Spårcentralen, Belysta spåret (till 21), Fikat vid Ladan, Skidhyran (platshållare).
  - **Väder · Vid spåret:** vind i spåret 4 m/s, "Klart och kallt, bra glid hela förmiddagen. Mjukare spår efter lunch."
- Allt innehåll i raden är hårdkodat, inte kopplat till data.

### 4.6 Varumärkessektion "Lev. Andas. Tänndalen." (`#td-brand`)
- 300vh runway (240vh mobil), sticky pin, progress-styrd.
- Tre bilder (`assets/img/brand/td-brand-1.png`, `-2.png`, `-3.jpg`) byter med clip-path-wipe (SWAPS 0.18/0.48, SWAP_LEN 0.22), ramfärg #A1B5BA → #BF6A15 → #1B4021.
- Symmetrisk färgram *utanför* bilden (`box-sizing: content-box`, `--brand-pad` 46 px) + halvbred svart ram (box-shadow i night). Ramen öppnar sig till full viewport vid p 0.72–0.88.
- "Lev." och "Andas." mitt på bilden, per-bokstav-stagger, parallax och Ken Burns.
- "Tänndalen." litet under, 40 px gap, glasknapp "Hitta ditt boende" (48 px, 16 px text, vit text), +24 px marginal.
- Halverad marginal mellan Just nu och blocket (80 px).
- Reduced motion-fallback finns.

### 4.7 Fjällguiden-blocket (FAQ, `#fragor` / `.td-fraga-block`)
- Säsongsfärgad platta (vinter/sommar), förgrund via `--contrast-on-season-*`.
- Överrubrik: Fjällguiden-symbol **60 px**, 6 px närmare texten, flyttad 4 px vänster för optisk centrering; "Fjällguiden" Superclarendon 24 px + AI-tagg + live-prick; **20 px** ner till rubriken.
- Rubrik "Vi svarar på dina frågor, stort som smått." och ingress oförändrade. Frågefält och listan "Vanliga frågor" oförändrade.

---

## 5. Fjällguidens svarsmodal (`#fraga-layer`)

### Datastruktur
`QA`-objektet i `index.html` (inuti frågerutans IIFE, före `const reduced = …`). Nyckel = exakt frågetext. Värde:
```js
{ answer: "…", sources: `Källor: <a href="#…">…</a>`, cards: [{ kicker, title, line, image? }], chips: ["följdfråga", …] }
```
- `ask()` och `skipAnswer()` slår upp `QA[fråga]`; `finish()` renderar källor, kort och följdfrågor.
- Följdfrågor renderas med `data-fraga-follow` och öppnar sitt eget svar.
- Kort utan `image`, eller vars bildfil saknas (`onerror`), visar en tom grå bildyta (`.is-empty`) – avsiktligt, så det syns var bild saknas.
- `window.fragaAnswerFor` (äldre konfig-svar för datakort, t.ex. "Dagens vallatips." från längdkort) finns kvar och har företräde.

### Alla frågor med svar (15)
Svaren förutsätter känt resesällskap: **två vuxna, barn 6 och 9 år, stuga i Hamra**. Namn i [hakparentes] är okända platshållare. Tider och fakta är påhittade.

| Fråga | Kort | Följdfrågor |
|---|---|---|
| Det regnar, vad kan vi göra idag? / Vad gör vi om det regnar? | Bad och bastu · Lekhallen · Klättervägg | Barn under 4 år? · Vädret i morgon? |
| Vilka backar är bäst just nu? | Headstråket · Barnbacken Hamra · [Hamraliften] | Lunch i backen? · När stänger barnbacken? |
| Var äter vi lunch i backen? | Toppstugan · [Restaurang vid liften] · Grillplatsen | Boka bord till fyra? · Glutenfritt? |
| Vilka spår är nypreparerade? | Belysta 5:an · [Fjällrundan] 10 km · Spårcentralen | Vilken valla? · Fika vid spåret? |
| Vilken valla ska jag använda idag? | Viola extra · Violett paraffin · [Vallaboden] | Burkvalla? · Nypreparerade spår? |
| Var kan vi fika vid spåret? | Fikat vid Ladan · [Raststugan] · Vindskyddet vid sjön | Tar de kort? · Toalett vid spåret? |
| Vad gör vi med barn under 4 år? | Lekhallen · Barnbassängen · Pulka i barnbacken | Regnfrågan |
| Hur blir vädret i morgon? | (inga kort) | Vilka backar är bäst? |
| När stänger barnbacken? | Barnbacken · Skidskolans drop-in | Lunch i backen? |
| Kan vi boka bord till fyra? | [Restaurang vid liften] · Toppstugan | Glutenfritt? |
| Var finns glutenfritt? | [Restaurang vid liften] · Toppstugan · [Livsbutiken] | Boka bord? |
| Hur lägger man burkvalla? | [Vallaboden] · Viola extra | Vilken valla? |
| Tar de kort? | Fikat vid Ladan · [Raststugan] | Fika vid spåret? |
| Finns det toalett vid spåret? | Spårcentralen · [Raststugan] | Nypreparerade spår? |

Inga döda ändar: följdfrågor pekar bara på frågor som har svar.

### Kort och följdfrågor – stil
- Kort är `<a class="fraga-card">`: day-bakgrund, bild 140 px, kicker versal i neutral, titel UI/title-sm, pil ↗→ på 40 %.
- Hover: kortet mörknar till neutral-subtlest, bilden skalar 1.04, pilen full + 3 px.
- Följdfrågor (pills): hover = night-bakgrund, vit text (som tertiärknapp).

### Bilder (genererade i Figma, `gpt-image-2.5-flare`, 1536×1024)
Prompt-stil: dokumentärt, Härjedalen, naturligt lågt vinterljus, dämpade nordiska toner, lätt filmkorn, inga logotyper/text.
Figma-ramar (namngivna, JPG-export 1× utan suffix) på sidan Concept, 3×3-rutnät från x 10621, y −14278:

| Fil (`td/desktop/assets/img/`) | Figma-nod |
|---|---|
| `fraga-barnbacke.jpg` | 2683:2898 |
| `fraga-lift.jpg` | 2683:2899 |
| `fraga-restaurang.jpg` | 2683:2900 |
| `fraga-grillplats.jpg` | 2683:2901 |
| `fraga-sparcentral.jpg` | 2683:2902 |
| `fraga-vallabod.jpg` | 2683:2903 |
| `fraga-raststuga.jpg` | 2683:2904 |
| `fraga-vindskydd.jpg` | 2683:2905 |
| `fraga-lekhall.jpg` | 2683:2906 |

Alla nio ligger nu i repot (commit `e412400`). Kort utan bild: Skidskolans drop-in, Viola extra, Violett paraffin, [Livsbutiken], Hur blir vädret i morgon (inga kort).
Återanvända befintliga bilder: `fraga-bastu.jpg`, `fraga-klatter.jpg`, `endag-1300.jpg` (våfflor/Toppstugan), `langd.jpg`, `rapport-raw-1.png`.

---

## 6. OG (Orsa Grönklitt)
- Hero- och booking-stagger klar.
- Sommar/vinter-växlaren i En dag dold (`og-startsida.css`, `hero-page/og-overrides.css`).
- Nya SVG-logotyper (vertikal svart/vit), kurbits, ljusa sol-ikoner, uppdaterade ikoner, `hero-page/td-booking.css`.
- Ingen OG-motsvarighet till Fjällguiden, vallakort eller 13 px caption är gjord.

---

## 7. Figma – status

| Nod | Vad |
|---|---|
| 2449:16389 | "Just nu · sektion (demo)" – hela gridet |
| 2592:16434 | Fjällguiden-kortet (Just nu / Fråga) |
| 2625:2291 | Fjällguiden / mark (toppar) – symbolen |
| 2626:2291 | AI-tagg |
| 2658:2314 | Status (personal): "Vi är här" 13 px Bold, "till 18.00" 13 px Book, radhöjd 15, indragen rad |
| 2449:16322 | Pistkarta-kortet |
| 2449:16321 | Öppet nu |
| 2650:17124 | Väder · mot bakgrund |
| 1996:18298 | På gång |
| 1150:2365 | Segmented control (main) |

- Text-stil "UI/figure-xl" och variabel `font/size/13` finns.
- **Valla-skisstavlan** ("Valla / skiss (Längd)", 2672:2313, varianter A–G) fanns inte längre i filen vid senaste kontroll – troligen raderad.
  - Vald riktning (byggd i kod): vitt kort, hårdhetsskala som linje, snötyp, fäste/glid, utan temperatur.
  - Förkastade: lila burk-cirklar (för mycket lila), mörkt kort, utan kort, snötypsfärgad bakgrund (D/E), klister i skalan, ring/cirkelmätare (G).
- Design-artifact "Valla – visualiseringar av fäste": https://claude.ai/artifact/VmyzgKZctgb2m3m5zAsp7M (sex skissade visualiseringar; skalan valdes).

---

## 8. Designbeslut att hålla fast vid
1. **Pilar:** ↗ = öppnar ovanpå (modal/fullskärm), → = går till annan sida. Hörnpilar full opacitet; radpilar 16 px, 40 % i vila, hela + 2–3 px rörelse vid hover; 70 % på touch.
2. **Hover-etiketter** vid hörnpilar (dolda i vila, syns vid hover).
3. **Fjällguiden** går inte att öppna som kort – bara frågeraderna. Ingen hörnpil.
4. **Eyebrow i Fjällguiden är state-baserad** (avvikelser → tid på dygnet → resefas). Nu: "Vanliga frågor på plats".
5. **Vind-kortet** bara vid avvikelse.
6. **Max tre vita kort** i en vy är målet (problem kvarstår i Längd, se nedan).
7. **Vallakortet:** inga temperaturer (förväxlas med Väder, olika plats/tid), inget klister i skalan, ingen cirkel/fästemätare.
8. **Faktakoll valla:**
   - En "fästemätare" saknar mätbar grund (fäste beror på skida, teknik, tjocklek); experter är oense i just nysnö/fuktig finkornig snö (LTU-studie).
   - Hårdhetsskalan stämmer i princip (kallt/hårt → varmt/mjukt; Swix VR-serien blå → violett → rött). Kallaste är grön.
   - Klister är en egen produkttyp.
   - Färgkoderna är inte en formell standard.
   - Tumregel: i gammal snö vallar man mjukare.

## 9. Teknisk not om `startsida.css`
Många av chattens ändringar ligger som tillägg i slutet av `td/desktop/startsida.css`, i kronologisk ordning med kommentarsrubriker (t.ex. "Just nu-kort enligt Figma", "Fjällguiden-kort", "Tredje raden", "Dagens vallatips", "Fjällguiden-looken på Fråga oss", "Live-plopp"). Vissa senare block överstyr tidigare – vid städning bör de slås ihop och flyttas till rätt komponentfiler i `shared/design-system/components/`.
