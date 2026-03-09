// INDUSTIMAL custom SVG icons — zero Lucide, zero emojis

export const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

export const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="10.5" width="20" height="3" fill="currentColor" transform="rotate(45 5 10.5)" />
    <rect x="5" y="13.5" width="20" height="3" fill="currentColor" transform="rotate(-45 5 13.5)" />
  </svg>
);

export const BlockCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" fill="currentColor" />
  </svg>
);

export const WarningTriangleIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 22H22L12 2Z" fill="currentColor" />
  </svg>
);

export const ExternalArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 17L17 7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M10 7H17V14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);
