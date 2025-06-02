'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, QrCodeIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const STATIC_WALLET_DATA = {
  balances: [
    { coin: 'BTC', available: '0.42681', inOrder: '0.05000', total: '0.47681', usdValue: '19678.92' },
    { coin: 'ETH', available: '5.76543', inOrder: '0.50000', total: '6.26543', usdValue: '14083.98' },
    { coin: 'USDT', available: '12450.75', inOrder: '2500.00', total: '14950.75', usdValue: '14950.75' },
    { coin: 'SOL', available: '95.67890', inOrder: '0.00000', total: '95.67890', usdValue: '13900.45' },
    { coin: 'BNB', available: '12.34560', inOrder: '1.00000', total: '13.34560', usdValue: '6508.67' },
    { coin: 'XRP', available: '10000.50', inOrder: '0.00000', total: '10000.50', usdValue: '5642.28' },
    { coin: 'ADA', available: '8500.25', inOrder: '1500.00', total: '10000.25', usdValue: '4534.11' },
  ],
  transactions: [
    { id: '1234567', type: 'deposit', coin: 'BTC', amount: '0.25000', status: 'completed', date: '2023-09-15T14:32:45Z', txId: '0x7f4b622e9f87c7c5d96f27d14c8d16192d90fb8d67c1e89ec907c8eb7e' },
    { id: '1234568', type: 'withdrawal', coin: 'ETH', amount: '1.50000', status: 'completed', date: '2023-09-12T09:17:22Z', txId: '0x8a2b35c7d91fe4a6e89b7dfecab6284ef1c0a7cf56329ef896453bd45c' },
    { id: '1234569', type: 'deposit', coin: 'USDT', amount: '5000.00', status: 'completed', date: '2023-09-10T18:45:33Z', txId: '0x3c5d8f6a2e7b9d1c4f5e6a8b7c9d1e2f3a4b5c6d7e8f9a1b2c3d4e5f6a7' },
    { id: '1234570', type: 'deposit', coin: 'SOL', amount: '50.00000', status: 'completed', date: '2023-09-07T11:22:17Z', txId: '0x9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0' },
    { id: '1234571', type: 'withdrawal', coin: 'BTC', amount: '0.10000', status: 'pending', date: '2023-09-01T16:05:12Z', txId: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e' },
  ],
  networkFees: {
    BTC: '0.00010',
    ETH: '0.00300',
    USDT: '1.00000',
    SOL: '0.00100',
    BNB: '0.00050',
    XRP: '0.25000',
    ADA: '0.50000',
  }
};

const totalUsdValue = STATIC_WALLET_DATA.balances.reduce((total, balance) => {
  return total + parseFloat(balance.usdValue);
}, 0);

