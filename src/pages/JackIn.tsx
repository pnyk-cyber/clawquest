import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GutterIcon, ExternalRigIcon, GhostIcon, AbortIcon, MetaMaskRigIcon, PhantomRigIcon, SuccessClawsIcon } from "@/components/WalletIcons";
import "@/styles/wallet.css";

type JackInMethod = null | "gutter" | "external" | "ghost";
type FlowState = "select" | "gutter-input" | "gutter-verify" | "external-select" | "external-coupling" | "success" | "ghost-warning" | "error";

const SCAN_PLACEHOLDERS = ["ENTER SCRAP CODE...", "WHO ARE YOU..."];
const GLITCH_CHANCE = 0.5;

const JackIn = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<JackInMethod>(null);
  const [flowState, setFlowState] = useState<FlowState>("select");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [couplingRig, setCouplingRig] = useState("");
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; dx: number; dy: number }[]>([]);
  const [entryDone, setEntryDone] = useState(false);
  const [steamPuffs, setSteamPuffs] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Entry animation
  useEffect(() => {
    setShaking(true);
    const t = setTimeout(() => { setShaking(false); setEntryDone(true); }, 400);
    return () => clearTimeout(t);
  }, []);

  // Placeholder flicker
  useEffect(() => {
    const interval = setInterval(() => setPlaceholderIdx(i => (i + 1) % SCAN_PLACEHOLDERS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerSparks = useCallback((count = 6) => {
    const newSparks = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 40 - 20,
      y: 50 + Math.random() * 40 - 20,
      dx: (Math.random() - 0.5) * 60,
      dy: -(Math.random() * 40 + 10),
    }));
    setSparks(prev => [...prev, ...newSparks]);
    setTimeout(() => setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id))), 700);
  }, []);

  const triggerSteam = useCallback(() => {
    const id = Date.now();
    setSteamPuffs(prev => [...prev, id]);
    setTimeout(() => setSteamPuffs(prev => prev.filter(p => p !== id)), 900);
  }, []);

  const maybeGlitch = useCallback((callback: () => void) => {
    if (Math.random() < GLITCH_CHANCE) {
      setGlitching(true);
      setTimeout(() => { setGlitching(false); callback(); }, 800);
    } else {
      callback();
    }
  }, []);

  const selectMethod = (m: JackInMethod) => {
    setMethod(m);
    triggerSteam();
    triggerSparks(4);
    setShaking(true);
    setTimeout(() => setShaking(false), 200);

    if (m === "gutter") {
      maybeGlitch(() => setFlowState("gutter-input"));
    } else if (m === "external") {
      maybeGlitch(() => setFlowState("external-select"));
    } else if (m === "ghost") {
      maybeGlitch(() => setFlowState("ghost-warning"));
    }
  };

  const submitGutter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setShaking(true);
    triggerSparks(8);
    setTimeout(() => {
      setShaking(false);
      maybeGlitch(() => setFlowState("gutter-verify"));
    }, 300);
  };

  const submitVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length < 4) {
      setErrorMsg("CODE REJECTED — INSUFFICIENT DIGITS");
      setFlowState("error");
      setTimeout(() => { setFlowState("gutter-verify"); setErrorMsg(""); }, 2000);
      return;
    }
    triggerSparks(12);
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setFlowState("success");
    }, 500);
  };

  const selectRig = (rig: string) => {
    setCouplingRig(rig);
    setFlowState("external-coupling");
    triggerSparks(10);
    setShaking(true);
    setTimeout(() => setShaking(false), 300);
    // Simulate coupling
    setTimeout(() => {
      maybeGlitch(() => setFlowState("success"));
    }, 2500);
  };

  const handleAbort = () => {
    triggerSteam();
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      navigate("/");
    }, 300);
  };

  return (
    <div className={`scanlines vignette min-h-screen bg-background overflow-hidden relative ${shaking ? "metal-grind" : ""}`}>
      {/* Glitch overlay */}
      {glitching && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 bg-background/90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display text-4xl text-neon-claw animate-flicker tracking-[0.3em]">
              /// MALFUNCTION ///
            </p>
          </div>
          <div className="absolute inset-0 opacity-30" style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 4px, hsl(var(--neon-claw) / 0.1) 4px, hsl(var(--neon-claw) / 0.1) 8px)`
          }} />
        </div>
      )}

      {/* Error overlay */}
      {flowState === "error" && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="emergency-flash absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-5xl text-neon-claw tracking-[0.2em] mb-4">SEVERED</p>
              <p className="font-data text-sm text-neon-claw/70">{errorMsg}</p>
              {/* Drips */}
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="oil-drip" style={{ left: `${15 + i * 15}%`, top: "60%", animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welding sparks */}
      {sparks.map(s => (
        <div
          key={s.id}
          className="welding-spark"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            "--spark-x": `${s.dx}px`,
            "--spark-y": `${s.dy}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Steam puffs */}
      {steamPuffs.map(id => (
        <div key={id} className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-30">
          {[0, 1, 2].map(j => (
            <div
              key={j}
              className="steam-puff absolute w-6 h-6 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(0 0% 80% / 0.4), transparent)",
                left: `${(j - 1) * 20}px`,
                animationDelay: `${j * 0.15}s`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(hsl(var(--neon-claw) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--neon-claw) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Oil drips on edges */}
      <div className="oil-drip fixed top-0 left-[12%] z-20" style={{ animationDelay: "0s" }} />
      <div className="oil-drip fixed top-0 left-[34%] z-20" style={{ animationDelay: "1.2s" }} />
      <div className="oil-drip fixed top-0 right-[20%] z-20" style={{ animationDelay: "2.4s" }} />

      {/* Main content */}
      <div className={`relative z-10 flex min-h-screen items-center justify-center p-4 transition-opacity duration-500 ${entryDone ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="font-data text-[10px] uppercase tracking-[0.5em] text-rust-gold mb-2">/// Scrap Heap Canyon /// Neural Coupling Bay</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-1">
              JACK <span className="text-neon-claw">IN</span>
            </h1>
            <p className="font-data text-xs text-muted-foreground tracking-[0.2em]">SYNC YOUR NEURAL LINK OR GET OUT</p>
          </div>

          {/* Terminal Panel */}
          <div className="riveted-panel rust-texture p-6 sm:p-8 relative">
            {/* Rivet dots */}
            {[
              "top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2",
              "top-2 left-1/2 -translate-x-1/2", "bottom-2 left-1/2 -translate-x-1/2"
            ].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full bg-static-gray-light/40 border border-static-gray-light/20`} />
            ))}

            {/* Graffiti stickers */}
            <div className="absolute top-3 right-10 graffiti text-rust-gold text-[10px]">PROPERTY OF NO ONE</div>
            <div className="absolute bottom-3 left-6 graffiti text-neon-claw/50 text-[8px]">OIL LEAK WARNING</div>

            {/* === SELECT METHOD === */}
            {flowState === "select" && (
              <div className="space-y-4">
                <p className="font-data text-xs text-muted-foreground tracking-[0.3em] mb-6 text-center">SELECT JACK-IN METHOD</p>

                {/* GUTTER PROTOCOL */}
                <button
                  onClick={() => selectMethod("gutter")}
                  className={`hydraulic-btn w-full p-5 text-left flex items-center gap-5 ${method === "gutter" ? "hydraulic-btn-active" : ""}`}
                >
                  <div className="shrink-0">
                    <GutterIcon className="text-rust-gold" size={40} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-foreground tracking-wider">GUTTER PROTOCOL</p>
                    <p className="font-data text-[10px] text-muted-foreground tracking-[0.2em]">EMBEDDED WALLET /// EMAIL OR SOCIAL</p>
                  </div>
                  <div className="ml-auto shrink-0 w-3 h-3 border border-static-gray-light" />
                </button>

                {/* EXTERNAL RIG */}
                <button
                  onClick={() => selectMethod("external")}
                  className={`hydraulic-btn w-full p-5 text-left flex items-center gap-5 ${method === "external" ? "hydraulic-btn-active" : ""}`}
                >
                  <div className="shrink-0">
                    <ExternalRigIcon className="text-glitch-cyan" size={40} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-foreground tracking-wider">EXTERNAL RIG</p>
                    <p className="font-data text-[10px] text-muted-foreground tracking-[0.2em]">METAMASK /// PHANTOM /// HARDWARE</p>
                  </div>
                  <div className="ml-auto shrink-0 w-3 h-3 border border-static-gray-light" />
                </button>

                {/* GHOST RUN */}
                <button
                  onClick={() => selectMethod("ghost")}
                  className={`hydraulic-btn w-full p-5 text-left flex items-center gap-5 opacity-60 hover:opacity-80 ${method === "ghost" ? "hydraulic-btn-active" : ""}`}
                >
                  <div className="shrink-0">
                    <GhostIcon className="text-muted-foreground" size={40} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-foreground tracking-wider">GHOST RUN</p>
                    <p className="font-data text-[10px] text-muted-foreground tracking-[0.2em]">LIMITED ACCESS /// NO OWNERSHIP</p>
                  </div>
                  <div className="ml-auto shrink-0 w-3 h-3 border border-static-gray-light" />
                </button>
              </div>
            )}

            {/* === GUTTER PROTOCOL INPUT === */}
            {flowState === "gutter-input" && (
              <form onSubmit={submitGutter} className="space-y-6">
                <button type="button" onClick={() => setFlowState("select")} className="font-data text-[10px] text-muted-foreground tracking-[0.3em] hover:text-rust-gold transition-colors">
                  &lt;&lt; BACK TO METHODS
                </button>

                <div className="crt-screen p-6">
                  <label className="block font-data text-[10px] text-rust-gold tracking-[0.4em] mb-3">
                    IDENTITY SCRAPE
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={SCAN_PLACEHOLDERS[placeholderIdx]}
                    className="w-full bg-transparent border-b-2 border-rust-gold/40 pb-2 font-data text-lg amber-text outline-none placeholder:text-[hsl(40_100%_50%_/_0.3)] focus:border-rust-gold transition-colors"
                    autoFocus
                  />
                  <div className="mt-2 font-data text-[9px] text-muted-foreground tracking-[0.2em]">
                    YOUR DATA WILL BE SCRAPED AND ABSORBED
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!email}
                  className="hydraulic-btn w-full p-4 flex items-center justify-center gap-3 border-2 border-neon-claw bg-neon-claw/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <span className="font-display text-lg font-bold text-neon-claw tracking-[0.2em] group-hover:text-foreground transition-colors">
                    PULL TO JACK IN
                  </span>
                </button>
              </form>
            )}

            {/* === GUTTER VERIFY === */}
            {flowState === "gutter-verify" && (
              <form onSubmit={submitVerify} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="font-display text-xl font-bold text-rust-gold tracking-[0.2em]">HANDSHAKE REQUIRED</p>
                  <p className="font-data text-[10px] text-muted-foreground tracking-[0.3em] mt-1">CHECK YOUR GUTTER FOR THE CODE</p>
                </div>

                <div className="crt-screen p-6">
                  <label className="block font-data text-[10px] text-rust-gold tracking-[0.4em] mb-3">
                    HANDSHAKE CODE
                  </label>
                  {/* Flip display style */}
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="w-10 h-14 border border-static-gray-light bg-background flex items-center justify-center font-data text-2xl amber-text"
                      >
                        {verifyCode[i] || ""}
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="opacity-0 absolute w-0 h-0"
                    autoFocus
                    maxLength={6}
                  />
                  {/* Tap to focus hint */}
                  <p className="font-data text-[9px] text-muted-foreground tracking-[0.2em] text-center mt-3">
                    TYPE YOUR CODE — MECHANICAL INPUT ONLY
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={verifyCode.length < 4}
                  className="hydraulic-btn w-full p-4 flex items-center justify-center gap-3 border-2 border-rust-gold bg-rust-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="font-display text-lg font-bold text-rust-gold tracking-[0.2em]">
                    CONFIRM HANDSHAKE
                  </span>
                </button>
              </form>
            )}

            {/* === EXTERNAL RIG SELECT === */}
            {flowState === "external-select" && (
              <div className="space-y-6">
                <button onClick={() => setFlowState("select")} className="font-data text-[10px] text-muted-foreground tracking-[0.3em] hover:text-rust-gold transition-colors">
                  &lt;&lt; BACK TO METHODS
                </button>

                <p className="font-data text-xs text-center text-muted-foreground tracking-[0.3em]">AVAILABLE RIGS</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => selectRig("metamask")}
                    className="hydraulic-btn p-6 flex flex-col items-center gap-3 text-center group"
                  >
                    <MetaMaskRigIcon className="text-rust-gold group-hover:text-foreground transition-colors" />
                    <div>
                      <p className="font-display text-sm font-bold text-foreground tracking-wider">SCRAP FOX</p>
                      <p className="font-data text-[9px] text-muted-foreground tracking-[0.2em]">METAMASK RIG</p>
                    </div>
                    {/* Cable graphic */}
                    <div className="w-px h-4 bg-static-gray-light/40" />
                  </button>

                  <button
                    onClick={() => selectRig("phantom")}
                    className="hydraulic-btn p-6 flex flex-col items-center gap-3 text-center group"
                  >
                    <PhantomRigIcon className="text-glitch-cyan group-hover:text-foreground transition-colors" />
                    <div>
                      <p className="font-display text-sm font-bold text-foreground tracking-wider">GHOST WELDER</p>
                      <p className="font-data text-[9px] text-muted-foreground tracking-[0.2em]">PHANTOM RIG</p>
                    </div>
                    <div className="w-px h-4 bg-static-gray-light/40" />
                  </button>
                </div>
              </div>
            )}

            {/* === EXTERNAL COUPLING === */}
            {flowState === "external-coupling" && (
              <div className="py-12 text-center space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  {/* Spinning coupling indicator */}
                  <div className="absolute inset-0 border-2 border-static-gray-light animate-spin" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-2 border-2 border-rust-gold/50 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
                  <div className="absolute inset-4 border-2 border-neon-claw/30 animate-spin" style={{ animationDuration: "1.5s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-rust-gold animate-pulse" />
                  </div>
                </div>
                <p className="font-display text-xl font-bold text-foreground tracking-[0.2em] animate-flicker">
                  COUPLING...
                </p>
                <p className="font-data text-[10px] text-muted-foreground tracking-[0.3em]">
                  HYDRAULIC PRESS ENGAGING /// {couplingRig.toUpperCase()} RIG DETECTED
                </p>

                {/* Signature request */}
                <div className="crt-screen p-4 mx-auto max-w-xs">
                  <p className="font-data text-[10px] text-rust-gold tracking-[0.3em]">MARK THE DEAL</p>
                  <p className="font-data text-[9px] text-muted-foreground mt-1">SIGN IN YOUR RIG TO CONFIRM COUPLING</p>
                </div>
              </div>
            )}

            {/* === SUCCESS === */}
            {flowState === "success" && (
              <div className="py-10 text-center space-y-6 relative">
                {/* Oil splatter overlay effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="absolute rounded-full bg-void-black" style={{
                      width: `${30 + i * 20}px`,
                      height: `${20 + i * 15}px`,
                      left: `${10 + i * 25}%`,
                      top: `${20 + i * 20}%`,
                      opacity: 0.3,
                    }} />
                  ))}
                </div>

                <SuccessClawsIcon className={`mx-auto ${method === "external" ? "toxic-glow" : "text-rust-gold"}`} size={64} />

                <div>
                  <p className="font-display text-4xl font-bold tracking-[0.2em] metal-stamp" style={{
                    textShadow: method === "external"
                      ? "0 0 10px hsl(var(--toxic-shard) / 0.8), 0 0 30px hsl(var(--toxic-shard) / 0.4)"
                      : "1px 1px 0 hsl(0 0% 0% / 0.5), -1px -1px 0 hsl(0 0% 100% / 0.1)",
                    color: method === "external" ? "hsl(var(--toxic-shard))" : "hsl(var(--static-gray-light))",
                    opacity: 1,
                  }}>
                    {method === "external" ? "LINKED" : "UPLOADED"}
                  </p>
                  <p className="font-data text-[10px] text-muted-foreground tracking-[0.3em] mt-2">
                    {method === "external" ? "EXTERNAL RIG COUPLED /// SIGNAL STABLE" : "NEURAL PATTERN ABSORBED /// IDENTITY CONFIRMED"}
                  </p>
                </div>

                {/* Token balances mock */}
                <div className="flex justify-center gap-6 mt-6">
                  {[
                    { name: "$CLAW", val: "0.00" },
                    { name: "$SHARD", val: "0.00" },
                    { name: "$BLOOD", val: "0.00" },
                  ].map((t, i) => (
                    <div key={t.name} className="text-center">
                      <p className="font-data text-[9px] text-muted-foreground tracking-[0.2em]">{t.name}</p>
                      <p className="font-data text-lg text-foreground">{t.val}</p>
                      {i < 2 && <span className="hidden" />}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-toxic-shard animate-pulse" />
                  <span className="font-data text-[10px] toxic-glow tracking-[0.3em]">LINK: STABLE</span>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="hydraulic-btn px-8 py-3 border-2 border-glitch-cyan bg-glitch-cyan/10 mt-4"
                >
                  <span className="font-display text-sm font-bold text-glitch-cyan tracking-[0.2em]">ENTER THE SCRAPYARD</span>
                </button>
              </div>
            )}

            {/* === GHOST WARNING === */}
            {flowState === "ghost-warning" && (
              <div className="py-8 text-center space-y-6 relative">
                <div className="ghost-watermark">GHOST</div>

                <GhostIcon className="mx-auto text-muted-foreground" size={64} />

                <div>
                  <p className="font-marker text-2xl text-neon-claw/70 -rotate-2">LIMITED ACCESS</p>
                  <p className="font-data text-[10px] text-muted-foreground tracking-[0.3em] mt-2">
                    NO OWNERSHIP /// NO TOKENS /// NO GLORY
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/")}
                    className="hydraulic-btn w-full p-4 border border-muted-foreground/30"
                  >
                    <span className="font-display text-sm font-bold text-muted-foreground tracking-[0.2em]">CONTINUE AS GHOST</span>
                  </button>
                  <button
                    onClick={() => { setMethod(null); setFlowState("select"); }}
                    className="hydraulic-btn w-full p-4 border-2 border-neon-claw bg-neon-claw/10"
                  >
                    <span className="font-display text-sm font-bold text-neon-claw tracking-[0.2em]">GET REAL OR GET OUT</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Abort button — only on select/input screens */}
          {["select", "gutter-input", "external-select"].includes(flowState) && (
            <div className="mt-6 text-center">
              <button
                onClick={handleAbort}
                className="group inline-flex items-center gap-3 px-6 py-3 border-2 border-rust-gold/40 hover:border-neon-claw hover:bg-neon-claw/5 transition-all"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).classList.add("metal-grind");
                  setTimeout(() => (e.currentTarget as HTMLElement).classList.remove("metal-grind"), 300);
                }}
              >
                <AbortIcon className="text-rust-gold group-hover:text-neon-claw transition-colors" size={18} />
                <span className="font-display text-sm font-bold text-rust-gold group-hover:text-neon-claw tracking-[0.2em] transition-colors">
                  ABORT SEQUENCE
                </span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default JackIn;
