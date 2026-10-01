/**
 * AvatarScene — the site's centerpiece: a fixed, full-viewport,
 * pointer-events-none 3D background canvas with a blocky game-inspired
 * avatar that reacts to the currently visible section.
 *
 * - Tries /models/avatar.glb first (HEAD check); falls back to the
 *   procedural avatar if the file is missing. Never throws.
 * - Renders the CSS AvatarFallback if WebGL is unavailable or the Canvas
 *   throws (via an error boundary).
 * - All animation is smooth-lerped toward per-state targets; when the user
 *   prefers reduced motion, poses snap to targets with no looping motion.
 */
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Grid,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import AvatarFallback from "./AvatarFallback";

export type AvatarState =
  | "idle"
  | "about"
  | "journey"
  | "projects"
  | "skills"
  | "contact";

interface RigTarget {
  pos: [number, number, number];
  scale: number;
  /** Head yaw: negative = toward screen-left (content side) */
  headY: number;
  /** Whole-avatar yaw: 0 = facing camera */
  rootY: number;
}

const DESKTOP_TARGETS: Record<AvatarState, RigTarget> = {
  idle: { pos: [1.7, -0.7, 0], scale: 1, headY: 0, rootY: 0.15 },
  about: { pos: [1.9, -0.7, 0], scale: 1, headY: -0.45, rootY: 0.1 },
  journey: { pos: [1.7, -0.7, 0], scale: 1, headY: 0, rootY: 0.1 },
  projects: { pos: [1.7, -0.5, 0], scale: 0.9, headY: 0.15, rootY: 0.2 },
  skills: { pos: [0, -0.8, 0], scale: 0.85, headY: 0, rootY: -0.15 },
  contact: { pos: [0, -0.7, 0.4], scale: 1.05, headY: 0, rootY: 0 },
};

const MOBILE_POS: [number, number, number] = [0, -1.35, 0];
const MOBILE_SCALE = 0.55;

const BODY = "#1b2540";
const BODY_DARK = "#141d33";
const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const FACE_DARK = "#05070f";

/* ------------------------------------------------------------------ */
/* Shared rig: lerps the outer group's position/scale/rotation toward   */
/* per-state targets, plus the inner group's bob/lean.                  */
/* ------------------------------------------------------------------ */
function updateRig(
  outer: THREE.Group | null,
  inner: THREE.Group | null,
  state: AvatarState,
  reduced: boolean,
  mobile: boolean,
  t: number,
  dt: number
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
  outer.rotation.y += (target.rootY - outer.rotation.y) * kr;

  if (inner) {
    const walking = state === "journey" && !reduced;
    const leanT = walking ? 0.08 : 0;
    const bobT = walking ? Math.abs(Math.sin(t * 6)) * 0.07 : 0;
    inner.rotation.x += (leanT - inner.rotation.x) * k;
    inner.position.y += (bobT - inner.position.y) * (snap ? 1 : 1 - Math.exp(-dt * 10));
  }
}

