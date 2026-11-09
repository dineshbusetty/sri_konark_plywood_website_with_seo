import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageCircle, ChevronRight, X } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import { galleryItems, categories } from '../data/gallery'
import { scrollToHash } from '../lib/scroll'
import { cn } from '../lib/utils'

function FilterTabs({ active, onChange }) {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex items-center gap-1 rounded-full border border-walnut/10 bg-white/60 p-1.5 backdrop-blur-sm">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={cn(
              'relative px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-colors duration-300',
              active === cat.key
                ? 'text-cream'
                : 'text-walnut/60 hover:text-walnut'
            )}
          >
            {active === cat.key && (
              <motion.span
                layoutId="gallery-filter-pill"
                className="absolute inset-0 rounded-full bg-charcoal"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function GalleryCard({ item, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="gallery-card group cursor-pointer break-inside-avoid mb-4"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.title}`}
      onClick={() => onClick(item)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(item); } }}
    >
      <div className="relative overflow-hidden rounded-xl">
        <motion.img
          src={item.image}
          alt={`${item.title} — ${item.tags?.slice(0, 3).join(', ')} in Anantapur`}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium tracking-wider uppercase rounded-full bg-[#e2b04a]/90 text-[#141414] mb-2">
            {item.category}
          </span>
          <h3 className="text-cream font-heading text-lg leading-snug">
            {item.title}
          </h3>
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRight size={16} className="text-cream" />
        </div>
      </div>
    </motion.div>
  )
}

function GalleryDetail({ item, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      id="gallery-detail"
      className="relative overflow-hidden rounded-2xl border border-walnut/8 bg-white/80 backdrop-blur-sm shadow-xl mt-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-charcoal/80 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-charcoal transition-colors duration-200"
        aria-label="Close detail view"
      >
        <X size={18} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 sm:h-80 lg:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
        </div>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <span className="inline-block w-fit px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-[#e2b04a]/15 text-[#A68B3C] mb-4">
            {item.category}
          </span>

          <h3 className="font-heading text-2xl sm:text-3xl text-walnut mb-3">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mb-5">
            <span className="block h-[2px] w-10 rounded-full bg-gold" />
            <span className="block h-[2px] w-6 rounded-full bg-gold/40" />
          </div>

          <p className="text-warm-gray text-base leading-relaxed mb-6">
            {item.description}
          </p>

          {item.details && Object.keys(item.details).length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Object.entries(item.details).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg bg-cream-dark/60 border border-walnut/5 px-3 py-2.5"
                >
                  <p className="text-[10px] font-medium tracking-wider uppercase text-warm-gray mb-0.5">
                    {key}
                  </p>
                  <p className="text-sm font-medium text-walnut">{value}</p>
                </div>
              ))}
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-full bg-walnut/5 text-warm-gray"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.relatedImages && item.relatedImages.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium tracking-wider uppercase text-warm-gray mb-3">
                More Photos
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {item.relatedImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${item.title} ${i + 1}`}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-walnut/8"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a
              href="https://wa.me/+919652515211"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#e2b04a] hover:bg-[#c99a3a] text-[#141414] font-semibold px-5 py-3 rounded-xl transition-colors duration-300 text-sm"
            >
              <MessageCircle size={16} />
              Enquire on WhatsApp
            </a>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 bg-walnut/5 hover:bg-walnut/10 text-walnut font-medium px-5 py-3 rounded-xl transition-colors duration-300 text-sm"
            >
              <ArrowLeft size={16} />
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const detailRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    function handleHeroSelect(e) {
      const item = galleryItems.find((g) => g.id === e.detail.id)
      if (!item) return
      setFilter('all')
      setSelected(item)
      setTimeout(() => {
        const el = document.getElementById('gallery-detail')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    window.addEventListener('gallery:select', handleHeroSelect)
    return () => window.removeEventListener('gallery:select', handleHeroSelect)
  }, [])

  const filtered =
    filter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter)

  const handleSelect = useCallback((item) => {
    setSelected(item)
    setTimeout(() => {
      const el = document.getElementById('gallery-detail')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])

  const handleBack = useCallback(() => {
    setSelected(null)
    setTimeout(() => {
      scrollToHash('#gallery')
    }, 50)
  }, [])

  return (
    <section id="gallery" className="py-20 md:py-28 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Our Gallery"
          subtitle="Explore Our Work"
        />

        <FilterTabs active={filter} onChange={setFilter} />

        <div
          ref={galleryRef}
          className="gallery-masonry"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={handleSelect}
              />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <GalleryDetail
              key={selected.id}
              item={selected}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
