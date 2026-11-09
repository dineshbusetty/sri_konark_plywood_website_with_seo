import { useRef, useEffect, useCallback } from 'react'
import { onFrame } from '../lib/scroll'
import { clamp } from '../lib/math'
import { ACTS, TOTAL_SCROLL_HEIGHT } from '../data/cameraKeyframes'

export function useScrollProgress(sectionRef) {
  const progress = useRef(0)
  const currentAct = useRef('forest')

  useEffect(() => {
    return onFrame(() => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const totalPx = TOTAL_SCROLL_HEIGHT * vh / 100
      const scrolled = -rect.top
      progress.current = clamp(scrolled / (totalPx - vh))

      for (const act of ACTS) {
        if (progress.current >= act.start && progress.current <= act.end) {
          currentAct.current = act.id
          break
        }
      }
    })
  }, [sectionRef])

  const getActProgress = useCallback((actId) => {
    const act = ACTS.find(a => a.id === actId)
    if (!act) return 0
    return clamp((progress.current - act.start) / (act.end - act.start))
  }, [])

  return { progress, currentAct, getActProgress }
}
