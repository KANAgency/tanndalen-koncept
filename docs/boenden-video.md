# Boendekort – AI-animerade bilder i Magnific

Mål: den stora bilden i varje boendekort blir en kort, tyst loop (5 s) som spelar när kortet är aktivt. Ett kort spelar åt gången; hover på ett annat pausar det första och startar det nya.

## 1. Hämta bilderna (ingen tokenkostnad)

```bash
cd "~/Desktop/Cowork OS/02_KAN/tanndalen-orsa/src/sajtkoncept"
python3 scripts/hamta-boendebilder.py
```

Skriptet frågar R360:s publika sök-API vecka för vecka tills varje boende är ledigt, och laddar ner originalbilderna (`_org.jpg`) och `fakta.json` till `tanndalen-orsa/assets/boenden/<slug>/`. Lägg till fler boenden i listan `BOENDEN` (namn + grouppoollid från R360-URL:en). Fjällsippan 4 finns inte i R360, så dess bilder kommer från kundens zip.

| Boende | Bilder | Startbild för video |
|---|---|---|
| Fjällsippan 4 | kundens zip | exteriör i snö (`boende-fjallsippan-exterior.jpg`) |
| Ski Lodge Premium 203 | 7 | allrum (`01`) |
| Skarljus 7 A | 14 | fönsterbänk (`03`) |
| Brunkullan 23 | 8 | balkong mot backen (`07`) |
| Fjällstugan Järven | 18 | stuga i snö (`17`) |

## 2. Inställningar i Magnific

1. **Uppskala först** (Upscaler, 2x, Creativity låg 0–2, Resemblance hög). R360-bilderna är ofta 1920 px och komprimerade, och videomodellerna blir skarpare med ren input.
2. **Video → Image to video.** Välj den modell Magnific har som starkast "image fidelity" just nu. Testa en bild i två modeller innan du kör alla fem.
3. **Format 4:3** (projektregel för boendevideo). Kortet på sajten beskärs med `object-fit: cover`, så håll motivet centrerat med luft runt.
4. **Längd 5 s**, ingen ljud, kamerarörelse "subtle"/låg.
5. Kör 2–3 varianter per bild och välj den där inget i rummet deformeras (stolar, fönsterspröjs och text är vanligast att glida).
6. Exportera MP4. Konvertera sen till webb (se punkt 4).

## 3. Prompter

Gemensam regel för alla: kameran rör sig nästan inte, bara ljus och natur rör sig. Inga människor, inga nya objekt, ingen text.

Negativ prompt (om fältet finns): `people, faces, text, logos, warping furniture, bending lines, fast camera, zoom, cartoon, oversaturated`

**Fjällsippan 4 – exteriör**
`Slow, almost static push-in toward a wooden cabin in deep snow, mountain behind. Light snowfall drifting down, faint smoke rising from the chimney, soft late-afternoon light shifting slightly on the snow. Realistic, calm, documentary photo look.`

**Ski Lodge Premium 203 – allrum**
`Static interior shot of a bright mountain apartment living room. Daylight through the balcony door slowly brightens as a cloud passes, curtains move very slightly. Outside the window, skiers pass far away on the slope. No camera movement, realistic.`

**Skarljus 7 A – fönsterbänk**
`Static shot of a window seat with blankets and cushions, large window onto a snowy mountain. Snow falls gently outside, light shifts softly across the wooden walls and the blanket. No people, no camera movement, quiet Scandinavian interior, realistic.`

**Brunkullan 23 – balkong**
`Very slow sideways drift along a wooden balcony railing overlooking a ski slope. Tiny skiers move down the slope in the distance, light snow in the air, clear winter light. Railing stays straight and stable, realistic.`

**Fjällstugan Järven – stuga i snö**
`Slow aerial-feel push-in toward a timber cabin on a snowy hillside, birch forest and mountains behind. Sunlight sparkles on the snow, wisps of smoke from the chimney, a light breeze lifts snow from the ground. Realistic, calm.`

## 4. In på sajten

1. Konvertera (ffmpeg, ingen kostnad):
   `ffmpeg -i in.mp4 -an -vf "scale=1200:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart boende-<slug>.mp4`
   och en poster: `ffmpeg -i in.mp4 -frames:v 1 -q:v 3 boende-<slug>-poster.jpg`.
2. Lägg i `sajtkoncept/td/desktop/assets/video/`.
3. Byt `<img class="td-bo-oura-bild">` mot `<video muted playsinline loop preload="none" poster="…">` i båda raderna.
4. JS (byggs när videorna finns): första synliga kortet spelar; `pointerenter`/`focusin` på ett kort pausar övriga och spelar det; IntersectionObserver pausar utanför skärm; `prefers-reduced-motion` visar bara postern.

## Öppet

- Oura-kortet är 2:3 stående, men projektregeln säger 4:3 för boendevideo. 4:3 beskärs hårt i 2:3. Bestäm format innan körning.
- Priser i korten är exempel från en ledig vecka i R360 (inom hakparentes) och ska ersättas med riktig "fr."-prislogik.
