import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { interaction } from "./interaction";
import { FLOOR_Y, OCEAN, THIN_FILM_GLSL } from "./ocean/palette";

const COUNT = 150;
const RIPPLES = 10;

type Bubble = { p: THREE.Vector3; v: THREE.Vector3; r: number; pop: number; phase: number; seed: number; wob: number };

// Soap-film bubbles: thin-film interference colors that swirl and drain,
// a Fresnel rim, and sharp specular highlights. The surface wobbles as they rise.
const vertexShader = /* glsl */ `
  attribute vec4 aData; // phase, fade, seed, pop
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vObj;
  varying vec4 vData;
  void main() {
    float t = uTime;
    vec3 p = position;
    float w = 0.018 * sin(p.y * 2.5 + t * 3.1 + aData.x) + 0.014 * sin(p.x * 3.0 - t * 2.4 + aData.x * 2.0) + 0.008 * sin(p.z * 4.0 + t * 4.0);
    p *= 1.0 + w * (1.0 + aData.w * 6.0);
    p.y *= 1.0 - 0.04 * sin(t * 2.2 + aData.x);
    vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
    vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    vObj = position;
    vData = aData;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSurface;
  uniform vec3 uDeep;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vObj;
  varying vec4 vData;
  ${THIN_FILM_GLSL}
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(vV);
    if (!gl_FrontFacing) N = -N;
    float cosI = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fres = pow(1.0 - cosI, 2.6);
    float t = uTime;
    // Film thickness in nm: swirling bands, thinning toward the top as it drains.
    float swirl = sin(vObj.y * 3.2 + t * 0.9 + vData.z * 6.28 + sin(vObj.x * 4.0 - t * 0.7 + vObj.z * 2.0) * 1.4);
    float d = (330.0 + 260.0 * swirl) * mix(1.05, 0.55, smoothstep(-1.0, 1.0, vObj.y));
    vec3 film = thinFilm(d, cosI);
    vec3 R = reflect(-V, N);
    vec3 env = mix(uDeep, uSurface, smoothstep(-0.3, 0.8, R.y));
    vec3 L1 = normalize(vec3(-0.35, 0.9, 0.45));
    vec3 L2 = normalize(vec3(0.6, 0.2, 0.7));
    float spec = pow(max(dot(R, L1), 0.0), 90.0) * 2.2 + pow(max(dot(R, L2), 0.0), 18.0) * 0.25;
    vec3 col = film * (0.09 + fres * 1.45) * (0.6 + env * 0.8) + env * fres * 0.25 + vec3(spec);
    float alpha = clamp(0.03 + fres * 0.75 + spec, 0.0, 1.0) * vData.y;
    gl_FragColor = vec4(col * vData.y, alpha);
  }
`;

// Expanding rings and a faint flash where a bubble pops.
const rippleVertex = /* glsl */ `
  attribute vec2 aAge; // age 0..1 (or <0 idle), tint seed
  varying vec2 vUv;
  varying vec2 vAge;
  void main() {
    vUv = uv;
    vAge = aAge;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;
const rippleFragment = /* glsl */ `
  ${THIN_FILM_GLSL}
  varying vec2 vUv;
  varying vec2 vAge;
  void main() {
    float age = vAge.x;
    if (age < 0.0) discard;
    float r = length(vUv - 0.5) * 2.0;
    float ring1 = exp(-pow((r - age) * 18.0, 2.0));
    float ring2 = exp(-pow((r - age * 0.65) * 24.0, 2.0)) * 0.6;
    float flash = exp(-r * 6.0) * exp(-age * 10.0) * 1.5;
    vec3 tint = thinFilm(250.0 + r * 500.0 + vAge.y * 200.0, 1.0 - r * 0.5) * 1.4 + 0.25;
    float a = (ring1 + ring2) * (1.0 - age) + flash;
    gl_FragColor = vec4(tint * a, 1.0);
  }
