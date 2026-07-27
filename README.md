## Quick Start

```bash

# 1. Install dependencies (Node 20.x required)
npm install

# 2.Edit brand.config.json: brand_name, domain, colors, logo, typography
#    See user-guide/03-white-labeling.md for the full reference

# 3. Generate brand CSS (validates your config, writes src/styles/_themes.scss)
npm run generate:brand-css

# 4. Add your OAuth credentials
#    Create .env and set CLIENT_ID to the OAuth client ID you registered with Deriv
echo "CLIENT_ID=your_deriv_oauth_client_id" > .env

# 5. Start the dev server
npm start
#    → https://localhost:8443
```

Then walk through the full setup in [Getting Started](./user-guide/01-getting-started.md).

All the setup, configuration, and architectural context lives under [`user-guide/`](./user-guide). Start here:

| #   | Guide                                                             |
| --- | ----------------------------------------------------------------- |
| 01  | [Getting Started](./user-guide/01-getting-started.md)             |
| 02  | [Architecture Overview](./user-guide/02-architecture-overview.md) |
| 03  | [White Labeling](./user-guide/03-white-labeling.md)               |
| 04  | [Authentication](./user-guide/04-authentication.md)               |
| 05  | [WebSocket Integration](./user-guide/05-websocket-integration.md) |
| 06  | [Error Handling](./user-guide/06-error-handling.md)               |
| 07  | [Monitoring & Analytics](./user-guide/07-monitoring-analytics.md) |
| 08  | [Changelog](./user-guide/08-changelog.md)                         |

Just need to re-skin? Jump straight to [White Labeling](./user-guide/03-white-labeling.md).

## Things You Must Not Change

- `platform.auth2_url.production` → `https://auth.deriv.com/oauth2/`
- `platform.auth2_url.staging` → `https://staging-auth.deriv.com/oauth2/`
- `platform.derivws.url.production` → `https://api.derivws.com/trading/v1/`
- `platform.derivws.url.staging` → `https://staging-api.derivws.com/trading/v1/`

## Deployment

1. Run `npm run build` and ship the `dist/` directory.
2. Register a Deriv OAuth client for your deployed domain and set `CLIENT_ID` in your host's environment variables.
3. Set `platform.hostname.production.com` in `brand.config.json` to your deployed hostname (no protocol, no trailing slash) so `isProduction()` detects the right environment and connects to the production WebSocket. The hostname you put here must match the redirect URI you register with Deriv.
4. Make sure your host serves `index.html` for unknown routes (SPA fallback) — OAuth redirects back to `/?code=...&state=...` and the `App` component handles the callback inline.

## Commits

- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Run `npm run test:lint` before pushing
- Run `npm test` and make sure the build still passes

For bot builder and Blockly block changes, look in [`src/external/bot-skeleton/scratch/blocks/`](./src/external/bot-skeleton).
