# TD typografi: mobilvärden för alla textstilar (kartläggning)

2026-11-17. Underlag för beslut, inget är ändrat. Källa: `shared/design-system/tokens/typography-styles-tanndalen.json` (speglad från Figma 2026-10-21, mot Figma inte kontrollerad i dag) → `generate-typography-css.mjs` → `generated/typography-td.css`. Mobil = under 1024 px, ett fast steg.

**Princip (förslag):** varje stil får ett uttryckligt mobilvärde, även när det är samma som på desktop ("= desktop" är ett beslut, inte ett hål). Generatorn ska vägra bygga om ett värde saknas. Komponenter använder textstilar, aldrig egen `font-size`. Undantag (t.ex. introts payoff) kommenteras i koden.

**Användning** = antal förekomster av klassen i `td/desktop/index.html`.

## Rubriker (Superclarendon)

Problem i dag: mobiltrappan är inte monoton. `heading-md` blir 24 men `heading-sm` 30, så md är mindre än sm. `heading-lg` och `heading-sm` blir båda 30, och `heading-xs` saknar värde (24 = md). Hierarkin kollapsar på mobil.

| Stil | Desktop | Mobil i dag | Förslag mobil | Användning | Kommentar |
|---|---|---|---|---|---|
| heading-xxxl | 112 | 60 | **60** | 0 | oförändrat |
| heading-xxl | 88 | 48 | **48** | 1 | oförändrat |
| heading-xl | 60 | 36 | **40** | 0 | ger plats för lg 36 |
| heading-lg | 48 | 30 | **36** | 3 | = Aktuellt-rubriken på mobil i dag (36 px, satt för hand) |
| heading-md | 36 | 24 | **32** | 7 | rättar inversionen md < sm |
| heading-sm | 32 | 30 | **30** | 27 | oförändrat (t.ex. Aktuellt-kortens rubriker) |
| heading-xs | 24 | saknas | **24 (= desktop)** | 43 | |
| heading-xxs | 20 | 18 | **18** | 20 | oförändrat |
| heading-xxxs | 16 | saknas | **16 (= desktop)** | 3 | |
| heading-2-hero | 72 i JSON, men CSS skriver `clamp(2.5rem, 4vw + 1.5rem, 6xl)` (flytande) | – | **ta bort** | 0 | enda flytande stilen, används inte i TD |

Mobiltrappan blir 60 / 48 / 40 / 36 / 32 / 30 / 24 / 18 / 16, alltså strikt fallande. Regular-varianterna följer sin Bold-variant. Teckenavståndet för de ändrade stegen behöver ett värde: förslag att ta värdet från den desktopstil som har samma storlek (t.ex. lg 36 → −0,028 som md på desktop).

## Editorial

| Stil | Desktop | Mobil i dag | Förslag mobil | Användning | Kommentar |
|---|---|---|---|---|---|
| statement | 56 | 32 | **32** | 1 | oförändrat |
| body-xl | 24 | 20 | **20** | 0 | |
| body-lg | 20 | saknas | **18** | 0 | följer body-xl/body-steget |
| body | 18 | 16 | **16** | 36 | |
| body-sm | 16 | saknas | **16 (= desktop)** | 31 | går inte under 16 för brödtext |
| annotation | 16 | 16 (bara tracking) | **16** | 0 | |
| quote | 30 | 24 | **24** | 0 | |
| quote-sm | 24 | 20 | **20** | 0 | |
| quote-xs | 20 | saknas | **18** | 0 | |
| eyebrow | 20 | saknas | **18** | 0 | |
| eyebrow-sm | 18 | saknas | **16** | 0 | **= Aktuellt-eyebrow** (18 → 16 för hand i dag) |
| eyebrow-xs | 16 | saknas | **16 (= desktop)** | 0 | |

Rättelse till min tidigare analys: Aktuellts "AKTUELLT" motsvarar `eyebrow-sm` (18 px, versaler), inte UI/kicker (12 px). Den sätts i dag direkt i `startsida.css` och använder ingen textstil alls.

## UI (CircularXX och siffror i Superclarendon)

Små UI-stilar krymper inte. Under 16 px tappar de läsbarhet och tryckyta, så "= desktop" är rätt för de flesta.

| Stil | Desktop | Mobil i dag | Förslag mobil | Användning |
|---|---|---|---|---|
| ui-title-lg | 24 | 20 | **20** | 0 |
| ui-title | 20 | 18 | **18** | 26 |
| ui-title-sm | 16 | saknas | **16 (=)** | 8 |
| ui-body | 16 | saknas | **16 (=)** | 130 |
| ui-body-sm | 14 | saknas | **14 (=)** | 69 |
| ui-caption | 13 | saknas | **13 (=)** | 82 |
| ui-kicker | 12 | saknas | **12 (=)** | 22 |
| ui-label | 12 | saknas | **12 (=)** | 18 |
| ui-nav | 14 | saknas | **14 (=)** | 8 |
| ui-cta | 16 | saknas | **16 (=)** | 42 |
| ui-cta-sm | 14 | saknas | **14 (=)** | 36 |
| ui-figure-xl | 96 | saknas | **60** | 2 |
| ui-figure-lg | 40 | 36 | **36** | 22 |
| ui-figure-md | 30 | saknas | **30 (=)** | 1 |
| ui-figure | 18 | saknas | **18 (=)** | 123 |
| ui-figure-sm / -regular | 14 | saknas | **14 (=)** | 26 |
| ui-figure-unit-lg | 24 | 20 | **20** | 33 |
| ui-figure-unit-md | 16 | 14 | **14** | 11 |
| ui-figure-unit | 12 | saknas | **12 (=)** | 44 |

## Radhöjd

Generatorn kan i dag bara ge mobilen egen storlek och eget teckenavstånd, inte egen radhöjd. Alla rubriker har 1,1–1,2 och fungerar även i de mindre storlekarna, så inget värde behöver ändras nu. Förslag: lägg till stöd för `mobile.leading` i generatorn så att modellen är komplett, men använd det bara vid behov.

## Läckaget utanför systemet

`td/desktop/startsida.css` har 82 regler som sätter `font-size` direkt: 42 med px-värden och 40 med `var(--font-size-*)`. De går förbi textstilarna och får aldrig mobilvärden automatiskt. Aktuellt-eyebrow och Aktuellt-rubriken (36 px under 767) är två exempel. De byts mot textstilar block för block, i takt med mobilgenomgången.

## Beslut som behövs från John

1. **Rubriktrappan:** godkänn 60 / 48 / 40 / 36 / 32 / 30 / 24 / 18 / 16, eller justera. Påverkar xl, lg och md.
2. **Principen "= desktop" för UI-stilar under 16 px** (och body-sm 16).
3. **Eyebrow-trappan:** 20 → 18, 18 → 16, 16 → 16.
4. **Ta bort heading-2-hero** (flytande och oanvänd).
5. **Figma först eller kod först?** Förslag: Figma först (variabelsamlingen `TD / Typography – responsive`, mobilläget för alla stilar). Sedan speglas JSON och generatorn får ett hårt krav.
