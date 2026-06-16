/**
 * Build the SVG scene from the morph data: the line ribbons, the invisible hit layer, the
 * terminus end-caps and the route legend. Runs once at import and exports the element
 * references the render/interaction layers operate on.
 */

import { MORPH, offsets } from './morph.js';
import { TARGETS, META, WORM_BLUE } from './data.js';

const NS = 'http://www.w3.org/2000/svg';

/* ---------- line ribbons ---------- */
export const linesG = document.getElementById('lines');
// paths stay indexed by MORPH/TARGETS order (render relies on it); DOM append order sets z-order.
export const paths = MORPH.map(() => document.createElementNS(NS, 'path'));
// stack red (T) at the bottom and yellow (J) on top; others keep their relative order between.
export const Z_ORDER = ['T', 'N', 'L', 'M', 'K', 'J'];   // bottom → top
Z_ORDER.forEach(k => linesG.appendChild(paths[TARGETS.indexOf(k)]));

/** Restore the designed stacking order (red under, yellow over). */
export function restoreZ() { Z_ORDER.forEach(k => linesG.appendChild(paths[TARGETS.indexOf(k)])); }

/* ---------- hit layer ----------
   Invisible, pinned on top and NEVER reordered. Pointer events live here, so re-stacking the
   visible lines (for z) under the cursor can't desync hover/leave over overlapping ribbons. The
   geometry tracks the lines (kept in sync in render); a wide transparent stroke is a forgiving target. */
export const hitG = document.createElementNS(NS, 'g'); hitG.setAttribute('id', 'hit');
export const hitPaths = TARGETS.map(() => { const h = document.createElementNS(NS, 'path'); h.classList.add('lnhit'); hitG.appendChild(h); return h; });
document.getElementById('svg').appendChild(hitG);   // last child of the SVG → above lines, caps, worm

export const stationsG = document.getElementById('stations');
export const landG = document.getElementById('land');

/* ---------- end caps: black-outlined white bars at every terminus + one diagonal cap at Embarcadero ---------- */
export const capsG = document.getElementById('caps');
function capBar(x, y, deg, len, th) {                    // rounded-end (pill) bar
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', (-len / 2).toFixed(1)); r.setAttribute('y', (-th / 2).toFixed(1)); r.setAttribute('width', len); r.setAttribute('height', th);
  r.setAttribute('rx', (th / 2).toFixed(1)); r.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
  r.setAttribute('fill', '#f7f5ef'); r.setAttribute('stroke', '#1b1b1b'); r.setAttribute('stroke-width', '2.4'); capsG.appendChild(r);
}
function termCap(key, atEnd) {                            // circular terminus cap
  const p = offsets[key], pt = atEnd ? p[p.length - 1] : p[0];
  const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', pt[0].toFixed(1)); c.setAttribute('cy', pt[1].toFixed(1)); c.setAttribute('r', '7.5');
  c.setAttribute('fill', '#f7f5ef'); c.setAttribute('stroke', '#1b1b1b'); c.setAttribute('stroke-width', '2.4'); capsG.appendChild(c);
}
['J', 'L', 'M'].forEach(k => termCap(k, true));          // J & K share Balboa Park → one circle; plus L, M outer termini
termCap('N', true); termCap('N', false);                 // N: Ocean Beach + Caltrain
termCap('T', true); termCap('T', false);                 // T (Central Subway): Chinatown + Sunnydale
(() => {                                                 // the diagonal Embarcadero cap across the four truncated J/K/L/M ends
  const ce = ['J', 'K', 'L', 'M'].map(k => offsets[k][0]);
  const cx = ce.reduce((s, p) => s + p[0], 0) / 4, cy = ce.reduce((s, p) => s + p[1], 0) / 4;
  let sp = 0; ce.forEach(a => ce.forEach(b => sp = Math.max(sp, Math.hypot(a[0] - b[0], a[1] - b[1]))));
  const EXT = 9, d = [Math.SQRT1_2, Math.SQRT1_2];       // grow the NW (-x) end only → reach up over the N (blue) line; SE end stays put
  capBar(cx - d[0] * EXT / 2, cy - d[1] * EXT / 2, 45, sp + 9.5 + 16 + EXT, 11);
})();

/* ---------- legend (route order, with the worm beneath T) ---------- */
export const legendEl = document.getElementById('legend');
/** `{ el, rank, key }` per chip — `key` is a route letter or 'WORM', `rank` 0..6 drives the audio scale. */
export const legendChips = [];
['J', 'K', 'L', 'M', 'N', 'T'].forEach((k, rank) => {
  const m = META[k]; const el = document.createElement('div');
  el.className = 'chip'; el.style.setProperty('--c', m.color); el.dataset.line = k;
  el.innerHTML = `<span class="badge">${k}</span><span class="nm">${m.name}</span>`;
  legendEl.appendChild(el); legendChips.push({ el, rank, key: k });
});
(() => {                                                 // the worm sits under T — same round button, the SFMTA icon as the badge (via CSS)
  const el = document.createElement('div');
  el.className = 'chip chip-worm'; el.style.setProperty('--c', WORM_BLUE); el.dataset.line = 'WORM';
  el.innerHTML = `<span class="badge"></span><span class="nm">The Worm</span>`;
  legendEl.appendChild(el); legendChips.push({ el, rank: 6, key: 'WORM' });
})();

/* ---------- winder buttons (clickable mirror of the arrow keys) ---------- */
export const windPrev = document.getElementById('windPrev');
export const windNext = document.getElementById('windNext');
/** Re-trigger the press-flash animation on a key/button. */
export function pressKey(el) { el.classList.remove('press'); void el.offsetWidth; el.classList.add('press'); }
/** Reveal the arrow buttons (once the first morph finishes, or the moment the user reaches for the arrows). */
export function showWinder() { document.body.classList.add('winder-ready'); }
