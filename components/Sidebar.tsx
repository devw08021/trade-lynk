'use client';
import { Home, ArrowRightLeft, BarChart2, Wallet, Star, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 glassmorphism transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 z-30`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-700/50">
        <span className="text-blue-400 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          TradeLynk
        </span>
      </div>
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
          >
            <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
            Dashboard
          </a>
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-800/50 text-white"
          >
            <ArrowRightLeft className="mr-3 h-5 w-5 text-blue-400" />
            Spot Trading
          </a>
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
          >
            <BarChart2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
            Futures
          </a>
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
          >
            <Wallet className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
            Wallet
          </a>
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
          >
            <Star className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
            Favorites
          </a>
        </div>
        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Trades
          </h3>
          <div className="mt-2 space-y-1">
            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <Clock className="mr-3 h-4 w-4 text-gray-400" />
              BTC/USDT
            </a>
            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <Clock className="mr-3 h-4 w-4 text-gray-400" />
              ETH/USDT
            </a>
          </div>
        </div>
      </nav>
      <div className="absolute bottom-0 w-full border-t border-gray-700/50 p-4">
        <a
          href="#"
          className="group flex items-center text-sm font-medium text-gray-300 hover:text-white"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
          Settings
        </a>
      </div>
    </div>
  );
}
