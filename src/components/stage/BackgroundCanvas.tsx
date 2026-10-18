import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { sceneStore, type SceneMode } from "@/lib/sceneStore";
import { MODE_INDEX, formation } from "./formations";
import Bubbles from "./Bubbles";
import { installInteraction, interaction } from "./interaction";

const COUNT = 6000;
const BACKGROUND = new THREE.Color("#090807");

// Camera framing per scene: [position, look-at].
const FRAMING: Record<SceneMode, [THREE.Vector3, THREE.Vector3]> = {
  lattice: [new THREE.Vector3(0, 0, 10.5), new THREE.Vector3(0.6, 0, 0)],
  stack: [new THREE.Vector3(6.5, 4.6, 8.2), new THREE.Vector3(0, 0.2, 0)],
  timeline: [new THREE.Vector3(1.5, 1.4, 9), new THREE.Vector3(0.8, -0.4, 0)],
  interference: [new THREE.Vector3(0, 5.2, 8.6), new THREE.Vector3(0, -0.6, 0)],
  streams: [new THREE.Vector3(0, 0, 9.5), new THREE.Vector3(0, 0, 0)],
  orbit: [new THREE.Vector3(2.5, 1.6, 10), new THREE.Vector3(3.2, -0.3, 0)],
};

const vertexShader = /* glsl */ `
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec4 aSeedA;
  attribute vec4 aSeedB;
  uniform float uTime;
  uniform float uMorph;
  uniform float uScroll;
  uniform float uModeA;
  uniform float uModeB;
  uniform float uPixel;
  uniform vec2 uPointer;
  uniform vec4 uShock;
  varying vec3 vColor;
  varying float vAlpha;

  const vec3 GOLD = vec3(0.882, 0.694, 0.216);
  const vec3 GOLD_HI = vec3(1.0, 0.86, 0.48);
  const vec3 BLUE = vec3(0.25, 0.62, 0.95);
  const vec3 BLUE_HI = vec3(0.55, 0.82, 1.0);

  // Animates one formation. Returns position; writes brightness and color.
  vec3 animate(float mode, vec3 p, vec4 s, out float b, out vec3 col) {
    float t = uTime;
    if (mode < 0.5) {                      // lattice: light pulses race along waveguides
      float pulse = pow(max(0.0, sin(p.x * 1.5 - t * 2.4 + s.y * 1.7)), 10.0);
      float node = s.z;
      b = mix(0.22 + pulse * 1.8, 0.55 + 0.45 * sin(t * 0.9 + s.y * 0.8 + s.w * 6.0), node);
      col = mix(mix(GOLD, BLUE_HI, pulse), GOLD_HI, node);
      return p + vec3(0.0, 0.0, sin(t * 0.6 + p.x * 0.5) * 0.04);
    } else if (mode < 1.5) {               // stack: rotating layered platform
      float layer = s.y;
      float spread = 0.82 + 0.18 * sin(t * 0.6) + uScroll * 0.5;
      float a = t * 0.12 + layer * 0.06;
      vec3 q = vec3(p.x * cos(a) - p.z * sin(a), (layer - 2.5) * spread, p.x * sin(a) + p.z * cos(a));
      float scan = pow(max(0.0, sin(q.x * 1.2 + t * 1.6 - layer)), 12.0);
      b = 0.25 + s.z * 0.6 + scan * 1.2;
      col = mix(mod(layer, 2.0) < 0.5 ? GOLD : BLUE, BLUE_HI, scan);
      return q;
    } else if (mode < 2.5) {               // timeline: a beam spiralling through milestones
      if (s.z > 0.5) {
        float k = 0.6 + 0.4 * sin(t * 1.4 + s.y * 2.0);
        b = 0.6 + k * 0.8;
        col = GOLD_HI;
        return vec3(p.x, p.y + p.x * 0.12, p.z) * (0.9 + 0.15 * k);
      }
      float ang = p.y + t * (0.8 + s.x) + p.x * 0.8;
      float rad = p.z * (1.0 + 0.3 * sin(p.x * 0.7 + t));
      float flow = pow(max(0.0, sin(p.x * 0.9 - t * 3.0)), 6.0);
      b = 0.3 + flow * 1.6;
      col = mix(mix(GOLD, BLUE, s.x), BLUE_HI, flow);
      return vec3(p.x, p.x * 0.12 + sin(p.x * 0.35 + t * 0.4) * 0.4 + cos(ang) * rad, sin(ang) * rad);
    } else if (mode < 3.5) {               // interference: two coherent sources
      vec2 s1 = vec2(-2.2, -1.5), s2 = vec2(2.2, -1.5);
      float r1 = distance(p.xz, s1), r2 = distance(p.xz, s2);
      float h = sin(r1 * 3.2 - t * 2.0) / (1.0 + r1 * 0.35) + sin(r2 * 3.2 - t * 2.0) / (1.0 + r2 * 0.35);
      float dp = distance(p.xz, uPointer * vec2(6.0, 4.0));
      h += sin(dp * 4.0 - t * 4.0) * 0.35 / (1.0 + dp * 1.5);
      b = 0.15 + max(0.0, h) * 0.9;
      col = mix(GOLD, BLUE_HI, smoothstep(-0.6, 1.2, h));
      return vec3(p.x, h * 0.45, p.z);
    } else if (mode < 4.5) {               // streams: data flowing down columns
      float speed = 0.6 + s.x * 1.6;
      float y = mod(p.y - t * speed + 5.0, 10.0) - 5.0;
      float head = fract((p.y - t * speed) * 0.25 + s.w);
      b = 0.12 + pow(head, 6.0) * 1.6 + s.z * 0.6;
      col = mix(BLUE, s.z > 0.5 ? GOLD_HI : BLUE_HI, pow(head, 3.0));
      return vec3(p.x, y, p.z);
    }
    // orbit: a gold core with orbiting rings of light
    if (s.z > 0.5) {
      float k = 0.5 + 0.5 * sin(t * 1.2 + s.w * 6.28);
      b = 0.35 + k * 0.5;
      col = mix(GOLD, GOLD_HI, k);
      return p * (1.0 + 0.04 * sin(t * 1.5));
    }
    float ang = p.y + t * (0.35 / (p.x * 0.5));
    vec3 q = vec3(cos(ang) * p.x, 0.0, sin(ang) * p.x);
    float tilt = p.z;
    q = vec3(q.x, q.z * sin(tilt) * 0.5, q.z * cos(tilt));
    float spark = pow(max(0.0, sin(ang * 3.0 - t * 2.0 + s.y)), 14.0);
    b = 0.2 + spark * 1.6;
    col = mix(mod(s.y, 2.0) < 0.5 ? GOLD : BLUE, BLUE_HI, spark);
    return q;
  }

  void main() {
    float bA, bB; vec3 cA, cB;
    vec3 pA = animate(uModeA, aPosA, aSeedA, bA, cA);
    vec3 pB = animate(uModeB, aPosB, aSeedB, bB, cB);
    float m = smoothstep(0.0, 1.0, uMorph);
    // Points swirl outward mid-transition for a cinematic morph.
    vec3 p = mix(pA, pB, m);
    float burst = sin(m * 3.14159);
    p += normalize(p + vec3(0.001)) * burst * (0.6 + aSeedB.x * 1.2);
    float b = mix(bA, bB, m);
    vColor = mix(cA, cB, m);
    // Shockwave from a popped bubble.
    float age = uTime - uShock.w;
    if (age < 2.5) {
      vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
      vec3 dv = wp - uShock.xyz;
      float dist = length(dv);
      float ring = exp(-pow(dist - age * 5.0, 2.0) * 1.5) * exp(-age * 1.6);
      p += (transpose(mat3(modelMatrix)) * normalize(dv + vec3(0.0001))) * ring * 0.9;
      b += ring * 2.0;
      vColor = mix(vColor, vec3(0.75, 0.9, 1.0), clamp(ring, 0.0, 1.0));
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Points part around the cursor and light up near it.
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 away = ndc - uPointer;
    float near = exp(-dot(away, away) * 28.0);
    mv.xy += normalize(away + vec2(0.0001)) * near * 0.06 * -mv.z;
    b += near * 1.2;
    vAlpha = clamp(b, 0.0, 2.2);
    gl_PointSize = uPixel * (0.9 + b * 1.1) * (26.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = core * core * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.55 + core * 0.9), a);
  }
`;

