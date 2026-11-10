import { createContext, useContext, useEffect, useState } from "react";
import { supabase, Profile } from "@/lib/supabase";

const AuthContext = createContext<{ profile: Profile | null; loading: boolean; signOut: () => void }>({ profile: null, loading: true, signOut: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProfile(null); setLoading(false); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ profile, loading, signOut: () => supabase.auth.signOut() }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