/* ------------------------------------------------------------------ */
/* Procedural blocky avatar                                             */
/* ------------------------------------------------------------------ */
function ProceduralAvatar({
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
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const blink = useRef({ next: 2.2, until: -1 });

  useFrame((frameState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = frameState.clock.elapsedTime;
    updateRig(outer.current, inner.current, state, reduced, mobile, t, dt);
    if (!head.current) return;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 6);

    // Head: sway vs. look-at-content
    const headTarget = DESKTOP_TARGETS[state].headY;
    head.current.rotation.y += (headTarget - head.current.rotation.y) * k;
    const sway = reduced ? 0 : Math.sin(t * 0.8) * 0.07;
    head.current.rotation.z += (sway - head.current.rotation.z) * k;
    head.current.rotation.x +=
      ((reduced ? 0 : Math.sin(t * 0.6) * 0.04) - head.current.rotation.x) * k;

    // Breathing
    if (torso.current) {
      const breathe = reduced ? 1 : 1 + Math.sin(t * 1.6) * 0.02;
      torso.current.scale.y += (breathe - torso.current.scale.y) * k;
    }

    // Blink (timer-based, eyes scaleY)
    const b = blink.current;
    let eyeSY = 1;
    if (!reduced) {
      if (t > b.next) {
        b.until = t + 0.12;
        b.next = t + 2.4 + Math.random() * 2.2;
      }
      if (t < b.until) eyeSY = 0.12;
    }
    if (eyeL.current) eyeL.current.scale.y = eyeSY;
    if (eyeR.current) eyeR.current.scale.y = eyeSY;

    // Limbs
    const walking = state === "journey" && !reduced;
    const waving = state === "projects" && !reduced;
    const swingL = walking ? Math.sin(t * 6) * 0.55 : 0;
    const swingR = walking ? -Math.sin(t * 6) * 0.55 : 0;
    if (legL.current) legL.current.rotation.x += (swingL - legL.current.rotation.x) * k;
    if (legR.current) legR.current.rotation.x += (swingR - legR.current.rotation.x) * k;
    const armSwingL = walking ? -Math.sin(t * 6) * 0.45 : 0;
    if (armL.current) {
      armL.current.rotation.x += (armSwingL - armL.current.rotation.x) * k;
      armL.current.rotation.z += (0.08 - armL.current.rotation.z) * k;
    }
    if (armR.current) {
      const targetX = walking ? Math.sin(t * 6) * 0.45 : waving ? -0.35 : 0;
      const targetZ = waving ? -0.5 + Math.sin(t * 3.4) * 0.5 : -0.08;
      armR.current.rotation.x += (targetX - armR.current.rotation.x) * k;
      armR.current.rotation.z += (targetZ - armR.current.rotation.z) * k;
    }
  });

  return (
    <group ref={outer} position={[1.7, -0.7, 0]}>
      <group ref={inner}>
        {/* Head */}
        <group ref={head} position={[0, 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshStandardMaterial color={BODY} roughness={0.55} />
          </mesh>
          {/* Eyes */}
          <mesh ref={eyeL} position={[-0.11, 0.06, 0.26]}>
            <boxGeometry args={[0.08, 0.1, 0.02]} />
            <meshStandardMaterial color={FACE_DARK} roughness={0.4} />
          </mesh>
          <mesh ref={eyeR} position={[0.11, 0.06, 0.26]}>
            <boxGeometry args={[0.08, 0.1, 0.02]} />
            <meshStandardMaterial color={FACE_DARK} roughness={0.4} />
          </mesh>
          {/* Smile */}
          <mesh position={[0, -0.1, 0.26]}>
            <boxGeometry args={[0.18, 0.025, 0.02]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.7}
              roughness={0.4}
            />
          </mesh>
          {/* Headphone cups + band */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.58, 0.07, 0.58]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.25}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[-0.29, 0, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.3]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0.29, 0, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.3]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
          {/* Antenna with violet tip */}
          <mesh position={[0.16, 0.36, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
          </mesh>
          <mesh position={[0.16, 0.48, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={VIOLET}
              emissive={VIOLET}
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* Torso */}
        <mesh ref={torso} position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.72, 0.8, 0.42]} />
          <meshStandardMaterial color={BODY} roughness={0.55} />
        </mesh>
        {/* Chest plate */}
        <mesh position={[0, 0.14, 0.22]}>
          <boxGeometry args={[0.3, 0.38, 0.03]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.35}
            roughness={0.35}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Belt */}
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.74, 0.09, 0.44]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.45} roughness={0.4} />
        </mesh>

        {/* Arms (pivot at shoulder) */}
        <group ref={armL} position={[-0.46, 0.38, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.22, 0.18, 0.22]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
        </group>
        <group ref={armR} position={[0.46, 0.38, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.22, 0.18, 0.22]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
        </group>

        {/* Legs (pivot at hip) */}
        <group ref={legL} position={[-0.18, -0.3, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.24, 0.54, 0.24]} />
            <meshStandardMaterial color={BODY} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.58, 0.03]}>
            <boxGeometry args={[0.27, 0.15, 0.32]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} roughness={0.4} />
          </mesh>
        </group>
        <group ref={legR} position={[0.18, -0.3, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.24, 0.54, 0.24]} />
            <meshStandardMaterial color={BODY} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.58, 0.03]}>
            <boxGeometry args={[0.27, 0.15, 0.32]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Ground shadow follows the avatar */}
      <ContactShadows
        position={[0, -1.04, 0]}
        scale={4.5}
        blur={2.4}
        opacity={0.55}
        far={3}
        frames={reduced ? 1 : Infinity}
      />

      {/* State dressing */}
      {state === "projects" && <ProjectCubes reduced={reduced} />}
      {state === "skills" && <SkillOrbs reduced={reduced} />}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* GLB model (only rendered when /models/avatar.glb exists)             */
