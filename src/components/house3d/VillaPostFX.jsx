import { Bloom, Vignette, ToneMapping, EffectComposer } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

export default function VillaPostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        radius={0.6}
      />
      <Vignette darkness={0.55} offset={0.25} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}
