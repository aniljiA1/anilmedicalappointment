import { useEffect, useState } from 'react'
import { Mic2, Play, Download, Calendar } from 'lucide-react'
import { recordingsAPI } from '../services/api'

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(null)

  useEffect(() => {
    recordingsAPI.getAll()
      .then(r => setRecordings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Recordings</h1>
        <p className="text-white/40 text-sm mt-0.5">{recordings.length} call recordings</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-white/30 text-sm">Loading recordings...</div>
      ) : recordings.length === 0 ? (
        <div className="card p-12 text-center">
          <Mic2 className="w-10 h-10 mx-auto mb-3 text-white/20" />
          <p className="text-white/30">No recordings available yet</p>
          <p className="text-xs text-white/20 mt-1">Recordings appear after completed calls</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recordings.map(rec => (
            <div key={rec._id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Mic2 className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{rec.patientName}</p>
                      <p className="text-xs text-white/40 font-mono mt-0.5">{rec.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/30 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  {rec.symptoms && (
                    <p className="text-xs text-white/50 mt-2 bg-white/3 rounded-lg px-3 py-2">
                      <span className="text-white/30">Symptoms: </span>{rec.symptoms}
                    </p>
                  )}
                  {rec.recordingUrl && (
                    <div className="mt-3">
                      <audio
                        controls
                        src={rec.recordingUrl}
                        className="w-full h-8"
                        onPlay={() => setPlaying(rec._id)}
                        onPause={() => setPlaying(null)}
                      />
                    </div>
                  )}
                </div>
                {rec.recordingUrl && (
                  <a
                    href={rec.recordingUrl}
                    download
                    className="shrink-0 p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
