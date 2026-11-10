import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { profile } = useAuth();
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold mb-3">Happy dogs, fresh cuts.</h1>
      <p className="text-slate-600 mb-8">Book a wash, trim or full groom at Pawline in under a minute.</p>
      {profile ? (
        <Link to={profile.role === "customer" ? "/book" : "/staff/today"} className="bg-brand text-white px-6 py-3 rounded-lg">Go to your dashboard</Link>
      ) : (
        <Link to="/signup" className="bg-brand text-white px-6 py-3 rounded-lg">Create an account</Link>
      )}
    </section>
  );
}
