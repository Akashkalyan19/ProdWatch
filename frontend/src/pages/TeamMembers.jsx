import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import MemberCard from "../components/MemberCard";

function TeamMembers() {
  const { user } = useAuth();
  const isOwner = user.role === "owner";

  const [members, setMembers] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [saving, setSaving] = useState(false);

  /* ------------------ data loaders ------------------ */

  const loadMembers = async () => {
    const data = await apiFetch("/org/allMembers");
    setMembers(data);
  };

  const loadJoinCode = async () => {
    if (!isOwner) return;
    const data = await apiFetch("/org/code");
    setJoinCode(data[0]?.join_code || "");
  };

  useEffect(() => {
    loadMembers();
    loadJoinCode();
  }, []); // intentional: page-load fetch only

  /* ------------------ actions ------------------ */

  const assignRole = async (id, role) => {
    await apiFetch(`/org/members/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    loadMembers();
  };

  const updateJoinCode = async () => {
    if (!newCode.trim()) return;

    try {
      setSaving(true);
      const data = await apiFetch("/org/change_Code", {
        method: "PATCH",
        body: JSON.stringify({ join_code: newCode }),
      });
      setJoinCode(data.join_code);
      setNewCode("");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ render ------------------ */

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

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isOwner={isOwner}
            onChangeRole={assignRole}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamMembers;
