import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04080f", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');`}</style>

      {/* BG glow */}
      <div style={{ position:"fixed",top:"20%",left:"30%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,107,255,.1) 0%,transparent 70%)",pointerEvents:"none" }}/>

      <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.8rem", letterSpacing:".12em", color:"#fff" }}>EIDOLUX</div>
          <div style={{ fontSize:".72rem", letterSpacing:".22em", color:"#00cfff", marginTop:4 }}>PUBLICITY</div>
        </div>

        <div className="glass-card" style={{ padding: "2.5rem 2rem" }}>
          <h2 style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:"1.4rem", color:"#fff", marginBottom:".4rem" }}>Welcome back</h2>
          <p style={{ color:"#6a8cb0", fontSize:".88rem", marginBottom:"2rem" }}>Sign in to your Eidolux account</p>

          {error && (
            <div style={{ background:"rgba(255,60,60,.1)", border:"1px solid rgba(255,60,60,.3)", borderRadius:8, padding:".75rem 1rem", marginBottom:"1.5rem", color:"#ff6b6b", fontSize:".85rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <label style={{ fontSize:".78rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:".4rem" }}>Email</label>
              <input className="input-field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize:".78rem", color:"#6a8cb0", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:".4rem" }}>Password</label>
              <input className="input-field" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:".5rem" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:"1.5rem", color:"#6a8cb0", fontSize:".85rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:"#00cfff", fontWeight:700, textDecoration:"none" }}>Create one</Link>
          </p>
        </div>

        <p style={{ textAlign:"center", marginTop:"1.5rem", color:"#3a5070", fontSize:".75rem" }}>
          © 2026 Eidolux Publicity, Gwalior &nbsp;•&nbsp;{" "}
          <Link to="/" style={{ color:"#3a5070", textDecoration:"none" }}>← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
