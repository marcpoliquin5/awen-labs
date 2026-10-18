import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAUSTIC_GLSL, FLOOR_Y, OCEAN } from "./palette";
import { interaction } from "../interaction";

const fogUniforms = () => THREE.UniformsUtils.clone(THREE.UniformsLib.fog);

/* ------------------------------------------------------------------ */
/* Water column: a camera-centered dome. Deep blue below, a bright,    */
/* shimmering surface above, and soft shafts of light from the sun.    */
/* ------------------------------------------------------------------ */
const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const skyFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uHorizon;
  uniform vec3 uSurface;
  varying vec3 vDir;
  ${CAUSTIC_GLSL}
  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec3 col = mix(uDeep, uHorizon, smoothstep(-0.7, 0.02, y));
    col = mix(col, uSurface * 0.55, smoothstep(0.12, 0.75, y));
    // Shimmering surface seen from below (Snell's window).
    if (y > 0.18) {
      vec2 uv = d.xz / y * 2.6;
      float c = caustic(uv, uTime * 0.6) + caustic(uv * 1.7 + 3.1, uTime * 0.8) * 0.6;
      col += uSurface * c * smoothstep(0.18, 0.85, y) * 0.55;
    }
    vec3 sun = normalize(vec3(0.25, 1.0, -0.35));
    float s = max(dot(d, sun), 0.0);
    col += uSurface * (pow(s, 10.0) * 0.55 + pow(s, 80.0) * 0.8);
    // Faint radial rays fanning down from the sun.
    float ang = atan(d.x - sun.x * 0.4, d.z - sun.z * 0.4);
    float rays = pow(abs(sin(ang * 7.0 + sin(uTime * 0.21) * 0.6)) * abs(sin(ang * 11.0 - uTime * 0.13)), 3.0);
    col += uSurface * rays * smoothstep(-0.25, 0.55, y) * (1.0 - smoothstep(0.55, 0.95, y)) * 0.12;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function WaterColumn() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: OCEAN.deep },
          uHorizon: { value: OCEAN.horizon },
          uSurface: { value: OCEAN.surface },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(70, 48, 24), []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    mesh.current?.position.copy(state.camera.position);
  });
  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={-10} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* Light shafts: soft additive planes that turn to face the camera.     */
