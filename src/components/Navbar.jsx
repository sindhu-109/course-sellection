import { useNavigate } from "react-router-dom";

export default function Navbar({ role }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="topbar">
      <h3>{role === "admin" ? "Admin Panel" : "Student Portal"}</h3>

      <button
        onClick={handleLogout}
        className="btn-danger"
      >
        Logout
      </button>
    </div>
  );
}