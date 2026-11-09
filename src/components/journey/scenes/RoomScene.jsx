import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, ContactShadows } from '@react-three/drei'
import { range, clamp } from '../../../lib/math'

const ROOM_COLORS = {
  'living-room': { wall: '#e8ddd0', floor: '#8b7355', accent: '#C9A84C' },
  'kitchen': { wall: '#f0ebe0', floor: '#6d5a40', accent: '#2a9d8f' },
  'bedroom': { wall: '#e5ddd5', floor: '#7a6548', accent: '#9b59b6' },
  'bathroom': { wall: '#e8e8e8', floor: '#a0a0a0', accent: '#3498db' },
  'dining-room': { wall: '#ede5d8', floor: '#7a6040', accent: '#e67e22' },
  'study': { wall: '#ddd8d0', floor: '#6a5538', accent: '#27ae60' },
  'pooja-room': { wall: '#f5ece0', floor: '#8a7050', accent: '#e74c3c' },
}

function RoomShell({ colors, width = 6, height = 3.5, depth = 10 }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.floor} roughness={0.7} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, -depth / 2]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={colors.wall} roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, -depth / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={colors.wall} roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, -depth / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={colors.wall} roughness={0.85} />
      </mesh>
    </group>
  )
}

function SimpleFurniture({ roomId, colors }) {
  switch (roomId) {
    case 'living-room':
      return (
        <group>
          {/* Sofa base */}
          <RoundedBox args={[2.5, 0.8, 1]} radius={0.02} smoothness={4} position={[-2, 0.4, -6]} castShadow>
            <meshStandardMaterial color="#5a4a3a" roughness={0.85} />
          </RoundedBox>
          {/* Sofa back */}
          <RoundedBox args={[2.5, 0.6, 0.2]} radius={0.015} smoothness={4} position={[-2, 0.9, -6.4]} castShadow>
            <meshStandardMaterial color="#5a4a3a" roughness={0.85} />
          </RoundedBox>
          {/* Sofa armrests */}
          <RoundedBox args={[0.2, 0.5, 1]} radius={0.015} smoothness={4} position={[-3.2, 0.65, -6]} castShadow>
            <meshStandardMaterial color="#4a3a2a" roughness={0.85} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.5, 1]} radius={0.015} smoothness={4} position={[-0.8, 0.65, -6]} castShadow>
            <meshStandardMaterial color="#4a3a2a" roughness={0.85} />
          </RoundedBox>
          {/* TV unit */}
          <RoundedBox args={[2, 0.8, 0.5]} radius={0.02} smoothness={4} position={[2, 0.4, -9]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          {/* TV screen */}
          <RoundedBox args={[1.6, 0.9, 0.05]} radius={0.015} smoothness={4} position={[2, 1.3, -9.2]} castShadow>
            <meshStandardMaterial color="#111" roughness={0.1} metalness={0.3} />
          </RoundedBox>
          {/* Coffee table */}
          <RoundedBox args={[1, 0.05, 0.6]} radius={0.015} smoothness={4} position={[0, 0.3, -5]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.6} />
          </RoundedBox>
          {/* Coffee table legs */}
          <RoundedBox args={[0.06, 0.25, 0.06]} radius={0.01} smoothness={4} position={[-0.4, 0.13, -4.75]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.25, 0.06]} radius={0.01} smoothness={4} position={[0.4, 0.13, -4.75]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.25, 0.06]} radius={0.01} smoothness={4} position={[-0.4, 0.13, -5.25]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.25, 0.06]} radius={0.01} smoothness={4} position={[0.4, 0.13, -5.25]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
        </group>
      )
    case 'kitchen':
      return (
        <group>
          {/* Counter */}
          <RoundedBox args={[1, 1.8, 4]} radius={0.02} smoothness={4} position={[-2.5, 0.9, -6]} castShadow receiveShadow>
            <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
          </RoundedBox>
          {/* Countertop */}
          <RoundedBox args={[1.1, 0.06, 4.1]} radius={0.015} smoothness={4} position={[-2.5, 1.83, -6]} castShadow>
            <meshStandardMaterial color="#888" roughness={0.15} metalness={0.1} />
          </RoundedBox>
          {/* Upper cabinets */}
          <RoundedBox args={[0.6, 1, 4]} radius={0.02} smoothness={4} position={[-2.5, 2.5, -6]} castShadow>
            <meshStandardMaterial color="#c4a06a" roughness={0.6} />
          </RoundedBox>
          {/* Island */}
          <RoundedBox args={[1.5, 0.9, 0.8]} radius={0.02} smoothness={4} position={[0.5, 0.45, -6]} castShadow>
            <meshStandardMaterial color="#c4a06a" roughness={0.65} />
          </RoundedBox>
          {/* Island top */}
          <RoundedBox args={[1.6, 0.05, 0.9]} radius={0.015} smoothness={4} position={[0.5, 0.93, -6]} castShadow>
            <meshStandardMaterial color="#777" roughness={0.12} metalness={0.1} />
          </RoundedBox>
        </group>
      )
    case 'bedroom':
      return (
        <group>
          {/* Bed frame */}
          <RoundedBox args={[2.5, 0.35, 2.5]} radius={0.02} smoothness={4} position={[0, 0.18, -7]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          {/* Mattress */}
          <RoundedBox args={[2.3, 0.25, 2.3]} radius={0.02} smoothness={4} position={[0, 0.48, -7]} castShadow>
            <meshStandardMaterial color="#e8ddd0" roughness={0.9} />
          </RoundedBox>
          {/* Pillows */}
          <RoundedBox args={[0.6, 0.15, 0.35]} radius={0.04} smoothness={4} position={[-0.5, 0.68, -8]} castShadow>
            <meshStandardMaterial color="#f0ebe0" roughness={0.95} />
          </RoundedBox>
          <RoundedBox args={[0.6, 0.15, 0.35]} radius={0.04} smoothness={4} position={[0.5, 0.68, -8]} castShadow>
            <meshStandardMaterial color="#f0ebe0" roughness={0.95} />
          </RoundedBox>
          {/* Headboard */}
          <RoundedBox args={[2.5, 1, 0.1]} radius={0.02} smoothness={4} position={[0, 1, -8.2]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          {/* Wardrobe */}
          <RoundedBox args={[0.8, 2.4, 1.5]} radius={0.02} smoothness={4} position={[2.5, 1.2, -5]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.7} />
          </RoundedBox>
          {/* Nightstand */}
          <RoundedBox args={[0.5, 0.5, 0.4]} radius={0.015} smoothness={4} position={[1.6, 0.25, -8]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
        </group>
      )
    case 'bathroom':
      return (
        <group>
          {/* Vanity */}
          <RoundedBox args={[1.5, 0.9, 0.5]} radius={0.02} smoothness={4} position={[-2, 0.45, -9]} castShadow>
            <meshStandardMaterial color="#f5f0e8" roughness={0.2} />
          </RoundedBox>
          {/* Mirror */}
          <RoundedBox args={[1.2, 1.5, 0.05]} radius={0.015} smoothness={4} position={[-2, 1.75, -9.8]} castShadow>
            <meshStandardMaterial color="#aaddff" roughness={0.05} metalness={0.8} />
          </RoundedBox>
          {/* Bathtub */}
          <RoundedBox args={[1.8, 0.6, 0.8]} radius={0.04} smoothness={4} position={[1.5, 0.3, -8]} castShadow>
            <meshStandardMaterial color="#f0f0f0" roughness={0.15} />
          </RoundedBox>
        </group>
      )
    case 'dining-room':
      return (
        <group>
          {/* Dining table */}
          <RoundedBox args={[2, 0.06, 1.2]} radius={0.015} smoothness={4} position={[0, 0.75, -6]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.6} />
          </RoundedBox>
          {/* Table legs */}
          {[[-0.8, -0.45], [0.8, -0.45], [-0.8, 0.45], [0.8, 0.45]].map(([x, z], i) => (
            <RoundedBox key={i} args={[0.08, 0.72, 0.08]} radius={0.01} smoothness={4} position={[x, 0.36, -6 + z]} castShadow>
              <meshStandardMaterial color="#5a3d25" roughness={0.7} />
            </RoundedBox>
          ))}
          {/* Chairs */}
          {[[-0.7, -5.2], [0.7, -5.2], [-0.7, -6.8], [0.7, -6.8]].map(([x, z], i) => (
            <group key={`chair-${i}`}>
              <RoundedBox args={[0.45, 0.05, 0.45]} radius={0.015} smoothness={4} position={[x, 0.45, z]} castShadow>
                <meshStandardMaterial color="#8b6d3a" roughness={0.7} />
              </RoundedBox>
              <RoundedBox args={[0.45, 0.6, 0.05]} radius={0.01} smoothness={4} position={[x, 0.7, z + (z < -6 ? 0.2 : -0.2)]} castShadow>
                <meshStandardMaterial color="#8b6d3a" roughness={0.7} />
              </RoundedBox>
            </group>
          ))}
        </group>
      )
    case 'study':
      return (
        <group>
          {/* Desk */}
          <RoundedBox args={[1.8, 0.05, 0.8]} radius={0.015} smoothness={4} position={[0, 0.75, -9]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.6} />
          </RoundedBox>
          {/* Desk legs */}
          <RoundedBox args={[0.05, 0.72, 0.7]} radius={0.01} smoothness={4} position={[-0.85, 0.36, -9]} castShadow>
            <meshStandardMaterial color="#5a3d25" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.05, 0.72, 0.7]} radius={0.01} smoothness={4} position={[0.85, 0.36, -9]} castShadow>
            <meshStandardMaterial color="#5a3d25" roughness={0.7} />
          </RoundedBox>
          {/* Chair */}
          <RoundedBox args={[0.5, 0.05, 0.5]} radius={0.015} smoothness={4} position={[0, 0.45, -8]} castShadow>
            <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
          </RoundedBox>
          <RoundedBox args={[0.5, 0.6, 0.05]} radius={0.01} smoothness={4} position={[0, 0.7, -7.75]} castShadow>
            <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
          </RoundedBox>
          {/* Bookshelf */}
          <RoundedBox args={[1.2, 2.4, 0.35]} radius={0.02} smoothness={4} position={[2.3, 1.2, -9]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.7} />
          </RoundedBox>
          {/* Shelf dividers */}
          {[0.5, 1.0, 1.5, 2.0].map((y, i) => (
            <RoundedBox key={i} args={[1.1, 0.03, 0.3]} radius={0.005} smoothness={4} position={[2.3, y, -9]} castShadow>
              <meshStandardMaterial color="#7a5d30" roughness={0.7} />
            </RoundedBox>
          ))}
        </group>
      )
    case 'pooja-room':
      return (
        <group>
          {/* Mandir base */}
          <RoundedBox args={[1.5, 0.8, 0.6]} radius={0.02} smoothness={4} position={[0, 0.4, -9]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.6} />
          </RoundedBox>
          {/* Mandir back panel */}
          <RoundedBox args={[1.5, 1.5, 0.08]} radius={0.02} smoothness={4} position={[0, 1.55, -9.2]} castShadow>
            <meshStandardMaterial color="#6d4c2a" roughness={0.7} />
          </RoundedBox>
          {/* Mandir arch top */}
          <RoundedBox args={[1.6, 0.15, 0.12]} radius={0.02} smoothness={4} position={[0, 2.35, -9.2]} castShadow>
            <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.6} />
          </RoundedBox>
          {/* Side shelves */}
          <RoundedBox args={[0.4, 1.5, 0.35]} radius={0.015} smoothness={4} position={[-2, 0.75, -9]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.65} />
          </RoundedBox>
          <RoundedBox args={[0.4, 1.5, 0.35]} radius={0.015} smoothness={4} position={[2, 0.75, -9]} castShadow>
            <meshStandardMaterial color="#8b6d3a" roughness={0.65} />
          </RoundedBox>
          {/* Warm pooja light */}
          <pointLight position={[0, 1.5, -8.5]} intensity={1.5} color="#ffaa44" distance={5} decay={2} />
        </group>
      )
    default:
      return (
        <group>
          <RoundedBox args={[2, 1, 1.5]} radius={0.02} smoothness={4} position={[0, 0.5, -6]} castShadow>
            <meshStandardMaterial color={colors.accent} roughness={0.6} />
          </RoundedBox>
        </group>
      )
  }
}

export default function RoomScene({ room, position, scrollRange, progressRef, index }) {
  const groupRef = useRef()
  const colors = ROOM_COLORS[room.id] || { wall: '#e0d8d0', floor: '#7a6548', accent: '#C9A84C' }

  useFrame(() => {
    if (!groupRef.current) return
    const p = progressRef.current
    const inRange = p >= scrollRange.start - 0.05 && p <= scrollRange.end + 0.05
    groupRef.current.visible = inRange
  })

  return (
    <group ref={groupRef} position={position}>
      <RoomShell colors={colors} />
      <SimpleFurniture roomId={room.id} colors={colors} />

      <ContactShadows
        position={[0, 0.01, -5]}
        opacity={0.35}
        scale={8}
        blur={2}
        far={4}
        resolution={256}
      />

      <pointLight
        position={[0, 3, -5]}
        intensity={1}
        color="#ffe8cc"
        distance={12}
        decay={2}
      />
    </group>
  )
}
