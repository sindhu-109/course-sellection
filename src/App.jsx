import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import UserDashboard from "./pages/user/UserDashboard";
import BrowseCourses from "./pages/user/BrowseCourses";
import MySchedule from "./pages/user/MySchedule";
import MyRegistrations from "./pages/user/MyRegistrations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageUsers from "./pages/admin/ManageUsers";
import Registrations from "./pages/admin/Registrations";
import ConflictResolver from "./pages/admin/ConflictResolver";
import { initializeStorage } from "./services/storage";

const ProtectedRoute = ({ children, requiredRole }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="user">
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="browse-courses" element={<BrowseCourses />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="my-registrations" element={<MyRegistrations />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="conflict-resolver" element={<ConflictResolver />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;