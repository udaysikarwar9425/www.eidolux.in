import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../utils/api";

const STATUSES = ["Pending","Confirmed","Active","Completed","Cancelled"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null); // booking being edited
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");

  const fetchBookings = () => {
    setLoading(true);
    api.get("/bookings/admin/all")
      .then(({ data }) => setBookings(data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const startEdit = (b) => {
    setEditing(b._id);
    setEditForm({
      status:      b.status,
      amount:      b.amount,
      notes:       b.notes || "",
      startDate:   b.startDate?.slice(0,10) || "",
      endDate:     b.endDate?.slice(0,10)   || "",
      packageType: b.packageType,
    });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/bookings/admin/${editing}`, editForm);
      setMsg("✅ Booking updated!");
      setEditing(null);
      fetchBookings();
    } catch (e) {
      setMsg("❌ " + (e.response?.data?.message || "Update failed"));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/admin/${id}`);
      setMsg("✅ Booking deleted");
      fetchBookings();
    } catch (e) {
      setMsg("❌ Delete failed");
    } finally {
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>All Bookings</h1>
          <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>Manage and update all customer campaigns</p>
        </div>
        {msg && (
          <div style={{ background: msg.startsWith("✅") ? "rgba(39,201,63,.12)" : "rgba(255,60,60,.12)", border: `1px solid ${msg.startsWith("✅") ? "rgba(39,201,63,.3)" : "rgba(255,60,60,.3)"}`, borderRadius:8, padding:".6rem 1.1rem", fontSize:".85rem", color: msg.startsWith("✅") ? "#27c93f" : "#ff6b6b" }}>
            {msg}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(0,0,0,.25)" }}>
                {["Client","Package","Location","Dates","Status","Amount","Actions"].map(h=>(
                  <th key={h} style={{ padding:".7rem 1rem", textAlign:"left", fontSize:".67rem", color:"#6a8cb0", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:"2.5rem", textAlign:"center", color:"#6a8cb0" }}>Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:"2.5rem", textAlign:"center", color:"#6a8cb0" }}>No bookings found.</td></tr>
              ) : bookings.map((b,i)=>(
                <React.Fragment key={b._id}>
                  <tr style={{ borderTop:"1px solid rgba(255,255,255,.03)", background:i%2?"rgba(255,255,255,.01)":"transparent" }}>
                    <td style={{ padding:".8rem 1rem" }}>
                      <div style={{ fontSize:".88rem", color:"#fff", fontWeight:700 }}>{b.clientName}</div>
                      <div style={{ fontSize:".72rem", color:"#6a8cb0" }}>{b.user?.email}</div>
                    </td>
                    <td style={{ padding:".8rem 1rem", fontSize:".8rem", color:"#9ab8d8" }}>{b.packageType}</td>
                    <td style={{ padding:".8rem 1rem", fontSize:".75rem", color:"#6a8cb0", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.location}</td>
                    <td style={{ padding:".8rem 1rem", fontSize:".75rem", color:"#6a8cb0", whiteSpace:"nowrap" }}>{fmtDate(b.startDate)} →<br/>{fmtDate(b.endDate)}</td>
                    <td style={{ padding:".8rem 1rem" }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding:".8rem 1rem", fontSize:".82rem", color:b.amount?"#ffc840":"#6a8cb0", fontWeight:700 }}>{b.amount?`₹${b.amount.toLocaleString()}`:"—"}</td>
                    <td style={{ padding:".8rem 1rem" }}>
                      <div style={{ display:"flex", gap:".4rem" }}>
                        <button onClick={()=>startEdit(b)} style={{ background:"rgba(26,107,255,.15)", border:"1px solid rgba(26,107,255,.3)", color:"#00cfff", padding:".28rem .7rem", borderRadius:5, cursor:"pointer", fontFamily:"'Syne'", fontSize:".72rem", fontWeight:700 }}>Edit</button>
                        <button onClick={()=>deleteBooking(b._id)} style={{ background:"rgba(255,60,60,.1)", border:"1px solid rgba(255,60,60,.25)", color:"#ff6b6b", padding:".28rem .7rem", borderRadius:5, cursor:"pointer", fontFamily:"'Syne'", fontSize:".72rem", fontWeight:700 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                  {/* Inline edit row */}
                  {editing === b._id && (
                    <tr style={{ borderTop:"none" }}>
                      <td colSpan={7} style={{ padding:"0 1rem 1rem" }}>
                        <div style={{ background:"rgba(26,107,255,.06)", border:"1px solid rgba(26,107,255,.2)", borderRadius:10, padding:"1.25rem", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:".85rem" }}>
                          <div>
                            <label style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:".3rem" }}>Status</label>
                            <select value={editForm.status} onChange={e=>setEditForm({...editForm,status:e.target.value})}
                              style={{ background:"rgba(10,20,40,.8)", border:"1px solid rgba(0,207,255,.2)", color:"#e2eaf8", padding:".55rem .7rem", borderRadius:6, width:"100%", fontFamily:"'Syne'", fontSize:".85rem" }}>
                              {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:".3rem" }}>Amount (₹)</label>
                            <input className="input-field" type="number" value={editForm.amount} onChange={e=>setEditForm({...editForm,amount:e.target.value})} style={{ padding:".55rem .7rem", fontSize:".85rem" }} />
                          </div>
                          <div>
                            <label style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:".3rem" }}>Start Date</label>
                            <input className="input-field" type="date" value={editForm.startDate} onChange={e=>setEditForm({...editForm,startDate:e.target.value})} style={{ padding:".55rem .7rem", fontSize:".85rem" }} />
                          </div>
                          <div>
                            <label style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:".3rem" }}>End Date</label>
                            <input className="input-field" type="date" value={editForm.endDate} onChange={e=>setEditForm({...editForm,endDate:e.target.value})} style={{ padding:".55rem .7rem", fontSize:".85rem" }} />
                          </div>
                          <div style={{ gridColumn:"1/-1" }}>
                            <label style={{ fontSize:".68rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:".3rem" }}>Notes</label>
                            <input className="input-field" type="text" value={editForm.notes} onChange={e=>setEditForm({...editForm,notes:e.target.value})} placeholder="Admin notes..." style={{ padding:".55rem .7rem", fontSize:".85rem" }} />
                          </div>
                          <div style={{ gridColumn:"1/-1", display:"flex", gap:".75rem" }}>
                            <button onClick={saveEdit} disabled={saving} style={{ background:"linear-gradient(135deg,#1a6bff,#00cfff)", border:"none", color:"#fff", padding:".55rem 1.25rem", borderRadius:6, cursor:"pointer", fontFamily:"'Syne'", fontWeight:700, fontSize:".85rem" }}>
                              {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button onClick={()=>setEditing(null)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.15)", color:"#6a8cb0", padding:".55rem 1.25rem", borderRadius:6, cursor:"pointer", fontFamily:"'Syne'", fontWeight:600, fontSize:".85rem" }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
