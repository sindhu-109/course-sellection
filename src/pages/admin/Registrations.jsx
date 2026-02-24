import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
import SkeletonCard from "../../components/SkeletonCard";
import {
	getRegistrationsWithDetails,
	initializeStorage,
	updateRegistrationStatus,
} from "../../services/storage";

export default function Registrations() {
	const [loading, setLoading] = useState(true);
	const [registrationRequests, setRegistrationRequests] = useState([]);

	const pendingRequests = useMemo(
		() => registrationRequests.filter((request) => request.status === "Pending"),
		[registrationRequests]
	);

	const updateRequestStatus = (requestId, status) => {
		updateRegistrationStatus(requestId, status);
		setRegistrationRequests(getRegistrationsWithDetails());
		toast.success(`Request ${status.toLowerCase()} successfully`);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			initializeStorage();
			setRegistrationRequests(getRegistrationsWithDetails());
			setLoading(false);
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<AdminLayout>
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</AdminLayout>
		);
	}

	if (pendingRequests.length === 0) {
		return (
			<AdminLayout>
				<h1>Registration Management</h1>
				<div className="emptyState">No courses added yet</div>
			</AdminLayout>
		);
	}

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
						background: "var(--color-card)",
					}}
				>
					<thead>
						<tr>
							<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Student</th>
							<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Course</th>
							<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Status</th>
							<th style={{ border: "1px solid var(--color-border)", padding: "10px", textAlign: "left" }}>Action</th>
						</tr>
					</thead>
					<tbody>
						{pendingRequests.map((request) => (
							<tr key={request.id}>
								<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>{request.student}</td>
								<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>
									<div>{request.courseName}</div>
									<div style={{ fontSize: "12px", color: "var(--color-text-soft)", marginTop: "4px" }}>
										{request.courseFaculty} • {request.courseTime}
									</div>
								</td>
								<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>{request.status}</td>
								<td style={{ border: "1px solid var(--color-border)", padding: "10px" }}>
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
