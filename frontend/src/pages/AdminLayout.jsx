import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#04080f" }}>
      <Sidebar isAdmin={true} />
      <main style={{ flex:1, overflowY:"auto", padding:"2rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(255,60,0,.12)" }}>
          <div>
            <span style={{ fontSize:".72rem", color:"#ff6600", letterSpacing:".1em", textTransform:"uppercase", fontWeight:700 }}>🛡 Admin Panel</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
            <span style={{ fontSize:".78rem", color:"#6a8cb0" }}>Signed in as</span>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#ff6600,#ff3c00)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:".9rem", color:"#fff" }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