export default function WalletPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('balances');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  
  const filteredBalances = STATIC_WALLET_DATA.balances.filter(balance => 
    balance.coin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (index: number) => {
    setActiveTab(['balances', 'deposit', 'withdrawal', 'transactions'][index]);
    setSelectedCoin(null);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    setDepositAddress(`${coin.toLowerCase()}1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setWithdrawalAddress('');
      setWithdrawalAmount('');
      setSelectedCoin(null);
      alert(`Withdrawal requested: ${withdrawalAmount} ${selectedCoin} to ${withdrawalAddress}`);
    }, 1500);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd use a toast notification here
    alert(message);
  };

  return (
    <div className="page-wrapper">
      <div className="container-custom section-padding">
        {/* Page Header */}
        <div className="flex-between mb-8 mobile-flex gap-4">
          <div>
            <h1 className="heading-secondary text-gradient-muted mb-2">Wallet Management</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gradient-secondary">
                Total Portfolio Value:
              </p>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-brand" />
                <span className="text-2xl font-light text-gradient-primary">
                  ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-full md:w-64"
            />
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">
              ${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-gradient-secondary">Total Balance</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">
              {STATIC_WALLET_DATA.balances.length}
            </div>
            <div className="text-sm text-gradient-secondary">Assets</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">
              ${STATIC_WALLET_DATA.balances.reduce((total, balance) => 
                total + parseFloat(balance.inOrder) * (parseFloat(balance.usdValue) / parseFloat(balance.total)), 0
              ).toFixed(2)}
            </div>
            <div className="text-sm text-gradient-secondary">In Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-light text-gradient-primary mb-2">
              {STATIC_WALLET_DATA.transactions.filter(tx => tx.status === 'pending').length}
            </div>
            <div className="text-sm text-gradient-secondary">Pending</div>
          </div>
        </div>

        <Tab.Group onChange={handleTabChange}>
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
              <div className="table-container">
                <table className="table-main">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Asset</th>
                      <th className="table-header-cell">Available</th>
                      <th className="table-header-cell">In Orders</th>
                      <th className="table-header-cell">Total Balance</th>
                      <th className="table-header-cell">USD Value</th>
                      <th className="table-header-cell text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredBalances.length > 0 ? (
                      filteredBalances.map((balance) => (
                        <tr key={balance.coin} className="table-row">
                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-brand/20 rounded-full flex-center mr-3">
                                <span className="text-brand font-bold text-sm">{balance.coin[0]}</span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{balance.coin}</div>
                                <div className="text-xs text-gradient-secondary">{balance.coin} Network</div>
                              </div>
                            </div>
                          </td>
                          <td className="table-cell text-white font-medium">
                            {parseFloat(balance.available).toFixed(8)}
                          </td>
                          <td className="table-cell status-neutral">
                            {parseFloat(balance.inOrder).toFixed(8)}
                          </td>
                          <td className="table-cell text-white font-medium">
                            {parseFloat(balance.total).toFixed(8)}
                          </td>
                          <td className="table-cell">
                            <div className="text-white font-medium">
                              ${parseFloat(balance.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gradient-secondary">
                              {((parseFloat(balance.usdValue) / totalUsdValue) * 100).toFixed(1)}% of portfolio
                            </div>
                          </td>
                          <td className="table-cell text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCoin(balance.coin);
                                  setActiveTab('deposit');
                                  handleCoinSelect(balance.coin);
                                }}
                                className="btn-ghost text-xs"
                              >
                                Deposit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCoin(balance.coin);
                                  setActiveTab('withdrawal');
                                }}
                                className="btn-ghost text-xs"
                              >
                                Withdraw
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="table-cell text-center status-neutral py-8">
                          No assets found for "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                  <>
                    <p className="text-gradient-secondary mb-6">
                      Select a cryptocurrency to deposit into your funded trading account:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {STATIC_WALLET_DATA.balances.map(balance => (
                        <button
                          key={balance.coin}
                          onClick={() => handleCoinSelect(balance.coin)}
                          className="card-hover p-4 text-center"
                        >
                          <div className="w-10 h-10 bg-brand/20 rounded-full flex-center mx-auto mb-2">
                            <span className="text-brand font-bold">{balance.coin[0]}</span>
                          </div>
                          <div className="font-medium text-white mb-1">{balance.coin}</div>
                          <div className="text-xs text-gradient-secondary">
                            Balance: {parseFloat(balance.available).toFixed(4)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="card-dark">
                      <div className="flex-between mb-4">
                
                      <div className="font-medium text-white">
                          {selectedCoin} Deposit Address
                        </div>
                        <span className="badge badge-success text-xs">
                          {selectedCoin} Network
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Deposit Address
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              readOnly
                              value={depositAddress}
                              className="form-input flex-1 rounded-r-none bg-[#08090a] text-brand font-mono text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(depositAddress, 'Address copied to clipboard!')}
                              className="btn-primary rounded-l-none px-4 flex items-center"
                            >
                              <ClipboardIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-center">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="w-32 h-32 bg-gray-100 flex-center text-gray-400 rounded">
                              <div className="text-center">
                                <QrCodeIcon className="h-8 w-8 mx-auto mb-2" />
                                <div className="text-xs">QR Code</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alert-warning">
                      <p className="text-sm">
                        <strong>Important:</strong> Only send {selectedCoin} to this address on the {selectedCoin} network. 
                        Sending any other cryptocurrency or using a different network may result in permanent loss of funds.
                      </p>
                    </div>
                    
                    <div className="card-dark">
                      <h4 className="font-medium text-brand mb-3">Deposit Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex-between">
                          <span className="text-gradient-secondary">Minimum Deposit:</span>
                          <span className="text-white">0.001 {selectedCoin}</span>
                        </div>
                        <div className="flex-between">
                          <span className="text-gradient-secondary">Confirmations Required:</span>
                          <span className="text-white">{selectedCoin === 'BTC' ? '3' : selectedCoin === 'ETH' ? '12' : '6'}</span>
                        </div>
                        <div className="flex-between">
                          <span className="text-gradient-secondary">Expected Arrival:</span>
                          <span className="text-white">5-30 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <>
                    <p className="text-gradient-secondary mb-6">
                      Select a cryptocurrency to withdraw from your account:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {STATIC_WALLET_DATA.balances.map(balance => (
                        <button
                          key={balance.coin}
                          onClick={() => setSelectedCoin(balance.coin)}
                          className="card-hover p-4 text-center"
                          disabled={parseFloat(balance.available) === 0}
                        >
                          <div className="w-10 h-10 bg-brand/20 rounded-full flex-center mx-auto mb-2">
                            <span className="text-brand font-bold">{balance.coin[0]}</span>
                          </div>
                          <div className="font-medium text-white mb-1">{balance.coin}</div>
                          <div className="text-xs text-gradient-secondary">
                            Available: {parseFloat(balance.available).toFixed(8)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-6">
                    <div className="card-dark">
                      <div className="flex-between mb-4">
                        <div className="font-medium text-white">
                          Withdraw {selectedCoin}
                        </div>
                        <div className="text-sm text-gradient-secondary">
                          Available: {STATIC_WALLET_DATA.balances.find(b => b.coin === selectedCoin)?.available || '0'} {selectedCoin}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Network
                          </label>
                          <select className="form-select">
                            <option value={selectedCoin}>{selectedCoin} Network</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Recipient Address
                          </label>
                          <input
                            type="text"
                            value={withdrawalAddress}
                            onChange={(e) => setWithdrawalAddress(e.target.value)}
                            required
                            placeholder={`Enter ${selectedCoin} address`}
                            className="form-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Amount
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={withdrawalAmount}
                              onChange={(e) => setWithdrawalAmount(e.target.value)}
                              required
                              placeholder="0.00000000"
                              className="form-input pr-20"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <button
                                type="button"
                                onClick={() => {
                                  const balance = STATIC_WALLET_DATA.balances.find(b => b.coin === selectedCoin);
                                  if (balance) {
                                    const maxAmount = parseFloat(balance.available) - parseFloat(STATIC_WALLET_DATA.networkFees[selectedCoin as keyof typeof STATIC_WALLET_DATA.networkFees]);
                                    setWithdrawalAmount(Math.max(0, maxAmount).toFixed(8));
                                  }
                                }}
                                className="text-brand hover:text-[#a6e600] text-sm font-medium"
                              >
                                MAX
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-dark">
                      <h4 className="font-medium text-white mb-3">Transaction Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex-between">
                          <span className="text-gradient-secondary">Amount:</span>
                          <span className="text-white">{withdrawalAmount || '0.00000000'} {selectedCoin}</span>
                        </div>
                        <div className="flex-between">
                          <span className="text-gradient-secondary">Network Fee:</span>
                          <span className="text-white">
                            {STATIC_WALLET_DATA.networkFees[selectedCoin as keyof typeof STATIC_WALLET_DATA.networkFees]} {selectedCoin}
                          </span>
                        </div>
                        <div className="flex-between border-t border-[#2a2b2e] pt-2 font-medium">
                          <span className="text-white">You will receive:</span>
                          <span className="text-brand">
                            {withdrawalAmount ? 
                              Math.max(0, parseFloat(withdrawalAmount) - parseFloat(STATIC_WALLET_DATA.networkFees[selectedCoin as keyof typeof STATIC_WALLET_DATA.networkFees])).toFixed(8) 
                              : '0.00000000'} {selectedCoin}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alert-warning">
                      <p className="text-sm">
                        <strong>Warning:</strong> Withdrawals are irreversible. Please double-check the recipient address and network before confirming.
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !withdrawalAddress || !withdrawalAmount}
                      className={`btn-primary-large w-full ${(isLoading || !withdrawalAddress || !withdrawalAmount) ? 'btn-disabled' : ''}`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner mr-2"></div>
                          Processing Withdrawal...
                        </div>
                      ) : (
                        `Withdraw ${selectedCoin}`
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Tab.Panel>
                
            {/* Transaction History Tab */}
            <Tab.Panel className="tab-content">
              <div className="table-container">
                <table className="table-main">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Date & Time</th>
                      <th className="table-header-cell">Type</th>
                      <th className="table-header-cell">Asset</th>
                      <th className="table-header-cell">Amount</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell text-right">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {STATIC_WALLET_DATA.transactions.map((tx) => (
                      <tr key={tx.id} className="table-row">
                        <td className="table-cell status-neutral">
                          <div className="text-sm">
                            {new Date(tx.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gradient-secondary">
                            {new Date(tx.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center">
                            {tx.type === 'deposit' ? (
                              <ArrowDownIcon className="mr-2 h-4 w-4 status-positive" />
                            ) : (
                              <ArrowUpIcon className="mr-2 h-4 w-4 status-negative" />
                            )}
                            <span className={`badge text-xs ${tx.type === 'deposit' ? 'badge-success' : 'badge-error'}`}>
                              {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-brand/20 rounded-full flex-center mr-2">
                              <span className="text-brand font-bold text-xs">{tx.coin[0]}</span>
                            </div>
                            <span className="font-medium text-white">{tx.coin}</span>
                          </div>
                        </td>
                        <td className="table-cell text-white font-medium">
                          {tx.amount}
                        </td>
                        <td className="table-cell">
                          <span className={`badge text-xs ${
                            tx.status === 'completed' 
                              ? 'badge-success' 
                              : tx.status === 'pending'
                                ? 'badge-warning'
                                : 'badge-error'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="table-cell text-right">
                          <button
                            onClick={() => copyToClipboard(tx.txId, 'Transaction ID copied to clipboard!')}
                            className="btn-ghost text-xs font-mono"
                            title="Click to copy full transaction ID"
                          >
                            {`${tx.txId.slice(0, 8)}...${tx.txId.slice(-8)}`}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {STATIC_WALLET_DATA.transactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gradient-secondary mb-4">
                    <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No transaction history</p>
                    <p className="text-sm">Your deposits and withdrawals will appear here</p>
                  </div>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Security Notice */}
        <div className="mt-8 card">
          <h3 className="text-lg font-medium text-white mb-4">Security & Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Fund Security</h4>
                <p className="text-gradient-secondary text-sm">
                  Your funds are secured with multi-signature wallets and cold storage. We use industry-leading security practices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Address Verification</h4>
                <p className="text-gradient-secondary text-sm">
                  Always verify withdrawal addresses carefully. Transactions are irreversible once confirmed on the blockchain.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">Network Fees</h4>
                <p className="text-gradient-secondary text-sm">
                  Network fees vary based on blockchain congestion. Fees are deducted from your withdrawal amount.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-brand text-sm mb-1">24/7 Support</h4>
                <p className="text-gradient-secondary text-sm">
                  Our support team is available around the clock to assist with any wallet-related issues or questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
