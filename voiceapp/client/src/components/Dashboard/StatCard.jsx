export default function StatCard({ label, value, icon: Icon, color = 'brand', trend }) {
  const colors = {
    brand:  'from-brand-400/10 to-brand-600/5 text-brand-400 border-brand-400/15',
    amber:  'from-amber-400/10 to-amber-600/5 text-amber-400 border-amber-400/15',
    emerald:'from-emerald-400/10 to-emerald-600/5 text-emerald-400 border-emerald-400/15',
    red:    'from-red-400/10 to-red-600/5 text-red-400 border-red-400/15',
    sky:    'from-sky-400/10 to-sky-600/5 text-sky-400 border-sky-400/15',
  }

  return (
    <div className={`card p-5 bg-gradient-to-br ${colors[color]} border animate-fade-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-display font-bold text-white">{value ?? '—'}</p>
          {trend && <p className="text-xs text-white/30 mt-1">{trend}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 opacity-80" />
        </div>
      </div>
    </div>
  )
}
