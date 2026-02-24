import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
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
	const [courses, setCourses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingCourseId, setEditingCourseId] = useState(null);
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
	};

	const resetForm = () => {
		setShowForm(false);
		setEditingCourseId(null);
		setFormData({ courseName: "", faculty: "", time: "" });
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!formData.courseName || !formData.faculty || !formData.time) {
			return;
		}

		if (!parseCourseTimeRange(formData.time)) {
			alert("Enter time like: Mon 10:00 AM - 11:00 AM");
			return;
		}

		if (editingCourseId) {
			updateCourse(editingCourseId, formData);
		} else {
			addCourse(formData);
		}

		setCourses(getCourses());

		resetForm();
	};

	useEffect(() => {
		initializeStorage();
		setCourses(getCourses());
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

	return (
		<AdminLayout>
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

			<hr style={{ margin: "20px 0" }} />

			<div className="card">
				<h3>Course Table</h3>
				{courses.length === 0 && <p>No courses available.</p>}
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					background: "var(--color-card)",
					marginTop: "12px",
				}}
			>
				<thead>
					<tr>
						<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Course Name</th>
						<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Faculty</th>
						<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Time</th>
						<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Edit</th>
						<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Delete</th>
					</tr>
				</thead>
				<tbody>
					{courses.map((course) => (
						<tr key={course.id}>
							<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>{course.courseName}</td>
							<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>{course.faculty}</td>
							<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>{course.time}</td>
							<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>
								<button
									onClick={() => handleEdit(course)}
									className="btn-info"
								>
									Edit Course
								</button>
							</td>
							<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>
								<button
									onClick={() => handleDelete(course.id)}
									className="btn-danger"
								>
									Delete Course
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			</div>
		</AdminLayout>
	);
}

