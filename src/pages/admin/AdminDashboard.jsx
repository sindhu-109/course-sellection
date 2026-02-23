import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
	getCourses,
	getScheduleConflicts,
	getRegistrationsWithDetails,
	getUsers,
	initializeStorage,
} from "../../services/storage";

export default function AdminDashboard() {
	const [courses, setCourses] = useState([]);
	const [users, setUsers] = useState([]);
	const [registrations, setRegistrations] = useState([]);

	const totalCoursesCount = courses.length;
	const totalStudentsCount = users.filter((user) => user.role === "user").length;
	const pendingRegistrationsCount = registrations.filter(
		(registration) => registration.status === "Pending"
	).length;
	const activeRegistrationsCount = registrations.filter(
		(registration) => registration.status === "Approved"
	).length;

	const conflictAlertsCount = useMemo(() => {
		return getScheduleConflicts(registrations).length;
	}, [registrations]);

	const quickActions = [
		"Add Course",
		"Manage Users",
		"Review Registrations",
		"Open Conflict Resolver",
	];

	const recentActivities = [
		`${pendingRegistrationsCount} registrations are pending review`,
		`${activeRegistrationsCount} registrations are approved`,
		`${totalCoursesCount} courses currently available`,
		`${totalStudentsCount} student accounts in system`,
	];

	useEffect(() => {
		initializeStorage();
		setCourses(getCourses());
		setUsers(getUsers());
		setRegistrations(getRegistrationsWithDetails());
	}, []);

	return (
		<AdminLayout>
			<h1>Admin Dashboard Overview</h1>

			<div style={{ marginTop: "16px" }}>
				<h3>📊 Stats Cards</h3>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
						gap: "12px",
						marginTop: "10px",
					}}
				>
					<div className="stat-card border-blue" style={{ padding: "14px" }}>
						<p style={{ margin: 0, color: "#64748B" }}>Total Courses</p>
						<h2 style={{ margin: "8px 0 0 0" }}>{totalCoursesCount}</h2>
					</div>

					<div className="stat-card border-cyan" style={{ padding: "14px" }}>
						<p style={{ margin: 0, color: "#64748B" }}>Total Students</p>
						<h2 style={{ margin: "8px 0 0 0" }}>{totalStudentsCount}</h2>
					</div>

					<div className="stat-card border-green" style={{ padding: "14px" }}>
						<p style={{ margin: 0, color: "#64748B" }}>Active Registrations</p>
						<h2 style={{ margin: "8px 0 0 0" }}>{activeRegistrationsCount}</h2>
					</div>
				</div>
			</div>

			<div style={{ marginTop: "18px" }}>
				<h3>⚠️ Alerts</h3>
				<div className={conflictAlertsCount > 0 ? "alert-danger" : "alert-warning"} style={{ marginTop: "10px" }}>
					<p style={{ margin: 0 }}><strong>Pending Registrations:</strong> {pendingRegistrationsCount}</p>
					<p style={{ margin: "8px 0 0 0", color: conflictAlertsCount > 0 ? "#EF4444" : "#10B981" }}>
						<strong>Schedule Conflicts:</strong> {conflictAlertsCount}
					</p>
				</div>
			</div>

			<div style={{ marginTop: "18px" }}>
				<h3>Quick Actions Buttons</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
					{quickActions.map((action) => (
						<button
							key={action}
							className="btn-primary"
						>
							{action}
						</button>
					))}
				</div>
			</div>

			<div style={{ marginTop: "18px" }}>
				<h3>📈 Activity Overview</h3>
				<div className="card" style={{ marginTop: "10px", padding: "14px" }}>
					<ul style={{ margin: 0, paddingLeft: "20px" }}>
						{recentActivities.map((activity) => (
							<li key={activity} style={{ marginBottom: "6px" }}>
								{activity}
							</li>
						))}
					</ul>
				</div>
			</div>
		</AdminLayout>
	);
}
