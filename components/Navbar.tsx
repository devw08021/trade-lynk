'use client';
import { Menu, X, Bell, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  return (
    <nav className="fixed w-full z-20 glassmorphism border-b border-gray-700/50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-blue-400 focus:outline-none lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4 lg:ml-0 flex items-center">
              <span className="text-blue-400 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                TradeLynk
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden lg:flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Market
              </a>
              <a href="#" className="text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium">
                Spot
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Futures
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Earn
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                NFT
              </a>
            </div>
            <div className="ml-6 flex items-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium glow">
                Connect Wallet
              </button>
              <button className="ml-4 text-gray-300 hover:text-blue-400">
                <Bell size={20} />
              </button>
              <button className="ml-4 text-gray-300 hover:text-blue-400">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}