# Tänndalen/OG: R360, personalisering och På plats-läget, sammanfattning av tråden (20 nov 2026)

> **Källa:** trådsammanfattning från claude.ai, importerad 2026-11-20. Vid konflikt gäller `docs/status.md` (se CLAUDE.md). Figma-noder och sidnamn kan vara inaktuella efter Figma-granskningen 20 nov (commit 6290144: Old, Blocks och _Arkiv raderade, Frågerutan arkiverad).

Tråden gick från "vilka idéer bygger på R360?" via personalisering till design och bygge av På plats-läget. Status per punkt anges som **beslutat**, **förslag** eller **okänt**.

## 1. Grundbeslut om R360

- **Beslutat (workshop 16–18 sep):** hybrid. Sajten är ett informationslager ovanpå R360, ingen tät integration. Beskrivningar, bilder och attribut hämtas ur R360. Gästen går över till R360 först vid transaktionen.
- Bakgrund: Idre Fjäll skrotade full integration med kundvagn på grund av komplexitet och prestanda.
- Pris och tillgänglighet hämtas först när gästen valt ett objekt. Kalendern länkas till R360 i stället för att byggas om.
- Öppen action för KAN: utreda R360:s egen bokningswidget.
- Mobil konverterar nästan tre gånger sämre än desktop. Sömmen mot R360 är prioritet ett.

## 2. Tekniska integrationer vi behöver lösa

**Skicka in i R360**
- Djuplänkar med förifyllt datum, sällskap, paket, kampanjkod och område. Hash-djuplänkning (`#search/{slug}-{id}`) fungerar redan. Vilka parametrar R360 tar emot är **okänt** och den viktigaste tekniska frågan.
- Kategori-ID är per tenant (`1007` är Boende i TD men Längdskidåkning i OG). Allt mappas i konfiguration, aldrig hårdkodat i delade komponenter.

**Hämta ur R360**
- Boenden med beskrivningar, bilder och egenskaper.
- Pris och tillgänglighet för ett valt boende.
- Lediga boenden en viss vecka (kundens redaktörer vill göra puffar med förifyllda datum, t.ex. jul och sportlov). Önskemål från workshopen. **Okänt** när det byggs och hänger på dataåtkomst och parametrar.

**Inloggning och bokningar**
- Samma inloggning för TD och OG (idag olika: OG på extern R360-subdomän, TD inbäddat).
- Bokningsnummer plus efternamn eller postnummer, inte BankID.
- Gästens bokning synlig på sajten, tidigare bokningar ("var bodde jag förra året?").

**Inbäddning och utseende (uttryckta som mål)**
- Gästen ska kunna börja boka på sajten utan att märka att det är ett annat system (R360:s bokningsruta eller egen, ska utredas).
- Gästen ska känna sig kvar hos varumärket ända till betalningen (R360 i sajtens utseende).
- Gästen ska kunna gå fram och tillbaka mellan sajt och bokning utan att tappa sina val (bakåtknappen).

**Betalning**
- Swish, Klarna, Apple Pay och Google Pay samt bokning utan konto (idag via Nets).

**Andra system**
- OG:s webbshop för spårpass (`shop.orsagronklitt.se`) ska in i R360 om det går.
- OG:s skidhyra flyttar in i R360 i november 2026.

**Mätning**
- GTM-spårning av bokningar i R360 och mätning av avhopp i övergången.

## 3. Personalisering, sorterad efter vad vi behöver från R360

1. **Veta vem gästen är och vad hen bokat** (låser upp mest): status och nästa steg efter bokning, På plats-läge när bokningen gäller idag, bokningen i frågerutan, "var bodde jag förra året?", stugägare känns igen och får liftkort förvalt.
2. **Få tillbaka gästen till sajten efter köpet** (reserv om 1 inte går): sajten kommer ihåg "bokat, ankomst X" utan inloggning, länkar i bekräftelse- och påminnelsemejl signalerar att gästen bokat. Räcker för nedräkning, tillval och På plats-läge, men inte för bokningsdetaljer.
3. **Utländska gäster:** norska och engelska i bokningen, priser i NOK, betalsätt för norska gäster.
4. **Samla köp på ett ställe:** spårpass i R360, stugägarportalen (okänt var den ligger).

