/**
 * Share button: copies a link to the current view. The engine reads ?t=<0..1> on load
 * (morph progress, 0 = worm … 1 = finished map), so we map the live timeline position to it.
 */

import { getPos } from './render.js';

const btn = document.getElementById('share');
let resetT = null;

/** Current-view link: snaps to a landmark — 0 = worm, 1 = finished map (whichever the view is nearer). */
function shareUrl() {
  const t = Math.round(Math.max(0, Math.min(1, getPos() - 1)));
  return `${location.origin}${location.pathname}?t=${t}`;
}

async function copy(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* fall through to the legacy path */ }
  try {                                                    // fallback: non-secure contexts / older browsers
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}

btn.addEventListener('click', async () => {
  if (!(await copy(shareUrl()))) return;
  btn.classList.add('copied');
  btn.setAttribute('aria-label', 'Link copied');
  clearTimeout(resetT);
  resetT = setTimeout(() => {
    btn.classList.remove('copied');
    btn.setAttribute('aria-label', 'Copy a link to this view');
  }, 1600);
});
