import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import UserLayout from "../../layout/UserLayout";
import EmptyState from "../../components/EmptyState";
import SkeletonCard from "../../components/SkeletonCard";
import {
	createRegistration,
	getCourses,
	getCurrentUser,
	getUserRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

export default function BrowseCourses() {
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(true);
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
			toast.error("Please login again.");
			return;
		}

		const response = createRegistration({
			userEmail: currentUser.email,
			courseId,
		});

		if (!response.ok) {
			toast.error(response.message);
			return;
		}

		setRegistrations(getUserRegistrationsWithDetails(currentUser.email));
		toast.success("Registration request submitted for admin approval.");
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			initializeStorage();
			setCourses(getCourses());
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
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</UserLayout>
		);
	}

	if (courses.length === 0) {
		return (
			<UserLayout>
				<h1>Course List</h1>
				<EmptyState title="No Courses Yet" desc="Start by browsing available courses." />
			</UserLayout>
		);
	}

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
				{filteredCourses.length === 0 && (
					<EmptyState title="No Courses Found" desc="Try a different keyword to find available courses." />
				)}

				{filteredCourses.map((course) => {
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
							className="course-card card"
							style={{
								padding: "14px",
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
								aria-label={`${buttonText} ${course.courseName}`}
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
