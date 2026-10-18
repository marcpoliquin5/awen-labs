// Point formations for the shared background scene. Each formation fills the
// same number of points with "base" parameters; the vertex shader animates
// them (see BackgroundCanvas). Seeds: x random, y group, z flag, w random.
import { COUPLER_WIDTH, WAVEGUIDES, X_END, X_START, couplers, waveguideY } from "@/components/landing/meshLayout";
import type { SceneMode } from "@/lib/sceneStore";

export type Formation = { pos: Float32Array; seed: Float32Array };

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function lattice(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const nodePts = Math.floor(n * 0.16);
  const rx = -0.42, ry = -0.32;
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  const put = (i: number, x: number, y: number, z: number) => {
    // Tilt the mesh like the original hero: rotate X then Y, then offset.
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
    pos.set([x2 + 0.6, y1 - 0.2, z2], i * 3);
  };
  for (let i = 0; i < n; i++) {
    if (i < nodePts) {
      const k = couplers[i % couplers.length];
      const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * COUPLER_WIDTH * 0.18;
      put(i, k.x + Math.cos(a) * rad * 1.6, k.y + Math.sin(a) * rad, (r() - 0.5) * 0.05);
      seed.set([r(), k.column, 1, r()], i * 4);
    } else {
      const w = i % WAVEGUIDES;
      const x = X_START + r() * (X_END - X_START);
      put(i, x, waveguideY(w, x) + (r() - 0.5) * 0.02, (r() - 0.5) * 0.02);
      seed.set([r(), w, 0, r()], i * 4);
    }
  }
  return { pos, seed };
}

function stack(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const layers = 6;
  for (let i = 0; i < n; i++) {
    const layer = i % layers;
    const size = 3.4 - layer * 0.18;
    const edge = r() < 0.35;
    let x: number, z: number;
    if (edge) {
      const t = r() * 4, side = Math.floor(t), f = t - side;
      const a = -size / 2 + f * size;
      [x, z] = side === 0 ? [a, -size / 2] : side === 1 ? [size / 2, a] : side === 2 ? [-a, size / 2] : [-size / 2, -a];
    } else {
      const g = 14, gx = Math.floor(r() * g), gz = Math.floor(r() * g);
      x = -size / 2 + (gx + 0.5) * (size / g);
      z = -size / 2 + (gz + 0.5) * (size / g);
    }
    pos.set([x, 0, z], i * 3);
    seed.set([r(), layer, edge ? 1 : 0, r()], i * 4);
  }
  return { pos, seed };
}

function timeline(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const milestones = [-4.2, 0, 4.2];
  for (let i = 0; i < n; i++) {
    if (i % 6 === 0) {
      const k = Math.floor(i / 6) % 3;
      const m = milestones[k];
      const u = r() * 2 - 1, a = r() * Math.PI * 2, rad = 0.45 + r() * 0.15;
      const s = Math.sqrt(1 - u * u);
      pos.set([m + rad * s * Math.cos(a), rad * u, rad * s * Math.sin(a)], i * 3);
      seed.set([r(), k, 1, r()], i * 4);
    } else {
      const x = -7 + r() * 14;
      pos.set([x, r() * Math.PI * 2, 0.15 + Math.pow(r(), 1.6) * 1.1], i * 3); // x, angle, radius
      seed.set([r(), Math.floor(r() * 3), 0, r()], i * 4);
    }
  }
  return { pos, seed };
}

function interference(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = i % side, gz = Math.floor(i / side);
    const x = -6 + (gx / (side - 1)) * 12 + (r() - 0.5) * 0.04;
    const z = -4 + (gz / (side - 1)) * 8 + (r() - 0.5) * 0.04;
    pos.set([x, 0, z], i * 3);
    seed.set([r(), 0, 0, r()], i * 4);
  }
  return { pos, seed };
}

function streams(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const cols = 64;
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const x = -7.5 + (c / (cols - 1)) * 15;
    const z = -3 + ((c * 7919) % 97) / 97 * 4;
    pos.set([x, -5 + r() * 10, z], i * 3);
    seed.set([((c * 31) % 17) / 17, c, r() > 0.9 ? 1 : 0, r()], i * 4);
  }
  return { pos, seed };
}

function orbit(n: number, r: () => number): Formation {
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n * 4);
  const rings = 7;
  for (let i = 0; i < n; i++) {
    if (i % 4 === 0) {
      // Glittering halo of tiny bubbles around the treasure.
      const a = r() * Math.PI * 2, rad = 1.12 + Math.pow(r(), 2) * 0.55;
      pos.set([rad * Math.cos(a), rad * Math.sin(a), (r() - 0.5) * 0.3], i * 3);
      seed.set([r(), -1, 1, r()], i * 4);
    } else {
      const ring = i % rings;
      const radius = 1.9 + ring * 0.55 + (r() - 0.5) * 0.12;
      pos.set([radius, r() * Math.PI * 2, ring * 0.47 - 1.4], i * 3); // radius, angle, tilt
      seed.set([r(), ring, 0, r()], i * 4);
    }
  }
  return { pos, seed };
}

const builders: Record<SceneMode, (n: number, r: () => number) => Formation> = {
  lattice, stack, timeline, interference, streams, orbit,
};

const cache = new Map<string, Formation>();
export function formation(mode: SceneMode, n: number): Formation {
  const key = `${mode}:${n}`;
  let f = cache.get(key);
  if (!f) {
    f = builders[mode](n, rng(mode.length * 7919 + n));
    cache.set(key, f);
  }
  return f;
}

export const MODE_INDEX: Record<SceneMode, number> = {
  lattice: 0, stack: 1, timeline: 2, interference: 3, streams: 4, orbit: 5,
};
