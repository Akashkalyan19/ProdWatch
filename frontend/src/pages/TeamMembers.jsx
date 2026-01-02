import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

function TeamMembers() {
  const { user } = useAuth();
  const isOwner = user.role === "owner";

  const [members, setMembers] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [saving, setSaving] = useState(false);

  const loadMembers = async () => {
    const data = await apiFetch("/org/allMembers");
    setMembers(data);
  };

  const loadJoinCode = async () => {
    if (!isOwner) return;
    const data = await apiFetch("/org/code");
    console.log(data);
    setJoinCode(data[0].join_code);
  };

  useEffect(() => {
    loadMembers();
    loadJoinCode();
  }, []);

  const assignRole = async (id, role) => {
    await apiFetch(`/org/members/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    loadMembers();
  };

  const updateJoinCode = async () => {
    if (!newCode.trim()) return;

    setSaving(true);
    const data = await apiFetch("/org/change_Code", {
      method: "PATCH",
      body: JSON.stringify({ join_code: newCode }),
    });

    setJoinCode(data.join_code);
    setNewCode("");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Owner-only Organization Access */}
      {isOwner && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Organization Access Code
          </h3>

          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-sm font-mono bg-gray-100 rounded">
              {joinCode || "—"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="New 6-digit join code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={updateJoinCode}
              disabled={saving || !newCode.trim()}
              className="text-sm text-indigo-600 hover:underline disabled:text-gray-400"
            >
              {saving ? "Updating…" : "Update"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Members can join your organization using this code.
          </p>
        </div>
      )}

      {/* Members table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold px-4 py-3 border-b">
          Team Members
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{m.name}</td>
                <td className="px-4 py-2 text-gray-600">{m.email}</td>
                <td className="px-4 py-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                    {m.role}
                  </span>

                  {isOwner && m.role === "engineer" && (
                    <button
                      onClick={() => assignRole(m.id, "team_lead")}
                      className="ml-3 text-xs text-indigo-600 hover:underline"
                    >
                      Promote
                    </button>
                  )}

                  {isOwner && m.role === "team_lead" && (
                    <button
                      onClick={() => assignRole(m.id, "engineer")}
                      className="ml-3 text-xs text-indigo-600 hover:underline"
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
    </div>
  );
}

export default TeamMembers;
