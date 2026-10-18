import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { FLOOR_Y, OCEAN, modeWeights } from "./palette";

// An original, procedurally built art-deco skyline on the sea floor:
// stepped setbacks, pilasters, sunburst crowns, spires, and neon trim.

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Part = THREE.BufferGeometry;

function paint(g: THREE.BufferGeometry, c: THREE.Color, k = 1): Part {
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set([c.r * k, c.g * k, c.b * k], i * 3);
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  if (g.index) return g.toNonIndexed();
  return g;
}

function box(w: number, h: number, d: number, x: number, y: number, z: number, c: THREE.Color, k = 1, rotZ = 0): Part {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rotZ) g.rotateZ(rotZ);
  g.translate(x, y, z);
  return paint(g, c, k);
}

function cyl(rTop: number, rBot: number, h: number, x: number, y: number, z: number, c: THREE.Color, k = 1, seg = 20): Part {
  const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, 1);
  g.translate(x, y, z);
  return paint(g, c, k);
}

const BODY = [OCEAN.pink, OCEAN.butter, OCEAN.seafoam, new THREE.Color("#ffc9a8"), new THREE.Color("#c9b8ff")];
const NEON = [new THREE.Color("#5ff2ff"), new THREE.Color("#ff6fb1"), new THREE.Color("#ffd85a"), new THREE.Color("#7dffc4")];
const CREAM = new THREE.Color("#fff3df");
const GLASS = new THREE.Color("#123a5c");
const NEON_GAIN = 3.2;

function tower(seed: number, x0: number, z0: number, scale: number, body: Part[], neon: Part[]) {
  const r = rng(seed);
  const base = BODY[Math.floor(r() * BODY.length)];
  const lite = base.clone().lerp(CREAM, 0.45);
  const glow = NEON[Math.floor(r() * NEON.length)];
  const round = r() < 0.3;
  const W = (1.6 + r() * 1.3) * scale;
  const D = W * (0.75 + r() * 0.25);
  const tiers = 3 + Math.floor(r() * 2);
  let y = 0;
  let w = W, d = D;
  for (let k = 0; k < tiers; k++) {
    const h = (k === 0 ? 2.6 + r() * 3.2 : 0.9 + r() * 1.4) * scale;
    const c = k % 2 ? lite : base;
    if (round) {
      body.push(cyl(w / 2, w / 2, h, x0, y + h / 2, z0, c, 1, 28));
      body.push(cyl(w / 2 + 0.06, w / 2 + 0.06, 0.12, x0, y + h, z0, CREAM, 1, 28));
      neon.push(cyl(w / 2 + 0.03, w / 2 + 0.03, 0.05, x0, y + h - 0.16, z0, glow, NEON_GAIN, 28));
      // Ribbon windows wrapping the drum.
      if (k < tiers - 1) {
        for (let b = 0; b < Math.floor(h / 0.5); b++) {
          body.push(cyl(w / 2 + 0.01, w / 2 + 0.01, 0.12, x0, y + 0.35 + b * 0.5, z0, GLASS, 1, 28));
        }
      }
    } else {
      body.push(box(w, h, d, x0, y + h / 2, z0, c));
      body.push(box(w + 0.12, 0.12, d + 0.12, x0, y + h, z0, CREAM));
      neon.push(box(w + 0.04, 0.05, 0.05, x0, y + h - 0.16, z0 + d / 2 + 0.03, glow, NEON_GAIN));
      // Corner neon strips.
      for (const sx of [-1, 1]) neon.push(box(0.05, h * 0.92, 0.05, x0 + sx * (w / 2 + 0.01), y + h / 2, z0 + d / 2 + 0.01, glow, NEON_GAIN * 0.8));
      if (k < tiers - 1) {
        // Pilasters with window bays between them.
        const bays = Math.max(3, Math.round(w / 0.45));
        for (let b = 0; b <= bays; b++) {
          const px = x0 - w / 2 + (b / bays) * w;
          body.push(box(0.08, h * 0.9, 0.1, px, y + h * 0.47, z0 + d / 2 + 0.04, lite));
          if (b === bays) continue;
          const rows = Math.floor((h * 0.82) / 0.42);
          for (let row = 0; row < rows; row++) {
            const wx = px + w / bays / 2, wy = y + 0.3 + row * 0.42;
            const lit = r() < 0.32;
            (lit ? neon : body).push(box((w / bays) * 0.5, 0.22, 0.03, wx, wy, z0 + d / 2 + 0.015, lit ? OCEAN.butter : GLASS, lit ? 1.6 : 1));
          }
        }
      } else {
        // Sunburst crown on the top tier.
        const cx = x0, cy = y + h * 0.18, cz = z0 + d / 2 + 0.04;
        const L = Math.min(w * 0.46, h * 0.8);
        const fan = new THREE.CircleGeometry(L, 24, 0, Math.PI);
        fan.translate(cx, cy, cz - 0.01);
        body.push(paint(fan, lite));
        const rays = 9;
        for (let i = 0; i < rays; i++) {
          const a = (i / (rays - 1)) * Math.PI;
          neon.push(box(L * 0.95, 0.04, 0.03, cx + Math.cos(a) * L * 0.5, cy + Math.sin(a) * L * 0.5, cz, glow, NEON_GAIN, a));
        }
      }
    }
    y += h;
    w *= 0.74 + r() * 0.08;
    d *= 0.74 + r() * 0.08;
  }
  // Stepped crown and spire with a glowing tip.
  body.push(box(w * 0.7, 0.3 * scale, d * 0.7, x0, y + 0.15 * scale, z0, CREAM));
  body.push(box(w * 0.42, 0.3 * scale, d * 0.42, x0, y + 0.45 * scale, z0, base));
  const spire = (1.2 + r() * 1.8) * scale;
  body.push(cyl(0.01, 0.09 * scale, spire, x0, y + 0.6 * scale + spire / 2, z0, CREAM, 1, 8));
  const tip = new THREE.SphereGeometry(0.09 * scale, 10, 8).translate(x0, y + 0.6 * scale + spire, z0);
  neon.push(paint(tip, glow, NEON_GAIN * 1.4));
}

