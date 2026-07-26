import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../utils/api";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/bookings/my")
      .then(({ data }) => setBookings(data.bookings.filter(b => ["Completed","Cancelled"].includes(b.status))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  return (
    <div className="fade-in">
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>Booking History</h1>
        <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>Completed and cancelled campaigns</p>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding:"3rem", textAlign:"center", color:"#6a8cb0" }}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="glass-card" style={{ padding:"3rem", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>📂</div>
          <p style={{ color:"#fff", fontWeight:700, marginBottom:".4rem" }}>No history yet</p>
          <p style={{ color:"#6a8cb0", fontSize:".85rem" }}>Completed campaigns will appear here.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"rgba(0,0,0,.25)" }}>
                  {["Package","Location","Duration","Status","Amount","Date"].map(h=>(
                    <th key={h} style={{ padding:".75rem 1.1rem", textAlign:"left", fontSize:".68rem", color:"#6a8cb0", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b,i)=>(
                  <tr key={b._id} style={{ borderTop:"1px solid rgba(255,255,255,.04)", background:i%2?"rgba(255,255,255,.01)":"transparent" }}>
                    <td style={{ padding:".85rem 1.1rem", fontSize:".88rem", color:"#fff", fontWeight:600 }}>{b.packageType}</td>
                    <td style={{ padding:".85rem 1.1rem", fontSize:".78rem", color:"#6a8cb0", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.location}</td>
                    <td style={{ padding:".85rem 1.1rem", fontSize:".78rem", color:"#9ab8d8", whiteSpace:"nowrap" }}>{fmtDate(b.startDate)} → {fmtDate(b.endDate)}</td>
                    <td style={{ padding:".85rem 1.1rem" }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding:".85rem 1.1rem", fontSize:".82rem", color:b.amount?"#ffc840":"#6a8cb0", fontWeight:700 }}>{b.amount ? `₹${b.amount.toLocaleString()}` : "—"}</td>
                    <td style={{ padding:".85rem 1.1rem", fontSize:".75rem", color:"#3a5070", whiteSpace:"nowrap" }}>{new Date(b.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
