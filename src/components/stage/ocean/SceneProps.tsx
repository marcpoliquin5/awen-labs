import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset";
import { OCEAN, THIN_FILM_GLSL, modeWeights } from "./palette";

/* Architecture: translucent bubble-glass plates that rotate with the stack and pull apart on scroll. */
const plateVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vObj;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    vObj = position;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const plateFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uLayer;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vObj;
  ${THIN_FILM_GLSL}
  void main() {
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    float cosI = clamp(abs(dot(N, normalize(vV))), 0.0, 1.0);
    float fres = pow(1.0 - cosI, 2.0);
    float d = 300.0 + 220.0 * sin(length(vObj.xz) * 2.4 - uTime * 0.8 + uLayer) + 80.0 * sin(vObj.x * 3.0 + uTime * 0.5);
    vec3 film = thinFilm(d, cosI);
    // Bright rim along the plate edges.
    vec2 e = abs(vObj.xz) / (vec2(0.5) * 1.0);
    float edge = smoothstep(0.9, 1.0, max(e.x, e.y));
    float scan = pow(max(0.0, sin(vObj.x * 6.0 + uTime * 1.6 - uLayer)), 20.0);
    vec3 col = film * (0.1 + fres * 0.9) + vec3(0.7, 0.95, 1.0) * (edge * 0.7 + scan * 0.35);
    float a = (0.05 + fres * 0.35 + edge * 0.5 + scan * 0.2) * uOpacity;
    gl_FragColor = vec4(col * uOpacity, a);
  }
`;

export function BubbleGlassStack() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 0.05, 1), []);
  const materials = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader: plateVertex,
          fragmentShader: plateFragment,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          premultipliedAlpha: true,
          uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uLayer: { value: i * 1.1 } },
        }),
      ),
    [],
  );
  useEffect(() => () => { geometry.dispose(); materials.forEach((m) => m.dispose()); }, [geometry, materials]);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const w = modeWeights.stack;
    g.visible = w > 0.01;
    if (!g.visible) return;
    const t = state.clock.elapsedTime;
    const scroll = Math.min(2, window.scrollY / window.innerHeight);
    const spread = 0.82 + 0.18 * Math.sin(t * 0.6) + scroll * 0.5;
    g.children.forEach((c, layer) => {
      const size = 3.4 - layer * 0.18;
      c.position.set(0, (layer - 2.5) * spread, 0);
      c.rotation.y = t * 0.12 + layer * 0.06;
      c.scale.set(size * 1.04, 1, size * 1.04);
      const m = materials[layer];
      m.uniforms.uTime.value = t;
      m.uniforms.uOpacity.value = w;
    });
  });
  return (
    <group ref={group}>
      {materials.map((m, i) => (
        <mesh key={i} geometry={geometry} material={m} renderOrder={2} />
      ))}
    </group>
  );
}

/* About: the gold mascot glowing like treasure at the heart of the orbiting bubbles. */
const glowFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uGold;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float halo = exp(-r * 3.2) * (0.9 + 0.1 * sin(uTime * 1.5));
    float rays = pow(max(0.0, sin(a * 12.0 + uTime * 0.4)), 8.0) * exp(-r * 2.2) * 0.5;
    gl_FragColor = vec4(uGold * (halo + rays) * uOpacity * 1.6, 1.0);
  }
`;
const discFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uGold;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    if (r > 1.0) discard;
    vec3 img = texture2D(uMap, vec2(vUv.x, 0.52 + (vUv.y - 0.5) * 0.864)).rgb;
    // A glint sweeps across the gold, plus a beveled rim.
    float sweep = exp(-pow((p.x + p.y) * 4.0 - sin(uTime * 0.6) * 3.0, 2.0)) * 0.45;
    float rim = smoothstep(0.86, 0.94, r) * (1.0 - smoothstep(0.97, 1.0, r));
    vec3 col = img * 1.15 + uGold * (sweep + rim * 1.6);
    float a = smoothstep(1.0, 0.97, r) * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`;
const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function TreasureMascot() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(asset("/brand/mascot-640.webp"));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const glow = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uGold: { value: OCEAN.gold } },
      }),
    [],
  );
  const disc = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: discFragment,
        transparent: true,
        depthWrite: false,
        premultipliedAlpha: true,
        uniforms: { uMap: { value: texture }, uTime: { value: 0 }, uOpacity: { value: 0 }, uGold: { value: OCEAN.gold } },
      }),
    [texture],
  );
  useEffect(() => () => { texture.dispose(); geometry.dispose(); glow.dispose(); disc.dispose(); }, [texture, geometry, glow, disc]);
  useFrame((state) => {
    const w = modeWeights.orbit;
    if (group.current) group.current.visible = w > 0.01;
    if (w <= 0.01) return;
    const t = state.clock.elapsedTime;
    for (const m of [glow, disc]) {
      m.uniforms.uTime.value = t;
      m.uniforms.uOpacity.value = w;
    }
    if (inner.current) {
      inner.current.position.y = Math.sin(t * 0.8) * 0.12;
      inner.current.scale.setScalar(0.85 + w * 0.15);
    }
  });
  return (
    <group ref={group}>
      <Billboard>
        <group ref={inner}>
          <mesh geometry={geometry} material={glow} scale={6.5} renderOrder={3} />
          <mesh geometry={geometry} material={disc} scale={2.1} renderOrder={4} />
        </group>
      </Billboard>
    </group>
  );
}
