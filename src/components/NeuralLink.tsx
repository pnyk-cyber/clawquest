import { useState, useEffect, useCallback, useRef } from "react";
import {
  NeuralPlugIcon,
  NeuralPlugExtendedIcon,
  DataStreamIcon,
  LinkedEyeIcon,
  BrokenSpikeIcon,
  SeveredLinkIcon,
} from "./NeuralLinkIcons";

type NLState = "disconnected" | "initiating" | "connecting" | "connected" | "error";

const TERMINAL_LINES = [
  "INITIALIZING PORT: 0x7A3F...",
  "ENCRYPTING HANDSHAKE...",
  "BEAST DNA SIGNATURE: PENDING...",
  "VALIDATING NEURAL PATHWAYS...",
  "SYNCHRONIZING HIVE MIND...",
];

const ERROR_MESSAGES = [
  "NEURAL REJECTION: Invalid signature",
  "HIVE MIND REFUSES CONNECTION",
  "SPECIMEN DNA CORRUPTED: Retry protocol",
  "SYNC ABORTED: Check neural pathways",
];

const NeuralLink = () => {
  const [state, setState] = useState<NLState>("disconnected");
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [shaking, setShaking] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Simulate connection sequence
  const initiate = useCallback(() => {
    if (state !== "disconnected") return;
    setState("initiating");
    setShowOverlay(true);
    setProgress(0);
    setTerminalLines([]);
    setShowStamp(false);
    setCounterValue(0);
    setShaking(false);

    // After CRT open, move to connecting
    setTimeout(() => {
      setState("connecting");

      // Terminal lines appear one by one
      TERMINAL_LINES.forEach((line, i) => {
        setTimeout(() => {
          setTerminalLines((prev) => [...prev, line]);
        }, i * 800);
      });

      // Progress fills
      const progressInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return p + Math.random() * 4 + 1;
        });
      }, 100);

      // Decide success or error after ~5s
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        // 80% success, 20% error for demo
        if (Math.random() > 0.2) {
          handleSuccess();
        } else {
          handleError();
        }
      }, 5000);
    }, 700);
  }, [state]);

  const handleSuccess = () => {
    setState("connected");
    setShowStamp(true);

    // Roll up counter
    let val = 0;
    const counterInt = setInterval(() => {
      val += 31;
      if (val >= 1240) {
        val = 1240;
        clearInterval(counterInt);
      }
      setCounterValue(val);
    }, 20);

    // Close overlay after viewing
    setTimeout(() => {
      setClosing(true);
      setTimeout(() => {
        setShowOverlay(false);
        setClosing(false);
        setShowPanel(true);
      }, 600);
    }, 3000);
  };

  const handleError = () => {
    setState("error");
    setShaking(true);
    setErrorMsg(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
    setTimeout(() => setShaking(false), 300);
  };

  const retry = () => {
    setState("disconnected");
    setShowOverlay(false);
    setClosing(false);
    setShaking(false);
    setTimeout(() => initiate(), 200);
  };

  const disconnect = () => {
    setState("disconnected");
    setShowPanel(false);
    setShowOverlay(false);
    setProgress(0);
    setTerminalLines([]);
    setShowStamp(false);
    setCounterValue(0);
  };

  const abort = () => {
    cleanup();
    setState("disconnected");
    setShowOverlay(false);
    setClosing(false);
    setProgress(0);
    setTerminalLines([]);
  };

  useEffect(() => cleanup, [cleanup]);

  // ——— DISCONNECTED BUTTON (fixed top-right) ———
  if (state === "disconnected" && !showOverlay) {
    return (
      <button
        onClick={initiate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="nl-dormant-pulse nl-chromatic-hover fixed top-6 right-6 z-[100] flex items-center gap-3 border border-neon-claw bg-transparent px-5 py-3 font-display text-sm uppercase tracking-[2px] text-neon-claw transition-all"
        style={{ width: 220, height: 50, cursor: "crosshair" }}
      >
        {isHovered ? (
          <NeuralPlugExtendedIcon size={20} className="text-neon-claw" />
        ) : (
          <NeuralPlugIcon size={20} className="text-neon-claw" />
        )}
        <span className="whitespace-nowrap text-xs">SYNC NEURAL LINK</span>
        <span className="nl-blink ml-auto flex items-center gap-1 font-mono text-[10px] text-neon-claw">
          <span className="inline-block h-2 w-2 rounded-full bg-neon-claw" />
          OFFLINE
        </span>
      </button>
    );
  }

  // ——— CONNECTED PANEL (fixed top-right) ———
  if (state === "connected" && showPanel && !showOverlay) {
    return (
      <div className="fixed top-6 right-6 z-[100] border border-toxic-shard/50 bg-background/95 p-4" style={{ minWidth: 240 }}>
        <div className="mb-2 flex items-center gap-2">
          <LinkedEyeIcon size={18} className="text-toxic-shard" />
          <span className="font-display text-xs uppercase tracking-[2px] text-toxic-shard">
            NEURAL LINK: ACTIVE
          </span>
        </div>
        <div className="mb-1 border-t border-toxic-shard/20 pt-2 font-mono text-xs text-foreground">
          0x7A3F...9E2
        </div>
        <div className="mb-1 font-data text-sm text-toxic-shard">
          {(1240).toLocaleString()} $CLAW
        </div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          [3] SPECIMENS ACTIVE
        </div>
        <button
          onClick={disconnect}
          className="group flex items-center gap-2 border border-neon-claw/30 bg-transparent px-3 py-1.5 font-display text-[10px] uppercase tracking-[2px] text-neon-claw transition-all hover:border-neon-claw hover:shadow-[0_0_10px_rgba(255,0,64,0.4)]"
          style={{ cursor: "crosshair" }}
        >
          <SeveredLinkIcon size={14} className="text-neon-claw" />
          SEVER LINK
        </button>
      </div>
    );
  }

  // ——— FULL SCREEN OVERLAY ———
  if (!showOverlay) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-void-black ${
        state === "initiating" ? "nl-crt-open" : ""
      } ${closing ? "nl-diagonal-wipe" : ""} ${shaking ? "nl-violent-shake" : ""}`}
      style={{
        background: state === "error"
          ? "radial-gradient(ellipse at center, rgba(255,0,64,0.15) 0%, #0a0a0f 70%)"
          : "radial-gradient(ellipse at center, transparent 30%, #0a0a0f 80%)",
      }}
    >
      {/* Interference lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="nl-interference absolute left-0 h-[1px] w-full bg-toxic-shard/10"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="nl-interference absolute left-0 h-[1px] w-full bg-toxic-shard/5"
          style={{ animationDelay: "0.7s", animationDuration: "3s" }}
        />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.8) 100%)"
      }} />

      <div className="nl-materialize relative flex flex-col items-center gap-8">
        {/* ——— NEURAL INTERFACE GRAPHIC ——— */}
        <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
          {/* Circular port with hydraulic arms */}
          <svg width="280" height="280" viewBox="0 0 280 280" className="absolute inset-0">
            {/* Outer ring */}
            <circle cx="140" cy="140" r="120" fill="none" stroke="hsl(240 12% 22%)" strokeWidth="2" />
            <circle cx="140" cy="140" r="115" fill="none" stroke="hsl(240 12% 18%)" strokeWidth="1" strokeDasharray="4 4" />

            {/* 8 hydraulic arms */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 140 + Math.cos(angle) * 80;
              const y1 = 140 + Math.sin(angle) * 80;
              const x2 = 140 + Math.cos(angle) * 120;
              const y2 = 140 + Math.sin(angle) * 120;
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={state === "connected" ? "hsl(105 100% 55%)" : "hsl(349 100% 50%)"}
                  strokeWidth="3"
                  className={`nl-arm ${state !== "initiating" ? "nl-arm-active" : ""}`}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                />
              );
            })}

            {/* Connection pins (tick marks) */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const x1 = 140 + Math.cos(angle) * 116;
              const y1 = 140 + Math.sin(angle) * 116;
              const x2 = 140 + Math.cos(angle) * 124;
              const y2 = 140 + Math.sin(angle) * 124;
              return (
                <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(240 12% 30%)" strokeWidth="1" />
              );
            })}
          </svg>

          {/* Circular liquid gauge */}
          <div className="relative flex flex-col items-center justify-center" style={{ width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
              {/* Background ring */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(240 12% 18%)" strokeWidth="6" />
              {/* Progress ring */}
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke={state === "error" ? "hsl(349 100% 50%)" : state === "connected" ? "hsl(105 100% 55%)" : "hsl(105 100% 55% / 0.7)"}
                strokeWidth="6"
                strokeLinecap="square"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - Math.min(progress, 100) / 100)}`}
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
              />
            </svg>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center">
              {state === "connecting" && (
                <>
                  <DataStreamIcon size={32} className="mb-2 text-toxic-shard" />
                  <span className="font-data text-lg text-toxic-shard">
                    {Math.min(Math.floor(progress), 100)}%
                  </span>
                </>
              )}
              {state === "connected" && (
                <LinkedEyeIcon size={40} className="text-toxic-shard" />
              )}
              {state === "error" && (
                <BrokenSpikeIcon size={40} className="text-neon-claw" />
              )}
              {state === "initiating" && (
                <NeuralPlugExtendedIcon size={32} className="text-neon-claw" />
              )}
            </div>

            {/* Bubbles inside gauge */}
            {state === "connecting" && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: "50%" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="nl-bubble absolute bg-toxic-shard/30"
                    style={{
                      width: 4 + i * 2,
                      height: 4 + i * 2,
                      left: `${30 + i * 20}%`,
                      bottom: "20%",
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Steam particles from arms */}
          {(state === "connecting" || state === "connected") && (
            <div className="pointer-events-none absolute inset-0">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="nl-steam-particle absolute bg-foreground/20"
                  style={{
                    width: 3,
                    height: 3,
                    top: `${20 + i * 15}%`,
                    left: `${15 + i * 20}%`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: `${1 + i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ——— STATUS TEXT ——— */}
        <div className="flex flex-col items-center gap-2">
          {state === "initiating" && (
            <span className="font-display text-lg uppercase tracking-[4px] text-neon-claw">
              ENGAGING NEURAL BRIDGE...
            </span>
          )}
          {state === "connecting" && (
            <span className="font-display text-lg uppercase tracking-[4px] text-rust-gold">
              HANDSHAKE PROTOCOL ACTIVE
            </span>
          )}
          {state === "connected" && showStamp && (
            <div className="nl-stamp font-marker text-4xl text-toxic-shard" style={{ transform: "rotate(-3deg)" }}>
              LINK ESTABLISHED
            </div>
          )}
          {state === "error" && (
            <div className="nl-rgb-split font-display text-2xl uppercase tracking-[4px] text-neon-claw">
              SYNC FAILED
            </div>
          )}
        </div>

        {/* ——— TERMINAL LOG ——— */}
        {(state === "connecting" || state === "connected") && (
          <div className="w-full max-w-md border border-border/50 bg-void-black/80 p-4">
            {terminalLines.map((line, i) => (
              <div key={i} className="font-mono text-xs text-toxic-shard/80" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-muted-foreground">&gt; </span>{line}
              </div>
            ))}
            {state === "connecting" && (
              <div className="nl-cursor font-mono text-xs text-toxic-shard/80">
                <span className="text-muted-foreground">&gt; </span>
              </div>
            )}
          </div>
        )}

        {/* ——— SUCCESS DATA ——— */}
        {state === "connected" && showStamp && (
          <div className="nl-counter flex flex-col items-center gap-1">
            <span className="font-mono text-sm text-foreground">0x7A3F...9E2</span>
            <span className="font-data text-2xl text-toxic-shard">
              {counterValue.toLocaleString()} $CLAW
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              [3] SPECIMENS ACTIVE
            </span>
          </div>
        )}

        {/* ——— ERROR DETAILS ——— */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <span className="font-mono text-xs uppercase text-neon-claw/70">{errorMsg}</span>
            <button
              onClick={retry}
              className="border border-rust-gold/60 bg-transparent px-6 py-2.5 font-display text-xs uppercase tracking-[2px] text-rust-gold transition-all hover:border-rust-gold hover:shadow-[0_0_15px_rgba(255,140,0,0.4)]"
              style={{ cursor: "crosshair" }}
            >
              RETRY PROTOCOL
            </button>
          </div>
        )}

        {/* ——— ABORT BUTTON (during connecting) ——— */}
        {(state === "initiating" || state === "connecting") && (
          <button
            onClick={abort}
            className="group mt-4 flex items-center gap-2 border border-neon-claw/40 bg-transparent px-6 py-2.5 font-display text-xs uppercase tracking-[2px] text-neon-claw/70 transition-all hover:border-neon-claw hover:text-neon-claw hover:shadow-[0_0_15px_rgba(255,0,64,0.3)]"
            style={{ cursor: "crosshair" }}
          >
            {/* Custom X icon - two crossed hydraulic lines */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
            ABORT SEQUENCE
          </button>
        )}
      </div>
    </div>
  );
};

export default NeuralLink;
