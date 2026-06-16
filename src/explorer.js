/**
 * Line explorer: hover or tap a line on the finished map for its story; the rest of the map
 * dims away. The worm is selectable like a line (it tells the logo's story instead of a route).
 * `clearSelection` is called by the render loop whenever we leave the finished-map state.
 */

import { TARGETS, RANK, META, INFO, WORM_BLUE, WORM_TEXT } from './data.js';
import { paths, hitPaths, capsG, landG, legendEl, legendChips, liftLine, clearLifts, pressKey } from './scene.js';
import { wormG } from './morph.js';
import { sndLine } from './audio.js';

const screenEl = document.getElementById('stage');
const panel = document.getElementById('lineinfo');
const piBadge = panel.querySelector('.li-badge'), piName = panel.querySelector('.li-name'),
  piSub = panel.querySelector('.li-sub'), piText = panel.querySelector('.li-text'),
  piFrom = panel.querySelector('.li-from'), piTo = panel.querySelector('.li-to');

let pinned = null, hovered = null;   // pinned = typed/clicked (sticky); hovered = pointer preview. Hover wins while present, else falls back to the pinned line.
let dropTimer = null;                // pending hover-clear; held briefly so hopping between lines doesn't flash the map
const HOVER_LINGER = 180;            // ms the focus lingers after the pointer leaves a line
const isReady = () => document.body.classList.contains('map-ready');
const eff = () => hovered || pinned;

let hoverLockUntil = 0;   // hover is ignored until this time — keeps a stationary pointer from dimming the map during the big reveal
/** Briefly ignore hover (called by render the moment the map lands) so the caps/legend reveal isn't pre-dimmed. */
export function suppressHover(ms) { hoverLockUntil = performance.now() + ms; }

function paint() {
  const k = eff(); const line = !!k && k !== 'WORM';   // the worm is selectable like a line, but it's not on the map
  paths.forEach((p, i) => { const me = TARGETS[i] === k; p.classList.toggle('hot', me); p.classList.toggle('dim', !!k && !me); });
  if (line) liftLine(k); else clearLifts();   // raise ONLY the focused line (above the caps); dimmed lines stay put so their opacity fade isn't cancelled by a DOM move
  landG.classList.toggle('dim', !!k); capsG.classList.toggle('dim', !!k);
  legendChips.forEach(c => { c.el.classList.toggle('cur', c.key === k); c.el.classList.toggle('mut', !!k && c.key !== k); });
  panel.classList.toggle('worm', k === 'WORM');
  // bring the original "muni" logo back, exactly where it sat before the morph (it IS the morph source)
  if (k === 'WORM') { wormG.classList.add('reveal'); wormG.style.opacity = '1'; }
  else { wormG.classList.remove('reveal'); wormG.style.opacity = '0'; }
  if (k === 'WORM') {                                  // the worm tells the logo's story, not a route
    panel.style.setProperty('--c', WORM_BLUE);
    piBadge.textContent = ''; piName.textContent = 'The Worm';        // badge image comes from CSS (.lineinfo.worm .li-badge)
    piSub.textContent = 'Muni wordmark · Landor 1975'; piText.textContent = WORM_TEXT;
    piFrom.textContent = 'Adopted 1975'; piTo.textContent = 'Still in service';
    panel.classList.add('show'); document.body.classList.add('line-selected');
  } else if (k) {
    const m = META[k], info = INFO[k];
    panel.style.setProperty('--c', m.color);
    piBadge.textContent = k; piName.textContent = m.name; piText.textContent = info.text;
    piSub.textContent = `Muni Metro · Opened ${info.year}`;
    piFrom.textContent = info.from; piTo.textContent = info.to;
    panel.classList.add('show'); document.body.classList.add('line-selected');
  } else { panel.classList.remove('show'); document.body.classList.remove('line-selected'); }
}

function setHover(k) {
  clearTimeout(dropTimer); dropTimer = null;   // entering a line cancels any pending clear → seamless line-to-line hops
  if (!isReady() || performance.now() < hoverLockUntil || hovered === k) return;
  hovered = k; sndLine(k === 'WORM' ? 6 : RANK[k], 1); paint();   // ring the line's note on hover (once per line entered), same chime as a pin
}
// leaving a line / the route list drops the preview — but on a short timer, so darting to a neighbouring
// line cancels it first and the map never flashes back to its un-dimmed state in between.
function dropHover() {
  if (hovered === null || dropTimer) return;
  dropTimer = setTimeout(() => { dropTimer = null; hovered = null; paint(); }, HOVER_LINGER);
}
function togglePin(k) {
  if (!isReady()) return;
  sndLine(k === 'WORM' ? 6 : RANK[k], 1);              // ring the line's note
  const c = legendChips.find(c => c.key === k); if (c) pressKey(c.el);   // depress-flash the chip, same as the arrow keys
  pinned = pinned === k ? null : k; paint();           // type a letter or click a line/chip to lock it; same again releases it
}
/** Drop any pinned/hovered selection (called by render when we leave the finished map). */
export function clearSelection() {
  clearTimeout(dropTimer); dropTimer = null;   // cancel any lingering hover-clear so it can't repaint after we've left
  if (pinned === null && hovered === null) return;
  pinned = null; hovered = null; paint();
}

// hover previews, click/tap pins. Events live on the fixed hit layer (not the reordered visible lines),
// and the legend chip is a bigger, easier target than the thin ribbon.
hitPaths.forEach((h, i) => {
  const k = TARGETS[i];
  h.addEventListener('pointerenter', () => setHover(k)); h.addEventListener('pointerleave', dropHover); h.addEventListener('click', () => togglePin(k));
});
legendChips.forEach(c => {
  c.el.addEventListener('pointerenter', () => setHover(c.key)); c.el.addEventListener('click', () => togglePin(c.key));
  c.el.addEventListener('animationend', () => c.el.classList.remove('press'));   // clear the depress-flash when it finishes
});
legendEl.addEventListener('pointerleave', dropHover);   // leave the route list → drop the focus on the most-recently-hovered route
// click empty map → clear; the panel lives outside the screen so clicking it won't dismiss
screenEl.addEventListener('click', e => { if (e.target.closest('.legend') || (e.target.classList && e.target.classList.contains('lnhit'))) return; clearSelection(); });
// keyboard: J K L M N T toggle that line's focus; I → the worm's story; Esc clears
addEventListener('keydown', e => {
  if (e.key === 'Escape') { clearSelection(); return; }
  if (!isReady() || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toUpperCase();
  if (k === 'I') { e.preventDefault(); togglePin('WORM'); }
  else if (k.length === 1 && 'JKLMNT'.indexOf(k) >= 0) { e.preventDefault(); togglePin(k); }
});
