import { MapPin, Phone, ChevronUp } from 'lucide-react'
import Logo from './ui/Logo'

const quickLinks = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const products = [
  { label: 'Plywood', href: '#gallery' },
  { label: 'Laminates', href: '#gallery' },
  { label: 'Hardware', href: '#gallery' },
  { label: 'Adhesives', href: '#gallery' },
  { label: 'Edge Banding', href: '#gallery' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="footer" className="bg-walnut text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Brand */}
          <div>
            <div className="mb-3">
              <Logo size="lg" variant="light" withText />
            </div>
            <p className="text-warm-gray-light text-sm leading-relaxed mb-5">
              Anantapur's trusted destination for premium plywood, laminates,
              hardware, and everything you need to build beautiful interiors.
            </p>
            <div className="flex items-center gap-2 text-warm-gray-light text-sm">
              <MapPin size={16} className="text-gold flex-shrink-0" />
              <span>Srinivas Nagar, Anantapur, AP 515001</span>
            </div>
            <div className="flex items-center gap-2 text-warm-gray-light text-sm mt-2">
              <Phone size={16} className="text-gold flex-shrink-0" />
              <span>+91 96525 15211</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-cream mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-warm-gray-light text-sm hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h4 className="font-heading text-lg text-cream mb-5">Products</h4>
            <ul className="space-y-2.5">
              {products.map((product) => (
                <li key={product.label}>
                  <a
                    href={product.href}
                    className="text-warm-gray-light text-sm hover:text-gold transition-colors duration-200"
                  >
                    {product.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-warm-gray-light text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Sri Konark Plywood &amp; Hardware. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-warm-gray-light hover:text-gold text-sm transition-colors duration-200 cursor-pointer"
            aria-label="Back to top"
          >
            <ChevronUp size={16} />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  )
}
