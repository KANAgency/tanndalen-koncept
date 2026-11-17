# TD mobil – triage (nybesökarläget)

Genomgång 2026-11-17, `/td/?mode=new`, 393×852 i appens webbläsarpanel (inte riktig iPhone). Lägesväljaren ingår inte i första omgången.

**Klassning**
- **A, konvertera:** fungerar redan eller kräver bara reflow och avstånd.
- **B, förenkla:** samma innehåll i ett annat mönster, utan nytt designbeslut av vikt.
- **C, tänk om:** kräver designbeslut av John innan bygget.

**Nuläge totalt:** sidhöjd 15 040 px (≈ 17,7 skärmhöjder). Ingen horisontell scroll på sidnivå (`scrollWidth` 393). Utanför skärmen ligger bara karuseller, som är avsiktliga, och parallaxlagret med topografi och citat, som ligger vid x −322.

## Klart
- 2026-11-17 G1–G3 (grunden), mätt mot Figma `iPhone 16 - 1` (935:1511), verifierat 393×852 och 1440×900:
  - Header: vit list 361×48, radie 8, padding 0/16/0/20, logga vänster 136×21 (x 36). Höger: Fjällguiden som rund ikon 40 px (öppnar panelen, som glider ut till 361 px), säsongsväxlaren 32 px bredvid menyn (Johns beslut: samma plats som på desktop), meny 40 px ytterst (x 321–361). Kontot dolt på mobil. Menypanelen ligger under headern (z −1, padding-top 96), och knappen öppnar och stänger. Skissens "Frågor?"-pill ersattes med ikonen (Johns beslut).
  - Bokningsraden: kolumner 71 px (Figma 70,4), padding 16, inget klipps. Boende-panelen öppnas.
  - Lägesknappen: dold under 1024 px.
  - Desktop 1440 oförändrad: meny 260, Fjällguiden 208, logga 206, konto synligt, bokningsrad 420.

## Block för block (i visningsordning)

