import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

/**
 * Premium product information card with scroll-reveal and hover animation.
 *
 * @param {object}      props
 * @param {string}      props.name        - Product display name
 * @param {string}      props.category    - Plywood | Laminate | Hardware | Adhesive
 * @param {string|null} props.grade       - Grade string (shown as badge when present)
 * @param {string}      props.description - Short product description
 * @param {string}      props.icon        - Lucide icon component name (e.g. "Layers")
 * @param {number}      props.index       - Position index used for stagger delay
 * @param {string}      [props.accentColor] - Hex colour for accent highlights
 */
export default function ProductCard({
  name,
  category,
  grade,
  description,
  icon,
  index = 0,
  accentColor = '#C9A84C',
}) {
  // Dynamically resolve the Lucide icon component
  const IconComponent = LucideIcons[icon] || LucideIcons.Package;

  const categoryColorMap = {
    Plywood: 'bg-walnut/10 text-walnut',
    Laminate: 'bg-gold/10 text-gold-dark',
    Hardware: 'bg-charcoal/10 text-charcoal',
    Adhesive: 'bg-warm-gray/15 text-warm-gray',
  };

  return (
    <motion.div
      className="group relative flex flex-col rounded-xl border border-walnut/8 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-300 hover:border-gold/40"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px ${accentColor}33`,
        transition: { duration: 0.25 },
      }}
    >
      {/* Top row: icon + category tag */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <IconComponent
            size={22}
            style={{ color: accentColor }}
            strokeWidth={1.8}
          />
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
            categoryColorMap[category] || 'bg-charcoal/10 text-charcoal'
          }`}
        >
          {category}
        </span>
      </div>

      {/* Name + grade badge */}
      <h3 className="font-heading text-lg font-semibold text-walnut">
        {name}
      </h3>

      {grade && (
        <span className="mt-1 inline-block w-fit rounded border border-gold/30 bg-gold/8 px-2 py-0.5 text-[11px] font-bold tracking-wide text-gold-dark">
          {grade}
        </span>
      )}

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-warm-gray">
        {description}
      </p>

      {/* Subtle bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-2/3"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
}
