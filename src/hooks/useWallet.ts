import { useState, useMemo } from "react";
import { WalletData } from "@/types/wallet";
import {
  calculateTotalUsdValue,
  calculateInOrdersValue,
} from "@/lib/utils";

export function useWallet(walletData: WalletData) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredBalances = useMemo(
    () =>
      walletData.balances.filter((balance) =>
        balance.coin.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [walletData.balances, searchQuery]
  );

  const totalUsdValue = useMemo(
    () => calculateTotalUsdValue(walletData.balances),
    [walletData.balances]
  );

  const inOrdersValue = useMemo(
    () => calculateInOrdersValue(walletData.balances),
    [walletData.balances]
  );

  const pendingTransactions = useMemo(
    () =>
      walletData.transactions.filter((tx) => tx.status === "pending").length,
    [walletData.transactions]
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedCoin,
    setSelectedCoin,
    isLoading,
    setIsLoading,
    filteredBalances,
    totalUsdValue,
    inOrdersValue,
    pendingTransactions,
  };
}
