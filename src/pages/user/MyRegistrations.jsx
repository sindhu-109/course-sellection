import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import EmptyState from "../../components/EmptyState";
import {
	getCurrentUser,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function MyRegistrations() {
	const [loading, setLoading] = useState(true);
	const [registrations, setRegistrations] = useState([]);

	const currentUser = getCurrentUser();

	const registeredCourses = useMemo(
		() =>
			registrations
				.filter((registration) => registration.status === "Approved")
				.map((registration) => registration.courseName),
		[registrations]
	);

	const pendingApprovalCourses = useMemo(
		() =>
			registrations
				.filter((registration) => registration.status === "Pending")
				.map((registration) => registration.courseName),
		[registrations]
	);

	const rejectedCourses = useMemo(
		() =>
			registrations
				.filter((registration) => registration.status === "Rejected")
				.map((registration) => registration.courseName),
		[registrations]
	);

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

	if (registrations.length === 0) {
		return (
			<UserLayout>
				<h1>Student Registration History</h1>
				<EmptyState title="No Registrations Yet" desc="Browse courses and register to see them here." />
			</UserLayout>
		);
	}

	const renderCourseList = (courses, emptyMessage) => {
		if (courses.length === 0) {
			return <p style={{ margin: 0 }}>{emptyMessage}</p>;
		}

		return (
			<ul style={{ margin: 0, paddingLeft: "20px" }}>
				{courses.map((course) => (
					<li key={course}>{course}</li>
				))}
			</ul>
		);
	};

	return (
		<UserLayout>
			<h1>Student Registration History</h1>

			<div style={{ marginTop: "16px", display: "grid", gap: "14px" }}>
				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Registered Courses</h3>
					{renderCourseList(registeredCourses, "No registered courses")}
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Pending Approval</h3>
					{renderCourseList(pendingApprovalCourses, "No pending courses")}
				</div>

				<div className="card" style={{ padding: "14px" }}>
					<h3 style={{ marginTop: 0 }}>Rejected Courses</h3>
					{renderCourseList(rejectedCourses, "No rejected courses")}
				</div>
			</div>
		</UserLayout>
	);
}
