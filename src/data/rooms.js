const base = import.meta.env.BASE_URL

export const rooms = [
  {
    id: 'living-room',
    image: `${base}rooms/living-room.jpg`,
    name: 'Living Room',
    tagline: 'Where First Impressions Begin',
    description:
      'Your living room deserves furniture that balances beauty with durability. We recommend MR-grade plywood for TV units, display cabinets, and wall paneling — paired with high-pressure and acrylic laminates for a polished, long-lasting finish. Available at Sri Konark Plywood & Hardware, Anantapur.',
    bgGradient:
      'linear-gradient(165deg, #FAF6F0 0%, #F5EDE0 40%, #E8DDD0 100%)',
    accentColor: '#C9A84C',
    plywoodDetails: {
      grade: 'MR',
      fullName: 'Moisture Resistant',
      standard: 'IS 303',
      layers: 5,
      resinType: 'Urea Formaldehyde',
      resinColor: '#DAA520',
      usage: 'TV units, display cabinets, wall paneling, partition walls',
      whyThisGrade:
        'Living rooms are climate-controlled dry interiors. MR-grade plywood provides reliable moisture resistance for everyday humidity while keeping costs practical for large furniture pieces.',
    },
    laminates: [
      { type: 'HPL', thickness: '0.8mm', finish: 'Wood Grain', usage: 'TV unit surfaces & shelves' },
      { type: 'Acrylic', thickness: '1mm', finish: 'High Gloss', usage: 'Display cabinet shutters' },
      { type: 'Decorative Veneer', thickness: '0.5mm', finish: 'Natural Teak', usage: 'Wall paneling & accents' },
    ],
    hardware: [
      { name: 'Soft-Close Hinges', type: 'hinge', spec: '35mm cup, 110°', feature: 'Silent cabinet operation' },
      { name: 'Telescopic Channels', type: 'drawer', spec: 'Full extension, 25kg', feature: 'Smooth drawer glide' },
      { name: 'Push-to-Open', type: 'push', spec: 'Handle-free mechanism', feature: 'Clean minimal look' },
      { name: 'Decorative Handles', type: 'handle', spec: 'Brushed brass finish', feature: 'Premium aesthetics' },
    ],
    adhesives: [
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'HPL & decorative laminate pasting' },
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'Plywood-to-plywood & general woodwork' },
      { name: 'Araldite Standard Epoxy', color: '#FFB300', waterproof: true, usage: 'Metal fittings & handle bonding' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'MR Grade Plywood',
        grade: 'MR (IS 303)',
        description:
          'Moisture-resistant plywood ideal for TV units, display shelves, and wall paneling in climate-controlled interiors.',
        icon: 'Layers',
      },
      {
        category: 'Plywood',
        name: 'Commercial Plywood',
        grade: 'Commercial',
        description:
          'Cost-effective interior-grade plywood for partition walls, false ceilings, and light-duty storage cabinets.',
        icon: 'LayoutGrid',
      },
      {
        category: 'Laminate',
        name: 'HPL Decorative Laminate',
        grade: null,
        description:
          'High-pressure laminates in premium wood grains and solid colours — scratch-resistant and UV-stable for living room surfaces.',
        icon: 'Palette',
      },
      {
        category: 'Laminate',
        name: 'Acrylic Laminate',
        grade: null,
        description:
          'High-gloss acrylic finish sheets for modern TV units and display cabinets that add depth and luxury.',
        icon: 'Sparkles',
      },
      {
        category: 'Hardware',
        name: 'Soft-Close Hinges & Channels',
        grade: null,
        description:
          'Premium soft-close concealed hinges and telescopic drawer channels for silent, smooth cabinet operation.',
        icon: 'Settings2',
      },
      {
        category: 'Adhesive',
        name: 'Jivanjor Allrounder',
        grade: null,
        description:
          'Premium synthetic resin adhesive for interior woodwork — bonds plywood, laminates, and veneers with superior holding strength.',
        icon: 'Droplets',
      },
    ],
  },
  {
    id: 'kitchen',
    image: `${base}rooms/kitchen.jpg`,
    name: 'Kitchen',
    tagline: 'Engineered to Endure Heat, Steam & Spills',
    description:
      'The kitchen is the toughest environment in your home. We mandate BWP (IS 710) plywood for base and sink cabinets exposed to water, and BWR plywood for wall cabinets — because cutting corners here means replacing cabinets in under three years. Trust Sri Konark Plywood & Hardware, Anantapur for your modular kitchen materials.',
    bgGradient:
      'linear-gradient(165deg, #F5F0E8 0%, #EDE5D5 40%, #DDD3C0 100%)',
    accentColor: '#A68B3C',
    plywoodDetails: {
      grade: 'BWP',
      fullName: 'Boiling Water Proof',
      standard: 'IS 710',
      layers: 5,
      resinType: 'Phenol Formaldehyde',
      resinColor: '#1565C0',
      usage: 'Base cabinets, under-sink units, countertop support',
      whyThisGrade:
        'Kitchen base cabinets face constant water splashes from sinks, steam from cooking, and humidity from dishwashing. BWP plywood with phenolic resin bonds survives years of this exposure without delaminating.',
      secondaryGrade: { grade: 'BWR', standard: 'IS 303', usage: 'Wall & upper cabinets' },
    },
    laminates: [
      { type: 'HPL', thickness: '1mm', finish: 'Anti-Fingerprint Matte', usage: 'Cabinet surfaces & worktops' },
      { type: 'Acrylic', thickness: '1mm', finish: 'High Gloss', usage: 'Shutter fronts' },
      { type: 'PVC Edge Band', thickness: '2mm', finish: 'Color-matched', usage: 'All exposed plywood edges' },
    ],
    hardware: [
      { name: 'Soft-Close Hinges', type: 'hinge', spec: '35mm cup, 110°', feature: 'Rust-resistant for kitchen moisture' },
      { name: 'Tandem Box Drawers', type: 'drawer', spec: 'Full extension, 30kg', feature: 'Silent soft-close system' },
      { name: 'Corner Carousel', type: 'carousel', spec: '270° rotation', feature: 'Maximizes dead corner space' },
      { name: 'SS Wire Baskets', type: 'basket', spec: 'Cup & saucer, thali, plain', feature: 'Easy pull-out access' },
      { name: 'Bottle Pull-Out', type: 'pullout', spec: '150mm width', feature: 'Narrow space utilization' },
    ],
    adhesives: [
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'Plywood carcass assembly' },
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'HPL laminate pasting on cabinets' },
      { name: 'Jivanjor PVC Xtra', color: '#7B1FA2', waterproof: true, usage: 'PVC edge band & membrane foil' },
      { name: 'Jivanjor FastX', color: '#E65100', waterproof: false, usage: 'Quick-bond for edge banding & repairs' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'BWP Marine Plywood',
        grade: 'BWP (IS 710)',
        description:
          'Boiling-water-proof plywood — mandatory for base cabinets, sink units, and any surface exposed to water or steam.',
        icon: 'Shield',
      },
      {
        category: 'Plywood',
        name: 'BWR Plywood',
        grade: 'BWR (IS 303)',
        description:
          'Boiling-water-resistant plywood suited for wall-mounted cabinets, overhead shutters, and loft storage in kitchens.',
        icon: 'Layers',
      },
      {
        category: 'Laminate',
        name: 'HPL 1mm Kitchen Laminate',
        grade: null,
        description:
          'Thick 1mm HPL sheets with anti-fingerprint matte and textured finishes — heat-resistant up to 180°C for worktops.',
        icon: 'Flame',
      },
      {
        category: 'Hardware',
        name: 'Tandem Box & Corner Carousel',
        grade: null,
        description:
          'German-engineered tandem box drawers, magic corner carousels, and tall-unit basket systems for maximum storage efficiency.',
        icon: 'Box',
      },
      {
        category: 'Hardware',
        name: 'Aventos Lift Systems',
        grade: null,
        description:
          'Wall cabinet lift-up mechanisms — Aventos HF, HS, and HK series for overhead cabinets that open upward and stay open.',
        icon: 'ArrowUpFromLine',
      },
      {
        category: 'Adhesive',
        name: 'Jivanjor Kitchen Adhesive Kit',
        grade: null,
        description:
          'Jivanjor Allrounder for waterproof plywood bonds, Lamino for HPL pasting, PVC Xtra for edge banding, and FastX for quick fixes.',
        icon: 'Droplets',
      },
    ],
  },
  {
    id: 'bedroom',
    image: `${base}rooms/bedroom.jpg`,
    name: 'Bedroom',
    tagline: 'Crafted for Comfort & Calm',
    description:
      'Bedrooms call for warm finishes and clever storage. MR-grade plywood forms the backbone of wardrobes, bed frames, and dressers, while decorative HPL and natural veneer laminates bring richness without the weight of solid wood. Shop bedroom furniture materials at Sri Konark Plywood & Hardware, Anantapur.',
    bgGradient:
      'linear-gradient(165deg, #F8F4EE 0%, #F0E8DC 40%, #E5D9C8 100%)',
    accentColor: '#8B6F4E',
    plywoodDetails: {
      grade: 'MR',
      fullName: 'Moisture Resistant',
      standard: 'IS 303',
      layers: 5,
      resinType: 'Urea Formaldehyde',
      resinColor: '#DAA520',
      usage: 'Wardrobe carcasses, bed platforms, headboards, dressing tables',
      whyThisGrade:
        'Bedrooms are dry, air-conditioned interiors with minimal water exposure. MR-grade plywood delivers excellent strength and smooth finish for wardrobe and bed construction at an optimal price point.',
    },
    laminates: [
      { type: 'HPL', thickness: '0.8mm', finish: 'Matte Textured', usage: 'Wardrobe shutters' },
      { type: 'Wood-Grain Veneer', thickness: '0.5mm', finish: 'Natural Oak', usage: 'Headboard & dresser panels' },
      { type: 'Soft-Touch', thickness: '0.8mm', finish: 'Suede Matte', usage: 'Premium wardrobe surfaces' },
    ],
    hardware: [
      { name: 'Hydraulic Bed Lift', type: 'lift', spec: 'Gas-spring, 80kg capacity', feature: 'One-hand storage bed operation' },
      { name: 'Sliding Wardrobe Track', type: 'track', spec: 'Aluminium top-hung', feature: 'Space-saving sliding doors' },
      { name: 'Trouser Rack', type: 'pullout', spec: 'Pull-out, 10 arms', feature: 'Organized trouser storage' },
      { name: 'Drawer Slides', type: 'drawer', spec: 'Full extension, soft-close', feature: 'Smooth silent drawers' },
    ],
    adhesives: [
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'HPL & veneer laminate pasting' },
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'Plywood carcass & wardrobe assembly' },
      { name: 'Jivanjor PVC Xtra', color: '#7B1FA2', waterproof: true, usage: 'PVC edge banding & membrane foil' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'MR Grade Plywood',
        grade: 'MR (IS 303)',
        description:
          'Reliable moisture-resistant plywood for wardrobe carcasses, bed platforms, headboards, and dressing tables.',
        icon: 'Layers',
      },
      {
        category: 'Laminate',
        name: 'Decorative HPL Laminate',
        grade: null,
        description:
          'Premium wood-grain and textile-pattern HPL sheets for wardrobe shutters and headboard panels.',
        icon: 'Palette',
      },
      {
        category: 'Laminate',
        name: 'Natural Veneer Laminate',
        grade: null,
        description:
          'Real wood veneer sheets — oak, walnut, and teak — for a natural luxurious finish on bedroom furniture.',
        icon: 'TreeDeciduous',
      },
      {
        category: 'Hardware',
        name: 'Hydraulic Bed Lift Mechanism',
        grade: null,
        description:
          'Gas-spring hydraulic lifts for storage beds — smooth one-hand operation to access under-bed storage.',
        icon: 'ArrowUpFromLine',
      },
      {
        category: 'Hardware',
        name: 'Wardrobe Accessories',
        grade: null,
        description:
          'Trouser pull-outs, tie racks, jewellery trays, and LED wardrobe lights for organized, premium closets.',
        icon: 'Shirt',
      },
      {
        category: 'Hardware',
        name: 'Sliding Wardrobe Track Systems',
        grade: null,
        description:
          'Aluminium top-hung and bottom-rolling sliding door tracks for space-saving wardrobe designs.',
        icon: 'SlidersHorizontal',
      },
    ],
  },
  {
    id: 'bathroom',
    image: `${base}rooms/bathroom.jpg`,
    name: 'Bathroom',
    tagline: 'Waterproof from Core to Surface',
    description:
      'Bathroom furniture lives in constant humidity. Every panel must be BWP (IS 710) — no exceptions. We pair it with marine-grade HPL and PU-coated laminates, and insist on SS 304 stainless steel hardware that will never rust. Get waterproof bathroom solutions at Sri Konark Plywood & Hardware, Anantapur.',
    bgGradient:
      'linear-gradient(165deg, #F0F4F8 0%, #E0E8F0 40%, #CDD8E4 100%)',
    accentColor: '#5B8BA0',
    plywoodDetails: {
      grade: 'BWP',
      fullName: 'Boiling Water Proof',
      standard: 'IS 710',
      layers: 5,
      resinType: 'Phenol Formaldehyde',
      resinColor: '#1565C0',
      usage: 'Vanity units, wall cabinets, storage shelves',
      whyThisGrade:
        'Bathrooms have continuous humidity, water splashes, and steam from hot showers. BWP is the only grade that guarantees zero delamination even with direct and prolonged water contact.',
    },
    laminates: [
      { type: 'Marine HPL', thickness: '1mm', finish: 'Compact Matte', usage: 'Vanity cabinet surfaces' },
      { type: 'PU-Coated', thickness: '0.8mm', finish: 'Water-Repellent Satin', usage: 'Vanity top surfaces' },
    ],
    hardware: [
      { name: 'SS 304 Hinges', type: 'hinge', spec: 'Marine-grade stainless', feature: 'Zero corrosion in steam' },
      { name: 'SS Handles', type: 'handle', spec: 'Tubular SS 304', feature: 'Rust-proof wet handling' },
      { name: 'Magnetic Catches', type: 'push', spec: 'Neodymium, SS housing', feature: 'Secure close without latches' },
      { name: 'Towel Rail Fittings', type: 'shelf', spec: 'Wall-mount SS brackets', feature: 'Heavy-duty towel support' },
    ],
    adhesives: [
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'BWP plywood carcass bonding' },
      { name: 'Jivanjor PVC Xtra', color: '#7B1FA2', waterproof: true, usage: 'PVC edge band & membrane foil' },
      { name: 'Araldite Klear', color: '#FFB300', waterproof: true, usage: 'SS hardware & mirror fixing' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'BWP Marine Plywood',
        grade: 'BWP (IS 710)',
        description:
          'Boiling-water-proof plywood — the only grade permitted for vanity units, wall cabinets, and storage shelves in wet areas.',
        icon: 'Shield',
      },
      {
        category: 'Laminate',
        name: 'Marine-Grade HPL',
        grade: null,
        description:
          'Compact-grade HPL designed for continuous moisture exposure — mould-proof and easy to clean.',
        icon: 'Waves',
      },
      {
        category: 'Laminate',
        name: 'PU-Coated Laminate',
        grade: null,
        description:
          'Polyurethane-coated laminate sheets that repel water and resist staining — ideal for vanity top surfaces.',
        icon: 'Paintbrush',
      },
      {
        category: 'Hardware',
        name: 'SS 304 Stainless Steel Hardware',
        grade: null,
        description:
          'Hinges, handles, towel bars, and shelf brackets in marine-grade SS 304 — zero corrosion even in steam-filled bathrooms.',
        icon: 'Wrench',
      },
      {
        category: 'Adhesive',
        name: 'Waterproof Sealants',
        grade: null,
        description:
          'Silicone and MS-polymer sealants for sealing joints around vanities, mirrors, and plumbing cut-outs.',
        icon: 'Droplets',
      },
      {
        category: 'Adhesive',
        name: 'Waterproof Membrane',
        grade: null,
        description:
          'Liquid-applied waterproofing membrane for cabinet interiors and wall surfaces behind vanity units.',
        icon: 'ShieldCheck',
      },
    ],
  },
  {
    id: 'dining-room',
    image: `${base}rooms/dining-room.jpg`,
    name: 'Dining Room',
    tagline: 'Where Families Gather',
    description:
      'Dining furniture demands sturdy cores and refined surfaces. We use MR or BWR plywood for dining tables, crockery units, and bar cabinets — finished with natural veneers that showcase real wood grain at a fraction of solid-wood cost. Visit Sri Konark Plywood & Hardware, Anantapur for dining room materials.',
    bgGradient:
      'linear-gradient(165deg, #FAF6F0 0%, #F2E8D8 40%, #E6D8C2 100%)',
    accentColor: '#B8860B',
    plywoodDetails: {
      grade: 'MR',
      fullName: 'Moisture Resistant',
      standard: 'IS 303',
      layers: 5,
      resinType: 'Urea Formaldehyde',
      resinColor: '#DAA520',
      usage: 'Dining tables, crockery cabinets, bar units, sideboards',
      whyThisGrade:
        'Dining rooms are dry interiors with occasional spills. MR-grade plywood handles routine moisture while providing the structural strength needed for heavy crockery units and dining table tops.',
      secondaryGrade: { grade: 'BWR', standard: 'IS 303', usage: 'Bar units near wet areas' },
    },
    laminates: [
      { type: 'Natural Veneer', thickness: '0.5mm', finish: 'Teak / Rosewood', usage: 'Dining table & sideboard tops' },
      { type: 'HPL', thickness: '0.8mm', finish: 'Wood Grain', usage: 'Crockery cabinet surfaces' },
      { type: 'High-Gloss', thickness: '1mm', finish: 'Mirror Finish', usage: 'Bar cabinet shutters' },
    ],
    hardware: [
      { name: 'Glass Door Hinges', type: 'hinge', spec: 'Soft-close, satin nickel', feature: 'For glass-front crockery units' },
      { name: 'Shelf Supports', type: 'shelf', spec: 'Adjustable pins, concealed', feature: 'Flexible display shelving' },
      { name: 'Table Levelers', type: 'handle', spec: 'M8 thread, 15mm range', feature: 'Wobble-free dining table' },
      { name: 'Interior LED Lights', type: 'push', spec: 'Warm white, sensor', feature: 'Cabinet display lighting' },
    ],
    adhesives: [
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'Veneer & HPL laminate pasting' },
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'Plywood carcass assembly' },
      { name: 'Araldite Standard Epoxy', color: '#FFB300', waterproof: true, usage: 'Glass-to-wood & metal bonding' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'MR / BWR Plywood',
        grade: 'MR / BWR',
        description:
          'Moisture-resistant or boiling-water-resistant plywood for dining table tops, crockery cabinets, and bar units.',
        icon: 'Layers',
      },
      {
        category: 'Laminate',
        name: 'Natural Wood Veneer',
        grade: null,
        description:
          'Premium teak, oak, and ash veneers for a warm, organic finish on dining tables and sideboards.',
        icon: 'TreeDeciduous',
      },
      {
        category: 'Laminate',
        name: 'High-Gloss Finish Laminate',
        grade: null,
        description:
          'Mirror-finish laminates for crockery unit shutters and bar cabinets that catch and reflect light beautifully.',
        icon: 'Sparkles',
      },
      {
        category: 'Hardware',
        name: 'Glass Door Hinges',
        grade: null,
        description:
          'Speciality hinges for glass-front crockery units — soft-close, fully adjustable, in satin nickel finish.',
        icon: 'DoorOpen',
      },
      {
        category: 'Hardware',
        name: 'Shelf Supports & Brackets',
        grade: null,
        description:
          'Adjustable shelf pins, concealed brackets, and floating shelf hardware for display and storage flexibility.',
        icon: 'AlignVerticalSpaceAround',
      },
    ],
  },
  {
    id: 'study',
    image: `${base}rooms/study.jpg`,
    name: 'Study / Home Office',
    tagline: 'Designed for Focus & Productivity',
    description:
      'A well-organized workspace boosts productivity. MR and commercial plywood provide the structure for study tables, bookshelves, and filing cabinets — topped with matte HPL laminates that reduce glare during long work hours. Find study furniture materials at Sri Konark Plywood & Hardware, Anantapur.',
    bgGradient:
      'linear-gradient(165deg, #F5F3F0 0%, #EBE7E0 40%, #DDD8CE 100%)',
    accentColor: '#6B7B5E',
    plywoodDetails: {
      grade: 'MR',
      fullName: 'Moisture Resistant',
      standard: 'IS 303',
      layers: 5,
      resinType: 'Urea Formaldehyde',
      resinColor: '#DAA520',
      usage: 'Study desks, bookshelves, filing cabinets, workstations',
      whyThisGrade:
        'Study rooms are dry, indoor spaces. MR-grade plywood offers the right balance of durability and cost for desks, bookshelves, and storage units that hold books and electronics.',
    },
    laminates: [
      { type: 'Matte HPL', thickness: '0.8mm', finish: 'Anti-Glare Matte', usage: 'Desk surfaces' },
      { type: 'Anti-Scratch HPL', thickness: '0.8mm', finish: 'Textured Neutral', usage: 'Bookshelf surfaces' },
    ],
    hardware: [
      { name: 'Keyboard Tray Slides', type: 'drawer', spec: 'Ball-bearing, tilt-adjust', feature: 'Ergonomic typing position' },
      { name: 'Cable Grommets', type: 'handle', spec: 'Brushed aluminium, 60mm', feature: 'Clean cable management' },
      { name: 'Adjustable Shelf Pins', type: 'shelf', spec: 'Concealed, 5mm', feature: 'Flexible shelf heights' },
      { name: 'Concealed Brackets', type: 'shelf', spec: 'Heavy-duty floating', feature: 'Clean wall-mount shelves' },
    ],
    adhesives: [
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'HPL laminate pasting on desk surfaces' },
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'All plywood & laminate joints' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'MR / Commercial Plywood',
        grade: 'MR / Commercial',
        description:
          'Interior-grade plywood for study desks, bookshelves, cabinets, and modular workstation setups.',
        icon: 'Layers',
      },
      {
        category: 'Laminate',
        name: 'Matte HPL Laminate',
        grade: null,
        description:
          'Anti-glare matte-finish HPL in neutral tones — easy on the eyes and fingerprint-resistant for desk surfaces.',
        icon: 'Palette',
      },
      {
        category: 'Hardware',
        name: 'Keyboard Tray Slides',
        grade: null,
        description:
          'Ball-bearing keyboard tray slides with smooth pull-out and tilt — ergonomic positioning for long work sessions.',
        icon: 'Keyboard',
      },
      {
        category: 'Hardware',
        name: 'Cable Management Grommets',
        grade: null,
        description:
          'Desk grommets and under-desk cable trays in brushed aluminium — keep power and data cables organized and hidden.',
        icon: 'Cable',
      },
      {
        category: 'Hardware',
        name: 'Soft-Close Drawer Channels',
        grade: null,
        description:
          'Full-extension telescopic channels with integrated soft-close for filing drawers and desk storage.',
        icon: 'Settings2',
      },
    ],
  },
  {
    id: 'pooja-room',
    image: `${base}rooms/pooja-room.jpg`,
    name: 'Pooja Room',
    tagline: 'A Sacred Space, Crafted with Devotion',
    description:
      'The pooja room blends spirituality with craftsmanship. We use MR plywood finished in decorative teak and sandalwood veneers, complemented by CNC-carved jali panels and traditional brass fittings — with integrated warm LED lighting for a serene ambiance. Custom pooja mandir designs at Sri Konark Plywood & Hardware, Anantapur.',
    bgGradient:
      'linear-gradient(165deg, #FDF8F0 0%, #F8EDD8 40%, #F0DFBC 100%)',
    accentColor: '#B8860B',
    plywoodDetails: {
      grade: 'MR',
      fullName: 'Moisture Resistant',
      standard: 'IS 303',
      layers: 5,
      resinType: 'Urea Formaldehyde',
      resinColor: '#DAA520',
      usage: 'Mandir frames, back panels, storage drawers, jali panels',
      whyThisGrade:
        'Pooja rooms are dry indoor spaces with occasional incense smoke and oil lamp residue. MR-grade plywood provides a clean, smooth base for premium veneer finishing and CNC carving.',
    },
    laminates: [
      { type: 'Teak Veneer', thickness: '0.5mm', finish: 'Natural Teak', usage: 'Mandir frame & panels' },
      { type: 'Sandalwood Veneer', thickness: '0.5mm', finish: 'Golden Sandalwood', usage: 'Shutter & back panels' },
      { type: 'Wood-Grain HPL', thickness: '0.8mm', finish: 'Traditional Wood', usage: 'Storage drawer fronts' },
    ],
    hardware: [
      { name: 'Brass Hinges', type: 'hinge', spec: 'Antique brass finish', feature: 'Traditional heritage aesthetic' },
      { name: 'Antique Handles', type: 'handle', spec: 'Hand-cast brass knobs', feature: 'Ornamental temple design' },
      { name: 'Bell Hooks', type: 'shelf', spec: 'Brass, ceiling mount', feature: 'Traditional bell hanging' },
      { name: 'LED Channel Mounts', type: 'push', spec: 'Warm white, recessed', feature: 'Serene ambient lighting' },
    ],
    adhesives: [
      { name: 'Jivanjor Lamino', color: '#1B5E20', waterproof: false, usage: 'Veneer & HPL bonding for mandir panels' },
      { name: 'Jivanjor Allrounder', color: '#C62828', waterproof: false, usage: 'Plywood carcass & frame assembly' },
      { name: 'Jivanjor FastX', color: '#E65100', waterproof: false, usage: 'Quick repairs & small fixture bonding' },
    ],
    products: [
      {
        category: 'Plywood',
        name: 'MR Plywood with Teak Veneer',
        grade: 'MR (IS 303)',
        description:
          'Moisture-resistant plywood clad in premium teak veneer for mandir frames, back panels, and storage drawers.',
        icon: 'Layers',
      },
      {
        category: 'Laminate',
        name: 'Sandalwood Finish Veneer',
        grade: null,
        description:
          'Natural sandalwood-grain veneer sheets that evoke tradition and warmth — perfect for pooja unit shutters.',
        icon: 'TreeDeciduous',
      },
      {
        category: 'Laminate',
        name: 'CNC-Carved Jali Panels',
        grade: null,
        description:
          'Precision CNC-cut MDF jali panels in floral, geometric, and traditional motifs for pooja room doors and partitions.',
        icon: 'Flower2',
      },
      {
        category: 'Hardware',
        name: 'Brass & Antique Fittings',
        grade: null,
        description:
          'Hand-finished brass knobs, temple bell pulls, antique tower bolts, and ornamental handles in heritage gold finish.',
        icon: 'Crown',
      },
      {
        category: 'Hardware',
        name: 'Warm LED Integration',
        grade: null,
        description:
          'Warm-white LED strip lights and under-shelf puck lights for gentle, devotional illumination inside the mandir.',
        icon: 'Lightbulb',
      },
    ],
  },
];
