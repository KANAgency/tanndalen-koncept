# Tänndalen (TD) & Orsa Grönklitt (OG) – projektkontext för Claude Code

Senast uppdaterad: 2026-11-13. Stabila regler och sammanhang. Det som ändras ofta (läge, öppna punkter, commits) ligger i `docs/status.md`.

@docs/status.md

## 1. Uppdraget
KAN (byrå, Malmö) bygger en ny gemensam webbplattform för två skiddestinationer: Tänndalen (Härjedalen/Funäsfjällen) och Orsa Grönklitt (Dalarna). Samma moderbolag och tekniska plattform, separata varumärken och sajter. John (UX-designer, partner på KAN) gör UX, produktdesign och designsystem; kod byggs här. Webben står för 73–78 % av affären. Kundresan är Planera → Boka → På plats → Efter vistelse. Teknik: Umbraco (beslutat), bokning i R360 (hybrid: egen sajt presenterar, R360 tar transaktionen).

Nuläge (nov 2026): kundprototyp med två koncept (TD och OG) som delar UX-principer och grundkod men har olika designsystem, varumärke och content. TD är långt kommen. OG är på tidigt stadium och byggs iterativt i kod. Absolut krav: det som redan fungerar i TD får inte gå sönder.

## 2. Roller och sanningskällor
- **Figma är facit för design** (fil `HW7ZST3CotlOepEcjNI5LC`, sida Concept = 274:9). Claude Code bygger koden och kan nå Figma via MCP.
- Vid motsägelse gäller (högst först): Figma → `docs/status.md` → `docs/startsida-td.md` → `docs/projektkontext.md` → äldre underlag i claude.ai-projektet "Tänndalen & Orsa Grönklitt". Är det oklart vilken som gäller: fråga John.
- Ändra aldrig ett designbeslut utan att fråga. Säg alltid vad som ändrats.
- Gissa inte, mät först. Skriv "could not measure" när något inte kan mätas. Skriv aldrig att något är klart utan att ha verifierat det.

## 3. Miljö
Alla sökvägar är relativa från repo-roten `src/` (gren `main`). Projektmappen `tanndalen-orsa/` ligger en nivå upp (`../`).

| Vad | Var |
|---|---|
| Repo-rot | `./` (= `src/`) |
| Projektkontext för Claude | `CLAUDE.md`, `docs/` |
| Kod | `sajtkoncept/` (statisk HTML/CSS/JS, inget bygg-steg för sajterna under utveckling) |
| Mappstruktur och kommandon | `sajtkoncept/STRUKTUR.md` |
| TD startsida | `sajtkoncept/td/desktop/index.html`, `startsida.css`, `intro.css/js`, `brand-sequence.css/js` |
| OG startsida | `sajtkoncept/og/desktop/index.html`, `og-startsida.css`, `hero-page/` |
| Designsystem | `sajtkoncept/shared/design-system/` (`components/*`, `generated/tokens.css`, `generated/typography-td.css`, `tokens/*.json`) |
| Byggoutput | `sajtkoncept/dist/` (gitignorerad) |
| Lokal server | `python3 scripts/dev-server.py 4173` från `sajtkoncept/` → `http://127.0.0.1:4173/td/` (`?plats=1` = På plats, `?mode=new` m.fl.) |
| Figma | `HW7ZST3CotlOepEcjNI5LC` (sidor: Concept, Foundations & Components, Assets, Blocks, Old, _Arkiv, Frågerutan). Gamla OG-Figmafilen är troligen inaktuell. |

