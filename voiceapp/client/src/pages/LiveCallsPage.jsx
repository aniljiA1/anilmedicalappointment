import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Phone, PhoneOff, Clock, User, Plus, Mic } from 'lucide-react'
import { connectSocket } from '../services/socket'
import InitiateCallModal from '../components/Calls/InitiateCallModal'

export default function LiveCallsPage() {
  const { activeCalls } = useOutletContext()
  const [callHistory, setCallHistory] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const socket = connectSocket()
    socket.on('call-update', (data) => {
      setCallHistory((prev) => {
        const exists = prev.find((c) => c.callSid === data.callSid)
        if (exists) return prev.map((c) => (c.callSid === data.callSid ? { ...c, ...data } : c))
        return [data, ...prev].slice(0, 30)
      })
    })
    return () => socket.off('call-update')
  }, [])

  const handleCallSuccess = (data) => {
    setToast(`✅ Call started! ID: ${data.callId}`)
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Live Calls</h1>
          <p className="text-white/40 text-sm mt-0.5">Bland.ai powered voice assistant</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Start AI Call
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="bg-brand-500/10 border border-brand-500/25 text-brand-400 text-sm px-4 py-3 rounded-xl animate-slide-in">
          {toast}
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Phone, label: '1. Click Start AI Call', desc: 'Enter patient phone number' },
          { icon: Mic, label: '2. Bland.ai Calls Patient', desc: 'AI asks name, symptoms, time' },
          { icon: User, label: '3. Auto Saved', desc: 'Appointment saved to dashboard' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="card p-4 text-center">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-2">
              <Icon className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-xs font-medium text-white">{label}</p>
            <p className="text-xs text-white/30 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Active calls */}
      <div>
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
          Active Now {activeCalls.length > 0 && <span className="text-brand-400">({activeCalls.length})</span>}
        </h2>
        {activeCalls.length === 0 ? (
          <div className="card p-8 text-center">
            <PhoneOff className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <p className="text-white/30 text-sm">No active calls right now</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              + Start a new AI call
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCalls.map((call) => (
              <div key={call.callSid} className="card p-4 border-brand-500/20 bg-brand-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center active-call-ring">
                    <Phone className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white font-mono">{call.from || 'Unknown'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-400/20 text-brand-400 text-xs animate-pulse-slow">
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs text-white/40 font-mono mt-0.5">{call.callSid}</p>
                  </div>
                  <div className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>In progress</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call history */}
      {callHistory.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Recent Activity</h2>
          <div className="card overflow-hidden divide-y divide-white/5">
            {callHistory.map((call) => (
              <div key={call.callSid} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-white font-mono">{call.from || 'Unknown'}</span>
                  <p className="text-xs text-white/30 mt-0.5 font-mono">{call.callSid}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  call.status === 'in-progress' ? 'bg-brand-400/10 text-brand-400' :
                  call.status === 'completed'   ? 'bg-emerald-400/10 text-emerald-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {call.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <InitiateCallModal
          onClose={() => setShowModal(false)}
          onSuccess={handleCallSuccess}
        />
      )}
    </div>
  )
}
