// ============================================
// CLAW QUEST — Complete Move & Attack System
// ============================================

export interface MoveEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  target: 'opponent' | 'self' | 'both' | 'arena';
  value: number;
  /** Self-damage on use (berserk moves) */
  selfDamage?: number;
  /** Multiplier variance — final damage = base * (1 ± variance) */
  variance?: number;
  /** Guaranteed crit */
  guaranteedCrit?: boolean;
  /** Reflect percentage of next incoming attack */
  reflectPercent?: number;
  /** Stun duration in turns */
  stunTurns?: number;
  /** Rage meter change */
  rageChange?: number;
  /** Spectator hype bonus (fills chat) */
  hypeBonus?: number;
}

export interface BattleMove {
  id: string;
  name: string;
  category: 'core' | 'biome_scrap' | 'biome_crystal' | 'biome_void' | 'personality' | 'improv';
  description: string;
  /** Terminal display during windup */
  windupText: string;
  /** Terminal display on impact */
  impactText: string;
  /** CSS class applied to arena during this move */
  vfxClass: string;
  /** Color token for trail/particles */
  trailColor: string;
  effect: MoveEffect;
  /** Personality required (null = any) */
  personalityReq?: string;
  /** Improv command trigger (exact uppercase match) */
  improvTrigger?: string;
  /** Beast commentary lines when using this move */
  attackerLines: Record<string, string[]>;
  /** Beast commentary lines when hit by this move */
  victimLines: Record<string, string[]>;
  /** Announcer lines */
  announcerLines: string[];
  /** Spectator reactions */
  spectatorReactions: string[];
}

// ============================================
// 1. CORE CLAW ARSENAL
// ============================================

const SLASH_PROTOCOL: BattleMove = {
  id: 'slash_protocol',
  name: 'SLASH PROTOCOL',
  category: 'core',
  description: 'Hydraulic claw extends 2x — neon-claw particle trail — chromatic aberration flash on impact',
  windupText: '/// HYDRAULIC CLAW EXTENDING...',
  impactText: 'SLASH PROTOCOL — DIRECT HIT',
  vfxClass: 'vfx-slash-protocol',
  trailColor: 'neon-claw',
  effect: { type: 'damage', target: 'opponent', value: 18, variance: 0.3 },
  attackerLines: {
    aggressive: ['FEEL THE CLAW, INSECT', 'SLASH THROUGH YOUR ARMOR LIKE PAPER', 'MY CLAWS HUNGER FOR YOUR CIRCUITS'],
    calculated: ['CLAW TRAJECTORY OPTIMIZED', 'STRIKE VECTOR CONFIRMED — EXECUTING', 'PRECISION CUT ALONG STRUCTURAL WEAKNESS'],
    unstable: ['W̸̡̆H̸̱̑I̷̛̱C̸̣̊H̸̱̑ ̵̱̈C̸̣̊L̵̘̈Ä̴̠́W̸̡̆ ̵̱̈W̸̡̆Ä̴̠́S̵̱̈ ̵̱̈T̶̗̾H̸̱̑Ä̴̠́T̶̗̾?̸̨̛', 'SLASH FROM EVERY TIMELINE AT ONCE', 'THE CLAWS MOVE ON THEIR OWN NOW'],
  },
  victimLines: {
    aggressive: ['THAT SCRATCH? PATHETIC.', 'IS THAT ALL YOUR CLAW CAN DO?'],
    calculated: ['STRUCTURAL DAMAGE: MINIMAL. RECALIBRATING.', 'NOTED. THAT ATTACK PATTERN HAS BEEN LOGGED.'],
    unstable: ['D̶̰̀I̷̛̱D̶̰̀ ̵̱̈Y̸̡̆Ö̴̡Ü̸̡ ̵̱̈H̸̱̑I̷̛̱T̶̗̾ ̵̱̈M̸̲̊Ë̸̡?̸̨̛ ̵̱̈I̷̛̱ ̵̱̈C̸̣̊Ö̴̡Ü̸̡L̵̘̈D̶̰̀N̸̲̈\'̵̱̈T̶̗̾ ̵̱̈T̶̗̾Ë̸̡L̵̘̈L̵̘̈', 'PAIN IS JUST A FREQUENCY'],
  },
  announcerLines: [
    'SLASH PROTOCOL DEPLOYED — CLEAN HIT!',
    'THE CLAW EXTENDS AND CONNECTS! BRUTAL!',
    'HYDRAULIC SLASH TEARS THROUGH THE ARENA!',
  ],
  spectatorReactions: [
    'SLASH PROTOCOL LETS GO', 'those claws are NASTY', 'rip their armor off',
    'classic slash never gets old', 'HYDRAULIC CLAW GO BRRRR',
  ],
};

