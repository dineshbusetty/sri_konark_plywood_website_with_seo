import { MeshStandardMaterial } from 'three';
import { useMemo } from 'react';

export default function VillaGround() {
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#1A1815',
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow material={mat}>
        <planeGeometry args={[60, 60]} />
      </mesh>

      {/* Driveway — slightly raised, darker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 8]} receiveShadow>
        <planeGeometry args={[6, 12]} />
        <meshStandardMaterial color="#15120F" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Driveway border — gold accent lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.05, 0.01, 8]}>
        <planeGeometry args={[0.06, 12]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.15} roughness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.05, 0.01, 8]}>
        <planeGeometry args={[0.06, 12]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.15} roughness={0.3} />
      </mesh>

      {/* Stone pathway to entrance */}
      {[3, 4.5, 6, 7.5].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, z]} receiveShadow>
          <planeGeometry args={[1.8, 0.8]} />
          <meshStandardMaterial color="#2A2520" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
