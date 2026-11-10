import { useEffect, useState } from "react";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import { toast } from "sonner";
import { supabase, Dog, Service } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

// Slots are every 30 minutes inside opening hours.
function buildSlots(day: Date, open: string, close: string) {
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const slots: Date[] = [];
  let t = setMinutes(setHours(day, oh), om);
  const end = setMinutes(setHours(day, ch), cm);
  while (t < end) { slots.push(t); t = addMinutes(t, 30); }
  return slots;
}

export default function Book() {
  const { profile } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const [taken, setTaken] = useState<string[]>([]);
  const [hours, setHours] = useState<{ open: string; close: string } | null>(null);
  const [dogId, setDogId] = useState("");
  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    supabase.from("dogs").select("*").eq("owner_id", profile!.id).then(({ data }) => setDogs(data ?? []));
    supabase.from("services").select("*").eq("active", true).then(({ data }) => setServices(data ?? []));
  }, []);

  useEffect(() => {
    const weekday = new Date(day).getDay();
    supabase.from("opening_hours").select("*").eq("weekday", weekday).single().then(({ data }) => setHours(data));
    supabase.from("bookings").select("starts_at").gte("starts_at", `${day}T00:00`).lte("starts_at", `${day}T23:59`).neq("status", "cancelled")
      .then(({ data }) => setTaken((data ?? []).map((b) => b.starts_at)));
  }, [day]);

  const book = async (slot: Date) => {
    if (!dogId || !serviceId) return toast.error("Pick a dog and a service");
    const { data, error } = await supabase.from("bookings")
      .insert({ customer_id: profile!.id, dog_id: dogId, service_id: serviceId, starts_at: slot.toISOString(), status: "booked" })
      .select().single();
    if (error) return toast.error(error.message);
    await supabase.functions.invoke("send-confirmation", { body: { booking_id: data.id, email: profile!.email } });
    toast.success("Booked! Check your email.");
    setTaken([...taken, slot.toISOString()]);
  };

  const slots = hours ? buildSlots(new Date(day), hours.open, hours.close) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Book a groom</h2>
      <div className="flex gap-3">
        <select className="border rounded p-2" value={dogId} onChange={(e) => setDogId(e.target.value)}>
          <option value="">Choose a dog</option>{dogs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="border rounded p-2" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">Choose a service</option>{services.map((s) => <option key={s.id} value={s.id}>{s.name} · ${s.price}</option>)}
        </select>
        <input type="date" className="border rounded p-2" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>
      {!hours && <p>The salon is closed that day.</p>}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((s) => {
          const isTaken = taken.includes(s.toISOString());
          return (
            <button key={s.toISOString()} disabled={isTaken} onClick={() => book(s)}
              className={`rounded p-2 border ${isTaken ? "bg-slate-200 text-slate-400" : "bg-white hover:bg-brand-light"}`}>
              {format(s, "HH:mm")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
