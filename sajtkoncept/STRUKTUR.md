# Struktur — sajtkoncept

Allt för Tänndalen- och Orsa Grönklitt-prototyperna ligger här. Inga symlänkar.

## Mappar

| Mapp | Syfte |
|---|---|
| `index.html` | Sidväljare på `/` med länkar till TD och OG |
| `shared/design-system/` | Tokens, fonter, genererad CSS, komponenter, Figma-plugin |
| `shared/js/` | Delad runtime (modes-engine, demo-stay, json-storage) |
| `shared/config/` | `create-site.js` m.m. |
| `td/desktop/` | Tänndalen: HTML, CSS, JS, assets (inkl. video) |
| `td/tests/` | Playwright-tester för TD |
| `td/regression/` | TD baseline- och arbetsbilder |
| `og/desktop/` | Orsa Grönklitt: HTML, CSS, JS, assets (inkl. video) |
| `scripts/` | Dev-server, build, TD-shot-diff |
| `beslut.md` | Beslutsloggen |
| `dist/` | Byggoutput (`dist/td`, `dist/og`) — gitignorerad |

Under `src/` ska bara `sajtkoncept/` och `backups/` finnas.

## Var lägger man nya filer?

- **Tänndalen:** `td/desktop/` (kod) eller `td/desktop/assets/…` (media). Tester i `td/tests/`.
- **Orsa Grönklitt:** `og/desktop/` respektive `og/desktop/assets/…`.
- **Delad JS:** `shared/js/` eller `shared/config/`.
- **Designsystem:** `shared/design-system/` (tokens, komponenter, fonter).

## URL:er (dev-server)

Starta från `sajtkoncept/`:

```bash
python3 scripts/dev-server.py 4173
# eller via Playwright webServer (npm run test:td)
```

| URL | Innehåll |
|---|---|
| `/` | Sidväljare |
| `/td/` | Tänndalen (`td/desktop/`) |
| `/og/` | Orsa Grönklitt (`og/desktop/`) |
| `/ds/` | `shared/design-system/` |
| `/shared/` | `shared/` (js + config) |

## Bygga och förhandsvisa

```bash
npm run build       # → dist/ hub: / (sidväljare) + /td/ + /og/ + /ds + /shared
npm run build:td    # → dist/td/  (fristående, för isolerad preview)
npm run build:og    # → dist/og/
npm run preview     # http://127.0.0.1:5180/  (hub, samma URL:er som live)
npm run preview:td  # http://127.0.0.1:5181/
npm run preview:og  # http://127.0.0.1:5182/
npm run tokens:css  # regenerera tokens/typography i shared/design-system
```

Hub-dist speglar lokal dev-server. `build:td` / `build:og` är självbärande för isolerad preview. Deploy (Azure SWA) publicerar hubben.

## Tester

```bash
npm run test:td:smoke   # tre nyckelvyer
npm run test:td         # hela TD-regressionen
```

Baseline ligger i `td/regression/td-baseline/`. Promote bara med `npm run test:td:promote -- --confirm`.
