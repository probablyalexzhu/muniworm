# muni · the worm becomes the map

An interactive piece: the SF Muni "worm" wordmark draws itself, then morphs into the real
Muni Metro light-rail map. Tap in with the Clipper card, then wind/unwind the morph with the
arrow keys and explore each line.

## Run it (development)

ES modules can't load over `file://` (browser CORS), so serve the folder over HTTP — any static
server works, no install required:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

(or `npx serve`, `php -S localhost:8000`, etc.)

`?t=<0..1>` deep-links into the morph — `?t=0` is the worm, `?t=1` the finished map.

## Deploy it

There is **no build step** — the files you develop are the files you ship. Upload the repo as-is
to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3). `index.html` is the
entry point, so it serves at the root URL automatically.

## Project layout

```
index.html        markup + the inline worm SVG; loads src/main.js as a module
styles.css        all styling
*.png / *.jpg     image assets (Clipper card/reader, platform, worm icon)
src/
  main.js         entry point: wires the features, sets the opening state
  config.js       tunable constants (pacing, layout, morph resolution)
  data.js         route data: lines, colours, map geometry, info copy
  geometry.js     pure 2D math / colour / easing helpers
  morph.js        builds the worm→map morph (worm SVG sources → Muni line ribbons)
  scene.js        builds the SVG scene (lines, hit layer, caps, legend) + DOM helpers
  audio.js        Web Audio synths (all sounds are generated, no audio files)
  render.js       the timeline engine: POS state, the morph render, animateTo
  draw.js         the worm self-drawing trace phase
  stage.js        reveal / exit / auto-play orchestration
  controls.js     arrow-key + winder stepping
  explorer.js     line-info panel (hover / pin)
  card.js         Clipper card drag physics
```

Dependencies flow one way: `config`/`data`/`geometry` → `morph` → `scene` → feature modules →
`main`. (`stage` and `card` reference each other, but only via runtime event handlers, so the
ES-module cycle is safe.)
