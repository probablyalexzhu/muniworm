/**
 * The "trace the worm" phase: the logo draws itself as one continuous left→right pen gesture,
 * then crimson floods the fill. Position-driven via renderDraw(d) (d=0 blank … 1 full worm), so
 * the arrow keys can wind/unwind it. The audio cues fire off threshold crossings, so they scrub too.
 */

import { wp } from './morph.js';
import { sndGlyphTick, sndInkFlood } from './audio.js';

// Drawn strictly left→right as a single unbroken gesture, so the pen sweeps across "muni" once.
// Order is by each stroke's centre-x (measured): left fill → m-u-n spine → centre post → right fill → "i".
const TRACE_ORDER = [2, 0, 3, 4, 1];                  // wp[2]=left fill(113) · [0]=spine(194) · [3]=centre(229) · [4]=right fill(333) · [1]="i" bar(410)
const SEAM = 0.82;                                    // each stroke begins at 82% of the previous → flowing, no pen-lift between letters

// per-stroke draw windows in normalized [0,1] draw-space (constant pen speed: window length ∝ stroke length)
const DRAW_WIN = (() => {
  const lens = wp.map(p => p.getTotalLength()), win = new Array(wp.length); let t = 0, end = 0;
  TRACE_ORDER.forEach(i => { const dur = lens[i]; win[i] = { start: t, end: t + dur, len: lens[i] }; end = Math.max(end, t + dur); t += dur * SEAM; });
  win.forEach(w => { w.start /= end; w.end /= end; }); return win;
})();

/** Set the worm up as an undrawn, unfilled outline (rAF-driven, no CSS transition). */
export function armWorm() {
  wp.forEach((p, i) => {
    const len = p.getTotalLength();
    p.style.transition = 'none'; p.style.fillOpacity = '0'; p.style.strokeOpacity = '1';
    p.style.stroke = i === 1 ? 'var(--worm-i)' : 'var(--worm)';   // [1]=the "i" bar → its own crimson, matching the fill
    // butt caps (not round): each glyph outline is drawn from a fixed start point, and a round cap
    // there leaves a stray dot at that corner the whole time it draws.
    p.style.strokeWidth = '2.5'; p.style.strokeLinecap = 'butt'; p.style.strokeLinejoin = 'round';
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  });
}

/** Drop all inline styling → plain CSS-filled worm (clean hand-off to the morph). */
export function setWormFull() {
  wp.forEach(p => ['transition', 'fillOpacity', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'strokeDasharray', 'strokeDashoffset', 'strokeOpacity'].forEach(k => p.style[k] = ''));
}

/** Scrub the trace to draw-fraction d (0..1); fully reversible. */
export function renderDraw(d) {
  wp.forEach((p, i) => {
    const w = DRAW_WIN[i];
    const local = Math.min(1, Math.max(0, (d - w.start) / ((w.end - w.start) || 1)));
    const ot = Math.min(1, local / 0.7);                  // outline draws over the first 70% of this stroke's window
    const ft = Math.min(1, Math.max(0, (local - 0.7) / 0.3));   // red floods the fill over the last 30%
    p.style.strokeDashoffset = (w.len * (1 - ot)).toFixed(1);
    p.style.fillOpacity = ft.toFixed(3);
    p.style.strokeOpacity = (1 - 0.8 * ft).toFixed(3);    // pen line recedes as the fill arrives
  });
}

/** Per-frame draw cues: a soft tick as the pen reaches each glyph of "muni", and the ink-flood as it completes. */
export function drawCues(d, pd) {
  for (let i = 0; i < wp.length; i++) {
    const s = DRAW_WIN[i].start; if (s <= 0) continue;     // skip the first stroke (starts at 0)
    if ((d > s) !== (pd > s)) sndGlyphTick();              // pen "catches" a new letter
  }
  if (d > 0.9 && !(pd > 0.9)) sndInkFlood();               // crimson floods in as the outline closes
}
