import { Suspense, lazy, useState } from "react";
import { Menu } from "lucide-react";
import Navbar from "../components/Navbar";
import { getRole } from "../services/storage";

const Sidebar = lazy(() => import("../components/Sidebar"));

export default function UserLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const role = getRole() || "student";

  return (
    <div className="app-layout">
      <Suspense fallback={null}>
        <Sidebar
          role={role}
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </Suspense>

      <div className="app-main">
        <div className="mobile-sidebar-toggle">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileSidebarOpen((previous) => !previous)}
            aria-label="Toggle menu"
            tabIndex={0}
          >
            <Menu size={20} />
          </button>
        </div>

        <Navbar role="user" />

        <div className="page-container" style={{ padding: "30px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}