import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
	getRegistrationsWithDetails,
	initializeStorage,
	updateRegistrationStatus,
} from "../../services/storage";

export default function Registrations() {
	const [registrationRequests, setRegistrationRequests] = useState([]);

	const pendingRequests = useMemo(
		() => registrationRequests.filter((request) => request.status === "Pending"),
		[registrationRequests]
	);

	const updateRequestStatus = (requestId, status) => {
		updateRegistrationStatus(requestId, status);
		setRegistrationRequests(getRegistrationsWithDetails());
	};

	useEffect(() => {
		initializeStorage();
		setRegistrationRequests(getRegistrationsWithDetails());
	}, []);

	return (
		<AdminLayout>
			<h1>Registration Management</h1>
			<h3 style={{ marginTop: "16px" }}>Pending Requests</h3>

			<div style={{ marginTop: "12px" }}>
				<h3>Registration Requests</h3>
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
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Student</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Course</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Status</th>
							<th style={{ border: "1px solid #E5E7EB", padding: "10px", textAlign: "left" }}>Action</th>
						</tr>
					</thead>
					<tbody>
						{pendingRequests.length === 0 && (
							<tr>
								<td colSpan={4} style={{ border: "1px solid #E5E7EB", padding: "12px" }}>
									No pending requests
								</td>
							</tr>
						)}
						{pendingRequests.map((request) => (
							<tr key={request.id}>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>{request.student}</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>
									<div>{request.courseName}</div>
									<div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
										{request.courseFaculty} • {request.courseTime}
									</div>
								</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>{request.status}</td>
								<td style={{ border: "1px solid #E5E7EB", padding: "10px" }}>
									<div style={{ display: "flex", gap: "8px" }}>
										<button
											onClick={() => updateRequestStatus(request.id, "Approved")}
											className="btn-success"
										>
											Approve
										</button>
										<button
											onClick={() => updateRequestStatus(request.id, "Rejected")}
											className="btn-danger"
										>
											Reject
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				</div>
			</div>
		</AdminLayout>
	);
}
