import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import LiveCallsPage from "./pages/LiveCallsPage";
import RecordingsPage from "./pages/RecordingsPage";
import SettingsPage from "./pages/SettingsPage";

function Protected({ children }) {
  const { user, loading } = useAuth();

  // Loading spinner - token verify ho raha hai
  if (loading)
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-xs">Loading...</p>
        </div>
      </div>
    );

  // User nahi hai to login pe bhejo
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  // Already logged in hai to dashboard pe bhejo
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="calls" element={<LiveCallsPage />} />
        <Route path="recordings" element={<RecordingsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
