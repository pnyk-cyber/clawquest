// Post-connection nav bar with token readouts and neural link status

interface NeuralNavProps {
  isGuest?: boolean;
}

const NeuralNav = ({ isGuest = false }: NeuralNavProps) => {
  return (
    <>
      {/* Guest upgrade CTA */}
      {isGuest && (
        <div className="upgrade-cta-bar w-full px-4 py-2 flex items-center justify-center gap-3">
          <span className="font-data text-[9px] uppercase tracking-[0.3em] text-rust-gold">
            DEMO MODE ACTIVE
          </span>
          <span className="text-static-gray-light">|</span>
          <button className="font-display text-[10px] font-bold uppercase tracking-wider text-rust-gold hover:text-foreground transition-colors">
            UPGRADE TO FULL UPLINK
          </button>
        </div>
      )}

      {/* Token readouts bar */}
      {!isGuest && (
        <div className="w-full border-b border-border/30 bg-card/50 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            {/* Left: Token balances */}
            <div className="flex items-center gap-4">
              <TokenReadout label="$CLAW" value="12,847" color="neon-claw" />
              <span className="text-static-gray/50">|</span>
              <TokenReadout label="$SHARD" value="3,291" color="glitch-cyan" />
              <span className="text-static-gray/50">|</span>
              <TokenReadout label="$BLOOD" value="847" color="neon-claw" />
            </div>

            {/* Right: Neural link status */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-toxic-shard neural-stable" />
              <span className="font-data text-[9px] uppercase tracking-[0.2em] text-toxic-shard hidden sm:inline">
                NEURAL LINK: STABLE
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TokenReadout = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="flex items-center gap-2">
    <span className={`font-data text-[9px] uppercase tracking-wider text-${color}/60`}>
      {label}
    </span>
    <span className={`font-data text-xs font-bold text-${color} token-readout`}>
      {value}
    </span>
  </div>
);

export default NeuralNav;
