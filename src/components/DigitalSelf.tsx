/**
 * DigitalSelf — a procedural "digital identity": a futuristic synthetic
 * head suggesting a holographic facial reconstruction, not a robot.
 *
 * Built from: a translucent head core, a wireframe topology shell, a
 * facial point-cloud with neural-network connections, a sweeping scan
 * ring, counter-rotating holographic shells, orbiting data shards and
 * soft eye glows.
 *
 * Behaviors: slow rotation, subtle mouse-follow tilt, scroll-state rig
 * (position/scale/yaw via avatarRig), idle float. Reduced motion snaps
 * to static poses; mobile uses fewer particles via the `mobile` flag.
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
const HEAD_R = 0.62; // head core radius
const HEAD_Y = 0.35; // head center height

/* ------------------------------------------------------------------ */
/* Facial point cloud + neural connections, generated once             */
/* ------------------------------------------------------------------ */
function useFaceScan() {
  return useMemo(() => {
    const COUNT = 420;
    const rx = HEAD_R;
    const ry = HEAD_R * 1.18;
    const rz = HEAD_R * 0.95;
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
      // Slightly denser around the face plane: push points toward the shell
      pts.push(
        new THREE.Vector3(x * rx, HEAD_Y + y * ry, z * rz)
      );
    }

    // Connect near neighbours -> neural mesh (cap segment count)
    const linePos: number[] = [];
    const MAX_DIST = 0.34;
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

    return { pointPos, linePos: new Float32Array(linePos), count: pts.length };
  }, []);
}

