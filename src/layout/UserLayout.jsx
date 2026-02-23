import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function UserLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar role="user" />

      <div className="app-main">
        <Navbar role="user" />

        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
}