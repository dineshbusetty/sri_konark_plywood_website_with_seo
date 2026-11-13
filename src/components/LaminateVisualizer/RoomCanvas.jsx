import { useState, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TileOverlay from './TileOverlay'

export default function RoomCanvas({
  design,
  selectedTiles,
  onSelectTile,
  textures,
  tileOpacity,
  tileSpanBounds,
}) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
  }, [design.id])

  const flatTiles = useMemo(() => {
    return design.zones.flatMap((zone) => {
      const polygons = Array.isArray(zone.points) ? zone.points : [zone.points]
      return polygons.map((pts, i) => ({
        id: `${zone.id}--${i}`,
        points: pts,
      }))
    })
  }, [design])

  function handleImageLoad(e) {
    const img = e.target
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    setImageLoaded(true)
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#1a1a1a]">
      <AnimatePresence mode="wait">
        <motion.div
          key={design.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <img
            src={design.image}
            alt={design.label}
            className="w-full h-auto block"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {imageLoaded && (
            <svg
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {flatTiles.map((tile) => (
                <TileOverlay
                  key={tile.id}
                  tile={tile}
                  isSelected={selectedTiles.has(tile.id)}
                  hasTexture={!!textures[tile.id]}
                  textureUrl={textures[tile.id] || null}
                  opacity={(tileOpacity[tile.id] ?? 85) / 100}
                  spanBounds={tileSpanBounds[tile.id] || null}
                  viewBox={[dimensions.width, dimensions.height]}
                  onSelect={onSelectTile}
                />
              ))}
            </svg>
          )}
        </motion.div>
      </AnimatePresence>

      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
