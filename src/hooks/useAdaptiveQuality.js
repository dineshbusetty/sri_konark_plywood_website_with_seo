import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'

export function useAdaptiveQuality() {
  const [quality, setQuality] = useState('high')
  const fpsBuffer = useRef([])
  const lastCheck = useRef(0)
  const lowCount = useRef(0)
  const highCount = useRef(0)

  useFrame((_, delta) => {
    const now = performance.now()
    if (now - lastCheck.current < 500) return
    lastCheck.current = now

    const fps = 1 / Math.max(delta, 0.001)
    fpsBuffer.current.push(fps)
    if (fpsBuffer.current.length > 6) fpsBuffer.current.shift()

    const avg = fpsBuffer.current.reduce((a, b) => a + b, 0) / fpsBuffer.current.length

    if (avg < 20) {
      lowCount.current++
      highCount.current = 0
      if (lowCount.current >= 6) {
        setQuality('fallback')
      }
    } else if (avg < 30) {
      lowCount.current++
      highCount.current = 0
      if (lowCount.current >= 4) {
        setQuality(q => q === 'fallback' ? 'fallback' : 'low')
      }
    } else if (avg > 50) {
      highCount.current++
      lowCount.current = 0
      if (highCount.current >= 10) {
        setQuality('high')
      }
    } else {
      lowCount.current = 0
      highCount.current = 0
    }
  })

  const getSettings = useCallback(() => {
    switch (quality) {
      case 'high':
        return { dpr: 1.5, bloom: true, shadows: true, reflections: true }
      case 'low':
        return { dpr: 1, bloom: false, shadows: true, reflections: false }
      case 'fallback':
        return { dpr: 1, bloom: false, shadows: false, reflections: false }
      default:
        return { dpr: 1.5, bloom: true, shadows: true, reflections: true }
    }
  }, [quality])

  return { quality, getSettings }
}
