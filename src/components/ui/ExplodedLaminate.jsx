import { useState, useId } from 'react';
import { motion } from 'framer-motion';

const FINISH_CONFIGS = {
  matte: { baseFreq: '0.8 0.8', octaves: 3, opacity: 0.08 },
  'high gloss': { baseFreq: '0.01 0.01', octaves: 1, opacity: 0.03, glossHighlight: true },
  textured: { baseFreq: '0.4 0.15', octaves: 5, opacity: 0.15 },
  'wood grain': { baseFreq: '0.015 0.25', octaves: 5, opacity: 0.2, woodTint: true },
};

function getFinishConfig(finish) {
  const key = (finish || '').toLowerCase();
  for (const [pattern, config] of Object.entries(FINISH_CONFIGS)) {
    if (key.includes(pattern)) return config;
  }
  return FINISH_CONFIGS.matte;
}

const LAYER_DEFINITIONS = [
  { key: 'surface', label: 'Decorative Surface', height: 20, baseColor: '#E8DDD0', darkColor: '#D8CCC0', edgeColor: '#C8BAA8' },
  { key: 'kraft-0', label: 'Kraft Paper', height: 10, baseColor: '#8B6B3E', darkColor: '#7A5A2E', edgeColor: '#6B4E24' },
  { key: 'kraft-1', label: null, height: 10, baseColor: '#937340', darkColor: '#826232', edgeColor: '#725628' },
  { key: 'kraft-2', label: null, height: 10, baseColor: '#9B7B48', darkColor: '#8A6A38', edgeColor: '#7A5E2E' },
  { key: 'kraft-3', label: null, height: 10, baseColor: '#A38350', darkColor: '#927240', edgeColor: '#826636' },
  { key: 'resin', label: 'Resin Backing', height: 14, baseColor: '#D4A830', darkColor: '#BF9428', edgeColor: '#AA8020' },
];

function LaminateLayer({ layer, filterId, index, total }) {
  const layerW = 200;
  const sideW = 50;
  const depthH = 8;

  return (
    <g>
      {/* Top face */}
      <rect
        x={0} y={0}
        width={layerW} height={layer.height}
        fill={layer.baseColor}
        filter={filterId ? `url(#${filterId})` : undefined}
        rx="1"
      />
      <rect
        x={0} y={0}
        width={layerW} height={layer.height}
        fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" rx="1"
      />
      {/* Top highlight */}
      <rect
        x={1} y={1}
        width={layerW - 2} height={Math.min(2, layer.height / 3)}
        fill="rgba(255,255,255,0.12)" rx="0.5"
      />

      {/* Right side face */}
      <path
        d={`M ${layerW},0 L ${layerW + sideW * 0.5},${-depthH} L ${layerW + sideW * 0.5},${layer.height - depthH} L ${layerW},${layer.height} Z`}
        fill={layer.edgeColor}
        stroke="rgba(0,0,0,0.12)" strokeWidth="0.5"
      />

      {/* Bottom face */}
      <path
        d={`M 0,${layer.height} L ${sideW * 0.5},${layer.height - depthH} L ${layerW + sideW * 0.5},${layer.height - depthH} L ${layerW},${layer.height} Z`}
        fill={layer.darkColor}
        stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"
      />

      {/* Shadow */}
      <rect
        x={2} y={layer.height}
        width={layerW - 4} height={1.5}
        fill="rgba(0,0,0,0.06)" rx="0.5"
      />
    </g>
  );
}

export default function ExplodedLaminate({ laminates = [] }) {
  const [activeLaminate, setActiveLaminate] = useState(0);
  const uid = useId();

  if (!laminates.length) return null;

  const active = laminates[activeLaminate];
  const finishConfig = getFinishConfig(active.finish);

  const layerGap = 38;
  const layers = LAYER_DEFINITIONS;
  const totalH = layers.reduce((sum, l) => sum + l.height, 0) + (layers.length - 1) * layerGap + 60;
  const svgW = 310;
  const offsetX = 25;
  const offsetY = 25;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-walnut/10">
      <div className="mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Laminate</p>
        <motion.h3
          key={activeLaminate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-heading text-xl sm:text-2xl text-charcoal"
        >
          {active.type} {active.finish}
        </motion.h3>
      </div>

      <div className="flex justify-center mb-6">
        <svg
          viewBox={`0 0 ${svgW} ${totalH}`}
          className="w-full max-w-[300px] h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Surface finish filter */}
            <filter id={`${uid}-surface`} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={finishConfig.baseFreq}
                numOctaves={finishConfig.octaves}
                seed={42}
                result="noise"
              />
              <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
              <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
            </filter>

            {/* Kraft paper grain filter */}
            <filter id={`${uid}-kraft`} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03 0.15"
                numOctaves="4"
                seed={7}
                result="noise"
              />
              <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
              <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
            </filter>

            {/* Gloss highlight gradient for high gloss finish */}
            {finishConfig.glossHighlight && (
              <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            )}

            {/* Resin glow */}
            <filter id={`${uid}-resin-glow`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {layers.map((layer, i) => {
            let runningY = offsetY;
            for (let j = 0; j < i; j++) {
              runningY += layers[j].height + layerGap;
            }

            const isKraft = layer.key.startsWith('kraft');
            const isSurface = layer.key === 'surface';
            const isResin = layer.key === 'resin';

            let filterId = null;
            if (isSurface) filterId = `${uid}-surface`;
            else if (isKraft) filterId = `${uid}-kraft`;

            return (
              <g key={layer.key}>
                <g transform={`translate(${offsetX}, ${runningY})`}>
                  <LaminateLayer
                    layer={layer}
                    filterId={filterId}
                    index={i}
                    total={layers.length}
                  />

                  {/* Gloss highlight overlay for surface */}
                  {isSurface && finishConfig.glossHighlight && (
                    <rect
                      x={0} y={0}
                      width={200} height={layer.height}
                      fill={`url(#${uid}-gloss)`}
                      rx="1"
                    />
                  )}

                  {/* Resin glow on resin layer */}
                  {isResin && (
                    <rect
                      x={-2} y={-2}
                      width={204} height={layer.height + 4}
                      fill="rgba(212,168,48,0.08)"
                      filter={`url(#${uid}-resin-glow)`}
                      rx="2"
                    />
                  )}
                </g>

                {/* Label */}
                {layer.label && (
                  <g transform={`translate(${offsetX + 230}, ${runningY + layer.height / 2})`}>
                    <line x1={0} y1={0} x2={20} y2={0} stroke={layer.baseColor} strokeWidth="1" opacity="0.5" />
                    <text
                      x={25} y={4}
                      fill="#5D4037"
                      fontSize="8"
                      fontFamily="Inter, sans-serif"
                      fontWeight="500"
                    >
                      {layer.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Laminate info */}
      <div className="space-y-2 max-w-md mx-auto mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide bg-walnut">
            {active.thickness}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium border border-charcoal/20 text-charcoal">
            {active.finish}
          </span>
        </div>
        <p className="text-xs text-charcoal/60">{active.usage}</p>
      </div>

      {/* Laminate tabs */}
      {laminates.length > 1 && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {laminates.map((lam, i) => (
            <button
              key={i}
              onClick={() => setActiveLaminate(i)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 flex-1 max-w-xs cursor-pointer ${
                i === activeLaminate
                  ? 'border-gold bg-gold/5 shadow-sm'
                  : 'border-charcoal/10 bg-white/40 hover:border-charcoal/20'
              }`}
            >
              <span className="font-heading text-sm text-charcoal block">{lam.type}</span>
              <span className="text-[10px] text-charcoal/50">{lam.finish}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
