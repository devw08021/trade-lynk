import React from 'react';
import { WalletBalance, Transaction } from '@/types/wallet';
import { calculateInOrdersValue } from '@/lib/utils';

interface PortfolioSummaryProps {
    balances: WalletBalance[];
    transactions: Transaction[];
    totalUsdValue: number;
}

export default function PortfolioSummary({ balances, transactions, totalUsdValue }: PortfolioSummaryProps) {
    const inOrdersValue = calculateInOrdersValue(balances);
    const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">
                    ${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gradient-secondary">Total Balance</div>
            </div>
            <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">
                    {balances.length}
                </div>
                <div className="text-sm text-gradient-secondary">Assets</div>
            </div>
            <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">
                    ${inOrdersValue.toFixed(2)}
                </div>
                <div className="text-sm text-gradient-secondary">In Orders</div>
            </div>
            <div className="card text-center">
                <div className="text-lg font-light text-gradient-primary mb-2">
                    {pendingTransactions}
                </div>
                <div className="text-sm text-gradient-secondary">Pending</div>
            </div>
        </div>
    );
}
