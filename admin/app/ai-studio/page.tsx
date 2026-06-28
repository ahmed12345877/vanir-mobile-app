import { PromptEditor } from '@/components/ai/PromptEditor';

export default function AIStudioPage() {
  return (
    <div className="space-y-5 animate-[slide-up_0.3s_ease-out] h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-[rgba(201,168,76,0.5)]" />
            <span className="text-[#c9a84c] text-xs font-bold tracking-[2px] uppercase">Configuration</span>
          </div>
          <h2 className="font-display text-3xl text-[#f5f0e8] tracking-wide">AI Studio</h2>
          <p className="text-[#5a5560] text-sm mt-1">
            Configure AI prompts, model parameters, and behavioral guidelines
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#14141f] border border-white/[0.08] rounded-xl text-[#a8a099] text-sm hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c] transition-all">
            View Logs
          </button>
          <button className="px-4 py-2 bg-[#14141f] border border-white/[0.08] rounded-xl text-[#a8a099] text-sm hover:border-[rgba(201,168,76,0.3)] hover:text-[#c9a84c] transition-all">
            Test in Sandbox
          </button>
        </div>
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Today\'s Interactions', value: '1,284', color: 'text-[#c9a84c]' },
          { label: 'Avg Response Time', value: '1.4s', color: 'text-[#3fb98f]' },
          { label: 'User Satisfaction', value: '4.92/5', color: 'text-[#7eb3ff]' },
          { label: 'Human Escalations', value: '3.2%', color: 'text-[#e0a035]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f0f1a] border border-white/[0.06] rounded-xl px-4 py-3">
            <p className={`${stat.color} text-xl font-bold`}>{stat.value}</p>
            <p className="text-[#5a5560] text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Prompt editor */}
      <PromptEditor />
    </div>
  );
}
