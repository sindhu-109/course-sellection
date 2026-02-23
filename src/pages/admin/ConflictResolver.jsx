import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
	getScheduleConflicts,
	getRegistrationsWithDetails,
	initializeStorage,
} from "../../services/storage";

const RESOLVED_CONFLICTS_KEY = "resolvedConflicts";

export default function ConflictResolver() {
	const navigate = useNavigate();
	const [registrations, setRegistrations] = useState([]);
	const [resolvedConflictIds, setResolvedConflictIds] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(RESOLVED_CONFLICTS_KEY) || "[]");
		} catch {
			return [];
		}
	});

	const conflicts = useMemo(() => {
		return getScheduleConflicts(registrations).map((conflict) => ({
			...conflict,
			autoSuggestion: `Adjust timing for one of: ${conflict.courseNames.join(", ")} or reject one registration.`,
			resolved: resolvedConflictIds.includes(conflict.id),
		}));
	}, [registrations, resolvedConflictIds]);

	const resolveConflict = (conflictId) => {
		if (resolvedConflictIds.includes(conflictId)) {
			return;
		}

		const updatedResolvedIds = [...resolvedConflictIds, conflictId];
		setResolvedConflictIds(updatedResolvedIds);
		localStorage.setItem(RESOLVED_CONFLICTS_KEY, JSON.stringify(updatedResolvedIds));
	};

	useEffect(() => {
		initializeStorage();
		setRegistrations(getRegistrationsWithDetails());
	}, []);

	const activeConflictCount = conflicts.filter((conflict) => !conflict.resolved).length;

	const handleEditCourse = (courseId) => {
		navigate(`/admin/manage-courses?editCourseId=${courseId}`);
	};

	return (
		<AdminLayout>
			<h1>Conflict Resolver</h1>

			<div style={{ marginTop: "16px" }}>
				<h3>Time Conflict Alerts</h3>
				<p style={{ marginTop: "6px", color: "#64748B" }}>
					Active alerts: {activeConflictCount}
				</p>
			</div>

			<div style={{ marginTop: "14px", display: "grid", gap: "12px" }}>
				{conflicts.length === 0 && (
					<div className="card" style={{ padding: "14px" }}>
						No course time conflicts found in approved registrations.
					</div>
				)}
				{conflicts.map((conflict) => (
					<div key={conflict.id} className="card" style={{ padding: "14px" }}>
						<h4 style={{ margin: "0 0 8px 0" }}>
							{conflict.student} → {conflict.message}
						</h4>
						<p style={{ margin: "0 0 6px 0", color: "#EF4444" }}>
							<strong>Time conflict alert:</strong> {conflict.timeAlert || "Time not set"}
						</p>
						<p style={{ margin: "0 0 10px 0", color: "#10B981" }}>
							<strong>Auto suggestion:</strong> {conflict.autoSuggestion}
						</p>

						<button
							onClick={() => resolveConflict(conflict.id)}
							disabled={conflict.resolved}
							className={conflict.resolved ? "btn-muted" : "btn-primary"}
						>
							{conflict.resolved ? "Resolved" : "Resolve"}
						</button>

						{conflict.resolved && (
							<div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
								{conflict.courseIds?.map((courseId, index) => (
									<button
										key={`${conflict.id}-${courseId}`}
										onClick={() => handleEditCourse(courseId)}
										className="btn-success"
									>
										Edit {conflict.courseNames?.[index] || `Course ${courseId}`}
									</button>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</AdminLayout>
	);
}
