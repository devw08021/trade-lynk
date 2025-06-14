'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { STATIC_WALLET_DATA } from '@/data';
import { calculateTotalUsdValue } from '@/lib/utils';

// redux
import { useAppSelector } from '@/store/store';
import WalletHeader from '@/components/wallet/Header';
import PortfolioSummary from '@/components/wallet/PortfolioSummary';
import BalancesTable from '@/components/wallet/BalancesTable';
import CoinSelector from '@/components/wallet/CoinSelector';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawalForm from '@/components/wallet/WithdrawalForm';
import TransactionHistory from '@/components/wallet/TransactionHistory';
import SecurityNotice from '@/components/wallet/SecurityNotice';
import TransferForm from '@/components/wallet/TransferForm'

const walletTypes = ["all", "funding", "spot", "p2p", "perpetual"];
export default function WalletPage() {
  const tabs = ['balances', 'deposit', 'withdrawal', 'transactions'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeWalletTab, setActiveWalletType] = useState("all");
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const [walletList, setWalletList] = useState([]);

  //redux
  const { balances, currency } = useAppSelector((state) => state.wallet)


  const filteredBalances = STATIC_WALLET_DATA.balances.filter(balance =>
    balance.coin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedCoin(null);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    setDepositAddress(`1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z`);
  };

  const handleDeposit = (coin: any) => {
    const type = "deposit"
    setSelectedCoin(coin);
    setActiveTab(tabs.findIndex(tab => tab === type));
    handleCoinSelect(coin);
  };

  const handleWithdraw = (coin: any) => {
    const type = "withdrawal"
    setSelectedCoin(coin);
    setActiveTab(tabs.findIndex(tab => tab === type));
  };
  const handleTransfer = (coin: any) => {
    setSelectedCoin(coin);
  };

  const handleWithdrawalSubmit = (address: string, amount: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSelectedCoin(null);
      alert(`Withdrawal requested: ${amount} ${selectedCoin} to ${address}`);
    }, 1500);
  };

  useEffect(() => {

    // balance struc for table
    if (balances?.length > 0) {
      let balanceArrayStruc = []
      let totalBalance = 0
      let currencyList = currency?.data
      balances?.forEach((balance: any) => {
        let symbol = balance.symbol
        let available = 0, inOrder = 0, usdValue = 0, total = 0, cnvPrice = 0;
        let coinInfo = currencyList?.find((currency: any) => currency.symbol === symbol)

        if (activeWalletTab == "all") {
          available = (balance?.funding ?? 0) + (balance?.spot ?? 0) + (balance?.p2p ?? 0) + (balance?.perpetual ?? 0);
          inOrder = (balance?.spotLock ?? 0) + (balance?.p2pLock ?? 0) + (balance?.perpetualLock ?? 0);
          total = available + inOrder;
          usdValue = (total * cnvPrice) ?? 0
        } else {
          available = balance?.[activeWalletTab] ?? 0;
          inOrder = balance?.[`${activeWalletTab}Lock`] ?? 0;
          total = available + inOrder;
          usdValue = (total * cnvPrice) ?? 0
        }

        balanceArrayStruc.push({
          coinDoc: coinInfo,
          coin: balance.symbol,
          available: available,
          inOrder: inOrder,
          total: total,
          funding: balance?.funding ?? 0,
          usdValue: usdValue ?? 0
        })
        totalBalance += usdValue ?? 0
      })
      setWalletList(balanceArrayStruc)
      setTotalUsdValue(totalBalance)
    }

  }, [balances, currency, activeWalletTab])

  return (
    <div className="page-wrapper">
      {
        walletList?.length > 0 ?
          <div className="container-custom section-padding">
            <WalletHeader
              totalUsdValue={totalUsdValue}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <PortfolioSummary
              balances={walletList}
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
              {
                activeTab == 0 &&
                <Fragment>
                  <Tab.Group selectedIndex={walletTypes.indexOf(activeWalletTab)}
                    onChange={(index) => setActiveWalletType(walletTypes[index])}>
                    <Tab.List className="tab-list mb-8">

                      {walletTypes.map((type) => (
                        <Tab key={type} className={({ selected }) => `tab-button ${selected ? 'tab-button-active' : ''}`}>
                          {type.toUpperCase()}
                        </Tab>
                      ))}
                    </Tab.List>
                  </Tab.Group>
                </Fragment>
              }

              <Tab.Panels>
                {/* Balances Tab */}
                <Tab.Panel className="tab-content">
                  <BalancesTable
                    balances={walletList}
                    walletType={activeWalletTab}
                    totalUsdValue={totalUsdValue}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    onTransfer={handleTransfer}
                    searchQuery={searchQuery}
                  />
                  <TransferForm
                    balance={walletList}
                    selectedCoin={selectedCoin}
                    selectedWallet={activeWalletTab}
                    onBack={() => setSelectedCoin(null)}

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
                        balances={walletList}
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
                        balances={walletList}
                        onCoinSelect={setSelectedCoin}
                        title="Withdraw"
                        subtitle="Select a cryptocurrency to withdraw from your account:"
                      />
                    ) : (
                      <WithdrawalForm
                        selectedCoin={selectedCoin}
                        onSubmit={handleWithdrawalSubmit}
                        isLoading={isLoading}
                        onBack={() => setSelectedCoin(null)}
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
          </div> :
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            Loading...
          </div>
      }
    </div>
  );
}
