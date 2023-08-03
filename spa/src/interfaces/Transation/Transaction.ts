export interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string;
  transactionNumber: number;
  from: string;
  to: string;
  value: number;
  gas: number;
  gasPrice: number;
  input: string;
}
