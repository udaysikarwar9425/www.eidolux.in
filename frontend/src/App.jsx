import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Landing page
import LandingPage from "./pages/LandingPage";

// Auth pages
import Login  from "./pages/Login";
import Signup from "./pages/Signup";

// Customer dashboard
import DashboardLayout   from "./pages/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import MyBookings        from "./pages/MyBookings";
import BookingHistory    from "./pages/BookingHistory";
import Profile           from "./pages/Profile";

// Admin panel
import AdminLayout        from "./pages/AdminLayout";
import AdminOverview      from "./pages/AdminOverview";
import AdminBookings      from "./pages/AdminBookings";
import AdminCreateBooking from "./pages/AdminCreateBooking";
import AdminUsers         from "./pages/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Customer Dashboard ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout /></ProtectedRoute>
          }>
            <Route index           element={<DashboardOverview />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="history"  element={<BookingHistory />} />
            <Route path="profile"  element={<Profile />} />
          </Route>

          {/* ── Admin Panel ── */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
          }>
            <Route index                 element={<AdminOverview />} />
            <Route path="bookings"       element={<AdminBookings />} />
            <Route path="create-booking" element={<AdminCreateBooking />} />
            <Route path="users"          element={<AdminUsers />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
