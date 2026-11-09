import { motion } from 'framer-motion'
import { Layers, Palette, Wrench, Droplet, Scissors, DoorOpen } from 'lucide-react'

const categories = [
  {
    name: 'Plywood',
    description: 'All grades from MR to Marine — commercial, waterproof, and fire-retardant options for every application.',
    Icon: Layers,
  },
  {
    name: 'Laminates',
    description: 'HPL, acrylic finishes, decorative veneers, and sunmica in hundreds of textures, colors, and wood grains.',
    Icon: Palette,
  },
  {
    name: 'Hardware',
    description: 'Hinges, channels, baskets, handles, and fittings from Hettich, Ebco, Hafele, and other top brands.',
    Icon: Wrench,
  },
  {
    name: 'Adhesives',
    description: 'Complete Fevicol range, silicone sealants, epoxy solutions, and specialty bonding products.',
    Icon: Droplet,
  },
  {
    name: 'Edge Banding',
    description: 'PVC, ABS, and veneer edge tapes in all colors and widths to give furniture a seamless, finished look.',
    Icon: Scissors,
  },
  {
    name: 'Doors & Panels',
    description: 'Flush doors, block boards, decorative wall panels, and ready-made shutters for quick installations.',
    Icon: DoorOpen,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 md:py-28 px-6 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Our Range
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-cream mb-4">
            Everything You Need Under One Roof
          </h2>
          <p className="text-warm-gray-light text-lg max-w-2xl mx-auto">
            From raw materials to finishing touches, we stock the complete range
            for carpenters, contractors, and homeowners.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {categories.map((category) => {
            const { Icon } = category
            return (
              <motion.div
                key={category.name}
                variants={cardVariants}
                className="group bg-charcoal-light rounded-xl p-8 border border-white/5 hover:border-gold/40 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-walnut/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                  <Icon
                    size={28}
                    className="text-gold group-hover:text-gold-light transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Name */}
                <h3 className="font-heading text-xl text-cream mb-3 group-hover:text-gold-light transition-colors duration-300">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-warm-gray-light text-sm leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
