

# NEURAL LINK INTERFACE — Wallet Connection Flow

## Overview

Build a full-screen wallet connection experience triggered by the "Sync Neural Link" button on the landing page. The flow is a multi-step state machine with aggressive industrial aesthetics matching the existing ClawQuest brand.

## New Files

### 1. `src/pages/NeuralLink.tsx` — Main page/route
State machine with phases: `CABLE_INSERT` > `SELECT_PROTOCOL` > `STANDARD_UPLINK` / `EXTERNAL_CORTEX` / `GUEST_MODE` > `CONNECTING` > `SUCCESS` / `ERROR`

- **Cable Insert phase** (1.5s auto): Full-screen void black, SVG cable path draws from top-center downward using `stroke-dashoffset` animation. Brain-scan horizontal lines scroll downward in background.
- **Select Protocol phase**: Central panel (void-black 90% opacity, chromatic aberration border via `box-shadow` with red/cyan offset). Three hexagonal "hardware port" buttons stacked vertically:
  - STANDARD UPLINK — Brain+circuit icon
  - EXTERNAL CORTEX — Hard drive+neural port icon  
  - GUEST SIMULATION — Circuit-disconnect eye icon
- **Standard Uplink flow**: Terminal-style email input ("CONSCIOUSNESS IDENTIFIER"), "INITIATE UPLOAD" submit button (neon-claw red). Then 6-box OTP input ("NEURAL HANDSHAKE VERIFICATION"), auto-tab between boxes. Success shows "UPLOAD COMPLETE" stamp in Permanent Marker font.
- **External Cortex flow**: List of wallet options as "AVAILABLE CORTICES" with signal-strength bars. Clicking triggers "ESTABLISHING NEURAL BRIDGE" with particle data-stream CSS animation. Success shows "SYNCHRONIZATION COMPLETE" with green circuit pulse.
- **Guest Mode**: Rust-gold warning "LIMITED SIMULATION ACCESS", then redirects to landing with a persistent top banner "UPGRADE TO FULL UPLINK".
- **Success state**: Screen flash white (100ms), then shows wallet address as DNA-helix formatted text, token readouts ($CLAW / $SHARD / $BLOOD).
- **Error state**: Red static noise overlay via CSS, "CONNECTION SEVERED" with shake animation.

### 2. `src/components/NeuralLinkIcons.tsx` — Custom SVG icons
- `BrainCircuitIcon` — Brain outline with circuit traces
- `HardDriveNeuralIcon` — Drive with neural port connector
- `CircuitDisconnectEyeIcon` — Eye with circuit-break slash
- `ClawCheckIcon` — Checkmark formed by two crossing claws
- `CableEndIcon` — Cable/plug connector tip

### 3. `src/styles/neural-link.css` — Dedicated animations
- `@keyframes cable-draw` — stroke-dashoffset 100% to 0
- `@keyframes brain-scan` — horizontal lines scrolling down
- `@keyframes port-activate` — scaleY(0.9) to 1.0 with hydraulic bounce
- `@keyframes steam-release` — opacity + translateY burst
- `@keyframes data-stream` — particles flowing along path
- `@keyframes flash-white` — opacity 1 to 0 on white overlay
- `@keyframes static-noise` — random position shifts on noise texture
- `.chromatic-border` — box-shadow with offset red and cyan glows

### Background Video Concept
For the beast battle background, use a looping CSS animation of subtle beast silhouettes clashing behind the connection panel rather than actual video (keeps it lightweight). Layered parallax shadows with intermittent "impact flash" keyframes. This avoids heavy video assets while maintaining the aggressive atmosphere.

## Modified Files

### 4. `src/components/HeroSection.tsx`
- Wire "Sync Neural Link" button to `navigate("/neural-link")`

### 5. `src/App.tsx`
- Add route: `<Route path="/neural-link" element={<NeuralLink />} />`

### 6. `src/main.tsx`
- Import `neural-link.css`

## Technical Notes

- All state managed via `useState` + `useEffect` timers (no external state lib needed)
- Email/OTP inputs are visual-only (no real auth backend) — wired for future Supabase integration
- Wallet list is mock data (MetaMask, Phantom, WalletConnect) — no actual web3 libs
- Guest mode sets a flag in state/context that could later drive the persistent "UPGRADE" banner
- Zero Lucide icons, zero emojis, zero rounded corners, all-caps headers, aggressive copy throughout
- Uses existing color tokens (neon-claw, glitch-cyan, rust-gold, toxic-shard, void-black) and font families (Chakra Petch, JetBrains Mono, Permanent Marker, Share Tech Mono)

