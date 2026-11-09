import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HingeSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Mounting plate */}
        <rect x="18" y="58" width="52" height="84" rx="4"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        {/* Screw holes */}
        <circle cx="35" cy="76" r="3.5" fill="#666" stroke="#555" strokeWidth="0.8" />
        <circle cx="55" cy="76" r="3.5" fill="#666" stroke="#555" strokeWidth="0.8" />
        <circle cx="35" cy="122" r="3.5" fill="#666" stroke="#555" strokeWidth="0.8" />
        <circle cx="55" cy="122" r="3.5" fill="#666" stroke="#555" strokeWidth="0.8" />
        {/* Screw highlights */}
        <circle cx="34" cy="75" r="1.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="54" cy="75" r="1.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="34" cy="121" r="1.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="54" cy="121" r="1.5" fill="rgba(255,255,255,0.35)" />

        {/* Pivot cylinder */}
        <circle cx="80" cy="100" r="14" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.5"
          filter={`url(#${filterId})`}
        />
        <circle cx="80" cy="100" r="6" fill="#777" stroke="#666" strokeWidth="1" />
        <circle cx="78" cy="97" r="3" fill="rgba(255,255,255,0.25)" />

        {/* Arm */}
        <rect x="94" y="84" width="74" height="32" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        {/* Arm grooves */}
        <line x1="94" y1="92" x2="168" y2="92" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <line x1="94" y1="108" x2="168" y2="108" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        {/* Arm highlight */}
        <rect x="96" y="86" width="70" height="3" rx="1" fill="rgba(255,255,255,0.18)" />

        {/* Adjustment screws on arm */}
        <circle cx="112" cy="100" r="3" fill="#999" stroke="#777" strokeWidth="0.8" />
        <circle cx="133" cy="100" r="3" fill="#999" stroke="#777" strokeWidth="0.8" />
        <circle cx="154" cy="100" r="3" fill="#999" stroke="#777" strokeWidth="0.8" />
        {/* Cross slots */}
        <line x1="110" y1="100" x2="114" y2="100" stroke="#666" strokeWidth="0.6" />
        <line x1="112" y1="98" x2="112" y2="102" stroke="#666" strokeWidth="0.6" />
        <line x1="131" y1="100" x2="135" y2="100" stroke="#666" strokeWidth="0.6" />
        <line x1="133" y1="98" x2="133" y2="102" stroke="#666" strokeWidth="0.6" />
        <line x1="152" y1="100" x2="156" y2="100" stroke="#666" strokeWidth="0.6" />
        <line x1="154" y1="98" x2="154" y2="102" stroke="#666" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

function DrawerSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Outer rail */}
        <rect x="15" y="68" width="170" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="17" y="70" width="166" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Inner rail */}
        <rect x="15" y="118" width="170" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="17" y="120" width="166" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Ball bearings */}
        {[42, 72, 100, 128, 158].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="100" r="6" fill="#B0B0B0" stroke="#888" strokeWidth="0.8" />
            <circle cx={cx - 1.5} cy={98.5} r="2.5" fill="rgba(255,255,255,0.35)" />
            <circle cx={cx + 1} cy={101.5} r="1" fill="rgba(0,0,0,0.15)" />
          </g>
        ))}

        {/* Guide channels */}
        <line x1="20" y1="82" x2="180" y2="82" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
        <line x1="20" y1="118" x2="180" y2="118" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />

        {/* Mounting holes */}
        <circle cx="30" cy="75" r="2.5" fill="#777" stroke="#666" strokeWidth="0.5" />
        <circle cx="170" cy="75" r="2.5" fill="#777" stroke="#666" strokeWidth="0.5" />
        <circle cx="30" cy="125" r="2.5" fill="#777" stroke="#666" strokeWidth="0.5" />
        <circle cx="170" cy="125" r="2.5" fill="#777" stroke="#666" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

function CarouselSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="65" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" />
        <circle cx="100" cy="100" r="69" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="100" cy="100" r="61" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

        {/* Center hub */}
        <circle cx="100" cy="100" r="14" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <circle cx="100" cy="100" r="5" fill="#666" stroke="#555" strokeWidth="1" />
        <circle cx="98" cy="97" r="3" fill="rgba(255,255,255,0.3)" />

        {/* Shelf arms */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 18 * Math.cos(rad);
          const y1 = 100 + 18 * Math.sin(rad);
          const x2 = 100 + 55 * Math.cos(rad);
          const y2 = 100 + 55 * Math.sin(rad);
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`url(#${gradientId})`} strokeWidth="5"
              filter={`url(#${filterId})`}
            />
          );
        })}

        {/* Shelf trays */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 42 * Math.cos(rad);
          const cy = 100 + 42 * Math.sin(rad);
          return (
            <g key={angle}>
              <ellipse cx={cx} cy={cy} rx="16" ry="8"
                fill={`url(#${gradientId})`} stroke="#888" strokeWidth="0.8"
                filter={`url(#${filterId})`}
              />
              <ellipse cx={cx - 1} cy={cy - 1} rx="8" ry="3"
                fill="rgba(255,255,255,0.15)"
              />
            </g>
          );
        })}

        {/* Rotation arrow */}
        <path d="M 120 82 A 25 25 0 0 1 118 120" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="4 2" />
        <polygon points="115,120 121,122 119,115" fill="#C9A84C" />
      </g>
    </svg>
  );
}

function BasketSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Basket frame */}
        <rect x="35" y="55" width="130" height="90" rx="5"
          fill="none" stroke={`url(#${gradientId})`} strokeWidth="3"
          filter={`url(#${filterId})`}
        />
        {/* Horizontal wires */}
        {[75, 95, 115, 135].map((y) => (
          <line key={y} x1="35" y1={y} x2="165" y2={y}
            stroke={`url(#${gradientId})`} strokeWidth="1.5"
          />
        ))}
        {/* Vertical wires */}
        {[55, 75, 95, 115, 135, 155].map((x) => (
          <line key={x} x1={x} y1="55" x2={x} y2="145"
            stroke={`url(#${gradientId})`} strokeWidth="1.5"
          />
        ))}
        {/* Wire crossing highlights */}
        {[75, 95, 115, 135].map((y) =>
          [55, 75, 95, 115, 135, 155].map((x) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5"
              fill="rgba(255,255,255,0.3)"
            />
          ))
        )}
        {/* Handle */}
        <path d="M 45 50 L 45 42 L 155 42 L 155 50"
          fill="none" stroke={`url(#${gradientId})`} strokeWidth="3"
          filter={`url(#${filterId})`}
        />
        <rect x="47" y="43" width="106" height="2" fill="rgba(255,255,255,0.2)" rx="1" />
      </g>
    </svg>
  );
}

function PulloutSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Cabinet body */}
        <rect x="60" y="25" width="80" height="150" rx="4"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.5"
          filter={`url(#${filterId})`}
          opacity="0.4"
        />
        {/* Pull-out shelf */}
        <rect x="55" y="65" width="90" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="57" y="67" width="86" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="55" y="105" width="90" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="57" y="107" width="86" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Handle */}
        <rect x="88" y="82" width="24" height="18" rx="4"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1"
          filter={`url(#${filterId})`}
        />
        <rect x="90" y="84" width="20" height="2" rx="1" fill="rgba(255,255,255,0.25)" />

        {/* Pull-out arrow */}
        <line x1="100" y1="140" x2="100" y2="165" stroke="#C9A84C" strokeWidth="1.5" />
        <polygon points="94,160 100,170 106,160" fill="#C9A84C" />

        {/* Rail tracks on sides */}
        <line x1="60" y1="68" x2="60" y2="115" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <line x1="140" y1="68" x2="140" y2="115" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      </g>
    </svg>
  );
}

function LiftSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Cabinet panel */}
        <rect x="45" y="75" width="110" height="65" rx="4"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.5"
          filter={`url(#${filterId})`}
          opacity="0.5"
        />

        {/* Gas strut cylinder */}
        <rect x="70" y="45" width="12" height="45" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1"
          filter={`url(#${filterId})`}
        />
        <rect x="72" y="47" width="3" height="40" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Gas strut piston */}
        <rect x="73" y="20" width="6" height="30" rx="2"
          fill="#999" stroke="#777" strokeWidth="0.8"
        />
        <rect x="74" y="22" width="2" height="26" rx="1" fill="rgba(255,255,255,0.3)" />

        {/* Lift arm */}
        <path d="M 82 70 L 100 45 L 118 70"
          fill="none" stroke={`url(#${gradientId})`} strokeWidth="4"
          filter={`url(#${filterId})`}
        />

        {/* Pivot points */}
        <circle cx="82" cy="70" r="4" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1" />
        <circle cx="100" cy="45" r="4" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1" />
        <circle cx="118" cy="70" r="4" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1" />
        <circle cx="81" cy="69" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="99" cy="44" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="117" cy="69" r="1.5" fill="rgba(255,255,255,0.3)" />

        {/* Up arrow */}
        <line x1="155" y1="60" x2="155" y2="30" stroke="#C9A84C" strokeWidth="1.5" />
        <polygon points="149,35 155,22 161,35" fill="#C9A84C" />

        {/* Handle */}
        <rect x="80" y="100" width="40" height="8" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

function TrackSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Upper track */}
        <rect x="12" y="80" width="176" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="14" y="82" width="172" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Lower track */}
        <rect x="12" y="106" width="176" height="14" rx="3"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="14" y="108" width="172" height="2.5" rx="1" fill="rgba(255,255,255,0.2)" />

        {/* Rollers */}
        {[55, 100, 145].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="100" r="8" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1"
              filter={`url(#${filterId})`}
            />
            <circle cx={cx} cy="100" r="3" fill="#666" stroke="#555" strokeWidth="0.8" />
            <circle cx={cx - 2} cy={98} r="2.5" fill="rgba(255,255,255,0.3)" />
          </g>
        ))}

        {/* Track groove */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" strokeDasharray="3 2" />

        {/* Slide direction arrow */}
        <line x1="40" y1="135" x2="160" y2="135" stroke="#C9A84C" strokeWidth="1" />
        <polygon points="155,131 165,135 155,139" fill="#C9A84C" />
        <polygon points="45,131 35,135 45,139" fill="#C9A84C" />
      </g>
    </svg>
  );
}

function ShelfSVG({ filterId, gradientId }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Pin shaft */}
        <rect x="88" y="45" width="24" height="55" rx="4"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <rect x="90" y="47" width="5" height="50" rx="2" fill="rgba(255,255,255,0.15)" />

        {/* Pin head */}
        <circle cx="100" cy="42" r="10" fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.2"
          filter={`url(#${filterId})`}
        />
        <circle cx="98" cy="39" r="4" fill="rgba(255,255,255,0.25)" />

        {/* Flange / support plate */}
        <ellipse cx="100" cy="100" rx="22" ry="7"
          fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1"
          filter={`url(#${filterId})`}
        />
        <ellipse cx="99" cy="99" rx="12" ry="3" fill="rgba(255,255,255,0.15)" />

        {/* Shelf line (dashed) */}
        <line x1="40" y1="108" x2="160" y2="108" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 3" />
        <rect x="40" y="108" width="120" height="4" rx="1" fill="rgba(201,168,76,0.15)" />
      </g>
    </svg>
  );
}

function GearSVG({ filterId, gradientId }) {
  const teeth = 10;
  const innerR = 34;
  const toothH = 12;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
    const p1 = [100 + innerR * Math.cos(a1), 100 + innerR * Math.sin(a1)];
    const p2 = [100 + (innerR + toothH) * Math.cos(a2), 100 + (innerR + toothH) * Math.sin(a2)];
    const p3 = [100 + (innerR + toothH) * Math.cos(a3), 100 + (innerR + toothH) * Math.sin(a3)];
    const p4 = [100 + innerR * Math.cos(a4), 100 + innerR * Math.sin(a4)];
    d += `${i === 0 ? 'M' : 'L'} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L ${p3[0].toFixed(1)} ${p3[1].toFixed(1)} L ${p4[0].toFixed(1)} ${p4[1].toFixed(1)} `;
  }
  d += 'Z';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d={d} fill={`url(#${gradientId})`} stroke="#888" strokeWidth="1.5"
          filter={`url(#${filterId})`}
        />
        <circle cx="100" cy="100" r="14" fill="#999" stroke="#777" strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill="#666" stroke="#555" strokeWidth="1" />
        <circle cx="97" cy="97" r="4" fill="rgba(255,255,255,0.25)" />
      </g>
    </svg>
  );
}

const SVG_MAP = {
  hinge: HingeSVG,
  drawer: DrawerSVG,
  carousel: CarouselSVG,
  basket: BasketSVG,
  pullout: PulloutSVG,
  lift: LiftSVG,
  track: TrackSVG,
  shelf: ShelfSVG,
};

export default function ExplodedHardware({ hardware = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const uid = useId();

  if (!hardware.length) return null;

  const active = hardware[activeIndex];
  const SvgComponent = SVG_MAP[active.type] || GearSVG;
  const gradientId = `${uid}-chrome`;
  const filterId = `${uid}-metal-shadow`;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-walnut/10">
      <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1 text-center">
        Hardware
      </p>

      <AnimatePresence mode="wait">
        <motion.h3
          key={activeIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="font-heading text-xl text-charcoal mb-4 text-center"
        >
          {active.name}
        </motion.h3>
      </AnimatePresence>

      <div className="flex justify-center mb-4">
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="20%" stopColor="#C8C8C8" />
              <stop offset="40%" stopColor="#F0F0F0" />
              <stop offset="55%" stopColor="#B0B0B0" />
              <stop offset="75%" stopColor="#E0E0E0" />
              <stop offset="100%" stopColor="#C0C0C0" />
            </linearGradient>
            <filter id={filterId} x="-5%" y="-5%" width="115%" height="115%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.type + activeIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[260px] aspect-square"
          >
            <SvgComponent filterId={filterId} gradientId={gradientId} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {hardware.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer ${
              i === activeIndex
                ? 'bg-gold text-white font-semibold'
                : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="text-center space-y-1.5">
        <span className="inline-block px-3 py-1 text-xs rounded-full border border-charcoal/15 text-charcoal/70">
          {active.spec}
        </span>
        <p className="text-charcoal/50 text-xs">{active.feature}</p>
      </div>
    </div>
  );
}
