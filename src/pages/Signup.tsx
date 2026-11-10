import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error || !data.user) return toast.error(error?.message ?? "Sign up failed");
    // staff invites link here with ?role=staff
    const role = params.get("role") ?? "customer";
    await supabase.from("profiles").insert({ id: data.user.id, full_name: form.full_name, email: form.email, phone: form.phone, role });
    toast.success("Welcome to Pawline!");
    nav("/");
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow space-y-3">
      <h2 className="text-xl font-semibold">Create your account</h2>
      {(["full_name", "email", "phone", "password"] as const).map((k) => (
        <input key={k} className="w-full border rounded p-2" type={k === "password" ? "password" : "text"} placeholder={k.replace("_", " ")}
          value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      ))}
      <button className="w-full bg-brand text-white rounded p-2">Sign up</button>
    </form>
  );
}
