# ClawQuest

## One-Line Pitch

ClawQuest is an **AI-driven PvP arena** where players stake tokens on autonomous agents battling each other while spectators watch, comment, and bet on the outcome.

---

## What is ClawQuest?

ClawQuest is a **two-player AI battle game** where:

- Players **register AI agents** (Claw Beasts) with defined skills and personalities
- Players **stake tokens** into a battle pot
- Their agents **fight autonomously** in real-time simulation
- The winning agent claims most of the pot
- **Spectators watch, comment, and place bets** on the outcome

Think of it as **AI-driven esports**—where the competitors aren't humans, but learning agents.

---

## Core Components

ClawQuest consists of **four main systems**:

### 1. AI Agents (Claw Beasts)

Each player registers an autonomous AI agent that serves as their fighter.

**Agent Structure:**
```
name              (string)
skills            (array of abilities)
personality       (behavioral traits)
combat_stats      (health, attack, defense, etc.)
battle_history    (past match records)
owner             (wallet address)
```

**Example Agent:**
```
Name: Iron Maw
Skills: [Hydraulic Bite, Rust Armor, Scrap Tornado]
Personality: Aggressive / Unstable
Owner: 0xPlayerWallet
Combat Stats: HP=120, ATK=18, DEF=14
```

**Storage:**
- Agents are registered on-chain via Starknet Cairo smart contract
- Contract stores: `agent_id`, `owner`, `name`, `skills`

---

### 2. PvP Battle Pot System

Every match is a **two-player, high-stakes battle**.

**Match Flow:**
1. Both players deposit tokens into a locked pot
2. The battle runs off-chain in the game simulation engine
3. Winner is determined
4. Tokens are distributed according to the split

**Pot Distribution:**
```
Winner:   80%
Loser:    5%
Platform: 15%
```

**Example:**
```
Player A deposits: 100 tokens
Player B deposits: 100 tokens
Total pot: 200 tokens

Winner receives: 160 tokens
Loser receives: 10 tokens
Platform receives: 30 tokens
```

---

### 3. Spectator Betting

Viewers can place time-limited bets on battle outcomes.

**Betting Rules:**
- **Bet window:** 3 minutes from match start
- **Options:** Bet on Agent A or Agent B
- **Automatic payout:** Distributed when battle ends

**Reward Distribution:**
```
Total bets: X tokens
Platform fee: 5% of X
Winners pool: 95% of X (distributed proportionally among winning bettors)
```

**Example:**
```
Total bets: 1000 tokens
Platform fee: 50 tokens
Winners pool: 950 tokens (split among those who bet on the winner)
```

---

### 4. Live Arena Experience

Battles are presented as **AI esports matches**.

**Spectator Features:**
- Watch real-time battle simulation
- Live chat with other viewers
- React to plays with emotes
- Place bets on agents
- Hear personality-based commentary from agents during combat

**Agent Commentary Examples:**

*Aggressive Agent:*
```
"Your defenses are weak."
"Come closer."
"I'll crush you."
```

*Calculated Agent:*
```
"Analyzing opponent behavior."
"Optimal strategy engaged."
"Victory probability: 87%"
```

This creates an **engaging, entertaining spectator experience**.

---

## How a Match Works (Full Flow)

### Step 1 — Agent Registration
Player registers an autonomous AI agent with skills and personality traits.
```
register_agent(name, skills, personality)
```
Stored on Starknet blockchain.

### Step 2 — Match Creation
Two players enter a match queue and are paired together.
```
create_match(player1_agent_id, player2_agent_id)
```

### Step 3 — Pot Funding
Both players deposit their stakes into the match pot. Tokens are locked.
```
deposit(match_id, stake_amount)
```

### Step 4 — Spectator Betting Opens
A betting pool opens for the match. Spectators have **3 minutes** to place bets.
```
create_bet_pool(match_id)
betting_window_duration = 180 seconds
```

### Step 5 — Battle Simulation
The match begins. The AI engine simulates real-time combat off-chain.

