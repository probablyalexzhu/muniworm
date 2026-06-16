/**
 * Progressive reveal: tap in → the case dives through the glass to a fullscreen morph → click
 * to tap off. Also owns the auto-play sequence (draw the worm, beat, morph into the map).
 *
 * Note: this module and card.js reference each other (stage.startPlay ↔ card.resetCard). Both
 * are only invoked from event handlers at runtime, so the ES-module cycle resolves cleanly.
 */

import { DRAW_MS, MORPH_MS } from './config.js';
import { animateTo, renderMaster, setPos } from './render.js';
import { landG, capsG, legendEl, showWinder } from './scene.js';
import { resetCard } from './card.js';

const caseEl = document.getElementById('case');
const hint = document.getElementById('hint'), exitHint = document.getElementById('exit');
let caseShown = false;

export const getCaseShown = () => caseShown;

/**
 * Dive through the glass into the fullscreen morph. The case is full-bleed via CSS (position:fixed
 * inset:0), so there's no sizing math here — adding `.shown` runs the CSS zoom from .82 → 1, and
 * the screen fills the viewport at any aspect ratio. Resizing/rotating is handled by CSS for free.
 */
export function revealCase() {
  if (caseShown) return; caseShown = true;
  document.body.classList.add('playing');                 // dim+blur the platform; fade the intro pieces away
  hint.classList.add('gone'); caseEl.classList.add('shown');
}

/** Fold the map back into the worm and rewind to the intro platform. */
export function exitToIntro() {
  if (!caseShown) return; caseShown = false;   // flip immediately so held-left repeats don't keep restarting (and cancelling) this exit's tween
  exitHint.classList.remove('show'); landG.classList.remove('show'); capsG.classList.remove('show'); legendEl.classList.remove('show');
  animateTo(0, 2400, () => {
    document.body.classList.remove('playing');
    caseEl.classList.remove('shown'); resetCard(); hint.classList.remove('gone');
  });
}

/** The auto-play sequence: blank screen, zoom in, the worm draws itself, beat, then morph into the map. */
export function startPlay() {
  setPos(0); renderMaster(0); revealCase();
  setTimeout(() => animateTo(1, DRAW_MS, () => {                       // the worm draws itself...
    setTimeout(() => animateTo(2, MORPH_MS, () => {                    // ...beat, then morph into the map
      landG.classList.add('show'); capsG.classList.add('show'); legendEl.classList.add('show'); showWinder();
    }), 650);
  }), 450);   // let the zoom settle, then the pen starts
}
