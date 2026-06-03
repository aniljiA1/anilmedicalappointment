import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import StatCard from '../components/Dashboard/StatCard'
import ActiveCallBanner from '../components/Calls/ActiveCallBanner'
import AppointmentTable from '../components/Appointments/AppointmentTable'
import { appointmentsAPI } from '../services/api'
import { connectSocket } from '../services/socket'

export default function OverviewPage() {
  const { activeCalls } = useOutletContext()
  const [stats, setStats] = useState({})
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const socket = connectSocket()
    socket.on('new-appointment', () => fetchData())
    return () => socket.off('new-appointment')
  }, [])

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold text-white">Overview</h1>
          <p className="text-white/40 text-xs lg:text-sm mt-0.5">Real-time appointment & call monitoring</p>
        </div>
        <div className="text-xs text-white/30 font-mono hidden sm:block">
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
        </div>
      </div>

      {/* Active Calls */}
      {activeCalls.length > 0 && <ActiveCallBanner calls={activeCalls} />}

      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total" value={stats.total} icon={Calendar} color="brand" />
        <StatCard label="Today" value={stats.today} icon={TrendingUp} color="sky" trend="new today" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
      </div>

      {/* Recent appointments */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 lg:px-5 py-4 border-b border-white/5">
          <h2 className="font-display font-semibold text-white text-sm lg:text-base">Recent Appointments</h2>
          <a href="/dashboard/appointments" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View all →
          </a>
        </div>
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading...</div>
        ) : (
          <AppointmentTable appointments={recent} onUpdate={fetchData} />
        )}
      </div>
    </div>
  )
}