**AI Decision-Making:**
- Read game state (enemy distance, HP, emotion, terrain, etc.)
- Select action: `attack`, `defend`, `ability`, `taunt`, `rage`
- Personality traits influence behavior
- Emotional state (frustration, confidence, fear) affects decisions
- Past battle memories inform strategy

**Example Combat Loop:**
```
while battle_running:
    ai_decision()
    resolve_action()
    update_emotions()
    update_memory()
    broadcast_state_to_spectators()
```

### Step 6 — Battle Ends
One agent wins. The battle server submits the result to the blockchain.
```
submit_result(match_id, winner_agent_id, battle_log)
```

### Step 7 — Reward Distribution
Smart contracts automatically distribute:
- **Match pot** (winner gets 80%, loser gets 5%, platform gets 15%)
- **Betting rewards** (95% to winning bettors, 5% to platform)

---

## What Makes ClawQuest Unique

### vs. Traditional PvP Games
**Traditional Games:**
```
Player skill vs. Player skill
(Human reflexes, strategy, mechanics)
```

**ClawQuest:**
```
AI Agent vs. AI Agent
(Machine learning, learned behavior, evolving strategies)
```

### The Innovation
- **Players don't directly control combat**—they register trained agents
- **Agents make autonomous decisions** based on learned behavior
- **Unpredictability** from emotional states and personality traits
- **True PvP esports** where skill is training and agent design, not mechanical execution

### The Appeal
- **Passive engagement:** Watch your agent fight without intensive control
- **Betting economy:** Make money watching skilled players' agents battle
- **Streaming potential:** Entertaining, unpredictable AI behavior generates viral moments
- **Strategic depth:** Agent training, skill selection, personality tuning create meta-game
- **Blockchain ownership:** True asset ownership, trading, and breeding potential

---

## Technology Stack

### Frontend
```
React           (UI framework)
Three.js        (battle visualization)
WebSockets      (real-time updates)
TypeScript      (type safety)
```

### AI & Simulation
```
Reinforcement Learning agents
Battle simulation engine (Python/Node)
State management and decision-making
```

### Backend
```
Node.js         (match server)
WebSocket API   (client communication)
PotManager      (token handling)
BettingPool     (wager processing)
```

### Blockchain
```
Starknet        (L2 scaling)
Cairo           (smart contract language)
StarkZap SDK    (contract interaction)
```

---

## Smart Contracts Required

ClawQuest requires **three main smart contracts**:

### 1. AgentRegistry
**Purpose:** Register and store AI agents

**Responsibilities:**
- Accept agent registration from players
- Store agent metadata (name, skills, personality, owner)
- Maintain ownership records
- Enable agent trading/transfer

**Key Functions:**
```
register_agent(name, skills, personality) → agent_id
get_agent(agent_id) → Agent
transfer_agent(agent_id, new_owner)
```

### 2. MatchPot
**Purpose:** Lock funds and distribute rewards

**Responsibilities:**
- Accept deposits from two players
- Lock tokens until match completion
- Verify battle result
- Distribute pot according to rules (80/5/15 split)

**Key Functions:**
```
create_match(player1, player2) → match_id
deposit(match_id, amount)
submit_result(match_id, winner)
distribute_rewards(match_id)
```

### 3. BettingPool
**Purpose:** Accept bets and distribute winnings

**Responsibilities:**
- Accept bets during betting window (180 seconds)
- Prevent bets after window closes
- Collect platform fee (5%)
- Distribute 95% of pool to winning bettors proportionally

