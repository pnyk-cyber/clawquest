// Custom SVG icons for Neural Link Interface — zero Lucide, zero emojis

export const BrainCircuitIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Brain outline */}
    <path d="M24 4C16 4 10 10 10 18C10 22 12 25 14 27C14 30 12 34 12 36C12 40 16 44 20 44C22 44 24 42 24 42C24 42 26 44 28 44C32 44 36 40 36 36C36 34 34 30 34 27C36 25 38 22 38 18C38 10 32 4 24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    {/* Circuit traces inside brain */}
    <path d="M18 16H22L24 20L26 14H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M16 24H20L22 28L26 22H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M20 32H24L26 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    {/* Circuit nodes */}
    <rect x="17" y="15" width="2" height="2" fill="currentColor" />
    <rect x="29" y="13" width="2" height="2" fill="currentColor" />
    <rect x="15" y="23" width="2" height="2" fill="currentColor" />
    <rect x="31" y="21" width="2" height="2" fill="currentColor" />
    <rect x="25" y="35" width="2" height="2" fill="currentColor" />
  </svg>
);

export const HardDrivePortIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Drive body */}
    <rect x="6" y="10" width="36" height="28" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    {/* Port slot */}
    <rect x="16" y="20" width="16" height="8" stroke="currentColor" strokeWidth="2" />
    {/* Port pins */}
    <path d="M20 22V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M24 22V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M28 22V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    {/* Neural connection lines */}
    <path d="M10 14H14L18 18" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.5" />
    <path d="M38 14H34L30 18" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.5" />
    {/* Status LED */}
    <rect x="10" y="32" width="3" height="3" fill="currentColor" opacity="0.6" />
    <rect x="16" y="32" width="3" height="3" fill="currentColor" opacity="0.3" />
  </svg>
);

export const CircuitDisconnectIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Eye shape */}
    <path d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24C44 24 36 38 24 38C12 38 4 24 4 24Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    {/* Iris */}
    <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
    {/* Pupil */}
    <rect x="22" y="22" width="4" height="4" fill="currentColor" />
    {/* Disconnect slash */}
    <path d="M8 40L40 8" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    {/* Circuit break marks */}
    <path d="M14 34L16 32" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <path d="M32 16L34 14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const ClawCheckIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Two crossing claws forming checkmark */}
    <path d="M8 28L18 38L40 12" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="bevel" />
    {/* Claw marks */}
    <path d="M6 26L16 36" stroke="currentColor" strokeWidth="2" strokeLinecap="square" opacity="0.4" />
    <path d="M10 30L20 40" stroke="currentColor" strokeWidth="2" strokeLinecap="square" opacity="0.4" />
    <path d="M38 10L42 14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" opacity="0.4" />
  </svg>
);

export const CableInsertionSVG = ({ className = "", progress = 0 }: { className?: string; progress?: number }) => (
  <svg viewBox="0 0 200 300" className={className} fill="none">
    {/* Cable path from top to center */}
    <path
      d="M100 0 L100 80 Q100 90 95 95 L90 100 Q85 105 85 115 L85 130 Q85 140 90 145 L100 155 Q105 160 105 170 L105 200"
      stroke="hsl(187 100% 50%)"
      strokeWidth="3"
      strokeLinecap="square"
      strokeDasharray="300"
      strokeDashoffset={300 - (progress / 100) * 300}
      style={{ transition: "stroke-dashoffset 1s ease-out", filter: "drop-shadow(0 0 8px hsl(187 100% 50% / 0.6))" }}
    />
    {/* Port connector at bottom */}
    {progress > 90 && (
      <g opacity={progress > 95 ? 1 : 0.5}>
        <rect x="90" y="195" width="20" height="12" stroke="hsl(187 100% 50%)" strokeWidth="2" />
        <path d="M95 198V204" stroke="hsl(187 100% 50%)" strokeWidth="1.5" />
        <path d="M100 198V204" stroke="hsl(187 100% 50%)" strokeWidth="1.5" />
        <path d="M105 198V204" stroke="hsl(187 100% 50%)" strokeWidth="1.5" />
      </g>
    )}
    {/* Spark effects at connection point */}
    {progress >= 100 && (
      <g className="spark-group">
        <line x1="85" y1="200" x2="75" y2="195" stroke="hsl(187 100% 50%)" strokeWidth="1" className="spark-line" />
        <line x1="115" y1="200" x2="125" y2="195" stroke="hsl(187 100% 50%)" strokeWidth="1" className="spark-line" />
        <line x1="90" y1="210" x2="80" y2="215" stroke="hsl(187 100% 50%)" strokeWidth="1" className="spark-line" />
        <line x1="110" y1="210" x2="120" y2="215" stroke="hsl(187 100% 50%)" strokeWidth="1" className="spark-line" />
      </g>
    )}
  </svg>
);

export const DNAHelixSVG = ({ className = "", walletAddress = "" }: { className?: string; walletAddress?: string }) => (
  <svg viewBox="0 0 300 100" className={className} fill="none">
    {/* Double helix strands */}
    <path
      d="M20 50 Q50 10 80 50 Q110 90 140 50 Q170 10 200 50 Q230 90 260 50 Q290 10 300 30"
      stroke="hsl(349 100% 50%)"
      strokeWidth="2"
      className="dna-strand-1"
    />
    <path
      d="M20 50 Q50 90 80 50 Q110 10 140 50 Q170 90 200 50 Q230 10 260 50 Q290 90 300 70"
      stroke="hsl(187 100% 50%)"
      strokeWidth="2"
      className="dna-strand-2"
    />
    {/* Cross-links */}
    {[40, 80, 120, 160, 200, 240].map((x, i) => (
      <line key={i} x1={x} y1="35" x2={x} y2="65" stroke="hsl(0 0% 92% / 0.2)" strokeWidth="1" />
    ))}
    {/* Wallet address text along helix */}
    <text x="150" y="55" textAnchor="middle" fill="hsl(0 0% 92%)" fontFamily="'Share Tech Mono', monospace" fontSize="8" letterSpacing="1">
      {walletAddress}
    </text>
  </svg>
);
