# Siding preview image library

The instant-quote configurator (`/instant-quote`) shows a per-colour photo in the
"Style your siding" preview when a matching file exists here. Missing files fall
back to a CSS render automatically, so a partial library is fine.

## Where files go
```
public/siding/<product>/<colour-slug>.jpg
```
- `<product>` (folder): `lap`, `panel`, `shingle`, `artisan`
- `<colour-slug>.jpg` (file): one of the 19 colours below, plus `primed.jpg`

The product **card** thumbnails (step 4) are the four files at the top level:
`lap.jpg`, `panel.jpg`, `shingle.jpg`, `artisan.jpg`.

## Colour slugs (exact filenames — lowercase, hyphenated)
arctic-white, cobble-stone, navajo-beige, khaki-brown, monterey-taupe,
timber-bark, rich-espresso, mountain-sage, light-mist, pearl-gray, gray-slate,
boothbay-blue, evening-blue, deep-ocean, aged-pewter, night-gray, iron-gray,
countrylane-red, midnight-black, primed

## Image guidance
- Landscape, ~1200×800 (3:2). JPG. Keep the SAME framing within a product so
  switching colours looks consistent.
- Whole-house photos or close-up board shots both work (object-fit: cover).

## Turning a product on
After dropping a product's files in, add its key to `PHOTO_PRODUCTS` in
`src/components/quote/InstantQuote.tsx`. `lap` is already enabled.