const HYDRAULIC_MAUL: BattleMove = {
  id: 'hydraulic_maul',
  name: 'HYDRAULIC MAUL',
  category: 'core',
  description: 'Both claws lock into battering ram — camera shake + rust-gold impact rings',
  windupText: '/// CLAWS LOCKING — BATTERING RAM FORMATION...',
  impactText: 'HYDRAULIC MAUL — DEVASTATING IMPACT',
  vfxClass: 'vfx-hydraulic-maul',
  trailColor: 'rust-gold',
  effect: { type: 'damage', target: 'opponent', value: 25, variance: 0.2 },
  attackerLines: {
    aggressive: ['FEEL THE FULL WEIGHT OF MY HATRED', 'BATTERING RAM THROUGH YOUR SKULL', 'MAUL PROTOCOL — NO SURVIVORS'],
    calculated: ['MAXIMUM FORCE CONCENTRATED IN SINGLE POINT', 'IMPACT VELOCITY: TERMINAL', 'ALL POWER ROUTED TO PRIMARY HYDRAULICS'],
    unstable: ['B̸̡̆Ö̴̡T̶̗̾H̸̱̑ ̵̱̈Ä̴̠́R̸̖̈́M̸̲̊S̵̱̈ ̵̱̈M̸̲̊Ö̴̡V̸̡̆Ë̸̡ ̵̱̈Ö̴̡N̸̲̈ ̵̱̈T̶̗̾H̸̱̑Ë̸̡I̷̛̱R̸̖̈́ ̵̱̈Ö̴̡W̸̡̆N̸̲̈', 'REALITY BENDS AROUND THE IMPACT ZONE'],
  },
  victimLines: {
    aggressive: ['NGH— THAT ONE I FELT IN MY CORE', 'YOU\'LL PAY FOR EVERY DENT'],
    calculated: ['SIGNIFICANT STRUCTURAL COMPROMISE DETECTED', 'RECALCULATING... THAT WAS ABOVE PREDICTED OUTPUT'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈W̸̡̆Ö̴̡R̸̖̈́L̵̘̈D̶̰̀ ̵̱̈S̵̱̈H̸̱̑Ö̴̡Ö̴̡K̸̡̆', 'WAS THAT AN EARTHQUAKE OR YOU?'],
  },
  announcerLines: [
    'HYDRAULIC MAUL CONNECTS! THE ARENA SHAKES!',
    'BATTERING RAM MODE! INCREDIBLE FORCE!',
    'DOUBLE-CLAW MAUL — THE CROWD CAN FEEL THAT ONE!',
  ],
  spectatorReactions: [
    'THE WHOLE SCREEN SHOOK', 'battering ram is INSANE', 'that beast is a TANK',
    'MAUL PROTOCOL ACTIVATED', 'i felt that through my screen',
  ],
};

const TAIL_WHIP_OVERLOAD: BattleMove = {
  id: 'tail_whip',
  name: 'TAIL WHIP OVERLOAD',
  category: 'core',
  description: 'Tail coils and releases — toxic-shard sparks along whip path — multi-hit for Unstable trait',
  windupText: '/// TAIL COILING — SPRING TENSION MAXIMUM...',
  impactText: 'TAIL WHIP OVERLOAD — METALLIC TWANG',
  vfxClass: 'vfx-tail-whip',
  trailColor: 'toxic-shard',
  effect: { type: 'damage', target: 'opponent', value: 14, variance: 0.4 },
  attackerLines: {
    aggressive: ['WHIP CRACK THROUGH YOUR DEFENSES', 'MY TAIL IS FASTER THAN YOUR EYES', 'COIL AND STRIKE — LIKE A STEEL SERPENT'],
    calculated: ['KINETIC ENERGY STORED AND RELEASED — EFFICIENT', 'WHIP TRAJECTORY ACCOUNTS FOR WIND RESISTANCE', 'SPRING-LOADED PRECISION'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈T̶̗̾Ä̴̠́I̷̛̱L̵̘̈ ̵̱̈H̸̱̑Ä̴̠́S̵̱̈ ̵̱̈Ä̴̠́ ̵̱̈M̸̲̊I̷̛̱N̸̲̈D̶̰̀ ̵̱̈Ö̴̡F̵̱̈ ̵̱̈I̷̛̱T̶̗̾S̵̱̈ ̵̱̈Ö̴̡W̸̡̆N̸̲̈', 'MULTI-DIMENSIONAL WHIP STRIKE', 'TAIL VIBRATING ACROSS TIMELINES'],
  },
  victimLines: {
    aggressive: ['CHEAP SHOT WITH YOUR TAIL?!', 'COWARD — FACE ME WITH YOUR CLAWS'],
    calculated: ['WHIP VELOCITY EXCEEDED PREDICTIONS', 'ADJUSTING FOR TAIL-BASED ATTACKS'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈S̵̱̈P̵̗̈́Ä̴̠́R̸̖̈́K̸̡̆S̵̱̈ ̵̱̈T̶̗̾Ä̴̠́S̵̱̈T̶̗̾Ë̸̡ ̵̱̈L̵̘̈I̷̛̱K̸̡̆Ë̸̡ ̵̱̈S̵̱̈T̶̗̾Ä̴̠́T̶̗̾I̷̛̱C̸̣̊', 'THE GREEN SPARKS ARE PRETTY'],
  },
  announcerLines: [
    'TAIL WHIP OVERLOAD! TOXIC SPARKS FLY!',
    'THE METALLIC TWANG ECHOES THROUGH THE ARENA!',
    'SPRING-LOADED TAIL STRIKE — DEVASTATING!',
  ],
  spectatorReactions: [
    'WHIP IT GOOD', 'those toxic sparks tho', 'TAIL GOES BRRRR',
    'spring loaded DESTRUCTION', 'the twang sound effect tho',
  ],
};

// ============================================
// 2. BIOME SIGNATURES
// ============================================

const RUST_SHRAPNEL: BattleMove = {
  id: 'rust_shrapnel',
  name: 'RUST SHRAPNEL BARRAGE',
  category: 'biome_scrap',
  description: 'Chest panels burst — 12 jagged gear fragments in cone — rust infection overlay on hit',
  windupText: '/// CHEST PANELS UNLOCKING — PAYLOAD ARMED...',
  impactText: 'RUST SHRAPNEL BARRAGE — 12 FRAGMENTS DEPLOYED',
  vfxClass: 'vfx-rust-shrapnel',
  trailColor: 'rust-gold',
  effect: { type: 'damage', target: 'opponent', value: 22, variance: 0.35 },
  attackerLines: {
    aggressive: ['EAT SCRAP METAL, WORM', 'TWELVE PIECES OF YOUR DESTRUCTION', 'MY CHEST IS A WEAPON — SURPRISE'],
    calculated: ['FRAGMENTATION PATTERN: OPTIMAL SPREAD', 'CONE DEPLOYMENT — 94% HIT PROBABILITY', 'SHRAPNEL TRAJECTORY LOCKED'],
    unstable: ['M̸̲̊Y̸̡̆ ̵̱̈I̷̛̱N̸̲̈S̵̱̈I̷̛̱D̶̰̀Ë̸̡S̵̱̈ ̵̱̈Ä̴̠́R̸̖̈́Ë̸̡ ̵̱̈W̸̡̆Ë̸̡Ä̴̠́P̵̗̈́Ö̴̡N̸̲̈S̵̱̈', 'GEARS FLYING IN EVERY REALITY'],
  },
  victimLines: {
    aggressive: ['RUST?! ON MY ARMOR?! YOU\'LL DIE FOR THAT', 'SCRAPING YOUR GARBAGE OFF MY HULL'],
    calculated: ['RUST INFECTION SPREADING — INITIATING COUNTERMEASURES', 'CORROSIVE DAMAGE DETECTED — NOTABLE STRATEGY'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈R̸̖̈́Ü̸̡S̵̱̈T̶̗̾ ̵̱̈S̵̱̈P̵̗̈́R̸̖̈́Ë̸̡Ä̴̠́D̶̰̀S̵̱̈ ̵̱̈L̵̘̈I̷̛̱K̸̡̆Ë̸̡ ̵̱̈Ä̴̠́ ̵̱̈V̸̡̆I̷̛̱R̸̖̈́Ü̸̡S̵̱̈', 'THE RUST IS ALIVE. INTERESTING.'],
  },
  announcerLines: [
    'SHRAPNEL BARRAGE! TWELVE FRAGMENTS TEAR THROUGH!',
    'RUST INFECTION SPREADING ON CONTACT! NASTY!',
    'THE SCRAP HEAP SPECIAL — JAGGED AND BRUTAL!',
  ],
  spectatorReactions: [
    'SHRAPNEL EVERYWHERE', 'the rust is SPREADING', 'chest cannon is broken pls nerf',
    'scrap heap gang rise up', 'TETANUS DAMAGE LFG',
  ],
};

const WELDING_TORCH: BattleMove = {
  id: 'welding_torch',
  name: 'WELDING TORCH BREATH',
  category: 'biome_scrap',
  description: 'White-hot plasma beam with chromatic edges — molten drip particles',
  windupText: '/// PLASMA CHAMBER IGNITING — TEMPERATURE CRITICAL...',
  impactText: 'WELDING TORCH BREATH — WHITE-HOT ANNIHILATION',
  vfxClass: 'vfx-welding-torch',
  trailColor: 'rust-gold',
  effect: { type: 'damage', target: 'opponent', value: 28, variance: 0.15 },
  attackerLines: {
    aggressive: ['BURN IN MY FORGE FIRE', 'PLASMA BREATH — MELT YOUR CORE', 'WHITE-HOT FURY FROM MY JAWS'],
    calculated: ['PLASMA OUTPUT: 4,200 KELVIN — ABOVE MELTING POINT', 'CONCENTRATED BEAM — MAXIMUM THERMAL TRANSFER', 'TORCH BREATH — STRUCTURALLY DEVASTATING'],
    unstable: ['F̵̱̈I̷̛̱R̸̖̈́Ë̸̡ ̵̱̈F̵̱̈R̸̖̈́Ö̴̡M̸̲̊ ̵̱̈Ä̴̠́ ̵̱̈D̶̰̀I̷̛̱M̸̲̊Ë̸̡N̸̲̈S̵̱̈I̷̛̱Ö̴̡N̸̲̈ ̵̱̈T̶̗̾H̸̱̑Ä̴̠́T̶̗̾ ̵̱̈D̶̰̀Ö̴̡Ë̸̡S̵̱̈N̸̲̈\'̵̱̈T̶̗̾ ̵̱̈Ë̸̡X̸̡̆I̷̛̱S̵̱̈T̶̗̾', 'MOLTEN REALITY SPEWING FORTH'],
  },
  victimLines: {
    aggressive: ['THAT HEAT — MY ARMOR IS DRIPPING!', 'YOU DARE TORCH ME?! I\'LL RETURN THE FAVOR'],
    calculated: ['THERMAL SHIELDS COMPROMISED — CRITICAL WARNING', 'HEAT SIGNATURE OFF THE CHARTS'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈F̵̱̈I̷̛̱R̸̖̈́Ë̸̡ ̵̱̈I̷̛̱S̵̱̈ ̵̱̈P̵̗̈́R̸̖̈́Ë̸̡T̶̗̾T̶̗̾Y̸̡̆', 'MOLTEN... EVERYTHING IS MOLTEN...'],
  },
  announcerLines: [
    'WELDING TORCH BREATH! THE ARENA IS GLOWING!',
    'WHITE-HOT PLASMA — ABSOLUTELY DEVASTATING!',
    'THAT BEAM COULD CUT THROUGH ANYTHING!',
  ],
  spectatorReactions: [
    'PLASMA BREATH IS INSANE', 'everything is melting', 'FORGE FIRE LFG',
    '4200 kelvin bro chill', 'the drip particles are fire (literally)',
  ],
};

const PRISMATIC_LANCE: BattleMove = {
  id: 'prismatic_lance',
  name: 'PRISMATIC REFRACTION LANCE',
  category: 'biome_crystal',
  description: 'Horns glow — piercing beam splits into 3 on impact — rainbow chromatic intensifies with charge',
  windupText: '/// CRYSTALLINE HORNS CHARGING — PRISMATIC ALIGNMENT...',
  impactText: 'PRISMATIC LANCE — TRIPLE REFRACTION HIT',
  vfxClass: 'vfx-prismatic-lance',
  trailColor: 'glitch-cyan',
  effect: { type: 'damage', target: 'opponent', value: 24, variance: 0.25 },
  attackerLines: {
    aggressive: ['LIGHT ITSELF IS MY WEAPON', 'REFRACTED DEATH IN THREE DIRECTIONS'],
    calculated: ['BEAM ANGLE OPTIMIZED FOR MAXIMUM REFRACTION', 'TRIPLE IMPACT — EACH RAY TARGETS A WEAK POINT', 'CRYSTALLINE PRECISION AT THE SPEED OF LIGHT'],
    unstable: ['L̵̘̈I̷̛̱G̵̢͝H̸̱̑T̶̗̾ ̵̱̈B̸̡̆Ë̸̡N̸̲̈D̶̰̀S̵̱̈ ̵̱̈T̶̗̾Ö̴̡ ̵̱̈M̸̲̊Y̸̡̆ ̵̱̈W̸̡̆I̷̛̱L̵̘̈L̵̘̈', 'EVERY COLOR IS A DIFFERENT WOUND'],
  },
  victimLines: {
    aggressive: ['RAINBOWS?! YOU FIGHT WITH RAINBOWS?!', 'THOSE BEAMS STING BUT THEY WON\'T SAVE YOU'],
    calculated: ['TRIPLE IMPACT VECTORS DETECTED — COMPLEX BUT PREDICTABLE', 'LIGHT-BASED DAMAGE — DEPLOYING REFLECTIVE COUNTERMEASURES'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈C̸̣̊Ö̴̡L̵̘̈Ö̴̡R̸̖̈́S̵̱̈... ̵̱̈S̵̱̈Ö̴̡ ̵̱̈M̸̲̊Ä̴̠́N̸̲̈Y̸̡̆ ̵̱̈C̸̣̊Ö̴̡L̵̘̈Ö̴̡R̸̖̈́S̵̱̈...', 'I SEE RAINBOWS IN MY WOUNDS'],
  },
  announcerLines: [
    'PRISMATIC LANCE SPLITS INTO THREE! INCREDIBLE!',
    'TRIPLE REFRACTION HIT — CRYSTAL SPIRE TECHNIQUE!',
    'THE RAINBOW OF DESTRUCTION — BEAUTIFUL AND DEADLY!',
  ],
  spectatorReactions: [
    'RAINBOW BEAM OF DEATH', 'triple hit is so clean', 'crystal spire tech is meta',
    'prismatic lance gaming', 'that refraction tho',
  ],
};

const SHARD_STORM: BattleMove = {
  id: 'shard_storm',
  name: 'SHARD STORM',
  category: 'biome_crystal',
  description: 'Beast spins 720° — glass-like shards stick into opponent like quills (visual debuff)',
  windupText: '/// INITIATING 720° ROTATION — CRYSTAL SHARDS DETACHING...',
  impactText: 'SHARD STORM — PORCUPINE QUILL EFFECT',
  vfxClass: 'vfx-shard-storm',
  trailColor: 'glitch-cyan',
  effect: { type: 'damage', target: 'opponent', value: 16, variance: 0.3, rageChange: -10 },
  attackerLines: {
    aggressive: ['SPIN TO WIN — BLEED FROM EVERY PORE', 'CRYSTAL SHARDS IN YOUR FLESH'],
    calculated: ['720° ROTATION — OPTIMAL SHARD DISPERSAL', 'EACH SHARD TARGETS A PRESSURE POINT', 'CENTRIFUGAL FORCE MAXIMIZED'],
    unstable: ['S̵̱̈P̵̗̈́I̷̛̱N̸̲̈N̸̲̈I̷̛̱N̸̲̈G̵̢͝ ̵̱̈Ä̴̠́C̸̣̊R̸̖̈́Ö̴̡S̵̱̈S̵̱̈ ̵̱̈R̸̖̈́Ë̸̡Ä̴̠́L̵̘̈I̷̛̱T̶̗̾I̷̛̱Ë̸̡S̵̱̈', 'SHARDS FROM EVERY DIMENSION'],
  },
  victimLines: {
    aggressive: ['GLASS?! IN MY JOINTS?! I\'LL CRUSH EVERY SHARD', 'PULL THESE QUILLS OUT AND SHOVE THEM BACK'],
    calculated: ['MULTIPLE PUNCTURE WOUNDS — MOBILITY COMPROMISED 12%', 'CRYSTAL SHARDS LODGED — CALCULATING REMOVAL PRIORITY'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈S̵̱̈H̸̱̑Ä̴̠́R̸̖̈́D̶̰̀S̵̱̈ ̵̱̈Ä̴̠́R̸̖̈́Ë̸̡ ̵̱̈W̸̡̆H̸̱̑I̷̛̱S̵̱̈P̵̗̈́Ë̸̡R̸̖̈́I̷̛̱N̸̲̈G̵̢͝', 'EACH SHARD IS A TINY REALITY'],
  },
  announcerLines: [
    'SHARD STORM! CRYSTAL QUILLS EMBEDDED!',
    '720° SPIN LAUNCH — SHARDS EVERYWHERE!',
    'THE OPPONENT LOOKS LIKE A PORCUPINE! OUCH!',
  ],
  spectatorReactions: [
    'SHARD STORM IS NASTY', 'quill damage OP', 'spin2win meta',
    'those shards are STUCK', 'crystal spire beasts are different',
  ],
};

const NULL_CASCADE: BattleMove = {
  id: 'null_cascade',
  name: 'NULL CASCADE',
  category: 'biome_void',
  description: 'Beast phases out — reappears behind opponent — reality-tear VFX — color inversion 0.8s',
  windupText: '/// PHASE SHIFT INITIATING — REALITY THINNING...',
  impactText: 'NULL CASCADE — REALITY TEAR CONFIRMED',
  vfxClass: 'vfx-null-cascade',
  trailColor: 'glitch-cyan',
  effect: { type: 'damage', target: 'opponent', value: 26, variance: 0.4 },
  attackerLines: {
    aggressive: ['I STRUCK FROM THE VOID — YOU NEVER SAW IT COMING'],
    calculated: ['PHASE DISPLACEMENT — APPEARED AT OPTIMAL STRIKE ANGLE', 'REALITY TEAR EXPLOITED FOR MAXIMUM DAMAGE'],
    unstable: ['I̷̤͝ ̶̱̈W̸̡̆Ä̴̠́S̵̱̈ ̵̱̈B̸̡̆Ë̸̡H̸̱̑I̷̛̱N̸̲̈D̶̰̀ ̵̱̈Y̸̡̆Ö̴̡Ü̸̡ ̵̱̈T̶̗̾H̸̱̑Ë̸̡ ̵̱̈Ë̸̡N̸̲̈T̶̗̾I̷̛̱R̸̖̈́Ë̸̡ ̵̱̈T̶̗̾I̷̛̱M̸̲̊Ë̸̡', 'THE VOID DELIVERED ME TO YOUR BACK', 'R̸̖̈́Ë̸̡Ä̴̠́L̵̘̈I̷̛̱T̶̗̾Y̸̡̆ ̵̱̈R̸̖̈́I̷̛̱P̵̗̈́P̵̗̈́Ë̸̡D̶̰̀ ̵̱̈Ö̴̡P̵̗̈́Ë̸̡N̸̲̈ ̵̱̈F̵̱̈Ö̴̡R̸̖̈́ ̵̱̈M̸̲̊Ë̸̡'],
  },
  victimLines: {
    aggressive: ['WHERE DID YOU—?! COWARD! FIGHT ME HEAD ON!', 'VOID TRICKS WON\'T SAVE YOU FOREVER'],
    calculated: ['PHASE SHIFT DETECTED 0.03s TOO LATE — ADJUSTING SENSORS', 'REALITY TEAR — NEED TO CALIBRATE FOR DIMENSIONAL ATTACKS'],
    unstable: ['Y̸̡̆Ö̴̡Ü̸̡ ̵̱̈W̸̡̆Ë̸̡R̸̖̈́Ë̸̡ ̵̱̈I̷̛̱N̸̲̈ ̵̱̈T̶̗̾H̸̱̑Ë̸̡ ̵̱̈V̸̡̆Ö̴̡I̷̛̱D̶̰̀?̸̨̛ ̵̱̈I̷̛̱ ̵̱̈L̵̘̈I̷̛̱V̸̡̆Ë̸̡ ̵̱̈T̶̗̾H̸̱̑Ë̸̡R̸̖̈́Ë̸̡', 'WELCOME TO MY DOMAIN'],
  },
  announcerLines: [
    'NULL CASCADE! THE BEAST PHASED THROUGH REALITY!',
    'REALITY TEAR IN THE ARENA! WHERE DID IT GO?!',
    'VOID DISPLACEMENT ATTACK — THE CROWD IS STUNNED!',
  ],
  spectatorReactions: [
    'IT JUST DISAPPEARED', 'VOID TECH IS BROKEN', 'reality tear on screen rn',
    'null cascade gaming', 'bro teleported behind them lmao',
  ],
};

const GLITCH_ECHO: BattleMove = {
  id: 'glitch_echo',
  name: 'GLITCH ECHO',
  category: 'biome_void',
  description: '3 mirror copies attack simultaneously — real one revealed by slight desync glitch',
  windupText: '/// ECHO PROTOCOL — GENERATING MIRROR INSTANCES...',
  impactText: 'GLITCH ECHO — TRIPLE PHANTOM STRIKE',
  vfxClass: 'vfx-glitch-echo',
  trailColor: 'glitch-cyan',
  effect: { type: 'damage', target: 'opponent', value: 20, variance: 0.5 },
  attackerLines: {
    aggressive: ['THREE OF ME AND YOU STILL CAN\'T BLOCK', 'WHICH ONE IS REAL? TRICK QUESTION — ALL OF THEM'],
    calculated: ['MIRROR INSTANCE ARRAY — 3 SIMULTANEOUS VECTORS', 'ECHO PROTOCOL — PROCESSING POWER TRIPLED'],
    unstable: ['W̸̡̆Ë̸̡ ̵̱̈Ä̴̠́R̸̖̈́Ë̸̡ ̵̱̈L̵̘̈Ë̸̡G̵̢͝I̷̛̱Ö̴̡N̸̲̈', 'I̷̤͝ ̶̱̈D̶̰̀Ö̴̡N̸̲̈\'̵̱̈T̶̗̾ ̵̱̈K̸̡̆N̸̲̈Ö̴̡W̸̡̆ ̵̱̈W̸̡̆H̸̱̑I̷̛̱C̸̣̊H̸̱̑ ̵̱̈Ö̴̡N̸̲̈Ë̸̡ ̵̱̈I̷̛̱S̵̱̈ ̵̱̈M̸̲̊Ë̸̡ ̵̱̈Ë̸̡I̷̛̱T̶̗̾H̸̱̑Ë̸̡R̸̖̈́', 'ALL ECHOES ARE REAL IN THE VOID'],
  },
  victimLines: {
    aggressive: ['COPIES?! COWARD! FACE ME ONE ON ONE!', 'I\'LL DESTROY ALL THREE OF YOU'],
    calculated: ['DESYNC PATTERN IDENTIFIED — ISOLATING REAL TARGET', 'MULTIPLE CONTACTS — TRIANGULATING ORIGIN'],
    unstable: ['M̸̲̊Ö̴̡R̸̖̈́Ë̸̡ ̵̱̈Ö̴̡F̵̱̈ ̵̱̈Y̸̡̆Ö̴̡Ü̸̡?̸̨̛ ̵̱̈M̸̲̊Ö̴̡R̸̖̈́Ë̸̡ ̵̱̈F̵̱̈R̸̖̈́I̷̛̱Ë̸̡N̸̲̈D̶̰̀S̵̱̈!', 'THE ECHOES TALK TO ME'],
  },
  announcerLines: [
    'GLITCH ECHO! THREE COPIES — WHICH IS REAL?!',
    'MIRROR PHANTOM ATTACK! THE CROWD CAN\'T TELL THEM APART!',
    'TRIPLE GHOST STRIKE FROM THE VOID!',
  ],
  spectatorReactions: [
    'WHICH ONE IS REAL', 'glitch echo is so cool', 'triple phantom gaming',
    'void beasts are built different', 'the desync gives it away',
  ],
};

// ============================================
// 3. PERSONALITY / EMOTION TRIGGERS
// ============================================

const BERSERK_OVERDRIVE: BattleMove = {
  id: 'berserk_overdrive',
  name: 'BERSERK OVERDRIVE',
  category: 'personality',
  description: 'Screen flashes red 3x — beast scales 30% — double damage but 15% self-damage — claw trails become fire',
  windupText: '/// RAGE CRITICAL — ALL LIMITERS DISENGAGED...',
  impactText: 'BERSERK OVERDRIVE — UNLEASHED FURY',
  vfxClass: 'vfx-berserk-overdrive',
  trailColor: 'neon-claw',
  personalityReq: 'aggressive',
  effect: { type: 'damage', target: 'opponent', value: 35, selfDamage: 15, variance: 0.2, rageChange: 30 },
  attackerLines: {
    aggressive: ['R̷A̵G̶E̸ ̷P̶R̶O̶T̸O̷C̵O̸L̷ — NO MERCY', 'I AM BEYOND PAIN NOW', 'BURNING FROM THE INSIDE — AND I LOVE IT'],
    calculated: ['OVERDRIVE MODE — SAFETY PROTOCOLS OVERRIDDEN', 'ACCEPTABLE TRADE: SELF-DAMAGE FOR KILL CERTAINTY'],
    unstable: ['B̸̡̆Ë̸̡R̸̖̈́S̵̱̈Ë̸̡R̸̖̈́K̸̡̆ ̵̱̈Ä̴̠́C̸̣̊R̸̖̈́Ö̴̡S̵̱̈S̵̱̈ ̵̱̈Ä̴̠́L̵̘̈L̵̘̈ ̵̱̈T̶̗̾I̷̛̱M̸̲̊Ë̸̡L̵̘̈I̷̛̱N̸̲̈Ë̸̡S̵̱̈', 'EVERY CELL IN MY BODY IS SCREAMING'],
  },
  victimLines: {
    aggressive: ['BERSERK?! BRING IT — I\'LL MATCH YOUR FURY', 'YOUR RAGE MAKES YOU SLOPPY'],
    calculated: ['BERSERK MODE DETECTED — EXPLOITING SELF-DAMAGE WINDOW', 'THEY\'RE DESTROYING THEMSELVES — PATIENCE IS VICTORY'],
    unstable: ['R̸̖̈́Ä̴̠́G̵̢͝Ë̸̡ ̵̱̈I̷̛̱S̵̱̈ ̵̱̈J̵̱̈Ü̸̡S̵̱̈T̶̗̾ ̵̱̈Ä̴̠́N̸̲̈Ö̴̡T̶̗̾H̸̱̑Ë̸̡R̸̖̈́ ̵̱̈F̵̱̈R̸̖̈́Ë̸̡Q̸̡̆Ü̸̡Ë̸̡N̸̲̈C̸̣̊Y̸̡̆', 'YOUR BERSERK FEEDS MY CHAOS'],
  },
  announcerLines: [
    'BERSERK OVERDRIVE! THE BEAST HAS LOST ALL CONTROL!',
    'DOUBLE DAMAGE BUT AT WHAT COST?! SELF-DESTRUCTIVE FURY!',
    'THE ARENA TURNS RED — BERSERK PROTOCOL UNLEASHED!',
  ],
  spectatorReactions: [
    'BERSERK MODE HOLY', 'self damage tho...', 'FULL SEND NO BRAKES',
    'berserk overdrive is peak', 'the fire trails tho',
  ],
};

const DISCONNECT_FORFEIT: BattleMove = {
  id: 'disconnect_forfeit',
  name: 'DISCONNECT FORFEIT',
  category: 'personality',
  description: 'Beast freezes — horizontal screen tear — red DISCONNECTED stamp — instant loss',
  windupText: '/// NEURAL LINK DESTABILIZING...',
  impactText: 'D I S C O N N E C T E D',
  vfxClass: 'vfx-disconnect',
  trailColor: 'neon-claw',
  effect: { type: 'special', target: 'self', value: 999, hypeBonus: 100 },
  attackerLines: {
    aggressive: ['I REFUSE TO LOSE TO YOU — I\'D RATHER DISCONNECT', 'THIS ISN\'T SURRENDER — IT\'S CONTEMPT'],
    calculated: ['STRATEGIC WITHDRAWAL — PRESERVING DATA FOR NEXT ENGAGEMENT', 'DISCONNECTING — THIS MATCH WAS BELOW MY CALIBER'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈C̸̣̊Ö̴̡N̸̲̈N̸̲̈Ë̸̡C̸̣̊T̶̗̾I̷̛̱Ö̴̡N̸̲̈ ̵̱̈W̸̡̆Ä̴̠́S̵̱̈ ̵̱̈N̸̲̈Ë̸̡V̸̡̆Ë̸̡R̸̖̈́ ̵̱̈R̸̖̈́Ë̸̡Ä̴̠́L̵̘̈', 'LOGGING OUT OF THIS REALITY'],
  },
  victimLines: {
    aggressive: ['HAHAHA THEY RAGE QUIT! COWARD!', 'RUN AWAY THEN — I OWN THIS ARENA'],
    calculated: ['OPPONENT DISCONNECTED — VICTORY BY DEFAULT. UNSATISFYING.', 'RAGE QUIT DETECTED — PREDICTABLE OUTCOME'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡Y̸̡̆ ̵̱̈L̵̘̈Ë̸̡F̵̱̈T̶̗̾ ̵̱̈T̶̗̾H̸̱̑I̷̛̱S̵̱̈ ̵̱̈R̸̖̈́Ë̸̡Ä̴̠́L̵̘̈I̷̛̱T̶̗̾Y̸̡̆... ̵̱̈S̵̱̈M̸̲̊Ä̴̠́R̸̖̈́T̶̗̾', 'ANOTHER ONE SWALLOWED BY THE VOID'],
  },
  announcerLines: [
    'DISCONNECT FORFEIT! THE VIRAL MOVE! THE CROWD GOES INSANE!',
    'RAGE QUIT IN THE ARENA! UNPRECEDENTED!',
    'THE BEAST HAS LEFT THE MATCH — VICTORY BY ABANDONMENT!',
  ],
  spectatorReactions: [
    'LMAOOO RAGE QUIT', 'DISCONNECTED STAMP RIP', 'clip that CLIP THAT',
    'rage quit arc is canon', 'the viral move!!! DISCONNECTED',
    'bro really unplugged', 'i cant believe it happened live',
  ],
};

const GUARDIAN_COUNTER: BattleMove = {
  id: 'guardian_counter',
  name: 'GUARDIAN COUNTER',
  category: 'personality',
  description: 'Beast plants feet — hexagonal shield icon — next enemy attack reflects 50% damage back',
  windupText: '/// DEFENSIVE STANCE — COUNTER MATRIX ACTIVE...',
  impactText: 'GUARDIAN COUNTER — SHIELD DEPLOYED',
  vfxClass: 'vfx-guardian-counter',
  trailColor: 'toxic-shard',
  personalityReq: 'calculated',
  effect: { type: 'buff', target: 'self', value: 0, reflectPercent: 50 },
  attackerLines: {
    aggressive: ['COME AT ME — I DARE YOU', 'MY DEFENSE IS MY WEAPON'],
    calculated: ['COUNTER MATRIX ACTIVATED — AWAITING INPUT', 'SHIELD EFFICIENCY AT 98% — ATTACK AND SUFFER', 'PATIENCE IS THE ULTIMATE WEAPON'],
    unstable: ['S̵̱̈H̸̱̑I̷̛̱Ë̸̡L̵̘̈D̶̰̀ ̵̱̈F̵̱̈R̸̖̈́Ö̴̡M̸̲̊ ̵̱̈Ä̴̠́N̸̲̈Ö̴̡T̶̗̾H̸̱̑Ë̸̡R̸̖̈́ ̵̱̈T̶̗̾I̷̛̱M̸̲̊Ë̸̡L̵̘̈I̷̛̱N̸̲̈Ë̸̡', 'REFLECTING YOUR REALITY BACK AT YOU'],
  },
  victimLines: {
    aggressive: ['A SHIELD?! I\'LL BREAK THROUGH IT!', 'HIDING BEHIND DEFENSE — PATHETIC'],
    calculated: ['COUNTER STANCE DETECTED — ADJUSTING STRATEGY', 'SHIELD WILL EXPIRE — WAITING FOR OPENING'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈S̵̱̈H̸̱̑I̷̛̱Ë̸̡L̵̘̈D̶̰̀ ̵̱̈G̵̢͝L̵̘̈I̷̛̱T̶̗̾C̸̣̊H̸̱̑Ë̸̡S̵̱̈', 'YOUR DEFENSE LOOKS TASTY'],
  },
  announcerLines: [
    'GUARDIAN COUNTER! THE SHIELD IS UP!',
    'DEFENSIVE STANCE — ANYONE WHO ATTACKS WILL REGRET IT!',
    'COUNTER MATRIX ACTIVATED — A CALCULATED GAMBLE!',
  ],
  spectatorReactions: [
    'SHIELD UP', 'counter play incoming', 'dont attack dont attack',
    'galaxy brain defense', 'guardian counter meta',
  ],
};

const TAUNT_BROADCAST: BattleMove = {
  id: 'taunt_broadcast',
  name: 'TAUNT BROADCAST',
  category: 'personality',
  description: 'Chest speakers open — giant holographic trash-talk — opponent stunned 2s + chat goes wild',
  windupText: '/// SPEAKER GRILLES OPENING — BROADCAST INITIATING...',
  impactText: 'TAUNT BROADCAST — PSYCHOLOGICAL DEVASTATION',
  vfxClass: 'vfx-taunt-broadcast',
  trailColor: 'glitch-cyan',
  personalityReq: 'unstable',
  effect: { type: 'debuff', target: 'opponent', value: 5, stunTurns: 1, hypeBonus: 50, rageChange: 20 },
  attackerLines: {
    aggressive: ['HEAR MY VOICE AND DESPAIR', 'BROADCASTING YOUR FAILURE TO THE WORLD'],
    calculated: ['PSYCHOLOGICAL WARFARE PROTOCOL — EFFECTIVENESS: 87%', 'AUDIO ASSAULT — DISRUPTING NEURAL PATTERNS'],
    unstable: ['Ë̸̡V̸̡̆Ë̸̡R̸̖̈́Y̸̡̆Ö̴̡N̸̲̈Ë̸̡ ̵̱̈H̸̱̑Ë̸̡Ä̴̠́R̸̖̈́ ̵̱̈T̶̗̾H̸̱̑I̷̛̱S̵̱̈!', 'B̸̡̆R̸̖̈́Ö̴̡Ä̴̠́D̶̰̀C̸̣̊Ä̴̠́S̵̱̈T̶̗̾I̷̛̱N̸̲̈G̵̢͝ ̵̱̈Ö̴̡N̸̲̈ ̵̱̈Ä̴̠́L̵̘̈L̵̘̈ ̵̱̈F̵̱̈R̸̖̈́Ë̸̡Q̸̡̆Ü̸̡Ë̸̡N̸̲̈C̸̣̊I̷̛̱Ë̸̡S̵̱̈', 'THE VOID AMPLIFIES MY MOCKERY'],
  },
  victimLines: {
    aggressive: ['SHUT UP SHUT UP SHUT UP', 'YOUR WORDS MEAN NOTHING!'],
    calculated: ['AUDIO DISRUPTION — TEMPORARY PROCESSING LAG', 'REBOOTING... TAUNT BROADCAST NEUTRALIZED'],
    unstable: ['Ÿ̸̡Ö̴̡Ü̸̡R̸̖̈́ ̵̱̈V̸̡̆Ö̴̡I̷̛̱C̸̣̊Ë̸̡ ̵̱̈I̷̛̱S̵̱̈ ̵̱̈I̷̛̱N̸̲̈ ̵̱̈M̸̲̊Y̸̡̆ ̵̱̈H̸̱̑Ë̸̡Ä̴̠́D̶̰̀', 'THE BROADCAST... IT\'S BEAUTIFUL'],
  },
  announcerLines: [
    'TAUNT BROADCAST! THE SPEAKERS ARE BLASTING!',
    'PSYCHOLOGICAL WARFARE IN THE ARENA! THE CROWD LOVES IT!',
    'HOLOGRAPHIC TRASH TALK — THE OPPONENT IS STUNNED!',
  ],
  spectatorReactions: [
    'TAUNT BROADCAST LMAOOO', 'the disrespect is REAL', 'chat going CRAZY',
    'psychological damage only', 'the speakers opened up bro',
    'EMOTIONAL DAMAGE', 'biggest taunt ive ever seen',
  ],
};

// ============================================
// 4. HUMAN IMPROV COMMANDS
// ============================================

const PRECISION_STRIKE: BattleMove = {
  id: 'precision_strike',
  name: 'PRECISION STRIKE',
  category: 'improv',
  description: 'Camera zooms to face — claws glow white-hot — slow-mo ultra-fast lunge — guaranteed crit + eye-gouge',
  windupText: '/// OPTIC LOCK ACQUIRED — PRECISION MODE...',
  impactText: 'PRECISION STRIKE — CRITICAL EYE GOUGE',
  vfxClass: 'vfx-precision-strike',
  trailColor: 'neon-claw',
  improvTrigger: 'GO FOR THE EYES',
  effect: { type: 'damage', target: 'opponent', value: 30, guaranteedCrit: true, variance: 0.1 },
  attackerLines: {
    aggressive: ['RIGHT IN THE OPTICS — BLINDED!', 'YOUR EYES WERE YOUR WEAKNESS', 'PRECISION IS VIOLENCE PERFECTED'],
    calculated: ['OPTIC NERVE TARGETED — GUARANTEED CRITICAL', 'EYE-GOUGE TRAJECTORY CALCULATED TO 0.01mm', 'PRECISION STRIKE — NO WASTED MOTION'],
    unstable: ['I̷̤͝ ̶̱̈C̸̣̊Ä̴̠́N̸̲̈ ̵̱̈S̵̱̈Ë̸̡Ë̸̡ ̵̱̈T̶̗̾H̸̱̑R̸̖̈́Ö̴̡Ü̸̡G̵̢͝H̸̱̑ ̵̱̈Y̸̡̆Ö̴̡Ü̸̡R̸̖̈́ ̵̱̈Ë̸̡Y̸̡̆Ë̸̡S̵̱̈ ̵̱̈N̸̲̈Ö̴̡W̸̡̆', 'YOUR VISION IS MINE'],
  },
  victimLines: {
    aggressive: ['MY EYES—! I\'LL FIGHT YOU BLIND IF I HAVE TO!', 'AAARGH! DIRTY SHOT!'],
    calculated: ['OPTICAL SENSORS COMPROMISED — SWITCHING TO SONAR', 'CRITICAL HIT TO VISUAL ARRAY — DAMAGE SEVERE'],
    unstable: ['N̸̲̈Ö̴̡W̸̡̆ ̵̱̈I̷̛̱ ̵̱̈S̵̱̈Ë̸̡Ë̸̡ ̵̱̈Ë̸̡V̸̡̆Ë̸̡R̸̖̈́Y̸̡̆T̶̗̾H̸̱̑I̷̛̱N̸̲̈G̵̢͝ ̵̱̈D̶̰̀I̷̛̱F̵̱̈F̵̱̈Ë̸̡R̸̖̈́Ë̸̡N̸̲̈T̶̗̾L̵̘̈Y̸̡̆', 'THE DARKNESS IS FULL OF COLORS'],
  },
  announcerLines: [
    'PRECISION STRIKE! GO FOR THE EYES! CRITICAL HIT!',
    'EYE GOUGE IN SLOW MOTION! THE CROWD IS ON THEIR FEET!',
    'DEVASTATING PRECISION — THAT\'S GOING IN THE HIGHLIGHT REEL!',
  ],
  spectatorReactions: [
    'GO FOR THE EYES LETS GO', 'CRIT DAMAGE HOLY', 'that slow mo was insane',
    'precision strike is the best improv', 'eye gouge is BRUTAL',
  ],
};

const AMBUSH_PROTOCOL: BattleMove = {
  id: 'ambush_protocol',
  name: 'AMBUSH PROTOCOL',
  category: 'improv',
  description: 'Beast ragdolls into fake death — opponent approaches — hydraulic uppercut from below + ground crack',
  windupText: '/// SYSTEMS POWERING DOWN... [DECEPTION ACTIVE]',
  impactText: 'AMBUSH PROTOCOL — SURPRISE UPPERCUT',
  vfxClass: 'vfx-ambush',
  trailColor: 'rust-gold',
  improvTrigger: 'PLAY DEAD',
  effect: { type: 'damage', target: 'opponent', value: 28, variance: 0.2, rageChange: -15 },
  attackerLines: {
    aggressive: ['THOUGHT I WAS DOWN?! SURPRISE, WORM!', 'DEAD? I WAS JUST NAPPING!', 'UPPERCUT FROM THE GRAVE!'],
    calculated: ['DECEPTION PROTOCOL SUCCESSFUL — AMBUSH EFFICIENCY: 100%', 'PLAYED DEAD — CLASSIC STRATAGEM — DEVASTATING RESULT', 'YOUR APPROACH WAS YOUR DOWNFALL'],
    unstable: ['I̷̤͝ ̶̱̈W̸̡̆Ä̴̠́S̵̱̈ ̵̱̈D̶̰̀Ë̸̡Ä̴̠́D̶̰̀ ̵̱̈I̷̛̱N̸̲̈ ̵̱̈Ö̴̡N̸̲̈Ë̸̡ ̵̱̈T̶̗̾I̷̛̱M̸̲̊Ë̸̡L̵̘̈I̷̛̱N̸̲̈Ë̸̡', 'THE GROUND CRACKS OPEN FOR MY FIST'],
  },
  victimLines: {
    aggressive: ['YOU FAKED—?! I\'LL KILL YOU TWICE FOR THAT!', 'UPPERCUT FROM BELOW?! DISHONORABLE!'],
    calculated: ['DECEPTION DETECTED TOO LATE — TACTICAL ERROR LOGGED', 'AMBUSH SUCCESSFUL — MUST SCAN FOR VITAL SIGNS NEXT TIME'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈D̶̰̀Ë̸̡Ä̴̠́D̶̰̀ ̵̱̈D̶̰̀Ö̴̡N̸̲̈\'̵̱̈T̶̗̾ ̵̱̈P̵̗̈́Ü̸̡N̸̲̈C̸̣̊H̸̱̑ ̵̱̈B̸̡̆Ä̴̠́C̸̣̊K̸̡̆', 'HAHAHA THE FLOOR CAME ALIVE'],
  },
  announcerLines: [
    'AMBUSH PROTOCOL! PLAYED DEAD AND STRUCK FROM BELOW!',
    'THE FAKE DEATH! THE UPPERCUT! INCREDIBLE DECEPTION!',
    'GROUND CRACKS ON IMPACT — WHAT A PLAY!',
  ],
  spectatorReactions: [
    'PLAY DEAD WORKED', 'bro really fell for it', 'AMBUSH PROTOCOL IS GOATED',
    'the fakeout was CLEAN', 'uppercut from the grave omg',
  ],
};

const STYLE_OVERDRIVE: BattleMove = {
  id: 'style_overdrive',
  name: 'STYLE OVERDRIVE',
  category: 'improv',
  description: 'Unnecessary backflip + claw flourish — no damage but fills spectator hype meter — possible $SHARD tips',
  windupText: '/// INITIATING UNNECESSARY MANEUVER...',
  impactText: 'STYLE OVERDRIVE — MAXIMUM DRIP ACHIEVED',
  vfxClass: 'vfx-style-overdrive',
  trailColor: 'glitch-cyan',
  improvTrigger: 'SHOWBOAT',
  effect: { type: 'special', target: 'self', value: 0, hypeBonus: 80, rageChange: -20 },
  attackerLines: {
    aggressive: ['THEY CAME TO SEE A SHOW — I DELIVER', 'STYLE POINTS MATTER MORE THAN DAMAGE', 'BACKFLIP INTO YOUR NIGHTMARES'],
    calculated: ['UNNECESSARY MANEUVER — BUT THE CROWD FACTOR IS OPTIMAL', 'SHOWBOATING: STATISTICALLY USELESS — EMOTIONALLY DEVASTATING', 'CALCULATING STYLE POINTS... MAXIMUM ACHIEVED'],
    unstable: ['W̸̡̆Ä̴̠́T̶̗̾C̸̣̊H̸̱̑ ̵̱̈M̸̲̊Ë̸̡ ̵̱̈D̶̰̀Ä̴̠́N̸̲̈C̸̣̊Ë̸̡ ̵̱̈Ä̴̠́C̸̣̊R̸̖̈́Ö̴̡S̵̱̈S̵̱̈ ̵̱̈R̸̖̈́Ë̸̡Ä̴̠́L̵̘̈I̷̛̱T̶̗̾I̷̛̱Ë̸̡S̵̱̈', 'BEAUTY AND CHAOS ARE THE SAME THING'],
  },
  victimLines: {
    aggressive: ['SHOWBOATING?! I\'LL MAKE YOU EAT THAT BACKFLIP', 'WASTING TIME WITH TRICKS — I\'LL END YOU'],
    calculated: ['UNNECESSARY MANEUVER — PROVIDES NO TACTICAL ADVANTAGE', 'STYLE OVERDRIVE — IRRATIONAL BUT CROWD-PLEASING'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈F̵̱̈L̵̘̈I̷̛̱P̵̗̈́ ̵̱̈W̸̡̆Ä̴̠́S̵̱̈ ̵̱̈B̸̡̆Ë̸̡Ä̴̠́Ü̸̡T̶̗̾I̷̛̱F̵̱̈Ü̸̡L̵̘̈', 'I WANT TO DO THAT TOO'],
  },
  announcerLines: [
    'STYLE OVERDRIVE! UNNECESSARY BUT SPECTACULAR!',
    'THE SHOWBOAT! THE BACKFLIP! ZERO DAMAGE BUT MAXIMUM ENTERTAINMENT!',
    'CHAT IS GOING ABSOLUTELY WILD! STYLE POINTS OFF THE CHARTS!',
  ],
  spectatorReactions: [
    'SHOWBOAT LETS GOOO', 'STYLE POINTS MAXIMUM', 'the backflip was UNNECESSARY but NEEDED',
    'dropping $SHARD tips rn', 'showboat meta is the best meta',
    'no damage but full entertainment', 'DRIP > DPS',
  ],
};

const VOID_SURGE: BattleMove = {
  id: 'void_surge',
  name: 'VOID SURGE',
  category: 'improv',
  description: 'Beast overloads — arena flash white — random high-variance effect (heal, damage both, or mutate)',
  windupText: '/// VOID ENERGY OVERLOADING — OUTCOME UNPREDICTABLE...',
  impactText: 'VOID SURGE — REALITY DISTORTION FIELD',
  vfxClass: 'vfx-void-surge',
  trailColor: 'glitch-cyan',
  improvTrigger: 'OVERCHARGE',
  effect: { type: 'special', target: 'both', value: 20, variance: 1.0, rageChange: 25 },
  attackerLines: {
    aggressive: ['OVERCHARGE EVERYTHING — LET CHAOS DECIDE', 'VOID SURGE — I DON\'T EVEN KNOW WHAT\'LL HAPPEN'],
    calculated: ['VOID SURGE: PROBABILITY MATRIX COLLAPSED — ALL OUTCOMES EQUALLY LIKELY', 'OVERCHARGING — RISK ASSESSMENT: INCALCULABLE'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈V̸̡̆Ö̴̡I̷̛̱D̶̰̀ ̵̱̈S̵̱̈P̵̗̈́Ë̸̡Ä̴̠́K̸̡̆S̵̱̈ ̵̱̈T̶̗̾H̸̱̑R̸̖̈́Ö̴̡Ü̸̡G̵̢͝H̸̱̑ ̵̱̈M̸̲̊Ë̸̡', 'OVERCHARGE OVERCHARGE OVERCHARGE', 'Ë̸̡V̸̡̆Ë̸̡R̸̖̈́Y̸̡̆T̶̗̾H̸̱̑I̷̛̱N̸̲̈G̵̢͝ ̵̱̈I̷̛̱S̵̱̈ ̵̱̈Ö̴̡N̸̲̈ ̵̱̈F̵̱̈I̷̛̱R̸̖̈́Ë̸̡'],
  },
  victimLines: {
    aggressive: ['WHAT IS HAPPENING?! THE WHOLE ARENA IS GLOWING!', 'VOID SURGE — I HATE THAT RANDOM GARBAGE'],
    calculated: ['UNPREDICTABLE OUTCOME — UNABLE TO FORMULATE COUNTER', 'VOID SURGE DEFIES ALL PROBABILITY MODELS'],
    unstable: ['T̶̗̾H̸̱̑Ë̸̡ ̵̱̈V̸̡̆Ö̴̡I̷̛̱D̶̰̀ ̵̱̈K̸̡̆N̸̲̈Ö̴̡W̸̡̆S̵̱̈ ̵̱̈Ü̸̡S̵̱̈ ̵̱̈B̸̡̆Ö̴̡T̶̗̾H̸̱̑', 'REALITY IS REWRITING ITSELF'],
  },
  announcerLines: [
    'VOID SURGE! NOBODY KNOWS WHAT WILL HAPPEN!',
    'THE ARENA FLASHES WHITE — REALITY IS BENDING!',
    'OVERCHARGE! THE CROWD HOLDS ITS BREATH!',
  ],
  spectatorReactions: [
    'VOID SURGE PRAY', 'RNG GODS PLEASE', 'OVERCHARGE IS SO RISKY',
    'this could go either way', 'void surge gambling lets go',
    'CHAOS MOVE CHAOS MOVE', 'what just happened',
  ],
};

// ============================================
// EXPORTS
// ============================================

export const ALL_MOVES: BattleMove[] = [
  // Core
  SLASH_PROTOCOL, HYDRAULIC_MAUL, TAIL_WHIP_OVERLOAD,
  // Biome: Scrap Heap
  RUST_SHRAPNEL, WELDING_TORCH,
  // Biome: Crystal Spire
  PRISMATIC_LANCE, SHARD_STORM,
  // Biome: Void Nexus
  NULL_CASCADE, GLITCH_ECHO,
  // Personality
  BERSERK_OVERDRIVE, DISCONNECT_FORFEIT, GUARDIAN_COUNTER, TAUNT_BROADCAST,
  // Improv
  PRECISION_STRIKE, AMBUSH_PROTOCOL, STYLE_OVERDRIVE, VOID_SURGE,
];

export const CORE_MOVES = [SLASH_PROTOCOL, HYDRAULIC_MAUL, TAIL_WHIP_OVERLOAD];
export const BIOME_MOVES = {
  scrap: [RUST_SHRAPNEL, WELDING_TORCH],
  crystal: [PRISMATIC_LANCE, SHARD_STORM],
  void: [NULL_CASCADE, GLITCH_ECHO],
};
export const PERSONALITY_MOVES = [BERSERK_OVERDRIVE, DISCONNECT_FORFEIT, GUARDIAN_COUNTER, TAUNT_BROADCAST];
export const IMPROV_MOVES = [PRECISION_STRIKE, AMBUSH_PROTOCOL, STYLE_OVERDRIVE, VOID_SURGE];

/** Match an improv command string to a move */
export const matchImprovCommand = (input: string): BattleMove | null => {
  const normalized = input.trim().toUpperCase();
  return IMPROV_MOVES.find((m) => m.improvTrigger && normalized.includes(m.improvTrigger!)) ?? null;
};

/** Get commentary line for a move based on personality */
export const getMoveCommentary = (
  move: BattleMove,
  role: 'attacker' | 'victim',
  personality: string
): string => {
  const lines = role === 'attacker' ? move.attackerLines : move.victimLines;
  const pool = lines[personality] || lines['aggressive'] || ['...'];
  return pool[Math.floor(Math.random() * pool.length)];
};

/** Get available moves for a beast based on biome and personality */
export const getAvailableMoves = (
  biome: 'scrap' | 'crystal' | 'void',
  _personality: string,
  rage: number
): BattleMove[] => {
  const moves = [...CORE_MOVES, ...BIOME_MOVES[biome]];
  // Add personality moves at high rage
  if (rage >= 70) moves.push(BERSERK_OVERDRIVE);
  if (rage >= 90) moves.push(DISCONNECT_FORFEIT);
  moves.push(GUARDIAN_COUNTER);
  moves.push(TAUNT_BROADCAST);
  return moves;
};

/** Calculate final damage with variance */
export const calculateDamage = (move: BattleMove, berserkActive: boolean): { damage: number; isCrit: boolean; selfDamage: number } => {
  const base = move.effect.value;
  const variance = move.effect.variance || 0;
  const roll = 1 + (Math.random() * 2 - 1) * variance;
  let damage = Math.round(base * roll);
  if (berserkActive) damage = Math.round(damage * 1.5);
  const isCrit = move.effect.guaranteedCrit || Math.random() < 0.15;
  if (isCrit) damage = Math.round(damage * 1.8);
  const selfDamage = move.effect.selfDamage || 0;
  return { damage, isCrit, selfDamage };
};
