// Geometry of a programmable interferometer mesh (rectangular, Clements-style),
// shared by the WebGL hero scene and its static SVG fallback.

export const WAVEGUIDES = 8;
export const COLUMNS = 9;
export const X_START = -6.4;
export const X_END = 6.4;
export const SPACING = 0.62;
export const GAP = 0.14;
export const COUPLER_WIDTH = 0.9;

const span = X_END - X_START;
const margin = 1.0;

export const columnX = (c: number) =>
  X_START + margin + (c * (span - 2 * margin)) / (COLUMNS - 1);

export const baseY = (w: number) => (w - (WAVEGUIDES - 1) / 2) * SPACING;

export type Coupler = { column: number; lower: number; x: number; y: number };

export const couplers: Coupler[] = (() => {
  const list: Coupler[] = [];
  for (let c = 0; c < COLUMNS; c++) {
    for (let i = c % 2; i + 1 < WAVEGUIDES; i += 2) {
      list.push({ column: c, lower: i, x: columnX(c), y: (baseY(i) + baseY(i + 1)) / 2 });
    }
  }
  return list;
})();

const bump = (dx: number) => {
  const h = COUPLER_WIDTH / 2;
  if (Math.abs(dx) >= h) return 0;
  const t = Math.cos((dx / h) * (Math.PI / 2));
  return t * t;
};

/** Vertical position of waveguide `w` at horizontal position `x`. */
export function waveguideY(w: number, x: number): number {
  let y = baseY(w);
  const pull = (SPACING - GAP) / 2;
  for (let c = 0; c < COLUMNS; c++) {
    const b = bump(x - columnX(c));
    if (b === 0) continue;
    const lowerOfPair = (w - (c % 2)) % 2 === 0;
    if (lowerOfPair && w + 1 < WAVEGUIDES) y += pull * b;
    else if (!lowerOfPair && w - 1 >= 0) y -= pull * b;
  }
  return y;
}

/** Sampled polyline for waveguide `w`. */
export function waveguidePoints(w: number, samples = 220): [number, number][] {
  const pts: [number, number][] = [];
  for (let s = 0; s <= samples; s++) {
    const x = X_START + (s / samples) * span;
    pts.push([x, waveguideY(w, x)]);
  }
  return pts;
}

/** Index of the coupler column a pulse at `x` has just passed, or -1. */
export function columnAt(x: number): number {
  for (let c = COLUMNS - 1; c >= 0; c--) if (x >= columnX(c)) return c;
  return -1;
}

/** Partner waveguide of `w` in column `c`, or -1 if `w` is unpaired there. */
export function partnerIn(c: number, w: number): number {
  const lowerOfPair = (w - (c % 2)) % 2 === 0;
  const p = lowerOfPair ? w + 1 : w - 1;
  return p >= 0 && p < WAVEGUIDES ? p : -1;
}
