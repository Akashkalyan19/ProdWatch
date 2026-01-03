import React from "react";

function MemberCard({ member, isOwner, onChangeRole }) {
  const { id, name, email, role } = member;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      {/* Member info */}
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{email}</p>
      </div>

      {/* Role + actions */}
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {role}
        </span>

        {isOwner && role === "engineer" && (
          <button
            onClick={() => onChangeRole(id, "team_lead")}
            className="text-xs text-indigo-600 hover:underline"
          >
            Promote
          </button>
        )}

        {isOwner && role === "team_lead" && (
          <button
            onClick={() => onChangeRole(id, "engineer")}
            className="text-xs text-indigo-600 hover:underline"
          >
            Demote
          </button>
        )}
      </div>
    </div>
  );
}

export default MemberCard;
