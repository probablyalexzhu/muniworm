/**
 * Entry point. Importing the feature modules runs their one-time setup (build the SVG scene,
 * wire the controls / explorer / card). Then we set the opening state:
 *   ?t=<0..1> deep-links straight into the morph (0=worm … 1=map); otherwise start at the intro.
 */

import { setPos, renderMaster } from './render.js';
import { revealCase } from './stage.js';
import { landG, capsG, legendEl, showWinder } from './scene.js';
import './controls.js';   // arrow keys + winder
import './explorer.js';   // line hover / pin + keyboard
import './card.js';       // Clipper card drag → tap in
import './sound-toggle.js';   // mute button
import './help.js';           // ? key legend
import './share.js';          // copy a link to the current view

const qs = new URLSearchParams(location.search);
if (qs.has('t')) {
  const t = Math.max(0, Math.min(1, parseFloat(qs.get('t')) || 0));   // ?t = morph progress (0=worm .. 1=map) → POS 1..2
  const pos = 1 + t;
  setPos(pos); revealCase(); renderMaster(pos);
  if (pos >= 2) {                                                     // deep-linked straight to the map → no morph to protect, show the arrows
    landG.classList.add('show'); capsG.classList.add('show'); legendEl.classList.add('show'); showWinder();
  }
} else {
  setPos(0); renderMaster(0);   // intro: blank screen, worm armed to draw on first step
}
