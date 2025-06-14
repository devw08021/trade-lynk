import React from 'react';
import { WalletBalance } from '@/types/wallet';

interface CoinSelectorProps {
    balances: WalletBalance[];
    onCoinSelect: () => void;
    title: string;
    subtitle: string;
}

export default function CoinSelector({ balances, onCoinSelect, title, subtitle }: CoinSelectorProps) {
    return (
        <>
            <p className="text-gradient-secondary mb-6">{subtitle}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {balances.map(balance => (
                    <button
                        key={balance.coin}
                        onClick={() => onCoinSelect(balance)}
                        className="card-hover p-4 text-center"
                    >
                        <div className="w-10 h-10 bg-brand/20 rounded-full flex-center mx-auto mb-2">
                            <span className="text-brand font-bold">{balance.coin[0]}</span>
                        </div>
                        <div className="font-medium text-white mb-1">{balance.coin}</div>
                        <div className="text-xs text-gradient-secondary">
                            {title === 'Deposit' ? 'Balance' : 'Available'}: {parseFloat(balance.funding).toFixed(4)}
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}
