# TD designsystem – sammanfattning av tråden

> **Källa:** trådsammanfattning från claude.ai, importerad 2026-11-20. Vid konflikt gäller `docs/status.md` (se CLAUDE.md). Figma-noder och sidnamn kan vara inaktuella efter Figma-granskningen 20 nov (commit 6290144: Old, Blocks och _Arkiv raderade, Frågerutan arkiverad).

Chatt för Tänndalens designsystem och kodbas. Figma-fil HW7ZST3CotlOepEcjNI5LC, sidan Foundations & Components. Arbetssätt: prompter till Figma Agent, rapporter granskas här.

## Mobil: arbetsyta och grid

- Mobil designas för **iPhone 16, 393 × 852** (minsta modellen med Dynamic Island). QA mot 375 (SE/mini), 360 (Android) och 402–440 (Pro/Pro Max).
- Safe area: **59 topp, 34 botten**. Komponent `Annotation / Safe area` (Top/Bottom, bg-overlay) finns för detta. Enhetsmåtten är godkända fasta värden.
- Toppen: Safari ritar inte sajten bakom statusfältet i porträttläge, och remsans färg hämtas från sidans översta yta. Inget innehåll där. Undvik frostat glas i fasta headers.
- Botten: bakgrunden får gå ner i zonen, men inget klickbart. I kod `padding-bottom: env(safe-area-inset-bottom)`.
- Vecklinje runt **700** är preliminär och ska mätas på riktig enhet i Safari och Chrome (testsida finns i tråden).
- Grid `TD / Mobile 393`: 4 kolumner, Stretch, **margin 24 (space-xl)**, gutter 16 (space-lg). Kolumnerna är proportionsreferens, inte strikt layout. Utfallande bild och video är medvetna undantag.
- Statistik Sverige (Statcounter, mobil juni 2026): Chrome 52 %, Safari 38 %, Samsung Internet 5 %. Ungefär 45/55 iPhone/Android, men TD:s egen GA4-data är mer relevant.

## Typografi: responsiva stilar

- Collection **TD / Typography – responsive** med modes **Desktop / Mobile**. Läget sätts på ramnivå.
- Figma tolkar bundna värden för radavstånd och letter-spacing som **px**. I kod räknas de om till enhetslösa värden (radavstånd) och em (letter-spacing).
- Stillistan och "Edit text style" visar alltid Desktop-värden, oavsett ramens mode.

| Stil | Desktop | Mobil |
|---|---|---|
| heading-1 | 96 / 106 | 48 / 53 |
| heading-2 | 60 / 66 | 36 / 40 |
| heading-3 | 48 / 53 | 30 / 34 |
| heading-4 | 36 / 45 | 24 / 30 |
| heading-5 | 24 / 34 | 20 / 28 |
| heading-6 | 18 / 25 | 18 / 25 |

- Tracking-skala i kod: tighter −0.04em, tight −0.02em, normal 0, wide 0.05em. **Rubriker är aldrig 0**: minst tight, och heading-1–3 är tighter på desktop. Värdena justerades manuellt av John.
- De övriga 16 stilarna har fått samma responsiva upplägg via agenten. John utvärderar vilka stilar som faktiskt behövs innan mobilvärdena finjusteras.

## Knappar

- Alla textlager heter **Label**. Ikonknappar har instance swap **Icon** (Icons / Utility). Icon / Arrow right flyttades in i Icons / Utility.
- Primary, Secondary och Tertiary har **Leading icon** (boolean + swap, standard Search) och **Shortcut** (Kbd sist, ingen effekt i Small).
- Ny atom **Kbd** (Light/Dark, standard "⌘K", bara desktop).
- Secondary: **Fill=cta döptes om till Fill=neutral** och använder neutral-subtle (solid). En tillfällig tint-variant och tintvariablerna togs bort.
- Ny uppsättning **Button / Account** (Large/Medium × State × Context): avatar med ring och namn, samma färger som Secondary neutral.
- Avatar har fått **XSmall (24)** och initialer (textegenskap Initials, standard "WJ", boolean Show initials). Account visar "WJ" och "Wille".
- Ny semantisk variabel **color/bg-surface** (Snö) för upphöjda ytor, i collectionen Semantic.
- Kontrollexempel: `Kontrollexempel — knappar` (sök, konto, Boka).

## Öppet

- Account Medium: initialerna är trånga i Avatar XSmall. Förslag: Avatar Small (32) med vänsterpadding space-xs (4).
- Account exponerar även Avatars Size och Ring. Begränsa till Initials och Show initials, eller dokumentera.
- text-inverted används som fyllning i Chip / Filter (Selected, Dark) och i Status (Live, Dark). Ses över senare. I logotypen är det rimligt.
- Mäta vecket på riktig iPhone i Safari och Chrome.
- Cursor: generatorn ska uppdateras för den responsiva collectionen (px till enhetslöst radavstånd och em-tracking), bg-surface och knapparnas nya delar.
