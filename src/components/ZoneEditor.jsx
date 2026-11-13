import { useState, useRef, useCallback, useEffect } from 'react'
import { visualizerRooms } from '../data/visualizer-rooms'

const allDesigns = visualizerRooms.flatMap((room) =>
  room.designs.map((d) => ({ ...d, roomName: room.name }))
)

const ZONE_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
]

const CLOSE_THRESHOLD = 2

let nextTileId = 1

function pointsToSvg(pointsStr, width, height) {
  return pointsStr
    .split(' ')
    .map((p) => {
      const [x, y] = p.split(',').map(Number)
      return `${(x / 100) * width},${(y / 100) * height}`
    })
    .join(' ')
}

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

export default function ZoneEditor() {
  const [designIdx, setDesignIdx] = useState(0)
  const [tiles, setTiles] = useState([])
  const [zones, setZones] = useState([])
  const [approvedZones, setApprovedZones] = useState(new Set())
  const [selectedTiles, setSelectedTiles] = useState(new Set())
  const [drawingVertices, setDrawingVertices] = useState([])
  const [mousePos, setMousePos] = useState(null)
  const [zoneId, setZoneId] = useState('')
  const [zoneLabel, setZoneLabel] = useState('')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef(null)

  const design = allDesigns[designIdx]

  useEffect(() => {
    setImageLoaded(false)
    setTiles([])
    setZones([])
    setApprovedZones(new Set())
    setSelectedTiles(new Set())
    setDrawingVertices([])
    setMousePos(null)
    nextTileId = 1

    const existingZones = []
    const existingTiles = []
    const approved = new Set()
    for (const z of design.zones) {
      const pointsList = Array.isArray(z.points) ? z.points : [z.points]
      const color = ZONE_COLORS[existingZones.length % ZONE_COLORS.length]
      existingZones.push({ id: z.id, label: z.label, color })
      approved.add(z.id)
      for (const pts of pointsList) {
        existingTiles.push({ id: nextTileId++, points: pts, zoneId: z.id })
      }
    }
    setZones(existingZones)
    setTiles(existingTiles)
    setApprovedZones(approved)
  }, [designIdx])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDrawingVertices([])
      } else if (e.key === 'Enter' && drawingVertices.length >= 3) {
        closePolygon()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawingVertices])

  function closePolygon() {
    if (drawingVertices.length < 3) return
    const points = drawingVertices.map(([x, y]) => `${x},${y}`).join(' ')
    setTiles((prev) => [...prev, { id: nextTileId++, points, zoneId: null }])
    setDrawingVertices([])
  }

  function handleImageLoad(e) {
    setDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight })
    setImageLoaded(true)
  }

  const getPercentCoords = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
  }, [])

  function handleCanvasClick(e) {
    if (e.button !== 0) return
    if (e.target.closest('.tile-control')) return
    if (e.detail === 2) return
    const pt = getPercentCoords(e)
    if (!pt) return

    if (drawingVertices.length >= 3 && dist(pt, drawingVertices[0]) < CLOSE_THRESHOLD) {
      closePolygon()
      return
    }

    setDrawingVertices((prev) => [...prev, pt])
  }

  function handleDoubleClick(e) {
    if (e.target.closest('.tile-control')) return
    e.preventDefault()
    if (drawingVertices.length >= 3) {
      closePolygon()
    }
  }

  function handleContextMenu(e) {
    if (drawingVertices.length > 0) {
      e.preventDefault()
      setDrawingVertices((prev) => prev.slice(0, -1))
    }
  }

  function handleMouseMove(e) {
    const pt = getPercentCoords(e)
    if (pt) setMousePos(pt)
  }

  function handleTileClick(e, tileId) {
    e.stopPropagation()
    setSelectedTiles((prev) => {
      const next = new Set(prev)
      if (e.shiftKey || e.ctrlKey) {
        if (next.has(tileId)) next.delete(tileId)
        else next.add(tileId)
      } else {
        if (next.has(tileId) && next.size === 1) next.delete(tileId)
        else { next.clear(); next.add(tileId) }
      }
      return next
    })
  }

  function handleDeleteTile(tileId) {
    setTiles((prev) => prev.filter((t) => t.id !== tileId))
    setSelectedTiles((prev) => {
      const next = new Set(prev)
      next.delete(tileId)
      return next
    })
  }

  function handleAssignZone() {
    if (selectedTiles.size === 0 || !zoneId.trim()) return

    const id = zoneId.trim()
    const label = zoneLabel.trim() || id

    setZones((prev) => {
      const existing = prev.find((z) => z.id === id)
      if (existing) return prev.map((z) => z.id === id ? { ...z, label } : z)
      return [...prev, { id, label, color: ZONE_COLORS[prev.length % ZONE_COLORS.length] }]
    })

    setApprovedZones((prev) => new Set([...prev, id]))

    setTiles((prev) =>
      prev.map((t) => (selectedTiles.has(t.id) ? { ...t, zoneId: id } : t))
    )

    setSelectedTiles(new Set())
    setZoneId('')
    setZoneLabel('')
  }

  function handleUnassignSelected() {
    setTiles((prev) =>
      prev.map((t) => (selectedTiles.has(t.id) ? { ...t, zoneId: null } : t))
    )
    setSelectedTiles(new Set())
  }

  function handleDeleteSelected() {
    setTiles((prev) => prev.filter((t) => !selectedTiles.has(t.id)))
    setSelectedTiles(new Set())
  }

  function handleSelectAllInZone(zId) {
    const ids = tiles.filter((t) => t.zoneId === zId).map((t) => t.id)
    setSelectedTiles(new Set(ids))
  }

  function toggleZoneApproval(zId) {
    setApprovedZones((prev) => {
      const next = new Set(prev)
      if (next.has(zId)) next.delete(zId)
      else next.add(zId)
      return next
    })
  }

  function approveAll() {
    setApprovedZones(new Set(zones.map((z) => z.id)))
  }

  function rejectAll() {
    setApprovedZones(new Set())
  }

  function getZoneColor(zId) {
    return zones.find((z) => z.id === zId)?.color || '#6b7280'
  }

  function generateCode() {
    const zoneMap = {}
    for (const t of tiles) {
      if (!t.zoneId) continue
      if (!approvedZones.has(t.zoneId)) continue
      if (!zoneMap[t.zoneId]) zoneMap[t.zoneId] = { tiles: [], label: '' }
      zoneMap[t.zoneId].tiles.push(t)
    }
    for (const z of zones) {
      if (zoneMap[z.id]) zoneMap[z.id].label = z.label
    }

    const lines = Object.entries(zoneMap).map(([id, { tiles: zt, label }]) => {
      const pointsArr = zt.map((t) => `'${t.points}'`)
      if (pointsArr.length === 1) {
        return `          { id: '${id}', label: '${label}', points: ${pointsArr[0]} },`
      }
      return `          { id: '${id}', label: '${label}', points: [\n            ${pointsArr.join(',\n            ')},\n          ] },`
    })
    return `        zones: [\n${lines.join('\n')}\n        ],`
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pxX = (pct) => (pct / 100) * dimensions.width
  const pxY = (pct) => (pct / 100) * dimensions.height

  const unassigned = tiles.filter((t) => !t.zoneId)
  const zoneGroups = zones.map((z) => ({
    ...z,
    tiles: tiles.filter((t) => t.zoneId === z.id),
    approved: approvedZones.has(z.id),
  }))

  const approvedCount = zoneGroups.filter((z) => z.approved).length

  const isNearFirstVertex = drawingVertices.length >= 3 && mousePos && dist(mousePos, drawingVertices[0]) < CLOSE_THRESHOLD

  return (
    <div className="min-h-screen bg-[#111] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-amber-400">Zone Editor</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm text-white/60">Image:</label>
            <select
              value={designIdx}
              onChange={(e) => setDesignIdx(Number(e.target.value))}
              className="bg-[#222] border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
            >
              {allDesigns.map((d, i) => (
                <option key={d.id} value={i}>
                  {d.roomName} — {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            {drawingVertices.length > 0 && (
              <span className="text-sm text-emerald-400 font-medium">
                Drawing: {drawingVertices.length} vertices
              </span>
            )}
            {mousePos && (
              <div className="text-sm font-mono text-amber-300/80">
                x: {mousePos[0].toFixed(1)}% &nbsp; y: {mousePos[1].toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Canvas */}
        <div>
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden border-2 border-white/10 cursor-crosshair select-none"
            onClick={handleCanvasClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
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
                {tiles.map((t) => {
                  const color = t.zoneId ? getZoneColor(t.zoneId) : '#6b7280'
                  const isSelected = selectedTiles.has(t.id)
                  const isRejected = t.zoneId && !approvedZones.has(t.zoneId)
                  const svgPoints = pointsToSvg(t.points, dimensions.width, dimensions.height)

                  return (
                    <g key={t.id}>
                      <polygon
                        points={svgPoints}
                        fill={isRejected ? 'rgba(239,68,68,0.15)' : `${color}${isSelected ? '55' : '30'}`}
                        stroke={isRejected ? '#ef4444' : isSelected ? '#fff' : color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        strokeDasharray={isRejected ? '6 4' : 'none'}
                        style={{ cursor: 'pointer', opacity: isRejected ? 0.5 : 1 }}
                        onClick={(e) => handleTileClick(e, t.id)}
                      />
                      {isSelected && (
                        <g
                          className="tile-control"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => { e.stopPropagation(); handleDeleteTile(t.id) }}
                        >
                          {(() => {
                            const coords = t.points.split(' ').map((p) => p.split(',').map(Number))
                            const cx = Math.max(...coords.map(([x]) => x))
                            const cy = Math.min(...coords.map(([, y]) => y))
                            const px = (cx / 100) * dimensions.width
                            const py = (cy / 100) * dimensions.height
                            const r = Math.min(dimensions.width, dimensions.height) * 0.012 * 1.8
                            return (
                              <>
                                <circle cx={px} cy={py} r={r} fill="#ef4444" stroke="#fff" strokeWidth="1" />
                                <text
                                  x={px} y={py}
                                  textAnchor="middle" dominantBaseline="central"
                                  fill="#fff" fontSize={r} fontWeight="700"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  x
                                </text>
                              </>
                            )
                          })()}
                        </g>
                      )}
                    </g>
                  )
                })}

                {/* Drawing preview: vertices, edges, preview line */}
                {drawingVertices.length > 0 && (
                  <g style={{ pointerEvents: 'none' }}>
                    {/* Edges between placed vertices */}
                    <polyline
                      points={drawingVertices.map(([x, y]) => `${pxX(x)},${pxY(y)}`).join(' ')}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                    />
                    {/* Preview line from last vertex to cursor */}
                    {mousePos && (
                      <line
                        x1={pxX(drawingVertices[drawingVertices.length - 1][0])}
                        y1={pxY(drawingVertices[drawingVertices.length - 1][1])}
                        x2={pxX(mousePos[0])}
                        y2={pxY(mousePos[1])}
                        stroke={isNearFirstVertex ? '#4ade80' : '#4ade80'}
                        strokeWidth="2"
                        strokeDasharray={isNearFirstVertex ? 'none' : '6 3'}
                        opacity={isNearFirstVertex ? 1 : 0.6}
                      />
                    )}
                    {/* Close preview line from cursor to first vertex when near */}
                    {isNearFirstVertex && mousePos && (
                      <line
                        x1={pxX(mousePos[0])}
                        y1={pxY(mousePos[1])}
                        x2={pxX(drawingVertices[0][0])}
                        y2={pxY(drawingVertices[0][1])}
                        stroke="#4ade80"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        opacity={0.6}
                      />
                    )}
                    {/* Vertex dots */}
                    {drawingVertices.map(([x, y], i) => {
                      const r = Math.min(dimensions.width, dimensions.height) * 0.006
                      return (
                        <circle
                          key={i}
                          cx={pxX(x)}
                          cy={pxY(y)}
                          r={i === 0 && isNearFirstVertex ? r * 2 : r}
                          fill={i === 0 && isNearFirstVertex ? '#4ade80' : '#4ade80'}
                          stroke="#fff"
                          strokeWidth="1.5"
                          opacity={i === 0 && isNearFirstVertex ? 1 : 0.9}
                        />
                      )
                    })}
                  </g>
                )}

                {/* Crosshair when idle */}
                {mousePos && drawingVertices.length === 0 && (
                  <g style={{ pointerEvents: 'none' }}>
                    <line x1={pxX(mousePos[0])} y1={0} x2={pxX(mousePos[0])} y2={dimensions.height} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1={0} y1={pxY(mousePos[1])} x2={dimensions.width} y2={pxY(mousePos[1])} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </g>
                )}
              </svg>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap text-sm">
            <span className="text-white/50">
              {tiles.length} tile{tiles.length !== 1 ? 's' : ''} total
            </span>
            <span className="text-white/50">
              {selectedTiles.size} selected
            </span>
            <span className="text-emerald-400/70">
              {approvedCount}/{zones.length} zones approved
            </span>
            {selectedTiles.size > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={handleUnassignSelected}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                >
                  Unassign Selected
                </button>
              </>
            )}
            {drawingVertices.length > 0 && (
              <button
                onClick={() => setDrawingVertices([])}
                className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
              >
                Cancel Drawing (Esc)
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Assign zone form */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">Assign Selected to Zone</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 block mb-1">Zone ID</label>
                <input
                  type="text"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  placeholder="e.g. upper-cabinets"
                  className="w-full bg-[#222] border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Zone Label</label>
                <input
                  type="text"
                  value={zoneLabel}
                  onChange={(e) => setZoneLabel(e.target.value)}
                  placeholder="e.g. Upper Cabinets"
                  className="w-full bg-[#222] border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
                />
              </div>
              <button
                onClick={handleAssignZone}
                disabled={selectedTiles.size === 0 || !zoneId.trim()}
                className="w-full py-2 rounded-lg text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Assign {selectedTiles.size} Tile{selectedTiles.size !== 1 ? 's' : ''} to Zone
              </button>
            </div>
            {zones.length > 0 && selectedTiles.size > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-white/40 mb-2">Quick assign to:</p>
                <div className="flex flex-wrap gap-2">
                  {zones.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => {
                        setTiles((prev) =>
                          prev.map((t) => (selectedTiles.has(t.id) ? { ...t, zoneId: z.id } : t))
                        )
                        setSelectedTiles(new Set())
                      }}
                      className="px-2 py-1 text-xs rounded-md border transition-colors hover:brightness-125"
                      style={{ borderColor: z.color, color: z.color, backgroundColor: `${z.color}15` }}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zone legend with approve/reject */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-400">
                Zones ({zones.length})
              </h3>
              {zones.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={approveAll}
                    className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={rejectAll}
                    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                  >
                    Reject All
                  </button>
                </div>
              )}
            </div>
            {zones.length === 0 ? (
              <p className="text-white/30 text-sm">No zones yet. Draw polygons, select them, and assign a zone name.</p>
            ) : (
              <ul className="space-y-2">
                {zoneGroups.map((zg) => (
                  <li key={zg.id} className={`rounded-lg px-3 py-2 transition-all ${zg.approved ? 'bg-white/5' : 'bg-red-500/5 border border-red-500/20'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                          style={{ backgroundColor: zg.approved ? zg.color : '#6b7280' }}
                        />
                        <span className={`text-sm font-medium truncate ${zg.approved ? '' : 'line-through text-white/40'}`}>
                          {zg.label}
                        </span>
                        <span className="text-xs text-white/30 flex-shrink-0">
                          ({zg.tiles.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <button
                          onClick={() => handleSelectAllInZone(zg.id)}
                          className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors px-1"
                          title="Select tiles"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => toggleZoneApproval(zg.id)}
                          className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                            zg.approved
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-red-500/20 hover:text-red-300'
                              : 'bg-red-500/20 text-red-300 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                          title={zg.approved ? 'Click to reject' : 'Click to approve'}
                        >
                          {zg.approved ? 'Approved' : 'Rejected'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {unassigned.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    Unassigned: {unassigned.length} tile{unassigned.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setSelectedTiles(new Set(unassigned.map((t) => t.id)))}
                    className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors"
                  >
                    Select All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Code output */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-400">Generated Code</h3>
              <button
                onClick={handleCopyCode}
                disabled={tiles.filter((t) => t.zoneId && approvedZones.has(t.zoneId)).length === 0}
                className="px-3 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="text-xs text-green-300/80 bg-black/40 rounded-lg p-3 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
              {tiles.filter((t) => t.zoneId && approvedZones.has(t.zoneId)).length > 0
                ? generateCode()
                : '// Approve zones above, then code appears here'}
            </pre>
          </div>

          {/* Instructions */}
          <div className="text-white/30 text-xs space-y-1.5 px-1">
            <p className="text-amber-400/60 font-semibold mb-2">How to use:</p>
            <p>1. Select an image — pre-defined zones load automatically</p>
            <p>2. Review each zone overlay on the image</p>
            <p>3. Click <span className="text-emerald-300">Approved</span> / <span className="text-red-300">Rejected</span> to toggle zones</p>
            <p>4. <strong className="text-white/50">Draw polygons:</strong> click to place vertices, double-click or click near first point to close</p>
            <p>5. Right-click to undo last vertex, Esc to cancel, Enter to close</p>
            <p>6. Click "Copy Code" to get only approved zones</p>
          </div>
        </div>
      </div>
    </div>
  )
}
