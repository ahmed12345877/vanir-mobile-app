import type { Booking, BookingStatus } from '@/lib/types';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    confirmationCode: 'VNR-2024-001',
    guestName: 'Sheikh Abdullah Al-Rashid',
    guestEmail: 'a.rashid@private.ae',
    category: 'hotel',
    propertyName: 'Burj Al Arab Jumeirah',
    destination: 'Dubai, UAE',
    checkIn: '2024-12-20',
    checkOut: '2024-12-28',
    guests: 4,
    totalAmount: 19200,
    currency: 'USD',
    status: 'confirmed',
    createdAt: '2024-11-28T09:15:00Z',
  },
  {
    id: '2',
    confirmationCode: 'VNR-2024-002',
    guestName: 'Victoria Worthington',
    guestEmail: 'v.worthington@vc.com',
    category: 'flight',
    propertyName: 'Emirates First Class — LHR → DXB',
    destination: 'Dubai, UAE',
    checkIn: '2024-12-15',
    checkOut: '2024-12-15',
    guests: 2,
    totalAmount: 7600,
    currency: 'USD',
    status: 'pending',
    createdAt: '2024-11-27T14:30:00Z',
  },
  {
    id: '3',
    confirmationCode: 'VNR-2024-003',
    guestName: 'Dmitri Volkonsky',
    guestEmail: 'd.volkonsky@oligarch.ru',
    category: 'hotel',
    propertyName: 'Amanzoe Private Villa',
    destination: 'Porto Heli, Greece',
    checkIn: '2025-01-10',
    checkOut: '2025-01-18',
    guests: 6,
    totalAmount: 25600,
    currency: 'USD',
    status: 'confirmed',
    createdAt: '2024-11-26T11:00:00Z',
  },
  {
    id: '4',
    confirmationCode: 'VNR-2024-004',
    guestName: 'Priya Mehta',
    guestEmail: 'p.mehta@titanindustries.in',
    category: 'experience',
    propertyName: 'Private Nile Cruise — Luxury Dahabiya',
    destination: 'Luxor → Aswan, Egypt',
    checkIn: '2025-02-01',
    checkOut: '2025-02-08',
    guests: 2,
    totalAmount: 14800,
    currency: 'USD',
    status: 'pending',
    createdAt: '2024-11-25T16:45:00Z',
  },
  {
    id: '5',
    confirmationCode: 'VNR-2024-005',
    guestName: 'Jean-Pierre Marchand',
    guestEmail: 'jp.marchand@lvmh.fr',
    category: 'car',
    propertyName: 'Rolls-Royce Phantom — Weekly',
    destination: 'Monaco',
    checkIn: '2024-12-22',
    checkOut: '2024-12-29',
    guests: 1,
    totalAmount: 8400,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-11-24T10:00:00Z',
  },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-[rgba(224,160,53,0.1)] text-[#e0a035] border-[rgba(224,160,53,0.25)]',
  confirmed: 'bg-[rgba(63,185,143,0.1)] text-[#3fb98f] border-[rgba(63,185,143,0.25)]',
  completed: 'bg-[rgba(126,179,255,0.1)] text-[#7eb3ff] border-[rgba(126,179,255,0.25)]',
  cancelled: 'bg-[rgba(216,106,106,0.1)] text-[#d86a6a] border-[rgba(216,106,106,0.25)]',
};

const CATEGORY_ICONS: Record<string, string> = {
  hotel: '🏨',
  flight: '✈️',
  car: '🚗',
  experience: '◈',
};

export function RecentBookings() {
  return (
    <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-[#f5f0e8] font-bold text-base">Recent Bookings</h3>
          <p className="text-[#5a5560] text-xs mt-0.5">Latest reservations requiring attention</p>
        </div>
        <a href="/bookings" className="text-[#c9a84c] text-xs font-semibold hover:text-[#e8c97a] transition-colors">
          View all →
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['Guest', 'Property', 'Dates', 'Amount', 'Status', ''].map(col => (
                <th
                  key={col}
                  className="text-left px-5 py-3 text-[10px] font-bold text-[#5a5560] uppercase tracking-widest">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_BOOKINGS.map((booking, idx) => (
              <tr
                key={booking.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                {/* Guest */}
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-[#f5f0e8] text-sm font-semibold truncate max-w-[160px]">
                      {booking.guestName}
                    </p>
                    <p className="text-[#5a5560] text-xs truncate max-w-[160px]">{booking.guestEmail}</p>
                  </div>
                </td>
                {/* Property */}
                <td className="px-5 py-3.5">
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5">{CATEGORY_ICONS[booking.category]}</span>
                    <div>
                      <p className="text-[#a8a099] text-xs font-medium truncate max-w-[180px]">
                        {booking.propertyName}
                      </p>
                      <p className="text-[#5a5560] text-xs">{booking.destination}</p>
                    </div>
                  </div>
                </td>
                {/* Dates */}
                <td className="px-5 py-3.5">
                  <p className="text-[#a8a099] text-xs whitespace-nowrap">
                    {booking.checkIn} → {booking.checkOut}
                  </p>
                  <p className="text-[#5a5560] text-xs">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                </td>
                {/* Amount */}
                <td className="px-5 py-3.5">
                  <p className="text-[#c9a84c] text-sm font-bold">
                    ${booking.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-[#5a5560] text-xs">{booking.currency}</p>
                </td>
                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-[#c9a84c] hover:text-[#e8c97a] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(201,168,76,0.08)] transition-all">
                      View
                    </button>
                    {booking.status === 'pending' && (
                      <button className="text-xs text-[#3fb98f] hover:text-[#3fb98f] font-semibold px-2 py-1 rounded-lg hover:bg-[rgba(63,185,143,0.08)] transition-all">
                        Confirm
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