function FaceScan({ reduced }: { reduced: boolean }) {
  const { pointPos, linePos } = useFaceScan();
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    return g;
  }, [linePos]);
  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pointPos, 3));
    return g;
  }, [pointPos]);

  return (
    <group>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color={CYAN} transparent opacity={0.28} />
      </lineSegments>
      <points geometry={pointGeom}>
        <pointsMaterial
          color={CYAN_GLOW}
          size={0.028}
          sizeAttenuation
          transparent
          opacity={reduced ? 0.9 : 0.75}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sweeping scan ring                                                  */
/* ------------------------------------------------------------------ */
function ScanRing({ reduced }: { reduced: boolean }) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((frameState) => {
    if (!ring.current || reduced) return;
    const t = frameState.clock.elapsedTime;
    // Sweep vertically across the head, loop
    const phase = (t * 0.35) % 1;
    ring.current.position.y = HEAD_Y - 0.85 + phase * 1.7;
    const fade = Math.sin(phase * Math.PI);
    const mat = ring.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.15 + fade * 0.55;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, HEAD_Y, 0]}>
      <torusGeometry args={[HEAD_R * 1.28, 0.012, 8, 64]} />
      <meshStandardMaterial
        color={CYAN}
        emissive={CYAN}
        emissiveIntensity={1.2}
        transparent
        opacity={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Counter-rotating holographic shells                                 */
/* ------------------------------------------------------------------ */
function HoloShells({ reduced }: { reduced: boolean }) {
  const s1 = useRef<THREE.Mesh>(null);
  const s2 = useRef<THREE.Mesh>(null);

  useFrame((_frameState, dtRaw) => {
    if (reduced) return;
    const dt = Math.min(dtRaw, 0.05);
    if (s1.current) {
      s1.current.rotation.y += dt * 0.12;
      s1.current.rotation.x += dt * 0.05;
    }
    if (s2.current) {
      s2.current.rotation.y -= dt * 0.09;
      s2.current.rotation.z += dt * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={s1} position={[0, HEAD_Y, 0]}>
        <icosahedronGeometry args={[HEAD_R * 1.75, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.07} />
      </mesh>
      <mesh ref={s2} position={[0, HEAD_Y, 0]}>
        <icosahedronGeometry args={[HEAD_R * 2.1, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orbiting data shards                                               */
/* ------------------------------------------------------------------ */
function DataShards({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        radius: 1.25 + (i % 3) * 0.22,
        y: HEAD_Y + Math.sin(i * 2.1) * 0.55,
        size: 0.05 + (i % 2) * 0.03,
        color: i % 3 === 0 ? VIOLET : CYAN,
        speed: 2.2 + (i % 3) * 0.5,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.22;
  });

  return (
    <group ref={g}>
      {shards.map((s, i) => (
        <Float key={i} speed={s.speed} floatIntensity={1.6} rotationIntensity={1.2}>
          <mesh position={[Math.cos(s.angle) * s.radius, s.y, Math.sin(s.angle) * s.radius]}>
            <tetrahedronGeometry args={[s.size]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={0.9}
              roughness={0.25}
              transparent
              opacity={0.85}
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
        radius: 1.35 + i * 0.15,
        size: 0.15 - i * 0.03,
        color: i === 1 ? VIOLET : CYAN,
      })),
    []
  );

  useFrame((frameState) => {
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.6;
  });

  return (
    <group ref={g} position={[0, HEAD_Y, 0]}>
      {cubes.map((c, i) => (
        <Float key={i} speed={3} floatIntensity={1.4}>
          <mesh
            position={[
              Math.cos(c.angle) * c.radius,
              (i - 1) * 0.4,
              Math.sin(c.angle) * c.radius,
            ]}
          >
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
    if (!reduced && g.current) g.current.rotation.y = frameState.clock.elapsedTime * 0.4;
  });

  return (
    <group ref={g} position={[0, HEAD_Y, 0]}>
      {orbs.map((o, i) => (
        <Float key={i} speed={2.5} floatIntensity={1.2}>
          <mesh
            position={[
              Math.cos(o.angle) * 1.5,
              HEAD_Y + Math.sin(i * 1.7) * 0.35 - HEAD_Y,
              Math.sin(o.angle) * 1.5,
            ]}
          >
            <icosahedronGeometry args={[0.1, 0]} />
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
/* The digital identity itself                                         */
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

  useFrame((frameState, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = frameState.clock.elapsedTime;
    updateRig(outer.current, inner.current, state, reduced, mobile, t, dt);
    if (!head.current || !inner.current) return;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);

    // Slow rotation + idle float
    if (!reduced) {
      head.current.rotation.y += dt * 0.16;
      head.current.position.y = Math.sin(t * 0.9) * 0.06;
    }

    // Subtle mouse-follow tilt on the inner group (desktop only)
    const pointer = frameState.pointer;
    const targetTiltY =
      DESKTOP_TARGETS[state].headY + (reduced || mobile ? 0 : pointer.x * 0.3);
    const targetTiltX = reduced || mobile ? 0 : -pointer.y * 0.18;
    inner.current.rotation.y += (targetTiltY - inner.current.rotation.y) * k;
    inner.current.rotation.x += (targetTiltX - inner.current.rotation.x) * k;
  });

  return (
    <group ref={outer} position={[1.7, -0.5, 0]}>
      <group ref={inner}>
        <group ref={head}>
          {/* Translucent head core */}
          <mesh position={[0, HEAD_Y, 0]}>
            <sphereGeometry args={[HEAD_R, 40, 28]} />
            <meshPhysicalMaterial
              color={CYAN}
              transparent
              opacity={0.13}
              roughness={0.12}
              metalness={0.1}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>
          {/* Wireframe topology shell */}
          <mesh position={[0, HEAD_Y, 0]} scale={[1, 1.18, 0.95]}>
            <sphereGeometry args={[HEAD_R, 18, 12]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.1} />
          </mesh>

          {/* Facial point cloud + neural mesh */}
          <FaceScan reduced={reduced} />

          {/* Soft eye glows (abstract, not cartoon) */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.21, HEAD_Y + 0.1, HEAD_R * 0.82]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={CYAN_GLOW}
                emissive={CYAN_GLOW}
                emissiveIntensity={1.6}
                roughness={0.2}
              />
            </mesh>
          ))}

          <ScanRing reduced={reduced} />
        </group>

        <HoloShells reduced={reduced} />
        <DataShards reduced={reduced} />

        {/* Local sparkle field */}
        <Sparkles
          count={mobile ? 24 : 60}
          scale={[3.2, 2.6, 2]}
          position={[0, HEAD_Y, 0]}
          size={3}
          speed={0.4}
          color={CYAN_GLOW}
          opacity={0.5}
        />
      </group>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.62, 0]}
        scale={4.5}
        blur={2.6}
        opacity={0.5}
        far={3}
        frames={reduced ? 1 : Infinity}
      />

      {/* State dressing */}
      {state === "projects" && <ProjectCubes reduced={reduced} />}
      {state === "skills" && <SkillOrbs reduced={reduced} />}
    </group>
  );
}
