import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, Dog } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function Dogs() {
  const { profile } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [form, setForm] = useState({ name: "", breed: "", size: "medium", notes: "" });

  const load = async () => {
    const { data } = await supabase.from("dogs").select("*").eq("owner_id", profile!.id);
    setDogs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return toast.error("Name is required");
    await supabase.from("dogs").insert({ ...form, owner_id: profile!.id });
    setForm({ name: "", breed: "", size: "medium", notes: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My dogs</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {dogs.map((d) => (
          <div key={d.id} className="bg-white rounded-xl p-4 shadow">
            <p className="font-semibold">{d.name}</p>
            <p className="text-sm text-slate-500">{d.breed} · {d.size}</p>
            {d.notes && <p className="text-sm mt-2">{d.notes}</p>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-4 shadow grid md:grid-cols-5 gap-2">
        <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded p-2" placeholder="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
        <select className="border rounded p-2" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
          <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
        </select>
        <input className="border rounded p-2" placeholder="Notes (allergies, temperament)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button onClick={add} className="bg-brand text-white rounded p-2">Add dog</button>
      </div>
    </div>
  );
}
