'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useSearchOffersQuery, useGetPaymentMethodsQuery } from '@/services/p2pService';
import { useAppSelector } from '@/store/store';
import P2POfferList from '@/components/p2p/P2POfferList';
import P2PFilters from '@/components/p2p/P2PFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

const STATIC_P2P_DATA = {
  paymentMethods: [
    'Bank Transfer',
    'PayPal',
    'Revolut',
    'Wise',
    'Venmo',
    'Cash App',
    'Zelle',
    'Alipay',
    'WeChat Pay',
    'UPI',
  ],
  offers: {
    buy: [
      {
        id: 'buy1',
        creator: {
          id: 'user1',
          username: 'cryptoTrader123',
          completedTrades: 245,
          positiveRating: 98,
          accountCreationDate: '2021-06-12T00:00:00Z',
        },
        type: 'buy',
        asset: 'BTC',
        fiatCurrency: 'USD',
        price: '40975.50',
        minAmount: '0.001',
        maxAmount: '0.5',
        availableAmount: '0.75',
        paymentMethods: ['Bank Transfer', 'PayPal', 'Revolut'],
        terms: 'Fast payment required. Please have payment ready before starting trade.',
        autoReply: 'Thank you for your interest. Please complete payment within 15 minutes.',
        status: 'active',
        createdAt: '2023-08-10T15:23:45Z',
        updatedAt: '2023-09-25T10:12:33Z',
      },
      {
        id: 'buy2',
        creator: {
          id: 'user2',
          username: 'btcFan2023',
          completedTrades: 118,
          positiveRating: 99,
          accountCreationDate: '2022-04-22T00:00:00Z',
        },
        type: 'buy',
        asset: 'BTC',
        fiatCurrency: 'USD',
        price: '40950.00',
        minAmount: '0.005',
        maxAmount: '1.0',
        availableAmount: '2.5',
        paymentMethods: ['Bank Transfer', 'Wise', 'Zelle'],
        terms: 'Payment within 30 minutes or trade will be cancelled.',
        status: 'active',
        createdAt: '2023-09-15T11:34:21Z',
        updatedAt: '2023-09-26T07:45:12Z',
      },
      {
        id: 'buy3',
        creator: {
          id: 'user3',
          username: 'hodlLife',
          completedTrades: 345,
          positiveRating: 97,
          accountCreationDate: '2020-11-05T00:00:00Z',
        },
        type: 'buy',
        asset: 'ETH',
        fiatCurrency: 'USD',
        price: '2245.25',
        minAmount: '0.05',
        maxAmount: '10.0',
        availableAmount: '15.75',
        paymentMethods: ['Bank Transfer', 'PayPal', 'Cash App'],
        terms: 'ID verification required for amounts over $5000.',
        status: 'active',
        createdAt: '2023-09-20T16:05:33Z',
        updatedAt: '2023-09-26T09:15:42Z',
      },
      {
        id: 'buy4',
        creator: {
          id: 'user4',
          username: 'cryptoWhale',
          completedTrades: 523,
          positiveRating: 99,
          accountCreationDate: '2019-08-15T00:00:00Z',
        },
        type: 'buy',
        asset: 'SOL',
        fiatCurrency: 'USD',
        price: '146.50',
        minAmount: '1.0',
        maxAmount: '100.0',
        availableAmount: '250.0',
        paymentMethods: ['Bank Transfer', 'Wise'],
        terms: 'Institutional buyers welcome. KYC required for all transactions.',
        status: 'active',
        createdAt: '2023-09-18T09:12:45Z',
        updatedAt: '2023-09-26T08:30:15Z',
      },
    ],
    sell: [
      {
        id: 'sell1',
        creator: {
          id: 'user5',
          username: 'satoshiFan',
          completedTrades: 187,
          positiveRating: 96,
          accountCreationDate: '2021-03-10T00:00:00Z',
        },
        type: 'sell',
        asset: 'BTC',
        fiatCurrency: 'USD',
        price: '41200.75',
        minAmount: '0.001',
        maxAmount: '0.25',
        availableAmount: '0.35',
        paymentMethods: ['Bank Transfer', 'Cash App'],
        terms: 'Release crypto only after payment confirmation (usually within 1 hour).',
        status: 'active',
        createdAt: '2023-09-21T14:23:11Z',
        updatedAt: '2023-09-26T11:22:33Z',
      },
      {
        id: 'sell2',
        creator: {
          id: 'user6',
          username: 'blockchainMaster',
          completedTrades: 295,
          positiveRating: 98,
          accountCreationDate: '2020-06-25T00:00:00Z',
        },
        type: 'sell',
        asset: 'BTC',
        fiatCurrency: 'USD',
        price: '41150.25',
        minAmount: '0.001',
        maxAmount: '0.5',
        availableAmount: '0.75',
        paymentMethods: ['PayPal', 'Venmo', 'Zelle'],
        terms: 'Only verified PayPal accounts accepted. No notes in payment.',
        status: 'active',
        createdAt: '2023-09-19T12:54:22Z',
        updatedAt: '2023-09-26T08:17:45Z',
      },
      {
        id: 'sell3',
        creator: {
          id: 'user7',
          username: 'ethTrader',
          completedTrades: 156,
          positiveRating: 97,
          accountCreationDate: '2022-01-15T00:00:00Z',
        },
        type: 'sell',
        asset: 'ETH',
        fiatCurrency: 'USD',
        price: '2275.50',
        minAmount: '0.1',
        maxAmount: '5.0',
        availableAmount: '8.5',
        paymentMethods: ['Bank Transfer', 'Revolut'],
        terms: 'Fast release after payment confirmation. Available 9am-6pm EST.',
        status: 'active',
        createdAt: '2023-09-22T10:12:33Z',
        updatedAt: '2023-09-26T09:45:12Z',
      },
      {
        id: 'sell4',
        creator: {
          id: 'user8',
          username: 'solanaLover',
          completedTrades: 89,
          positiveRating: 95,
          accountCreationDate: '2022-09-05T00:00:00Z',
        },
        type: 'sell',
        asset: 'SOL',
        fiatCurrency: 'USD',
        price: '148.75',
        minAmount: '5.0',
        maxAmount: '50.0',
        availableAmount: '120.0',
        paymentMethods: ['Bank Transfer', 'Wise', 'PayPal'],
        terms: 'Payment must be from verified account matching your KYC information.',
        status: 'active',
        createdAt: '2023-09-23T15:45:22Z',
        updatedAt: '2023-09-26T10:11:33Z',
      },
    ],
  },
};

