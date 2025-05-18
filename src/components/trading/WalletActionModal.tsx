'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { 
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  QrCodeIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface WalletActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'deposit' | 'withdraw';
  coin: {
    name: string;
    symbol: string;
    logo: string;
    balance: number;
    networks: Array<{
      name: string;
      depositAddress?: string;
      withdrawalEnabled: boolean;
      minWithdrawal?: number;
      withdrawalFee?: number;
      estimatedTime: string;
      isMainnet: boolean;
    }>;
  };
  onSubmitWithdrawal?: (data: {
    amount: number;
    address: string;
    network: string;
    memo?: string;
  }) => Promise<void>;
}

export default function WalletActionModal({
  isOpen,
  onClose,
  actionType,
  coin,
  onSubmitWithdrawal,
}: WalletActionModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [step, setStep] = useState<'network' | 'form' | 'confirm' | 'success' | 'error'>('network');
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('network');
      setSelectedNetwork('');
      setAmount('');
      setAddress('');
      setMemo('');
      setError(null);
    }
  }, [isOpen, actionType]);

  const handleNetworkSelect = (networkName: string) => {
    setSelectedNetwork(networkName);
    setStep('form');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleMaxAmount = () => {
    setAmount(coin.balance.toString());
  };

  const handleCopyAddress = (address: string | undefined) => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsAddressCopied(true);
      setTimeout(() => setIsAddressCopied(false), 2000);
    }
  };

  const handleSubmitWithdrawal = async () => {
    if (!selectedNetwork || !amount || !address || Number(amount) <= 0) {
      setError('Please fill all required fields with valid values.');
      return;
    }

    const network = coin.networks.find(n => n.name === selectedNetwork);
    if (!network) return;

    const amountNum = Number(amount);
    
    if (network.minWithdrawal && amountNum < network.minWithdrawal) {
      setError(`Minimum withdrawal amount is ${network.minWithdrawal} ${coin.symbol.toUpperCase()}`);
      return;
    }
    
    if (amountNum > coin.balance) {
      setError(`Insufficient balance. You have ${coin.balance} ${coin.symbol.toUpperCase()} available.`);
      return;
    }

    setError(null);
    setStep('confirm');
  };

  const handleConfirmWithdrawal = async () => {
    setIsLoading(true);
    try {
      if (onSubmitWithdrawal) {
        await onSubmitWithdrawal({
          amount: Number(amount),
          address,
          network: selectedNetwork,
          memo: memo || undefined,
        });
      }
      setStep('success');
    } catch (err) {
      console.error('Withdrawal error:', err);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedNetwork = () => {
    return coin.networks.find(n => n.name === selectedNetwork);
  };

  const renderNetworkSelection = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Network
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Choose the blockchain network for {actionType === 'deposit' ? 'depositing' : 'withdrawing'} {coin.symbol.toUpperCase()}.
        </p>
        
        <div className="space-y-3 mt-6">
          {coin.networks.map((network) => (
            <button
              key={network.name}
              onClick={() => handleNetworkSelect(network.name)}
              disabled={actionType === 'withdraw' && !network.withdrawalEnabled}
              className={`w-full flex items-center justify-between p-4 border rounded-lg ${
                actionType === 'withdraw' && !network.withdrawalEnabled
                  ? 'bg-gray-100 dark:bg-dark-200 cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-200'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-200 flex items-center justify-center">
                    {network.name.substring(0, 1)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {network.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    {network.isMainnet ? (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Mainnet
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
                        Testnet
                      </span>
                    )}
                    <span className="mx-2">•</span>
                    <span>Est. {network.estimatedTime}</span>
                  </p>
                </div>
              </div>
              {actionType === 'withdraw' && network.withdrawalFee !== undefined && (
                <div className="text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Fee</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {network.withdrawalFee} {coin.symbol.toUpperCase()}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDepositForm = () => {
    const network = getSelectedNetwork();
    if (!network) return null;
    
    return (
      <div>
        <button
          onClick={() => setStep('network')}
          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 mb-4"
        >
          ← Back to networks
        </button>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Deposit {coin.symbol.toUpperCase()}
        </h3>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Only send {coin.symbol.toUpperCase()} on the {network.name} network to this address. 
                Sending any other asset may result in permanent loss.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your {coin.symbol.toUpperCase()} Deposit Address ({network.name})
          </label>
          <div className="flex items-center mt-1 mb-2">
            <div className="bg-gray-100 dark:bg-dark-200 p-2 rounded-md flex-1 font-mono text-sm break-all">
              {network.depositAddress || 'Address not available'}
            </div>
            <button
              type="button"
              onClick={() => handleCopyAddress(network.depositAddress)}
              className="ml-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-200 focus:outline-none"
              disabled={!network.depositAddress}
            >
              {isAddressCopied ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ClipboardIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {network.depositAddress && (
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${network.depositAddress}`}
                alt="QR code for deposit address"
                className="w-40 h-40"
              />
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          <p>Network fee: Determined by blockchain network</p>
          <p className="mt-1">Estimated arrival time: {network.estimatedTime}</p>
        </div>
      </div>
    );
  };

  const renderWithdrawForm = () => {
    const network = getSelectedNetwork();
    if (!network) return null;
    
    return (
      <div>
        <button
          onClick={() => setStep('network')}
          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 mb-4"
        >
          ← Back to networks
        </button>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Withdraw {coin.symbol.toUpperCase()}
        </h3>
        
        <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Available Balance</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {coin.balance} {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                name="amount"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                className="block w-full pr-16 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-dark-100 dark:bg-dark-200 dark:text-white"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <div className="flex items-center pr-2">
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mr-2"
                  >
                    MAX
                  </button>
                  <span className="text-gray-500 dark:text-gray-400">
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            {network.minWithdrawal !== undefined && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum withdrawal: {network.minWithdrawal} {coin.symbol.toUpperCase()}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Withdrawal Address
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-dark-100 dark:bg-dark-200 dark:text-white"
                placeholder={`Enter your ${network.name} wallet address`}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Memo/Tag <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="memo"
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="block w-full sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-dark-100 dark:bg-dark-200 dark:text-white"
                placeholder="Enter memo or tag if required"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Some exchanges require a memo/tag for deposits. Please check with the recipient.
              </p>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitWithdrawal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderWithdrawalConfirmation = () => {
    const network = getSelectedNetwork();
    if (!network) return null;
    
    const amountNum = Number(amount);
    const fee = network.withdrawalFee || 0;
    const totalAmount = amountNum - fee;
    
    return (
      <div>
        <button
          onClick={() => setStep('form')}
          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 mb-4"
        >
          ← Back to form
        </button>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Confirm Withdrawal
        </h3>
        
        <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Asset</span>
              <div className="flex items-center">
                <img 
                  src={coin.logo} 
                  alt={coin.name} 
                  className="w-5 h-5 mr-2" 
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {network.name}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
              <span className="font-medium text-gray-900 dark:text-white text-right max-w-[240px] truncate">
                {address}
              </span>
            </div>
            
            {memo && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Memo/Tag</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {memo}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {amountNum} {coin.symbol.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {fee} {coin.symbol.toUpperCase()}
              </span>
            </div>
            
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">You will receive</span>
              <span className="font-medium text-lg text-gray-900 dark:text-white">
                {totalAmount} {coin.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please verify that the withdrawal address is correct. Transactions cannot be reversed once they are confirmed on the blockchain.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmWithdrawal}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </div>
            ) : (
              'Confirm Withdrawal'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessState = () => {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Withdrawal Submitted
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          Your withdrawal request has been submitted successfully. The transaction will be processed shortly. You can check the status in your transaction history.
        </p>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    );
  };

  const renderErrorState = () => {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Withdrawal Failed
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          There was an error processing your withdrawal request. Please try again later or contact customer support if the issue persists.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-100 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setStep('network')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={actionType === 'deposit' ? `Deposit ${coin.name}` : `Withdraw ${coin.name}`}
      size="lg"
    >
      <div>
        <div className="flex justify-center mb-6">
          <div className={`p-3 rounded-full ${
            actionType === 'deposit' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
          }`}>
            {actionType === 'deposit' 
              ? <ArrowDownCircleIcon className="h-8 w-8" /> 
              : <ArrowUpCircleIcon className="h-8 w-8" />
            }
          </div>
        </div>
        
        
        {step === 'network' && renderNetworkSelection()}
        {step === 'form' && actionType === 'deposit' && renderDepositForm()}
        {step === 'form' && actionType === 'withdraw' && renderWithdrawForm()}
        {step === 'confirm' && renderWithdrawalConfirmation()}
        {step === 'success' && renderSuccessState()}
        {step === 'error' && renderErrorState()}
      </div>
    </Modal>
  );
} 