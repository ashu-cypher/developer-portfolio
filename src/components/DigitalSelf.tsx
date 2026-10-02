/**
 * DigitalSelf — a procedural "digital human": a synthetic bust
 * (head + neck + shoulders) suggesting a human identity reconstructed
 * by an AI system. Deliberately NOT a robot.
 *
 * Built from: a dark satin head core, translucent holo shells, an inner
 * wireframe topology, a facial point-cloud with neural connections, a
 * neural node network around the body, orbiting geometric fragments,
 * and an occasional scan beam ("AI reconstructing identity").
 *
 * Behaviors: slow rotation, subtle mouse-follow on the head, scroll-state
 * rig (position/scale/yaw via avatarRig) plus a gentle scroll-yaw,
 * idle float, and a ~9s scan cycle. Reduced motion snaps to a static
 * pose; mobile uses fewer particles and skips the reactive field.
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
const SATIN = "#141c30"; // dark satin skin
const SATIN_DEEP = "#0b1122";

const HEAD_R = 0.58;
const HEAD_Y = 0.62; // head center height
const NECK_Y = 0.02;
const SHOULDER_Y = -0.38;

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
/* Facial point cloud + neural connections, generated once             */
/* ------------------------------------------------------------------ */
function useFaceScan() {
  return useMemo(() => {
    const COUNT = 460;
    const rx = HEAD_R;
    const ry = HEAD_R * 1.22;
    const rz = HEAD_R * 0.98;
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2; // 1..-1
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      // Keep the front ~70% so the cloud reads as a face scan
      if (z < -0.25) continue;
      pts.push(new THREE.Vector3(x * rx, HEAD_Y + y * ry, z * rz));
    }

    // Connect near neighbours -> neural mesh (cap segment count)
    const linePos: number[] = [];
    const MAX_DIST = 0.32;
    for (let i = 0; i < pts.length && linePos.length < 2400 * 3; i++) {
      let linked = 0;
      for (let j = i + 1; j < pts.length && linked < 2; j++) {
        if (pts[i].distanceToSquared(pts[j]) < MAX_DIST * MAX_DIST) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          linked++;
        }
      }
    }

    const pointPos = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      pointPos[i * 3] = p.x;
      pointPos[i * 3 + 1] = p.y;
      pointPos[i * 3 + 2] = p.z;
    });

    return { pointPos, linePos: new Float32Array(linePos) };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Neural node network floating around the bust                        */