function Formations() {
  const { camera, gl } = useThree();
  const morph = useRef({ a: sceneStore.mode, b: sceneStore.mode, t: 1 });
  const lookAt = useRef(FRAMING[sceneStore.mode][1].clone());
  const group = useRef<THREE.Group>(null);
  const v = useMemo(() => ({ target: new THREE.Vector3(), look: new THREE.Vector3(), off: new THREE.Vector3() }), []);

  const { geometry, material } = useMemo(() => {
    const f = formation(sceneStore.mode, COUNT);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.setAttribute("aPosA", new THREE.BufferAttribute(f.pos.slice(), 3));
    g.setAttribute("aPosB", new THREE.BufferAttribute(f.pos.slice(), 3));
    g.setAttribute("aSeedA", new THREE.BufferAttribute(f.seed.slice(), 4));
    g.setAttribute("aSeedB", new THREE.BufferAttribute(f.seed.slice(), 4));
    const idx = MODE_INDEX[sceneStore.mode];
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uScroll: { value: 0 },
        uModeA: { value: idx },
        uModeB: { value: idx },
        uPixel: { value: gl.getPixelRatio() },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uShock: { value: new THREE.Vector4(0, 0, 0, -100) },
      },
    });
    return { geometry: g, material: m };
  }, [gl]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  // Start a morph whenever the requested scene changes.
  useEffect(
    () =>
      sceneStore.subscribe(() => {
        const next = sceneStore.mode;
        const st = morph.current;
        if (next === st.b) return;
        const from = formation(st.b, COUNT);
        const to = formation(next, COUNT);
        (geometry.attributes.aPosA as THREE.BufferAttribute).set(from.pos);
        (geometry.attributes.aSeedA as THREE.BufferAttribute).set(from.seed);
        (geometry.attributes.aPosB as THREE.BufferAttribute).set(to.pos);
        (geometry.attributes.aSeedB as THREE.BufferAttribute).set(to.seed);
        for (const k of ["aPosA", "aSeedA", "aPosB", "aSeedB"]) geometry.attributes[k].needsUpdate = true;
        material.uniforms.uModeA.value = MODE_INDEX[st.b];
        material.uniforms.uModeB.value = MODE_INDEX[next];
        morph.current = { a: st.b, b: next, t: 0 };
      }),
    [geometry, material],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const st = morph.current;
    st.t = Math.min(1, st.t + dt / 1.6);
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMorph.value = st.t;
    u.uPixel.value = state.gl.getPixelRatio();
    const scroll = Math.min(2, window.scrollY / window.innerHeight);
    u.uScroll.value += (scroll - u.uScroll.value) * 0.1;
    const { x: nx, y: ny } = interaction.ndc;
    const hasCursor = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
    u.uPointer.value.set(hasCursor ? nx : 9, hasCursor ? ny : 9);
    const px = hasCursor ? nx : 0, py = hasCursor ? -ny : 0;

    // Drag to rotate, with inertia, easing back to rest when released.
    const r = interaction.rot;
    r.y += r.vy; r.x += r.vx;
    r.vy *= 0.92; r.vx *= 0.92;
    if (!interaction.dragging) { r.y *= 0.995; r.x *= 0.97; }
    r.x = Math.max(-0.9, Math.min(0.9, r.x));
    if (group.current) {
      group.current.rotation.y = r.y + px * 0.12;
      group.current.rotation.x = r.x + py * 0.06;
    }

    // Scroll-driven camera: dolly in, drop, and orbit with page progress.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    const [pos, look] = FRAMING[st.b];
    const k = 1 - Math.exp(-dt * 2.2);
    const s = u.uScroll.value;
    v.off.copy(pos).sub(look).applyAxisAngle(new THREE.Vector3(0, 1, 0), (progress - 0.15) * 0.9);
    v.target.copy(look).add(v.off);
    v.target.x += px * 0.6;
    v.target.y += py * 0.4 - s * 1.1;
    v.target.z -= Math.min(s, 1) * 1.6;
    camera.position.lerp(v.target, k);
    lookAt.current.lerp(v.look.set(look.x + px * 0.2, look.y - s * 0.6, look.z), k);
    camera.lookAt(lookAt.current);
  });

  const onPop = (at: THREE.Vector3) => {
    material.uniforms.uShock.value.set(at.x, at.y, at.z, material.uniforms.uTime.value);
  };

  return (
    <>
      <group ref={group}>
        <points geometry={geometry} material={material} frustumCulled={false} />
      </group>
      <Bubbles onPop={onPop} />
    </>
  );
}

export default function BackgroundCanvas({ onReady }: { onReady?: () => void }) {
  const [active, setActive] = useState(!document.hidden);
  const [dpr, setDpr] = useState(1.5);
  const [bloom, setBloom] = useState(true);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    const uninstall = installInteraction();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      uninstall();
    };
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: FRAMING[sceneStore.mode][0].toArray(), fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[BACKGROUND]} />
      <PerformanceMonitor onDecline={() => { setDpr(1); setBloom(false); }} onIncline={() => setDpr(1.5)} />
      <AdaptiveDpr pixelated={false} />
      <Formations />
      {bloom && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.2} luminanceSmoothing={0.35} intensity={0.85} radius={0.65} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
