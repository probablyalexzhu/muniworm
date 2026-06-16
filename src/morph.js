/**
 * Build the morph: take the worm logo's own outline segments as sources and the real Muni
 * line ribbons as destinations, aligned point-for-point so each line can snake from one to
 * the other. Runs once at import (reads the inline `#worm` SVG, mutates `#landPath`).
 */

import { TARGETS, META, MAP } from './data.js';
import { resample, splitRingAtX, ribbonLP, prep, hx, smooth } from './geometry.js';
import { OFF_SP, MAP_DROP } from './config.js';

/* worm transform — must match <g id="worm"> in the HTML (getPointAtLength returns local coords) */
const WT = { tx: 330, ty: 205, s: 1.2 };
const wx = x => WT.tx + x * WT.s, wy = y => WT.ty + y * WT.s;

export const wormG = document.getElementById('worm');
/** [0]=long m-u-n serpentine · [1]=i bar · [2]=left fill · [3]=centre post · [4]=right fill */
export const wp = [...wormG.querySelectorAll('path')];

// worm chunk base colours: the original Landor logo reds — must match the #worm fills in styles.css
// (--worm #cc3847 for every segment; --worm-i #cf2645 for the "i" bar, which maps to the T line).
export const BASE = ['#cc3847', '#cc3847', '#cc3847', '#cc3847', '#cc3847', '#cf2645'].map(hx);
export const DST = TARGETS.map(k => hx(META[k].color));

/** Sample an SVG path outline into a ring of viewBox-space points. */
function samplePath(el) {
  const len = el.getTotalLength();
  const n = Math.max(300, Math.min(1300, Math.round(len / 1.4)));
  const r = [];
  for (let i = 0; i < n; i++) { const p = el.getPointAtLength(len * i / n); r.push([wx(p.x), wy(p.y)]); }
  return r;
}

// split the long serpentine in half at the bottom of the U (x=603); N gets the left half, J the right half
const [halfL, halfR] = splitRingAtX(samplePath(wp[0]), 603);
const srcRings = [halfL, halfR, samplePath(wp[2]), samplePath(wp[3]), samplePath(wp[4]), samplePath(wp[1])];

/* ---- offset the lines that share the Market St subway into parallel bands ----
   Only J/K/L/M/N share Market (T uses the separate Central Subway, so it's left alone).
   Each shared line is pushed perpendicular to the trunk's local direction, fading to 0
   once it diverges, so branches keep their true geometry. */
const TRUNK = resample(MAP['L'].slice(0, 108), 110);      // Embarcadero → Market → Twin Peaks tunnel → West Portal
const TRUNK_ORDER = ['K', 'M', 'L', 'J', 'N'];            // NE edge → SW edge of the trunk
function nearestTrunk(p) {
  let bd = 1e9, bi = 0;
  for (let i = 0; i < TRUNK.length; i++) { const dx = TRUNK[i][0] - p[0], dy = TRUNK[i][1] - p[1], d = dx * dx + dy * dy; if (d < bd) { bd = d; bi = i; } }
  return { d: Math.sqrt(bd), i: bi };
}
function offsetLine(key) {
  const poly = resample(MAP[key], 120);
  const idx = TRUNK_ORDER.indexOf(key);
  if (idx < 0) return poly;                                // T: untouched
  const off = (idx - (TRUNK_ORDER.length - 1) / 2) * OFF_SP;
  return poly.map(p => {
    const nt = nearestTrunk(p), w = 1 - smooth(6, 40, nt.d);  // 1 on the trunk, 0 once diverged
    if (w < 0.002) return p;
    const a = TRUNK[Math.max(0, nt.i - 1)], b = TRUNK[Math.min(TRUNK.length - 1, nt.i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    return [p[0] - dy * off * w, p[1] + dx * off * w];
  });
}

/* Embarcadero is the real NE terminus of the Market trunk (J/K/L/M); N runs through it to Caltrain.
   Truncate J/K/L/M on the 45° cap line so their ends align; keep N full. */
const EMB = [919.6, 83.6];
const TDIR = (() => { let dx = TRUNK[0][0] - TRUNK[14][0], dy = TRUNK[0][1] - TRUNK[14][1]; const m = Math.hypot(dx, dy) || 1; return [dx / m, dy / m]; })();
const CUT = [EMB[0] - TDIR[0] * 50, EMB[1] - TDIR[1] * 50];   // J/K/L/M terminate here (Embarcadero)
const CAPN = [Math.SQRT1_2, -Math.SQRT1_2];                  // normal of the 45° cap (points NE)
function truncTrunk(poly) {
  const sd = p => (p[0] - CUT[0]) * CAPN[0] + (p[1] - CUT[1]) * CAPN[1];
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i], b = poly[i + 1], da = sd(a), db = sd(b);
    if (da > 0 && db <= 0) { const t = da / (da - db); return [[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]].concat(poly.slice(i + 1)); }
  }
  return poly;
}
const TRUNK_END = ['J', 'K', 'L', 'M'];                     // terminate at the Embarcadero cap; N stays full

/** Final destination ribbons per line, keyed by route letter (offset + truncated + dropped). */
export const offsets = {};
TARGETS.forEach(k => { let p = offsetLine(k); if (TRUNK_END.includes(k)) p = truncTrunk(p); offsets[k] = p; });

// nudge the finished MAP down a touch. Shift only the line DESTINATIONS, so the morph still starts
// on the centred worm logo and just settles lower; caps read offsets, so they follow.
TARGETS.forEach(k => offsets[k].forEach(p => { p[1] += MAP_DROP; }));
document.getElementById('landPath').setAttribute('transform', `translate(0 ${MAP_DROP})`);  // SF silhouette drops too

/** Per-line morph data `{ S, D, lp }` (aligned source ring, destination ribbon, arc params), in TARGETS order. */
export const MORPH = srcRings.map((s, i) => prep(s, ribbonLP(offsets[TARGETS[i]], 10.5)));
