import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";

/**
 * Converts a raw audit row into a meaningful activity sentence
 */
function getActivityMessage(a) {
  const actor = a.actor_name || "System";

  // Incident-specific audits
  if (a.table_name === "incidents") {
    const title = a.incident_title
      ? `“${a.incident_title}”`
      : "an incident";

    // Incident created
    if (a.action === "INSERT") {
      return `${actor} created incident ${title}`;
    }

    // Incident deleted
    if (a.action === "DELETE") {
      return `${actor} deleted incident ${title}`;
    }

    // Incident updated
    if (
      a.action === "UPDATE" &&
      a.old_values?.status &&
      a.new_values?.status &&
      a.old_values.status !== a.new_values.status
    ) {
      return `${actor} changed status of ${title} from "${a.old_values.status}" to "${a.new_values.status}"`;
    }

    // Fallback incident update
    return `${actor} updated incident ${title}`;
  }

  // Generic fallback for other tables (users, org, etc.)
  const action =
    a.action === "INSERT"
      ? "created"
      : a.action === "DELETE"
      ? "deleted"
      : "updated";

  return `${actor} ${action} ${a.table_name}`;
}

function AuditLogs() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAudits = async () => {
      try {
        const data = await apiFetch("/audits");
        setAudits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAudits();
  }, []);

  if (loading) return <p className="text-gray-600">Loading audit logs…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-[#EDF4ED] rounded-lg border shadow">
      <h2 className="text-lg font-semibold px-4 py-3 border-b">
        Audit Logs
      </h2>

      <ul className="divide-y">
        {audits.map((a) => (
          <li key={a.id} className="px-4 py-3">
            <p className="text-sm text-gray-900">
              {getActivityMessage(a)}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(a.changed_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuditLogs;
