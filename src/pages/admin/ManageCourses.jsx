import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
import SkeletonCard from "../../components/SkeletonCard";
import StatusBanner from "../../components/StatusBanner";
import {
	addCourse,
	deleteCourse,
	getCourses,
	initializeStorage,
	parseCourseTimeRange,
	updateCourse,
} from "../../services/storage";

export default function ManageCourses() {
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [courses, setCourses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingCourseId, setEditingCourseId] = useState(null);
	const [statusBanner, setStatusBanner] = useState({ type: "", msg: "" });
	const [formData, setFormData] = useState({
		courseName: "",
		faculty: "",
		time: "",
	});

	const handleAddClick = () => {
		setShowForm(true);
		setEditingCourseId(null);
		setFormData({ courseName: "", faculty: "", time: "" });
	};

	const handleEdit = (course) => {
		setShowForm(true);
		setEditingCourseId(course.id);
		setFormData({
			courseName: course.courseName,
			faculty: course.faculty,
			time: course.time,
		});
	};

	const handleDelete = (courseId) => {
		deleteCourse(courseId);
		setCourses(getCourses());
		setStatusBanner({ type: "success", msg: "Course deleted successfully!" });
		toast.success("Course deleted successfully!");
	};

	const resetForm = () => {
		setShowForm(false);
		setEditingCourseId(null);
		setFormData({ courseName: "", faculty: "", time: "" });
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!formData.courseName || !formData.faculty || !formData.time) {
			setStatusBanner({ type: "error", msg: "Please fill all fields" });
			toast.error("Please fill all fields");
			return;
		}

		if (!parseCourseTimeRange(formData.time)) {
			setStatusBanner({ type: "error", msg: "Enter time like: Mon 10:00 AM - 11:00 AM" });
			toast.error("Enter time like: Mon 10:00 AM - 11:00 AM");
			return;
		}

		if (editingCourseId) {
			updateCourse(editingCourseId, formData);
			setStatusBanner({ type: "success", msg: "Course updated successfully!" });
			toast.success("Course updated successfully!");
		} else {
			addCourse(formData);
			setStatusBanner({ type: "success", msg: "Course added successfully!" });
			toast.success("Course added successfully!");
		}

		setCourses(getCourses());

		resetForm();
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			initializeStorage();
			setCourses(getCourses());
			setLoading(false);
		};

		fetchData();
	}, []);

	useEffect(() => {
		const editCourseId = Number(searchParams.get("editCourseId"));
		if (!editCourseId || courses.length === 0) {
			return;
		}

		const selectedCourse = courses.find((course) => course.id === editCourseId);
		if (!selectedCourse) {
			return;
		}

		handleEdit(selectedCourse);
	}, [courses, searchParams]);

	if (loading) {
		return (
			<AdminLayout>
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<StatusBanner type={statusBanner.type} msg={statusBanner.msg} />
			<h1>Admin Course Control Panel</h1>

			<div style={{ marginTop: "20px" }}>
				<button
					onClick={handleAddClick}
					className="btn-primary"
				>
					Add Course Button
				</button>
			</div>

			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="card"
					style={{
						marginTop: "16px",
						display: "grid",
						gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
						gap: "10px",
					}}
				>
					<input
						placeholder="Course Name"
						value={formData.courseName}
						onChange={(event) =>
							setFormData((previous) => ({ ...previous, courseName: event.target.value }))
						}
						style={{ padding: "10px" }}
					/>
					<input
						placeholder="Faculty"
						value={formData.faculty}
						onChange={(event) =>
							setFormData((previous) => ({ ...previous, faculty: event.target.value }))
						}
						style={{ padding: "10px" }}
					/>
					<input
						placeholder="Mon 10:00 AM - 11:00 AM"
						value={formData.time}
						onChange={(event) =>
							setFormData((previous) => ({ ...previous, time: event.target.value }))
						}
						style={{ padding: "10px" }}
					/>

					<div style={{ display: "flex", gap: "8px" }}>
						<button
							type="submit"
							className="btn-success"
						>
							{editingCourseId ? "Edit Course" : "Add Course Form"}
						</button>
						<button
							type="button"
							onClick={resetForm}
							className="btn-muted"
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			<div style={{ marginTop: "20px" }}>
				<h3>Course List</h3>
				{courses.length === 0 && <p>No courses available.</p>}

				<div className="statsGrid" style={{ marginTop: "12px" }}>
					{courses.map((course) => (
						<div key={course.id} className="card">
							<h3 style={{ marginTop: 0 }}>{course.courseName}</h3>
							<p style={{ margin: "8px 0 0 0" }}><strong>Faculty:</strong> {course.faculty}</p>
							<p style={{ margin: "8px 0 0 0" }}><strong>Time:</strong> {course.time}</p>

							<div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
								<button
									onClick={() => handleEdit(course)}
									className="btn-info"
								>
									Edit Course
								</button>
								<button
									onClick={() => handleDelete(course.id)}
									className="btn-danger"
								>
									Delete Course
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}

