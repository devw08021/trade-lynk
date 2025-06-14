import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { useToastContext } from '@/components/ui/ToastContext';

import { useTransferMutation } from '@/services/walletService';


const walletTypes = ["funding", "spot", "p2p", "perpetual"];


const transferinitalForm = {
    fromWallet: "",
    toWallet: "",
    amount: 0,
    loader: false
}
interface TransferFormProps {
    selectedCoin: any;
    balance: [];
    selectedWallet: String;
    onBack: () => void;
}

export default function TransferForm({
    selectedCoin,
    onBack,
    selectedWallet,
    balance
}: TransferFormProps) {

    const [from, setFrom] = useState(transferinitalForm);
    const [errors, setErrors] = useState({})
    const { fromWallet, toWallet, amount, loader } = from;

    const { success: toastSuccess, error: toastError } = useToastContext();

    const [transfer, { isLoading }] = useTransferMutation();

    const selectedBalance = selectedCoin?.available || 0;
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
                fromWallet,
                toWallet,
                amount,
                coin: selectedCoin?.coin,
                coinId: selectedCoin?.coinDoc?._id
            }
            const { success, result, message } = await transfer(data).unwrap();

            if (message) {
                toastSuccess(`${message}`);
                handleClose()
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
            setFrom((prev: any) => {
                return {
                    ...prev,
                    amount: Math.max(0, maxAmount).toFixed(8)
                }
            })
        }
    };

    useEffect(() => {
        setFrom((prev: any) => {
            return {
                ...prev,
                fromWallet: selectedWallet
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWallet])


    const handleClose = () => {
        setFrom(transferinitalForm);
        onBack();
    }
    return (
        <Modal
            isOpen={selectedCoin !== null}
            onClose={handleClose}
            title={'Transfer'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card-dark">
                    <div className="flex-between mb-4">
                        <div className="font-medium text-white">
                            Transfer {selectedCoin?.coin}
                        </div>
                        <div className="text-sm text-gradient-secondary">
                            Available: {selectedBalance || '0'} {selectedCoin?.coin}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                From Wallet
                            </label>
                            <select className="form-select" value={fromWallet} onChange={(e) => setFrom((prev: any) => {
                                return {
                                    ...prev,
                                    fromWallet: e.target.value
                                }
                            })
                            }>
                                <option value={""}>Select Coin</option>
                                {
                                    walletTypes &&
                                    walletTypes.map(
                                        (item: string, index: number) => (
                                            <option key={index} value={item}>{item?.toLocaleUpperCase()}</option>
                                        )
                                    )
                                }
                            </select>
                            {errors.fromWallet && (
                                <p className="text-sm text-red-500">{errors.fromWallet}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                To Wallet
                            </label>
                            <select className="form-select" value={toWallet} onChange={(e) => setFrom((prev: any) => {
                                return {
                                    ...prev,
                                    toWallet: e.target.value
                                }
                            })
                            }>
                                <option value={""}>Select Coin</option>
                                {
                                    walletTypes &&
                                    walletTypes.map(
                                        (item: string, index: number) => (
                                            <option key={index} value={item}>{item?.toLocaleUpperCase()}</option>
                                        )
                                    )
                                }
                            </select>
                            {errors.toWallet && (
                                <p className="text-sm text-red-500">{errors.toWallet}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setFrom((prev: any) => {
                                        return {
                                            ...prev,
                                            amount: e.target.value
                                        }
                                    })}
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
                            {errors.amount && (
                                <p className="text-sm text-red-500">{errors.amount}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-dark">
                    <h4 className="font-medium text-white mb-3">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex-between">
                            <span className="text-gradient-secondary">Amount:</span>
                            <span className="text-white">{amount || '0.00000000'} {selectedCoin?.coin}</span>
                        </div>
                        <div className="flex-between">
                            <span className="text-gradient-secondary">From Wallet:</span>
                            <span className="text-white">{fromWallet?.toLocaleUpperCase()} {selectedCoin?.coin}</span>
                        </div>
                        <div className="flex-between border-t border-[#2a2b2e] pt-2 font-medium">
                            <span className="text-white">To Wallet: </span>
                            <span className="text-brand">{toWallet?.toLocaleUpperCase()} {selectedCoin?.coin}</span>
                        </div>
                    </div>
                </div>

                <div className="alert-warning">
                    <p className="text-sm">
                        <strong>Warning:</strong> You can only available transfer funds only.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loader || !toWallet || !amount}
                    className={`btn-primary-large w-full ${(loader || !toWallet || !amount) ? 'btn-disabled' : ''}`}

                >
                    {loader ? (
                        <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Processing Withdrawal...
                        </div>
                    ) : (
                        `Transfer`
                    )}
                </button>
            </form>
        </Modal>
    );
}
