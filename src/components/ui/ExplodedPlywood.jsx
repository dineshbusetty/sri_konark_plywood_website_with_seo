import { useState, useId } from 'react';
import { motion } from 'framer-motion';

const LAYER_CONFIG = [
  { name: 'Face Veneer', baseColor: '#C4956A', darkColor: '#A07550', edgeColor: '#8B6545', seed: 1 },
  { name: 'Cross Band', baseColor: '#B08055', darkColor: '#8E6642', edgeColor: '#7A5838', seed: 7 },
  { name: 'Core Veneer', baseColor: '#9A6B45', darkColor: '#7D5535', edgeColor: '#6B4A30', seed: 13 },
  { name: 'Cross Band', baseColor: '#B08055', darkColor: '#8E6642', edgeColor: '#7A5838', seed: 19 },
  { name: 'Back Veneer', baseColor: '#C4956A', darkColor: '#A07550', edgeColor: '#8B6545', seed: 25 },
];

function WoodLayer({ layer, index, total, filterId }) {
  const layerW = 220;
  const layerH = 24;
  const depthH = 8;
  const sideW = 60;

  return (
    <g>
      {/* Top face with wood grain filter */}
      <rect
        x={0} y={0}
        width={layerW} height={layerH}
        fill={layer.baseColor}
        filter={`url(#${filterId})`}
        rx="1"
      />
      {/* Top face border */}
      <rect
        x={0} y={0}
        width={layerW} height={layerH}
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.5"
        rx="1"
      />
      {/* Subtle highlight on top edge */}
      <rect
        x={1} y={1}
        width={layerW - 2} height={2}
        fill="rgba(255,255,255,0.15)"
        rx="0.5"
      />

      {/* Right side face (3D depth) */}
      <path
        d={`M ${layerW},0 L ${layerW + sideW * 0.6},${-depthH} L ${layerW + sideW * 0.6},${layerH - depthH} L ${layerW},${layerH} Z`}
        fill={layer.edgeColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.5"
      />
      {/* Edge grain lines on side */}
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <line
          key={t}
          x1={layerW + sideW * 0.6 * t}
          y1={-depthH * t + layerH * 0.15}
          x2={layerW + sideW * 0.6 * t}
          y2={-depthH * t + layerH * 0.85}
          stroke={`rgba(0,0,0,${0.05 + t * 0.05})`}
          strokeWidth="0.3"
        />
      ))}

      {/* Bottom face (front edge) */}
      <path
        d={`M 0,${layerH} L ${sideW * 0.6},${layerH - depthH} L ${layerW + sideW * 0.6},${layerH - depthH} L ${layerW},${layerH} Z`}
        fill={layer.darkColor}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.5"
      />

      {/* Shadow underneath */}
      <rect
        x={2} y={layerH}
        width={layerW - 4} height={2}
        fill="rgba(0,0,0,0.08)"
        rx="1"
      />
    </g>
  );
}

export default function ExplodedPlywood({
  grade = 'BWP',
  fullName = 'Boiling Water Proof',
  standard = 'IS 710',
  layers = 5,
  resinType = 'Phenol Formaldehyde',
  resinColor = '#1565C0',
  usage = 'Base cabinets, under-sink units',
  whyThisGrade = '',
}) {
  const [showWhy, setShowWhy] = useState(false);
  const uid = useId();
  const displayLayers = LAYER_CONFIG.slice(0, layers);
  const layerGap = 50;
  const layerH = 24;
  const svgH = layers * layerH + (layers - 1) * layerGap + 80;
  const svgW = 340;
  const offsetX = 30;
  const offsetY = 30;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-walnut/10">
      {/* Title */}
      <div className="mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Plywood</p>
        <h3 className="font-heading text-xl sm:text-2xl text-charcoal">
          {grade} {fullName.includes('Plywood') ? fullName : `${fullName} Plywood`}
        </h3>
      </div>

      {/* SVG Exploded View */}
      <div className="flex justify-center mb-6">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-[320px] h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Wood grain filters — one per layer with unique seed */}
            {displayLayers.map((layer, i) => (
              <filter key={i} id={`${uid}-grain-${i}`} x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.015 0.25"
                  numOctaves="5"
                  seed={layer.seed}
                  result="noise"
                />
                <feColorMatrix
                  in="noise"
                  type="saturate"
                  values="0"
                  result="mono"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="mono"
                  mode="multiply"
                />
              </filter>
            ))}

            {/* Resin glow filter */}
            <filter id={`${uid}-resin-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {displayLayers.map((layer, i) => {
            const y = offsetY + i * (layerH + layerGap);

            return (
              <g key={i}>
                {/* Resin strip between layers */}
                {i > 0 && (
                  <g transform={`translate(${offsetX}, ${y - layerGap * 0.5 - 3})`}>
                    <rect
                      x={0} y={0}
                      width={220} height={6}
                      fill={resinColor}
                      opacity={0.7}
                      rx="1"
                      filter={`url(#${uid}-resin-glow)`}
                    />
                    <rect
                      x={5} y={1.5}
                      width={210} height={2}
                      fill="rgba(255,255,255,0.3)"
                      rx="0.5"
                    />
                  </g>
                )}

                {/* Wood layer */}
                <g transform={`translate(${offsetX}, ${y})`}>
                  <WoodLayer
                    layer={layer}
                    index={i}
                    total={layers}
                    filterId={`${uid}-grain-${i}`}
                  />
                </g>

                {/* Label */}
                <g transform={`translate(${offsetX + 260}, ${y + layerH / 2})`}>
                  <line x1={0} y1={0} x2={25} y2={0} stroke={layer.baseColor} strokeWidth="1" opacity="0.6" />
                  <text
                    x={30} y={4}
                    fill="#5D4037"
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                  >
                    {layer.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info */}
      <div className="space-y-3 max-w-md mx-auto">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide"
            style={{ backgroundColor: resinColor }}
          >
            {grade}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium border border-charcoal/20 text-charcoal">
            {standard}
          </span>
        </div>

        <p className="text-xs text-charcoal/50">Resin: {resinType}</p>

        <p className="text-xs text-charcoal/70">
          <span className="font-semibold text-charcoal">Usage:</span> {usage}
        </p>

        {whyThisGrade && (
          <div>
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="text-xs font-semibold text-gold hover:text-gold/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: showWhy ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ▸
              </span>
              Why this grade?
            </button>
            <motion.div
              initial={false}
              animate={{ height: showWhy ? 'auto' : 0, opacity: showWhy ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-charcoal/60 mt-2 leading-relaxed pl-3 border-l-2 border-gold/30">
                {whyThisGrade}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
