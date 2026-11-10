import { useEffect, useState } from "react";
import { format, differenceInHours } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function MyBookings() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from("bookings").select("*, dogs(name), services(name, price)").eq("customer_id", profile!.id).order("starts_at");
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  // Customers can cancel up to 24 hours before.
  const cancel = async (b: any) => {
    if (differenceInHours(new Date(b.starts_at), new Date()) < 24) return toast.error("Too late to cancel online, please call the salon.");
    await supabase.from("bookings").update({ status: "cancelled" }).eq("id", b.id);
    load();
  };

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">My bookings</h2>
      {rows.map((b) => (
        <div key={b.id} className="bg-white rounded-xl p-4 shadow flex justify-between">
          <span>{format(new Date(b.starts_at), "EEE d MMM, HH:mm")} · {b.dogs?.name} · {b.services?.name}</span>
          {b.status === "booked" ? <button onClick={() => cancel(b)} className="text-red-600">Cancel</button> : <span className="text-slate-400">{b.status}</span>}
        </div>
      ))}
    </div>
  );
}
