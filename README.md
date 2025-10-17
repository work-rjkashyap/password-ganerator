# Password Generator Chrome Extension

A modern Chrome extension for generating strong, memorable, and numeric passwords. The popup is built with React 18 + Vite, styled with Tailwind helpers, and persists user preferences with the Chrome Storage API. Cryptographic randomness comes from the Web Crypto API, ensuring every password is safe to use.

## Feature Highlights

### Security
- Cryptographically secure generation powered by `crypto.getRandomValues()`
- Rejection sampling to avoid modulo bias and preserve uniform character distribution
- Entropy-driven strength scoring with guidance on crack time
- No network calls, analytics, or password persistence beyond local component state

### Generators
- **Random** passwords with length 4-50, configurable character classes, and curated symbol sets (Basic, Extended, Safe, Brackets, Punctuation, Math, or custom)
- **Memorable** passphrases using common-word dictionaries, optional capitalization, and smart separators
- **PIN** builder supporting 4-12 digits with entropy feedback for quick authentication scenarios

### User Experience
- Compact popup UI optimised for Manifest V3 extensions with dark/light theme support
- Tailwind-based design system with Lucide icons and consistent motion primitives
- State persisted between sessions via `storage.local`
- Copy to clipboard flow using Chrome clipboard permissions with toast feedback

## Requirements

- Node.js 18+ (matches current Vite support matrix)
- npm 9+
- Chrome 88+ (or any Chromium browser with Manifest V3)

## Quick Start

```bash
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173/` with hot module replacement so you can iterate on the popup UI quickly. When you need to validate inside Chrome, follow the packaging steps below to load the built extension.

## Build & Packaging

1. Produce an optimized build:
   ```bash
   npm run build
   ```
2. Stage assets and manifest for Chrome load:
   ```bash
   npm run build:dist
   ```
   This chains the Vite build with `scripts/copy-assets.js`, copying icons, the manifest, and popup shell into `dist/`.
3. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable Developer mode
   - Click **Load unpacked** and select the `dist/` directory

Use `npm run preview` for a production-like HTTP preview if you want to smoke test the built bundle without reloading Chrome.

## Available Scripts

- `npm run dev` – Start the Vite development server for the popup UI
- `npm run build` – Create an optimized production bundle in `dist/`
- `npm run build:dist` – Build and copy icons + manifest for a ready-to-load Chrome package
- `npm run preview` – Serve the built bundle locally for manual verification
- `npm run test` – Execute the Vitest suite in headless JSDOM (`npx vitest --run` for CI parity)

## Testing Guidance

Vitest specs live beside the implementation in `src/__tests__/`. When adding features:
- Cover password generator edge cases (length bounds, separator handling, symbol sets)
- Mock Chrome APIs with helpers from `src/lib/` to keep tests deterministic
- Run `npx vitest --run` before opening a PR to mirror CI behaviour

## Project Structure

```
password-ganerator/
├── src/
│   ├── App.jsx                       # Popup entry point orchestrating views
│   ├── popup.jsx                     # Popup bootstrap used by Vite
│   ├── components/                   # Shared UI primitives (Tailwind helpers, Radix bindings)
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Chrome + utility helpers
│   ├── securePasswordGenerator.js    # Cryptographically secure engine
│   ├── memorablePasswordGenerator.js # Passphrase generator
│   ├── storageUtils.js               # Chrome storage abstraction
│   ├── contentScript.js              # Messaging bridge from popup to page
│   └── __tests__/                    # Vitest suites mirroring features
├── contentScript.js                 # Root-level content script for MV3 registration
├── popup.html                       # Manifest V3 popup shell
├── icons/                           # Extension icons
├── scripts/copy-assets.js           # Helper used by build:dist
├── manifest.json                    # Chrome extension manifest
├── dist/                            # Build output (generated)
└── README.md                        # Project documentation
```

## Implementation Notes

- Keep all random generation inside `securePasswordGenerator.js` and `memorablePasswordGenerator.js`; never downgrade to `Math.random()`.
- Chrome messaging is split between the root `contentScript.js` and the popup logic in `src/contentScript.js`.
- Styling prefers Tailwind class composers from `src/components/ui/`; stick with single quotes and 2-space indentation.

## Privacy & Security

- No analytics, telemetry, or remote calls – everything runs locally in the browser context
- User settings (theme, symbol selections, toggles) are the only items stored via Chrome Storage and can be cleared at any time
- Clipboard writes happen only when explicitly triggered through the copy button

## Contributing

1. Fork and create a branch (`git checkout -b feat/amazing-idea`)
2. Follow project conventions (React hooks naming, lower camelCase utilities, Tailwind helpers)
3. Add or update tests alongside feature code
4. Run `npx vitest --run` and, if applicable, `npm run build:dist` to validate the bundle
5. Submit a PR with intent, manual verification notes, and screenshots/GIFs for UI changes

## License

MIT License. See `LICENSE` (or the repository’s license file) for details.

## Support

Open an issue with reproduction steps, browser + OS details, and expected vs. actual behaviour. Feature requests and security reports are welcome via the same channel.
