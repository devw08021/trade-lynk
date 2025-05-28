'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ChartBarIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  console.log("process.envprocess.env",process.env)
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-radial from-primary-900 to-dark-400 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Next Generation <br />
                <span className="text-primary-300">Crypto Trading</span> Platform
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
                Trade cryptocurrencies with advanced tools, low fees, and seamless experience across spot, perpetual, and P2P markets.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/register"
                  className="btn-primary text-base px-8 py-3"
                >
                  Get Started
                </Link>
                <Link
                  href="/markets"
                  className="text-base px-8 py-3 border border-primary-400 rounded hover:bg-primary-800/30 transition-colors"
                >
                  View Markets
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-[400px] relative">
                <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent rounded-full blur-3xl"></div>
                <Image
                  src="/images/dashboard.png"
                  alt="Trading Dashboard"
                  className="relative z-10 rounded-lg shadow-2xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-dark-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Complete Trading Ecosystem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to trade cryptocurrencies in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Spot Trading */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                  <CurrencyDollarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold ml-4 text-gray-900 dark:text-white">Spot Trading</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Buy and sell cryptocurrencies directly with advanced order types, charts, and market analysis tools.
              </p>
              <Link
                href="/spot"
                className="flex items-center text-primary-600 dark:text-primary-400 font-medium"
              >
                Start Trading <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Perpetual Trading */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-full">
                  <ChartBarIcon className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-xl font-bold ml-4 text-gray-900 dark:text-white">Perpetual Trading</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Trade with leverage on perpetual contracts with no expiry date, advanced risk management, and cross-margin.
              </p>
              <Link
                href="/perpetual"
                className="flex items-center text-secondary-600 dark:text-secondary-400 font-medium"
              >
                Start Trading <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* P2P Trading */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <ShieldCheckIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold ml-4 text-gray-900 dark:text-white">P2P Trading</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Buy and sell cryptocurrencies directly with other users using your preferred payment methods with escrow protection.
              </p>
              <Link
                href="/p2p"
                className="flex items-center text-gray-600 dark:text-gray-400 font-medium"
              >
                Start Trading <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-gray-50 dark:bg-dark-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Market Overview
            </h2>
            <Link
              href="/markets"
              className="text-primary-600 dark:text-primary-400 font-medium flex items-center"
            >
              View All Markets <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-dark-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-100">
                {/* Sample data - in a real app this would come from an API */}
                <MarketRow 
                  asset="BTC/USDT" 
                  price="56,789.23" 
                  change="+2.45%" 
                  volume="1.2B"
                  isPositive={true}
                />
                <MarketRow 
                  asset="ETH/USDT" 
                  price="3,456.78" 
                  change="-1.23%" 
                  volume="845.3M"
                  isPositive={false}
                />
                <MarketRow 
                  asset="SOL/USDT" 
                  price="123.45" 
                  change="+5.67%" 
                  volume="532.1M"
                  isPositive={true}
                />
                <MarketRow 
                  asset="ADA/USDT" 
                  price="1.23" 
                  change="+0.89%" 
                  volume="321.7M"
                  isPositive={true}
                />
                <MarketRow 
                  asset="DOT/USDT" 
                  price="23.45" 
                  change="-2.78%" 
                  volume="198.5M"
                  isPositive={false}
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Trading Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders and investors on our platform. Sign up in minutes and start trading immediately.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium"
            >
              Create Account
            </Link>
            <Link
              href="/markets"
              className="border border-white hover:bg-primary-700 px-8 py-3 rounded-md font-medium"
            >
              View Markets
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MarketRow({ asset, price, change, volume, isPositive }: { 
  asset: string;
  price: string;
  change: string;
  volume: string;
  isPositive: boolean;
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-dark-300">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {asset}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        ${price}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {change}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        ${volume}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          href={`/spot?symbol=${asset}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          Trade
        </Link>
      </td>
    </tr>
  );
} 