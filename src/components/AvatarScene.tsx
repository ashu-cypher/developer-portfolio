/**
 * AvatarScene — the site's centerpiece: a fixed, full-viewport,
 * pointer-events-none 3D background canvas holding the "digital self",
 * a procedural holographic identity that reacts to the visible section.
 *
 * - Tries /models/avatar.glb first (HEAD check); falls back to the
 *   procedural identity if the file is missing. Never throws.
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
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import AvatarFallback from "./AvatarFallback";
import DigitalSelf from "./DigitalSelf";
import { updateRig, type AvatarState } from "./avatarRig";

export type { AvatarState };

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

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
    <group ref={outer} position={[1.7, -0.5, 0]}>
      <primitive object={gltf.scene} />
      <ContactShadows
        position={[0, -0.62, 0]}
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
/* Soft radial glow behind the identity                                 */
/* ------------------------------------------------------------------ */
function BackdropGlow() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
      grad.addColorStop(0, "rgba(34, 211, 238, 0.28)");
      grad.addColorStop(0.5, "rgba(167, 139, 250, 0.1)");
      grad.addColorStop(1, "rgba(5, 7, 15, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 0.9, -2.5]}>
      <planeGeometry args={[8, 5.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Soft floor aura — grounds the figure without any grid/HUD look      */
/* ------------------------------------------------------------------ */
function FloorAura() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
      grad.addColorStop(0, "rgba(34, 211, 238, 0.10)");
      grad.addColorStop(0.6, "rgba(34, 211, 238, 0.04)");
      grad.addColorStop(1, "rgba(5, 7, 15, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[1.7, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[9, 9]} />
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
        /* missing model -> procedural identity */
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
              <FloorAura />
              <Sparkles
                count={mobile ? 25 : 55}
                scale={[9, 4.5, 3]}
                position={[0, 1.2, -1]}
                size={3}
                speed={0.35}
                color="#67e8f9"
                opacity={0.5}
              />
              <Sparkles
                count={mobile ? 14 : 30}
                scale={[8, 4, 3]}
                position={[0, 0.8, -0.5]}
                size={2.5}
                speed={0.25}
                color="#a78bfa"
                opacity={0.4}
              />

              {glbAvailable ? (
                <GlbAvatar state={state} reduced={reduced} mobile={mobile} />
              ) : (
                <DigitalSelf state={state} reduced={reduced} mobile={mobile} />
              )}
            </Canvas>
          </Suspense>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
