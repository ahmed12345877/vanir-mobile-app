'use client';

import { useState } from 'react';
import type { Booking, BookingStatus, BookingCategory } from '@/lib/types';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1', confirmationCode: 'VNR-2024-001', guestName: 'Sheikh Abdullah Al-Rashid',
    guestEmail: 'a.rashid@private.ae', category: 'hotel', propertyName: 'Burj Al Arab Jumeirah',
    destination: 'Dubai, UAE', checkIn: '2024-12-20', checkOut: '2024-12-28',
    guests: 4, totalAmount: 19200, currency: 'USD', status: 'confirmed', createdAt: '2024-11-28T09:15:00Z',
  },
  {
    id: '2', confirmationCode: 'VNR-2024-002', guestName: 'Victoria Worthington',
    guestEmail: 'v.worthington@vc.com', category: 'flight', propertyName: 'Emirates First — LHR → DXB',
    destination: 'Dubai, UAE', checkIn: '2024-12-15', checkOut: '2024-12-15',
    guests: 2, totalAmount: 7600, currency: 'USD', status: 'pending', createdAt: '2024-11-27T14:30:00Z',
  },
  {
    id: '3', confirmationCode: 'VNR-2024-003', guestName: 'Dmitri Volkonsky',
    guestEmail: 'd.volkonsky@oligarch.ru', category: 'hotel', propertyName: 'Amanzoe Private Villa',
    destination: 'Greece', checkIn: '2025-01-10', checkOut: '2025-01-18',
    guests: 6, totalAmount: 25600, currency: 'USD', status: 'confirmed', createdAt: '2024-11-26T11:00:00Z',
  },
  {
    id: '4', confirmationCode: 'VNR-2024-004', guestName: 'Priya Mehta',
    guestEmail: 'p.mehta@titanindustries.in', category: 'experience', propertyName: 'Private Nile Cruise',
    destination: 'Egypt', checkIn: '2025-02-01', checkOut: '2025-02-08',
    guests: 2, totalAmount: 14800, currency: 'USD', status: 'pending', createdAt: '2024-11-25T16:45:00Z',
  },
  {
    id: '5', confirmationCode: 'VNR-2024-005', guestName: 'Jean-Pierre Marchand',
    guestEmail: 'jp.marchand@lvmh.fr', category: 'car', propertyName: 'Rolls-Royce Phantom',
    destination: 'Monaco', checkIn: '2024-12-22', checkOut: '2024-12-29',
    guests: 1, totalAmount: 8400, currency: 'USD', status: 'completed', createdAt: '2024-11-24T10:00:00Z',
  },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-[rgba(224,160,53,0.1)] text-[#e0a035] border-[rgba(224,160,53,0.25)]',
  confirmed: 'bg-[rgba(63,185,143,0.1)] text-[#3fb98f] border-[rgba(63,185,143,0.25)]',
  completed: 'bg-[rgba(126,179,255,0.1)] text-[#7eb3ff] border-[rgba(126,179,255,0.25)]',
  cancelled: 'bg-[rgba(216,106,106,0.1)] text-[#d86a6a] border-[rgba(216,106,106,0.25)]',
};

const CATEGORY_ICONS: Record<string, string> = {
  hotel: '🏨', flight: '✈️', car: '🚗', experience: '◈',
};

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<BookingCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterCategory !== 'all' && b.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!b.guestName.toLowerCase().includes(q) && !b.confirmationCode.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRevenue = filtered.reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-5 animate-[slide-up_0.3s_ease-out]">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Bookings', value: MOCK_BOOKINGS.length.toString(), color: 'text-[#c9a84c]' },
          { label: 'Pending Review', value: MOCK_BOOKINGS.filter(b => b.status === 'pending').length.toString(), color: 'text-[#e0a035]' },
          { label: 'Confirmed', value: MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length.toString(), color: 'text-[#3fb98f]' },
          { label: 'Revenue (Filtered)', value: `$${(totalRevenue / 1000).toFixed(1)}K`, color: 'text-[#c9a84c]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f0f1a] border border-white/[0.06] rounded-xl p-4">
            <p className={`${stat.color} text-2xl font-bold`}>{stat.value}</p>
            <p className="text-[#5a5560] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by guest or code…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#14141f] border border-white/[0.08] rounded-xl text-[#a8a099] placeholder-[#5a5560] text-sm px-4 py-2 w-56 focus:outline-none focus:border-[rgba(201,168,76,0.4)]"
          />
          <div className="flex gap-1 flex-wrap">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${filterStatus === s ? STATUS_STYLES[s as BookingStatus] || 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-[rgba(201,168,76,0.25)]' : 'bg-transparent border-white/[0.06] text-[#5a5560] hover:text-[#a8a099]'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(['all', 'hotel', 'flight', 'car', 'experience'] as const).map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filterCategory === c ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-[rgba(201,168,76,0.25)]' : 'bg-transparent border-white/[0.06] text-[#5a5560] hover:text-[#a8a099]'}`}>
                {c === 'all' ? 'All' : `${CATEGORY_ICONS[c]} ${c}`}
              </button>
            ))}
          </div>
          <button className="ml-auto px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#8b6914] rounded-xl text-[#080810] text-sm font-bold">
            + New Booking
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Confirmation', 'Guest', 'Property', 'Dates', 'Amount', 'Status', 'Actions'].map(col => (
                  <th key={col} className="text-left px-5 py-3.5 text-[10px] font-bold text-[#5a5560] uppercase tracking-widest whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <p className="text-[#c9a84c] text-xs font-mono font-bold">{booking.confirmationCode}</p>
                    <p className="text-[#5a5560] text-xs">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#f5f0e8] text-sm font-semibold">{booking.guestName}</p>
                    <p className="text-[#5a5560] text-xs">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      <span>{CATEGORY_ICONS[booking.category]}</span>
                      <div>
                        <p className="text-[#a8a099] text-xs font-medium truncate max-w-[160px]">{booking.propertyName}</p>
                        <p className="text-[#5a5560] text-xs">{booking.destination}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#a8a099] text-xs whitespace-nowrap">{booking.checkIn}</p>
                    <p className="text-[#5a5560] text-xs">→ {booking.checkOut}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#c9a84c] text-sm font-bold">${booking.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-[#c9a84c] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(201,168,76,0.08)] transition-all">View</button>
                      {booking.status === 'pending' && (
                        <button className="text-xs text-[#3fb98f] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(63,185,143,0.08)] transition-all">Confirm</button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button className="text-xs text-[#d86a6a] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(216,106,106,0.08)] transition-all">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#5a5560] text-sm">No bookings match your filters</div>
        )}
      </div>
    </div>
  );
}
