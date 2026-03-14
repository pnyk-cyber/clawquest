import { StarkSDK } from "starkzap";

type StarkzapNetwork = "sepolia" | "mainnet";

export interface StarkzapClientConfig {
  network?: StarkzapNetwork;
  rpcUrl?: string;
}

/**
 * Creates a StarkZap SDK client.
 * Uses env defaults when explicit config is not provided.
 */
export function createStarkzapClient(config: StarkzapClientConfig = {}) {
  const network =
    config.network ??
    (import.meta.env.VITE_STARKNET_NETWORK as StarkzapNetwork | undefined) ??
    "sepolia";

  const rpcUrl = config.rpcUrl ?? import.meta.env.VITE_STARKNET_RPC;

  // StarkSDK accepts either network presets or explicit rpcUrl config.
  const sdkConfig = rpcUrl ? ({ network, rpcUrl } as const) : ({ network } as const);
  return new StarkSDK(sdkConfig as never);
}