## 4. Arbetssätt (Johns preferenser)
- Svara på svenska. Namnge menyer, inställningar och appar på engelska.
- Kör kommandon själv när du kan. Be bara John om steg som kräver hans maskin eller hans godkännande.
- Ett steg i taget när John ska göra något eller rapportera tillbaka. Terminalsteg börjar med `cd` till rätt mapp. Granska hans utdata innan nästa steg, och stanna och förklara om något är oväntat.
- Är du osäker på repots eller filernas tillstånd: säg det och fråga.
- Alla ändringar ska ligga i huvudlösningen på vanliga demo-URL:en utan parametrar. Du får testa på egna URL:er (t.ex. `?debug=…`), men allt måste mergas in i huvudkoden.
- Rapporter ska ha mätvärden, inte bara "klart". Dubbelkolla egna och andra agenters rapporter noga.
- Fråga hellre en gång med tydliga alternativ än att gissa och skriva om.
- Varna med en kort rad när kontexten blir stor (~30 verktygsanrop eller ~50 meddelanden) och erbjud att uppdatera `docs/status.md` inför en ny tråd.
- Skriv aldrig `networkidle` i tester. Inga e2e-, Playwright- eller screenshotsviter. Kör enhetstester och `tsc --noEmit` när de finns.
- Videor till boendeblocket görs i 4:3, inte 16:9.

## 5. Git
- Repot `src/` har commit-historik (se `docs/status.md`). Du får committa på `main` med tydligt svenskt meddelande och trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Pusha aldrig** utan Johns uttryckliga begäran. Skapa aldrig repos, lägg inte till remotes. Använd aldrig kan-agency-organisationen för privata projekt.
- Inga personuppgifter eller exporter som spårade filer. `td/desktop/assets/img/brand/td-brand-3.png` (32 MB) är medvetet ocommittad; sajten använder `td-brand-3.jpg`.
- Git kan behöva ta bort `.lock`-filer i `.git/`; be om behörighet om den saknas.
- Det finns ingen versionshistorik utanför repot (`src/`). Föreslå aldrig git-återställning av annat. Använd lokala kopior/checkpoints.

## 6. Figma-regler
- Läs noden först (typ, storlek, layout, komponentegenskaper), ändra sedan, verifiera med screenshot. Hellre `get_screenshot` än `get_design_context` på stora noder.
- Ladda skillen `figma-use` före första `use_figma` (och `figma-generate-library` vid variabler/komponenter).
- Variabler, inga lösa hex. Semantiska roller bara som variabler (inte paint styles). Sätt `scopes` explicit.
- Använd befintliga designsystemkomponenter och mönster bokstavligen, justera lite vid behov. Rita inte egna wireframe-kopior.
- Alla ikoner ska bygga på `Icons / Content` eller `Icons / Utility`.
- `loadFontAsync` före text (CircularXX TT Book/Bold, Superclarendon Regular/Bold).
- Länka alltid till det du byggt (Figma-länk till filen/noden) i svaret.
- Fällor: auto-gap kräver fast/Fill-höjd (aldrig Hug/minHeight); kopierade varianter tappar property-bindningar; leading trim kopplar loss textstil; läs instanser med `skipInvisibleInstanceChildren=false`; prototypreaktioner kräver varianter i samma set; instansskapande i loopar → try/catch.
- Nedladdning från Figmas asset-URL:er blockeras ofta. Bilder som inte går att hämta ska John exportera manuellt.
- Prompter till andra agenter (Figma Agent, Claude Design): fetstilad rubrik `For <agent>`, en komplett självständig prompt i ETT kodblock, aldrig delar eller patchar.

