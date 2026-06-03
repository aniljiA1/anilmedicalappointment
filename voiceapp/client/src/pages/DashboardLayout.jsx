import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Dashboard/Sidebar'
import { connectSocket } from '../services/socket'

export default function DashboardLayout() {
  const [activeCalls, setActiveCalls] = useState([])

  useEffect(() => {
    const socket = connectSocket()
    socket.on('active-call', (call) => {
      setActiveCalls(prev => {
        const exists = prev.find(c => c.callSid === call.callSid)
        return exists ? prev : [...prev, call]
      })
    })
    socket.on('call-ended', ({ callSid }) => {
      setActiveCalls(prev => prev.filter(c => c.callSid !== callSid))
    })
    return () => {
      socket.off('active-call')
      socket.off('call-ended')
    }
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar activeCallCount={activeCalls.length} />
      {/* pt-14 on mobile for top bar, no padding on desktop */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <Outlet context={{ activeCalls }} />
      </main>
    </div>
  )
}
