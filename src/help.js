/**
 * Keyboard-legend popover, toggled by the ? button (top-right) or the ? key.
 * Non-modal: it just surfaces the otherwise-hidden controls; the keys keep working while it's open.
 */

const btn = document.getElementById('help');
const panel = document.getElementById('keys');

const isOpen = () => panel.classList.contains('open');
function setOpen(open) {
  panel.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
}

btn.addEventListener('click', e => { e.stopPropagation(); btn.classList.add('seen'); setOpen(!isOpen()); });   // clicking ? is the one mouse action that retires the ping

// click anywhere outside the panel (and not on the button) closes it
document.addEventListener('click', e => {
  if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
});

// any of the app's control keys proves the user found the keyboard → retire the attention ping (keyboard only)
const DISMISS_KEYS = new Set(['arrowleft', 'arrowright', 'home', 'end', 'escape', '?', 'i', 'j', 'k', 'l', 'm', 'n', 't']);
window.addEventListener('keydown', e => {
  if (DISMISS_KEYS.has(e.key.toLowerCase())) btn.classList.add('seen');
  if (e.key === '?') { e.preventDefault(); setOpen(!isOpen()); }          // ? toggles the legend
  else if (e.key === 'Escape' && isOpen()) setOpen(false);               // Esc closes it (explorer also clears any selection)
});
