import { motion } from 'framer-motion'
import { Droplets, Shield, Home, IndianRupee, ChevronRight, Bath, CookingPot, Sofa, BedDouble, BookOpen } from 'lucide-react'

const grades = [
  {
    name: 'MR',
    fullForm: 'Moisture Resistant',
    standard: 'IS 303',
    resin: 'UF Resin',
    waterLevel: 1,
    rooms: ['Living Room', 'Bedroom', 'Study', 'Pooja Room'],
    priceTier: 1,
    description: 'Suitable for dry interior applications where moisture exposure is minimal. The most budget-friendly option for general furniture.',
    color: 'bg-emerald-50',
    borderColor: 'border-gold',
  },
  {
    name: 'BWR',
    fullForm: 'Boiling Water Resistant',
    standard: 'IS 303 BWR',
    resin: 'PF Resin',
    waterLevel: 2,
    rooms: ['Kitchen Wall Cabinets', 'Humid Bedrooms', 'Dining Area'],
    priceTier: 2,
    description: 'Handles moderate humidity and occasional water exposure. Ideal for kitchen wall units and areas with seasonal humidity.',
    color: 'bg-blue-50',
    borderColor: 'border-gold',
  },
  {
    name: 'BWP',
    fullForm: 'Boiling Water Proof',
    standard: 'IS 710',
    resin: 'High-Quality PF Resin',
    waterLevel: 3,
    rooms: ['Kitchen Base', 'Bathroom', 'Outdoor', 'Balcony'],
    priceTier: 3,
    description: 'Fully waterproof plywood for areas with constant water contact. The premium choice for wet areas and outdoor applications.',
    color: 'bg-amber-50',
    borderColor: 'border-gold',
  },
  {
    name: 'HMR',
    fullForm: 'High Moisture Resistant',
    standard: 'Treated MDF/Particle',
    resin: 'Special Treatment',
    waterLevel: 2,
    rooms: ['Modular Kitchen Shutters', 'Wardrobe Carcasses', 'Office Furniture'],
    priceTier: 1.5,
    description: 'Treated MDF or particle board with better moisture resistance than standard MR. Great for modular furniture components.',
    color: 'bg-violet-50',
    borderColor: 'border-gold',
  },
]

const decisionGuide = [
  { question: 'Wet area (bathroom, balcony)?', answer: 'BWP', icon: Bath },
  { question: 'Kitchen wall cabinets?', answer: 'BWR minimum', icon: CookingPot },
  { question: 'Dry interior (living, bedroom)?', answer: 'MR is fine', icon: Sofa },
  { question: 'Humid city / coastal area?', answer: 'BWR for everything', icon: Droplets },
]

function WaterDrops({ level }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <Droplets
          key={i}
          size={18}
          className={i <= level ? 'text-blue-500' : 'text-gray-200'}
          fill={i <= level ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

function PriceTier({ tier }) {
  const full = Math.floor(tier)
  const half = tier % 1 !== 0
  return (
    <div className="flex items-center gap-0.5 text-gold-dark font-semibold">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className="text-lg">&#8377;</span>
      ))}
      {half && <span className="text-lg opacity-50">&#8377;</span>}
      {Array.from({ length: 3 - Math.ceil(tier) }).map((_, i) => (
        <span key={`e-${i}`} className="text-lg text-gray-200">&#8377;</span>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function PlywoodGuide() {
  return (
    <section id="plywood-guide" className="py-20 md:py-28 px-6 bg-cream">
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
            Expert Knowledge
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-walnut mb-4">
            Choose the Right Plywood for Every Room
          </h2>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">
            Not all plywood is the same. Understanding grades helps you invest wisely
            and avoid costly replacements.
          </p>
        </motion.div>

        {/* Grade Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {grades.map((grade) => (
            <motion.div
              key={grade.name}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Gold top border */}
              <div className="h-1.5 bg-gold w-full" />

              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-heading text-2xl text-walnut">{grade.name}</h3>
                  <p className="text-warm-gray text-sm">{grade.fullForm}</p>
                </div>

                {/* IS Standard Badge */}
                <div className="inline-flex items-center gap-1.5 bg-walnut/5 border border-walnut/10 rounded-full px-3 py-1 mb-4 w-fit">
                  <Shield size={14} className="text-walnut" />
                  <span className="text-xs font-medium text-walnut">{grade.standard}</span>
                </div>

                {/* Water Resistance */}
                <div className="mb-4">
                  <p className="text-xs text-warm-gray uppercase tracking-wide mb-1">Water Resistance</p>
                  <WaterDrops level={grade.waterLevel} />
                </div>

                {/* Description */}
                <p className="text-sm text-charcoal-light/70 mb-4 leading-relaxed">
                  {grade.description}
                </p>

                {/* Best Rooms */}
                <div className="mb-4 flex-1">
                  <p className="text-xs text-warm-gray uppercase tracking-wide mb-2">Best For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {grade.rooms.map((room) => (
                      <span
                        key={room}
                        className="text-xs bg-cream-dark text-walnut-light px-2.5 py-1 rounded-full"
                      >
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Tier */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-warm-gray uppercase tracking-wide mb-1">Price Range</p>
                  <PriceTier tier={grade.priceTier} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Decision Guide */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl md:text-3xl text-walnut mb-2">
              Quick Decision Guide
            </h3>
            <p className="text-warm-gray">Not sure which grade? Answer one question.</p>
          </div>

          <div className="space-y-4">
            {decisionGuide.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-gold/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center">
                    <Icon size={20} className="text-walnut" />
                  </div>
                  <p className="flex-1 text-charcoal font-medium">{item.question}</p>
                  <ChevronRight size={18} className="text-warm-gray-light flex-shrink-0" />
                  <span className="font-heading text-gold-dark font-semibold text-lg flex-shrink-0 min-w-[100px] text-right">
                    {item.answer}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
