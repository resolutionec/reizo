# 3D Eyewear Configurator — Reference & Settings

A reusable reference for building web-based 3D eyewear configurators. It was captured from the Pro-Vision Optical site (Model A03039), and is written so it can be carried into other projects. Every value below is the one currently used in `index.html`.

---

## 1. File formats

### What configurators use
| Format | Role | Notes |
|---|---|---|
| **glTF / GLB** | **The standard** for web 3D and configurators | Loaded natively by three.js, Babylon.js, Google `<model-viewer>`, Shopify 3D, Sketchfab, Threekit and Zakeke. Uses PBR materials, so metal, acetate and lenses look the same across tools. |
| **USDZ** | AR on iPhone/iPad ("View in AR", AR Quick Look) | Usually shipped **alongside** the GLB, one USDZ per colourway. |
| FBX / OBJ | Source/upload formats only | Platforms convert them to glTF. OBJ loses PBR metal. FBX can be made from a GLB in Blender. |
| STL | Geometry only | For 3D printing or CAD import. No colour. |
| STEP / IGES / .3dm | Solid CAD for tooling | **Cannot be produced from a display mesh.** Ask the factory for its CAD. |

### Recommended deliverable per model
1. **One compressed GLB** containing all colourways via the `KHR_materials_variants` extension (supported by `<model-viewer>` and Shopify), compressed with **Draco or Meshopt** so it loads fast on phones.
2. **One USDZ** for the default colourway (more if AR in each colourway is needed).
3. Optional: high-res PNG renders (up to ~4000 px, transparent or studio background) and an MP4/GIF 360° turntable.

### What a configurator-ready model needs
- **Separate, named meshes per part**: front, lenses, temples, hinges, brow bar, end-pieces, bridge plate, screws. Each part must be recolourable on its own.
- **A material "role" per mesh** (see §3) so swapping a colourway is a lookup, not a re-model.
- Units in **millimetres**, origin at the frame centre, front facing +Z, Y up.

---

## 2. Model build (A03039 reference)

- **Front outline:** traced from a straight-on product photo (`tools/frontfit.py`). The lens shape is traced; the rim is an even **5.6 mm** acetate band around each lens; there is an open U under the brow bar and a low bridge; the end-piece wings are part of the **same front piece**.
- **Face-form wrap:** z = −0.0011·x² applied to the front.
- **Lens:** a fine grid clipped to the traced outline, with a spherical base-curve sag (R ≈ 190 mm).
- **Temples:** side profile traced from a side photo (`tools/templefit.py`).
  - **No outward splay**: they run straight back from the hinge.
  - **Wrap:** inward z offset of −0.0022·(u−78)² past 78 mm, about 8–9 mm at the tip, so the tips hug behind the head.
  - **Taper:** thickness goes from 100% at the hinge to 80% at the tip. Only the inner face moves, so the outer face stays flat for the metal plates.
  - **Height:** must equal the end-piece extension at the joint. Any mismatch reads as a visible step.
- **Extension:** the wing's own cross-section swept back to the hinge, with a concave fillet into the rim back. Front, wing and extension read as one piece.
- **Hardware:** 7-knuckle hinge on a dark pin, slotted screws (half-dome plus a dark slot), riveted end-pieces with a crystal in a ring bezel, an engraved brow bar on legs, and a bridge pill with a recessed slot.
- **Engraving:** greyscale crops of real close-up photos (perspective-rectified where needed) used as `map` + `bumpMap`, tinted by the metal colour (`tools/metalfit.py`).

---

## 3. Materials & colourways

Renderer: `MeshPhysicalMaterial` / `MeshStandardMaterial`, ACES Filmic tone mapping (exposure **1.05**), sRGB output, `RoomEnvironment` PMREM for reflections.

### Frame (acetate) — role `frame`
| Key | Name | Settings |
|---|---|---|
| `black` | Black | `#0a0a0b`, roughness .20, clearcoat 1, clearcoatRoughness .04 |
| `havana` | Havana | procedural tortoise canvas texture, roughness .22, clearcoat 1 |
| `smoke` | Smoke crystal | `#8d867c`, **semi-transparent** (opacity .62), roughness .06, clearcoat 1 — see §4 |
| `bone` | Bone | `#e6ddca`, roughness .30, clearcoat .9 |

### Metal — roles `metal`, `engrave`, `eng:*`
| Key | Name | Colour |
|---|---|---|
| `palladium` | Palladium | `#e4e1da` |
| `gold` | Gold | `#e2bf74` |
| `gunmetal` | Gunmetal | `#77787e` |

- **Plain metal:** metalness 1, roughness .20, envMapIntensity 1.9.
- **Engraved metal:** the photo texture as map + bumpMap (bumpScale .7), metalness .72, roughness .38.

### Lens — role `lens`
Grey `#262930`, roughness .03, transparent, opacity .86, clearcoat 1, double-sided.

### Defaults & UI
- **Default colourway:** **Bone / Gold** (also what Reset returns to).
- **Configurator UI:** Frame + Metal only. Lens is fixed to grey.
- **Swatches:** 14 px dots in 30 px tap targets; the selected one gets a thin ring.
- **Persistence:** choices are saved in `localStorage` (key `pv-cfg2`). Bump the key whenever the default changes.
- **Note under the swatches:** "Colorways are concept renders."

