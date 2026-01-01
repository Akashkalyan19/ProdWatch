import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import IncidentDetail from "./IncidentDetail";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await apiFetch("/incidents");
        setIncidents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  if (selectedId) {
    return (
      <IncidentDetail
        incidentId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p>Error: {error}</p>;
  if (incidents.length === 0) return <p>No incidents yet.</p>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold px-4 py-3 border-b">Incidents</h2>

      <ul>
        {incidents.map((incident) => (
          <li
            key={incident.id}
            onClick={() => setSelectedId(incident.id)}
            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between"
          >
            <span className="font-medium">{incident.title}</span>
            <span className="text-sm text-gray-600">{incident.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidentList;
