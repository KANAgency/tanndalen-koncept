# Projektkontext – TD/OG

Bakgrund för design- och kodarbete. Källor: projektsammanställning 21 sep 2026, workshop 16–17 sep, kommunikationsplattform TD 2024, OG-konceptriktning, Johns konceptmål (2 nov). Siffror är klientens egna om inget annat anges.

## 1. Varumärkesförflyttning (överordnad ram)
**Tänndalen:** "Quirky uppstickaren. Grym alpin upplevelse utan allt folk. Cool men med självdistans." Nyckelord: uppstickare, självdistans, alpin kvalitet, frånvaro av trängsel. "Utan allt folk" är ett påstående som ska beläggas (liftkö, piststatistik). Kommunikativ idé (2024): "en levande dalgång, där skidåkningen står i centrum, och där tusen hemligheter väntar på att upptäckas". Payoff: "Älskat av skidåkare." Visionsmål: barn 7–14 ska känna sig som de viktigaste gästerna.

**Orsa Grönklitt:** "Familjeresmålet bara 4h från Stockholm. Upplev riktig natur, var med dina barn." (OG-positioneringens sista mening är ofullständig i underlaget.) Byn där familjen är närvarande. TD:s DNA är geografiskt (fjäll, vidd), OG:s kulturellt (Dala-arvet, kurbits, "vår by"). OG = exklusiv men traditionell, TD = exklusiv och modern.

**Gemensamt:** Varumärkena ska inte konvergera digitalt. Kantar bekräftar differentieringen: OG starkare på längd, spår, förtroende; TD på utförsåkning och backar. Därför brand-differentierad spacing: OG tätare och varmare, TD luftigare.

## 2. Affär och KPI
- Besök helår (1/9–23/4): TD 794 638, OG 749 469. Konvertering helsajt: TD 1,4 % (exkl. skidhyra/skipass), OG 2,7 % (inkl. spårkort/skipass grupp).
- **Mobil ~78 % av trafiken, konverterar 0,83 %; desktop ~20 %, 2,39 %** (TD). Nästan 3x skillnad. Mobilfriktionen i R360-sömmen är UX-prioritet #1.
- Klientens prioritering: 1) enklare att boka, 2) tydligare guidning, 3) bättre mobil, 4) kortare väg inspiration → köp.
- Konvertering logi i R360 per säsong 54 % (2021/22) → TD 77,7 % / OG 73,7 % (2025/26). Annan mätdefinition än helsajtssiffrorna: blanda aldrig utan att flagga.
- Skipass-bokningar ligger delvis utanför spårning.

## 3. Målgrupper
- **Mosaic (feb 2022):** OG: köpstarka familjer 51 %, högutbildade citysinglar 17 %. TD: adaptiva familjer 51 %, äldre par i villa 20 % (ingen persona), citysinglar 14 %. TD-besökare kör i snitt 7 h, OG 4,5 h.
- **Kantar (jan 2026, n=1 186):** 67–74 % av svenskarna har ingen uppfattning om TD/OG: ett kännedomsproblem, inte ett produktproblem. Besökare är mycket mer positiva. Förstahandspreferens TD 3 %, OG 5 % (Sälen 26 %, Åre 21 %). Sommar är en obesatt möjlighet (consideration 12–15 %, men 35–42 % bland egna vinterbesökare). Attributdata har låga urval (n=16–19): flagga alltid urvalsstorlek.
- **JTBD-personas:** 1 Familjen, 2 Stamgästen, 3 Spontanresenären (drabbas hårdast av mobilgapet), 4 Stugägaren, 5 Konferensbokaren, 6 Tomtspekulanten, 7 Bokningspersonal, 8 Redaktör. Workshopens målgruppslista: familj, stamgäst, förstagångsgäst, spontanresenär, äldre par, lokalbefolkning/stugägare, konferensbokare, tränings-/klubbgrupper, redaktörer, sommar-/dagsgäster; "skidåkare" delas i längd/alpint.
- TD primär: familjer med barn 7–14 som vill ha äventyr. Sekundär: unga vuxna utan barn. OG: persona 1 bär sajten; längdskidor som trovärdighetsbevis.

