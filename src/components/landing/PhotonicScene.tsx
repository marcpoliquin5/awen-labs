import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Line, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  COLUMNS,
  WAVEGUIDES,
  X_END,
  X_START,
  columnAt,
  columnX,
  couplers,
  partnerIn,
  waveguidePoints,
  waveguideY,
} from "./meshLayout";

// Brand palette: metallic gold structure, photon-blue light.
const GOLD = new THREE.Color("hsl(43, 74%, 55%)");
const GOLD_HI = new THREE.Color("hsl(45, 85%, 68%)");
const BLUE = new THREE.Color("hsl(208, 88%, 60%)");
const BLUE_HI = new THREE.Color("hsl(205, 95%, 75%)");
const BACKGROUND = new THREE.Color("#090807");
const PULSES = 96;

/** Shared pointer position in scene units, updated from the DOM. */
type PointerRef = React.MutableRefObject<THREE.Vector2>;

function Waveguides() {
  const lines = useMemo(
    () =>
      Array.from({ length: WAVEGUIDES }, (_, w) =>
        waveguidePoints(w).map(([x, y]) => new THREE.Vector3(x, y, 0)),
      ),
    [],
  );
  return (
    <group>
      {lines.map((pts, w) => (
        <group key={w}>
          <Line points={pts} color={GOLD} lineWidth={6} transparent opacity={0.07} />
          <Line points={pts} color={w % 2 ? GOLD : GOLD_HI} lineWidth={1.3} transparent opacity={0.6} />
        </group>
      ))}
    </group>
  );
}

const glowVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const glowFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = pow(core, 2.2) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.6 + core), a);
  }
`;

function makeGlowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: glowVertex,
    fragmentShader: glowFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function Pulses({ pointer }: { pointer: PointerRef }) {
  const state = useMemo(
    () =>
      Array.from({ length: PULSES }, () => ({
        x: X_START + Math.random() * (X_END - X_START),
        w: Math.floor(Math.random() * WAVEGUIDES),
        speed: 0.9 + Math.random() * 1.3,
        col: -2,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );
  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(PULSES), 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(PULSES), 1));
    const colors = new Float32Array(PULSES * 3);
    const c = new THREE.Color();
    for (let i = 0; i < PULSES; i++) {
      if (Math.random() < 0.78) c.copy(BLUE).lerp(BLUE_HI, Math.random());
      else c.copy(GOLD_HI);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return { geometry: g, material: makeGlowMaterial() };
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const size = geometry.attributes.aSize as THREE.BufferAttribute;
    const alpha = geometry.attributes.aAlpha as THREE.BufferAttribute;
    for (let i = 0; i < PULSES; i++) {
      const p = state[i];
      p.x += p.speed * dt;
      if (p.x > X_END) {
        p.x = X_START;
        p.w = Math.floor(Math.random() * WAVEGUIDES);
        p.col = -2;
      }
      const col = columnAt(p.x);
      if (col !== p.col) {
        // Entering a new coupler column: like a beam splitter, the pulse may
        // continue on its waveguide or cross to the partner waveguide.
        if (col >= 0 && p.col !== -2) {
          const partner = partnerIn(col, p.w);
          if (partner >= 0 && Math.random() < 0.5) p.w = partner;
        }
        p.col = col;
      }
      const y = waveguideY(p.w, p.x);
      const dx = p.x - pointer.current.x;
      const dy = y - pointer.current.y;
      const near = Math.exp(-(dx * dx + dy * dy) * 0.9);
      const edge = Math.min(1, (p.x - X_START) * 1.5, (X_END - p.x) * 1.5);
      pos.setXYZ(i, p.x, y, 0.01);
      size.setX(i, 0.8 + near * 1.1);
      alpha.setX(i, Math.max(0, edge) * (0.55 + 0.45 * Math.sin(p.phase + p.x * 2.1) ** 2 + near));
    }
    pos.needsUpdate = true;
    size.needsUpdate = true;
    alpha.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function CouplerNodes({ pointer }: { pointer: PointerRef }) {
  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = couplers.length;
    const p = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    couplers.forEach((k, i) => {
      p.set([k.x, k.y, 0], i * 3);
      const c = GOLD.clone().lerp(GOLD_HI, k.column / (COLUMNS - 1));
      col.set([c.r, c.g, c.b], i * 3);
    });
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    return { geometry: g, material: makeGlowMaterial() };
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const size = geometry.attributes.aSize as THREE.BufferAttribute;
    const alpha = geometry.attributes.aAlpha as THREE.BufferAttribute;
    couplers.forEach((k, i) => {
      const dx = k.x - pointer.current.x;
      const dy = k.y - pointer.current.y;
      const near = Math.exp(-(dx * dx + dy * dy) * 0.6);
      // Each interferometer "tunes" its phase over time.
      const phase = 0.5 + 0.5 * Math.sin(t * 0.8 + k.column * 0.9 + k.lower * 1.7);
      size.setX(i, 1.1 + phase * 0.6 + near * 1.4);
      alpha.setX(i, 0.25 + phase * 0.35 + near * 0.6);
    });
    size.needsUpdate = true;
    alpha.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/** Output plane: an animated two-beam interference pattern. */
function InterferenceScreen() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uA: { value: BLUE }, uB: { value: BLUE_HI } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
          void main() {
            float y = (vUv.y - 0.5) * 2.0;
            float k = 18.0 + 4.0 * sin(uTime * 0.35);
            float fringes = pow(cos(k * y + uTime * 0.6) * 0.5 + 0.5, 3.0);
            float envelope = exp(-y * y * 2.2);
            float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.6, vUv.x);
            vec3 col = mix(uA, uB, vUv.y);
            gl_FragColor = vec4(col, fringes * envelope * edge * 0.75);
          }
        `,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock }) => { material.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <mesh position={[X_END + 0.55, 0, -0.05]} material={material}>
      <planeGeometry args={[0.9, 5.4]} />
    </mesh>
  );
}

