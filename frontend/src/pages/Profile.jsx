import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const fields = [
    { label:"Full Name",      value: user.name },
    { label:"Email Address",  value: user.email },
    { label:"Phone Number",   value: user.phone },
    { label:"Business Name",  value: user.businessName || "—" },
    { label:"Account Type",   value: user.role === "admin" ? "Administrator" : "Customer" },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>My Profile</h1>
        <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>Your account information</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.5rem" }}>
        {/* Avatar card */}
        <div className="glass-card" style={{ padding:"2rem", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#1a6bff,#00cfff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", fontWeight:800, color:"#fff", boxShadow:"0 0 24px rgba(0,207,255,.35)" }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.15rem", color:"#fff" }}>{user.name}</div>
            {user.businessName && <div style={{ fontSize:".82rem", color:"#00cfff", marginTop:".2rem" }}>{user.businessName}</div>}
            <div style={{ marginTop:".6rem", display:"inline-block", background:"rgba(0,207,255,.1)", border:"1px solid rgba(0,207,255,.2)", borderRadius:20, padding:".2rem .8rem", fontSize:".72rem", color:"#00cfff", fontWeight:700 }}>
              {user.role === "admin" ? "🛡 Admin" : "👤 Customer"}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="glass-card" style={{ padding:"2rem" }}>
          <h3 style={{ fontFamily:"'Syne'", fontWeight:800, color:"#fff", marginBottom:"1.5rem", fontSize:"1rem" }}>Account Details</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
            {fields.map(f=>(
              <div key={f.label} style={{ borderBottom:"1px solid rgba(255,255,255,.04)", paddingBottom:"1rem" }}>
                <div style={{ fontSize:".7rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", marginBottom:".3rem" }}>{f.label}</div>
                <div style={{ color:"#e2eaf8", fontWeight:600, fontSize:".92rem" }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="glass-card" style={{ padding:"1.5rem", marginTop:"1.5rem", display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
        <span style={{ fontSize:"1.2rem" }}>💬</span>
        <div>
          <div style={{ fontWeight:700, color:"#fff", fontSize:".92rem" }}>Need help with your campaigns?</div>
          <div style={{ color:"#6a8cb0", fontSize:".82rem" }}>Contact Eidolux Publicity at <a href="tel:9171982377" style={{ color:"#00cfff", textDecoration:"none" }}>9171982377</a> or <a href="mailto:ads@eidolux.in" style={{ color:"#00cfff", textDecoration:"none" }}>ads@eidolux.in</a></div>
        </div>
      </div>
    </div>
  );
}
