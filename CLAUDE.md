# Project notes for Claude

The Reizo website (reseller / distributor) is a single `index.html` with hash routes, a Three.js (r160) hand-built 3D model of Model M3171, and Lenis smooth scroll. It deploys via GitHub Pages from `main`.

**Read `docs/3d-configurator-guide.md` before touching the 3D model, materials, viewer or motion.** It records every setting and the mobile-rendering lessons:
- no `transmission` for crystal acetate;
- keep inlays ≥ 0.09 mm proud;
- camera near 8 / far 1200;
- logarithmic depth buffer;
- polygonOffset on metal.

Conventions:
- Fonts: League Spartan (headings) and Courier Prime (text). White `#ffffff` background. Light mode only.
- Default colourway: Teal / Antique Gold. Four fixed SKU colourways (enamel / metal); clear demo lens.
- Don't trace or copy other brands' frame designs. M3171 is traced with the maker's permission (reseller account).
- Verify visual changes by rendering in headless Chrome (desktop 1280 and mobile 390) before publishing. Check for horizontal overflow.
- After each change: commit, push to `origin main`, and republish the claude.ai preview artifact.
