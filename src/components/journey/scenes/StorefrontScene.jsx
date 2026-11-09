import { useRef } from 'react'
import { RoundedBox, MeshTransmissionMaterial, Sky, ContactShadows, Text3D, Center } from '@react-three/drei'

function ShopFacade({ position }) {
  return (
    <group position={position}>
      {/* Main building */}
      <RoundedBox args={[10, 5, 0.3]} radius={0.03} smoothness={4} position={[0, 2.5, 0]} receiveShadow>
        <meshStandardMaterial color="#d4c4a8" roughness={0.8} />
      </RoundedBox>

      {/* Signboard */}
      <RoundedBox args={[8, 1.2, 0.15]} radius={0.03} smoothness={4} position={[0, 4.2, 0.2]} castShadow>
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </RoundedBox>
      {/* Gold border for signboard */}
      <RoundedBox args={[8.2, 1.4, 0.02]} radius={0.03} smoothness={4} position={[0, 4.2, 0.3]}>
        <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.7} />
      </RoundedBox>
      <Center position={[0, 4.25, 0.35]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.28}
          height={0.06}
          curveSegments={12}
        >
          Sri Konark Plywood & Hardware
          <meshStandardMaterial color="#C9A84C" roughness={0.25} metalness={0.8} />
        </Text3D>
      </Center>

      {/* Glass front */}
      <RoundedBox args={[7, 3, 0.05]} radius={0.02} smoothness={4} position={[0, 1.5, 0.2]}>
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.02}
          color="#88ccff"
        />
      </RoundedBox>

      {/* Door */}
      <RoundedBox args={[1.5, 2.4, 0.08]} radius={0.03} smoothness={4} position={[0, 1.2, 0.3]} castShadow>
        <meshStandardMaterial color="#5a3d25" roughness={0.7} />
      </RoundedBox>
      {/* Door handle */}
      <mesh position={[0.5, 1.2, 0.4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pilasters */}
      {[-4, 4].map((x, i) => (
        <RoundedBox key={i} args={[0.4, 5, 0.4]} radius={0.03} smoothness={4} position={[x, 2.5, 0.1]} castShadow>
          <meshStandardMaterial color="#b8a890" roughness={0.75} />
        </RoundedBox>
      ))}
    </group>
  )
}

function StreetElements({ position }) {
  return (
    <group position={position}>
      {/* Street floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#555" roughness={0.9} />
      </mesh>
      {/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 3]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#999" roughness={0.85} metalness={0.08} />
      </mesh>
    </group>
  )
}

export default function StorefrontScene() {
  return (
    <group>
      <ShopFacade position={[0, 0, -130]} />
      <StreetElements position={[0, 0, -125]} />

      <Sky
        distance={450000}
        sunPosition={[-5, 2, -130]}
        turbidity={10}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <ContactShadows
        position={[0, 0.01, -125]}
        opacity={0.5}
        scale={30}
        blur={2}
        far={10}
        resolution={256}
      />

      {/* Golden hour lighting */}
      <pointLight position={[5, 6, -125]} intensity={2} color="#ffaa44" distance={20} decay={2} />
      <pointLight position={[-5, 4, -128]} intensity={1.5} color="#ff9933" distance={15} decay={2} />

      {/* Signboard illumination */}
      <spotLight
        position={[0, 6, -128]}
        target-position={[0, 4.2, -130]}
        intensity={3}
        color="#ffe0a0"
        angle={0.5}
        penumbra={0.5}
        distance={10}
        decay={2}
      />
    </group>
  )
}
