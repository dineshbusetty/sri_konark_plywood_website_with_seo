import { motion } from 'framer-motion'
import { Calendar, Package, Award, Users } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'

const highlights = [
  {
    icon: Calendar,
    stat: 'Est. 2015',
    label: 'Serving Anantapur',
  },
  {
    icon: Package,
    stat: '500+',
    label: 'Products Available',
  },
  {
    icon: Award,
    stat: '10+',
    label: 'Trusted Brands',
  },
  {
    icon: Users,
    stat: '1000+',
    label: 'Happy Customers',
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="About Sri Konark"
          subtitle="Our Story"
          light
        />

        <div className="space-y-6 text-cream/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            Established in <strong className="text-gold">2015</strong>, Sri Konark Plywood & Hardware
            has grown to become Anantapur's most trusted destination for premium building and interior
            materials. Located near RTC Bus Stand in Srinivas Nagar, we are a one-stop shop for
            homeowners, builders, carpenters, and interior designers across Andhra Pradesh.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We deal in all kinds of plywood — Marine Plywood, BWP, BWR, MR Grade, Gurjan, and
            Commercial Plywood — along with Block Boards, Flush Doors, WPC Door Frames, and
            Decorative Laminates from brands like Greenlam and Sunmica. Our adhesive range includes
            Fevicol, Jivanjor PVC Xtra, Jivanjor Lamino, and Araldite Epoxy for every bonding need.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We collaborate with all leading hardware brands — Hettich, Ebco, and Hafele — offering
            soft-close hinges, drawer channels, kitchen baskets, telescopic channels, modular kitchen
            fittings, wardrobe accessories, and cabinet handles. Whether you are building a modular
            kitchen, designing a bedroom wardrobe, or renovating your entire home, we provide expert
            guidance and the best materials under one roof.
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-200 font-medium tracking-wide"
          >
            View Our Gallery &rarr;
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-gold/10 bg-white/[0.03]"
            >
              <item.icon size={28} className="text-gold mb-3" strokeWidth={1.5} />
              <span className="text-2xl md:text-3xl font-heading font-bold text-cream">
                {item.stat}
              </span>
              <span className="text-sm text-cream/50 mt-1 tracking-wide">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
