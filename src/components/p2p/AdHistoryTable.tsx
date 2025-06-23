'use client';

import React, { useEffect, useState } from 'react';
import { useGetMyOffersQuery } from '@/services/p2pService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { UserCircleIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import Pagination from '@/components/ui/pagination'

interface P2POffer {
    id: string;
    creator: {
        id: string;
        username: string;
        completedTrades: number;
        positiveRating: number;
        accountCreationDate: string;
    };
    type: string; // 'buy' or 'sell'
    asset: string;
    fiatCurrency: string;
    price: string;
    minAmount: string;
    maxAmount: string;
    availableAmount: string;
    paymentMethods: string[];
    terms: string;
    autoReply?: string;
    status: string;//'active' | 'inactive' | 'completed';
    createdAt: string;
    updatedAt: string;
}

interface P2POfferListProps {
    offers: P2POffer[];
    offersCount: number,
    tradeType: string; // 'buy' or 'sell'
    page: number;
    setTrade: (trade: any) => void;
    setPage: (page: number) => void;
}

export default function AdsHistoryTable({ side, crypto, fiat, paymentMethod }) {

    const [offersList, setOffersList] = useState<any>([]);
    const [offersCount, setOffersCount] = useState(0)
    const [page, setPage] = useState(0)

    const { data: offers, isLoading: isLoadingOffers, isError: isOffersError } = useGetMyOffersQuery({
        side: side,
        crypto: crypto,
        fiat: fiat,
        paymentMethod: paymentMethod || undefined,
        page: page,
        limit: 10,
    });

    useEffect(() => {
        if (offers?.success) {
            setOffersList(offers?.data?.data)
            setOffersCount(offers?.data?.count)
        }
    }, [offers])
    return (
        <div className="mt-6">
            <div className="table-container">
                <table className="table-main">
                    <thead className="table-header">
                        <tr>
                            <th className="table-header-cell">Post Id</th>
                            <th className="table-header-cell">Advertiser</th>
                            <th className="table-header-cell">Type</th>
                            <th className="table-header-cell">Price</th>
                            <th className="table-header-cell">Limit/Available</th>
                            <th className="table-header-cell">Payment Method</th>
                            <th className="table-header-cell">Terms</th>
                            <th className="table-header-cell">Status</th>
                            <th className="table-header-cell text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {!isLoadingOffers && offersList.map((offer) => (
                            <tr key={offer?.postId} className="table-row">
                                <td className="table-cell">
                                    <div className="text-sm font-medium text-white">
                                        {offer.postCode}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-[#bfff00]/20 flex items-center justify-center">
                                                <UserCircleIcon className="h-6 w-6 text-brand" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">
                                                {offer?.userCode}
                                            </div>
                                            <div className="text-sm text-gradient-secondary flex items-center">
                                                <span>{offer?.totalOrder} trades</span>
                                                <span className="mx-2">•</span>
                                                <span className="flex items-center">
                                                    <StarIcon className="h-4 w-4 status-positive mr-1" />
                                                    <span className="status-positive">{offer?.totalOrder}%</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="table-cell">
                                    <div className="text-sm font-medium text-white">
                                        {["-", "Buy", "Sell",][offer.side]}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="text-sm font-medium text-white">
                                        {offer.price}
                                    </div>
                                    <div className="text-xs text-gradient-secondary">
                                        {offer.secondCoin}
                                    </div>
                                </td>

                                <td className="table-cell">
                                    <div className="text-sm text-white">
                                        {offer.minLimit}-{offer.maxLimit} {offer.firstCoin}
                                    </div>
                                    <div className="text-xs text-gradient-secondary">
                                        Available: {offer.reminingQuantity} {offer.firstCoin}
                                    </div>
                                </td>

                                <td className="table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {offer?.payBy.slice(0, 2).map((method, index) => (
                                            <span key={index} className="badge badge-primary text-xs">
                                                {method}
                                            </span>
                                        ))}
                                        {offer?.payBy.length > 2 && (
                                            <span className="badge text-xs bg-[#2a2b2e] text-gray-400 border border-[#2a2b2e]">
                                                +{offer.payBy.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="table-cell max-w-xs">
                                    <div className="text-sm text-gradient-secondary truncate" title={offer.description}>
                                        {offer.description}
                                    </div>
                                </td>
                                <td className="table-cell max-w-xs">
                                    <div className="text-sm text-gradient-secondary truncate" title={offer.status}>
                                        <Badge variant={
                                            offer.status === 0 ? 'default'
                                                : offer.status === 1 ? 'secondary'
                                                    : offer.status === 2 ? 'secondary'
                                                        : offer.status === 3 ? 'secondary'
                                                            : offer.status === 4 ? 'secondary'
                                                                : offer.status === 5 ? 'destructive'
                                                                    : 'destructive'
                                        }>
                                            {["Open", "Pending", "Completed", "Cancelled", "Dispute", "Timed Out"][offer.status]}
                                        </Badge>
                                    </div>
                                </td>

                                <td className="table-cell text-right">
                                    {
                                        offer.status != 0 ?
                                            <Link
                                                href={"#"}
                                                onClick={() => setTrade(offer)}
                                                className={`btn-primary text-sm px-4 py-2 ${offer?.side === '1' ? 'bg-red-600 hover:bg-red-700' : ''
                                                    }`}
                                            >
                                                {offer?.side === '1' ? 'Buy' : 'Sell'} {offer.firstCoin}
                                            </Link>
                                            :
                                            "-"
                                    }

                                </td>
                            </tr>
                        ))}
                        {
                            isLoadingOffers &&
                            <div className="flex-center py-12">
                                <LoadingSpinner size="lg" />
                            </div>
                        }
                    </tbody>
                    <div className="w-full flex justify-center mt-6">
                        <Pagination
                            totalPages={Math.ceil(offersCount / 10) ?? 1}
                            currentPage={page}
                            onPageChange={(page) => setPage(page)}
                        />
                    </div>
                </table>
            </div>


        </div>
    );
}
