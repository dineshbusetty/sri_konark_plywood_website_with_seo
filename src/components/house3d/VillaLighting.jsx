import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function VillaLighting() {
  const porch1 = useRef();
  const porch2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = 0.85 + Math.sin(t * 2.3) * 0.08 + Math.sin(t * 5.1) * 0.04;
    if (porch1.current) porch1.current.intensity = flicker * 2;
    if (porch2.current) porch2.current.intensity = flicker * 2;
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#1a1520" />
      <directionalLight
        position={[8, 12, 5]}
        intensity={0.6}
        color="#2C3E6B"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-5, 8, -3]} intensity={0.15} color="#1B1530" />
      <hemisphereLight args={['#0D1B2A', '#1A1510', 0.3]} />
      <pointLight ref={porch1} position={[-2.2, 3.5, 5.5]} color="#FFD07A" intensity={2} distance={8} decay={2} />
      <pointLight ref={porch2} position={[2.2, 3.5, 5.5]} color="#FFD07A" intensity={2} distance={8} decay={2} />
      <pointLight position={[0, 2.5, 4]} color="#FFF0D0" intensity={1.5} distance={6} decay={2} />
    </>
  );
}
