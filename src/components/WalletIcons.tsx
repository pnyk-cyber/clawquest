// Custom SVG icons for wallet flow — rusted metal industrial style
// NO Lucide. NO emojis.

export const GutterIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    {/* Fist holding cable */}
    <path d="M12 28L12 18C12 16 14 14 16 14H18C19 14 20 13 20 12V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    <path d="M20 8L18 6M20 8L22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <rect x="10" y="18" width="12" height="10" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M10 21H22M10 24H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" opacity="0.5" />
    <path d="M24 22H32" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M28 20V24" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.4" />
    <circle cx="34" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const ExternalRigIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    {/* Welding torch connecting to plug */}
    <path d="M8 12L16 20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M6 10L10 8L12 12L8 14L6 10Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="20" r="1" fill="currentColor" />
    {/* Sparks */}
    <path d="M18 16L22 12M20 18L24 16M18 22L22 24" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
    {/* Plug */}
    <rect x="26" y="16" width="8" height="8" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M28 20H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M30 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M22 20H26" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeDasharray="2 2" />
  </svg>
);

export const GhostIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    {/* Faded silhouette with X carved */}
    <path d="M14 32V16C14 12 16.5 8 20 8C23.5 8 26 12 26 16V32L24 28L22 32L20 28L18 32L16 28L14 32Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" opacity="0.5" />
    <rect x="17" y="14" width="2.5" height="2.5" fill="currentColor" opacity="0.4" />
    <rect x="21" y="14" width="2.5" height="2.5" fill="currentColor" opacity="0.4" />
    {/* X carved in metal */}
    <path d="M16 20L24 28M24 20L16 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
  </svg>
);

export const SuccessClawsIcon = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    {/* Two crossed hydraulic claws */}
    <path d="M8 8L20 20L8 32" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="bevel" />
    <path d="M32 8L20 20L32 32" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="bevel" />
    <path d="M6 6L10 10M6 34L10 30M34 6L30 10M34 34L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="20" cy="20" r="1" fill="currentColor" />
  </svg>
);

export const HydraulicLeverIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="10" y="2" width="4" height="16" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <circle cx="12" cy="4" r="2" fill="currentColor" />
    <rect x="6" y="18" width="12" height="4" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M8 18V16M16 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const AbortIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* X made of two crossed hydraulic lines */}
    <path d="M4 4L20 20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M20 4L4 20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <rect x="3" y="3" width="4" height="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <rect x="17" y="3" width="4" height="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <rect x="3" y="17" width="4" height="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <rect x="17" y="17" width="4" height="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
);

export const MetaMaskRigIcon = ({ className = "", size = 48 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Fox head made of scrap metal */}
    <path d="M24 6L10 18L14 30L20 34L24 38L28 34L34 30L38 18L24 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M10 18L18 22L14 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" opacity="0.6" />
    <path d="M38 18L30 22L34 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" opacity="0.6" />
    <path d="M18 22L24 20L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <rect x="17" y="22" width="4" height="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    <rect x="27" y="22" width="4" height="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    <path d="M20 30L24 32L28 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    {/* Bolts/rivets */}
    <circle cx="15" cy="16" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="33" cy="16" r="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export const PhantomRigIcon = ({ className = "", size = 48 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Ghost in welding mask */}
    <path d="M16 36V20C16 14 19 10 24 10C29 10 32 14 32 20V36L30 32L28 36L26 32L24 36L22 32L20 36L18 32L16 36Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    {/* Welding mask visor */}
    <rect x="18" y="16" width="12" height="6" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M20 19H28" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    {/* Rivets */}
    <circle cx="19" cy="17" r="0.8" fill="currentColor" />
    <circle cx="29" cy="17" r="0.8" fill="currentColor" />
    <circle cx="19" cy="21" r="0.8" fill="currentColor" />
    <circle cx="29" cy="21" r="0.8" fill="currentColor" />
    {/* Sparks from mask */}
    <path d="M14 14L16 16M32 16L34 14M14 24L16 22M32 22L34 24" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.4" />
  </svg>
);