/* ------------------------------------------------------------------ */
function GlbAvatar({
  state,
  reduced,
  mobile,
}: {
  state: AvatarState;
  reduced: boolean;
  mobile: boolean;
}) {
  const gltf = useGLTF("/models/avatar.glb");
  const outer = useRef<THREE.Group>(null);

  useFrame((_frameState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    updateRig(outer.current, null, state, reduced, mobile, 0, dt);
  });

  return (
    <group ref={outer} position={[1.7, -0.7, 0]}>
      <primitive object={gltf.scene} />
      <ContactShadows
        position={[0, -1.04, 0]}
        scale={4.5}
        blur={2.4}
        opacity={0.55}
        far={3}
        frames={reduced ? 1 : Infinity}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* State dressing: floating build cubes / orbiting tech orbs            */
/* ------------------------------------------------------------------ */
function ProjectCubes({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const cubes = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        angle: (i / 3) * Math.PI * 2,
        radius: 1.15 + i * 0.12,
        size: 0.16 - i * 0.03,
        color: i === 1 ? VIOLET : CYAN,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) {
      g.current.rotation.y = frameState.clock.elapsedTime * 0.7;
    }
  });

  return (
    <group ref={g} position={[0, 0.3, 0]}>
      {cubes.map((c, i) => (
        <Float key={i} speed={3} floatIntensity={1.4}>
          <mesh position={[Math.cos(c.angle) * c.radius, (i - 1) * 0.35, Math.sin(c.angle) * c.radius]}>
            <boxGeometry args={[c.size, c.size, c.size]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.55}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SkillOrbs({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const orbs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        color: i % 2 === 0 ? CYAN : VIOLET,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) {
      g.current.rotation.y = frameState.clock.elapsedTime * 0.45;
    }
  });

  return (
    <group ref={g} position={[0, 0.15, 0]}>
      {orbs.map((o, i) => (
        <Float key={i} speed={2.5} floatIntensity={1.2}>
          <mesh
            position={[
              Math.cos(o.angle) * 1.3,
              Math.sin(i * 1.7) * 0.3,
              Math.sin(o.angle) * 1.3,
            ]}
          >
            <icosahedronGeometry args={[0.11, 0]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={0.65}
              roughness={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Soft radial glow behind the avatar                                   */
/* ------------------------------------------------------------------ */
function BackdropGlow() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
      grad.addColorStop(0, "rgba(34, 211, 238, 0.32)");
      grad.addColorStop(0.5, "rgba(167, 139, 250, 0.12)");
      grad.addColorStop(1, "rgba(5, 7, 15, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 0.7, -2.5]}>
      <planeGeometry args={[8, 5.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Error boundary: WebGL failure -> CSS fallback                        */
/* ------------------------------------------------------------------ */
class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state: { failed: boolean } = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */
export default function AvatarScene({ state }: { state: AvatarState }) {
  const reduce = useReducedMotion();
  const reduced = reduce ?? false;

  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [glbAvailable, setGlbAvailable] = useState(false);
  const [webglOk] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });

  // Track viewport width for mobile positioning; cancel on unmount.
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Only fetch the GLB model if it actually exists.
  useEffect(() => {
    let cancelled = false;
    fetch("/models/avatar.glb", { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setGlbAvailable(true);
      })
      .catch(() => {
        /* missing model -> procedural avatar */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Preload the GLB once confirmed to exist (keeps the Suspense fast).
  useEffect(() => {
    if (glbAvailable) useGLTF.preload("/models/avatar.glb");
  }, [glbAvailable]);

  const fallback = (
    <AvatarFallback className="absolute inset-0 flex items-center justify-center" />
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {!webglOk ? (
        fallback
      ) : (
        <WebGLErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 1.1, 6.2], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
            >
              <fog attach="fog" args={["#05070f", 9, 17]} />

              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[4, 6, 4]} intensity={1.1} />
              <pointLight position={[-4, 2, 3]} intensity={18} color={CYAN} />
              <pointLight position={[4, 1, 2]} intensity={14} color={VIOLET} />

              {/* Scene dressing */}
              <BackdropGlow />
              <Sparkles
                count={55}
                scale={[9, 4.5, 3]}
                position={[0, 1.2, -1]}
                size={3}
                speed={0.35}
                color="#67e8f9"
                opacity={0.55}
              />
              <Sparkles
                count={30}
                scale={[8, 4, 3]}
                position={[0, 0.8, -0.5]}
                size={2.5}
                speed={0.25}
                color="#a78bfa"
                opacity={0.45}
              />
              <Grid
                position={[0, -1.62, 0]}
                args={[12, 12]}
                cellSize={0.6}
                cellThickness={0.6}
                cellColor="#0b1330"
                sectionSize={3}
                sectionThickness={1.1}
                sectionColor="#112244"
                fadeDistance={17}
                fadeStrength={2.2}
                infiniteGrid
              />

              {glbAvailable ? (
                <GlbAvatar state={state} reduced={reduced} mobile={mobile} />
              ) : (
                <ProceduralAvatar state={state} reduced={reduced} mobile={mobile} />
              )}
            </Canvas>
          </Suspense>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
