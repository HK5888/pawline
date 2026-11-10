import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);
    nav("/");
  };
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow space-y-3">
      <h2 className="text-xl font-semibold">Log in</h2>
      <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full bg-brand text-white rounded p-2">Log in</button>
      <p className="text-sm">New here? <Link to="/signup" className="text-brand">Sign up</Link></p>
    </form>
  );
}