Innehållet kan förändras fram till ankomst: tillval direkt efter bokning, förhållanden och packning 2–5 dagar före, incheckning och adress på ankomstdagen. Mest av detta är förslag från chatten "Personalisering" (12 okt) och inte beslutat med kunden.

**Frågor till R360**
1. Kan sajten se den inloggade gästens bokningar?
2. Kan gästen skickas tillbaka till sajten efter köpet?
3. Vilka språk, valutor och betalsätt stöds?
4. Kan spårpasset och stugägarportalen ligga i R360?

## 4. Umbraco Engage och Johns flöde för R360-baserad personalisering

Troliga användningsområden för Engage: vinter eller sommar, På plats, ny eller återkommande besökare (beslutat på workshopen).

Johns flöde:
1. Slå upp personens bokning i R360 (tidigare år, detaljer om kommande).
2. Spara senast aktuell info i "sajtens kundprofil".
3. Inloggad användare har tillgång till den infon.
4. Vid inloggning sparas den info vi får lov att spara även i cookie.
5. Infon justerar förutbestämda delar av sajten.

Kommentarer och förslag:
- Kolla med utvecklarna om Engage kan läsa kundprofilen, så att R360-delen och Engage blir samma motor.
- Bestäm hur länge info sparas och vad som raderas efter avresan.
- Cookien ska innehålla minimalt (t.ex. "bokat, ankomst 14 feb, 4 personer"), aldrig adress eller bokningsnummer (delade enheter). Samtycke bör stämmas av juridiskt.
- Det saknas en väg för gäster som aldrig loggar in (se punkt 2 ovan).
- Det saknas en lista över vilka "förutbestämda delar" som ska styras (bokningsruta, hero, tillval, På plats-genvägar).

## 5. På plats-läget: designbeslut

Utgångspunkt: Figma-skisser "På plats-läge · skiss" (2402:16546) och inloggningspanelen "Hitta din bokning".

**Beslutat/överenskommet i tråden**
- På plats är det enda läget som behöver en manuell toggle. Ny, återkommande och bokad känns sajten igen automatiskt.
- I menyn ersätts "Byt läge: Planerar / På plats" av en toggle med texten "Jag är på plats i Tänndalen" (OG: Orsa Grönklitt) under säsongsväxeln. Säsongsväxeln (Vinter/Sommar) ändras inte.
- Samma toggle ska inte finnas i inloggningsrutan (två ställen blir osynkade).
- Inloggningen ("Hitta din bokning", bokningsnummer + efternamn) leder till kortet "Pågår nu" (bästa delen i skisserna).
- Bannern "Är du i Tänndalen?" ska bara visas vid en riktig signal och aldrig be om platsbehörighet vid sidladdning. IP-adress duger inte som signal.
- Hela pillen under loggan blir en enda knapp med pinikon och texten "På plats i Tänndalen". Den öppnar menyn med toggeln. **Förslag, godkänt genom att prompten skrevs.** Taggen i skissen (svart ram plus lös "Byt"-länk) upplevdes som fel.

**Fel att rätta i inloggningspanelen:** texten säger "efternamn" men fältet heter "E-postadress", och båda fälten har samma platshållare. Nyckeln (efternamn eller e-post) beror på vad R360 kan slå upp (**okänt**).

**Aktivering enligt skissen (steg 5)**
- Starka signaler (ingen fråga): vistelsens datum, QR-koder och länkar på plats (liftstationer, boenden, sms från R360).
- Svaga signaler: förslag efter ett tryck, koordinater lagras inte.
- Manuellt: alltid, gäller till dagens slut eller utcheckning, ingen flipp.
- Läget ändrar: ingen intro eller animation, status högt upp, mindre fokus på Boka, morgonrapport och dagens läge i fokus. Menyposten "På plats" är en sida, inte läget.
- Ej bekräftat: R360-data om vistelsedatum och om platsbehörighet går att använda på iOS och Android.

**Att kolla:** hur pillraden ser ut på mobil (skissen visar bara desktop).

## 6. Figma: komponentfynd och agentuppdrag