/** Soft radial backdrop rendered in-scene (the canvas is opaque for bloom). */
function Backdrop() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: { uBg: { value: BACKGROUND }, uGold: { value: GOLD }, uBlue: { value: BLUE } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uBg; uniform vec3 uGold; uniform vec3 uBlue; varying vec2 vUv;
          void main() {
            float g = exp(-pow(distance(vUv, vec2(0.66, 0.58)) * 2.6, 2.0));
            float b = exp(-pow(distance(vUv, vec2(0.86, 0.42)) * 3.4, 2.0));
            vec3 col = uBg + uGold * g * 0.07 + uBlue * b * 0.06;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={[0, 0, -6]} material={material}>
      <planeGeometry args={[60, 34]} />
    </mesh>
  );
}

/** Scroll-driven camera: dolly in and level out as the hero scrolls away. */
function ScrollCamera() {
  const { camera, size } = useThree();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const baseZ = size.width / size.height < 1.2 ? 13 : 10.5;
    const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    const e = p * p * (3 - 2 * p);
    cam.position.z = baseZ - e * 3.2;
    cam.position.y = -e * 0.9;
    cam.position.x = e * 1.2;
    cam.lookAt(e * 1.8, -e * 0.4, 0);
  });
  return null;
}

function Rig({ pointer }: { pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const inside = Math.abs(pointer.current.x) < 20;
    const px = inside ? pointer.current.x : 0;
    const py = inside ? pointer.current.y : 0;
    const targetY = -0.32 + px * 0.025;
    const targetX = -0.42 - py * 0.03;
    g.rotation.y += (targetY - g.rotation.y) * 0.04;
    g.rotation.x += (targetX + Math.sin(t * 0.2) * 0.02 - g.rotation.x) * 0.04;
  });
  return (
    <group ref={group} rotation={[-0.42, -0.32, 0.06]} position={[0.6, -0.2, 0]}>
      <Waveguides />
      <CouplerNodes pointer={pointer} />
      <Pulses pointer={pointer} />
      <InterferenceScreen />
      {Array.from({ length: COLUMNS }, (_, c) => (
        <mesh key={c} position={[columnX(c), 0, -0.4]}>
          <planeGeometry args={[0.012, 5.2]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
}

export default function PhotonicScene({ onReady }: { onReady?: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef(new THREE.Vector2(99, 99));
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [bloom, setBloom] = useState(true);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((ev.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.set(nx * 7, ny * 3.6);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={container} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 10.5], fov: 42 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
        onCreated={() => onReady?.()}
      >
        <color attach="background" args={[BACKGROUND]} />
        <PerformanceMonitor
          onDecline={() => { setDpr(1); setBloom(false); }}
          onIncline={() => setDpr(1.5)}
        />
        <AdaptiveDpr pixelated={false} />
        <Backdrop />
        <ScrollCamera />
        <Rig pointer={pointer} />
        {bloom && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur luminanceThreshold={0.25} luminanceSmoothing={0.3} intensity={0.9} radius={0.7} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
