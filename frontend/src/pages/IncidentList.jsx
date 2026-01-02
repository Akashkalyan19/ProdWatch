import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import IncidentDetail from "./IncidentDetail";
import { useAuth } from "../context/AuthContext";

const statusBadge = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  mitigated: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchIncidents = async () => {
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

    fetchIncidents();
  }, [token]);

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
  if (incidents.length === 0)
    return <p className="text-gray-600 bg-[#EDF4ED]">No incidents yet.</p>;

  return (
    <div className="bg-[#EDF4ED] rounded-lg shadow border ">
      <h2 className="text-lg font-semibold px-4 py-3 border-b">Incidents</h2>

      <ul className="divide-y bg-[#EDF4ED]">
        {incidents.map((incident) => (
          <li
            key={incident.id}
            onClick={() => setSelectedId(incident.id)}
            className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <p className="font-medium">{incident.title}</p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded ${
                statusBadge[incident.status]
              }`}
            >
              {incident.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidentList;
