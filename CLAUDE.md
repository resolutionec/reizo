# Project notes for Claude

The Reizo website (reseller / distributor) is a single `index.html` with hash routes, a Three.js (r160) hand-built 3D model of Model M3171, and Lenis smooth scroll. It deploys via GitHub Pages from `main`.

**Read `docs/3d-configurator-guide.md` before touching the 3D model, materials, viewer or motion.** It records every setting and the mobile-rendering lessons:
- no `transmission` for crystal acetate;
- keep inlays ≥ 0.09 mm proud;
- camera near 8 / far 1200;
- logarithmic depth buffer;
- polygonOffset on metal.

**Default temple shape (apply to every new model unless the user says otherwise):**
- Side view: temples run nearly level from the hinge, bend down behind the ear, and the tip ends about level with the bottom of the lens.
- Top view: temples run straight back (no outward splay), then the last ~40–55 mm taper inward ~6 mm so the tips wrap behind the head and rest above the mastoid bone. Use a smooth quadratic onset, e.g. `wrap(u) = u>78 ? -6*((u-78)/58)**2 : 0` (u = mm back from the hinge, negative = inward), scaled to the temple length.

Conventions:
- Fonts: League Spartan (headings) and Courier Prime (text). White `#ffffff` background. Light mode only.
- Hero model toggle: M5006 (default, rimless sun, five frame/lens colourways, default Palladium White / Café Violet Gradient) and M3171 (four enamel/metal colourways, default Teal / Antique Gold). Product page shows M3171.
- Don't trace or copy other brands' frame designs. M3171 and M5006 are traced with the maker's permission (reseller account).
- Verify visual changes by rendering in headless Chrome (desktop 1280 and mobile 390) before publishing. Check for horizontal overflow.
- After each change: commit, push to `origin main`, and republish the claude.ai preview artifact.
