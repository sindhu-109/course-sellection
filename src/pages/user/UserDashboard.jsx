import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import {
	getCurrentUser,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function UserDashboard() {
	const [registrations, setRegistrations] = useState([]);
	const currentUser = getCurrentUser();

	const approvedCourses = useMemo(
		() => registrations.filter((registration) => registration.status === "Approved"),
		[registrations]
	);

	const pendingCourses = useMemo(
		() => registrations.filter((registration) => registration.status === "Pending"),
		[registrations]
	);

	const myEnrolledCourses = approvedCourses.map((course) => course.courseName);
	const todaysSchedule = approvedCourses.map(
		(course) => `${course.courseTime} - ${course.courseName}`
	);
	const upcomingClasses = pendingCourses.map(
		(course) => `${course.courseName} (Pending approval)`
	);

	const nextClass =
		todaysSchedule[0] || (pendingCourses[0] ? `${pendingCourses[0].courseName} (Pending)` : "No class");

	const renderList = (items, emptyText) => {
		if (items.length === 0) {
			return <p style={{ margin: 0 }}>{emptyText}</p>;
		}

		return (
			<ul style={{ margin: 0, paddingLeft: "20px" }}>
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		);
	};

	useEffect(() => {
		initializeStorage();
		if (currentUser?.email) {
			setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		}
	}, [currentUser?.email]);

	return (
		<UserLayout>
			<h1>Student Home Screen</h1>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
					gap: "12px",
					marginTop: "14px",
				}}
			>
				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>My Courses</h3>
					<p style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>{myEnrolledCourses.length}</p>
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Next Class</h3>
					<p style={{ margin: 0 }}>{nextClass}</p>
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Schedule Preview</h3>
					<p style={{ margin: 0 }}>{todaysSchedule[0] || "No classes today"}</p>
				</div>
			</div>

			<div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>My Enrolled Courses</h3>
					{renderList(myEnrolledCourses, "No enrolled courses")}
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Today's Schedule</h3>
					{renderList(todaysSchedule, "No classes scheduled for today")}
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Upcoming Classes</h3>
					{renderList(upcomingClasses, "No upcoming classes")}
				</div>
			</div>
		</UserLayout>
	);
}
