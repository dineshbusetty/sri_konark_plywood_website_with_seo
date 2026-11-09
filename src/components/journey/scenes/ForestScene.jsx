import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Sparkles, Sky, ContactShadows, MeshDistortMaterial, Text3D, Center } from '@react-three/drei'

function TreeCanopy({ position, scale = 1, color = '#2d5a27' }) {
  return (
    <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.1}>
      <mesh position={position} scale={scale} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.85}
          metalness={0.05}
          distort={0.35}
          speed={1.5}
        />
      </mesh>
    </Float>
  )
}

function Tree({ position, scale = 1, trunkColor = '#4a3520', canopyColor = '#2d5a27' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.28, 5, 16]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} metalness={0} />
      </mesh>

      <TreeCanopy position={[0, 5.5, 0]} scale={1.6} color={canopyColor} />
      <TreeCanopy position={[-0.5, 6.5, 0.3]} scale={1.1} color={canopyColor} />
      <TreeCanopy position={[0.4, 7, -0.2]} scale={0.9} color={canopyColor} />
      <TreeCanopy position={[0, 7.5, 0]} scale={0.7} color={canopyColor} />
    </group>
  )
}

function Stump({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.75, 0.8, 16]} />
        <meshStandardMaterial color="#5a3d25" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.58, 24]} />
        <meshStandardMaterial
          color="#3e2723"
          roughness={1}
          emissive="#C9A84C"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Center position={[0, 0.84, 0.15]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.12}
          height={0.02}
          curveSegments={8}
        >
          Sri Konark
          <meshStandardMaterial color="#C9A84C" roughness={0.4} metalness={0.6} />
        </Text3D>
      </Center>
    </group>
  )
}

function ForestGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 80]} />
      <meshStandardMaterial color="#1a2a10" roughness={0.95} />
    </mesh>
  )
}

function Rock({ position, scale = 1, rotation }) {
  const rot = rotation || [Math.random() * 0.5, Math.random() * Math.PI, 0]
  return (
    <mesh position={position} scale={scale} rotation={rot} castShadow receiveShadow>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color="#4a4a42" roughness={0.92} metalness={0.02} />
    </mesh>
  )
}

function ForestPath() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
      <planeGeometry args={[2.5, 30]} />
      <meshStandardMaterial color="#2a2215" roughness={0.98} />
    </mesh>
  )
}

export default function ForestScene({ progressRef }) {
  const groupRef = useRef()

  const trees = useMemo(() => [
    { pos: [-5, 0, 22], scale: 1.2, color: '#1e4a1e' },
    { pos: [6, 0, 20], scale: 1.0, color: '#2d5a27' },
    { pos: [-8, 0, 16], scale: 0.9, color: '#3a6630' },
    { pos: [4, 0, 14], scale: 1.1, color: '#1e4a1e' },
    { pos: [-3, 0, 10], scale: 1.3, color: '#2d5a27' },
    { pos: [7, 0, 8], scale: 0.8, color: '#3a6630' },
    { pos: [-6, 0, 6], scale: 1.0, color: '#1e4a1e' },
    { pos: [5, 0, 4], scale: 1.2, color: '#2d5a27' },
    { pos: [-4, 0, 0], scale: 0.9, color: '#3a6630' },
    { pos: [8, 0, 2], scale: 1.1, color: '#1e4a1e' },
    { pos: [-9, 0, 12], scale: 0.7, color: '#2d5a27' },
    { pos: [9, 0, 18], scale: 0.85, color: '#3a6630' },
    { pos: [-7, 0, 24], scale: 1.0, color: '#1e4a1e' },
    { pos: [3, 0, 26], scale: 1.15, color: '#2d5a27' },
  ], [])

  return (
    <group ref={groupRef}>
      <ForestGround />
      <ForestPath />

      {trees.map((t, i) => (
        <Tree
          key={i}
          position={t.pos}
          scale={t.scale}
          canopyColor={t.color}
        />
      ))}

      <Stump position={[0, 0, 5]} />

      <Rock position={[-1.5, 0.2, 6]} scale={0.8} rotation={[0.2, 1.1, 0.1]} />
      <Rock position={[1.8, 0.15, 4]} scale={0.6} rotation={[0.4, 2.3, 0]} />
      <Rock position={[-3, 0.1, 8]} scale={0.5} rotation={[0.1, 0.5, 0.3]} />
      <Rock position={[2.5, 0.12, 9]} scale={0.45} rotation={[0.3, 1.8, 0.1]} />
      <Rock position={[-2, 0.18, 3]} scale={0.7} rotation={[0.15, 3.0, 0.2]} />

      <Sparkles
        count={80}
        scale={[20, 15, 40]}
        position={[0, 8, 10]}
        size={3}
        speed={0.3}
        opacity={0.4}
        color="#ffe8b0"
      />

      <Sky
        distance={450000}
        sunPosition={[5, 1, -10]}
        inclination={0.49}
        azimuth={0.25}
        rayleigh={2}
        turbidity={8}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <ContactShadows
        position={[0, 0, 10]}
        opacity={0.4}
        scale={40}
        blur={2}
        far={15}
        resolution={256}
      />

      <pointLight position={[0, 1.5, 10]} intensity={0.6} color="#ffd080" distance={10} decay={2} />
      <pointLight position={[0, 1.5, 5]} intensity={0.7} color="#ffe0a0" distance={10} decay={2} />
      <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#ffd080" distance={10} decay={2} />
    </group>
  )
}
