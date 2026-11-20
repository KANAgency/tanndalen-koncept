# Tänndalen & Orsa Grönklitt – projektkontext

*Läget 20 nov 2026. Sammanställt ur projektminnet och projektfilerna. Vid motsägelse gäller (högst först): Figma (för design) → senaste överlämning → `startsida-overlamning_*` → `startsida-koncept_*`, bakgrundslager, frågerutan → `workshop_*` (16–17 sep) → `projekt_*` (21 sep).*

---

## 1. Uppdraget

- KAN bygger ny webbplattform för **Tänndalen (TD)** och **Orsa Grönklitt (OG)**. John gör UX, produktdesign och designsystem.
- Avsändare Tänndalens Fjällanläggning AB; båda drivs via Velit Activities AB. Relationen till Grönklittsgruppen är oklar.
- **CMS:** Umbraco (beslutat, behålls). **Bokning:** R360, hybrid – egna sajten presenterar och inspirerar, R360 tar transaktionen.
- Gemensam stack idag: Umbraco, GTM, Apsis, Mynewsdesk, Imbox (kundtjänst). Sajterna från ~2022.
- 73–78 % av affären går via webben. Kundresa: Planera → Boka → På plats → Efter vistelse.
- Kundens prioritet: 1 enklare boka, 2 tydligare guidning, 3 mobil, 4 kortare väg från inspiration till köp.
- Språk: svenska + engelska, automatiserad översättning. Norska för TD är öppen fråga.

## 2. Konceptmål (kundversion, 2 nov 2026)

Formulerade som mål, inte lösningar.

1. **Varumärkes- och upplevelsedrivna sajter på gemensam grund** – sticker ut mot Skistar; samma UX och grundkod, varumärkesvariant ovanpå.
2. **Optimera konvertering och förenkla R360-upplevelsen** – särskilt mobil; storytelling som slutar i en förfiltrerad väg in i R360.
3. **Personalisering och guidning** – spara val (grupp, datum); hämta gästens R360-bokning och låt den styra innehåll, filter och nästa steg.
4. **Säsong som grundprincip** – sommar och vinter är olika erbjudanden med eget innehåll, egna CTA:er och viss varumärkesanpassning.
5. **Smartare sök, frågor och kundtjänst ("Allt om")** – där gästen behöver det under planering, bokning och på plats.
6. **Strömlinjeformad IA och navigation** – 5–7 huvudområden, högst en nivå undersidor, platt men inte brett.

## 3. Varumärken och positionering

**TD – "Quirky uppstickaren"**
- Grym alpin upplevelse utan allt folk. Cool med självdistans. Exklusiv och modern.
- Payoff: **"Älskat av skidåkare."** (kommunikationsplattform 2024). Konkurrerande koncept: "Fjälltagen" (live) och "Lev. Andas. Tänndalen."
- "Utan allt folk" ska beläggas med data (liftar, nedfarter, liftkö). Ingen humor på andras bekostnad.
- Ton: skidåkare till skidåkare, öppen, varm, humor utan trams.
- Primär målgrupp: familjer med barn 7–14 som vill ha äventyr; sekundär: unga vuxna utan barn.
- Utmaningar: låg kännedom, långt bort (7 h från Stockholm), många säger "Hamra".

**OG – "Byn där familjen är närvarande"** (förslag, ej kundbeslutat)
- "Familjeresmålet bara 4h från Stockholm. Upplev riktig natur, var med dina barn." (positioneringen är ofullständig i källan.)
- TD:s DNA är geografiskt, OG:s kulturellt (Dala-arv, kurbits, by). Exklusiv men traditionell.
- Tonskifte: från rabatt/urgency till närvaro och prisvärd guldkant.
- Längdskidor som trovärdighetsbevis; sommar som obesatt möjlighet.
- Varumärkena ska inte konvergera digitalt. OG tätare spacing, TD luftigare.

## 4. Data och målgrupper

- **KPI (1/9–23/4):** konvertering TD 1,4 %, OG 2,7 % (olika definitioner). TD mobil ~78 % av trafiken men 0,83 % konvertering mot 2,39 % desktop – nästan 3x gap, styr UX-prioritet #1.
- **Mosaic:** TD 51 % adaptiva familjer med köpkraft, 20 % äldre par i villa, 14 % citysinglar. OG 51 % köpstarka familjer 36–55.
- **Kantar (jan 2026):** 67–74 % har ingen uppfattning – kännedomsproblem, inte produktproblem. Consideration ~24–25 % mot Sälen 54 %, Åre 46 %.
- **JTBD-personas:** Familjen, Stamgästen, Spontanresenären, Stugägaren, Konferensbokaren, Tomtspekulanten + internt Bokningspersonal, Redaktör.
- Gästtaxonomi: TD Vuxen/Ungdom/Barn/Barn yngre, OG Vuxen/Barn – konfigurerbar per anläggning.

