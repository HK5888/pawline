import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { booking_id, email } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: b } = await supabase.from("bookings").select("starts_at, dogs(name), services(name)").eq("id", booking_id).single();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Pawline <bookings@pawline.example>",
      to: email,
      subject: "Your Pawline booking is confirmed",
      html: `<p>See you soon! ${b?.dogs?.name} is booked for ${b?.services?.name} on ${new Date(b!.starts_at).toLocaleString()}.</p>`,
    }),
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
});
