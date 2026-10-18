import * as THREE from "three";
import type { SceneMode } from "@/lib/sceneStore";

// Undersea palette. THREE.Color converts these sRGB hex values to linear,
// so every shader and the fog work in the same color space.
export const OCEAN = {
  deep: new THREE.Color("#03162f"),
  horizon: new THREE.Color("#155f93"),
  surface: new THREE.Color("#a6eef7"),
  sand: new THREE.Color("#c9b48a"),
  pink: new THREE.Color("#ffb3c7"),
  butter: new THREE.Color("#ffe08a"),
  seafoam: new THREE.Color("#8ee8cf"),
  gold: new THREE.Color("#e1b137"),
};

export const FOG_DENSITY = 0.027;

/** Per-scene visibility weights (0..1), eased each frame by the stage. */
export const modeWeights: Record<SceneMode, number> = {
  lattice: 0, stack: 0, timeline: 0, interference: 0, streams: 0, orbit: 0,
};

/** Sea floor height in world units. */
export const FLOOR_Y = -3.6;

/** Shared GLSL: an original moving caustic web (bright where two warped wave fields cross). */
export const CAUSTIC_GLSL = /* glsl */ `
  float caustic(vec2 p, float t) {
    vec2 q = p + vec2(sin(p.y * 1.3 + t * 0.7), cos(p.x * 1.1 - t * 0.6)) * 0.65;
    float a = abs(sin(q.x * 2.1 + t) + sin(q.y * 2.3 - t * 0.8));
    float b = abs(sin((q.x + q.y) * 1.7 - t * 1.1) + sin((q.x - q.y) * 1.9 + t * 0.9));
    float c = 1.0 - min(a, b) * 0.85;
    return pow(clamp(c, 0.0, 1.0), 5.0);
  }
`;

/** Shared GLSL: soap-film reflectance for a film of thickness d (nm) at angle cosine c. */
export const THIN_FILM_GLSL = /* glsl */ `
  vec3 thinFilm(float d, float cosI) {
    float n = 1.33;
    float sinT2 = (1.0 - cosI * cosI) / (n * n);
    float cosT = sqrt(max(0.0, 1.0 - sinT2));
    float opd = 2.0 * n * d * cosT;
    // Reflection off the denser front face adds half a wave: R ~ sin^2(pi * opd / lambda).
    vec3 s = sin(3.14159265 * opd / vec3(650.0, 532.0, 450.0));
    return s * s;
  }
`;
