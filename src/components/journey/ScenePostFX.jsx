import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export default function ScenePostFX({ quality }) {
  if (quality === 'fallback') return null

  return (
    <EffectComposer multisampling={0}>
      {quality === 'high' && (
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.75}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      )}
      <Vignette offset={0.5} darkness={0.55} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  )
}
