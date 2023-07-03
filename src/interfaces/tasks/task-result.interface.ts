export interface TaskResult {
  chainId: number;
  signer: string;
  sentAt: number;
  confirmedAt: number;
  txHash: string;
}
