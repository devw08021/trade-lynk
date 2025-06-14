import React from 'react';
import { WalletBalance } from '@/types/wallet';

interface BalancesTableProps {
    balances: WalletBalance[];
    walletType: string;
    totalUsdValue: number;
    onDeposit: () => void;
    onWithdraw: () => void;
    onTransfer: () => void;
    searchQuery: string;
}

export default function BalancesTable({
    balances,
    walletType,
    totalUsdValue,
    onDeposit,
    onWithdraw,
    onTransfer,
    searchQuery
}: BalancesTableProps) {
    return (
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
                    {balances.length > 0 ? (
                        balances.map((balance) => (
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
                                        {((parseFloat(balance?.usdValue) / totalUsdValue) * 100 || 0).toFixed(1)}% of portfolio
                                    </div>
                                </td>
                                <td className="table-cell text-right">
                                    {
                                        walletType == "funding" ?
                                            < div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => onDeposit(balance)}
                                                    className="btn-ghost text-xs"
                                                >
                                                    Deposit
                                                </button>
                                                <button
                                                    onClick={() => onWithdraw(balance)}
                                                    className="btn-ghost text-xs"
                                                >
                                                    Withdraw
                                                </button>
                                                <button
                                                    onClick={() => onTransfer(balance)}
                                                    className="btn-ghost text-xs"
                                                >
                                                    Transfer
                                                </button>
                                            </div>
                                            :
                                            walletType == "all" ?
                                                < div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => onDeposit(balance)}
                                                        className="btn-ghost text-xs"
                                                        disabled
                                                    >
                                                        Info
                                                    </button>
                                                </div>
                                                :
                                                < div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => onTransfer(balance)}
                                                        className="btn-ghost text-xs"
                                                    >
                                                        Transfer
                                                    </button>

                                                </div>
                                    }

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
        </div >
    );
}
