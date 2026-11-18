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

**Testa i telefonen:** `python3 scripts/dev-server.py 4173 --lan` lyssnar på nätverket och skriver ut LAN-adressen (t.ex. `http://192.168.68.56:4173/td/?mode=new`). iPhone och Mac måste vara på samma Wi-Fi. Godkänn Python i brandväggen om macOS frågar. Utan `--lan` nås servern bara från Macen. Felsökning: på iPhonen Settings → Apps → Safari → Advanced → Web Inspector, på Macen Safari → Develop → [iPhone].

| URL | Innehåll |
|---|---|
| `/` | Sidväljare (`?mobil=td` / `?mobil=og` = sajten i 393 px telefonram) |
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

## Cloudflare-konto (R2-videor)

Videorna ligger i R2 på **KAN:s** Cloudflare-konto (bucket `td-video`, prefix `td/` och `og/`, publik adress `https://pub-4e0fd720b7c94611ae98332f7f97e772.r2.dev`). `wrangler login` är global för hela datorn och används för privata projekt, så den här mappen pekar ut KAN-kontot själv:

1. Kopiera `.env.example` till `.env` (ignoreras av git) och fyll i `CLOUDFLARE_API_TOKEN` med en KAN-token (rättighet "Workers R2 Storage: Edit", bara KAN-kontot).
2. Wrangler läser `.env` i mappen den körs från och använder då tokenen i stället för inloggningen (verifierat 2026-11-18). Kör därför wrangler från `sajtkoncept/`.

Ladda upp en video (och dess poster – bygget tar bort hela `assets/video/`):

```bash
npx wrangler r2 object put td-video/og/<fil> --file og/desktop/assets/video/<fil> --remote
```

Kontroll: `curl -I https://pub-4e0fd720b7c94611ae98332f7f97e772.r2.dev/og/<fil>` ska ge 200. Cloud-sessioner och GitHub Actions: samma två variabler som hemligheter i miljön/repot.
