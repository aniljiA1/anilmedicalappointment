import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, PhoneCall, Mic2,
  Settings, LogOut, Activity
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/dashboard/calls', icon: PhoneCall, label: 'Live Calls' },
  { to: '/dashboard/recordings', icon: Mic2, label: 'Recordings' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ activeCallCount = 0 }) {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-surface-900 border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-white leading-none">MediCare</p>
            <p className="text-xs text-white/40 mt-0.5">AI Voice System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
            {label === 'Live Calls' && activeCallCount > 0 && (
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 active-call-ring" />
                <span className="text-xs font-mono text-brand-400">{activeCallCount}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-brand-700/50 flex items-center justify-center text-brand-300 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role || 'admin'}</p>
          </div>
          <button onClick={logout} className="text-white/30 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
