import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuitIcon,
  HardDrivePortIcon,
  CircuitDisconnectIcon,
  ClawCheckIcon,
  CableInsertionSVG,
  DNAHelixSVG,
} from "@/components/NeuralLinkIcons";

type Phase =
  | "cable"
  | "select"
  | "standard-email"
  | "standard-verify"
  | "standard-success"
  | "external-list"
  | "external-connecting"
  | "external-sign"
  | "external-success"
  | "guest-confirm"
  | "guest-active";

const MOCK_WALLET = "0xC1AW...7F3B";
const MOCK_WALLETS = [
  { name: "METAMASK", strength: 4, id: "metamask" },
  { name: "PHANTOM", strength: 3, id: "phantom" },
  { name: "WALLETCONNECT", strength: 5, id: "walletconnect" },
];

const NeuralLink = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("cable");
  const [cableProgress, setCableProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [flashSuccess, setFlashSuccess] = useState(false);
  const verifyRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cable insertion animation on mount
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setCableProgress(progress);
      if (progress < 100) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase("select"), 400);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle verification code input
  const handleVerifyInput = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newCode = [...verifyCode];
      newCode[index] = value.slice(-1);
      setVerifyCode(newCode);

      // Auto-tab
      if (value && index < 5) {
        verifyRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all filled
      if (newCode.every((c) => c !== "")) {
        setTimeout(() => {
          triggerSuccess("standard");
        }, 600);
      }
    },
    [verifyCode]
  );

  const handleVerifyKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
        verifyRefs.current[index - 1]?.focus();
      }
    },
    [verifyCode]
  );

  const triggerSuccess = useCallback(
    (type: "standard" | "external") => {
      setFlashSuccess(true);
      setTimeout(() => {
        setFlashSuccess(false);
        setPhase(type === "standard" ? "standard-success" : "external-success");
      }, 600);
    },
    []
  );

  const triggerError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }, []);

  const handleEmailSubmit = useCallback(() => {
    if (!email || !email.includes("@")) {
      triggerError("INVALID CONSCIOUSNESS IDENTIFIER");
      return;
    }
    setPhase("standard-verify");
  }, [email, triggerError]);

  const handleExternalConnect = useCallback(
    (walletId: string) => {
      setSelectedWallet(walletId);
      setPhase("external-connecting");
      // Simulate connection
      setTimeout(() => setPhase("external-sign"), 2000);
    },
    []
  );

  const handleExternalSign = useCallback(() => {
    triggerSuccess("external");
  }, [triggerSuccess]);

  const handleGuestConfirm = useCallback(() => {
    setPhase("guest-active");
    // Redirect to home with guest mode after delay
    setTimeout(() => navigate("/?mode=guest"), 2000);
  }, [navigate]);

  const handleComplete = useCallback(() => {
    navigate("/?linked=true");
  }, [navigate]);

  return (
    <div className="neural-scan-bg scanlines vignette fixed inset-0 z-50 flex items-center justify-center bg-[hsl(240_25%_3%)] overflow-hidden">
      {/* Success flash overlay */}
      {flashSuccess && (
        <div className="success-flash fixed inset-0 z-[100] pointer-events-none" />
      )}

      {/* Error overlay */}
      {showError && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="error-static absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }} />
          <p className="font-display text-xl font-bold uppercase tracking-wider text-neon-claw animate-screen-shake relative z-10">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Cable insertion phase */}
      {phase === "cable" && (
        <div className="flex flex-col items-center">
          <CableInsertionSVG className="w-32 h-48" progress={cableProgress} />
          <p className="mt-4 font-data text-[10px] uppercase tracking-[0.4em] text-glitch-cyan/60">
            {cableProgress < 50
              ? "INSERTING NEURAL CABLE..."
              : cableProgress < 100
              ? "ESTABLISHING CORTEX LINK..."
              : "CONNECTION ESTABLISHED"}
          </p>
        </div>
      )}

      {/* Protocol selection */}
      {phase === "select" && (
        <div className="w-full max-w-2xl px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-12">
            <p className="mb-2 font-data text-[10px] uppercase tracking-[0.5em] text-glitch-cyan/50 text-center">
              /// Neural Uplink Methods
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground text-center mb-2">
              SELECT <span className="text-glitch-cyan">PROTOCOL</span>
            </h2>
            <p className="font-mono text-xs text-muted-foreground text-center mb-10">
              Choose your method of consciousness transfer.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Standard Uplink */}
              <button
                onClick={() => setPhase("standard-email")}
                className="hex-port group flex flex-col items-center gap-3 bg-static-gray/30 p-6 text-center transition-all hover:bg-glitch-cyan/10 border border-transparent hover:border-glitch-cyan/30"
              >
                <BrainCircuitIcon size={40} className="text-glitch-cyan/60 group-hover:text-glitch-cyan transition-colors" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  STANDARD UPLINK
                </span>
                <span className="font-data text-[9px] text-muted-foreground leading-relaxed">
                  Email login. Embedded wallet auto-spawned.
                </span>
              </button>

              {/* External Cortex */}
              <button
                onClick={() => setPhase("external-list")}
                className="hex-port group flex flex-col items-center gap-3 bg-static-gray/30 p-6 text-center transition-all hover:bg-glitch-cyan/10 border border-transparent hover:border-glitch-cyan/30"
              >
                <HardDrivePortIcon size={40} className="text-glitch-cyan/60 group-hover:text-glitch-cyan transition-colors" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  EXTERNAL CORTEX
                </span>
                <span className="font-data text-[9px] text-muted-foreground leading-relaxed">
                  MetaMask, Phantom, or WalletConnect.
                </span>
              </button>

              {/* Guest Simulation */}
              <button
                onClick={() => setPhase("guest-confirm")}
                className="hex-port group flex flex-col items-center gap-3 bg-static-gray/30 p-6 text-center transition-all hover:bg-rust-gold/10 border border-transparent hover:border-rust-gold/30"
              >
                <CircuitDisconnectIcon size={40} className="text-rust-gold/60 group-hover:text-rust-gold transition-colors" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  GUEST SIMULATION
                </span>
                <span className="font-data text-[9px] text-rust-gold/60 leading-relaxed">
                  Limited access. Demo specimens only.
                </span>
              </button>
            </div>

            {/* Back button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                DISCONNECT // RETURN TO LOBBY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Uplink: Email Input */}
      {phase === "standard-email" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-10">
            <p className="mb-1 font-data text-[10px] uppercase tracking-[0.5em] text-glitch-cyan/50 text-center">
              /// Standard Uplink Protocol
            </p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground text-center mb-8">
              CONSCIOUSNESS <span className="text-neon-claw">IDENTIFIER</span>
            </h2>

            <div className="mb-6">
              <label className="block font-data text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                ENTER IDENTIFIER_
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                placeholder="neural.link@cortex.io"
                className="terminal-input w-full bg-void-black border border-static-gray/40 px-4 py-3 font-mono text-sm text-glitch-cyan"
                autoFocus
              />
            </div>

            <button
              onClick={handleEmailSubmit}
              className="w-full border-2 border-neon-claw bg-neon-claw/10 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-neon-claw transition-all hover:bg-neon-claw hover:text-primary-foreground"
            >
              INITIATE UPLOAD
            </button>

            <button
              onClick={() => setPhase("select")}
              className="mt-4 w-full font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              CHANGE PROTOCOL
            </button>
          </div>
        </div>
      )}

      {/* Standard Uplink: Verification Code */}
      {phase === "standard-verify" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-10">
            <p className="mb-1 font-data text-[10px] uppercase tracking-[0.5em] text-neon-claw/60 text-center">
              /// Neural Handshake Required
            </p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground text-center mb-2">
              VERIFICATION <span className="text-neon-claw">SEQUENCE</span>
            </h2>
            <p className="font-mono text-xs text-muted-foreground text-center mb-8">
              Code transmitted to {email}
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {verifyCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { verifyRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerifyInput(i, e.target.value)}
                  onKeyDown={(e) => handleVerifyKeyDown(i, e)}
                  className={`verify-box bg-void-black border-2 ${
                    digit ? "border-glitch-cyan text-glitch-cyan" : "border-static-gray/40 text-foreground"
                  } font-display font-bold`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <p className="font-data text-[9px] text-muted-foreground/40 text-center uppercase tracking-wider">
              Handshake expires in 120s
            </p>

            <button
              onClick={() => setPhase("standard-email")}
              className="mt-6 w-full font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              RE-TRANSMIT CODE
            </button>
          </div>
        </div>
      )}

      {/* Standard Uplink: Success */}
      {phase === "standard-success" && (
        <div className="w-full max-w-lg px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-12 text-center">
            <ClawCheckIcon size={56} className="text-toxic-shard mx-auto mb-4" />
            <h2 className="font-marker text-2xl sm:text-3xl text-foreground mb-2">
              UPLOAD COMPLETE
            </h2>
            <p className="font-data text-[10px] uppercase tracking-[0.4em] text-glitch-cyan/60 mb-6">
              Consciousness transferred. Wallet spawned.
            </p>

            <DNAHelixSVG className="w-full max-w-sm mx-auto mb-6" walletAddress={MOCK_WALLET} />

            <div className="inline-flex items-center gap-2 border border-toxic-shard/30 bg-toxic-shard/5 px-4 py-2 mb-8">
              <span className="h-2 w-2 bg-toxic-shard neural-stable" />
              <span className="font-data text-[10px] uppercase tracking-[0.3em] text-toxic-shard">
                NEURAL LINK: STABLE
              </span>
            </div>

            <div className="block">
              <button
                onClick={handleComplete}
                className="w-full border-2 border-glitch-cyan bg-glitch-cyan/10 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-glitch-cyan transition-all hover:bg-glitch-cyan hover:text-accent-foreground"
              >
                ENTER GENESIS CHAMBER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* External Cortex: Wallet List */}
      {phase === "external-list" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-10">
            <p className="mb-1 font-data text-[10px] uppercase tracking-[0.5em] text-glitch-cyan/50 text-center">
              /// External Cortex Protocol
            </p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground text-center mb-8">
              AVAILABLE <span className="text-glitch-cyan">CORTICES</span>
            </h2>

            <div className="space-y-3">
              {MOCK_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleExternalConnect(wallet.id)}
                  className="w-full flex items-center justify-between bg-static-gray/20 border border-static-gray/30 p-4 transition-all hover:border-glitch-cyan/40 hover:bg-glitch-cyan/5 group"
                >
                  <div className="flex items-center gap-3">
                    <HardDrivePortIcon size={24} className="text-static-gray-light group-hover:text-glitch-cyan transition-colors" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                      {wallet.name}
                    </span>
                  </div>
                  {/* Connection strength bars */}
                  <div className="flex items-end gap-[2px] h-4">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="w-[3px] transition-colors"
                        style={{
                          height: `${level * 3 + 2}px`,
                          backgroundColor:
                            level <= wallet.strength
                              ? "hsl(187 100% 50%)"
                              : "hsl(240 12% 22%)",
                        }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPhase("select")}
              className="mt-6 w-full font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              CHANGE PROTOCOL
            </button>
          </div>
        </div>
      )}

      {/* External Cortex: Connecting */}
      {phase === "external-connecting" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-12 text-center data-stream" style={{ minHeight: "240px" }}>
            <p className="font-display text-lg font-bold uppercase tracking-wider text-foreground mb-2">
              ESTABLISHING NEURAL BRIDGE
            </p>
            <p className="font-data text-[10px] uppercase tracking-[0.3em] text-glitch-cyan/60 mb-6">
              Cortex: {selectedWallet?.toUpperCase()}
            </p>
            {/* Particle visualization */}
            <div className="relative h-24 flex items-center justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-glitch-cyan"
                  style={{
                    animation: `data-flow ${1 + i * 0.2}s linear infinite`,
                    left: `${20 + i * 8}%`,
                    opacity: 0.3 + i * 0.08,
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground/50 blinking-cursor">
              Syncing neural pathways_
            </p>
          </div>
        </div>
      )}

      {/* External Cortex: Sign */}
      {phase === "external-sign" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-10">
            <p className="mb-1 font-data text-[10px] uppercase tracking-[0.5em] text-neon-claw/60 text-center">
              /// Verification Required
            </p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground text-center mb-6">
              NEURAL <span className="text-neon-claw">VERIFICATION</span>
            </h2>

            {/* Transaction details in terminal format */}
            <div className="bg-void-black border border-static-gray/30 p-4 mb-6 font-mono text-xs">
              <p className="text-muted-foreground mb-1">
                <span className="text-static-gray-light">ACTION:</span>{" "}
                <span className="text-foreground">SIGN_NEURAL_LINK</span>
              </p>
              <p className="text-muted-foreground mb-1">
                <span className="text-static-gray-light">CORTEX:</span>{" "}
                <span className="text-glitch-cyan">{selectedWallet?.toUpperCase()}</span>
              </p>
              <p className="text-muted-foreground mb-1">
                <span className="text-static-gray-light">HASH:</span>{" "}
                <span className="text-foreground/60">0x7f3b...c1aw</span>
              </p>
              <p className="text-muted-foreground">
                <span className="text-static-gray-light">NONCE:</span>{" "}
                <span className="text-foreground/60">42</span>
              </p>
            </div>

            <button
              onClick={handleExternalSign}
              className="w-full border-2 border-neon-claw bg-neon-claw/10 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-neon-claw transition-all hover:bg-neon-claw hover:text-primary-foreground"
            >
              CONFIRM VERIFICATION
            </button>

            <button
              onClick={() => setPhase("external-list")}
              className="mt-4 w-full font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              ABORT VERIFICATION
            </button>
          </div>
        </div>
      )}

      {/* External Cortex: Success */}
      {phase === "external-success" && (
        <div className="w-full max-w-lg px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-12 text-center">
            <ClawCheckIcon size={56} className="text-toxic-shard mx-auto mb-4" />
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground mb-2">
              SYNCHRONIZATION <span className="text-toxic-shard">COMPLETE</span>
            </h2>
            <p className="font-data text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
              Welcome back, OPERATOR.
            </p>

            {/* Green circuit traces */}
            <svg viewBox="0 0 300 40" className="w-full max-w-xs mx-auto mb-6">
              <path d="M0 20H80L90 10H140L150 20H220L230 30H300" stroke="hsl(105 100% 55%)" strokeWidth="2" className="circuit-pulse" />
              <path d="M0 20H60L70 30H160L170 20H240L250 10H300" stroke="hsl(105 100% 55% / 0.3)" strokeWidth="1" className="circuit-pulse" style={{ animationDelay: "0.5s" }} />
            </svg>

            <div className="inline-flex items-center gap-2 border border-toxic-shard/30 bg-toxic-shard/5 px-4 py-2 mb-8">
              <span className="h-2 w-2 bg-toxic-shard neural-stable" />
              <span className="font-data text-[10px] uppercase tracking-[0.3em] text-toxic-shard">
                NEURAL LINK: STABLE
              </span>
            </div>

            <div className="block">
              <button
                onClick={handleComplete}
                className="w-full border-2 border-glitch-cyan bg-glitch-cyan/10 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-glitch-cyan transition-all hover:bg-glitch-cyan hover:text-accent-foreground"
              >
                ENTER THE ARENA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Simulation: Confirm */}
      {phase === "guest-confirm" && (
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="chromatic-border bg-[hsl(240_25%_3%_/_0.92)] backdrop-blur-sm p-8 sm:p-10 text-center">
            <CircuitDisconnectIcon size={40} className="text-rust-gold mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground mb-2">
              GUEST <span className="text-rust-gold">SIMULATION</span>
            </h2>

            <div className="bg-rust-gold/5 border border-rust-gold/30 p-4 mb-6">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-rust-gold mb-2">
                LIMITED SIMULATION ACCESS
              </p>
              <ul className="font-data text-[9px] text-muted-foreground space-y-1 text-left">
                <li className="flex items-center gap-2">
                  <span className="text-rust-gold">--</span> Demo specimens only
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rust-gold">--</span> No token earnings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rust-gold">--</span> Battle history not saved
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rust-gold">--</span> No breeding access
                </li>
              </ul>
            </div>

            <button
              onClick={handleGuestConfirm}
              className="w-full border-2 border-rust-gold/60 bg-rust-gold/5 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-rust-gold transition-all hover:bg-rust-gold/15 hover:border-rust-gold mb-3"
            >
              ENTER SIMULATION
            </button>

            <button
              onClick={() => setPhase("select")}
              className="w-full font-data text-[10px] uppercase tracking-[0.2em] text-glitch-cyan/40 hover:text-glitch-cyan transition-colors"
            >
              UPGRADE TO FULL UPLINK
            </button>
          </div>
        </div>
      )}

      {/* Guest Active - brief transition */}
      {phase === "guest-active" && (
        <div className="text-center animate-fade-in">
          <p className="font-display text-lg font-bold uppercase tracking-wider text-rust-gold mb-2">
            SIMULATION LOADED
          </p>
          <p className="font-data text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Redirecting to demo arena...
          </p>
        </div>
      )}
    </div>
  );
};

export default NeuralLink;
