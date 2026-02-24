import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initializeStorage, registerUser } from "../../services/storage";

export default function Signup(){

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignup = (e) =>{
    e.preventDefault();

    initializeStorage();

    if (!acceptedTerms) {
      alert("Please agree to Terms & Privacy Policy");
      return;
    }

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
    <div className="signupPage">
      <form className="signupCard" onSubmit={handleSignup}>
        <div className="signupHeader">
          <div className="logoBox">🎓</div>
          <h2>Create Account</h2>
          <p>Join the EduPortal community today</p>
        </div>

        <div className="roleSelect">
          <div
            className={`roleCard ${role === "student" ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => setRole("student")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setRole("student");
              }
            }}
          >
            <h4>Student</h4>
            <p>Access courses & track progress</p>
          </div>

          <div
            className={`roleCard ${role === "admin" ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => setRole("admin")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setRole("admin");
              }
            }}
          >
            <h4>Admin</h4>
            <p>Manage institution & users</p>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            aria-label="Full name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            aria-label="Email address"
            type="email"
            placeholder="example@eduportal.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="signup-password">Password</label>
          <div className="passwordWrap">
            <input
              id="signup-password"
              aria-label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
            <span
              role="button"
              tabIndex={0}
              aria-label={showPass ? "Hide password" : "Show password"}
              onClick={()=>setShowPass(!showPass)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setShowPass(!showPass);
                }
              }}
            >
              👁
            </span>
          </div>
        </div>

        <label className="termsRow">
          <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
          <span>I agree to Terms & Privacy Policy</span>
        </label>

        <button type="submit" className="btn-primary fullBtn">
          Create Account
        </button>

        <p style={{marginTop:"12px", marginBottom:0, textAlign: "center"}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}