import { useId } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

function AdhesiveTube({ color, letter, uid }) {
  return (
    <motion.svg
      width="70"
      height="100"
      viewBox="0 0 70 100"
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      whileHover={{ y: -4, scale: 1.05 }}
      viewport={{ once: true }}
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="30%" stopColor={color} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${uid}-cap`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#888" />
          <stop offset="30%" stopColor="#DDD" />
          <stop offset="50%" stopColor="#FFF" />
          <stop offset="70%" stopColor="#DDD" />
          <stop offset="100%" stopColor="#999" />
        </linearGradient>
        <linearGradient id={`${uid}-nozzle`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#AAA" />
          <stop offset="40%" stopColor="#E8E8E8" />
          <stop offset="60%" stopColor="#E8E8E8" />
          <stop offset="100%" stopColor="#AAA" />
        </linearGradient>
        <filter id={`${uid}-shadow`}>
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      <g filter={`url(#${uid}-shadow)`}>
        {/* Tube body */}
        <rect x="10" y="24" width="50" height="58" rx="5" fill={`url(#${uid}-body)`} />
        {/* Body highlight stripe */}
        <rect x="18" y="24" width="8" height="58" rx="2" fill="rgba(255,255,255,0.15)" />
        {/* Bottom crimp */}
        <rect x="12" y="76" width="46" height="6" rx="2" fill={color} opacity="0.6" />
        <line x1="14" y1="79" x2="56" y2="79" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

        {/* Cap */}
        <rect x="18" y="8" width="34" height="20" rx="4" fill={`url(#${uid}-cap)`} />
        {/* Nozzle */}
        <rect x="24" y="2" width="22" height="10" rx="3" fill={`url(#${uid}-nozzle)`} />
        {/* Nozzle top ring */}
        <rect x="26" y="1" width="18" height="3" rx="1.5" fill="#CCC" />

        {/* Label area */}
        <rect x="16" y="36" width="38" height="24" rx="3" fill="white" opacity="0.92" />
        <text
          x="35"
          y="53"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
          fill={color}
        >
          {letter}
        </text>
      </g>
    </motion.svg>
  );
}

function WaterIndicator({ waterproof }) {
  if (waterproof) {
    return (
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <Droplets key={i} size={12} className="text-[#1565C0] fill-[#1565C0]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Droplets size={12} className="text-warm-gray fill-warm-gray" />
      <span className="text-warm-gray text-[10px]">Indoor Use</span>
    </div>
  );
}

function AdhesiveCard({ adhesive, index }) {
  const uid = useId();

  return (
    <motion.div
      className="flex flex-col items-center min-w-[120px] gap-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <AdhesiveTube color={adhesive.color} letter={adhesive.name.charAt(0)} uid={uid} />

      <h4 className="font-heading text-sm font-semibold text-charcoal text-center">
        {adhesive.name}
      </h4>

      <p className="text-warm-gray text-xs text-center leading-tight">
        {adhesive.usage}
      </p>

      <WaterIndicator waterproof={adhesive.waterproof} />

      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
          adhesive.waterproof
            ? 'bg-green-100 text-green-700'
            : 'bg-warm-gray/15 text-warm-gray'
        }`}
      >
        {adhesive.waterproof ? 'Waterproof' : 'Standard'}
      </span>
    </motion.div>
  );
}

export default function AdhesiveShowcase({ adhesives = [] }) {
  if (!adhesives.length) return null;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-walnut/10">
      <div className="text-center mb-5">
        <p className="text-gold text-xs uppercase tracking-widest font-medium mb-1">
          Adhesives
        </p>
        <h3 className="font-heading text-lg text-charcoal">Bonding Solutions</h3>
      </div>

      <div
        className={`flex flex-wrap gap-4 ${
          adhesives.length === 1 ? 'justify-center' : 'justify-evenly'
        }`}
      >
        {adhesives.map((adhesive, index) => (
          <AdhesiveCard key={adhesive.name} adhesive={adhesive} index={index} />
        ))}
      </div>
    </div>
  );
}
