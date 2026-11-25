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

## 9. Lessons learned (A03039, M3171, M5006)

Collected from the review rounds on three models. Read this before starting a new frame: most fixes below were asked for more than once.

### 9.1 Workflow that works
1. **Trace the front first, lenses first.** Lens outline → rim / eyewire → bridge → mounts / end-pieces → temples → small hardware. Get sign-off on a trace overlay (PNG on the reference photo) before building 3D.
2. **Scale from a published spec.** Set mm/px so the traced lens width equals eye size A, then check that the gap between the lenses comes out as the bridge (DBL). If both match (M5006: A 46 → DBL 22.0), scale and trace are right. If they disagree, use a value between and say so.
3. **Trace both lenses, then mirror one.** Compare left and right; where they agree within a few px, average and mirror. Where a temple or post hides an edge, use the other side.
4. **Check against every colourway photo.** Solid-tint lenses show the clear polished bevel as a light band at the edge — the lens outline is the outer edge, not the tint edge.
5. **Keep a zoomable inspection page** (separate artifact: pan, zoom to ~12 mm, no auto-rotate, no edge fade). The client marks up screenshots of it; this is the fastest review loop.
6. **Render the same angle as the reference photo** before answering a markup, and check from at least two other angles. Most "still looks off" replies came from fixing one view and breaking another.

### 9.2 Tracing and smoothing
- **Raw pixel traces are jagged.** Always resample by arc length and smooth (Gaussian along the contour, σ ≈ 3–7 px), then simplify, then 2–3 Chaikin passes. Straight runs stay straight, corners get a small even radius.
- **Take outline, cut-outs and engraving from the same photo, the same half, mirrored.** Mixing an averaged outline with an un-averaged engraving shows a doubled edge.
- **Cut-outs must sit fully inside the outline** or ExtrudeGeometry silently drops the hole. Re-trace slots whenever the outline changes.
- **Use the cleanest close-up for each part**, not the full-frame shot. Low-contrast or busy photos (wood tables, reflections) give lumpy edges.
- **Some parts should be built, not traced.** Rounded cast parts (lens-mount bulbs, necks, fins), knobs and screws look wrong as flat extrusions of a traced outline. Trace for size and position, then build them from smooth, symmetrical solids. The client explicitly preferred symmetrical over "follows my red line".
- **Red markup lines are a highlight, not a trace**, unless the client says "trace this".

### 9.3 How real frames are put together (things the model got wrong first)
- **Nothing floats.** Every metal part touches or welds to its neighbour. Check for gaps from the side and from above, not just the front.
- **Rimless mounts hug the lens.** The edge clamp wraps the lens edge for the full lens depth and follows the lens curve; the neck and bulb lie on the lens's curved front; the bolt goes through the lens with a hex nut, stub and end behind.
- **Bridges sit in the lens plane**, welded to the nasal mounts — not 2 mm in front.
- **End-pieces sweep back** round the corner to the hinge as one curved strap (or one solid piece), never a sideways bar plus a box.
- **No step at hinge joints.** End-piece and temple share height, thickness and edge radius where they meet; outer faces flush.
- **Temples:** run nearly level, bend down behind the ear, and the tip ends level with the bottom of the lens (side view). From above, the last ~35 mm turn inward ~6 mm to wrap behind the head above the mastoid. Never splay outward.
- **Temple decorations have relief:** stepped bands (raised middle, ledges top and bottom), pronounced collars wider than the rod, engraving with real bump.
- **Nose pads** hang on a hooked wire arm from a box with a screw, are long and narrow, convex toward the nose, and follow the slant of the lens's nasal edge.
- **Bolt heads are plain polished hex** unless a slot is clearly visible.

### 9.4 three.js geometry gotchas
- **Faceted lenses:** never ExtrudeGeometry + sag for a lens. Build concentric rings from the exact traced outline to the centre (front and back) plus an edge wall; compute normals on the indexed mesh.
- **Grid-clipped lenses have stair-stepped edges.** Use the ring method above.
- **Hollow-looking parts = inward normals.** LatheGeometry faces depend on profile order; custom sweeps depend on index order. Check from the outside and flip winding if needed. Cap open tubes.
- **Swept parts** (strips, sleeves, edge clamps): build a cross-section and sweep it along a CatmullRom/Bezier curve; use a superellipse cross-section for rounded edges; taper width/depth at the ends for rounded tips.
- **Lens front sag:** keep one shared function (`SAG5`) and place everything that sits on the lens with it.
- **Unary minus before `**` is a syntax error in JS** (`-(x/a)**2` → `-((x/a)**2)`) and kills the whole module — always run a page-error check before publishing.
- **Shared materials:** changing `.side` on a material changes every mesh that uses it, and `applyMaterials` reassigns materials each frame.
- **Variables declared inside `{ }` blocks** aren't visible to later blocks; pass values or recompute.
- **Coloured sections over metal** must stand ≥ 0.09–0.1 mm proud (or use polygonOffset) or they speckle on mobile.

### 9.5 Site and viewer lessons
- Hero 3D must never draw over text: widen the hero, push the wall label right, and fade the canvas edge with a mask.
- Wheel over the hero model zooms only; at the zoom-out limit it must not scroll the page.
- Zoom limits: home ~1.3×, product page ~1.5×. Inspection page unlimited.
- Long colour names need `white-space:nowrap` and their own line on mobile.
- Cache-bust replaced images (`?v=2`) or the client sees the old file.
- US spelling in visible copy (Color, colorways).

### 9.6 Will the next model be faster?
Yes, measurably, for three reasons:
- **Reusable code:** lens rings, edge clamps, symmetric necks, hex bolts, nose-pad assembly, swept straps, stepped sleeves, temple profile with mastoid wrap, tip collars and the inspection page now exist as functions in `tools/m5006-build.js` / `tools/m3171-build.js`. A similar frame starts from these, not from scratch.
- **Known failure list:** sections 9.3–9.4 cover the fixes that took the most rounds (gaps, steps, floating parts, jagged traces, faceting, hollow tips). Checking them before the first preview removes most review rounds.
- **Better inputs (see `new-model-intake.md` §3):** a straight side photo, a top-down photo, and close-ups of bridge, mounts, hinge, pads and tips from the start. On M5006 these arrived one at a time, which drove most of the back-and-forth.

What does not carry over: every new frame still needs its own trace and a review pass, and new construction types (e.g. acetate full-rim vs titanium rimless) need new parts.