const LAYOUT: [number, number, number][] = [
  [-14, -9, 1], [-10, -13, 1.15], [-6.5, -8, 0.85], [-3, -15, 1.25], [1.2, -11, 0.95], [5, -16, 1.3],
  [8.6, -9, 0.9], [12.5, -13, 1.15], [16, -9.5, 0.95], [-18, -16, 1.2], [20, -17, 1.25], [0, -22, 1.4],
  [-11.5, -21, 1.1], [10.5, -22, 1.2], [-22, -10, 0.9], [23, -11, 0.85],
];

/** The skyline sits close on the home page and recedes into the haze elsewhere. */
export default function DecoCity() {
  const group = useRef<THREE.Group>(null);
  const { bodyGeo, neonGeo } = useMemo(() => {
    const body: Part[] = [], neon: Part[] = [];
    LAYOUT.forEach(([x, z, s], i) => tower(1000 + i * 77, x, z, s, body, neon));
    // Pastel plaza tiles and low walls tie the towers together.
    for (let i = 0; i < 18; i++) {
      const x = -20 + i * 2.4;
      body.push(box(1.6, 0.25, 1.6, x, 0.12, -5 - (i % 3) * 0.6, BODY[i % BODY.length], 0.8));
    }
    const b = mergeGeometries(body)!;
    const n = mergeGeometries(neon)!;
    body.forEach((g) => g.dispose());
    neon.forEach((g) => g.dispose());
    return { bodyGeo: b, neonGeo: n };
  }, []);
  const bodyMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.05 });
    // Let the pastel paint glow a little so it reads through the blue water.
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\n  totalEmissiveRadiance += vColor.rgb * 0.32;",
      );
    };
    return m;
  }, []);
  const neonMat = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, fog: true }), []);
  useEffect(() => () => { bodyGeo.dispose(); neonGeo.dispose(); bodyMat.dispose(); neonMat.dispose(); }, [bodyGeo, neonGeo, bodyMat, neonMat]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const near = modeWeights.lattice;
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 1.8);
    g.position.z += (THREE.MathUtils.lerp(-24, 0, near) - g.position.z) * k;
    const s = THREE.MathUtils.lerp(1.05, 1, near);
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);
    const pulse = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 1.6);
    neonMat.color.setScalar(pulse);
  });

  return (
    <group ref={group} position={[0, FLOOR_Y, -24]}>
      <mesh geometry={bodyGeo} material={bodyMat} />
      <mesh geometry={neonGeo} material={neonMat} />
    </group>
  );
}
