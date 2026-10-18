import { useSyncExternalStore } from "react";

export const SCENE_MODES = ["lattice", "stack", "timeline", "interference", "streams", "orbit"] as const;
export type SceneMode = (typeof SCENE_MODES)[number];

/** Background scene for each route. */
export const ROUTE_SCENES: Record<string, SceneMode> = {
  "/": "lattice",
  "/vision": "lattice",
  "/architecture": "stack",
  "/roadmap": "timeline",
  "/research": "interference",
  "/docs": "streams",
  "/about": "orbit",
  "/downloads": "timeline",
  "/community": "orbit",
};

type State = { route: SceneMode; override: SceneMode | null };
let state: State = { route: "lattice", override: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const sceneStore = {
  setRoute(path: string) {
    const route = ROUTE_SCENES[path] ?? "interference";
    if (route !== state.route || state.override) {
      state = { route, override: null };
      emit();
    }
  },
  /** Lets a long page (the home page) switch scenes per section. */
  setOverride(mode: SceneMode | null) {
    if (mode !== state.override) {
      state = { ...state, override: mode };
      emit();
    }
  },
  get mode(): SceneMode {
    return state.override ?? state.route;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useSceneMode(): SceneMode {
  return useSyncExternalStore(sceneStore.subscribe, () => sceneStore.mode, () => "lattice");
}
