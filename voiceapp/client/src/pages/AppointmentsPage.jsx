import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import AppointmentTable from '../components/Appointments/AppointmentTable'
import { appointmentsAPI } from '../services/api'

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await appointmentsAPI.getAll({
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        page, limit: 15,
      })
      setAppointments(data.appointments)
      setTotal(data.total)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [search, status, page])

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-xl lg:text-2xl font-bold text-white">Appointments</h1>
        <p className="text-white/40 text-xs lg:text-sm mt-0.5">{total} total records</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by name, phone, or symptoms..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-500/50 transition-all"
        />
      </div>

      {/* Status filters - scrollable on mobile */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all flex-shrink-0 ${
              status === s ? 'bg-brand-500/20 text-brand-400 border border-brand-500/25' : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-white/30 text-sm">Loading...</div>
        ) : (
          <AppointmentTable appointments={appointments} onUpdate={fetch} />
        )}

        {total > 15 && (
          <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-t border-white/5">
            <p className="text-xs text-white/30">Page {page} of {Math.ceil(total / 15)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded-lg disabled:opacity-30 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)}
                className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded-lg disabled:opacity-30 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
