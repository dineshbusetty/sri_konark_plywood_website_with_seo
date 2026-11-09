import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.9, 2.4, 8]} />
        <meshStandardMaterial color="#0D2510" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[0.7, 1.8, 8]} />
        <meshStandardMaterial color="#122D15" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#2C1810" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Hedge({ position, scale = [1, 1, 1] }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <boxGeometry args={[2, 0.6, 0.5]} />
      <meshStandardMaterial color="#1A2A15" roughness={0.95} />
    </mesh>
  );
}

function PathLight({ position }) {
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = clock.getElapsedTime();
    glowRef.current.intensity = 0.8 + Math.sin(t * 1.5 + position[0]) * 0.15;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>
      <pointLight ref={glowRef} position={[0, 0.7, 0]} color="#FFD07A" intensity={0.8} distance={3} decay={2} />
    </group>
  );
}

function Planter({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#2A2520" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1A3A15" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function VillaLandscape() {
  return (
    <group>
      {/* Trees — left cluster */}
      <Tree position={[-8, 0, -2]} scale={1.3} />
      <Tree position={[-6.5, 0, -1]} scale={1.0} />
      <Tree position={[-9, 0, 1]} scale={1.5} />

      {/* Trees — right cluster */}
      <Tree position={[8, 0, -2]} scale={1.3} />
      <Tree position={[6.5, 0, -1]} scale={1.0} />
      <Tree position={[9, 0, 1]} scale={1.5} />

      {/* Background trees */}
      <Tree position={[-12, 0, -6]} scale={2.0} />
      <Tree position={[-10, 0, -8]} scale={1.8} />
      <Tree position={[12, 0, -6]} scale={2.0} />
      <Tree position={[10, 0, -8]} scale={1.8} />
      <Tree position={[0, 0, -10]} scale={2.2} />
      <Tree position={[-5, 0, -9]} scale={1.6} />
      <Tree position={[5, 0, -9]} scale={1.6} />

      {/* Hedges flanking entrance */}
      <Hedge position={[-4, 0.3, 4]} scale={[1.2, 1, 1]} />
      <Hedge position={[-4, 0.3, 6]} scale={[1, 0.8, 1]} />
      <Hedge position={[4, 0.3, 4]} scale={[1.2, 1, 1]} />
      <Hedge position={[4, 0.3, 6]} scale={[1, 0.8, 1]} />

      {/* Path lights */}
      <PathLight position={[-1.5, 0, 4]} />
      <PathLight position={[1.5, 0, 4]} />
      <PathLight position={[-1.5, 0, 6.5]} />
      <PathLight position={[1.5, 0, 6.5]} />

      {/* Planters at entrance */}
      <Planter position={[-2.5, 0, 5.2]} />
      <Planter position={[2.5, 0, 5.2]} />

      {/* Distant hills */}
      <mesh position={[0, 2, -20]} receiveShadow>
        <sphereGeometry args={[18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#0A0D08" roughness={1} />
      </mesh>
    </group>
  );
}