---

## 4. Rendering lessons (mobile flicker)

These caused visible bugs on iPhones and are now fixed. Reuse these fixes from the start:

1. **Coplanar surfaces flicker (z-fighting).** Keep inlays and plates **≥ 0.09 mm** proud of the surface beneath, not 0.02 mm.
2. **Camera depth range:** `PerspectiveCamera(26, aspect, near 8, far 1200)`. Never use near 1 / far 5000.
3. **`logarithmicDepthBuffer: true`** on the renderer fixes remaining near-touching parts on mobile GPUs.
4. **`polygonOffset`:** metal factor/units −1, engraving −2, dark parts (slots, pins) −3, so hardware always wins over adjoining acetate.
5. **Never use `transmission` for crystal acetate.** Its low-res render pass shimmers on phones and smears hidden internals. Use instead:
   - alpha blending (`transparent`, opacity ~.6) on the **front faces**, depthWrite on, renderOrder 2;
   - plus a **back-face pass** (same geometry, `BackSide`, opacity .5, depthWrite **off**, renderOrder 1);
   - lenses at renderOrder 3.

   The fixed order means layers never swap as the model rotates.
6. **Shape holes must wind opposite to the outer outline** in `ExtrudeGeometry`, or their inner walls render inside-out (see-through slivers).
7. **Pixel ratio** capped at `min(devicePixelRatio, 1.75)` for performance.

---

## 5. Viewer / interaction settings

- **Lighting:**
  - key `DirectionalLight #ffffff` at 1.3, position (220, 320, 300);
  - rim `#fff1dc` at .6, position (−260, 120, −200);
  - `HemisphereLight #ffffff / #8a8070` at .35.
- **Controls:** `OrbitControls`, damping .07, rotateSpeed .8, pan **off**.
- **Auto-rotate:** home 1.6, product page 0.7. It stops on drag and resumes **2.6 s** after release (1.2 s after a callout hover ends). Off under `prefers-reduced-motion`.
- **Framing:** `baseDist = max(home 362 | product 305, 493 / aspect)`, about 1.5× the original size, capped so it never clips at any angle.
- **Zoom:**
  - home: zoom in only, max **2×** (`minDistance = baseDist/2`, `maxDistance = baseDist`); at the limits the wheel passes through to page scroll;
  - product page: full range (90–720).
- **No clipping when zoomed:** the canvas is **150% × 170%** of its stage (offset −25% / −35%) with `pointer-events:none`; a transparent `.hit3d` layer over the stage receives the input. Labels and swatches sit above it with `z-index:2`.
- **Part callouts:** hover or tap highlights a part with a warm emissive tint (`#b08a52`) and tweens the camera to that part's view. Leaving the page clears the highlight, so the hero never inherits a product-page selection.
- **Fallback:** if WebGL is unavailable, the product photo shows instead.

---

## 6. Site-wide motion

- **Smooth scroll:** Lenis `1.3.19` (jsDelivr, pinned), `lerp .07`, `wheelMultiplier .9`, `syncTouch false` (touch stays native). The 3D hit layer is excluded so wheel-zoom still works. Page changes jump to the top immediately.
- **Reveal:** `.reveal` fades up 70 px over 1.2–1.5 s with `cubic-bezier(.16,1,.3,1)`; a 0.12 s delay for the second element.
- **Slide-in image:**
  - scroll-linked from the left, starting 40% of a screen before it is visible and completing over 0.85 of a screen;
  - eased toward the target at .045 per frame, then shaped with ease-in-out cubic;
  - travel 38 vw, opacity .3 → 1;
  - progress only increases, so it **stays anchored** when the visitor scrolls back up.
- **Parallax:** `data-plx="N"` moves an element N% of its height across the viewport; used only on text (−10). Images that must stay anchored get no parallax.
- **Reduced motion:** every effect above is disabled under `prefers-reduced-motion`.

---

## 7. Visual identity (Pro-Vision site)

- **Fonts:** League Spartan (headings), Courier Prime (all body text and labels).
- **Colours:** background `#f4f0e8` (cream), ink `#1c1b19`, mute `#6b665d`, accent brass `#9a7646`. **Light mode only**: no `light-dark()` values, because dark-mode viewers override them.
- **Layout:** gallery / museum wall labels, generous white space, hairline rules.
- **Mobile nav:** Collection · Atelier · Process plus an eased "More" menu (Journal · FAQ · Visit).

---

## 8. Tooling in this repo

| Script | Purpose |
|---|---|
| `tools/frontfit.py` | Trace lens and front outline from a front photo. Even rim band, open top U, wings. |
| `tools/templefit.py` | Trace temple side profile from a side photo. |
| `tools/metalfit.py` | Trace metal part outlines and extract engraving textures from close-ups. |
| `tools/logotrace.py` | Trace a raster logo into a black SVG + PNG. |

Rendering and testing are done in headless Chrome (Playwright) with SwiftShader WebGL, comparing renders against the reference photos angle by angle.
