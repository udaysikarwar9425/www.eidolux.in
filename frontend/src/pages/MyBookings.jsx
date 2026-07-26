import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../utils/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All");

  useEffect(() => {
    api.get("/bookings/my")
      .then(({ data }) => setBookings(data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["All","Active","Confirmed","Pending","Completed","Cancelled"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);
  const fmtDate  = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  return (
    <div className="fade-in">
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>My Bookings</h1>
        <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>All your billboard campaign bookings</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:".38rem .9rem", borderRadius:20, border:"1px solid",
            borderColor: filter===s ? "#00cfff" : "rgba(0,207,255,.15)",
            background:  filter===s ? "rgba(0,207,255,.12)" : "transparent",
            color:       filter===s ? "#00cfff" : "#6a8cb0",
            fontSize:".78rem", fontWeight:600, cursor:"pointer",
            fontFamily:"'Syne'", transition:"all .2s",
          }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding:"3rem", textAlign:"center", color:"#6a8cb0" }}>Loading your bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding:"3rem", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>📭</div>
          <p style={{ color:"#fff", fontWeight:700, marginBottom:".4rem" }}>No bookings found</p>
          <p style={{ color:"#6a8cb0", fontSize:".85rem" }}>Contact Eidolux at 9171982377 to get started.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {filtered.map(b => (
            <div key={b._id} className="glass-card" style={{ padding:"1.5rem", display:"grid", gridTemplateColumns:"1fr auto", gap:"1rem", alignItems:"start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".6rem", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.05rem", color:"#fff" }}>{b.packageType}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:".5rem" }}>
                  {[
                    ["📍","Location", b.location],
                    ["📅","Start Date", fmtDate(b.startDate)],
                    ["📅","End Date",   fmtDate(b.endDate)],
                    b.adDescription && ["📝","Ad Description", b.adDescription],
                    b.amount && ["💰","Amount", `₹${b.amount.toLocaleString()}`],
                  ].filter(Boolean).map(([icon,label,val])=>(
                    <div key={label}>
                      <div style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:2 }}>{icon} {label}</div>
                      <div style={{ fontSize:".85rem", color:"#e2eaf8" }}>{val}</div>
                    </div>
                  ))}
                </div>
                {b.notes && (
                  <div style={{ marginTop:".75rem", background:"rgba(0,207,255,.05)", border:"1px solid rgba(0,207,255,.12)", borderRadius:6, padding:".5rem .75rem", fontSize:".8rem", color:"#9ab8d8" }}>
                    📌 {b.notes}
                  </div>
                )}
              </div>
              <div style={{ fontSize:".68rem", color:"#3a5070", textAlign:"right", whiteSpace:"nowrap" }}>
                {new Date(b.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
