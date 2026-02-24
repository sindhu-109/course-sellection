import { useNavigate } from "react-router-dom";
import { Bell, GraduationCap, Shield } from "lucide-react";

export default function Navbar({ role }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const notifications = role === "admin"
    ? ["New registration", "Conflict alert", "Course update"]
    : ["Registration update", "Schedule reminder", "Course update"];

  return (
    <div className="topbar">
      <h3 className="topbar-title">
        {role === "admin" ? <Shield size={18} /> : <GraduationCap size={18} />}
        {role === "admin" ? "Admin Panel" : "Student Portal"}
      </h3>

      <div className="topbar-actions">
        <button
          className="notification-bell"
          title={notifications.join(" • ")}
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="notification-dot" />
        </button>

        <button
          onClick={handleLogout}
          className="btn-danger"
        >
          Logout
        </button>
      </div>
    </div>
  );
}