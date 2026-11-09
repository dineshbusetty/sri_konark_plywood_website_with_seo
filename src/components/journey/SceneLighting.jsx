import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { lerp, range, clamp } from '../../lib/math'

const ACT_LIGHTING = {
  forest:     { ambient: 0.15, dirIntensity: 1.2, dirColor: '#ffd4a0', dirPos: [10, 15, 5], fogColor: '#1a2a1a', fogNear: 5, fogFar: 40 },
  workshop:   { ambient: 0.2,  dirIntensity: 0.8, dirColor: '#ffe0b0', dirPos: [3, 8, -10], fogColor: '#2a1f15', fogNear: 3, fogFar: 30 },
  showroom:   { ambient: 0.35, dirIntensity: 1.0, dirColor: '#fff5e6', dirPos: [5, 10, -25], fogColor: '#1a1a1a', fogNear: 5, fogFar: 35 },
  home:       { ambient: 0.3,  dirIntensity: 0.9, dirColor: '#ffe8cc', dirPos: [5, 8, -50], fogColor: '#1a1510', fogNear: 3, fogFar: 25 },
  storefront: { ambient: 0.25, dirIntensity: 1.5, dirColor: '#ffcc80', dirPos: [8, 12, -120], fogColor: '#2a1a10', fogNear: 5, fogFar: 40 },
}

const ACTS_ORDER = ['forest', 'workshop', 'showroom', 'home', 'storefront']

export default function SceneLighting({ currentActRef, progressRef }) {
  const dirRef = useRef()
  const ambRef = useRef()

  useFrame(({ scene }) => {
    const act = currentActRef.current
    const config = ACT_LIGHTING[act] || ACT_LIGHTING.forest

    if (ambRef.current) {
      ambRef.current.intensity = lerp(ambRef.current.intensity, config.ambient, 0.05)
    }

    if (dirRef.current) {
      dirRef.current.intensity = lerp(dirRef.current.intensity, config.dirIntensity, 0.05)
      dirRef.current.position.lerp(
        { x: config.dirPos[0], y: config.dirPos[1], z: config.dirPos[2] },
        0.03
      )
    }

    if (scene.fog) {
      scene.fog.near = lerp(scene.fog.near, config.fogNear, 0.05)
      scene.fog.far = lerp(scene.fog.far, config.fogFar, 0.05)
    }
  })

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.15} />
      <directionalLight
        ref={dirRef}
        intensity={1.2}
        position={[10, 15, 5]}
        color="#ffd4a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />
    </>
  )
}
