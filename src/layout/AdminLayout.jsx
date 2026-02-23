import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar role="admin" />

      <div className="app-main">
        <Navbar role="admin" />

        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
}