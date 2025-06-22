import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { useAppSelector } from '@/store/store';

import { useToastContext } from '@/components/ui/ToastContext';

import { useCreateOfferMutation } from '@/services/p2pService';

interface reateADDFormProps {
    pair: string[],
    isCreateAdd: Boolean,
    onBack: () => void;
}

const inistalForm = {
    pairId: "",
    curreecntPrice: 0,
    balance: 0,
    tradeType: 'buy',
    crypto: '',
    fiat: '',
    price: '',
    quantity: '',
    minLimit: '',
    maxAmount: '',
    paymentMethod: '',
    description: '',
    loader: false,

}

export default function CreateAddForm({
    pair,
    isCreateAdd,
    onBack,
}: reateADDFormProps) {
    const { balances } = useAppSelector((state) => state.wallet)

    const [form, setForm] = useState(inistalForm);
    const { pairId, curreecntPrice, tradeType, balance, crypto, fiat, price, quantity, minLimit, maxAmount, paymentMethod, description, loader } = form;
    const [errors, setErrors] = useState({})

    const { success: toastSuccess, error: toastError } = useToastContext();

    const [createOffer] = useCreateOfferMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setForm((pre => {
                return {
                    ...pre,
                    loader: true
                }
            }))

            let data = {
                side: tradeType,
                pairId,
                crypto,
                fiat,
                price,
                quantity,
                minLimit: minLimit,
                maxLimit: maxAmount,
                payBy: paymentMethod,
                description: description
            }
            const { success, result, message } = await createOffer(data).unwrap();

            if (message) {
                toastSuccess(`${message}`);
                closeModel()
            }
        } catch (err) {
            if (err && (err as any).data?.errors) {
                setErrors(err && (err as any).data?.errors)
            } else if (err && (err as any).data?.message) {
                toastError(err && (err as any).data?.message);
            }
        } finally {
            setForm((pre => {
                return {
                    ...pre,
                    loader: false
                }
            }))
        }
    };

    useEffect(() => {
        if (crypto && fiat && pair.length > 0) {
            let selectedPair = pair.find((item) => item?.firstCoin == crypto && item?.secondCoin == fiat)
            let bal = balances.find((item) => item?.symbol == crypto)
            if (selectedPair) {
                setForm((prev) => {
                    return {
                        ...prev,
                        pairId: selectedPair._id,
                        curreecntPrice: selectedPair.price,
                        balance: bal?.p2p || 0
                    }
                })

            }
        }
    }, [crypto, fiat, pair, balances])

    const closeModel = () => {
        setForm(inistalForm)
        onBack()
    }
    return (
        <Modal
            isOpen={isCreateAdd}
            onClose={closeModel}
            title={'Post P2P Ad'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card-dark">
                    <div className="flex-between mb-4">
                        <div className="font-medium text-white">
                            Post {tradeType === 'buy' ? 'Buy' : 'Sell'} Ad - {crypto}
                        </div>
                        {
                            tradeType == 'sell' &&
                            <div className="text-sm text-gradient-secondary">
                                Available Balance: {balance || '0'} {crypto}
                            </div>
                        }
                    </div>

                    <div className="space-y-4">
                        {/* ✅ Currency Selections */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Crypto Currency
                                </label>
                                <select
                                    className="form-select"
                                    value={crypto}
                                    onChange={(e) => setForm((prev) => ({ ...prev, crypto: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Crypto</option>
                                    {Array.from(new Map(
                                        pair.map((currency) => [currency.firstCoin, currency])
                                    ).values()).map((currency) => (
                                        <option key={currency.firstCoin} value={currency.firstCoin}>
                                            {currency.firstCoin}
                                        </option>
                                    ))}
                                </select>
                                {errors.crypto && (
                                    <p className="text-sm text-red-500">{errors.crypto}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Fiat Currency
                                </label>
                                <select
                                    className="form-select"
                                    value={fiat}
                                    onChange={(e) => setForm((prev) => ({ ...prev, fiat: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Fiat</option>
                                    {Array.from(new Map(
                                        pair.map((currency) => [currency.secondCoin, currency])
                                    ).values()).map((currency) => (
                                        <option key={currency.secondCoin} value={currency.secondCoin}>
                                            {currency.secondCoin}
                                        </option>
                                    ))}
                                </select>
                                {errors.fiat && (
                                    <p className="text-sm text-red-500">{errors.fiat}</p>
                                )}
                            </div>
                        </div>

                        {/* Rest of the form */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Trade Type
                            </label>
                            <select
                                className="form-select"
                                value={tradeType}
                                onChange={(e) => setForm((prev) => ({ ...prev, tradeType: e.target.value }))}
                                required
                            >
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                            {errors.tradeType && (
                                <p className="text-sm text-red-500">{errors.tradeType}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                    className="form-input"
                                    placeholder="Quantity"
                                    required
                                />
                                {errors.quantity && (
                                    <p className="text-sm text-red-500">{errors.quantity}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Price   {
                                        crypto && fiat && <span>1 {crypto}={curreecntPrice} {fiat}</span>
                                    }
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                                    className="form-input"
                                    placeholder="Enter price"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price}</p>
                                )}
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Min Amount
                                </label>
                                <input
                                    type="number"
                                    value={minLimit}
                                    onChange={(e) => setForm((prev) => ({ ...prev, minLimit: e.target.value }))}
                                    className="form-input"
                                    placeholder="Minimum amount"
                                    required
                                />
                                {errors.minLimit && (
                                    <p className="text-sm text-red-500">{errors.minLimit}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Max Amount
                                </label>
                                <input
                                    type="number"
                                    value={maxAmount}
                                    onChange={(e) => setForm((prev) => ({ ...prev, maxAmount: e.target.value }))}
                                    className="form-input"
                                    placeholder="Maximum amount"
                                    required
                                />
                                {errors.maxAmount && (
                                    <p className="text-sm text-red-500">{errors.maxAmount}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Payment Method
                            </label>
                            <select
                                className="form-select"
                                value={paymentMethod}
                                onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                                required
                            >
                                <option value="">Select payment method</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="paypal">PayPal</option>
                                <option value="cash">Cash</option>
                            </select>
                            {errors.paymentMethod && (
                                <p className="text-sm text-red-500">{errors.paymentMethod}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                description / Instructions
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="form-input"
                                placeholder="Optional description for the trade"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="alert-warning">
                    <p className="text-sm">
                        <strong>Reminder:</strong> Make sure your ad follows the P2P platform rules and clearly states your conditions.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loader}
                    className={`btn-primary-large w-full ${loader ? 'btn-disabled' : ''}`}
                >
                    {loader ? (
                        <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Posting Ad...
                        </div>
                    ) : (
                        `Post ${tradeType === 'buy' ? 'Buy' : 'Sell'} Ad`
                    )}
                </button>
            </form>
        </Modal>



    );
}
