import { cn } from '../../lib/utils'

const sizes = {
  sm: 32,
  md: 40,
  lg: 48,
}

function LogoMark({ size = 40, variant = 'light' }) {
  const markColor = variant === 'light' ? '#FAF6F0' : '#1A1A1A'
  const accentColor = '#C9A84C'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Shield border */}
      <rect x="4" y="4" width="40" height="40" rx="6" ry="6" stroke="url(#logoGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.4" />
      <rect x="6" y="6" width="36" height="36" rx="4" ry="4" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.15" />

      {/* Roof */}
      <path d="M10 22L24 10L38 22" stroke={accentColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* House walls */}
      <line x1="12" y1="22" x2="12" y2="38" stroke={markColor} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="36" y1="22" x2="36" y2="38" stroke={markColor} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="38" x2="36" y2="38" stroke={markColor} strokeWidth="1.8" strokeLinecap="round" />

      {/* Plywood layers inside house */}
      <line x1="14" y1="26" x2="34" y2="26" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="14" y1="30" x2="34" y2="30" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
      <line x1="14" y1="34" x2="34" y2="34" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

      {/* Wood grain curves */}
      <path d="M16 27.5c4-0.8 8 0.8 12 0" stroke={markColor} strokeWidth="0.4" opacity="0.15" fill="none" />
      <path d="M18 31.5c3-0.6 6 0.6 10 0" stroke={markColor} strokeWidth="0.4" opacity="0.12" fill="none" />

      {/* Hex bolt at roof peak */}
      <polygon points="24,7 26.6,8.5 26.6,11.5 24,13 21.4,11.5 21.4,8.5" fill={accentColor} opacity="0.85" />
      <polygon points="24,8 25.8,9 25.8,11 24,12 22.2,11 22.2,9" fill="none" stroke={markColor} strokeWidth="0.5" opacity="0.4" />

      {/* Door */}
      <rect x="21" y="32" width="6" height="6" rx="0.5" stroke={markColor} strokeWidth="0.8" fill="none" opacity="0.3" />

      <defs>
        <linearGradient id="logoGoldGrad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#A68B3C" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#D4B96A" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Logo({
  size = 'md',
  variant = 'light',
  withText = false,
  className = '',
}) {
  const px = sizes[size] || sizes.md
  const isLight = variant === 'light'

  if (!withText) {
    return (
      <div className={cn('flex-shrink-0', className)}>
        <LogoMark size={px} variant={variant} />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark size={px} variant={variant} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-heading font-semibold text-[#D4B44C]',
            size === 'sm' && 'text-xl',
            size === 'md' && 'text-2xl lg:text-3xl',
            size === 'lg' && 'text-3xl',
          )}
        >
          Sri Konark
        </span>
        <span
          className={cn(
            'font-heading font-medium text-[#FAF6F0] transition-colors duration-500',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm lg:text-base',
            size === 'lg' && 'text-base',
          )}
        >
          Plywood & Hardware
        </span>
      </span>
    </div>
  )
}