| # | Block | Klass | Vad som händer i dag (393 px) | Förslag |
|---|---|---|---|---|
| G1 | Header | C | Logotypen (x 5–195) överlappar menyknappen (16–56), säsongsprick (64–96) och Fjällguiden-knappen (105–313). Konto-ikonen ligger till höger. | Meny vänster, bara logosymbolen i mitten, Fjällguiden kompakt till höger. **Beslut:** var hamnar säsongsväxlaren och kontot (menyn?) |
| G2 | Bokningsraden (fast i nederkant) | B | Fast från start, som beslutat. Fem kategorier: Paket klipps i kanten och täcks av lägesmenyns knapp. | Fem lika breda kolumner (~78 px). Panelen öppnas ovanför raden enligt spec. Verifiera att Sök-panelen fungerar på 393. |
| G3 | Lägesmenyns knapp (`.mode-switch`) | A | Flytande nere till höger, ovanpå bokningsraden och footern. | Dölj på mobil i den här omgången. |
| 1 | Intro (logo → payoff → Hoppa över) | A | Fungerar och ser rätt ut. Logo + ordmärke, sedan "Älskat av skidåkare.", Hoppa över nere. | Behåll. Mät tidslinjen mot desktop och testa på riktig telefon. |
| 2 | Hero steg II/III | C | Filmen visas liggande i en säsongsfärgad ram. Solgrafiken överlappar ingressen. Porträtten syns inte. | Spec finns redan: filmen 4:5, ingen krympning, ingen parallax. **Beslut:** porträtt och sol på mobil (behålla ett porträtt, eller inga?) |
| 3 | Ingress | A | Läsbar, ~30 px, sex rader. | Behåll. Justera bara luften runt den. |
| 4 | Aktuellt | A | Horisontell karusell, korten 361 px (full bredd). Inget av nästa kort syns, så det framgår inte att man kan swipa. | Gör korten ~85 % breda så att nästa kort skymtar. |
| 5 | En dag i Tänndalen | C | Den sticky rubriken "En vinterdag i Tänndalen" (3 rader, ~158 px) hamnar bakom och över korten och kolliderar med text i bild. Blocket är 2 386 px högt. | Rubriken statisk ovanför, korten staplade eller i en swipebar följd. **Beslut:** stapel eller karusell. |
| 6 | Just nu | B | Fungerar i grunden: segmentväljare, kortstapel med prickar. Ca 450 px tomt ovanför rubriken (uppskattat ur skärmbild, inte mätt). Fjällguiden-kortet i stapeln sticker ut höger ("Vi är h…" klipps). | Ta bort det tomma utrymmet och tvinga kortet till 100 % bredd. |
| 7 | Fjällguiden-blocket (`#fragor`) | A | Ryms och är läsbart, frågelistan fungerar. | Behåll. Justera luft. |
| 8 | Boenden ("…skidåkarna", `#boenden-waabi`) | A | Karusell med stort kort och miniatyrrad. Nästa kort skymtar. | Behåll. Kontrollera pristaggen och raden av fakta-rutor. |
| 9 | Utförsåkning (flikar) | A | Mörkt kort med flikar som går att scrolla i sidled. Snowboard klipps, vilket är okej som affordance. | Behåll. |
| 10 | Områdesblocket (Fjällöga, `#boende`) | C | Helbildsbild med rubrik och CTA på bild. Glaskortet "Kort om området" överlappar bildkarusellens kontroller (pager och paus). | Bilden först, faktarutan under som vanligt kort, kontrollerna i bildens nederkant. **Beslut:** behålla bildkarusellen på mobil? |
| 11 | Citat (Rasmus) | A | Fungerar. | Behåll. |
| 12 | Hitta hit | C | Runway på 2 982 px men sticky är avstängt på mobil, så ca 2 100 px är tomma. Textspalten är klämd (~100 px bred, ett ord per rad). | **Beslut:** Hitta hit är pausad enligt startsida-td.md men visas. Ska den med i mobil v1? Om ja, en enkel stapel: text → kort (Stockholm 7 h / 570 km) → karta, utan runway. |
| 13 | Lev. Andas. (`#td-brand`) | B | Sekvensen körs (Lev.-ramen syns). 2 045 px. Avslutas med nattbilden "Tänndalen." + "Hitta ditt boende". | Testa scrubben på riktig telefon. Troligen behövs kortare runway och större ord. |
| 14 | Footer | A | Fungerar. Lägesknappen ligger över. | Behåll (G3 löser överlappet). |

## Summering
- **A (8):** intro, ingress, Aktuellt, Fjällguiden-blocket, Boenden, Utförsåkning, citat, footer, plus att dölja lägesknappen.
- **B (3):** bokningsraden, Just nu, Lev. Andas.
- **C (4):** header, hero steg II/III, En dag, områdesblocket. Hitta hit hänger på ett ja/nej-beslut.

## Beslut som behövs från John
1. ~~Header~~ – beslutat 17 nov (se Klart).
2. Hero: porträtt och sol på mobil, eller bara filmen i 4:5?
3. En dag: stapel eller swipe-karusell?
4. Områdesblocket: behålla bildkarusellen eller en bild?
5. Hitta hit: med i mobil v1 eller dold?

## Föreslagen byggordning
1. G1–G3 (header, bokningsrad, dölja lägesknappen) + en standardiserad brytpunkt.
2. Intro + hero (2–3).
3. Alla A-block i en följd.
4. B-block (Just nu, Lev. Andas.).
5. C-block i den ordning besluten kommer.

Varje steg ska verifieras i 393 och 1440 (ingen ändring på desktop). Före hero och Lev. Andas. behövs ett test på riktig iPhone, och då måste dev-servern lyssna på nätverket.

## Teknisk not
Mobilreglerna använder i dag flera olika brytpunkter (`max-width` 1023/1024/767/720/600 px), medan tokens anger 640/1024/1280. Förslag: allt nytt mobilarbete under `max-width: 1023px`, och befintliga avvikare städas efterhand.
