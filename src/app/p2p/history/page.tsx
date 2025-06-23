'use client';

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import HistoryFilter from '@/components/p2p/historyFilter'
import TradeHistoryTable from '@/components/p2p/TradeHistoryTable';
import AdHistoryTable from '@/components/p2p/AdHistoryTable'; // create this like HistoryTable
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';

import { useGetPairListQuery } from '@/services/p2pService';


const TABS = ['My Trades', 'My Ads'];

const mockTradeHistory = [/* ... your P2PTrade[] data */];
const mockAdHistory = [/* ... your Ad history data */];

const availablePaymentMethods = ["PayPal", "Bank Transfer", "Revolut"]

export default function P2PHistoryPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);

  const [filters, setFilters] = useState({
    tradeType: "all",            // "buy" or "sell"
    asset: "",                   // firstCoinId
    fiat: "",                    // secondCoinId
    paymentMethod: "",           // selected payment method
  });

  const [offers, setOffers] = useState([]);           // Offers fetched or filtered
  const [offersCount, setOffersCount] = useState(0);  // For pagination
  const [page, setPage] = useState(1);                // Current page


  const [pair, setPairs] = useState<any>([]);


  const { data: pairAPIData, isLoading: isPairLoading, isError: isPairError } = useGetPairListQuery();
  useEffect(() => {
    if (pairAPIData?.data?.data) {
      setPairs(pairAPIData?.data?.data);
    }
  }, [pairAPIData])

  const onTabChange = (index: number) => {
    setSelectedTabIndex(index);
  }
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">P2P History</h1>
        <div className="flex items-center gap-4">
          {/* <DatePickerWithRange onChange={setDateRange} /> */}
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tab.Group selectedIndex={selectedTabIndex} onChange={onTabChange}>
            <Tab.List className="tab-list">
              <Tab
                className={({ selected }) =>
                  `tab-button ${selected ? 'tab-button-active' : ''}`
                }
              >
                My Ads
              </Tab>
              <Tab
                className={({ selected }) =>
                  `tab-button ${selected ? 'tab-button-active' : ''}`
                }
              >
                My Trades
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <HistoryFilter
                  pair={pair}
                  paymentMethods={availablePaymentMethods}
                  onAssetChange={(value) => setFilters((prev) => ({ ...prev, asset: value }))}
                  onFiatCurrencyChange={(value) => setFilters((prev) => ({ ...prev, fiat: value }))}
                  onPaymentMethodChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value }))}
                  onTradeTypeChange={(value) => setFilters((prev) => ({ ...prev, tradeType: value }))}
                />
                <AdHistoryTable
                  side={filters?.tradeType}
                  crypto={filters?.asset}
                  fiat={filters?.fiat}
                  paymentMethod={filters?.paymentMethod}
                />

              </Tab.Panel>
              <Tab.Panel>
                <HistoryFilter pair={pair}
                  paymentMethods={availablePaymentMethods}
                  onAssetChange={(value) => setFilters((prev) => ({ ...prev, asset: value }))}
                  onFiatCurrencyChange={(value) => setFilters((prev) => ({ ...prev, fiat: value }))}
                  onPaymentMethodChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value }))}
                  onTradeTypeChange={(value) => setFilters((prev) => ({ ...prev, tradeType: value }))}
                />

                <TradeHistoryTable
                  side={filters?.tradeType}
                  crypto={filters?.asset}
                  fiat={filters?.fiat}
                  paymentMethod={filters?.paymentMethod}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </CardContent>
      </Card>
    </div >
  );
}