export default function P2PPage() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: offers, isLoading: isLoadingOffers, isError: isOffersError } = useSearchOffersQuery({
    type: tradeType,
    asset: selectedAsset,
    fiatCurrency: selectedFiatCurrency,
    paymentMethod: selectedPaymentMethod || undefined,
  });

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods, isError: isPaymentMethodsError } = useGetPaymentMethodsQuery();
  
  const effectivePaymentMethods = isPaymentMethodsError || !paymentMethods ? STATIC_P2P_DATA.paymentMethods : paymentMethods;
  
  const filteredStaticOffers = STATIC_P2P_DATA.offers[tradeType].filter(offer => 
    offer.asset === selectedAsset && 
    offer.fiatCurrency === selectedFiatCurrency && 
    (!selectedPaymentMethod || offer.paymentMethods.includes(selectedPaymentMethod))
  );
  
  const effectiveOffers = isOffersError || !offers ? filteredStaticOffers : offers;

  const availableAssets = ['BTC', 'ETH', 'USDT', 'SOL', 'ADA', 'DOT'];
  
  const availableFiatCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CNY', 'INR'];

  return (
    <div className="container-custom py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">P2P Trading</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buy and sell crypto directly with other users using your preferred payment methods
          </p>
        </div>
        
        {isAuthenticated && (
          <Link
            href="/p2p/create-offer"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Offer
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-dark-300 rounded-lg shadow-sm overflow-hidden">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200 dark:border-dark-100">
            <Tab
              className={({ selected }) =>
                `py-4 px-6 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`
              }
              onClick={() => setTradeType('buy')}
            >
              Buy Crypto
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-4 px-6 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`
              }
              onClick={() => setTradeType('sell')}
            >
              Sell Crypto
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel className="p-4">
              <P2PFilters
                availableAssets={availableAssets}
                availableFiatCurrencies={availableFiatCurrencies}
                paymentMethods={effectivePaymentMethods}
                selectedAsset={selectedAsset}
                selectedFiatCurrency={selectedFiatCurrency}
                selectedPaymentMethod={selectedPaymentMethod}
                onAssetChange={setSelectedAsset}
                onFiatCurrencyChange={setSelectedFiatCurrency}
                onPaymentMethodChange={setSelectedPaymentMethod}
                isLoadingPaymentMethods={isLoadingPaymentMethods && !effectivePaymentMethods}
              />
              
              {isLoadingOffers && !effectiveOffers ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : effectiveOffers && effectiveOffers.length > 0 ? (
                <P2POfferList offers={effectiveOffers} tradeType={tradeType} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No offers found for your selected filters. Try changing your filters or create your own offer.
                  </p>
                  {isAuthenticated && (
                    <Link
                      href="/p2p/create-offer"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create Offer
                    </Link>
                  )}
                </div>
              )}
            </Tab.Panel>
            
            <Tab.Panel className="p-4">
              <P2PFilters
                availableAssets={availableAssets}
                availableFiatCurrencies={availableFiatCurrencies}
                paymentMethods={effectivePaymentMethods}
                selectedAsset={selectedAsset}
                selectedFiatCurrency={selectedFiatCurrency}
                selectedPaymentMethod={selectedPaymentMethod}
                onAssetChange={setSelectedAsset}
                onFiatCurrencyChange={setSelectedFiatCurrency}
                onPaymentMethodChange={setSelectedPaymentMethod}
                isLoadingPaymentMethods={isLoadingPaymentMethods && !effectivePaymentMethods}
              />
              
              {isLoadingOffers && !effectiveOffers ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : effectiveOffers && effectiveOffers.length > 0 ? (
                <P2POfferList offers={effectiveOffers} tradeType={tradeType} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No offers found for your selected filters. Try changing your filters or create your own offer.
                  </p>
                  {isAuthenticated && (
                    <Link
                      href="/p2p/create-offer"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create Offer
                    </Link>
                  )}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      <div className="mt-8 bg-white dark:bg-dark-300 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How P2P Trading Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Find an Offer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse available offers from other users or create your own offer with your preferred payment methods.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trade Securely</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our escrow system holds the crypto until the payment is confirmed, ensuring safe and secure transactions.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Receive Funds</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Once the payment is confirmed, the crypto is released from escrow to the buyer's wallet automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 