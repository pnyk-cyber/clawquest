// Post-connection nav — INDUSTIMAL aesthetic

interface NeuralNavProps {
  isGuest?: boolean;
}

const NeuralNav = ({ isGuest = false }: NeuralNavProps) => {
  return (
    <>
      {isGuest && (
        <div className="w-full border-b-2 border-[#ff9500] bg-[#1a1a1a] px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#ff9500] font-bold">
            GUEST MODE
          </span>
          <button className="text-xs uppercase tracking-[0.1em] text-[#ff9500] font-bold border border-[#ff9500] px-4 py-1 hover:bg-[#ff9500] hover:text-[#1a1a1a] transition-colors duration-150">
            UPGRADE
          </button>
        </div>
      )}

      {!isGuest && (
        <div className="w-full border-b border-[#333] bg-[#1a1a1a] px-6 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <TokenReadout label="CLAW" value="12,847" />
              <TokenReadout label="SHARD" value="3,291" />
              <TokenReadout label="BLOOD" value="847" />
            </div>
            <div className="flex items-center gap-2">
              <span className="industimal-status-dot" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TokenReadout = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-[0.15em] text-[#666] font-mono font-bold">
      ${label}
    </span>
    <span className="text-2xl font-black tracking-tight text-[#f0f0f0] font-mono leading-none">
      {value}
    </span>
  </div>
);

export default NeuralNav;
