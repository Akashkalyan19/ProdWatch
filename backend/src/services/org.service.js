const orgRepo = require("../repositories/org.repo");

const changeCode = async (newCode, user) => {
  if (!newCode) {
    throw new Error("Invalid new code");
  }
  return await orgRepo.changeCode(newCode, user.organization_id);
};
const getAllMembers = async (user) => {
  return await orgRepo.getAllMembers(user.organization_id);
};

const updateMemberRole = async (actor, targetUserId, newRole) => {
  if (!["engineer", "team_lead"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  const targetUser = await orgRepo.getUserById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  if (targetUser.organization_id !== actor.organization_id) {
    throw new Error("Forbidden");
  }

  if (targetUser.role === "owner") {
    throw new Error("Cannot modify owner role");
  }

  return await orgRepo.updateUserRole(targetUserId, newRole);
};
module.exports = {
  changeCode,
  getAllMembers,
  updateMemberRole,
};
