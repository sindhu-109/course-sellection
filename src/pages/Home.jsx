import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, ShieldCheck } from "lucide-react";
import { getRole } from "../services/storage";

function Home() {
  const role = getRole();
  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "student" ? "/user/dashboard" : "/login";

  return (
    <div className="home-page">
      <header className="landing-navbar">
        <h3>Course Selection System</h3>

        <div className="home-auth-links">
          <Link to="/login" className="btn-primary home-link-btn">
            Login
          </Link>
          <Link to="/signup" className="btn-info home-link-btn">
            Signup
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero home-hero card">
          <h1>Smart Course Management Platform</h1>
          <p>
            Select courses, manage schedules, and track academic progress with a
            powerful dashboard.
          </p>
          <Link to={dashboardPath} className="btn-primary home-link-btn primaryBtn">
            Go to Dashboard
          </Link>
        </section>

        <section className="actionGrid">
          <Link to="/user/browse-courses" className="home-action-card card">
            <BookOpen size={24} className="card-icon" />
            <h3>Select Courses</h3>
            <p>Browse and add courses to your schedule.</p>
          </Link>

          <Link to={dashboardPath} className="home-action-card card">
            <LayoutDashboard size={24} className="card-icon" />
            <h3>View Dashboard</h3>
            <p>See your selected courses and progress.</p>
          </Link>

          {role === "admin" && (
            <Link to="/admin/manage-users" className="home-action-card card">
              <ShieldCheck size={24} className="card-icon" />
              <h3>Manage Users (Admin)</h3>
              <p>Admin tools for course and user control.</p>
            </Link>
          )}
        </section>
      </main>

      <footer className="landing-footer">
        <p>Course Selection System © 2026</p>
        <div className="landing-footer-links">
          <Link to="/login">Admin</Link>
          <Link to="/login">Student</Link>
          <Link to="/signup">Help</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;