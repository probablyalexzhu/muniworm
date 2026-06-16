/**
 * The timeline engine. Master position POS spans two phases: 0→1 draws the worm, 1→2 morphs
 * worm → map (morph T = POS-1). Both phases are position-driven, so the whole thing scrubs /
 * winds / unwinds. This module owns POS and exposes animateTo + accessors for the controls layer.
 */

import { STEP, SPAN, LAG, COLOR_FRAC, NP } from './config.js';
import { TARGETS, RANK } from './data.js';
import { ease, mix, toPath } from './geometry.js';
import { MORPH, BASE, DST, wormG } from './morph.js';
import { paths, hitPaths, linesG, stationsG, legendChips } from './scene.js';
import { sndLine } from './audio.js';
import { armWorm, setWormFull, renderDraw, drawCues } from './draw.js';
import { clearSelection } from './explorer.js';

const SEQ = TARGETS.map(k => RANK[k]);   // stagger rank per morph element

// --- timeline state (private) ---
let POS = 0;            // 0=blank, 1=drawn worm, 2=finished map
let raf = null;         // in-flight rAF id (null when settled)
let aim = 1;            // in-flight target (for mid-flight stepping)
let wormMode = null;    // 'draw' | 'full' — avoids per-frame restyle thrash
let prevRenderT = 0;    // last morph T seen by render() — catches each line's threshold crossing for its tone
let prevDrawD = 0;      // last draw-fraction seen by renderMaster() — lets drawCues() catch glyph + ink-flood crossings

export const getPos = () => POS;
export const getAim = () => aim;
export const isAnimating = () => raf != null;
/** Set the position state directly (no animation). Used by bootstrap + the play sequence. */
export function setPos(p) { POS = p; aim = p; }

/* ---------- morph render (T = POS-1, 0..1) ---------- */
function render(T) {
  for (let i = 0; i < paths.length; i++) {
    const start = SEQ[i] * STEP;
    const p = Math.min(1, Math.max(0, (T - start) / SPAN));     // this line's window progress
    const cp = Math.min(1, p / COLOR_FRAC);                     // colour phase (in place)
    const mp = Math.max(0, (p - COLOR_FRAC) / (1 - COLOR_FRAC));// movement phase (snake)
    const M = MORPH[i], S = M.S, D = M.D, lp = M.lp, pts = new Array(NP);
    for (let j = 0; j < NP; j++) {
      const lt = ease(Math.min(1, Math.max(0, mp * (1 + LAG) - lp[j] * LAG)));   // arc-phased: head first
      pts[j] = [S[j][0] + (D[j][0] - S[j][0]) * lt, S[j][1] + (D[j][1] - S[j][1]) * lt];
    }
    const dstr = toPath(pts); paths[i].setAttribute('d', dstr); hitPaths[i].setAttribute('d', dstr);   // hit layer mirrors the line geometry
    paths[i].setAttribute('fill', mix(BASE[i], DST[i], ease(cp)));
  }
  // hard hand-off: T=0 → crisp worm only; the instant morph begins → glowing lines only.
  // (a cross-fade here would dip through the dark bg and read as a "darker flash")
  const lit = T > 0.012;
  wormG.style.opacity = lit ? 0 : 1;
  linesG.style.opacity = lit ? 1 : 0;
  stationsG.style.opacity = Math.max(0, (T - 0.78) / 0.22).toFixed(2);

  legendChips.forEach((r) => {
    if (r.key === 'WORM') { r.el.classList.toggle('on', T >= 1); return; }   // the worm isn't a morphing line — it just lights with the finished map
    r.el.classList.toggle('on', T > (r.rank + 0.85) * STEP);  // chip lights only once the line has fully landed
    // tone fires just inside each line's window, as it BEGINS peeling. The 0.15 offset keeps the
    // threshold off the arrow-key stop boundaries (which land on exact sixths) — otherwise a single
    // step would straddle two thresholds (double note) and resting on a boundary would let a tiny
    // reversal re-fire it (wind+unwind both). One stop step now crosses exactly one threshold.
    const th = (r.rank + 0.15) * STEP;
    if (T > th && !(prevRenderT > th)) sndLine(r.rank, 1);     // crossed forward: line starts peeling out → rising note
    else if (prevRenderT > th && !(T > th)) sndLine(r.rank, -1); // crossed backward: line folds back in → falling note
  });
  prevRenderT = T;
  document.body.classList.toggle('map-ready', T >= 1);   // only the finished map is interactive (lines selectable)
  if (T < 1) clearSelection();                           // stepping/folding away from the map drops any line selection
}

/* ---------- master scrubber: route a position to the draw or morph phase ---------- */
export function renderMaster(pos) {
  if (pos < 1) {                                          // DRAW phase: the worm traces itself; lines + stations hidden
    if (wormMode !== 'draw') { armWorm(); wormMode = 'draw'; }
    wormG.style.opacity = 1; linesG.style.opacity = 0; stationsG.style.opacity = 0;
    legendChips.forEach(r => r.el.classList.remove('on'));
    renderDraw(pos);
    drawCues(pos, prevDrawD); prevDrawD = pos;            // glyph ticks + ink-flood
  } else {                                                // MORPH phase: hand off to the T-driven renderer
    if (wormMode !== 'full') { setWormFull(); wormMode = 'full'; }
    render(pos - 1);
  }
}

/** Tween POS toward `target` over ~`dur` ms (distance-scaled), rendering each frame; `onDone` fires when settled. */
export function animateTo(target, dur, onDone) {
  cancelAnimationFrame(raf); aim = target;
  const start = POS, t0 = performance.now(), d = Math.abs(target - start) * dur + 120;
  (function step(now) {
    const k = Math.min(1, (now - t0) / d); POS = start + (target - start) * k; renderMaster(POS);
    if (k < 1) raf = requestAnimationFrame(step); else { POS = target; raf = null; if (onDone) onDone(); }
  })(t0);
}
