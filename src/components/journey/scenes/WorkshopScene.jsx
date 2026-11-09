import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox, Edges, ContactShadows } from '@react-three/drei'

function Workbench({ position }) {
  return (
    <group position={position}>
      {/* Table top */}
      <RoundedBox args={[3, 0.1, 1.5]} radius={0.02} smoothness={4} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6d4c2a" roughness={0.85} />
      </RoundedBox>
      {/* Legs */}
      {[[-1.3, 0.45, -0.6], [1.3, 0.45, -0.6], [-1.3, 0.45, 0.6], [1.3, 0.45, 0.6]].map((leg, i) => (
        <RoundedBox key={i} args={[0.1, 0.9, 0.1]} radius={0.02} smoothness={4} position={leg} castShadow>
          <meshStandardMaterial color="#5a3d25" roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  )
}

function PlywoodSheet({ position, width = 1.2, depth = 0.8, color = '#c4a06a' }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[width, 0.03, depth]} />
      <meshStandardMaterial color={color} roughness={0.8} />
      <Edges threshold={15} color="#8a7040" />
    </mesh>
  )
}

function PlywoodStack({ position, count = 5 }) {
  const sheets = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      y: i * 0.04,
      color: i % 2 === 0 ? '#c4a06a' : '#b8945a',
    })),
    [count]
  )

  return (
    <group position={position}>
      {sheets.map((s, i) => (
        <PlywoodSheet key={i} position={[0, s.y, 0]} color={s.color} />
      ))}
    </group>
  )
}

function AdhesiveBottle({ position, color = '#e63946' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.24, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.08, 12]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
    </group>
  )
}

function WorkshopWalls() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]} receiveShadow>
        <planeGeometry args={[12, 20]} />
        <meshStandardMaterial color="#3a2f25" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 3, -20]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#4a3828" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-6, 3, -12]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#453525" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 3, -12]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#453525" roughness={0.9} />
      </mesh>
    </group>
  )
}

function HangingLamp({ position }) {
  return (
    <group position={position}>
      {/* Wire */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Shade — wider at top, narrow at bottom (inverted cone) */}
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 0.3, 16, 1, true]} />
        <meshStandardMaterial color="#8B7E74" roughness={0.6} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, -1, 0]} intensity={2} color="#ffe0a0" distance={8} decay={2} castShadow />
    </group>
  )
}

function ToolRack({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[4, 0.05, 0.8]} radius={0.01} smoothness={4} rotation={[0, Math.PI / 2, 0]} castShadow>
        <meshStandardMaterial color="#5a4a38" roughness={0.9} />
      </RoundedBox>
    </group>
  )
}

export default function WorkshopScene() {
  return (
    <group>
      <WorkshopWalls />

      <Workbench position={[0, 0, -12]} />
      <Workbench position={[-3, 0, -15]} />

      <PlywoodStack position={[0.5, 0.95, -12]} count={8} />
      <PlywoodStack position={[3, 0, -10]} count={12} />
      <PlywoodStack position={[-4, 0, -14]} count={6} />

      <AdhesiveBottle position={[-0.8, 0.95, -11.8]} color="#e63946" />
      <AdhesiveBottle position={[-0.5, 0.95, -12.2]} color="#2a9d8f" />
      <AdhesiveBottle position={[-0.3, 0.95, -11.6]} color="#e9c46a" />

      <HangingLamp position={[0, 5.5, -12]} />
      <HangingLamp position={[-3, 5.5, -15]} />
      <HangingLamp position={[3, 5.5, -10]} />

      <ToolRack position={[-5.9, 2, -14]} />

      <ContactShadows
        position={[0, 0.01, -12]}
        opacity={0.35}
        scale={14}
        blur={2}
        far={10}
        resolution={256}
      />
    </group>
  )
}