## 7. Designsystemet i korthet
- **Arkitektur:** två lager. `primitives.json` (råa värden, en enda fil) → `{varumärke}.semantic.json` (roller). Namnkonvention `kategori-roll-variant`. Mörka varianter är egna variabler med suffix `-dark`; komponenter har Context = Light | Dark. Figma-kollektioner: `Shared / Primitives`, `Semantic`, `Spacing`, `TD / Typography – responsive`, `TD / Layout – responsive`, `Booking / *`, `Just nu / *`. Generera `generated/tokens.css` med projektets generator, redigera den aldrig för hand.
- **TD-typografi:** Superclarendon (rubriker, ingress; bara Regular och Bold, aldrig Italic) + CircularXX TT (brödtext/UI; Book 450, Bold 700). Gambetta/Switzer är övergivna. Textstilar heter efter roll (UI/display, UI/title, UI/figure, UI/kicker, UI/caption, Editorial/*). Typsnitten har desktoplicens; webblicens ska köpas.
- **OG-typografi:** Literata (rubriker, variabel TTF) + Radio Canada Big (brödtext/UI).
- **TD-färg:** Natt `#24272A`, Dag `#EBE8E5`, Snö `#FFFFFF`, Accent `#BF6A15`, CTA `#AE6113` (WCAG-version av Accent; visa aldrig sida vid sida som två signaler), neutral `#686868`. Säsong: Vår `#F6E0A2`, Sommar `#1B4021`, Höst `#3C1F17`, Vinter `#A1B5BA`. Kontrastpar är en explicit tabell (`on-*`), inte beräknad. Dag = grundbakgrund, Snö = lyft, Natt = paus.
- **CTA-regel:** de viktigaste CTA-elementen (Sök/Boka) har alltid CTA-färgen, aldrig säsongsfärg. Innehållsytor med knapp får ha CTA eller säsongsfärg.
- **OG-färg:** off-white `#F5EEE5`, mörkgrön `#003E3A`, Orsa svart `#3C3C3B` (text), signal `#E74011` (sparsamt). Förslag (ej kundbekräftat): mörkgrön CTA.
- **Spacing (brand-differentierat från `xl`):** `xs` 4, `sm` 8, `md` 12, `lg` 16 gemensamma; `xl` 20/24, `2xl` 24/32, `3xl` 32/40, `4xl` 40/56, `5xl` 48/64, `6xl` 64/88, `7xl` 80/112, `8xl` 96/144 (OG/TD). Radier 4/8/16/full. Breakpoints 640/1024/1280. Grid desktop 1440, mobil 393. Mobile-first.
- **Knappar:** 48/40/32 px (Large/Medium/Small). Pilar via boolesk egenskap `Arrow`. Detaljer i `docs/startsida-td.md`.

## 8. Innehåll och ton
- Skidåkare till skidåkare: avslappnad, personlig, humor utan trams. Payoff TD: "Älskat av skidåkare." Positionering TD: quirky uppstickare med självdistans, grym alpin upplevelse utan allt folk. OG: familjeresmålet bara 4 h från Stockholm, var med dina barn.
- Belägg hellre än påstå: siffror, namngivna platser och människor före adjektiv.
- **TD är prisneutralt:** "fr. X kr", aldrig rabattetiketter, procent, nedräkningar eller brådska. OG ska tona ned sitt urgency-register.
- Aldrig humor på andras bekostnad (inga konkurrentjämförelser med Sälen/Åre/Skistar). Skillnaden visas med belägg.
- Morgonrapporten är en observation, aldrig en rekommendation. Max ca 100 tecken.
- Nämn aldrig 1 561 m som Tänndalens höjd (tillhör Storviglen i Norge). Hamrafjället 1 137 m / 295 m fallhöjd är ännu inte verifierat.
- Tänndalens marknadsansvarige är lavintekniker (inte pistförare).
- Många säger "Hamra" eller "Hamrafjället": hantera i sök och SEO.
- Påhittade fakta, tider och platshållarnamn i [hakparentes] ska bytas mot riktigt innehåll innan något visas för kund som sant.

## 9. Filkarta (läs bara det uppgiften kräver)
| Uppgift | Fil |
|---|---|
| Affär, KPI, målgrupper, varumärke, teknik, öppna frågor | `docs/projektkontext.md` |
| TD startsida: koncept, intro, sektioner, Just nu, Fjällguiden, designbeslut, Figma-noder | `docs/startsida-td.md` |
| Läge, commits, öppna punkter, nästa steg | `docs/status.md` |
| Mappstruktur, var nya filer hör hemma, dev-server, build och testkommandon | `sajtkoncept/STRUKTUR.md` |
| Beslutslogg (datum, vad som beslutats, vad som ratades, öppet) – sök på datum/ämne, läs inte allt | `sajtkoncept/beslut.md` |
