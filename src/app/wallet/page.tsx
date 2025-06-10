'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { STATIC_WALLET_DATA } from '@/data';
import { calculateTotalUsdValue } from '@/lib/utils';
import WalletHeader from '@/components/wallet/Header';
import PortfolioSummary from '@/components/wallet/PortfolioSummary';
import BalancesTable from '@/components/wallet/BalancesTable';
import CoinSelector from '@/components/wallet/CoinSelector';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawalForm from '@/components/wallet/WithdrawalForm';
import TransactionHistory from '@/components/wallet/TransactionHistory';
import SecurityNotice from '@/components/wallet/SecurityNotice';

export default function WalletPage() {
  const tabs = ['balances', 'deposit', 'withdrawal', 'transactions'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState('');

  const totalUsdValue = calculateTotalUsdValue(STATIC_WALLET_DATA.balances);

  const filteredBalances = STATIC_WALLET_DATA.balances.filter(balance =>
    balance.coin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedCoin(null);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    setDepositAddress(`${coin.toLowerCase()}1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z`);
  };

  const handleDeposit = (coin: string) => {
    const type = "deposit"
    setSelectedCoin(coin);
    setActiveTab(tabs.findIndex(tab => tab === type));
    handleCoinSelect(coin);
  };

  const handleWithdraw = (coin: string) => {
    const type = "withdrawal"
    setSelectedCoin(coin);
    setActiveTab(tabs.findIndex(tab => tab === type));

  };

  const handleWithdrawalSubmit = (address: string, amount: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSelectedCoin(null);
      alert(`Withdrawal requested: ${amount} ${selectedCoin} to ${address}`);
    }, 1500);
  };

  return (
    <div className="page-wrapper">
      <div className="container-custom section-padding">
        <WalletHeader
          totalUsdValue={totalUsdValue}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <PortfolioSummary
          balances={STATIC_WALLET_DATA.balances}
          transactions={STATIC_WALLET_DATA.transactions}
          totalUsdValue={totalUsdValue}
        />

        <Tab.Group selectedIndex={activeTab} onChange={handleTabChange}>
          <Tab.List className="tab-list mb-8">
            <Tab className={({ selected }) => `tab-button ${selected ? 'tab-button-active' : ''}`}>
              Balances
            </Tab>
            <Tab className={({ selected }) => `tab-button ${selected ? 'tab-button-active' : ''}`}>
              Deposit
            </Tab>
            <Tab className={({ selected }) => `tab-button ${selected ? 'tab-button-active' : ''}`}>
              Withdraw
            </Tab>
            <Tab className={({ selected }) => `tab-button ${selected ? 'tab-button-active' : ''}`}>
              History
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Balances Tab */}
            <Tab.Panel className="tab-content">
              <BalancesTable
                balances={filteredBalances}
                totalUsdValue={totalUsdValue}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                searchQuery={searchQuery}
              />
            </Tab.Panel>

            {/* Deposit Tab */}
            <Tab.Panel className="tab-content">
              <div className="card">
                <div className="flex-between mb-6">
                  <h2 className="text-xl font-medium text-white">Deposit Cryptocurrency</h2>
                  {selectedCoin && (
                    <button
                      onClick={() => setSelectedCoin(null)}
                      className="btn-ghost text-sm"
                    >
                      Change Asset
                    </button>
                  )}
                </div>

                {!selectedCoin ? (
                  <CoinSelector
                    balances={STATIC_WALLET_DATA.balances}
                    onCoinSelect={handleCoinSelect}
                    title="Deposit"
                    subtitle="Select a cryptocurrency to deposit into your funded trading account:"
                  />
                ) : (
                  <DepositForm
                    selectedCoin={selectedCoin}
                    depositAddress={depositAddress}
                    onBack={() => setSelectedCoin(null)}
                  />
                )}
              </div>
            </Tab.Panel>

            {/* Withdraw Tab */}
            <Tab.Panel className="tab-content">
              <div className="card">
                <div className="flex-between mb-6">
                  <h2 className="text-xl font-medium text-white">Withdraw Cryptocurrency</h2>
                  {selectedCoin && (
                    <button
                      onClick={() => setSelectedCoin(null)}
                      className="btn-ghost text-sm"
                    >
                      Change Asset
                    </button>
                  )}
                </div>

                {!selectedCoin ? (
                  <CoinSelector
                    balances={STATIC_WALLET_DATA.balances}
                    onCoinSelect={setSelectedCoin}
                    title="Withdraw"
                    subtitle="Select a cryptocurrency to withdraw from your account:"
                  />
                ) : (
                  <WithdrawalForm
                    selectedCoin={selectedCoin}
                    balances={STATIC_WALLET_DATA.balances}
                    networkFees={STATIC_WALLET_DATA.networkFees}
                    onSubmit={handleWithdrawalSubmit}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </Tab.Panel>

            {/* Transaction History Tab */}
            <Tab.Panel className="tab-content">
              <TransactionHistory transactions={STATIC_WALLET_DATA.transactions} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <SecurityNotice />
      </div>
    </div>
  );
}