## 4. Teknisk verklighet
- **Stack:** Umbraco behålls, helt ny lösning, .NET 8 → .NET 10. Hosting Umbraco Cloud. KAN rekommenderar att kunden äger sin Azure-prenumeration. Övriga system: Apsis, ImBox (ersätts av egen "Allt om"-lösning), Netigate, Mynewsdesk, Umbraco Forms, Cookiebot, Power BI, Axess, Teamtailor, SmartSign, Compusoft. Consent Mode 2, GTM.
- **R360 (bokning):** djuplänkning via hash `#search/{slug}-{id}`. **ID-rymden är per-tenant** (1007 = Boende på TD men Längdskidåkning på OG): mappa i konfiguration, hårdkoda aldrig i delad komponent. Öppet: vilka parametrar utöver kategori-ID (datum, gäster, objekt, kampanjkod, en dag) går att skicka? Den viktigaste tekniska frågan.
- **Fragmentering:** TD har `tdidag.com` (näst mest besökta sidan), `tanndalen.contact`, `tanndalen.teamtailor.com`. OG har separat checkout `shop.orsagronklitt.se` (Trailpass). Inloggning inkonsekvent mellan sajterna.
- **Gästtaxonomi är per anläggning:** TD Vuxen 18+ / Ungdom 13–17 / Barn 4–12 / Barn 0–3; OG Vuxen / Barn. Gästväljaren måste vara konfigurerbar.
- **Språk:** svenska + engelska, automatiserad översättning. Norska för TD är öppen fråga.
- **Statusdata:** SLAO ~3 gånger/dag, manuell överstyrning, Axess för trängsel. API för liftdata är en öppen fråga.

## 5. Konceptmål (Johns kundformulering, 2 nov 2026)
1. Varumärkes- och upplevelsedrivna sajter på gemensam grund (sticker ut mot Skistar). 2. Optimera konvertering och förenkla R360-upplevelsen, särskilt mobil; storytelling som väg in i R360 med rätt förfiltrering. 3. Personalisering och guidning (sparade val, R360-bokningen styr innehåll). 4. Säsong som grundprincip: sommar och vinter är olika erbjudanden med eget innehåll och egna CTA:er. 5. Smartare sök, frågor och kundtjänst ("Allt om"): där gästen behöver det under planering, bokning och på plats. 6. Strömlinjeformad IA: 5–7 huvudområden, högst en nivå undersidor, aktiviteter renderade från data.

## 6. Manualer och manual vs live
- OG-manualen (jan 2025) är affärsmässigt skarpare, TD-manualen (feb 2026, v1.0) hantverksmässigt djupare. Korsbefrukta.
- OG:s färgtabell har fel funktionsbeskrivning på Vit och Svart (kopierade från fel rader).
- TD live kör Clarendon URW; manualen anger Superclarendon + Circular. **Beslut: manualen gäller** (Superclarendon + CircularXX TT, bekräftat av kund).
- Tre konkurrerande TD-koncept: "Fjälltagen" (live, ej i manualen), "Älskat av skidåkare" (manualen, används i introt), "Lev. Andas. Tänndalen." (båda; används i varumärkessektionen). Formellt beslut saknas.
- TD har "Sweden's Best Ski Resort 2025" (World Ski Awards): belagt, får användas trots superlativförbudet.
- Partnervarumärken (TD: CUPRA; OG: Forza Orza/FIM) är ohanterade i båda manualerna.

## 7. Öppna frågor (aktuella, nov 2026)
1. Relation Velit Activities AB ↔ Grönklittsgruppen (en plattform för två sajter eller multi-tenant?).
2. Vilket TD-koncept gäller formellt (se ovan)?
3. Norska för TD? Kan `tdidag.com` hämtas hem? Kan `shop.orsagronklitt.se` konsolideras in i R360?
4. **R360-parametrar** utöver kategori-ID, och API för liftdata.
5. OG: CTA-färg (mörkgrön), familj vs längdåkande citysinglar som prioritet, hur mycket urgency som överlever.
6. Portföljroller OG/TD och korsförsäljningsasymmetri (ingen portföljarkitektur finns).
7. Verifiera mot Tänndalen: Hamrafjället 1 137 m / 295 m, väderstation "på toppen", webbkamera "Storvigeln", pistnamn "Headstråket", antal pister (54 mot 57), footerlänkar, platshållartider.
8. Vem skriver morgonrapporten, från vilken enhet? Rättigheter till porträtt och doodles.
9. Vilken definition ligger bakom de två konverteringsmätningarna? Finns TD:s topografi som redigerbar vektor per fjäll och OG:s pictogram som SVG?
10. Hur hanteras personalisering och "På plats"-detektion (wifi säkrast; ingen platsbegäran på startsidan)?

## 8. Beslut från workshop och projekt
Svenska + engelska; R360-hybrid med informationslager ovanpå; lättviktig kontext före inloggning; tredjepartslösning för tillgänglighet; genuina lokala influencersamarbeten; Umbraco och evenemangskalendern behålls; färre undersidor och portalsida för aktiviteter; sök över boende, innehåll och FAQ; visuell piststatus med manuell överstyrning.
