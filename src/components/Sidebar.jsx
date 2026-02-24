import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  UserCircle2,
  Users,
} from "lucide-react";
import { getRole } from "../services/storage";

export default function Sidebar({ role, isMobileOpen = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const resolvedRole = role || getRole() || (location.pathname.startsWith("/admin") ? "admin" : "student");
  const isAdmin = resolvedRole === "admin";

  const adminItems = [
    { label: "Admin Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", to: "/admin/manage-users", icon: Users },
    { label: "Manage Courses", to: "/admin/manage-courses", icon: BookOpen },
    { label: "Analytics", to: "/admin/registrations", icon: ClipboardList },
    { label: "Conflict Resolver", to: "/admin/conflict-resolver", icon: AlertTriangle },
  ];

  const studentItems = [
    { label: "My Courses", to: "/user/dashboard", icon: LayoutDashboard },
    { label: "Browse Courses", to: "/user/browse-courses", icon: BookOpen },
    { label: "My Schedule", to: "/user/schedule", icon: Calendar },
    { label: "Profile", to: "/user/my-registrations", icon: UserCircle2 },
  ];

  const menuItems = isAdmin ? adminItems : studentItems;

  const handleLogout = () => {
    if (onClose) {
      onClose();
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <>
      <div
        className={`sidebar-overlay${isMobileOpen ? " visible" : ""}`}
        onClick={onClose}
      />

      <div className={`sidebar${isMobileOpen ? " mobile-open" : ""}`}>
      <h2 className="sidebar-title">Course Scheduler</h2>

      <div className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            onClick={onClose}
            tabIndex={0}
          >
            <item.icon size={16} style={{ marginRight: "8px" }} />
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="sidebar-logout"
        >
          Logout
        </button>
      </div>
      </div>
    </>
  );
}