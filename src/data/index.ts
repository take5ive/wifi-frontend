import MAINNET_CHAINID from "./mainnet/chainIds.mainnet";
import TESTNET_CHAINID from "./testnet/chainIds.testnet";
import MAINNET_CHAINS from "./mainnet/chains.mainnet";
import TESTNET_CHAINS from "./testnet/chains.testnet";
import MAINNET_TOKENS from "./mainnet/tokens.mainnet";
import TESTNET_TOKENS from "./testnet/tokens.testnet";
import mainnetBridgeRoutes from "./mainnet/bridge-routes.mainnet";
import testnetBridgeRoutes from "./testnet/bridge-routes.testnet";
import TESTNET_PROTOCOLS from "./testnet/protocols.testnet";
import MAINNET_PROTOCOLS from "./mainnet/protocols.testnet";
import { CHAINID } from "interfaces/config-data.interface";
import { BridgeRoute } from "interfaces/bridge-route.interface";

export const isMainnet = false;
export const chainIds = isMainnet ? MAINNET_CHAINID : TESTNET_CHAINID;
export const CHAINS = isMainnet ? MAINNET_CHAINS : TESTNET_CHAINS;
export const TOKENS = isMainnet ? MAINNET_TOKENS : TESTNET_TOKENS;
export const PROTOCOLS = isMainnet ? MAINNET_PROTOCOLS : TESTNET_PROTOCOLS;
export const BRIDGE_ROUTES = isMainnet
  ? mainnetBridgeRoutes
  : testnetBridgeRoutes;

// null means `anything`
export const filterBridgeRoute = (
  srcChainId: CHAINID | null,
  srcAddr: string | null,
  dstChainId: CHAINID | null,
  dstAddr: string | null,
): BridgeRoute | null => {
  return BRIDGE_ROUTES.find(
    (route) =>
      (!srcChainId || route.srcChain === srcChainId) &&
      (!srcAddr || route.srcAddr === srcAddr) &&
      (!dstChainId || route.dstChain === dstChainId) &&
      (!dstAddr || route.dstAddr === dstAddr)
  ) ?? null;
}

export const bridgeNameOf: Record<string, string> = {
  bifrostBridge: "Bifrost Network Bridge",
  anyswap: "Multichain Bridge"
};