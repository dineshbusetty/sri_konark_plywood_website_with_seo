import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { startScroll } from './lib/scroll'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ui/ScrollProgress'
import ScrollMorphHero from './components/ui/scroll-morph-hero'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import TangleFooter from './components/ui/tangle-footer'
import './App.css'

function App() {
  useEffect(() => startScroll(false), [])

  return (
    <>
      <Helmet>
        <title>
          Sri Konark Plywood &amp; Hardware | Best Plywood Shop in Anantapur, AP
        </title>
        <meta
          name="description"
          content="Sri Konark Plywood & Hardware — premium plywood, laminates, hardware & adhesives in Anantapur, AP. Marine plywood, modular kitchen solutions & expert guidance."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Sri Konark Plywood & Hardware | Best Plywood Shop in Anantapur"
        />
        <meta
          property="og:description"
          content="Walk Through Quality — Every Room, Every Surface, Every Detail. Premium plywood, laminates & hardware in Anantapur, AP."
        />
        <meta property="og:locale" content="en_IN" />
        <meta
          property="og:site_name"
          content="Sri Konark Plywood & Hardware"
        />
        <meta property="og:url" content="https://srikonarkplywood.com/" />
        <meta property="og:image" content="https://srikonarkplywood.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sri Konark Plywood & Hardware | Anantapur" />
        <meta name="twitter:description" content="Premium plywood, laminates, hardware & adhesives — everything under one roof in Anantapur, AP." />
        <meta name="twitter:image" content="https://srikonarkplywood.com/og-image.png" />

        {/* Geo Tags */}
        <meta name="geo.region" content="IN-AP" />
        <meta name="geo.placename" content="Anantapur" />
        <meta name="geo.position" content="14.6819;77.6006" />
        <meta name="ICBM" content="14.6819, 77.6006" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'HardwareStore'],
            name: 'Sri Konark Plywood & Hardware',
            description:
              'Premium plywood, laminates, veneers, hardware fittings, adhesives, flush doors, and modular kitchen solutions in Anantapur, Andhra Pradesh. Trusted by builders, carpenters, and homeowners for years.',
            '@id': 'https://srikonarkplywood.com/#business',
            url: 'https://srikonarkplywood.com',
            foundingDate: '2015',
            logo: 'https://srikonarkplywood.com/logo.svg',
            image: 'https://srikonarkplywood.com/logo.svg',
            telephone: '+91-9652515211',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '13/3/379/21, Sri K M Saifullah Over Brg, Srinivas Nagar',
              addressLocality: 'Anantapur',
              addressRegion: 'Andhra Pradesh',
              postalCode: '515001',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 14.6819,
              longitude: 77.6006,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '20:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '10:00',
                closes: '14:00',
              },
            ],
            areaServed: {
              '@type': 'City',
              name: 'Anantapur',
              containedInPlace: {
                '@type': 'AdministrativeArea',
                name: 'Andhra Pradesh',
              },
            },
            priceRange: '$$',
            hasMap: 'https://maps.google.com/maps?q=Sri+Konark+Plywood+Hardware+Anantapur',
            knowsAbout: [
              'Marine Plywood',
              'BWP Plywood',
              'BWR Plywood',
              'MR Plywood',
              'Gurjan Plywood',
              'Hardwood Plywood',
              'Commercial Plywood',
              'Block Board',
              'Flush Doors',
              'WPC Door Frames',
              'Decorative Laminates',
              'HPL Laminates',
              'Sunmica',
              'Acrylic Laminates',
              'Veneer Sheets',
              'Edge Banding Tape',
              'MFC Boards',
              'Particle Boards',
              'Rubber Wood',
              'Modular Kitchen Hardware',
              'Hettich Hardware',
              'Ebco Fittings',
              'Soft-Close Hinges',
              'Drawer Channels',
              'Kitchen Baskets',
              'Cabinet Handles',
              'Wardrobe Fittings',
              'Jivanjor Adhesives',
              'Fevicol Adhesives',
              'Araldite Epoxy',
              'Silicone Sealants',
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Sri Konark Plywood & Hardware',
            url: 'https://srikonarkplywood.com',
            publisher: {
              '@id': 'https://srikonarkplywood.com/#business',
            },
          })}
        </script>
      </Helmet>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#C9A84C] focus:text-[#1A1A1A] focus:px-4 focus:py-2 focus:rounded focus:font-semibold">
        Skip to main content
      </a>
      <div className="grain-overlay" />
      <Navbar />
      <ScrollProgress />
      <main id="main-content">
        <div id="top" className="h-screen">
          <ScrollMorphHero />
        </div>

        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <TangleFooter />
    </>
  )
}

export default App
