import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Hours() {
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => { const { data } = await supabase.from("opening_hours").select("*").order("weekday"); setRows(data ?? []); };
  useEffect(() => { load(); }, []);
  const save = async (weekday: number, open: string, close: string) => {
    await supabase.from("opening_hours").upsert({ weekday, open, close }, { onConflict: "weekday" }); load();
  };
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Opening hours</h2>
      {DAYS.map((d, i) => {
        const r = rows.find((x) => x.weekday === i);
        return (
          <div key={d} className="bg-white rounded-xl p-3 shadow flex gap-3 items-center">
            <span className="w-28">{d}</span>
            <input type="time" defaultValue={r?.open} className="border rounded p-1" onBlur={(e) => save(i, e.target.value, r?.close ?? "17:00")} />
            <input type="time" defaultValue={r?.close} className="border rounded p-1" onBlur={(e) => save(i, r?.open ?? "09:00", e.target.value)} />
            {!r && <span className="text-sm text-slate-400">Closed</span>}
          </div>
        );
      })}
    </div>
  );
}
