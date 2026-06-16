# muniworm · the worm becomes the map

An interactive artifact about San Francisco's transit logo. Tap in with a Clipper card and the
Muni "worm" wordmark **draws itself**, then **morphs into the real Muni Metro light-rail map** —
which you can wind, unwind, and explore line by line. Everything is hand-built: the geometry is
projected from real DataSF route data, and every sound is synthesized in the browser (no audio
files). Full-bleed at any aspect ratio, zero dependencies, no build step.

Live: <https://muniworm.probablyalex.com/>

## Controls

| Key | Action |
| --- | --- |
| `→` | Wind forward — draw the worm, then peel out one line at a time (hold or mash to fly through) |
| `←` | Unwind — fold the lines back into the worm, then back to the intro |
| `Home` / `End` | Jump straight to the worm / the finished map |
| `J K L M N T` | Focus a line and show its story |
| `I` | The worm's own story (the logo) |
| `Esc` | Clear the current selection |
| `?` | Toggle the keyboard legend |

Pointer equivalents: the **◀ ▶ winder buttons** (bottom-left) mirror the arrows; **hover or click**
any line or legend chip to focus it; the **top-right cluster** holds mute, share, and help.

`?t=<0..1>` deep-links into the morph — `?t=0` is the worm, `?t=1` the finished map.

## Features & easter eggs

- **Drag the Clipper card.** Pick it up and it pivots around your grab point with real momentum —
  fling it in a circle and it spins around the cursor, let go and the flick carries it until friction
  settles it wherever it lands. Drop it on the reader to tap in. (Keyboard: focus it and press
  `Enter` / `Space`.)
- **The worm draws itself** as one continuous left-to-right pen stroke across "muni", then crimson
  floods the fill — and only then morphs into the map. Both phases are position-driven, so the arrow
  keys scrub the whole thing forward and backward.
- **A pentatonic transit chime.** Each line owns one note of a C-major-pentatonic scale in route
  order — **J K L M N T = C5 D5 E5 G5 A5 C6**. Winding forward climbs the scale as each line peels
  out; unwinding plays it back down. Hovering or selecting a line rings its note too. The worm caps
  it an octave-ish higher on **E6**, and when the map fully assembles a little run-up-the-scale
  flourish lands.
- **The "STOP REQUEST" sign.** Wind right when you're already at the end of the line and you'll hear
  Muni's two-strike "stop requested" bell — and an overhead **amber LED dot-matrix marquee** lights
  up (with an LED warm-up flicker), just like the sign in an LRV.
- **The line explorer.** On the finished map, focus any line to dim the rest and pull up its story —
  opening year, termini, and a bit of history. The worm is selectable too (`I` or its chip), telling
  the logo's story instead of a route. Hopping between lines has a brief focus-linger so the map
  never flashes.
- **The worm reappears.** Selecting the worm brings the original "muni" logo back exactly where it
  sat before the morph — because it *is* the morph's source artwork.
- **Mute** (top-right) cuts all audio and the choice persists across visits.
- **Share** copies a link to your current view, snapped to the nearest landmark (`?t=0` worm or
  `?t=1` map).
- **Help ping.** A radar ring nudges you toward the `?` button until you discover the controls —
  then it quietly retires.
- Every sound — the reader beep, card clacks, line notes, ink-flood swell, stop-request bell — is
  generated live with the Web Audio API. No audio assets ship.

## Run it (development)

ES modules can't load over `file://` (browser CORS), so serve the folder over HTTP — any static
server works, no install required:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

(or `npx serve`, `php -S localhost:8000`, etc.)

> Note: the Vercel Web Analytics script (`/_vercel/insights/script.js`) 404s locally — that's
> expected; it only exists on the deployed site.

## Deploy it

There is **no build step** — the files you develop are the files you ship. Upload the repo as-is to
any static host (Vercel, GitHub Pages, Netlify, Cloudflare Pages, S3). `index.html` is the entry
point, so it serves at the root URL automatically. Web Analytics is wired in via a script tag in
`index.html`; enable Analytics in the Vercel project for it to start collecting.

## Project layout

```
index.html        markup + the inline worm SVG; preloads the intro art; loads src/main.js as a module
styles.css        all styling
*.webp / *.png    image assets (Clipper card + reader, platform backdrop, worm icon, OG image)
src/
  main.js         entry point: wires the features, sets the opening state (incl. ?t deep-link)
  config.js       tunable constants (pacing, layout, morph resolution)
  data.js         route data: lines, colours, map geometry, info copy
  geometry.js     pure 2D math / colour / easing helpers
  morph.js        builds the worm→map morph (worm SVG sources → Muni line ribbons)
  scene.js        builds the SVG scene (lines, hit layer, caps, legend) + the STOP-REQUEST marquee
  audio.js        Web Audio synths + the master-gain mute (all sounds are generated)
  render.js       the timeline engine: POS state, the morph render, animateTo
  draw.js         the worm self-drawing trace phase
  stage.js        reveal / exit / auto-play orchestration
  controls.js     arrow-key + winder stepping (and the stop-request trigger)
  explorer.js     line-info panel (hover / pin, with focus-linger)
  card.js         Clipper card drag physics
  help.js         keyboard-legend popover + attention ping
  share.js        copy a ?t deep-link to the current view
  sound-toggle.js mute button wiring (persists to localStorage)
```

Dependencies flow one way: `config`/`data`/`geometry` → `morph` → `scene` → feature modules →
`main`. (`stage` and `card` reference each other, but only via runtime event handlers, so the
ES-module cycle is safe.)

## License

[MIT](LICENSE) © Alex Zhu. The Muni "worm" wordmark is a trademark of the SFMTA; it appears here
for non-commercial, illustrative purposes.
