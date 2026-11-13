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

export default function TileOverlay({
  tile,
  isSelected,
  hasTexture,
  textureUrl,
  opacity,
  spanBounds,
  viewBox,
  onSelect,
}) {
  const [vw, vh] = viewBox
  const parsed = parsePoints(tile.points)

  const clipId = `clip-${tile.id}`

  const minX = Math.min(...parsed.map(([x]) => x))
  const minY = Math.min(...parsed.map(([, y]) => y))
  const maxX = Math.max(...parsed.map(([x]) => x))
  const maxY = Math.max(...parsed.map(([, y]) => y))

  const imgMinX = spanBounds ? spanBounds.minX : minX
  const imgMinY = spanBounds ? spanBounds.minY : minY
  const imgMaxX = spanBounds ? spanBounds.maxX : maxX
  const imgMaxY = spanBounds ? spanBounds.maxY : maxY

  const rectX = (imgMinX / 100) * vw
  const rectY = (imgMinY / 100) * vh
  const rectW = ((imgMaxX - imgMinX) / 100) * vw
  const rectH = ((imgMaxY - imgMinY) / 100) * vh

  const svgPoints = pointsToSvg(tile.points, vw, vh)

  return (
    <g className="tile-group">
      {hasTexture && textureUrl && (
        <>
          <defs>
            <clipPath id={clipId}>
              <polygon points={svgPoints} />
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
            style={{ opacity }}
          />
        </>
      )}

      {hasTexture ? (
        <polygon
          points={svgPoints}
          fill="transparent"
          stroke={isSelected ? '#C9A84C' : 'none'}
          strokeWidth={isSelected ? 2.5 : 0}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(tile.id)}
        />
      ) : (
        <motion.polygon
          points={svgPoints}
          fill={isSelected ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.0)'}
          stroke={isSelected ? '#C9A84C' : 'rgba(250,246,240,0.4)'}
          strokeWidth={isSelected ? 2.5 : 1.2}
          strokeDasharray={isSelected ? 'none' : '6 3'}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(tile.id)}
          whileHover={{
            fill: 'rgba(201,168,76,0.15)',
            stroke: '#C9A84C',
            strokeWidth: 2,
            strokeDasharray: 'none',
          }}
          transition={{ duration: 0.2 }}
        />
      )}
    </g>
  )
}
