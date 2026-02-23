import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
	getRegistrationsWithDetails,
	getUsers,
	initializeStorage,
	updateUserStatus,
} from "../../services/storage";

export default function ManageUsers() {
	const [students, setStudents] = useState([]);
	const [registrations, setRegistrations] = useState([]);

	const [selectedSchedule, setSelectedSchedule] = useState(null);

	const studentsWithDetails = useMemo(() => {
		return students
			.filter((student) => student.role === "user")
			.map((student) => {
				const studentRegistrations = registrations.filter(
					(registration) => registration.studentEmail === student.email
				);

				const registeredCourses = studentRegistrations
					.filter((registration) => registration.status === "Approved")
					.map((registration) => registration.courseName);

				const schedule = studentRegistrations
					.filter((registration) => registration.status === "Approved")
					.map(
						(registration) => `${registration.courseTime} - ${registration.courseName}`
					);

				return {
					...student,
					registeredCourses,
					schedule,
				};
			});
	}, [registrations, students]);

	const updateStatus = (studentId, status) => {
		updateUserStatus(studentId, status);
		setStudents(getUsers());
	};

	const handleViewSchedule = (student) => {
		setSelectedSchedule(student);
	};

	useEffect(() => {
		initializeStorage();
		setStudents(getUsers());
		setRegistrations(getRegistrationsWithDetails());
	}, []);

	return (
		<AdminLayout>
			<h1>Admin Manages Students</h1>

			<div style={{ marginTop: "18px" }}>
				<h3>Students List</h3>
				<div className="card" style={{ marginTop: "10px", padding: "0" }}>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						background: "#FFFFFF",
					}}
				>
					<thead>
						<tr>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Name</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Email</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>
								Registered Courses
							</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Status</th>
						</tr>
					</thead>
					<tbody>
						{studentsWithDetails.map((student) => (
							<tr key={student.id}>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>{student.name}</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>{student.email}</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>
									<div>{student.registeredCourses.join(", ") || "No courses"}</div>
									<button
										onClick={() => handleViewSchedule(student)}
										className="btn-primary"
										style={{ marginTop: "8px" }}
									>
										View Schedules
									</button>
								</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>
									<div style={{ marginBottom: "8px" }}>{student.status}</div>
									<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
										<button
											onClick={() => updateStatus(student.id, "Approved")}
											className="btn-success"
										>
											Approve
										</button>
										<button
											onClick={() => updateStatus(student.id, "Blocked")}
											className="btn-danger"
										>
											Block
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				</div>

				{selectedSchedule && (
					<div className="card" style={{ marginTop: "16px", padding: "14px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<h4 style={{ margin: 0 }}>{selectedSchedule.name} - Schedule</h4>
							<button
								onClick={() => setSelectedSchedule(null)}
								className="btn-muted"
							>
								Close
							</button>
						</div>
						<ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
							{selectedSchedule.schedule.map((slot) => (
								<li key={slot}>{slot}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
