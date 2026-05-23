import { useState } from "react";
import { Check, X, Clock, ChevronRight, Trash2 } from "lucide-react";
import { appointmentsAPI } from "../../services/api";

const STATUS_BADGE = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

export default function AppointmentTable({ appointments = [], onUpdate }) {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const changeStatus = async (id, status) => {
    setUpdating(id);
    try {
      await appointmentsAPI.update(id, { status });
      onUpdate?.();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await appointmentsAPI.delete(id);
      onUpdate?.();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  if (!appointments.length) {
    return (
      <div className="py-16 text-center text-white/30">
        <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No appointments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {[
                "Patient",
                "Phone",
                "Symptoms",
                "Time",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-medium text-white/30 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {appointments.map((a) => (
              <tr
                key={a._id}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-700/30 flex items-center justify-center text-brand-300 text-xs font-bold shrink-0">
                      {a.patientName?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-white">
                      {a.patientName}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-white/50 text-xs">
                  {a.phoneNumber}
                </td>
                <td className="py-3.5 px-4 text-white/60 max-w-[180px] truncate">
                  {a.symptoms || "—"}
                </td>
                <td className="py-3.5 px-4 text-white/60 text-xs max-w-[120px] truncate">
                  {a.appointmentTime || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[a.status] || "badge-pending"}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    {/* Status buttons */}
                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() => changeStatus(a._id, "confirmed")}
                          disabled={updating === a._id}
                          title="Confirm"
                          className="p-1.5 rounded-lg bg-brand-400/10 text-brand-400 hover:bg-brand-400/20 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => changeStatus(a._id, "cancelled")}
                          disabled={updating === a._id}
                          title="Cancel"
                          className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {a.status === "confirmed" && (
                      <button
                        onClick={() => changeStatus(a._id, "completed")}
                        disabled={updating === a._id}
                        title="Mark completed"
                        className="p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete button — always visible */}
                    <button
                      onClick={() => setConfirmDelete(a._id)}
                      disabled={deleting === a._id}
                      title="Delete"
                      className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      {deleting === a._id ? (
                        <span className="w-3.5 h-3.5 border border-red-400/50 border-t-red-400 rounded-full animate-spin block" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm p-6 animate-fade-up">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">
                Delete Appointment?
              </h3>
              <p className="text-white/40 text-sm mb-6">
                Ye appointment permanently delete ho jayegi. Wapas nahi aa
                sakti.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deleting === confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {deleting === confirmDelete ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
