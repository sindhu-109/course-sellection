import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const storedRole = localStorage.getItem("role");
  const resolvedRole = role || storedRole || (location.pathname.startsWith("/admin") ? "admin" : "user");
  const isAdmin = resolvedRole === "admin";

  const adminItems = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Manage Courses", to: "/admin/manage-courses" },
    { label: "Manage Users", to: "/admin/manage-users" },
    { label: "Registrations", to: "/admin/registrations" },
    { label: "Conflict Resolver", to: "/admin/conflict-resolver" },
  ];

  const userItems = [
    { label: "Dashboard", to: "/user/dashboard" },
    { label: "Browse Courses", to: "/user/browse-courses" },
    { label: "My Schedule", to: "/user/schedule" },
    { label: "My Registrations", to: "/user/my-registrations" },
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