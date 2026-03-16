import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import beastIronmaw from "@/assets/beast-ironmaw.png";
import beastPrisma from "@/assets/beast-prisma.png";
import {
  TransmitIcon,
  RageMeterIcon,
  SurrenderFlagIcon,
} from "@/components/BattleIcons";
import {
  PERSONALITIES,
  ANNOUNCER_LINES,
  SPECTATOR_NAMES,
  SPECTATOR_REACTIONS,
  getRandomItem,
} from "@/data/battleCommentary";
import {
  type BattleMove,
  CORE_MOVES,
  BIOME_MOVES,
  PERSONALITY_MOVES,
  matchImprovCommand,
  getMoveCommentary,
  calculateDamage,
  getAvailableMoves,
} from "@/data/moveSystem";

// ---- Types ----
interface LogEntry {
  id: number;
  text: string;
  type: "system" | "player" | "opponent" | "damage" | "critical" | "commentary" | "announcer" | "move_name";
  timestamp: string;
}

interface ChatMessage {
  id: number;
  name: string;
  text: string;
  color: string;
}

interface DamagePopup {
  id: number;
  value: number;
  isCrit: boolean;
  isHeal: boolean;
  side: "player" | "opponent";
}

interface ActiveVfx {
  id: number;
  type: string;
  duration: number;
}

// ---- Constants ----
const VIEWER_COLORS = [
  "text-neon-claw", "text-glitch-cyan", "text-toxic-shard", "text-rust-gold",
  "text-foreground", "text-muted-foreground",
];

const PLAYER_PERSONALITY = "aggressive";
const OPPONENT_PERSONALITY = "calculated";
const PLAYER_BIOME: "scrap" | "crystal" | "void" = "scrap";
const OPPONENT_BIOME: "scrap" | "crystal" | "void" = "crystal";

const getTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ---- Component ----
const BattleArena = () => {
  const navigate = useNavigate();

  // Core state
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [rage, setRage] = useState(0);
  const [round, setRound] = useState(1);
  const [turnActive, setTurnActive] = useState(false);
  const [command, setCommand] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [timer, setTimer] = useState(0);

  // VFX state
  const [playerDamageFlash, setPlayerDamageFlash] = useState(false);
  const [opponentDamageFlash, setOpponentDamageFlash] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [heavyShake, setHeavyShake] = useState(false);
  const [sloshing, setSloshing] = useState(false);
  const [berserk, setBerserk] = useState(false);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [activeVfx, setActiveVfx] = useState<ActiveVfx[]>([]);
  const [moveNameFlash, setMoveNameFlash] = useState<{ text: string; color: string } | null>(null);
  const [showDisconnectStamp, setShowDisconnectStamp] = useState(false);
  const [showTauntText, setShowTauntText] = useState<string | null>(null);
  const [playerBeastVfx, setPlayerBeastVfx] = useState("");
  const [opponentBeastVfx, setOpponentBeastVfx] = useState("");
  const [showRealityTear, setShowRealityTear] = useState(false);
  const [showStaticOverlay, setShowStaticOverlay] = useState(false);
  const [showGuardianShield, setShowGuardianShield] = useState(false);
  const [guardianCounterActive, setGuardianCounterActive] = useState(false);
  const [playerBerserkScale, setPlayerBerserkScale] = useState(false);

  // Battle state
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null);
  const [showPotIntro, setShowPotIntro] = useState(true);
  const [pot, setPot] = useState(500);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 800) + 200);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showMoveSelect, setShowMoveSelect] = useState(false);
  const [opponentStunned, setOpponentStunned] = useState(0);

  // Refs
  const logRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const chatId = useRef(0);
  const popupId = useRef(0);
  const vfxId = useRef(0);

  const playerPersonality = PERSONALITIES[PLAYER_PERSONALITY];
  const opponentPersonality = PERSONALITIES[OPPONENT_PERSONALITY];

  // ---- Helpers ----
  const addLog = useCallback((text: string, type: LogEntry["type"]) => {
    setTimer((t) => {
      const entry: LogEntry = { id: nextId.current++, text, type, timestamp: getTimestamp(t) };
      setLog((prev) => [...prev, entry]);
      return t;
    });
  }, []);

  const addChat = useCallback((name: string, text: string) => {
    const color = getRandomItem(VIEWER_COLORS);
    setChatMessages((prev) => [...prev.slice(-80), { id: chatId.current++, name, text, color }]);
  }, []);

  const addSpectatorReaction = useCallback((category: keyof typeof SPECTATOR_REACTIONS, replacements?: Record<string, string>) => {
    const lines = SPECTATOR_REACTIONS[category];
    let msg = getRandomItem(lines);
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => { msg = msg.replace(`{${k}}`, v); });
    }
    addChat(getRandomItem(SPECTATOR_NAMES), msg);
  }, [addChat]);

  const addDamagePopup = useCallback((value: number, isCrit: boolean, isHeal: boolean, side: "player" | "opponent") => {
    const id = popupId.current++;
    setDamagePopups((prev) => [...prev, { id, value, isCrit, isHeal, side }]);
    setTimeout(() => setDamagePopups((prev) => prev.filter((p) => p.id !== id)), 900);
  }, []);

  const triggerVfx = useCallback((type: string, duration: number) => {
    const id = vfxId.current++;
    setActiveVfx((prev) => [...prev, { id, type, duration }]);
    setTimeout(() => setActiveVfx((prev) => prev.filter((v) => v.id !== id)), duration);
  }, []);

  const showMoveName = useCallback((name: string, color: string) => {
    setMoveNameFlash({ text: name, color });
    setTimeout(() => setMoveNameFlash(null), 1200);
  }, []);

  // ---- Move VFX triggers ----
  const triggerMoveVfx = useCallback((move: BattleMove, isPlayer: boolean) => {
    const setVfx = isPlayer ? setPlayerBeastVfx : setOpponentBeastVfx;

    switch (move.id) {
      case 'slash_protocol':
        showMoveName(move.name, "hsl(var(--neon-claw))");
        triggerVfx('chromatic-flash', 500);
        break;
      case 'hydraulic_maul':
        showMoveName(move.name, "hsl(var(--rust-gold))");
        setHeavyShake(true);
        setTimeout(() => setHeavyShake(false), 500);
        break;
      case 'tail_whip':
        showMoveName(move.name, "hsl(var(--toxic-shard))");
        setVfx('vfx-tail-whip');
        setTimeout(() => setVfx(''), 350);
        break;
      case 'rust_shrapnel':
        showMoveName(move.name, "hsl(var(--rust-gold))");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        break;
      case 'welding_torch':
        showMoveName(move.name, "hsl(var(--rust-gold))");
        triggerVfx('torch-beam', 800);
        break;
      case 'prismatic_lance':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        triggerVfx('prismatic-ray', 600);
        break;
      case 'shard_storm':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        setVfx('vfx-shard-storm');
        setTimeout(() => setVfx(''), 600);
        break;
      case 'null_cascade':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        setVfx('vfx-null-cascade');
        setShowRealityTear(true);
        setShowStaticOverlay(true);
        setTimeout(() => { setVfx(''); setShowRealityTear(false); }, 1000);
        setTimeout(() => setShowStaticOverlay(false), 1500);
        // Color invert victim
        const victimSet = isPlayer ? setOpponentBeastVfx : setPlayerBeastVfx;
        victimSet('vfx-color-invert');
        setTimeout(() => victimSet(''), 800);
        break;
      case 'glitch_echo':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        setShowStaticOverlay(true);
        setTimeout(() => setShowStaticOverlay(false), 800);
        break;
      case 'berserk_overdrive':
        showMoveName(move.name, "hsl(var(--neon-claw))");
        triggerVfx('berserk-flash', 600);
        setPlayerBerserkScale(true);
        break;
      case 'disconnect_forfeit':
        showMoveName("D I S C O N N E C T E D", "hsl(var(--neon-claw))");
        setShowDisconnectStamp(true);
        break;
      case 'guardian_counter':
        showMoveName(move.name, "hsl(var(--toxic-shard))");
        setShowGuardianShield(true);
        setGuardianCounterActive(true);
        setTimeout(() => setShowGuardianShield(false), 2000);
        break;
      case 'taunt_broadcast':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        setShowTauntText(getRandomItem(move.attackerLines[PLAYER_PERSONALITY] || move.attackerLines['aggressive'] || ['...']));
        setTimeout(() => setShowTauntText(null), 2500);
        break;
      case 'precision_strike':
        showMoveName(move.name, "hsl(var(--neon-claw))");
        triggerVfx('slow-mo', 1000);
        break;
      case 'ambush_protocol':
        showMoveName(move.name, "hsl(var(--rust-gold))");
        setVfx('vfx-fake-death');
        setTimeout(() => setVfx(''), 1200);
        break;
      case 'style_overdrive':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        setVfx('vfx-showboat');
        setTimeout(() => setVfx(''), 800);
        break;
      case 'void_surge':
        showMoveName(move.name, "hsl(var(--glitch-cyan))");
        triggerVfx('void-flash', 800);
        setShowStaticOverlay(true);
        setTimeout(() => setShowStaticOverlay(false), 1200);
        break;
      default:
        showMoveName(move.name, "hsl(var(--neon-claw))");
    }
  }, [showMoveName, triggerVfx]);

  // ---- Pre-battle intro ----
  useEffect(() => {
    if (!showPotIntro) return;
    const seq = [
      { delay: 300, fn: () => addLog("/// COMBAT PROTOCOL INITIALIZED", "system") },
      { delay: 800, fn: () => addLog("IRON MAW enters the arena", "player") },
      { delay: 1200, fn: () => addLog(getRandomItem(playerPersonality.pre_battle), "commentary") },
      { delay: 2000, fn: () => addLog("PRISMA DANCER enters the arena", "opponent") },
      { delay: 2400, fn: () => addLog(getRandomItem(opponentPersonality.pre_battle), "commentary") },
      { delay: 3200, fn: () => addLog(`/// PRIZE POT: ${pot} $CLAW`, "system") },
      { delay: 3600, fn: () => { addSpectatorReaction("pot_reaction"); addSpectatorReaction("general"); } },
      { delay: 4200, fn: () => addLog("/// ROUND 1 — FIGHT", "announcer") },
      { delay: 4500, fn: () => { setShowPotIntro(false); setTurnActive(true); inputRef.current?.focus(); } },
    ];
    const timers = seq.map(({ delay, fn }) => setTimeout(fn, delay));
    return () => timers.forEach(clearTimeout);
  }, [showPotIntro]);

  // Timer
  useEffect(() => {
    if (battleOver || showPotIntro) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [battleOver, showPotIntro]);

  // Auto-scroll
  useEffect(() => { logRef.current && (logRef.current.scrollTop = logRef.current.scrollHeight); }, [log]);
  useEffect(() => { chatRef.current && (chatRef.current.scrollTop = chatRef.current.scrollHeight); }, [chatMessages]);

  // Viewer count fluctuation
  useEffect(() => {
    if (battleOver) return;
    const i = setInterval(() => setViewerCount((v) => Math.max(50, v + Math.floor(Math.random() * 40) - 18)), 3000);
    return () => clearInterval(i);
  }, [battleOver]);

  // Random spectator chatter
  useEffect(() => {
    if (battleOver || showPotIntro) return;
    const i = setInterval(() => {
      if (Math.random() > 0.4) addSpectatorReaction("general");
    }, 2500 + Math.random() * 3000);
    return () => clearInterval(i);
  }, [battleOver, showPotIntro, addSpectatorReaction]);

  // Grow pot
  useEffect(() => {
    if (battleOver || showPotIntro) return;
    const i = setInterval(() => {
      const bump = Math.floor(Math.random() * 50) + 10;
      setPot((p) => p + bump);
      if (Math.random() > 0.6) addSpectatorReaction("pot_reaction");
    }, 8000 + Math.random() * 5000);
    return () => clearInterval(i);
  }, [battleOver, showPotIntro, addSpectatorReaction]);

  // Win/loss check
  useEffect(() => {
    if (playerHp <= 0 && !battleOver) {
      setBattleOver(true);
      setWinner("opponent");
      addLog("/// IRON MAW HAS FALLEN", "system");
      addLog(`PRISMA DANCER CLAIMS ${pot} $CLAW`, "critical");
      addLog(getRandomItem(opponentPersonality.react_winning), "commentary");
      addLog(getRandomItem(playerPersonality.react_losing), "commentary");
      setTimeout(() => { addSpectatorReaction("defeat"); addSpectatorReaction("defeat"); }, 500);
    } else if (opponentHp <= 0 && !battleOver) {
      setBattleOver(true);
      setWinner("player");
      addLog("/// PRISMA DANCER ELIMINATED", "system");
      addLog(`IRON MAW CLAIMS ${pot} $CLAW`, "critical");
      addLog(getRandomItem(playerPersonality.react_winning), "commentary");
      addLog(getRandomItem(opponentPersonality.react_losing), "commentary");
      setTimeout(() => { addSpectatorReaction("victory"); addSpectatorReaction("victory"); }, 500);
    }
  }, [playerHp, opponentHp, battleOver]);

  // Berserk threshold
  useEffect(() => {
    if (rage >= 90 && !berserk) {
      setBerserk(true);
      addLog("/// WARNING: BERSERK MODE ACTIVATED", "critical");
      addLog(getRandomItem(playerPersonality.berserk), "commentary");
      addLog(getRandomItem(ANNOUNCER_LINES.berserk), "announcer");
      addSpectatorReaction("general");
    }
  }, [rage, berserk]);

  // ---- Damage helpers ----
  const triggerPlayerDamage = useCallback((dmg: number, isCrit: boolean) => {
    // If guardian counter is active, reflect 50%
    if (guardianCounterActive) {
      const reflected = Math.round(dmg * 0.5);
      setGuardianCounterActive(false);
      setShowGuardianShield(false);
      addLog(`/// GUARDIAN COUNTER — ${reflected} DAMAGE REFLECTED`, "critical");
      addDamagePopup(reflected, false, false, "opponent");
      setOpponentHp((hp) => Math.max(0, hp - reflected));
      dmg = Math.round(dmg * 0.5); // reduced incoming
      addSpectatorReaction("opponent_hit");
    }

    setPlayerHp((hp) => Math.max(0, hp - dmg));
    setPlayerDamageFlash(true);
    setShaking(true);
    setSloshing(true);
    setRage((r) => Math.min(100, r + Math.floor(dmg / 2)));
    addDamagePopup(dmg, isCrit, false, "player");
    if (isCrit) triggerVfx('crit-vignette', 600);
    setTimeout(() => setPlayerDamageFlash(false), 300);
    setTimeout(() => setShaking(false), 400);
    setTimeout(() => setSloshing(false), 1200);
  }, [guardianCounterActive, addDamagePopup, triggerVfx, addLog, addSpectatorReaction]);

  const triggerOpponentDamage = useCallback((dmg: number, isCrit: boolean) => {
    setOpponentHp((hp) => Math.max(0, hp - dmg));
    setOpponentDamageFlash(true);
    setSloshing(true);
    addDamagePopup(dmg, isCrit, false, "opponent");
    if (isCrit) triggerVfx('crit-vignette', 600);
    setTimeout(() => setOpponentDamageFlash(false), 300);
    setTimeout(() => setSloshing(false), 1200);
  }, [addDamagePopup, triggerVfx]);

  // ---- Execute a move ----
  const executePlayerMove = useCallback((move: BattleMove) => {
    setTurnActive(false);
    setShowMoveSelect(false);

    // Special: Disconnect Forfeit
    if (move.id === 'disconnect_forfeit') {
      addLog(move.windupText, "system");
      triggerMoveVfx(move, true);
      setTimeout(() => {
        addLog(move.impactText, "critical");
        addLog(getMoveCommentary(move, 'attacker', PLAYER_PERSONALITY), "commentary");
        addLog(getRandomItem(move.announcerLines), "announcer");
        move.spectatorReactions.forEach((r) => addChat(getRandomItem(SPECTATOR_NAMES), r));
        setBattleOver(true);
        setWinner("opponent");
        addLog(`PRISMA DANCER CLAIMS ${pot} $CLAW BY RAGE QUIT`, "critical");
      }, 1500);
      return;
    }

    // Special: Style Overdrive (no damage)
    if (move.id === 'style_overdrive') {
      addLog(move.windupText, "system");
      triggerMoveVfx(move, true);
      setTimeout(() => {
        addLog(move.impactText, "move_name");
        addLog(getMoveCommentary(move, 'attacker', PLAYER_PERSONALITY), "commentary");
        addLog(getRandomItem(move.announcerLines), "announcer");
        // Hype explosion
        for (let i = 0; i < 5; i++) {
          setTimeout(() => addChat(getRandomItem(SPECTATOR_NAMES), getRandomItem(move.spectatorReactions)), i * 200);
        }
        setPot((p) => p + Math.floor(Math.random() * 100) + 50);
        setRage((r) => Math.max(0, r - 20));
        // Opponent turn
        setTimeout(() => executeOpponentTurn(), 800);
      }, 600);
      return;
    }

    // Special: Guardian Counter (buff, no immediate damage)
    if (move.id === 'guardian_counter') {
      addLog(move.windupText, "system");
      triggerMoveVfx(move, true);
      setTimeout(() => {
        addLog(move.impactText, "move_name");
        addLog(getMoveCommentary(move, 'attacker', PLAYER_PERSONALITY), "commentary");
        addLog("/// NEXT INCOMING ATTACK WILL BE REFLECTED 50%", "system");
        addLog(getRandomItem(move.announcerLines), "announcer");
        addChat(getRandomItem(SPECTATOR_NAMES), getRandomItem(move.spectatorReactions));
        setTimeout(() => executeOpponentTurn(), 600);
      }, 500);
      return;
    }

    // Standard damage moves
    const { damage, isCrit, selfDamage } = calculateDamage(move, berserk);

    // Windup
    addLog(move.windupText, "system");

    setTimeout(() => {
      // VFX
      triggerMoveVfx(move, true);

      setTimeout(() => {
        // Impact
        addLog(`${move.impactText} — ${damage} DAMAGE${isCrit ? " [CRITICAL]" : ""}`, isCrit ? "critical" : "damage");
        triggerOpponentDamage(damage, isCrit);

        // Attacker commentary
        addLog(getMoveCommentary(move, 'attacker', PLAYER_PERSONALITY), "commentary");

        // Spectator reaction
        addChat(getRandomItem(SPECTATOR_NAMES), getRandomItem(move.spectatorReactions));
        if (isCrit || damage > 25) {
          addSpectatorReaction("big_damage", { dmg: String(damage) });
          addLog(getRandomItem(move.announcerLines), "announcer");
        }

        // Self-damage (berserk moves)
        if (selfDamage > 0) {
          setTimeout(() => {
            addLog(`/// SELF-DAMAGE: ${selfDamage} HP (OVERDRIVE COST)`, "critical");
            setPlayerHp((hp) => Math.max(1, hp - selfDamage));
            addDamagePopup(selfDamage, false, false, "player");
          }, 300);
        }

        // Rage adjustment
        if (move.effect.rageChange) {
          setRage((r) => Math.max(0, Math.min(100, r + move.effect.rageChange!)));
        }

        // Taunt broadcast stun
        if (move.id === 'taunt_broadcast') {
          setOpponentStunned((s) => s + 1);
        }

        // Void surge random effect
        if (move.id === 'void_surge') {
          const outcomes = ['heal_self', 'damage_both', 'big_damage'];
          const outcome = getRandomItem(outcomes);
          setTimeout(() => {
            if (outcome === 'heal_self') {
              const heal = Math.floor(Math.random() * 20) + 10;
              addLog(`/// VOID SURGE OUTCOME: SELF-HEAL +${heal} HP`, "system");
              setPlayerHp((hp) => Math.min(100, hp + heal));
              addDamagePopup(heal, false, true, "player");
            } else if (outcome === 'damage_both') {
              const bothDmg = Math.floor(Math.random() * 15) + 5;
              addLog(`/// VOID SURGE OUTCOME: BOTH DAMAGED ${bothDmg} HP`, "system");
              setPlayerHp((hp) => Math.max(1, hp - bothDmg));
              setOpponentHp((hp) => Math.max(0, hp - bothDmg));
              addDamagePopup(bothDmg, false, false, "player");
              addDamagePopup(bothDmg, false, false, "opponent");
            } else {
              const extra = Math.floor(Math.random() * 25) + 15;
              addLog(`/// VOID SURGE OUTCOME: EXTRA ${extra} DAMAGE TO OPPONENT`, "critical");
              triggerOpponentDamage(extra, true);
            }
            addChat(getRandomItem(SPECTATOR_NAMES), "WHAT JUST HAPPENED");
          }, 500);
        }

        // Opponent turn
        setTimeout(() => {
          if (opponentHp - damage <= 0) return;
          executeOpponentTurn();
        }, 800);
      }, 200);
    }, 300);
  }, [berserk, opponentHp, pot, addLog, triggerOpponentDamage, triggerMoveVfx, addChat, addSpectatorReaction, addDamagePopup]);

  // ---- Opponent turn ----
  const executeOpponentTurn = useCallback(() => {
    if (opponentStunned > 0) {
      setOpponentStunned((s) => s - 1);
      addLog("/// OPPONENT STUNNED — SKIPPING TURN", "system");
      addLog(getRandomItem(ANNOUNCER_LINES.round_start).replace("{round}", String(round + 1)), "announcer");
      setRound((r) => r + 1);
      setTurnActive(true);
      inputRef.current?.focus();
      return;
    }

    const oppMoves = getAvailableMoves(OPPONENT_BIOME, OPPONENT_PERSONALITY, 30);
    const oppMove = getRandomItem(oppMoves.filter(m => m.category !== 'personality'));
    const { damage: oppDmg, isCrit: oppCrit } = calculateDamage(oppMove, false);

    addLog(`PRISMA DANCER uses ${oppMove.name}`, "opponent");

    setTimeout(() => {
      addLog(`${oppMove.name} — ${oppDmg} DAMAGE${oppCrit ? " [CRITICAL]" : ""}`, oppCrit ? "critical" : "damage");
      triggerPlayerDamage(oppDmg, oppCrit);

      // Victim commentary (player reacting to being hit)
      addLog(getMoveCommentary(oppMove, 'victim', PLAYER_PERSONALITY), "commentary");
      // Attacker commentary (opponent)
      addLog(getMoveCommentary(oppMove, 'attacker', OPPONENT_PERSONALITY), "commentary");
      addSpectatorReaction("player_hit");

      setTimeout(() => {
        const newPlayerHp = playerHp - oppDmg;
        if (newPlayerHp < 30 && newPlayerHp > 0) {
          addLog(getRandomItem(ANNOUNCER_LINES.low_hp).replace("{name}", "IRON MAW"), "announcer");
          addLog(getRandomItem(playerPersonality.react_low_hp), "commentary");
        }

        setRound((r) => r + 1);
        addLog(getRandomItem(ANNOUNCER_LINES.round_start).replace("{round}", String(round + 1)), "announcer");
        setTurnActive(true);
        inputRef.current?.focus();
      }, 600);
    }, 500);
  }, [opponentStunned, round, playerHp, addLog, triggerPlayerDamage, addSpectatorReaction, playerPersonality]);

  // ---- Command handler ----
  const handleCommand = useCallback(() => {
    if (!command.trim() || !turnActive || battleOver) return;
    const cmd = command.trim().toUpperCase();
    setCommand("");

    // Check for improv command
    const improvMove = matchImprovCommand(cmd);
    if (improvMove) {
      addLog(`> ${cmd}`, "player");
      addLog(`/// IMPROV COMMAND RECOGNIZED: ${improvMove.name}`, "system");
      executePlayerMove(improvMove);
      return;
    }

    // Otherwise pick a random core/biome move based on input
    addLog(`> ${cmd}`, "player");
    const availableMoves = getAvailableMoves(PLAYER_BIOME, PLAYER_PERSONALITY, rage);
    const selectedMove = getRandomItem(availableMoves.filter(m => m.category !== 'personality' || rage >= 70));
    executePlayerMove(selectedMove);
  }, [command, turnActive, battleOver, rage, addLog, executePlayerMove]);

  // ---- Move selection ----
  const handleMoveSelect = useCallback((move: BattleMove) => {
    if (!turnActive || battleOver) return;
    addLog(`> ${move.name}`, "player");
    executePlayerMove(move);
  }, [turnActive, battleOver, addLog, executePlayerMove]);

  const handleSurrender = useCallback(() => {
    if (battleOver) return;
    setBattleOver(true);
    setWinner("opponent");
    addLog("/// SURRENDER PROTOCOL EXECUTED", "system");
    addLog("IRON MAW RETREATS — COWARD", "critical");
    addLog(getRandomItem(playerPersonality.react_losing), "commentary");
    addLog(`PRISMA DANCER CLAIMS ${pot} $CLAW BY FORFEIT`, "announcer");
    addSpectatorReaction("defeat");
    addSpectatorReaction("defeat");
  }, [battleOver, addLog, pot, addSpectatorReaction, playerPersonality]);

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    addChat("YOU", chatInput.trim());
    setChatInput("");
  }, [chatInput, addChat]);

  // Available moves for selection panel
  const availableMoves = getAvailableMoves(PLAYER_BIOME, PLAYER_PERSONALITY, rage);

  const logColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "system": return "text-muted-foreground";
      case "player": return "text-neon-claw";
      case "opponent": return "text-glitch-cyan";
      case "damage": return "text-rust-gold";
      case "critical": return "text-neon-claw font-bold";
      case "commentary": return "text-foreground/70 italic";
      case "announcer": return "text-rust-gold font-bold";
      case "move_name": return "text-toxic-shard font-bold uppercase";
    }
  };

  const hpColor = (hp: number) => {
    if (hp > 60) return "hsl(var(--toxic-shard))";
    if (hp > 30) return "hsl(var(--rust-gold))";
    return "hsl(var(--neon-claw))";
  };

  const moveCategoryColor = (cat: BattleMove['category']) => {
    switch (cat) {
      case 'core': return 'border-neon-claw/40 text-neon-claw';
      case 'biome_scrap': return 'border-rust-gold/40 text-rust-gold';
      case 'biome_crystal': return 'border-glitch-cyan/40 text-glitch-cyan';
      case 'biome_void': return 'border-glitch-cyan/40 text-glitch-cyan';
      case 'personality': return 'border-neon-claw/60 text-neon-claw';
      case 'improv': return 'border-toxic-shard/40 text-toxic-shard';
    }
  };

  return (
    <div className={`min-h-screen bg-background overflow-hidden relative scanlines vignette arena-grid ${shaking ? "impact-shake" : ""} ${heavyShake ? "vfx-heavy-shake" : ""}`}>
      {berserk && <div className="berserk-overlay" />}
      {showRealityTear && <div className="vfx-reality-tear" />}
      {showStaticOverlay && <div className="vfx-static-overlay" />}
      {showDisconnectStamp && (
        <div className="vfx-disconnect-stamp">
          <span>DISCONNECTED</span>
        </div>
      )}
      {showTauntText && (
        <div className="vfx-taunt-text">
          <span>{showTauntText}</span>
        </div>
      )}
      {activeVfx.some(v => v.type === 'crit-vignette') && <div className="vfx-crit-vignette" />}
      {activeVfx.some(v => v.type === 'berserk-flash') && <div className="vfx-berserk-flash" />}
      {activeVfx.some(v => v.type === 'void-flash') && <div className="vfx-void-flash" />}
      {activeVfx.some(v => v.type === 'slow-mo') && <div className="vfx-slow-mo" />}

      {/* Move name flash */}
      {moveNameFlash && (
        <div className="vfx-move-name" style={{ color: moveNameFlash.color }}>
          {moveNameFlash.text}
        </div>
      )}

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
            <div className={`hp-tube h-5 bg-void-black relative ${sloshing ? "hp-sloshing" : ""}`}>
              <div className="hp-tube-liquid" style={{ height: `${playerHp}%`, background: `linear-gradient(0deg, ${hpColor(playerHp)}, ${hpColor(playerHp)}cc)` }} />
              <div className="hp-tube-segments" />
              <div className="hp-bolt top-0 left-0" /><div className="hp-bolt top-0 right-0" />
              <div className="hp-bolt bottom-0 left-0" /><div className="hp-bolt bottom-0 right-0" />
            </div>
          </div>
        </div>

        {/* Center info with pot */}
        <div className="flex flex-col items-center justify-center px-4 border-x border-border min-w-[160px]">
          <span className="font-data text-[9px] uppercase tracking-[0.3em] text-muted-foreground">ROUND</span>
          <span className="font-display text-2xl font-bold text-foreground">{round}</span>
          <span className="font-data text-[10px] text-muted-foreground">{getTimestamp(timer)}</span>
          <div className="mt-1 px-2 py-0.5 border border-rust-gold/40 bg-rust-gold/10">
            <span className="font-data text-[9px] text-rust-gold font-bold tracking-wider">POT: {pot} $CLAW</span>
          </div>
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
              <div className="hp-tube-liquid" style={{ height: `${opponentHp}%`, background: `linear-gradient(0deg, ${hpColor(opponentHp)}, ${hpColor(opponentHp)}cc)` }} />
              <div className="hp-tube-segments" />
              <div className="hp-bolt top-0 left-0" /><div className="hp-bolt top-0 right-0" />
              <div className="hp-bolt bottom-0 left-0" /><div className="hp-bolt bottom-0 right-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Main arena area */}
      <div className="relative z-10 flex" style={{ height: "calc(100vh - 76px - 56px)" }}>
        {/* Beast display area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Player beast */}
          <div className="absolute left-[10%] bottom-[15%] w-[35%] max-w-[300px]">
            <div className={`relative border border-neon-claw/20 bg-card/20 overflow-hidden ${playerBeastVfx} ${playerBerserkScale ? "vfx-beast-berserk" : ""}`}>
              <img src={beastIronmaw} alt="Iron Maw" className="w-full aspect-square object-cover" />
              {playerDamageFlash && <div className="damage-overlay" />}
              {playerBerserkScale && <div className="vfx-vein-overlay" />}
              {showGuardianShield && <div className="vfx-guardian-shield" />}
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
            {/* Player damage popups */}
            {damagePopups.filter(p => p.side === "player").map((p) => (
              <div key={p.id} className={`vfx-damage-number ${p.isCrit ? "crit" : p.isHeal ? "heal" : "normal"}`}
                   style={{ left: `${30 + Math.random() * 40}%`, top: `${20 + Math.random() * 30}%` }}>
                {p.isHeal ? `+${p.value}` : `-${p.value}`}
              </div>
            ))}
          </div>

          {/* Opponent beast */}
          <div className="absolute right-[10%] top-[10%] w-[30%] max-w-[260px]">
            <div className={`relative border border-glitch-cyan/20 bg-card/20 overflow-hidden ${opponentBeastVfx}`}>
              <img src={beastPrisma} alt="Prisma Dancer" className="w-full aspect-square object-cover" />
              {opponentDamageFlash && <div className="damage-overlay" />}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-glitch-cyan/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-glitch-cyan/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-glitch-cyan/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-glitch-cyan/50" />
            </div>
            {/* Opponent damage popups */}
            {damagePopups.filter(p => p.side === "opponent").map((p) => (
              <div key={p.id} className={`vfx-damage-number ${p.isCrit ? "crit" : p.isHeal ? "heal" : "normal"}`}
                   style={{ left: `${30 + Math.random() * 40}%`, top: `${20 + Math.random() * 30}%` }}>
                {p.isHeal ? `+${p.value}` : `-${p.value}`}
              </div>
            ))}
          </div>

          {/* VS indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-marker text-4xl text-neon-claw/20 select-none">VS</span>
          </div>

          {/* Viewer count */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-card/80 border border-border backdrop-blur-sm">
            <div className="w-2 h-2 bg-neon-claw animate-pulse" />
            <span className="font-data text-[9px] text-foreground uppercase tracking-wider">LIVE</span>
            <span className="font-data text-[9px] text-muted-foreground">{viewerCount.toLocaleString()} watching</span>
          </div>

          {/* Move selection panel */}
          {showMoveSelect && turnActive && !battleOver && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-card/95 border border-border backdrop-blur-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">SELECT MOVE</span>
                <button onClick={() => setShowMoveSelect(false)} className="font-data text-[9px] text-muted-foreground hover:text-foreground uppercase tracking-wider">CLOSE</button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
                {availableMoves.map((move) => (
                  <button
                    key={move.id}
                    onClick={() => handleMoveSelect(move)}
                    className={`text-left p-2 border ${moveCategoryColor(move.category)} bg-card/50 hover:bg-card transition-colors`}
                  >
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider block">{move.name}</span>
                    <span className="font-data text-[8px] text-muted-foreground block mt-0.5">
                      DMG: {move.effect.value} {move.effect.selfDamage ? `/ SELF: -${move.effect.selfDamage}` : ""}
                    </span>
                  </button>
                ))}
              </div>
              <p className="font-data text-[8px] text-muted-foreground/50 mt-2 uppercase tracking-wider">
                OR TYPE IMPROV: "GO FOR THE EYES" / "PLAY DEAD" / "SHOWBOAT" / "OVERCHARGE"
              </p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-[340px] border-l border-border flex flex-col bg-card/50">
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
              <div className="h-full transition-all duration-500" style={{ width: `${rage}%`, background: rage >= 90 ? `linear-gradient(90deg, hsl(var(--neon-claw)), hsl(var(--rust-gold)))` : rage >= 50 ? `hsl(var(--rust-gold))` : `hsl(var(--neon-claw) / 0.6)` }} />
              {[25, 50, 75].map((tick) => (
                <div key={tick} className="absolute top-0 bottom-0 w-px bg-static-gray-light/40" style={{ left: `${tick}%` }} />
              ))}
            </div>
            {berserk && <p className="font-data text-[9px] text-neon-claw mt-1 uppercase tracking-wider">/// BERSERK — DAMAGE +50%</p>}
            {rage >= 70 && !berserk && <p className="font-data text-[9px] text-rust-gold mt-1 uppercase tracking-wider">/// BERSERK OVERDRIVE UNLOCKED</p>}
          </div>

          {/* Battle log */}
          <div className="flex-1 flex flex-col min-h-0" style={{ maxHeight: "45%" }}>
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

          {/* Spectator chat */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-border">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-claw animate-pulse" />
                <span className="font-data text-[9px] uppercase tracking-[0.2em] text-muted-foreground">LIVE CHAT</span>
              </div>
              <span className="font-data text-[8px] text-muted-foreground/50">{viewerCount} viewers</span>
            </div>
            <div ref={chatRef} className="spectator-chat flex-1 overflow-y-auto p-2 space-y-0.5">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-entry flex gap-1.5 text-[10px]">
                  <span className={`font-data font-bold flex-shrink-0 ${msg.name === "YOU" ? "text-toxic-shard" : msg.color}`}>
                    {msg.name}:
                  </span>
                  <span className="font-data text-foreground/80">{msg.text}</span>
                </div>
              ))}
              {chatMessages.length === 0 && (
                <p className="font-data text-[9px] text-muted-foreground/40 text-center py-4">waiting for chat...</p>
              )}
            </div>
            <div className="p-2 border-t border-border flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value.slice(0, 80))}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Say something..."
                maxLength={80}
                className="flex-1 bg-void-black border border-static-gray px-2 py-1 font-data text-[10px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-toxic-shard/50"
              />
              <button onClick={handleChatSend} className="px-2 py-1 border border-toxic-shard/40 bg-toxic-shard/10 font-data text-[9px] text-toxic-shard uppercase tracking-wider hover:bg-toxic-shard/20 transition-colors">
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom command dock */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 p-3">
          <button
            onClick={handleSurrender}
            disabled={battleOver}
            className="flex items-center gap-1.5 px-3 py-2 border border-rust-gold/40 bg-rust-gold/5 font-data text-[10px] uppercase tracking-wider text-rust-gold hover:bg-rust-gold/15 transition-colors disabled:opacity-30"
          >
            <SurrenderFlagIcon size={14} className="text-rust-gold" />
            SURRENDER
          </button>
          <button
            onClick={() => setShowMoveSelect(!showMoveSelect)}
            disabled={!turnActive || battleOver}
            className="px-3 py-2 border border-glitch-cyan/40 bg-glitch-cyan/5 font-data text-[10px] uppercase tracking-wider text-glitch-cyan hover:bg-glitch-cyan/15 transition-colors disabled:opacity-30"
          >
            MOVES
          </button>
          <div className="flex-1 flex items-center gap-2 border border-toxic-shard/30 bg-void-black px-3 py-2">
            <TransmitIcon size={14} className="text-toxic-shard/60 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value.slice(0, 50))}
              onKeyDown={(e) => e.key === "Enter" && handleCommand()}
              placeholder={battleOver ? "COMBAT ENDED" : turnActive ? "TYPE COMMAND OR IMPROV..." : "AWAITING RESPONSE..."}
              disabled={!turnActive || battleOver}
              maxLength={50}
              className="terminal-input flex-1 bg-transparent font-data text-xs text-toxic-shard placeholder:text-toxic-shard/30 outline-none border-none uppercase tracking-wider disabled:opacity-30"
            />
            <span className="font-data text-[9px] text-muted-foreground/40">{command.length}/50</span>
          </div>
          <button
            onClick={handleCommand}
            disabled={!command.trim() || !turnActive || battleOver}
            className="px-4 py-2 border border-neon-claw bg-neon-claw/10 font-display text-xs font-bold uppercase tracking-wider text-neon-claw hover:bg-neon-claw hover:text-primary-foreground transition-colors disabled:opacity-30 disabled:hover:bg-neon-claw/10 disabled:hover:text-neon-claw"
          >
            TRANSMIT
          </button>
        </div>
      </div>

      {/* Battle over overlay */}
      {battleOver && winner && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-void-black/80 backdrop-blur-sm">
          <div className="text-center">
            <p className={`font-display text-3xl font-bold uppercase tracking-wider ${winner === "player" ? "text-toxic-shard" : "text-neon-claw"} chromatic`}>
              {winner === "player" ? "GENETIC DOMINANCE CONFIRMED" : "SPECIMEN NEUTRALIZED"}
            </p>
            <div className="mt-2 px-4 py-2 border border-rust-gold/50 bg-rust-gold/10 inline-block">
              <p className="font-data text-sm text-rust-gold font-bold">
                {winner === "player" ? `+${pot} $CLAW WON` : `-${pot} $CLAW LOST`}
              </p>
            </div>
            <p className="font-data text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
              ROUNDS: {round} // TIME: {getTimestamp(timer)} // RAGE PEAK: {rage}%
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 border border-foreground/30 bg-card font-data text-[10px] uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              EXIT ARENA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;
