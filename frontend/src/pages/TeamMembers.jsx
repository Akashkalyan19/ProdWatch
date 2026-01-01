import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

function TeamMembers() {
  const { user } = useAuth();
  const isOwner = user.role === "owner";
  const [members, setMembers] = useState([]);

  const load = async () => {
    const data = await apiFetch("/org/allMembers");
    setMembers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const assignRole = async (id, role) => {
    await apiFetch(`/org/members/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    load();
  };

  return (
    <div className="bg-white rounded border">
      <h2 className="text-lg font-semibold px-4 py-3 border-b">Team Members</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="px-4 py-2">{m.name}</td>
              <td>{m.email}</td>
              <td>
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {m.role}
                </span>

                {isOwner && m.role === "engineer" && (
                  <button
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={() => assignRole(m.id, "team_lead")}
                  >
                    Promote
                  </button>
                )}

                {isOwner && m.role === "team_lead" && (
                  <button
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={() => assignRole(m.id, "engineer")}
                  >
                    Demote
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamMembers;
