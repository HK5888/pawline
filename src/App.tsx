import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dogs from "@/pages/Dogs";
import Book from "@/pages/Book";
import MyBookings from "@/pages/MyBookings";
import Today from "@/pages/staff/Today";
import Services from "@/pages/owner/Services";
import Staff from "@/pages/owner/Staff";
import Hours from "@/pages/owner/Hours";
import Summary from "@/pages/owner/Summary";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dogs" element={<ProtectedRoute roles={["customer"]}><Dogs /></ProtectedRoute>} />
          <Route path="/book" element={<ProtectedRoute roles={["customer"]}><Book /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute roles={["customer"]}><MyBookings /></ProtectedRoute>} />
          <Route path="/staff/today" element={<ProtectedRoute roles={["staff", "owner"]}><Today /></ProtectedRoute>} />
          <Route path="/owner/services" element={<ProtectedRoute roles={["owner"]}><Services /></ProtectedRoute>} />
          <Route path="/owner/staff" element={<ProtectedRoute roles={["owner"]}><Staff /></ProtectedRoute>} />
          <Route path="/owner/hours" element={<ProtectedRoute roles={["owner"]}><Hours /></ProtectedRoute>} />
          <Route path="/owner/summary" element={<ProtectedRoute roles={["owner"]}><Summary /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}
