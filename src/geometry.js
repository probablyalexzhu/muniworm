/**
 * Pure 2D geometry, colour and easing helpers — no DOM, no state.
 * Points are `[x, y]` tuples in the 1200x700 viewBox space.
 */

import { NP } from './config.js';

/** Resample a polyline to `n` evenly-spaced points by arc length. */
export function resample(pts, n) {
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = d[d.length - 1] || 1; const out = []; let s = 0;
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * tot;
    while (s < pts.length - 2 && d[s + 1] < t) s++;
    const sl = (d[s + 1] - d[s]) || 1, f = (t - d[s]) / sl;
    out.push([pts[s][0] + (pts[s + 1][0] - pts[s][0]) * f, pts[s][1] + (pts[s + 1][1] - pts[s][1]) * f]);
  }
  return out;
}

/** Closed ribbon outline around a polyline (so a transit line becomes a fillable shape, like the worm strokes). */
export function ribbon(poly, w) {
  const n = poly.length, Ls = [], Rs = [], h = w / 2;
  for (let i = 0; i < n; i++) {
    const a = poly[Math.max(0, i - 1)], b = poly[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    const nx = -dy * h, ny = dx * h;
    Ls.push([poly[i][0] + nx, poly[i][1] + ny]); Rs.push([poly[i][0] - nx, poly[i][1] - ny]);
  }
  return Ls.concat(Rs.reverse());
}

/**
 * Cut a ring with the vertical line x=xc at its two bottom-most crossings (a short chord across
 * the tube floor) → returns `[leftHalf, rightHalf]`, which still tile the original.
 */
export function splitRingAtX(ring, xc) {
  const cr = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    if ((a[0] - xc) * (b[0] - xc) < 0) { const t = (xc - a[0]) / (b[0] - a[0]); cr.push({ i, y: a[1] + (b[1] - a[1]) * t, pt: [xc, a[1] + (b[1] - a[1]) * t] }); }
  }
  cr.sort((p, q) => q.y - p.y);                 // bottom-most first = the U floor
  let A = cr[0], B = cr[1]; if (A.i > B.i) { const t = A; A = B; B = t; }
  const a1 = [A.pt]; for (let i = A.i + 1; i <= B.i; i++) a1.push(ring[i]); a1.push(B.pt);
  const a2 = [B.pt]; for (let i = B.i + 1; i < ring.length; i++) a2.push(ring[i]); for (let i = 0; i <= A.i; i++) a2.push(ring[i]); a2.push(A.pt);
  const cx = a => a.reduce((s, p) => s + p[0], 0) / a.length;
  return cx(a1) < cx(a2) ? [a1, a2] : [a2, a1];
}

/** Parse a #rrggbb colour into an [r, g, b] tuple. */
export function hx(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }

/** Interpolate between two [r, g, b] colours → `rgb(...)` string. */
export function mix(a, b, t) { return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`; }

/** easeInOutCubic. */
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Smoothstep from e0→e1 evaluated at x, clamped to [0, 1]. */
export const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

/** Serialize a point list as a closed SVG path `d` string. */
export function toPath(p) { let s = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1); for (let i = 1; i < p.length; i++) s += 'L' + p[i][0].toFixed(1) + ' ' + p[i][1].toFixed(1); return s + 'Z'; }

/** Resample a CLOSED ring to `n` evenly-spaced points; optionally carry a parallel scalar array. */
export function resampleClosedV(pts, vals, n) {
  const r = pts.concat([pts[0]]), v = vals ? vals.concat([vals[0]]) : null, d = [0];
  for (let i = 1; i < r.length; i++) d.push(d[i - 1] + Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]));
  const tot = d[d.length - 1] || 1, op = [], ov = v ? [] : null; let s = 0;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * tot; while (s < r.length - 2 && d[s + 1] < t) s++;
    const sl = (d[s + 1] - d[s]) || 1, f = (t - d[s]) / sl;
    op.push([r[s][0] + (r[s + 1][0] - r[s][0]) * f, r[s][1] + (r[s + 1][1] - r[s][1]) * f]);
    if (v) ov.push(v[s] + (v[s + 1] - v[s]) * f);
  }
  return { pts: op, vals: ov };
}

/** Closed ribbon outline + per-vertex arc position along the line (0 = head, 1 = tail). */
export function ribbonLP(poly, w) {
  const m = poly.length, Ls = [], Rs = [], lpL = [], lpR = [], h = w / 2;
  for (let i = 0; i < m; i++) {
    const a = poly[Math.max(0, i - 1)], b = poly[Math.min(m - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const mm = Math.hypot(dx, dy) || 1; dx /= mm; dy /= mm;
    const lp = i / (m - 1); Ls.push([poly[i][0] - dy * h, poly[i][1] + dx * h]); lpL.push(lp);
    Rs.push([poly[i][0] + dy * h, poly[i][1] - dx * h]); lpR.push(lp);
  }
  return { pts: Ls.concat(Rs.reverse()), lp: lpL.concat(lpR.reverse()) };
}

/**
 * Resample a src ring & dst ribbon to NP points and rotate/flip the src to best correspond
 * to the dst (minimises summed squared distance over candidate offsets/reversal).
 * Returns `{ S, D, lp }` — aligned source points, destination points, and dst arc params.
 */
export function prep(srcRing, dstObj) {
  const S = resampleClosedV(srcRing, null, NP).pts, D = resampleClosedV(dstObj.pts, dstObj.lp, NP);
  let best = { c: Infinity, off: 0, rev: false };
  for (const rev of [false, true]) {
    const SS = rev ? S.slice().reverse() : S;
    for (let off = 0; off < NP; off += 4) {
      let c = 0;
      for (let i = 0; i < NP; i += 8) { const a = SS[(i + off) % NP], b = D.pts[i], dx = a[0] - b[0], dy = a[1] - b[1]; c += dx * dx + dy * dy; }
      if (c < best.c) best = { c, off, rev };
    }
  }
  const SS = best.rev ? S.slice().reverse() : S, Sa = new Array(NP);
  for (let i = 0; i < NP; i++) Sa[i] = SS[(i + best.off) % NP];
  return { S: Sa, D: D.pts, lp: D.vals };
}
