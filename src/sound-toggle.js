/**
 * Mute toggle wiring. Audio routes through a master gain (see audio.js), so this just flips
 * that gain and reflects the state on the button. The choice persists across visits.
 */

import { setMuted, isMuted } from './audio.js';

const btn = document.getElementById('mute');

/** Sync the button's look + a11y state to the current mute value. */
function sync() {
  const m = isMuted();
  btn.classList.toggle('muted', m);
  btn.setAttribute('aria-pressed', String(m));
  btn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
}

btn.addEventListener('click', () => { setMuted(!isMuted()); sync(); });
sync();   // honour the persisted state on load
