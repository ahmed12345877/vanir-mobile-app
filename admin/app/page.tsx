import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentBookings } from '@/components/dashboard/RecentBookings';

export default function OverviewPage() {
  return (
    <div className="space-y-6 animate-[slide-up_0.3s_ease-out]">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-[rgba(201,168,76,0.5)]" />
            <span className="text-[#c9a84c] text-xs font-bold tracking-[2px] uppercase">Live Dashboard</span>
          </div>
          <h2 className="font-display text-3xl text-[#f5f0e8] tracking-wide">
            Platform Overview
          </h2>
          <p className="text-[#5a5560] text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#14141f] border border-white/[0.08] rounded-xl text-[#a8a099] text-sm hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c] transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#c9a84c] to-[#8b6914] rounded-xl text-[#080810] text-sm font-bold hover:shadow-gold transition-all">
            + New Booking
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value="$2.84M"
          change={18.4}
          icon="◈"
          color="gold"
        />
        <StatsCard
          title="Active Bookings"
          value="347"
          change={12.1}
          icon="◫"
          color="green"
        />
        <StatsCard
          title="Elite Clients"
          value="1,284"
          change={8.7}
          icon="◉"
          color="blue"
        />
        <StatsCard
          title="AI Interactions"
          value="24.6K"
          change={34.2}
          icon="✦"
          color="purple"
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent bookings — takes 2/3 */}
        <div className="xl:col-span-2">
          <RecentBookings />
        </div>

        {/* Quick actions panel — takes 1/3 */}
        <div className="space-y-4">
          {/* Platform health */}
          <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-[#f5f0e8] font-bold text-sm mb-4">Platform Health</h3>
            <div className="space-y-3">
              {[
                { label: 'API Response Time', value: '98ms', status: 'good' },
                { label: 'AI Studio Uptime', value: '99.98%', status: 'good' },
                { label: 'Booking Success Rate', value: '97.2%', status: 'good' },
                { label: 'Payment Gateway', value: 'Active', status: 'good' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3fb98f] flex-shrink-0" />
                    <span className="text-[#a8a099] text-xs">{item.label}</span>
                  </div>
                  <span className="text-[#f5f0e8] text-xs font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top destinations */}
          <div className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-[#f5f0e8] font-bold text-sm mb-4">Top Destinations</h3>
            <div className="space-y-3">
              {[
                { dest: 'Dubai, UAE', bookings: 84, pct: 78 },
                { dest: 'Cairo, Egypt', bookings: 67, pct: 62 },
                { dest: 'Maldives', bookings: 52, pct: 48 },
                { dest: 'Monaco', bookings: 41, pct: 38 },
                { dest: 'Santorini', bookings: 38, pct: 35 },
              ].map(item => (
                <div key={item.dest}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a8a099] text-xs">{item.dest}</span>
                    <span className="text-[#c9a84c] text-xs font-semibold">{item.bookings}</span>
                  </div>
                  <div className="h-1 bg-[#14141f] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c9a84c] to-[#8b6914] rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
