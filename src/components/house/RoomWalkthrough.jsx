import { useRef, useEffect, useState } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { onFrame } from '../../lib/scroll';
import { pinProgress, range, easeOutCubic, lerp, clamp, lingerEase } from '../../lib/math';

const SPRING_CONFIG = { stiffness: 65, damping: 18, mass: 0.8 };

export default function RoomWalkthrough({ room, nextRoom, index }) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const sceneRef = useRef(null);
  const doorFrameRef = useRef(null);
  const productsRef = useRef(null);
  const vignetteRef = useRef(null);
  const ambientRef = useRef(null);
  const imgRef = useRef(null);

  const isFirst = index === 0;
  const isLast = !nextRoom;

  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const doorProgress = useMotionValue(0);
  const springDoorP = useSpring(doorProgress, SPRING_CONFIG);

  const clipInsetY = useTransform(springDoorP, [0, 1], [32, 0]);
  const clipInsetX = useTransform(springDoorP, [0, 1], [28, 0]);
  const clipRadius = useTransform(springDoorP, [0, 1], [12, 0]);
  const nextScale = useTransform(springDoorP, [0, 1], [1.3, 1.15]);
  const doorBorderW = useTransform(springDoorP, [0, 1], [4, 0]);
  const doorBorderO = useTransform(springDoorP, [0, 1], [0.7, 0]);
  const doorShadowBlur = useTransform(springDoorP, [0, 1], [60, 0]);
  const doorShadowO = useTransform(springDoorP, [0, 1], [0.5, 0]);

  const clipPath = useTransform(
    [clipInsetY, clipInsetX, clipRadius],
    ([y, x, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`
  );

  const nextImgTransform = useTransform(nextScale, (s) => `scale(${s})`);

  const nextBoxShadow = useTransform(
    [doorBorderW, doorBorderO, doorShadowBlur, doorShadowO],
    ([bw, bo, sb, so]) =>
      `inset 0 0 0 ${bw}px rgba(62,39,35,${bo}), 0 0 ${sb}px rgba(0,0,0,${so})`
  );

  const nextOpacity = useTransform(springDoorP, (v) => (v > 0.001 ? 1 : 0));

  useEffect(() => {
    return onFrame(() => {
      const section = sectionRef.current;
      if (!section) return;
      const { p: rawP } = pinProgress(section);
      if (rawP <= 0 || rawP >= 1) return;
      const p = prefersReduced ? rawP : lingerEase(rawP, 0.45);

      const name = nameRef.current;
      const tagline = taglineRef.current;
      const scene = sceneRef.current;
      const doorFrame = doorFrameRef.current;
      const products = productsRef.current;
      const vignette = vignetteRef.current;
      const ambient = ambientRef.current;
      const img = imgRef.current;

      if (img && !prefersReduced) {
        const kenBurns = lerp(1.15, 1.22, p);
        const parallaxY = lerp(-15, 15, p);
        img.style.transform = `scale(${kenBurns}) translateY(${parallaxY}px)`;
      }

      // === PHASE 1: Entrance (0 → 0.12) ===
      const entranceP = easeOutCubic(range(p, 0, 0.12));

      if (isFirst) {
        if (doorFrame) {
          const doorScale = lerp(0.3, 1, entranceP);
          doorFrame.style.transform = `scale(${doorScale})`;
          doorFrame.style.opacity = entranceP < 0.5 ? entranceP * 2 : 1;
        }
        if (scene) {
          scene.style.opacity = clamp(entranceP * 1.5);
          const sceneScale = lerp(1.3, 1, entranceP);
          scene.style.transform = `scale(${sceneScale})`;
        }
      } else {
        if (doorFrame) {
          doorFrame.style.opacity = 1 - entranceP;
          doorFrame.style.transform = 'scale(1)';
        }
        if (scene) {
          scene.style.opacity = 1;
          scene.style.transform = 'scale(1)';
        }
      }

      if (ambient) {
        ambient.style.opacity = isFirst ? clamp(entranceP * 0.8) : 0.8;
      }

      // === PHASE 2: Reveal (0.12 → 0.30) ===
      const revealP = easeOutCubic(range(p, 0.12, 0.3));
      if (name) {
        name.style.opacity = revealP > 0.5 ? lerp(1, 0.3, range(p, 0.3, 0.4)) : revealP * 2;
        const spacing = lerp(20, 0, revealP);
        name.style.letterSpacing = `${spacing}px`;
        name.style.transform = `translateY(${lerp(30, 0, revealP)}px)`;
      }
      if (tagline) {
        const tagP = range(p, 0.18, 0.32);
        tagline.style.opacity = tagP > 0.5 ? lerp(0.8, 0.2, range(p, 0.32, 0.4)) : tagP * 1.6;
        tagline.style.transform = `translateY(${lerp(20, 0, tagP)}px)`;
      }

      // === PHASE 3: Products (0.30 → 0.65) ===
      if (products) {
        const prodEnter = easeOutCubic(range(p, 0.30, 0.40));
        const prodExit = range(p, 0.58, 0.65);
        products.style.opacity = prodExit > 0 ? 1 - prodExit : prodEnter;
        products.style.transform = `translateY(${lerp(60, 0, prodEnter)}px)`;
        products.style.pointerEvents = prodEnter > 0.5 && prodExit < 0.5 ? 'auto' : 'none';

        const cards = products.children;
        for (let i = 0; i < cards.length; i++) {
          const cardP = easeOutCubic(range(p, 0.32 + i * 0.03, 0.42 + i * 0.03));
          const cardExit = range(p, 0.56 + i * 0.02, 0.64 + i * 0.02);
          const card = cards[i];
          if (!card) continue;
          card.style.opacity = cardExit > 0 ? 1 - cardExit : cardP;
          const dir = i % 2 === 0 ? -1 : 1;
          card.style.transform = `translateX(${lerp(dir * 80, 0, cardP)}px)`;
        }
      }

      // === PHASE 4: Exit / Door Transition (0.65 → 1.0) ===
      const exitP = range(p, 0.65, 1.0);

      if (isLast) {
        if (scene && exitP > 0) {
          const exitScale = lerp(1, 0.85, exitP);
          scene.style.transform = `scale(${exitScale})`;
          scene.style.opacity = 1 - exitP * 0.6;
        }
        if (vignette) {
          vignette.style.opacity = exitP;
        }
        if (doorFrame && exitP > 0) {
          doorFrame.style.opacity = 1 - exitP;
        }
        if (ambient && exitP > 0) {
          ambient.style.opacity = lerp(0.8, 0, exitP);
        }
      } else {
        doorProgress.set(prefersReduced ? exitP : exitP);

        if (scene) {
          const scaleBack = lerp(1, 0.88, easeOutCubic(exitP));
          scene.style.transform = `scale(${scaleBack})`;
          scene.style.opacity = lerp(1, 0.4, exitP);
        }

        if (ambient) {
          ambient.style.opacity = lerp(0.8, 0.2, exitP);
        }

        if (doorFrame) {
          doorFrame.style.opacity = lerp(1, 0, exitP);
        }

        if (vignette) {
          vignette.style.opacity = 0;
        }
      }
    });
  }, [isFirst, isLast, doorProgress, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id={room.id}
      style={{ height: '250svh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100svh', background: '#1A1A1A', perspective: '1200px' }}
      >
        {/* Doorway frame overlay */}
        <div
          ref={doorFrameRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{
            boxShadow: 'inset 0 0 0 40px #1A1A1A, inset 0 0 80px 20px rgba(0,0,0,0.5)',
            borderRadius: '4px',
          }} />
        </div>

        {/* Current room photo */}
        <div
          ref={sceneRef}
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: isFirst ? 0 : 1, transformOrigin: 'center center' }}
        >
          <img
            ref={imgRef}
            src={room.image}
            alt={`${room.name} interior design with ${room.plywoodDetails?.grade || 'premium'} plywood — Sri Konark, Anantapur`}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ transform: 'scale(1.15)' }}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.05) 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Next room doorway — spring-animated clip-path via framer-motion */}
        {nextRoom && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              zIndex: 35,
              opacity: nextOpacity,
              clipPath,
              boxShadow: nextBoxShadow,
              willChange: 'clip-path',
            }}
          >
            <motion.img
              src={nextRoom.image}
              alt={`${nextRoom.name} interior design — Sri Konark Plywood, Anantapur`}
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{ transform: nextImgTransform }}
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
              }}
            />
          </motion.div>
        )}

        {/* Ambient light tint overlay */}
        <div
          ref={ambientRef}
          className="absolute inset-0 z-12 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 35%, ${room.accentColor}18 0%, transparent 60%)`,
            opacity: 0,
          }}
        />

        {/* Warm vignette frame */}
        <div
          className="absolute inset-0 z-13 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(15,10,5,0.35) 100%)',
          }}
        />

        {/* Dust motes */}
        {!prefersReduced && (
          <div className="absolute inset-0 z-14 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-mote"
                style={{
                  width: `${2 + i % 3}px`,
                  height: `${2 + i % 3}px`,
                  background: `rgba(255,248,225,${0.15 + (i % 3) * 0.08})`,
                  left: `${15 + i * 13}%`,
                  top: `${20 + (i * 17) % 50}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${8 + i * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Room name overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <h2
            ref={nameRef}
            className="text-5xl md:text-7xl font-bold text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#FAF6F0',
              opacity: 0,
              textShadow: '0 2px 30px rgba(0,0,0,0.6)',
            }}
          >
            {room.name}
          </h2>
          <p
            ref={taglineRef}
            className="mt-4 text-lg md:text-xl tracking-widest uppercase"
            style={{
              color: room.accentColor,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              opacity: 0,
              textShadow: '0 1px 10px rgba(0,0,0,0.5)',
            }}
          >
            {room.tagline}
          </p>
        </div>

        {/* Product showcase cards */}
        <div
          ref={productsRef}
          className="absolute inset-x-4 md:inset-x-12 bottom-8 top-auto z-20 flex flex-wrap gap-3 justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {room.products.slice(0, 4).map((product, i) => (
            <div
              key={i}
              className="px-5 py-4 rounded-xl max-w-[280px] transition-transform duration-300 hover:scale-[1.03]"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(20px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: room.accentColor, fontFamily: "'Inter', sans-serif" }}
              >
                {product.category}
              </div>
              <div
                className="text-sm font-bold mb-1"
                style={{ color: '#FAF6F0', fontFamily: "'Playfair Display', serif" }}
              >
                {product.name}
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(250,246,240,0.7)', fontFamily: "'Inter', sans-serif" }}
              >
                {product.description.length > 100
                  ? product.description.slice(0, 100) + '…'
                  : product.description}
              </div>
            </div>
          ))}
        </div>

        {/* Exit vignette (only used for last room) */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 z-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, #1A1A1A 100%)',
            opacity: 0,
          }}
        />
      </div>
    </section>
  );
}
