# Siding preview image library

The instant-quote configurator (`/instant-quote`) shows a per-colour photo in the
"Style your siding" preview when a matching file exists here. Missing files fall
back to a CSS render automatically, so a partial library is fine.

## Where files go
```
public/siding/<product>/<texture>/<colour-slug>.jpg
```
- `<product>` (folder): `lap`, `panel`, `shingle`, `artisan`
- `<texture>` (folder): the texture keys for that product —
  - lap: `cedarmill`, `smooth`
  - panel: `cedarmill`, `smooth`, `stucco`, `sierra8`
  - shingle: `straight`, `staggered`
  - artisan: `lap`, `vgroove`, `shiplap`
- `<colour-slug>.jpg` (file): one of the 19 colours below, plus `primed.jpg`

The product **card** thumbnails (step 4) are the four files at the top level:
`lap.jpg`, `panel.jpg`, `shingle.jpg`, `artisan.jpg`.

## Colour slugs (exact filenames — lowercase, hyphenated)
arctic-white, cobble-stone, navajo-beige, khaki-brown, monterey-taupe,
timber-bark, rich-espresso, mountain-sage, light-mist, pearl-gray, gray-slate,
boothbay-blue, evening-blue, deep-ocean, aged-pewter, night-gray, iron-gray,
countrylane-red, midnight-black, primed

> Naming note: a few James Hardie spellings differ from the slugs above —
> arctic (not "Artic"), monterey (not "Montary"), navajo (not "Navjo"),
> and gray (not "grey"). Use the slugs above.

## Image guidance
- ~1000–1200 px, JPG. Keep the SAME framing within a product/texture so switching
  colours looks consistent. Whole-house renders or close-ups both work.

## Status
- `lap/cedarmill/` — populated (19 colours + primed). ✅
- Everything else falls back to the CSS render until its folder is filled.

## Turning a product on
A product is enabled via `PHOTO_PRODUCTS` in
`src/components/quote/InstantQuote.tsx` (`lap` is already on). Individual textures
light up automatically as their folders are filled.
