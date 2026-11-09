import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { MeshStandardMaterial, DoubleSide } from 'three';

const Villa = forwardRef(function Villa({ doorProgress = 0 }, ref) {
  const leftDoor = useRef();
  const rightDoor = useRef();
  const groupRef = useRef();

  useImperativeHandle(ref, () => ({
    setDoorProgress(p) {
      if (leftDoor.current) leftDoor.current.position.x = -1.2 - p * 1.4;
      if (rightDoor.current) rightDoor.current.position.x = 1.2 + p * 1.4;
    },
    group: groupRef.current,
  }));

  const walnut = useMemo(() => new MeshStandardMaterial({ color: '#3E2723', roughness: 0.75, metalness: 0.05 }), []);
  const darkWood = useMemo(() => new MeshStandardMaterial({ color: '#2C1810', roughness: 0.8 }), []);
  const stone = useMemo(() => new MeshStandardMaterial({ color: '#2A2520', roughness: 0.9 }), []);
  const gold = useMemo(() => new MeshStandardMaterial({ color: '#C9A84C', roughness: 0.3, metalness: 0.7 }), []);
  const glass = useMemo(() => new MeshStandardMaterial({
    color: '#1A2030',
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.4,
  }), []);
  const warmGlow = useMemo(() => new MeshStandardMaterial({
    color: '#FAF6F0',
    emissive: '#FFF0D0',
    emissiveIntensity: 0.3,
    roughness: 0.9,
  }), []);
  const dark = useMemo(() => new MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.95 }), []);

  return (
    <group ref={groupRef}>
      {/* ── Main facade wall ── */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
      </mesh>

      {/* ── Timber cladding — left wing ── */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`lc${i}`} position={[-5.5 + i * 0.24, 2.5, 0.16]} castShadow>
          <boxGeometry args={[0.2, 4.8, 0.05]} />
          <primitive object={walnut} attach="material" />
        </mesh>
      ))}

      {/* ── Timber cladding — right wing ── */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`rc${i}`} position={[2.7 + i * 0.24, 2.5, 0.16]} castShadow>
          <boxGeometry args={[0.2, 4.8, 0.05]} />
          <primitive object={walnut} attach="material" />
        </mesh>
      ))}

      {/* ── Left glass panel (window) ── */}
      <mesh position={[-1.2, 2.8, 0.16]}>
        <boxGeometry args={[2, 3.2, 0.02]} />
        <primitive object={glass} attach="material" />
      </mesh>
      <mesh position={[-1.2, 2.8, 0.17]}>
        <boxGeometry args={[2.1, 3.3, 0.01]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Right glass panel (window) ── */}
      <mesh position={[1.2, 2.8, 0.16]}>
        <boxGeometry args={[2, 3.2, 0.02]} />
        <primitive object={glass} attach="material" />
      </mesh>
      <mesh position={[1.2, 2.8, 0.17]}>
        <boxGeometry args={[2.1, 3.3, 0.01]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Interior warm glow visible through glass ── */}
      <mesh position={[0, 2.5, -0.2]}>
        <boxGeometry args={[4.5, 4, 0.05]} />
        <primitive object={warmGlow} attach="material" />
      </mesh>

      {/* ── Glass doors ── */}
      <mesh ref={leftDoor} position={[-1.2, 2.5, 0.2]} castShadow>
        <boxGeometry args={[2, 4.2, 0.06]} />
        <primitive object={glass} attach="material" />
      </mesh>
      {/* Left door handle */}
      <mesh position={[-0.25, 2.5, 0.28]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <primitive object={gold} attach="material" />
      </mesh>

      <mesh ref={rightDoor} position={[1.2, 2.5, 0.2]} castShadow>
        <boxGeometry args={[2, 4.2, 0.06]} />
        <primitive object={glass} attach="material" />
      </mesh>
      {/* Right door handle */}
      <mesh position={[0.25, 2.5, 0.28]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Roof overhang ── */}
      <mesh position={[0, 5.05, 0.6]} castShadow>
        <boxGeometry args={[13, 0.15, 1.5]} />
        <primitive object={dark} attach="material" />
      </mesh>
      {/* Gold accent under roof */}
      <mesh position={[0, 4.97, 0.6]}>
        <boxGeometry args={[13.1, 0.03, 1.6]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Stone plinth / base ── */}
      <mesh position={[0, 0.25, 0.1]} receiveShadow>
        <boxGeometry args={[12.5, 0.5, 0.6]} />
        <primitive object={stone} attach="material" />
      </mesh>
      {/* Gold accent line on plinth */}
      <mesh position={[0, 0.51, 0.3]}>
        <boxGeometry args={[12.5, 0.02, 0.01]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Porch columns ── */}
      {[-2.5, 2.5].map((x) => (
        <mesh key={x} position={[x, 2.5, 0.7]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 4.5, 8]} />
          <primitive object={stone} attach="material" />
        </mesh>
      ))}

      {/* ── Porch ceiling ── */}
      <mesh position={[0, 4.9, 1]} receiveShadow>
        <boxGeometry args={[5.5, 0.08, 1.5]} />
        <primitive object={darkWood} attach="material" />
      </mesh>

      {/* ── Side walls (depth) ── */}
      <mesh position={[-6, 2.5, -2]} castShadow>
        <boxGeometry args={[0.3, 5, 4.5]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
      </mesh>
      <mesh position={[6, 2.5, -2]} castShadow>
        <boxGeometry args={[0.3, 5, 4.5]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
      </mesh>

      {/* ── Nameplate ── */}
      <mesh position={[0, 0.55, 0.42]}>
        <boxGeometry args={[1.8, 0.3, 0.03]} />
        <primitive object={stone} attach="material" />
      </mesh>
      <mesh position={[0, 0.55, 0.44]}>
        <boxGeometry args={[1.85, 0.32, 0.01]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* ── Porch light fixtures ── */}
      {[-2.2, 2.2].map((x) => (
        <group key={`light-${x}`} position={[x, 3.8, 0.8]}>
          <mesh>
            <boxGeometry args={[0.12, 0.2, 0.12]} />
            <primitive object={gold} attach="material" />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#FFD07A"
              emissive="#FFD07A"
              emissiveIntensity={2}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* ── Entrance step ── */}
      <mesh position={[0, 0.08, 1.2]} receiveShadow>
        <boxGeometry args={[5, 0.15, 0.8]} />
        <primitive object={stone} attach="material" />
      </mesh>
    </group>
  );
});

export default Villa;
