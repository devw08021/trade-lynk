import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface WalletHeaderProps {
    totalUsdValue: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function WalletHeader({ totalUsdValue, searchQuery, onSearchChange }: WalletHeaderProps) {
    return (
        <div className="flex-between mb-8 mobile-flex gap-4">
            <div>
                <h1 className="heading-secondary text-gradient-muted mb-2">Wallet Management</h1>
                <div className="flex items-center space-x-4">
                    <p className="text-gradient-secondary">Total Portfolio Value:</p>
                    <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-brand" />
                        <span className="text-2xl font-light text-gradient-primary">
                            ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="form-input w-full md:w-64"
                />
            </div>
        </div>
    );
}
