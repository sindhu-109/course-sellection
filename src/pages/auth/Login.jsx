import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { authenticateUser, initializeStorage, setCurrentUser } from "../../services/storage";
import StatusBanner from "../../components/StatusBanner";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [statusBanner, setStatusBanner] = useState({ type: "", msg: "" });

  const normalizeLoginRole = (roleValue) => {
    if (roleValue === "admin") {
      return "admin";
    }

    if (roleValue === "student" || roleValue === "user") {
      return "user";
    }

    return "user";
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    initializeStorage();

    if (captchaInput.trim() !== captcha) {
      setStatusBanner({ type: "error", msg: "Captcha verification failed. Please try again." });
      toast.error("Captcha verification failed. Please try again.");
      refreshCaptcha();
      return;
    }

    const matchedUser = authenticateUser(email, password);

    if (!matchedUser) {
      setStatusBanner({ type: "error", msg: "Invalid email or password." });
      toast.error("Invalid email or password.");
      return;
    }

    if (matchedUser.status === "Blocked") {
      setStatusBanner({ type: "error", msg: "Your account is blocked by admin." });
      toast.error("Your account is blocked by admin.");
      return;
    }

    const selectedRole = normalizeLoginRole(role);
    const accountRole = normalizeLoginRole(matchedUser.role);

    if (selectedRole !== accountRole) {
      setStatusBanner({ type: "error", msg: `This account is registered as ${accountRole}. Please select ${accountRole}.` });
      toast.error(`This account is registered as ${accountRole}. Please select ${accountRole}.`);
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", matchedUser.role);
    localStorage.setItem("rememberUser", String(remember));
    setCurrentUser(matchedUser);
    setStatusBanner({ type: "success", msg: "Login successful!" });
    toast.success("Login successful!");
    navigate(matchedUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  };

  return (
    <div className="loginPage">
      <form className="loginCard" onSubmit={handleLogin}>
        <div className="loginHeader">
          <h2>Login</h2>
          <p>Log in to your account to continue</p>
        </div>

        <StatusBanner type={statusBanner.type} msg={statusBanner.msg} />

        <div className="inputGroup">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            aria-label="Email address"
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <div className="passwordRow">
            <label htmlFor="login-password">Password</label>
            <span className="forgot" role="button" tabIndex={0}>Forgot Password?</span>
          </div>

          <div className="passwordWrap">
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              aria-label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eyeIcon"
              role="button"
              tabIndex={0}
              aria-label={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass(!showPass)}
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

        <div className="inputGroup">
          <label htmlFor="login-role">Role</label>
          <select
            id="login-role"
            aria-label="Login role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <label className="rememberRow">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me for 30 days</span>
        </label>

        <div className="inputGroup">
          <label htmlFor="captcha-input">Captcha</label>
          <div className="captchaRow">
            <span className="captchaPrompt" aria-live="polite">
              {captcha}
            </span>
            <button type="button" className="captchaRefresh" onClick={refreshCaptcha} aria-label="Refresh captcha">
              Refresh
            </button>
          </div>
          <input
            id="captcha-input"
            type="text"
            aria-label="Captcha answer"
            placeholder="Enter captcha result"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </div>

        <button className="btn-primary fullBtn" aria-label="Sign in">
          Sign In →
        </button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don't have account?{" "}
          <span
            role="button"
            tabIndex={0}
            aria-label="Go to signup"
            style={{ color: "var(--color-primary)", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                navigate("/signup");
              }
            }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}