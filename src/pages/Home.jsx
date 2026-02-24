import { Link } from "react-router-dom";

function Home() {
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
        <section className="landing-section landing-hero">
          <h1>Build Your Perfect Course Schedule</h1>
          <p>
            Select courses, avoid conflicts, and manage your semester easily.
          </p>
          <div className="landing-actions">
            <Link to="/signup" className="btn-primary home-link-btn">
              Get Started
            </Link>
            <Link to="/user/browse-courses" className="btn-muted home-link-btn">
              View Courses
            </Link>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="section-title">Features</h2>
          <div className="landing-grid four-col">
            <article className="card landing-card">
              <h4>📚 Smart Course Selection</h4>
              <p>Find and choose courses quickly with a simple, guided flow.</p>
            </article>
            <article className="card landing-card">
              <h4>⚠ Schedule Conflict Detection</h4>
              <p>Get instant alerts when selected courses overlap in timing.</p>
            </article>
            <article className="card landing-card">
              <h4>👨‍💻 Admin Management Panel</h4>
              <p>Manage users, courses, and registration operations in one place.</p>
            </article>
            <article className="card landing-card">
              <h4>✅ Real-Time Registration</h4>
              <p>Track and update registration status without delays.</p>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="section-title">Role Overview</h2>
          <div className="landing-grid two-col">
            <article className="card landing-card">
              <h4>👨‍💼 Admin Panel</h4>
              <ul className="landing-list">
                <li>Manage Courses</li>
                <li>Approve Registrations</li>
                <li>Resolve Conflicts</li>
              </ul>
            </article>
            <article className="card landing-card">
              <h4>👩‍🎓 Student Panel</h4>
              <ul className="landing-list">
                <li>Browse Courses</li>
                <li>Build Schedule</li>
                <li>Track Registrations</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="section-title">How It Works</h2>
          <div className="landing-grid three-col">
            <article className="card landing-card step-card">
              <h4>1️⃣ Sign Up / Login</h4>
            </article>
            <article className="card landing-card step-card">
              <h4>2️⃣ Select Courses</h4>
            </article>
            <article className="card landing-card step-card">
              <h4>3️⃣ Generate Schedule</h4>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="section-title">Course Preview</h2>
          <div className="landing-grid three-col">
            <article className="card landing-card">
              <h4>Data Structures</h4>
            </article>
            <article className="card landing-card">
              <h4>Operating Systems</h4>
            </article>
            <article className="card landing-card">
              <h4>Computer Networks</h4>
            </article>
          </div>
          <div className="landing-actions">
            <Link to="/user/browse-courses" className="btn-info home-link-btn">
              View All Courses
            </Link>
          </div>
        </section>

        <section className="landing-section landing-cta card">
          <h2 className="section-title">Ready to build your schedule?</h2>
          <Link to="/signup" className="btn-primary home-link-btn">
            Signup Now
          </Link>
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