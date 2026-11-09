"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

export const DEFAULT_LINES = [
  "Marine Plywood · BWP Plywood · BWR Plywood · MR Grade Plywood · Commercial Plywood · Gurjan Plywood · Hardwood Plywood",
  "Block Board · Flush Doors · WPC Door Frames · Decorative Laminates · HPL Sheets · Sunmica · Acrylic Laminates",
  "Veneer Sheets · Edge Banding Tape · PVC Edge Bands · MFC Boards · Particle Boards · Rubber Wood · Fire Retardant Plywood · Waterproof Plywood",
  "Hettich Hardware · Ebco Fittings · Hafele Accessories · Soft-Close Hinges · Drawer Channels · Kitchen Baskets · Modular Kitchen Fittings",
  "Cabinet Handles · Wardrobe Fittings · Door Handles · Telescopic Channels · Furniture Hardware",
  "Fevicol Adhesives · Jivanjor Adhesives · Jivanjor PVC Xtra · Jivanjor Lamino · Araldite Epoxy · Silicone Sealants · Wood Glue · Contact Adhesive",
  "Serving Anantapur · Srinivas Nagar · Near RTC Bus Stand · Open Mon–Sat 9 AM–8 PM",
  "Building Materials · Interior Solutions · Wholesale & Retail · Expert Guidance for Every Project",
  "Modular Kitchen Materials · Plywood for Home Interiors · Kitchen Cabinet Materials · Wardrobe Plywood · Bathroom Waterproof Plywood · Greenlam Laminates Dealer",
  "Sri Konark Plywood & Hardware — Your one-stop shop in Anantapur, AP",
];

export const RING_COUNT = 5;

export const K = 0.5522847498;
export const STROKE = 28;

export function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function circlePath(cx, cy, r) {
  const o = r * K;
  return [
    `M ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx + r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx + o).toFixed(1)} ${(cy + r).toFixed(1)} ${cx.toFixed(1)} ${(cy + r).toFixed(1)}`,
    `C ${(cx - o).toFixed(1)} ${(cy + r).toFixed(1)} ${(cx - r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx - r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx - r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx - o).toFixed(1)} ${(cy - r).toFixed(1)} ${cx.toFixed(1)} ${(cy - r).toFixed(1)}`,
    `C ${(cx + o).toFixed(1)} ${(cy - r).toFixed(1)} ${(cx + r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
  ].join(" ");
}

export function buildRingCopy(line, other, mix, circumference, fontSize) {
  const unit = mix
    ? `${line}   ·   ${other}   ·   `
    : `${line}   ·   ${line}   ·   ${other}   ·   `;
  const unitWidth = Math.max(unit.length * fontSize * 0.72, 1);
  const repeats = Math.max(3, Math.ceil(circumference / unitWidth) + 1);
  return unit.repeat(repeats);
}

export function buildRings(width, bandHeight, lines, seed) {
  const rand = mulberry32(seed);
  const cx = width / 2;
  const cy = bandHeight;
  const strokePad = STROKE / 2 + 2;
  const outer = Math.max(
    Math.min(width / 2 - strokePad, bandHeight - strokePad),
    STROKE * 4,
  );
  const radii = Array.from(
    { length: RING_COUNT },
    (_, i) => (outer * (i + 1)) / RING_COUNT,
  );

  const fontSize = Math.min(24, Math.max(16, width * 0.022));
  const pool = lines.length > 0 ? lines : DEFAULT_LINES;

  return radii.map((r, i) => {
    const line = pool[Math.floor(rand() * pool.length)];
    const other = pool[Math.floor(rand() * pool.length)];
    const circumference = 2 * Math.PI * r;
    const text = buildRingCopy(
      line,
      other,
      rand() > 0.45,
      circumference,
      fontSize,
    );

    return {
      d: circlePath(cx, cy, r),
      cx,
      cy,
      strokeWidth: STROKE,
      fontSize,
      text,
      duration: 42 + i * 8 + rand() * 10,
      phase: rand(),
      reverse: i % 2 === 1,
    };
  });
}

export function TangleFooter({
  className,
  lines = DEFAULT_LINES,
  ribbon,
  textColor,
  background,
  height,
  seed = 23,
  label = "Sri Konark Plywood & Hardware footer",
}) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      setWidth(el.clientWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!(entry?.isIntersecting ?? true)),
      { rootMargin: "64px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bandHeight = height ?? (width > 0 ? width / 2 : 0);
  const rings = useMemo(
    () =>
      width > 0 && bandHeight > 0
        ? buildRings(width, bandHeight, lines, seed)
        : [],
    [width, bandHeight, lines, seed],
  );

  const spinName = `tangle-spin-${uid}`;

  return (
    <footer
      ref={rootRef}
      data-slot="tangle-footer"
      aria-label={label}
      className={cn(
        "relative w-full overflow-hidden",
        background === undefined && "bg-[#EFEAE2]",
        ribbon == null && "[--tangle-ribbon:#141414]",
        textColor == null && "[--tangle-text:#F4F0E8]",
        className,
      )}
      style={{
        background,
        height: bandHeight > 0 ? bandHeight : undefined,
        aspectRatio: height == null ? "2 / 1" : undefined,
      }}
    >
      <style>{`@keyframes ${spinName}{to{transform:rotate(360deg)}}`}</style>

      {width > 0 && bandHeight > 0 ? (
        <motion.svg
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${width} ${bandHeight}`}
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <defs>
            {rings.map((ring, i) => (
              <path
                key={`def-${i}`}
                id={`${uid}-path-${i}`}
                d={ring.d}
                fill="none"
              />
            ))}
          </defs>

          {rings.map((ring, i) => {
            const pathId = `${uid}-path-${i}`;
            return (
              <g
                key={`ring-${i}`}
                style={
                  reduce
                    ? undefined
                    : {
                        transformBox: "view-box",
                        transformOrigin: `${ring.cx}px ${ring.cy}px`,
                        animation: `${spinName} ${ring.duration}s linear infinite`,
                        animationDirection: ring.reverse ? "reverse" : "normal",
                        animationDelay: `${-ring.phase * ring.duration}s`,
                        animationPlayState: paused ? "paused" : "running",
                        willChange: "transform",
                      }
                }
              >
                <use
                  href={`#${pathId}`}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    stroke: ribbon ?? "var(--tangle-ribbon)",
                  }}
                />
                <text
                  fontSize={ring.fontSize}
                  fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
                  fontWeight={700}
                  letterSpacing="0.05em"
                  dominantBaseline="central"
                  style={{
                    fill: textColor ?? "var(--tangle-text)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  <textPath href={`#${pathId}`} startOffset="0" method="align">
                    {ring.text}
                  </textPath>
                </text>
              </g>
            );
          })}
        </motion.svg>
      ) : null}

      <p className="sr-only">Sri Konark Plywood & Hardware — premium plywood, laminates, hardware fittings, and adhesives in Anantapur, Andhra Pradesh.</p>
    </footer>
  );
}

export default TangleFooter;
