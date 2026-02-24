import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const storedRole = localStorage.getItem("role");
  const resolvedRole = role || storedRole || (location.pathname.startsWith("/admin") ? "admin" : "user");
  const isAdmin = resolvedRole === "admin";

  const adminItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Courses", to: "/admin/manage-courses", icon: BookOpen },
    { label: "Manage Users", to: "/admin/manage-users", icon: Users },
    { label: "Registrations", to: "/admin/registrations", icon: ClipboardList },
    { label: "Conflict Resolver", to: "/admin/conflict-resolver", icon: AlertTriangle },
  ];

  const userItems = [
    { label: "Dashboard", to: "/user/dashboard", icon: LayoutDashboard },
    { label: "Browse Courses", to: "/user/browse-courses", icon: BookOpen },
    { label: "My Schedule", to: "/user/schedule", icon: Calendar },
    { label: "My Registrations", to: "/user/my-registrations", icon: Shield },
  ];

  const menuItems = isAdmin ? adminItems : userItems;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Course Scheduler</h2>

      <div className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
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
  );
}