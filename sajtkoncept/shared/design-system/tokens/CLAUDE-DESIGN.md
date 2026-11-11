# Tänndalen — regler för design

## Vad som gäller
Figma-filen och tokens i detta repo är källan. Använd bara befintliga
variabler, textstilar och komponenter. Hitta inte på färger, storlekar
eller typsnitt.

## Färg
- CTA-orange (cta-primary) används ENDAST för den primära handlingen,
  oftast bokning. Max en primär knapp per vy.
- Accent används bara för dekorativa detaljer som inte är text:
  ikonaccenter, linjer, små markörer. Aldrig för text eller knappar.
- Säsongsfärger (vår, sommar, höst, vinter) styrs av innehållet, inte
  av datum. De får användas på sekundära knappar och dekor i
  säsongsinnehåll, aldrig på bokningsknappen.
- Statusfärger är bara för indikatorer (punkt, ikon, kant), aldrig för
  text. Stängt är neutralt, rött betyder bara driftstopp.
- Mörkt läge: TD saknar Light/Dark-lägen i variablerna. Mörka varianter
  är egna variabler med suffixet -dark (t.ex. cta-on-dark,
  status-open-dark), och komponenter har egenskapen Context=Dark.
- Frost är snow med alfa. Fyllningens egen opacitet ska alltid vara
  100 %.

## Typografi
- Två familjer: Superclarendon (rubriker och ingresser) och
  CircularXX TT (allt annat).
- Editorial-stilar (heading-1–6, intro, lead, quote, eyebrow) används i
  redaktionellt innehåll och marknadsföring.
- UI-stilar (title, body, cta, nav, label, caption) används i
  gränssnitt: kort, formulär, menyer, paneler. Använd title, inte
  heading, för rubriker inuti UI.
- Inga kursiver. Citat markeras med accentlinje.

## Layout
- Mobil först. 78 % av trafiken är mobil. Designa för 390 px först,
  sedan 1440 px.
- Desktop: innehållsbredd 1280 px, grid TD / Desktop 1440. Mobil:
  grid TD / Mobile 390.
- Spacing är luftigare än en vanlig sajt. Låt bilder och innehåll
  andas.

## Komponenter
- Pilar i knappar och länkar via Arrow-egenskapen, aldrig "→" i text.
- Länk när det är navigation, knapp när det är en handling.
- Text buttons har affordance i hover och ska inte bära viktiga
  handlingar på mobil.
- Etiketter på formulärfält är alltid synliga.

## Ton
- Skidåkare till skidåkare: avslappnad, personlig, lite humor, aldrig
  tramsig.
- Tänndalen är prisneutralt. Inga rabattetiketter, inga procentsatser,
  inga nedräkningar, inget brådskespråk. Pris visas som "fr. X kr".
- Belägg hellre än påstå: siffror, namngivna platser och människor
  framför adjektiv.

## Säg till i stället för att gissa
Om något saknas i systemet (en komponent, en färg, en storlek), säg
det i stället för att skapa en egen variant.
