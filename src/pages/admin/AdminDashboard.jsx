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

			<div className="statsGrid" style={{ marginTop: "16px" }}>
				<div className="card">
					<h3 style={{ marginTop: 0 }}>Users Count</h3>
					<p style={{ margin: "8px 0 0 0", fontSize: "26px", fontWeight: 700 }}>{totalStudentsCount}</p>
				</div>

				<div className="card">
					<h3 style={{ marginTop: 0 }}>Courses Count</h3>
					<p style={{ margin: "8px 0 0 0", fontSize: "26px", fontWeight: 700 }}>{totalCoursesCount}</p>
				</div>

				<div className="card">
					<h3 style={{ marginTop: 0 }}>Registrations</h3>
					<p style={{ margin: "8px 0 0 0", fontSize: "26px", fontWeight: 700 }}>{registrations.length}</p>
				</div>
			</div>

			<div className="card" style={{ marginTop: "18px" }}>
				<h3>⚠️ Alerts</h3>
				<div className={conflictAlertsCount > 0 ? "alert-danger" : "alert-warning"} style={{ marginTop: "10px" }}>
					<p style={{ margin: 0 }}><strong>Pending Registrations:</strong> {pendingRegistrationsCount}</p>
					<p style={{ margin: "8px 0 0 0", color: conflictAlertsCount > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
						<strong>Schedule Conflicts:</strong> {conflictAlertsCount}
					</p>
				</div>
			</div>

			<div className="card" style={{ marginTop: "18px" }}>
				<h3>Quick Actions Buttons</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
					{quickActions.map((action) => (
						<button
							key={action}
							className="btn-primary"
							aria-label={action}
						>
							{action}
						</button>
					))}
				</div>
			</div>

			<div className="card" style={{ marginTop: "18px" }}>
				<h3>📈 Activity Overview</h3>
				<div style={{ marginTop: "10px" }}>
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
