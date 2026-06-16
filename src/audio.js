/**
 * Synthesized transit sounds — no asset files, everything built with the Web Audio API.
 * One AudioContext is created lazily on the first user gesture and reused.
 */

let actx = null;
let master = null;          // every sound routes through here, so one gain mutes the whole piece
let muted = false;
try { muted = localStorage.getItem('muni-muted') === '1'; } catch (e) { /* storage blocked */ }

/** Lazily create / resume the shared AudioContext + master gain. Returns null if Web Audio is unavailable. */
export function audio() {
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
  } catch (e) { /* no audio available */ }
  return actx;
}

/** Mute / unmute everything; the choice persists across visits. */
export function setMuted(m) {
  muted = !!m;
  try { localStorage.setItem('muni-muted', muted ? '1' : '0'); } catch (e) { /* storage blocked */ }
  if (master && actx) master.gain.setTargetAtTime(muted ? 0 : 1, actx.currentTime, 0.015);   // short ramp avoids a click
}
/** Current mute state (read on load to set the button's initial look). */
export function isMuted() { return muted; }

/** A short tonal blip with optional pitch slide. */
function blip(freq, o) {
  o = o || {}; const c = audio(); if (!c) return; const t = c.currentTime + (o.t || 0), dur = o.dur || .15;
  const osc = c.createOscillator(), g = c.createGain(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(freq, t);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + dur);
  const v = o.vol == null ? .2 : o.vol; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(g); g.connect(master); osc.start(t); osc.stop(t + dur + .03);
}

/** A short decaying noise burst through a bandpass → a dry, plasticky "tick/tap" (card handling). */
function clack(o) {
  o = o || {}; const c = audio(); if (!c) return; const t = c.currentTime + (o.t || 0), dur = o.dur || .06;
  const len = Math.max(1, Math.ceil(c.sampleRate * dur)), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, o.decay || 2.4);   // exponential-ish decay envelope
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = o.freq || 1100; bp.Q.value = o.q || 0.7;
  const g = c.createGain(); g.gain.value = o.vol == null ? .16 : o.vol;
  src.connect(bp); bp.connect(g); g.connect(master); src.start(t); src.stop(t + dur + .02);
}

/* ---------- Clipper fare-gate accept ----------
   The real gate's high "ding" (~2877 Hz) is a struck, inharmonic tone: a sub-octave partial gives
   it body, upper partials decay fast, and a gentle low-pass tames the top. The ding is immediately
   followed by the mechanical click of the gate flap releasing open. */
const GATE_PARTIALS = [[0.5, 0.55, 1.25], [1.0, 1.00, 1.00], [2.0, 0.14, 0.45], [2.76, 0.07, 0.35]];   // [freq ratio, rel gain, decay scale]
function gateDing(freq, decay, tame, gain) {
  const c = audio(); if (!c) return;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = tame; lp.Q.value = 0.7; lp.connect(master);
  const at = c.currentTime + 0.02;
  GATE_PARTIALS.forEach(([ratio, amp, decScale]) => {
    const tEnd = at + decay * decScale;
    const g = c.createGain(); g.gain.setValueAtTime(gain * amp, at); g.gain.exponentialRampToValueAtTime(.0001, tEnd);   // struck → ring out
    const osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq * ratio;
    osc.connect(g); g.connect(lp); osc.start(at); osc.stop(tEnd + .02);
  });
}
/** Reader accept: the Clipper gate ding. */
export const sndTap = () => gateDing(2877, 0.55, 6500, .3);

/* ---------- SF Muni "stop requested" chime ----------
   A struck bell, not a held beep: instant attack, immediate exponential ring-out, no sustain.
   Inharmonic partials (non-integer freq ratios that decay faster) give the metallic ding; two
   strikes, a short one then a longer ring. A gentle low-pass tames the upper partials. */
const BELL_PARTIALS = [[1, 1, 1], [2.76, .40, .65], [5.40, .22, .45], [8.93, .11, .30]];   // [freq ratio, rel gain, decay scale]
function ding(dest, at, freq, decay, gain) {
  const c = audio(); if (!c) return;
  BELL_PARTIALS.forEach(([ratio, amp, dec]) => {
    const tEnd = at + decay * dec;
    const g = c.createGain(); g.gain.setValueAtTime(gain * amp, at); g.gain.exponentialRampToValueAtTime(.0001, tEnd);   // struck → ring out
    const osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq * ratio;
    osc.connect(g); g.connect(dest); osc.start(at); osc.stop(tEnd + .02);
  });
}
export const sndDing = () => {
  const c = audio(); if (!c) return;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000; lp.Q.value = .7; lp.connect(master);
  const freq = 1172, gain = .4, t0 = c.currentTime + .02;
  ding(lp, t0, freq, .35, gain);            // short strike
  ding(lp, t0 + .26, freq, .90, gain);      // longer ringing strike
};

/* ---------- per-route tone ----------
   Each line owns one note of a rising major-pentatonic scale, in route order J K L M N T (the worm
   caps it with E6). It sounds the instant the line peels out of the worm; wind forward and the scale
   climbs, unwind and the same notes fire in reverse. */
const LINE_SCALE = [523.25, 587.33, 659.25, 783.99, 987.77, 1046.50, 1318.51];   // C5 D5 E5 G5 B5 C6 E6
export function sndLine(rank, dir) {
  const f = LINE_SCALE[rank]; if (f == null) return;
  if (dir >= 0) blip(f, { type: 'sine', dur: .42, vol: .17 });                  // appear: a clean bell at the line's pitch
  else blip(f, { type: 'triangle', dur: .30, vol: .10, slide: f * 0.82 });       // disappear: softer, bent downward as it folds away
}

/** The crimson fill flooding into the finished outline → one warm low swell (soft attack, unlike the struck sounds). */
export function sndInkFlood() {
  const c = audio(); if (!c) return; const t = c.currentTime;
  const osc = c.createOscillator(); osc.type = 'triangle'; osc.frequency.setValueAtTime(90, t); osc.frequency.exponentialRampToValueAtTime(170, t + .5);
  const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.2, t + .12); g.gain.exponentialRampToValueAtTime(.0001, t + .7);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
  osc.connect(g); g.connect(lp); lp.connect(master); osc.start(t); osc.stop(t + .75);
}

/** A soft "tick" as the pen catches each glyph of the worm outline while drawing. */
export const sndGlyphTick = () => clack({ freq: 1500, dur: .03, vol: .05, decay: 3.4 });

/** Light lift of the Clipper card off the surface (rising). */
export const sndPickup = () => { clack({ freq: 1650, dur: .05, vol: .13, decay: 3.2 }); blip(520, { slide: 700, type: 'triangle', dur: .05, vol: .05 }); };
/** Set the card back down — a soft, lower "tup" (falling). */
export const sndPutdown = () => { clack({ freq: 780, dur: .075, vol: .17, decay: 2.0 }); blip(320, { slide: 210, type: 'triangle', dur: .07, vol: .06 }); };
