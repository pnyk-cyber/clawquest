// Custom SVG icons for Neural Link Interface - NO LUCIDE
export const BrainCircuitIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Brain outline */}
    <path
      d="M12 2C8.5 2 5 5 5 9C5 11 6 12.5 6 12.5C5.5 13.5 5 15 5 16C5 19 7 22 12 22C17 22 19 19 19 16C19 15 18.5 13.5 18 12.5C18 12.5 19 11 19 9C19 5 15.5 2 12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Circuit traces */}
    <path
      d="M9 6H7M9 6V8M9 6L11 6M15 6H17M15 6V8M15 6L13 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 11H6M8 11L10 11M16 11H18M16 11L14 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 10V14M10 12H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" className="animate-pulse" />
    <path
      d="M9 16L12 18L15 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExternalCortexIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hard drive body */}
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Neural cable port */}
    <path
      d="M12 2V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="2" r="1" fill="currentColor" />
    {/* Connection lights */}
    <circle cx="7" cy="14" r="1.5" fill="currentColor" className="animate-pulse" />
    <circle cx="11" cy="14" r="1.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
    <circle cx="15" cy="14" r="1.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
    {/* Data lines */}
    <path
      d="M6 9H18"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export const GuestEyeIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Eye shape */}
    <path
      d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Pupil */}
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    {/* Disconnected circuit trace */}
    <path
      d="M8 8L10 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <path
      d="M14 14L16 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
);

export const SuccessClawsIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Two crossed claws forming checkmark */}
    <path
      d="M4 12L8 16L20 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path
      d="M4 14L7 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <path
      d="M18 6L20 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    {/* Claw accents */}
    <path
      d="M6 10L4 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

export const ErrorCrackedIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cracked neural link */}
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    {/* Crack pattern */}
    <path
      d="M12 3V8L14 10L12 12L10 14L12 16V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Static lines */}
    <path
      d="M6 8H8M16 8H18M6 16H8M16 16H18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

export const HydraulicArrowIcon = ({ className = "", size = 24, direction = "left" }: { className?: string; size?: number; direction?: "left" | "right" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hydraulic piston arrow */}
    <rect x="8" y="10" width="14" height="4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="11" width="10" height="2" fill="currentColor" />
    {/* Arrow head */}
    <path
      d="M8 12L2 6V18L8 12Z"
      fill="currentColor"
    />
    {/* Piston rings */}
    <path d="M16 10V14" stroke="currentColor" strokeWidth="1" />
    <path d="M18 10V14" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const NeuralCableIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cable */}
    <path
      d="M12 2V16"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Connector head */}
    <rect x="8" y="16" width="8" height="4" fill="currentColor" />
    <rect x="10" y="20" width="4" height="2" fill="currentColor" />
    {/* Connection prongs */}
    <rect x="9" y="22" width="2" height="1" fill="currentColor" />
    <rect x="13" y="22" width="2" height="1" fill="currentColor" />
  </svg>
);

export const DnaHelixIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${className} animate-spin`}
    style={{ animationDuration: "2s" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Double helix */}
    <path
      d="M12 2C8 2 6 6 6 8C6 10 8 12 12 12C16 12 18 14 18 16C18 18 16 22 12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2C16 2 18 6 18 8C18 10 16 12 12 12C8 12 6 14 6 16C6 18 8 22 12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Rungs */}
    <path d="M7 5H17" stroke="currentColor" strokeWidth="1" />
    <path d="M9 9H15" stroke="currentColor" strokeWidth="1" />
    <path d="M9 15H15" stroke="currentColor" strokeWidth="1" />
    <path d="M7 19H17" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const SignalBarsIcon = ({ className = "", strength = 3 }: { className?: string; strength?: number }) => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="12" width="3" height="4" fill={strength >= 1 ? "currentColor" : "currentColor"} opacity={strength >= 1 ? 1 : 0.2} />
    <rect x="5" y="9" width="3" height="7" fill={strength >= 2 ? "currentColor" : "currentColor"} opacity={strength >= 2 ? 1 : 0.2} />
    <rect x="10" y="5" width="3" height="11" fill={strength >= 3 ? "currentColor" : "currentColor"} opacity={strength >= 3 ? 1 : 0.2} />
    <rect x="15" y="0" width="3" height="16" fill={strength >= 4 ? "currentColor" : "currentColor"} opacity={strength >= 4 ? 1 : 0.2} />
  </svg>
);
