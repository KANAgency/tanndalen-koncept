# Typography sync

Synkar tokens mot Figma: variabler, color styles, text styles, specimens.

**Figma-regler:** se kanonisk [`tokens/FIGMA-PRAXIS.md`](../../tokens/FIGMA-PRAXIS.md) (paint styles vs variables, collections, öppna frågor).

## Cursor (rekommenderat)

Säg **«synka Figma»** i chatten. Efter kodändringar:

```bash
cd figma-plugins/bind-typography-variables && npm run build:all
```

## Figma Desktop (valfritt)

```bash
npm run build
```

Import `manifest.json` → **Typography sync**.

| Knapp | Gör |
|--------|-----|
| Synka variabler + … | Full synk |
| Endast color styles | Baspalett `OG/*`, `TD/*` (`PAINT_STYLE_TOKENS`) |
| Endast specimens | Copy + TokenLine |

Logik: `src/sync-engine.ts`. MCP-bundle: `remote-sync.bundle.js` (`npm run build:remote`).
