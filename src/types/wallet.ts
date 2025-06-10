export interface WalletBalance {
  coin: string;
  available: string;
  inOrder: string;
  total: string;
  usdValue: string;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  coin: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  date: string;
  txId: string;
}

export interface WalletData {
  balances: WalletBalance[];
  transactions: Transaction[];
  networkFees: Record<string, string>;
}
