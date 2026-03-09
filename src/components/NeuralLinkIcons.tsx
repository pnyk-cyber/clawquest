interface IconProps {
  size?: number;
  className?: string;
}

// Disconnected: Neural plug with 3 retracted prongs
export const NeuralPlugIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    {/* Central shaft */}
    <line x1="12" y1="24" x2="12" y2="14" />
    <rect x="9" y="12" width="6" height="4" fill="none" />
    {/* Retracted prongs */}
    <line x1="7" y1="12" x2="7" y2="10" />
    <line x1="12" y1="12" x2="12" y2="9" />
    <line x1="17" y1="12" x2="17" y2="10" />
    {/* Connector base */}
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Disconnected hover: Neural plug with extended prongs
export const NeuralPlugExtendedIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    <line x1="12" y1="24" x2="12" y2="14" />
    <rect x="9" y="12" width="6" height="4" fill="none" />
    {/* Extended prongs */}
    <line x1="7" y1="12" x2="7" y2="4" />
    <line x1="12" y1="12" x2="12" y2="2" />
    <line x1="17" y1="12" x2="17" y2="4" />
    <line x1="5" y1="12" x2="19" y2="12" />
    {/* Electric tips */}
    <line x1="6" y1="4" x2="8" y2="4" />
    <line x1="11" y1="2" x2="13" y2="2" />
    <line x1="16" y1="4" x2="18" y2="4" />
  </svg>
);

// Connecting: 5-bar data stream waveform
export const DataStreamIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
    <line x1="3" y1="16" x2="3" y2="8" className="nl-bar-1" />
    <line x1="7.5" y1="18" x2="7.5" y2="6" className="nl-bar-2" />
    <line x1="12" y1="14" x2="12" y2="4" className="nl-bar-3" />
    <line x1="16.5" y1="19" x2="16.5" y2="7" className="nl-bar-4" />
    <line x1="21" y1="15" x2="21" y2="9" className="nl-bar-5" />
  </svg>
);

// Connected: Linked chain + glowing beast eye
export const LinkedEyeIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    {/* Chain links */}
    <path d="M4 12 L8 8 L12 12 L8 16 Z" />
    <path d="M12 12 L16 8 L20 12 L16 16 Z" />
    {/* Beast eye center */}
    <circle cx="12" cy="12" r="2" fill="currentColor" className="nl-eye-glow" />
    {/* Slit pupil */}
    <line x1="12" y1="10.5" x2="12" y2="13.5" strokeWidth="1.5" />
  </svg>
);

// Error: Broken neural spike
export const BrokenSpikeIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    {/* Left half of broken spike */}
    <line x1="4" y1="20" x2="10" y2="13" />
    <line x1="10" y1="13" x2="8" y2="11" />
    {/* Right half displaced */}
    <line x1="14" y1="11" x2="16" y2="13" />
    <line x1="16" y1="13" x2="20" y2="4" />
    {/* Fracture sparks */}
    <line x1="10" y1="10" x2="14" y2="14" strokeWidth="1" opacity="0.6" />
    <line x1="9" y1="14" x2="13" y2="10" strokeWidth="1" opacity="0.6" />
  </svg>
);

// Disconnect: Severed chain link
export const SeveredLinkIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    {/* Left link pulling away */}
    <path d="M2 12 L6 8 L10 12 L6 16 Z" />
    {/* Right link pulling away */}
    <path d="M14 12 L18 8 L22 12 L18 16 Z" />
    {/* Break marks */}
    <line x1="11" y1="10" x2="11" y2="14" strokeWidth="1" opacity="0.5" />
    <line x1="13" y1="10" x2="13" y2="14" strokeWidth="1" opacity="0.5" />
  </svg>
);
