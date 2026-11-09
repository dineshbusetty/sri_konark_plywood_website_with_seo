"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import Logo from "./Logo";

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

const IMAGE_GALLERY_MAP = {
    0: 'jivanjor-lamino',
    1: 'jivanjor-pvc-xtra',
    2: 'jivanjor-allrounder',
    3: 'jivanjor-fastx',
    4: 'gurjan-plywood',
    5: 'alternate-plywood',
    6: 'greenlam-mfc',
    7: 'living-room',
    8: 'kitchen',
    9: 'bedroom',
    10: 'bathroom',
    11: 'dining-room',
    12: 'study',
    13: 'greenlam-particle-board',
    14: 'hardwood-plywood',
    15: 'rubber-wood',
    16: 'block-board',
    17: 'pooja-room',
    18: 'hardware-fittings',
    19: 'laminates',
    20: 'wpc-door-frames',
    21: 'wooden-door',
    22: 'shuttering-plywood',
};

const IMAGE_ALT_TEXT = [
    'Jivanjor Lamino wood adhesive for laminate bonding',
    'Jivanjor PVC Xtra adhesive for PVC edge banding',
    'Jivanjor Allrounder multi-purpose wood adhesive',
    'Jivanjor FastX quick-setting adhesive',
    'Premium Gurjan plywood sheet for furniture',
    'High-quality alternate plywood for interiors',
    'Greenlam MFC pre-laminated board',
    'Living room interior with premium plywood furniture',
    'Modular kitchen with marine plywood cabinets',
    'Bedroom wardrobe built with BWP plywood',
    'Bathroom vanity using waterproof plywood',
    'Dining room furniture with hardwood plywood finish',
    'Study room shelving with commercial plywood',
    'Greenlam particle board for budget furniture',
    'Hardwood plywood for heavy-duty applications',
    'Rubber wood panel for solid wood furniture',
    'Block board for doors and partitions',
    'Pooja room cabinet with decorative veneer',
    'Hettich and Ebco hardware fittings collection',
    'Decorative laminates and HPL sheet samples',
    'WPC door frames for moisture-resistant doorways',
    'Premium solid wood panel door with decorative sidelights',
    'Crown Platinum high-density shuttering plywood for construction',
];

function FlipCard({ src, index, total, phase, target, onClick }) {
    const hasDetail = index in IMAGE_GALLERY_MAP;

    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className={hasDetail ? "cursor-pointer group" : "group"}
            onClick={hasDetail ? onClick : undefined}
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={hasDetail ? { rotateY: 180 } : undefined}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={IMAGE_ALT_TEXT[index] || `Sri Konark product ${index + 1}`}
                        width={60}
                        height={85}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {hasDetail && (
                    <div
                        className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#1A1A1A] flex flex-col items-center justify-center p-4 border border-[#C9A84C]/30"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        <div className="text-center">
                            <p className="text-[8px] font-bold text-[#C9A84C] uppercase tracking-widest mb-1">View</p>
                            <p className="text-xs font-medium text-[#FAF6F0]">Details</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

const TOTAL_IMAGES = 23;
const MAX_SCROLL = 3000;

const IMAGES = [
    "/products/jivanjor-lamino.webp",
    "/products/jivanjor-pvc-xtra.webp",
    "/products/jivanjor-allrounder.webp",
    "/products/jivanjor-fastx.webp",
    "/products/gurjan-plywood.jpg",
    "/products/alternate-plywood.jpg",
    "/products/greenlam-mfc.jpg",
    "/rooms/living-room.jpg",
    "/rooms/kitchen.jpg",
    "/rooms/bedroom.jpg",
    "/rooms/bathroom.jpg",
    "/rooms/dining-room.jpg",
    "/rooms/study.jpg",
    "/products/greenlam-particle-board.jpg",
    "/products/hardwood-plywood.jpg",
    "/products/rubber-wood.jpg",
    "/products/block-board.jpg",
    "/rooms/pooja-room.jpg",
    "/products/hardware-fittings.jpg",
    "/products/laminates.webp",
    "/products/wpc-door-frames.webp",
    "/products/wooden-door.jpg",
    "/products/shuttering-plywood.jpg",
];

const lerp = (start, end, t) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
    const [introPhase, setIntroPhase] = useState("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;
            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 1200);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#FAFAFA] overflow-hidden">
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={introPhase === "circle" && morphValue < 0.5
                            ? { opacity: 1 - morphValue * 2, scale: 1 }
                            : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        className="mb-3"
                    >
                        <Logo size="lg" variant="dark" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)", letterSpacing: "-0.02em" }}
                        animate={introPhase === "circle" && morphValue < 0.5
                            ? { opacity: 1 - morphValue * 2, y: 0, scale: 1, filter: "blur(0px)", letterSpacing: "0.02em" }
                            : { opacity: 0, scale: 0.9, filter: "blur(10px)", letterSpacing: "-0.02em" }}
                        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-4xl md:text-6xl font-medium text-[#C9A84C]"
                    >
                        Sri Konark
                        <span className="sr-only"> Plywood & Hardware — Best Plywood Shop in Anantapur, Andhra Pradesh</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(8px)", letterSpacing: "0em" }}
                        animate={introPhase === "circle" && morphValue < 0.5
                            ? { opacity: 1 - morphValue * 2, y: 0, scale: 1, filter: "blur(0px)", letterSpacing: "0.08em" }
                            : { opacity: 0, scale: 0.9, filter: "blur(8px)", letterSpacing: "0em" }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-2xl md:text-4xl font-medium text-gray-700 mt-1"
                    >
                        Plywood & Hardware
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className="mt-5 text-xs font-bold tracking-[0.2em] text-gray-500"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>

                {/* Arc Active Content */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                        Premium Plywood & Hardware — From Forest to Your Home
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
                        Premium plywood, laminates, hardware & adhesives — <br className="hidden md:block" />
                        everything you need to build beautiful spaces, all under one roof in Anantapur.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            const circleRadius = Math.min(minDimension * 0.42, 420);
                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8,
                            };

                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                                onClick={() => {
                                    const galleryId = IMAGE_GALLERY_MAP[i];
                                    if (galleryId) {
                                        window.dispatchEvent(new CustomEvent('gallery:select', { detail: { id: galleryId } }));
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
