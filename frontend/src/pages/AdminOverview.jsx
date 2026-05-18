import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import api from "../utils/api";

export default function AdminOverview() {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/bookings/admin/all"),
    ]).then(([s, b]) => {
      setStats(s.data.stats);
      setBookings(b.data.bookings.slice(0, 8));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  const statCards = stats ? [
    { icon:"👥", label:"Total Customers",  value: stats.totalUsers,     color:"#1a6bff" },
    { icon:"📋", label:"Total Bookings",   value: stats.totalBookings,  color:"#00cfff" },
    { icon:"🟢", label:"Active Campaigns", value: stats.activeBookings, color:"#27c93f" },
    { icon:"⏳", label:"Pending",          value: stats.pendingBookings,color:"#ffc840" },
    { icon:"💰", label:"Total Revenue",    value:`₹${(stats.totalRevenue||0).toLocaleString()}`, color:"#ff6600" },
  ] : [];

  return (
    <div className="fade-in">
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.7rem", color:"#fff", marginBottom:".3rem" }}>Admin Dashboard</h1>
        <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>Eidolux Publicity — Jayendraganj Nadi Gate, Gwalior</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {loading ? Array(5).fill(0).map((_,i)=>(
          <div key={i} className="glass-card" style={{ padding:"1.5rem", height:110 }} />
        )) : statCards.map(s=>(
          <div key={s.label} className="glass-card" style={{ padding:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".75rem" }}>
              <span style={{ fontSize:"1.3rem" }}>{s.icon}</span>
              <span style={{ fontSize:".6rem", color:s.color, background:`${s.color}18`, padding:".15rem .5rem", borderRadius:10, fontWeight:700 }}>LIVE</span>
            </div>
            <div style={{ fontFamily:"'Syne'", fontSize:"1.7rem", fontWeight:800, color:"#fff", lineHeight:1, marginBottom:".25rem" }}>{s.value}</div>
            <div style={{ fontSize:".75rem", color:"#6a8cb0" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings table */}
      <div className="glass-card" style={{ overflow:"hidden" }}>
        <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1rem", color:"#fff" }}>Recent Bookings</h2>
          <div style={{ display:"flex", gap:".75rem" }}>
            <Link to="/admin/create-booking" style={{ textDecoration:"none" }}>
              <button style={{ background:"linear-gradient(135deg,#1a6bff,#00cfff)", border:"none", color:"#fff", padding:".4rem 1rem", borderRadius:6, cursor:"pointer", fontFamily:"'Syne'", fontWeight:700, fontSize:".78rem" }}>+ Add Booking</button>
            </Link>
            <Link to="/admin/bookings" style={{ fontSize:".78rem", color:"#00cfff", textDecoration:"none", fontWeight:600, display:"flex", alignItems:"center" }}>View all →</Link>
          </div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(0,0,0,.25)" }}>
                {["Client","Business","Package","Dates","Status","Amount"].map(h=>(
                  <th key={h} style={{ padding:".65rem 1.1rem", textAlign:"left", fontSize:".67rem", color:"#6a8cb0", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding:"2rem", textAlign:"center", color:"#6a8cb0" }}>Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:"2rem", textAlign:"center", color:"#6a8cb0" }}>No bookings yet.</td></tr>
              ) : bookings.map((b,i)=>(
                <tr key={b._id} style={{ borderTop:"1px solid rgba(255,255,255,.03)", background:i%2?"rgba(255,255,255,.01)":"transparent" }}>
                  <td style={{ padding:".8rem 1.1rem", fontSize:".85rem", color:"#fff", fontWeight:600 }}>{b.clientName}</td>
                  <td style={{ padding:".8rem 1.1rem", fontSize:".78rem", color:"#6a8cb0" }}>{b.businessName||"—"}</td>
                  <td style={{ padding:".8rem 1.1rem", fontSize:".78rem", color:"#9ab8d8" }}>{b.packageType}</td>
                  <td style={{ padding:".8rem 1.1rem", fontSize:".75rem", color:"#6a8cb0", whiteSpace:"nowrap" }}>{fmtDate(b.startDate)} → {fmtDate(b.endDate)}</td>
                  <td style={{ padding:".8rem 1.1rem" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding:".8rem 1.1rem", fontSize:".82rem", color:b.amount?"#ffc840":"#6a8cb0", fontWeight:700 }}>{b.amount?`₹${b.amount.toLocaleString()}`:"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
