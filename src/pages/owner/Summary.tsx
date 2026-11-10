import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { supabase } from "@/lib/supabase";

export default function Summary() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    const from = startOfWeek(new Date()).toISOString();
    const to = endOfWeek(new Date()).toISOString();
    supabase.from("bookings").select("*, services(name, price)").gte("starts_at", from).lte("starts_at", to).then(({ data }) => setRows(data ?? []));
  }, []);

  const done = rows.filter((r) => r.status === "done");
  // Revenue uses the service's current price.
  const revenue = done.reduce((sum, r) => sum + (r.services?.price ?? 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">This week ({format(startOfWeek(new Date()), "d MMM")} onwards)</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow"><p className="text-sm">Bookings</p><p className="text-3xl font-bold">{rows.length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow"><p className="text-sm">Completed</p><p className="text-3xl font-bold">{done.length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow"><p className="text-sm">Revenue</p><p className="text-3xl font-bold">${revenue}</p></div>
      </div>
    </div>
  );
}
