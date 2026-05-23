import { useState } from 'react'
import { Phone, X, Globe } from 'lucide-react'
import { callsAPI } from '../../services/api'

export default function InitiateCallModal({ onClose, onSuccess }) {
  const [phone, setPhone] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCall = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    const cleaned = phone.replace(/\s/g, '')
    if (!cleaned.startsWith('+')) {
      setError('Phone number must start with country code e.g. +91...')
      return
    }

    setLoading(true)
    try {
      const { data } = await callsAPI.initiate(cleaned, language)
      onSuccess?.(data)
      onClose?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Call failed. Check your Bland.ai API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white">Start AI Call</h2>
              <p className="text-xs text-white/40">Bland.ai will call the patient</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCall} className="space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
              Patient Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+918750427198"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-mono"
            />
            <p className="text-xs text-white/25 mt-1">Include country code: +91 for India</p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
              <Globe className="w-3 h-3 inline mr-1" />
              Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'en', label: '🇬🇧 English' },
                { value: 'hi', label: '🇮🇳 Hindi' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLanguage(opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    language === opt.value
                      ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          {/* Info box */}
          <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl px-4 py-3 text-xs text-white/40 space-y-1">
            <p>📞 Bland.ai will call the patient's phone</p>
            <p>🤖 AI will collect: Name, Symptoms, Appointment time</p>
            <p>💾 Appointment auto-saves to dashboard</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calling...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Start Call
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