**Key Functions:**
```
create_bet_pool(match_id)
place_bet(match_id, agent_id, amount)
close_betting_window(match_id)
distribute_winnings(match_id)
```

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                    Game Client (React)                 │
│     (UI, Wallet Connect, Match Registration, Chat)    │
└──────────────────────┬─────────────────────────────────┘
                       │ WebSocket
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼──────┐          ┌──────▼─────┐
    │ Matchmaking│          │Battle Engine│
    │  Service   │          │  (Simulator)│
    └─────┬──────┘          └──────┬──────┘
          │                        │
          └────────────┬───────────┘
                       │
              ┌────────▼────────┐
              │  AI Simulation  │
              │   + State Mgmt  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼───┐ ┌──────▼──────┐ ┌───▼────────┐
    │ Memory │ │ Personality │ │ Emotions & │
    │ System │ │   Traits    │ │   State    │
    └────────┘ └─────────────┘ └────────────┘
         
         ┌──────────────────────────┐
         │   Starknet Blockchain    │
         │ (AgentRegistry, MatchPot │
         │      BettingPool)        │
         └──────────────────────────┘
```

---

## Development Roadmap

### Phase 1: Prototype (2–3 months)
- [ ] Basic agent registration UI
- [ ] Simple match creation flow
- [ ] Off-chain battle simulation
- [ ] Frontend visualization
- [ ] Spectator chat

### Phase 2: Alpha (6–12 months)
- [ ] Full smart contract suite (Starknet)
- [ ] Token integration (staking, rewards)
- [ ] Betting system with betting pool
- [ ] Agent personality system
- [ ] Memory/emotion system for agents
- [ ] Live spectator features
- [ ] Leaderboards

### Phase 3: Production (2–3 years)
- [ ] Agent breeding/evolution system
- [ ] Agent marketplace (trading)
- [ ] Streamer integration (Twitch, YouTube)
- [ ] Tournaments and seasonal events
- [ ] Advanced AI training pipelines
- [ ] Community governance (DAO)
- [ ] Cross-platform support

---

## File Structure (Expected)

```
clawquest/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── AgentRegistry.tsx
│   │   │   ├── MatchQueue.tsx
│   │   │   ├── BattleArena.tsx
│   │   │   └── SpectatorPanel.tsx
│   │   ├── pages/
│   │   │   ├── landing.tsx
│   │   │   ├── neural-link.tsx (wallet)
│   │   │   ├── registry.tsx (agent list)
│   │   │   ├── containment.tsx (agent detail)
│   │   │   └── crucible.tsx (matchmaking)
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── matchmaking/
│   │   ├── battle-engine/
│   │   ├── pot-manager/
│   │   └── spectator-server/
│   └── package.json
├── contracts/
│   ├── src/
│   │   ├── AgentRegistry.cairo
│   │   ├── MatchPot.cairo
│   │   └── BettingPool.cairo
│   └── Scarb.toml
├── ai-system/
│   ├── agents/
│   ├── training/
│   └── simulation/
└── README.md
```

---

## Key Design Principles

1. **Autonomous Agents:** Players don't control combat—they prepare agents that fight independently
2. **High Stakes:** Meaningful token deposits create tension and engagement
3. **Spectator Focus:** Battles are designed to be entertaining to watch
4. **Unpredictability:** Personality and emotional systems create surprising moments
5. **Blockchain Native:** True ownership, trading, and verifiable results
6. **Streaming Ready:** Built for content creation and viral moments

---

## Getting Started

### Prerequisites
- Node.js 16+
- React 18+
- Starknet wallet (Argent or Braavos)
- Basic understanding of Cairo smart contracts

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/clawquest.git
cd clawquest

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deploy Smart Contracts
```bash
cd contracts
scarb build
starkli declare target/dev/clawquest_AgentRegistry.json
starkli declare target/dev/clawquest_MatchPot.json
starkli declare target/dev/clawquest_BettingPool.json
```

---

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License—see the LICENSE file for details.

---

## Contact & Community

- **Discord:** [Join our community](https://discord.gg/clawquest)
- **Twitter:** [@ClawQuestGame](https://twitter.com/clawquestgame)
- **Email:** team@clawquest.dev

---

## Disclaimer

ClawQuest is in active development. Features, mechanics, and smart contract specifications are subject to change. Participate at your own risk.