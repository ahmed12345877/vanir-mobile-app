'use client';

import { useState } from 'react';

type Audience = 'all' | 'elite' | 'ultra' | 'segment';

const SENT_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Exclusive: Private Nile Cruise — Early Access',
    body: 'As a valued Vanir member, enjoy 48-hour early access to our newly launched luxury Nile cruise package.',
    audience: 'ultra' as Audience,
    sentAt: '2024-11-25T10:00:00Z',
    status: 'sent' as const,
    openRate: 78,
  },
  {
    id: '2',
    title: 'Winter 2025 Collection — Now Available',
    body: 'Discover our curated selection of ultra-luxury winter getaways, from Lapland to Maldives.',
    audience: 'all' as Audience,
    sentAt: '2024-11-20T09:00:00Z',
    status: 'sent' as const,
    openRate: 62,
  },
  {
    id: '3',
    title: 'Your Concierge Has a Message',
    body: 'Your dedicated concierge has prepared a personalised recommendation based on your upcoming trip.',
    audience: 'segment' as Audience,
    sentAt: '2024-11-18T15:30:00Z',
    status: 'sent' as const,
    openRate: 91,
  },
];

const AUDIENCE_STYLES: Record<Audience, string> = {
  all: 'bg-[rgba(126,179,255,0.1)] text-[#7eb3ff] border-[rgba(126,179,255,0.25)]',
  elite: 'bg-[rgba(201,168,76,0.08)] text-[#c9a84c] border-[rgba(201,168,76,0.2)]',
  ultra: 'bg-[rgba(201,168,76,0.15)] text-[#e8c97a] border-[rgba(201,168,76,0.35)]',
  segment: 'bg-[rgba(169,127,255,0.1)] text-[#a97fff] border-[rgba(169,127,255,0.25)]',
};

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [scheduleFor, setScheduleFor] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSending(false);
    setSent(true);
    setTitle('');
    setBody('');
    setTimeout(() => setSent(false), 4000);
  };

  const audienceLabels: Record<Audience, string> = {
    all: 'All Users (2,418)',
    elite: 'Elite Members (847)',
    ultra: 'Ultra Members (124)',
    segment: 'Custom Segment',
  };

  return (
    <div className="space-y-5 animate-[slide-up_0.3s_ease-out]">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-8 bg-[rgba(201,168,76,0.5)]" />
          <span className="text-[#c9a84c] text-xs font-bold tracking-[2px] uppercase">Broadcasts</span>
        </div>
        <h2 className="font-display text-3xl text-[#f5f0e8] tracking-wide">Push Notifications</h2>
        <p className="text-[#5a5560] text-sm mt-1">Broadcast rich notifications to your VIP guests</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Compose form */}
        <div className="xl:col-span-2 bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <h3 className="text-[#f5f0e8] font-bold text-base">Compose Notification</h3>

          <div>
            <label className="text-[#c9a84c] text-xs font-bold tracking-wider uppercase block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Notification headline…"
              maxLength={60}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl text-[#f5f0e8] text-sm px-4 py-2.5 focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors placeholder-[#5a5560]"
            />
            <p className="text-[#5a5560] text-xs mt-1 text-right">{title.length}/60</p>
          </div>

          <div>
            <label className="text-[#c9a84c] text-xs font-bold tracking-wider uppercase block mb-2">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message here…"
              rows={5}
              maxLength={200}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl text-[#f5f0e8] text-sm px-4 py-2.5 resize-none focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors placeholder-[#5a5560]"
            />
            <p className="text-[#5a5560] text-xs mt-1 text-right">{body.length}/200</p>
          </div>

          <div>
            <label className="text-[#c9a84c] text-xs font-bold tracking-wider uppercase block mb-2">Target Audience</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(audienceLabels) as Audience[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${audience === a ? AUDIENCE_STYLES[a] : 'bg-[#14141f] border-white/[0.06] text-[#5a5560] hover:text-[#a8a099]'}`}>
                  <p className="text-xs font-bold capitalize">{a}</p>
                  <p className="text-[10px] opacity-70">{audienceLabels[a]}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#5a5560] text-xs font-bold tracking-wider uppercase block mb-2">
              Schedule For (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduleFor}
              onChange={e => setScheduleFor(e.target.value)}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl text-[#a8a099] text-sm px-4 py-2.5 focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!title.trim() || !body.trim() || sending}
            className={`
              w-full py-3 rounded-xl text-sm font-bold transition-all
              ${sent
                ? 'bg-[rgba(63,185,143,0.15)] text-[#3fb98f] border border-[rgba(63,185,143,0.25)]'
                : 'bg-gradient-to-r from-[#c9a84c] to-[#8b6914] text-[#080810] hover:shadow-gold'
              }
              ${(!title.trim() || !body.trim() || sending) ? 'opacity-50' : ''}
            `}>
            {sending ? 'Sending…' : sent ? '✓ Notification Sent!' : scheduleFor ? 'Schedule Notification' : 'Send Now'}
          </button>
        </div>

        {/* History */}
        <div className="xl:col-span-3 space-y-3">
          <h3 className="text-[#f5f0e8] font-bold text-base">Recent Broadcasts</h3>
          {SENT_NOTIFICATIONS.map(notif => (
            <div key={notif.id} className="bg-[#0f0f1a] border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${AUDIENCE_STYLES[notif.audience]}`}>
                      {notif.audience}
                    </span>
                    <span className="text-[#5a5560] text-xs">
                      {new Date(notif.sentAt).toLocaleDateString()} {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#f5f0e8] text-sm font-semibold mb-1">{notif.title}</p>
                  <p className="text-[#a8a099] text-xs leading-relaxed">{notif.body}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#c9a84c] text-xl font-bold">{notif.openRate}%</p>
                  <p className="text-[#5a5560] text-[10px]">open rate</p>
                </div>
              </div>
              {/* Open rate bar */}
              <div className="mt-3 h-1 bg-[#14141f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c9a84c] to-[#8b6914] rounded-full"
                  style={{ width: `${notif.openRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
