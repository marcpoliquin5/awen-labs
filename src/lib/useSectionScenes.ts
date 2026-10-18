import { useEffect } from "react";
import { sceneStore, type SceneMode } from "./sceneStore";

/** While a section with one of these ids is centered on screen, morph the background to its scene. */
export function useSectionScenes(map: Record<string, SceneMode>) {
  useEffect(() => {
    const els = Object.keys(map)
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    const visible = new Set<string>();
    const update = () => {
      const id = Object.keys(map).filter((k) => visible.has(k)).pop();
      sceneStore.setOverride(id ? map[id] : null);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        update();
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => {
      io.disconnect();
      sceneStore.setOverride(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