## 5. Bokning och R360

- Djuplänk via hash `#search/{slug}-{id}`. ID-rymden är per tenant – mappas i config, aldrig hårdkodat.
- **Viktigaste tekniska frågan:** vilka parametrar utöver kategori-ID R360 tar emot (datum, gäster, objekt, kampanjkod).
- Fragmentering: OG har `shop.orsagronklitt.se` (Trailpass); TD har `tdidag.com` (näst mest besökta sidan). Inloggning inkonsekvent.
- Benchmark: sticky bokningsbar, pristeaser, mobil datumväljare, Swish/Klarna/Apple Pay/Google Pay, för-ankomstmejl med tillägg.
- Personalisering: Umbraco Engage troligen för säsong och På plats; R360-bokning hämtas, sparas i kundprofil/cookie och styr förutbestämda delar av sajten.

## 6. Innehållsarkitektur

- OG har 90+ sidor. Förslag 15–20 sektionssidor + datalager. Färre redaktörssidor, inte färre URL:er.
- Datatyper: Aktivitet, Evenemang (har tidpunkt), Boende, Mat, Plats (har status), Erbjudande, ev. Karaktär.
- Aktivitetshubb med kort och filter; detaljvy som bottom sheet med egen URL.
- Kunden vill ha en gemensam statuslösning: komprimerad vy på startsida/header och en detaljerad På plats-sida ("Tänndalen idag").

## 7. Designsystem

**Princip:** Figma är källan. Repo `02_KAN/tanndalen-orsa/src/design-system` speglar Figma → tokens. Tokens: `primitives.json` → `{varumärke}.semantic.json`. Bortvalt: Storybook, Code Connect.

**TD**
- Typsnitt: **Superclarendon** (rubriker/ingresser, bara Regular och Bold, ingen Italic) + **CircularXX TT** (brödtext/UI). Gambetta/Switzer övergivna. Desktoplicens finns, webblicens ska köpas.
- Färg: Natt #24272A, Dag #EBE8E5, Snö #FFFFFF, Accent #BF6A15, CTA #AE6113. Säsong: Vår #F6E0A2, Sommar #1B4021, Höst #3C1F17, Vinter #A1B5BA. Neutral ändrad till #686868 (4,5:1 mot Dag).
- Inga Light/Dark-lägen i semantiken; mörka varianter är egna variabler med `-dark`, komponenter har `Context=Light/Dark`.
- 22 textstilar (Editorial och UI). `UI/body` borttagen → `Editorial/body-sm`.
- Spacing 4/8/12/16/24/32/40/56/64/88/112/144. Grid desktop 1440 (margin 80), mobil 393.
- Klart: färg, typografi, spacing, radier, storlekar, motion, elevation, knappar, länkar, formulär, paginering, ikoner, chips, avatar, status m.m.
- Ikoner: alla bygger på Icons / Content eller Icons / Utility (Phosphor Bold, 20 och 28 px). Valla = `valla-e`.
- Aktuellt / Kort: plattor Vinter, Vår, Sommar, Höst, Glas ljus, Glas mörk; Typ Fråga eller Innehåll; bara Primary/Secondary.
- Figma-fil: `HW7ZST3CotlOepEcjNI5LC` (Concept, Inspiration, Foundations & Components, Blocks, Old). Sidan ordnas Foundations → Atomer → Molekyler → Moduler → Mallar & demo.

**OG**
- Literata + Radio Canada Big. The Bartender avfört.
- Off-white #F5EEE5, mörkgrön #003E3A, orsa svart #3C3C3B, signal #E74011. Förslag: CTA mörkgrön (orange klarar inte vit text) – väntar på kund-OK.
- Gamla OG-Figmafilen är inaktuell. OG:s visuella design tas fram iterativt i kod; Figma behöver bara grunderna.

## 8. TD startsida

**Besökarlägen:** ny besökare (designas först), återkommande, har bokat/påbörjat bokning, på plats. På plats finns både vinter och sommar, aktiveras helst automatiskt men kan väljas i huvudmenyn.

