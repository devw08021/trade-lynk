import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Transaction } from '@/types/wallet';
import { copyToClipboard } from '@/lib/utils';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gradient-secondary mb-4">
                    <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No transaction history</p>
                    <p className="text-sm">Your deposits and withdrawals will appear here</p>
                </div>
            </div>
        );
    }

    return (
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
                    {transactions.map((tx) => (
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
                                <span className={`badge text-xs ${tx.status === 'completed'
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
    );
}
