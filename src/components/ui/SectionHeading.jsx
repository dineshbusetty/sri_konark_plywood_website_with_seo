import { motion } from 'framer-motion';

/**
 * Reusable section heading with a decorative gold underline.
 *
 * @param {object}  props
 * @param {string}  props.title    - Main heading text (rendered in Playfair Display)
 * @param {string}  props.subtitle - Supporting line of text
 * @param {boolean} [props.light]  - Pass `true` when used on dark backgrounds
 */
export default function SectionHeading({ title, subtitle, light = false }) {
  return (
    <motion.div
      className="mb-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {subtitle && (
        <p
          className={`mb-3 text-sm font-medium tracking-widest uppercase ${
            light ? 'text-gold-light' : 'text-gold'
          }`}
        >
          {subtitle}
        </p>
      )}

      <h2
        className={`font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${
          light ? 'text-cream' : 'text-walnut'
        }`}
      >
        {title}
      </h2>

      {/* Decorative gold line */}
      <div className="mx-auto mt-5 flex items-center justify-center gap-2">
        <span className="block h-[2px] w-8 rounded-full bg-gold/40" />
        <span className="block h-[3px] w-14 rounded-full bg-gold" />
        <span className="block h-[2px] w-8 rounded-full bg-gold/40" />
      </div>
    </motion.div>
  );
}