**Intro (följ exakt):**
1. Hela vertikala loggan (Natt på Dag), kort paus.
2. Symbolen växer snabbt med easing (måttligt) och blir mask till videon; "Tänndalen" fadar ut direkt.
3. Kort paus, sedan skrivs "Älskat av skidåkare." / sommar "Älskat av fjällvandrare." ut ojämnt, bokstav för bokstav.
4. Vid scroll zoomar masken (Polestar 5-principen) in i en punkt i högra bergets vänstra ben tills hero syns.
- Samma video på samma position hela tiden. Ingen play/paus. "Hoppa över" som Text button, centrerad nere, bara under introt.

**Hero och sektioner:** header med logga, menypill och Boka; bokningswidget framme (Boende, Liftkort, Skidhyra/MTB på sommaren, Skidskola, Paket), sticky i botten på mobil. Bakgrundslager med topografi (Storvigeln, Hamrafjället) och lätt parallax. Sektioner: Just nu (status), Aktuellt (kort med färgplattor, en Boka-knapp per kort), En dag (mjuk "settle"-snap, aldrig bakåt) med Säsongsbanner under, boendeområden (ett i taget, film i 4:3, förfiltrerad R360-länk, inga priser), paket, frågeblock med stor centrerad frågeruta, redaktörsblock, footer.
- På plats-läget: rad med tre kort under Just nu – Öppet nu, Pistkarta, Boka idag; säkerhet som etikettrad.
- Hitta hit-kartan är **pausad** (idéer sparade).

## 9. "Allt om" (Frågerutan)

- En gemensam tjänst för FAQ, sök och AI-kundtjänst, ersätter Imbox-upplägget. Teknik ej bestämd.
- En kontextmedveten spotlight/command palette med två lägen: sök (föreslagna frågor) och samtal (följdfrågor). Små ingångar i sidornas innehåll, ingen inbäddad chatt.
- Svar = komposition: rubrik, kort svar, källor, kort ur datalagret, följdfrågor.
- Formuleringsskala: villkor och FAQ ordagrant; pris/status/livedata som strukturerad data, aldrig genererad text; förklaringar genererade med källor.
- Copy lovar inte att en människa alltid finns och säger inte "ett kort svar". Ikon: två pratbubblor med frågetecken. Produktnamnet är öppet.

## 10. Prototyp och arbetsflöde

- Kundprototypen visar TD och OG: olika varumärken och content, samma UX och grundkod. **OG-prototypen (0 %) prioriteras** före det som återstår för TD (mobil, tweaks, lägen). Det som fungerar i TD får inte gå sönder.
- OG återanvänder nästan alla TD-moduler med egen styling; eget intro, ingen parallax/doodles, större fullbleed-ytor; egen kartmodul (platshållare). Traditionella redaktörsblock behövs för båda.
- Demo lokalt (`src/testing`, `src/design-system` som syskon). Övergång till **Claude Code** med `CLAUDE.md` och `docs/` i repo-roten `src/`.

**Arbetsregler**
- Inga git-steg i prompter; backup som `.bak`.
- Alla ändringar gäller huvudlösningen på vanliga demo-URL:en; testvarianter mergas in.
- Prompter till andra agenter: kompletta, i ett stycke, i kodblock. Cursor-prompter på engelska.
- Mät, gissa inte. Dubbelkolla agentrapporter.
- I Figma: använd befintliga komponenter bokstavligen, länka alltid till det som byggts.
- Varna när chattens kontext blir stor och erbjud överlämning enligt `claude_tanndalen-chatt-sammanfattning.md`.

## 11. Öppna frågor

1. **R360-parametrar** utöver kategori-ID – viktigaste tekniska frågan.
2. Gällande TD-koncept: Fjälltagen eller Älskat av skidåkare.
3. OG:s CTA-färg (mörkgrön).
4. OG: familj eller längdåkare med stora plånböcker; hur mycket urgency som överlever.
5. Velit ↔ Grönklittsgruppen (två sajter eller multi-tenant).
6. `tdidag.com` och `shop.orsagronklitt.se` – hämta hem/konsolidera.
7. API för liftdata (bevis för "utan allt folk").
8. Konverteringsdefinitioner och skipass-mätluckan.
9. Norska för TD; partnervarumärken (CUPRA, Forza Orza/FIM).
10. Min profil/bokningsinfo – lokal version av R360-kontot, ej definierad.
11. Namn på Frågerutan; var etiketten "På plats" ska sitta.
12. **Data att verifiera:** 1 561 m tillhör Storviglen i Norge, inte Tänndalen – kontrollera hero-topografins faktarad. Även Hamrafjället 1 137 m / 295 m fallhöjd, antal pister (54 eller 57), restider. Wille Jonasson är marknadsansvarig och lavintekniker, inte pistförare.
