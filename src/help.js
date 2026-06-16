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

btn.addEventListener('click', e => { e.stopPropagation(); setOpen(!isOpen()); });

// click anywhere outside the panel (and not on the button) closes it
document.addEventListener('click', e => {
  if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
});

window.addEventListener('keydown', e => {
  if (e.key === '?') { e.preventDefault(); setOpen(!isOpen()); }          // ? toggles the legend
  else if (e.key === 'Escape' && isOpen()) setOpen(false);               // Esc closes it (explorer also clears any selection)
});
