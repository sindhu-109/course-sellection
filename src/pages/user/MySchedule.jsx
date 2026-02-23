import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import {
	getCurrentUser,
	getScheduleConflicts,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function MySchedule() {
	const [registrations, setRegistrations] = useState([]);
	const currentUser = getCurrentUser();

	const approvedCourses = useMemo(
		() => registrations.filter((registration) => registration.status === "Approved"),
		[registrations]
	);

	const conflictWarnings = useMemo(() => {
		return getScheduleConflicts(approvedCourses).map(
			(conflict) => `${conflict.message} (${conflict.timeAlert})`
		);
	}, [approvedCourses]);

	useEffect(() => {
		initializeStorage();
		if (currentUser?.email) {
			setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		}
	}, [currentUser?.email]);

	return (
		<UserLayout>
			<h1>My Schedule</h1>

			<div style={{ marginTop: "12px", marginBottom: "14px" }}>
				<h3>Conflict Warning</h3>
				{conflictWarnings.length === 0 ? (
					<p>No time conflicts detected.</p>
				) : (
					<ul style={{ color: "#EF4444" }}>
						{conflictWarnings.map((warning) => (
							<li key={warning}>{warning}</li>
						))}
					</ul>
				)}
			</div>

			<h3>Approved Courses Schedule</h3>
			<div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
				{approvedCourses.length === 0 && <p>No approved courses yet.</p>}
				{approvedCourses.map((course) => (
					<div
						key={course.id}
						style={{
							border: "1px solid #E5E7EB",
							borderRadius: "8px",
							padding: "12px",
							background: "#FFFFFF",
						}}
					>
						<div style={{ fontWeight: "bold" }}>{course.courseName}</div>
						<div style={{ marginTop: "4px", color: "#64748B" }}>
							{course.courseFaculty} • {course.courseTime}
						</div>
					</div>
				))}
			</div>
		</UserLayout>
	);
}