/* ------------------------------------------------------------------ */
const rayVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vPhase;
  void main() {
    vUv = uv;
    vPhase = modelMatrix[3].x * 0.37 + modelMatrix[3].z * 0.21;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const rayFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec2 vUv;
  varying float vPhase;
  void main() {
    float edge = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
    float fall = pow(vUv.y, 1.6);
    float flicker = 0.55 + 0.45 * sin(uTime * 0.45 + vPhase * 6.0 + vUv.y * 2.5);
    float bands = 0.75 + 0.25 * sin(vUv.x * 14.0 + uTime * 0.7 + vPhase * 3.0);
    gl_FragColor = vec4(uColor * edge * fall * flicker * bands * uStrength, 1.0);
  }
`;

const RAYS = [
  [-15, -14, 4.5], [-8, -20, 3], [-3, -9, 2.4], [3, -16, 5], [8, -7, 2.2], [13, -18, 4], [19, -11, 3.2], [0, -26, 6],
] as const;

export function LightShafts() {
  const group = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: rayVertex,
        fragmentShader: rayFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: OCEAN.surface.clone().multiplyScalar(0.35) }, uStrength: { value: 1 } },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const cam = state.camera.position;
    group.current?.children.forEach((c) => {
      // Yaw toward the camera, keeping the slant from the sun.
      c.rotation.set(0, Math.atan2(cam.x - c.position.x, cam.z - c.position.z), 0, "YXZ");
      c.rotateZ(-0.18);
    });
  });
  return (
    <group ref={group}>
      {RAYS.map(([x, z, w], i) => (
        <mesh key={i} geometry={geometry} material={material} position={[x, 7, z]} scale={[w, 26, 1]} frustumCulled={false} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sand floor with gentle dunes and caustics dancing across it.         */
/* ------------------------------------------------------------------ */
const floorVertex = /* glsl */ `
  #include <fog_pars_vertex>
  varying vec3 vWorld;
  void main() {
    vec3 p = position;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    wp.y += sin(wp.x * 0.28) * cos(wp.z * 0.23) * 0.35 + sin(wp.x * 0.9 + wp.z * 0.7) * 0.07;
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;
const floorFragment = /* glsl */ `
  #include <fog_pars_fragment>
  uniform float uTime;
  uniform vec3 uSand;
  uniform vec3 uLight;
  varying vec3 vWorld;
  ${CAUSTIC_GLSL}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 p = vWorld.xz;
    float c = caustic(p * 0.55, uTime * 0.9) * 0.8 + caustic(p * 0.9 + 7.0, uTime * 1.2) * 0.45;
    float ripples = 0.5 + 0.5 * sin(p.x * 2.2 + sin(p.y * 0.8) * 1.5);
    float grain = hash(floor(p * 40.0)) * 0.06;
    vec3 col = uSand * (0.22 + ripples * 0.06 + grain) + uLight * c * 0.55;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

export function SeaFloor() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        fog: true,
        uniforms: {
          ...fogUniforms(),
          uTime: { value: 0 },
          uSand: { value: OCEAN.sand },
          uLight: { value: OCEAN.surface },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(170, 170, 120, 120).rotateX(-Math.PI / 2), []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  useFrame((state) => { material.uniforms.uTime.value = state.clock.elapsedTime; });
  return <mesh geometry={geometry} material={material} position={[0, FLOOR_Y, -20]} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* Procedural kelp and seagrass: instanced ribbons swaying in a current. */
/* ------------------------------------------------------------------ */
const kelpVertex = /* glsl */ `
  #include <fog_pars_vertex>
  attribute vec2 aKelp; // phase, hue
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vH;
  varying float vHue;
  void main() {
    float h = uv.y;
    vec3 p = position;
    p.x *= 1.0 - h * 0.75;
    vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
    float sway = sin(uTime * 0.8 + aKelp.x + h * 2.2) * 0.55 + sin(uTime * 1.7 + aKelp.x * 2.0 + h * 5.0) * 0.12;
    wp.x += sway * h * h * 1.2 + uPointer.x * h * h * 0.6;
    wp.z += cos(uTime * 0.6 + aKelp.x) * h * h * 0.5;
    vH = h;
    vHue = aKelp.y;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;
const kelpFragment = /* glsl */ `
  #include <fog_pars_fragment>
  uniform vec3 uBase;
  uniform vec3 uTip;
  uniform vec3 uTipAlt;
  varying float vH;
  varying float vHue;
  void main() {
    vec3 tip = mix(uTip, uTipAlt, step(0.75, vHue));
    vec3 col = mix(uBase, tip, smoothstep(0.0, 1.0, vH)) * (0.55 + 0.45 * vH);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

const KELP = 220;

export function Kelp() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.34, 1, 1, 14).translate(0, 0.5, 0);
    const data = new Float32Array(KELP * 2);
    for (let i = 0; i < KELP; i++) { data[i * 2] = Math.random() * 6.28; data[i * 2 + 1] = Math.random(); }
    g.setAttribute("aKelp", new THREE.InstancedBufferAttribute(data, 2));
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: kelpVertex,
        fragmentShader: kelpFragment,
        side: THREE.DoubleSide,
        fog: true,
        uniforms: {
          ...fogUniforms(),
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
          uBase: { value: new THREE.Color("#0c3b34") },
          uTip: { value: new THREE.Color("#6fd6a8") },
          uTipAlt: { value: OCEAN.pink.clone().multiplyScalar(0.8) },
        },
      }),
    [],
  );
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    // Clumps along the edges of the scene, leaving the middle open.
    const clumps = Array.from({ length: 26 }, () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      return new THREE.Vector2(side * (5 + Math.random() * 20), -2 - Math.random() * 30);
    });
    for (let i = 0; i < KELP; i++) {
      const c = clumps[i % clumps.length];
      const tall = Math.random() < 0.35;
      o.position.set(c.x + (Math.random() - 0.5) * 2.4, FLOOR_Y - 0.1, c.y + (Math.random() - 0.5) * 2.4);
      o.rotation.set(0, Math.random() * Math.PI, 0);
      const h = tall ? 3 + Math.random() * 4 : 0.7 + Math.random() * 1.4;
      o.scale.set(tall ? 1.2 : 0.6, h, 1);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const { x, y } = interaction.ndc;
    const on = Math.abs(x) <= 1 && Math.abs(y) <= 1;
    const u = material.uniforms.uPointer.value as THREE.Vector2;
    u.x += ((on ? x : 0) - u.x) * 0.03;
    u.y += ((on ? y : 0) - u.y) * 0.03;
  });
  return <instancedMesh ref={mesh} args={[geometry, material, KELP]} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* Plankton: tiny drifting motes that give the water depth.             */
/* ------------------------------------------------------------------ */
const planktonVertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vA;
  varying float vWarm;
  void main() {
    vec3 p = position;
    float t = uTime;
    p.x += sin(t * 0.17 + aSeed.x * 6.28) * 0.6;
    p.z += cos(t * 0.13 + aSeed.y * 6.28) * 0.6;
    p.y = mod(p.y + t * (0.05 + aSeed.z * 0.12) + 6.0, 18.0) - 6.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    vA = (0.35 + 0.65 * (0.5 + 0.5 * sin(t * 1.3 + aSeed.w * 30.0))) * exp(-depth * 0.045) * smoothstep(0.5, 2.5, depth);
    vWarm = step(0.86, aSeed.w);
    gl_PointSize = clamp(uPixel * (1.0 + aSeed.z * 2.0) * (14.0 / depth), 1.0, 9.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const planktonFragment = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uWarm;
  varying float vA;
  varying float vWarm;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uCool, uWarm, vWarm) * a, 1.0);
  }
`;

const PLANKTON = 1800;

export function Plankton() {
  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(PLANKTON * 3);
    const seed = new Float32Array(PLANKTON * 4);
    for (let i = 0; i < PLANKTON; i++) {
      pos.set([(Math.random() - 0.5) * 44, Math.random() * 18 - 6, 8 - Math.random() * 40], i * 3);
      seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    const m = new THREE.ShaderMaterial({
      vertexShader: planktonVertex,
      fragmentShader: planktonFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixel: { value: 1 },
        uCool: { value: OCEAN.seafoam.clone().multiplyScalar(0.7) },
        uWarm: { value: OCEAN.butter.clone().multiplyScalar(0.9) },
      },
    });
    return { geometry: g, material: m };
  }, []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixel.value = state.gl.getPixelRatio();
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
