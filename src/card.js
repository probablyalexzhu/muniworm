/**
 * Drag the Clipper card onto the reader to "tap in". The card pivots around the grab point
 * (held between two fingers): cursor velocity drags the body so it trails, swings and — with
 * fast circular motion — spins right around the cursor. Released, the flick carries it and
 * friction settles it wherever it lands. A hit on the reader starts the auto-play sequence.
 */

import { audio, sndPickup, sndPutdown, sndTap } from './audio.js';
import { startPlay } from './stage.js';

const reader = document.getElementById('reader'), card = document.getElementById('ccard');
const readerC = () => { const r = reader.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, rad: r.width / 2 }; };

/** Acknowledge a tap on the reader (visual flash + digital beep). */
function tapAccept() { audio(); reader.classList.add('tap'); sndTap(); setTimeout(() => reader.classList.remove('tap'), 700); }

let homeOff = { x: 0, y: 0 };   // the card's persistent offset from its CSS home — it stays wherever you drop it
/** Snap the card back to its CSS home (called when the experience rewinds to the intro). */
export function resetCard() { homeOff = { x: 0, y: 0 }; card.style.transition = ''; card.style.transform = 'translate(-50%,-50%)'; card.style.transformOrigin = ''; }

let drag = null, physReq = null;
const PULL = 0.055, DAMP = 1.8, REST = 2.2;   // PULL=how hard motion rotates it · DAMP=settle · REST=return-upright (loose = flickable)
function phys() {
  if (!drag) { physReq = null; return; }
  const dt = 1 / 60;
  if (drag.held) {                                          // following the cursor: motion drags the body around
    const vx = drag.px - drag.lpx, vy = drag.py - drag.lpy; drag.lpx = drag.px; drag.lpy = drag.py;
    drag.vx = vx; drag.vy = vy;                             // remember cursor velocity for the release flick
    const speed = Math.hypot(vx, vy);
    let aa = -DAMP * drag.omega;
    if (speed > 0.4) {
      const target = Math.atan2(-vy, -vx); let diff = target - drag.theta; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      aa += diff * Math.min(speed, 90) * PULL;
    }
    let dth = drag.theta - drag.restAng; dth = Math.atan2(Math.sin(dth), Math.cos(dth)); aa += -REST * dth;
    drag.omega += aa * dt; drag.theta += drag.omega * dt;
    drag.dx = drag.baseDx + (drag.px - drag.sx); drag.dy = drag.baseDy + (drag.py - drag.sy);   // absolute offset from home
  } else {                                                  // released: the flick carries it, friction stops it — it stays where it lands
    let dth = drag.theta - drag.restAng; dth = Math.atan2(Math.sin(dth), Math.cos(dth));
    drag.omega += (-DAMP * drag.omega - REST * dth) * dt; drag.theta += drag.omega * dt;
    drag.dx += drag.vx; drag.dy += drag.vy; drag.vx *= 0.9; drag.vy *= 0.9;
    if (Math.abs(drag.omega) < 0.04 && Math.abs(dth) < 0.01 && Math.hypot(drag.vx, drag.vy) < 0.25) {
      clampOff(drag); homeOff = { x: drag.dx, y: drag.dy };  // remember the new resting spot
      card.style.transform = `translate(-50%,-50%) translate(${drag.dx}px,${drag.dy}px) rotate(0deg)`;
      drag = null; physReq = null; return;
    }
  }
  clampOff(drag);                                           // keep the whole card on the page
  homeOff = { x: drag.dx, y: drag.dy };                     // track the live offset so a re-grab mid-settle picks up from here (no snap)
  const deg = (drag.theta - drag.restAng) * 180 / Math.PI;
  card.style.transform = `translate(-50%,-50%) translate(${drag.dx}px,${drag.dy}px) rotate(${deg}deg)`;
  physReq = requestAnimationFrame(phys);
}
function clampOff(d) {                                       // clamp the offset so the card centre stays within the viewport (kills velocity at the edge)
  if (d.dx < d.minDx) { d.dx = d.minDx; if (d.vx < 0) d.vx = 0; } else if (d.dx > d.maxDx) { d.dx = d.maxDx; if (d.vx > 0) d.vx = 0; }
  if (d.dy < d.minDy) { d.dy = d.minDy; if (d.vy < 0) d.vy = 0; } else if (d.dy > d.maxDy) { d.dy = d.maxDy; if (d.vy > 0) d.vy = 0; }
}

card.addEventListener('pointerdown', e => {
  e.preventDefault(); audio(); sndPickup();
  const r = card.getBoundingClientRect(), gx = e.clientX - r.left, gy = e.clientY - r.top;
  const restAng = Math.atan2(r.height / 2 - gy, r.width / 2 - gx);        // rod from grab point to card centre
  const hw = r.width / 2, hh = r.height / 2, M = 4, homeCx = r.left + hw - homeOff.x, homeCy = r.top + hh - homeOff.y;   // home center = current center minus the saved offset
  drag = {
    held: true, sx: e.clientX, sy: e.clientY, px: e.clientX, py: e.clientY, lpx: e.clientX, lpy: e.clientY, vx: 0, vy: 0,
    baseDx: homeOff.x, baseDy: homeOff.y, dx: homeOff.x, dy: homeOff.y, theta: restAng, omega: 0, restAng,
    restCx: r.left + hw, restCy: r.top + hh, homeCx, homeCy,    // resting centre + home centre, for the drop-onto-reader
    minDx: hw + M - homeCx, maxDx: innerWidth - hw - M - homeCx, minDy: hh + M - homeCy, maxDy: innerHeight - hh - M - homeCy,
  };
  card.style.transformOrigin = `${gx}px ${gy}px`; card.style.transition = 'none'; card.classList.add('dragging');
  card.setPointerCapture(e.pointerId); if (!physReq) physReq = requestAnimationFrame(phys);
});
card.addEventListener('pointermove', e => {
  if (!drag || !drag.held) return; drag.px = e.clientX; drag.py = e.clientY;
  const c = readerC(); reader.classList.toggle('armed', Math.hypot(drag.px - c.x, drag.py - c.y) < c.rad * 1.15);
});
card.addEventListener('pointerup', e => {
  if (!drag) return;
  const c = readerC(), hit = Math.hypot(drag.px - c.x, drag.py - c.y) < c.rad * 1.2;
  card.classList.remove('dragging'); reader.classList.remove('armed');
  if (hit) {
    // land somewhere ON the reader, not dead-centre — a little human jitter in position + tilt
    const jx = (Math.random() * 2 - 1) * c.rad * 0.26, jy = (Math.random() * 2 - 1) * c.rad * 0.26, jr = (Math.random() * 2 - 1) * 7;
    const tx = c.x + jx - drag.homeCx, ty = c.y + jy - drag.homeCy; drag = null;   // offset from home so it lands centred on the reader
    if (physReq) { cancelAnimationFrame(physReq); physReq = null; }
    card.style.transition = 'transform .24s cubic-bezier(.3,.85,.3,1)';   // "fall" flat onto the reader (glide + settle slightly askew)
    card.style.transform = `translate(-50%,-50%) translate(${tx}px,${ty}px) rotate(${jr.toFixed(2)}deg)`;
    tapAccept();
    setTimeout(startPlay, 1000);                                // hold a beat on the reader, then the worm appears + morph
  } else { drag.held = false; sndPutdown(); }                   // dropped off the reader: soft put-down, then the flick carries home via physics
});
card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapAccept(); setTimeout(startPlay, 900); } });  // a11y fallback
