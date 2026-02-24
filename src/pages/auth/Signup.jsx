import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initializeStorage, registerUser } from "../../services/storage";

export default function Signup(){

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSignup = (e) =>{
    e.preventDefault();

    initializeStorage();

    const response = registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      status: "Approved",
    });

    if (!response.ok) {
      alert(response.message);
      return;
    }

    alert("Signup Successful!");
    navigate("/login");
  };

  return(
    <div style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"var(--color-background)",
      padding:"20px"
    }}>
      <form
        onSubmit={handleSignup}
        style={{
          background:"var(--color-card)",
          padding:"40px",
          borderRadius:"10px",
          border:"1px solid var(--color-border)",
          width:"100%",
          maxWidth:"380px"
        }}
      >
        <h2 style={{ marginBottom:"8px" }}>Create Account</h2>
        <p style={{ marginTop:0, color:"var(--color-text-soft)", marginBottom:"16px" }}>
          Sign up to access the course scheduler.
        </p>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
          style={{
            width:"100%",
            padding:"10px",
            marginTop:"10px",
            border:"1px solid var(--color-border)",
            borderRadius:"6px",
            boxSizing:"border-box"
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          style={{
            width:"100%",
            padding:"10px",
            marginTop:"10px",
            border:"1px solid var(--color-border)",
            borderRadius:"6px",
            boxSizing:"border-box"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          style={{
            width:"100%",
            padding:"10px",
            marginTop:"10px",
            border:"1px solid var(--color-border)",
            borderRadius:"6px",
            boxSizing:"border-box"
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width:"100%",
            padding:"10px",
            marginTop:"10px",
            border:"1px solid var(--color-border)",
            borderRadius:"6px",
            boxSizing:"border-box"
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="btn-primary"
          style={{
            width:"100%",
            marginTop:"15px",
            padding:"10px",
            borderRadius:"6px",
            cursor:"pointer"
          }}
        >
          Create Account
        </button>

        <p style={{marginTop:"12px", marginBottom:0}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}