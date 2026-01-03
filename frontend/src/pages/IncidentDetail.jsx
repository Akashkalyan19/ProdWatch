import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";

const STATUS_OPTIONS = ["open", "investigating", "mitigated", "resolved"];

const statusColor = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  mitigated: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

function IncidentDetail({ incidentId, onBack }) {
  const [incident, setIncident] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inc = await apiFetch(`/incidents/${incidentId}`);
        const ev = await apiFetch(`/incidents/${incidentId}/events`);
        setIncident(inc);
        setEvents(ev);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [incidentId]);

  const refreshEvents = async () => {
    const ev = await apiFetch(`/incidents/${incidentId}/events`);
    setEvents(ev);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      setSubmitting(true);
      await apiFetch(`/incidents/${incidentId}/message`, {
        method: "POST",
        body: JSON.stringify({ message: note }),
      });
      await refreshEvents();
      setNote("");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus || !statusMessage.trim()) return;

    try {
      setUpdatingStatus(true);
      await apiFetch(`/incidents/${incidentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          message: statusMessage,
        }),
      });

      const updatedIncident = await apiFetch(`/incidents/${incidentId}`);
      setIncident(updatedIncident);
      await refreshEvents();

      setNewStatus("");
      setStatusMessage("");
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading incident…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className=" bg-[#EDF4ED] text-sm text-black hover:underline border rounded-sm p-1"
      >
        ← Back to Incidents
      </button>

      {/* Header */}
      <div className="bg-[#EDF4ED] border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{incident.title}</h2>
            <p className="text-gray-600">{incident.description}</p>
          </div>

          <span
            className={`text-sm px-3 py-1 rounded ${
              statusColor[incident.status]
            }`}
          >
            {incident.status}
          </span>
        </div>
      </div>
      {/* Update Status */}
      <div className="bg-[#EDF4ED] border rounded-lg p-6">
        <h3 className="font-medium mb-3">Update Status</h3>

        <form onSubmit={handleStatusUpdate} className="space-y-3">
          <select
            className="w-full border rounded px-3 py-2"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select new status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Why are you changing the status?"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
          />

          {statusError && <p className="text-sm text-red-600">{statusError}</p>}

          <button
            type="submit"
            disabled={updatingStatus}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {updatingStatus ? "Updating…" : "Update Status"}
          </button>
        </form>
      </div>
      {/* Add Note */}
      <div className="bg-[#EDF4ED] border rounded-lg p-6">
        <h3 className="font-medium mb-3">Add Note</h3>

        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Add an update or investigation note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {actionError && <p className="text-sm text-red-600">{actionError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {submitting ? "Adding…" : "Add Note"}
          </button>
        </form>
      </div>
      {/* Timeline */}
      <div className="bg-[#EDF4ED] border rounded p-6 max-h-100 overflow-y-auto">
        <h3 className="font-medium mb-4">Timeline</h3>

        <ul className="space-y-4">
          {[...events].reverse().map((e) => (
            <li key={e.id} className="flex gap-4">
              {/* Dot */}
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                <span className="flex-1 w-px bg-gray-300" />
              </div>

              {/* Content */}
              <div>
                {/* Primary line */}
                <p className="text-sm font-medium text-gray-800">
                  {e.actor_name}{" "}
                  {e.event_type === "status_change" && "changed status"}
                  {e.event_type === "note" && "added a note"}
                  {e.event_type === "created" && "created the incident"}
                </p>

                {/* Optional message */}
                {e.message && (
                  <p className="text-sm text-gray-700 mt-1">{e.message}</p>
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(e.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IncidentDetail;
