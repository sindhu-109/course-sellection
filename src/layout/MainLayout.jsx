import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC" }}>

      {/* ✅ Sidebar */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ✅ Navbar */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div style={{ padding: "25px" }}>
          {children}
        </div>

      </div>
    </div>
  );
}