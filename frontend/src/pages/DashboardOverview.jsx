import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import api from "../utils/api";

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card" style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:".75rem" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ fontSize:"1.4rem" }}>{icon}</span>
      <span style={{ fontSize:".65rem", color, background:`${color}18`, padding:".18rem .6rem", borderRadius:10, fontWeight:700 }}>NOW</span>
    </div>
    <div style={{ fontFamily:"'Syne'", fontSize:"1.9rem", fontWeight:800, color:"#fff", lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:".78rem", color:"#6a8cb0" }}>{label}</div>
  </div>
);

export default function DashboardOverview() {
  const { user } = useAuth();
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get("/bookings/my")
      .then(({ data }) => setBookings(data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active    = bookings.filter(b => ["Active","Confirmed"].includes(b.status));
  const pending   = bookings.filter(b => b.status === "Pending");
  const completed = bookings.filter(b => b.status === "Completed");

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.7rem", color:"#fff", marginBottom:".3rem" }}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color:"#6a8cb0", fontSize:".9rem" }}>
          {user?.businessName ? `Managing campaigns for ${user.businessName}` : "Manage your Eidolux billboard campaigns"}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        <StatCard icon="📋" label="Total Bookings"   value={loading ? "—" : bookings.length}   color="#1a6bff" />
        <StatCard icon="🟢" label="Active Campaigns" value={loading ? "—" : active.length}     color="#27c93f" />
        <StatCard icon="⏳" label="Pending Approval" value={loading ? "—" : pending.length}    color="#ffc840" />
        <StatCard icon="✅" label="Completed"         value={loading ? "—" : completed.length}  color="#6a8cb0" />
      </div>

      {/* Active Bookings */}
      <div className="glass-card" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <h2 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1rem", color:"#fff" }}>🟢 Active Campaigns</h2>
          <Link to="/dashboard/bookings" style={{ fontSize:".78rem", color:"#00cfff", textDecoration:"none", fontWeight:600 }}>View all →</Link>
        </div>
        {loading ? (
          <div style={{ textAlign:"center", padding:"2rem", color:"#6a8cb0" }}>Loading...</div>
        ) : active.length === 0 ? (
          <div style={{ textAlign:"center", padding:"2rem" }}>
            <div style={{ fontSize:"2rem", marginBottom:".75rem" }}>📭</div>
            <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>No active campaigns right now.</p>
            <p style={{ color:"#6a8cb0", fontSize:".8rem", marginTop:".35rem" }}>Contact us at <a href="tel:9171982377" style={{ color:"#00cfff" }}>9171982377</a> to book a slot.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {active.map(b => (
              <div key={b._id} style={{ background:"rgba(26,107,255,.06)", border:"1px solid rgba(26,107,255,.15)", borderRadius:10, padding:"1.1rem 1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".75rem" }}>
                <div>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:".95rem", marginBottom:".3rem" }}>{b.packageType}</div>
                  <div style={{ fontSize:".78rem", color:"#6a8cb0" }}>📍 {b.location}</div>
                  <div style={{ fontSize:".78rem", color:"#6a8cb0", marginTop:".2rem" }}>
                    📅 {fmtDate(b.startDate)} — {fmtDate(b.endDate)}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".4rem" }}>
                  <StatusBadge status={b.status} />
                  {b.amount > 0 && <span style={{ fontSize:".78rem", color:"#ffc840", fontWeight:700 }}>₹{b.amount.toLocaleString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent history */}
      <div className="glass-card" style={{ padding:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <h2 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1rem", color:"#fff" }}>🕘 Recent Bookings</h2>
          <Link to="/dashboard/history" style={{ fontSize:".78rem", color:"#00cfff", textDecoration:"none", fontWeight:600 }}>Full history →</Link>
        </div>
        {loading ? (
          <div style={{ textAlign:"center", padding:"1rem", color:"#6a8cb0" }}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:"center", padding:"1.5rem", color:"#6a8cb0", fontSize:".88rem" }}>No bookings yet.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                  {["Package","Location","Start","End","Status"].map(h=>(
                    <th key={h} style={{ padding:".6rem .9rem", textAlign:"left", fontSize:".68rem", color:"#6a8cb0", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0,5).map((b,i)=>(
                  <tr key={b._id} style={{ borderBottom:"1px solid rgba(255,255,255,.03)", background:i%2?"rgba(255,255,255,.01)":"transparent" }}>
                    <td style={{ padding:".75rem .9rem", fontSize:".85rem", color:"#fff", fontWeight:600 }}>{b.packageType}</td>
                    <td style={{ padding:".75rem .9rem", fontSize:".78rem", color:"#6a8cb0", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.location}</td>
                    <td style={{ padding:".75rem .9rem", fontSize:".78rem", color:"#9ab8d8" }}>{fmtDate(b.startDate)}</td>
                    <td style={{ padding:".75rem .9rem", fontSize:".78rem", color:"#9ab8d8" }}>{fmtDate(b.endDate)}</td>
                    <td style={{ padding:".75rem .9rem" }}><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
