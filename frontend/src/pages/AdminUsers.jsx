import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState("");

  const fetchUsers = () => {
    setLoading(true);
    api.get("/admin/users")
      .then(({ data }) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      setMsg(`✅ ${user.name} is now a ${newRole}`);
      fetchUsers();
    } catch {
      setMsg("❌ Failed to update role");
    } finally {
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>All Users</h1>
          <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>{users.length} registered accounts</p>
        </div>
        {msg && (
          <div style={{ background: msg.startsWith("✅") ? "rgba(39,201,63,.12)" : "rgba(255,60,60,.12)", border:`1px solid ${msg.startsWith("✅") ? "rgba(39,201,63,.3)" : "rgba(255,60,60,.3)"}`, borderRadius:8, padding:".6rem 1.1rem", fontSize:".85rem", color: msg.startsWith("✅") ? "#27c93f" : "#ff6b6b" }}>
            {msg}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(0,0,0,.25)" }}>
                {["Name","Email","Phone","Business","Role","Joined","Action"].map(h => (
                  <th key={h} style={{ padding:".7rem 1.1rem", textAlign:"left", fontSize:".67rem", color:"#6a8cb0", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:"2.5rem", textAlign:"center", color:"#6a8cb0" }}>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:"2.5rem", textAlign:"center", color:"#6a8cb0" }}>No users found.</td></tr>
              ) : users.map((u, i) => (
                <tr key={u._id} style={{ borderTop:"1px solid rgba(255,255,255,.03)", background: i%2 ? "rgba(255,255,255,.01)" : "transparent" }}>
                  <td style={{ padding:".85rem 1.1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:".65rem" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1a6bff,#00cfff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:".82rem", color:"#fff", flexShrink:0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize:".88rem", color:"#fff", fontWeight:600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:".85rem 1.1rem", fontSize:".8rem", color:"#6a8cb0" }}>{u.email}</td>
                  <td style={{ padding:".85rem 1.1rem", fontSize:".8rem", color:"#6a8cb0" }}>{u.phone}</td>
                  <td style={{ padding:".85rem 1.1rem", fontSize:".78rem", color:"#9ab8d8" }}>{u.businessName || "—"}</td>
                  <td style={{ padding:".85rem 1.1rem" }}>
                    <span style={{
                      background: u.role==="admin" ? "rgba(255,102,0,.15)" : "rgba(26,107,255,.12)",
                      border: `1px solid ${u.role==="admin" ? "rgba(255,102,0,.3)" : "rgba(26,107,255,.25)"}`,
                      color: u.role==="admin" ? "#ff6600" : "#00cfff",
                      padding:".18rem .65rem", borderRadius:20, fontSize:".72rem", fontWeight:700,
                    }}>
                      {u.role==="admin" ? "🛡 Admin" : "👤 Customer"}
                    </span>
                  </td>
                  <td style={{ padding:".85rem 1.1rem", fontSize:".75rem", color:"#3a5070", whiteSpace:"nowrap" }}>{fmtDate(u.createdAt)}</td>
                  <td style={{ padding:".85rem 1.1rem" }}>
                    <button onClick={() => toggleRole(u)}
                      style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#6a8cb0", padding:".3rem .75rem", borderRadius:5, cursor:"pointer", fontFamily:"'Syne'", fontSize:".72rem", fontWeight:600, whiteSpace:"nowrap" }}>
                      Make {u.role==="admin" ? "Customer" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
