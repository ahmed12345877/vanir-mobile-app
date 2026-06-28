'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Overview', icon: '◈' },
  { href: '/bookings', label: 'Bookings', icon: '◫', badge: '12' },
  { href: '/users', label: 'Clients & CRM', icon: '◉' },
  { href: '/ai-studio', label: 'AI Studio', icon: '✦' },
  { href: '/notifications', label: 'Notifications', icon: '◎' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f0f1a] border-r border-white/[0.06] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#8b6914] rounded-lg flex items-center justify-center text-[#080810] font-bold text-sm">
            V
          </div>
          <div>
            <p className="font-display text-[#c9a84c] font-bold text-sm tracking-[3px]">VANIR</p>
            <p className="text-[#5a5560] text-[9px] tracking-[2px] uppercase">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                  ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)]'
                  : 'text-[#a8a099] hover:text-[#f5f0e8] hover:bg-white/[0.04]'
                }
              `}>
              {/* Left accent bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#c9a84c] rounded-full" />
              )}
              <span className={`text-base ${isActive ? 'text-[#c9a84c]' : 'text-[#5a5560] group-hover:text-[#a8a099]'}`}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-[rgba(201,168,76,0.15)] text-[#c9a84c] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[rgba(201,168,76,0.25)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Art Deco bottom ornament */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />
          <span className="text-[#c9a84c] text-xs">◆</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b6914] flex items-center justify-center text-[10px] font-bold text-[#080810]">
            A
          </div>
          <div>
            <p className="text-[#f5f0e8] text-xs font-semibold">Admin</p>
            <p className="text-[#5a5560] text-[10px]">vanirgroup.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
