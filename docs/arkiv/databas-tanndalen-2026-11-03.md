# Tänndalen & Orsa Grönklitt — artikel från personliga databasen (senast 2026-11-03)

> Flyttad från artefaktdatabasen (`context/tanndalen`) 2026-11-20 när KAN-kontext flyttades ut ur den privata databasen. Bara avsnitt som inte redan finns i `docs/` är återgivna ordagrant här; övrigt (designsystem, Frågerutan-konceptet, offert) finns i nyare form i `docs/projektkontext.md`, `docs/designsystem-td.md` och `docs/fragerutan.md`. Äldre än `docs/status.md`.

## Projekt: Offert — UX-förundersökning & ny sajt
Kvalitativ förundersökning: moderated usability test, mobilspecifikt, på plats. 5 deltagare (bokat skidresa senaste 12 mån), kunden rekryterar. Förberedande frågeformulär (~5 min). Think-aloud, tasks baserade på R360-flödet. Leverans: rapport med konverteringshinder (sajt vs R360-gränszon). Uppskattad tid ~30h.
Behovskartläggning organiserad kring: Erbjudande & produkter, Om oss, Employer branding, Siteramverk (sök, sidhuvud/footer, språkstruktur, cookie consent).

## Varumärkesanalys
Tänndalen: starkt differentierat mot skidåkare, kommunikationsplattform genomarbetad men awareness-problem. Namnkonsolidering rekommenderas (ersätt "Hamrafjället" med Tänndalen överallt).
Orsa Grönklitt: bredare men tunnare profil, björnparken kapar uppmärksamhet från skidanläggningen. Tänndalen bör INTE röra sig mot Orsas bredare modell.

## Claude Design-artefakter (3 nov 2026)
- Designsystemartefakten (claude.ai/artifact/SMVymxJKEPUfsqpYYxiKUS) ligger efter Figma: bara 19 ikoner (saknar Icons / Content inkl. Fråga oss), saknar Kbd, Button / Account och karusellkontrollen, ingen responsiv typografi, Secondary heter fortfarande fill: cta. Uppdateras först när en riktning ska in i Figma.
- Frågerutan-prototypen: Design-projekt i claude.ai (artifact Jk1JowGu13sG3PL4dapbM4). Steg 1 klart 3 nov: sidan "Frågerutan wireframes" med sex tillstånd, desktop och mobil, reglaget Läge styr ordningen på förslagsgrupperna (Just nu, Inför resan, Din bokning, Senast frågat i läge 2). Öppen fråga: "Senast frågat" kräver sparad frågehistorik per gäst.

## Startsidan v2 — lokal demo (okt 2026)
Arbetssätt då: Figma är facit, Cursor bygger lokalt demo (127.0.0.1:8000/demos/startsida-v2.html?visit=returning). Intern presentation 2 nov.

**En dag:** korten rör sig kontinuerligt utan vilofas, med lång lucka mellan korten (nästa kort startar ca 340 px under nederkant). Främre kort 628×770 top 238, bakre läge top 166 och scale 0,882 (554×680), rubriken ligger över korten. Texter ligger fast i viewporten, tonar in, hålls och tonar ut innan nästa kort syns. Sista kortet (17:00) tonar ut tidigt, näst sista tonar ut snabbare, videor pausas när utfadningen börjar, och Hitta hit ska överlappa så att kartan syns under utfadningen.

**Hitta hit (nu pausad):** låst stegscroll var standard. Experiment `&hitta=pan`: sticky kartlager där kameran följer resepricken Stockholm → Orsa → Tänndalen. Rubrikblock och faktakort sticky hela resan, stadsnamn alltid synliga, statusruta tonar ut, ingen blur på kartan. Kartbild, rutt och prickar skalas tillsammans, etiketter motskalas. Inget beslut om variant.

**Boendeområden (koncept):** fullbleed-bild per område (ev. lugn, klippfri videoglidning, pausas utanför bild, pausknapp), huvudtextruta med områdesnamn i eyebrow, datakort och gästcitat. Figma: Concept → "Skiss · Boendeområden (desktop)" (nod 1971:16145), v2-ram nod 1982:16118. Datakortet blev mörk glasyta (natt ca 40 %), sedan 3×2 utan pil: närmaste lift, boyta (intervall, räknas ur R360), sovrum, boende, passar för, bastu. CTA i textblocket är Secondary ("Se boenden i Fjällöga") plus Link "Se alla boenden" — inte Primary, eftersom headerns orange Boka är enda Primary i vyn. Idéer: bakgrunden som karusell (video, text, kort), bokningsbaren alltid tillgänglig (område som fält i sökrutan; på mobil orange sticky Boka), features per område, boendebilder/kollage. Öppet: vilka områden, om R360 kan filtrera på område via URL, bildregel för redaktörer (luft upptill, fokuspunkt för mobil).

**Karusellkontroll:** glaskontroll inspirerad av Apples galleri (prickpill + rund spela/pausa-knapp). Play/pause styr både video och bildspel, videons tid driver aktiv pricks förlopp, slidet byter när videon är slut, Spela om efter sista. Pausa vid hover/fokus, starta pausat vid prefers-reduced-motion. Inga sidopilar. Figma: sektionen Karusell (Karusell / Kontroll, Karusell / Prick, Icon / Play, Pause, Replay).

**Ikoner (28 okt 2026):** Icons / Content är enda sanningen för innehålls- och kategoriikoner. 34 ikoner omexporterade med fyllda former (zip `ikoner-just-nu-i-dalen-fill`), importerade som varianter (Name × Size 24/32/48 × Context Light/Dark), linje bunden till text-primary/text-inverted och accent till color/accent. 14 nya: Barnområde, Barnområde 2, Fråga oss, Fråga oss 2, Längdspår, Liftar reserv, Mikrofon, Nysparat, Öppen, Stängd, Solnedgång, Soluppgång, Temperatur 2, Vind och storm. Gamla Spår, Leder, Storm, Hjälp och Chatt fanns kvar tills John bestämt. Valla-ikonen i zipen visade en pulka (namnen behövde ses över). Booking / Category bar och Booking / Bar flyttades från raderade Icons / Category till Icons / Content.

**Prestanda (29 okt, John bad om påminnelse):** "sjukt lagg" efter Hitta hit-ändringarna. Misstänkta orsaker att mäta: backdrop-filter på faktakort/statusrutor ovanpå rörlig karta, stor SVG-karta (2329 × 2220) som transformeras varje frame, mask på ruttlagret, scroll-lyssnare som läser layout, will-change/GPU-lager. Mät bildfrekvens i Hitta hit och En dag, stäng av ett lager i taget.
