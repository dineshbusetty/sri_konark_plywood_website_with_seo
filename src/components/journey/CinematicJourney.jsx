import { useRef, lazy, Suspense } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { TOTAL_SCROLL_HEIGHT } from '../../data/cameraKeyframes'
import JourneyOverlay from './JourneyOverlay'

const JourneyCanvas = lazy(() => import('./JourneyCanvas'))

export default function CinematicJourney() {
  const sectionRef = useRef(null)
  const { progress, currentAct, getActProgress } = useScrollProgress(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="journey"
      style={{ height: `${TOTAL_SCROLL_HEIGHT}svh` }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden bg-charcoal"
        style={{ height: '100svh' }}
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-charcoal">
              <p className="text-cream font-serif text-xl animate-pulse">Loading experience…</p>
            </div>
          }
        >
          <JourneyCanvas
            progressRef={progress}
            currentActRef={currentAct}
          />
        </Suspense>

        <JourneyOverlay
          progressRef={progress}
          currentActRef={currentAct}
          getActProgress={getActProgress}
        />
      </div>
    </section>
  )
}
