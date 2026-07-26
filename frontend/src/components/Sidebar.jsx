import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CustomerLinks = [
  { to:"/dashboard",          icon:"📊", label:"Overview"    },
  { to:"/dashboard/bookings", icon:"📅", label:"My Bookings" },
  { to:"/dashboard/history",  icon:"🕘", label:"History"     },
  { to:"/dashboard/profile",  icon:"👤", label:"Profile"     },
];
const AdminLinks = [
  { to:"/admin",                 icon:"📊", label:"Dashboard"    },
  { to:"/admin/bookings",        icon:"📋", label:"All Bookings" },
  { to:"/admin/create-booking",  icon:"➕", label:"Add Booking"  },
  { to:"/admin/users",           icon:"👥", label:"Users"        },
];

export default function Sidebar({ isAdmin }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const links = isAdmin ? AdminLinks : CustomerLinks;

  return (
    <aside style={{ width: collapsed ? 64 : 220, background:"#020609", borderRight:"1px solid rgba(0,207,255,.08)", display:"flex", flexDirection:"column", flexShrink:0, transition:"width .3s", position:"relative", zIndex:10 }}>
      {/* Logo */}
      <div style={{ padding:"1.25rem", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        {collapsed
          ? <div style={{ textAlign:"center", fontSize:"1.3rem" }}>👁</div>
          : <div>
              <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1rem", letterSpacing:".12em", color:"#fff" }}>EIDOLUX</div>
              <div style={{ fontSize:".58rem", letterSpacing:".22em", color:"#00cfff", marginTop:2 }}>
                {isAdmin ? "ADMIN PANEL" : "MY ACCOUNT"}
              </div>
            </div>
        }
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:".75rem .5rem", display:"flex", flexDirection:"column", gap:".2rem" }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to==="/dashboard"||link.to==="/admin"}
            style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:".75rem",
              padding:".6rem .85rem", borderRadius:8, textDecoration:"none",
              fontWeight:600, fontSize:".85rem", letterSpacing:".03em", transition:"all .2s",
              color: isActive ? "#fff" : "#6a8cb0",
              background: isActive ? "rgba(26,107,255,.15)" : "transparent",
              borderLeft: isActive ? "2px solid #00cfff" : "2px solid transparent",
            })}>
            <span style={{ fontSize:"1.1rem", minWidth:20, textAlign:"center" }}>{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
        {/* Back to site link */}
        <NavLink to="/" style={{ display:"flex", alignItems:"center", gap:".75rem", padding:".6rem .85rem", borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:".85rem", color:"#3a5070", marginTop:"auto" }}>
          <span style={{ fontSize:"1.1rem", minWidth:20, textAlign:"center" }}>🌐</span>
          {!collapsed && <span>Back to Site</span>}
        </NavLink>
      </nav>

      {/* User + Logout */}
      <div style={{ padding:".75rem", borderTop:"1px solid rgba(255,255,255,.04)" }}>
        {!collapsed && user && (
          <div style={{ padding:".6rem .85rem", marginBottom:".5rem" }}>
            <div style={{ fontSize:".82rem", fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:".68rem", color:"#6a8cb0", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
          </div>
        )}
        <button onClick={() => { logout(); navigate("/"); }}
          style={{ width:"100%", background:"rgba(255,60,60,.08)", border:"1px solid rgba(255,60,60,.2)", color:"#ff6b6b", padding:".55rem", borderRadius:7, cursor:"pointer", fontFamily:"'Syne'", fontWeight:600, fontSize:".82rem", display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,60,60,.18)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,60,60,.08)"}>
          <span>🚪</span>{!collapsed && "Logout"}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        style={{ position:"absolute", top:"1.1rem", right:-12, width:24, height:24, borderRadius:"50%", background:"#0a1428", border:"1px solid rgba(0,207,255,.25)", color:"#00cfff", fontSize:".7rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:20 }}>
        {collapsed ? "→" : "←"}
      </button>
    </aside>
  );
}
