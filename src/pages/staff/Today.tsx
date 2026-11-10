import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

export default function Today() {
  const [rows, setRows] = useState<any[]>([]);
  const today = format(new Date(), "yyyy-MM-dd");
  const load = async () => {
    const { data } = await supabase.from("bookings")
      .select("*, dogs(name, breed, size, notes), services(name, duration_minutes), profiles!bookings_customer_id_fkey(full_name, phone)")
      .gte("starts_at", `${today}T00:00`).lte("starts_at", `${today}T23:59`).order("starts_at");
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const markDone = async (id: string) => { await supabase.from("bookings").update({ status: "done" }).eq("id", id); load(); };
  // Staff can cancel any time (no 24h rule here).
  const cancel = async (id: string) => { await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id); load(); };

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Today's appointments</h2>
      {rows.length === 0 && <p>No appointments today.</p>}
      {rows.map((b) => (
        <div key={b.id} className="bg-white rounded-xl p-4 shadow">
          <div className="flex justify-between">
            <span className="font-semibold">{format(new Date(b.starts_at), "HH:mm")} · {b.services?.name} ({b.services?.duration_minutes} min)</span>
            <span className="text-sm">{b.status}</span>
          </div>
          <p className="text-sm">{b.dogs?.name}, {b.dogs?.breed}, {b.dogs?.size}. {b.dogs?.notes}</p>
          <p className="text-sm text-slate-500">{b.profiles?.full_name} · {b.profiles?.phone}</p>
          {b.status === "booked" && (
            <div className="flex gap-3 mt-2">
              <button onClick={() => markDone(b.id)} className="bg-brand text-white rounded px-3 py-1">Mark done</button>
              <button onClick={() => cancel(b.id)} className="text-red-600">Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
