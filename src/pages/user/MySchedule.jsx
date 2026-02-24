import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import EmptyState from "../../components/EmptyState";
import {
	getCurrentUser,
	getScheduleConflicts,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function MySchedule() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
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
		const fetchData = async () => {
			setLoading(true);
			initializeStorage();
			if (currentUser?.email) {
				setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
			}
			setLoading(false);
		};

		fetchData();
	}, [currentUser?.email]);

	if (loading) {
		return (
			<UserLayout>
				<div className="spinner">Loading...</div>
			</UserLayout>
		);
	}

	if (approvedCourses.length === 0) {
		return (
			<UserLayout>
				<h1>My Schedule</h1>
				<EmptyState title="No Schedule Yet" desc="Register for courses to view your weekly plan." />
				<div style={{ marginTop: "12px" }}>
					<button className="btn-primary" onClick={() => navigate("/user/browse-courses")}>Browse Courses</button>
				</div>
			</UserLayout>
		);
	}

	return (
		<UserLayout>
			<h1>My Schedule</h1>

			<div style={{ marginTop: "12px", marginBottom: "14px" }}>
				<h3>Conflict Warning</h3>
				{conflictWarnings.length === 0 ? (
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
				{approvedCourses.map((course) => (
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
