// Shared pointer state for the background scene: cursor position, drag-to-rotate
// with inertia, and background clicks (used to pop bubbles).

const INTERACTIVE = "a,button,input,textarea,select,label,summary,[role=button],[contenteditable],p,h1,h2,h3,h4,li,pre,code,span,img,picture";

export const interaction = {
  /** Cursor in normalized device coordinates (x right, y up); 9 = no cursor yet. */
  ndc: { x: 9, y: 9 },
  /** Accumulated drag rotation (radians) and velocity. */
  rot: { x: 0, y: 0, vx: 0, vy: 0 },
  dragging: false,
  /** Pending background clicks, in NDC. */
  clicks: [] as { x: number; y: number }[],
};

export function installInteraction(): () => void {
  let down: { x: number; y: number; moved: boolean } | null = null;

  const toNdc = (e: PointerEvent) => ({
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -((e.clientY / window.innerHeight) * 2 - 1),
  });

  const onMove = (e: PointerEvent) => {
    const n = toNdc(e);
    interaction.ndc.x = n.x;
    interaction.ndc.y = n.y;
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!down.moved && Math.hypot(dx, dy) > 6) {
      down.moved = true;
      interaction.dragging = true;
      document.documentElement.classList.add("is-dragging-scene");
    }
    if (down.moved) {
      interaction.rot.vy += e.movementX * 0.0009;
      interaction.rot.vx += e.movementY * 0.0006;
    }
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || e.pointerType !== "mouse") return;
    const t = e.target as Element | null;
    if (t?.closest?.(INTERACTIVE) || t?.closest?.(".lift, .glass-card, nav, header, footer")) return;
    down = { x: e.clientX, y: e.clientY, moved: false };
  };

  const onUp = (e: PointerEvent) => {
    if (down && !down.moved) interaction.clicks.push(toNdc(e));
    down = null;
    interaction.dragging = false;
    document.documentElement.classList.remove("is-dragging-scene");
  };

  const onLeave = () => {
    interaction.ndc.x = 9;
    interaction.ndc.y = 9;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}
