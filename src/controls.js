/**
 * Arrow keys + winder buttons: step the timeline one line at a time (J K L M N T), hold or mash
 * to fly through. The slideshow chain is:
 *   intro (caseShown=false) ↔ draw the worm (POS 0→1) ↔ morph stops ↔ finished map (POS 2)
 */

import { STEP, SPAN } from './config.js';
import { animateTo, getPos, getAim, isAnimating } from './render.js';
import { getCaseShown, revealCase, exitToIntro } from './stage.js';
import { landG, capsG, legendEl, windPrev, windNext, pressKey, showWinder, flashStopSign } from './scene.js';
import { audio, sndDing } from './audio.js';

// stops in master-POS space: 1 = drawn worm · then one stop per line peeling off · 2 = finished map
const STOPS = [1].concat([0, 1, 2, 3, 4, 5].map(r => 1 + Math.min(1, r * STEP + SPAN)));
let lastStep = 0, lastDing = 0;

function goTo(target, dur) {
  audio();
  if (target > 0.02) revealCase();
  const done = target >= 2;
  landG.classList.toggle('show', done); capsG.classList.toggle('show', done); legendEl.classList.toggle('show', done);
  animateTo(target, dur, null);   // no arrival chime — the per-line rising scale carries the finish
}

function stepStage(dir, fast) {
  document.body.classList.add('stepped');                        // user has wound at least once → retire the coach tip
  if (!getCaseShown()) { if (dir > 0) goTo(1, 1500); return; }   // from the intro: right zooms in AND draws the worm; left does nothing
  const base = isAnimating() ? getAim() : getPos();             // mid-flight: step off the in-flight target so mashing/holding keeps advancing
  // Fold back to the intro only once we've ACTUALLY reached the worm — gate on real POS, not the in-flight aim.
  // While holding the key, aim races ahead of POS; exiting on aim would hand a half-finished morph to the slow
  // 2400ms/unit intro tween, so the last few lines would crawl. Until POS arrives, keep stepping toward POS=1.
  if (dir < 0 && getAim() <= 1 + 1e-3 && getPos() <= 1 + 1e-3) { exitToIntro(); return; }
  let target;
  if (dir > 0) {
    target = STOPS.find(s => s > base + 1e-3);
    if (target == null) {                                       // nothing further to wind toward
      if (getPos() >= 2 - 1e-3) {                               // already AT the finished map: pressing right does nothing on screen
        const now = performance.now();
        if (now - lastDing > 900) { lastDing = now; sndDing(); flashStopSign(); } // ring the chime + light the "STOP REQUEST" marquee (debounced so a held key can't stack them)
        return;
      }
      target = 2;                                               // still winding the final segment in → let it finish (an on-screen action, no chime)
    }
  } else {
    const p = STOPS.filter(s => s < base - 1e-3); target = p.length ? p[p.length - 1] : 1;
  }
  goTo(target, fast ? 90 : 900);   // snappy; near-instant when holding/mashing so stages fly past
}

windPrev.addEventListener('animationend', () => windPrev.classList.remove('press'));
windNext.addEventListener('animationend', () => windNext.classList.remove('press'));
windPrev.addEventListener('click', () => { pressKey(windPrev); stepStage(-1, false); });
windNext.addEventListener('click', () => { pressKey(windNext); stepStage(1, false); });

window.addEventListener('keydown', e => {
  const now = performance.now(), fast = e.repeat || (now - lastStep < 260); lastStep = now;   // held key or rapid taps → accelerate
  if (e.key === 'ArrowRight') { e.preventDefault(); showWinder(); pressKey(windNext); stepStage(1, fast); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); showWinder(); pressKey(windPrev); stepStage(-1, fast); }
  else if (e.key === 'Home') { e.preventDefault(); goTo(1, 700); }   // jump to the worm
  else if (e.key === 'End') { e.preventDefault(); goTo(2, 700); }    // jump to the finished map
});
