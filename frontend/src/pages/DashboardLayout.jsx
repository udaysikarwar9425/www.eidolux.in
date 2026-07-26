import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#04080f" }}>
      <Sidebar isAdmin={false} />
      <main style={{ flex:1, overflowY:"auto", padding:"2rem" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(0,207,255,.08)" }}>
          <div>
            <span style={{ fontSize:".72rem", color:"#6a8cb0", letterSpacing:".1em", textTransform:"uppercase" }}>Customer Portal</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
            <div style={{ background:"rgba(39,201,63,.1)", border:"1px solid rgba(39,201,63,.2)", borderRadius:6, padding:".3rem .8rem", fontSize:".7rem", color:"#27c93f", fontWeight:600 }}>
              <span className="pulse-dot" style={{ width:6,height:6,borderRadius:"50%",background:"#27c93f",display:"inline-block",marginRight:5 }}/>Billboard Live
            </div>
            <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1a6bff,#00cfff)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:".9rem",color:"#fff" }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
