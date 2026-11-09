import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExplodedPlywood from '../ui/ExplodedPlywood';
import ExplodedLaminate from '../ui/ExplodedLaminate';
import ExplodedHardware from '../ui/ExplodedHardware';
import AdhesiveShowcase from '../ui/AdhesiveShowcase';
import ProductCard from '../ui/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function RoomSection({ room, index = 0, isLast = false }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const gridRef = useRef(null);
  const productsRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // --- ENTRANCE (0% → 25%) ---

      // Background gradient fades in
      tl.fromTo(bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.08, ease: 'power1.out' },
        0
      );

      // Tagline slides in
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
        0.02
      );

      // Room name scales up
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power3.out' },
        0.05
      );

      // Description fades in
      tl.fromTo(descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.1
      );

      // --- EXPLODED VIEWS GRID (25% → 60%) ---
      const gridItems = gridRef.current?.children;
      if (gridItems) {
        Array.from(gridItems).forEach((item, i) => {
          tl.fromTo(item,
            { opacity: 0, y: 60, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power2.out' },
            0.18 + i * 0.06
          );
        });
      }

      // --- PRODUCT CARDS (60% → 75%) ---
      if (productsRef.current) {
        const productCards = productsRef.current.children;
        if (productCards) {
          Array.from(productCards).forEach((card, i) => {
            tl.fromTo(card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
              0.5 + i * 0.04
            );
          });
        }
      }

      // --- HOLD (75% → 85%) — nothing happens, user reads ---

      // --- EXIT (85% → 100%) ---
      if (!isLast) {
        tl.to([titleRef.current, taglineRef.current, descRef.current], {
          opacity: 0,
          y: -40,
          duration: 0.1,
          ease: 'power2.in',
        }, 0.85);

        if (gridItems) {
          tl.to(Array.from(gridItems), {
            opacity: 0,
            y: -30,
            duration: 0.08,
            stagger: 0.02,
            ease: 'power2.in',
          }, 0.87);
        }

        if (productsRef.current) {
          tl.to(productsRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.06,
          }, 0.9);
        }

        tl.to(bgRef.current, {
          opacity: 0,
          duration: 0.08,
        }, 0.92);
      }
    }, section);

    return () => ctx.revert();
  }, [isLast]);

  const plywood = room.plywoodDetails || {};

  return (
    <section
      ref={sectionRef}
      id={room.id}
      className="relative h-screen overflow-hidden"
    >
      {/* Full-screen background */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ background: room.bgGradient }}
      />

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <p
              ref={taglineRef}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-2"
              style={{ color: room.accentColor || '#C9A84C' }}
            >
              {room.tagline}
            </p>
            <h2
              ref={titleRef}
              className="font-heading text-3xl sm:text-4xl md:text-6xl text-charcoal mb-4"
            >
              {room.name}
            </h2>
            <p
              ref={descRef}
              className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-warm-gray"
            >
              {room.description}
            </p>
          </div>

          {/* Exploded Views Grid */}
          <div ref={gridRef} className="grid gap-4 md:grid-cols-2 mb-8 max-h-[55vh] overflow-y-auto scrollbar-thin">
            <div>
              <ExplodedPlywood
                grade={plywood.grade}
                fullName={plywood.fullName}
                standard={plywood.standard}
                layers={plywood.layers}
                resinType={plywood.resinType}
                resinColor={plywood.resinColor}
                usage={plywood.usage}
                whyThisGrade={plywood.whyThisGrade}
              />
            </div>
            <div>
              <ExplodedLaminate laminates={room.laminates || []} />
            </div>
            <div>
              <ExplodedHardware hardware={room.hardware || []} />
            </div>
            <div>
              <AdhesiveShowcase adhesives={room.adhesives || []} />
            </div>
          </div>

          {/* Product Cards */}
          {room.products && room.products.length > 0 && (
            <div ref={productsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {room.products.map((product, productIndex) => (
                <ProductCard
                  key={product.name}
                  name={product.name}
                  category={product.category}
                  grade={product.grade}
                  description={product.description}
                  icon={product.icon}
                  index={productIndex}
                  accentColor={room.accentColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
