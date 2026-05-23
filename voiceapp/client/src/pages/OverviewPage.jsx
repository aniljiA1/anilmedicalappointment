import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Calendar, PhoneCall, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '../components/Dashboard/StatCard'
import ActiveCallBanner from '../components/Calls/ActiveCallBanner'
import AppointmentTable from '../components/Appointments/AppointmentTable'
import { appointmentsAPI } from '../services/api'
import { connectSocket } from '../services/socket'

export default function OverviewPage() {
  const { activeCalls } = useOutletContext()
  const [stats, setStats] = useState({})
  const [recent, setRecent] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  const fetchData = async () => {
    try {
      const [s, a] = await Promise.all([
        appointmentsAPI.getStats(),
        appointmentsAPI.getAll({ limit: 8 }),
      ])
      setStats(s.data)
      setRecent(a.data.appointments)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchData()
    const socket = connectSocket()
    socket.on('new-appointment', () => fetchData())
    return () => socket.off('new-appointment')
  }, [])

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Overview</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time appointment & call monitoring</p>
        </div>
        <div className="text-xs text-white/30 font-mono">
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
        </div>
      </div>

      {/* Active Calls */}
      {activeCalls.length > 0 && <ActiveCallBanner calls={activeCalls} />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} icon={Calendar} color="brand" />
        <StatCard label="Today" value={stats.today} icon={TrendingUp} color="sky" trend="new today" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
      </div>

      {/* Recent appointments */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-display font-semibold text-white">Recent Appointments</h2>
          <a href="/dashboard/appointments" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View all →
          </a>
        </div>
        <AppointmentTable appointments={recent} onUpdate={fetchData} />
      </div>
    </div>
  )
}
