import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import IncidentDetail from "./IncidentDetail";
import { useAuth } from "../context/AuthContext";

// status icons
import openIcon from "../assets/open.png";
import investigatingIcon from "../assets/investigating.png";
import mitigatedIcon from "../assets/mitigated.png";
import resolvedIcon from "../assets/resolved.png";

const statusBadge = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  mitigated: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

const statusIcon = {
  open: openIcon,
  investigating: investigatingIcon,
  mitigated: mitigatedIcon,
  resolved: resolvedIcon,
};

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // create incident state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const { token } = useAuth();

  /* ------------------ data loader ------------------ */

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/incidents");
      setIncidents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadIncidents();
  }, [token]);

  /* ------------------ create incident ------------------ */

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      await apiFetch("/incidents", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      setShowForm(false);
      loadIncidents();
    } finally {
      setCreating(false);
    }
  };

  /* ------------------ routing ------------------ */

  if (selectedId) {
    return (
      <IncidentDetail
        incidentId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (loading) return <p className="text-gray-600">Loading incidents…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  /* ------------------ render ------------------ */

  return (
    <div>
      <div className="bg-[#EDF4ED] rounded-lg shadow border mb-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Incidents</h2>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="p-2 bg-[#51291E] text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {showForm ? "Cancel" : "Create Incident"}
          </button>
        </div>

        {/* Create Incident Form */}
        {showForm && (
          <form
            onSubmit={handleCreateIncident}
            className="p-4 space-y-3 border-b bg-white"
          >
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Incident title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="Description "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              disabled={creating}
              className="bg-black text-white px-4 py-2 rounded text-sm"
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </form>
        )}
      </div>
      <div className="bg-[#EDF4ED] border rounded-lg">
        {/* Incident List */}
        {incidents.length === 0 ? (
          <p className="p-4 text-gray-600">No incidents yet.</p>
        ) : (
          <ul className="divide-y bg-[#EDF4ED]">
            {incidents.map((incident) => (
              <li
                key={incident.id}
                onClick={() => setSelectedId(incident.id)}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition"
              >
                <p className="font-medium">{incident.title}</p>

                <span
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    statusBadge[incident.status]
                  }`}
                >
                  <img
                    src={statusIcon[incident.status]}
                    alt={incident.status}
                    className="w-3 h-3"
                  />
                  {incident.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IncidentList;
