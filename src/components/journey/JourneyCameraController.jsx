import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA_KEYFRAMES } from '../../data/cameraKeyframes'
import { lerp, smoothstep } from '../../lib/math'

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()
const _tmpPos = new THREE.Vector3()
const _tmpLook = new THREE.Vector3()

function findSegment(p) {
  const kf = CAMERA_KEYFRAMES
  if (p <= kf[0].p) return { a: kf[0], b: kf[0], t: 0 }
  if (p >= kf[kf.length - 1].p) return { a: kf[kf.length - 1], b: kf[kf.length - 1], t: 1 }

  for (let i = 0; i < kf.length - 1; i++) {
    if (p >= kf[i].p && p <= kf[i + 1].p) {
      const t = (p - kf[i].p) / (kf[i + 1].p - kf[i].p)
      return { a: kf[i], b: kf[i + 1], t }
    }
  }
  return { a: kf[0], b: kf[0], t: 0 }
}

export default function JourneyCameraController({ progressRef }) {
  const { camera } = useThree()
  const prevP = useRef(-1)

  useFrame(() => {
    const p = progressRef.current
    if (Math.abs(p - prevP.current) < 0.00001) return
    prevP.current = p

    const { a, b, t } = findSegment(p)
    const st = smoothstep(t)

    _pos.set(
      lerp(a.pos[0], b.pos[0], st),
      lerp(a.pos[1], b.pos[1], st),
      lerp(a.pos[2], b.pos[2], st),
    )

    _look.set(
      lerp(a.lookAt[0], b.lookAt[0], st),
      lerp(a.lookAt[1], b.lookAt[1], st),
      lerp(a.lookAt[2], b.lookAt[2], st),
    )

    const fov = lerp(a.fov, b.fov, st)

    camera.position.lerp(_pos, 0.12)
    _tmpLook.copy(camera.position).add(
      _look.clone().sub(camera.position).normalize()
    )
    camera.lookAt(_look)

    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = lerp(camera.fov, fov, 0.1)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
