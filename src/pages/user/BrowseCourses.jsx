import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import {
	createRegistration,
	getCourses,
	getCurrentUser,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function BrowseCourses() {
	const [searchText, setSearchText] = useState("");
	const [courses, setCourses] = useState([]);
	const [registrations, setRegistrations] = useState([]);

	const currentUser = getCurrentUser();

	const filteredCourses = useMemo(() => {
		const query = searchText.trim().toLowerCase();

		if (!query) {
			return courses;
		}

		return courses.filter(
			(course) =>
				course.courseName.toLowerCase().includes(query) ||
				course.faculty.toLowerCase().includes(query) ||
				course.time.toLowerCase().includes(query)
		);
	}, [courses, searchText]);

	const registrationByCourseId = useMemo(() => {
		return registrations.reduce((result, registration) => {
			result[registration.courseId] = registration.status;
			return result;
		}, {});
	}, [registrations]);

	const handleEnroll = (courseId) => {
		if (!currentUser?.email) {
			alert("Please login again.");
			return;
		}

		const response = createRegistration({
			userEmail: currentUser.email,
			courseId,
		});

		if (!response.ok) {
			alert(response.message);
			return;
		}

		setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		alert("Registration request submitted for admin approval.");
	};

	useEffect(() => {
		initializeStorage();
		setCourses(getCourses());
		if (currentUser?.email) {
			setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		}
	}, [currentUser?.email]);

	return (
		<UserLayout>
			<h1>Course List</h1>

			<input
				type="text"
				placeholder="Search courses"
				value={searchText}
				onChange={(event) => setSearchText(event.target.value)}
				style={{
					marginTop: "14px",
					padding: "10px",
					width: "100%",
					maxWidth: "420px",
					border: "1px solid #E5E7EB",
					borderRadius: "6px",
				}}
			/>

			<div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
				{filteredCourses.length === 0 && <p>No courses found.</p>}

				{filteredCourses.map((course) => {
					const registrationStatus = registrationByCourseId[course.id];
					const isDisabled = registrationStatus === "Pending" || registrationStatus === "Approved";
					const buttonText =
						registrationStatus === "Approved"
							? "Approved"
							: registrationStatus === "Pending"
								? "Pending Approval"
								: "Enroll";

					return (
						<div
							key={course.id}
							style={{
								border: "1px solid #E5E7EB",
								borderRadius: "8px",
								padding: "14px",
								background: "#FFFFFF",
							}}
						>
							<h3 style={{ margin: "0 0 8px 0" }}>{course.courseName}</h3>
							<p style={{ margin: "0 0 6px 0" }}>Faculty: {course.faculty}</p>
							<p style={{ margin: "0 0 12px 0" }}>Time: {course.time}</p>
							{registrationStatus === "Rejected" && (
								<p style={{ margin: "0 0 12px 0", color: "#EF4444" }}>
									Previous request rejected. You can apply again.
								</p>
							)}

							<button
								onClick={() => handleEnroll(course.id)}
								disabled={isDisabled}
								style={{
									padding: "8px 12px",
									background: isDisabled ? "#64748B" : "#2563EB",
									color: "#FFFFFF",
									border: "none",
									borderRadius: "5px",
									cursor: isDisabled ? "not-allowed" : "pointer",
								}}
							>
								{buttonText}
							</button>
						</div>
					);
				})}
			</div>
		</UserLayout>
	);
}
