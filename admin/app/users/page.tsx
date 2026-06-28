'use client';

import { useState } from 'react';
import { UserTable } from '@/components/users/UserTable';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'ultra' | 'elite' | 'standard'>('all');

  return (
    <div className="space-y-5 animate-[slide-up_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-[rgba(201,168,76,0.5)]" />
            <span className="text-[#c9a84c] text-xs font-bold tracking-[2px] uppercase">CRM</span>
          </div>
          <h2 className="font-display text-3xl text-[#f5f0e8] tracking-wide">Clients</h2>
          <p className="text-[#5a5560] text-sm mt-1">
            Manage elite client profiles, concierge assignments, and travel histories
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#8b6914] rounded-xl text-[#080810] text-sm font-bold">
          + Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ultra Members', value: '124', badge: '◆', color: 'text-[#e8c97a]', bg: 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.2)]' },
          { label: 'Elite Members', value: '847', badge: '◈', color: 'text-[#7eb3ff]', bg: 'bg-[rgba(126,179,255,0.08)] border-[rgba(126,179,255,0.15)]' },
          { label: 'Total Clients', value: '2,418', badge: '○', color: 'text-[#a8a099]', bg: 'bg-[#14141f] border-white/[0.06]' },
        ].map(stat => (
          <div key={stat.label} className={`border rounded-2xl p-4 ${stat.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-base ${stat.color}`}>{stat.badge}</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${stat.color}`}>{stat.label}</span>
            </div>
            <p className="text-[#f5f0e8] text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search clients…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-[#14141f] border border-white/[0.08] rounded-xl text-[#a8a099] placeholder-[#5a5560] text-sm px-4 py-2 w-64 focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors"
        />
        <div className="flex gap-1">
          {(['all', 'ultra', 'elite', 'standard'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all
                ${filterTier === tier
                  ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-[rgba(201,168,76,0.25)]'
                  : 'bg-transparent border-white/[0.06] text-[#5a5560] hover:text-[#a8a099]'
                }`}>
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <UserTable searchQuery={searchQuery} />
    </div>
  );
}
