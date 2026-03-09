import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuitIcon,
  ExternalCortexIcon,
  GuestEyeIcon,
  SuccessClawsIcon,
  HydraulicArrowIcon,
  DnaHelixIcon,
  SignalBarsIcon,
} from "@/components/NeuralLinkIcons";
import "@/styles/neural-link.css";

type ConnectionState = 
  | "cable-insertion"
  | "protocol-selection"
  | "standard-input"
  | "standard-verify"
  | "external-select"
  | "external-connecting"
  | "guest-warning"
  | "success"
  | "error";

const SCAN_MESSAGES = [
  "SCANNING NEURAL PATHWAYS...",
  "ANALYZING CONSCIOUSNESS SIGNATURE...",
  "CALIBRATING SYNAPTIC BRIDGE...",
  "ESTABLISHING SECURE CHANNEL...",
];

const NeuralLink = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ConnectionState>("cable-insertion");
  const [showSteam, setShowSteam] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [scanMessage, setScanMessage] = useState(0);
  const [showSmash, setShowSmash] = useState(false);
  const [battleIntensity, setBattleIntensity] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Cable insertion sequence
  useEffect(() => {
    if (state === "cable-insertion") {
      const timer = setTimeout(() => {
        setShowSteam(true);
        setTimeout(() => {
          setShowSteam(false);
          setState("protocol-selection");
        }, 800);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Scan message cycling
  useEffect(() => {
    if (state === "standard-verify" || state === "external-connecting") {
      const interval = setInterval(() => {
        setScanMessage((prev) => (prev + 1) % SCAN_MESSAGES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Random battle impacts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerSmash = useCallback(() => {
    setBattleIntensity(2);
    setShowSmash(true);
    setTimeout(() => {
      setShowSmash(false);
      setState("success");
      setBattleIntensity(1);
    }, 800);
  }, []);

  const handleStandardSubmit = () => {
    if (email.includes("@")) {
      setState("standard-verify");
    }
  };

  const handleVerificationSubmit = () => {
    if (verificationCode.every((c) => c !== "")) {
      triggerSmash();
    }
  };

  const handleExternalConnect = (wallet: string) => {
    setSelectedWallet(wallet);
    setState("external-connecting");
    setTimeout(() => {
      triggerSmash();
    }, 3000);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-void-black z-50 overflow-hidden">
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--void-black)) 100%)"
      }} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--void-black)) 2px, hsl(var(--void-black)) 4px)"
      }} />

      {/* Battle Background */}
      <div 
        className={`absolute inset-0 battle-bg ${isShaking ? "impact-shake" : ""}`}
        style={{ 
          transform: `scale(${battleIntensity})`,
          transition: "transform 0.5s ease-out"
        }}
      >
        {/* Animated battle silhouettes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl">
            {/* Left beast silhouette */}
            <div 
              className="absolute left-[15%] top-1/2 -translate-y-1/2 w-48 h-48 opacity-20"
              style={{
                background: "radial-gradient(ellipse, hsl(var(--neon-claw) / 0.5), transparent 70%)",
                animation: "battle-pulse 2s ease-in-out infinite",
              }}
            />
            {/* Right beast silhouette */}
            <div 
              className="absolute right-[15%] top-1/2 -translate-y-1/2 w-48 h-48 opacity-20"
              style={{
                background: "radial-gradient(ellipse, hsl(var(--glitch-cyan) / 0.5), transparent 70%)",
                animation: "battle-pulse 2s ease-in-out infinite 1s",
              }}
            />
            {/* Impact sparks */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
              style={{
                background: "radial-gradient(circle, hsl(var(--rust-gold) / 0.3), transparent 60%)",
                animation: "battle-pulse 1s ease-in-out infinite 0.5s",
              }}
            />
          </div>
        </div>
        {/* Red grid lines */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-claw) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-claw) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Static noise overlay */}
      <div className="static-noise" />

      {/* THE SMASH Effect */}
      {showSmash && (
        <>
          <div className="the-smash-flash" />
          <div className="shockwave-ring" />
          <div className="shockwave-ring" style={{ animationDelay: "0.1s" }} />
        </>
      )}

      {/* Steam burst particles */}
      {showSteam && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 z-50">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="steam-particle"
              style={{
                left: `${Math.cos((i / 8) * Math.PI * 2) * 30}px`,
                top: `${Math.sin((i / 8) * Math.PI * 2) * 30}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Cable Insertion */}
      {state === "cable-insertion" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-cable-descend animate-cable-pulse">
            <svg width="60" height="300" viewBox="0 0 60 300">
              <defs>
                <linearGradient id="cableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--static-gray))" />
                  <stop offset="100%" stopColor="hsl(var(--glitch-cyan))" />
                </linearGradient>
              </defs>
              {/* Main cable */}
              <rect x="25" y="0" width="10" height="250" fill="url(#cableGrad)" />
              {/* Cable segments */}
              {[...Array(10)].map((_, i) => (
                <rect key={i} x="22" y={i * 25} width="16" height="3" fill="hsl(var(--static-gray-light))" />
              ))}
              {/* Connector head */}
              <rect x="15" y="250" width="30" height="20" fill="hsl(var(--static-gray))" />
              <rect x="20" y="270" width="20" height="15" fill="hsl(var(--glitch-cyan))" />
              {/* Prongs */}
              <rect x="22" y="285" width="6" height="10" fill="hsl(var(--foreground))" />
              <rect x="32" y="285" width="6" height="10" fill="hsl(var(--foreground))" />
            </svg>
          </div>
          <p className="absolute bottom-20 font-display text-sm tracking-[0.3em] text-glitch-cyan animate-pulse">
            INITIATING NEURAL INTERFACE...
          </p>
        </div>
      )}

      {/* Protocol Selection */}
      {state === "protocol-selection" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2 tracking-wider the-smash-chromatic">
            SELECT <span className="text-neon-claw">NEURAL PROTOCOL</span>
          </h1>
          <p className="font-mono text-sm text-muted-foreground mb-12 tracking-wide">
            CHOOSE YOUR CONSCIOUSNESS UPLOAD METHOD
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
            {/* Standard Uplink */}
            <button
              onClick={() => setState("standard-input")}
              className="hex-button group relative bg-card border-2 border-rust-gold/50 hover:border-glitch-cyan p-6 text-left transition-all"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-static-gray piston origin-bottom" />
              <BrainCircuitIcon className="text-glitch-cyan mb-4" size={48} />
              <h3 className="font-display text-lg text-foreground mb-2">STANDARD UPLINK</h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">
                CONSCIOUSNESS UPLOAD VIA NEURAL IDENTIFIER
              </p>
              <SignalBarsIcon className="text-toxic-shard" strength={4} />
            </button>

            {/* External Cortex */}
            <button
              onClick={() => setState("external-select")}
              className="hex-button group relative bg-card border-2 border-rust-gold/50 hover:border-glitch-cyan p-6 text-left transition-all"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-static-gray piston origin-bottom" />
              <ExternalCortexIcon className="text-glitch-cyan mb-4" size={48} />
              <h3 className="font-display text-lg text-foreground mb-2">EXTERNAL CORTEX</h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">
                LINK TO EXISTING NEURAL STORAGE UNIT
              </p>
              <SignalBarsIcon className="text-toxic-shard" strength={3} />
            </button>

            {/* Guest Simulation */}
            <button
              onClick={() => setState("guest-warning")}
              className="hex-button group relative bg-card border-2 border-rust-gold/50 hover:border-glitch-cyan p-6 text-left transition-all"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-static-gray piston origin-bottom" />
              <GuestEyeIcon className="text-muted-foreground mb-4" size={48} />
              <h3 className="font-display text-lg text-foreground mb-2">GUEST SIMULATION</h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">
                LIMITED CONSCIOUSNESS PROJECTION
              </p>
              <SignalBarsIcon className="text-muted-foreground" strength={1} />
            </button>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="mt-12 flex items-center gap-2 text-muted-foreground hover:text-glitch-cyan transition-colors"
          >
            <HydraulicArrowIcon size={20} />
            <span className="font-mono text-sm">ABORT SEQUENCE</span>
          </button>
        </div>
      )}

      {/* Standard Input Flow */}
      {state === "standard-input" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <button
            onClick={() => setState("protocol-selection")}
            className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-glitch-cyan transition-colors"
          >
            <HydraulicArrowIcon size={20} />
            <span className="font-mono text-sm">BACK</span>
          </button>

          <h2 className="font-display text-2xl text-foreground mb-2 tracking-wider">
            CONSCIOUSNESS UPLOAD PROTOCOL
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-8">
            ENTER YOUR NEURAL IDENTIFIER TO PROCEED
          </p>

          <div className="w-full max-w-md">
            <label className="font-display text-xs text-glitch-cyan tracking-[0.2em] mb-2 block">
              NEURAL IDENTIFIER
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER CONSCIOUSNESS SIGNATURE..."
                className="w-full bg-void-black border-2 border-static-gray focus:border-glitch-cyan px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground outline-none transition-colors"
              />
              <div className="terminal-cursor absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleStandardSubmit}
              disabled={!email.includes("@")}
              className="hydraulic-button w-full mt-6 bg-neon-claw text-primary-foreground font-display text-sm tracking-[0.2em] py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110"
            >
              INITIATE UPLOAD
            </button>
          </div>
        </div>
      )}

      {/* Standard Verification Flow */}
      {state === "standard-verify" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <h2 className="font-display text-2xl text-foreground mb-2 tracking-wider">
            NEURAL HANDSHAKE REQUIRED
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-8">
            ENTER 6-DIGIT VERIFICATION CODE
          </p>

          <div className="flex gap-3 mb-8">
            {verificationCode.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeInput(i, e.target.value)}
                className="w-12 h-14 bg-void-black border-2 border-static-gray focus:border-glitch-cyan text-center font-mono text-2xl text-foreground outline-none transition-all code-beep"
              />
            ))}
          </div>

          <div className="flex items-center gap-3 text-glitch-cyan mb-8">
            <DnaHelixIcon size={24} />
            <span className="font-mono text-sm">{SCAN_MESSAGES[scanMessage]}</span>
          </div>

          <button
            onClick={handleVerificationSubmit}
            disabled={!verificationCode.every((c) => c !== "")}
            className="hydraulic-button bg-toxic-shard text-void-black font-display text-sm tracking-[0.2em] px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110"
          >
            AUTHENTICATE
          </button>
        </div>
      )}

      {/* External Cortex Selection */}
      {state === "external-select" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <button
            onClick={() => setState("protocol-selection")}
            className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-glitch-cyan transition-colors"
          >
            <HydraulicArrowIcon size={20} />
            <span className="font-mono text-sm">BACK</span>
          </button>

          <h2 className="font-display text-2xl text-foreground mb-2 tracking-wider">
            ESTABLISHING EXTERNAL NEURAL BRIDGE
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-8">
            SELECT DETECTED CORTEX UNIT
          </p>

          <div className="space-y-4 w-full max-w-md">
            {[
              { name: "METAMASK", signal: 4 },
              { name: "PHANTOM", signal: 3 },
              { name: "WALLETCONNECT", signal: 4 },
            ].map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleExternalConnect(wallet.name)}
                className="w-full flex items-center justify-between bg-card border-2 border-static-gray hover:border-glitch-cyan p-4 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <ExternalCortexIcon className="text-glitch-cyan" size={32} />
                  <div className="text-left">
                    <span className="font-display text-foreground">{wallet.name}</span>
                    <span className="block font-mono text-xs text-muted-foreground group-hover:text-glitch-cyan transition-colors">
                      CORTEX DETECTED
                    </span>
                  </div>
                </div>
                <SignalBarsIcon className="text-toxic-shard" strength={wallet.signal} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* External Connecting */}
      {state === "external-connecting" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <h2 className="font-display text-2xl text-foreground mb-4 tracking-wider">
            ESTABLISHING NEURAL BRIDGE
          </h2>
          <p className="font-mono text-sm text-glitch-cyan mb-8">
            SYNCING WITH {selectedWallet}...
          </p>

          <div className="flex items-center gap-3 text-glitch-cyan">
            <DnaHelixIcon size={32} />
            <span className="font-mono text-sm">{SCAN_MESSAGES[scanMessage]}</span>
          </div>

          <div className="mt-8 font-mono text-xs text-muted-foreground bg-void-black border border-static-gray p-4 max-w-md">
            <p className="text-toxic-shard">{"> CONSCIOUSNESS VERIFICATION REQUIRED"}</p>
            <p className="mt-2">{">"} PLEASE CONFIRM IN YOUR EXTERNAL CORTEX</p>
            <p className="text-rust-gold mt-2">{">"} AWAITING SIGNATURE...</p>
          </div>
        </div>
      )}

      {/* Guest Warning */}
      {state === "guest-warning" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <button
            onClick={() => setState("protocol-selection")}
            className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-glitch-cyan transition-colors"
          >
            <HydraulicArrowIcon size={20} />
            <span className="font-mono text-sm">BACK</span>
          </button>

          <div className="border-4 border-rust-gold p-8 max-w-lg text-center">
            <h2 className="font-display text-2xl text-rust-gold mb-4 tracking-wider">
              SIMULATION MODE
            </h2>
            <p className="font-mono text-sm text-muted-foreground mb-6">
              NO PERMANENT STORAGE — YOUR CONSCIOUSNESS WILL NOT BE SAVED.
              BEAST OWNERSHIP AND BATTLE RECORDS WILL BE LOST ON DISCONNECT.
            </p>
            <div className="flex items-center justify-center gap-2 text-rust-gold mb-6">
              <div className="w-2 h-2 bg-rust-gold animate-pulse" />
              <span className="font-mono text-xs">RECORDING</span>
            </div>
            <button
              onClick={() => triggerSmash()}
              className="hydraulic-button bg-static-gray text-muted-foreground font-display text-sm tracking-[0.2em] px-8 py-3 hover:bg-static-gray-light transition-colors"
            >
              ENTER SIMULATION
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {state === "success" && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="stamp-slam font-marker text-4xl md:text-6xl text-toxic-shard mb-8 transform -rotate-8 border-4 border-toxic-shard px-6 py-2">
            UPLOAD COMPLETE
          </div>

          <div className="flex items-center gap-3 text-toxic-shard mb-8">
            <SuccessClawsIcon size={32} />
            <span className="font-display text-lg">NEURAL LINK: STABLE</span>
            <div className="w-3 h-3 bg-toxic-shard rounded-full animate-pulse" />
          </div>

          <p className="font-mono text-sm text-muted-foreground mb-8">
            SYNCED: 0x7a3b...9f2c
          </p>

          <button
            onClick={() => navigate("/")}
            className="hydraulic-button bg-neon-claw text-primary-foreground font-display text-sm tracking-[0.2em] px-12 py-4 hover:brightness-110 transition-all"
          >
            ENTER THE ARENA
          </button>
        </div>
      )}
    </div>
  );
};

export default NeuralLink;