/* ------------------------------------------------------------------ */
function useBodyNetwork() {
  return useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const rand = rng(42);
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 1.05 + rand() * 0.6;
      nodes.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          -0.35 + rand() * 1.6,
          Math.sin(angle) * radius
        )
      );
    }
    const linePos: number[] = [];
    for (let i = 0; i < nodes.length && linePos.length < 360; i++) {
      for (let j = i + 1; j < nodes.length && linePos.length < 360; j++) {
        if (nodes[i].distanceToSquared(nodes[j]) < 0.55) {
          linePos.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const nodePos = new Float32Array(nodes.length * 3);
    nodes.forEach((p, i) => {
      nodePos[i * 3] = p.x;
      nodePos[i * 3 + 1] = p.y;
      nodePos[i * 3 + 2] = p.z;
    });
    return { nodePos, linePos: new Float32Array(linePos) };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Cursor-reactive particle field around the figure                    */
/* ------------------------------------------------------------------ */
function ReactiveField({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const COUNT = mobile ? 0 : 90;
  const ref = useRef<THREE.Points>(null);
  const { base, pos } = useMemo(() => {
    const base = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.9 + Math.random() * 1.3;
      base[i * 3] = Math.cos(a) * r;
      base[i * 3 + 1] = -0.5 + Math.random() * 2.0;
      base[i * 3 + 2] = Math.sin(a) * r;
    }
    return { base, pos: new Float32Array(base) };
  }, [COUNT]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);

  useFrame((frameState) => {
    if (reduced || !ref.current) return;
    const t = frameState.clock.elapsedTime;
    const px = frameState.pointer.x * 2.2;
    const py = frameState.pointer.y * 1.6 + 0.35;
    const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const bx = base[i * 3] + Math.sin(t * 0.5 + i) * 0.06;
      const by = base[i * 3 + 1] + Math.cos(t * 0.4 + i * 1.7) * 0.06;
      const bz = base[i * 3 + 2];
      // gentle repulsion from the cursor
      const dx = bx - px;
      const dy = by - py;
      const d2 = dx * dx + dy * dy;
      const push = d2 < 1.2 ? (1.2 - d2) * 0.35 : 0;
      const d = Math.sqrt(d2) || 1;
      arr[i * 3] = bx + (dx / d) * push;
      arr[i * 3 + 1] = by + (dy / d) * push;
      arr[i * 3 + 2] = bz;
    }
    attr.needsUpdate = true;
  });

  if (COUNT === 0) return null;
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color={CYAN_GLOW}
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Orbiting geometric fragments                                        */
/* ------------------------------------------------------------------ */
function Fragments({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const frags = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 1.5 + (i % 3) * 0.25,
        y: 0.1 + Math.sin(i * 2.3) * 0.7,
        size: 0.045 + (i % 2) * 0.03,
        color: i % 3 === 0 ? VIOLET : CYAN,
        octa: i % 2 === 0,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.18;
  });

  return (
    <group ref={g}>
      {frags.map((f, i) => (
        <Float key={i} speed={2.2} floatIntensity={1.5} rotationIntensity={1.1}>
          <mesh position={[Math.cos(f.angle) * f.radius, f.y, Math.sin(f.angle) * f.radius]}>
            {f.octa ? (
              <octahedronGeometry args={[f.size]} />
            ) : (
              <tetrahedronGeometry args={[f.size]} />
            )}
            <meshStandardMaterial
              color={f.color}
              emissive={f.color}
              emissiveIntensity={0.55}
              roughness={0.35}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
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
        radius: 1.45 + i * 0.15,
        size: 0.14 - i * 0.025,
        color: i === 1 ? VIOLET : CYAN,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.5;
  });

  return (
    <group ref={g} position={[0, 0.1, 0]}>
      {cubes.map((c, i) => (
        <Float key={i} speed={3} floatIntensity={1.3}>
          <mesh
            position={[
              Math.cos(c.angle) * c.radius,
              (i - 1) * 0.42,
              Math.sin(c.angle) * c.radius,
            ]}
          >
            <boxGeometry args={[c.size, c.size, c.size]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.45}
              roughness={0.35}
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
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.35;
  });

  return (
    <group ref={g} position={[0, 0.1, 0]}>
      {orbs.map((o, i) => (
        <Float key={i} speed={2.4} floatIntensity={1.1}>
          <mesh
            position={[
              Math.cos(o.angle) * 1.6,
              Math.sin(i * 1.7) * 0.5,
              Math.sin(o.angle) * 1.6,
            ]}
          >
            <icosahedronGeometry args={[0.09, 0]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The digital identity                                                */
/* ------------------------------------------------------------------ */
export default function DigitalSelf({
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
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const facePts = useRef<THREE.PointsMaterial>(null);
  const beam = useRef<THREE.Mesh>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const scrollYaw = useScrollYawTarget();

  // Scan-cycle state: idle -> sweep (~1.3s) -> idle (~7-11s)
  const scan = useRef({ next: 5, active: false, t: 0, boost: 0 });

  const { pointPos, linePos } = useFaceScan();
  const network = useBodyNetwork();

  const faceLineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    return g;
  }, [linePos]);
  const facePointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pointPos, 3));
    return g;
  }, [pointPos]);
  const netLineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(network.linePos, 3));
    return g;
  }, [network]);
  const netPointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(network.nodePos, 3));
    return g;
  }, [network]);

  useFrame((frameState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = frameState.clock.elapsedTime;
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);

    updateRig(outer.current, inner.current, state, reduced, mobile, t, dt, reduced ? 0 : scrollYaw.current);
    if (!head.current || !inner.current) return;

    // Slow rotation + idle float
    if (!reduced) {
      head.current.rotation.y += dt * 0.14;
      head.current.position.y = Math.sin(t * 0.85) * 0.05;
    }

    // Subtle mouse-follow: the identity tilts toward the cursor (desktop only)
    const pointer = frameState.pointer;
    const targetTiltX = reduced || mobile ? 0 : -pointer.y * 0.16;
    head.current.rotation.x += (targetTiltX - head.current.rotation.x) * k;
    // Blend the rig's head yaw with the cursor offset on the inner group
    const baseHeadY = DESKTOP_TARGETS[state].headY;
    inner.current.rotation.y +=
      (baseHeadY + (reduced || mobile ? 0 : pointer.x * 0.18) - inner.current.rotation.y) * k;

    // Occasional scan sweep: beam passes, wireframe + points brighten
    const s = scan.current;
    if (!reduced) {
      if (!s.active && t > s.next) {
        s.active = true;
        s.t = 0;
      }
      if (s.active) {
        s.t += dt;
        const phase = s.t / 1.35;
        if (phase >= 1) {
          s.active = false;
          s.boost = 0;
          s.next = t + 7 + Math.random() * 4;
          if (beam.current) beam.current.visible = false;
        } else {
          const env = Math.sin(phase * Math.PI); // 0 -> 1 -> 0
          s.boost = env;
          if (beam.current) {
            beam.current.visible = true;
            beam.current.position.y = HEAD_Y + 0.95 - phase * 2.1;
          }
          if (beamMat.current) beamMat.current.opacity = 0.1 + env * 0.5;
        }
      }
    }
    if (wireMat.current) wireMat.current.opacity = 0.09 + s.boost * 0.3;
    if (facePts.current) {
      facePts.current.opacity = (reduced ? 0.9 : 0.7) + s.boost * 0.3;
      facePts.current.size = 0.026 * (1 + s.boost * 0.7);
    }
  });

  return (
    <group ref={outer} position={[1.7, -0.5, 0]}>
      <group ref={inner}>
        {/* ================= HEAD ================= */}
        <group ref={head}>
          {/* Dark satin core */}
          <mesh position={[0, HEAD_Y, 0]} scale={[1, 1.22, 0.98]}>
            <sphereGeometry args={[HEAD_R, 48, 32]} />
            <meshPhysicalMaterial
              color={SATIN}
              roughness={0.32}
              metalness={0.25}
              clearcoat={0.9}
              clearcoatRoughness={0.35}
            />
          </mesh>
          {/* Translucent holo layer */}
          <mesh position={[0, HEAD_Y, 0]} scale={[1.015, 1.235, 0.995]}>
            <sphereGeometry args={[HEAD_R, 48, 32]} />
            <meshPhysicalMaterial
              color={CYAN}
              transparent
              opacity={0.1}
              roughness={0.12}
              metalness={0.1}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>
          {/* Inner wireframe topology (brightens during scans) */}
          <mesh position={[0, HEAD_Y, 0]} scale={[1, 1.22, 0.98]}>
            <sphereGeometry args={[HEAD_R * 1.002, 20, 14]} />
            <meshBasicMaterial
              ref={wireMat}
              color={CYAN}
              wireframe
              transparent
              opacity={0.09}
              depthWrite={false}
            />
          </mesh>

          {/* Facial point cloud + neural mesh */}
          <lineSegments geometry={faceLineGeom}>
            <lineBasicMaterial color={CYAN} transparent opacity={0.24} />
          </lineSegments>
          <points geometry={facePointGeom}>
            <pointsMaterial
              ref={facePts}
              color={CYAN_GLOW}
              size={0.026}
              sizeAttenuation
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </points>

          {/* Eyes: two very subtle glows */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.2, HEAD_Y + 0.1, HEAD_R * 0.86]}>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshStandardMaterial
                color={CYAN_GLOW}
                emissive={CYAN_GLOW}
                emissiveIntensity={1.1}
                roughness={0.25}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}

          {/* Scan beam (only visible mid-sweep) */}
          <mesh ref={beam} rotation={[Math.PI / 2, 0, 0]} visible={false}>
            <planeGeometry args={[2.4, 0.035]} />
            <meshBasicMaterial
              ref={beamMat}
              color={CYAN_GLOW}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* ================= NECK + SHOULDERS ================= */}
        <group>
          {/* Neck */}
          <mesh position={[0, NECK_Y, 0]}>
            <cylinderGeometry args={[0.155, 0.19, 0.42, 24]} />
            <meshStandardMaterial color={SATIN_DEEP} roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Shoulders / bust drape */}
          <mesh position={[0, SHOULDER_Y, 0]}>
            <cylinderGeometry args={[0.82, 0.5, 0.52, 40]} />
            <meshPhysicalMaterial
              color={SATIN}
              roughness={0.34}
              metalness={0.28}
              clearcoat={0.7}
              clearcoatRoughness={0.4}
            />
          </mesh>
          {/* Faint wireframe over the shoulders */}
          <mesh position={[0, SHOULDER_Y, 0]} scale={1.004}>
            <cylinderGeometry args={[0.82, 0.5, 0.52, 20, 3]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.05} depthWrite={false} />
          </mesh>
          {/* Glowing rim at the bust base */}
          <mesh position={[0, SHOULDER_Y - 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.008, 8, 72]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Neural node network around the body */}
        <lineSegments geometry={netLineGeom}>
          <lineBasicMaterial color={VIOLET} transparent opacity={0.16} />
        </lineSegments>
        <points geometry={netPointGeom}>
          <pointsMaterial
            color={VIOLET}
            size={0.035}
            sizeAttenuation
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </points>

        <Fragments reduced={reduced} />
        <ReactiveField reduced={reduced} mobile={mobile} />

        {/* Local sparkle field */}
        <Sparkles
          count={mobile ? 20 : 48}
          scale={[3.4, 3.0, 2]}
          position={[0, 0.25, 0]}
          size={3}
          speed={0.35}
          color={CYAN_GLOW}
          opacity={0.45}
        />

        {/* Soft rim light from behind for volumetric feel */}
        <spotLight
          position={[-2.5, 3.2, -2.2]}
          angle={0.55}
          penumbra={1}
          intensity={26}
          color={CYAN_GLOW}
        />
      </group>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.78, 0]}
        scale={4.5}
        blur={2.6}
        opacity={0.45}
        far={3}
        frames={reduced ? 1 : Infinity}
      />

      {/* State dressing */}
      {state === "projects" && <ProjectCubes reduced={reduced} />}
      {state === "skills" && <SkillOrbs reduced={reduced} />}
    </group>
  );
}
