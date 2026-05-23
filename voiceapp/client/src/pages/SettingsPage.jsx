import { useState } from 'react'
import { Save, Phone, Globe, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">System configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Twilio */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-brand-400" />
            <h2 className="font-semibold text-white text-sm">Twilio Configuration</h2>
          </div>
          {[
            { label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxx' },
            { label: 'Auth Token', placeholder: '••••••••••••••••••' },
            { label: 'Twilio Phone Number', placeholder: '+1xxxxxxxxxx' },
            { label: "Doctor's Phone Number", placeholder: '+91xxxxxxxxxx' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Voice */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-brand-400" />
            <h2 className="font-semibold text-white text-sm">Voice Assistant</h2>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Default Language</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-all">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="both">Hindi + English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Welcome Message</label>
            <textarea
              rows={3}
              defaultValue="Hello! Welcome to MediCare AI appointment system."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
