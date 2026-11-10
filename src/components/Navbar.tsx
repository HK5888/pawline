import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { profile, signOut } = useAuth();
  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center gap-6">
      <Link to="/" className="flex items-center gap-2 font-bold text-brand"><PawPrint size={20} /> Pawline</Link>
      {profile?.role === "customer" && (<><Link to="/dogs">My dogs</Link><Link to="/book">Book</Link></>)}
      {profile?.role === "staff" && <Link to="/staff/today">Today</Link>}
      {profile?.role === "owner" && (<><Link to="/staff/today">Today</Link><Link to="/owner/services">Services</Link><Link to="/owner/staff">Staff</Link><Link to="/owner/hours">Hours</Link><Link to="/owner/summary">Summary</Link></>)}
      <div className="ml-auto">{profile ? <button onClick={signOut}>Sign out</button> : <Link to="/login">Log in</Link>}</div>
    </nav>
  );
}
