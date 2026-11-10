import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export type Role = "customer" | "staff" | "owner";
export type Profile = { id: string; full_name: string; email: string; role: Role; phone?: string };
export type Dog = { id: string; owner_id: string; name: string; breed: string; size: "small" | "medium" | "large"; notes?: string };
export type Service = { id: string; name: string; price: number; duration_minutes: number; active: boolean };
export type Booking = { id: string; customer_id: string; dog_id: string; service_id: string; groomer_id?: string; starts_at: string; status: "booked" | "done" | "cancelled" };
