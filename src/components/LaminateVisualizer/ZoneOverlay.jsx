import { motion } from 'framer-motion'

function parsePoints(pointsStr) {
  return pointsStr
    .split(' ')
    .map((p) => p.split(',').map(Number))
}

function pointsToSvg(pointsStr, width, height) {
  return parsePoints(pointsStr)
    .map(([x, y]) => `${(x / 100) * width},${(y / 100) * height}`)
    .join(' ')
}

function getPolygonStrings(zone) {
  if (Array.isArray(zone.points)) return zone.points
  return [zone.points]
}

export default function ZoneOverlay({
  zone,
  isSelected,
  hasTexture,
  textureUrl,
  viewBox,
  onSelect,
}) {
  const [vw, vh] = viewBox
  const polygonStrings = getPolygonStrings(zone)

  const allParsed = polygonStrings.map(parsePoints)
  const allFlat = allParsed.flat()

  const cx = allFlat.reduce((s, [x]) => s + x, 0) / allFlat.length
  const cy = allFlat.reduce((s, [, y]) => s + y, 0) / allFlat.length
  const labelX = (cx / 100) * vw
  const labelY = (cy / 100) * vh

  const clipId = `clip-${zone.id}`

  const minX = Math.min(...allFlat.map(([x]) => x))
  const minY = Math.min(...allFlat.map(([, y]) => y))
  const maxX = Math.max(...allFlat.map(([x]) => x))
  const maxY = Math.max(...allFlat.map(([, y]) => y))

  const rectX = (minX / 100) * vw
  const rectY = (minY / 100) * vh
  const rectW = ((maxX - minX) / 100) * vw
  const rectH = ((maxY - minY) / 100) * vh

  return (
    <g className="zone-group">
      {hasTexture && textureUrl && (
        <>
          <defs>
            <clipPath id={clipId}>
              {polygonStrings.map((ps, i) => (
                <polygon key={i} points={pointsToSvg(ps, vw, vh)} />
              ))}
            </clipPath>
          </defs>
          <image
            href={textureUrl}
            x={rectX}
            y={rectY}
            width={rectW}
            height={rectH}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            style={{ opacity: 0.85 }}
          />
        </>
      )}

      {polygonStrings.map((ps, i) => (
        <motion.polygon
          key={i}
          points={pointsToSvg(ps, vw, vh)}
          fill={isSelected ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.0)'}
          stroke={isSelected ? '#C9A84C' : 'rgba(250,246,240,0.4)'}
          strokeWidth={isSelected ? 2.5 : 1.2}
          strokeDasharray={isSelected ? 'none' : '6 3'}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(zone.id)}
          whileHover={{
            fill: 'rgba(201,168,76,0.15)',
            stroke: '#C9A84C',
            strokeWidth: 2,
            strokeDasharray: 'none',
          }}
          transition={{ duration: 0.2 }}
        />
      ))}

      <motion.text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FAF6F0"
        fontSize={Math.min(vw, vh) * 0.028}
        fontWeight="600"
        style={{
          pointerEvents: 'none',
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          userSelect: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : 0.6 }}
      >
        {zone.label}
      </motion.text>
    </g>
  )
}
