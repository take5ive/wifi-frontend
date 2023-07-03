import { BigNumber } from "ethers";
import { CHAINID } from "interfaces/config-data.interface";
import { TokenAmount } from "interfaces/token-amount.interface";
import { Token } from "modules/Token";

export class AmountsStatus {
  status: Record<number, Record<string, string>>;

  constructor(inputAssets: TokenAmount[]) {
    this.status = {};
    inputAssets.forEach(({ token, amount }) => {
      this.add(token, amount);
    });
  }

  private _getRaw(token: Token): BigNumber {
    return BigNumber.from(this.status[token.chainId]?.[token.address] ?? "0");
  }
  get(token: Token): string {
    return token.format(this._getRaw(token));
  }

  getTokens(chainId: number) {
    return this.status[chainId] ?? {};
  }

  add(token: Token, amount: string) {
    const parsedAmount = token.parse(amount);
    this.status[token.chainId] = this.status[token.chainId] || {};
    this.status[token.chainId][token.address] = this._getRaw(token)
      .add(parsedAmount)
      .toString();
    return this;
  }

  sub(token: Token, amount: string) {
    const parsedAmount = token.parse(amount);
    this.status[token.chainId] = this.status[token.chainId] || {};
    this.status[token.chainId][token.address] = this._getRaw(token)
      .sub(parsedAmount)
      .toString();
    return this;
  }

  setRaw(chainId: CHAINID, address: string, amount: BigNumber) {
    this.status[chainId] = this.status[chainId] || {};
    this.status[chainId][address] = amount.toString();
    return this;
  }

  setZero(token: Token) {
    this.status[token.chainId] = this.status[token.chainId] || {};
    this.status[token.chainId][token.address] = "0";
    return this;
  }

  clone() {
    const newStatus = new AmountsStatus([]);
    newStatus.status = JSON.parse(JSON.stringify(this.status));
    return newStatus;
  }
}
