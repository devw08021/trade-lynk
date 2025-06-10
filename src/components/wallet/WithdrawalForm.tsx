import React, { useState } from 'react';
import { WalletBalance } from '@/types/wallet';

interface WithdrawalFormProps {
    selectedCoin: string;
    balances: WalletBalance[];
    networkFees: Record<string, string>;
    onSubmit: (address: string, amount: string) => void;
    isLoading: boolean;
}

export default function WithdrawalForm({
    selectedCoin,
    balances,
    networkFees,
    onSubmit,
    isLoading
}: WithdrawalFormProps) {
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');

    const selectedBalance = balances.find(b => b.coin === selectedCoin);
    const networkFee = networkFees[selectedCoin] || '0';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(withdrawalAddress, withdrawalAmount);
    };

    const handleMaxAmount = () => {
        if (selectedBalance) {
            const maxAmount = parseFloat(selectedBalance.available) - parseFloat(networkFee);
            setWithdrawalAmount(Math.max(0, maxAmount).toFixed(8));
        }
    };

    const calculateReceiveAmount = () => {
        if (!withdrawalAmount) return '0.00000000';
        return Math.max(0, parseFloat(withdrawalAmount) - parseFloat(networkFee)).toFixed(8);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-dark">
                <div className="flex-between mb-4">
                    <div className="font-medium text-white">
                        Withdraw {selectedCoin}
                    </div>
                    <div className="text-sm text-gradient-secondary">
                        Available: {selectedBalance?.available || '0'} {selectedCoin}
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
                                    onClick={handleMaxAmount}
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
                        <span className="text-white">{networkFee} {selectedCoin}</span>
                    </div>
                    <div className="flex-between border-t border-[#2a2b2e] pt-2 font-medium">
                        <span className="text-white">You will receive:</span>
                        <span className="text-brand">{calculateReceiveAmount()} {selectedCoin}</span>
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
    );
}
