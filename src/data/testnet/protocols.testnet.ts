import { ProtocolData } from "interfaces/config-data.interface";
import TESTNET_CHAINID from "./chainIds.testnet";

const UniswapV2Protocols: ProtocolData<"UniswapV2">[] = [
  // {
  //   usage: "swap",
  //   type: "UniswapV2",
  //   name: "MYswapV2",
  //   chainId: TESTNET_CHAINID.Klaytn,
  //   data: {
  //     factoryAddress: "0xd515761A0B3B0f8ABAedbf5Ce98DAAe841dC5381",
  //     routerAddress: "0xDc929b5040e15085098C76deF2Fd72698695522b",
  //     wETHAddress: "0x38266E85782aa99A650E758E39f8B2eeDb189183",
  //   },
  // },
  {
    usage: "swap",
    type: "UniswapV2",
    name: "Uniswap V2",
    chainId: TESTNET_CHAINID.Ethereum,
    data: {
      factoryAddress: "0x9D734898bfDC6939655D05d6a2923f7efC075606",
      routerAddress: "0x00f87157Fac4d7d4B21bBFf903db024871b36e04",
      wETHAddress: "0x227A02c6617f02a40a28570E8F272b528aC42cfB",
    },
  },
  {
    usage: "swap",
    type: "UniswapV2",
    name: "Quickswap",
    chainId: TESTNET_CHAINID.Polygon,
    data: {
      factoryAddress: "0xa96c2e7C6f63A434945866491D2E002CC7028B56",
      routerAddress: "0xA436ff165804e4D4652c7859Ea0Ce34cDB1825b4",
      wETHAddress: "0x3a4E2BB60048Efe94cbCB8092651fbFDD2FBF595",
    },
  },
  {
    usage: "swap",
    type: "UniswapV2",
    name: "Honeyswap",
    chainId: TESTNET_CHAINID.Gnosis,
    data: {
      factoryAddress: "0x617659d08e817e4c0F2983c62282Df85090603ad",
      routerAddress: "0x01E402Eff5Fb416fef34FCb47E2bC9f02A19E7bc",
      wETHAddress: "0x42A7ddC4C5814eDD824353BD9CbdCB4D2f1AAdce",
    },
  },
];

const ConnextBridgeProtocols: ProtocolData<"ConnextBridge">[] = [
  // {
  //   usage: "bridge",
  //   type: "ConnextBridge",
  //   name: "Connext Bridge",
  //   chainId: TESTNET_CHAINID.Ethereum,
  //   data: {
  //     coreAddress: "0xFCa08024A6D4bCc87275b1E4A1E22B71fAD7f649",
  //     dstChainIdentifier: 9991,
  //     relayerGasFee: ethers.utils.parseEther("0.3").toString(),
  //     feeBps: 5,
  //     fromToken: {
  //       chainId: TESTNET_CHAINID.Ethereum,
  //       address: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
  //     },
  //     toToken: {
  //       chainId: TESTNET_CHAINID.Polygon,
  //       address: "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",
  //     },
  //   },
  // },
  // {
  //   usage: "bridge",
  //   type: "ConnextBridge",
  //   name: "Connext Bridge",
  //   chainId: TESTNET_CHAINID.Polygon,
  //   data: {
  //     coreAddress: "0x2334937846Ab2A3FCE747b32587e1A1A2f6EEC5a",
  //     dstChainIdentifier: 1735353714,
  //     relayerGasFee: ethers.utils.parseEther("40").toString(),
  //     feeBps: 5,
  //     fromToken: {
  //       chainId: TESTNET_CHAINID.Polygon,
  //       address: "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",
  //     },
  //     toToken: {
  //       chainId: TESTNET_CHAINID.Ethereum,
  //       address: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
  //     },
  //   },
  // },
];

const WiFiBridgeProtocols: ProtocolData<"WiFiBridge">[] = [];

const chains = [
  TESTNET_CHAINID.Ethereum,
  TESTNET_CHAINID.Polygon,
  TESTNET_CHAINID.Gnosis,
  // TESTNET_CHAINID.Aurora,
];

const bridgeAddressBook = {
  5: "0xe56E7DaB24A0Ee78cB3Fd5Bf0576Af15804893cb",
  80001: "0xe56E7DaB24A0Ee78cB3Fd5Bf0576Af15804893cb",
  10200: "0xe56E7DaB24A0Ee78cB3Fd5Bf0576Af15804893cb",
  1313161555: "0x0645477b8D674d44adA65BdfFF19C8c3B7da97bc",
};
for (let i = 0; i < chains.length; i++) {
  for (let j = 0; j < chains.length; j++) {
    if (i === j) continue;
    WiFiBridgeProtocols.push({
      usage: "bridge",
      type: "WiFiBridge",
      name: "WiFi Bridge",
      chainId: chains[i],
      data: {
        coreAddress: (bridgeAddressBook as any)[chains[i]],
        feeBps: 50,
        fromToken: {
          chainId: chains[i],
          address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
        },
        toToken: {
          chainId: chains[j],
          address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
        },
      },
    });
  }
}

const protocols: ProtocolData[] = [
  ...UniswapV2Protocols,
  ...ConnextBridgeProtocols,
  ...WiFiBridgeProtocols,
];

export default protocols;
