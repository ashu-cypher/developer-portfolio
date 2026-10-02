/**
 * avatarRig — shared scroll-state rig for the 3D identity scene.
 * Maps the visible page section to position/scale/rotation targets and
 * lerps the scene's outer/inner groups toward them every frame.
 */
import * as THREE from "three";

export type AvatarState =
  | "idle"
  | "about"
  | "journey"
  | "projects"
  | "skills"
  | "contact";

export interface RigTarget {
  pos: [number, number, number];
  scale: number;
  /** Head yaw: negative = toward screen-left (content side) */
  headY: number;
  /** Whole-identity yaw: 0 = facing camera */
  rootY: number;
}

export const DESKTOP_TARGETS: Record<AvatarState, RigTarget> = {
  idle: { pos: [1.7, -0.5, 0], scale: 1, headY: 0, rootY: 0.15 },
  about: { pos: [1.9, -0.5, 0], scale: 1, headY: -0.45, rootY: 0.1 },
  journey: { pos: [1.7, -0.5, 0], scale: 1, headY: 0, rootY: 0.1 },
  projects: { pos: [1.7, -0.35, 0], scale: 0.95, headY: 0.15, rootY: 0.2 },
  skills: { pos: [0, -0.55, 0], scale: 0.9, headY: 0, rootY: -0.15 },
  contact: { pos: [0, -0.5, 0.4], scale: 1.05, headY: 0, rootY: 0 },
};

export const MOBILE_POS: [number, number, number] = [0, -1.2, 0];
export const MOBILE_SCALE = 0.6;

/**
 * Lerp the outer group toward its per-state target. The inner group gets a
 * gentle "journey" bob. `extraYaw` adds a continuous scroll-driven yaw
 * offset on top of the per-state target. Returns the eased interpolation
 * factor used.
 */
export function updateRig(
  outer: THREE.Group | null,
  inner: THREE.Group | null,
  state: AvatarState,
  reduced: boolean,
  mobile: boolean,
  t: number,
  dt: number,
  extraYaw = 0
) {
  if (!outer) return;
  const target = DESKTOP_TARGETS[state];
  const snap = reduced;
  const k = snap ? 1 : 1 - Math.exp(-dt * 4.5);
  const kr = snap ? 1 : 1 - Math.exp(-dt * 5);

  // Journey: horizontal drift on desktop, static on mobile/reduced.
  const tx =
    mobile || reduced || state !== "journey"
      ? mobile
        ? MOBILE_POS[0]
        : target.pos[0]
      : 1.7 + Math.sin(t * 0.5) * 0.4;
  const ty = mobile ? MOBILE_POS[1] : target.pos[1];
  const tz = mobile ? MOBILE_POS[2] : target.pos[2];
  const sc = mobile ? MOBILE_SCALE : target.scale;

  outer.position.x = THREE.MathUtils.damp(outer.position.x, tx, snap ? 1e9 : 4.5, dt);
  outer.position.y += (ty - outer.position.y) * k;
  outer.position.z += (tz - outer.position.z) * k;
  const s = outer.scale.x + (sc - outer.scale.x) * k;
  outer.scale.setScalar(s);
  const rootTarget = target.rootY + extraYaw;
  outer.rotation.y += (rootTarget - outer.rotation.y) * kr;

  if (inner) {
    const walking = state === "journey" && !reduced;
    const leanT = walking ? 0.08 : 0;
    const bobT = walking ? Math.abs(Math.sin(t * 6)) * 0.07 : 0;
    inner.rotation.x += (leanT - inner.rotation.x) * k;
    inner.position.y += (bobT - inner.position.y) * (snap ? 1 : 1 - Math.exp(-dt * 10));
  }
}
