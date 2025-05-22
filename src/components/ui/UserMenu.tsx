'use client';

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export default function UserMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 rounded-md focus:outline-none">
          <span className="sr-only">Open user menu</span>
          {user?.profilePicture ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.profilePicture}
              alt={user.username || 'User profile picture'}
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
          )}
          <span className="ml-2 hidden md:block truncate max-w-[100px]">
            {user?.username || 'Account'}
          </span>
          <ChevronDownIcon className="ml-1 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-dark-100 rounded-md bg-white dark:bg-dark-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.email || 'email@example.com'}
            </p>
          </div>
          <div className="py-1">
            {[
              { label: 'Profile', href: '/profile' },
              { label: 'Wallet', href: '/wallet' },
              { label: 'Settings', href: '/settings' },
            ].map((item) => (
              <Menu.Item key={item.href}>
                {({ active }) => (
                  <Link
                    href={item.href}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-dark-300' : ''
                    } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                  >
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-dark-300' : ''
                  } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
