'use client';

import { useState } from 'react';
import type { User, UserTier } from '@/lib/types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sheikh Abdullah Al-Rashid',
    email: 'a.rashid@private.ae',
    tier: 'ultra',
    totalBookings: 47,
    totalSpend: 2840000,
    currency: 'USD',
    lastActive: '2024-11-28',
    joinedAt: '2022-03-15',
    preferredDestinations: ['Dubai', 'Monaco', 'Maldives'],
    assignedConcierge: 'Sofia D.',
  },
  {
    id: '2',
    name: 'Victoria Worthington',
    email: 'v.worthington@vc.com',
    tier: 'elite',
    totalBookings: 23,
    totalSpend: 680000,
    currency: 'USD',
    lastActive: '2024-11-27',
    joinedAt: '2023-01-08',
    preferredDestinations: ['Santorini', 'Amalfi Coast', 'Paris'],
    assignedConcierge: 'Marco A.',
  },
  {
    id: '3',
    name: 'Dmitri Volkonsky',
    email: 'd.volkonsky@oligarch.ru',
    tier: 'ultra',
    totalBookings: 61,
    totalSpend: 4200000,
    currency: 'USD',
    lastActive: '2024-11-26',
    joinedAt: '2021-07-22',
    preferredDestinations: ['Maldives', 'Bali', 'Seychelles'],
    assignedConcierge: 'Sofia D.',
  },
  {
    id: '4',
    name: 'Priya Mehta',
    email: 'p.mehta@titanindustries.in',
    tier: 'elite',
    totalBookings: 18,
    totalSpend: 420000,
    currency: 'USD',
    lastActive: '2024-11-25',
    joinedAt: '2023-06-14',
    preferredDestinations: ['Egypt', 'Jordan', 'Morocco'],
  },
  {
    id: '5',
    name: 'Jean-Pierre Marchand',
    email: 'jp.marchand@lvmh.fr',
    tier: 'elite',
    totalBookings: 34,
    totalSpend: 920000,
    currency: 'USD',
    lastActive: '2024-11-24',
    joinedAt: '2022-09-30',
    preferredDestinations: ['Monaco', 'St. Tropez', 'Côte d\'Azur'],
    assignedConcierge: 'Marco A.',
  },
];

const TIER_STYLES: Record<UserTier, string> = {
  ultra: 'bg-[rgba(201,168,76,0.15)] text-[#e8c97a] border-[rgba(201,168,76,0.35)]',
  elite: 'bg-[rgba(126,179,255,0.1)] text-[#7eb3ff] border-[rgba(126,179,255,0.25)]',
  standard: 'bg-[#14141f] text-[#a8a099] border-white/[0.1]',
};

const TIER_ICONS: Record<UserTier, string> = {
  ultra: '◆',
  elite: '◈',
  standard: '○',
};

interface UserTableProps {
  searchQuery?: string;
}

export function UserTable({ searchQuery = '' }: UserTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = MOCK_USERS.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Client', 'Tier', 'Bookings', 'Total Spend', 'Preferred Destinations', 'Concierge', ''].map(col => (
              <th
                key={col}
                className="text-left px-5 py-3.5 text-[10px] font-bold text-[#5a5560] uppercase tracking-widest whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr
              key={user.id}
              onClick={() => setSelectedId(selectedId === user.id ? null : user.id)}
              className={`
                border-b border-white/[0.03] cursor-pointer transition-colors
                ${selectedId === user.id ? 'bg-[rgba(201,168,76,0.04)]' : 'hover:bg-white/[0.02]'}
              `}>
              {/* Client */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b6914] flex items-center justify-center text-[#080810] font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[#f5f0e8] text-sm font-semibold">{user.name}</p>
                    <p className="text-[#5a5560] text-xs">{user.email}</p>
                  </div>
                </div>
              </td>
              {/* Tier */}
              <td className="px-5 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${TIER_STYLES[user.tier]}`}>
                  {TIER_ICONS[user.tier]} {user.tier}
                </span>
              </td>
              {/* Bookings */}
              <td className="px-5 py-4">
                <p className="text-[#f5f0e8] text-sm font-semibold">{user.totalBookings}</p>
                <p className="text-[#5a5560] text-xs">since {new Date(user.joinedAt).getFullYear()}</p>
              </td>
              {/* Spend */}
              <td className="px-5 py-4">
                <p className="text-[#c9a84c] text-sm font-bold">
                  ${(user.totalSpend / 1000).toFixed(0)}K
                </p>
              </td>
              {/* Destinations */}
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {user.preferredDestinations.slice(0, 2).map(d => (
                    <span key={d} className="text-[10px] text-[#a8a099] bg-[#14141f] border border-white/[0.06] rounded-full px-2 py-0.5">
                      {d}
                    </span>
                  ))}
                  {user.preferredDestinations.length > 2 && (
                    <span className="text-[10px] text-[#5a5560]">+{user.preferredDestinations.length - 2}</span>
                  )}
                </div>
              </td>
              {/* Concierge */}
              <td className="px-5 py-4">
                {user.assignedConcierge ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[rgba(201,168,76,0.2)] flex items-center justify-center text-[9px] text-[#c9a84c] font-bold">
                      {user.assignedConcierge.charAt(0)}
                    </div>
                    <span className="text-[#a8a099] text-xs">{user.assignedConcierge}</span>
                  </div>
                ) : (
                  <span className="text-[#5a5560] text-xs italic">Unassigned</span>
                )}
              </td>
              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); }}
                    className="text-xs text-[#c9a84c] hover:text-[#e8c97a] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(201,168,76,0.08)] transition-all whitespace-nowrap">
                    View Profile
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); }}
                    className="text-xs text-[#7eb3ff] hover:text-[#a5c8ff] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(126,179,255,0.08)] transition-all whitespace-nowrap">
                    Chat
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[#5a5560] text-sm">No clients match your search</p>
        </div>
      )}
    </div>
  );
}
