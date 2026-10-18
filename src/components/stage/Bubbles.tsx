import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { interaction } from "./interaction";

const COUNT = 42;
const GOLD = new THREE.Color("#e1b137");
const BLUE = new THREE.Color("#3f9ff3");

type Bubble = { p: THREE.Vector3; v: THREE.Vector3; r: number; c: THREE.Color; pop: number; phase: number };

const vertexShader = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vC;
  void main() {
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    #ifdef USE_INSTANCING_COLOR
      vC = instanceColor;
    #else
      vC = vec3(1.0);
    #endif
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const fragmentShader = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vC;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
    float spec = pow(max(0.0, dot(reflect(-normalize(vV), normalize(vN)), normalize(vec3(-0.4, 0.8, 0.5)))), 24.0);
    vec3 col = vC * (0.04 + f * 1.05) + vec3(1.0, 0.95, 0.85) * spec * 0.6 * length(vC);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function spawn(b: Bubble, bottom: boolean) {
  b.p.set((Math.random() - 0.5) * 16, bottom ? -6 - Math.random() * 2 : (Math.random() - 0.5) * 11, -3 + Math.random() * 5);
  b.v.set((Math.random() - 0.5) * 0.1, 0.25 + Math.random() * 0.45, 0);
  b.r = 0.1 + Math.pow(Math.random(), 2) * 0.38;
  b.c = (Math.random() < 0.55 ? GOLD : BLUE).clone();
  b.pop = -1;
  b.phase = Math.random() * Math.PI * 2;
}

/** Floating light bubbles: drift upward, flee the cursor, and pop when clicked. */
export default function Bubbles({ onPop }: { onPop: (at: THREE.Vector3) => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const bubbles = useMemo<Bubble[]>(
    () => Array.from({ length: COUNT }, () => {
      const b = { p: new THREE.Vector3(), v: new THREE.Vector3(), r: 0, c: new THREE.Color(), pop: -1, phase: 0 };
      spawn(b, false);
      return b;
    }),
    [],
  );
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 24, 16), []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  // Create the per-instance color buffer before the first frame so the shader compiles with it.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (m && !m.instanceColor) m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
  }, []);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), s: new THREE.Vector3(), c: new THREE.Color(), ray: new THREE.Raycaster(), proj: new THREE.Vector3(), cursor: new THREE.Vector3(), edge: new THREE.Vector3() }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const { x: nx, y: ny } = interaction.ndc;
    const hasCursor = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
    if (hasCursor) {
      tmp.ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      // Cursor point on the plane z = 0.
      const d = -tmp.ray.ray.origin.z / tmp.ray.ray.direction.z;
      tmp.cursor.copy(tmp.ray.ray.origin).addScaledVector(tmp.ray.ray.direction, d);
    }

    // Background clicks pop the nearest bubble under the cursor (in screen space).
    while (interaction.clicks.length) {
      const c = interaction.clicks.shift()!;
      let best = -1, bestD = Infinity;
      const W = state.size.width, H = state.size.height;
      const cx = ((c.x + 1) / 2) * W, cy = ((1 - c.y) / 2) * H;
      bubbles.forEach((b, i) => {
        if (b.pop >= 0) return;
        tmp.proj.copy(b.p).project(camera);
        tmp.edge.copy(b.p).add(tmp.s.set(b.r, 0, 0)).project(camera);
        const px = ((tmp.proj.x + 1) / 2) * W, py = ((1 - tmp.proj.y) / 2) * H;
        const rad = Math.max(16, (Math.abs(tmp.edge.x - tmp.proj.x) / 2) * W * 1.3);
        const dd = Math.hypot(px - cx, py - cy);
        if (dd < rad && dd < bestD) { best = i; bestD = dd; }
      });
      if (best >= 0) {
        bubbles[best].pop = 0;
        onPop(bubbles[best].p.clone());
        window.dispatchEvent(new Event("scene:pop"));
      }
    }

    bubbles.forEach((b, i) => {
      if (b.pop >= 0) {
        b.pop += dt / 0.35;
        if (b.pop >= 1) spawn(b, true);
      } else {
        b.p.addScaledVector(b.v, dt);
        b.p.x += Math.sin(t * 0.7 + b.phase) * dt * 0.15;
        if (hasCursor) {
          const dx = b.p.x - tmp.cursor.x, dy = b.p.y - tmp.cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2.2 && dist > 0.001) {
            const f = (1 - dist / 2.2) * 6 * dt;
            b.p.x += (dx / dist) * f;
            b.p.y += (dy / dist) * f;
          }
        }
        if (b.p.y > 7) spawn(b, true);
      }
      const k = b.pop >= 0 ? 1 + b.pop * 1.8 : 1 + Math.sin(t * 2 + b.phase) * 0.04;
      const fade = b.pop >= 0 ? 1 - b.pop : Math.min(1, (b.p.y + 6) / 1.5);
      tmp.s.setScalar(b.r * k);
      tmp.m.compose(b.p, tmp.q, tmp.s);
      m.setMatrixAt(i, tmp.m);
      m.setColorAt(i, tmp.c.copy(b.c).multiplyScalar(Math.max(0, fade)));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} frustumCulled={false} />;
}
