/**
 * BlockAvatar — an ORIGINAL premium futuristic block-style character:
 * a tall, minimal, stylized block figure (block head, neck, broad block
 * torso, block arms/legs, simple block feet) built procedurally from
 * three.js box primitives. Original design — not a copy of any existing
 * game avatar or character, no branding, no cartoon look.
 *
 * - Materials: dark matte clothing (#0d1220), reflective dark-steel body
 *   panels (metalness ~0.9), dark glass inlays, thin emissive cyan seam
 *   lines at LOW intensity, a dark glass diamond chest inlay with a
 *   faint inner glow.
 * - Face: minimal and mysterious — two small luminous eyes, a faint
 *   horizontal visor line, subtle cheek seams. No smile, no expression.
 * - Behaviors: slow breathing, very slow sway, subtle head motion,
 *   gentle whole-body float, a slow light sweep across the body with a
 *   gentle seam pulse, a small drifting particle field, a few tiny
 *   wireframe fragments orbiting nearby.
 * - Mouse: SUBTLE reaction — the head lerps toward the pointer, capped
 *   at small angles (±0.12 rad). Pointer is read from window because the
 *   scene canvas is pointer-events-none.
 * - Scroll: keeps the updateRig extraYaw scroll-driven yaw pattern.
 * - Reduced motion: snaps to a static pose, no looping motion.
 * - Mobile: fewer particles/fragments.
 *
 * Props match the previous identity component so AvatarScene can swap
 * it in place: { state, reduced, mobile }.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  DESKTOP_TARGETS,
  updateRig,
  type AvatarState,
} from "./avatarRig";

const CYAN = "#22d3ee";
const CYAN_GLOW = "#67e8f9";
const VIOLET = "#a78bfa";
const CLOTH = "#0d1220"; // dark matte clothing
const PANEL = "#1a2338"; // dark steel body panels

/* ------------------------------------------------------------------ */
/* Scroll yaw: a tiny continuous rotation driven by page scroll,       */
/* stored in a shared ref updated by a passive scroll listener.        */
/* ------------------------------------------------------------------ */
function useScrollYawTarget() {
  const ref = useRef(0);
  useMemo(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
        // ±0.28 rad across the whole page — felt, never distracting
        ref.current = (window.scrollY / max) * 0.56 - 0.28;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // No cleanup needed: module-lifetime listener for a module-lifetime ref.
    // (The component itself never unmounts in this app.)
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Window pointer, normalized to -1..1 (the canvas is                */
/* pointer-events-none, so r3f's pointer never updates).               */
/* ------------------------------------------------------------------ */
function useWindowPointer() {
  const ref = useRef({ x: 0, y: 0 });
  useMemo(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Shared materials, created once                                      */
/* ------------------------------------------------------------------ */
function useBlockMaterials() {
  return useMemo(
    () => ({
      cloth: new THREE.MeshStandardMaterial({
        color: CLOTH,
        roughness: 0.85,
        metalness: 0.15,
      }),
      panel: new THREE.MeshStandardMaterial({
        color: PANEL,
        roughness: 0.35,
        metalness: 0.9,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#0a1220",
        roughness: 0.12,
        metalness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
      }),
      seam: new THREE.MeshStandardMaterial({
        color: "#061014",
        emissive: new THREE.Color(CYAN),
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.3,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#0b2b33",
        emissive: new THREE.Color(CYAN_GLOW),
        emissiveIntensity: 1.3,
        roughness: 0.3,
      }),
    }),
    []
  );
}

/* ------------------------------------------------------------------ */
/* Small drifting particle field around the figure                     */
/* ------------------------------------------------------------------ */
function BlockParticles({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const COUNT = mobile ? 30 : 80;
  const ref = useRef<THREE.Group>(null);
  const geom = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.25 + Math.random() * 1.1;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -1.9 + Math.random() * 3.9;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [COUNT]);

  useFrame((frameState) => {
    if (reduced || !ref.current) return;
    const t = frameState.clock.elapsedTime;
    ref.current.rotation.y = t * 0.05;
    ref.current.position.y = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <group ref={ref}>
      <points geometry={geom}>
        <pointsMaterial
          color={CYAN_GLOW}
          size={0.026}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* A few tiny wireframe fragments orbiting nearby                      */
/* ------------------------------------------------------------------ */
function BlockFragments({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const frags = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        angle: (i / 5) * Math.PI * 2 + 0.4,
        radius: 1.7 + (i % 3) * 0.3,
        y: -0.4 + i * 0.55,
        size: 0.05 + (i % 2) * 0.035,
        color: i % 3 === 0 ? VIOLET : CYAN,
        octa: i % 2 === 0,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={g}>
      {frags.map((f, i) => (
        <Float key={i} speed={1.6} floatIntensity={1.2} rotationIntensity={0.9}>
          <mesh position={[Math.cos(f.angle) * f.radius, f.y, Math.sin(f.angle) * f.radius]}>
            {f.octa ? (
              <octahedronGeometry args={[f.size]} />
            ) : (
              <boxGeometry args={[f.size, f.size, f.size]} />
            )}
            <meshBasicMaterial color={f.color} wireframe transparent opacity={0.55} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The block avatar                                                    */
/* ------------------------------------------------------------------ */
export default function BlockAvatar({
  state,
  reduced,
  mobile,
}: {
  state: AvatarState;
  reduced: boolean;
  mobile: boolean;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const figure = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const scrollYaw = useScrollYawTarget();
  const pointer = useWindowPointer();
  const mats = useBlockMaterials();

  const clamp = THREE.MathUtils.clamp;

  useFrame((frameState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = frameState.clock.elapsedTime;
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);

    updateRig(outer.current, inner.current, state, reduced, mobile, t, dt, reduced ? 0 : scrollYaw.current);
    if (!figure.current || !head.current || !torso.current) return;

    if (!reduced) {
      // Slow breathing: subtle torso scale/position bob
      const breath = Math.sin(t * 1.1);
      torso.current.scale.y = 1 + breath * 0.01;
      torso.current.position.y = breath * 0.02;
      // Very slow sway + gentle whole-body float
      figure.current.rotation.y = Math.sin(t * 0.4) * 0.05;
      figure.current.rotation.z = Math.sin(t * 0.33) * 0.008;
      figure.current.position.y = Math.sin(t * 0.9) * 0.05;
      // Barely-there arm drift, opposite phase
      if (armL.current) armL.current.rotation.x = Math.sin(t * 0.9) * 0.03;
      if (armR.current) armR.current.rotation.x = -Math.sin(t * 0.9) * 0.03;
      // Light sweep: a rim light slowly crossing the body
      if (sweep.current) sweep.current.position.x = Math.sin(t * 0.3) * 2.4;
      // Gentle emissive pulse on the seams and eyes
      mats.seam.emissiveIntensity = 0.34 + Math.sin(t * 1.6) * 0.14;
      mats.eye.emissiveIntensity = 1.2 + Math.sin(t * 2.2) * 0.25;
    }

    // Subtle head motion: slight tilt/turn + restrained pointer reaction
    const px = pointer.current.x;
    const py = pointer.current.y;
    const baseHeadY = DESKTOP_TARGETS[state].headY;
    const targetHeadY =
      baseHeadY + (reduced || mobile ? 0 : clamp(px * 0.12, -0.12, 0.12)) + (reduced ? 0 : Math.sin(t * 0.5) * 0.06);
    const targetHeadX =
      -0.03 + (reduced || mobile ? 0 : clamp(-py * 0.08, -0.08, 0.08)) + (reduced ? 0 : Math.sin(t * 0.7) * 0.03);
    head.current.rotation.y += (targetHeadY - head.current.rotation.y) * k;
    head.current.rotation.x += (targetHeadX - head.current.rotation.x) * k;
  });

  return (
    <group ref={outer} position={[2.2, -0.85, -0.8]}>
      <group ref={inner}>
        <group ref={figure}>
          {/* ================= HEAD ================= */}
          <group ref={head}>
            {/* Block head */}
            <mesh position={[0, 1.42, 0]} material={mats.panel}>
              <boxGeometry args={[0.72, 0.78, 0.68]} />
            </mesh>
            {/* Subtle dark-glass face plate, slightly proud of the surface */}
            <mesh position={[0, 1.45, 0.335]} material={mats.glass}>
              <boxGeometry args={[0.54, 0.52, 0.04]} />
            </mesh>
            {/* Two small luminous eyes — small and soft, never large */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.13, 1.52, 0.36]} material={mats.eye}>
                <boxGeometry args={[0.075, 0.05, 0.02]} />
              </mesh>
            ))}
            {/* Faint thin visor line under the eyes */}
            <mesh position={[0, 1.34, 0.36]} material={mats.seam}>
              <boxGeometry args={[0.4, 0.016, 0.014]} />
            </mesh>
            {/* Subtle side seams on the head */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.365, 1.42, 0.1]} material={mats.seam}>
                <boxGeometry args={[0.012, 0.5, 0.02]} />
              </mesh>
            ))}
          </group>

          {/* Neck */}
          <mesh position={[0, 0.9, 0]} material={mats.panel}>
            <boxGeometry args={[0.26, 0.24, 0.26]} />
          </mesh>

          {/* ================= TORSO ================= */}
          <group ref={torso}>
            {/* Broad block torso */}
            <mesh position={[0, 0.2, 0]} material={mats.cloth}>
              <boxGeometry args={[1.15, 1.15, 0.72]} />
            </mesh>
            {/* Vertical seam lines along the torso front edges */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.44, 0.2, 0.362]} material={mats.seam}>
                <boxGeometry args={[0.02, 1.0, 0.012]} />
              </mesh>
            ))}
            {/* Shoulder seam line across the upper chest */}
            <mesh position={[0, 0.7, 0.362]} material={mats.seam}>
              <boxGeometry args={[0.95, 0.02, 0.012]} />
            </mesh>
            {/* Chest inlay: dark glass diamond with a faint inner glow */}
            <mesh position={[0, 0.32, 0.365]} material={mats.glass} scale={[0.16, 0.2, 0.06]}>
              <octahedronGeometry args={[1]} />
            </mesh>
            <mesh position={[0, 0.32, 0.372]} material={mats.seam} scale={[0.07, 0.09, 0.03]}>
              <octahedronGeometry args={[1]} />
            </mesh>
          </group>

          {/* ================= ARMS ================= */}
          {[
            { side: -1, ref: armL },
            { side: 1, ref: armR },
          ].map(({ side, ref }) => (
            <group key={side} ref={ref} position={[side * 0.755, 0.62, 0]}>
              {/* Upper arm: matte cloth block */}
              <mesh position={[0, -0.2, 0]} material={mats.cloth}>
                <boxGeometry args={[0.3, 0.55, 0.32]} />
              </mesh>
              {/* Forearm: reflective panel block */}
              <mesh position={[0, -0.72, 0]} material={mats.panel}>
                <boxGeometry args={[0.27, 0.5, 0.29]} />
              </mesh>
              {/* Thin seam band on the forearm */}
              <mesh position={[0, -0.5, 0]} material={mats.seam}>
                <boxGeometry args={[0.28, 0.03, 0.3]} />
              </mesh>
              {/* Hand: simple block */}
              <mesh position={[0, -1.06, 0]} material={mats.cloth}>
                <boxGeometry args={[0.24, 0.26, 0.26]} />
              </mesh>
            </group>
          ))}

          {/* ================= HIPS + LEGS ================= */}
          <mesh position={[0, -0.585, 0]} material={mats.cloth}>
            <boxGeometry args={[0.8, 0.42, 0.6]} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side}>
              {/* Block leg */}
              <mesh position={[side * 0.23, -1.28, 0]} material={mats.panel}>
                <boxGeometry args={[0.34, 1.02, 0.38]} />
              </mesh>
              {/* Thin knee seam */}
              <mesh position={[side * 0.23, -1.2, 0]} material={mats.seam}>
                <boxGeometry args={[0.35, 0.03, 0.39]} />
              </mesh>
              {/* Simple block foot */}
              <mesh position={[side * 0.23, -1.7, 0.08]} material={mats.cloth}>
                <boxGeometry args={[0.36, 0.22, 0.62]} />
              </mesh>
            </group>
          ))}

          {/* Drifting particles + orbiting fragments */}
          <BlockParticles mobile={mobile} reduced={reduced} />
          <BlockFragments reduced={reduced} />

          {/* Local sparkle field */}
          <Sparkles
            count={mobile ? 18 : 32}
            scale={[4, 4.5, 2.5]}
            position={[0, 0.2, 0]}
            size={2.5}
            speed={0.3}
            color={CYAN_GLOW}
            opacity={0.4}
          />

          {/* Rim light that slowly sweeps across the body */}
          <pointLight
            ref={sweep}
            position={[0, 1.2, -1.5]}
            intensity={20}
            color={CYAN_GLOW}
            distance={7}
          />
        </group>
      </group>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.86, 0]}
        scale={3.2}
        blur={2.8}
        opacity={0.5}
        far={4}
        frames={reduced ? 1 : Infinity}
      />
    </group>
  );
}
