import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import {
	getCurrentUser,
	getScheduleConflicts,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function MySchedule() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
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
		setIsLoading(true);
		initializeStorage();
		if (currentUser?.email) {
			setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		}
		setIsLoading(false);
	}, [currentUser?.email]);

	return (
		<UserLayout>
			<h1>My Schedule</h1>

			<div style={{ marginTop: "12px", marginBottom: "14px" }}>
				<h3>Conflict Warning</h3>
				{isLoading ? (
					<div className="skeleton" style={{ height: "54px", marginTop: "8px" }} />
				) : conflictWarnings.length === 0 ? (
					<p>No time conflicts detected.</p>
				) : (
					<ul style={{ color: "var(--color-danger)" }}>
						{conflictWarnings.map((warning) => (
							<li key={warning}>{warning}</li>
						))}
					</ul>
				)}
			</div>

			<h3>Approved Courses Schedule</h3>
			<div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
				{isLoading && (
					<>
						<div className="skeleton" style={{ height: "84px" }} />
						<div className="skeleton" style={{ height: "84px" }} />
					</>
				)}

				{!isLoading && approvedCourses.length === 0 && (
					<div className="empty-state">
						<h3>📅 No courses yet</h3>
						<p>Start building your schedule.</p>
						<button className="btn-primary" onClick={() => navigate("/user/browse-courses")}>Browse Courses</button>
					</div>
				)}

				{!isLoading && approvedCourses.map((course) => (
					<div
						key={course.id}
						className="course-card"
						style={{
							border: "1px solid var(--color-border)",
							borderRadius: "8px",
							padding: "12px",
							background: "var(--color-card)",
						}}
					>
						<div style={{ fontWeight: "bold" }}>{course.courseName}</div>
						<div style={{ marginTop: "4px", color: "var(--color-text-soft)" }}>
							{course.courseFaculty} • {course.courseTime}
						</div>
					</div>
				))}
			</div>
		</UserLayout>
	);
}
