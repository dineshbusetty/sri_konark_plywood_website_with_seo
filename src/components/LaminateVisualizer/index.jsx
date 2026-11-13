import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, RotateCcw, ChefHat, Bed, Sofa, ImageIcon, X, Maximize2 } from 'lucide-react'
import { visualizerRooms } from '../../data/visualizer-rooms'
import RoomCanvas from './RoomCanvas'

const roomIcons = {
  kitchen: ChefHat,
  bedroom: Bed,
  'living-hall': Sofa,
}

export default function LaminateVisualizer() {
  const [activeRoom, setActiveRoom] = useState(visualizerRooms[0].id)
  const [activeDesign, setActiveDesign] = useState(0)
  const [selectedTiles, setSelectedTiles] = useState(new Set())
  const [textures, setTextures] = useState({})
  const [tileOpacity, setTileOpacity] = useState({})
  const [tileSpanBounds, setTileSpanBounds] = useState({})
  const [spanMode, setSpanMode] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const objectUrlsRef = useRef([])

  const room = visualizerRooms.find((r) => r.id === activeRoom)
  const design = room.designs[activeDesign]

  const flatTiles = useMemo(() => {
    return design.zones.flatMap((zone) => {
      const polygons = Array.isArray(zone.points) ? zone.points : [zone.points]
      return polygons.map((pts, i) => ({
        id: `${zone.id}--${i}`,
        points: pts,
      }))
    })
  }, [design])

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleRoomChange(roomId) {
    setActiveRoom(roomId)
    setActiveDesign(0)
    setSelectedTiles(new Set())
    revokeAndClear()
  }

  function handleDesignChange(idx) {
    setActiveDesign(idx)
    setSelectedTiles(new Set())
    revokeAndClear()
  }

  function revokeAndClear() {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    objectUrlsRef.current = []
    setTextures({})
    setTileOpacity({})
    setTileSpanBounds({})
  }

  function handleReset() {
    setSelectedTiles(new Set())
    revokeAndClear()
  }

  function handleSelectTile(tileId) {
    setSelectedTiles((prev) => {
      const next = new Set(prev)
      if (next.has(tileId)) next.delete(tileId)
      else next.add(tileId)
      return next
    })
  }

  const applyTexture = useCallback(
    (file) => {
      if (selectedTiles.size === 0 || !file) return
      const url = URL.createObjectURL(file)
      objectUrlsRef.current.push(url)
      setTextures((prev) => {
        const next = { ...prev }
        for (const tileId of selectedTiles) {
          next[tileId] = url
        }
        return next
      })
      if (spanMode && selectedTiles.size > 1) {
        const selectedPolygons = flatTiles.filter((t) => selectedTiles.has(t.id))
        const allParsed = selectedPolygons.flatMap((t) =>
          t.points.split(' ').map((p) => p.split(',').map(Number))
        )
        const bounds = {
          minX: Math.min(...allParsed.map(([x]) => x)),
          minY: Math.min(...allParsed.map(([, y]) => y)),
          maxX: Math.max(...allParsed.map(([x]) => x)),
          maxY: Math.max(...allParsed.map(([, y]) => y)),
        }
        setTileSpanBounds((prev) => {
          const next = { ...prev }
          for (const tileId of selectedTiles) next[tileId] = bounds
          return next
        })
      } else {
        setTileSpanBounds((prev) => {
          const next = { ...prev }
          for (const tileId of selectedTiles) delete next[tileId]
          return next
        })
      }
      setSelectedTiles(new Set())
    },
    [selectedTiles, spanMode, flatTiles],
  )

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) applyTexture(file)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) applyTexture(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function setTileOpacityValue(tileId, value) {
    setTileOpacity((prev) => ({ ...prev, [tileId]: value }))
  }

  function removeTileTexture(tileId) {
    setTextures((prev) => {
      const next = { ...prev }
      delete next[tileId]
      return next
    })
    setTileOpacity((prev) => {
      const next = { ...prev }
      delete next[tileId]
      return next
    })
    setTileSpanBounds((prev) => {
      const next = { ...prev }
      delete next[tileId]
      return next
    })
  }

  const hasAnyTexture = Object.keys(textures).length > 0
  const canUpload = selectedTiles.size > 0

  const tileIndexMap = useMemo(() => {
    const map = {}
    flatTiles.forEach((t, i) => { map[t.id] = i + 1 })
    return map
  }, [flatTiles])

  return (
    <section id="visualizer" className="relative py-20 md:py-28 bg-gradient-to-b from-[#1A1A1A] via-[#1e1b16] to-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            className="inline-block text-[#C9A84C] text-sm tracking-[0.2em] uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Interactive Tool
          </motion.span>
          <motion.h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#FAF6F0] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Laminate <span className="text-[#C9A84C]">Visualizer</span>
          </motion.h2>
          <motion.p
            className="text-[#FAF6F0]/60 max-w-2xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            See how laminates look in real rooms. Pick a room, click on any tile, and upload your laminate pattern to preview it instantly.
          </motion.p>
        </div>

        {/* Room Tabs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {visualizerRooms.map((r) => {
            const Icon = roomIcons[r.id]
            const isActive = activeRoom === r.id
            return (
              <button
                key={r.id}
                onClick={() => handleRoomChange(r.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A84C] text-[#1A1A1A] shadow-lg shadow-[#C9A84C]/20'
                    : 'bg-[#FAF6F0]/5 text-[#FAF6F0]/60 hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0]/80'
                }`}
              >
                {Icon && <Icon size={16} />}
                <span className="hidden sm:inline">{r.name}</span>
              </button>
            )
          })}
        </div>

        {/* Design Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {room.designs.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => handleDesignChange(idx)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeDesign === idx
                  ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40'
                  : 'bg-[#FAF6F0]/5 text-[#FAF6F0]/50 border border-transparent hover:border-[#FAF6F0]/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          {/* Room Canvas */}
          <RoomCanvas
            design={design}
            selectedTiles={selectedTiles}
            onSelectTile={handleSelectTile}
            textures={textures}
            tileOpacity={tileOpacity}
            tileSpanBounds={tileSpanBounds}
          />

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Selection Info */}
            <div className="bg-[#FAF6F0]/5 rounded-xl p-5 border border-[#FAF6F0]/10">
              <h3 className="text-[#FAF6F0] text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                Selection
              </h3>
              {selectedTiles.size > 0 ? (
                <p className="text-[#C9A84C] font-medium">
                  {selectedTiles.size} tile{selectedTiles.size > 1 ? 's' : ''} selected
                </p>
              ) : (
                <p className="text-[#FAF6F0]/40 text-sm">
                  Click on tiles in the image to select them. Click again to deselect.
                </p>
              )}
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-6 text-center ${
                !canUpload
                  ? 'border-[#FAF6F0]/10 opacity-50 cursor-not-allowed'
                  : isDragOver
                    ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                    : 'border-[#FAF6F0]/20 hover:border-[#C9A84C]/50 cursor-pointer'
              }`}
              onClick={() => canUpload && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!canUpload}
              />

              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  canUpload ? 'bg-[#C9A84C]/15' : 'bg-[#FAF6F0]/5'
                }`}>
                  <Upload size={20} className={canUpload ? 'text-[#C9A84C]' : 'text-[#FAF6F0]/30'} />
                </div>
                <div>
                  <p className="text-[#FAF6F0]/80 text-sm font-medium">
                    {canUpload ? 'Upload Laminate Image' : 'Select a tile first'}
                  </p>
                  <p className="text-[#FAF6F0]/40 text-xs mt-1">
                    {canUpload ? 'Drag & drop or click to browse' : 'Click on a tile in the room'}
                  </p>
                </div>
              </div>
            </div>

            {/* Span Toggle */}
            {selectedTiles.size > 1 && (
              <button
                onClick={() => setSpanMode((v) => !v)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
                  spanMode
                    ? 'bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]'
                    : 'bg-[#FAF6F0]/5 border-[#FAF6F0]/10 text-[#FAF6F0]/50 hover:border-[#FAF6F0]/20'
                }`}
              >
                <Maximize2 size={16} />
                <span className="flex-1 text-left">Span image across tiles</span>
                <span className={`w-3 h-3 rounded-full border-2 ${
                  spanMode ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-[#FAF6F0]/30'
                }`} />
              </button>
            )}

            {/* Applied Laminates */}
            {hasAnyTexture && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#FAF6F0]/5 rounded-xl p-5 border border-[#FAF6F0]/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FAF6F0] text-sm font-semibold flex items-center gap-2">
                    <ImageIcon size={14} className="text-[#C9A84C]" />
                    Applied Laminates
                  </h3>
                  <button
                    onClick={handleReset}
                    className="text-[#FAF6F0]/40 hover:text-[#C9A84C] transition-colors cursor-pointer"
                    title="Reset all"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                <ul className="space-y-3 max-h-72 overflow-y-auto">
                  {Object.entries(textures).map(([tileId, url]) => {
                    const opacityVal = tileOpacity[tileId] ?? 85
                    return (
                      <li key={tileId} className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded border border-[#FAF6F0]/10 bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${url})` }}
                          />
                          <span className="text-[#FAF6F0]/70 text-xs flex-1 truncate">
                            Tile {tileIndexMap[tileId] || tileId}
                          </span>
                          <button
                            onClick={() => removeTileTexture(tileId)}
                            className="text-[#FAF6F0]/30 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pl-11">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={opacityVal}
                            onChange={(e) => setTileOpacityValue(tileId, Number(e.target.value))}
                            className="flex-1 h-1 appearance-none bg-[#FAF6F0]/10 rounded-full cursor-pointer accent-[#C9A84C]"
                          />
                          <span className="text-[#C9A84C] text-xs w-8 text-right tabular-nums">
                            {opacityVal}%
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}

            {/* Instructions */}
            <div className="text-[#FAF6F0]/30 text-xs space-y-1.5 px-1">
              <p>1. Select a room and design above</p>
              <p>2. Click tiles on the image to select (click again to deselect)</p>
              <p>3. Upload a laminate pattern image</p>
              <p>4. Toggle "Span" to stretch one image across multiple tiles</p>
              <p>5. Adjust the opacity slider to control how much the laminate overlaps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
