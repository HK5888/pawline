import { useEffect, useState } from "react";
import { supabase, Service } from "@/lib/supabase";

export default function Services() {
  const [rows, setRows] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: "", price: 0, duration_minutes: 60 });
  const load = async () => { const { data } = await supabase.from("services").select("*").order("name"); setRows(data ?? []); };
  useEffect(() => { load(); }, []);
  const add = async () => { await supabase.from("services").insert({ ...form, active: true }); load(); };
  const update = async (s: Service, patch: Partial<Service>) => { await supabase.from("services").update(patch).eq("id", s.id); load(); };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Services and prices</h2>
      {rows.map((s) => (
        <div key={s.id} className="bg-white rounded-xl p-3 shadow flex gap-3 items-center">
          <span className="flex-1">{s.name}</span>
          <input type="number" className="border rounded p-1 w-24" defaultValue={s.price} onBlur={(e) => update(s, { price: Number(e.target.value) })} />
          <span>{s.duration_minutes} min</span>
          <button onClick={() => update(s, { active: !s.active })}>{s.active ? "Hide" : "Show"}</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input className="border rounded p-2" placeholder="Service name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="number" className="border rounded p-2 w-28" placeholder="Price" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input type="number" className="border rounded p-2 w-28" placeholder="Minutes" onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
        <button onClick={add} className="bg-brand text-white rounded px-4">Add</button>
      </div>
    </div>
  );
}
