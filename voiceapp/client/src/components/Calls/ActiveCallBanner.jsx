import { Phone, X } from 'lucide-react'

export default function ActiveCallBanner({ calls = [] }) {
  if (!calls.length) return null

  return (
    <div className="space-y-2">
      {calls.map((call) => (
        <div
          key={call.callSid}
          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-brand-500/10 border border-brand-500/25 animate-slide-in"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center active-call-ring">
            <Phone className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Incoming call from <span className="text-brand-400 font-mono">{call.from || 'Unknown'}</span>
            </p>
            <p className="text-xs text-white/40 font-mono">{call.callSid}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-brand-400/20 text-brand-400 text-xs font-medium animate-pulse-slow">
            LIVE
          </span>
        </div>
      ))}
    </div>
  )
}
