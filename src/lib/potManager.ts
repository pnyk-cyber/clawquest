import type { WalletInterface } from "starkzap";
import { createStarkzapClient } from "@/lib/starkzapClient";

export interface PotContracts {
  agentRegistry: string;
  matchPot: string;
  bettingPool: string;
}

export interface MatchPotSnapshot {
  entryFeeByMatch: Map<number, bigint>;
  lockedMatches: Set<number>;
}

type StarknetCall = {
  contractAddress: string;
  entrypoint: string;
  calldata: Array<string | number | bigint | boolean>;
};

export class PotManager {
  private readonly wallet: WalletInterface;
  private readonly contracts: PotContracts;

  // Off-chain orchestration cache (source of truth remains on-chain)
  private readonly entryFeeByMatch = new Map<number, bigint>();
  private readonly lockedMatches = new Set<number>();

  constructor(wallet: WalletInterface, contracts: PotContracts) {
    this.wallet = wallet;
    this.contracts = contracts;
  }

  static async fromOnboard(contracts: PotContracts) {
    const sdk = createStarkzapClient();
    const result = await sdk.onboard({
      strategy: "cartridge",
      ensureReady: { deploy: "if_needed" },
    } as never);

    return {
      sdk,
      wallet: result.wallet,
      potManager: new PotManager(result.wallet, contracts),
    };
  }

  getSnapshot(): MatchPotSnapshot {
    return {
      entryFeeByMatch: new Map(this.entryFeeByMatch),
      lockedMatches: new Set(this.lockedMatches),
    };
  }

  // Agent Registry
  async registerAgent(name: string, skills: string) {
    return this.execute([
      {
        contractAddress: this.contracts.agentRegistry,
        entrypoint: "register_agent",
        calldata: [name, skills],
      },
    ]);
  }

  // Match Pot lifecycle
  async createMatch(matchId: number, player2: string) {
    return this.execute([
      {
        contractAddress: this.contracts.matchPot,
        entrypoint: "create_match",
        calldata: [matchId, player2],
      },
    ]);
  }

  async depositEntry(matchId: number) {
    return this.execute([
      {
        contractAddress: this.contracts.matchPot,
        entrypoint: "deposit",
        calldata: [matchId],
      },
    ]);
  }

  async lockPot(matchId: number, expectedEntryFee?: bigint) {
    if (expectedEntryFee !== undefined) {
      this.entryFeeByMatch.set(matchId, expectedEntryFee);
    }

    const tx = await this.execute([
      {
        contractAddress: this.contracts.matchPot,
        entrypoint: "lock_pot",
        calldata: [matchId],
      },
    ]);

    this.lockedMatches.add(matchId);
    return tx;
  }

  async distributeMatch(matchId: number, winner: string, loser: string) {
    const tx = await this.execute([
      {
        contractAddress: this.contracts.matchPot,
        entrypoint: "distribute",
        calldata: [matchId, winner, loser],
      },
    ]);

    this.lockedMatches.delete(matchId);
    return tx;
  }

  // Spectator betting lifecycle
  async createBetPool(matchId: number) {
    return this.execute([
      {
        contractAddress: this.contracts.bettingPool,
        entrypoint: "create_pool",
        calldata: [matchId],
      },
    ]);
  }

  async placeBet(poolId: number, onAgentA: boolean, amount: bigint) {
    return this.execute([
      {
        contractAddress: this.contracts.bettingPool,
        entrypoint: "place_bet",
        calldata: [poolId, onAgentA, amount.toString()],
      },
    ]);
  }

  async resolveBetPool(poolId: number, winningSideA: boolean) {
    return this.execute([
      {
        contractAddress: this.contracts.bettingPool,
        entrypoint: "resolve_pool",
        calldata: [poolId, winningSideA],
      },
    ]);
  }

  async claimBetWinnings(poolId: number) {
    return this.execute([
      {
        contractAddress: this.contracts.bettingPool,
        entrypoint: "claim",
        calldata: [poolId],
      },
    ]);
  }

  private async execute(calls: StarknetCall[]) {
    await this.wallet.ensureReady({ deploy: "if_needed" });
    const tx = await this.wallet.execute(calls as never);
    return tx;
  }
}
