# Struktur — tanndalen-koncept

Kort karta över hur mapparna hänger ihop. **Riktiga mappar** är där filerna ligger. **Genvägar (symlänkar)** är bara pekare så att URL:er och importvägar blir korta.

## Stor bild (`src/`)

| Mapp | Vad den är |
|---|---|
| `design-system/` | Gemensamt designsystem (tokens, fonter, komponent-CSS/JS). Används av både TD och OG. |
| `tanndalen-koncept/` | Prototypen: sajter, tester, scripts. Det du jobbar i till vardags. |
| `.next/`, `backups/` | Bygg-/arkivskräp — hör inte till det aktiva flödet. |

Under `tanndalen-koncept/` är sanningen:

```
tanndalen-koncept/
├── koncept/                    ← riktig kodbas
│   ├── shared/                 ← delad JS/config (inte HTML/CSS per site)
│   └── sites/
│       ├── td/desktop/         ← Tänndalen (riktig site)
│       └── og/desktop/         ← Orsa Grönklitt (riktig site)
├── og → koncept/sites/og/desktop
├── (roten) → nästan allt annat pekar på TD desktop
├── ds → ../design-system
├── shared → koncept/shared
├── scripts/, tests/, regression/, package.json …
```

Dev-servern startar i `tanndalen-koncept/`. Därför:

- `http://127.0.0.1:4173/` = TD (via genvägar i roten)
- `http://127.0.0.1:4173/og/` = OG (via mappen `og`)

## Varför symlänkarna finns

1. **Korta URL:er.** Utan `og → …/og/desktop` skulle adressen bli `/koncept/sites/og/desktop/`.
2. **TD bakåtkompatibel.** Många filer i `tanndalen-koncept/`-roten (`index.html`, `startsida.css`, `intro.js` …) är genvägar in till `koncept/sites/td/desktop/`, så gamla sökvägar och vanor (`/` = TD) fortfarande funkar.
3. **Gemensam DS och shared.** Varje site har `ds` och `shared` som genvägar, så HTML/JS kan skriva `ds/...` och `shared/...` utan att kopiera designsystemet.

### Genvägar i `tanndalen-koncept/`-roten

| Genväg | Pekar på | Syfte |
|---|---|---|
| `og` | `koncept/sites/og/desktop` | OG på `/og/` |
| `ds` | `../design-system` | DS från rot (TD-demo) |
| `shared` | `koncept/shared` | Delad kod från rot |
| `assets`, `index.html`, `startsida.css`, `intro.*`, `modes*`, `site-config.js`, `demo-stay.js`, `hitta-route.js`, `beslut.md`, … | motsvarande fil/mapp under `koncept/sites/td/desktop/` | TD på `/` |

### Genvägar inne i varje site (`…/desktop/`)

| Genväg | Pekar på | Får raderas? |
|---|---|---|
| `ds` | `design-system/` (relativt) | **Nej** — sajten laddar tokens/komponenter härifrån |
| `shared` | `koncept/shared/` | **Nej** — delad runtime |

`assets/` i varje site är **riktig mapp** (egen för TD respektive OG). Radera inte den; töm inte den “för att städa” utan att veta vad som hör till vilken site.

## Var lägger man nya filer?

### Tänndalen (TD)

Lägg i **`koncept/sites/td/desktop/`**:

- HTML/CSS/JS för startsidan → samma mapp
- Bilder/ikoner/video → `koncept/sites/td/desktop/assets/{img,icons,brand,video}/`
- Site-config → `site-config.js` där

Rör **inte** `og/` eller `koncept/sites/og/`.

### Orsa Grönklitt (OG)

Lägg i **`koncept/sites/og/desktop/`** (eller via genvägen `og/` — samma ställe):

- HTML/CSS/JS → `og/` / `koncept/sites/og/desktop/`
- Assets → `og/assets/…` (egen kopia, inte TD:s)
- Intro-config → `intro-config.js`, `intro-content.js`

Rör **inte** TD:s `assets/` eller TD:s filer i roten.

### Delat / designsystem

| Typ | Plats |
|---|---|
| Kod som både TD och OG ska använda | `koncept/shared/` |
| Tokens, fonter, DS-komponenter | `design-system/` (utanför `tanndalen-koncept/`) |

## Det som aldrig ska raderas ur en site-mapp

I `koncept/sites/*/desktop/`:

- **`ds`** (genväg) — utan den saknas tokens/CSS
- **`shared`** (genväg) — utan den saknas modes-motor m.m.
- **`assets/`** (riktig) — media för just den siten
- **`index.html`**, site-CSS/JS, `site-config.js`

I `tanndalen-koncept/`-roten: radera inte `koncept/`, `og`, `ds`, `shared` eller TD-genvägarna om `/` fortfarande ska fungera.

## Dubbelt eller överflödigt (förslag — ta inte bort ännu)

| Sak | Varför det känns överflödigt | Förslag |
|---|---|---|
| TD-genvägar i roten (`index.html`, `startsida.css`, `intro.js`, …) | Speglar bara `koncept/sites/td/desktop/` | Behåll så länge `/` ska vara TD. Ev. ersätt med **en** genväg `td → koncept/sites/td/desktop` (som `og`) och uppdatera server/tester — större grej. |
| `assets` i roten → TD assets | Extra pekare; OG har egen `og/assets` | Behåll för TD-URL:er på `/assets/…`. |
| `*.bak*` i roten (`modes.js.bak*`, `startsida.css.bak*`) | Gamla säkerhetskopior | Kan raderas när du bekräftat att de inte behövs. |
| `playwright.backup.config.js` | Backup-config | Behåll eller arkivera om den inte används i scripts. |
| `TD …/assets/video/winter.mp4` → Grönklitt-filen | OG-video som råkade ligga/länkas under TD | OG ska använda `og/assets/video/`. TD-länken + Grönklitt-filen under TD kan städas bort när du vill — rör inte förrän du tittat. |
| `regression/td-before`, `td-current`, `td-diff-current` m.fl. | Arbetsmappar för shot-diff (delvis gitignorerade) | Behåll strukturen; innehållet får rensas lokalt. |
| `dist/`, `test-results/`, `node_modules/` | Genererat | Ignoreras av git; kan raderas lokalt utan att tappa källkod. |
| `src/backups/`, `src/.next/` | Utanför aktivt konceptflöde | Låt ligga eller arkivera separat; hör inte till daglig TD/OG-utveckling. |

**Kort tumregel:** editera alltid under `koncept/sites/td/desktop` eller `koncept/sites/og/desktop` (eller `koncept/shared` / `design-system`). Rotens genvägar är bara skyltar mot TD och OG.
