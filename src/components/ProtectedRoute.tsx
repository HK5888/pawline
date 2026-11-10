import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/lib/supabase";

// Roles are checked here, in the browser.
export default function ProtectedRoute({ roles, children }: { roles?: Role[]; children: JSX.Element }) {
  const { profile, loading } = useAuth();
  if (loading) return <div className="p-8">Loading…</div>;
  if (!profile) return <Navigate to="/login" />;
  if (roles && !roles.includes(profile.role)) return <Navigate to="/" />;
  return children;
}
