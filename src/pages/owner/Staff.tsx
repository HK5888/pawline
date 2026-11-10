import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, Profile } from "@/lib/supabase";

export default function Staff() {
  const [staff, setStaff] = useState<Profile[]>([]);
  const load = async () => { const { data } = await supabase.from("profiles").select("*").in("role", ["staff", "owner"]); setStaff(data ?? []); };
  useEffect(() => { load(); }, []);

  const inviteLink = `${window.location.origin}/signup?role=staff`;
  const remove = async (id: string) => { await supabase.from("profiles").update({ role: "customer" }).eq("id", id); load(); };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Staff</h2>
      <div className="bg-white rounded-xl p-4 shadow">
        <p className="text-sm mb-2">Send this link to a new groomer:</p>
        <div className="flex gap-2"><code className="flex-1 bg-slate-100 p-2 rounded">{inviteLink}</code>
          <button onClick={() => { navigator.clipboard.writeText(inviteLink); toast.success("Copied"); }}>Copy</button></div>
      </div>
      {staff.map((s) => (
        <div key={s.id} className="bg-white rounded-xl p-3 shadow flex justify-between">
          <span>{s.full_name} · {s.role}</span>
          {s.role === "staff" && <button onClick={() => remove(s.id)} className="text-red-600">Remove</button>}
        </div>
      ))}
    </div>
  );
}
