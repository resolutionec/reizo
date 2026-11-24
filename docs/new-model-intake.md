# New Model Intake: what's needed to trace and build a 3D model + configurator

Send everything in sections 1–4 for each new frame. Section 5 is optional but makes the model exact. Section 7 lists what happens after.

---

## 1. Rights (required)
- Confirmation that the design is **Pro-Vision's own**, or that you have the brand client's permission to model it.
- No tracing of other brands' designs.

## 2. Measurements (required)
From the spec sheet or the inside of the temple. All in mm.

| Spec | Example |
|---|---|
| Model number / name | A03039 |
| Eye size A (lens width) | 52 |
| Eye size B (lens height) | 47 |
| DBL / bridge | 25 |
| Temple length | 145 |
| Total frame width | 146 |
| Frame front height (if known) | — |
| Lens base curve, if known (e.g. 4, 6, 8) | — |
| Materials (acetate brand/code, metal, lens type) | Mazzucchelli acetate, titanium, CR39 |

## 3. Photos (required)
Use a **physical sample** if possible. The measurements come from these photos, so straight-on matters most.

### Setup for every shot
- **Plain, contrasting background:** white or light grey for dark frames, dark for clear or crystal frames.
- **Soft, even light:** a window or a lightbox, no direct flash. This reduces reflections that hide edges.
- **Distance:** stand back **1.5–2 m and zoom in.** Phones shot up close distort the shape (wide-angle perspective).
- **Ruler:** put a **mm ruler in the same plane as the frame** in each straight-on shot.
- **Resolution:** the highest your phone gives. Send originals, not screenshots or chat-compressed copies.

### Shot list
| # | Shot | How |
|---|---|---|
| 1 | **Front, straight on** | Camera centred at lens height, frame square to the camera, temples open. *This is the most important shot.* Lenses removed or clear if possible. |
| 2 | **Side, straight on** | Temple fully open, camera exactly 90° to the side. Gives the temple profile, tip bend, and front thickness. |
| 3 | **Top down** | From directly above, temples open. Gives face-form wrap, temple angle and wrap behind the head. |
| 4 | **Back / inside** | Hinges, screws, nose pads, inner temple. |
| 5 | Three-quarter front and three-quarter rear | For checking the model against reality. |
| 6 | **Close-ups of every metal or decorative part, straight on** | Hinge (count the barrels), end-pieces, bridge or brow bar, temple plates, temple tips, nose pads, rivets or crystals, logos. Shoot each one square to the camera. |
| 7 | Bottom view (optional) | For complex bridges or keyholes. |

## 4. Colourways (required for the configurator)
- **Frame colours:** a photo of each colourway, or the acetate supplier and colour code. For crystal or transparent colours, note how see-through it is.
- **Metal finishes:** e.g. gold, palladium, gunmetal, matte or polished.
- **Lens options:** tints, gradient, mirror. Say whether the lens should be selectable or fixed.
- **Default colourway** to show on load.
- **Product copy:** display name, one-line description, materials line, feature list.

## 5. Exact geometry (optional, best quality)
Any of these replaces photo tracing and makes the model dimensionally exact:
- **Factory CAD:** `.3dm` (Rhino), `.step` / `.stp`, `.iges`, or a `.dxf` / `.dwg` of the front outline and temple profile.
- **Lens tracer file:** an **OMA / VCA trace (`.oma`, `.vca`) from an optical lab tracer or edger.** This gives the exact lens shape in fractions of a millimetre. *(Inference: most clinic and lab tracers can export this. Check your edger or tracer's export menu.)*
- **Flatbed scan:** lay the frame front face-down on a scanner at 600 dpi with a ruler. This is a distortion-free front trace.

## 6. Delivery
- Upload the files in chat, or put them in a shared folder (Google Drive or Dropbox) and send the link.
- Name the files by model and shot, e.g. `A04012_front.jpg`, `A04012_side.jpg`, `A04012_hinge.jpg`.

## 7. What happens after (my side)
1. **Trace** the lens and front outline, temple profile and metal parts from the photos, CAD or tracer file, and scale them to the spec sheet.
2. **Build** the model in named parts (front, lenses, temples, hinges, metalwork) using the settings in `3d-configurator-guide.md`.
3. **Compare** renders against your photos angle by angle. I send side-by-sides for review.
4. **Review rounds:** you mark anything off (a red circle on a screenshot works well) and I correct it.
5. **Configurator:** add colourway swatches, default, callouts and the product page.
6. **Export:** a compressed GLB with all colourways (`KHR_materials_variants`), USDZ for iPhone AR, STL if needed, and hero renders or a turntable.
7. **Publish:** site update, then commit and push.

**Typical review rounds:** 2–4 from photos, 1 from CAD or tracer files.
