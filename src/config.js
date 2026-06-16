/**
 * Tunable constants for the worm→map experience.
 * Pacing, layout offsets and morph resolution all live here so a designer can adjust
 * the feel of the piece without hunting through the engine code.
 */

/** Points each closed ring is resampled to for the morph (higher = smoother, slower to build). */
export const NP = 520;

/** Morph timeline is split into 6 equal, non-overlapping windows — one per line, in route order. */
export const STEP = 1 / 6;
export const SPAN = 1 / 6;

/** Head→tail spread within a line's window: the head settles before the tail follows. */
export const LAG = 1.3;
/** First fraction of each line's window recolours it in place; the remainder snakes it out. */
export const COLOR_FRAC = 0.34;

/** Auto-play pacing (ms): the worm draws itself, then morphs into the map. */
export const DRAW_MS = 2700;
export const MORPH_MS = 9000;

/** Push the finished map's line destinations down a touch so it sits centred in the frame. */
export const MAP_DROP = 30;

/** Perpendicular spacing (px) between lines sharing the Market St subway trunk. */
export const OFF_SP = 10;
