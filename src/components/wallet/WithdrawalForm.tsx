import React, { useState } from 'react';
import Modal from '../ui/Modal';

import { useToastContext } from '@/components/ui/ToastContext';

import { useWithdrawMutation } from '@/services/walletService';

interface WithdrawalFormProps {
    selectedCoin: any;
    onSubmit: (address: string, amount: string) => void;
    isLoading: boolean;
    onBack: () => void;
}

const inistalForm = {
    amount: 0,
    twoFa: "",
    address: "",
    loader: false
}

export default function WithdrawalForm({
    selectedCoin,
    onBack,
    isLoading
}: WithdrawalFormProps) {
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');

    const [from, setFrom] = useState(inistalForm);
    const [errors, setErrors] = useState({})
    const { amount, twoFa, address, loader } = from;

    const { success: toastSuccess, error: toastError } = useToastContext();

    const [withdraw] = useWithdrawMutation();

    const selectedBalance = selectedCoin?.funding || 0;
    const networkFee = selectedCoin?.withdraw || '0';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFrom((pre => {
                return {
                    ...pre,
                    loader: true
                }
            }))

            let data = {
                type: "crypto",
                twoFa,
                address,
                amount,
                coin: selectedCoin?.coin,
                coinId: selectedCoin?.coinDoc?._id
            }
            const { success, result, message } = await withdraw(data).unwrap();

            if (message) {
                toastSuccess(`${message}`);
                onBack()
            }
        } catch (err) {
            if (err && (err as any).data?.errors) {
                setErrors((prev) => ({ ...prev, errors: err && (err as any).data?.errors }))
            } else if (err && (err as any).data?.message) {
                toastError(err && (err as any).data?.message);
            }
        } finally {
            setFrom((pre => {
                return {
                    ...pre,
                    loader: false
                }
            }))
        }
    };

    const handleMaxAmount = () => {
        if (selectedBalance) {
            const maxAmount = parseFloat(selectedBalance) - parseFloat(networkFee);
            setWithdrawalAmount(Math.max(0, maxAmount).toFixed(8));
        }
    };

    const calculateReceiveAmount = () => {
        if (!withdrawalAmount) return '0.00000000';
        return Math.max(0, parseFloat(withdrawalAmount) - parseFloat(networkFee)).toFixed(8);
    };

    return (
        <Modal
            isOpen={selectedCoin?.coin !== ''}
            onClose={onBack}
            title={'Withdraw'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card-dark">
                    <div className="flex-between mb-4">
                        <div className="font-medium text-white">
                            Withdraw {selectedCoin?.coin}
                        </div>
                        <div className="text-sm text-gradient-secondary">
                            Available: {selectedBalance || '0'} {selectedCoin?.coin}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Network
                            </label>
                            <select className="form-select">
                                <option value={selectedCoin?.coin}>{selectedCoin?.coin} Network</option>
                            </select>
                            {errors.coin && (
                                <p className="text-sm text-red-500">{errors.coin}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Recipient Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setFrom((pre: any) => ({ ...pre, address: e.target.value }))}
                                onWheel={(e) => (e.target as any).blur()}
                                required
                                placeholder={`Enter ${selectedCoin?.coin} address`}
                                className="form-input"
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setFrom((pre: any) => ({ ...pre, amount: e.target.value }))}
                                    onWheel={(e) => (e.target as any).blur()}
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
                                {errors.amount && (
                                    <p className="text-sm text-red-500">{errors.amount}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-dark">
                    <h4 className="font-medium text-white mb-3">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex-between">
                            <span className="text-gradient-secondary">Amount:</span>
                            <span className="text-white">{withdrawalAmount || '0.00000000'} {selectedCoin?.coin}</span>
                        </div>
                        <div className="flex-between">
                            <span className="text-gradient-secondary">Network Fee:</span>
                            <span className="text-white">{networkFee} {selectedCoin?.coin}</span>
                        </div>
                        <div className="flex-between border-t border-[#2a2b2e] pt-2 font-medium">
                            <span className="text-white">You will receive:</span>
                            <span className="text-brand">{calculateReceiveAmount()} {selectedCoin?.coin}</span>
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
                    disabled={loader || !address || !amount}
                    className={`btn-primary-large w-full ${(loader || !address || !amount) ? 'btn-disabled' : ''}`}
                >
                    {loader ? (
                        <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Processing Withdrawal...
                        </div>
                    ) : (
                        `Withdraw ${selectedCoin?.coin}`
                    )}
                </button>
            </form>
        </Modal>
    );
}