- **Ikonstorlek:** knappen (Button / Secondary) har ingen egenskap för ikonstorlek. Ikonen är en nästlad instans med egen Size-variant (16/20/28). Storleken kan ändras genom att markera ikonlagret. Det blir en override som kan försvinna vid byte av ikon.
- **Instance swap-listan** på knapparna har bara 14 av 66 ikoner som föredragna värden (alla Size=20). Resten går att söka fram men visas inte som val.
- **Uppdrag till Figma-agenten (skickat, resultat ej bekräftat):** utöka listorna till alla 66 ikoner på Button / Secondary (435:77, "Icon" och "Leading icon swap"), Button / Primary (446:328, samma) och Button / Tertiary (446:389, "Leading icon swap"). Orörda: Booking / Field, Booking / Category item, Textblock, Textblock / Fact (de pekar på andra bibliotek eller har olösta referenser). Därefter byts ikonen på På plats-pillen (instans 2409:27247) till Map pin, Size=20.
- Agenten stannade två gånger enligt stoppregeln och hade vid senaste rapporten ändrat noll noder. Senaste rapporten visade att instansen 2409:27247 hade ändrats mellan rapporterna (label "Button", ikon Search Size=16, 96 × 32). Ett nytt besked skickades som tillåter ändringen och låter etiketten vara kvar.
- Skissen i Figma visar fortfarande gamla namnet "Byt läge" och "Byt"-länken. Dessa ska ändras till toggel och pill.
- Obemärkta olösta nyckel-referenser (`46590447…`) i Booking / Category item och Textblock kan vara trasiga och är värda att undersöka separat.

## 7. Cursor: bygge av På plats-läget

En komplett prompt på engelska skrevs (avslutad med `SLUT PÅ PROMPT`). **Skickad-status okänd.** Innehåll i korthet:
- **Steg 0:** kontrollera om positioner hänger på verkliga element eller fasta `top`-värden, och åtgärda innan ordningsbytet.
- **Läge:** fjärde läget `onsite` som överstyr de andra (onsite > booking > returning > new). Tillstånd i localStorage med utgångstid (dagens slut eller utcheckning). Manuellt val vinner och ger ingen flipp. Koordinater och bokningsdetaljer lagras aldrig.
- **Starka signaler:** pågående demo-vistelse och `?plats=1` (representerar QR och sms). Wifi-detektion går inte i webbläsare.
- **Meny-toggle** och **pill under loggan** enligt avsnitt 5.
- **Förslagslänk** "Är du i Tänndalen?" som ber om platsbehörighet först efter tryck. Koordinater och radie ligger i konfiguration markerad `TODO verify` (Tänndalens koordinater är inte kända).
- **Inloggning och "Din vistelse"** som mock (demo-vistelse "Ski Lodge Premium", 12–19 feb 2027, 2 vuxna 1 barn, från 15:00) med demo-override för dagens datum. Inget riktigt R360-anrop.
- **Vad läget ändrar:** ingen intro, Just nu över Aktuellt (enda läget som byter ordning), kompakt bokningsrad med Skidskola, Skidhyra och Aktiviteter.
- **Acceptans:** mätning vid 1440×900 och 393×852, övriga lägen oförändrade, ingen platsbegäran vid sidladdning, rapport med solved/remains.
- **Arbetsregler:** inga git-steg, `.bak`-kopior, aldrig `networkidle`, ändringslogg i `intro-changelog.md`.

## 8. Antaganden att bekräfta

- Hela pillen öppnar menyn, och ingen separat "Stäng av".
- Inloggningsfältet är Efternamn (inte e-post).
- Booking / Field behåller sin korta ikonlista.
- Tänndalens koordinater och radie för platsförslaget saknas.

## 9. Öppna frågor och risker

- Vilka URL-parametrar R360 accepterar, och om R360 kan dela inloggad gästs bokning och skicka tillbaka gästen efter köp.
- Språk, valutor och betalsätt i R360 (norska gäster).
- Var stugägarportalen ligger.
- Data är svår att få ut ur R360 och TD är låst i ett leverantörsavtal.
- Många R360-objekt saknar vinterbilder.
- Mätdefinitionen bakom logikonverteringen (54 → 77 %).
- Vem skriver morgonrapporten och från vilken enhet.
- Mina sidor/Min resa byggs om av R360 (önskan: "var bodde jag förra året?").
- Samtycke och lagringstid för kundprofil och cookie (juridik).
