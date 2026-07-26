import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]     = useState({ name:"", email:"", phone:"", businessName:"", password:"", confirm:"" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup({ name:form.name, email:form.email, phone:form.phone, businessName:form.businessName, password:form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');`}</style>
      <div style={{ position:"fixed",bottom:"20%",right:"25%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,207,255,.08) 0%,transparent 70%)",pointerEvents:"none" }}/>

      <div className="fade-in" style={{ width:"100%", maxWidth:460 }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.8rem", letterSpacing:".12em", color:"#fff" }}>EIDOLUX</div>
          <div style={{ fontSize:".72rem", letterSpacing:".22em", color:"#00cfff", marginTop:4 }}>PUBLICITY</div>
        </div>

        <div className="glass-card" style={{ padding:"2.5rem 2rem" }}>
          <h2 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.4rem", color:"#fff", marginBottom:".4rem" }}>Create account</h2>
          <p style={{ color:"#6a8cb0", fontSize:".88rem", marginBottom:"2rem" }}>Start advertising with Eidolux today</p>

          {error && (
            <div style={{ background:"rgba(255,60,60,.1)", border:"1px solid rgba(255,60,60,.3)", borderRadius:8, padding:".75rem 1rem", marginBottom:"1.5rem", color:"#ff6b6b", fontSize:".85rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:".9rem" }}>
            {[
              { name:"name",         label:"Full Name",      type:"text",     placeholder:"Rajesh Sharma" },
              { name:"email",        label:"Email Address",  type:"email",    placeholder:"you@example.com" },
              { name:"phone",        label:"WhatsApp Number",type:"tel",      placeholder:"9171982377" },
              { name:"businessName", label:"Business Name (optional)", type:"text", placeholder:"Sharma Coaching Centre" },
              { name:"password",     label:"Password",       type:"password", placeholder:"Min. 6 characters" },
              { name:"confirm",      label:"Confirm Password",type:"password",placeholder:"Repeat password" },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize:".78rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:".35rem" }}>{f.label}</label>
                <input className="input-field" type={f.type} name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} required={f.name !== "businessName"} />
              </div>
            ))}
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:".5rem" }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:"1.5rem", color:"#6a8cb0", fontSize:".85rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"#00cfff", fontWeight:700, textDecoration:"none" }}>Sign in</Link>
            <br/><br/>
            <Link to="/" style={{ color:"#3a5070", fontSize:".8rem", textDecoration:"none" }}>← Back to Eidolux site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
