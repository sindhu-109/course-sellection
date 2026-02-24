import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, UserCircle2 } from "lucide-react";
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
	const [isLoading, setIsLoading] = useState(true);
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
		setIsLoading(true);
		initializeStorage();
		setCourses(getCourses());
		if (currentUser?.email) {
			setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		}
		setIsLoading(false);
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
					border: "1px solid var(--color-border)",
					borderRadius: "6px",
				}}
			/>

			<div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
				{isLoading && (
					<>
						<div className="skeleton" style={{ height: "120px" }} />
						<div className="skeleton" style={{ height: "120px" }} />
						<div className="skeleton" style={{ height: "120px" }} />
					</>
				)}

				{!isLoading && filteredCourses.length === 0 && (
					<div className="empty-state">
						<h3>📚 No courses found</h3>
						<p>Try another search or clear filters to view available courses.</p>
					</div>
				)}

				{!isLoading && filteredCourses.map((course) => {
					const registrationStatus = registrationByCourseId[course.id];
					const isDisabled = registrationStatus === "Pending" || registrationStatus === "Approved";
					const isCoreCourse = course.id % 2 === 0;
					const seatsLeft = Math.max(5, 24 - ((course.id * 3) % 17));
					const buttonText =
						registrationStatus === "Approved"
							? "Approved"
							: registrationStatus === "Pending"
								? "Pending Approval"
								: "Enroll";

					return (
						<div
							key={course.id}
							className="course-card"
							style={{
								border: "1px solid var(--color-border)",
								borderRadius: "8px",
								padding: "14px",
								background: "var(--color-card)",
							}}
						>
							<h3 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
								<BookOpen size={17} />
								{course.courseName}
							</h3>

							<div className="tag-row">
								<span className={`chip ${isCoreCourse ? "chip-core" : "chip-elective"}`}>
									{isCoreCourse ? "Core" : "Elective"}
								</span>
								<span className="chip">{course.time.split("-")[0].trim()}</span>
							</div>

							<p style={{ margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
								<UserCircle2 size={14} />
								{course.faculty}
							</p>
							<p style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
								<Clock3 size={14} />
								{course.time}
							</p>
							<p className="seats-text">Seats Left: {seatsLeft}</p>
							{registrationStatus === "Rejected" && (
								<p style={{ margin: "0 0 12px 0", color: "var(--color-danger)" }}>
									Previous request rejected. You can apply again.
								</p>
							)}

							<button
								onClick={() => handleEnroll(course.id)}
								disabled={isDisabled}
								className={isDisabled ? "btn-muted" : "btn-primary"}
								style={{
									padding: "8px 12px",
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
