import { constants } from "ethers";
import TESTNET_CHAINID from "./chainIds.testnet";
import { TokenData } from "interfaces/config-data.interface";

const TESTNET_TOKENS: TokenData[] = [
  // {
  //   chainId: TESTNET_CHAINID.Klaytn,
  //   name: "KLAY",
  //   decimals: 18,
  //   symbol: "KLAY",
  //   address: "0x0000000000000000000000000000000000000000",
  //   imgUrl: "/icons/chain/klaytn.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Klaytn,
  //   name: "USD Coin",
  //   decimals: 6,
  //   symbol: "USDC",
  //   address: "0x597653951027c042958e60007d9044AF1B753f5F",
  //   imgUrl: "/icons/token/usdc.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Klaytn,
  //   name: "Tether",
  //   decimals: 6,
  //   symbol: "USDT",
  //   address: "0x2e878772e49516FD5Ff4A848ec410db71ad1DcE6",
  //   imgUrl: "/icons/token/usdt.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Klaytn,
  //   name: "Dogecoin",
  //   decimals: 18,
  //   symbol: "DOGE",
  //   address: "0x5281278F9066223632915F6cA846E26abE2EbB2A",
  //   imgUrl: "/icons/token/dogecoin.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Binance,
  //   name: "BNB",
  //   decimals: 18,
  //   symbol: "BNB",
  //   address: "0x0000000000000000000000000000000000000000",
  //   imgUrl:
  //     "https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/bsctest/coin/coinImage.png",
  // },
  //////////////////////// GOERLI ////////////////////////////
  {
    chainId: TESTNET_CHAINID.Ethereum,
    name: "ETH",
    decimals: 18,
    symbol: "ETH",
    address: constants.AddressZero,
    imgUrl:
      "https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/goerli/coin/coinImage.png",
  },
  // {
  //   chainId: TESTNET_CHAINID.Ethereum,
  //   name: "Wrapped ETH",
  //   decimals: 18,
  //   symbol: "WETH",
  //   address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  //   imgUrl:
  //     "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png",
  // },
  {
    chainId: TESTNET_CHAINID.Ethereum,
    name: "USD Coin",
    decimals: 6,
    symbol: "USDC",
    // decimals: 18,
    // address: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    imgUrl: "/icons/token/usdc.png",
  },
  {
    chainId: TESTNET_CHAINID.Ethereum,
    name: "Pepe",
    decimals: 18,
    symbol: "PEPE",
    address: "0x5B9C6cCc716F635392060f1580a8AdAF85C76a14",
    imgUrl: "/icons/token/pepe.png",
  },
  {
    chainId: TESTNET_CHAINID.Ethereum,
    name: "Tether USD",
    decimals: 6,
    symbol: "USDT",
    address: "0x9f65d8E5c6947a4D6B11B3059e174C48F9b8c516",
    imgUrl: "/icons/token/usdt.png",
  },

  //////////////////////// MUMBAI ////////////////////////////
  {
    chainId: TESTNET_CHAINID.Polygon,
    name: "Polygon Matic",
    decimals: 18,
    symbol: "MATIC",
    address: constants.AddressZero,
    imgUrl: "/icons/chain/polygon.png",
  },
  {
    chainId: TESTNET_CHAINID.Polygon,
    name: "USD Coin",
    decimals: 18,
    symbol: "USDC",
    address: "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",
    imgUrl: "/icons/token/usdc.png",
  },
  {
    chainId: TESTNET_CHAINID.Polygon,
    name: "Tether USD",
    decimals: 6,
    symbol: "USDT",
    address: "0x2BEe6c37Ca26D5c341E1B7eC71d5BCdd705539c1",
    imgUrl: "/icons/token/usdt.png",
  },
  {
    chainId: TESTNET_CHAINID.Polygon,
    name: "Wrapped BTC",
    decimals: 18,
    symbol: "WBTC",
    address: "0xB499C2788bb5F0DA3DC389A7DcFAA7f03EF7dfbE",
    imgUrl: "/icons/token/wbtc.png",
  },

  //////////////////////// Chiado ////////////////////////////
  {
    chainId: TESTNET_CHAINID.Gnosis,
    name: "Chiado xDAI",
    decimals: 18,
    symbol: "xDAI",
    address: constants.AddressZero,
    imgUrl: "https://docs.gnosischain.com/img/tokens/chiado-xdai.png",
  },
  {
    chainId: TESTNET_CHAINID.Gnosis,
    name: "USD Coin",
    decimals: 6,
    symbol: "USDC",
    address: "0xAF7552931152170Bf3f1585dd97075B4A47dbd71",
    imgUrl: "/icons/token/usdc.png",
  },
  {
    chainId: TESTNET_CHAINID.Gnosis,
    name: "Tether USD",
    decimals: 6,
    symbol: "USDT",
    address: "0xaaC552Eb6519456f9fF596B97266ee9F5f68d09C",
    imgUrl: "/icons/token/usdt.png",
  },
  {
    chainId: TESTNET_CHAINID.Gnosis,
    name: "Wrapped BTC",
    decimals: 6,
    symbol: "WBTC",
    address: "0xa83EC0095295E87D9dfe544E4E6EdC48C3B48a34",
    imgUrl: "/icons/token/wbtc.png",
  },

  //////// WI-FI TOKENS /////////
  // {
  //   chainId: TESTNET_CHAINID.Aurora,
  //   name: "Aurora ETH",
  //   decimals: 18,
  //   symbol: "ETH",
  //   address: constants.AddressZero,
  //   imgUrl: "/icons/chain/aurora.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Aurora,
  //   name: "Tether USD",
  //   decimals: 6,
  //   symbol: "USDT",
  //   address: "0xA97370C6Ec3fB9aad99B70986e0EB6EEc9580e31",
  //   imgUrl: "/icons/token/usdt.png",
  // },
  // {
  //   chainId: TESTNET_CHAINID.Aurora,
  //   name: "USDC",
  //   decimals: 6,
  //   symbol: "USDC",
  //   address: "0xc542020a864AACdC72b6c1178a2694E23cE3300E",
  //   imgUrl: "/icons/token/usdc.png",
  // },

  //////// WI-FI TOKENS /////////
  {
    chainId: TESTNET_CHAINID.Ethereum,
    name: "Wi-Fi",
    decimals: 18,
    symbol: "WIFI",
    address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
    imgUrl: "/icons/token/wifi.png",
  },
  // {
  //   chainId: TESTNET_CHAINID.Aurora,
  //   name: "Wi-Fi",
  //   decimals: 18,
  //   symbol: "WIFI",
  //   address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
  //   imgUrl: "/icons/token/wifi.png",
  // },
  {
    chainId: TESTNET_CHAINID.Gnosis,
    name: "Wi-Fi",
    decimals: 18,
    symbol: "WIFI",
    address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
    imgUrl: "/icons/token/wifi.png",
  },
  {
    chainId: TESTNET_CHAINID.Polygon,
    name: "Wi-Fi",
    decimals: 18,
    symbol: "WIFI",
    address: "0xBCF04210D4f6a9907f59a2456f2A4F4a33A849Da",
    imgUrl: "/icons/token/wifi.png",
  },
];

export default TESTNET_TOKENS;
