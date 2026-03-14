import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import beastIronmaw from "@/assets/beast-ironmaw.png";
import beastPrisma from "@/assets/beast-prisma.png";
import {
  TransmitIcon,
  RageMeterIcon,
  SurrenderFlagIcon,
} from "@/components/BattleIcons";

interface LogEntry {
  id: number;
  text: string;
  type: "system" | "player" | "opponent" | "damage" | "critical";
  timestamp: string;
}

const INITIAL_LOG: LogEntry[] = [
  { id: 0, text: "/// COMBAT PROTOCOL INITIALIZED", type: "system", timestamp: "00:00" },
  { id: 1, text: "IRON MAW enters the arena", type: "player", timestamp: "00:01" },
  { id: 2, text: "PRISMA DANCER enters the arena", type: "opponent", timestamp: "00:01" },
  { id: 3, text: "/// ROUND 1 — FIGHT", type: "system", timestamp: "00:02" },
];

const OPPONENT_MOVES = [
  "PRISMA DANCER uses REFRACTION SLASH",
  "PRISMA DANCER uses CRYSTAL BARRAGE",
  "PRISMA DANCER uses MIRROR COUNTER",
  "PRISMA DANCER uses PRISMATIC BEAM",
  "PRISMA DANCER uses SPEED BLITZ",
];

const PLAYER_RESPONSES: Record<string, string[]> = {
  default: [
    "IRON MAW absorbs the blow",
    "IRON MAW staggers but holds",
    "IRON MAW deflects partially",
  ],
};

const getTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const BattleArena = () => {
  const navigate = useNavigate();
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [rage, setRage] = useState(0);
  const [round, setRound] = useState(1);
  const [turnActive, setTurnActive] = useState(true);
  const [command, setCommand] = useState("");
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [timer, setTimer] = useState(0);
  const [playerDamageFlash, setPlayerDamageFlash] = useState(false);
  const [opponentDamageFlash, setOpponentDamageFlash] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [sloshing, setSloshing] = useState(false);
  const [berserk, setBerserk] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(INITIAL_LOG.length);

  // Timer
  useEffect(() => {
    if (battleOver) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [battleOver]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  // Check win/loss
  useEffect(() => {
    if (playerHp <= 0 && !battleOver) {
      setBattleOver(true);
      setWinner("opponent");
      addLog("/// IRON MAW HAS FALLEN", "system");
      addLog("DEFEAT — CONNECTION SEVERED", "critical");
    } else if (opponentHp <= 0 && !battleOver) {
      setBattleOver(true);
      setWinner("player");
      addLog("/// PRISMA DANCER ELIMINATED", "system");
      addLog("VICTORY — SPECIMEN CONTAINED", "critical");
    }
  }, [playerHp, opponentHp, battleOver]);

  // Berserk mode at high rage
  useEffect(() => {
    if (rage >= 90 && !berserk) {
      setBerserk(true);
      addLog("/// WARNING: BERSERK MODE ACTIVATED", "critical");
    }
  }, [rage, berserk]);

  const addLog = useCallback((text: string, type: LogEntry["type"]) => {
    setTimer((t) => {
      const entry: LogEntry = {
        id: nextId.current++,
        text,
        type,
        timestamp: getTimestamp(t),
      };
      setLog((prev) => [...prev, entry]);
      return t;
    });
  }, []);

  const triggerPlayerDamage = useCallback((dmg: number) => {
    setPlayerHp((hp) => Math.max(0, hp - dmg));
    setPlayerDamageFlash(true);
    setShaking(true);
    setSloshing(true);
    setRage((r) => Math.min(100, r + Math.floor(dmg / 2)));
    setTimeout(() => setPlayerDamageFlash(false), 300);
    setTimeout(() => setShaking(false), 400);
    setTimeout(() => setSloshing(false), 1200);
  }, []);

  const triggerOpponentDamage = useCallback((dmg: number) => {
    setOpponentHp((hp) => Math.max(0, hp - dmg));
    setOpponentDamageFlash(true);
    setSloshing(true);
    setTimeout(() => setOpponentDamageFlash(false), 300);
    setTimeout(() => setSloshing(false), 1200);
  }, []);

  const handleCommand = useCallback(() => {
    if (!command.trim() || !turnActive || battleOver) return;

    const cmd = command.trim().toUpperCase();
    setCommand("");
    setTurnActive(false);

    // Player attack
    const playerDmg = Math.floor(Math.random() * 15) + 8 + (berserk ? 10 : 0);
    addLog(`> ${cmd}`, "player");

    setTimeout(() => {
      addLog(`IRON MAW deals ${playerDmg} DAMAGE`, "damage");
      triggerOpponentDamage(playerDmg);
    }, 400);

    // Opponent response
    setTimeout(() => {
      if (opponentHp - playerDmg <= 0) return;
      const move = OPPONENT_MOVES[Math.floor(Math.random() * OPPONENT_MOVES.length)];
      addLog(move, "opponent");

      setTimeout(() => {
        const oppDmg = Math.floor(Math.random() * 12) + 5;
        addLog(`PRISMA DANCER deals ${oppDmg} DAMAGE`, "damage");
        triggerPlayerDamage(oppDmg);

        const response = PLAYER_RESPONSES.default[Math.floor(Math.random() * PLAYER_RESPONSES.default.length)];
        setTimeout(() => {
          addLog(response, "player");
          setRound((r) => r + 1);
          addLog(`/// ROUND ${round + 1} — FIGHT`, "system");
          setTurnActive(true);
          inputRef.current?.focus();
        }, 600);
      }, 500);
    }, 1000);
  }, [command, turnActive, battleOver, berserk, opponentHp, round, addLog, triggerOpponentDamage, triggerPlayerDamage]);

  const handleSurrender = useCallback(() => {
    if (battleOver) return;
    setBattleOver(true);
    setWinner("opponent");
    addLog("/// SURRENDER PROTOCOL EXECUTED", "system");
    addLog("IRON MAW RETREATS — COWARD", "critical");
  }, [battleOver, addLog]);

  const logColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "system": return "text-muted-foreground";
      case "player": return "text-neon-claw";
      case "opponent": return "text-glitch-cyan";
      case "damage": return "text-rust-gold";
      case "critical": return "text-neon-claw font-bold";
    }
  };

  const hpColor = (hp: number) => {
    if (hp > 60) return "hsl(var(--toxic-shard))";
    if (hp > 30) return "hsl(var(--rust-gold))";
    return "hsl(var(--neon-claw))";
  };

  return (
    <div className={`min-h-screen bg-background overflow-hidden relative scanlines vignette arena-grid ${shaking ? "impact-shake" : ""}`}>
      {berserk && <div className="berserk-overlay" />}

      {/* Top HUD bar */}
      <div className="relative z-10 flex items-stretch justify-between border-b border-border bg-card/80 backdrop-blur-sm">
        {/* Player side */}
        <div className="flex-1 p-3 flex items-center gap-3">
          <div className="relative w-12 h-12 border border-neon-claw/40 overflow-hidden flex-shrink-0">
            <img src={beastIronmaw} alt="Iron Maw" className="w-full h-full object-cover" />
            {playerDamageFlash && <div className="damage-overlay" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">IRON MAW</span>
              <span className="font-data text-[10px] text-neon-claw">{playerHp}/100 HP</span>
            </div>
            {/* HP Hydraulic Tube */}
            <div className={`hp-tube h-5 bg-void-black relative ${sloshing ? "hp-sloshing" : ""}`}>
              <div
                className="hp-tube-liquid"
                style={{
                  height: `${playerHp}%`,
                  background: `linear-gradient(0deg, ${hpColor(playerHp)}, ${hpColor(playerHp)}cc)`,
                }}
              />
              <div className="hp-tube-segments" />
              <div className="hp-bolt top-0 left-0" />
              <div className="hp-bolt top-0 right-0" />
              <div className="hp-bolt bottom-0 left-0" />
              <div className="hp-bolt bottom-0 right-0" />
            </div>
          </div>
        </div>

        {/* Center info */}
        <div className="flex flex-col items-center justify-center px-4 border-x border-border min-w-[140px]">
          <span className="font-data text-[9px] uppercase tracking-[0.3em] text-muted-foreground">ROUND</span>
          <span className="font-display text-2xl font-bold text-foreground">{round}</span>
          <span className="font-data text-[10px] text-muted-foreground">{getTimestamp(timer)}</span>
        </div>

        {/* Opponent side */}
        <div className="flex-1 p-3 flex items-center gap-3 flex-row-reverse">
          <div className="relative w-12 h-12 border border-glitch-cyan/40 overflow-hidden flex-shrink-0">
            <img src={beastPrisma} alt="Prisma Dancer" className="w-full h-full object-cover" />
            {opponentDamageFlash && <div className="damage-overlay" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-data text-[10px] text-glitch-cyan">{opponentHp}/100 HP</span>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">PRISMA DANCER</span>
            </div>
            <div className={`hp-tube h-5 bg-void-black relative ${sloshing ? "hp-sloshing" : ""}`}>
              <div
                className="hp-tube-liquid"
                style={{
                  height: `${opponentHp}%`,
                  background: `linear-gradient(0deg, ${hpColor(opponentHp)}, ${hpColor(opponentHp)}cc)`,
                }}
              />
              <div className="hp-tube-segments" />
              <div className="hp-bolt top-0 left-0" />
              <div className="hp-bolt top-0 right-0" />
              <div className="hp-bolt bottom-0 left-0" />
              <div className="hp-bolt bottom-0 right-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Main arena area */}
      <div className="relative z-10 flex flex-1" style={{ height: "calc(100vh - 76px - 72px)" }}>
        {/* Beast display area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Player beast */}
          <div className="absolute left-[10%] bottom-[15%] w-[35%] max-w-[300px]">
            <div className="relative border border-neon-claw/20 bg-card/20 overflow-hidden">
              <img src={beastIronmaw} alt="Iron Maw" className="w-full aspect-square object-cover" />
              {playerDamageFlash && <div className="damage-overlay" />}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-claw/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-claw/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-claw/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-claw/50" />
              {turnActive && !battleOver && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neon-claw font-data text-[8px] uppercase tracking-wider text-primary-foreground turn-active">
                  YOUR TURN
                </div>
              )}
            </div>
          </div>

          {/* Opponent beast */}
          <div className="absolute right-[10%] top-[10%] w-[30%] max-w-[260px]">
            <div className="relative border border-glitch-cyan/20 bg-card/20 overflow-hidden">
              <img src={beastPrisma} alt="Prisma Dancer" className="w-full aspect-square object-cover" />
              {opponentDamageFlash && <div className="damage-overlay" />}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-glitch-cyan/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-glitch-cyan/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-glitch-cyan/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-glitch-cyan/50" />
            </div>
          </div>

          {/* VS indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-marker text-4xl text-neon-claw/20 select-none">VS</span>
          </div>
        </div>

        {/* Right panel: Battle log + Rage meter */}
        <div className="w-[320px] border-l border-border flex flex-col bg-card/50">
          {/* Rage meter */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <RageMeterIcon size={14} className="text-neon-claw" />
                <span className="font-data text-[9px] uppercase tracking-[0.2em] text-muted-foreground">RAGE METER</span>
              </div>
              <span className={`font-data text-[10px] font-bold ${rage >= 90 ? "text-neon-claw" : rage >= 50 ? "text-rust-gold" : "text-muted-foreground"}`}>
                {rage}%
              </span>
            </div>
            <div className={`h-3 bg-void-black border border-static-gray relative overflow-hidden ${rage >= 90 ? "rage-active" : ""}`}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${rage}%`,
                  background: rage >= 90
                    ? `linear-gradient(90deg, hsl(var(--neon-claw)), hsl(var(--rust-gold)))`
                    : rage >= 50
                    ? `hsl(var(--rust-gold))`
                    : `hsl(var(--neon-claw) / 0.6)`,
                }}
              />
              {/* Tick marks */}
              {[25, 50, 75].map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 w-px bg-static-gray-light/40"
                  style={{ left: `${tick}%` }}
                />
              ))}
            </div>
            {berserk && (
              <p className="font-data text-[9px] text-neon-claw mt-1 uppercase tracking-wider">
                /// BERSERK — DAMAGE +50%
              </p>
            )}
          </div>

          {/* Battle log terminal */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 border-b border-border flex items-center gap-2">
              <div className="w-2 h-2 bg-toxic-shard" />
              <span className="font-data text-[9px] uppercase tracking-[0.2em] text-muted-foreground">COMBAT LOG</span>
            </div>
            <div ref={logRef} className="battle-log flex-1 overflow-y-auto p-3 space-y-1">
              {log.map((entry) => (
                <div key={entry.id} className="log-entry flex gap-2">
                  <span className="font-data text-[9px] text-muted-foreground/50 flex-shrink-0 w-10">{entry.timestamp}</span>
                  <span className={`font-data text-[10px] ${logColor(entry.type)}`}>{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom command dock */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 p-3">
          {/* Surrender */}
          <button
            onClick={handleSurrender}
            disabled={battleOver}
            className="flex items-center gap-1.5 px-3 py-2 border border-rust-gold/40 bg-rust-gold/5 font-data text-[10px] uppercase tracking-wider text-rust-gold hover:bg-rust-gold/15 transition-colors disabled:opacity-30"
          >
            <SurrenderFlagIcon size={14} className="text-rust-gold" />
            SURRENDER
          </button>

          {/* Command input */}
          <div className="flex-1 flex items-center gap-2 border border-toxic-shard/30 bg-void-black px-3 py-2">
            <TransmitIcon size={14} className="text-toxic-shard/60 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value.slice(0, 50))}
              onKeyDown={(e) => e.key === "Enter" && handleCommand()}
              placeholder={battleOver ? "COMBAT ENDED" : turnActive ? "TRANSMIT COMMAND..." : "AWAITING RESPONSE..."}
              disabled={!turnActive || battleOver}
              maxLength={50}
              className="terminal-input flex-1 bg-transparent font-data text-xs text-toxic-shard placeholder:text-toxic-shard/30 outline-none border-none uppercase tracking-wider disabled:opacity-30"
            />
            <span className="font-data text-[9px] text-muted-foreground/40">{command.length}/50</span>
          </div>

          {/* Transmit */}
          <button
            onClick={handleCommand}
            disabled={!command.trim() || !turnActive || battleOver}
            className="px-4 py-2 border border-neon-claw bg-neon-claw/10 font-display text-xs font-bold uppercase tracking-wider text-neon-claw hover:bg-neon-claw hover:text-primary-foreground transition-colors disabled:opacity-30 disabled:hover:bg-neon-claw/10 disabled:hover:text-neon-claw"
          >
            TRANSMIT
          </button>
        </div>

        {/* Battle over overlay */}
        {battleOver && winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-void-black/80 backdrop-blur-sm">
            <div className="text-center">
              <p className={`font-display text-2xl font-bold uppercase tracking-wider ${winner === "player" ? "text-toxic-shard" : "text-neon-claw"} chromatic`}>
                {winner === "player" ? "VICTORY" : "DEFEAT"}
              </p>
              <p className="font-data text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                {winner === "player" ? "SPECIMEN NEUTRALIZED" : "YOUR BEAST HAS FALLEN"}
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-3 px-6 py-2 border border-foreground/30 bg-card font-data text-[10px] uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                EXIT ARENA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
