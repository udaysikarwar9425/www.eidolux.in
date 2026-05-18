import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const PACKAGES = ["Daily Slot", "Weekend Package", "Weekly Branding", "Custom"];
const STATUSES = ["Pending", "Confirmed", "Active", "Completed", "Cancelled"];

export default function AdminCreateBooking() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    userId:       "",
    clientName:   "",
    businessName: "",
    location:     "Jayendraganj Nadi Gate, Gwalior, MP",
    startDate:    "",
    endDate:      "",
    packageType:  "Daily Slot",
    adDescription:"",
    status:       "Pending",
    amount:       "",
    notes:        "",
  });

  useEffect(() => {
    api.get("/admin/users")
      .then(({ data }) => setUsers(data.users.filter(u => u.role === "customer")))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Auto-fill client name when user is selected
    if (name === "userId") {
      const selected = users.find(u => u._id === value);
      if (selected) {
        setForm(prev => ({
          ...prev,
          userId:       value,
          clientName:   selected.name,
          businessName: selected.businessName || "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.userId || !form.startDate || !form.endDate) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bookings/admin/create", {
        ...form,
        amount: form.amount ? Number(form.amount) : 0,
      });
      setSuccess("✅ Booking created successfully!");
      setTimeout(() => navigate("/admin/bookings"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: ".72rem", color: "#6a8cb0", fontWeight: 600,
    letterSpacing: ".08em", textTransform: "uppercase",
    display: "block", marginBottom: ".35rem",
  };

  const selectStyle = {
    background: "rgba(10,20,40,.8)",
    border: "1px solid rgba(0,207,255,.2)",
    color: "#e2eaf8",
    padding: ".72rem .9rem",
    borderRadius: 8,
    width: "100%",
    fontFamily: "'Syne'",
    fontSize: ".92rem",
    outline: "none",
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.6rem", color:"#fff", marginBottom:".3rem" }}>
          Add New Booking
        </h1>
        <p style={{ color:"#6a8cb0", fontSize:".88rem" }}>Create a billboard campaign booking for a customer</p>
      </div>

      <div className="glass-card" style={{ padding: "2rem", maxWidth: 780 }}>
        {error && (
          <div style={{ background:"rgba(255,60,60,.1)", border:"1px solid rgba(255,60,60,.3)", borderRadius:8, padding:".75rem 1rem", marginBottom:"1.5rem", color:"#ff6b6b", fontSize:".85rem" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background:"rgba(39,201,63,.1)", border:"1px solid rgba(39,201,63,.3)", borderRadius:8, padding:".75rem 1rem", marginBottom:"1.5rem", color:"#27c93f", fontSize:".85rem" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem" }}>

            {/* Select Customer */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Select Customer *</label>
              <select name="userId" value={form.userId} onChange={handleChange} required style={selectStyle}>
                <option value="">— Choose a customer —</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} — {u.email} {u.businessName ? `(${u.businessName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Name */}
            <div>
              <label style={labelStyle}>Client Name *</label>
              <input className="input-field" name="clientName" value={form.clientName}
                onChange={handleChange} placeholder="Rajesh Sharma" required />
            </div>

            {/* Business Name */}
            <div>
              <label style={labelStyle}>Business Name</label>
              <input className="input-field" name="businessName" value={form.businessName}
                onChange={handleChange} placeholder="Sharma Coaching Centre" />
            </div>

            {/* Package */}
            <div>
              <label style={labelStyle}>Package Type *</label>
              <select name="packageType" value={form.packageType} onChange={handleChange} style={selectStyle}>
                {PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Initial Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={selectStyle}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label style={labelStyle}>Start Date *</label>
              <input className="input-field" type="date" name="startDate"
                value={form.startDate} onChange={handleChange} required />
            </div>

            {/* End Date */}
            <div>
              <label style={labelStyle}>End Date *</label>
              <input className="input-field" type="date" name="endDate"
                value={form.endDate} onChange={handleChange} required />
            </div>

            {/* Amount */}
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input className="input-field" type="number" name="amount"
                value={form.amount} onChange={handleChange} placeholder="e.g. 1999" min="0" />
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Billboard Location</label>
              <input className="input-field" name="location" value={form.location}
                onChange={handleChange} placeholder="Jayendraganj Nadi Gate, Gwalior, MP" />
            </div>

            {/* Ad Description */}
            <div style={{ gridColumn:"1 / -1" }}>
              <label style={labelStyle}>Ad Description</label>
              <textarea className="input-field" name="adDescription" rows={3}
                value={form.adDescription} onChange={handleChange}
                placeholder="Brief description of the advertisement..." style={{ resize:"vertical" }} />
            </div>

            {/* Admin Notes */}
            <div style={{ gridColumn:"1 / -1" }}>
              <label style={labelStyle}>Admin Notes</label>
              <textarea className="input-field" name="notes" rows={2}
                value={form.notes} onChange={handleChange}
                placeholder="Internal notes (not visible to customer)..." style={{ resize:"vertical" }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:"1rem", marginTop:"2rem" }}>
            <button type="submit" disabled={loading}
              style={{ background:"linear-gradient(135deg,#1a6bff,#00cfff)", border:"none", color:"#fff", padding:".8rem 2rem", borderRadius:8, cursor:"pointer", fontFamily:"'Syne'", fontWeight:700, fontSize:".95rem", flex:1, maxWidth:220, opacity: loading ? .7 : 1 }}>
              {loading ? "Creating..." : "Create Booking →"}
            </button>
            <button type="button" onClick={() => navigate("/admin/bookings")}
              style={{ background:"transparent", border:"1px solid rgba(255,255,255,.15)", color:"#6a8cb0", padding:".8rem 1.5rem", borderRadius:8, cursor:"pointer", fontFamily:"'Syne'", fontWeight:600, fontSize:".9rem" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
