'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowUpIcon, ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total Balance: <span className="font-semibold text-gray-900 dark:text-white">${totalUsdValue.toFixed(2)} USD</span>
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <input
            type="text"
            placeholder="Search coins"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-100 rounded-md bg-white dark:bg-dark-200 text-gray-900 dark:text-white w-full lg:w-64 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
        </div>
      </div>

      <Tab.Group onChange={handleTabChange}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-dark-200 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Balances
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Deposit
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Withdraw
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-dark-300 text-primary-700 dark:text-primary-400 shadow'
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-300'
            }`
          }>
            Transactions
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-dark-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Coin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Available Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      In Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      USD Value
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBalances.length > 0 ? (
                    filteredBalances.map((balance) => (
                      <tr key={balance.coin} className="hover:bg-gray-50 dark:hover:bg-dark-300">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {balance.coin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {balance.available}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {balance.inOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {balance.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${parseFloat(balance.usdValue).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => {
                                setSelectedCoin(balance.coin);
                                setActiveTab('deposit');
                                handleCoinSelect(balance.coin);
                              }}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCoin(balance.coin);
                                setActiveTab('withdrawal');
                              }}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                            >
                              Withdraw
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No coins found for "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deposit Crypto</h2>
              
              {!selectedCoin ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a coin to deposit:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {STATIC_WALLET_DATA.balances.map(balance => (
                      <button
                        key={balance.coin}
                        onClick={() => handleCoinSelect(balance.coin)}
                        className="p-3 bg-gray-50 dark:bg-dark-300 hover:bg-gray-100 dark:hover:bg-dark-400 rounded-lg text-center transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{balance.coin}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Network: {balance.coin}</div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedCoin} Deposit
                    </div>
                    <button
                      onClick={() => setSelectedCoin(null)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Change Coin
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-dark-300 rounded-lg mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Network: {selectedCoin}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Deposit Address
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          readOnly
                          value={depositAddress}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-l-md bg-gray-100 dark:bg-dark-400 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(depositAddress);
                            alert('Address copied to clipboard');
                          }}
                          className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white rounded-r-md hover:bg-primary-600 dark:hover:bg-primary-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        QR Code
                      </div>
                      <div className="w-32 h-32 bg-white dark:bg-dark-100 flex items-center justify-center text-gray-400 rounded">
                        QR Placeholder
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Only send {selectedCoin} to this deposit address. Sending any other asset may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Withdraw Crypto</h2>
              
              {!selectedCoin ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a coin to withdraw:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {STATIC_WALLET_DATA.balances.map(balance => (
                      <button
                        key={balance.coin}
                        onClick={() => setSelectedCoin(balance.coin)}
                        className="p-3 bg-gray-50 dark:bg-dark-300 hover:bg-gray-100 dark:hover:bg-dark-400 rounded-lg text-center transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{balance.coin}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Available: {balance.available}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedCoin} Withdrawal
                    </div>
                    <button
                      onClick={() => setSelectedCoin(null)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Change Coin
                    </button>
                  </div>
                  
                  <form onSubmit={handleWithdraw}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Network
                        </label>
                        <select className="block w-full border border-gray-300 dark:border-dark-100 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-dark-300 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                          <option value={selectedCoin}>{selectedCoin} Network</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={withdrawalAddress}
                          onChange={(e) => setWithdrawalAddress(e.target.value)}
                          required
                          placeholder={`Enter ${selectedCoin} address`}
                          className="block w-full border border-gray-300 dark:border-dark-100 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-dark-300 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="text"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            required
                            placeholder="0.00"
                            className="block w-full border border-gray-300 dark:border-dark-100 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-dark-300 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                              {selectedCoin}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500 dark:text-gray-400">
                            Available: {STATIC_WALLET_DATA.balances.find(b => b.coin === selectedCoin)?.available || '0'} {selectedCoin}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const balance = STATIC_WALLET_DATA.balances.find(b => b.coin === selectedCoin);
                              if (balance) {
                                setWithdrawalAmount(balance.available);
                              }
                            }}
                            className="text-primary-600 dark:text-primary-400"
                          >
                            Max
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
                        <span className="text-gray-900 dark:text-white">{STATIC_WALLET_DATA.networkFees[selectedCoin as keyof typeof STATIC_WALLET_DATA.networkFees]} {selectedCoin}</span>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                          {isLoading ? 'Processing...' : 'Withdraw'}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </Tab.Panel>
              
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-dark-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      TxID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {STATIC_WALLET_DATA.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-dark-300">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(tx.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {tx.type === 'deposit' ? (
                            <ArrowDownIcon className="mr-1 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpIcon className="mr-1 h-4 w-4 text-red-500" />
                          )}
                          <span className={tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {tx.coin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tx.txId);
                            alert('TxID copied to clipboard');
                          }}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        >
                          {`${tx.txId.slice(0, 6)}...${tx.txId.slice(-6)}`}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 