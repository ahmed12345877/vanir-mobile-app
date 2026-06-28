'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Overview', subtitle: 'Platform performance at a glance' },
  '/bookings': { title: 'Bookings', subtitle: 'Manage reservations and listings' },
  '/users': { title: 'Clients & CRM', subtitle: 'Elite user profiles and concierge assignments' },
  '/ai-studio': { title: 'AI Studio', subtitle: 'Configure AI prompts and behaviors' },
  '/notifications': { title: 'Notifications', subtitle: 'Broadcast push messages to your guests' },
};

export function Header() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? { title: 'Vanir Admin', subtitle: '' };
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="h-16 bg-[#0f0f1a] border-b border-white/[0.06] flex items-center px-6 gap-4 flex-shrink-0">
      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-[#f5f0e8] text-base font-bold tracking-wide">{page.title}</h1>
        {page.subtitle && (
          <p className="text-[#5a5560] text-xs tracking-wide mt-0.5">{page.subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search bookings, clients…"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="
            bg-[#14141f] border border-white/[0.08] rounded-xl
            text-[#a8a099] placeholder-[#5a5560] text-sm
            px-4 py-2 w-56
            focus:outline-none focus:border-[rgba(201,168,76,0.4)]
            transition-colors
          "
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5560] text-xs">⌘K</span>
      </div>

      {/* Live status indicator */}
      <div className="flex items-center gap-2 bg-[rgba(63,185,143,0.08)] border border-[rgba(63,185,143,0.2)] rounded-full px-3 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3fb98f] animate-pulse" />
        <span className="text-[#3fb98f] text-xs font-semibold">Live</span>
      </div>

      {/* Notifications bell */}
      <button className="relative w-9 h-9 rounded-xl border border-white/[0.08] bg-[#14141f] flex items-center justify-center text-[#a8a099] hover:text-[#f5f0e8] hover:border-[rgba(201,168,76,0.3)] transition-all">
        <span className="text-sm">◎</span>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
      </button>
    </header>
  );
}
