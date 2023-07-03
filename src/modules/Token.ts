import ERC20ABI from "abi/common/ERC20.json";
import {
  BigNumber,
  utils,
  providers,
  BigNumberish,
  constants,
  Contract,
} from "ethers";
import TOKENS from "data/testnet/tokens.testnet";
import CHAINS from "data/testnet/chains.testnet";
import { commaFormat, compactFormat, fromExponential } from "utils";
import { Chain } from "./Chain";
import { getAddress } from "ethers/lib/utils";
import { FormatToken } from "interfaces/formatToken.interface";
import { CHAINID, TokenData } from "interfaces/config-data.interface";
import { ERC20 } from "typechain";

export class Token implements TokenData {
  /**
   * type이 같은 토큰만 bridging이 가능하다.
   * 체인마다 해당 type의 토큰이 존재. USDC, USDT, ...
   */
  id: string;
  chainId!: CHAINID;
  name!: string;
  decimals!: number;
  symbol!: string;
  address!: string;
  imgUrl!: string;

  public isNativeToken() {
    return this.address === constants.AddressZero;
  }

  constructor(data: TokenData) {
    Object.assign(this, data);
    this.id = `${this.chainId}_${this.address}`;
    this.name = this.name ?? this.symbol;
    this.imgUrl = this.imgUrl ?? "https://via.placeholder.com/50";
  }

  static get(chainId: CHAINID, address: string): Token | null {
    const found = TOKENS.find(
      (t) =>
        t.chainId === chainId && getAddress(t.address) === getAddress(address)
    );
    return found ? new Token(found) : null;
  }

  static getById(id: string): Token | null {
    const [chainId, address] = id.split("_");
    return Token.get(+chainId as CHAINID, address);
  }

  static getBySymbol(chainId: CHAINID, symbol: string): Token | null {
    const found = TOKENS.find(
      (t) => t.chainId === chainId && t.symbol === symbol
    );
    return found ? new Token(found) : null;
  }

  static getAll(): Token[] {
    return TOKENS.map((t) => new Token(t));
  }

  static fromChain(chainId: CHAINID) {
    return TOKENS.filter((t) => t.chainId === chainId).map((d) => new Token(d));
  }

  format(value: BigNumberish, props?: FormatToken) {
    let formatted = utils.formatUnits(BigNumber.from(value), this.decimals);
    if (!props || props.places !== null) {
      const re = new RegExp("^-?\\d+(?:.\\d{0," + (props?.places ?? 6) + "})?");
      if (formatted !== "0" && +formatted.match(re)![0] !== 0) {
        formatted = formatted.match(re)![0];
      }
    }

    if (!props) return formatted;
    const format = props.compact
      ? compactFormat
      : props.comma
      ? commaFormat
      : null;
    if (format) {
      formatted = format(+formatted);
    }

    return props.tick ? `${formatted} ${this.symbol}` : formatted;
  }

  parse(value: string | number) {
    return !value || isNaN(+value)
      ? constants.Zero
      : utils.parseUnits(fromExponential(value), this.decimals);
  }

  getChain() {
    return Chain.get(this.chainId);
  }

  getProvider() {
    return new providers.JsonRpcProvider(CHAINS[this.chainId].rpcUrl);
  }

  getContract(): ERC20 {
    return new Contract(this.address, ERC20ABI, this.getProvider()) as ERC20;
  }
}
