import { Suspense, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { MathUtils } from 'three';
import Villa from './Villa';
import VillaGround from './VillaGround';
import VillaLandscape from './VillaLandscape';
import VillaLighting from './VillaLighting';
import VillaPostFX from './VillaPostFX';

function CameraController({ progress }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 3.5, z: 18 });

  useFrame(() => {
    const p = progress.current;
    const startZ = 18;
    const endZ = -2;
    const startY = 3.5;
    const endY = 2.5;

    const smoothP = MathUtils.smoothstep(p, 0, 1);

    target.current.z = MathUtils.lerp(startZ, endZ, smoothP);
    target.current.y = MathUtils.lerp(startY, endY, smoothP);
    target.current.x = Math.sin(p * 0.5) * 0.3;

    camera.position.x = MathUtils.lerp(camera.position.x, target.current.x, 0.08);
    camera.position.y = MathUtils.lerp(camera.position.y, target.current.y, 0.08);
    camera.position.z = MathUtils.lerp(camera.position.z, target.current.z, 0.08);

    camera.lookAt(0, 2.5, 0);
  });

  return null;
}

function SceneContent({ progress, villaRef }) {
  return (
    <>
      <CameraController progress={progress} />
      <VillaLighting />
      <Villa ref={villaRef} />
      <VillaGround />
      <VillaLandscape />
      <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={0.5} />
      <fog attach="fog" args={['#0D0A08', 15, 40]} />
      <VillaPostFX />
    </>
  );
}

export default function ExteriorCanvas({ progress }) {
  const villaRef = useRef();

  useEffect(() => {
    let raf;
    function updateDoors() {
      const p = progress.current;
      const doorP = MathUtils.clamp((p - 0.0) / 0.35, 0, 1);
      const eased = 1 - Math.pow(1 - doorP, 3);
      if (villaRef.current) villaRef.current.setDoorProgress(eased);
      raf = requestAnimationFrame(updateDoors);
    }
    updateDoors();
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.5, 18], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#0D0A08']} />
      <Suspense fallback={null}>
        <SceneContent progress={progress} villaRef={villaRef} />
      </Suspense>
    </Canvas>
  );
}
