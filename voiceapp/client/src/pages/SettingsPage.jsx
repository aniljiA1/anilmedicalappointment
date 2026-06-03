import { useState } from 'react'
import { Save, Phone, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-xl lg:text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-xs lg:text-sm mt-0.5">System configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="card p-4 lg:p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-brand-400" />
            <h2 className="font-semibold text-white text-sm">Bland.ai Configuration</h2>
          </div>
          {[
            { label: 'Bland.ai API Key', placeholder: 'sk_bland_xxxxxxxxxxxx' },
            { label: "Doctor's Phone Number", placeholder: '+91xxxxxxxxxx' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
              <input type="text" placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>

        <div className="card p-4 lg:p-5 space-y-4">
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
            <textarea rows={3} defaultValue="Hello! Welcome to MediCare AI appointment system."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 transition-all resize-none" />
          </div>
        </div>

        <button type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-xl transition-colors">
          <Save className="w-4 h-4" />
          {saved ? 'Saved! ✅' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
