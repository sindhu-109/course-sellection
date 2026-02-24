import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authenticateUser, initializeStorage, setCurrentUser } from "../../services/storage";

export default function Login() {

  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role, setRole] = useState("user");

  const handleLogin = (e)=>{
    e.preventDefault();

    initializeStorage();

    const matchedUser = authenticateUser(email, password);

    if (!matchedUser) {
      alert("Invalid email or password.");
      return;
    }

    if (matchedUser.status === "Blocked") {
      alert("Your account is blocked by admin.");
      return;
    }

    if (role !== matchedUser.role) {
      alert(`This account is registered as ${matchedUser.role}. Please select ${matchedUser.role}.`);
      return;
    }

    localStorage.setItem("isLoggedIn","true");
    localStorage.setItem("role", matchedUser.role);
    setCurrentUser(matchedUser);
    navigate(matchedUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  }

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"var(--color-background)"
    }}>
      <form onSubmit={handleLogin}
        style={{
          background:"var(--color-card)",
          padding:"40px",
          borderRadius:"10px",
          border:"1px solid var(--color-border)",
          width:"350px"
        }}
      >
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{width:"100%",padding:"10px",marginTop:"10px"}}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{width:"100%",padding:"10px",marginTop:"10px"}}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width:"100%", padding:"10px", marginTop:"10px" }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn-primary"
          style={{
            width:"100%",
            marginTop:"15px",
            padding:"10px",
            borderRadius:"6px"
          }}
        >
          Login
        </button>

        <p style={{marginTop:"10px"}}>
          Don't have account? <span
            style={{color:"var(--color-primary)",cursor:"pointer"}}
            onClick={()=>navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}