`;

function spawn(b: Bubble, bottom: boolean) {
  b.r = 0.05 + Math.pow(Math.random(), 3) * 0.5;
  b.p.set((Math.random() - 0.5) * 22, bottom ? FLOOR_Y - 0.5 - Math.random() * 3 : FLOOR_Y + Math.random() * 13, -7 + Math.random() * 10);
  // Bigger bubbles rise faster; small ones zig-zag more.
  b.v.set((Math.random() - 0.5) * 0.08, 0.3 + b.r * 0.9 + Math.random() * 0.25, 0);
  b.pop = -1;
  b.phase = Math.random() * Math.PI * 2;
  b.seed = Math.random();
  b.wob = 0.4 + (1 - b.r) * 0.8;
}

/** The star of the scene: iridescent bubbles that rise, wobble, dodge the cursor, and pop when clicked. */
export default function Bubbles({ onPop }: { onPop: (at: THREE.Vector3) => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const rippleMesh = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: COUNT }, () => {
        const b = { p: new THREE.Vector3(), v: new THREE.Vector3(), r: 0, pop: -1, phase: 0, seed: 0, wob: 0 };
        spawn(b, false);
        return b;
      }),
    [],
  );
  const ripples = useMemo(() => Array.from({ length: RIPPLES }, () => ({ p: new THREE.Vector3(), s: 1, age: -1, seed: 0 })), []);

  const { geometry, material, data } = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 32, 20);
    const d = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 4), 4);
    d.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("aData", d);
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      premultipliedAlpha: true,
      uniforms: { uTime: { value: 0 }, uSurface: { value: OCEAN.surface }, uDeep: { value: OCEAN.horizon } },
    });
    return { geometry: g, material: m, data: d };
  }, []);
  const ripple = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    const a = new THREE.InstancedBufferAttribute(new Float32Array(RIPPLES * 2).fill(-1), 2);
    a.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("aAge", a);
    const m = new THREE.ShaderMaterial({
      vertexShader: rippleVertex,
      fragmentShader: rippleFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: g, material: m, age: a };
  }, []);
  useEffect(
    () => () => {
      material.dispose(); geometry.dispose(); ripple.material.dispose(); ripple.geometry.dispose();
    },
    [material, geometry, ripple],
  );

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(), q: new THREE.Quaternion(), s: new THREE.Vector3(), ray: new THREE.Raycaster(),
      proj: new THREE.Vector3(), cur: new THREE.Vector3(), edge: new THREE.Vector3(), v2: new THREE.Vector2(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const m = mesh.current;
    const rm = rippleMesh.current;
    if (!m || !rm) return;
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    const { x: nx, y: ny } = interaction.ndc;
    const hasCursor = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
    if (hasCursor) tmp.ray.setFromCamera(tmp.v2.set(nx, ny), camera);
    const o = tmp.ray.ray.origin, dir = tmp.ray.ray.direction;

    // Background clicks pop the nearest bubble under the cursor (in screen space).
    while (interaction.clicks.length) {
      const c = interaction.clicks.shift()!;
      let best = -1, bestD = Infinity;
      const W = state.size.width, H = state.size.height;
      const cx = ((c.x + 1) / 2) * W, cy = ((1 - c.y) / 2) * H;
      bubbles.forEach((b, i) => {
        if (b.pop >= 0) return;
        tmp.proj.copy(b.p).project(camera);
        if (tmp.proj.z > 1) return;
        tmp.edge.copy(b.p).add(tmp.s.set(b.r, 0, 0)).project(camera);
        const px = ((tmp.proj.x + 1) / 2) * W, py = ((1 - tmp.proj.y) / 2) * H;
        const rad = Math.max(18, (Math.abs(tmp.edge.x - tmp.proj.x) / 2) * W * 1.35);
        const dd = Math.hypot(px - cx, py - cy);
        if (dd < rad && dd < bestD) { best = i; bestD = dd; }
      });
      if (best >= 0) {
        const b = bubbles[best];
        b.pop = 0;
        onPop(b.p.clone());
        const rp = ripples.reduce((a, q) => (q.age < 0 || q.age > a.age ? q : a), ripples[0]);
        rp.p.copy(b.p); rp.s = b.r * 7 + 0.6; rp.age = 0; rp.seed = Math.random();
        window.dispatchEvent(new Event("scene:pop"));
      }
    }

    bubbles.forEach((b, i) => {
      if (b.pop >= 0) {
        b.pop += dt / 0.22;
        if (b.pop >= 1) spawn(b, true);
      } else {
        b.p.addScaledVector(b.v, dt);
        b.p.x += Math.sin(t * (1.1 + b.wob) + b.phase) * dt * 0.22 * b.wob;
        b.p.z += Math.cos(t * 0.9 + b.phase * 1.3) * dt * 0.08;
        if (hasCursor && Math.abs(dir.z) > 1e-4) {
          // Cursor position at this bubble's depth.
          const k = (b.p.z - o.z) / dir.z;
          tmp.cur.copy(o).addScaledVector(dir, k);
          const dx = b.p.x - tmp.cur.x, dy = b.p.y - tmp.cur.y;
          const dist = Math.hypot(dx, dy);
          const reach = 1.6 + b.r * 2;
          if (dist < reach && dist > 0.001) {
            const f = (1 - dist / reach) * 5 * dt;
            b.p.x += (dx / dist) * f;
            b.p.y += (dy / dist) * f * 0.6;
          }
        }
        if (b.p.y > 10) spawn(b, true);
      }
      const k = b.pop >= 0 ? 1 + b.pop * 0.5 : 1;
      const fade = b.pop >= 0 ? 1 - b.pop : Math.min(1, (b.p.y - FLOOR_Y + 1) / 1.5);
      tmp.s.setScalar(b.r * k);
      tmp.m.compose(b.p, tmp.q, tmp.s);
      m.setMatrixAt(i, tmp.m);
      data.setXYZW(i, b.phase, Math.max(0, fade), b.seed, b.pop >= 0 ? b.pop : 0);
    });
    m.instanceMatrix.needsUpdate = true;
    data.needsUpdate = true;

    ripples.forEach((rp, i) => {
      if (rp.age >= 0) rp.age += dt / 0.9;
      if (rp.age > 1) rp.age = -1;
      tmp.s.setScalar(rp.age >= 0 ? rp.s : 0.0001);
      tmp.m.compose(rp.p, camera.quaternion, tmp.s);
      rm.setMatrixAt(i, tmp.m);
      ripple.age.setXY(i, rp.age, rp.seed);
    });
    rm.instanceMatrix.needsUpdate = true;
    ripple.age.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[geometry, material, COUNT]} frustumCulled={false} renderOrder={5} />
      <instancedMesh ref={rippleMesh} args={[ripple.geometry, ripple.material, RIPPLES]} frustumCulled={false} renderOrder={6} />
    </>
  );
}
