import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment, SoftShadows } from '@react-three/drei'
import JourneyCameraController from './JourneyCameraController'
import SceneLighting from './SceneLighting'
import ScenePostFX from './ScenePostFX'
import ForestScene from './scenes/ForestScene'
import WorkshopScene from './scenes/WorkshopScene'
import ShowroomScene from './scenes/ShowroomScene'
import HomeScene from './scenes/HomeScene'
import StorefrontScene from './scenes/StorefrontScene'
import { useAdaptiveQuality } from '../../hooks/useAdaptiveQuality'

function SceneContent({ progressRef, currentActRef }) {
  const { quality, getSettings } = useAdaptiveQuality()
  const settings = getSettings()

  return (
    <>
      <color attach="background" args={['#0a0a08']} />
      <JourneyCameraController progressRef={progressRef} />
      <SceneLighting currentActRef={currentActRef} progressRef={progressRef} />
      <Environment preset="forest" background={false} />
      <SoftShadows size={25} samples={16} focus={0.5} />

      <fog attach="fog" args={['#1a2a1a', 8, 60]} />

      <ForestScene progressRef={progressRef} />
      <WorkshopScene />
      <ShowroomScene />
      <HomeScene progressRef={progressRef} />
      <StorefrontScene />

      <ScenePostFX quality={quality} />
    </>
  )
}

export default function JourneyCanvas({ progressRef, currentActRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ fov: 50, near: 0.1, far: 200, position: [0, 20, 30] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContent
          progressRef={progressRef}
          currentActRef={currentActRef}
        />
      </Suspense>
    </Canvas>
  )
}
