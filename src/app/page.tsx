'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ChartBarIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-background flex-center section-padding relative z-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="mb-6">
                <span className="text-xs font-medium tracking-[0.3em] text-brand uppercase opacity-90">LEADING CRYPTO PLATFORM SINCE 2018</span>
              </div>
              <h1 className="heading-primary text-gradient max-w-4xl">
                Your <span className="text-gradient-primary">reliable</span> partner<br />
                to crypto trading
              </h1>
              <p className="text-lg font-light max-w-2xl mb-8 leading-relaxed text-gradient-secondary">
                Trade cryptocurrencies with advanced tools, low fees, and seamless experience across spot, perpetual, and P2P markets.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register" className="btn-primary-large">
                  Get Started
                </Link>
                <Link href="/markets" className="btn-secondary">
                  View Markets
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-[400px] relative">
                <div className="absolute inset-0 bg-[#bfff00] opacity-10 rounded-full blur-[100px]"></div>
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
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary text-gradient-muted mb-4">
              Complete Trading Ecosystem
            </h2>
            <p className="text-lg font-light max-w-3xl mx-auto text-gradient-secondary">
              Everything you need to trade cryptocurrencies in one platform
            </p>
          </div>

          <div className="grid-responsive">
            {/* Spot Trading */}
            <div className="card-hover">
              <div className="flex items-center mb-4">
                <div className="icon-container">
                  <CurrencyDollarIcon className="icon-primary" />
                </div>
                <h3 className="text-xl font-light ml-4 text-white">Spot Trading</h3>
              </div>
              <p className="text-gradient-secondary mb-6">
                Buy and sell cryptocurrencies directly with advanced order types, charts, and market analysis tools.
              </p>
              <Link href="/spot" className="btn-ghost flex items-center">
                Start Trading <ArrowRightIcon className="ml-2 icon-small" />
              </Link>
            </div>

            {/* Perpetual Trading */}
            <div className="card-hover">
              <div className="flex items-center mb-4">
                <div className="icon-container">
                  <ChartBarIcon className="icon-primary" />
                </div>
                <h3 className="text-xl font-light ml-4 text-white">Perpetual Trading</h3>
              </div>
              <p className="text-gradient-secondary mb-6">
                Trade with leverage on perpetual contracts with no expiry date, advanced risk management, and cross-margin.
              </p>
              <Link href="/perpetual" className="btn-ghost flex items-center">
                Start Trading <ArrowRightIcon className="ml-2 icon-small" />
              </Link>
            </div>

            {/* P2P Trading */}
            <div className="card-hover">
              <div className="flex items-center mb-4">
                <div className="icon-container">
                  <ShieldCheckIcon className="icon-primary" />
                </div>
                <h3 className="text-xl font-light ml-4 text-white">P2P Trading</h3>
              </div>
              <p className="text-gradient-secondary mb-6">
                Buy and sell cryptocurrencies directly with other users using your preferred payment methods with escrow protection.
              </p>
              <Link href="/p2p" className="btn-ghost flex items-center">
                Start Trading <ArrowRightIcon className="ml-2 icon-small" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="section-padding section-background">
        <div className="container-custom">
          <div className="flex-between mb-8 mobile-flex gap-4">
            <h2 className="heading-tertiary text-gradient-muted">
              Market Overview
            </h2>
            <Link href="/markets" className="btn-ghost flex items-center">
              View All Markets <ArrowRightIcon className="ml-2 icon-small" />
            </Link>
          </div>
          
          <div className="table-container">
            <table className="table-main">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Asset</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">24h Change</th>
                  <th className="table-header-cell">24h Volume</th>
                  <th className="table-header-cell">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
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
      <section className="section-padding glow-background">
        <div className="container-custom text-center">
          <h2 className="heading-secondary text-gradient-muted mb-6">
            Start Trading Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto font-light text-gradient-secondary">
            Join thousands of traders and investors on our platform. Sign up in minutes and start trading immediately.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/register" className="btn-primary-large">
              Create Account
            </Link>
            <Link href="/markets" className="btn-secondary">
              View Markets
            </Link>
          </div>
        </div>
      </section>
    </main>
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
    <tr className="table-row">
      <td className="table-cell font-medium text-white">
        {asset}
      </td>
      <td className="table-cell text-white">
        ${price}
      </td>
      <td className={`table-cell font-medium ${isPositive ? 'status-positive' : 'status-negative'}`}>
        {change}
      </td>
      <td className="table-cell status-neutral">
        ${volume}
      </td>
      <td className="table-cell">
        <Link href={`/spot?symbol=${asset}`} className="btn-ghost">
          Trade
        </Link>
      </td>
    </tr>
  );
}
