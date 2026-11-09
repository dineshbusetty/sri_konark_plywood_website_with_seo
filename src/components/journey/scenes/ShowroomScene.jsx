import { useRef } from 'react'
import { RoundedBox, MeshReflectorMaterial } from '@react-three/drei'

function DisplayWall({ position, rotation = [0, 0, 0], color = '#1a1a1a', samples = [] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wall panel */}
      <RoundedBox args={[4, 3, 0.15]} radius={0.02} smoothness={4} receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
      {/* Shelves */}
      {[-0.5, 0.5].map((y, i) => (
        <RoundedBox key={i} args={[3.6, 0.05, 0.4]} radius={0.01} smoothness={4} position={[0, y, 0.15]} castShadow>
          <meshStandardMaterial color="#6d4c2a" roughness={0.8} />
        </RoundedBox>
      ))}
      {/* Sample swatches */}
      {samples.map((s, i) => (
        <RoundedBox key={`s${i}`} args={[0.4, 0.4, 0.02]} radius={0.005} smoothness={4} position={[s.x, s.y, 0.12]} castShadow>
          <meshStandardMaterial color={s.color} roughness={s.rough || 0.5} metalness={s.metal || 0} />
        </RoundedBox>
      ))}
    </group>
  )
}

function ShowroomFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -27]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.5}
        roughness={0.8}
        depthScale={1}
        color="#1a1a1a"
        metalness={0.1}
      />
    </mesh>
  )
}

function SpotDisplay({ position, color = '#ffe0a0' }) {
  return (
    <group position={position}>
      <spotLight
        position={[0, 3, 1]}
        angle={0.4}
        penumbra={0.6}
        intensity={2}
        color={color}
        distance={6}
        decay={2}
        castShadow
      />
    </group>
  )
}

export default function ShowroomScene() {
  const plywoodSamples = [
    { x: -1.2, y: 0.2, color: '#c4a06a', rough: 0.7 },
    { x: -0.6, y: 0.2, color: '#a8844a', rough: 0.75 },
    { x: 0, y: 0.2, color: '#8b6d3a', rough: 0.8 },
    { x: 0.6, y: 0.2, color: '#d4b07a', rough: 0.65 },
    { x: 1.2, y: 0.2, color: '#b8945a', rough: 0.7 },
  ]

  const laminateSamples = [
    { x: -1.2, y: 0.2, color: '#f5f0e8', rough: 0.2 },
    { x: -0.6, y: 0.2, color: '#e8d8c0', rough: 0.15 },
    { x: 0, y: 0.2, color: '#d4c4a8', rough: 0.1 },
    { x: 0.6, y: 0.2, color: '#c0b090', rough: 0.2 },
    { x: 1.2, y: 0.2, color: '#333', rough: 0.05 },
  ]

  const hardwareSamples = [
    { x: -1, y: 0.2, color: '#c0c0c0', rough: 0.3, metal: 0.8 },
    { x: -0.3, y: 0.2, color: '#C9A84C', rough: 0.25, metal: 0.9 },
    { x: 0.4, y: 0.2, color: '#808080', rough: 0.4, metal: 0.7 },
    { x: 1.1, y: 0.2, color: '#2a2a2a', rough: 0.5, metal: 0.6 },
  ]

  return (
    <group>
      <ShowroomFloor />

      {/* Ceiling */}
      <RoundedBox args={[20, 0.1, 20]} radius={0.02} smoothness={4} position={[0, 4, -27]}>
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>

      {/* Plywood wall */}
      <DisplayWall position={[-6, 1.5, -24]} rotation={[0, Math.PI / 4, 0]} color="#2a2018" samples={plywoodSamples} />
      <SpotDisplay position={[-5, 0, -23]} />

      {/* Laminate wall */}
      <DisplayWall position={[-2, 1.5, -27]} color="#252520" samples={laminateSamples} />
      <SpotDisplay position={[-2, 0, -26]} />

      {/* Hardware wall */}
      <DisplayWall position={[2, 1.5, -30]} color="#1f1f25" samples={hardwareSamples} />
      <SpotDisplay position={[2, 0, -29]} />

      {/* Adhesives display */}
      <DisplayWall position={[6, 1.5, -33]} rotation={[0, -Math.PI / 4, 0]} color="#201a1a" samples={[
        { x: -0.8, y: 0.2, color: '#e63946', rough: 0.4 },
        { x: 0, y: 0.2, color: '#2a9d8f', rough: 0.4 },
        { x: 0.8, y: 0.2, color: '#e9c46a', rough: 0.4 },
      ]} />
      <SpotDisplay position={[5, 0, -32]} />

      {/* Center island display */}
      <RoundedBox args={[2, 1, 1]} radius={0.02} smoothness={4} position={[0, 0.5, -27]} castShadow receiveShadow>
        <meshStandardMaterial color="#3e2723" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[2.1, 0.05, 1.1]} radius={0.01} smoothness={4} position={[0, 1.05, -27]}>
        <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.7} />
      </RoundedBox>
    </group>
  )
}
