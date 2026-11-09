export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export const range = (v, a, b) => clamp((v - a) / (b - a));

export const smoothstep = (t) => t * t * (3 - 2 * t);

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const easeInQuad = (t) => t * t;

// Adapted from scroll-world: remaps 0-1 so scroll slows mid-section and speeds at seams
export const lingerEase = (x, L = 0.45) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  L = clamp(L);
  const c = x - 0.5;
  return (1 - L) * x + L * (4 * c * c * c + 0.5);
};

export function pinProgress(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const span = Math.max(1, rect.height - vh);
  return { p: clamp(-rect.top / span), rect, vh };
}
